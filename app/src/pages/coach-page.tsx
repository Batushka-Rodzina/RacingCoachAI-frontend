// src/pages/coach-page.tsx
import React, { useState, useEffect, useMemo } from 'react'
import Sidebar from '../components/Sidebar'

const COLORS = {
	primary: '#ff6b00',
	primaryHover: '#ff8533',
	text: '#e5e5e5',
	textMuted: '#737373',
}

const CoachPage: React.FC = () => {
	const [isAnalyzing, setIsAnalyzing] = useState(false)
	const [progress, setProgress] = useState(0)
	const [isTransitioning, setIsTransitioning] = useState(false)
	const [showContent, setShowContent] = useState<'idle' | 'analyzing'>('idle')
	const [sparks, setSparks] = useState<
		Array<{ id: number; angle: number; delay: number; tx: number; ty: number }>
	>([])

	const phases = [
		{ text: 'Loading telemetry data...', icon: '' },
		{ text: 'Analyzing braking points...', icon: '' },
		{ text: 'Calculating optimal racing line...', icon: '' },
		{ text: 'Comparing with alien laps...', icon: '' },
		{ text: 'Generating AI insights...', icon: '' },
		{ text: 'Preparing your coaching report...', icon: '' },
	]

	const currentPhase = useMemo(() => {
		if (!isAnalyzing) return 0
		return Math.min(
			Math.floor(progress / (100 / phases.length)),
			phases.length - 1
		)
	}, [progress, isAnalyzing, phases.length])

	// Kolor tarczy w zależności od postępu (zimny -> gorący)
	const discColor = useMemo(() => {
		if (progress < 20) return '#444'
		if (progress < 40) return '#663300'
		if (progress < 60) return '#994400'
		if (progress < 80) return '#cc5500'
		return '#ff6b00'
	}, [progress])

	const glowIntensity = useMemo(() => {
		return Math.min(progress / 100, 1)
	}, [progress])

	const handleAnalyze = () => {
		setIsTransitioning(true)

		// Fade out idle state
		setTimeout(() => {
			setShowContent('analyzing')
			setIsAnalyzing(true)
			setProgress(0)
			setSparks([])

			// Fade in analyzing state
			setTimeout(() => {
				setIsTransitioning(false)
			}, 100)
		}, 400)
	}

	// Animacja postępu
	useEffect(() => {
		if (!isAnalyzing) return

		const progressInterval = setInterval(() => {
			setProgress((prev) => {
				if (prev >= 100) {
					clearInterval(progressInterval)

					// Płynne zakończenie
					setTimeout(() => {
						setIsTransitioning(true)

						setTimeout(() => {
							setShowContent('idle')
							setIsAnalyzing(false)
							setProgress(0)
							setSparks([])

							setTimeout(() => {
								setIsTransitioning(false)
							}, 100)
						}, 400)
					}, 500)

					return 100
				}
				return prev + 0.4
			})
		}, 50)

		return () => clearInterval(progressInterval)
	}, [isAnalyzing])

	// Generowanie iskier
	useEffect(() => {
		if (!isAnalyzing || progress < 30) return

		const sparkInterval = setInterval(() => {
			const newSpark = {
				id: Date.now(),
				angle: Math.random() * 360,
				delay: Math.random() * 0.5,
				tx: (Math.random() - 0.5) * 100,
				ty: (Math.random() - 0.5) * 100,
			}
			setSparks((prev) => [...prev.slice(-12), newSpark])
		}, 150)

		return () => clearInterval(sparkInterval)
	}, [isAnalyzing, progress])

	return (
		<div className="flex min-h-screen bg-neutral-950 text-white overflow-hidden">
			<style>{`
				@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;600;700&family=Orbitron:wght@400;500;600;700;800;900&display=swap');
				
				.carbon-bg {
					background-color: #0a0a0a;
					background-image: 
						linear-gradient(45deg, #0f0f0f 25%, transparent 25%),
						linear-gradient(-45deg, #0f0f0f 25%, transparent 25%),
						linear-gradient(45deg, transparent 75%, #0f0f0f 75%),
						linear-gradient(-45deg, transparent 75%, #0f0f0f 75%);
					background-size: 4px 4px;
				}

				@keyframes rotate {
					from { transform: rotate(0deg); }
					to { transform: rotate(360deg); }
				}

				@keyframes spark {
					0% {
						opacity: 1;
						transform: translateX(0) translateY(0) scale(1);
					}
					100% {
						opacity: 0;
						transform: translateX(var(--tx)) translateY(var(--ty)) scale(0);
					}
				}

				@keyframes pulse {
					0%, 100% { opacity: 1; }
					50% { opacity: 0.7; }
				}

				@keyframes float {
					0%, 100% { transform: translateY(0px); }
					50% { transform: translateY(-10px); }
				}

				@keyframes borderRotate {
					0% { background-position: 0% 50%; }
					50% { background-position: 100% 50%; }
					100% { background-position: 0% 50%; }
				}

				@keyframes heatPulse {
					0%, 100% { opacity: 0.3; }
					50% { opacity: 0.6; }
				}

				.analyze-button {
					position: relative;
					background: linear-gradient(135deg, #ff6b00 0%, #ff8533 50%, #ff6b00 100%);
					background-size: 200% 200%;
					animation: borderRotate 3s ease infinite;
					transition: all 0.3s ease;
				}

				.analyze-button:hover {
					transform: scale(1.02);
					box-shadow: 0 0 40px rgba(255, 107, 0, 0.4),
								0 0 80px rgba(255, 107, 0, 0.2);
				}

				.analyze-button:active {
					transform: scale(0.98);
				}

				.disc-rotate {
					animation: rotate 2s linear infinite;
				}

				.ai-icon {
					animation: float 3s ease-in-out infinite;
				}

				.phase-text {
					animation: pulse 2s ease-in-out infinite;
				}

				.spark {
					position: absolute;
					width: 6px;
					height: 6px;
					border-radius: 50%;
					background: #ffaa00;
					box-shadow: 0 0 6px #ff6600, 0 0 12px #ff4400;
					animation: spark 0.8s ease-out forwards;
				}

				.heat-wave {
					animation: heatPulse 1s ease-in-out infinite;
				}
                .content-transition {
                transition: opacity 0.4s ease, transform 0.4s ease;
                }

                .content-hidden {
                opacity: 0;
                transform: scale(0.95);
                }

                .content-visible {
                opacity: 1;
                transform: scale(1);
                }
			`}</style>

			<Sidebar activeTab="coach" />

			<main className="flex-1 flex items-center justify-center carbon-bg relative overflow-hidden">
				{/* Background Effects */}
				<div
					className="absolute inset-0 pointer-events-none"
					style={{
						background: `
							radial-gradient(ellipse at 50% 50%, rgba(255, 107, 0, 0.03) 0%, transparent 50%),
							radial-gradient(ellipse at 20% 20%, rgba(255, 107, 0, 0.02) 0%, transparent 40%),
							radial-gradient(ellipse at 80% 80%, rgba(255, 107, 0, 0.02) 0%, transparent 40%)
						`,
					}}
				/>

				{/* Grid Lines */}
				<div
					className="absolute inset-0 pointer-events-none opacity-5"
					style={{
						backgroundImage: `
							linear-gradient(rgba(255, 107, 0, 0.5) 1px, transparent 1px),
							linear-gradient(90deg, rgba(255, 107, 0, 0.5) 1px, transparent 1px)
						`,
						backgroundSize: '50px 50px',
					}}
				/>

				<div className="relative z-10 text-center">
					{showContent === 'idle' ? (
						/* === IDLE STATE === */
						<div
							className={`flex flex-col items-center content-transition ${isTransitioning ? 'content-hidden' : 'content-visible'}`}
						>
							{/* AI Icon */}
							<div
								className="ai-icon w-24 h-24 rounded-3xl flex items-center justify-center mb-8"
								style={{
									backgroundColor: 'rgba(255, 107, 0, 0.1)',
									border: '2px solid rgba(255, 107, 0, 0.3)',
								}}
							>
								<svg
									className="w-12 h-12"
									fill="none"
									stroke={COLORS.primary}
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={1.5}
										d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5"
									/>
								</svg>
							</div>

							{/* Title */}
							<h1
								className="text-5xl md:text-6xl font-black uppercase tracking-wider mb-4"
								style={{
									fontFamily: 'Bebas Neue, sans-serif',
									color: COLORS.text,
								}}
							>
								Coach <span style={{ color: COLORS.primary }}>AI</span>
							</h1>

							<p
								className="text-base mb-12 max-w-md"
								style={{
									color: COLORS.textMuted,
									fontFamily: 'DM Sans, sans-serif',
								}}
							>
								Get AI-powered insights from your telemetry data. Discover where
								you're losing time and how to improve.
							</p>

							{/* Big Analyze Button */}
							<button
								onClick={handleAnalyze}
								className="analyze-button relative px-16 py-8 rounded-2xl font-black text-2xl uppercase tracking-widest transition-all duration-300"
								style={{
									color: '#000',
									fontFamily: 'Orbitron, sans-serif',
								}}
							>
								<div
									className="absolute inset-1 rounded-xl pointer-events-none"
									style={{
										background:
											'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 50%)',
									}}
								/>

								<div className="relative flex items-center gap-4">
									<svg
										className="w-8 h-8"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M13 10V3L4 14h7v7l9-11h-7z"
										/>
									</svg>
									<span>AI Analyze</span>
								</div>
							</button>

							<p
								className="mt-6 text-xs uppercase tracking-widest"
								style={{
									color: COLORS.textMuted,
									fontFamily: 'DM Sans, sans-serif',
								}}
							>
								Click to start analysis
							</p>
						</div>
					) : (
						/* === ANALYZING STATE - BRAKE DISC === */
						<div className={`flex flex-col items-center content-transition ${isTransitioning ? 'content-hidden' : 'content-visible'}`}>
							{/* Brake Disc Assembly */}
							<div className="relative w-72 h-72 mb-8">
								{/* Heat Glow Background */}
								<div
									className="absolute inset-0 rounded-full heat-wave"
									style={{
										background: `radial-gradient(circle, ${discColor}40 0%, transparent 70%)`,
										filter: `blur(20px)`,
										opacity: glowIntensity,
									}}
								/>

								{/* Outer Ring (Caliper Mount) */}
								<div
									className="absolute inset-0 rounded-full"
									style={{
										border: '4px solid #333',
										boxShadow: 'inset 0 0 20px rgba(0,0,0,0.8)',
									}}
								/>

								{/* Rotating Brake Disc */}
								<div
									className="absolute inset-4 rounded-full disc-rotate"
									style={{
										background: `conic-gradient(
											from 0deg,
											${discColor} 0deg,
											#333 30deg,
											${discColor} 60deg,
											#333 90deg,
											${discColor} 120deg,
											#333 150deg,
											${discColor} 180deg,
											#333 210deg,
											${discColor} 240deg,
											#333 270deg,
											${discColor} 300deg,
											#333 330deg,
											${discColor} 360deg
										)`,
										boxShadow: `
											inset 0 0 30px rgba(0,0,0,0.5),
											0 0 ${20 * glowIntensity}px ${discColor}
										`,
									}}
								>
									{/* Ventilation Holes Pattern */}
									<svg
										className="absolute inset-0 w-full h-full"
										viewBox="0 0 100 100"
									>
										{[...Array(12)].map((_, i) => {
											const angle = i * 30 * (Math.PI / 180)
											const x = 50 + 30 * Math.cos(angle)
											const y = 50 + 30 * Math.sin(angle)
											return (
												<circle
													key={i}
													cx={x}
													cy={y}
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
										boxShadow:
											'inset 0 2px 10px rgba(0,0,0,0.8), 0 0 15px rgba(0,0,0,0.5)',
									}}
								>
									{/* Center Bolts */}
									<svg
										className="absolute inset-0 w-full h-full"
										viewBox="0 0 100 100"
									>
										{[...Array(5)].map((_, i) => {
											const angle = (i * 72 - 90) * (Math.PI / 180)
											const x = 50 + 25 * Math.cos(angle)
											const y = 50 + 25 * Math.sin(angle)
											return (
												<circle
													key={i}
													cx={x}
													cy={y}
													r="5"
													fill="#222"
													stroke="#444"
													strokeWidth="1"
												/>
											)
										})}
									</svg>

									{/* Percentage */}
									<span
										className="text-3xl font-black relative z-10"
										style={{
											fontFamily: 'Orbitron, sans-serif',
											color: progress > 50 ? COLORS.primary : COLORS.text,
											textShadow:
												progress > 50 ? `0 0 10px ${COLORS.primary}` : 'none',
										}}
									>
										{Math.round(progress)}%
									</span>
								</div>

								{/* Sparks */}
								{sparks.map((spark) => (
									<div
										key={spark.id}
										className="spark"
										style={
											{
												top: '50%',
												left: '50%',
												'--tx': `${spark.tx}px`,
												'--ty': `${spark.ty}px`,
												animationDelay: `${spark.delay}s`,
												transform: `rotate(${spark.angle}deg) translateX(90px)`,
											} as React.CSSProperties
										}
									/>
								))}

								{/* Heat Lines */}
								{progress > 60 && (
									<svg
										className="absolute inset-0 w-full h-full pointer-events-none"
										viewBox="0 0 100 100"
									>
										{[...Array(6)].map((_, i) => {
											const angle = (i * 60 + progress) * (Math.PI / 180)
											const x1 = 50 + 35 * Math.cos(angle)
											const y1 = 50 + 35 * Math.sin(angle)
											const x2 = 50 + 45 * Math.cos(angle)
											const y2 = 50 + 45 * Math.sin(angle)
											return (
												<line
													key={i}
													x1={x1}
													y1={y1}
													x2={x2}
													y2={y2}
													stroke={COLORS.primary}
													strokeWidth="1"
													opacity={0.5}
													className="heat-wave"
													style={{ animationDelay: `${i * 0.15}s` }}
												/>
											)
										})}
									</svg>
								)}
							</div>

							{/* Phase Text */}
							<div className="phase-text flex items-center gap-3 mb-4">
								<span className="text-3xl">{phases[currentPhase].icon}</span>
								<span
									className="text-xl font-semibold"
									style={{
										color: COLORS.text,
										fontFamily: 'DM Sans, sans-serif',
									}}
								>
									{phases[currentPhase].text}
								</span>
							</div>

							{/* Temperature Bar */}
							<div className="w-80 mb-4">
								<div
									className="flex justify-between text-xs mb-1"
									style={{
										color: COLORS.textMuted,
										fontFamily: 'DM Sans, sans-serif',
									}}
								>
									<span>COLD</span>
									<span>OPTIMAL</span>
									<span>HOT</span>
								</div>
								<div
									className="h-3 rounded-full overflow-hidden"
									style={{
										background:
											'linear-gradient(90deg, #334, #663300, #994400, #cc5500, #ff6b00)',
										opacity: 0.3,
									}}
								>
									<div
										className="h-full rounded-full transition-all duration-100 ease-out relative"
										style={{
											width: `${progress}%`,
											background:
												'linear-gradient(90deg, #444 0%, #663300 25%, #994400 50%, #cc5500 75%, #ff6b00 100%)',
											boxShadow:
												progress > 50 ? `0 0 10px ${discColor}` : 'none',
										}}
									/>
								</div>
							</div>

							{/* Phase Indicators */}
							<div className="flex gap-2 mt-4">
								{phases.map((_, i) => (
									<div
										key={i}
										className="w-2 h-2 rounded-full transition-all duration-300"
										style={{
											backgroundColor:
												i <= currentPhase
													? COLORS.primary
													: 'rgba(255, 107, 0, 0.2)',
											boxShadow:
												i === currentPhase
													? `0 0 8px ${COLORS.primary}`
													: 'none',
											transform: i === currentPhase ? 'scale(1.3)' : 'scale(1)',
										}}
									/>
								))}
							</div>
						</div>
					)}
				</div>
			</main>
		</div>
	)
}

export default CoachPage
