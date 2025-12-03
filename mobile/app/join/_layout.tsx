import useSessionContext from "@/context/Session/useSessionContext";
import { Redirect, Stack } from "expo-router";
import React from "react";

export default function Layout() {
  const { session } = useSessionContext();
  console.log("🚀 ~ Layout ~ session:", session);

  if (session) return <Redirect href="/(app)" />;
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
}
