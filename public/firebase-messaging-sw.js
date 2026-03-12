importScripts(
  "https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js",
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js",
);

firebase.initializeApp({
  apiKey: "AIzaSyAhMdGNw2lg0YjLngYSrbPoftbajDWULvg",
  authDomain: "popcornpicks-dc093.firebaseapp.com",
  projectId: "popcornpicks-dc093",
  messagingSenderId: "763904105662",
  appId: "1:763904105662:web:5a8278e3145b06b674d2ef",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: "/icon.png",
  });
});
