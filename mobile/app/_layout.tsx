import SessionProvider from "@/context/Session/SessionProvider";
import useSessionContext from "@/context/Session/useSessionContext";
import { environment } from "@/lib/environment";
import { SplashScreen, Stack } from "expo-router";
import React, { Suspense } from "react";
import { RelayEnvironmentProvider } from "react-relay";

SplashScreen.preventAutoHideAsync();

export default function _layout() {
  return (
    <RelayEnvironmentProvider environment={environment}>
      <Suspense>
        <SessionProvider>
          <RootNavigator />
        </SessionProvider>
      </Suspense>
    </RelayEnvironmentProvider>
  );
}

function RootNavigator() {
  const { session } = useSessionContext();
  console.log("🚀 ~ RootNavigator ~ session:", session);

  return (
    <Stack>
      <Stack.Protected guard={!!session}>
        <Stack.Screen name="(app)" />
      </Stack.Protected>

      <Stack.Protected guard={!session}>
        <Stack.Screen name="SignIn" />
      </Stack.Protected>
    </Stack>
  );
}
