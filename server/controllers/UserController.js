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
        let username = req.body.username;
        let password = req.body.password;

        if (!username || !password) {
            return res.json({code: 400, msg: '请填写用户名和密码'});
        }

        password = comm.md5(comm.md5('' + password + password));
        console.log(username, password)
        self.userModel.login(username, password, (err, row) => {
            if (err) {
                logger.error(err);
                return res.json({code: 500, msg: err});
            }
            if (row.length > 0) {
                logger.info('登录username:' + username);
                let doc = row[0];
                let userinfo = {
                    id: doc.id,
                    username: doc.username,
                    uptime: doc.uptime,
                    time: new Date().getTime()
                };
                userinfo.token = jwt.sign(userinfo, config.tokenSecret);
                return res.json({code: 200, msg: '登录成功', data: userinfo});
            }
            res.json({code: 400, msg: '请填写正确用户名和密码'});
        });
    }

    checkUser(req, res, next) {
        let self = this;
        logger.info('登录者：',req.user)
        if(!req.user){
            logger.info('状态：无此用户')
            return next({name: 'UnauthorizedError'})
        }
        self.userModel.checkUser(req.user.id, (err, row) => {
            if (err) {
                logger.error(err);
                res.json({code: 500, msg: err});
            } else {
                if (row.length > 0) {
                    let u = row[0];
                    if (u.status !== 1) {
                        logger.info('状态：拒绝登录')
                        return next({name: 'UnauthorizedError'})
                    }
                    if (u.uptime !== req.user.uptime) {
                        logger.info('状态：已经更新用户信息')
                        return next({name: 'UnauthorizedError'})
                    } else {
                        logger.info('状态：通过')
                        next()
                    }
                } else {
                    logger.info('状态：无此用户')
                    return next({name: 'UnauthorizedError'})
                }
            }
        })
    }

    // 用户
    list(req, res, next) {
        let self = this;
        let username = req.query.username ? req.query.username.trim() : '';
        let params = {};
        if (username) {
            params.username = username;
        }
        let page = parseInt(req.query.currentPage || 1);
        let pageSize = parseInt(req.query.pageSize || 10);
        self.userModel.list(params, page, pageSize, (err, row, count) => {
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
        let data = postData(req.body);
        console.log(data)
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

    edit(req, res) {
        let self = this;
        let id = req.body.id;
        let data = postData(req.body);
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

    checkUserName(req, res) {
        let self = this;
        let username = req.query.username;
        let pageStatus = req.query.pageStatus;
        let id = req.query.id;
        let params = {id: id, username: username, pageStatus: pageStatus};
        console.log(params)
        self.userModel.checkUserName(params, (err, result) => {
            if (err) {
                logger.error(err);
                res.json({code: 500, msg: err});
            } else {
                console.log(result)
                if (result.length > 0) {
                    return res.json({code: 500, msg: '已经存在了'});
                }
                res.json({code: 200, msg: ''});
            }
        });
    }

    allUser(req, res) {
        let self = this;
        self.userModel.allUser((err, result) => {
            if (err) {
                logger.error(err);
                res.json({code: 500, msg: err});
            } else {
                res.json({code: 200, msg: 'ok', data: result});
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
        status = (status === 'pass') ? 1 : 2;
        let params = {status: status};
        self.userModel.edit(id, params, (err) => {
            if (err) {
                logger.error(err);
                res.json({code: 500, msg: err});
            } else {
                res.json({code: 200, msg: ''});
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
        let data = postData(req.body);
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
}

function postData(body) {
    let data = {};

    if (body.username && body.username.trim()) {
        data.username = body.username.trim()
    }
    if (body.password) {
        data.password = comm.md5(comm.md5('' + body.password + body.password))
    }
    if (body.name && body.name.trim()) {
        data.name = body.name.trim()
    }
    if (body.status) {
        data.status = body.status
    }
    if (body.phone) {
        data.phone = body.phone
    }
    if (body.avatar && body.avatar.trim()) {
        data.avatar = body.avatar.trim()
    }
    if (body.email && body.email.trim()) {
        data.email = body.email.trim()
    }
    return data;
}

function reqFile(req) {
    let file = req.files[0];
    let data = {
        fieldname: file.fieldname || '',         // 字段名
        originalname: file.originalname || '',   // 原始名
        encoding: file.encoding || '',           // 编码
        mimetype: file.mimetype || '',           // 类型
        filename: file.filename || '',           // 保存的文件名
        relativeDir: file.relativeDir || '',     // 保存的相对目录
        size: file.size || ''                    // 空间大小
    };
    return data;
}

module.exports = UserController;

