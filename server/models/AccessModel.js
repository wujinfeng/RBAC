/**
 * 预付费信息
 */

const BaseModel = require('./BaseModel');
const mysql = require('mysql');
const comm = require('../middlewares/comm');
let config = require('../config/config').getInstance().config;
const logger = config.logger;

function rollback(conn, err, cb){
    logger.error(err);
    conn.rollback(() => {
        conn.release();
        cb(err)
    });
}

class UserModel extends BaseModel {

    // 预付费列表
    list(params, page, pageSize, cb) {
        let con = '';
        let self = this;
        if (params.name) {
            con += ` where u1.name like ${mysql.escape('%' + params.name + '%')} `;
        }
        let sql = `SELECT r.id,round(r.income/100,2) as income,r.status,u1.name,u2.name as operatorName,
                 DATE_FORMAT(r.rechargeTime, "%Y-%m-%d %H:%i:%s") as rechargeTime,DATE_FORMAT(r.ctime, "%Y-%m-%d %H:%i:%s") as time
                FROM ${self.baseDb}recharge_log as r 
                LEFT JOIN ${self.baseDb}user as u1 ON r.userId=u1.id  
                LEFT JOIN ${self.baseDb}user as u2 ON r.operatorId=u2.id  
                ${con} order by r.ctime desc limit ?,?`;
        let execParam = self.getExecParamByOption(sql, [(page - 1) * pageSize, pageSize]);
        console.log(execParam);
        self.execSql(execParam, function (err, rows) {
            if (err) {
                return cb(err);
            }
            let countSql = `select count(*) as count  from ${self.baseDb}recharge_log as r 
                LEFT JOIN ${self.baseDb}user as u1 ON r.userId=u1.id ${con}`;
            let execParam2 = self.getExecParamByOption(countSql, '');
            self.execSql(execParam2, (err, count) => {
                if (err) {
                    return cb(err);
                }
                cb(err, rows, count[0].count);
            });
        });
    }

    edit(id, params, cb) {
        let self = this;
        let sql = `update ${self.baseDb}recharge_log set ? where id=?`;
        let execParam = self.getExecParamByOption(sql, [params, id]);
        self.execSql(execParam, cb);
    }

    add(params, cb) {
        let self = this;
        let sql = `insert into ${self.baseDb}recharge_log set ?`;
        let execParam = self.getExecParamByOption(sql, params);
        self.execSql(execParam, cb);
    }

    orgName(name, cb) {
        let self = this;
        let sql = `select id, name from ${self.baseDb}user where name like ?`;
        let execParam = self.getExecParamByOption(sql, `%${name}%`);
        self.execSql(execParam, cb);
    }

    authStatus(id, params, cb) {
        let self = this;
        if (params.status === 1) { // 通过，事务写入用户表金额增加
            let sql = `select userId,income from ${self.baseDb}recharge_log where id=?`;
            let execParam = self.getExecParamByOption(sql, id);
            self.execSql(execParam, (err, row) => {
                if (err) {
                    return cb(err);
                }
                if (row.length === 0) {
                    return cb(new Error('数据不存在'));
                }
                let income = row[0].income;
                let userId = row[0].userId;
                console.log('row1:',row)
                comm.getPoolSer(config.baseDb, (err, pool) => {
                    if (err) {
                        return cb(err);
                    }
                    pool.getConnection(function (err, conn) {
                        if (err) {
                            return cb(err);
                        }
                        conn.beginTransaction(function (err) {
                            if (err) {
                                conn.release();
                                return cb(err);
                            }
                            let sql2 = `UPDATE ${self.baseDb}user SET prepay=prepay+?, balance=balance+? WHERE id=?`;
                            console.log('sql2,', sql2,income, userId)
                            conn.query(sql2, [income, income, userId], function (err) {
                                if (err) {
                                    rollback(conn, err, (err)=>{
                                        cb(err);
                                    })
                                } else {
                                    let sql3 = `UPDATE ${self.baseDb}recharge_log SET ? WHERE id=?`;
                                    console.log('sql3,', sql3,params, id)
                                    conn.query(sql3, [params, id], function (err) {
                                        if (err) {
                                            rollback(conn, err, (err)=>{
                                                cb(err);
                                            })
                                        } else {
                                            conn.commit((err) => {
                                                if (err) {
                                                    rollback(conn, err, (err)=>{
                                                        cb(err);
                                                    })
                                                }
                                                console.log('success!');
                                                cb();
                                            });
                                        }
                                    });
                                }
                            });
                        })
                    })
                });
            });
        } else {
            self.edit(id, params, cb);
        }
    }

}

module.exports = UserModel;
