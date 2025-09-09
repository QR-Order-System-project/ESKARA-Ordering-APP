import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "./styles/responsive.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// 🔧 서비스워커 관리
if ("serviceWorker" in navigator) {
  // 로컬에서 등록된 SW 자동 제거
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    registrations.forEach((registration) => {
      const swUrl = registration.active?.scriptURL || "";
      if (swUrl.includes("localhost")) {
        console.log("로컬 서비스워커 제거:", swUrl);
        registration.unregister();
      }
    });
  });

  // 배포 환경일 때만 SW 등록
  if (process.env.NODE_ENV === "production") {
    navigator.serviceWorker
      .register("/firebase-messaging-sw.js")
      .then(function (registration) {
        console.log("서비스 워커가 성공적으로 등록되었습니다:", registration);
      })
      .catch(function (err) {
        console.error("서비스 워커 등록에 실패했습니다:", err);
      });
  }
}

// CRA 기본 성능 리포트
reportWebVitals();
