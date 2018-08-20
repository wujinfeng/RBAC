/**
 * 角色权限管理
 */
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
                let roleArr = [];
                for(let i=0; i<data.length; i++){
                    let obj = {};
                    obj.roleName = data[i].roleName;
                    if(obj.parentId === 0){

                    }
                }

                res.json({code: 200, msg: '', data: {tableData: data, totalNum: count}});
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
        let data = bodyData(req.body);
        self.roleAccess.add(data, (err) => {
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

function bodyData(body) {
    let data = {};
    if (body.name && body.name.trim()) {
        data.name = body.name.trim()
    }
    if (body.status) {
        data.status = body.status
    }
    return data;
}

module.exports = RoleAccessController;
