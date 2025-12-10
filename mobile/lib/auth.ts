import * as SecureStore from "expo-secure-store";
import { HTTP_ENDPOINT } from "./constants";

const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";

export type Session = {
  accessToken: string;
  refreshToken: string;
};

class AuthService {
  private static instance: AuthService;
  private refreshPromise: Promise<Session | null> | null = null;

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }

    return AuthService.instance;
  }

  async setSession(session: Session) {
    await Promise.all([
      SecureStore.setItemAsync(ACCESS_TOKEN_KEY, session.accessToken),
      SecureStore.setItemAsync(REFRESH_TOKEN_KEY, session.refreshToken),
    ]);
  }

  async getAccessToken(): Promise<string | null> {
    return await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
  }

  async getRefreshToken(): Promise<string | null> {
    return await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
  }

  async getSession(): Promise<Session | null> {
    const [accessToken, refreshToken] = await Promise.all([
      this.getAccessToken(),
      this.getRefreshToken(),
    ]);

    if (!accessToken || !refreshToken) {
      return null;
    }

    return { accessToken, refreshToken };
  }

  async isAuthenticated(): Promise<boolean> {
    const session = await this.getSession();

    return !!session;
  }

  async clearSession(): Promise<void> {
    await Promise.all([
      SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY),
      SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY),
    ]);
  }

  async refreshAccessToken(): Promise<Session | null> {
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    // Start a new refresh
    this.refreshPromise = this._dbRefresh();

    try {
      const result = await this.refreshPromise;
      return result;
    } finally {
      this.refreshPromise = null;
    }
  }

  private async _dbRefresh(): Promise<Session | null> {
    const refreshToken = await this.getRefreshToken();

    if (!refreshToken) {
      return null;
    }

    try {
      const response = await fetch(HTTP_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: `
            mutation RefreshToken($refreshToken: String!) {
              refreshToken(refreshToken: $refreshToken) {
                accessToken
                refreshToken
              }
            }
          `,
          variables: {
            refreshToken,
          },
        }),
      });

      const json = await response.json();

      if (json.errors) {
        await this.clearSession();
        return null;
      }

      const session: Session = {
        accessToken: json.data.refreshToken.accessToken,
        refreshToken: json.data.refreshToken.refreshToken,
      };

      await this.setSession(session);
      return session;
    } catch (error) {
      console.error("Failed to refresh token: ", error);
      await this.clearSession();
      return null;
    }
  }
}

export const authService = AuthService.getInstance();
