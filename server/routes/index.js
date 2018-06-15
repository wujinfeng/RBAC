//路由主入口
module.exports = function (app) {

    app.use('/admin/place', require('./place'));  // 景区
    app.use('/admin/category', require('./category')); // 票分类
    app.use('/admin/user', require('./user'));   // 用户
    app.use('/admin/prepay', require('./prepay'));   // 用户
    app.use('/admin/billing', require('./billing')); // 计费模板
    app.use('/admin/order', require('./order')); // 订单
    app.use('/admin/statistics', require('./statistics')); // 统计
    app.use('/admin/coupon', require('./coupon')); // 优惠券活动

    // not found 404 page
    app.use(function (req, res, next) {
        if (!res.headersSent) {
            res.send({code: 500, msg: '无效的接口地址',});
        }
    });
};
