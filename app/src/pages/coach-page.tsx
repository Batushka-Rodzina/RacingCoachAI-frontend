// src/pages/coach-page.tsx
import React, { useState, useEffect, useCallback, useMemo } from 'react'
import Sidebar from '../components/Sidebar'
import { useAuthStore } from '../store/authStore'

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'

const COLORS = {
	primary: '#ff6b00',
	primaryHover: '#ff8533',
	text: '#e5e5e5',
	textMuted: '#737373',
}

const SEGMENT_COLORS = [
	'#ff6b6b', '#ffa502', '#ffdd59', '#7bed9f',
	'#70a1ff', '#5352ed', '#a55eea', '#ff6b81',
	'#2ed573', '#1e90ff',
]

// ─── Types ────────────────────────────────────────────────────────────────────

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

interface TelemetryPoint {
	Lat: number
	Lon: number
	LapDistPct: number
}

interface CornerDef {
	name: string
	entry_pct: number
	apex_pct: number
	exit_pct: number
	margin: number
}

type Step = 'session' | 'lap' | 'coach'

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatLapTime = (seconds: number) => {
	if (seconds <= 0) return 'Out Lap'
	const mins = Math.floor(seconds / 60)
	const secs = (seconds % 60).toFixed(3).padStart(6, '0')
	return `${mins}:${secs}`
}

const splitIntoSentences = (text: string): string[] => {
	const lines = text.trim().split('\n').filter((l) => l.trim().length > 0)
	const sentences: string[] = []
	for (const line of lines) {
		const clean = line.replace(/^[-•›]\s*/, '').trim()
		if (!clean) continue
		// Split only on ". " where the dot is NOT preceded by a digit (avoids cutting -0.893 rad)
		const parts = clean
			.split(/(?<!\d)\.\s+(?=[A-Z])/)
			.map((s) => s.trim())
			.filter((s) => s.length > 0)
		sentences.push(...parts)
	}
	return sentences
}

const parseAIText = (rawText: string) => {
	const clean = rawText.replace(
		/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g,
		''
	)
	const mistakeMatch = clean.match(/Mistake Analysis:([\s\S]*?)(?=Correction:|$)/i)
	const correctionMatch = clean.match(/Correction:([\s\S]*)$/i)
	return {
		mistakes: mistakeMatch ? splitIntoSentences(mistakeMatch[1]) : splitIntoSentences(clean),
		corrections: correctionMatch ? splitIntoSentences(correctionMatch[1]) : [],
	}
}

const parseCSV = (text: string): TelemetryPoint[] => {
	const lines = text.trim().split('\n')
	if (lines.length < 2) return []
	const headers = lines[0].split(',').map((h) => h.trim())
	return lines.slice(1).map((line) => {
		const values = line.split(',')
		const obj: Record<string, number> = {}
		headers.forEach((h, i) => { obj[h] = parseFloat(values[i]) || 0 })
		return obj as unknown as TelemetryPoint
	})
}

// ─── Main Component ───────────────────────────────────────────────────────────

