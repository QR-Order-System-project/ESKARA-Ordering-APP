const express = require("express");
const router = express.Router();

const {
  finalizePayment,
  getAllTableStatus,
  getTablePaymentDetails
} = require("../controllers/paymentController");

// 전체 테이블별 결제 상태 확인
router.get("/status", getAllTableStatus);

// 결제 화면용 상세 정보 조회
router.get("/detail/:tableNumber", getTablePaymentDetails);

// 결제 완료 처리
router.post("/finalize", finalizePayment);

module.exports = router;
