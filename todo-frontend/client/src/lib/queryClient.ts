import { QueryClient, QueryFunction } from "@tanstack/react-query";
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";

let isAuthenticated = true;

export function setAuthState(authenticated: boolean) {
  isAuthenticated = authenticated;
}

interface ErrorResponse {
  message?: string;
}

async function throwIfResNotOk(error: AxiosError<ErrorResponse>) {
  if (error.response) {
    const errorMessage = new Error(error.response.data?.message || error.message);
    (errorMessage as any).status = error.response.status;
    throw errorMessage;
  }
  throw error;
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<any> {
  const accessToken = localStorage.getItem('accessToken');
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }

  const config: AxiosRequestConfig = {
    method,
    url,
    headers,
    data,
    withCredentials: true,
  };

  try {
    const response = await axios(config);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      // Create a custom event with the retry function
      const retryEvent = new CustomEvent('auth:unauthorized', {
        detail: {
          retry: async () => {
            const newToken = localStorage.getItem('accessToken');
            if (!newToken) {
              throw new Error("No access token available");
            }
            
            // Retry the original request with the new token
            return axios({
              ...config,
              headers: {
                ...config.headers,
                "Authorization": `Bearer ${newToken}`
              }
            });
          }
        }
      });

      // Dispatch the event
      window.dispatchEvent(retryEvent);
      
      // Clear token and auth state
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      setAuthState(false);
      throw new Error("Unauthorized");
    }

    await throwIfResNotOk(error as AxiosError<ErrorResponse>);
    throw error;
  }
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    if (!isAuthenticated) {
      throw new Error("Not authenticated");
    }

    const accessToken = localStorage.getItem('accessToken');
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (accessToken) {
      headers["Authorization"] = `Bearer ${accessToken}`;
    }

    try {
      const response = await axios.get(queryKey[0] as string, {
        headers,
        withCredentials: true,
      });

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        if (unauthorizedBehavior === "returnNull") {
          return null;
        }
        throw new Error("Unauthorized");
      }
      throw error;
    }
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
      enabled: isAuthenticated,
    },
    mutations: {
      retry: false,
    },
  },
});
