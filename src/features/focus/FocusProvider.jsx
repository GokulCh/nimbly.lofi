import { createContext, useContext, useState } from "react";
const FocusContext = createContext();

export function FocusProvider({ children }) {
  const [focusMode, setFocusMode] = useState(false);
  const toggleFocusMode = () => setFocusMode((prev) => !prev);
  return <FocusContext.Provider value={{ focusMode, toggleFocusMode }}>{children}</FocusContext.Provider>;
}

export const useFocus = () => useContext(FocusContext);
