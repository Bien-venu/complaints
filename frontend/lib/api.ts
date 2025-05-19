import Cookies from "js-cookie";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function fetchWithAuth(
  endpoint: string,
  options: RequestInit = {}
) {
  const token = Cookies.get("auth_token");

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw {
      message: errorData.message || "An error occurred",
      status: response.status,
    };
  }

  return response.json();
}

export const api = {
  get: (endpoint: string) => fetchWithAuth(endpoint, { method: "GET" }),
  post: (endpoint: string, data: any) =>
    fetchWithAuth(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    }),
  put: (endpoint: string, data: any) =>
    fetchWithAuth(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  patch: (endpoint: string) =>
    fetchWithAuth(endpoint, {
      method: "PATCH",
    }),
  delete: (endpoint: string) => fetchWithAuth(endpoint, { method: "DELETE" }),
};
