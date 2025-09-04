const { addOrderToOrdersDB, 
        addMenuToMenuQueueDB, 
        deleteOrdersFromMenuQueueDB, 
        discountCountFromOrders 
      } = require('../utils/dbUtils');

// 주문 완료 시 (e.g., POST /api/orders/complete)
const completeOrder = async (req, res) => {
    try {
        const { tableNumber, items } = req.body;

        await addOrderToOrdersDB({ tableNumber, items });
        await addMenuToMenuQueueDB({ tableNumber, items });

        res.status(200).json({ message: '주문이 성공적으로 완료되었습니다.' });

    } catch (error) {
        console.error('주문 완료 처리 중 에러:', error);
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
};


// 주문 취소 시 (e.g., POST /api/orders/cancel)
const cancelOrder = async (req, res) => {
    try {
        const { tableNumber, menu } = req.body;

        await deleteOrdersFromMenuQueueDB({ tableNumber, menu });
        await discountCountFromOrders({ tableNumber, menu });

        res.status(200).json({ message: '주문이 성공적으로 취소되었습니다.' });

    } catch (error) {
        console.error('주문 취소 처리 중 에러:', error);
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
};


// 요리 완료 시 (e.g., POST /api/menus/finish)
const finishMenu = async (req, res) => {
    try {
        const { tableNumber, menu } = req.body;

        await deleteOrdersFromMenuQueueDB({ tableNumber, menu });

        res.status(200).json({ message: '요리가 완료 처리되었습니다.' });

    } catch (error) {
        console.error('요리 완료 처리 중 에러:', error);
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
};


// 라우터 파일에서 사용할 수 있도록 함수들을 export 합니다.
module.exports = {
    completeOrder,
    cancelOrder,
    finishMenu
};
