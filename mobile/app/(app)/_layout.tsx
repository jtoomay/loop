import useSessionContext from "@/context/Session/useSessionContext";
import { Redirect, Stack } from "expo-router";
import React from "react";

export default function Layout() {
  const { id } = useSessionContext();

  if (!id) return <Redirect href="/join" />;

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
}
