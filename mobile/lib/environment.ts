import { router } from "expo-router";
import {
  Environment,
  FetchFunction,
  Network,
  RecordSource,
  Store,
} from "relay-runtime";
import { authService } from "./auth";
import { HTTP_ENDPOINT } from "./constants";

const fetchQuery: FetchFunction = async (operation, variables) => {
  const accessToken = await authService.getAccessToken();

  const makeRequest = async (token: string | null) => {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const res = await fetch(HTTP_ENDPOINT, {
      method: "POST",
      headers,
      body: JSON.stringify({ query: operation.text, variables }),
    });

    const json = await res.json();

    //Check for unauthorized or authentication errors
    if (res.status === 401 || (json.errors && isAuthError(json.errors))) {
      // Try to refresh the token
      const newSession = await authService.refreshAccessToken();

      if (newSession) {
        // Retry the request with the new token
        return makeRequest(newSession.accessToken);
      } else {
        router.replace("/join");
        // Refresh failed, user needs to login again
        throw new Error("Authentication required");
      }
    }

    // Check for GraphQL Errors
    if (json.errors) {
      // Don't throw for auth errors if we already tried refreshing
      if (isAuthError(json.errors)) {
        throw new Error("Authentication required");
      }
      throw new Error(json.errors[0].message);
    }

    return json;
  };

  return makeRequest(accessToken);
};

export const environment = new Environment({
  network: Network.create(fetchQuery),
  store: new Store(new RecordSource()),
});

function isAuthError(errors: any[]): boolean {
  return errors.some(
    (error) =>
      error.extension?.code === "UNAUTHENTICATED" ||
      error.message?.toLowerCae().includes("unauthorized") ||
      error.message?.toLowerCae().includes("authentication")
  );
}
