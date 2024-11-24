import { AuthConfig, AuthToken, AuthState } from './types';
import { create } from 'zustand';

interface AuthStore extends AuthState {
  setTokens: (service: string, tokens: AuthToken) => void;
  clearTokens: (service: string) => void;
  setError: (error: string) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  isAuthenticated: false,
  tokens: {},
  setTokens: (service, tokens) =>
    set((state) => ({
      tokens: { ...state.tokens, [service]: tokens },
      isAuthenticated: true,
      error: undefined,
    })),
  clearTokens: (service) =>
    set((state) => {
      const { [service]: _, ...rest } = state.tokens;
      return {
        tokens: rest,
        isAuthenticated: Object.keys(rest).length > 0,
      };
    }),
  setError: (error) => set({ error }),
}));

export class AuthManager {
  private config: AuthConfig;
  private service: string;

  constructor(service: string, config: AuthConfig) {
    this.service = service;
    this.config = config;
  }

  async getValidToken(): Promise<string> {
    const { tokens } = useAuthStore.getState();
    const token = tokens[this.service];

    if (!token) {
      throw new Error('No token available');
    }

    if (this.isTokenExpired(token)) {
      if (token.refreshToken) {
        return this.refreshAccessToken(token.refreshToken);
      }
      throw new Error('Token expired and no refresh token available');
    }

    return token.accessToken;
  }

  private isTokenExpired(token: AuthToken): boolean {
    return Date.now() >= token.expiresAt - 60000; // 1 minute buffer
  }

  private async refreshAccessToken(refreshToken: string): Promise<string> {
    try {
      // Implement refresh token logic specific to each service
      throw new Error('Not implemented');
    } catch (error) {
      useAuthStore.getState().clearTokens(this.service);
      throw error;
    }
  }

  getAuthUrl(): string {
    // Implement auth URL generation specific to each service
    throw new Error('Not implemented');
  }

  async handleCallback(code: string): Promise<void> {
    // Implement callback handling specific to each service
    throw new Error('Not implemented');
  }
}