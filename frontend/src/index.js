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

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/firebase-messaging-sw.js')
    .then(function(registration) {
      console.log('서비스 워커가 성공적으로 등록되었습니다:', registration);
    }).catch(function(err) {
      console.error('서비스 워커 등록에 실패했습니다:', err);
    });
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
