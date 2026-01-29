// src/components/TrackBackground.tsx
// Zoptymalizowane tło z torem - subtelna animacja pulsowania
import React, { useState, useEffect, memo } from 'react'

// === DANE TORÓW (bez Nürburgring) ===
const tracks = [
	{
		name: 'Spa-Francorchamps',
		viewBox: '0 0 500 296',
		path: 'M 443.2 72.8 L 403.7 25.1 L 373.3 29.9 L 359.7 19.5 L 219.7 69.9 L 135.2 121.6 L 77.1 187.5 L 54.9 238.1 L 63.2 239.5 L 149.9 179.5 L 154.9 190.4 L 184.0 186.4 L 258.7 159.7 L 307.5 180.8 L 341.3 228.8 L 365.6 250.4 L 394.1 262.7 L 411.5 262.1 L 431.2 236.5 L 431.5 224.8 L 390.9 198.7 L 393.6 170.1 L 388.5 161.9 L 315.7 135.5 L 308.0 123.5 L 306.9 101.6 L 316.3 90.4 L 401.3 62.7 L 430.4 89.1 L 441.9 85.3 Z'
	},
	{
		name: 'Monza',
		viewBox: '-30 -20 510 307',
		path: 'M 2.1 15.3 L 0.5 30.2 L 18.2 88.6 L 27.3 95.8 L 36.4 191.9 L 49.5 217.4 L 69.9 235.3 L 95.3 243.3 L 130.9 245.2 L 153.7 240.1 L 160.4 248.2 L 364.1 266.9 L 419.2 264.0 L 434.5 257.0 L 446.0 244.1 L 449.2 224.9 L 445.2 216.8 L 434.7 209.6 L 239.3 188.2 L 223.5 175.3 L 203.7 174.5 L 120.2 78.2 L 75.8 2.4 L 64.8 0.0 L 16.6 4.6 Z'
	}
] as const

// Minimalne style CSS - tylko jedna lekka animacja
const cssStyles = `
@keyframes track-glow-pulse {
	0%, 100% { opacity: 0.06; }
	50% { opacity: 0.12; }
}

.track-glow-animated {
	animation: track-glow-pulse 4s ease-in-out infinite;
}
`

interface TrackBackgroundProps {
	trackIndex?: number
	showTrackName?: boolean
	showIndicators?: boolean
}

// Memoizowany komponent SVG toru
const TrackSVG = memo(({ path, viewBox }: { path: string; viewBox: string }) => (
	<svg
		viewBox={viewBox}
		className="w-full h-full max-w-4xl max-h-[70vh]"
		style={{ 
			contain: 'layout style paint'
		}}
		preserveAspectRatio="xMidYMid meet"
	>
		{/* Animated glow - lekka animacja opacity */}
		<path
			d={path}
			fill="none"
			stroke="#ff6b00"
			strokeWidth="28"
			strokeLinecap="round"
			strokeLinejoin="round"
			className="track-glow-animated"
		/>
		
		{/* Main track line */}
		<path
			d={path}
			fill="none"
			stroke="rgba(255, 255, 255, 0.12)"
			strokeWidth="4"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
		
		{/* Center accent line */}
		<path
			d={path}
			fill="none"
			stroke="rgba(255, 107, 0, 0.3)"
			strokeWidth="1.5"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
	</svg>
))

TrackSVG.displayName = 'TrackSVG'

const TrackBackground: React.FC<TrackBackgroundProps> = memo(({ 
	trackIndex: forcedIndex,
	showTrackName = true,
	showIndicators = true
}) => {
	const [currentTrackIndex, setCurrentTrackIndex] = useState(forcedIndex ?? 0)
	const [isVisible, setIsVisible] = useState(true)

	// Auto-rotacja między torami
	useEffect(() => {
		if (forcedIndex !== undefined) {
			setCurrentTrackIndex(forcedIndex)
			return
		}

		const interval = setInterval(() => {
			setIsVisible(false)
			
			setTimeout(() => {
				setCurrentTrackIndex((prev) => (prev + 1) % tracks.length)
				setIsVisible(true)
			}, 400)
		}, 20000)

		return () => clearInterval(interval)
	}, [forcedIndex])

	const currentTrack = tracks[currentTrackIndex]

	const handleTrackChange = (index: number) => {
		if (index === currentTrackIndex) return
		setIsVisible(false)
		setTimeout(() => {
			setCurrentTrackIndex(index)
			setIsVisible(true)
		}, 300)
	}

	return (
		<div 
			className="fixed inset-0 z-0 overflow-hidden"
			style={{ 
				backgroundColor: '#0a0a0a',
				contain: 'strict'
			}}
		>
			{/* Minimalne style */}
			<style dangerouslySetInnerHTML={{ __html: cssStyles }} />

			{/* Gradient */}
			<div 
				className="absolute inset-0 pointer-events-none"
				style={{
					background: 'radial-gradient(ellipse at 30% 30%, rgba(255, 107, 0, 0.05) 0%, transparent 50%), radial-gradient(ellipse at 70% 70%, rgba(212, 175, 55, 0.03) 0%, transparent 50%)'
				}}
			/>

			{/* Carbon texture */}
			<div 
				className="absolute inset-0 pointer-events-none"
				style={{
					opacity: 0.4,
					backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.02) 2px, rgba(255,255,255,0.02) 4px)',
					backgroundSize: '4px 4px'
				}}
			/>

			{/* Track container */}
			<div 
				className="absolute inset-0 flex items-center justify-center p-8 md:p-16"
				style={{
					opacity: isVisible ? 1 : 0,
					transform: isVisible ? 'scale(1)' : 'scale(0.98)',
					transition: 'opacity 0.4s ease-out, transform 0.4s ease-out'
				}}
			>
				<TrackSVG path={currentTrack.path} viewBox={currentTrack.viewBox} />
			</div>

			{/* Track name */}
			{showTrackName && (
				<div 
					className="absolute bottom-6 left-6 md:bottom-10 md:left-10 z-20"
					style={{
						opacity: isVisible ? 1 : 0,
						transform: isVisible ? 'translateX(0)' : 'translateX(-10px)',
						transition: 'opacity 0.3s ease-out, transform 0.3s ease-out'
					}}
				>
					<p 
						className="text-xs uppercase mb-1 font-medium"
						style={{ 
							color: '#ff6b00', 
							letterSpacing: '0.2em',
							fontFamily: 'system-ui, -apple-system, sans-serif'
						}}
					>
						Circuit
					</p>
					<h3 
						className="text-lg md:text-2xl font-bold uppercase"
						style={{ 
							color: 'rgba(255, 255, 255, 0.15)',
							fontFamily: 'system-ui, -apple-system, sans-serif',
							letterSpacing: '0.05em'
						}}
					>
						{currentTrack.name}
					</h3>
				</div>
			)}

			{/* Indicators */}
			{showIndicators && (
				<div className="absolute bottom-6 right-6 md:bottom-10 md:right-10 flex gap-2 z-20">
					{tracks.map((track, index) => (
						<button
							key={track.name}
							onClick={() => handleTrackChange(index)}
							className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full transition-colors duration-200"
							style={{
								backgroundColor: index === currentTrackIndex 
									? '#ff6b00' 
									: 'rgba(255, 255, 255, 0.2)'
							}}
							aria-label={`Switch to ${track.name}`}
						/>
					))}
				</div>
			)}

			{/* Vignette */}
			<div 
				className="absolute inset-0 pointer-events-none"
				style={{
					background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.5) 100%)'
				}}
			/>
		</div>
	)
})

TrackBackground.displayName = 'TrackBackground'

export default TrackBackground