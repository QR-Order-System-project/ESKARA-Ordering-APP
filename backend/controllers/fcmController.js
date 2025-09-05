const db = require("../firebase");

const registerFcmToken = async (req, res) => {
  const { role, token } = req.body;

  if (!role || !token) {
    return res.status(400).json({ message: "role과 token은 필수입니다." });
  }

  try {
    const docRef = db.collection("fcmTokens").doc(role);
    const docSnap = await docRef.get();
    const tokens = docSnap.exists ? docSnap.data().tokens || [] : [];

    if (!tokens.includes(token)) {
      tokens.push(token);
      await docRef.set({ tokens });
    }

    res.status(200).json({ message: "FCM 토큰 등록 성공" });
  } catch (err) {
    console.error("FCM 토큰 등록 오류:", err);
    res.status(500).json({ message: "서버 오류" });
  }
};

module.exports = { registerFcmToken };
