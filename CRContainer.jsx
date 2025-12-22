import { useRef, useEffect, useState } from "react";

export default function CRContainer() {
  const mouseRef = useRef({ x: 0, y: 0 });
  const circlesRef = useRef([]);
  const startTimeRef = useRef(0);
  const [circles, setCircles] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [currentRunTime, setCurrentRunTime] = useState(0);
  const [highestRunTime, setHighestRunTime] = useState(0);
  const [showHelp, setShowHelp] = useState(true);
  const [paused, setPaused] = useState(false); // وضعیت Pause

  const INITIAL_CIRCLE_COUNT = 10;
  const MAX_CIRCLES = 50;
  const MIN_RADIUS = 20;
  const MAX_RADIUS = 60;
  const MIN_SPEED = 2;
  const MAX_SPEED = 8;
  const COLORS = ["#e74c3c", "#f1c40f", "#2ecc71", "#3498db", "#9b59b6", "#e67e22"];
  const SAFE_DISTANCE = 15;
  const GRACE_TIME = 3;

  // موس
  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // کلید Esc برای Pause
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape" && gameStarted && !gameOver) {
        setPaused(!paused);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [paused, gameStarted, gameOver]);

  // خارج شدن موس از کانتینر
  useEffect(() => {
    const handleMouseLeave = () => {
      if (gameStarted && !gameOver) setPaused(true);
    };
    window.addEventListener("mouseout", handleMouseLeave);
    return () => window.removeEventListener("mouseout", handleMouseLeave);
  }, [gameStarted, gameOver]);

  const addCircle = () => {
    const containerWidth = window.innerWidth;
    const containerHeight = window.innerHeight;

    const radius = Math.random() * (MAX_RADIUS - MIN_RADIUS) + MIN_RADIUS;
    const speed = Math.random() * (MAX_SPEED - MIN_SPEED) + MIN_SPEED;
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    const angle = Math.random() * 2 * Math.PI;
    const vx = Math.cos(angle) * speed;
    const vy = Math.sin(angle) * speed;
    const bounce = Math.random() < 0.6;

    let x, y;
    let attempts = 0;
    do {
      x = Math.random() * (containerWidth - radius * 2);
      y = Math.random() * (containerHeight - radius * 2);
      attempts++;
    } while (
      Math.sqrt(Math.pow(mouseRef.current.x - (x + radius), 2) + Math.pow(mouseRef.current.y - (y + radius), 2)) <
        radius + SAFE_DISTANCE &&
      attempts < 100
    );

    circlesRef.current.push({ x, y, r: radius, color, vx, vy, bounce });
    setCircles([...circlesRef.current]);
  };

  const initCircles = () => {
    circlesRef.current = [];
    for (let i = 0; i < INITIAL_CIRCLE_COUNT; i++) addCircle();
  };

  const isMouseOnCircle = (mouse, circle) => {
    const dx = mouse.x - (circle.x + circle.r);
    const dy = mouse.y - (circle.y + circle.r);
    return Math.sqrt(dx * dx + dy * dy) <= circle.r;
  };

  // لوپ بازی
  useEffect(() => {
    if (!gameStarted || gameOver || paused) return;

    let rafId;
    const loop = () => {
      if (gameOver || paused) return;

      const mouse = mouseRef.current;
      const containerWidth = window.innerWidth;
      const containerHeight = window.innerHeight;

      circlesRef.current.forEach((circle) => {
        circle.x += circle.vx;
        circle.y += circle.vy;

        if (circle.bounce) {
          if (circle.x < 0 || circle.x + circle.r * 2 > containerWidth) circle.vx *= -1;
          if (circle.y < 0 || circle.y + circle.r * 2 > containerHeight) circle.vy *= -1;
        } else {
          if (
            circle.x + circle.r * 2 < 0 ||
            circle.x > containerWidth ||
            circle.y + circle.r * 2 < 0 ||
            circle.y > containerHeight
          ) {
            let newX, newY, attempts = 0;
            do {
              newX = Math.random() * (containerWidth - circle.r * 2);
              newY = Math.random() * (containerHeight - circle.r * 2);
              attempts++;
            } while (
              Math.sqrt(Math.pow(mouseRef.current.x - (newX + circle.r), 2) + Math.pow(mouseRef.current.y - (newY + circle.r), 2)) <
                circle.r + SAFE_DISTANCE &&
              attempts < 100
            );

            const angle = Math.random() * 2 * Math.PI;
            const speed = Math.random() * (MAX_SPEED - MIN_SPEED) + MIN_SPEED;
            circle.vx = Math.cos(angle) * speed;
            circle.vy = Math.sin(angle) * speed;
            circle.x = newX;
            circle.y = newY;
            circle.color = COLORS[Math.floor(Math.random() * COLORS.length)];
            circle.r = Math.random() * (MAX_RADIUS - MIN_RADIUS) + MIN_RADIUS;
            circle.bounce = Math.random() < 0.6;
          }
        }

        const elapsed = (Date.now() - startTimeRef.current) / 1000;
        if (elapsed >= GRACE_TIME && isMouseOnCircle(mouse, circle)) setGameOver(true);
      });

      setCircles([...circlesRef.current]);
      rafId = requestAnimationFrame(loop);
    };

    loop();
    return () => cancelAnimationFrame(rafId);
  }, [gameStarted, gameOver, paused]);

  // اضافه کردن دایره و تایمر
  useEffect(() => {
    if (!gameStarted || gameOver || paused) return;

    const circleInterval = setInterval(() => {
      if (circlesRef.current.length < MAX_CIRCLES) addCircle();
    }, 2000);

    const timerInterval = setInterval(() => {
      setCurrentRunTime((t) => t + 0.1);
    }, 100);

    return () => {
      clearInterval(circleInterval);
      clearInterval(timerInterval);
    };
  }, [gameStarted, gameOver, paused]);

  useEffect(() => {
    if (gameOver && currentRunTime > highestRunTime) {
      setHighestRunTime(currentRunTime);
    }
  }, [gameOver]);

  const startGame = () => {
    setGameOver(false);
    setGameStarted(true);
    setPaused(false);
    setCurrentRunTime(0);
    setShowHelp(false);
    initCircles();
    startTimeRef.current = Date.now();
  };

  const restartGame = () => {
    setGameOver(false);
    setPaused(false);
    setCurrentRunTime(0);
    circlesRef.current = [];
    setCircles([]);
    initCircles();
    startTimeRef.current = Date.now();
  };

  return (
    <div style={{ fontFamily: "Vazirmatn" }} dir="rtl" className="relative w-full h-screen overflow-hidden bg-gray-900">
      {/* مودال راهنما */}
      {showHelp && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50 p-4">
          <div className="bg-gray-800 text-white rounded-lg p-6 max-w-lg w-full relative shadow-xl rtl">
            <button
              onClick={() => setShowHelp(false)}
              className="absolute top-3 left-3 text-xl hover:text-red-500 cursor-pointer"
            >
              ✕
            </button>
            <h2 className="text-2xl font-bold mb-4">🎮 راهنمای بازی</h2>
            <ul className="list-decimal list-inside space-y-2 text-lg">
              <li>مراقب باش! موس نباید به دایره‌ها برخورد کنه.</li>
              <li>دایره‌ها هیچ وقت درست روی موس ظاهر نمیشن.</li>
              <li>۳ ثانیه اول بعد از شروع بازی برخورد اهمیتی نداره.</li>
              <li>وقتی از صفحه بازی بری بیرون، زمان استپ می‌شه و بازی متوقف می‌شه.</li>
              <li>با فشردن کلید Esc می‌تونی بازی رو متوقف کنی.</li>
              <li>هرچی بیشتر بازی کنی، دایره‌ها بیشتر و بازی سخت‌تر می‌شه.</li>
              <li>هدف؟ ثبت بیشترین زمان بدون برخورد!</li>
            </ul>
          </div>
        </div>
      )}

      {/* دکمه شروع بازی */}
      {!gameStarted && !showHelp && (
        <button
          onClick={startGame}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
                     bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 px-8 
                     rounded-lg shadow-xl transition duration-300 text-2xl cursor-pointer"
        >
          شروع بازی
        </button>
      )}

      {/* منوی Pause */}
      {paused && !gameOver && (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-black bg-opacity-70 z-50 p-4">
          <div className="bg-gray-800 text-white rounded-lg p-6 max-w-md w-full relative shadow-xl rtl">
            <h2 className="text-3xl font-bold mb-4">⏸️ بازی متوقف شد</h2>
            <button
              onClick={() => setPaused(false)}
              className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-6
                         rounded-lg shadow-lg transition duration-300 text-xl cursor-pointer"
            >
              ادامه بازی
            </button>
          </div>
        </div>
      )}

      {/* تایمر */}
      {gameStarted && !gameOver && !paused && (
        <div className="absolute top-4 left-4 text-white text-xl font-bold">
          زمان: {currentRunTime.toFixed(1)} ثانیه
        </div>
      )}

      {/* دایره‌ها */}
      {circles.map((circle, i) => (
        <div
          key={i}
          className="absolute rounded-full shadow-md"
          style={{
            width: circle.r * 2,
            height: circle.r * 2,
            backgroundColor: circle.color,
            left: circle.x,
            top: circle.y,
          }}
        />
      ))}

      {/* Game Over */}
      {gameOver && (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-black bg-opacity-70 z-50">
          <div className="text-6xl text-red-600 font-extrabold mb-4 animate-pulse">
            !باختی
          </div>
          <div className="text-white text-2xl mb-4">
            زمان شما: {currentRunTime.toFixed(1)} ثانیه
          </div>
          <div className="text-yellow-400 text-xl mb-6">
            بهترین زمان: {highestRunTime.toFixed(1)} ثانیه
          </div>
          <button
            onClick={restartGame}
            className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-6
                       rounded-lg shadow-lg transition duration-300 text-xl cursor-pointer"
          >
            دوباره بازی کن
          </button>
        </div>
      )}
    </div>
  );
}
