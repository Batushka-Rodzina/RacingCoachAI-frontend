import React, { useCallback, useEffect, useId, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import { useAuthStore } from '../store/authStore'

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'
const COLORS = {
	primary: '#ff6b00',
	primaryHover: '#ff8533',
	text: '#e5e5e5',
	textMuted: '#737373',
	throttle: '#22c55e',
	brake: '#ef4444',
	speed: '#3b82f6',
	rpm: '#a855f7',
}
const SEGMENT_COLORS = [
	'#ff6b6b',
	'#ffa502',
	'#ffdd59',
	'#7bed9f',
	'#70a1ff',
	'#5352ed',
	'#a55eea',
	'#ff6b81',
	'#2ed573',
	'#1e90ff',
]

interface TelemetryData {
	Speed: number
	LapDistPct: number
	Lat: number
	Lon: number
	Brake: number
	Throttle: number
	RPM: number
	SteeringWheelAngle: number
	Gear: number
	Clutch: number
	ABSActive: boolean
	DRSActive: boolean
	LatAccel: number
	LongAccel: number
	VertAccel: number
	Yaw: number
	YawRate: number
	PositionType: number
}

interface CornerDef {
	name: string
	entry_pct: number
	apex_pct: number
	exit_pct: number
	margin: number
}

const cssStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap');
  .carbon-bg { background-color: #0a0a0a; background-image: linear-gradient(45deg, #0f0f0f 25%, transparent 25%), linear-gradient(-45deg, #0f0f0f 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #0f0f0f 75%), linear-gradient(-45deg, transparent 75%, #0f0f0f 75%); background-size: 4px 4px; }
  .carbon-card { background-color: rgba(26, 26, 26, 0.6); border: 1px solid rgba(255, 255, 255, 0.05); }
  .custom-scrollbar::-webkit-scrollbar { width: 6px; }
  .custom-scrollbar::-webkit-scrollbar-track { background: rgba(255, 255, 255, 0.02); }
  .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 107, 0, 0.3); border-radius: 3px; }
