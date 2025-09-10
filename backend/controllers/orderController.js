const { addOrderToOrdersDB, 
        addMenuToMenuQueueDB, 
        deleteOrdersFromMenuQueueDB, 
        discountCountFromOrders
      } = require('../utils/dbUtils');
const db = require("../firebase");

// 주문 완료 시 (e.g., POST /api/orders/create)
const createOrder = async (req, res) => {
    try {
        const { tableNumber, items } = req.body;

        await addOrderToOrdersDB({ tableNumber, items });
        await addMenuToMenuQueueDB({ tableNumber, items });
        global.io.emit("menuQueueUpdated", { tableNumber, items });
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
        global.io.emit("orderCancellationUpdated", { tableNumber, menu });
        res.status(200).json({ message: '주문이 성공적으로 취소되었습니다.' });

    } catch (error) {
        console.error('주문 취소 처리 중 에러:', error);
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
};


// 요리 완료 시 (e.g., POST /api/menu/finish)
const finishMenu = async (req, res) => {
    try {
        const { tableNumber, menu } = req.body;

        await deleteOrdersFromMenuQueueDB({ tableNumber, menu });
        global.io.emit("menuQueuePopped", { tableNumber, menu });
        res.status(200).json({ message: '요리가 완료 처리되었습니다.' });

    } catch (error) {
        console.error('요리 완료 처리 중 에러:', error);
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
};


// 메뉴큐 채우기 (초기화용, 필요시 사용) (e.g., POST /api/menu/fillMenuQueue)
const fillMenuQueue = async () => {
    const allMenuNames = [
        "불가마 짬뽕탕",
        "참숯가마 버팔로윙",
        "황토방 두부김치",
        "찜질베개 토스트",
        "소프트 아이스크림과 뻥튀기",
        "도리토스 타코",
        "모듬 후르츠",
        "주전자 미숫가루",
        "시원한 물 1L",
        "찜질방 식혜"
    ];

    const menuQueuedict = {};

    allMenuNames.forEach((menuName) => {
      menuQueuedict[menuName] = [];
    });

    const docRef = db.collection('queues').doc('menuQueue');
    if (!docRef.exists){
        await docRef.set(menuQueuedict);
    }
}


// 메뉴큐 보여주기 (e.g., POST /api/menu/showMenuQueue)
const showMenuQueue = async (req, res) => {
  try {
    const allMenuNames = [
        "불가마 짬뽕탕",
        "참숯가마 버팔로윙",
        "황토방 두부김치",
        "찜질베개 토스트",
        "소프트 아이스크림과 뻥튀기",
        "도리토스 타코",
        "모듬 후르츠",
        "주전자 미숫가루",
        "시원한 물 1L",
        "찜질방 식혜"
    ];

    const menuQueuedict = {};

    allMenuNames.forEach((menuName) => {
      menuQueuedict[menuName] = [];
    });

    const docRef = db.collection("queues").doc("menuQueue");
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return res.status(200).json(menuQueuedict);
    }

    const dbData = docSnap.data();


    for (const menuName in dbData) {
      if (menuQueuedict.hasOwnProperty(menuName)) {
        menuQueuedict[menuName] = dbData[menuName];
      }
    }

    return res.status(200).json(menuQueuedict);
  } catch (error) {
    console.error("메뉴 큐 조회 중 에러:", error);
    return res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
};

// 라우터 파일에서 사용할 수 있도록 함수들을 export 합니다.
module.exports = {
    createOrder,
    cancelOrder,
    finishMenu, 
    showMenuQueue,
    fillMenuQueue
};
