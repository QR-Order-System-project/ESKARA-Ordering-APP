const admin = require("firebase-admin");
const db = require("../firebase");

async function sendFCMToRole(role, title, body, data = {}) {
  const doc = await db.collection("fcmTokens").doc(role).get();
  if (!doc.exists) return;

  const tokens = doc.data().tokens || [];

  if (tokens.length === 0) return;

  const message = {
    tokens,
    notification: { title, body },
    data,
  };

  try {
    const response = await admin.messaging().sendEachForMulticast(message);
    console.log(`[FCM] ${role}에게 푸시 전송: 성공 ${response.successCount}, 실패 ${response.failureCount}`);
  } catch (err) {
    console.error("[FCM] 전송 실패:", err);
  }
}

module.exports = { sendFCMToRole };