`

const TelemetryAnalysisPage: React.FC = () => {
	const { sessionId, lapNum } = useParams<{
		sessionId: string
		lapNum: string
	}>()
	const navigate = useNavigate()
	const token = useAuthStore((state) => state.token)

	const [telemetryData, setTelemetryData] = useState<TelemetryData[]>([])
	const [corners, setCorners] = useState<CornerDef[]>([])
	const [isLoading, setIsLoading] = useState(true)
	const [errorMsg, setErrorMsg] = useState<string | null>(null)

	const [hoverIndex, setHoverIndex] = useState<number | null>(null)
	const [selectedCornerName, setSelectedCornerName] = useState<string | null>(null)

	const parseCSV = useCallback((text: string): TelemetryData[] => {
		const lines = text.trim().split('\n')
		if (lines.length < 2) return []
		const headers = lines[0].split(',')

		return lines.slice(1).map((line) => {
			const values = line.split(',')
			const obj: Record<string, number | boolean> = {}
			headers.forEach((header, i) => {
				const cleanHeader = header.trim()
				const value = values[i]
				if (cleanHeader === 'ABSActive' || cleanHeader === 'DRSActive')
					obj[cleanHeader] = value.toLowerCase() === 'true'
				else obj[cleanHeader] = parseFloat(value) || 0
			})
			return obj as unknown as TelemetryData
		})
	}, [])

	useEffect(() => {
		const fetchData = async () => {
			setIsLoading(true)
			try {
				const cornersRes = await fetch(`${API_URL}/analysis/tracks/spa/corners`)
				if (cornersRes.ok) setCorners((await cornersRes.json()).corners)

				const sesRes = await fetch(`${API_URL}/sessions/${sessionId}`, {
					headers: { Authorization: `Bearer ${token}` },
				})
				if (!sesRes.ok) throw new Error('Session not found')
				const sessionData = await sesRes.json()

				const targetLap = sessionData.laps.find(
					(l: any) => l.lap_number.toString() === lapNum
				)
				if (!targetLap) throw new Error('Lap not found in this session')

				const csvRes = await fetch(
					`${targetLap.telemetry_data_url}?t=${Date.now()}`,
					{
						method: 'GET',
						mode: 'cors',
						headers: { 'Content-Type': 'text/csv' },
					}
				)
				if (!csvRes.ok) throw new Error('Failed to load telemetry from AWS S3.')

				const csvText = await csvRes.text()
				setTelemetryData(parseCSV(csvText))
			} catch (err: any) {
				console.error(err)
				setErrorMsg(err.message || 'Unknown error occurred')
			} finally {
				setIsLoading(false)
			}
		}
		if (sessionId && lapNum && token) fetchData()
	}, [sessionId, lapNum, token, parseCSV])

	// --- OBLICZENIA WIZUALNE I MAPA ---
	const selectedCornerDef = useMemo(
		() => corners.find((c) => c.name === selectedCornerName) || null,
		[selectedCornerName, corners]
	)

	const trackMapData = useMemo(() => {
		if (telemetryData.length === 0) return null
		const lats = telemetryData.map((d) => d.Lat),
			lons = telemetryData.map((d) => d.Lon)
		const minLat = Math.min(...lats),
			maxLat = Math.max(...lats)
		const minLon = Math.min(...lons),
			maxLon = Math.max(...lons)
		const padding = 10

		const normalizedPoints = telemetryData.map((d) => ({
			x: padding + ((d.Lon - minLon) / (maxLon - minLon)) * (100 - 2 * padding),
			y: padding + ((maxLat - d.Lat) / (maxLat - minLat)) * (100 - 2 * padding),
			lapPct: d.LapDistPct,
		}))
		return { points: normalizedPoints }
	}, [telemetryData])

	const filteredData = useMemo(() => {
		if (!selectedCornerDef) return { data: telemetryData, startIndex: 0 }
		const start = selectedCornerDef.entry_pct - selectedCornerDef.margin
		const end = selectedCornerDef.exit_pct + selectedCornerDef.margin
		const filtered = telemetryData.filter(
			(d) => d.LapDistPct >= start && d.LapDistPct <= end
		)
		const startIndex = telemetryData.findIndex(
			(d) => d.LapDistPct >= start && d.LapDistPct <= end
		)
		return { data: filtered, startIndex: Math.max(0, startIndex) }
	}, [telemetryData, selectedCornerDef])

	const chartData = useMemo(() => {
		if (filteredData.data.length === 0) return null
		const speeds = filteredData.data.map((d) => d.Speed)
		const rpms = filteredData.data.map((d) => d.RPM)
		const throttles = filteredData.data.map((d) => d.Throttle * 100)
		const brakes = filteredData.data.map((d) => d.Brake * 100)

		return {
			speeds,
			rpms,
			throttles,
			brakes,
			maxSpeed: Math.max(...speeds),
			minSpeed: Math.min(...speeds),
			maxRPM: Math.max(...rpms),
			avgThrottle: throttles.reduce((a, b) => a + b, 0) / throttles.length,
			avgBrake: brakes.reduce((a, b) => a + b, 0) / brakes.length,
		}
	}, [filteredData])

	const handleChartHover = useCallback(
		(e: React.MouseEvent<SVGSVGElement>, dataLength: number) => {
			const rect = e.currentTarget.getBoundingClientRect()
			const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width))
			const localIndex = Math.floor((x / rect.width) * (dataLength - 1))
			setHoverIndex(filteredData.startIndex + localIndex)
		},
		[filteredData.startIndex]
	)

	const handleChartLeave = useCallback(() => setHoverIndex(null), [])

	const currentData =
		hoverIndex !== null && telemetryData[hoverIndex]
			? {
					speed: telemetryData[hoverIndex].Speed.toFixed(1),
					rpm: telemetryData[hoverIndex].RPM.toFixed(0),
					throttle: (telemetryData[hoverIndex].Throttle * 100).toFixed(0),
					brake: (telemetryData[hoverIndex].Brake * 100).toFixed(0),
					gear: telemetryData[hoverIndex].Gear,
					steering: telemetryData[hoverIndex].SteeringWheelAngle * (180 / Math.PI),
					lapPct: (telemetryData[hoverIndex].LapDistPct * 100).toFixed(2),
				}
			: null

	return (
		<div className="flex min-h-screen bg-neutral-950 text-white overflow-hidden carbon-bg">
			<style dangerouslySetInnerHTML={{ __html: cssStyles }} />
			<Sidebar activeTab="telemetry" />

			<div className="flex-1 flex flex-col overflow-hidden">
				<header className="p-6 border-b border-white/5 flex justify-between items-center bg-black/40 backdrop-blur-md z-10">
					<div>
						<button
							onClick={() => navigate('/telemetry')}
							className="text-xs text-neutral-500 hover:text-white transition-colors mb-1 font-bold tracking-widest"
						>
							← BACK TO SESSIONS
						</button>
						<h1
							className="text-3xl font-black uppercase tracking-wide"
							style={{ fontFamily: 'Bebas Neue' }}
						>
							Lap Analysis <span style={{ color: COLORS.primary }}>#{lapNum}</span>
						</h1>
					</div>
					{selectedCornerName && (
						<button
							onClick={() => setSelectedCornerName(null)}
							className="px-6 py-2 border border-orange-500/50 hover:bg-orange-500/10 text-orange-500 rounded-lg text-xs font-bold uppercase transition-all"
						>
							Show Full Lap
						</button>
					)}
				</header>

				<div className="flex-1 flex overflow-hidden relative">
					{isLoading && (
						<div className="absolute inset-0 flex items-center justify-center bg-black/80 z-50">
							<div
								className="animate-pulse text-xl font-bold uppercase tracking-widest"
								style={{ color: COLORS.primary, fontFamily: 'Bebas Neue' }}
							>
								Fetching Telemetry Stream...
							</div>
						</div>
					)}

					{errorMsg && (
						<div className="absolute inset-0 flex items-center justify-center z-50">
							<div className="text-red-400 text-center">
								<p className="text-2xl font-black uppercase" style={{ fontFamily: 'Bebas Neue' }}>Error</p>
								<p className="text-sm mt-2">{errorMsg}</p>
							</div>
						</div>
					)}

					{/* LEWA STRONA - WYKRESY */}
					<div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
						{/* HUD / DATA VALUES */}
						<div className="carbon-card rounded-xl p-4 sticky top-0 z-10 backdrop-blur-md">
							<div className="flex flex-wrap gap-6 justify-start">
								<DataValue
									label="Distance"
									value={currentData ? `${currentData.lapPct}%` : '—'}
								/>
								<DataValue
									label="Speed"
									value={currentData ? `${currentData.speed} km/h` : '—'}
									color={COLORS.speed}
								/>
								<DataValue
									label="RPM"
									value={currentData ? currentData.rpm : '—'}
									color={COLORS.rpm}
								/>
								<DataValue
									label="Throttle"
									value={currentData ? `${currentData.throttle}%` : '—'}
									color={COLORS.throttle}
								/>
								<DataValue
									label="Brake"
									value={currentData ? `${currentData.brake}%` : '—'}
									color={COLORS.brake}
								/>
								{selectedCornerName && (
									<div className="ml-auto flex items-center gap-2 px-3 py-1 rounded-lg bg-orange-500/10 border border-orange-500/20">
										<span className="text-[10px] uppercase tracking-wider font-semibold" style={{ color: COLORS.textMuted }}>
											Viewing
										</span>
										<span className="text-sm font-bold" style={{ color: COLORS.primary }}>
											{selectedCornerName}
										</span>
									</div>
								)}
							</div>
						</div>

						{/* WYKRESY */}
						{chartData && (
							<>
								<div className="carbon-card rounded-2xl p-6">
									<div className="flex justify-between items-center mb-4">
										<h3
											className="text-lg font-black uppercase"
											style={{ fontFamily: 'Bebas Neue', color: COLORS.text }}
										>
											Speed
										</h3>
										<span className="text-sm font-mono" style={{ color: COLORS.speed }}>
											Max: {chartData.maxSpeed.toFixed(1)} km/h
										</span>
									</div>
									<TelemetryChart
										data={chartData.speeds}
										maxValue={chartData.maxSpeed * 1.1}
										color={COLORS.speed}
										hoverIndex={
											hoverIndex !== null
												? hoverIndex - filteredData.startIndex
												: null
										}
										onHover={(e) => handleChartHover(e, filteredData.data.length)}
										onLeave={handleChartLeave}
									/>
								</div>

								<div className="carbon-card rounded-2xl p-6">
									<h3
										className="text-lg font-black uppercase mb-4"
										style={{ fontFamily: 'Bebas Neue', color: COLORS.text }}
									>
										Throttle & Brake
									</h3>
									<TelemetryChart
										data={chartData.throttles}
										data2={chartData.brakes}
										maxValue={100}
										color={COLORS.throttle}
										color2={COLORS.brake}
										hoverIndex={
											hoverIndex !== null
												? hoverIndex - filteredData.startIndex
												: null
										}
										onHover={(e) => handleChartHover(e, filteredData.data.length)}
										onLeave={handleChartLeave}
										labels={['Throttle', 'Brake']}
									/>
								</div>

								<div className="carbon-card rounded-2xl p-6">
									<div className="flex justify-between items-center mb-4">
										<h3
											className="text-lg font-black uppercase"
											style={{ fontFamily: 'Bebas Neue', color: COLORS.text }}
										>
											RPM
										</h3>
										<span className="text-sm font-mono" style={{ color: COLORS.rpm }}>
											Max: {chartData.maxRPM.toFixed(0)}
										</span>
									</div>
									<TelemetryChart
										data={chartData.rpms}
										maxValue={chartData.maxRPM * 1.1}
										color={COLORS.rpm}
										hoverIndex={
											hoverIndex !== null
												? hoverIndex - filteredData.startIndex
												: null
										}
										onHover={(e) => handleChartHover(e, filteredData.data.length)}
										onLeave={handleChartLeave}
									/>
								</div>
							</>
						)}

						{!chartData && !isLoading && !errorMsg && (
							<div className="carbon-card rounded-2xl p-16 text-center">
								<p className="text-2xl font-black uppercase" style={{ fontFamily: 'Bebas Neue', color: COLORS.textMuted }}>
									No telemetry data available
								</p>
							</div>
						)}
					</div>

					{/* PRAWA STRONA - NAWIGACJA PO TORZE */}
					<div className="w-80 bg-black/60 border-l border-white/5 p-6 flex flex-col gap-6 relative z-10 shadow-[-10px_0_30px_rgba(0,0,0,0.5)]">
						{/* GEAR I STEERING */}
						<div className="flex gap-4">
							<div className="carbon-card rounded-2xl p-4 text-center flex-1">
								<p
									className="text-[10px] uppercase tracking-wider font-semibold mb-1"
									style={{ color: COLORS.textMuted }}
								>
									Gear
								</p>
								<p
									className="text-4xl font-black"
									style={{
										color: currentData ? COLORS.primary : COLORS.textMuted,
										fontFamily: 'Bebas Neue',
									}}
								>
									{currentData
										? currentData.gear === 0
											? 'N'
											: currentData.gear
										: '-'}
								</p>
							</div>
							<div className="carbon-card rounded-2xl p-2 flex-1 flex flex-col items-center justify-center overflow-hidden">
								<p
									className="text-[10px] uppercase tracking-wider font-semibold mb-1"
									style={{ color: COLORS.textMuted }}
								>
									Steering
								</p>
								<div className="scale-75 origin-top mt-1">
									<SteeringWheel angle={currentData?.steering ?? 0} />
								</div>
							</div>
						</div>

						{/* MAPA TORU Z GPS */}
						<div className="aspect-square bg-neutral-900/80 rounded-2xl border border-white/5 p-4 relative shadow-inner">
							<p className="absolute top-4 w-full left-0 text-center text-[10px] font-bold text-neutral-500 uppercase tracking-widest z-10">
								Spa-Francorchamps
							</p>
							{trackMapData && (
								<svg viewBox="0 0 100 100" className="w-full h-full relative z-0">
									{/* Główna linia toru */}
									<path
										d={trackMapData.points
											.map((p, j) => `${j === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
											.join(' ')}
										fill="none"
										stroke="rgba(255,255,255,0.15)"
										strokeWidth="2.5"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>

									{/* Pokolorowane zakręty */}
									{corners.map((corner, i) => {
										const cornerPoints = trackMapData.points.filter(
											(p) =>
												p.lapPct >= corner.entry_pct &&
												p.lapPct <= corner.exit_pct
										)
										if (cornerPoints.length < 2) return null

										const pathParts: string[] = []
										let currentPath: string[] = []
										for (let j = 0; j < cornerPoints.length; j++) {
											const curr = cornerPoints[j]
											if (j === 0) currentPath.push(`M ${curr.x} ${curr.y}`)
											else {
												const prev = cornerPoints[j - 1]
												const distance = Math.sqrt(
													Math.pow(curr.x - prev.x, 2) + Math.pow(curr.y - prev.y, 2)
												)
												if (distance > 8) {
													if (currentPath.length > 1) pathParts.push(currentPath.join(' '))
													currentPath = [`M ${curr.x} ${curr.y}`]
												} else currentPath.push(`L ${curr.x} ${curr.y}`)
											}
										}
										if (currentPath.length > 1) pathParts.push(currentPath.join(' '))
										const pathD = pathParts.join(' ')
										if (!pathD) return null

										const isSelected = selectedCornerName === corner.name
										const color = SEGMENT_COLORS[i % SEGMENT_COLORS.length]

										return (
											<path
												key={`corner-path-${i}`}
												d={pathD}
												fill="none"
												stroke={color}
												strokeWidth={isSelected ? 5 : 3}
												strokeLinecap="round"
												style={{
													opacity:
														selectedCornerName === null
															? 0.8
															: isSelected
																? 1
																: 0.2,
													filter: isSelected ? `drop-shadow(0 0 4px ${color})` : 'none',
													cursor: 'pointer',
												}}
												onClick={() => setSelectedCornerName(corner.name)}
											/>
										)
									})}

									{/* Kursor bieżącej pozycji */}
									{hoverIndex !== null && trackMapData.points[hoverIndex] && (
										<>
											<circle
												cx={trackMapData.points[hoverIndex].x}
												cy={trackMapData.points[hoverIndex].y}
												r="5"
												fill={COLORS.primary}
												opacity="0.4"
											/>
											<circle
												cx={trackMapData.points[hoverIndex].x}
												cy={trackMapData.points[hoverIndex].y}
												r="2.5"
												fill={COLORS.primary}
											/>
										</>
									)}
								</svg>
							)}
						</div>

						{/* LISTA ZAKRĘTÓW */}
						<div className="space-y-2 flex-1 overflow-y-auto custom-scrollbar pr-2">
							<p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest ml-1 sticky top-0 bg-black/60 py-2 backdrop-blur-md">
								Sector Navigation
							</p>
							{corners.map((c, i) => {
								const isSelected = selectedCornerName === c.name
								const color = SEGMENT_COLORS[i % SEGMENT_COLORS.length]

								return (
									<button
										key={c.name}
										onClick={() => setSelectedCornerName(c.name)}
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
									</button>
								)
							})}
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

