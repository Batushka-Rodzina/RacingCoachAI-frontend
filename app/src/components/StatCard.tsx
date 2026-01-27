// src/components/StatCard.tsx
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
	danger: '#ef4444',
}

interface StatProps {
	title: string
	value: string
	unit?: string
	trend?: 'up' | 'down' | 'stable'
	icon?: string
	highlight?: boolean
}

const StatCard: React.FC<StatProps> = ({ title, value, unit, trend, icon, highlight = false }) => {
	const getTrendIcon = () => {
		if (trend === 'up') return { icon: '▲', color: COLORS.success }
		if (trend === 'down') return { icon: '▼', color: COLORS.danger }
		if (trend === 'stable') return { icon: '●', color: COLORS.textMuted }
		return null
	}

	const trendData = getTrendIcon()

	return (
		<div 
			className="relative group rounded-2xl p-5 transition-all duration-300 overflow-hidden"
			style={{
				backgroundColor: 'rgba(26, 26, 26, 0.8)',
				border: `1px solid ${highlight ? 'rgba(255, 107, 0, 0.3)' : 'rgba(255, 255, 255, 0.05)'}`,
				boxShadow: highlight ? '0 0 30px rgba(255, 107, 0, 0.1)' : 'none'
			}}
			onMouseEnter={(e) => {
				e.currentTarget.style.borderColor = 'rgba(255, 107, 0, 0.4)'
				e.currentTarget.style.boxShadow = '0 8px 30px rgba(255, 107, 0, 0.15)'
			}}
			onMouseLeave={(e) => {
				e.currentTarget.style.borderColor = highlight ? 'rgba(255, 107, 0, 0.3)' : 'rgba(255, 255, 255, 0.05)'
				e.currentTarget.style.boxShadow = highlight ? '0 0 30px rgba(255, 107, 0, 0.1)' : 'none'
			}}
		>
			{/* Carbon texture overlay */}
			<div 
				className="absolute inset-0 opacity-30 pointer-events-none"
				style={{
					backgroundImage: `
						linear-gradient(45deg, #151515 25%, transparent 25%),
						linear-gradient(-45deg, #151515 25%, transparent 25%),
						linear-gradient(45deg, transparent 75%, #151515 75%),
						linear-gradient(-45deg, transparent 75%, #151515 75%)
					`,
					backgroundSize: '4px 4px',
					backgroundPosition: '0 0, 0 2px, 2px -2px, -2px 0px'
				}}
			/>

			{/* Gradient accent */}
			{highlight && (
				<div 
					className="absolute top-0 right-0 w-24 h-24 pointer-events-none"
					style={{
						background: 'radial-gradient(circle at top right, rgba(255, 107, 0, 0.15) 0%, transparent 70%)'
					}}
				/>
			)}

			{/* Content */}
			<div className="relative z-10">
				{/* Header */}
				<div className="flex items-center justify-between mb-3">
					<h3 
						className="text-xs uppercase tracking-wider font-semibold"
						style={{ 
							color: COLORS.textMuted,
							fontFamily: 'DM Sans, sans-serif'
						}}
					>
						{title}
					</h3>
					{icon && (
						<span className="text-lg opacity-50">{icon}</span>
					)}
				</div>

				{/* Value */}
				<div className="flex items-baseline gap-2">
					<span 
						className="text-3xl font-black transition-colors duration-200 group-hover:text-orange-400"
						style={{ 
							color: highlight ? COLORS.primary : COLORS.text,
							fontFamily: 'JetBrains Mono, monospace'
						}}
					>
						{value}
					</span>
					
					{unit && (
						<span 
							className="text-sm font-medium"
							style={{ color: COLORS.textMuted, fontFamily: 'DM Sans, sans-serif' }}
						>
							{unit}
						</span>
					)}
					
					{trendData && (
						<span 
							className="text-xs ml-1 font-bold"
							style={{ color: trendData.color }}
						>
							{trendData.icon}
						</span>
					)}
				</div>
			</div>
		</div>
	)
}

export default StatCard