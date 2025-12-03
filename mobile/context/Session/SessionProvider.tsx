import React, { ReactNode, useMemo } from "react";
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
  return useMemo(() => {
    return {
      session: null,
    };
  }, []);
}

type SessionProviderProps = {
  children: ReactNode;
};

export type SessionContextType = ReturnType<typeof useSession>;
