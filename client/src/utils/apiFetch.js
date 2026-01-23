import {useAuthStore} from '../store/authStore'

export const apiFetch = async (url, options = {}) => {
  const { accessToken, refreshToken, setAuth, logout, user } =
    useAuthStore.getState();

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  // Only attach token if it exists
  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }
  const fullUrl = `${import.meta.env.VITE_API_URL}${url}`;

  let res = await fetch(fullUrl, {
    ...options,
    headers,
  });

  // Access token expired → try refresh
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

    // Save new access token
    setAuth(user, refreshData.accessToken, refreshToken);

    // Retry original request with NEW token
    return fetch(url, {
      ...options,
      headers: {
        ...headers,
        Authorization: `Bearer ${refreshData.accessToken}`,
      },
    });
  }

  return res;
};
