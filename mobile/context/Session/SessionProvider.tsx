import { authService } from "@/lib/auth";
import { SplashScreen } from "expo-router";
import React, { ReactNode, useEffect, useMemo, useState } from "react";
import SessionContext from "./SessionContext";

export default function SessionProvider({ children }: SessionProviderProps) {
  const session = useSession();
  return (
    <SessionContext.Provider value={session}>
      {children}
    </SessionContext.Provider>
  );
}

function useSession() {
  const [hasSession, setHasSession] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkSession = async () => {
      const hasSession = await authService.isAuthenticated();
      setHasSession(hasSession);
      setIsLoading(false);
      // Hide the splash screen
      SplashScreen.hide();
    };

    checkSession();
  }, []);

  return useMemo(() => {
    return { hasSession, setHasSession, isLoading };
  }, [hasSession, isLoading]);
}

type SessionProviderProps = {
  children: ReactNode;
};

export type SessionContextType = ReturnType<typeof useSession>;
