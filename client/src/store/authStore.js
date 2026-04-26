import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAuthStore = create(
    persist(
        (set) => ({
            user: null,
            isAuthenticated: false,
            accessToken: null,
            refreshToken: null,

            setAuth: (user, accessToken, refreshToken) =>
                set({
                    user,
                    accessToken,
                    refreshToken,
                    isAuthenticated: true,
                }),
            logout: () => {
                localStorage.removeItem("auth-storage");
                set({
                    user: null,
                    accessToken: null,
                    refreshToken: null,
                    isAuthenticated: false,
                });
            },
            updateUser: (updatedFields) =>
                set((state) => ({
                    user: {
                        ...state.user,
                        ...updatedFields
                    }
                }))
        }),
        {
            name: "auth-storage",
        }
    )
);