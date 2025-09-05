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
    socket.on("newOrderPlaced", ({ tableNumber, items }) => {
      log(socket, `새 주문 - 테이블 ${tableNumber}`);
      emitToRoles(["chef", "server", "customer", "staff"], "menuQueueUpdated", { tableNumber, items });
    });

    // 서빙 완료 또는 주문 취소 (서버 -> 요리사/서버 화면 갱신)
    socket.on("orderServedOrCanceled", ({ tableNumber, menu }) => {
      log(socket, `서빙 완료 or 취소 - 테이블 ${tableNumber}, 메뉴: ${menu}`);
      emitToRoles(["chef", "server"], "menuQueuePopped", { tableNumber, menu });
    });

    // 주문 취소 (서버 -> 요리사/서버/손님/실무단 화면)
    socket.on("orderCanceled", ({ tableNumber, items }) => {
      log(socket, `주문 취소 - 테이블 ${tableNumber}`);
      emitToRoles(["chef", "server", "customer", "staff"], "orderCancellationUpdated", { tableNumber, items });
    });

    // 직원 호출 (손님 -> 서버)
    socket.on("employeeCalled", ({ tableNumber, items }) => {
      log(socket, `직원 호출 - 테이블 ${tableNumber}`);
      emitToRoles(["server"], "employeeCallUpdated", { tableNumber, items });
    });

    // 직원 호출 처리 완료 (서버 -> 서버 화면에서 제거)
    socket.on("employeeCallHandled", ({ tableNumber, items }) => {
      log(socket, `호출 처리 완료 - 테이블 ${tableNumber}`);
      emitToRoles(["server"], "employeeCallPopped", { tableNumber, items });
    });

    // 결제 활성화 (실무단 -> 손님 화면)
    socket.on("activatePayment", ({ tableNumber }) => {
      log(socket, `결제 활성화 - 테이블 ${tableNumber}`);
      emitToRoles(["customer"], "paymentActivated", { tableNumber });
    });

    // 결제 비활성화 (실무단 -> 손님 화면)
    socket.on("deactivatePayment", ({ tableNumber }) => {
      log(socket, `결제 비활성화 - 테이블 ${tableNumber}`);
      emitToRoles(["customer"], "paymentDeactivated", { tableNumber });
    });

    // 결제 완료 (실무단 확인 -> 실무단, 손님 화면 갱신)
    socket.on("paymentCompleted", ({ tableNumber }) => {
      log(socket, `결제 완료 - 테이블 ${tableNumber}`);
      emitToRoles(["staff", "customer"], "refreshTableStatus", { tableNumber });
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
