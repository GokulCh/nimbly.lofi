"use client";

import { useFocusContext } from "./FocusProvider";

export default function ExitFocusPopup() {
  const { focusMode, toggleFocusMode } = useFocusContext();

  return (
    <div
      className={`fixed inset-0 z-10 flex items-center justify-center transition-opacity duration-500 ease-in-out ${
        focusMode ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <button
        onClick={toggleFocusMode}
        className="absolute top-8 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/30 backdrop-blur-md border border-white/10 rounded-lg text-white/80 hover:text-white transition-all duration-500 ease-in-out hover:bg-black/40 transform hover:translate-y-1 shadow-lg"
      >
        Exit focus mode
      </button>
    </div>
  );
}
