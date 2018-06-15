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
// 景区用户
router.get('/placeUserList', function (req, res, next) {
    new UserController(req).placeUserList(req, res, next);
});
// 旅行社用户
router.get('/travelUserList', function (req, res, next) {
    new UserController(req).travelUserList(req, res, next);
});

// 导游等旅游行业从业者
router.get('/guideUserList', function (req, res, next) {
    new UserController(req).guideUserList(req, res, next);
});
// 商家等旅游行业企业
router.get('/merchantUserList', function (req, res, next) {
    new UserController(req).merchantUserList(req, res, next);
});
// 司机
router.get('/driverUserList', function (req, res, next) {
    new UserController(req).driverUserList(req, res, next);
});
// 游客用户
router.get('/visitorUserList', function (req, res, next) {
    new UserController(req).visitorUserList(req, res, next);
});
// 景区人员添加
router.post('/placeAdd', function (req, res, next) {
    new UserController(req).placeAdd(req, res, next);
});
// 旅行社人员添加
router.post('/travelAdd', function (req, res, next) {
    new UserController(req).travelAdd(req, res, next);
});

router.post('/edit', function (req, res, next) {
    new UserController(req).edit(req, res, next);
});

router.post('/password', function (req, res, next) {
    new UserController(req).password(req, res, next);
});

router.get('/orgName/:orgName', function (req, res, next) {
    new UserController(req).orgName(req, res, next);
});

router.get('/name/:name', function (req, res, next) {
    new UserController(req).filterName(req, res, next);
});

router.get('/auth', function (req, res, next) {
    new UserController(req).authStatus(req, res, next);
});

router.post('/upload', upload.array('image', 1), function (req, res, next) {
    new UserController(req).upload(req, res, next);
});

// 检查手机号是否存在
router.get('/checkMobile', function (req, res, next) {
    new UserController(req).checkMobile(req, res, next);
});

// 统计： 获取所有商家
router.get('/merchant', function (req, res, next) {
    new UserController(req).merchant(req, res, next);
});

module.exports = router;