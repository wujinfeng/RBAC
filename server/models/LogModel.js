/**
 * 用户信息
 */

const BaseModel = require('./BaseModel');
const uuid = require('uuid/v1');
const comm = require('../middlewares/comm');
const mysql = require('mysql');
let config = require('../config/config').getInstance().config;
let logger = config.logger;


function rollback(conn, err, cb){
    logger.error(err);
    conn.rollback(() => {
        conn.release();
        cb(err)
    });
}

class BillingModel extends BaseModel {

    /**
     * 查询列表
     * @param params
     * @param page
     * @param pageSize
     * @param cb
     */
    list(params, page, pageSize, cb) {
        let con = [];
        let self = this;
        let existParam = false;
        if (params.sourceName) {
            existParam = true;
            con.push(`u2.name like ${mysql.escape('%' + params.sourceName + '%')}`);
        }
        if (params.orderId) {
            existParam = true;
            con.push(`b.id=${mysql.escape(params.orderId)}`);
        }
        if(existParam){
            con =' where ' + con.join(' and ');
        }else{
            con = '';
        }
        let sql = `select b.id,b.source,b.type,b.number,b.mark,b.payWay,b.payStatus,b.payNum,b.placeId,
             b.userId,u.name as userName,u.mobile,b.couponId,u2.name as sourceName,u2.mobile as sourceMobile,
              round(b.totalPrice/100, 2) as totalPrice,
              round(b.actualFee/100, 2) as actualFee,
              round(b.discountFee/100, 2) as discountFee,
              round(b.unit/100, 2) as unit,
             DATE_FORMAT(b.reserveDate, "%Y-%m-%d") as reserveDate,
             DATE_FORMAT(b.enterTime, "%Y-%m-%d %H:%i:%s") as enterTime,
             DATE_FORMAT(b.ctime, "%Y-%m-%d %H:%i:%s") as time
             from ${self.baseDb}order as b LEFT JOIN ${self.baseDb}user as u ON b.userId=u.id 
             LEFT JOIN ${self.baseDb}user as u2 ON b.source=u2.id
             ${con} order by b.ctime desc limit ?,?`;
        console.log(sql)
        let execParam = self.getExecParamByOption(sql, [(page - 1) * pageSize, pageSize]);
        self.execSql(execParam, function (err, rows) { console.log(rows)
            if (err) {
                return cb(err);
            }
            let countSql = `select count(*) as count from ${self.baseDb}order as b
                      LEFT JOIN ${self.baseDb}user as u2 ON b.source=u2.id ${con}`;
            let execParam2 = self.getExecParamByOption(countSql, '');
            self.execSql(execParam2, (err, count) => {
                if (err) {
                    return cb(err);
                }
                cb(err, rows, count[0].count);
            });
        });
    }

    getOrderById(orderId, cb){
        let self = this;
        let sql = `select b.id,b.source,b.type,b.number,b.mark,b.payWay,b.payStatus,b.payNum,b.placeId,
            b.userId,b.couponId,b.totalPrice, b.actualFee, b.discountFee, b.unit, b.reserveDate, 
            b.enterTime, b.time, u.name as userName,u.mobile,u2.name as sourceName,u2.mobile as sourceMobile
            from (
              select o.id,o.source,o.type,o.number,o.mark,o.payWay,o.payStatus,o.payNum,o.placeId,o.userId,o.couponId,
              round(o.totalPrice/100, 2) as totalPrice,
              round(o.actualFee/100, 2) as actualFee,
              round(o.discountFee/100, 2) as discountFee,
              round(o.unit/100, 2) as unit,
              DATE_FORMAT(o.reserveDate, "%Y-%m-%d") as reserveDate,
              DATE_FORMAT(o.enterTime, "%Y-%m-%d %H:%i:%s") as enterTime,
              DATE_FORMAT(o.ctime, "%Y-%m-%d %H:%i:%s") as time 
              from ${self.baseDb}order as o where o.id=? limit 1 
            ) b LEFT JOIN ${self.baseDb}user as u ON b.userId=u.id 
            LEFT JOIN ${self.baseDb}user as u2 ON b.source=u2.id`;
        console.log(sql)
        let execParam = self.getExecParamByOption(sql, orderId);
        self.execSql(execParam, cb);
    }

