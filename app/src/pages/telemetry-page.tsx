// src/pages/telemetry-page.tsx
import React, { useState, useRef, useCallback, useMemo } from 'react'
import Sidebar from '../components/Sidebar'

// === KOLORY PREMIUM IRACING ===
const COLORS = {
	primary: '#ff6b00',
	primaryHover: '#ff8533',
	gold: '#d4af37',
	carbon: '#1a1a1a',
	text: '#e5e5e5',
	textMuted: '#737373',
	success: '#22c55e',
	warning: '#f59e0b',
	danger: '#ef4444',
	throttle: '#22c55e',
	brake: '#ef4444',
	speed: '#3b82f6',
	rpm: '#a855f7',
	gear: '#f59e0b',
	steering: '#06b6d4',
}

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

const TelemetryPage: React.FC = () => {
	const [telemetryData, setTelemetryData] = useState<TelemetryData[]>([])
	const [isLoading, setIsLoading] = useState(false)
	const [fileName, setFileName] = useState<string | null>(null)
	const [hoverIndex, setHoverIndex] = useState<number | null>(null)
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

		const reader = new FileReader()
		reader.onload = (event) => {
			const text = event.target?.result as string
			const data = parseCSV(text)
			setTelemetryData(data)
			setIsLoading(false)
		}
		reader.readAsText(file)
	}, [parseCSV])

	// Obliczenia dla wykresów
	const chartData = useMemo(() => {
		if (telemetryData.length === 0) return null

		const speeds = telemetryData.map(d => d.Speed * 3.6) // m/s to km/h
		const rpms = telemetryData.map(d => d.RPM)
		const throttles = telemetryData.map(d => d.Throttle * 100)
		const brakes = telemetryData.map(d => d.Brake * 100)
		const gears = telemetryData.map(d => d.Gear)
		const steerings = telemetryData.map(d => d.SteeringWheelAngle * (180 / Math.PI)) // rad to deg
		const distances = telemetryData.map(d => d.LapDistPct * 100)

		return {
			speeds,
			rpms,
			throttles,
			brakes,
			gears,
			steerings,
			distances,
			maxSpeed: Math.max(...speeds),
			maxRPM: Math.max(...rpms),
			minSteering: Math.min(...steerings),
			maxSteering: Math.max(...steerings),
		}
	}, [telemetryData])

	// Dane dla mapy toru
	const trackMapData = useMemo(() => {
		if (telemetryData.length === 0) return null

		const lats = telemetryData.map(d => d.Lat)
		const lons = telemetryData.map(d => d.Lon)
		
		const minLat = Math.min(...lats)
		const maxLat = Math.max(...lats)
		const minLon = Math.min(...lons)
		const maxLon = Math.max(...lons)

		// Normalizacja do 0-100
		const padding = 5
		const normalizedPoints = telemetryData.map(d => ({
			x: padding + ((d.Lon - minLon) / (maxLon - minLon)) * (100 - 2 * padding),
			y: padding + ((maxLat - d.Lat) / (maxLat - minLat)) * (100 - 2 * padding), // odwrócone Y
		}))

		return { points: normalizedPoints, minLat, maxLat, minLon, maxLon }
	}, [telemetryData])

	// Obsługa hover na wykresach
	const handleChartHover = useCallback((e: React.MouseEvent<SVGSVGElement>, dataLength: number) => {
		const rect = e.currentTarget.getBoundingClientRect()
		const x = e.clientX - rect.left
		const percentage = x / rect.width
		const index = Math.min(Math.floor(percentage * dataLength), dataLength - 1)
		setHoverIndex(index >= 0 ? index : null)
	}, [])

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
		steering: (telemetryData[hoverIndex].SteeringWheelAngle * (180 / Math.PI)).toFixed(1),
		lapPct: (telemetryData[hoverIndex].LapDistPct * 100).toFixed(2),
	} : null

	return (
		<div className="flex min-h-screen bg-neutral-950 text-white overflow-x-hidden">
			{/* Styles */}
			<style>{`
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
			`}</style>

			<Sidebar activeTab="telemetry" />

			<main className="flex-1 p-8 overflow-y-auto custom-scrollbar carbon-bg relative">
				<div className="relative z-10 max-w-7xl mx-auto space-y-6">
					
					{/* Header */}
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
								</p>
							)}
						</div>
						
						{/* Import Button */}
						<div>
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

					{/* Empty State */}
					{telemetryData.length === 0 && !isLoading && (
						<div 
							className="carbon-card rounded-2xl p-16 text-center"
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
								className="px-8 py-4 rounded-xl font-bold text-sm uppercase tracking-wider transition-all duration-200"
								style={{
									backgroundColor: COLORS.primary,
									color: '#000',
									fontFamily: 'DM Sans, sans-serif',
								}}
							>
								Select CSV File
							</button>
						</div>
					)}

					{/* Charts */}
					{chartData && trackMapData && (
						<>
							{/* Current Values Display */}
							{currentData && (
								<div 
									className="carbon-card rounded-2xl p-4"
									style={{ border: '1px solid rgba(255, 107, 0, 0.3)' }}
								>
									<div className="flex flex-wrap gap-6 justify-center">
										<DataValue label="Distance" value={`${currentData.lapPct}%`} />
										<DataValue label="Speed" value={`${currentData.speed} km/h`} color={COLORS.speed} />
										<DataValue label="RPM" value={currentData.rpm} color={COLORS.rpm} />
										<DataValue label="Gear" value={currentData.gear.toString()} color={COLORS.gear} />
										<DataValue label="Throttle" value={`${currentData.throttle}%`} color={COLORS.throttle} />
										<DataValue label="Brake" value={`${currentData.brake}%`} color={COLORS.brake} />
										<DataValue label="Steering" value={`${currentData.steering}°`} color={COLORS.steering} />
									</div>
								</div>
							)}

							{/* Track Map + Speed */}
							<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
								{/* Track Map */}
								<div 
									className="carbon-card rounded-2xl p-6"
									style={{ border: '1px solid rgba(255, 255, 255, 0.05)' }}
								>
									<h3 
										className="text-lg font-black uppercase tracking-wide mb-4"
										style={{ fontFamily: 'Bebas Neue, sans-serif', color: COLORS.text }}
									>
										Track Map
									</h3>
									<div className="aspect-square relative">
										<svg viewBox="0 0 100 100" className="w-full h-full">
											{/* Track outline */}
											<polyline
												points={trackMapData.points.map(p => `${p.x},${p.y}`).join(' ')}
												fill="none"
												stroke="rgba(255, 255, 255, 0.15)"
												strokeWidth="1.5"
												strokeLinejoin="round"
											/>
											
											{/* Current position */}
											{hoverIndex !== null && trackMapData.points[hoverIndex] && (
												<circle
													cx={trackMapData.points[hoverIndex].x}
													cy={trackMapData.points[hoverIndex].y}
													r="3"
													fill={COLORS.primary}
													style={{ filter: 'drop-shadow(0 0 6px rgba(255, 107, 0, 0.8))' }}
												/>
											)}
										</svg>
									</div>
								</div>

								{/* Speed Chart */}
								<div 
									className="lg:col-span-2 carbon-card rounded-2xl p-6"
									style={{ border: '1px solid rgba(255, 255, 255, 0.05)' }}
								>
									<div className="flex items-center justify-between mb-4">
										<h3 
											className="text-lg font-black uppercase tracking-wide"
											style={{ fontFamily: 'Bebas Neue, sans-serif', color: COLORS.text }}
										>
											Speed
										</h3>
										<span 
											className="text-sm font-mono"
											style={{ color: COLORS.speed }}
										>
											Max: {chartData.maxSpeed.toFixed(1)} km/h
										</span>
									</div>
									<TelemetryChart
										data={chartData.speeds}
										maxValue={chartData.maxSpeed * 1.1}
										color={COLORS.speed}
										hoverIndex={hoverIndex}
										onHover={(e) => handleChartHover(e, telemetryData.length)}
										onLeave={handleChartLeave}
									/>
								</div>
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
									hoverIndex={hoverIndex}
									onHover={(e) => handleChartHover(e, telemetryData.length)}
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
									<span 
										className="text-sm font-mono"
										style={{ color: COLORS.rpm }}
									>
										Max: {chartData.maxRPM.toFixed(0)}
									</span>
								</div>
								<TelemetryChart
									data={chartData.rpms}
									maxValue={chartData.maxRPM * 1.1}
									color={COLORS.rpm}
									hoverIndex={hoverIndex}
									onHover={(e) => handleChartHover(e, telemetryData.length)}
									onLeave={handleChartLeave}
								/>
							</div>

							{/* Gear */}
							<div 
								className="carbon-card rounded-2xl p-6"
								style={{ border: '1px solid rgba(255, 255, 255, 0.05)' }}
							>
								<h3 
									className="text-lg font-black uppercase tracking-wide mb-4"
									style={{ fontFamily: 'Bebas Neue, sans-serif', color: COLORS.text }}
								>
									Gear
								</h3>
								<TelemetryChart
									data={chartData.gears}
									maxValue={7}
									color={COLORS.gear}
									hoverIndex={hoverIndex}
									onHover={(e) => handleChartHover(e, telemetryData.length)}
									onLeave={handleChartLeave}
									stepped
								/>
							</div>

							{/* Steering */}
							<div 
								className="carbon-card rounded-2xl p-6"
								style={{ border: '1px solid rgba(255, 255, 255, 0.05)' }}
							>
								<h3 
									className="text-lg font-black uppercase tracking-wide mb-4"
									style={{ fontFamily: 'Bebas Neue, sans-serif', color: COLORS.text }}
								>
									Steering Angle
								</h3>
								<TelemetryChart
									data={chartData.steerings}
									maxValue={Math.max(Math.abs(chartData.minSteering), Math.abs(chartData.maxSteering)) * 1.2}
									minValue={-Math.max(Math.abs(chartData.minSteering), Math.abs(chartData.maxSteering)) * 1.2}
									color={COLORS.steering}
									hoverIndex={hoverIndex}
									onHover={(e) => handleChartHover(e, telemetryData.length)}
									onLeave={handleChartLeave}
									centered
								/>
							</div>
						</>
					)}
				</div>
			</main>
		</div>
	)
}

