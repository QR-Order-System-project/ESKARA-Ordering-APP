const express = require('express');
const { createOrder, finalizeOrder } = require('../controllers/orderController');

const router = express.Router();

router.post('/', createOrder);
router.post('/finalize', finalizeOrder);

module.exports = router;
