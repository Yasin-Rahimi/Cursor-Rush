import { useState, useEffect, useRef } from "react";
export default function GNGInput({ onGuess, disabled, cleanInput }) {
  const [input, setInput] = useState("");
  const inputRef = useRef(null);
  useEffect(() => {
    if (cleanInput) {
      setInput("");
    }
  }, [cleanInput]);
  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() && !disabled) {
      onGuess(input.trim().toLowerCase());
      setInput("");
    }
  };
  const handleChange = (e) => {
    const value = e.target.value;
    if (value.length <= 1) {
      setInput(value);
      if (value.length === 1 && !disabled) {
        onGuess(value.toLowerCase());
        setTimeout(() => setInput(""), 100);
      }
    }
  };
  return (
    <form onSubmit={handleSubmit} className="w-full flex justify-center mb-2">
      <input
        ref={inputRef}
        type="text"
        value={input}
        onChange={handleChange}
        disabled={disabled}
        placeholder={disabled ? "" : "Type a letter..."}
        className={`
          w-full max-w-[500px] h-[60px]
          text-2xl text-center font-bold
          border-3 rounded-2xl
          transition-all duration-200 ease-in-out
          ${disabled
            ? 'bg-gray-100 border-gray-300 cursor-not-allowed opacity-60'
            : 'bg-white border-gray-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 focus:outline-none'
          }
          sm:h-[50px] sm:text-xl
          placeholder:text-gray-400 placeholder:font-normal
        `}
        style={{ fontFamily: "Vazirmatn, sans-serif" }}
      />
    </form>
  );
}