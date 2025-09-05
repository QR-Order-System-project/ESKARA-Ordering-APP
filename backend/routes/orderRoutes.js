const express = require('express');
const { createOrder, cancelOrder } = require('../controllers/orderController');

const router = express.Router();

// 주문 완료 
router.post('/create', createOrder);

// 주문 취소
router.post('/cancel', cancelOrder);

module.exports = router;
