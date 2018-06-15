/**
 * 景区管理
 */
const BaseController = require('./BaseController');
const LogModel = require('../models/LogModel');
const moment = require('moment');
let config = require('../config/config').getInstance().config;
const logger = config.logger;

class LogController extends BaseController {
    /**
     * 构造
     * @param req
     */
    constructor(req) {
        super(req);
        this.log = new LogModel();
    }

    list(req, res) {
        let self = this;
        let sourceName = req.query.sourceName ? req.query.sourceName.trim() : '';
        let logId = req.query.logId ? req.query.logId.trim() : '';
        let params = {};
        if (sourceName) {
            params.sourceName = sourceName;
        }
        if (logId) {
            params.logId = logId;
        }
        let page = parseInt(req.query.currentPage || 1);
        let pageSize = parseInt(req.query.pageSize || 10);
        self.log.list(params, page, pageSize, (err, data, count) => {
            if (err) {
                res.json({code: 500, msg: err, data: []});
            } else {
                res.json({code: 200, msg: '', data: {tableData: data, totalNum: count}});
            }
        });
    }

    getlogById(req, res) {
        let self = this;
        let logId = req.query.logId ? req.query.logId.trim() : '';
        if(!logId){
            return res.json({code: 400, msg: 'no logId', data: []});
        }
        self.log.getlogById(logId, (err, data) => {
            if (err) {
                logger.error(err);
                res.json({code: 500, msg: err, data: []});
            } else {
                res.json({code: 200, msg: 'ok', data: data});
            }
        });
    }

    checkName(req, res) {
        let self = this;
        let name = req.query.name ? req.query.name.trim() : '';
        let pageStatus = req.query.pageStatus;
        let id = req.query.id || '';
        let placeId = req.query.placeId || '';
        if (!name || !pageStatus || !placeId) {
            return res.json({code: 400, msg: '缺少参数'});
        }
        let params = {id: id, name: name, pageStatus: pageStatus, placeId: placeId};
        self.log.checkName(params, (err, result) => {
            if (err) {
                logger.error(err);
                res.json({code: 500, msg: err});
            } else {
                if (result.length > 0) {
                    return res.json({code: 500, msg: '已经存在'});
                }
                res.json({code: 200, msg: ''});
            }
        });
    }

    add(req, res) {
        let self = this;
        let data = bodyData(req.body);
        let userId = req.body.userId;
        data.operatorId = req.user.id;
        let logId = '' + moment().format('YYMMDDHHmmss') + userId + (Math.random().toString().substr(-2, 2));
        data.id = logId;
        console.log(data);
        self.log.add(data, (err) => {
            if (err) {
                logger.error('添加分类出错');
                logger.error(err);
                res.json({code: 500, msg: err});
            } else {
                res.json({code: 200, msg: '添加分类成功'});
            }
        });
    }

    edit(req, res) {
        let self = this;
        let id = req.body.id;
        let data = bodyData(req.body);
        data.operatorId = req.user.id;
        console.log(data);
        self.log.edit(id, data, (err) => {
            if (err) {
                logger.error('编辑分类出错');
                logger.error(err);
                res.json({code: 500, msg: err});
            } else {
                res.json({code: 200, msg: ''});
            }
        });
    }

    logPass(req, res) {
        let self = this;
        let data = {};
        let logId = req.query.logId;
        data.enterTime = new Date();
        data.operatorId = req.user.id;
        console.log(data);
        self.log.edit(logId, data, (err) => {
            if (err) {
                logger.error('编辑分类出错');
                logger.error(err);
                res.json({code: 500, msg: err});
            } else {
                res.json({code: 200, msg: ''});
            }
        });
    }

    income(req, res) {
        let self = this;
        let time = req.query.createAt || [];
        let placeId = req.query.placeId;
        let params = {};
        if (placeId) {
            params.placeId = placeId;
        }
        if (time.length > 0) {
            params.start = moment(time[0]).format('YYYY-MM-DD 00:00:00');
            params.end = moment(time[1]).format('YYYY-MM-DD 23:59:59');
        }
        self.log.income(params, (err, data) => {
            if (err) {
                logger.error('出错');
                logger.error(err);
                res.json({code: 500, msg: err});
            } else {
                res.json({code: 200, msg: '', data: data});
            }
        });
    }

    people(req, res) {
        let self = this;
        let time = req.query.createAt || [];
        let placeId = req.query.placeId;
        let params = {};
        if (placeId) {
            params.placeId = placeId;
        }
        if (time.length > 0) {
            params.start = moment(time[0]).format('YYYY-MM-DD 00:00:00');
            params.end = moment(time[1]).format('YYYY-MM-DD 23:59:59');
        }
        self.log.people(params, (err, data) => {
            if (err) {
                logger.error('出错');
                logger.error(err);
                res.json({code: 500, msg: err});
            } else {
                res.json({code: 200, msg: '', data: data});
            }
        });
    }

    merchant(req, res) {
        let self = this;
        let time = req.query.createAt || [];
        let userId = req.query.userId;
        let params = {};
        if (userId) {
            params.userId = userId;
        }
        if (time.length > 0) {
            params.start = moment(time[0]).format('YYYY-MM-DD 00:00:00');
            params.end = moment(time[1]).format('YYYY-MM-DD 23:59:59');
        }
        self.log.merchant(params, (err, data) => {
            if (err) {
                logger.error('出错');
                logger.error(err);
                res.json({code: 500, msg: err});
            } else {
                res.json({code: 200, msg: '', data: data});
            }
        });
    }
}

function bodyData(body) {
    let data = {};

    if (body.userId) {
        data.userId = body.userId
    }
    if (body.placeId) {
        data.placeId = body.placeId
    }
    if (body.reserveDate) {
        data.reserveDate = new Date(body.reserveDate)
    }

    if (body.mark && body.mark.trim()) {
        data.mark = body.mark.trim()
    }
    if (body.payWay) {
        data.payWay = body.payWay
    }
    data.payStatus = 10; // 支付成功
    data.type = 2;  // 线下购买
    data.ticketType = 1;  // 团体票
    let totalPrice = Math.round(Number(body.totalPrice) * 100);

    data.totalPrice = totalPrice;
    data.actualFee = totalPrice;
    data.unit = Math.round(Number(body.unit) * 100);
    data.number = body.number;

    return data;
}

module.exports = LogController;