// === KOMPONENTY POMOCNICZE ===
const DataValue: React.FC<{ label: string; value: string; color?: string }> = ({
	label,
	value,
	color,
}) => (
	<div>
		<p className="text-[10px] uppercase tracking-wider font-semibold mb-1 text-neutral-500 font-sans">
			{label}
		</p>
		<p className="text-base font-bold font-mono" style={{ color: color || COLORS.text }}>
			{value}
		</p>
	</div>
)

const SteeringWheel: React.FC<{ angle: number }> = ({ angle }) => (
	<div className="relative w-24 h-24 mx-auto">
		<svg
			viewBox="0 0 100 100"
			className="w-full h-full"
			style={{
				transform: `rotate(${angle}deg)`,
				transition: 'transform 0.05s ease-out',
			}}
		>
			<circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="6" />
			<path d="M 50 5 A 45 45 0 0 1 95 50" fill="none" stroke={COLORS.primary} strokeWidth="6" strokeLinecap="round" />
			<path d="M 50 95 A 45 45 0 0 1 5 50" fill="none" stroke={COLORS.primary} strokeWidth="6" strokeLinecap="round" />
			<circle cx="50" cy="50" r="12" fill="rgba(26,26,26,0.9)" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
			<line x1="50" y1="38" x2="50" y2="15" stroke="rgba(255,255,255,0.3)" strokeWidth="3" strokeLinecap="round" />
			<line x1="38" y1="56" x2="18" y2="70" stroke="rgba(255,255,255,0.3)" strokeWidth="3" strokeLinecap="round" />
			<line x1="62" y1="56" x2="82" y2="70" stroke="rgba(255,255,255,0.3)" strokeWidth="3" strokeLinecap="round" />
			<circle cx="50" cy="10" r="3" fill={COLORS.primary} />
		</svg>
	</div>
)

