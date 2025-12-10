import useSessionContext from "@/context/Session/useSessionContext";
import { AppMutation } from "@/gql/AppMutation.graphql";
import { AppQuery } from "@/gql/AppQuery.graphql";
import { authService } from "@/lib/auth";
import { router } from "expo-router";
import React, { useCallback } from "react";
import { Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { graphql, useLazyLoadQuery, useMutation } from "react-relay";

export default function Index() {
  const { setHasSession } = useSessionContext();

  const { me } = useLazyLoadQuery<AppQuery>(
    graphql`
      query AppQuery {
        me {
          id
          email
        }
      }
    `,
    {}
  );

  const [commitLogout, isInFlight] = useMutation<AppMutation>(graphql`
    mutation AppMutation {
      logout
    }
  `);
  const onLogout = useCallback(() => {
    commitLogout({
      variables: {},
      onCompleted: (response, err) => {
        if (err) return;

        const logoutFn = async () => {
          await authService.clearSession();
          setHasSession(false);
          router.replace("/join");
        };

        if (response.logout) {
          logoutFn();
        } else {
          console.error("unsuccessful logout from Backend");
        }
      },
    });
  }, [commitLogout, setHasSession]);
  return (
    <SafeAreaView>
      <Text>{me?.id}</Text>
      <Text>{me?.email}</Text>

      <TouchableOpacity
        style={{
          padding: 10,
          margin: 40,
          backgroundColor: "red",
          width: 100,
        }}
        onPress={onLogout}
      >
        <Text>Logout</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
