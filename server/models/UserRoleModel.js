/**
 * 用户角色模型
 */

const BaseModel = require('./BaseModel');
const mysql = require('mysql');

class UserRoleModel extends BaseModel {
    /**
     * 分页查询列表
     * @param params
     * @param page
     * @param pageSize
     * @param cb
     */
    list(params, page, pageSize, cb) {
        let con = [];
        let self = this;
        if (params.username) {
            con.push(`u.username like ${mysql.escape('%' + params.username + '%')}`);
        }
        if (params.roleName) {
            con.push(`r.name like ${mysql.escape('%' + params.roleName + '%')}`);
        }
        if (con.length > 0) {
            con = ' where ' + con.join(' and ');
        } else {
            con = '';
        }
        let sql = `select ur.userId,ur.roleId,u.phone, u.username, u.status as userStatus,
                DATE_FORMAT(ur.ctime, "%Y-%m-%d %H:%i:%s") as ctime,
                r.name as roleName,r.status as roleStatus from ${self.baseDb}user_role as ur
                left join ${self.baseDb}user as u on ur.userId=u.id
                left join ${self.baseDb}role as r on ur.roleId=r.id  
                ${con} order by ur.userId desc limit ?,?`;
        let execParam = self.getExecParamByOption(sql, [(page - 1) * pageSize, pageSize]);
        console.log(execParam);
        self.execSql(execParam, function (err, rows) {
            if (err) {
                return cb(err);
            }
            let countSql = `select count(*) as count from ${self.baseDb}user_role as ur
                left join  ${self.baseDb}user as u on ur.userId=u.id
                left join  ${self.baseDb}role as r on ur.roleId=r.id ${con}`;
            let execParam2 = self.getExecParamByOption(countSql, '');
            self.execSql(execParam2, (err, count) => {
                if (err) {
                    return cb(err);
                }
                cb(err, rows, count[0].count);
            });
        });
    }

    /**
     * 编辑
     * @param userId
     * @param params
     * @param cb
     */
    edit(userId, params, cb) {
        let self = this;
        let sql = `update ${self.baseDb}user_role set ? where id=?`;
        let execParam = self.getExecParamByOption(sql, [params, userId]);
        self.execSql(execParam, cb);
    }

    /**
     * 添加
     * @param params
     * @param cb
     */
    add(params, cb) {
        let self = this;
        let sql = `insert into ${self.baseDb}user_role set ?`;
        let execParam = self.getExecParamByOption(sql, params);
        self.execSql(execParam, cb);
    }

    /**
     * 删除
     * @param params
     * @param cb
     */
    del(params, cb) {
        let self = this;
        let sql = `delete from ${self.baseDb}user_role where userId=? and roleId=?`;
        let execSql = self.getExecParamByOption(sql, [params.userId, params.roleId]);
        self.execSql(execSql, cb);
    }

}

module.exports = UserRoleModel;
