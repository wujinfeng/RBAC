const express = require('express');
const router = express.Router();
const Con = require('../controllers/CouponController');

//  预付费列表
router.get('/list', function (req, res, next) {
    new Con(req).list(req, res, next);
});

// 添加
router.post('/add', function (req, res, next) {
    new Con(req).add(req, res, next);
});

// 编辑
router.post('/edit', function (req, res, next) {
    new Con(req).edit(req, res, next);
});

// 用户参与优惠活动列表
router.get('/usercouponlist', function (req, res, next) {
    new Con(req).userCouponlist(req, res, next);
});


module.exports = router;