import { createContext, useContext, useState } from "react";
const UserContext = createContext();

export function UserProvider({ children }) {
  const [data, setData] = useState({});
  return <UserContext.Provider value={{ data, setData }}>{children}</UserContext.Provider>;
}

export const useUser = () => useContext(UserContext);
