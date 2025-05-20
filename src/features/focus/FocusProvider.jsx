import { createContext, useContext, useState } from "react";
const FocusContext = createContext();

export function FocusProvider({ children }) {
  const [focusMode, setFocusMode] = useState(false);
  return <FocusContext.Provider value={{ focusMode, setFocusMode }}>{children}</FocusContext.Provider>;
}

export const useFocus = () => useContext(FocusContext);
