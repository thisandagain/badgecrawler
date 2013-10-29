/**
 * Code governance using jshint.
 *
 * @package backpack
 * @author Andrew Sliwinski <andrew@diy.org>
 */

/**
 * Dependencies
 */
var hint    = require('hint-hint');

/**
 * Execute
 */
hint(__dirname + '/../../!(node_modules)**/*.js', {
    "bitwise": true,
    "devel": true,
    "eqeqeq": true,
    "immed": true,
    "latedef": true,
    "maxdepth": 2,
    "maxparams": 3,
    "newcap": true,
    "noarg": true,
    "node": true,
    "proto": true,
    "quotmark": "single",
    "undef": true,
    "unused": true,
    "maxlen": 80
});