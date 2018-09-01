/**
 * 角色权限管理
 */
const comm = require('../middlewares/comm');
const BaseController = require('./BaseController');
const RoleAccessModel = require('../models/RoleAccessModel');
let config = require('../config/config').getInstance().config;
const logger = config.logger;

class RoleAccessController extends BaseController {
    /**
     * 构造
     * @param req
     */
    constructor(req) {
        super(req);
        this.roleAccess = new RoleAccessModel();
    }

    list(req, res) {
        let self = this;
        let name = req.query.name ? req.query.name.trim() : '';
        let params = {};
        if (name) {
            params.name = name;
        }
        let page = parseInt(req.query.currentPage || 1);
        let pageSize = parseInt(req.query.pageSize || 10);
        self.roleAccess.list(params, page, pageSize, (err, data, count) => {
            if (err) {
                logger.error(err);
                res.json({code: 500, msg: err, data: []});
            } else {
                console.log(data);
                // 整合每个角色下所有的权限
                let arr = comm.roleAllAccess(data);
                console.log('arr', arr);
                // 选出每个角色下实际存在的权限进行树形结构
                let row = comm.realAccessToTree(arr);
                console.log('arr2', JSON.stringify(row))
                res.json({code: 200, msg: '', data: {tableData: row, totalNum: count}});
            }
        });
    }

    getMenu(req, res) {
        let self = this;
        let roleId = req.query.roleId;
        if (!roleId) {
            return res.json({code: 400, msg: 'roleId not found', data: []});
        }
        self.roleAccess.getMenu(roleId, (err, data) => {
            if (err) {
                logger.error(err);
                res.json({code: 500, msg: err, data: []});
            } else {
                res.json({code: 200, msg: '', data: data});
            }
        });
    }

    getEle(req, res) {
        let self = this;
        let roleId = req.query.roleId;
        if (!roleId) {
            return res.json({code: 400, msg: 'roleId not found', data: []});
        }
        self.roleAccess.getEle(roleId, (err, data) => {
            if (err) {
                logger.error(err);
                res.json({code: 500, msg: err, data: []});
            } else {
                res.json({code: 200, msg: '', data: data});
            }
        });
    }

    add(req, res) {
        console.log(req.body)
        let self = this;
        let roleId = req.body.roleId||'';
        let type = req.body.type || '';
        let accessArr = req.body.accessArr||[];
        if(!roleId || !type || accessArr.length<1){
           return res.json({code: 400, msg: 'params err'});
        }
        let params = {
            roleId: roleId,
            type: type,
            accessArr: accessArr
        };
        self.roleAccess.add(params, (err) => {
            if (err) {
                logger.error('添加出错');
                logger.error(err);
                res.json({code: 500, msg: err});
            } else {
                res.json({code: 200, msg: '添加成功'});
            }
        });
    }

}

module.exports = RoleAccessController;
