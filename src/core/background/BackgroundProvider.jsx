import { createContext, useContext, useEffect, useState } from "react";
const BackgroundContext = createContext();
const DEFAULT_BG = "/images/placeholder.jpg";

export function BackgroundProvider({ children }) {
  const [background, setBackground] = useState(() => {
    return localStorage.getItem("background") || DEFAULT_BG;
  });
  useEffect(() => {
    localStorage.setItem("background", background);
  }, [background]);
  return <BackgroundContext.Provider value={{ background, setBackground }}>{children}</BackgroundContext.Provider>;
}

export const useBackground = () => useContext(BackgroundContext);
