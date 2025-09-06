const db = require("../firebase");
const { getTimeSlot } = require("../utils/dbUtils");

// 직원 호출 생성
const callEmployee = async (req, res) => {
  try {
    const { tableNumber, items } = req.body;
    const timeSlot = getTimeSlot();

    const employeeCall = db.collection("employeeCall").doc(timeSlot);
    const doc = await employeeCall.get();

    const currentCalls = doc.exists ? doc.data().details || [] : [];

    currentCalls.push({ tableNumber, items });

    await employeeCall.set({ details: currentCalls });

    return res.status(200).json({ message: "직원 호출 요청이 등록되었습니다." });
  } catch (err) {
    console.error("직원 호출 생성 실패:", err);
    return res.status(500).json({ message: "직원 호출 요청 실패" });
  }
};

// 직원 호출 목록 조회
const getEmployeeCalls = async (req, res) => {
  try {
    const timeSlot = getTimeSlot();
    const employeeCall = db.collection("employeeCall").doc(timeSlot);
    const doc = await employeeCall.get();

    if (!doc.exists || !doc.data().details) {
      return res.status(200).json([]); // 아무 호출도 없음
    }

    return res.status(200).json(doc.data().details);
  } catch (err) {
    console.error("직원 호출 조회 실패:", err);
    return res.status(500).json({ message: "직원 호출 내역 불러오기 실패" });
  }
};

// 호출 처리 완료 시 해당 요청 제거
const completeEmployeeCall = async (req, res) => {
  try {
    const { tableNumber, items } = req.body;
    const timeSlot = getTimeSlot();

    const employeeCall = db.collection("employeeCall").doc(timeSlot);
    const doc = await employeeCall.get();

    if (!doc.exists) {
      return res.status(404).json({ message: "해당 날짜의 호출 요청이 없습니다." });
    }

    const details = doc.data().details || [];

    // 왼쪽부터 일치하는 요청 제거
    const idx = details.findIndex(call =>
      call.tableNumber === tableNumber &&
      JSON.stringify(call.items) === JSON.stringify(items)
    );

    if (idx !== -1) {
      details.splice(idx, 1);
      await employeeCall.set({ details });
      return res.status(200).json({ message: "직원 호출 요청이 완료 처리되었습니다." });
    } else {
      return res.status(404).json({ message: "해당 요청을 찾을 수 없습니다." });
    }
  } catch (err) {
    console.error("직원 호출 완료 처리 실패:", err);
    return res.status(500).json({ message: "직원 호출 완료 실패" });
  }
};

module.exports = {
  callEmployee,
  getEmployeeCalls,
  completeEmployeeCall
};
