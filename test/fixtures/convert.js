/**
 * Converts CSOL badges to a normalized format (array of badges).
 *
 * @package backpack
 * @author Andrew Sliwinski <andrew@diy.org>
 */

/**
 * Dependencies
 */
var fs      = require('fs');
var source  = __dirname + '/../../lib/chicago.json';
var target  = __dirname + '/../../lib/badges.json';

/**
 * Read CSOL data
 */
var body    = JSON.parse(fs.readFileSync(source));

// Iterate
for (var item in body) {
    fs.appendFileSync(target, JSON.stringify(body[item]) + '\n');
}