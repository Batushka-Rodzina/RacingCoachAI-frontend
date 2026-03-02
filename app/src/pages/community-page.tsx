// src/pages/community-page.tsx
import React, { useState, useMemo } from 'react'
import Sidebar from '../components/Sidebar'
import { 
	tracks, 
	cars, 
	getRecordsByTrack, 
	searchDrivers, 
	getTrackById,
	getFlagEmoji,
} from '../data/dummyCommunity'
import type { LapRecord, Driver } from '../data/dummyCommunity'

// === KOLORY PREMIUM IRACING ===
const COLORS = {
	primary: '#ff6b00',
	primaryHover: '#ff8533',
	gold: '#d4af37',
	silver: '#a8a8a8',
	bronze: '#cd7f32',
	carbon: '#1a1a1a',
	carbonLight: '#2d2d2d',
	text: '#e5e5e5',
	textMuted: '#737373',
	success: '#22c55e',
}

const CommunityPage: React.FC = () => {
	const [selectedTrack, setSelectedTrack] = useState('spa')
	const [selectedCar, setSelectedCar] = useState('all')
	const [searchQuery, setSearchQuery] = useState('')
	const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null)

	// Get filtered records
	const records = useMemo(() => {
		return getRecordsByTrack(selectedTrack, selectedCar)
	}, [selectedTrack, selectedCar])

	// Search results
	const searchResults = useMemo(() => {
		if (searchQuery.length < 2) return []
		return searchDrivers(searchQuery).slice(0, 5)
	}, [searchQuery])

	const trackInfo = getTrackById(selectedTrack)
	const top3 = records.slice(0, 3)

	return (
		<div className="flex min-h-screen bg-neutral-950 text-white overflow-x-hidden">
			{/* Styles */}
			<style>{`
				@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;600;700&family=Michroma&family=JetBrains+Mono:wght@400;500&display=swap');
				
				.carbon-bg {
					background-color: #0a0a0a;
					background-image: 
						linear-gradient(45deg, #0f0f0f 25%, transparent 25%),
						linear-gradient(-45deg, #0f0f0f 25%, transparent 25%),
						linear-gradient(45deg, transparent 75%, #0f0f0f 75%),
						linear-gradient(-45deg, transparent 75%, #0f0f0f 75%);
					background-size: 4px 4px;
				}

				.carbon-card {
					background-color: rgba(26, 26, 26, 0.6);
					background-image: 
						linear-gradient(45deg, rgba(21, 21, 21, 0.5) 25%, transparent 25%),
						linear-gradient(-45deg, rgba(21, 21, 21, 0.5) 25%, transparent 25%),
						linear-gradient(45deg, transparent 75%, rgba(21, 21, 21, 0.5) 75%),
						linear-gradient(-45deg, transparent 75%, rgba(21, 21, 21, 0.5) 75%);
					background-size: 4px 4px;
				}

				.custom-scrollbar::-webkit-scrollbar {
					width: 6px;
				}
				.custom-scrollbar::-webkit-scrollbar-track {
					background: rgba(255, 255, 255, 0.02);
				}
				.custom-scrollbar::-webkit-scrollbar-thumb {
					background: rgba(255, 107, 0, 0.3);
					border-radius: 3px;
				}

				.podium-gold {
					background: linear-gradient(135deg, rgba(212, 175, 55, 0.2) 0%, rgba(212, 175, 55, 0.05) 100%);
					border: 1px solid rgba(212, 175, 55, 0.4);
					box-shadow: 0 0 40px rgba(212, 175, 55, 0.15);
				}

				.podium-silver {
					background: linear-gradient(135deg, rgba(168, 168, 168, 0.15) 0%, rgba(168, 168, 168, 0.03) 100%);
					border: 1px solid rgba(168, 168, 168, 0.3);
				}

				.podium-bronze {
					background: linear-gradient(135deg, rgba(205, 127, 50, 0.15) 0%, rgba(205, 127, 50, 0.03) 100%);
					border: 1px solid rgba(205, 127, 50, 0.3);
				}

				.table-row-hover:hover {
					background: rgba(255, 107, 0, 0.05);
					border-color: rgba(255, 107, 0, 0.2);
				}
			`}</style>

			{/* Sidebar */}
			<Sidebar activeTab="community" />

			{/* Main Content */}
			<main className="flex-1 p-8 overflow-y-auto custom-scrollbar carbon-bg relative">
				{/* Background gradient */}
				<div 
					className="fixed inset-0 pointer-events-none z-0"
					style={{
						background: `
							radial-gradient(ellipse at 20% 0%, rgba(255, 107, 0, 0.03) 0%, transparent 50%),
							radial-gradient(ellipse at 80% 100%, rgba(212, 175, 55, 0.02) 0%, transparent 50%)
						`
					}}
				/>

				<div className="relative z-10 max-w-7xl mx-auto space-y-8">
					
					{/* === HEADER === */}
					<section className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
						<div>
							<h1 
								className="text-4xl md:text-5xl font-black uppercase tracking-wide"
								style={{ fontFamily: 'Bebas Neue, sans-serif', color: COLORS.text }}
							>
								Community
							</h1>
							<p 
								className="text-sm mt-2"
								style={{ color: COLORS.textMuted, fontFamily: 'DM Sans, sans-serif' }}
							>
								Lap time leaderboards • See how you compare against the fastest drivers
							</p>
						</div>

						{/* Search */}
						<div className="relative w-full md:w-80">
							<input
								type="text"
								placeholder="Search drivers..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-200"
								style={{
									backgroundColor: 'rgba(0, 0, 0, 0.3)',
									border: '1px solid rgba(255, 255, 255, 0.1)',
									color: COLORS.text,
									fontFamily: 'DM Sans, sans-serif',
								}}
								onFocus={(e) => e.target.style.borderColor = 'rgba(255, 107, 0, 0.5)'}
								onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
							/>
							{/* Search icon */}
							<svg 
								className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4" 
								fill="none" 
								stroke={COLORS.textMuted} 
								viewBox="0 0 24 24"
							>
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
							</svg>

							{/* Search Results Dropdown */}
							{searchResults.length > 0 && (
								<div 
									className="absolute top-full left-0 right-0 mt-2 rounded-xl overflow-hidden z-50"
									style={{ 
										backgroundColor: COLORS.carbon,
										border: '1px solid rgba(255, 107, 0, 0.2)',
										boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)'
									}}
								>
									{searchResults.map((driver) => (
										<button
											key={driver.id}
											onClick={() => {
												setSelectedDriver(driver)
												setSearchQuery('')
											}}
											className="w-full flex items-center gap-3 px-4 py-3 text-left transition-all duration-200"
											style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}
											onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 107, 0, 0.1)'}
											onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
										>
											<span className="text-lg">{getFlagEmoji(driver.countryCode)}</span>
											<div className="flex-1">
												<p className="text-sm font-semibold" style={{ color: COLORS.text, fontFamily: 'DM Sans, sans-serif' }}>
													{driver.name}
												</p>
												<p className="text-xs" style={{ color: COLORS.textMuted, fontFamily: 'DM Sans, sans-serif' }}>
													{driver.team}
												</p>
											</div>
											<span 
												className="text-xs font-mono"
												style={{ color: COLORS.primary }}
											>
												{driver.iRating.toLocaleString()}
											</span>
										</button>
									))}
								</div>
							)}
						</div>
					</section>

					{/* === FILTERS === */}
					<section 
						className="carbon-card rounded-2xl p-6"
						style={{ border: '1px solid rgba(255, 255, 255, 0.05)' }}
					>
						<div className="flex flex-col md:flex-row gap-6">
							{/* Track Select */}
							<div className="flex-1">
								<label 
									className="block text-xs uppercase tracking-wider font-semibold mb-3"
									style={{ color: COLORS.textMuted, fontFamily: 'DM Sans, sans-serif' }}
								>
									Track
								</label>
								<select
									value={selectedTrack}
									onChange={(e) => setSelectedTrack(e.target.value)}
									className="w-full px-4 py-3 rounded-xl text-sm cursor-pointer outline-none transition-all duration-200"
									style={{
										backgroundColor: 'rgba(0, 0, 0, 0.3)',
										border: '1px solid rgba(255, 255, 255, 0.1)',
										color: COLORS.text,
										fontFamily: 'DM Sans, sans-serif',
									}}
								>
									{tracks.map((track) => (
										<option key={track.id} value={track.id} style={{ backgroundColor: COLORS.carbon }}>
											{track.name}
										</option>
									))}
								</select>
							</div>

							{/* Car Select */}
							<div className="flex-1">
								<label 
									className="block text-xs uppercase tracking-wider font-semibold mb-3"
									style={{ color: COLORS.textMuted, fontFamily: 'DM Sans, sans-serif' }}
								>
									Car
								</label>
								<select
									value={selectedCar}
									onChange={(e) => setSelectedCar(e.target.value)}
									className="w-full px-4 py-3 rounded-xl text-sm cursor-pointer outline-none transition-all duration-200"
									style={{
										backgroundColor: 'rgba(0, 0, 0, 0.3)',
										border: '1px solid rgba(255, 255, 255, 0.1)',
										color: COLORS.text,
										fontFamily: 'DM Sans, sans-serif',
									}}
								>
									{cars.map((car) => (
										<option key={car.id} value={car.id} style={{ backgroundColor: COLORS.carbon }}>
											{car.name}
										</option>
									))}
								</select>
							</div>

							{/* Track Info */}
							<div 
								className="flex items-center gap-4 px-6 rounded-xl"
								style={{ backgroundColor: 'rgba(255, 107, 0, 0.05)', border: '1px solid rgba(255, 107, 0, 0.1)' }}
							>
								<div className="text-center py-3">
									<p className="text-[10px] uppercase tracking-wider" style={{ color: COLORS.textMuted, fontFamily: 'DM Sans, sans-serif' }}>
										Length
									</p>
									<p className="text-sm font-bold" style={{ color: COLORS.primary, fontFamily: 'JetBrains Mono, monospace' }}>
										{trackInfo?.length}
									</p>
								</div>
								<div className="w-px h-8 bg-white/10" />
								<div className="text-center py-3">
									<p className="text-[10px] uppercase tracking-wider" style={{ color: COLORS.textMuted, fontFamily: 'DM Sans, sans-serif' }}>
										Records
									</p>
									<p className="text-sm font-bold" style={{ color: COLORS.text, fontFamily: 'JetBrains Mono, monospace' }}>
										{records.length}
									</p>
								</div>
							</div>
						</div>
					</section>

					{/* === PODIUM TOP 3 === */}
					{top3.length >= 3 && (
						<section>
							<h2 
								className="text-xl font-black uppercase tracking-wide mb-6 px-2"
								style={{ fontFamily: 'Bebas Neue, sans-serif', color: COLORS.text }}
							>
								🏆 Top 3 Fastest
							</h2>
							
							<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
								{/* 2nd Place */}
								<PodiumCard 
									record={top3[1]} 
									position={2} 
									onClick={() => setSelectedDriver(top3[1].driver)}
								/>
								
								{/* 1st Place */}
								<PodiumCard 
									record={top3[0]} 
									position={1} 
									onClick={() => setSelectedDriver(top3[0].driver)}
									featured
								/>
								
								{/* 3rd Place */}
								<PodiumCard 
									record={top3[2]} 
									position={3} 
									onClick={() => setSelectedDriver(top3[2].driver)}
								/>
							</div>
						</section>
					)}

					{/* === LEADERBOARD TABLE === */}
					<section 
						className="carbon-card rounded-2xl overflow-hidden"
						style={{ border: '1px solid rgba(255, 255, 255, 0.05)' }}
					>
						<div className="p-6 border-b border-white/5">
							<h2 
								className="text-xl font-black uppercase tracking-wide"
								style={{ fontFamily: 'Bebas Neue, sans-serif', color: COLORS.text }}
							>
								Full Leaderboard
							</h2>
						</div>

						{/* Table Header */}
						<div 
							className="grid grid-cols-12 gap-4 px-6 py-3 text-xs uppercase tracking-wider font-semibold"
							style={{ 
								color: COLORS.textMuted, 
								fontFamily: 'DM Sans, sans-serif',
								backgroundColor: 'rgba(0, 0, 0, 0.2)'
							}}
						>
							<div className="col-span-1">#</div>
							<div className="col-span-4">Driver</div>
							<div className="col-span-2">Car</div>
							<div className="col-span-2 text-right">Lap Time</div>
							<div className="col-span-2 text-right">Gap</div>
							<div className="col-span-1 text-right">iR</div>
						</div>

						{/* Table Rows */}
						<div className="divide-y divide-white/5">
							{records.map((record, index) => (
								<LeaderboardRow 
									key={record.id} 
									record={record} 
									position={index + 1}
									isCurrentUser={record.driver.id === '12'}
									onClick={() => setSelectedDriver(record.driver)}
								/>
							))}
						</div>
					</section>
				</div>
			</main>

			{/* === DRIVER PROFILE MODAL === */}
			{selectedDriver && (
				<DriverProfileModal 
					driver={selectedDriver} 
					onClose={() => setSelectedDriver(null)} 
				/>
			)}
		</div>
	)
}

