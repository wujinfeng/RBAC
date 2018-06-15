let config = require('../config/config').getInstance().config;
let logger = config.logger;

let mysql = require('mysql');
let poo1 = mysql.createPool({
    host: config.mysql1.host,
    port: config.mysql1.port,
    user: config.mysql1.user,
    password: config.mysql1.password
});

//尝试连接是否成功
poo1.getConnection(function (err, connection) {
    if (err) {
        console.log('connect mysql err');
        console.log(err);
        logger.log(err);
        process.exit(1);
        return;
    }
    console.log('connect mysql ok.');
    connection.release();
});

module.exports = {
    'mysql1': poo1
}