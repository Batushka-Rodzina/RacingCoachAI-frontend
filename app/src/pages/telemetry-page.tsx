// src/pages/telemetry-page.tsx
import React, { useState } from 'react'
import Sidebar from '../components/Sidebar'
// NAPRAWA: import type dla zgodności z projektowymi regułami TS
import {
	lapData,
	bestLapData,
	type TelemetryPoint,
} from '../data/dummyTelemetry'
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
} from 'recharts'

interface ChartMouseEvent {
	activeTooltipIndex?: number | string | null
}

// --- Komponent pomocniczy pojedynczego wiersza wykresu ---
interface TelemetryChannelRowProps {
	title: string
	dataKey: keyof TelemetryPoint | 'delta'
	color: string
	data: (TelemetryPoint | { time: number; delta: number })[]
	refData?: TelemetryPoint[]
	domain?: [number, number] | ['auto', 'auto']
	height?: number
	showXAxis?: boolean
	lineType?: 'monotone' | 'stepAfter'
	onMouseMove?: (e: ChartMouseEvent) => void
}

const TelemetryChannelRow: React.FC<TelemetryChannelRowProps> = ({
	title,
	dataKey,
	color,
	data,
	refData,
	domain = ['auto', 'auto'],
	height = 100,
	showXAxis = false,
	lineType = 'monotone',
	onMouseMove,
}) => {
	return (
		<div className="w-full bg-neutral-900/50 border-b border-white/10 flex flex-col p-2">
			<div className="px-2 py-1 text-[10px] uppercase text-gray-500 font-bold tracking-wider">
				{title}
			</div>
			<div style={{ height: `${height}px` }} className="w-full relative">
				<ResponsiveContainer width="100%" height="100%">
					<LineChart
						data={data}
						syncId="lapDataSync"
						margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
						onMouseMove={onMouseMove}
					>
						<CartesianGrid
							strokeDasharray="3 3"
							stroke="#222"
							vertical={false}
						/>
						<XAxis
							dataKey="time"
							hide={!showXAxis}
							tick={{ fontSize: 10, fill: '#666' }}
						/>
						<YAxis domain={domain} hide />
						<Tooltip
							contentStyle={{
								backgroundColor: '#111',
								border: '1px solid #333',
								fontSize: '10px',
							}}
							formatter={(value: unknown) =>
								[value !== null ? String(value) : '0', title] as [
									string,
									string
								]
							}
							isAnimationActive={false}
						/>
						{/* Linia referencyjna (Duch) */}
						{refData && (
							<Line
								data={refData}
								type={lineType}
								dataKey={dataKey as string}
								stroke="#ffffff"
								strokeWidth={2} // Grubsza
								strokeDasharray="5 5"
								strokeOpacity={0.4} // Wyraźniejsza
								dot={false}
								isAnimationActive={false}
							/>
						)}
						{/* Linia główna */}
						<Line
							type={lineType}
							dataKey={dataKey as string}
							stroke={color}
							strokeWidth={2}
							dot={false}
							isAnimationActive={false}
						/>
					</LineChart>
				</ResponsiveContainer>
			</div>
		</div>
	)
}

