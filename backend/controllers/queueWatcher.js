const db = require("../firebase");

const initMenuQueueWatcher = () => {
  const docRef = db.collection("queues").doc("menuQueue");

  docRef.onSnapshot((doc) => {
    if (!doc.exists) return;

    const data = doc.data();
    console.log("📡 menuQueue 변경 감지:", data);

    // 직원 OrderTab 갱신 이벤트
    global.io.emit("menuQueueUpdated", data);
  });
};

module.exports = { initMenuQueueWatcher };