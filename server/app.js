const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
let config = require('./config/config').getInstance().config;
let logg = config.logger;
//const cors = require('cors');
const moment = require('moment');
const comm = require('./middlewares/comm');
const jwt = require('express-jwt');

const routes = require('./routes/index');

const http = require('http');
const healthCheck = require('./healthCheck');

const app = express();
app.set('env', config.debug ? 'development' : 'production');
app.set('port', process.env.PORT || config.port);
app.set('trust proxy', config.proxy); 		// 指定子网和 IP 地址
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//模板需要的函数 （加入时间模块，秒格式化）
app.locals.moment = moment;
app.locals.second2Time = comm.second2Time;

// 添加模板必需的变量
app.use(function (req, res, next) {
    res.locals.user = '';
    res.locals.menus = {};
    next();
});

//app.use(cors());
app.use(jwt({secret: config.tokenSecret})
    .unless({path: ['/', '/admin/user/login']}));

routes(app);

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    logg.error(err);
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500);
    if (err.name === 'UnauthorizedError') {
        res.status(401);
    }
    if (config.debug) {
        res.json({code: 500, msg: err.message});
    } else {
        res.json({code: 400, msg: err.message});
    }
});

/* istanbul ignore next */
if (!module.parent) {
    const server = http.createServer(app);
    healthCheck.check(server);
    server.listen(config.port, function () {
        console.log('listening on port: ' + config.port);
    });
}

module.exports = app;
