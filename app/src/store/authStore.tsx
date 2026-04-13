import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'

// 1. Definiujemy, jak wygląda nasz użytkownik z API
export interface User {
	id: number
	username: string
	email: string
	iracing_id: number | null
}

// 2. Rozszerzamy stan o pole 'user'
interface AuthState {
	token: string | null
	user: User | null
	isAuthenticated: boolean
	setAuth: (token: string, user: User) => void
	logout: () => void
	refreshAccessToken: () => Promise<string | null>
}

export const useAuthStore = create<AuthState>()(
	persist(
		(set, get) => ({
			token: null,
			user: null,
			isAuthenticated: false,

			// Akcja logowania - zapisuje token ORAZ dane użytkownika
			setAuth: (token: string, user: User) =>
				set({ token, user, isAuthenticated: true }),

			// Akcja wylogowania - czyści wszystko
			logout: () => set({ token: null, user: null, isAuthenticated: false }),

			// Odświeżanie access tokenu przez refresh_token cookie
			refreshAccessToken: async () => {
				try {
					const res = await fetch(`${BASE_URL}/api/auth/refresh-token`, {
						method: 'POST',
						credentials: 'include', // wysyła cookie refresh_token
					})

					if (!res.ok) {
						get().logout()
						return null
					}

					const data = await res.json()
					const newToken = data.access_token

					if (newToken) {
						set((state) => ({ ...state, token: newToken }))
						return newToken
					}

					get().logout()
					return null
				} catch {
					get().logout()
					return null
				}
			},
		}),
		{
			name: 'bolide-auth-storage',
		}
	)
)