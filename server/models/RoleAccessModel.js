/**
 * 角色权限信息
 */

const BaseModel = require('./BaseModel');
const mysql = require('mysql');

class RoleAccessModel extends BaseModel {

    // 分页列表
    list(params, page, pageSize, cb) {
        let con = '';
        let self = this;
        if (params.name) {
            con = ` where b.name like ${mysql.escape('%' + params.name + '%')} `;
        }
        let sql = `select b.id,b.name,b.status,DATE_FORMAT(b.ctime, "%Y-%m-%d %H:%i:%s") as ctime from ${self.baseDb}role as b ${con} order by b.ctime desc limit ?,?`;
        let execParam = self.getExecParamByOption(sql, [(page - 1) * pageSize, pageSize]);
        self.execSql(execParam, function (err, rows) {
            console.log(rows);
            if (err) {
                return cb(err);
            }
            let countSql = `select count(*) as count from ${self.baseDb}role as b ${con}`;
            let execParam2 = self.getExecParamByOption(countSql, '');
            self.execSql(execParam2, (err, count) => {
                if (err) {
                    return cb(err);
                }
                cb(err, rows, count[0].count);
            });
        });
    }

    // 获取所有角色
    getAll(cb) {
        let self = this;
        let sql = `select b.id,b.name,b.status from ${self.baseDb}role as b order by b.ctime DESC`;
        let execParam = self.getExecParamByOption(sql, '');
        self.execSql(execParam, cb);
    }

    // 按照id查询角色
    getRoleById(id, cb) {
        let self = this;
        let sql = `select id,name,status,DATE_FORMAT(ctime, "%Y-%m-%d %H:%i:%s") as ctime from ${self.baseDb}role where id=?`;
        let execParam = self.getExecParamByOption(sql, id);
        self.execSql(execParam, cb);
    }

    // 按名称查询角色
    getRoleByName(name, cb) {
        let self = this;
        let sql = `select id,name,status from ${self.baseDb}role where name like ?`;
        let execParam = self.getExecParamByOption(sql, `%${name}%`);
        self.execSql(execParam, cb);
    }

    // 获取一个角色的所有权限
    getAccessByRoleId(roleId, cb) {
        let self = this;
        // 菜单权限
        let sqlMenu = `SELECT ra.roleId,ra.accessId,m.name,
         DATE_FORMAT(ra.ctime, "%Y-%m-%d %H:%i:%s") as ctime
         FROM ${self.baseDb}role_access ra
         LEFT JOIN ${self.baseDb}menu m ON ra.accessId=m.id and ra.type=1`;
        // 元素权限
        let sqlElement = `SELECT ra.roleId,ra.accessId,e.name,
         DATE_FORMAT(ra.ctime, "%Y-%m-%d %H:%i:%s") as ctime
         FROM ${self.baseDb}role_access ra
         LEFT JOIN ${self.baseDb}element e ON ra.accessId=e.id and ra.type=2`;
        let execParam = self.getExecParamByOption(sqlMenu);
        self.execSql(execParam, function (err) {
            if (err) {
                cb(err);
            } else {
                let execParam = self.getExecParamByOption(sqlElement);
                self.execSql(execParam, cb);
            }
        });
    }

    edit(id, data, cb) {
        let self = this;
        let sql = `update ${self.baseDb}role set ? where id=?`;
        let execParam = self.getExecParamByOption(sql, [data, id]);
        self.execSql(execParam, cb);
    }

    add(params, cb) {
        let self = this;
        let sql = `insert into ${self.baseDb}role set ?`;
        let execParam = self.getExecParamByOption(sql, params);
        self.execSql(execParam, cb);
    }

    del(id, cb) {
        let self = this;
        let sql = `delete from ${self.baseDb}role where id=?`;
        let execParam = self.getExecParamByOption(sql, id);
        self.execSql(execParam, cb);
    }

}

module.exports = RoleAccessModel;
