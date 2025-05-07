import { useContext, useState } from "react";
import { AuthContext } from "@/lib/auth-provider";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient, setAuthState } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { AuthResponse, LoginFormData, SignupFormData } from "@/lib/types";
import { useLocation } from "wouter";

export function useAuth() {
  const authContext = useContext(AuthContext);
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  if (!authContext) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  const { accessToken, setAccessToken, refreshToken, setRefreshToken, user, setUser } = authContext;

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginFormData) => {
      setIsLoading(true);
      try {
        // Clear any existing tokens before login attempt
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        setAuthState(false);

        const res = await fetch('http://localhost:5000/api/auth/login/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(credentials),
          credentials: 'include'
        });

        if (!res.ok) {
          const error = await res.json();
          throw new Error(error.message || 'Login failed');
        }

        const data: AuthResponse = await res.json();
        return data;
      } finally {
        setIsLoading(false);
      }
    },
    onSuccess: (data) => {
      setAuthState(true);
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      setAccessToken(data.accessToken);
      setRefreshToken(data.refreshToken);
      setUser(data.user);
      toast({
        title: "Login successful",
        description: `Welcome back!`,
      });
      navigate("/");
    },
    onError: (error: Error) => {
      setAuthState(false);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      setAccessToken(null);
      setRefreshToken(null);
      setUser(null);
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const signupMutation = useMutation({
    mutationFn: async (credentials: SignupFormData) => {
      setIsLoading(true);
      try {
        // Clear any existing tokens before signup attempt
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        setAuthState(false);

        const { confirmPassword, ...userData } = credentials;
        const res = await fetch('http://localhost:5000/api/auth/signup/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData),
          credentials: 'include'
        });

        if (!res.ok) {
          const error = await res.json();
          throw new Error(error.message || 'Signup failed');
        }

        const data: AuthResponse = await res.json();
        return data;
      } finally {
        setIsLoading(false);
      }
    },
    onSuccess: (data) => {
      // Don't set auth state or tokens since we want user to log in first
      toast({
        title: "Signup successful",
        description: `Please log in to continue`,
      });
      navigate("/auth");
    },
    onError: (error: Error) => {
      setAuthState(false);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      setAccessToken(null);
      setRefreshToken(null);
      setUser(null);
      toast({
        title: "Signup failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      setIsLoading(true);
      try {
        await apiRequest("POST", "http://localhost:5000/api/auth/logout/");
      } finally {
        setIsLoading(false);
      }
    },
    onSuccess: () => {
      setAuthState(false);
      queryClient.clear();
      setAccessToken(null);
      setRefreshToken(null);
      setUser(null);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
      navigate("/auth");
    },
    onError: (error: Error) => {
      setAuthState(false);
      queryClient.clear();
      setAccessToken(null);
      setRefreshToken(null);
      setUser(null);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      toast({
        title: "Logout failed",
        description: error.message,
        variant: "destructive",
      });
      navigate("/auth");
    },
  });

  return {
    accessToken,
    refreshToken,
    user,
    isAuthenticated: !!user,
    isLoading,
    login: loginMutation.mutate,
    signup: (data: SignupFormData) => signupMutation.mutateAsync(data),
    logout: logoutMutation.mutate,
  };
}
