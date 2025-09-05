const express = require('express');
const { finishMenu, showMenuQueue } = require('../controllers/orderController');

const router = express.Router();

// 요리 완료
router.post('/finish', finishMenu);

// 메뉴 큐 보여주기
router.get('/showMenuQueue', showMenuQueue);

module.exports = router;
