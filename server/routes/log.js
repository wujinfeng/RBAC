/**
 * Created by wujinfeng on 2017/12/21.
 */
const express = require('express');
const router = express.Router();
const Con = require('../controllers/LogController');

// 列表
router.get('/list',function (req,res) {
    new Con(req).list(req, res);
});

//名字模糊查询
/*router.get('/name/:name',function (req,res) {
    new Con(req).getCategoryByName(req, res);
});*/

//检查名称
router.get('/checkName',function (req,res) {
    new Con(req).checkName(req, res);
});
//添加
router.post('/add',function (req,res) {
    new Con(req).add(req, res);
});

//查询票 by orderId
router.get('/id',function (req,res) {
    new Con(req).getOrderById(req, res);
});

//验票 通过
router.get('/pass',function (req,res) {
    new Con(req).orderPass(req, res);
});

//编辑
router.post('/edit',function (req,res) {
    new Con(req).edit(req, res);
});

// 收入
router.get('/income',function (req,res) {
    new Con(req).income(req, res);
});

// 人数
router.get('/people',function (req,res) {
    new Con(req).people(req, res);
});

// 商家票务数
router.get('/merchant',function (req,res) {
    new Con(req).merchant(req, res);
});

module.exports = router;