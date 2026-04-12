import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import { useAuthStore } from '../store/authStore'

const API_URL = 'http://127.0.0.1:8000/sessions'

const COLORS = {
	primary: '#ff6b00',
	text: '#e5e5e5',
	textMuted: '#737373',
}

interface Lap {
	lap_number: number
	lap_time: number
	is_valid: boolean
	telemetry_data_url: string
}

interface Session {
	id: number
	upload_date: string
	car: { name: string; car_class: string } | null
	track: { name: string; config_name: string } | null
	laps: Lap[]
}

const formatLapTime = (seconds: number) => {
	if (seconds <= 0) return 'Out Lap'
	const mins = Math.floor(seconds / 60)
	const secs = (seconds % 60).toFixed(3).padStart(6, '0')
	return `${mins}:${secs}`
}

const SessionsListPage: React.FC = () => {
	const token = useAuthStore((state) => state.token)
	const navigate = useNavigate()

	const [sessions, setSessions] = useState<Session[]>([])
	const [isLoading, setIsLoading] = useState(true)
	const [expandedSessionId, setExpandedSessionId] = useState<number | null>(
		null
	)

	useEffect(() => {
		const fetchSessions = async () => {
			try {
				const response = await fetch(`${API_URL}/`, {
					headers: { Authorization: `Bearer ${token}` },
				})
				if (response.ok) {
					const data = await response.json()
					setSessions(data)
				}
			} catch (err) {
				console.error('Failed to fetch sessions', err)
			} finally {
				setIsLoading(false)
			}
		}
		if (token) fetchSessions()
	}, [token])

	return (
		<div className="flex min-h-screen bg-neutral-950 text-white font-sans">
			<style
				dangerouslySetInnerHTML={{
					__html: `
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
          border: 1px solid rgba(255, 255, 255, 0.05);
        }
      `,
				}}
			/>
			<Sidebar activeTab="telemetry" />

			<div className="flex-1 flex flex-col carbon-bg p-8 overflow-y-auto">
				<header className="mb-10">
					<h1
						className="text-4xl font-black uppercase tracking-wide"
						style={{ fontFamily: 'Bebas Neue, sans-serif', color: COLORS.text }}
					>
						Your Sessions
					</h1>
					<p className="text-sm mt-2" style={{ color: COLORS.textMuted }}>
						Select a session and click on a lap to start the analysis.
					</p>
				</header>

				{isLoading ? (
					<div
						className="animate-pulse text-xl font-bold uppercase"
						style={{ color: COLORS.primary, fontFamily: 'Bebas Neue' }}
					>
						Loading sessions...
					</div>
				) : sessions.length === 0 ? (
					<div className="carbon-card rounded-2xl p-16 text-center max-w-lg mx-auto mt-10">
						<h2
							className="text-2xl font-black uppercase tracking-wide mb-2"
							style={{ fontFamily: 'Bebas Neue', color: COLORS.text }}
						>
							No Sessions Found
						</h2>
						<p className="text-sm" style={{ color: COLORS.textMuted }}>
							Run the Bolide Desktop App while driving in iRacing to
							automatically sync your telemetry here.
						</p>
					</div>
				) : (
					<div className="flex flex-col gap-4 max-w-5xl">
						{sessions.map((session) => (
							<div
								key={session.id}
								className="carbon-card rounded-2xl overflow-hidden transition-all duration-300 hover:border-white/10"
							>
								{/* Pasek główny sesji */}
								<div
									className="p-6 flex justify-between items-center cursor-pointer"
									onClick={() =>
										setExpandedSessionId(
											expandedSessionId === session.id ? null : session.id
										)
									}
								>
									<div>
										<h3 className="text-xl font-bold">
											{session.car?.name || 'Unknown Car'}
										</h3>
										<p
											className="text-sm mt-1"
											style={{ color: COLORS.textMuted }}
										>
											{session.track?.name || 'Unknown Track'} •{' '}
											{new Date(session.upload_date).toLocaleDateString()}
										</p>
									</div>
									<div className="flex items-center gap-4">
										<span className="text-xs font-bold px-3 py-1 rounded-full bg-white/5 border border-white/10">
											{session.laps?.length || 0} Laps
										</span>
										<span
											className="transform transition-transform"
											style={{
												rotate:
													expandedSessionId === session.id ? '180deg' : '0deg',
											}}
										>
											▼
										</span>
									</div>
								</div>

								{/* Rozwijana lista okrążeń */}
								{expandedSessionId === session.id && (
									<div className="px-6 pb-6 pt-2 border-t border-white/5 bg-black/20">
										<p
											className="text-xs uppercase tracking-wider font-semibold mb-4"
											style={{ color: COLORS.textMuted }}
										>
											Available Laps
										</p>
										<div className="flex flex-wrap gap-3">
											{session.laps && session.laps.length > 0 ? (
												session.laps
													.sort((a, b) => a.lap_number - b.lap_number)
													.map((lap) => (
														<button
															key={lap.lap_number}
															onClick={() =>
																navigate(
																	`/telemetry/session/${session.id}/lap/${lap.lap_number}`
																)
															}
															disabled={!lap.is_valid}
															className={`px-4 py-3 rounded-xl text-sm font-bold border transition-all ${!lap.is_valid ? 'opacity-30 cursor-not-allowed border-transparent bg-white/5' : 'hover:border-primary border-white/10 bg-white/5 hover:bg-white/10'}`}
															style={{
																fontFamily: 'JetBrains Mono, monospace',
															}}
														>
															L{lap.lap_number}{' '}
															<span className="ml-2 font-normal opacity-70">
																{formatLapTime(lap.lap_time)}
															</span>
														</button>
													))
											) : (
												<p className="text-sm text-red-400">
													No laps data available for this session.
												</p>
											)}
										</div>
									</div>
								)}
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	)
}

export default SessionsListPage
