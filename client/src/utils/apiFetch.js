import {useAuthStore} from '../store/authStore'

export const apiFetch = async (url, options = {}) => {
  const { accessToken, refreshToken, setAuth, logout, user } =
    useAuthStore.getState();

  const fullUrl = `${import.meta.env.VITE_API_URL}${url}`;

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  let res = await fetch(fullUrl, {
    ...options,
    headers,
  });

  // If token expired → refresh
  if (res.status === 401 && refreshToken) {
    const refreshRes = await fetch(
      `${import.meta.env.VITE_API_URL}/auth/refresh-token`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      }
    );

    if (!refreshRes.ok) {
      logout();
      throw new Error("Session expired");
    }

    const refreshData = await refreshRes.json();

    // Save new token
    setAuth(user, refreshData.accessToken, refreshToken);

    // Retry ORIGINAL request (FIXED)
    const retryRes = await fetch(fullUrl, {
      ...options,
      headers: {
        ...headers,
        Authorization: `Bearer ${refreshData.accessToken}`,
      },
    });

    return retryRes; 
  }

  return res;
};