// === KOMPONENTY POMOCNICZE ===

// Data Value Display
const DataValue: React.FC<{ label: string; value: string; color?: string }> = ({ label, value, color }) => (
	<div className="text-center">
		<p 
			className="text-[10px] uppercase tracking-wider font-semibold mb-1"
			style={{ color: COLORS.textMuted, fontFamily: 'DM Sans, sans-serif' }}
		>
			{label}
		</p>
		<p 
			className="text-lg font-bold"
			style={{ color: color || COLORS.text, fontFamily: 'JetBrains Mono, monospace' }}
		>
			{value}
		</p>
	</div>
)

// Telemetry Chart Component
interface TelemetryChartProps {
	data: number[]
	data2?: number[]
	maxValue: number
	minValue?: number
	color: string
	color2?: string
	hoverIndex: number | null
	onHover: (e: React.MouseEvent<SVGSVGElement>) => void
	onLeave: () => void
	labels?: string[]
	stepped?: boolean
	centered?: boolean
}

const TelemetryChart: React.FC<TelemetryChartProps> = ({
	data,
	data2,
	maxValue,
	minValue = 0,
	color,
	color2,
	hoverIndex,
	onHover,
	onLeave,
	labels,
	stepped = false,
	centered = false,
}) => {
	const height = 120
	const width = 1000

	const valueToY = (value: number) => {
		if (centered) {
			const range = maxValue - minValue
			return height / 2 - ((value - (minValue + maxValue) / 2) / range) * height
		}
		return height - ((value - minValue) / (maxValue - minValue)) * height
	}

	const createPath = (values: number[]) => {
		const step = width / (values.length - 1)
		
		if (stepped) {
			let path = `M 0 ${valueToY(values[0])}`
			for (let i = 1; i < values.length; i++) {
				const x = i * step
				const prevY = valueToY(values[i - 1])
				const y = valueToY(values[i])
				path += ` H ${x} V ${y}`
			}
			return path
		}

		return values.map((v, i) => {
			const x = i * step
			const y = valueToY(v)
			return i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`
		}).join(' ')
	}

	const createAreaPath = (values: number[]) => {
		const basePath = createPath(values)
		const baseY = centered ? height / 2 : height
		return `${basePath} L ${width} ${baseY} L 0 ${baseY} Z`
	}

	return (
		<div className="relative">
			{/* Legend */}
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

			<svg
				viewBox={`0 0 ${width} ${height}`}
				className="w-full h-32 cursor-crosshair"
				preserveAspectRatio="none"
				onMouseMove={onHover}
				onMouseLeave={onLeave}
			>
				<defs>
					<linearGradient id={`gradient-${color.replace('#', '')}`} x1="0%" y1="0%" x2="0%" y2="100%">
						<stop offset="0%" stopColor={color} stopOpacity="0.3" />
						<stop offset="100%" stopColor={color} stopOpacity="0" />
					</linearGradient>
					{color2 && (
						<linearGradient id={`gradient-${color2.replace('#', '')}`} x1="0%" y1="0%" x2="0%" y2="100%">
							<stop offset="0%" stopColor={color2} stopOpacity="0.3" />
							<stop offset="100%" stopColor={color2} stopOpacity="0" />
						</linearGradient>
					)}
				</defs>

				{/* Center line for steering */}
				{centered && (
					<line x1="0" y1={height / 2} x2={width} y2={height / 2} stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
				)}

				{/* Area fill */}
				{!stepped && (
					<path d={createAreaPath(data)} fill={`url(#gradient-${color.replace('#', '')})`} />
				)}
				{data2 && color2 && !stepped && (
					<path d={createAreaPath(data2)} fill={`url(#gradient-${color2.replace('#', '')})`} />
				)}

				{/* Lines */}
				<path d={createPath(data)} fill="none" stroke={color} strokeWidth="1.5" />
				{data2 && color2 && (
					<path d={createPath(data2)} fill="none" stroke={color2} strokeWidth="1.5" />
				)}

				{/* Hover line */}
				{hoverIndex !== null && (
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

export default TelemetryPage