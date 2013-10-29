/**
 * Client-side javascript entry point (browserified).
 *
 * @package backpack
 * @author Andrew Sliwinski <andrew@diy.org>
 */

/**
 * Dependencies
 */
var ready       = require('domready');
var search      = require('./lib/search.js');

/**
 * On DOM ready
 */
ready(function () {
    // Init search view
    search(document, {
        limit:      12,
        preload:    'mozfest'
    });
});