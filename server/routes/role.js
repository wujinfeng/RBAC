/**
 * Created by wujinfeng on 2018/06/11.
 */
const express = require('express');
const router = express.Router();
const Con = require('../controllers/RoleController');

//列表
router.get('/list', function (req, res) {
    new Con(req).list(req, res);
});

// getAll 获取所有
router.get('/getAll', function (req, res) {
    new Con(req).getAll(req, res);
});
//获取
router.get('/id/:id', function (req, res) {
    new Con(req).getPlaceById(req, res);
});

//名字模糊查询
router.get('/name/:name', function (req, res) {
    new Con(req).getPlaceByName(req, res);
});

//添加
router.post('/add', function (req, res) {
    new Con(req).add(req, res);
});

//编辑
router.post('/edit', function (req, res) {
    new Con(req).edit(req, res);
});

//删除
router.get('/del/:id', function (req, res) {
    new Con(req).del(req, res);
});

module.exports = router;