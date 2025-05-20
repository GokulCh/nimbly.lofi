import { createContext, useContext, useState } from "react";
const RythemContext = createContext();

export function RythemProvider({ children }) {
  const [score, setScore] = useState(0);
  return <RythemContext.Provider value={{ score, setScore }}>{children}</RythemContext.Provider>;
}

export const useRythem = () => useContext(RythemContext);
