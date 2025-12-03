import Login from "@/features/join/components/Login";
import SignUp from "@/features/join/components/SignUp";
import React, { Dispatch, SetStateAction, useState } from "react";
import { View } from "react-native";

export default function Index() {
  const [signUp, setSignUp] = useState(false);
  return (
    <View style={{ backgroundColor: "#0369a1", width: "100%", flex: 1 }}>
      {signUp ? (
        <SignUp setSignUp={setSignUp} />
      ) : (
        <Login setSignUp={setSignUp} />
      )}
    </View>
  );
}

export type SignInCardProps = {
  setSignUp: Dispatch<SetStateAction<boolean>>;
};
