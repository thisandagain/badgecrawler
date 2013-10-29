/**
 * Search provider.
 *
 * @package backpack
 * @author Andrew Sliwinski <andrew@diy.org>
 */

/**
 * Dependencies
 */
var es      = require('event-stream'),
    fs      = require('fs'),
    lunr    = require('lunr');

/**
 * Constructor
 */
function Search () {
    var self = this;

    // Define storage hash
    // @note LULZ. Yes... keeping everything in memory. 'Cause prototype.
    self.storage = Object.create(null);

    // Define search index
    self.index = lunr(function () {
        this.field('name', 10);
        this.field('description', 1);
        this.field('tags', 10);
        this.ref('name');
    });

    // Stream from badges.json & populate index
    fs.createReadStream(__dirname + '/badges.json')
        .pipe(es.split())
        .pipe(es.mapSync(function (data) {
            // Strip empty lines
            if (data === '') return;

            // Parse & add to storage / index
            var blob = JSON.parse(data);
            self.storage[blob.name] = blob;
            self.index.add(blob);
        }));

    // Public search interface (sync)
    return function (query) {
        // Response storage array
        var body = [];
        
        // Execute search
        var results = self.index.search(query);

        // Iterate over search results & build up full response body
        results.forEach(function (row) {
            var ref = row.ref;
            var item = self.storage[ref];
            body.push(item);
        });

        return body;
    };
}

/**
 * Export
 */
module.exports = new Search();