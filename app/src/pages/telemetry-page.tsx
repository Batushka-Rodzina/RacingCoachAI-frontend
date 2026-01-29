// src/pages/telemetry-page.tsx
import React, { useState, useRef, useCallback, useMemo } from 'react'
import Sidebar from '../components/Sidebar'

// === KOLORY ===
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

// Kolory segmentów (10 różnych)
const SEGMENT_COLORS = [
	'#ff6b6b', '#ffa502', '#ffdd59', '#7bed9f', '#70a1ff',
	'#5352ed', '#a55eea', '#ff6b81', '#2ed573', '#1e90ff'
]

// === TYPY ===
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

// CSS
const cssStyles = `
	@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
	
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

	.custom-scrollbar::-webkit-scrollbar { width: 6px; }
	.custom-scrollbar::-webkit-scrollbar-track { background: rgba(255, 255, 255, 0.02); }
	.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 107, 0, 0.3); border-radius: 3px; }

	.segment-path {
		cursor: pointer;
		transition: opacity 0.2s, stroke-width 0.2s;
	}
	.segment-path:hover {
		opacity: 1 !important;
		stroke-width: 4px;
	}
`

const TelemetryPage: React.FC = () => {
	const [telemetryData, setTelemetryData] = useState<TelemetryData[]>([])
	const [isLoading, setIsLoading] = useState(false)
	const [fileName, setFileName] = useState<string | null>(null)
	const [hoverIndex, setHoverIndex] = useState<number | null>(null)
	const [selectedSegment, setSelectedSegment] = useState<number | null>(null)
	const fileInputRef = useRef<HTMLInputElement>(null)

	// Parsowanie CSV
	const parseCSV = useCallback((text: string): TelemetryData[] => {
		const lines = text.trim().split('\n')
		const headers = lines[0].split(',')
		
		return lines.slice(1).map(line => {
			const values = line.split(',')
			const obj: any = {}
			headers.forEach((header, i) => {
				const value = values[i]
				if (header === 'ABSActive' || header === 'DRSActive') {
					obj[header] = value === 'true'
				} else {
					obj[header] = parseFloat(value)
				}
			})
			return obj as TelemetryData
		})
	}, [])

	// Import pliku
	const handleFileImport = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (!file) return

		setIsLoading(true)
		setFileName(file.name)
		setSelectedSegment(null)

		const reader = new FileReader()
		reader.onload = (event) => {
			const text = event.target?.result as string
			const data = parseCSV(text)
			setTelemetryData(data)
			setIsLoading(false)
		}
		reader.readAsText(file)
	}, [parseCSV])

	// Dane dla mapy toru z segmentami
	const trackMapData = useMemo(() => {
		if (telemetryData.length === 0) return null

		const lats = telemetryData.map(d => d.Lat)
		const lons = telemetryData.map(d => d.Lon)
		
		const minLat = Math.min(...lats)
		const maxLat = Math.max(...lats)
		const minLon = Math.min(...lons)
		const maxLon = Math.max(...lons)

		const padding = 10
		const normalizedPoints = telemetryData.map((d, i) => ({
			x: padding + ((d.Lon - minLon) / (maxLon - minLon)) * (100 - 2 * padding),
			y: padding + ((maxLat - d.Lat) / (maxLat - minLat)) * (100 - 2 * padding),
			segment: Math.min(Math.floor(d.LapDistPct * 10), 9),
			index: i,
			lapPct: d.LapDistPct,
		}))

		// Grupuj punkty według segmentów
		const segments: { points: typeof normalizedPoints; startPct: number; endPct: number }[] = []
		for (let i = 0; i < 10; i++) {
			const segmentPoints = normalizedPoints.filter(p => p.segment === i)
			segments.push({
				points: segmentPoints,
				startPct: i * 10,
				endPct: (i + 1) * 10,
			})
		}

		return { points: normalizedPoints, segments }
	}, [telemetryData])

	// Filtrowane dane dla wybranego segmentu
	const filteredData = useMemo(() => {
		if (selectedSegment === null) {
			return { data: telemetryData, startIndex: 0 }
		}
		
		const segmentStart = selectedSegment / 10
		const segmentEnd = (selectedSegment + 1) / 10
		
		const filtered = telemetryData.filter(d => 
			d.LapDistPct >= segmentStart && d.LapDistPct < segmentEnd
		)
		
		const startIndex = telemetryData.findIndex(d => 
			d.LapDistPct >= segmentStart && d.LapDistPct < segmentEnd
		)
		
		return { data: filtered, startIndex: startIndex >= 0 ? startIndex : 0 }
	}, [telemetryData, selectedSegment])

	// Obliczenia dla wykresów
	const chartData = useMemo(() => {
		if (filteredData.data.length === 0) return null

		const speeds = filteredData.data.map(d => d.Speed * 3.6)
		const rpms = filteredData.data.map(d => d.RPM)
		const throttles = filteredData.data.map(d => d.Throttle * 100)
		const brakes = filteredData.data.map(d => d.Brake * 100)

		return {
			speeds,
			rpms,
			throttles,
			brakes,
			maxSpeed: Math.max(...speeds),
			minSpeed: Math.min(...speeds),
			maxRPM: Math.max(...rpms),
			avgSpeed: speeds.reduce((a, b) => a + b, 0) / speeds.length,
			avgThrottle: throttles.reduce((a, b) => a + b, 0) / throttles.length,
			avgBrake: brakes.reduce((a, b) => a + b, 0) / brakes.length,
		}
	}, [filteredData])

	// Obsługa hover
	const handleChartHover = useCallback((e: React.MouseEvent<SVGSVGElement>, dataLength: number) => {
		const rect = e.currentTarget.getBoundingClientRect()
		const x = e.clientX - rect.left
		const percentage = x / rect.width
		const localIndex = Math.min(Math.floor(percentage * dataLength), dataLength - 1)
		const globalIndex = filteredData.startIndex + localIndex
		setHoverIndex(globalIndex >= 0 ? globalIndex : null)
	}, [filteredData.startIndex])

	const handleChartLeave = useCallback(() => {
		setHoverIndex(null)
	}, [])

	// Aktualne dane przy hover
	const currentData = hoverIndex !== null && telemetryData[hoverIndex] ? {
		speed: (telemetryData[hoverIndex].Speed * 3.6).toFixed(1),
		rpm: telemetryData[hoverIndex].RPM.toFixed(0),
		throttle: (telemetryData[hoverIndex].Throttle * 100).toFixed(0),
		brake: (telemetryData[hoverIndex].Brake * 100).toFixed(0),
		gear: telemetryData[hoverIndex].Gear,
		steering: telemetryData[hoverIndex].SteeringWheelAngle * (180 / Math.PI),
		lapPct: (telemetryData[hoverIndex].LapDistPct * 100).toFixed(2),
	} : null

	// Kliknięcie w segment
	const handleSegmentClick = (segmentIndex: number) => {
		setSelectedSegment(segmentIndex)
		setHoverIndex(null)
	}

	// Powrót do widoku ogólnego
	const handleBackToFullLap = () => {
		setSelectedSegment(null)
		setHoverIndex(null)
	}

	return (
		<div className="flex min-h-screen bg-neutral-950 text-white overflow-hidden">
			<style dangerouslySetInnerHTML={{ __html: cssStyles }} />

			<Sidebar activeTab="telemetry" />

			<div className="flex-1 flex flex-col carbon-bg">
				{/* Header */}
				<header className="flex-shrink-0 p-6 border-b border-white/5">
					<div className="flex items-center justify-between">
						<div>
							<h1 
								className="text-3xl font-black uppercase tracking-wide"
								style={{ fontFamily: 'Bebas Neue, sans-serif', color: COLORS.text }}
							>
								Telemetry Analysis
							</h1>
							{fileName && (
								<p className="text-sm mt-1" style={{ color: COLORS.textMuted, fontFamily: 'DM Sans, sans-serif' }}>
									File: <span style={{ color: COLORS.primary }}>{fileName}</span>
									<span className="ml-3">• {telemetryData.length.toLocaleString()} data points</span>
									{selectedSegment !== null && (
										<span className="ml-3">
											• Segment <span style={{ color: SEGMENT_COLORS[selectedSegment] }}>{selectedSegment + 1}</span> ({selectedSegment * 10}% - {(selectedSegment + 1) * 10}%)
										</span>
									)}
								</p>
							)}
						</div>
						
						<div className="flex items-center gap-3">
							{selectedSegment !== null && (
								<button
									onClick={handleBackToFullLap}
									className="px-4 py-2 rounded-lg font-bold text-sm uppercase tracking-wider transition-all duration-200 border"
									style={{
										borderColor: 'rgba(255, 255, 255, 0.2)',
										color: COLORS.text,
										fontFamily: 'DM Sans, sans-serif',
									}}
									onMouseEnter={(e) => {
										e.currentTarget.style.borderColor = COLORS.primary
										e.currentTarget.style.color = COLORS.primary
									}}
									onMouseLeave={(e) => {
										e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)'
										e.currentTarget.style.color = COLORS.text
									}}
								>
									← Full Lap
								</button>
							)}
							<input
								type="file"
								ref={fileInputRef}
								accept=".csv"
								onChange={handleFileImport}
								className="hidden"
							/>
							<button
								onClick={() => fileInputRef.current?.click()}
								disabled={isLoading}
								className="px-6 py-3 rounded-xl font-bold text-sm uppercase tracking-wider transition-all duration-200"
								style={{
									backgroundColor: COLORS.primary,
									color: '#000',
									fontFamily: 'DM Sans, sans-serif',
								}}
								onMouseEnter={(e) => {
									e.currentTarget.style.backgroundColor = COLORS.primaryHover
									e.currentTarget.style.boxShadow = '0 0 20px rgba(255, 107, 0, 0.4)'
								}}
								onMouseLeave={(e) => {
									e.currentTarget.style.backgroundColor = COLORS.primary
									e.currentTarget.style.boxShadow = 'none'
								}}
							>
								{isLoading ? 'Loading...' : 'Import CSV'}
							</button>
						</div>
					</div>
				</header>

				{/* Content */}
				<div className="flex-1 flex overflow-hidden">
					{/* Empty State */}
					{telemetryData.length === 0 && !isLoading && (
						<div className="flex-1 flex items-center justify-center p-8">
							<div 
								className="carbon-card rounded-2xl p-16 text-center max-w-md"
								style={{ border: '1px solid rgba(255, 255, 255, 0.05)' }}
							>
								<div 
									className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6"
									style={{ backgroundColor: 'rgba(255, 107, 0, 0.1)' }}
								>
									<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke={COLORS.primary} className="w-10 h-10">
										<path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
									</svg>
								</div>
								<h2 
									className="text-2xl font-black uppercase tracking-wide mb-2"
									style={{ fontFamily: 'Bebas Neue, sans-serif', color: COLORS.text }}
								>
									No Telemetry Data
								</h2>
								<p 
									className="text-sm mb-6"
									style={{ color: COLORS.textMuted, fontFamily: 'DM Sans, sans-serif' }}
								>
									Import a CSV file to start analyzing your lap data
								</p>
								<button
									onClick={() => fileInputRef.current?.click()}
									className="px-8 py-4 rounded-xl font-bold text-sm uppercase tracking-wider"
									style={{
										backgroundColor: COLORS.primary,
										color: '#000',
										fontFamily: 'DM Sans, sans-serif',
									}}
								>
									Select CSV File
								</button>
							</div>
						</div>
					)}

					{/* Data loaded */}
					{chartData && trackMapData && (
						<>
							{/* LEFT - Charts */}
							<div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
								{/* Current Values */}
								{currentData && (
									<div 
										className="carbon-card rounded-xl p-4 sticky top-0 z-10"
										style={{ border: '1px solid rgba(255, 107, 0, 0.3)' }}
									>
										<div className="flex flex-wrap gap-6 justify-start">
											<DataValue label="Distance" value={`${currentData.lapPct}%`} />
											<DataValue label="Speed" value={`${currentData.speed} km/h`} color={COLORS.speed} />
											<DataValue label="RPM" value={currentData.rpm} color={COLORS.rpm} />
											<DataValue label="Throttle" value={`${currentData.throttle}%`} color={COLORS.throttle} />
											<DataValue label="Brake" value={`${currentData.brake}%`} color={COLORS.brake} />
										</div>
									</div>
								)}

								{/* Segment Stats (tylko gdy wybrany segment) */}
								{selectedSegment !== null && (
									<div 
										className="carbon-card rounded-2xl p-6"
										style={{ border: `2px solid ${SEGMENT_COLORS[selectedSegment]}40` }}
									>
										<h3 
											className="text-lg font-black uppercase tracking-wide mb-4"
											style={{ fontFamily: 'Bebas Neue, sans-serif', color: SEGMENT_COLORS[selectedSegment] }}
										>
											Segment {selectedSegment + 1} Analysis
										</h3>
										<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
											<StatBox label="Max Speed" value={`${chartData.maxSpeed.toFixed(1)} km/h`} />
											<StatBox label="Min Speed" value={`${chartData.minSpeed.toFixed(1)} km/h`} />
											<StatBox label="Avg Throttle" value={`${chartData.avgThrottle.toFixed(0)}%`} color={COLORS.throttle} />
											<StatBox label="Avg Brake" value={`${chartData.avgBrake.toFixed(0)}%`} color={COLORS.brake} />
										</div>
									</div>
								)}

								{/* Speed Chart */}
								<div 
									className="carbon-card rounded-2xl p-6"
									style={{ border: '1px solid rgba(255, 255, 255, 0.05)' }}
								>
									<div className="flex items-center justify-between mb-4">
										<h3 
											className="text-lg font-black uppercase tracking-wide"
											style={{ fontFamily: 'Bebas Neue, sans-serif', color: COLORS.text }}
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
										hoverIndex={hoverIndex !== null ? hoverIndex - filteredData.startIndex : null}
										onHover={(e) => handleChartHover(e, filteredData.data.length)}
										onLeave={handleChartLeave}
									/>
								</div>

								{/* Throttle & Brake */}
								<div 
									className="carbon-card rounded-2xl p-6"
									style={{ border: '1px solid rgba(255, 255, 255, 0.05)' }}
								>
									<h3 
										className="text-lg font-black uppercase tracking-wide mb-4"
										style={{ fontFamily: 'Bebas Neue, sans-serif', color: COLORS.text }}
									>
										Throttle & Brake
									</h3>
									<TelemetryChart
										data={chartData.throttles}
										data2={chartData.brakes}
										maxValue={100}
										color={COLORS.throttle}
										color2={COLORS.brake}
										hoverIndex={hoverIndex !== null ? hoverIndex - filteredData.startIndex : null}
										onHover={(e) => handleChartHover(e, filteredData.data.length)}
										onLeave={handleChartLeave}
										labels={['Throttle', 'Brake']}
									/>
								</div>

								{/* RPM */}
								<div 
									className="carbon-card rounded-2xl p-6"
									style={{ border: '1px solid rgba(255, 255, 255, 0.05)' }}
								>
									<div className="flex items-center justify-between mb-4">
										<h3 
											className="text-lg font-black uppercase tracking-wide"
											style={{ fontFamily: 'Bebas Neue, sans-serif', color: COLORS.text }}
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
										hoverIndex={hoverIndex !== null ? hoverIndex - filteredData.startIndex : null}
										onHover={(e) => handleChartHover(e, filteredData.data.length)}
										onLeave={handleChartLeave}
									/>
								</div>
							</div>

							{/* RIGHT - Sticky panel */}
							<div 
								className="w-80 lg:w-96 flex-shrink-0 border-l border-white/5 p-6 flex flex-col gap-4"
								style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}
							>
								{/* Gear */}
								<div 
									className="carbon-card rounded-2xl p-4 text-center"
									style={{ border: '1px solid rgba(255, 255, 255, 0.05)' }}
								>
									<p className="text-xs uppercase tracking-wider font-semibold mb-1" style={{ color: COLORS.textMuted }}>
										Gear
									</p>
									<p 
										className="text-6xl font-black"
										style={{ 
											color: currentData ? COLORS.primary : COLORS.textMuted,
											fontFamily: 'Bebas Neue, sans-serif'
										}}
									>
										{currentData ? (currentData.gear === 0 ? 'N' : currentData.gear) : '-'}
									</p>
								</div>

								{/* Steering */}
								<div 
									className="carbon-card rounded-2xl p-4"
									style={{ border: '1px solid rgba(255, 255, 255, 0.05)' }}
								>
									<p className="text-xs uppercase tracking-wider font-semibold mb-3 text-center" style={{ color: COLORS.textMuted }}>
										Steering
									</p>
									<SteeringWheel angle={currentData?.steering ?? 0} />
									<p 
										className="text-center mt-3 text-base font-bold"
										style={{ 
											color: currentData ? COLORS.text : COLORS.textMuted,
											fontFamily: 'JetBrains Mono, monospace'
										}}
									>
										{currentData ? `${currentData.steering.toFixed(1)}°` : '-'}
									</p>
								</div>

								{/* Track Map with Segments */}
								<div 
									className="carbon-card rounded-2xl p-4 flex-1"
									style={{ border: '1px solid rgba(255, 255, 255, 0.05)' }}
								>
									<p className="text-xs uppercase tracking-wider font-semibold mb-3 text-center" style={{ color: COLORS.textMuted }}>
										Track Segments
									</p>
									<div className="aspect-square relative">
										<svg viewBox="0 0 100 100" className="w-full h-full">
											{/* Render segments */}
											{trackMapData.segments.map((segment, i) => {
												if (segment.points.length < 2) return null
												const pathD = segment.points.map((p, j) => 
													j === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`
												).join(' ')
												
												const isSelected = selectedSegment === i
												const isHovered = hoverIndex !== null && 
													trackMapData.points[hoverIndex]?.segment === i
												
												return (
													<path
														key={i}
														d={pathD}
														fill="none"
														stroke={SEGMENT_COLORS[i]}
														strokeWidth={isSelected ? 4 : 2.5}
														strokeLinecap="round"
														strokeLinejoin="round"
														className="segment-path"
														style={{
															opacity: selectedSegment === null ? 0.7 : (isSelected ? 1 : 0.2),
														}}
														onClick={() => handleSegmentClick(i)}
													/>
												)
											})}
											
											{/* Current position */}
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
									</div>
									
									{/* Segment legend */}
									<div className="mt-3 grid grid-cols-5 gap-1">
										{SEGMENT_COLORS.map((color, i) => (
											<button
												key={i}
												onClick={() => handleSegmentClick(i)}
												className="text-center py-1 rounded transition-all"
												style={{
													backgroundColor: selectedSegment === i ? `${color}30` : 'transparent',
													border: `1px solid ${selectedSegment === i ? color : 'transparent'}`,
												}}
											>
												<span 
													className="text-[10px] font-bold"
													style={{ color: selectedSegment === i ? color : COLORS.textMuted }}
												>
													{i + 1}
												</span>
											</button>
										))}
									</div>
								</div>
							</div>
						</>
					)}
				</div>
			</div>
		</div>
	)
}

// === KOMPONENTY ===

const DataValue: React.FC<{ label: string; value: string; color?: string }> = ({ label, value, color }) => (
	<div>
		<p className="text-[10px] uppercase tracking-wider font-semibold mb-1" style={{ color: COLORS.textMuted, fontFamily: 'DM Sans' }}>
			{label}
		</p>
		<p className="text-base font-bold" style={{ color: color || COLORS.text, fontFamily: 'JetBrains Mono' }}>
			{value}
		</p>
	</div>
)

const StatBox: React.FC<{ label: string; value: string; color?: string }> = ({ label, value, color }) => (
	<div 
		className="p-3 rounded-xl text-center"
		style={{ backgroundColor: 'rgba(0,0,0,0.3)' }}
	>
		<p className="text-[10px] uppercase tracking-wider font-semibold mb-1" style={{ color: COLORS.textMuted }}>
			{label}
		</p>
		<p className="text-lg font-bold" style={{ color: color || COLORS.text, fontFamily: 'JetBrains Mono' }}>
			{value}
		</p>
	</div>
)

const SteeringWheel: React.FC<{ angle: number }> = ({ angle }) => (
	<div className="relative w-24 h-24 mx-auto">
		<svg 
			viewBox="0 0 100 100" 
			className="w-full h-full"
			style={{ transform: `rotate(${angle}deg)`, transition: 'transform 0.05s ease-out' }}
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
	data, data2, maxValue, color, color2, hoverIndex, onHover, onLeave, labels
}) => {
	const height = 120, width = 1000
	const valueToY = (v: number) => height - (v / maxValue) * height
	
	const createPath = (values: number[]) => 
		values.map((v, i) => `${i === 0 ? 'M' : 'L'} ${(i / (values.length - 1)) * width} ${valueToY(v)}`).join(' ')
	
	const createArea = (values: number[]) => 
		`${createPath(values)} L ${width} ${height} L 0 ${height} Z`

	const id1 = `g1-${Math.random().toString(36).substr(2, 5)}`
	const id2 = `g2-${Math.random().toString(36).substr(2, 5)}`

	return (
		<div className="relative">
			{labels && (
				<div className="flex gap-4 mb-2">
					<div className="flex items-center gap-2">
						<div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
						<span className="text-xs" style={{ color: COLORS.textMuted }}>{labels[0]}</span>
					</div>
					{labels[1] && color2 && (
						<div className="flex items-center gap-2">
							<div className="w-3 h-3 rounded-full" style={{ backgroundColor: color2 }} />
							<span className="text-xs" style={{ color: COLORS.textMuted }}>{labels[1]}</span>
						</div>
					)}
				</div>
			)}
			<svg viewBox={`0 0 ${width} ${height}`} className="w-full h-32 cursor-crosshair" preserveAspectRatio="none" onMouseMove={onHover} onMouseLeave={onLeave}>
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
				{data2 && color2 && <path d={createPath(data2)} fill="none" stroke={color2} strokeWidth="1.5" />}
				{hoverIndex !== null && hoverIndex >= 0 && hoverIndex < data.length && (
					<>
						<line x1={(hoverIndex / (data.length - 1)) * width} y1="0" x2={(hoverIndex / (data.length - 1)) * width} y2={height} stroke="rgba(255,255,255,0.5)" strokeWidth="1" strokeDasharray="4 2" />
						<circle cx={(hoverIndex / (data.length - 1)) * width} cy={valueToY(data[hoverIndex])} r="4" fill={color} stroke="#fff" strokeWidth="1.5" />
						{data2 && color2 && <circle cx={(hoverIndex / (data.length - 1)) * width} cy={valueToY(data2[hoverIndex])} r="4" fill={color2} stroke="#fff" strokeWidth="1.5" />}
					</>
				)}
			</svg>
		</div>
	)
}

export default TelemetryPage