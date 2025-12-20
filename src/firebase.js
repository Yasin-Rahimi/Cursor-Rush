import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, signInAnonymously, onAuthStateChanged } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBfBuxtQ6E7uh-oaAcs4quzfePzaMQS8t8",
  authDomain: "guess-the-name-3b892.firebaseapp.com",
  projectId: "guess-the-name-3b892",
  storageBucket: "guess-the-name-3b892.appspot.com",
  messagingSenderId: "81466211980",
  appId: "1:81466211980:web:58cb41c18449a6a065c5a9",
  measurementId: "G-XREW4M4K8C"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

// UID فعلی کاربر، به محض اینکه Auth آماده شد
export let currentUID = null;

// وقتی Auth تغییر کرد (ورود یا خروج)، UID ذخیره میشه
onAuthStateChanged(auth, (user) => {
  if (user) {
    currentUID = user.uid;
  } else {
    // اگر کاربر ناشناس نباشه، ورود ناشناس می‌کنیم
    signInAnonymously(auth).then(({ user }) => {
      currentUID = user.uid;
    });
  }
});

// تابع گرفتن UID کاربر (صبر می‌کنه Auth آماده بشه)
export async function getUserUID() {
  if (currentUID) return currentUID;
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        currentUID = user.uid;
        resolve(user.uid);
        unsubscribe();
      }
    });
  });
}