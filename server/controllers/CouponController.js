/**
 * Created by
 */
const BaseController = require('./BaseController');
const CouponModel = require('../models/CouponModel');
let config = require('../config/config').getInstance().config;
const moment = require('moment');
const logger = config.logger;

class Controller extends BaseController {
    /**
     * 构造
     * @param req
     */
    constructor(req) {
        super(req);
        this.coupon = new CouponModel();
    }

    // 列表
    list(req, res, next) {
        let self = this;
        let couponId = req.query.couponId ? req.query.couponId.trim() : '';
        let name = req.query.name ? req.query.name.trim() : '';
        let params = {};
        if (name) {
            params.name = name;
        }
        if (couponId) {
            params.couponId = couponId;
        }
        console.log(params)
        let page = parseInt(req.query.currentPage || 1);
        let pageSize = parseInt(req.query.pageSize || 10);
        self.coupon.list(params, page, pageSize, (err, row, count) => {
            if (err) {
                logger.error(err);
                res.json({code: 500, msg: err, data: []});
            } else {
                console.log(row, count)
                res.json({code: 200, msg: '', data: {tableData: row, totalNum: count}});
            }
        });
    }

    // 用户参与优惠活动列表
    userCouponlist(req, res, next) {
        console.log('userCouponlist')
        let self = this;
        let mobile = req.query.mobile ? req.query.mobile.trim() : '';
        let name = req.query.name ? req.query.name.trim() : '';
        let params = {};
        if (name) {
            params.name = name;
        }
        if (mobile) {
            params.mobile = mobile;
        }
        console.log('params',params)
        let page = parseInt(req.query.currentPage || 1);
        let pageSize = parseInt(req.query.pageSize || 10);
        self.coupon.userCouponlist(params, page, pageSize, (err, row, count) => {
            if (err) {
                logger.error(err);
                res.json({code: 500, msg: err, data: {}});
            } else {
                res.json({code: 200, msg: '', data: {tableData: row, totalNum: count}});
            }
        });
    }

    // 添加
    add(req, res) {
        console.log(req.body);
        let self = this;
        let data = bodyData(req.body);
        data.id = new Date().getTime();
        data.operatorId = req.user.id;
        self.coupon.add(data, (err) => {
            if (err) {
                logger.error('添加出错');
                logger.error(err);
                res.json({code: 500, msg: err});
            } else {
                res.json({code: 200, msg: '添加成功'});
            }
        });
    }
    // 编辑
    edit(req, res) {
        let self = this;
        let id = req.body.id;
        let data = bodyData(req.body);
        data.operatorId = req.user.id;
        console.log(data);
        self.coupon.edit(id, data, (err) => {
            if (err) {
                logger.error('编辑分类出错');
                logger.error(err);
                res.json({code: 500, msg: err});
            } else {
                res.json({code: 200, msg: ''});
            }
        });
    }
}

function bodyData(body) {
    let data = {};
    data.name = body.name;
    data.introduce = body.introduce;
    data.money = Math.round(Number(body.money)*100);

    if (body.startTime) {
        data.startTime = moment(body.startTime).format('YYYY-MM-DD HH:mm:ss');
    }
    if (body.endTime) {
        data.endTime = moment(body.endTime).format('YYYY-MM-DD HH:mm:ss');
    }
    data.status = body.status;
    return data;
}


module.exports = Controller;


