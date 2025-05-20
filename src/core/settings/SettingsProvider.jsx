import { createContext, useContext, useState } from "react";
const SettingsContext = createContext();

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState({ volume: 70, blur: false });
  return <SettingsContext.Provider value={{ settings, setSettings }}>{children}</SettingsContext.Provider>;
}

export const useSettings = () => useContext(SettingsContext);
