/**
 * Creates a JSON index of the badges table by parsing assertions. This is slow,
 * clunky and completely stupid. IRL, would be replaced by a continuous search 
 * index worker process(s).
 *
 * @package backpack
 * @author Andrew Sliwinski <andrew@diy.org>
 */

/**
 * Dependencies
 */
var fs          = require('fs'),
    request     = require('request'),
    mysql       = require('mysql');

var log         = require('../../lib/log.js'),
    path        = __dirname + '/../../lib/badges.json';

/**
 * Fetch JSON at specified URI.
 *
 * @param {string} URI
 *
 * @return {object}
 */
function fetch (uri, callback) {
    request({
        method: 'GET',
        uri:    uri,
        json:   {}
    }, function (err, response, body) {
        callback(err, body);
    });
}

/**
 * Fetches the entire set of assertion + badge data and returns badge object
 * if parsing is successful.
 *
 * @param {string} URI to assertion
 *
 * @return {object}
 */
function set (uri, callback) {
    // Generic parsing error message
    var e = 'Invalid assertion schema.';

    // Fetch assertion
    fetch(uri, function (err, assertion) {
        if (err) return callback(err);

        // Parse assertion
        if (typeof assertion.badge !== 'string') return callback(e);
        if (typeof assertion.recipient === 'undefined') return callback(e);

        // Fetch badge
        fetch(assertion.badge, function (err, badge) {
            if (err) return callback(err);

            // Parse badge
            if (typeof badge.name === 'undefined') return callback(e);
            if (typeof badge.description === 'undefined') return callback(e);
            if (typeof badge.image === 'undefined') return callback(e);
            if (typeof badge.tags === 'undefined') return callback(e);

            // Return
            callback(null, badge);
        });
    });
}

/**
 * Processing queue
 */
function processRow (item, callback) {
    set(item.endpoint, function (err, badge) {
        // Log issue and continue
        if (err) {
            log.warn(err);
            return callback(null);
        }

        // Append to file
        log.info('Indexed: %s', badge.name);
        fs.appendFile(path, JSON.stringify(badge) + '\n', callback);
    });
}

/**
 * Purge ./lib/badges.json
 */
fs.writeFileSync(__dirname + '/../../lib/badges.json', '');

/**
 * Stream items from DB and push to queue
 */
var db      = mysql.createConnection({
    host:       'localhost',
    user:       'badgemaker',
    password:   'secret',
    database:   'openbadges'
});
var query   = db.query('SELECT id, endpoint FROM badge ORDER BY id DESC');

query.on('error', function (e) {
    log.fatal(e);
    process.exit(1);
});

query.on('result', function (row) {
    db.pause();

    processRow(row, function() {
        db.resume();
    });
});

query.on('end', function () {
    log.info('Done!');
    process.exit(0);
});
