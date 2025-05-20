import { createContext, useContext, useState, useEffect } from "react";
const BackgroundFeatureContext = createContext();

export function BackgroundProvider({ children }) {
  const [bg, setBg] = useState("default");
  useEffect(() => {
    const stored = localStorage.getItem("custom-bg");
    if (stored) setBg(stored);
  }, []);
  useEffect(() => {
    localStorage.setItem("custom-bg", bg);
  }, [bg]);
  return <BackgroundFeatureContext.Provider value={{ bg, setBg }}>{children}</BackgroundFeatureContext.Provider>;
}

export const useFeatureBackground = () => useContext(BackgroundFeatureContext);
