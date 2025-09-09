const admin = require("firebase-admin");

let serviceAccount;

if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  // Render 환경 (환경 변수에서 JSON 파싱)
  serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
} else {
  // 로컬 개발 환경 (파일에서 불러옴)
  serviceAccount = require("./firebase-service.json");
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://eskare-ordering-system.firebaseio.com"
});

const db = admin.firestore();
module.exports = db;
