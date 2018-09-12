/**
 * 用户管理
 */

const BaseModel = require('./BaseModel');
const mysql = require('mysql');

class UserModel extends BaseModel {

    getUserById(userId, callback) {
        let self = this;
        let sql = `SELECT b.id,b.mobile,b.username,b.name FROM ${self.baseDb}user b WHERE b.id=?`;
        let execParam = self.getExecParamByOption(sql, userId);
        self.execSql(execParam, callback);
    }

    login(mobile, password, callback) {
        let self = this;
        let sql = `SELECT b.id,b.username,DATE_FORMAT(b.uptime, "%Y-%m-%d %H:%i:%s") as uptime,b.status FROM ${self.baseDb}user b WHERE b.username=? and password=? and status=1`;
        let execParam = self.getExecParamByOption(sql, [mobile, password]);
        self.execSql(execParam, callback);
    }

    checkUser(userId, callback) {
        let self = this;
        let sql = `SELECT b.id,b.username,DATE_FORMAT(b.uptime, "%Y-%m-%d %H:%i:%s") as uptime,b.status FROM ${self.baseDb}user b WHERE b.id=?`;
        let execParam = self.getExecParamByOption(sql, userId);
        self.execSql(execParam, callback);
    }

    list(params, page, pageSize, cb) {
        let con = '';
        let self = this;
        if (params.username) {
            con += ` where b.username like ${mysql.escape('%' + params.username + '%')} `;
        }
        let sql = `SELECT b.id,b.username,b.name,b.status,b.phone,b.avatar,b.email,
                DATE_FORMAT(b.ctime, "%Y-%m-%d %H:%i:%s") as ctime
                from ${self.baseDb}user b
                ${con} order by b.ctime desc limit ?,?`;
        let execParam = self.getExecParamByOption(sql, [(page - 1) * pageSize, pageSize]);
        console.log(execParam);
        self.execSql(execParam, function (err, rows) {
            if (err) {
                return cb(err);
            }
            let countSql = `select count(*) as count  FROM ${self.baseDb}user b ${con}`;
            let execParam2 = self.getExecParamByOption(countSql, '');
            self.execSql(execParam2, (err, count) => {
                if (err) {
                    return cb(err);
                }
                cb(err, rows, count[0].count);
            });
        });
    }

    edit(userId, params, cb) {
        let self = this;
        let sql = `update ${self.baseDb}user set ? where id=?`;
        let execParam = self.getExecParamByOption(sql, [params, userId]);
        self.execSql(execParam, cb);
    }

    add(params, cb) {
        let self = this;
        let sql = `insert into ${self.baseDb}user set ?`;
        let execParam = self.getExecParamByOption(sql, params);
        self.execSql(execParam, cb);
    }

    del(id, cb) {
        let self = this;
        let sql = `delete from ${self.baseDb}user where id=?`;
        let execSql = self.getExecParamByOption(sql, id);
        self.execSql(execSql, cb);
    }

    // 检查用户名是否存在
    checkUserName(params, cb) {
        let con = '';
        if (params.pageStatus === 'edit') {
            con = ` and id!=${mysql.escape(params.id)}`;
        }
        let self = this;
        let sql = `select id from ${self.baseDb}user where username=? ${con}`;
        let execParam = self.getExecParamByOption(sql, params.username);
        self.execSql(execParam, cb);
    }

    allUser(callback) {
        let self = this;
        let sql = `SELECT b.id,b.username FROM ${self.baseDb}user b`;
        let execParam = self.getExecParamByOption(sql, '');
        self.execSql(execParam, callback);
    }

}

module.exports = UserModel;
