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
        let con = '';
        let arr = [];
        let self = this;
        let existParmas = false;
        if (params.name) {
            existParmas = true;
            arr.push(` c.name like ${mysql.escape('%' + params.name + '%')} `);
        }
        if (params.couponId) {
            existParmas = true;
            arr.push(` c.id=${mysql.escape(params.couponId)} `);
        }
        if (existParmas){
            con = ` where ${arr.join(' and ')}`;
        }else{
            con = '';
        }
        let sql = `SELECT c.id,c.name,c.introduce,round(c.money/100,2) as money,c.status,u1.name as operatorName,
                 DATE_FORMAT(c.startTime, "%Y-%m-%d %H:%i:%s") as startTime,
                 DATE_FORMAT(c.endTime, "%Y-%m-%d %H:%i:%s") as endTime,
                 DATE_FORMAT(c.ctime, "%Y-%m-%d %H:%i:%s") as ctime
                FROM ${self.baseDb}coupon as c 
                LEFT JOIN ${self.baseDb}user as u1 ON c.operatorId=u1.id                 
                ${con} order by c.ctime desc limit ?,?`;
        let execParam = self.getExecParamByOption(sql, [(page - 1) * pageSize, pageSize]);
        console.log(execParam);
        self.execSql(execParam, function (err, rows) {
            if (err) {
                return cb(err);
            }
            let countSql = `SELECT count(*) as count FROM ${self.baseDb}coupon as c ${con}`;
            let execParam2 = self.getExecParamByOption(countSql, '');
            self.execSql(execParam2, (err, count) => {
                if (err) {
                    return cb(err);
                }
                cb(err, rows, (count.length > 0) ? count[0].count : 0);
            });
        });
    }
    // 用户参与优惠活动列表
    userCouponlist(params, page, pageSize, cb) {
        let con = '';
        let arr = [];
        let self = this;
        let existParmas = false;
        if (params.name) {
            existParmas = true;
            arr.push(` c.name like ${mysql.escape('%' + params.name + '%')} `);
        }
        if (params.mobile) {
            existParmas = true;
            arr.push(` u1.mobile=${mysql.escape(params.mobile)} `);
        }
        if (existParmas){
            con = ` where ${arr.join(' and ')}`;
        }else{
            con = '';
        }
        let sql = `SELECT uc.id,uc.status,c.name,u1.mobile,uc.couponId,              
                 DATE_FORMAT(uc.ctime, "%Y-%m-%d %H:%i:%s") as ctime
                FROM ${self.baseDb}user_coupon as uc 
                LEFT JOIN ${self.baseDb}user as u1 ON uc.userId=u1.id                 
                LEFT JOIN ${self.baseDb}coupon as c ON uc.couponId=c.id                 
                ${con} order by uc.ctime desc limit ?,?`;
        let execParam = self.getExecParamByOption(sql, [(page - 1) * pageSize, pageSize]);
        console.log(execParam);
        self.execSql(execParam, function (err, rows) {
            if (err) {
                return cb(err);
            }
            let countSql = `SELECT count(*) as count FROM ${self.baseDb}user_coupon as uc 
                LEFT JOIN ${self.baseDb}user as u1 ON uc.userId=u1.id                 
                LEFT JOIN ${self.baseDb}coupon as c ON uc.couponId=c.id ${con} `;
            let execParam2 = self.getExecParamByOption(countSql, '');
            self.execSql(execParam2, (err, count) => {
                if (err) {
                    return cb(err);
                }
                cb(err, rows, (count.length > 0) ? count[0].count : 0);
            });
        });
    }

    edit(id, params, cb) {
        let self = this;
        let sql = `update ${self.baseDb}coupon set ? where id=?`;
        let execParam = self.getExecParamByOption(sql, [params, id]);
        self.execSql(execParam, cb);
    }

    add(params, cb) {
        let self = this;
        let sql = `insert into ${self.baseDb}coupon set ?`;
        let execParam = self.getExecParamByOption(sql, params);
        self.execSql(execParam, cb);
    }


}

module.exports = UserModel;
