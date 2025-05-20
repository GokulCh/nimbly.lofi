import { createContext, useContext, useEffect, useState } from "react";
const BackgroundContext = createContext();
const DEFAULT_BG = "/images/placeholder_background_shoji.png";

export function BackgroundProvider({ children }) {
  const [background, setBackground] = useState(() => {
    return DEFAULT_BG;
  });
  useEffect(() => {
    localStorage.setItem("background", background);
  }, [background]);
  return <BackgroundContext.Provider value={{ background, setBackground }}>{children}</BackgroundContext.Provider>;
}

export const useBackground = () => useContext(BackgroundContext);