    /**
     * 编辑
     * @param id
     * @param data
     * @param cb
     */
    edit(id, data, cb) {
        let self = this;
        let sql = `update ${self.baseDb}order set ? where id=?`;
        let execParam = self.getExecParamByOption(sql, [data, id]);
        self.execSql(execParam, cb);
    }

    add(params, cb) {
        let self = this;
        let sql = `insert into ${self.baseDb}order set ?`;
        let execParam = self.getExecParamByOption(sql, params);
        self.execSql(execParam, cb);
    }

    del(id, cb) {
        let self = this;
        let sql = `delete from ${self.baseDb}order where id=?`;
        let execParam = self.getExecParamByOption(sql, id);
        self.execSql(execParam, cb);
    }

    // 检查手机号是否存在
    checkName(params, cb) {
        let con = '';
        if (params.pageStatus === 'edit') {
            con = ` and id!=${mysql.escape(params.id)}`;
        }
        let self = this;
        let sql = `select id from ${self.baseDb}billing where name=? and placeId=? ${con}`;
        let execParam = self.getExecParamByOption(sql, [params.name, params.placeId]);
        self.execSql(execParam, cb);
    }

    income(params,cb){
        let con = ` where b.payStatus=10 and b.ctime>=? and b.ctime<=?`;
        let self = this;
        if (params.placeId) {
            con +=` and b.placeId=${mysql.escape( params.placeId )}`
        }
        let sql = `select round(sum(totalPrice)/100,2) AS totalPrice, DATE_FORMAT(b.ctime, "%Y-%m-%d") as time
             from ${self.baseDb}order as b ${con} group by DATE_FORMAT(b.ctime, "%Y-%m-%d") order by b.ctime`;
        let execParam = self.getExecParamByOption(sql, [params.start, params.end]);
        console.log(execParam)
        self.execSql(execParam,cb);
    }

    people(params,cb){
        let con = ` where b.payStatus=10 and b.enterTime>=? and b.enterTime<=?`;
        let self = this;
        if (params.placeId) {
            con +=` and b.placeId=${mysql.escape( params.placeId )}`
        }
        let sql = `SELECT sum(ot.number) as number, DATE_FORMAT(b.enterTime, "%Y-%m-%d") AS time
        FROM ${self.baseDb}order AS b 
        LEFT JOIN ${self.baseDb}order_ticket as ot ON ot.orderId=b.id ${con}
        GROUP BY DATE_FORMAT(b.enterTime, "%Y-%m-%d")
        ORDER BY b.enterTime`;
        let execParam = self.getExecParamByOption(sql, [params.start, params.end]);
        console.log(execParam)
        self.execSql(execParam,cb);
    }

    merchant(params,cb){
        let con = ` where b.payStatus=10 and b.reserveDate>=? and b.reserveDate<=?`;
        let self = this;
        if (params.userId) {
            con +=` and b.userId=${mysql.escape( params.userId )}`
        }
        let sql = `SELECT sum(ot.number) as number, DATE_FORMAT(b.reserveDate, "%Y-%m-%d") AS time
        FROM ${self.baseDb}order AS b 
        LEFT JOIN ${self.baseDb}order_ticket as ot ON ot.orderId=b.id ${con}
        GROUP BY b.reserveDate ORDER BY b.reserveDate`;
        let execParam = self.getExecParamByOption(sql, [params.start, params.end]);
        console.log(execParam)
        self.execSql(execParam,cb);
    }
}

module.exports = BillingModel;