interface TelemetryChartProps {
	data: number[]
	data2?: number[]
	maxValue: number
	color: string
	color2?: string
	hoverIndex: number | null
	onHover: (e: React.MouseEvent<SVGSVGElement>) => void
	onLeave: () => void
	labels?: string[]
}

const TelemetryChart: React.FC<TelemetryChartProps> = ({
	data,
	data2,
	maxValue,
	color,
	color2,
	hoverIndex,
	onHover,
	onLeave,
	labels,
}) => {
	const height = 120,
		width = 1000
	const valueToY = (v: number) => height - (v / maxValue) * height
	const createPath = (values: number[]) =>
		values
			.map((v, i) => `${i === 0 ? 'M' : 'L'} ${(i / (values.length - 1)) * width} ${valueToY(v)}`)
			.join(' ')
	const createArea = (values: number[]) =>
		`${createPath(values)} L ${width} ${height} L 0 ${height} Z`

	const rawId = useId().replace(/:/g, '')
	const id1 = `g1-${rawId}`
	const id2 = `g2-${rawId}`

	return (
		<div className="relative">
			{labels && (
				<div className="flex gap-4 mb-2">
					<div className="flex items-center gap-2">
						<div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
						<span className="text-xs text-neutral-500">{labels[0]}</span>
					</div>
					{labels[1] && color2 && (
						<div className="flex items-center gap-2">
							<div className="w-3 h-3 rounded-full" style={{ backgroundColor: color2 }} />
							<span className="text-xs text-neutral-500">{labels[1]}</span>
						</div>
					)}
				</div>
			)}
			<svg
				viewBox={`0 0 ${width} ${height}`}
				className="w-full h-32 cursor-crosshair"
				preserveAspectRatio="none"
				onMouseMove={onHover}
				onMouseLeave={onLeave}
			>
				<defs>
					<linearGradient id={id1} x1="0%" y1="0%" x2="0%" y2="100%">
						<stop offset="0%" stopColor={color} stopOpacity="0.3" />
						<stop offset="100%" stopColor={color} stopOpacity="0" />
					</linearGradient>
					{color2 && (
						<linearGradient id={id2} x1="0%" y1="0%" x2="0%" y2="100%">
							<stop offset="0%" stopColor={color2} stopOpacity="0.3" />
							<stop offset="100%" stopColor={color2} stopOpacity="0" />
						</linearGradient>
					)}
				</defs>
				<path d={createArea(data)} fill={`url(#${id1})`} />
				{data2 && color2 && <path d={createArea(data2)} fill={`url(#${id2})`} />}
				<path d={createPath(data)} fill="none" stroke={color} strokeWidth="1.5" />
				{data2 && color2 && (
					<path d={createPath(data2)} fill="none" stroke={color2} strokeWidth="1.5" />
				)}
				{hoverIndex !== null && hoverIndex >= 0 && hoverIndex < data.length && (
					<>
						<line
							x1={(hoverIndex / (data.length - 1)) * width}
							y1="0"
							x2={(hoverIndex / (data.length - 1)) * width}
							y2={height}
							stroke="rgba(255,255,255,0.5)"
							strokeWidth="1"
							strokeDasharray="4 2"
						/>
						<circle
							cx={(hoverIndex / (data.length - 1)) * width}
							cy={valueToY(data[hoverIndex])}
							r="4"
							fill={color}
							stroke="#fff"
							strokeWidth="1.5"
						/>
						{data2 && color2 && (
							<circle
								cx={(hoverIndex / (data.length - 1)) * width}
								cy={valueToY(data2[hoverIndex])}
								r="4"
								fill={color2}
								stroke="#fff"
								strokeWidth="1.5"
							/>
						)}
					</>
				)}
			</svg>
		</div>
	)
}

export default TelemetryAnalysisPage