// === PODIUM CARD COMPONENT ===
interface PodiumCardProps {
	record: LapRecord
	position: 1 | 2 | 3
	featured?: boolean
	onClick: () => void
}

const PodiumCard: React.FC<PodiumCardProps> = ({ record, position, featured, onClick }) => {
	const podiumColors = {
		1: { bg: 'podium-gold', color: COLORS.gold, medal: '🥇' },
		2: { bg: 'podium-silver', color: COLORS.silver, medal: '🥈' },
		3: { bg: 'podium-bronze', color: COLORS.bronze, medal: '🥉' },
	}
	const config = podiumColors[position]

	return (
		<div 
			className={`${config.bg} rounded-2xl p-6 cursor-pointer transition-all duration-300 ${featured ? 'md:-mt-4 md:mb-4' : ''}`}
			onClick={onClick}
			onMouseEnter={(e) => {
				e.currentTarget.style.transform = 'translateY(-4px)'
				e.currentTarget.style.boxShadow = `0 20px 40px rgba(${position === 1 ? '212, 175, 55' : position === 2 ? '168, 168, 168' : '205, 127, 50'}, 0.2)`
			}}
			onMouseLeave={(e) => {
				e.currentTarget.style.transform = 'translateY(0)'
				e.currentTarget.style.boxShadow = ''
			}}
		>
			{/* Position */}
			<div className="flex items-center justify-between mb-4">
				<span className="text-3xl">{config.medal}</span>
				<span 
					className="text-4xl font-black"
					style={{ fontFamily: 'Bebas Neue, sans-serif', color: config.color }}
				>
					P{position}
				</span>
			</div>

			{/* Driver */}
			<div className="flex items-center gap-3 mb-4">
				<div 
					className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold"
					style={{ 
						backgroundColor: 'rgba(0, 0, 0, 0.3)',
						color: config.color,
						fontFamily: 'DM Sans, sans-serif'
					}}
				>
					{record.driver.name.split(' ').map(n => n[0]).join('')}
				</div>
				<div className="flex-1 min-w-0">
					<p 
						className="text-sm font-bold truncate"
						style={{ color: COLORS.text, fontFamily: 'DM Sans, sans-serif' }}
					>
						{record.driver.name}
					</p>
					<p 
						className="text-xs truncate"
						style={{ color: COLORS.textMuted, fontFamily: 'DM Sans, sans-serif' }}
					>
						{record.driver.team}
					</p>
				</div>
				<span className="text-xl">{getFlagEmoji(record.driver.countryCode)}</span>
			</div>

			{/* Lap Time */}
			<div 
				className="text-center py-3 rounded-xl mb-3"
				style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}
			>
				<p 
					className="text-2xl font-bold"
					style={{ color: config.color, fontFamily: 'JetBrains Mono, monospace' }}
				>
					{record.lapTime}
				</p>
			</div>

			{/* Car */}
			<p 
				className="text-xs text-center truncate"
				style={{ color: COLORS.textMuted, fontFamily: 'DM Sans, sans-serif' }}
			>
				{cars.find(c => c.id === record.car)?.name}
			</p>
		</div>
	)
}

