import { QueryClient, QueryFunction } from "@tanstack/react-query";

let isAuthenticated = true;

export function setAuthState(authenticated: boolean) {
  isAuthenticated = authenticated;
}

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const error = new Error(res.statusText);
    (error as any).status = res.status;
    throw error;
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
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

  const res = await fetch(url, {
    method,
    headers,
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  if (res.status === 401) {
    // Create a custom event with the retry function
    const retryEvent = new CustomEvent('auth:unauthorized', {
      detail: {
        retry: async () => {
          const newToken = localStorage.getItem('accessToken');
          if (!newToken) {
            throw new Error("No access token available");
          }
          
          // Retry the original request with the new token
          return fetch(url, {
            method,
            headers: {
              ...headers,
              "Authorization": `Bearer ${newToken}`
            },
            body: data ? JSON.stringify(data) : undefined,
            credentials: "include",
          });
        }
      }
    });

    // Dispatch the event
    window.dispatchEvent(retryEvent);
    
    // Clear token and auth state
    localStorage.removeItem('accessToken');
    setAuthState(false);
    throw new Error("Unauthorized");
  }

  await throwIfResNotOk(res);
  return res;
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

    const res = await fetch(queryKey[0] as string, {
      headers,
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
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
