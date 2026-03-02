// src/data/dummyCommunity.ts

export interface Driver {
	id: string
	name: string
	team: string
	country: string
	countryCode: string
	iRating: number
	safetyRating: number
}

export interface LapRecord {
	id: string
	driver: Driver
	track: string
	car: string
	lapTime: string
	lapTimeMs: number
	gap: string
	date: string
	conditions: 'dry' | 'wet'
}

export interface Track {
	id: string
	name: string
	country: string
	length: string
}

export interface Car {
	id: string
	name: string
	class: string
}

// === TRACKS ===
export const tracks: Track[] = [
	{ id: 'spa', name: 'Spa-Francorchamps', country: 'Belgium', length: '7.004 km' },
	{ id: 'monza', name: 'Monza', country: 'Italy', length: '5.793 km' },
	{ id: 'nordschleife', name: 'Nürburgring Nordschleife', country: 'Germany', length: '20.832 km' },
	{ id: 'suzuka', name: 'Suzuka', country: 'Japan', length: '5.807 km' },
	{ id: 'silverstone', name: 'Silverstone', country: 'UK', length: '5.891 km' },
	{ id: 'laguna', name: 'Laguna Seca', country: 'USA', length: '3.602 km' },
	{ id: 'imola', name: 'Imola', country: 'Italy', length: '4.909 km' },
	{ id: 'bathurst', name: 'Mount Panorama', country: 'Australia', length: '6.213 km' },
]

// === CARS ===
export const cars: Car[] = [
	{ id: 'all', name: 'All Cars', class: 'All' },
	{ id: 'gt3-porsche', name: 'Porsche 911 GT3 R', class: 'GT3' },
	{ id: 'gt3-ferrari', name: 'Ferrari 296 GT3', class: 'GT3' },
	{ id: 'gt3-bmw', name: 'BMW M4 GT3', class: 'GT3' },
	{ id: 'gt3-mercedes', name: 'Mercedes-AMG GT3', class: 'GT3' },
	{ id: 'gt3-lambo', name: 'Lamborghini Huracán GT3', class: 'GT3' },
	{ id: 'gt3-aston', name: 'Aston Martin Vantage GT3', class: 'GT3' },
]

// === DRIVERS ===
export const drivers: Driver[] = [
	{ id: '1', name: 'Max Benecke', team: 'Team Redline', country: 'Germany', countryCode: 'DE', iRating: 12450, safetyRating: 4.99 },
	{ id: '2', name: 'Joshua Rogers', team: 'Coanda Simsport', country: 'Australia', countryCode: 'AU', iRating: 11890, safetyRating: 4.95 },
	{ id: '3', name: 'Maximilian Wojciechowski', team: 'Williams Esports', country: 'Poland', countryCode: 'PL', iRating: 11540, safetyRating: 4.92 },
	{ id: '4', name: 'Ayhancan Güven', team: 'Team Redline', country: 'Turkey', countryCode: 'TR', iRating: 11320, safetyRating: 4.88 },
	{ id: '5', name: 'Michele Anzaldi', team: 'FDA Esports', country: 'Italy', countryCode: 'IT', iRating: 10980, safetyRating: 4.91 },
	{ id: '6', name: 'Dayne Warren', team: 'Apex Racing Team', country: 'Australia', countryCode: 'AU', iRating: 10750, safetyRating: 4.85 },
	{ id: '7', name: 'Kevin Siggy', team: 'Team Redline', country: 'Austria', countryCode: 'AT', iRating: 10620, safetyRating: 4.94 },
	{ id: '8', name: 'Alejandro Sánchez', team: 'MSI eSports', country: 'Spain', countryCode: 'ES', iRating: 10480, safetyRating: 4.82 },
	{ id: '9', name: 'Mack Bakkum', team: 'Team Redline', country: 'Netherlands', countryCode: 'NL', iRating: 10350, safetyRating: 4.90 },
	{ id: '10', name: 'Kamil Franczak', team: 'Logitech G', country: 'Poland', countryCode: 'PL', iRating: 10120, safetyRating: 4.78 },
	{ id: '11', name: 'Luke Bennett', team: 'Pure Racing Team', country: 'UK', countryCode: 'GB', iRating: 9980, safetyRating: 4.86 },
	{ id: '12', name: 'Andrii Zhupanov', team: 'Soul of Racing', country: 'Ukraine', countryCode: 'UA', iRating: 4521, safetyRating: 4.95 },
]