// === LEADERBOARD ROW COMPONENT ===
interface LeaderboardRowProps {
	record: LapRecord
	position: number
	isCurrentUser?: boolean
	onClick: () => void
}

const LeaderboardRow: React.FC<LeaderboardRowProps> = ({ record, position, isCurrentUser, onClick }) => (
	<div 
		className={`grid grid-cols-12 gap-4 px-6 py-4 cursor-pointer transition-all duration-200 table-row-hover ${isCurrentUser ? 'bg-orange-500/5' : ''}`}
		style={{ 
			borderLeft: isCurrentUser ? `3px solid ${COLORS.primary}` : '3px solid transparent'
		}}
		onClick={onClick}
	>
		{/* Position */}
		<div className="col-span-1 flex items-center">
			<span 
				className={`text-sm font-bold ${position <= 3 ? '' : ''}`}
				style={{ 
					color: position === 1 ? COLORS.gold : position === 2 ? COLORS.silver : position === 3 ? COLORS.bronze : COLORS.textMuted,
					fontFamily: 'JetBrains Mono, monospace'
				}}
			>
				{position}
			</span>
		</div>

		{/* Driver */}
		<div className="col-span-4 flex items-center gap-3">
			<span className="text-base">{getFlagEmoji(record.driver.countryCode)}</span>
			<div className="min-w-0">
				<p 
					className="text-sm font-semibold truncate"
					style={{ color: isCurrentUser ? COLORS.primary : COLORS.text, fontFamily: 'DM Sans, sans-serif' }}
				>
					{record.driver.name}
					{isCurrentUser && <span className="ml-2 text-xs">(You)</span>}
				</p>
				<p 
					className="text-xs truncate"
					style={{ color: COLORS.textMuted, fontFamily: 'DM Sans, sans-serif' }}
				>
					{record.driver.team}
				</p>
			</div>
		</div>

		{/* Car */}
		<div className="col-span-2 flex items-center">
			<span 
				className="text-xs truncate"
				style={{ color: COLORS.textMuted, fontFamily: 'DM Sans, sans-serif' }}
			>
				{cars.find(c => c.id === record.car)?.name.split(' ').slice(-2).join(' ')}
			</span>
		</div>

		{/* Lap Time */}
		<div className="col-span-2 flex items-center justify-end">
			<span 
				className="text-sm font-bold"
				style={{ color: position === 1 ? COLORS.gold : COLORS.text, fontFamily: 'JetBrains Mono, monospace' }}
			>
				{record.lapTime}
			</span>
		</div>

		{/* Gap */}
		<div className="col-span-2 flex items-center justify-end">
			<span 
				className="text-sm"
				style={{ 
					color: record.gap === '-' ? COLORS.success : COLORS.textMuted, 
					fontFamily: 'JetBrains Mono, monospace' 
				}}
			>
				{record.gap}
			</span>
		</div>

		{/* iRating */}
		<div className="col-span-1 flex items-center justify-end">
			<span 
				className="text-xs font-semibold"
				style={{ color: COLORS.primary, fontFamily: 'JetBrains Mono, monospace' }}
			>
				{(record.driver.iRating / 1000).toFixed(1)}k
			</span>
		</div>
	</div>
)

