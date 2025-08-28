const fs = require("fs");
const path = require("path");
const db = require("../firebase");
const { getTimeSlot } = require("./utils");

// 전체 테이블 결제 현황 조회
const getAllTableStatus = async (req, res) => {
  try {
    const timeSlot = getTimeSlot();
    const ordersRef = db.collection("orders").doc(timeSlot).collection("tables");
    const snapshot = await ordersRef.get();

    // menuPrice.json에서 가격 정보 로딩
    const pricePath = path.join(__dirname, "../data/menuPrice.json");
    const menuPrice = JSON.parse(fs.readFileSync(pricePath, "utf-8"));

    const statusList = [];

    // 각 테이블 문서 순회
    snapshot.forEach(doc => {
      const data = doc.data();
      const items = data.items || {};

      // 총 결제 금액 계산
      let totalAmount = 0;
      for (const [menu, count] of Object.entries(items)) {
        totalAmount += (menuPrice[menu] || 0) * count;
      }

      // 리스트에 테이블 정보 추가
      statusList.push({
        tableNumber: data.tableNumber,
        totalAmount,
        paymentEnabled: totalAmount == 0 ? true : false,
      });
    });

    return res.status(200).json(statusList);
  } catch (err) {
    console.error("테이블 결제 현황 조회 실패:", err);
    return res.status(500).json({ message: "서버 오류" });
  }
};

// 특정 테이블의 결제 정보 반환
const getTablePaymentDetails = async (req, res) => {
  try {
    const { tableNumber } = req.params;
    const timeSlot = getTimeSlot();

    const orderRef = db.collection("orders")
      .doc(timeSlot)
      .collection("tables")
      .doc(`table-${tableNumber}`);

    const doc = await orderRef.get();

    // 주문 정보가 없을 경우
    if (!doc.exists) {
      return res.status(404).json({ message: "해당 테이블의 주문이 존재하지 않습니다." });
    }

    const data = doc.data();
    const items = data.items || {};

    // 가격 정보 로딩
    const pricePath = path.join(__dirname, "../data/menuPrice.json");
    const menuPrice = JSON.parse(fs.readFileSync(pricePath, "utf-8"));

    const itemList = [];
    let totalAmount = 0;

    // 각 메뉴별 가격 및 개수 계산
    for (const [menu, count] of Object.entries(items)) {
      const price = menuPrice[menu] || 0;
      itemList.push({menu, count, price});
      totalAmount += price * count;
    }

    return res.status(200).json({
      tableNumber,
      items: itemList,
      totalAmount
    });
  } catch (err) {
    console.error("테이블 결제 정보 조회 실패:", err);
    return res.status(500).json({ message: "결제 정보 조회 실패" });
  }
};

// 결제 완료 처리
const finalizePayment = async (req, res) => {
  try {
    const { tableNumber } = req.body;
    const timeSlot = getTimeSlot();

    const orderRef = db.collection("orders")
      .doc(timeSlot)
      .collection("tables")
      .doc(`table-${tableNumber}`);

    const snapshot = await orderRef.get();

    // 주문 내역이 없을 경우
    if (!snapshot.exists) {
      return res.status(404).json({ message: "테이블 주문 내역이 없습니다." });
    }

    const data = snapshot.data();

    // 가격 정보 로딩
    const pricePath = path.join(__dirname, "../data/menuPrice.json");
    const menuPrice = JSON.parse(fs.readFileSync(pricePath, "utf-8"));
    const items = data.items || {};

    let totalAmount = 0;
    for (const [menu, count] of Object.entries(items)) {
      totalAmount += (menuPrice[menu] || 0) * count;
    }

    // 아카이빙: 주문 내용을 archives에 저장
    await db.collection("archives")
      .doc(timeSlot)
      .collection("tables")
      .doc(`table-${tableNumber}-${Date.now()}`)
      .set({
        ...data,
        totalAmount
      });

    // orders에서 해당 테이블 주문 삭제
    await orderRef.delete();

    return res.status(200).json({ message: "결제 완료되었습니다." });
  } catch (err) {
    console.error("결제 처리 중 오류 발생:", err);
    return res.status(500).json({ message: "결제 처리 실패" });
  }
};

module.exports = {
  getAllTableStatus,
  getTablePaymentDetails,
  finalizePayment
};