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
        let menuName = req.query.menuName ? req.query.menuName.trim() : '';
        let type = req.query.type || '1';
        console.log(typeof(type))
        let params = {};
        if (name) {
            params.name = name;
        }
        if (menuName) {
            params.menuName = menuName;
        }
        params.table = (type === '1') ? 'menu' : 'element';
        let page = parseInt(req.query.currentPage || 1);
        let pageSize = parseInt(req.query.pageSize || 10);
        self.access.list(params, page, pageSize, (err, row, count) => {
            if (err) {
                logger.error(err);
                res.json({code: 500, msg: err, data: []});
            } else {
                console.log(row, count)
                res.json({code: 200, msg: '', data: {tableData: row, totalNum: count}});
            }
        });
    }

}



module.exports = Controller;


