importScripts("https://www.gstatic.com/firebasejs/9.2.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.2.0/firebase-messaging-compat.js");

const firebaseConfig = {
  apiKey: "AIzaSyCabvckqbfeRjH-UxIqCHbY6y2c9XaC990",
  authDomain: "eskare-ordering-system.firebaseapp.com",
  projectId: "eskare-ordering-system",
  storageBucket: "eskare-ordering-system.firebasestorage.app",
  messagingSenderId: "229823151703",
  appId: "1:229823151703:web:f2807be9bc038ff28eed12",
  measurementId: "G-C8Y7Q3W58J"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log("백그라운드 메시지가 수신되었습니다: ", payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/logo192.png'
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});