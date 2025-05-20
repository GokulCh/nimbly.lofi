import { createContext, useContext, useState } from "react";
const EffectsContext = createContext();

export function EffectsProvider({ children }) {
  const [intensity, setIntensity] = useState(0.5);
  return <EffectsContext.Provider value={{ intensity, setIntensity }}>{children}</EffectsContext.Provider>;
}

export const useEffects = () => useContext(EffectsContext);