// === LAP RECORDS ===
export const lapRecords: LapRecord[] = [
	// Spa-Francorchamps
	{ id: 'spa-1', driver: drivers[0], track: 'spa', car: 'gt3-porsche', lapTime: '2:15.342', lapTimeMs: 135342, gap: '-', date: '2024-01-15', conditions: 'dry' },
	{ id: 'spa-2', driver: drivers[1], track: 'spa', car: 'gt3-ferrari', lapTime: '2:15.567', lapTimeMs: 135567, gap: '+0.225', date: '2024-01-14', conditions: 'dry' },
	{ id: 'spa-3', driver: drivers[2], track: 'spa', car: 'gt3-bmw', lapTime: '2:15.891', lapTimeMs: 135891, gap: '+0.549', date: '2024-01-12', conditions: 'dry' },
	{ id: 'spa-4', driver: drivers[3], track: 'spa', car: 'gt3-porsche', lapTime: '2:16.102', lapTimeMs: 136102, gap: '+0.760', date: '2024-01-10', conditions: 'dry' },
	{ id: 'spa-5', driver: drivers[4], track: 'spa', car: 'gt3-ferrari', lapTime: '2:16.234', lapTimeMs: 136234, gap: '+0.892', date: '2024-01-09', conditions: 'dry' },
	{ id: 'spa-6', driver: drivers[5], track: 'spa', car: 'gt3-mercedes', lapTime: '2:16.445', lapTimeMs: 136445, gap: '+1.103', date: '2024-01-08', conditions: 'dry' },
	{ id: 'spa-7', driver: drivers[6], track: 'spa', car: 'gt3-lambo', lapTime: '2:16.678', lapTimeMs: 136678, gap: '+1.336', date: '2024-01-07', conditions: 'dry' },
	{ id: 'spa-8', driver: drivers[7], track: 'spa', car: 'gt3-aston', lapTime: '2:16.890', lapTimeMs: 136890, gap: '+1.548', date: '2024-01-06', conditions: 'dry' },
	{ id: 'spa-9', driver: drivers[8], track: 'spa', car: 'gt3-porsche', lapTime: '2:17.012', lapTimeMs: 137012, gap: '+1.670', date: '2024-01-05', conditions: 'dry' },
	{ id: 'spa-10', driver: drivers[9], track: 'spa', car: 'gt3-bmw', lapTime: '2:17.234', lapTimeMs: 137234, gap: '+1.892', date: '2024-01-04', conditions: 'dry' },
	{ id: 'spa-11', driver: drivers[10], track: 'spa', car: 'gt3-mercedes', lapTime: '2:17.456', lapTimeMs: 137456, gap: '+2.114', date: '2024-01-03', conditions: 'dry' },
	{ id: 'spa-12', driver: drivers[11], track: 'spa', car: 'gt3-porsche', lapTime: '2:18.302', lapTimeMs: 138302, gap: '+2.960', date: '2024-01-02', conditions: 'dry' },
	
	// Monza
	{ id: 'monza-1', driver: drivers[1], track: 'monza', car: 'gt3-ferrari', lapTime: '1:46.123', lapTimeMs: 106123, gap: '-', date: '2024-01-15', conditions: 'dry' },
	{ id: 'monza-2', driver: drivers[0], track: 'monza', car: 'gt3-porsche', lapTime: '1:46.345', lapTimeMs: 106345, gap: '+0.222', date: '2024-01-14', conditions: 'dry' },
	{ id: 'monza-3', driver: drivers[4], track: 'monza', car: 'gt3-ferrari', lapTime: '1:46.567', lapTimeMs: 106567, gap: '+0.444', date: '2024-01-13', conditions: 'dry' },
	{ id: 'monza-4', driver: drivers[2], track: 'monza', car: 'gt3-bmw', lapTime: '1:46.789', lapTimeMs: 106789, gap: '+0.666', date: '2024-01-12', conditions: 'dry' },
	{ id: 'monza-5', driver: drivers[3], track: 'monza', car: 'gt3-porsche', lapTime: '1:46.901', lapTimeMs: 106901, gap: '+0.778', date: '2024-01-11', conditions: 'dry' },
	{ id: 'monza-6', driver: drivers[5], track: 'monza', car: 'gt3-mercedes', lapTime: '1:47.123', lapTimeMs: 107123, gap: '+1.000', date: '2024-01-10', conditions: 'dry' },
	{ id: 'monza-7', driver: drivers[11], track: 'monza', car: 'gt3-porsche', lapTime: '1:48.456', lapTimeMs: 108456, gap: '+2.333', date: '2024-01-09', conditions: 'dry' },

	// Nordschleife
	{ id: 'nord-1', driver: drivers[0], track: 'nordschleife', car: 'gt3-porsche', lapTime: '7:58.234', lapTimeMs: 478234, gap: '-', date: '2024-01-15', conditions: 'dry' },
	{ id: 'nord-2', driver: drivers[2], track: 'nordschleife', car: 'gt3-bmw', lapTime: '7:59.567', lapTimeMs: 479567, gap: '+1.333', date: '2024-01-14', conditions: 'dry' },
	{ id: 'nord-3', driver: drivers[1], track: 'nordschleife', car: 'gt3-ferrari', lapTime: '8:00.123', lapTimeMs: 480123, gap: '+1.889', date: '2024-01-13', conditions: 'dry' },
	{ id: 'nord-4', driver: drivers[6], track: 'nordschleife', car: 'gt3-lambo', lapTime: '8:01.456', lapTimeMs: 481456, gap: '+3.222', date: '2024-01-12', conditions: 'dry' },
	{ id: 'nord-5', driver: drivers[11], track: 'nordschleife', car: 'gt3-porsche', lapTime: '8:12.890', lapTimeMs: 492890, gap: '+14.656', date: '2024-01-11', conditions: 'dry' },

	// Suzuka
	{ id: 'suzuka-1', driver: drivers[3], track: 'suzuka', car: 'gt3-porsche', lapTime: '1:58.234', lapTimeMs: 118234, gap: '-', date: '2024-01-15', conditions: 'dry' },
	{ id: 'suzuka-2', driver: drivers[0], track: 'suzuka', car: 'gt3-porsche', lapTime: '1:58.456', lapTimeMs: 118456, gap: '+0.222', date: '2024-01-14', conditions: 'dry' },
	{ id: 'suzuka-3', driver: drivers[1], track: 'suzuka', car: 'gt3-ferrari', lapTime: '1:58.678', lapTimeMs: 118678, gap: '+0.444', date: '2024-01-13', conditions: 'dry' },
	{ id: 'suzuka-4', driver: drivers[11], track: 'suzuka', car: 'gt3-porsche', lapTime: '2:01.234', lapTimeMs: 121234, gap: '+3.000', date: '2024-01-12', conditions: 'dry' },

	// Silverstone
	{ id: 'silver-1', driver: drivers[10], track: 'silverstone', car: 'gt3-mercedes', lapTime: '1:57.123', lapTimeMs: 117123, gap: '-', date: '2024-01-15', conditions: 'dry' },
	{ id: 'silver-2', driver: drivers[0], track: 'silverstone', car: 'gt3-porsche', lapTime: '1:57.345', lapTimeMs: 117345, gap: '+0.222', date: '2024-01-14', conditions: 'dry' },
	{ id: 'silver-3', driver: drivers[2], track: 'silverstone', car: 'gt3-bmw', lapTime: '1:57.567', lapTimeMs: 117567, gap: '+0.444', date: '2024-01-13', conditions: 'dry' },
	{ id: 'silver-4', driver: drivers[11], track: 'silverstone', car: 'gt3-porsche', lapTime: '1:59.890', lapTimeMs: 119890, gap: '+2.767', date: '2024-01-12', conditions: 'dry' },
]

// Helper functions
export const getRecordsByTrack = (trackId: string, carId?: string): LapRecord[] => {
	let records = lapRecords.filter(record => record.track === trackId)
	if (carId && carId !== 'all') {
		records = records.filter(record => record.car === carId)
	}
	return records.sort((a, b) => a.lapTimeMs - b.lapTimeMs)
}

export const searchDrivers = (query: string): Driver[] => {
	const lowerQuery = query.toLowerCase()
	return drivers.filter(driver => 
		driver.name.toLowerCase().includes(lowerQuery) ||
		driver.team.toLowerCase().includes(lowerQuery) ||
		driver.country.toLowerCase().includes(lowerQuery)
	)
}

export const getTrackById = (trackId: string): Track | undefined => {
	return tracks.find(track => track.id === trackId)
}

export const getCarById = (carId: string): Car | undefined => {
	return cars.find(car => car.id === carId)
}

// Country flag emoji helper
export const getFlagEmoji = (countryCode: string): string => {
	const codePoints = countryCode
		.toUpperCase()
		.split('')
		.map(char => 127397 + char.charCodeAt(0))
	return String.fromCodePoint(...codePoints)
}