const express = require('express');
const router = express.Router();
const Con = require('../controllers/UserRoleController');

// 用户角色列表
router.get('/list', function (req, res, next) {
    new Con(req).list(req, res, next);
});

// 添加
router.post('/add', function (req, res, next) {
    new Con(req).add(req, res, next);
});

// 删除
router.get('/del', function (req, res, next) {
    new Con(req).del(req, res, next);
});


module.exports = router;