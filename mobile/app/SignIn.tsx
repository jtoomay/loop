import { router } from "expo-router";
import React from "react";
import { Text, View } from "react-native";

export default function SignIn() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text
        onPress={() => {
          // signIn();
          // Navigate after signing in. You may want to tweak this to ensure sign-in is successful before navigating.
          router.replace("/");
        }}
      >
        Sign In
      </Text>
    </View>
  );
}
