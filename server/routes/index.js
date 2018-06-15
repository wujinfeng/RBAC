//路由主入口
module.exports = function (app) {

    app.use('/admin/user', require('./user'));  // 用户
    app.use('/admin/role', require('./role')); // 角色
    app.use('/admin/access', require('./access'));   // 权限
    app.use('/admin/log', require('./log'));   // 日志
    app.use('/admin/coupon', require('./coupon')); // 优惠券活动

    // not found 404 page
    app.use(function (req, res, next) {
        if (!res.headersSent) {
            res.json({code: 500, msg: '无效的接口地址'});
        }
    });
};
