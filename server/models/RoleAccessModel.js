/**
 * 角色权限信息
 */
const lodash = require('lodash');
const async = require('async');
const BaseModel = require('./BaseModel');
const mysql = require('mysql');

class RoleAccessModel extends BaseModel {

    // 分页列表，展示菜单
    list(params, page, pageSize, cb) {
        let con = '';
        let self = this;
        if (params.name) {
            con = ` where r.name like ${mysql.escape('%' + params.name + '%')} `;
        }
        let sql = `SELECT r.id as roleId, r.name as roleName, ra.accessId, ra.type,
            DATE_FORMAT(ra.uptime, "%Y-%m-%d %H:%i:%s") as uptime,
            m.id,m.name AS menuName,m.parentId,m.sort,m.isLeaf
            FROM (SELECT r.id,r.name FROM ${self.baseDb}role as r ${con} ORDER BY r.id DESC LIMIT ?,?) as r 
            LEFT JOIN ${self.baseDb}role_access as ra ON r.id=ra.roleId and ra.type=1
            LEFT JOIN ${self.baseDb}menu as m ON ra.accessId=m.id ORDER BY m.sort ASC`;
        let execParam = self.getExecParamByOption(sql, [(page - 1) * pageSize, pageSize]);
        self.execSql(execParam, function (err, rows) {
            if (err) {
                return cb(err);
            }
            let countSql = `select count(*) as count FROM ${self.baseDb}role as r ${con}`;
            let execParam2 = self.getExecParamByOption(countSql, '');
            self.execSql(execParam2, (err, count) => {
                if (err) {
                    return cb(err);
                }
                cb(err, rows, count[0].count);
            });
        });
    }

    // 获取一个角色的菜单权限
    getMenu(roleId, cb) {
        let self = this;
        let sqlMenu = `SELECT ra.roleId,ra.accessId,m.name,
         DATE_FORMAT(ra.ctime, "%Y-%m-%d %H:%i:%s") as ctime
         FROM ${self.baseDb}role_access ra
         LEFT JOIN ${self.baseDb}menu m ON ra.accessId=m.id where ra.type=1 and ra.roleId=?`;
        let execParam = self.getExecParamByOption(sqlMenu, roleId);
        self.execSql(execParam, cb);
    }
    // 获取一个用户id的菜单权限
    getMyMenu(userId, cb) {
        let self = this;
        let sqlMenu = `SELECT ur.roleId, ra.accessId, ra.type,
            m.id, m.name AS menuName, m.parentId, m.sort, m.isLeaf, m.icon, m.url
            FROM ${self.baseDb}user_role as ur 
            INNER JOIN ${self.baseDb}role_access as ra ON ur.roleId=ra.roleId and ra.type=1
            INNER JOIN ${self.baseDb}menu as m ON ra.accessId=m.id WHERE ur.userId=? ORDER BY m.sort ASC `;
        let execParam = self.getExecParamByOption(sqlMenu, userId);
        self.execSql(execParam, cb);
    }
    // 获取一个角色的元素权限
    getEle(roleId, cb) {
        let self = this;
        let sqlElement = `SELECT ra.roleId,ra.accessId,e.name,
         DATE_FORMAT(ra.ctime, "%Y-%m-%d %H:%i:%s") as ctime
         FROM ${self.baseDb}role_access ra
         LEFT JOIN ${self.baseDb}element e ON ra.accessId=e.id where ra.type=2 and ra.roleId=?`;
        let execParam = self.getExecParamByOption(sqlElement, roleId);
        self.execSql(execParam, cb);
    }

    // 查询是否存在
    isExist(params, cb) {
        let self = this;
        let sql = `select count(*) as count from ${self.baseDb}role_access where roleId=? and accessId=? and type=?`;
        let execParam = self.getExecParamByOption(sql, [params.roleId, params.accessId, params.type]);
        self.execSql(execParam, cb);
    }

    // 添加
    add(params, cb) {
        let self = this;
        let sql = `select accessId from ${self.baseDb}role_access where roleId=? and type=?`;
        let execParam = self.getExecParamByOption(sql, [params.roleId, params.type]);
        self.execSql(execParam, (err, row) => {
            if (err) {
                return cb(err)
            }
            let arr = row.map(function (i) {
                return i.accessId;
            });
            console.log('row:', arr)
            if (row.length > 0) {
                let delArr = lodash.difference(arr, params.accessArr);
                let addArr = lodash.difference(params.accessArr, arr);
                console.log('delArr:', delArr)
                console.log('addArr:', addArr)
                async.parallel({
                    delId: function (callback) {
                        self.delArr(params, delArr, callback)
                    },
                    addId: function (callback) {
                        self.insert(params, addArr, callback)
                    }
                }, function (err) {
                    cb(err)
                })
            } else {
                self.insert(params, params.accessArr, cb)
            }
        });
    }

    insert(params, accessArr, cb) {
        if(accessArr.length === 0){
            return cb()
        }
        let self = this;
        let val = [];
        for (let i = 0; i < accessArr.length; i++) {
            val.push(`(${params.roleId}, ${accessArr[i]}, ${params.type})`)
        }
        let sql = `insert into ${self.baseDb}role_access(roleId, accessId, type) values${val.join(',')}`;
        console.log('insert sql:', sql)
        let execParam = self.getExecParamByOption(sql, params);
        self.execSql(execParam, cb);
    }

    delArr(params, accessArr, cb) {
        if(accessArr.length === 0){
            return cb()
        }
        let self = this;
        let val = '(' + accessArr.join(',') + ')';
        let sql = `delete from ${self.baseDb}role_access where roleId=? and type=? and accessId in` + val;
        console.log('delete sql:', sql)
        let execParam = self.getExecParamByOption(sql, [params.roleId, params.type]);
        self.execSql(execParam, cb);
    }

    // 删除
    del(id, cb) {
        let self = this;
        let sql = `delete from ${self.baseDb}role_access where id=?`;
        let execParam = self.getExecParamByOption(sql, id);
        self.execSql(execParam, cb);
    }

}

module.exports = RoleAccessModel;
