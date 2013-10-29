/**
 * HTTP server.
 *
 * @package backpack
 * @author Andrew Sliwinski <andrew@diy.org>
 */

/**
 * Dependencies
 */
var ecstatic    = require('ecstatic'),
    http        = require('http'),
    url         = require('url');

var log         = require('./log.js'),
    search      = require('./search.js');

/**
 * Export
 */
module.exports = function () {
    // Configure
    var server = http.createServer(function (req, res) {
        // Log request
        log.info({req: req});

        // Dynamic route handler
        var handler = function (err) {
            var uri         = url.parse(req.url, true);
            var pathname    = uri.pathname;
            var query       = uri.query.q;
            
            // Handle 404s
            if (pathname !== '/search') {
                res.writeHead(404);
                return res.end();
            }

            // Return the search results
            res.writeHead(200, {'content-type': 'application/json'});
            res.end(JSON.stringify(search(query)) + '\n');
        };

        // Static asset handler
        ecstatic({ 
            root:           __dirname + '/../public',
            cache:          (process.env.NODE_ENV === 'production') ? 3600 : 0,
            autoIndex:      true,
            defaultExt:     'html',
            handleError:    false
        })(req, res, handler);
    });

    // Listen
    var port = process.env.PORT || 3333;
    server.listen(port);
    log.info('Process listening on port %s', port);
};