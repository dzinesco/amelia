import React, { createContext, useContext, useEffect, useState } from 'react';
import { PublicClientApplication, AccountInfo, InteractionRequiredAuthError } from '@azure/msal-browser';

interface AuthContextType {
  isAuthenticated: boolean;
  user: AccountInfo | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  getToken: () => Promise<string>;
}

const AuthContext = createContext<AuthContextType | null>(null);

const msalConfig = {
  auth: {
    clientId: import.meta.env.VITE_AZURE_CLIENT_ID,
    authority: `https://login.microsoftonline.com/${import.meta.env.VITE_AZURE_TENANT_ID}`,
    redirectUri: window.location.origin,
    postLogoutRedirectUri: window.location.origin,
  },
  cache: {
    cacheLocation: 'localStorage',
    storeAuthStateInCookie: false,
  },
};

const loginRequest = {
  scopes: ['User.Read', 'Mail.Read', 'Calendars.Read']
};

export const AzureAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<AccountInfo | null>(null);
  const [msalInstance, setMsalInstance] = useState<PublicClientApplication | null>(null);

  useEffect(() => {
    if (!import.meta.env.VITE_AZURE_CLIENT_ID || !import.meta.env.VITE_AZURE_TENANT_ID) {
      console.error('Azure AD credentials not configured');
      return;
    }

    const instance = new PublicClientApplication(msalConfig);
    instance.initialize().then(() => {
      setMsalInstance(instance);
      const accounts = instance.getAllAccounts();
      if (accounts.length > 0) {
        setIsAuthenticated(true);
        setUser(accounts[0]);
      }
    });
  }, []);

  const login = async () => {
    if (!msalInstance) {
      throw new Error('MSAL not initialized');
    }

    try {
      const response = await msalInstance.loginPopup(loginRequest);
      setIsAuthenticated(true);
      setUser(response.account);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = async () => {
    if (!msalInstance) {
      throw new Error('MSAL not initialized');
    }

    try {
      await msalInstance.logoutPopup({
        postLogoutRedirectUri: window.location.origin,
      });
      setIsAuthenticated(false);
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    }
  };

  const getToken = async () => {
    if (!msalInstance) {
      throw new Error('MSAL not initialized');
    }

    try {
      const account = msalInstance.getAllAccounts()[0];
      if (!account) {
        throw new Error('No account found');
      }

      const response = await msalInstance.acquireTokenSilent({
        ...loginRequest,
        account,
      });
      return response.accessToken;
    } catch (error) {
      if (error instanceof InteractionRequiredAuthError) {
        const response = await msalInstance.acquireTokenPopup(loginRequest);
        return response.accessToken;
      }
      throw error;
    }
  };

  if (!msalInstance) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cyan-50">
        <div className="text-cyan-600">
          {!import.meta.env.VITE_AZURE_CLIENT_ID || !import.meta.env.VITE_AZURE_TENANT_ID ? (
            <div className="text-center">
              <p className="font-medium">Azure AD credentials not configured</p>
              <p className="mt-2 text-sm">Please set VITE_AZURE_CLIENT_ID and VITE_AZURE_TENANT_ID in your .env file</p>
            </div>
          ) : (
            'Initializing authentication...'
          )}
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, getToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AzureAuthProvider');
  }
  return context;
};