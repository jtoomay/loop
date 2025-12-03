import SessionProvider from "@/context/Session/SessionProvider";
import { environment } from "@/lib/environment";
import { Slot, SplashScreen } from "expo-router";
import React, { Suspense } from "react";
import { RelayEnvironmentProvider } from "react-relay";

SplashScreen.preventAutoHideAsync();

export default function _layout() {
  return (
    <RelayEnvironmentProvider environment={environment}>
      <Suspense>
        <SessionProvider>
          <Slot initialRouteName="(app)" />
        </SessionProvider>
      </Suspense>
    </RelayEnvironmentProvider>
  );
}
