//路由主入口
const UserController = require('../controllers/UserController');
module.exports = function (app) {

    app.use('/', (req, res, next) => {
        if(req.url.indexOf('/admin/user/login')>-1){  // 登录不需要认证
            next();
        }else {
            new UserController(req).checkUser(req, res, next); // 认证检查
        }
    });

    app.use('/admin/user', require('./user'));  // 用户
    app.use('/admin/userRole', require('./userRole'));  // 用户角色
    app.use('/admin/role', require('./role')); // 角色
    app.use('/admin/access', require('./access'));   // 权限
    app.use('/admin/roleAccess', require('./roleAccess'));   // 角色权限
    app.use('/admin/log', require('./log'));   // 日志
    app.use('/admin/coupon', require('./coupon')); // 优惠券活动

    // not found 404 page
    app.use(function (req, res, next) {
        if (!res.headersSent) {
            res.json({code: 500, msg: '无效的接口地址'});
        }
    });
};
