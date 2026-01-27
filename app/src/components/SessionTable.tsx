// src/components/SessionTable.tsx
import React from 'react'

// === KOLORY PREMIUM IRACING ===
const COLORS = {
	primary: '#ff6b00',
	primaryHover: '#ff8533',
	gold: '#d4af37',
	carbon: '#1a1a1a',
	text: '#e5e5e5',
	textMuted: '#737373',
	success: '#22c55e',
}

interface LapData {
	id: number
	lapNumber: number
	lapTime: string
	s1: string
	s2: string
	s3: string
	isPersonalBest?: boolean
	delta?: string
}

const sessions: LapData[] = [
	{ id: 1, lapNumber: 12, lapTime: "1:24.302", s1: "28.102", s2: "32.400", s3: "23.800", isPersonalBest: true, delta: "-" },
	{ id: 2, lapNumber: 11, lapTime: "1:25.110", s1: "28.450", s2: "32.610", s3: "24.050", delta: "+0.808" },
	{ id: 3, lapNumber: 10, lapTime: "1:24.890", s1: "28.220", s2: "32.550", s3: "24.120", delta: "+0.588" },
	{ id: 4, lapNumber: 9, lapTime: "1:26.400", s1: "29.100", s2: "33.100", s3: "24.200", delta: "+2.098" },
	{ id: 5, lapNumber: 8, lapTime: "1:25.750", s1: "28.800", s2: "32.850", s3: "24.100", delta: "+1.448" },
]

