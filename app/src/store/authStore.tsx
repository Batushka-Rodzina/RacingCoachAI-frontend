import { create } from 'zustand'
import { persist } from 'zustand/middleware'

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
	setAuth: (token: string, user: User) => void // Zmieniona nazwa akcji
	logout: () => void
}

export const useAuthStore = create<AuthState>()(
	persist(
		(set) => ({
			token: null,
			user: null, // Domyślnie brak usera
			isAuthenticated: false,

			// Akcja logowania - zapisuje token ORAZ dane użytkownika
			setAuth: (token: string, user: User) =>
				set({ token, user, isAuthenticated: true }),

			// Akcja wylogowania - czyści wszystko
			logout: () => set({ token: null, user: null, isAuthenticated: false }),
		}),
		{
			name: 'bolide-auth-storage',
		}
	)
)
