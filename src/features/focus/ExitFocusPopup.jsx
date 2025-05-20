"use client";

import { useEffect, useState } from "react";
import HoverButton from "../../components/ui/HoverButton";
import { useFocus } from "./FocusProvider";

function ExitFocusPopup() {
  const [fadeIn, setFadeIn] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setFadeIn(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const { focusMode, toggleFocusMode } = useFocus();

  return (
    <>
      <HoverButton
        className={`absolute top-6 left-1/2 -translate-x-1/2 px-4 py-2 ${
          focusMode ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={toggleFocusMode}
      >
        Exit focus mode
      </HoverButton>
    </>
  );
}

export default ExitFocusPopup;
