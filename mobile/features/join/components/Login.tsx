import { SignInCardProps } from "@/app/join";
import useSessionContext from "@/context/Session/useSessionContext";
import { LoginMutation } from "@/gql/LoginMutation.graphql";
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

export default function Login({ setSignUp }: SignInCardProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>();
  const { setHasSession } = useSessionContext();

  const [commitLogin, isInFlight] = useMutation<LoginMutation>(graphql`
    mutation LoginMutation($email: String!, $password: String!) {
      login(email: $email, password: $password) {
        accessToken
        refreshToken
      }
    }
  `);

  const onLogin = useCallback(() => {
    commitLogin({
      variables: {
        email,
        password,
      },
      onCompleted: (response, error) => {
        if (error) return;

        const onCompletedAsync = async () => {
          await authService.setSession(response.login);
          setHasSession(true);
          router.replace("/(app)");
        };

        onCompletedAsync();
      },
      onError: (error) => {
        setError(error.message);
      },
    });
  }, [commitLogin, email, password, setHasSession]);

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
        {error && <Text style={{ backgroundColor: "red" }}>{error}</Text>}
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
              onPress={onLogin}
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
