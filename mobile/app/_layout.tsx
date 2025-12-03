import { environment } from "@/lib/environment";
import { Stack } from "expo-router";
import React from "react";
import { StyleSheet } from "react-native";
import { RelayEnvironmentProvider } from "react-relay";

export default function _layout() {
  return (
    <RelayEnvironmentProvider environment={environment}>
      <Stack>
        <Stack.Screen name="index" />
      </Stack>
    </RelayEnvironmentProvider>
  );
}

const styles = StyleSheet.create({});
