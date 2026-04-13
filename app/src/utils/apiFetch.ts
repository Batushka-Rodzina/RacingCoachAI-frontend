/**
 * apiFetch — zamiennik fetch() z automatycznym odświeżaniem tokenu.
 *
 * Użycie (identyczne jak fetch):
 *   const res = await apiFetch('/sessions/', { headers: { ... } })
 *
 * - Automatycznie dodaje Authorization: Bearer <token> jeśli token istnieje
 * - Przy 401 próbuje odświeżyć token przez /api/auth/refresh-token (cookie)
 * - Po udanym odświeżeniu ponawia oryginalne zapytanie raz
 * - Przy nieudanym odświeżeniu wylogowuje użytkownika i przekierowuje na /login
 */

import { useAuthStore } from '../store/authStore'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'

type FetchInput = string | URL
type FetchOptions = RequestInit

const buildHeaders = (token: string | null, options?: FetchOptions): HeadersInit => {
	const existing = (options?.headers as Record<string, string>) || {}
	return {
		...existing,
		...(token ? { Authorization: `Bearer ${token}` } : {}),
	}
}

const resolveUrl = (input: FetchInput): string => {
	const str = input.toString()
	if (str.startsWith('http://') || str.startsWith('https://')) return str
	return `${BASE_URL}${str.startsWith('/') ? '' : '/'}${str}`
}

export const apiFetch = async (
	input: FetchInput,
	options?: FetchOptions
): Promise<Response> => {
	const store = useAuthStore.getState()
	const url = resolveUrl(input)

	// Pierwsze zapytanie z aktualnym tokenem
	const firstRes = await fetch(url, {
		...options,
		headers: buildHeaders(store.token, options),
	})

	// Jeśli OK — zwróć od razu
	if (firstRes.status !== 401) return firstRes

	// Dostaliśmy 401 — próbuj odświeżyć token
	const newToken = await store.refreshAccessToken()

	if (!newToken) {
		// Refresh się nie udał — użytkownik wylogowany, przekieruj na login
		window.location.href = '/login'
		return firstRes
	}

	// Ponów oryginalne zapytanie z nowym tokenem
	return fetch(url, {
		...options,
		headers: buildHeaders(newToken, options),
	})
}