/**
 * 用户角色控制器
 */
const BaseController = require('./BaseController');
const UserRole = require('../models/UserRoleModel');
const comm = require('../middlewares/comm');
let config = require('../config/config').getInstance().config;
const logger = config.logger;

class UserRoleController extends BaseController {
    /**
     * 构造
     * @param req
     */
    constructor(req) {
        super(req);
        this.userRole = new UserRole();
    }

    // 分页查询列表
    list(req, res, next) {
        let self = this;
        let username = req.query.username ? req.query.username.trim() : '';
        let roleName = req.query.roleName ? req.query.roleName.trim() : '';
        let params = {};
        if (username) {
            params.username = username;
        }
        if (roleName) {
            params.roleName = roleName;
        }
        let page = parseInt(req.query.currentPage || 1);
        let pageSize = parseInt(req.query.pageSize || 10);
        self.userRole.list(params, page, pageSize, (err, row, count) => {
            if (err) {
                logger.error(err);
                res.json({code: 500, msg: err, data: []});
            } else {
                res.json({code: 200, msg: '', data: {tableData: row, totalNum: count}});
            }
        });
    }

    add(req, res) {
        let self = this;
        let data = reqData(req.body);
        console.log(data)
        self.userRole.add(data, (err) => {
            if (err) {
                logger.error('保存出错');
                logger.error(err);
                res.json({code: 500, msg: err});
            } else {
                res.json({code: 200, msg: '保存成功'});
            }
        });
    }

    del(req, res) {
        let self = this;
        let data = reqData(req.query);
        console.log(data)
        self.userRole.del(data, function (err) {
            if (err) {
                logger.error('删除出错');
                logger.error(err);
                res.json({code: 500, msg: err});
            } else {
                res.json({code: 200, msg: ''});
            }
        });
    }


}

function reqData(body) {
    let data = {};
    data.userId = body.userId;
    data.roleId = body.roleId;
    return data;
}


module.exports = UserRoleController;

