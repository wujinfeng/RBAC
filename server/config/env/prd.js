
const path = require('path');

module.exports = {
    port: 3001,                          // 程序运行的端口
    proxy: 'loopback, 127.0.0.1',        //信任的代理ip
    debug: false,                         // debug 为 true 时，用于本地调试，具体错误展示
    tokenSecret: 'shhdfd-hhhhardfedsecsdds-infeng',
    mysql1: {
        host: '172.16.1.90',
        user: 'zxbike',
        port: 3306,
        password: 'Zxbike#2017.com',
        database: ''
    },
    baseDb: 'ticket',
    db: {
        'ticket': 'mysql1',
    },
    upload: {
        path: path.join(__dirname, '../../public'),
        url: 'http://tick.zxbike.cn',
        rootPath: '/upload/',
        fileLimit: '10 * 1024 * 1024',  //10MB
        fileMaxCount: 10
    }
};
