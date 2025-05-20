import { createContext, useContext, useEffect, useState } from "react";

const ClockContext = createContext();

export function ClockProvider({ children }) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  return <ClockContext.Provider value={{ time }}>{children}</ClockContext.Provider>;
}

export const useClock = () => useContext(ClockContext);
