export interface AuthConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  scopes: string[];
}

export interface AuthToken {
  accessToken: string;
  refreshToken?: string;
  expiresAt: number;
}

export interface AuthState {
  isAuthenticated: boolean;
  tokens: Record<string, AuthToken>;
  error?: string;
}