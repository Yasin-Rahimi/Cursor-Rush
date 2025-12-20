import { useState, useEffect, useRef } from "react";
import { v4 } from "uuid";

import GNGInput from "./GNGInput";
import GNGCards from "./GNGCards";
import GNGCategory from "./GNGCategory";
import GNGLevel from "./GNGLevel";
import { words } from "./WordsBank.jsx";
import bgMusicFile from "./assets/bgMusicFile.mp3";
import successSoundFile from "./assets/successSoundFile.mp3";
import gameOverSoundFile from "./assets/gameOverSoundFile.mp3";
import { auth, getUserUID } from "../../firebase";
import { saveScore, getCurrentScore, resetScore, getLeaderboard, cleanInvalidScores } from "./scoreService.js";
import GNGSideBar from "./GNGSideBar.jsx";

export default function GNGContainer() {

  const [uid, setUid] = useState(null);
  const [randomWord, setRandomWord] = useState("");
  const [lettersList, setLettersList] = useState([]);
  const [wrongLetters, setWrongLetters] = useState([]);
  const [disabledInput, setDisabledInput] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [lang, setLang] = useState("en");
  const [categoryShow, setCategoryShow] = useState(true);
  const [category, setCategory] = useState("");
  const [isMuted, setIsMuted] = useState(false);
  const [cleanInput, setCleanInput] = useState(false);
  const [level, setLevel] = useState();
  const [levelShow, setLevelShow] = useState(false);
  const [inMiddle, setInMiddle] = useState(false);
  const [perfectBonus, setPerfectBonus] = useState(false);
  const [currentScore, setCurrentScore] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const WORDS =
    category?.en && level
      ? lang === "en"
        ? words.en[category.en][level]
        : words.fa[category.en][level]
      : [];

  const LEVEL_LABEL = {
    en: { easy: "Easy", medium: "Medium", hard: "Hard" },
    fa: { easy: "آسان", medium: "متوسط", hard: "سخت" }
  };

  const bgAudioRef = useRef(null);
  const successSoundRef = useRef(null);
  const gameOverSoundRef = useRef(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setUid(user.uid);
        console.log("User UID:", user.uid);
      } else {
        const anonUID = await getUserUID();
        setUid(anonUID);
        console.log("Anonymous UID:", anonUID);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!uid) return;
  
    getCurrentScore().then(score => {
      setCurrentScore(score || 0);
    });
  }, [uid]);
  

  useEffect(() => {
    bgAudioRef.current = new Audio(bgMusicFile);
    bgAudioRef.current.loop = true;
    bgAudioRef.current.volume = 0.2;

    successSoundRef.current = new Audio(successSoundFile);
    successSoundRef.current.volume = 0.4;

    gameOverSoundRef.current = new Audio(gameOverSoundFile);
    gameOverSoundRef.current.volume = 0.4;
  }, []);

  const playBgMusic = () => {
    if (bgAudioRef.current && bgAudioRef.current.paused) {
      bgAudioRef.current.play().catch(() => {});
    }
  };

  const toggleMute = () => {
    setIsMuted(prev => !prev);
    const newMuted = !isMuted;
    if (bgAudioRef.current) bgAudioRef.current.muted = newMuted;
    if (successSoundRef.current) successSoundRef.current.muted = newMuted;
    if (gameOverSoundRef.current) gameOverSoundRef.current.muted = newMuted;
  };

  const handleCategoryClicked = (value) => {
    setCategory(value);
    setCategoryShow(false);
    if (!inMiddle) setLevelShow(true);
  };

  const handleCategoryChanged = () => {
    setCategoryShow(true);
    resetFromBeginning();
  };

  const handleLevelClicked = (level) => {
    setLevel(level);
    setLevelShow(false);
    setInMiddle(true);
  };

  const handleLevelChanged = () => {
    setLevelShow(true);
    resetFromBeginning();
  };

  const selectWord = () => {
    resetFromBeginning();
    playBgMusic();
    const randomWord = WORDS[Math.floor(Math.random() * WORDS.length)];
    setRandomWord(randomWord);

    const letters = randomWord.split("").filter(letter => letter !== "\u200C").map(letter => ({
      letter,
      shown: letter === " " ? true : false,
      isSpace: letter === " " ? true : false,
      id: v4()
    }));
    setLettersList(letters);
  };

  const resetFromBeginning = () => {
    setLettersList([]);
    setWrongLetters([]);
    setDisabledInput(false);
    setIsGameOver(false);
    setCleanInput(true);
    setTimeout(() => setCleanInput(false), 0);
  };

  const getCharLang = (char) => {
    if (/^[a-zA-Z]$/.test(char)) return "en";
    if (/^[\u0600-\u06FF]$/.test(char)) return "fa";
    return "invalid";
  };

  const handleGuess = (letter) => {
    if (getCharLang(letter) === lang) {
      if (lettersList.some(item => item.letter === letter)) {
        setLettersList(prev =>
          prev.map(item => (item.letter === letter ? { ...item, shown: true } : item))
        );
      } else {
        setWrongLetters(prev =>
          prev.includes(letter) ? prev : [...prev, letter]
        );
      }
    } else {
      alert(
        lang === "en"
          ? "Please enter a valid letter for the selected language."
          : "لطفاً یک حرف معتبر برای زبان انتخاب شده وارد کنید."
      );
    }
  };

  const handleLangClick = () => {
    setLang(lang === "en" ? "fa" : "en");
    resetFromBeginning();
  };

  useEffect(() => {
    if (!lettersList.length || !uid) return;

    const uniqueLetters = [...new Set(lettersList.map(l => l.letter))];
    const shownLetters = lettersList.filter(l => l.shown).map(l => l.letter);
    const isWin = uniqueLetters.every(l => shownLetters.includes(l));

    if (isWin) {
      setDisabledInput(true);
      successSoundRef.current?.play().catch(() => {});
    
      const wrongAnswers = wrongLetters.length;
      const bonus = wrongAnswers === 0;
      setPerfectBonus(bonus); // <-- اینجا state رو آپدیت می‌کنیم
    
      getCurrentScore().then(score => {
        let updatedScore
        if (level === 'hard') updatedScore = score + (30 * (bonus ? 2 : 1));
        else if (level === 'medium') updatedScore = score + (20 * (bonus ? 2 : 1));
        else if (level === 'easy') updatedScore = score + (10 * (bonus ? 2 : 1));

        saveScore(updatedScore, category.en, level, lang);
        setCurrentScore(updatedScore);
        getLeaderboard().then(data => {
          console.log(data)
        })
        
      });
    }

    if (wrongLetters.length >= lettersList.length) {
      setIsGameOver(true);
      setDisabledInput(true);
      gameOverSoundRef.current?.play().catch(() => {});
      // resetScore()
    }
  }, [lettersList, wrongLetters, uid]);


  return (
    <>
      {/* Category Modal */}
      {categoryShow && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-2xl border border-gray-200 dark:border-gray-700 w-80 sm:w-96 text-center">
            <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-6">
              {lang === "en" ? "Choose a Category" : "دسته‌بندی را انتخاب کنید"}
            </h2>
            <GNGCategory onClick={handleCategoryClicked} />
          </div>
        </div>
      )}

      {/* Level Modal */}
      {levelShow && <GNGLevel onClick={handleLevelClicked} />}
    <div dir={lang === "fa" ? "rtl" : "ltr"} className="pl-2 pr-2 min-h-screen flex flex-col items-center justify-start bg-gradient-to-b from-indigo-100 via-blue-50 to-blue-100 py-6">



    <div className="flex flex-col items-center w-full max-w-4xl px-4 sm:px-0 space-y-6">

      {/* Header */}
      <h1
        className="text-center text-4xl md:text-5xl font-extrabold text-indigo-700 dark:text-indigo-400 mb-2 drop-shadow-lg animate-fade-in"
        style={{ fontFamily: "Vazirmatn" }}
      >
        {lang === "en" 
          ? category.en ? `Guess ${category.en}` : `Guess the word game`
          : category.fa ? `حدس ${category.fa}` : "بازی حدس کلمه"
        }
      </h1>

      {/* Level Subtitle */}
      <p
        className="text-center text-lg md:text-xl font-semibold text-indigo-600 dark:text-indigo-300 mb-2 animate-fade-in delay-100"
        style={{ fontFamily: "Vazirmatn" }}
      >
        {lang === "en" ? `Difficulty: ${LEVEL_LABEL.en[level]}` : `سطح: ${LEVEL_LABEL.fa[level]}`}
      </p>

      {/* Score Card */}
      <div
        className="relative w-full max-w-md p-5 rounded-3xl bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500 shadow-2xl text-white font-bold text-xl flex items-center justify-center gap-3 hover:scale-105"
        style={{ fontFamily: "Vazirmatn" }}
      >
        {lang === "en" ? "Score:" : "امتیاز:"} {currentScore}
        
        {perfectBonus && lettersList.every(l => l.shown) && (
          <span className="ml-3 text-yellow-300 font-extrabold animate-bounce drop-shadow-lg">
            {lang === 'en' ? '★ Perfect!' : '★ بدون اشتباه!'}
          </span>
        )}
      </div>

      {/* Select Word Button */}
      <button
        onClick={selectWord}
        className="bg-emerald-500 hover:bg-emerald-600  mb-4 text-white py-3 px-8 font-bold rounded-2xl shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl text-lg animate-fade-in delay-200"
        style={{ fontFamily: "Vazirmatn" }}
      >
        {lang === "en" ? "Select Word" : "انتخاب کلمه"}
      </button>

      </div>



      {/* Sidebar */}
      <button
        onClick={() => setIsSidebarOpen(prev => !prev)}
        className="fixed top-[20px] left-4 z-60 bg-purple-600 text-white p-3 rounded-full shadow-lg"
      >
        {isSidebarOpen ? "⮜" : "⮞"}
      </button>

      {/* Sidebar Overlay */}
      <GNGSideBar
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        lang={lang}
        toggleLang={handleLangClick}
        toggleMute={toggleMute}
        isMuted={isMuted}
        handleCategoryChanged={handleCategoryChanged}
        handleLevelChanged={handleLevelChanged}
      />



      {/* Game Area */}
      {lettersList.length > 0 && (
        <div className="flex flex-col items-center w-full max-w-4xl px-4 sm:px-0">
          <GNGInput cleanInput={cleanInput} onGuess={handleGuess} disabled={disabledInput} />
          <GNGCards lettersList={lettersList} wrongLetters={wrongLetters} />

          {lettersList.every(item => item.shown) && (
            <p className="text-center text-green-600 font-extrabold text-3xl mt-6 animate-pulse drop-shadow-lg" style={{ fontFamily: "Vazirmatn" }}>
              {lang === "en" ? "🎉 Congratulations! You've guessed the word. 🎉" : "🎉 آفرین! کلمه رو درست حدس زدی. 🎉"}
            </p>
          )}

          {isGameOver && (
            <p className="text-center text-red-600 font-extrabold text-3xl mt-6 animate-pulse drop-shadow-lg" style={{ fontFamily: "Vazirmatn" }}>
              {lang === "en" ? (
                <>❌ Game Over! The word: <span className="text-red-500 text-4xl font-extrabold">{randomWord}</span></>
              ) : (
                <>❌ تلاشات تموم شد! کلمه درست: <span className="text-red-500 text-4xl font-extrabold">{randomWord}</span></>
              )}
            </p>
          )}
        </div>
      )}
    </div>
    </>
  );
}