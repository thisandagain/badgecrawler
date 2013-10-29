/**
 * HTTP cluster.
 *
 * @package backpack
 * @author Andrew Sliwinski <andrew@diy.org>
 */

/**
 * Dependencies
 */
var cluster     = require('cluster'),
    http        = require('http'),
    os          = require('os');

var log         = require('./lib/log.js'),
    server      = require('./lib/server.js');

/**
 * Cluster configuration
 */
if (cluster.isWorker) return server();
for (var i = 0; i < os.cpus().length; i++) {
    cluster.fork();
}

cluster.on('exit', function (worker, code, signal) {
    log.error('Worker %s died with code %s', worker.process.pid, code);
    cluster.fork();
});

/**
 * Error handler
 */
process.on('uncaughtException', function (err) {
    log.fatal(err);
    process.exit(err);
});