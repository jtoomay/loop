import useSessionContext from "@/context/Session/useSessionContext";
import { Redirect, Stack } from "expo-router";
import React from "react";

export default function Layout() {
  const { hasSession } = useSessionContext();

  if (!hasSession) return <Redirect href="/join" />;

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
}