const CoachPage: React.FC = () => {
	const token = useAuthStore((state) => state.token)

	// Navigation state
	const [step, setStep] = useState<Step>('session')
	const [selectedSession, setSelectedSession] = useState<Session | null>(null)
	const [selectedLap, setSelectedLap] = useState<Lap | null>(null)
	const [expandedSessionId, setExpandedSessionId] = useState<number | null>(null)

	// Data
	const [sessions, setSessions] = useState<Session[]>([])
	const [sessionsLoading, setSessionsLoading] = useState(true)
	const [telemetry, setTelemetry] = useState<TelemetryPoint[]>([])
	const [telemetryLoading, setTelemetryLoading] = useState(false)
	const [corners, setCorners] = useState<CornerDef[]>([])

	// Coach
	const [selectedCorner, setSelectedCorner] = useState<string | null>(null)
	const [aiCache, setAiCache] = useState<Record<string, any>>({})
	const [isAiLoading, setIsAiLoading] = useState(false)
	const [aiError, setAiError] = useState<string | null>(null)
	const [aiProgress, setAiProgress] = useState(0)
	const [sparks, setSparks] = useState<Array<{ id: number; angle: number; delay: number; tx: number; ty: number }>>([])

	// Brake disc animation
	const discColor = useMemo(() => {
		if (aiProgress < 20) return '#444'
		if (aiProgress < 40) return '#663300'
		if (aiProgress < 60) return '#994400'
		if (aiProgress < 80) return '#cc5500'
		return '#ff6b00'
	}, [aiProgress])
	const glowIntensity = useMemo(() => Math.min(aiProgress / 100, 1), [aiProgress])

	useEffect(() => {
		if (!isAiLoading) { setAiProgress(0); setSparks([]); return }
		const interval = setInterval(() => {
			setAiProgress((prev) => (prev >= 95 ? 95 : prev + 1.2))
		}, 60)
		return () => clearInterval(interval)
	}, [isAiLoading])

	useEffect(() => {
		if (!isAiLoading || aiProgress < 30) return
		const interval = setInterval(() => {
			setSparks((prev) => [...prev.slice(-12), {
				id: Date.now(),
				angle: Math.random() * 360,
				delay: Math.random() * 0.5,
				tx: (Math.random() - 0.5) * 100,
				ty: (Math.random() - 0.5) * 100,
			}])
		}, 150)
		return () => clearInterval(interval)
	}, [isAiLoading, aiProgress])

	// Fetch sessions
	useEffect(() => {
		if (!token) return
		const fetch_ = async () => {
			try {
				const res = await fetch(`${API_URL}/sessions/`, {
					headers: { Authorization: `Bearer ${token}` },
				})
				if (res.ok) setSessions(await res.json())
			} catch (e) {
				console.error(e)
			} finally {
				setSessionsLoading(false)
			}
		}
		fetch_()
	}, [token])

	// Fetch corners
	useEffect(() => {
		fetch(`${API_URL}/analysis/tracks/spa/corners`)
			.then((r) => r.json())
			.then((d) => setCorners(d.corners || []))
			.catch(console.error)
	}, [])

	// Load telemetry when lap is selected
	const loadTelemetry = useCallback(async (lap: Lap) => {
		setTelemetryLoading(true)
		try {
			const res = await fetch(`${lap.telemetry_data_url}?t=${Date.now()}`, {
				mode: 'cors',
				headers: { 'Content-Type': 'text/csv' },
			})
			if (res.ok) {
				const text = await res.text()
				setTelemetry(parseCSV(text))
			}
		} catch (e) {
			console.error(e)
		} finally {
			setTelemetryLoading(false)
		}
	}, [])

	// Track map computation
	const trackMapData = useMemo(() => {
		if (telemetry.length === 0) return null
		const lats = telemetry.map((d) => d.Lat)
		const lons = telemetry.map((d) => d.Lon)
		const minLat = Math.min(...lats), maxLat = Math.max(...lats)
		const minLon = Math.min(...lons), maxLon = Math.max(...lons)
		const padding = 10
		return {
			points: telemetry.map((d) => ({
				x: padding + ((d.Lon - minLon) / (maxLon - minLon)) * (100 - 2 * padding),
				y: padding + ((maxLat - d.Lat) / (maxLat - minLat)) * (100 - 2 * padding),
				lapPct: d.LapDistPct,
			})),
		}
	}, [telemetry])

	// AI Analysis
	const handleAnalyzeCorner = async (cornerName: string) => {
		if (!selectedSession || !selectedLap) return
		if (aiCache[cornerName]) return
		setIsAiLoading(true)
		setAiError(null)
		try {
			const res = await fetch(
				`${API_URL}/analysis/sessions/${selectedSession.id}/laps/${selectedLap.lap_number}/analyze`,
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify({ corner_name: cornerName }),
				}
			)
			if (!res.ok) {
				throw new Error(`Server error: ${res.status} ${res.statusText}`)
			}
			const data = await res.json()
			setAiCache((prev) => ({
				...prev,
				[cornerName]: { ...data, parsedFeedback: parseAIText(data.feedback) },
			}))
		} catch (e: any) {
			const isCors =
				e instanceof TypeError && e.message.toLowerCase().includes('fetch')
			setAiError(
				isCors
					? `CORS error: The backend at ${API_URL} is blocking requests from this origin. Add "http://localhost:4200" to your FastAPI CORS origins.`
					: e.message || 'Unknown error'
			)
			console.error('AI analyze error:', e)
		} finally {
			setIsAiLoading(false)
		}
	}

	const handleSelectLap = (session: Session, lap: Lap) => {
		setSelectedSession(session)
		setSelectedLap(lap)
		setSelectedCorner(null)
		setAiCache({})
		setTelemetry([])
		loadTelemetry(lap)
		setStep('coach')
	}

	const handleBack = () => {
		if (step === 'coach') {
			setStep('session')
			setSelectedSession(null)
			setSelectedLap(null)
			setSelectedCorner(null)
			setTelemetry([])
		}
	}

	const currentAiData = selectedCorner ? aiCache[selectedCorner] : null

	// ─── Render ─────────────────────────────────────────────────────────────────

	return (
		<div className="flex min-h-screen bg-neutral-950 text-white overflow-hidden">
			<style>{`
				@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&family=Orbitron:wght@400;700;900&display=swap');

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
				.custom-scrollbar::-webkit-scrollbar { width: 6px; }
				.custom-scrollbar::-webkit-scrollbar-track { background: rgba(255,255,255,0.02); }
				.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,107,0,0.3); border-radius: 3px; }

				@keyframes rotate {
					from { transform: rotate(0deg); }
					to   { transform: rotate(360deg); }
				}
				.disc-rotate { animation: rotate 2s linear infinite; }

				@keyframes spark {
					0%   { opacity: 1; transform: translateX(0) translateY(0) scale(1); }
					100% { opacity: 0; transform: translateX(var(--tx)) translateY(var(--ty)) scale(0); }
				}
				.spark {
					position: absolute;
					width: 6px; height: 6px;
					border-radius: 50%;
					background: #ffaa00;
					box-shadow: 0 0 6px #ff6600, 0 0 12px #ff4400;
					animation: spark 0.8s ease-out forwards;
				}
				@keyframes heatPulse {
					0%, 100% { opacity: 0.3; }
					50%       { opacity: 0.6; }
				}
				.heat-wave { animation: heatPulse 1s ease-in-out infinite; }

				@keyframes fadeUp {
					from { opacity: 0; transform: translateY(15px); }
					to   { opacity: 1; transform: translateY(0); }
				}
				.animate-fade-up { animation: fadeUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }

				@keyframes scanline {
					0%   { transform: translateY(-100%); }
					100% { transform: translateY(200%); }
				}
				.ai-scanner { position: relative; overflow: hidden; }
				.ai-scanner::after {
					content: '';
					position: absolute; top: 0; left: 0; right: 0; height: 50%;
					background: linear-gradient(to bottom, transparent, rgba(255,107,0,0.2), transparent);
					animation: scanline 2s linear infinite;
					pointer-events: none;
				}
				.ai-card-mistake {
					border: 1px solid rgba(244,63,94,0.2);
					background: linear-gradient(180deg, rgba(244,63,94,0.05) 0%, transparent 100%);
				}
				.ai-card-fix {
					border: 1px solid rgba(16,185,129,0.2);
					background: linear-gradient(180deg, rgba(16,185,129,0.05) 0%, transparent 100%);
				}
			`}</style>

			<Sidebar activeTab="coach" />

			<main className="flex-1 flex flex-col carbon-bg overflow-hidden">
				{/* ─ STEP: Session / Lap picker ─────────────────────────────────── */}
				{step === 'session' && (
					<div className="flex-1 flex flex-col overflow-hidden p-8">
						<header className="mb-8">
							<h1
								className="text-4xl font-black uppercase tracking-wide"
								style={{ fontFamily: 'Bebas Neue', color: COLORS.text }}
							>
								AI Coach
							</h1>
							<p className="text-sm mt-1" style={{ color: COLORS.textMuted }}>
								Select a session and a lap to start coaching.
							</p>
						</header>

						{sessionsLoading ? (
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
							<div className="flex flex-col gap-4 max-w-4xl overflow-y-auto custom-scrollbar pr-2">
								{sessions.map((session) => (
									<div
										key={session.id}
										className="carbon-card rounded-2xl overflow-hidden transition-all duration-300 hover:border-white/10"
									>
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
												<p className="text-sm mt-1" style={{ color: COLORS.textMuted }}>
													{session.track?.name || 'Unknown Track'} •{' '}
													{new Date(session.upload_date).toLocaleDateString()}
												</p>
											</div>
											<div className="flex items-center gap-4">
												<span className="text-xs font-bold px-3 py-1 rounded-full bg-white/5 border border-white/10">
													{session.laps?.length || 0} Laps
												</span>
												<span
													className="transform transition-transform inline-block"
													style={{
														rotate: expandedSessionId === session.id ? '180deg' : '0deg',
													}}
												>
													▼
												</span>
											</div>
										</div>

										{expandedSessionId === session.id && (
											<div className="px-6 pb-6 pt-2 border-t border-white/5 bg-black/20">
												<p
													className="text-xs uppercase tracking-wider font-semibold mb-4"
													style={{ color: COLORS.textMuted }}
												>
													Select a Lap to Coach
												</p>
												<div className="flex flex-wrap gap-3">
													{session.laps && session.laps.length > 0 ? (
														session.laps
															.sort((a, b) => a.lap_number - b.lap_number)
															.map((lap) => (
																<button
																	key={lap.lap_number}
																	onClick={() => handleSelectLap(session, lap)}
																	disabled={!lap.is_valid}
																	className={`px-4 py-3 rounded-xl text-sm font-bold border transition-all ${
																		!lap.is_valid
																			? 'opacity-30 cursor-not-allowed border-transparent bg-white/5'
																			: 'border-white/10 bg-white/5 hover:bg-orange-500/10 hover:border-orange-500/40'
																	}`}
																	style={{ fontFamily: 'JetBrains Mono, monospace' }}
																>
																	L{lap.lap_number}{' '}
																	<span className="ml-2 font-normal opacity-70">
																		{formatLapTime(lap.lap_time)}
																	</span>
																</button>
															))
													) : (
														<p className="text-sm text-red-400">No laps available.</p>
													)}
												</div>
											</div>
										)}
									</div>
								))}
							</div>
						)}
					</div>
				)}

				{/* ─ STEP: Coach view ────────────────────────────────────────────── */}
				{step === 'coach' && (
					<div className="flex-1 flex flex-col overflow-hidden">
						{/* Header */}
						<header className="p-6 border-b border-white/5 flex justify-between items-center bg-black/40 backdrop-blur-md">
							<div>
								<button
									onClick={handleBack}
									className="text-xs text-neutral-500 hover:text-white transition-colors mb-1 font-bold tracking-widest"
								>
									← BACK TO SESSIONS
								</button>
								<h1
									className="text-3xl font-black uppercase tracking-wide"
									style={{ fontFamily: 'Bebas Neue' }}
								>
									AI Coach —{' '}
									<span style={{ color: COLORS.primary }}>
										{selectedSession?.car?.name || 'Unknown Car'}
									</span>
								</h1>
								<p className="text-xs mt-0.5" style={{ color: COLORS.textMuted }}>
									{selectedSession?.track?.name} • Lap #{selectedLap?.lap_number} •{' '}
									{selectedLap ? formatLapTime(selectedLap.lap_time) : ''}
								</p>
							</div>
							{selectedCorner && (
								<button
									onClick={() => setSelectedCorner(null)}
									className="px-5 py-2 border border-orange-500/40 hover:bg-orange-500/10 text-orange-400 rounded-lg text-xs font-bold uppercase transition-all"
								>
									Deselect Corner
								</button>
							)}
						</header>

						<div className="flex-1 flex overflow-hidden">
							{/* LEFT — AI Analysis panel */}
							<div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
								{telemetryLoading && (
									<div className="carbon-card rounded-2xl p-10 text-center">
										<div
											className="animate-pulse text-lg font-bold uppercase tracking-widest"
											style={{ color: COLORS.primary, fontFamily: 'Bebas Neue' }}
										>
											Loading Telemetry...
										</div>
									</div>
								)}

								{!selectedCorner && !telemetryLoading && (
									<div className="carbon-card rounded-2xl p-10 text-center animate-fade-up">
										<div
											className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
											style={{ backgroundColor: 'rgba(255,107,0,0.1)', border: '1px solid rgba(255,107,0,0.2)' }}
										>
											<svg className="w-8 h-8" fill="none" stroke="rgb(255,107,0)" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
													d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
											</svg>
										</div>
										<h3
											className="text-2xl font-black uppercase tracking-wider mb-2"
											style={{ fontFamily: 'Bebas Neue', color: COLORS.text }}
										>
											Select a Corner
										</h3>
										<p className="text-sm" style={{ color: COLORS.textMuted }}>
											Click a corner on the track map or from the list on the right to start AI coaching.
										</p>
									</div>
								)}

								{selectedCorner && (
									<div className="rounded-2xl overflow-hidden bg-neutral-900/80 border border-orange-500/20 shadow-[0_0_30px_rgba(255,107,0,0.05)] backdrop-blur-xl animate-fade-up">
										{/* Panel Header */}
										<div className="p-5 flex justify-between items-center border-b border-white/5 relative overflow-hidden">
											<div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-orange-500 to-transparent opacity-50" />
											<div>
												<h3
													className="text-2xl font-black uppercase tracking-wider flex items-center gap-3"
													style={{ fontFamily: 'Bebas Neue' }}
												>
													<span className="text-orange-400 animate-pulse">●</span> RACE_COACH_AI
												</h3>
												<p className="text-xs text-neutral-400 font-mono mt-1">
													Target Segment: {selectedCorner}
												</p>
											</div>
											{!currentAiData && !isAiLoading && (
												<button
													onClick={() => handleAnalyzeCorner(selectedCorner)}
													className="px-6 py-3 bg-orange-600 hover:bg-orange-500 rounded-xl text-xs font-bold uppercase tracking-widest transition-all shadow-[0_0_15px_rgba(255,107,0,0.4)] hover:shadow-[0_0_25px_rgba(255,107,0,0.6)]"
												>
													Initialize Analysis
												</button>
											)}
										</div>

										{/* Loading — Brake Disc Animation */}
										{isAiLoading && (
											<div className="p-8 flex flex-col items-center">
												{/* Brake Disc Assembly */}
												<div className="relative w-48 h-48 mb-6">
													{/* Heat Glow */}
													<div
														className="absolute inset-0 rounded-full heat-wave"
														style={{
															background: `radial-gradient(circle, ${discColor}40 0%, transparent 70%)`,
															filter: 'blur(16px)',
															opacity: glowIntensity,
														}}
													/>
													{/* Outer Ring */}
													<div
														className="absolute inset-0 rounded-full"
														style={{ border: '4px solid #333', boxShadow: 'inset 0 0 20px rgba(0,0,0,0.8)' }}
													/>
													{/* Rotating Disc */}
													<div
														className="absolute inset-4 rounded-full disc-rotate"
														style={{
															background: `conic-gradient(
																from 0deg,
																${discColor} 0deg, #333 30deg, ${discColor} 60deg, #333 90deg,
																${discColor} 120deg, #333 150deg, ${discColor} 180deg, #333 210deg,
																${discColor} 240deg, #333 270deg, ${discColor} 300deg, #333 330deg,
																${discColor} 360deg
															)`,
															boxShadow: `inset 0 0 30px rgba(0,0,0,0.5), 0 0 ${20 * glowIntensity}px ${discColor}`,
														}}
													>
														{/* Ventilation holes */}
														<svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
															{[...Array(12)].map((_, i) => {
																const angle = i * 30 * (Math.PI / 180)
																return (
																	<circle
																		key={i}
																		cx={50 + 30 * Math.cos(angle)}
																		cy={50 + 30 * Math.sin(angle)}
																		r="4"
																		fill="#1a1a1a"
																		stroke="#111"
																		strokeWidth="0.5"
																	/>
																)
															})}
														</svg>
													</div>
													{/* Center Hub */}
													<div
														className="absolute inset-[35%] rounded-full flex items-center justify-center"
														style={{
															background: 'linear-gradient(145deg, #2a2a2a, #1a1a1a)',
															border: '3px solid #333',
															boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.8)',
														}}
													>
														<svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
															{[...Array(5)].map((_, i) => {
																const angle = (i * 72 - 90) * (Math.PI / 180)
																return (
																	<circle key={i}
																		cx={50 + 25 * Math.cos(angle)}
																		cy={50 + 25 * Math.sin(angle)}
																		r="5" fill="#222" stroke="#444" strokeWidth="1"
																	/>
																)
															})}
														</svg>
														<span
															className="text-xl font-black relative z-10"
															style={{
																fontFamily: 'Orbitron, sans-serif',
																color: aiProgress > 50 ? COLORS.primary : COLORS.text,
																textShadow: aiProgress > 50 ? `0 0 10px ${COLORS.primary}` : 'none',
															}}
														>
															{Math.round(aiProgress)}%
														</span>
													</div>
													{/* Sparks */}
													{sparks.map((spark) => (
														<div
															key={spark.id}
															className="spark"
															style={{
																top: '50%', left: '50%',
																'--tx': `${spark.tx}px`,
																'--ty': `${spark.ty}px`,
																animationDelay: `${spark.delay}s`,
																transform: `rotate(${spark.angle}deg) translateX(60px)`,
															} as React.CSSProperties}
														/>
													))}
													{/* Heat Lines */}
													{aiProgress > 60 && (
														<svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100">
															{[...Array(6)].map((_, i) => {
																const angle = (i * 60 + aiProgress) * (Math.PI / 180)
																return (
																	<line key={i}
																		x1={50 + 35 * Math.cos(angle)} y1={50 + 35 * Math.sin(angle)}
																		x2={50 + 45 * Math.cos(angle)} y2={50 + 45 * Math.sin(angle)}
																		stroke={COLORS.primary} strokeWidth="1" opacity={0.5}
																		className="heat-wave"
																		style={{ animationDelay: `${i * 0.15}s` }}
																	/>
																)
															})}
														</svg>
													)}
												</div>
												{/* Progress bar */}
												<div className="w-56 mb-3">
													<div className="flex justify-between text-[10px] mb-1" style={{ color: COLORS.textMuted }}>
														<span>COLD</span><span>OPTIMAL</span><span>HOT</span>
													</div>
													<div className="h-2 rounded-full overflow-hidden" style={{ background: 'linear-gradient(90deg, #334, #663300, #994400, #cc5500, #ff6b00)', opacity: 0.3 }}>
														<div
															className="h-full rounded-full transition-all duration-100 ease-out"
															style={{
																width: `${aiProgress}%`,
																background: 'linear-gradient(90deg, #444 0%, #663300 25%, #994400 50%, #cc5500 75%, #ff6b00 100%)',
																boxShadow: aiProgress > 50 ? `0 0 8px ${discColor}` : 'none',
															}}
														/>
													</div>
												</div>
												<p className="font-mono text-xs uppercase tracking-widest" style={{ color: COLORS.primary }}>
													Processing telemetry stream...
												</p>
											</div>
										)}

										{/* CORS / fetch error */}
										{aiError && !isAiLoading && (
											<div className="p-6">
												<div className="rounded-xl p-4 bg-red-500/10 border border-red-500/30">
													<p className="font-bold text-red-400 mb-1 uppercase text-xs tracking-widest">Analysis Failed</p>
													<p className="text-red-300/80 font-mono text-xs leading-relaxed">{aiError}</p>
													<button
														onClick={() => setAiError(null)}
														className="mt-3 text-xs text-red-400 hover:text-red-300 underline"
													>
														Dismiss
													</button>
												</div>
											</div>
										)}

										{/* Results */}
										{currentAiData && !isAiLoading && (
											<div className="p-6 grid grid-cols-1 xl:grid-cols-2 gap-8">
												{/* Metrics table */}
												<div>
													<p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-4">
														Telemetry Delta
													</p>
													<div className="bg-black/40 rounded-xl border border-white/5 overflow-hidden">
														<table className="w-full text-left text-xs font-mono">
															<thead>
																<tr className="bg-white/5 text-neutral-400">
																	<th className="py-3 px-4 font-normal">Metric</th>
																	<th className="py-3 px-4 font-normal text-right">You</th>
																	<th className="py-3 px-4 font-normal text-right">Pro</th>
																	<th className="py-3 px-4 font-normal text-right">Delta</th>
																</tr>
															</thead>
															<tbody className="divide-y divide-white/5">
																<ComparisonRow label="Entry Spd" val1={currentAiData.drv_metrics?.entry_speed} val2={currentAiData.ref_metrics?.entry_speed} unit="km/h" inverse={false} />
																<ComparisonRow label="Min Spd" val1={currentAiData.drv_metrics?.min_speed} val2={currentAiData.ref_metrics?.min_speed} unit="km/h" inverse={false} />
																<ComparisonRow label="Apex Throt" val1={currentAiData.drv_metrics?.apex_throttle} val2={currentAiData.ref_metrics?.apex_throttle} unit="%" inverse={false} />
																<ComparisonRow label="Exit Spd" val1={currentAiData.drv_metrics?.exit_speed} val2={currentAiData.ref_metrics?.exit_speed} unit="km/h" inverse={false} />
															</tbody>
														</table>
													</div>
												</div>

												{/* AI Text */}
												<div className="space-y-4">
													{currentAiData.parsedFeedback.mistakes.length > 0 && (
														<div className="ai-card-mistake rounded-xl p-5">
															<p className="text-[10px] font-bold text-rose-500 uppercase tracking-widest mb-3 flex items-center gap-2">
																<span className="w-1.5 h-1.5 rounded-full bg-rose-500" /> Identified Mistakes
															</p>
															<p className="text-sm text-neutral-300 font-sans leading-relaxed">
																{currentAiData.parsedFeedback.mistakes.join(' ')}
															</p>
														</div>
													)}
													{currentAiData.parsedFeedback.corrections.length > 0 && (
														<div className="ai-card-fix rounded-xl p-5">
															<p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mb-3 flex items-center gap-2">
																<span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Actionable Corrections
															</p>
															<p className="text-sm text-white font-sans font-medium leading-relaxed">
																{currentAiData.parsedFeedback.corrections.join(' ')}
															</p>
														</div>
													)}
												</div>
											</div>
										)}

										{/* Prompt when corner selected but not yet analyzed */}
										{!currentAiData && !isAiLoading && (
											<div className="p-8 text-center">
												<p className="text-sm font-mono text-neutral-500">
													Press "Initialize Analysis" to get AI feedback on{' '}
													<span className="text-orange-400">{selectedCorner}</span>.
												</p>
											</div>
										)}
									</div>
								)}
							</div>

							{/* RIGHT — Track map + corner list */}
							<div className="w-80 bg-black/60 border-l border-white/5 p-6 flex flex-col gap-6 shadow-[-10px_0_30px_rgba(0,0,0,0.5)]">
								{/* Track Map */}
								<div className="aspect-square bg-neutral-900/80 rounded-2xl border border-white/5 p-4 relative shadow-inner">
									<p className="absolute top-4 w-full left-0 text-center text-[10px] font-bold text-neutral-500 uppercase tracking-widest z-10">
										{selectedSession?.track?.name || 'Track Map'}
									</p>
									{telemetryLoading && (
										<div className="flex items-center justify-center h-full">
											<div className="text-[10px] uppercase tracking-widest animate-pulse" style={{ color: COLORS.primary }}>
												Loading...
											</div>
										</div>
									)}
									{trackMapData && !telemetryLoading && (
										<svg viewBox="0 0 100 100" className="w-full h-full relative z-0">
											{/* Base track outline */}
											<path
												d={trackMapData.points.map((p, j) => `${j === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')}
												fill="none"
												stroke="rgba(255,255,255,0.15)"
												strokeWidth="2.5"
												strokeLinecap="round"
												strokeLinejoin="round"
											/>
											{/* Corner segments */}
											{corners.map((corner, i) => {
												const pts = trackMapData.points.filter(
													(p) => p.lapPct >= corner.entry_pct && p.lapPct <= corner.exit_pct
												)
												if (pts.length < 2) return null

												const pathParts: string[] = []
												let cur: string[] = []
												for (let j = 0; j < pts.length; j++) {
													const c = pts[j]
													if (j === 0) { cur.push(`M ${c.x} ${c.y}`); continue }
													const prev = pts[j - 1]
													const dist = Math.sqrt(Math.pow(c.x - prev.x, 2) + Math.pow(c.y - prev.y, 2))
													if (dist > 8) {
														if (cur.length > 1) pathParts.push(cur.join(' '))
														cur = [`M ${c.x} ${c.y}`]
													} else {
														cur.push(`L ${c.x} ${c.y}`)
													}
												}
												if (cur.length > 1) pathParts.push(cur.join(' '))
												const pathD = pathParts.join(' ')
												if (!pathD) return null

												const isSelected = selectedCorner === corner.name
												const color = SEGMENT_COLORS[i % SEGMENT_COLORS.length]
												const isCached = !!aiCache[corner.name]

												return (
													<path
														key={corner.name}
														d={pathD}
														fill="none"
														stroke={color}
														strokeWidth={isSelected ? 5 : 3}
														strokeLinecap="round"
														style={{
															opacity: selectedCorner === null ? 0.8 : isSelected ? 1 : 0.2,
															filter: isSelected ? `drop-shadow(0 0 4px ${color})` : 'none',
															cursor: 'pointer',
														}}
														onClick={() => { setSelectedCorner(corner.name); setAiError(null) }}
													/>
												)
											})}
										</svg>
									)}
									{!trackMapData && !telemetryLoading && (
										<div className="flex items-center justify-center h-full">
											<p className="text-[10px] text-neutral-600 uppercase tracking-widest text-center">
												Map loads after<br />telemetry
											</p>
										</div>
									)}
								</div>

								{/* Corner list */}
								<div className="flex-1 overflow-y-auto custom-scrollbar pr-1 space-y-2">
									<p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest ml-1 sticky top-0 bg-black/60 py-2 backdrop-blur-md">
										Corner Selection
									</p>
									{corners.map((c, i) => {
										const isSelected = selectedCorner === c.name
										const isCached = !!aiCache[c.name]
										const color = SEGMENT_COLORS[i % SEGMENT_COLORS.length]

										return (
											<button
												key={c.name}
												onClick={() => { setSelectedCorner(c.name); setAiError(null) }}
												className={`w-full text-left p-4 rounded-xl text-xs font-bold transition-all border flex justify-between items-center group
                          ${isSelected ? 'bg-white/10 shadow-lg' : 'border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/10'}`}
												style={{
													borderTopColor: isSelected ? color : 'rgba(255,255,255,0.05)',
													borderRightColor: isSelected ? color : 'rgba(255,255,255,0.05)',
													borderBottomColor: isSelected ? color : 'rgba(255,255,255,0.05)',
													borderLeftColor: color,
													borderLeftWidth: '4px',
												}}
											>
												<div>
													<span className={`mr-2 ${isSelected ? 'text-white' : 'opacity-40'}`}>
														{i + 1}
													</span>
													<span className={isSelected ? 'text-white' : 'text-neutral-400 group-hover:text-white'}>
														{c.name}
													</span>
												</div>
												{isCached && (
													<span className="text-[8px] uppercase px-2 py-0.5 rounded bg-orange-500/20 text-orange-400 border border-orange-500/30">
														Analyzed
													</span>
												)}
											</button>
										)
									})}
								</div>
							</div>
						</div>
					</div>
				)}
			</main>
		</div>
	)
}

// ─── Helper Components ────────────────────────────────────────────────────────

const ComparisonRow: React.FC<{
	label: string
	val1: number
	val2: number
	unit: string
	inverse: boolean
}> = ({ label, val1, val2, unit, inverse }) => {
	const delta = (val1 || 0) - (val2 || 0)
	const isPositive = delta > 0
	const isGood = (isPositive && !inverse) || (!isPositive && inverse)
	const color =
		Math.abs(delta) < 0.1
			? 'text-neutral-500'
			: isGood
				? 'text-emerald-400'
				: 'text-rose-400'

	return (
		<tr className="group hover:bg-white/5 transition-colors">
			<td className="py-3 px-4 text-neutral-400 group-hover:text-white transition-colors">{label}</td>
			<td className="py-3 px-4 text-right text-white">{val1?.toFixed(1)} {unit}</td>
			<td className="py-3 px-4 text-right text-neutral-500">{val2?.toFixed(1)} {unit}</td>
			<td className={`py-3 px-4 text-right font-bold ${color}`}>
				{delta > 0 ? '+' : ''}{delta.toFixed(1)}
			</td>
		</tr>
	)
}

export default CoachPage