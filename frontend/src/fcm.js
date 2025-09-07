// 참고 예시 코드
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyCabvckqbfeRjH-UxIqCHbY6y2c9XaC990",
  authDomain: "eskare-ordering-system.firebaseapp.com",
  projectId: "eskare-ordering-system",
  storageBucket: "eskare-ordering-system.firebasestorage.app",
  messagingSenderId: "229823151703",
  appId: "1:229823151703:web:f2807be9bc038ff28eed12",
  measurementId: "G-C8Y7Q3W58J"
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

// 토큰 요청
export async function requestFcmToken(role) {
  try {
    const token = await getToken(messaging, {
      vapidKey: "BJdCupbz3jA_dO4EjpJqDlhmGQjsjS3cfcJj78HL9UaskSwJ3tAwf1xhDQMFO3P4s2MNnPjLMTHw9zae05dLbgg",
    });

    if (token) {
      console.log("FCM 토큰:", token);
      // 서버에 토큰 등록
      await fetch("http://https://eskara-ordering-app.onrender.com/api/fcm/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, token }),
      });
    } else {
      console.warn("FCM 토큰을 얻을 수 없습니다. 권한 필요.");
    }
  } catch (err) {
    console.error("FCM 토큰 요청 실패:", err);
  }
}

// 알림 수신
export function listenToMessages(callback) {
  onMessage(messaging, (payload) => {
    console.log("📲 FCM 메시지:", payload);

    const title = payload.notification?.title || "알림";
    const body = payload.notification?.body || "";

    if (Notification.permission === "granted") {
      new Notification(title, {
        body,
        icon: "/bell.png",
      });
    }

    callback?.(payload);
  });
}
