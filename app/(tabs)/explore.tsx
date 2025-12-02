import { Button, StyleSheet, Text, TextInput, View } from "react-native";

import { exploreMutation } from "@/gql/exploreMutation.graphql";
import { exploreQuery } from "@/gql/exploreQuery.graphql";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  fetchQuery,
  graphql,
  useLazyLoadQuery,
  useMutation,
  useRelayEnvironment,
} from "react-relay";

const query = graphql`
  query exploreQuery {
    users {
      id
      name
    }
  }
`;

export default function TabTwoScreen() {
  const environment = useRelayEnvironment();
  const [name, setName] = useState("");

  const data = useLazyLoadQuery<exploreQuery>(query, {});
  console.log("🚀 ~ TabTwoScreen ~ data:", data);

  const [createUser, isLoading] = useMutation<exploreMutation>(graphql`
    mutation exploreMutation($name: String!) {
      createUser(name: $name) {
        id
      }
    }
  `);

  const onSubmit = () => {
    createUser({
      variables: {
        name,
      },
      onCompleted: () => {
        setName("");
        fetchQuery(environment, query, {}).toPromise(); //! Need this to update the frontend after fetching (.toPromise())
      },
    });
  };

  return (
    <SafeAreaView>
      <View style={{ marginTop: 25, gap: 5 }}>
        {data.users.map((user) => (
          <Text style={{ color: "white" }} key={user.id}>
            {user.name}
          </Text>
        ))}
        <TextInput
          style={{ margin: 20, padding: 5, backgroundColor: "white" }}
          onChangeText={setName}
          value={name}
        />
        <Button onPress={onSubmit} title="Submit"></Button>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: "#808080",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
  },
});
