import { ReactNode, createContext, useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "./queryClient";
import { User } from "./types";

interface AuthContextType {
  accessToken: string | null;
  setAccessToken: (token: string | null) => void;
  user: User | null;
  setUser: (user: User | null) => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | null>(localStorage.getItem('accessToken'));
  const [user, setUser] = useState<User | null>(null);
  const { toast } = useToast();

  // Setup axios interceptor for token refresh
  useEffect(() => {
    const handleUnauthorized = async (originalRequest: () => Promise<Response>) => {
      try {
        // Try to refresh the token
        const refreshResponse = await fetch('http://localhost:5000/api/auth/refresh-token', {
          method: 'POST',
          credentials: 'include'
        });

        if (!refreshResponse.ok) {
          // If refresh fails, clear auth state and redirect to login
          setAccessToken(null);
          setUser(null);
          localStorage.removeItem('accessToken');
          toast({
            title: "Session expired",
            description: "Please log in again to continue.",
            variant: "destructive",
          });
          return null;
        }

        // Get the new access token
        const { accessToken: newToken } = await refreshResponse.json();
        
        // Update storage and state
        localStorage.setItem('accessToken', newToken);
        setAccessToken(newToken);
        
        // Retry the original request
        return await originalRequest();
      } catch (error) {
        setAccessToken(null);
        setUser(null);
        localStorage.removeItem('accessToken');
        return null;
      }
    };

    // Add event listener for custom 401 events
    const handleAuthError = async (event: CustomEvent) => {
      if (event.detail && typeof event.detail.retry === 'function') {
        await handleUnauthorized(event.detail.retry);
      }
    };

    window.addEventListener('auth:unauthorized' as any, handleAuthError as EventListener);

    return () => {
      window.removeEventListener('auth:unauthorized' as any, handleAuthError as EventListener);
    };
  }, [toast]);

  // Persist token to localStorage when it changes
  useEffect(() => {
    if (accessToken) {
      localStorage.setItem('accessToken', accessToken);
    } else {
      localStorage.removeItem('accessToken');
    }
  }, [accessToken]);

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        setAccessToken,
        user,
        setUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
