const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const upload = require('../middlewares/upload');

// 后台登录
router.post('/login', function (req, res, next) {
    new UserController(req).login(req, res, next);
});

router.get('/id/:id', function (req, res, next) {
    new UserController(req).getUserById(req, res, next);
});
// 用户
router.get('/list', function (req, res, next) {
    new UserController(req).list(req, res, next);
});

// 添加
router.post('/add', function (req, res, next) {
    new UserController(req).add(req, res, next);
});

router.post('/edit', function (req, res, next) {
    new UserController(req).edit(req, res, next);
});

router.post('/password', function (req, res, next) {
    new UserController(req).password(req, res, next);
});

router.get('/allUser', function (req, res, next) {
    new UserController(req).allUser(req, res, next);
});

router.get('/auth', function (req, res, next) {
    new UserController(req).authStatus(req, res, next);
});

router.post('/upload', upload.array('image', 1), function (req, res, next) {
    new UserController(req).upload(req, res, next);
});

// 检查手机号是否存在
router.get('/checkUserName', function (req, res, next) {
    new UserController(req).checkUserName(req, res, next);
});

module.exports = router;