import { SignInCardProps } from "@/app/join";
import React, { useState } from "react";
import {
  Keyboard,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

export default function Login({ setSignUp }: SignInCardProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View
        style={{
          alignItems: "center",
          marginTop: "60%",
          width: "100%",
          flex: 1,
        }}
      >
        <Text style={{ fontSize: 40, fontWeight: 700, color: "#e0f2fe" }}>
          Sign In
        </Text>
        <View
          style={{
            marginTop: 25,
            width: "100%",
            flex: 1,
            padding: 50,
            gap: 50,
          }}
        >
          <View style={{ gap: 15 }}>
            <View style={{ gap: 10 }}>
              <Text style={{ color: "#e0f2fe" }}>Email</Text>
              <TextInput
                style={{
                  width: "100%",
                  backgroundColor: "#e0f2fe",
                  height: 45,
                  borderRadius: 10,
                  padding: 10,
                  color: "black",
                }}
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email..."
                placeholderTextColor="black"
              />
            </View>
            <View style={{ gap: 10 }}>
              <Text style={{ color: "#e0f2fe" }}>Password</Text>
              <TextInput
                style={{
                  width: "100%",
                  backgroundColor: "#e0f2fe",
                  height: 45,
                  borderRadius: 10,
                  padding: 10,
                  color: "black",
                }}
                secureTextEntry={true}
                value={password}
                onChangeText={setPassword}
                placeholder="Enter your password..."
                placeholderTextColor="black"
              />
            </View>
          </View>
          <View
            style={{
              gap: 10,
              justifyContent: "center",
              alignItems: "center",
              marginTop: "auto",
            }}
          >
            <TouchableOpacity
              style={{
                backgroundColor: "#0ea5e9",
                padding: 15,
                borderRadius: 10,
                alignItems: "center",
                width: "100%",
              }}
            >
              <Text style={{ fontWeight: 600, color: "#e0f2fe" }}>
                Continue
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setSignUp(true)}>
              <Text
                style={{ color: "#e0f2fe" }}
              >{`Don’t have an account? Sign up`}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}
