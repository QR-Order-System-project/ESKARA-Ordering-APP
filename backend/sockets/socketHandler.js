const { sendFCMToRole } = require("../utils/fcmUtils");

function socketHandler(io) {
  const roleSockets = {
    customer: new Set(),
    chef: new Set(),
    server: new Set(),
    staff: new Set(),
  };

  io.on("connection", (socket) => {
    socket.role = null; // 역할 초기화

    console.log(`[${socket.id}] 클라이언트 연결됨`);

    // (1) 역할 등록
    socket.on("registerRole", (role) => {
      if (!["customer", "chef", "server", "staff"].includes(role)) {
        console.log(`[${socket.id}] 잘못된 역할: ${role}`);
        return;
      }
      socket.role = role;
      roleSockets[role].add(socket);
      console.log(`[${socket.id}] 역할 등록: ${role}`);
    });

    // 새 주문 (손님 -> 요리사/서버/실무단/손님 화면 갱신)
    // order 저장, menuQueue 저장, order 보여주기, menuQueue 보여주기
    socket.on("newOrderPlaced", async ({ tableNumber, items }) => {
      log(socket, `새 주문 - 테이블 ${tableNumber}`);
      emitToRoles(["chef", "server", "customer", "staff"], "menuQueueUpdated", { tableNumber, items });

      // 주문 메뉴 이름 추출
      const itemNames = items.map(item => item.menu).join(", ");

      // FCM 푸시 알림
      const message = `테이블 ${tableNumber}에서 주문: ${itemNames}`;
      await sendFCMToRole("chef", "새 주문 도착", message);
      await sendFCMToRole("server", "새 주문 도착", message);
    });

    // 요리 완료 (서버 -> 요리사/서버 화면 갱신)
    // menuQueue 삭제, menuQueue 보여주기
    socket.on("orderServedOrCanceled", () => {
      log(socket, `요리 완료`);
      emitToRoles(["chef", "server"], "menuQueuePopped", { tableNumber, menu });
    });

    // 주문 취소 (서버 -> 요리사/서버/손님/실무단 화면)
    // order 수정, menuQueue 삭제, order 보여주기, menuQueue 보여주기
    socket.on("orderCanceled", () => {
      log(socket, `주문 취소`);
      emitToRoles(["chef", "server", "customer", "staff"], "orderCancellationUpdated", {});
    });

    // 직원 호출 (손님 -> 서버)
    // callEmployee at employeeCallController.js
    socket.on("employeeCalled", async ({ tableNumber, items }) => {
      log(socket, `직원 호출 - 테이블 ${tableNumber}`);
      emitToRoles(["server"], "employeeCallUpdated", { tableNumber, items });

      // FCM 푸시 알림
      await sendFCMToRole("server", "직원 호출 발생", `테이블 ${tableNumber}에서 호출이 발생했습니다.`);
    });

    // 직원 호출 처리 완료 (서버 -> 서버 화면에서 제거)
    // completeEmployeeCall at employeeCallController.js    
    socket.on("employeeCallHandled", () => {
      log(socket, `호출 처리 완료`);
      emitToRoles(["server"], "employeeCallPopped", {});
    });

    // 결제 활성화 (실무단 -> 손님 화면)
    // setGlobalPaymentEnable at paymentController.js
    socket.on("activatePayment", () => {
      log(socket, `결제 활성화 `);
      emitToRoles(["customer"], "paymentActivated", {});
    });

    // 결제 비활성화 (실무단 -> 손님 화면)
    // setGlobalPaymentEnable at paymentController.js
    socket.on("deactivatePayment", () => {
      log(socket, `결제 비활성화 `);
      emitToRoles(["customer"], "paymentDeactivated", {});
    });

    // 결제 완료 (실무단 확인 -> 실무단, 손님 화면 갱신)
    // finalizePayment at paymentController.js
    socket.on("paymentCompleted", () => {
      log(socket, `결제 완료`);
      emitToRoles(["staff", "customer"], "refreshTableStatus", {});
    });

    // 연결 해제
    socket.on("disconnect", () => {
      if (socket.role) {
        roleSockets[socket.role].delete(socket);
        console.log(`[${socket.id}] 연결 해제 (${socket.role})`);
      } else {
        console.log(`[${socket.id}] 연결 해제 (역할 미등록)`);
      }
    });
  });

  // 도우미 함수 - 역할별 emit
  function emitToRoles(roles, eventName, payload) {
    roles.forEach((role) => {
      roleSockets[role].forEach((s) => {
        s.emit(eventName, payload);
      });
    });
  }

  // 도우미 함수 - 로그 출력
  function log(socket, message) {
    const role = socket.role || "미등록";
    console.log(`[${socket.id}] (${role}) ${message}`);
  }
}

module.exports = socketHandler;
