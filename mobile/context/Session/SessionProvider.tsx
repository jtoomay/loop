import { SessionProviderQuery } from "@/gql/SessionProviderQuery.graphql";
import { SplashScreen } from "expo-router";
import React, { ReactNode, useMemo } from "react";
import { graphql, useLazyLoadQuery } from "react-relay";
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
  const { session } = useLazyLoadQuery<SessionProviderQuery>(
    graphql`
      query SessionProviderQuery {
        session {
          id
          token
        }
      }
    `,
    {}
  );

  // Hide the splash screen
  SplashScreen.hide();

  return useMemo(() => {
    return {
      session,
    };
  }, [session]);
}

type SessionProviderProps = {
  children: ReactNode;
};

export type SessionContextType = ReturnType<typeof useSession>;
