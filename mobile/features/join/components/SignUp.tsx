import { SignInCardProps } from "@/app/join";
import useSessionContext from "@/context/Session/useSessionContext";
import { SignUpMutation } from "@/gql/SignUpMutation.graphql";
import { authService } from "@/lib/auth";
import { router } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  Keyboard,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { graphql, useMutation } from "react-relay";

export default function SignUp({ setSignUp }: SignInCardProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { setHasSession } = useSessionContext();

  const [commitSignup, isInFlight] = useMutation<SignUpMutation>(graphql`
    mutation SignUpMutation($email: String!, $password: String!) {
      signup(email: $email, password: $password) {
        accessToken
        refreshToken
      }
    }
  `);

  const onSignup = useCallback(() => {
    if (password !== confirmPassword)
      return console.error("Passwords do not match");

    commitSignup({
      variables: {
        email,
        password,
      },
      onCompleted(response, error) {
        if (error) return;

        const onCompletedAsync = async () => {
          await authService.setSession(response.signup);
          setHasSession(true);
          router.replace("/(app)");
        };

        onCompletedAsync();
      },
      onError(error) {
        setError(error.message);
        return console.error(error);
      },
    });
  }, [commitSignup, confirmPassword, email, password, setHasSession]);
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View
        style={{
          alignItems: "center",
          marginTop: "50%",
          width: "100%",
          flex: 1,
        }}
      >
        <View
          style={{
            alignItems: "center",
            paddingLeft: 50,
            paddingRight: 50,
            gap: 20,
          }}
        >
          <Text style={{ fontSize: 40, fontWeight: 700, color: "#e0f2fe" }}>
            Sign Up
          </Text>
          <Text style={{ fontSize: 15, color: "#e0f2fe", textAlign: "center" }}>
            Join thousands of professionals already getting more done with less
            effort. Create your account in seconds and start today.
          </Text>
          {error && <Text style={{ color: "red" }}>{error}</Text>}
        </View>
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
                value={password}
                onChangeText={setPassword}
                placeholder="Enter your password..."
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
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Confirm your password..."
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
              onPress={onSignup}
            >
              <Text style={{ fontWeight: 600, color: "#e0f2fe" }}>
                Continue
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setSignUp(false)}>
              <Text style={{ color: "#e0f2fe" }}>
                Already have an account? Log In
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}
