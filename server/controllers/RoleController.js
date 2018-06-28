/**
 * 角色管理
 */
const BaseController = require('./BaseController');
const RoleModel = require('../models/RoleModel');
let config = require('../config/config').getInstance().config;
const logger = config.logger;

class RoleController extends BaseController {
    /**
     * 构造
     * @param req
     */
    constructor(req) {
        super(req);
        this.role = new RoleModel();
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
        self.role.list(params, page, pageSize, (err, data, count) => {
            if (err) {
                logger.error(err);
                res.json({code: 500, msg: err, data: []});
            } else {
                res.json({code: 200, msg: '', data: {tableData: data, totalNum: count}});
            }
        });
    }

    getAll(req, res) {
        let self = this;
        self.role.getAll((err, data) => {
            if (err) {
                logger.error(err);
                res.json({code: 500, msg: err, data: []});
            } else {
                res.json({code: 200, msg: '', data: data});
            }
        });
    }

    getRoleById(req, res) {
        let self = this;
        let id = req.params.id ? req.params.id.trim() : '';
        if (!id) {
            return res.json({code: 400, msg: 'id not found', data: []});
        }
        self.role.getRoleById(id, (err, data) => {
            if (err) {
                logger.error(err);
                res.json({code: 500, msg: err, data: []});
            } else {
                res.json({code: 200, msg: '', data: data});
            }
        });
    }

    // 名字模糊查询
    getRoleByName(req, res) {
        let self = this;
        let name = req.params.name ? req.params.name.trim() : '';
        if (!name) {
            return res.json({code: 400, msg: 'id not found', data: []});
        }
        self.role.getRoleByName(name, (err, data) => {
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
        self.role.add(data, (err) => {
            if (err) {
                logger.error('添加出错');
                logger.error(err);
                res.json({code: 500, msg: err});
            } else {
                res.json({code: 200, msg: '添加成功'});
            }
        });
    }

    edit(req, res) {
        let self = this;
        let id = req.body.id;
        let data = bodyData(req.body);
        self.role.edit(id, data, (err) => {
            if (err) {
                logger.error('编辑出错');
                logger.error(err);
                res.json({code: 500, msg: err});
            } else {
                res.json({code: 200, msg: ''});
            }
        });
    }

    del(req, res) {
        let self = this;
        let id = req.params.id;
        if (!id) {
            return res.json({code: 400, msg: 'not found params'});
        }
        self.role.del(id, (err) => {
            if (err) {
                logger.error('出错');
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
    if (body.name && body.name.trim()) {
        data.name = body.name.trim()
    }
    if (body.status) {
        data.status = body.status
    }
    return data;
}

module.exports = RoleController;
