"use client";

import { createContext, useContext, useState, ReactNode } from 'react';

interface NavigationContextType {
  isNavigating: boolean;
  setIsNavigating: (loading: boolean) => void;
  navigationText: string;
  setNavigationText: (text: string) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export function NavigationProvider({ children }: { children: ReactNode }) {
  const [isNavigating, setIsNavigating] = useState(false);
  const [navigationText, setNavigationText] = useState("Loading...");

  return (
    <NavigationContext.Provider
      value={{
        isNavigating,
        setIsNavigating,
        navigationText,
        setNavigationText,
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
}