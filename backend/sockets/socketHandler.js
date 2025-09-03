function socketHandler(io) {
  io.on("connection", (socket) => {
    console.log("클라이언트 연결됨:", socket.id);

    // 결제 완료 (손님 -> 실무단에 알림)
    socket.on("paymentCompleted", ({ tableNumber }) => {
      console.log(`결제 완료 - 테이블 ${tableNumber}`);
      io.emit("refreshTableStatus", { tableNumber }); // 전체 결제 현황 갱신
    });

     // 새 주문 도착 (손님 -> 요리사/서버 화면 갱신)
    socket.on("newOrderPlaced", ({ tableNumber, items }) => {
      console.log(`새 주문 도착 - 테이블 ${tableNumber}`, items);
      io.emit("menuQueueUpdated", { tableNumber, items });
    });

    // 3. 서빙 완료 또는 주문 취소 (실무단 -> 요리사/서버 화면에서 pop)
    socket.on("orderServedOrCanceled", ({ tableNumber, menu }) => {
      console.log(`서빙 완료 또는 주문 취소 - 테이블 ${tableNumber}, 메뉴: ${menu}`);
      io.emit("menuQueuePopped", { tableNumber, menu });
    });

    // 4. 직원 호출 발생 (손님 -> 실무단 화면 표시)
    socket.on("employeeCalled", ({ tableNumber, items }) => {
      console.log(`직원 호출 - 테이블 ${tableNumber}`, items);
      io.emit("employeeCallUpdated", { tableNumber, items });
    });

    // 연결 해제 로그
    socket.on("disconnect", () => {
      console.log("클라이언트 연결 해제:", socket.id);
    });
  });
}

module.exports = socketHandler;