const SessionTable: React.FC = () => {
	return (
		<div 
			className="rounded-2xl overflow-hidden"
			style={{
				backgroundColor: 'rgba(26, 26, 26, 0.6)',
				border: '1px solid rgba(255, 255, 255, 0.05)',
				boxShadow: '0 25px 50px rgba(0, 0, 0, 0.3)'
			}}
		>
			{/* Header */}
			<div 
				className="px-6 py-4 flex justify-between items-center"
				style={{
					backgroundColor: 'rgba(26, 26, 26, 0.8)',
					borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
				}}
			>
				<div>
					<h3 
						className="text-lg font-black uppercase tracking-wide"
						style={{ 
							fontFamily: 'Bebas Neue, sans-serif',
							color: COLORS.text
						}}
					>
						Recent Laps
					</h3>
					<p 
						className="text-xs"
						style={{ 
							color: COLORS.textMuted,
							fontFamily: 'DM Sans, sans-serif'
						}}
					>
						Spa-Francorchamps • GT3
					</p>
				</div>
				<div 
					className="px-3 py-1 rounded-full text-xs font-semibold"
					style={{ 
						backgroundColor: 'rgba(255, 107, 0, 0.1)',
						color: COLORS.primary,
						fontFamily: 'DM Sans, sans-serif'
					}}
				>
					{sessions.length} laps
				</div>
			</div>

			{/* Table */}
			<div className="overflow-x-auto">
				<table className="w-full text-left text-sm">
					<thead>
						<tr 
							style={{ 
								backgroundColor: 'rgba(0, 0, 0, 0.3)',
								borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
							}}
						>
							<th 
								className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold"
								style={{ color: COLORS.textMuted, fontFamily: 'DM Sans, sans-serif' }}
							>
								Lap
							</th>
							<th 
								className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold"
								style={{ color: COLORS.text, fontFamily: 'DM Sans, sans-serif' }}
							>
								Lap Time
							</th>
							<th 
								className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold"
								style={{ color: COLORS.textMuted, fontFamily: 'DM Sans, sans-serif' }}
							>
								Delta
							</th>
							<th 
								className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold"
								style={{ color: COLORS.textMuted, fontFamily: 'DM Sans, sans-serif' }}
							>
								S1
							</th>
							<th 
								className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold"
								style={{ color: COLORS.textMuted, fontFamily: 'DM Sans, sans-serif' }}
							>
								S2
							</th>
							<th 
								className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold"
								style={{ color: COLORS.textMuted, fontFamily: 'DM Sans, sans-serif' }}
							>
								S3
							</th>
							<th className="px-6 py-4 text-right">
								<span className="sr-only">Actions</span>
							</th>
						</tr>
					</thead>
					<tbody style={{ fontFamily: 'JetBrains Mono, monospace' }}>
						{sessions.map((lap) => (
							<tr 
								key={lap.id}
								className="transition-all duration-200 cursor-pointer"
								style={{
									backgroundColor: lap.isPersonalBest ? 'rgba(255, 107, 0, 0.05)' : 'transparent',
									borderBottom: '1px solid rgba(255, 255, 255, 0.03)'
								}}
								onMouseEnter={(e) => {
									e.currentTarget.style.backgroundColor = lap.isPersonalBest 
										? 'rgba(255, 107, 0, 0.1)' 
										: 'rgba(255, 255, 255, 0.03)'
								}}
								onMouseLeave={(e) => {
									e.currentTarget.style.backgroundColor = lap.isPersonalBest 
										? 'rgba(255, 107, 0, 0.05)' 
										: 'transparent'
								}}
							>
								<td className="px-6 py-4" style={{ color: COLORS.textMuted }}>
									{lap.lapNumber}
								</td>
								<td className="px-6 py-4">
									<div className="flex items-center gap-2">
										<span 
											className="font-bold"
											style={{ color: lap.isPersonalBest ? COLORS.primary : COLORS.text }}
										>
											{lap.lapTime}
										</span>
										{lap.isPersonalBest && (
											<span 
												className="text-[9px] px-2 py-0.5 rounded-full font-bold uppercase"
												style={{ 
													backgroundColor: 'rgba(255, 107, 0, 0.2)',
													color: COLORS.primary,
													fontFamily: 'DM Sans, sans-serif'
												}}
											>
												PB
											</span>
										)}
									</div>
								</td>
								<td className="px-6 py-4">
									<span style={{ 
										color: lap.delta === '-' ? COLORS.textMuted : 
											   lap.delta?.startsWith('+') ? '#ef4444' : COLORS.success
									}}>
										{lap.delta}
									</span>
								</td>
								<td className="px-6 py-4" style={{ color: COLORS.text }}>{lap.s1}</td>
								<td className="px-6 py-4" style={{ color: COLORS.text }}>{lap.s2}</td>
								<td className="px-6 py-4" style={{ color: COLORS.text }}>{lap.s3}</td>
								<td className="px-6 py-4 text-right">
									<button 
										className="p-2 rounded-lg transition-all duration-200"
										style={{ color: COLORS.textMuted }}
										onMouseEnter={(e) => {
											e.currentTarget.style.color = COLORS.primary
											e.currentTarget.style.backgroundColor = 'rgba(255, 107, 0, 0.1)'
										}}
										onMouseLeave={(e) => {
											e.currentTarget.style.color = COLORS.textMuted
											e.currentTarget.style.backgroundColor = 'transparent'
										}}
									>
										<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
											<path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
										</svg>
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			{/* Footer */}
			<div 
				className="px-6 py-4 flex justify-between items-center"
				style={{
					backgroundColor: 'rgba(0, 0, 0, 0.2)',
					borderTop: '1px solid rgba(255, 255, 255, 0.05)'
				}}
			>
				<p 
					className="text-xs"
					style={{ color: COLORS.textMuted, fontFamily: 'DM Sans, sans-serif' }}
				>
					Showing {sessions.length} of 47 laps
				</p>
				<button
					className="text-xs font-semibold uppercase tracking-wider transition-colors duration-200"
					style={{ 
						color: COLORS.primary,
						fontFamily: 'DM Sans, sans-serif'
					}}
					onMouseEnter={(e) => e.currentTarget.style.color = COLORS.primaryHover}
					onMouseLeave={(e) => e.currentTarget.style.color = COLORS.primary}
				>
					View All →
				</button>
			</div>
		</div>
	)
}

export default SessionTable