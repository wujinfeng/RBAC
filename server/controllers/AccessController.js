/**
 * Created by
 */
const BaseController = require('./BaseController');
const AccessModel = require('../models/AccessModel');
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
        this.access = new AccessModel();
    }

    //预付费列表
    list(req, res, next) {
        let self = this;
        let name = req.query.name ? req.query.name.trim() : '';
        let params = {};
        if (name) {
            params.name = name;
        }
        let page = parseInt(req.query.currentPage || 1);
        let pageSize = parseInt(req.query.pageSize || 10);
        self.access.accessList(params, page, pageSize, (err, row, count) => {
            if (err) {
                logger.error(err);
                res.json({code: 500, msg: err, data: []});
            } else {
                console.log(row, count)
                res.json({code: 200, msg: '', data: {tableData: row, totalNum: count}});
            }
        });
    }

    add(req, res) {
        console.log(req.body);
        let self = this;
        let data = placeUserData(req.body);
        data.operatorId = req.user.id;
        self.access.add(data, (err) => {
            if (err) {
                logger.error('添加出错');
                logger.error(err);
                res.json({code: 500, msg: err});
            } else {
                res.json({code: 200, msg: '添加成功'});
            }
        });
    }

    authStatus(req, res) {
        let self = this;
        let id = req.query.id;
        let status = req.query.status;
        if (!id || !status) {
            return res.json({code: 400, msg: '参数错误'});
        }
        status = (status === 'pass') ? 1 : 5;
        let operatorId = req.user.id;
        let params = {status: status, operatorId: operatorId};
        self.access.authStatus(id, params, (err) => {
            if (err) {
                logger.error(err);
                res.json({code: 500, msg: err});
            } else {
                res.json({code: 200, msg: ''});
            }
        });
    }

    orgName(req, res) {
        let self = this;
        let name = req.params.name;
        self.access.orgName(name, (err, row) => {
            if (err) {
                logger.error(err);
                res.json({code: 500, msg: err, data: []});
            } else {
                res.json({code: 200, msg: '', data: row});
            }
        });
    }

}

function placeUserData(body) {
    let data = {};
    if (body.userId) {
        data.userId = body.userId
    }
    if (body.income) {
        data.income = Math.round(Number(body.income)*100)
    }
    if (body.rechargeTime) {
        data.rechargeTime = moment(body.rechargeTime).format('YYYY-MM-DD HH:mm:ss');
    }
    if (body.status) {
        data.status = body.status
    }

    return data;
}


module.exports = Controller;


