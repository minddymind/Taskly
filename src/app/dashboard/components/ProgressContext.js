import { createContext, useState } from "react";

export const ProgressContext = createContext();

export const ProgressProvider = ({ children }) => {
  const [progressUpdate, setProgressUpdate] = useState(false);

  return (
    <ProgressContext.Provider value={{ progressUpdate, setProgressUpdate }}>
      {children}
    </ProgressContext.Provider>
  );
};