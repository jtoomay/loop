import * as SecureStore from "expo-secure-store";
import {
  Environment,
  FetchFunction,
  Network,
  RecordSource,
  Store,
} from "relay-runtime";

const HTTP_ENDPOINT = "https://gql.brightsideserve.com/query";

const getToken = async () => await SecureStore.getItemAsync("token");

const fetchQuery: FetchFunction = async (operation, variables) => {
  const token = await getToken();
  const resp = await fetch(HTTP_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({
      query: operation.text,
      variables,
    }),
  });

  const json = await resp.json();
  if (json.errors) throw new Error(json.errors[0].message);
  return json;
};

export const environment = new Environment({
  network: Network.create(fetchQuery),
  store: new Store(new RecordSource()),
});
