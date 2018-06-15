/**
 * Created by
 */
const jwt = require('jsonwebtoken');
const path = require('path');
const BaseController = require('./BaseController');
const UserModel = require('../models/UserModel');
const comm = require('../middlewares/comm');
let config = require('../config/config').getInstance().config;
const logger = config.logger;

class UserController extends BaseController {
    /**
     * 构造
     * @param req
     */
    constructor(req) {
        super(req);
        this.userModel = new UserModel();
    }

    login(req, res, next) {
        let self = this;
        let mobile = req.body.mobile;
        let password = req.body.password;
        if (!mobile || !password) {
            return res.json({code: 400, msg: '请填写手机号和密码'});
        }
        password = comm.md5(comm.md5('' + mobile + password));
        self.userModel.login(mobile, password, (err, row) => {
            if (err) {
                logger.error(err);
                return res.json({code: 500, msg: err});
            }
            if (row.length > 0) {
                logger.info('登录mobile:' + mobile);
                let doc = row[0];
                let userinfo = {id: doc.id, name: doc.name, mobile: doc.mobile, role: doc.role, time:new Date().getTime()};
                userinfo.token = jwt.sign(userinfo, config.tokenSecret);
                return res.json({code: 200, msg: '登录成功', data: userinfo});
            }
            res.json({code: 400, msg: '请填写正确手机号和密码'});
        });
    }

    // 景区用户
    placeUserList(req, res, next) {
        let self = this;
        let name = req.query.name ? req.query.name.trim() : '';
        let params = {};
        if (name) {
            params.name = name;
        }
        let page = parseInt(req.query.currentPage || 1);
        let pageSize = parseInt(req.query.pageSize || 10);
        self.userModel.placeUserList(params, page, pageSize, (err, row, count) => {
            if (err) {
                logger.error(err);
                res.json({code: 500, msg: err, data: []});
            } else {
                res.json({code: 200, msg: '', data: {tableData: row, totalNum: count}});
            }
        });
    }

    // 旅行社用户
    travelUserList(req, res, next) {
        let self = this;
        let name = req.query.name ? req.query.name.trim() : '';
        let params = {};
        if (name) {
            params.name = name;
        }
        let page = parseInt(req.query.currentPage || 1);
        let pageSize = parseInt(req.query.pageSize || 10);
        self.userModel.travelUserList(params, page, pageSize, (err, row, count) => {
            if (err) {
                logger.error(err);
                res.json({code: 500, msg: err, data: []});
            } else {
                console.log(row, count)
                res.json({code: 200, msg: '', data: {tableData: row, totalNum: count}});
            }
        });
    }

    //  导游等旅游行业从业者
    guideUserList(req, res, next) {
        let self = this;
        let name = req.query.name ? req.query.name.trim() : '';
        let params = {};
        if (name) {
            params.name = name;
        }
        let page = parseInt(req.query.currentPage || 1);
        let pageSize = parseInt(req.query.pageSize || 10);
        self.userModel.guideUserList(params, page, pageSize, (err, row, count) => {
            if (err) {
                logger.error(err);
                res.json({code: 500, msg: err, data: []});
            } else {
                console.log(row, count)
                res.json({code: 200, msg: '', data: {tableData: row, totalNum: count}});
            }
        });
    }

    // 商家等旅游行业企业
    merchantUserList(req, res, next) {
        let self = this;
        let name = req.query.name ? req.query.name.trim() : '';
        let params = {};
        if (name) {
            params.name = name;
        }
        let page = parseInt(req.query.currentPage || 1);
        let pageSize = parseInt(req.query.pageSize || 10);
        self.userModel.merchantUserList(params, page, pageSize, (err, row, count) => {
            if (err) {
                logger.error(err);
                res.json({code: 500, msg: err, data: []});
            } else {
                console.log(row, count)
                res.json({code: 200, msg: '', data: {tableData: row, totalNum: count}});
            }
        });
    }

    // 司机
    driverUserList(req, res, next) {
        let self = this;
        let name = req.query.name ? req.query.name.trim() : '';
        let params = {};
        if (name) {
            params.name = name;
        }
        let page = parseInt(req.query.currentPage || 1);
        let pageSize = parseInt(req.query.pageSize || 10);
        self.userModel.driverUserList(params, page, pageSize, (err, row, count) => {
            if (err) {
                logger.error(err);
                res.json({code: 500, msg: err, data: []});
            } else {
                res.json({code: 200, msg: '', data: {tableData: row, totalNum: count}});
            }
        });
    }

    // 游客用户
    visitorUserList(req, res, next) {
        let self = this;
        let name = req.query.name ? req.query.name.trim() : '';
        let params = {};
        if (name) {
            params.name = name;
        }
        let page = parseInt(req.query.currentPage || 1);
        let pageSize = parseInt(req.query.pageSize || 10);
        self.userModel.visitorUserList(params, page, pageSize, (err, row, count) => {
            if (err) {
                logger.error(err);
                res.json({code: 500, msg: err, data: []});
            } else {
                console.log(row, count)
                res.json({code: 200, msg: '', data: {tableData: row, totalNum: count}});
            }
        });
    }

