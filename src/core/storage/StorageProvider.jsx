import { createContext, useContext } from "react";
import { useLocalStorage } from "@uidotdev/usehooks";
const StorageContext = createContext();

export function StorageProvider({ children }) {
  const [store, setStore] = useLocalStorage("app-storage", {});
  return <StorageContext.Provider value={{ store, setStore }}>{children}</StorageContext.Provider>;
}

export const useStorage = () => useContext(StorageContext);
