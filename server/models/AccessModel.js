/**
 * 预付费信息
 */

const BaseModel = require('./BaseModel');
const mysql = require('mysql');
const comm = require('../middlewares/comm');
let config = require('../config/config').getInstance().config;
const logger = config.logger;

class UserModel extends BaseModel {

    // 预付费列表
    list(params, page, pageSize, cb) {
        let self = this;
        let sql = '';
        let countSql = '';
        if (params.table === 'menu') {
            let con = '';
            if (params.name) {
                con += ` where m.name like ${mysql.escape('%' + params.name + '%')} `;
            }
            sql = `SELECT m.id,m.name,m.url,m.parentId,m.sort,m.isLeaf,m.icon,m.status,m1.name as parentName,
                   DATE_FORMAT(m.ctime,"%Y-%m-%d %H:%i:%s") as ctime
                   FROM ${self.baseDb}menu as m
                   LEFT JOIN ${self.baseDb}menu as m1 ON m.parentId=m1.id           
                   ${con} order by m.sort limit ?,?`;
            countSql = `SELECT count(*) as count FROM ${self.baseDb}menu as m ${con}`;
        } else {
            let con = [];
            if (params.name) {
                con.push(` e.name like ${mysql.escape('%' + params.name + '%')} `);
            }
            if (params.menuName) {
                con.push(` m.name like ${mysql.escape('%' + params.menuName + '%')} `);
            }
            if (con.length > 0) {
                con = ' where ' + con.join(' and ');
            } else {
                con = '';
            }
            sql = `SELECT e.id,e.name,e.code,e.status,e.menuId,m.name as menuName,
                   DATE_FORMAT(m.ctime,"%Y-%m-%d %H:%i:%s") as ctime
                   FROM ${self.baseDb}element as e
                   LEFT JOIN ${self.baseDb}menu as m ON e.menuId=m.id           
                   ${con} order by e.menuId desc limit ?,?`;
            countSql = `SELECT count(*) as count  FROM ${self.baseDb}element as e
                   LEFT JOIN ${self.baseDb}menu as m ON e.menuId=m.id ${con}`;
        }

        let execParam = self.getExecParamByOption(sql, [(page - 1) * pageSize, pageSize]);
        console.log(execParam);
        self.execSql(execParam, function (err, rows) {
            if (err) {
                return cb(err);
            }
            let execParam2 = self.getExecParamByOption(countSql, '');
            self.execSql(execParam2, (err, count) => {
                if (err) {
                    return cb(err);
                }
                cb(err, rows, count[0].count);
            });
        });
    }

    getAllMenu(cb) {
        let self = this;
        let sql = `SELECT m.id,m.name as menuName,m.url,m.parentId,m.sort,m.isLeaf,m.icon,m.status,
                   DATE_FORMAT(m.ctime,"%Y-%m-%d %H:%i:%s") as ctime
                   FROM ${self.baseDb}menu as m order by m.sort`;
        let execParam = self.getExecParamByOption(sql, '');
        self.execSql(execParam, cb)
    }

}

module.exports = UserModel;
