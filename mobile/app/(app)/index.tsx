import useSessionContext from "@/context/Session/useSessionContext";
import React from "react";
import { Text, View } from "react-native";

export default function Index() {
  const { session } = useSessionContext();
  return (
    <View>
      <Text>{session.id}</Text>
    </View>
  );
}
