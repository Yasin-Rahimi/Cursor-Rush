// src/services/scoreService.js
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db, auth, getUserUID } from "../../firebase";
import {
    query,
    orderBy,
    limit,
    getDocs
} from "firebase/firestore";
import {
    collection,
    deleteDoc,
} from "firebase/firestore";

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

export async function getLeaderboard(top = 10) {
try {
    const q = query(
    collection(db, "leaderboard"),
    orderBy("score", "desc"),
    limit(top)
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
    }));
} catch (err) {
    console.error("Error loading leaderboard:", err);
    return [];
}
}


  export async function cleanInvalidScores() {
    const colRef = collection(db, "leaderboard");
    const snapshot = await getDocs(colRef);
  
    let deletedCount = 0;
  
    for (const d of snapshot.docs) {
      const data = d.data();
  
      if (typeof data.score !== "number") {
        await deleteDoc(doc(db, "leaderboard", d.id));
        deletedCount++;
      }
    }
  
    console.log(`🧹 Cleaned ${deletedCount} invalid documents`);
  }
  