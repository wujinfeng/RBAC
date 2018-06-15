/**
 * 健康检查类
 * Created by fu_gh on 2018-04-11 15:46
 */
const async = require('async');
const config = require('./config/config.js').getInstance().config;
const terminus = require('@godaddy/terminus');
const comm = require('./middlewares/comm');

class Health {

    /**
     * 检查mysql
     * @returns {Promise}
     */
    checkMysql() {
        return new Promise((resolve, reject) => {
            async.auto({
                pool: cb => {
                    comm.getPoolSer(config.baseDb, cb);
                },
                connect: ['pool', (results, cb) => {
                    results.pool.getConnection((err, conn) => {
                        if (!err && conn) {
                            conn.release();
                        }
                        cb(err);
                    });
                }]
            }, (err) => {
                if (err) {
                    config.logger.info('healthcheck mysql err',err);
                    reject(err);
                } else {
                    resolve('ok');
                }
            });
        });
    }

    /**
     * 检查
     * @returns {Promise.<*[]>}
     */
    check() {
        return Promise.all([this.checkMysql()]);
    }
}

function onSignal() {
    console.log('server is starting cleanup');
    // start cleanup of resource, like databases or file descriptors
}

async function onHealthCheck() {
     let health = new Health();
     return health.check();
}


module.exports.check = (server)=> {
    terminus(server, {
        signal: 'SIGINT',
        healthChecks: {
            '/healthcheck': onHealthCheck,
        },
        onSignal
    });
}