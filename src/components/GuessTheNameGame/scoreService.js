// src/services/scoreService.js
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db, auth, getUserUID } from "../../firebase";

/**
 * تابع ذخیره یا آپدیت امتیاز کاربر
 * @param {number} score امتیاز جدید
 * @param {string} category دسته‌بندی انتخاب شده
 * @param {string} level سطح انتخاب شده
 * @param {string} lang زبان انتخاب شده ("en" یا "fa")
 */
export async function saveScore(score, category, level, lang) {
  try {
    const uid = auth.currentUser?.uid || (await getUserUID());
    const docRef = doc(db, "leaderboard", uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      // آپدیت رکورد قبلی
      await updateDoc(docRef, {
        score: score,
        category,
        level,
        lang,
        updatedAt: serverTimestamp()
      });
    } else {
      // ایجاد رکورد جدید
      await setDoc(docRef, {
        score,
        category,
        level,
        lang,
        createdAt: serverTimestamp(),
        updatedAt: null
      });
    }
    console.log("Score saved successfully!");
  } catch (err) {
    console.error("Error saving score:", err);
  }
}

/**
 * گرفتن امتیاز فعلی کاربر
 */
export async function getCurrentScore() {
  try {
    const uid = auth.currentUser?.uid || (await getUserUID());
    const docRef = doc(db, "leaderboard", uid);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data().score: null;
  } catch (err) {
    console.error("Error getting score:", err);
    return null;
  }
}

export async function resetScore() {
  const uid = auth.currentUser.uid;

  await setDoc(
    doc(db, "leaderboard", uid),
    { score: 0 },
    { merge: true } // اگه سند بود فقط score رو تغییر می‌ده
  );

  console.log("Score reset to 0");
}
