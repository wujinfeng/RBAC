const express = require('express');
const router = express.Router();
const Con = require('../controllers/AccessController');

//  列表
router.get('/list', function (req, res, next) {
    new Con(req).list(req, res, next);
});

//  列表
router.get('/allmenutree', function (req, res, next) {
    new Con(req).getAllMenuTree(req, res, next);
});

module.exports = router;