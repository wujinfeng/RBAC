/**
 * 用户信息
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
        let sql = `SELECT b.id,b.mobile,b.username FROM ${self.baseDb}user b WHERE b.mobile=? and password=? and status=1`;
        let execParam = self.getExecParamByOption(sql, [mobile, password]);
        self.execSql(execParam, callback);
    }

    list(params, page, pageSize, cb) {
        let con = ' where b.role="admin" ';
        let self = this;
        if (params.name) {
            con += ` and b.name like ${mysql.escape('%' + params.name + '%')} `;
        }
        let sql = `SELECT b.id,b.name,b.sex,b.status,b.parent,b.mobile,p.name as parentName,
                DATE_FORMAT(b.ctime, "%Y-%m-%d %H:%i:%s") as time
                from ${self.baseDb}user b
                LEFT JOIN ${self.baseDb}place p ON b.parent=p.id
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

    // 检查手机号是否存在
    checkMobile(params, cb) {
        let con = '';
        if (params.pageStatus === 'edit') {
            con = ` and id!=${mysql.escape(params.id)}`;
        }
        let self = this;
        let sql = `select id from ${self.baseDb}user where phone=? ${con}`;
        let execParam = self.getExecParamByOption(sql, params.mobile);
        self.execSql(execParam, cb);
    }


    filterName(params, cb) {
        let self = this;
        let sql = `select id,name,mobile,status from ${self.baseDb}user where name like ?`;
        let execParam = self.getExecParamByOption(sql, `%${params.name}%`);
        self.execSql(execParam, cb);
    }

    getUserRole(cb){
        let self = this;
        let sql = `select ur.userId,ur.roleId,u.phone, u.username, u.status as userStatus,
            r.name,r.status as roleStatus from ${self.baseDb}user_role as ur
            left join  ${self.baseDb}user as u on ur.userId=u.id
            left join  ${self.baseDb}role as r on ur.roleId=r.id                
        `;
        let execParam = self.getExecParamByOption(sql, '');
        self.execSql(execParam, cb);
    }
}

module.exports = UserModel;
