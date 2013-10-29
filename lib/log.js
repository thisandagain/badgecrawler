/**
 * Bunyan log adapter.
 *
 * @package backpack
 * @author Andrew Sliwinski <andrew@diy.org>
 */

/**
 * Dependencies
 */
var bunyan  = require('bunyan');

/**
 * Export
 */
module.exports = bunyan.createLogger({
    name: 'explore',
    serializers: {
        req: bunyan.stdSerializers.req
    }
});