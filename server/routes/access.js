const express = require('express');
const router = express.Router();
const Con = require('../controllers/AccessController');

//  列表
router.get('/list', function (req, res, next) {
    new Con(req).prepayList(req, res, next);
});

// 添加
router.post('/add', function (req, res, next) {
    new Con(req).add(req, res, next);
});

router.post('/edit', function (req, res, next) {
    new Con(req).edit(req, res, next);
});

router.get('/auth', function (req, res, next) {
    new Con(req).authStatus(req, res, next);
});
router.get('/orgName/:name', function (req, res, next) {
    new Con(req).orgName(req, res, next);
});
module.exports = router;