"use client";
import { createContext, useContext, useState } from "react";
import ExitFocusPopup from "./ExitFocusPopup";

const FocusContext = createContext(null);

export function FocusProvider({ children }) {
  const [focusMode, setFocusMode] = useState(false);

  const toggleFocusMode = () => setFocusMode((prev) => !prev);

  return (
    <FocusContext.Provider value={{ focusMode, toggleFocusMode }}>
      <ExitFocusPopup />
      {children}
    </FocusContext.Provider>
  );
}

export function useFocusContext() {
  const context = useContext(FocusContext);
  if (!context) throw new Error("useFocusContext must be used within a FocusProvider");
  return context;
}
