const express = require('express');
const router = express.Router();
const Con = require('../controllers/UserRoleController');

// 用户角色列表
router.get('/list', function (req, res, next) {
    new Con(req).list(req, res, next);
});

// 获取权限
router.get('/access', function (req, res) {
    new Con(req).getAccessById(req, res);
});

// 添加
router.post('/add', function (req, res, next) {
    new Con(req).add(req, res, next);
});

module.exports = router;