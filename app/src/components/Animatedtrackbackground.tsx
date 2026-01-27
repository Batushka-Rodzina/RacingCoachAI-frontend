// src/components/AnimatedTrackBackground.tsx
import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// === KOLORY ===
const COLORS = {
	primary: '#ff6b00',
	primaryGlow: 'rgba(255, 107, 0, 0.8)',
	gold: '#d4af37',
	trackLine: 'rgba(255, 255, 255, 0.12)',
	trackGlow: 'rgba(255, 107, 0, 0.25)',
}

// === DANE TORÓW (Realistyczne SVG Paths) ===
interface TrackData {
	name: string
	path: string
	viewBox: string
	duration: number
}

const tracks: TrackData[] = [
	{
		name: 'Spa-Francorchamps',
		viewBox: '0 0 500 296',
		duration: 14,
		path: `M 443.2 72.8 L 403.7 25.1 L 373.3 29.9 L 359.7 19.5 L 219.7 69.9 L 135.2 121.6 L 77.1 187.5 L 54.9 238.1 L 63.2 239.5 L 149.9 179.5 L 154.9 190.4 L 184.0 186.4 L 258.7 159.7 L 307.5 180.8 L 341.3 228.8 L 365.6 250.4 L 394.1 262.7 L 411.5 262.1 L 431.2 236.5 L 431.5 224.8 L 390.9 198.7 L 393.6 170.1 L 388.5 161.9 L 315.7 135.5 L 308.0 123.5 L 306.9 101.6 L 316.3 90.4 L 401.3 62.7 L 430.4 89.1 L 441.9 85.3 Z`
	},
	{
		name: 'Monza',
		viewBox: '0 0 450 267',
		duration: 10,
		path: `M 2.1 15.3 L 0.5 30.2 L 18.2 88.6 L 27.3 95.8 L 36.4 191.9 L 49.5 217.4 L 69.9 235.3 L 95.3 243.3 L 130.9 245.2 L 153.7 240.1 L 160.4 248.2 L 364.1 266.9 L 419.2 264.0 L 434.5 257.0 L 446.0 244.1 L 449.2 224.9 L 445.2 216.8 L 434.7 209.6 L 239.3 188.2 L 223.5 175.3 L 203.7 174.5 L 120.2 78.2 L 75.8 2.4 L 64.8 0.0 L 16.6 4.6 Z`
	}
]

