// src/data/dummyTeam.ts

export type TeamRole = 'owner' | 'manager' | 'member'

export interface TeamMember {
	id: string
	name: string
	countryCode: string
	iRating: number
	safetyRating: number
	role: TeamRole
	joinedAt: string
	bestLapTime?: string
	totalRaces: number
	podiums: number
	online?: boolean
}

export interface TeamAnnouncement {
	id: string
	authorId: string
	authorName: string
	content: string
	createdAt: string
	pinned?: boolean
}

export interface Team {
	id: string
	name: string
	tag: string
	country: string
	countryCode: string
	primaryColor: string
	secondaryColor: string
	createdAt: string
	members: TeamMember[]
	announcements: TeamAnnouncement[]
	inviteCode: string
}

export interface PendingInvite {
	id: string
	email: string
	sentAt: string
	status: 'pending' | 'accepted' | 'expired'
}

// === TEAM COLORS PRESETS ===
export const teamColorPresets = [
	{ name: 'Racing Orange', primary: '#ff6b00', secondary: '#ff8533' },
	{ name: 'Ferrari Red', primary: '#dc0000', secondary: '#ff2d2d' },
	{ name: 'Mercedes Silver', primary: '#00d2be', secondary: '#000000' },
	{ name: 'Red Bull Navy', primary: '#1e41ff', secondary: '#ffc906' },
	{ name: 'McLaren Papaya', primary: '#ff8700', secondary: '#47c7fc' },
	{ name: 'Aston Green', primary: '#006f62', secondary: '#cedc00' },
	{ name: 'Alpine Blue', primary: '#0090ff', secondary: '#f596c8' },
	{ name: 'Williams Blue', primary: '#005aff', secondary: '#00a0de' },
	{ name: 'Porsche White', primary: '#d5001c', secondary: '#ffffff' },
	{ name: 'BMW M Colors', primary: '#1c69d4', secondary: '#e1251b' },
]

// === COUNTRIES ===
export const countries = [
	{ code: 'PL', name: 'Poland' },
	{ code: 'DE', name: 'Germany' },
	{ code: 'GB', name: 'United Kingdom' },
	{ code: 'US', name: 'United States' },
	{ code: 'IT', name: 'Italy' },
	{ code: 'FR', name: 'France' },
	{ code: 'ES', name: 'Spain' },
	{ code: 'NL', name: 'Netherlands' },
	{ code: 'AU', name: 'Australia' },
	{ code: 'JP', name: 'Japan' },
	{ code: 'BR', name: 'Brazil' },
	{ code: 'UA', name: 'Ukraine' },
	{ code: 'AT', name: 'Austria' },
	{ code: 'TR', name: 'Turkey' },
	{ code: 'SE', name: 'Sweden' },
]

// === DUMMY TEAM DATA ===
export const dummyTeam: Team = {
	id: 'team-1',
	name: 'Soul of Racing',
	tag: 'SOR',
	country: 'Ukraine',
	countryCode: 'UA',
	primaryColor: '#ff6b00',
	secondaryColor: '#1a1a1a',
	createdAt: '2023-06-15',
	inviteCode: 'SOR-X7K9-MZPQ',
	members: [
		{
			id: '1',
			name: 'Andrii Zhupanov',
			countryCode: 'UA',
			iRating: 4521,
			safetyRating: 4.95,
			role: 'owner',
			joinedAt: '2023-06-15',
			bestLapTime: '2:18.302',
			totalRaces: 47,
			podiums: 12,
			online: true,
		},
		{
			id: '2',
			name: 'Oleksandr Petrenko',
			countryCode: 'UA',
			iRating: 3890,
			safetyRating: 4.72,
			role: 'manager',
			joinedAt: '2023-07-20',
			bestLapTime: '2:19.456',
			totalRaces: 38,
			podiums: 8,
			online: true,
		},
		{
			id: '3',
			name: 'Maxim Kowalski',
			countryCode: 'PL',
			iRating: 3654,
			safetyRating: 4.65,
			role: 'member',
			joinedAt: '2023-08-10',
			bestLapTime: '2:20.123',
			totalRaces: 29,
			podiums: 5,
			online: false,
		},
		{
			id: '4',
			name: 'Ivan Moroz',
			countryCode: 'UA',
			iRating: 3421,
			safetyRating: 4.58,
			role: 'member',
			joinedAt: '2023-09-05',
			bestLapTime: '2:21.789',
			totalRaces: 24,
			podiums: 3,
			online: false,
		},
		{
			id: '5',
			name: 'Dmytro Shevchenko',
			countryCode: 'UA',
			iRating: 3198,
			safetyRating: 4.45,
			role: 'member',
			joinedAt: '2023-10-12',
			bestLapTime: '2:22.456',
			totalRaces: 18,
			podiums: 2,
			online: true,
		},
		{
			id: '6',
			name: 'Piotr Nowak',
			countryCode: 'PL',
			iRating: 2987,
			safetyRating: 4.32,
			role: 'member',
			joinedAt: '2023-11-20',
			bestLapTime: '2:23.890',
			totalRaces: 12,
			podiums: 1,
			online: false,
		},
	],
	announcements: [
		{
			id: 'ann-1',
			authorId: '1',
			authorName: 'Andrii Zhupanov',
			content: '🏆 Great job everyone on last week\'s endurance race! We finished P3 as a team. Next practice session is Saturday 8PM CET.',
			createdAt: '2024-01-15T14:30:00Z',
			pinned: true,
		},
		{
			id: 'ann-2',
			authorId: '2',
			authorName: 'Oleksandr Petrenko',
			content: 'New setup for Spa uploaded to the shared folder. Focus on sector 2 - we\'re losing time in Eau Rouge.',
			createdAt: '2024-01-14T10:15:00Z',
		},
		{
			id: 'ann-3',
			authorId: '1',
			authorName: 'Andrii Zhupanov',
			content: 'Welcome Piotr to the team! 🎉 Make sure to add him on Discord.',
			createdAt: '2023-11-20T18:00:00Z',
		},
	],
}

// === PENDING INVITES ===
export const dummyPendingInvites: PendingInvite[] = [
	{ id: 'inv-1', email: 'jan.kowalski@email.com', sentAt: '2024-01-10T12:00:00Z', status: 'pending' },
	{ id: 'inv-2', email: 'mike.driver@gmail.com', sentAt: '2024-01-08T09:30:00Z', status: 'pending' },
]

// === HELPER FUNCTIONS ===
export const getRoleLabel = (role: TeamRole): string => {
	const labels = {
		owner: 'Owner',
		manager: 'Manager',
		member: 'Member',
	}
	return labels[role]
}

export const getRoleColor = (role: TeamRole): string => {
	const colors = {
		owner: '#d4af37',
		manager: '#ff6b00',
		member: '#737373',
	}
	return colors[role]
}

export const getFlagEmoji = (countryCode: string): string => {
	const codePoints = countryCode
		.toUpperCase()
		.split('')
		.map(char => 127397 + char.charCodeAt(0))
	return String.fromCodePoint(...codePoints)
}

export const formatDate = (dateString: string): string => {
	const date = new Date(dateString)
	return date.toLocaleDateString('en-US', { 
		year: 'numeric', 
		month: 'short', 
		day: 'numeric' 
	})
}

export const formatTimeAgo = (dateString: string): string => {
	const date = new Date(dateString)
	const now = new Date()
	const diffMs = now.getTime() - date.getTime()
	const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
	
	if (diffDays === 0) return 'Today'
	if (diffDays === 1) return 'Yesterday'
	if (diffDays < 7) return `${diffDays} days ago`
	if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
	return formatDate(dateString)
}