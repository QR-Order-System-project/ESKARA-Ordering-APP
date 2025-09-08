const express = require('express');
const { finishMenu, showMenuQueue, fillMenuQueue } = require('../controllers/orderController');

const router = express.Router();

// 요리 완료
router.post('/finish', finishMenu);

// 메뉴 큐 보여주기
router.get('/showMenuQueue', showMenuQueue);

// 메뉴 큐 채우기 (초기화용, 필요시 사용)
router.post('/fillMenuQueue', fillMenuQueue);


module.exports = router;