const AnimatedTrackBackground: React.FC = () => {
	const [currentTrackIndex, setCurrentTrackIndex] = useState(0)

	// Rotacja między torami
	useEffect(() => {
		const currentTrack = tracks[currentTrackIndex]
		const timer = setTimeout(() => {
			setCurrentTrackIndex((prev) => (prev + 1) % tracks.length)
		}, currentTrack.duration * 1000 + 2000)

		return () => clearTimeout(timer)
	}, [currentTrackIndex])

	const currentTrack = tracks[currentTrackIndex]

	return (
		<div className="fixed inset-0 z-0 overflow-hidden bg-neutral-950">
			{/* Gradient overlay */}
			<div 
				className="absolute inset-0 z-10 pointer-events-none"
				style={{
					background: `
						radial-gradient(ellipse at 30% 20%, rgba(255, 107, 0, 0.06) 0%, transparent 50%),
						radial-gradient(ellipse at 70% 80%, rgba(212, 175, 55, 0.04) 0%, transparent 50%),
						linear-gradient(180deg, rgba(0,0,0,0.4) 0%, transparent 30%, transparent 70%, rgba(0,0,0,0.6) 100%)
					`
				}}
			/>

			{/* Carbon texture base */}
			<div 
				className="absolute inset-0 opacity-20"
				style={{
					backgroundImage: `
						linear-gradient(45deg, #0a0a0a 25%, transparent 25%),
						linear-gradient(-45deg, #0a0a0a 25%, transparent 25%),
						linear-gradient(45deg, transparent 75%, #0a0a0a 75%),
						linear-gradient(-45deg, transparent 75%, #0a0a0a 75%)
					`,
					backgroundSize: '4px 4px',
					backgroundPosition: '0 0, 0 2px, 2px -2px, -2px 0px'
				}}
			/>

			{/* Track SVG Container */}
			<AnimatePresence mode="wait">
				<motion.div
					key={currentTrack.name}
					className="absolute inset-0 flex items-center justify-center"
					initial={{ opacity: 0, scale: 0.95, rotate: -2 }}
					animate={{ opacity: 1, scale: 1, rotate: 0 }}
					exit={{ opacity: 0, scale: 1.05, rotate: 2 }}
					transition={{ duration: 1.2, ease: 'easeInOut' }}
				>
					<svg
						viewBox={currentTrack.viewBox}
						className="w-full h-full max-w-5xl max-h-[80vh] p-8 md:p-16"
						style={{ filter: 'drop-shadow(0 0 40px rgba(255, 107, 0, 0.15))' }}
					>
						<defs>
							{/* Glow filter dla toru */}
							<filter id="trackGlow" x="-50%" y="-50%" width="200%" height="200%">
								<feGaussianBlur stdDeviation="3" result="blur" />
								<feMerge>
									<feMergeNode in="blur" />
									<feMergeNode in="SourceGraphic" />
								</feMerge>
							</filter>

							{/* Mocniejszy glow dla punktu */}
							<filter id="pointGlow" x="-200%" y="-200%" width="500%" height="500%">
								<feGaussianBlur stdDeviation="6" result="blur1" />
								<feGaussianBlur stdDeviation="12" result="blur2" />
								<feMerge>
									<feMergeNode in="blur2" />
									<feMergeNode in="blur1" />
									<feMergeNode in="SourceGraphic" />
								</feMerge>
							</filter>

							{/* Trail gradient */}
							<linearGradient id="trailGradient">
								<stop offset="0%" stopColor={COLORS.primary} stopOpacity="0" />
								<stop offset="70%" stopColor={COLORS.primary} stopOpacity="0.6" />
								<stop offset="100%" stopColor={COLORS.gold} stopOpacity="1" />
							</linearGradient>
						</defs>

						{/* Zewnętrzna poświata toru */}
						<motion.path
							d={currentTrack.path}
							fill="none"
							stroke={COLORS.trackGlow}
							strokeWidth="16"
							strokeLinecap="round"
							strokeLinejoin="round"
							filter="url(#trackGlow)"
							initial={{ pathLength: 0, opacity: 0 }}
							animate={{ pathLength: 1, opacity: 0.5 }}
							transition={{ duration: 2.5, ease: 'easeOut' }}
						/>

						{/* Główna linia toru */}
						<motion.path
							d={currentTrack.path}
							fill="none"
							stroke={COLORS.trackLine}
							strokeWidth="5"
							strokeLinecap="round"
							strokeLinejoin="round"
							initial={{ pathLength: 0 }}
							animate={{ pathLength: 1 }}
							transition={{ duration: 2, ease: 'easeOut' }}
						/>

						{/* Wewnętrzna jaśniejsza linia */}
						<motion.path
							d={currentTrack.path}
							fill="none"
							stroke="rgba(255, 255, 255, 0.08)"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
							initial={{ pathLength: 0 }}
							animate={{ pathLength: 1 }}
							transition={{ duration: 2, ease: 'easeOut', delay: 0.3 }}
						/>

						{/* Animowany punkt świetlny - główny */}
						<motion.circle
							r="8"
							fill={COLORS.primary}
							filter="url(#pointGlow)"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 2 }}
						>
							<animateMotion
								dur={`${currentTrack.duration}s`}
								repeatCount="indefinite"
								path={currentTrack.path}
							/>
						</motion.circle>

						{/* Trail effect - podążający za punktem */}
						<motion.circle
							r="5"
							fill={COLORS.gold}
							opacity="0.7"
							filter="url(#pointGlow)"
							initial={{ opacity: 0 }}
							animate={{ opacity: 0.7 }}
							transition={{ delay: 2.2 }}
						>
							<animateMotion
								dur={`${currentTrack.duration}s`}
								repeatCount="indefinite"
								path={currentTrack.path}
								begin="0.3s"
							/>
						</motion.circle>

						{/* Trzeci punkt - mniejszy, dalej za */}
						<motion.circle
							r="3"
							fill="rgba(255, 255, 255, 0.5)"
							initial={{ opacity: 0 }}
							animate={{ opacity: 0.5 }}
							transition={{ delay: 2.4 }}
						>
							<animateMotion
								dur={`${currentTrack.duration}s`}
								repeatCount="indefinite"
								path={currentTrack.path}
								begin="0.6s"
							/>
						</motion.circle>
					</svg>

					{/* Nazwa toru - lewy dolny róg */}
					<motion.div
						className="absolute bottom-8 left-8 md:bottom-12 md:left-12 z-20"
						initial={{ opacity: 0, x: -30 }}
						animate={{ opacity: 1, x: 0 }}
						exit={{ opacity: 0, x: 30 }}
						transition={{ duration: 0.8, delay: 0.5 }}
					>
						<p 
							className="text-[10px] md:text-xs uppercase tracking-[0.3em] mb-1 font-medium"
							style={{ color: COLORS.primary, fontFamily: 'DM Sans, sans-serif' }}
						>
							Circuit
						</p>
						<h3 
							className="text-xl md:text-3xl font-black uppercase tracking-wide"
							style={{ 
								fontFamily: 'Bebas Neue, sans-serif',
								color: 'rgba(255, 255, 255, 0.25)'
							}}
						>
							{currentTrack.name}
						</h3>
					</motion.div>

					{/* Track indicator dots - prawy dolny róg */}
					<div className="absolute bottom-8 right-8 md:bottom-12 md:right-12 flex gap-3 z-20">
						{tracks.map((track, index) => (
							<motion.button
								key={track.name}
								onClick={() => setCurrentTrackIndex(index)}
								className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full transition-all duration-300 cursor-pointer"
								style={{
									backgroundColor: index === currentTrackIndex 
										? COLORS.primary 
										: 'rgba(255, 255, 255, 0.15)',
									boxShadow: index === currentTrackIndex 
										? `0 0 15px ${COLORS.primary}, 0 0 30px ${COLORS.primary}` 
										: 'none'
								}}
								whileHover={{ scale: 1.4 }}
								whileTap={{ scale: 0.9 }}
								title={track.name}
							/>
						))}
					</div>
				</motion.div>
			</AnimatePresence>

			{/* Vignette effect */}
			<div 
				className="absolute inset-0 pointer-events-none z-20"
				style={{
					background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.5) 100%)'
				}}
			/>
		</div>
	)
}

export default AnimatedTrackBackground