// === DRIVER PROFILE MODAL ===
interface DriverProfileModalProps {
	driver: Driver
	onClose: () => void
}

const DriverProfileModal: React.FC<DriverProfileModalProps> = ({ driver, onClose }) => (
	<div 
		className="fixed inset-0 z-50 flex items-center justify-center p-4"
		style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}
		onClick={onClose}
	>
		<div 
			className="carbon-card rounded-2xl p-8 max-w-md w-full"
			style={{ border: '1px solid rgba(255, 107, 0, 0.2)' }}
			onClick={(e) => e.stopPropagation()}
		>
			{/* Close button */}
			<button 
				onClick={onClose}
				className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200"
				style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
				onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 107, 0, 0.2)'}
				onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)'}
			>
				<svg className="w-4 h-4" fill="none" stroke={COLORS.textMuted} viewBox="0 0 24 24">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
				</svg>
			</button>

			{/* Profile Header */}
			<div className="flex items-center gap-4 mb-6">
				<div 
					className="w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-bold"
					style={{ 
						backgroundColor: 'rgba(255, 107, 0, 0.1)',
						border: '2px solid rgba(255, 107, 0, 0.3)',
						color: COLORS.primary,
						fontFamily: 'Bebas Neue, sans-serif'
					}}
				>
					{driver.name.split(' ').map(n => n[0]).join('')}
				</div>
				<div>
					<div className="flex items-center gap-2">
						<h2 
							className="text-2xl font-black uppercase"
							style={{ fontFamily: 'Bebas Neue, sans-serif', color: COLORS.text }}
						>
							{driver.name}
						</h2>
						<span className="text-2xl">{getFlagEmoji(driver.countryCode)}</span>
					</div>
					<p 
						className="text-sm"
						style={{ color: COLORS.primary, fontFamily: 'DM Sans, sans-serif' }}
					>
						{driver.team}
					</p>
				</div>
			</div>

			{/* Stats */}
			<div className="grid grid-cols-2 gap-4 mb-6">
				<div 
					className="p-4 rounded-xl text-center"
					style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}
				>
					<p className="text-xs uppercase tracking-wider mb-1" style={{ color: COLORS.textMuted, fontFamily: 'DM Sans, sans-serif' }}>
						iRating
					</p>
					<p className="text-2xl font-bold" style={{ color: COLORS.primary, fontFamily: 'JetBrains Mono, monospace' }}>
						{driver.iRating.toLocaleString()}
					</p>
				</div>
				<div 
					className="p-4 rounded-xl text-center"
					style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}
				>
					<p className="text-xs uppercase tracking-wider mb-1" style={{ color: COLORS.textMuted, fontFamily: 'DM Sans, sans-serif' }}>
						Safety Rating
					</p>
					<p className="text-2xl font-bold" style={{ color: COLORS.gold, fontFamily: 'JetBrains Mono, monospace' }}>
						{driver.safetyRating.toFixed(2)}
					</p>
				</div>
			</div>

			{/* Country */}
			<div 
				className="flex items-center justify-between p-4 rounded-xl"
				style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }}
			>
				<span className="text-sm" style={{ color: COLORS.textMuted, fontFamily: 'DM Sans, sans-serif' }}>
					Country
				</span>
				<span className="text-sm font-semibold" style={{ color: COLORS.text, fontFamily: 'DM Sans, sans-serif' }}>
					{driver.country}
				</span>
			</div>
		</div>
	</div>
)

export default CommunityPage