// --- Główny komponent strony ---
const TelemetryPage: React.FC = () => {
	const [activeIndex, setActiveIndex] = useState<number>(0)

	const handleMouseMove = (e: ChartMouseEvent) => {
		const index = e?.activeTooltipIndex
		if (typeof index === 'number') {
			setActiveIndex(index)
		} else if (typeof index === 'string') {
			setActiveIndex(parseInt(index, 10))
		}
	}

	const currentPoint = lapData[activeIndex] || lapData[0]

	// Obliczanie Delty (Różnica czasu)
	const deltaData = lapData.map((p, i) => ({
		time: p.time,
		delta: Number((p.time - (bestLapData[i]?.time || 0)).toFixed(3)),
	}))

	// Obliczanie G-Force (na podstawie danych punktu)
	const latG = (currentPoint.steering / 60) * (currentPoint.speed / 200)
	const lonG =
		currentPoint.brake > 0
			? -(currentPoint.brake / 60)
			: (currentPoint.throttle / 100) * 1.5

	return (
		<div className="flex min-h-screen bg-black text-white font-sans overflow-hidden">
			<Sidebar />

			<main className="flex-1 flex flex-col h-screen overflow-hidden">
				<header className="flex justify-between items-center p-4 border-b border-white/10 bg-neutral-900">
					<h1 className="text-xl font-orbitron font-bold text-cyan-400 uppercase tracking-wider">
						Telemetry Analysis{' '}
						<span className="text-gray-500 text-sm ml-2">[Beta View]</span>
					</h1>
					<div className="flex flex-col items-end">
						<div className="text-xs text-gray-400">
							Lap: 1:24.302 | Spa-Francorchamps
						</div>
						{/* LICZNIK DELTY */}
						<div
							className={`text-sm font-mono font-bold ${
								deltaData[activeIndex].delta > 0
									? 'text-red-500'
									: 'text-green-500'
							}`}
						>
							Delta: {deltaData[activeIndex].delta > 0 ? '+' : ''}
							{deltaData[activeIndex].delta.toFixed(3)}s
						</div>
					</div>
				</header>

				<div className="flex-1 flex overflow-hidden relative">
					{/* KOLUMNA LEWA: Wykresy */}
					<div className="w-3/4 flex flex-col border-r border-white/10 overflow-y-auto custom-scrollbar bg-black">
						<TelemetryChannelRow
							title="Speed (km/h)"
							dataKey="speed"
							color="#22d3ee"
							data={lapData}
							refData={bestLapData}
							domain={[0, 350]}
							onMouseMove={handleMouseMove}
						/>
						<TelemetryChannelRow
							title="Throttle %"
							dataKey="throttle"
							color="#4ade80"
							data={lapData}
							refData={bestLapData}
							domain={[0, 105]}
							onMouseMove={handleMouseMove}
						/>
						<TelemetryChannelRow
							title="Brake %"
							dataKey="brake"
							color="#ef4444"
							data={lapData}
							refData={bestLapData}
							domain={[0, 105]}
							onMouseMove={handleMouseMove}
						/>
						<TelemetryChannelRow
							title="Delta Time (s)"
							dataKey="delta"
							color="#eab308"
							data={deltaData}
							domain={[-2, 2]}
							onMouseMove={handleMouseMove}
						/>
						<TelemetryChannelRow
							title="Engine RPM"
							dataKey="rpm"
							color="#f472b6"
							data={lapData}
							refData={bestLapData}
							domain={[0, 13000]}
							onMouseMove={handleMouseMove}
						/>
						<TelemetryChannelRow
							title="Gear"
							dataKey="gear"
							color="#fbbf24"
							data={lapData}
							refData={bestLapData}
							lineType="stepAfter"
							height={60}
							onMouseMove={handleMouseMove}
						/>
						<TelemetryChannelRow
							title="Steering"
							dataKey="steering"
							color="#a855f7"
							data={lapData}
							refData={bestLapData}
							showXAxis={true}
							domain={[-100, 100]}
							onMouseMove={handleMouseMove}
						/>
					</div>

					{/* KOLUMNA PRAWA: Panel wskaźników i Mapa */}
					<div className="w-1/4 bg-neutral-900/30 flex flex-col border-l border-white/10 p-4 space-y-6 overflow-y-auto">
						{/* GEAR & G-FORCE DASH */}
						<div className="grid grid-cols-2 gap-4">
							<div className="bg-black/40 border border-white/10 p-6 rounded-xl flex flex-col items-center">
								<span className="text-gray-500 text-[10px] uppercase mb-1">
									Gear
								</span>
								<span className="text-7xl font-black text-cyan-400 italic leading-none">
									{currentPoint.gear}
								</span>
							</div>

							<div className="bg-black/40 border border-white/10 p-4 rounded-xl flex flex-col items-center">
								<span className="text-gray-500 text-[10px] uppercase mb-2">
									G-Force
								</span>
								<div className="relative w-20 h-20 border border-gray-700 rounded-full flex items-center justify-center">
									<div className="absolute w-full h-[1px] bg-gray-800" />
									<div className="absolute h-full w-[1px] bg-gray-800" />
									<div
										className="absolute w-3 h-3 bg-red-600 rounded-full shadow-[0_0_15px_rgba(220,38,38,0.8)]"
										style={{
											transform: `translate(${latG * 20}px, ${-lonG * 20}px)`,
											transition: 'transform 0.05s linear',
										}}
									/>
								</div>
							</div>
						</div>

						{/* PEDALS BARS */}
						<div className="bg-black/40 border border-white/10 p-4 rounded-xl flex gap-6 h-32">
							<div className="flex-1 flex flex-col items-center">
								<div className="w-full flex-1 bg-gray-800 rounded relative overflow-hidden flex flex-col justify-end">
									<div
										className="bg-green-500 w-full transition-all duration-75"
										style={{ height: `${currentPoint.throttle}%` }}
									/>
								</div>
								<span className="text-[10px] mt-2 text-green-500 font-bold uppercase">
									Thr
								</span>
							</div>
							<div className="flex-1 flex flex-col items-center">
								<div className="w-full flex-1 bg-gray-800 rounded relative overflow-hidden flex flex-col justify-end">
									<div
										className="bg-red-500 w-full transition-all duration-75"
										style={{ height: `${currentPoint.brake}%` }}
									/>
								</div>
								<span className="text-[10px] mt-2 text-red-500 font-bold uppercase">
									Brk
								</span>
							</div>
						</div>

						{/* MAPA TORU */}
						<div className="relative bg-black/40 border border-white/10 rounded-xl p-4 aspect-square flex items-center justify-center">
							<img
								src="/maps/spa-track.png"
								alt="Spa"
								className="max-w-full h-auto object-contain opacity-40 filter brightness-125"
							/>
							<div
								className="absolute w-3 h-3 bg-white rounded-full z-20 shadow-[0_0_15px_#fff] transition-all duration-100"
								style={{
									top: `${currentPoint.mapY}%`,
									left: `${currentPoint.mapX}%`,
									transform: 'translate(-50%, -50%)',
								}}
							/>
						</div>

						{/* DANE SEKTORÓW */}
						<div className="p-4 bg-black/40 border border-white/10 rounded-xl text-[11px] font-mono space-y-2">
							<div className="flex justify-between text-gray-400">
								<span>Time:</span>{' '}
								<span className="text-cyan-400 font-bold">
									{currentPoint.time}s
								</span>
							</div>
							<div className="flex justify-between text-gray-400 border-t border-white/5 pt-2">
								<span>Sector 1:</span>{' '}
								<span className="text-white">31.204s</span>
							</div>
							<div className="flex justify-between text-gray-400">
								<span>Sector 2:</span>{' '}
								<span className="text-white">42.551s</span>
							</div>
							<div className="flex justify-between text-gray-400">
								<span>Sector 3:</span>{' '}
								<span className="text-white">28.547s</span>
							</div>
						</div>
					</div>
				</div>
			</main>
		</div>
	)
}

export default TelemetryPage
