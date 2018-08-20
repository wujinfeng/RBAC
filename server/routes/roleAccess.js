const express = require('express');
const router = express.Router();
const Con = require('../controllers/RoleAccessController');

// 用户角色列表
router.get('/list', function (req, res, next) {
    new Con(req).list(req, res, next);
});

// 获取菜单权限
router.get('/menu', function (req, res, next) {
    new Con(req).getMenu(req, res, next);
});

// 获取元素权限
router.get('/ele', function (req, res, next) {
    new Con(req).getEle(req, res, next);
});

// 保存权限
router.post('/add', function (req, res, next) {
    new Con(req).add(req, res, next);
});

module.exports = router;