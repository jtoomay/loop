import SessionProvider from "@/context/Session/SessionProvider";
import { environment } from "@/lib/environment";
import { Stack } from "expo-router";
import React from "react";
import { RelayEnvironmentProvider } from "react-relay";

export default function _layout() {
  return (
    <RelayEnvironmentProvider environment={environment}>
      <SessionProvider>
        <Stack>
          <Stack.Screen name="index" />
        </Stack>
      </SessionProvider>
    </RelayEnvironmentProvider>
  );
}
