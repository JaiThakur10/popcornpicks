import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyAhMdGNw2lg0YjLngYSrbPoftbajDWULvg",
  authDomain: "popcornpicks-dc093.firebaseapp.com",
  projectId: "popcornpicks-dc093",
  storageBucket: "popcornpicks-dc093.firebasestorage.app",
  messagingSenderId: "763904105662",
  appId: "1:763904105662:web:5a8278e3145b06b674d2ef",
};

export const app = initializeApp(firebaseConfig);

export const messaging =
  typeof window !== "undefined" ? getMessaging(app) : null;

export { getToken, onMessage };
