const { addOrderToDB, finalizeAndClearOrder } = require('../utils/dbUtils');

const createOrder = async (req, res) => {
  try {
    const orderData = req.body;
    await addOrderToDB(orderData);
    io.emit('newOrder', orderData);
    res.status(200).json({ success: true });
  } catch (err) {
    console.error('주문 생성 오류:', err);
    res.status(500).json({ success: false });
  }
};

const finalizeOrder = async (req, res) => {
  try {
    const { tableNumber } = req.body;
    await finalizeAndClearOrder(tableNumber);
    io.emit('tableCleared', tableNumber);
    res.status(200).json({ success: true });
  } catch (err) {
    console.error('주문 정리 오류:', err);
    res.status(500).json({ success: false });
  }
};

module.exports = { createOrder, finalizeOrder };
