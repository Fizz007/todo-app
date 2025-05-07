import { ReactNode, createContext, useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "./queryClient";
import { User } from "./types";

interface AuthContextType {
  accessToken: string | null;
  setAccessToken: (token: string | null) => void;
  refreshToken: string | null;
  setRefreshToken: (token: string | null) => void;
  user: User | null;
  setUser: (user: User | null) => void;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | null>(localStorage.getItem('accessToken'));
  const [refreshToken, setRefreshToken] = useState<string | null>(localStorage.getItem('refreshToken'));
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Validate tokens on initial load
  useEffect(() => {
    const validateTokens = async () => {
      const storedAccessToken = localStorage.getItem('accessToken');
      const storedRefreshToken = localStorage.getItem('refreshToken');

      if (!storedAccessToken || !storedRefreshToken) {
        setAccessToken(null);
        setRefreshToken(null);
        setUser(null);
        setIsLoading(false);
        return;
      }

      try {
        // Try to get user data using the access token
        const response = await fetch('http://localhost:5000/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${storedAccessToken}`
          },
          credentials: 'include'
        });

        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
          setAccessToken(storedAccessToken);
          setRefreshToken(storedRefreshToken);
        } else {
          // If access token is invalid, try to refresh
          const refreshResponse = await fetch('http://localhost:5000/api/auth/refresh-token', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refreshToken: storedRefreshToken }),
            credentials: 'include'
          });

          if (refreshResponse.ok) {
            const { accessToken: newAccessToken, refreshToken: newRefreshToken } = await refreshResponse.json();
            localStorage.setItem('accessToken', newAccessToken);
            localStorage.setItem('refreshToken', newRefreshToken);
            setAccessToken(newAccessToken);
            setRefreshToken(newRefreshToken);
            
            // Get user data with new access token
            const userResponse = await fetch('http://localhost:5000/api/auth/me', {
              headers: {
                'Authorization': `Bearer ${newAccessToken}`
              },
              credentials: 'include'
            });
            
            if (userResponse.ok) {
              const userData = await userResponse.json();
              setUser(userData);
            } else {
              throw new Error('Failed to get user data');
            }
          } else {
            throw new Error('Failed to refresh token');
          }
        }
      } catch (error) {
        // Clear everything if validation fails
        setAccessToken(null);
        setRefreshToken(null);
        setUser(null);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        toast({
          title: "Session expired",
          description: "Please log in again to continue.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    validateTokens();
  }, [toast]);

  // Setup axios interceptor for token refresh
  useEffect(() => {
    const handleUnauthorized = async (originalRequest: () => Promise<Response>) => {
      try {
        // Try to refresh the token
        const refreshResponse = await fetch('http://localhost:5000/api/auth/refresh-token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ refreshToken }),
          credentials: 'include'
        });

        if (!refreshResponse.ok) {
          // If refresh fails, clear auth state and redirect to login
          setAccessToken(null);
          setRefreshToken(null);
          setUser(null);
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          toast({
            title: "Session expired",
            description: "Please log in again to continue.",
            variant: "destructive",
          });
          return null;
        }

        // Get the new tokens
        const { accessToken: newAccessToken, refreshToken: newRefreshToken } = await refreshResponse.json();
        
        // Update storage and state
        localStorage.setItem('accessToken', newAccessToken);
        localStorage.setItem('refreshToken', newRefreshToken);
        setAccessToken(newAccessToken);
        setRefreshToken(newRefreshToken);
        
        // Retry the original request
        return await originalRequest();
      } catch (error) {
        setAccessToken(null);
        setRefreshToken(null);
        setUser(null);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
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
  }, [toast, refreshToken]);

  // Persist tokens to localStorage when they change
  useEffect(() => {
    if (accessToken) {
      localStorage.setItem('accessToken', accessToken);
    } else {
      localStorage.removeItem('accessToken');
    }
  }, [accessToken]);

  useEffect(() => {
    if (refreshToken) {
      localStorage.setItem('refreshToken', refreshToken);
    } else {
      localStorage.removeItem('refreshToken');
    }
  }, [refreshToken]);

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        setAccessToken,
        refreshToken,
        setRefreshToken,
        user,
        setUser,
        isLoading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
