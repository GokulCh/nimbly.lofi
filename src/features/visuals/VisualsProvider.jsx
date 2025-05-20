import { createContext, useContext, useState } from "react";
const VisualsContext = createContext();

export function VisualsProvider({ children }) {
  const [visual, setVisual] = useState("none");
  return <VisualsContext.Provider value={{ visual, setVisual }}>{children}</VisualsContext.Provider>;
}

export const useVisuals = () => useContext(VisualsContext);
