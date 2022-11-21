import { createContext, ReactNode, useState, useEffect } from "react";
import * as Google from 'expo-auth-session/providers/google';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser'

WebBrowser.maybeCompleteAuthSession();

interface UserProps {
  name: string;
  avatarUrl: string;
}

export interface AuthContextDataProps {
  user: UserProps;
  isUserLoading: boolean;
  signIn: () => Promise<void>;
}

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextDataProps);

export function AuthContextProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<UserProps>({} as UserProps);
  const [isUserLoading, setIsUserLoading] = useState(false);

  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: '975982651982-0d4q59vv4mgb4bnfma45k51hjgjspbiv.apps.googleusercontent.com',
    redirectUri: AuthSession.makeRedirectUri({ useProxy: true}),
    scopes: ['profile', 'email']
  })

  async function signIn() {
    try {
      setIsUserLoading(true);
      await promptAsync();

    } catch (error) {
      throw error;

    } finally {
      setIsUserLoading(false);
    }
  }

  async function signInWIthGoogle(access_token: string) {
    console.log("TOKEN DE AUTENTICAÇÃO ===>", access_token);
  }

  useEffect(() => {
    if(response?.type === 'success' && response.authentication?.accessToken) {
      signInWIthGoogle(response.authentication.accessToken)
      // access_token: só entrar com o google
    }
  }, [response])

  return(
    <AuthContext.Provider value={{
      signIn,
      isUserLoading,
      user,
    }}>

      {children}
    </AuthContext.Provider>
  );
}