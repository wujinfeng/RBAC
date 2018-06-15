/**
 * 用户信息
 */

const BaseModel = require('./BaseModel');
const mysql = require('mysql');

class RoleModel extends BaseModel {

    /**
     * 查询列表
     * @param params
     * @param page
     * @param pageSize
     * @param cb
     */
    list(params, page, pageSize, cb) {
        let con = '';
        let self = this;
        if (params.name) {
            con = ` where b.name like ${mysql.escape('%' + params.name + '%')} `;
        }
        let sql = `select id,name,status,DATE_FORMAT(ctime, "%Y-%m-%d %H:%i:%s") as ctime from ${self.baseDb}role as b ${con} order by b.ctime desc limit ?,?`;
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

    getAll(cb) {
        let self = this;
        let sql = `select b.id,b.name from ${self.baseDb}role as b order by b.ctime DESC`;
        let execParam = self.getExecParamByOption(sql, '');
        self.execSql(execParam, cb);
    }

    getRoleById(id, cb) {
        let self = this;
        let sql = `select id,name,status,DATE_FORMAT(ctime, "%Y-%m-%d %H:%i:%s") as ctime from ${self.baseDb}role where id=?`;
        let execParam = self.getExecParamByOption(sql, id);
        self.execSql(execParam, cb);
    }

    getRoleByName(name, cb){
        let self = this;
        let sql = `select id,name,status from ${self.baseDb}role where name like ?`;
        let execParam = self.getExecParamByOption(sql, `%${name}%`);
        self.execSql(execParam, cb);
    }

    getAccessByRoleId(roleId, cb){
        let self = this;
        let sql = `SELECT ra.roleId,ra.accessId,p.name,DATE_FORMAT(ra.ctime, "%Y-%m-%d %H:%i:%s") as ctime from ${self.baseDb}role_access ra LEFT JOIN ${self.baseDb}p_partner p ON cp.partner_id=p.id WHERE cp.company_id=?`;
        let execParam = self.getExecParamByOption(sql, roleId);
        self.execSql(execParam, cb);
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

module.exports = RoleModel;