    add(req, res, role) {
        let self = this;
        let data = placeUserData(req.body);
        data.role = role;
        self.userModel.add(data, (err) => {
            if (err) {
                logger.error('添加出错');
                logger.error(err);
                res.json({code: 500, msg: err});
            } else {
                res.json({code: 200, msg: '添加成功'});
            }
        });
    }

    placeAdd(req, res) {
        this.add(req, res, 'admin');
    }

    // 旅行社添加
    travelAdd(req, res) {
        this.add(req, res, 'travelAgent');
    }

    edit(req, res) {
        let self = this;
        let id = req.body.id;
        let data = placeUserData(req.body);
        self.userModel.edit(id, data, (err) => {
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
        self.userModel.del(id, function (err) {
            if (err) {
                logger.error('删除出错');
                logger.error(err);
                res.json({code: 500, msg: err});
            } else {
                res.json({code: 200, msg: ''});
            }
        });
    }

    getUserById(req, res) {
        let self = this;
        let userId = req.params.id;
        self.userModel.getUserById(userId, (err, result) => {
            if (err) {
                logger.error(err);
                res.json({code: 500, msg: err});
            } else {
                let partner = [{}];
                let data = {};
                if (result.length > 0) {
                    partner = result.map(function (item) {
                        return {value: item.pid, label: item.pname};
                    });
                    data = {id: result[0].id, name: result[0].name, mobile: result[0].mobile, partner: partner};
                }
                res.json({code: 200, msg: '', data: data});
            }
        });
    }

    checkMobile(req, res) {
        let self = this;
        let mobile = req.query.mobile;
        let pageStatus = req.query.pageStatus;
        let id = req.query.id;
        let params = {id: id, mobile: mobile, pageStatus: pageStatus};
        self.userModel.checkMobile(params, (err, result) => {
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

    authStatus(req, res) {
        let self = this;
        let id = req.query.id;
        let status = req.query.status;
        if (!id || !status) {
            return res.json({code: 400, msg: '参数错误'});
        }
        status = (status === 'pass') ? 1 : 5;
        let auditorId = req.user.id;
        let params = {status: status, auditorId: auditorId, auditTime: new Date()};
        self.userModel.edit(id, params, (err) => {
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
        let orgName = req.params.orgName ? req.params.orgName.trim() : '';
        let params = {};
        if (orgName) {
            params.name = orgName;
        }
        self.userModel.orgName(params, (err, row) => {
            if (err) {
                logger.error(err);
                res.json({code: 500, msg: err, data: []});
            } else {
                console.log(row)
                res.json({code: 200, msg: '', data: row});
            }
        });
    }

    filterName(req, res) {
        let self = this;
        let username = req.params.name ? req.params.name.trim() : '';
        let params = {};
        if (username) {
            params.name = username;
        }
        self.userModel.filterName(params, (err, row) => {
            if (err) {
                logger.error(err);
                res.json({code: 500, msg: err, data: []});
            } else {
                res.json({code: 200, msg: '', data: row});
            }
        });
    }

    upload(req, res) {
        let data = reqFile(req);
        res.json({code: 200, msg: '', data: {relativeDir: config.upload.url + data.relativeDir + data.filename}});
    }

    password(req, res) {
        let self = this;
        let id = req.body.id;
        let data = placeUserData(req.body);
        self.userModel.edit(id, {password: data.password}, (err) => {
            if (err) {
                logger.error('改密出错');
                logger.error(err);
                res.json({code: 500, msg: err});
            } else {
                res.json({code: 200, msg: ''});
            }
        });
    }

    merchant(req, res) {
        let self = this;
        self.userModel.getAllMerchant((err, row) => {
            if (err) {
                logger.error(err);
                res.json({code: 500, msg: err});
            } else {
                res.json({code: 200, msg: 'ok', data: row});
            }
        })
    }

}

function placeUserData(body) {
    let data = {};
    if (body.name && body.name.trim()) {
        data.name = body.name.trim()
    }
    if (body.mobile && body.mobile.trim()) {
        data.mobile = body.mobile.trim()
    }
    if (body.password && body.password.trim()) {
        data.password = comm.md5(comm.md5('' + data.mobile + body.password.trim()))
    }
    if (body.parent) {
        data.parent = body.parent
    }
    if (body.sex) {
        data.sex = body.sex
    }
    if (body.status) {
        data.status = body.status
    }
    if (body.isPrepay) {
        data.isPrepay = body.isPrepay
    }
    if (body.orgAddr && body.orgAddr.trim()) {
        data.orgAddr = body.orgAddr.trim()
    }
    if (body.creditCode && body.creditCode.trim()) {
        data.creditCode = body.creditCode.trim()
    }
    if (body.authPic && body.authPic.trim()) {
        data.authPic = body.authPic.trim()
    }
    return data;
}

function reqFile(req) {
    let file = req.files[0];
    let data = {
        fieldname: file.fieldname || '', // 字段名
        originalname: file.originalname || '', // 原始名
        encoding: file.encoding || '', // 编码
        mimetype: file.mimetype || '', // 类型
        filename: file.filename || '', // 保存的文件名
        relativeDir: file.relativeDir || '', // 保存的相对目录
        size: file.size || '' // 空间大小
    };
    return data;
}

module.exports = UserController;

