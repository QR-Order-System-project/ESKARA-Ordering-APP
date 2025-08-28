const express = require("express");
const router = express.Router();

const {
  callEmployee,
  getEmployeeCalls,
  completeEmployeeCall
} = require("../controllers/employeeCallController");

// 직원 호출 생성
router.post("/call", callEmployee);

// 호출 내역 조회
router.get("/calls", getEmployeeCalls);

// 호출 완료 처리
router.post("/complete", completeEmployeeCall);

module.exports = router;
