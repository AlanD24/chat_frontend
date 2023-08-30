import React, { ReactNode, createContext, useContext, useEffect, useState } from 'react';

interface DarkModeContextProps {
    isDarkMode: boolean;
    toggleDarkMode: () => void;
  }

const DarkModeContext = createContext<DarkModeContextProps | undefined>(undefined);

export const DarkModeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  useEffect(() => {
    const darkMode = localStorage.getItem('darkMode');
    if( darkMode ) {
      (darkMode === 'true') ? setIsDarkMode(true) : setIsDarkMode(false);
    }
  }, [ ]);

  useEffect(() => {
    // Save token when value changes
    localStorage.setItem('darkMode', isDarkMode.toString());
  }, [ isDarkMode ]);

  return (
    <DarkModeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
};

export const useDarkModeContext = (): DarkModeContextProps => {
    const context = useContext(DarkModeContext);
    if (!context) {
      throw new Error('useDarkModeContext must be used within a DarkModeProvider');
    }
    return context;
};