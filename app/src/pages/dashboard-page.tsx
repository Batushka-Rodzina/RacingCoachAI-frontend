// src/pages/dashboard-page.tsx
import React from 'react'
import { Link } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import SessionTable from '../components/SessionTable'

// === KOLORY PREMIUM IRACING ===
const COLORS = {
	primary: '#ff6b00',
	primaryHover: '#ff8533',
	gold: '#d4af37',
	carbon: '#1a1a1a',
	carbonLight: '#2d2d2d',
	text: '#e5e5e5',
	textMuted: '#737373',
	success: '#22c55e',
	warning: '#f59e0b',
	danger: '#ef4444',
}

const DashboardPage: React.FC = () => {
	return (
		<div className="flex min-h-screen bg-neutral-950 text-white overflow-x-hidden">
			{/* Google Fonts */}
			<style>{`
				@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;600;700&family=Michroma&family=JetBrains+Mono:wght@400;500&display=swap');
				
				.carbon-bg {
					background-color: #0a0a0a;
					background-image: 
						linear-gradient(45deg, #0f0f0f 25%, transparent 25%),
						linear-gradient(-45deg, #0f0f0f 25%, transparent 25%),
						linear-gradient(45deg, transparent 75%, #0f0f0f 75%),
						linear-gradient(-45deg, transparent 75%, #0f0f0f 75%);
					background-size: 4px 4px;
					background-position: 0 0, 0 2px, 2px -2px, -2px 0px;
				}

				.carbon-card {
					background-color: rgba(26, 26, 26, 0.6);
					background-image: 
						linear-gradient(45deg, rgba(21, 21, 21, 0.5) 25%, transparent 25%),
						linear-gradient(-45deg, rgba(21, 21, 21, 0.5) 25%, transparent 25%),
						linear-gradient(45deg, transparent 75%, rgba(21, 21, 21, 0.5) 75%),
						linear-gradient(-45deg, transparent 75%, rgba(21, 21, 21, 0.5) 75%);
					background-size: 4px 4px;
					background-position: 0 0, 0 2px, 2px -2px, -2px 0px;
				}

				.custom-scrollbar::-webkit-scrollbar {
					width: 6px;
				}
				.custom-scrollbar::-webkit-scrollbar-track {
					background: rgba(255, 255, 255, 0.02);
				}
				.custom-scrollbar::-webkit-scrollbar-thumb {
					background: rgba(255, 107, 0, 0.3);
					border-radius: 3px;
				}
				.custom-scrollbar::-webkit-scrollbar-thumb:hover {
					background: rgba(255, 107, 0, 0.5);
				}

				.sparkline {
					stroke: ${COLORS.primary};
					stroke-width: 2;
					fill: none;
				}
				.sparkline-area {
					fill: url(#sparklineGradient);
				}
			`}</style>

			{/* Sidebar */}
			<Sidebar activeTab="dashboard" />

			{/* Main Content */}
			<main className="flex-1 p-8 overflow-y-auto custom-scrollbar carbon-bg relative">
				{/* Gradient overlay */}
				<div 
					className="fixed inset-0 pointer-events-none z-0"
					style={{
						background: `
							radial-gradient(ellipse at 20% 0%, rgba(255, 107, 0, 0.03) 0%, transparent 50%),
							radial-gradient(ellipse at 80% 100%, rgba(212, 175, 55, 0.02) 0%, transparent 50%)
						`
					}}
				/>

				<div className="relative z-10 max-w-7xl mx-auto space-y-8">
					
					{/* === 1. PROFILE HEADER (Uproszczony) === */}
					<section 
						className="carbon-card rounded-2xl p-6 overflow-hidden"
						style={{ border: '1px solid rgba(255, 107, 0, 0.15)' }}
					>
						<div className="flex flex-col md:flex-row items-center gap-6">
							{/* Avatar */}
							<div className="relative">
								<div 
									className="w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-black"
									style={{ 
										backgroundColor: 'rgba(255, 107, 0, 0.1)',
										border: '2px solid rgba(255, 107, 0, 0.3)',
										color: COLORS.primary,
										fontFamily: 'Bebas Neue, sans-serif'
									}}
								>
									AZ
								</div>
								{/* Online indicator */}
								<div 
									className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-neutral-950"
									style={{ backgroundColor: COLORS.success }}
								/>
							</div>

							{/* Name & Team */}
							<div className="flex-1 text-center md:text-left">
								<h1 
									className="text-3xl md:text-4xl font-black tracking-wide uppercase"
									style={{ fontFamily: 'Bebas Neue, sans-serif', color: COLORS.text }}
								>
									Andrii Zhupanov
								</h1>
								<div className="flex items-center justify-center md:justify-start gap-2 mt-1">
									<span style={{ color: COLORS.textMuted, fontFamily: 'DM Sans, sans-serif' }} className="text-sm">
										Team:
									</span>
									<span style={{ color: COLORS.primary, fontFamily: 'DM Sans, sans-serif' }} className="text-sm font-bold">
										Soul of Racing
									</span>
								</div>
							</div>

							{/* iRating & SR */}
							<div className="flex gap-6">
								{/* iRating */}
								<div className="text-center">
									<p 
										className="text-xs uppercase tracking-wider font-semibold mb-1"
										style={{ color: COLORS.textMuted, fontFamily: 'DM Sans, sans-serif' }}
									>
										iRating
									</p>
									<p 
										className="text-2xl font-bold"
										style={{ color: COLORS.primary, fontFamily: 'JetBrains Mono, monospace' }}
									>
										4,521
									</p>
									<p 
										className="text-xs font-semibold mt-1"
										style={{ color: COLORS.success, fontFamily: 'DM Sans, sans-serif' }}
									>
										↑ +127
									</p>
								</div>

								{/* Divider */}
								<div className="w-px bg-white/10" />

								{/* Safety Rating */}
								<div className="text-center">
									<p 
										className="text-xs uppercase tracking-wider font-semibold mb-1"
										style={{ color: COLORS.textMuted, fontFamily: 'DM Sans, sans-serif' }}
									>
										Safety
									</p>
									<p 
										className="text-2xl font-bold"
										style={{ color: COLORS.gold, fontFamily: 'JetBrains Mono, monospace' }}
									>
										4.95
									</p>
									<p 
										className="text-xs font-semibold mt-1"
										style={{ color: COLORS.textMuted, fontFamily: 'DM Sans, sans-serif' }}
									>
										A Class
									</p>
								</div>
							</div>
						</div>
					</section>

					{/* === 2. STAT CARDS (3 karty - bez Win Rate) === */}
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
						<StatCard 
							label="Best Lap" 
							sublabel="Spa-Francorchamps"
							value="1:24.302" 
							trend={{ direction: 'down', value: '-0.3s' }}
							highlight
						/>
						<StatCard 
							label="Total Races" 
							sublabel="This season"
							value="47" 
						/>
						<StatCard 
							label="Track Time" 
							sublabel="All time"
							value="209h" 
						/>
					</div>

					{/* === 3. iRATING PROGRESS + AREAS TO IMPROVE === */}
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
						
						{/* iRating Progress */}
						<div 
							className="carbon-card rounded-2xl p-6"
							style={{ border: '1px solid rgba(255, 255, 255, 0.05)' }}
						>
							<div className="flex items-center justify-between mb-6">
								<h3 
									className="text-xl font-black uppercase tracking-wide"
									style={{ fontFamily: 'Bebas Neue, sans-serif', color: COLORS.text }}
								>
									iRating Progress
								</h3>
								<span 
									className="text-xs font-semibold px-3 py-1 rounded-full"
									style={{ 
										backgroundColor: 'rgba(34, 197, 94, 0.1)', 
										color: COLORS.success,
										fontFamily: 'DM Sans, sans-serif'
									}}
								>
									+127 this week
								</span>
							</div>

							{/* Sparkline Chart */}
							<div className="h-32 relative">
								<svg width="100%" height="100%" viewBox="0 0 300 100" preserveAspectRatio="none">
									<defs>
										<linearGradient id="sparklineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
											<stop offset="0%" stopColor={COLORS.primary} stopOpacity="0.3" />
											<stop offset="100%" stopColor={COLORS.primary} stopOpacity="0" />
										</linearGradient>
									</defs>
									{/* Area fill */}
									<path 
										d="M 0 80 L 30 75 L 60 70 L 90 65 L 120 60 L 150 55 L 180 45 L 210 40 L 240 30 L 270 25 L 300 20 L 300 100 L 0 100 Z"
										className="sparkline-area"
									/>
									{/* Line */}
									<path 
										d="M 0 80 L 30 75 L 60 70 L 90 65 L 120 60 L 150 55 L 180 45 L 210 40 L 240 30 L 270 25 L 300 20"
										className="sparkline"
									/>
									{/* Current point */}
									<circle cx="300" cy="20" r="4" fill={COLORS.primary} />
								</svg>

								{/* Y-axis labels */}
								<div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs" style={{ color: COLORS.textMuted, fontFamily: 'JetBrains Mono, monospace' }}>
									<span>4,600</span>
									<span>4,400</span>
								</div>
							</div>

							{/* Stats row */}
							<div className="flex justify-between mt-4 pt-4 border-t border-white/5">
								<MiniStat label="Peak" value="4,521" />
								<MiniStat label="Avg" value="4,412" />
								<MiniStat label="Low" value="4,298" />
							</div>
						</div>

						{/* Areas to Improve */}
						<div 
							className="carbon-card rounded-2xl p-6"
							style={{ border: '1px solid rgba(255, 255, 255, 0.05)' }}
						>
							<h3 
								className="text-xl font-black uppercase tracking-wide mb-6"
								style={{ fontFamily: 'Bebas Neue, sans-serif', color: COLORS.text }}
							>
								Areas to Improve
							</h3>

							<div className="space-y-4">
								<ImprovementItem 
									status="warning"
									title="Braking into T1"
									description="12m too early on average"
									track="Spa-Francorchamps"
								/>
								<ImprovementItem 
									status="warning"
									title="Throttle Application"
									description="Hesitant through Eau Rouge"
									track="Spa-Francorchamps"
								/>
								<ImprovementItem 
									status="success"
									title="Trail Braking - Les Combes"
									description="Excellent technique!"
									track="Spa-Francorchamps"
								/>
								<ImprovementItem 
									status="danger"
									title="Corner Entry Speed"
									description="Losing 0.4s at Parabolica"
									track="Monza"
								/>
							</div>
						</div>
					</div>

					{/* === 4. QUICK ACTIONS === */}
					<div 
						className="carbon-card rounded-2xl p-6"
						style={{ border: '1px solid rgba(255, 255, 255, 0.05)' }}
					>
						<h3 
							className="text-xl font-black uppercase tracking-wide mb-6"
							style={{ fontFamily: 'Bebas Neue, sans-serif', color: COLORS.text }}
						>
							Quick Actions
						</h3>

						<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
							<QuickActionButton 
								title="Upload Telemetry"
								description="Import .ibt file from iRacing"
								to="/upload"
								primary
							/>
							<QuickActionButton 
								title="Start New Analysis"
								description="Analyze your latest session"
								to="/telemetry"
							/>
							<QuickActionButton 
								title="Compare with Alien"
								description="See where you're losing time"
								to="/compare"
							/>
						</div>
					</div>

					{/* === 5. RECENT SESSIONS === */}
					<section>
						<div className="flex justify-between items-end mb-6 px-2">
							<h3 
								className="text-xl font-black uppercase tracking-wide"
								style={{ fontFamily: 'Bebas Neue, sans-serif', color: COLORS.text }}
							>
								Recent Sessions
							</h3>
							<Link
								to="/sessions"
								className="text-xs uppercase font-bold tracking-widest transition-colors duration-200"
								style={{ color: COLORS.primary, fontFamily: 'DM Sans, sans-serif' }}
								onMouseEnter={(e) => e.currentTarget.style.color = COLORS.primaryHover}
								onMouseLeave={(e) => e.currentTarget.style.color = COLORS.primary}
							>
								View All →
							</Link>
						</div>
						<SessionTable />
					</section>

				</div>
			</main>
		</div>
	)
}

// === KOMPONENTY POMOCNICZE ===

// Stat Card
interface StatCardProps {
	label: string
	sublabel?: string
	value: string
	trend?: { direction: 'up' | 'down'; value: string }
	highlight?: boolean
}

const StatCard: React.FC<StatCardProps> = ({ label, sublabel, value, trend, highlight }) => (
	<div 
		className="carbon-card rounded-2xl p-5 transition-all duration-300"
		style={{ 
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
		<div className="flex items-start justify-between mb-2">
			<p 
				className="text-xs uppercase tracking-wider font-semibold"
				style={{ color: COLORS.textMuted, fontFamily: 'DM Sans, sans-serif' }}
			>
				{label}
			</p>
			{trend && (
				<span 
					className="text-xs font-bold px-2 py-1 rounded-full"
					style={{ 
						backgroundColor: trend.direction === 'down' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
						color: trend.direction === 'down' ? COLORS.success : COLORS.danger,
						fontFamily: 'DM Sans, sans-serif'
					}}
				>
					{trend.value}
				</span>
			)}
		</div>
		{sublabel && (
			<p 
				className="text-[10px] mb-2"
				style={{ color: COLORS.textMuted, fontFamily: 'DM Sans, sans-serif' }}
			>
				{sublabel}
			</p>
		)}
		<p 
			className="text-3xl font-bold mt-1"
			style={{ 
				color: highlight ? COLORS.primary : COLORS.text, 
				fontFamily: 'JetBrains Mono, monospace' 
			}}
		>
			{value}
		</p>
	</div>
)

// Mini Stat
const MiniStat: React.FC<{ label: string; value: string }> = ({ label, value }) => (
	<div className="text-center">
		<p className="text-[10px] uppercase tracking-wider" style={{ color: COLORS.textMuted, fontFamily: 'DM Sans, sans-serif' }}>
			{label}
		</p>
		<p className="text-sm font-bold" style={{ color: COLORS.text, fontFamily: 'JetBrains Mono, monospace' }}>
			{value}
		</p>
	</div>
)

// Improvement Item
interface ImprovementItemProps {
	status: 'success' | 'warning' | 'danger'
	title: string
	description: string
	track: string
}

const ImprovementItem: React.FC<ImprovementItemProps> = ({ status, title, description, track }) => {
	const statusConfig = {
		success: { color: COLORS.success, bg: 'rgba(34, 197, 94, 0.1)' },
		warning: { color: COLORS.warning, bg: 'rgba(245, 158, 11, 0.1)' },
		danger: { color: COLORS.danger, bg: 'rgba(239, 68, 68, 0.1)' }
	}
	const config = statusConfig[status]

	return (
		<div 
			className="flex items-start gap-3 p-3 rounded-xl transition-all duration-200"
			style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }}
			onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.3)'}
			onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.2)'}
		>
			<div 
				className="w-2 h-2 rounded-full flex-shrink-0 mt-2"
				style={{ backgroundColor: config.color }}
			/>
			<div className="flex-1 min-w-0">
				<p 
					className="text-sm font-semibold truncate"
					style={{ color: COLORS.text, fontFamily: 'DM Sans, sans-serif' }}
				>
					{title}
				</p>
				<p 
					className="text-xs truncate"
					style={{ color: COLORS.textMuted, fontFamily: 'DM Sans, sans-serif' }}
				>
					{description}
				</p>
			</div>
			<span 
				className="text-[10px] px-2 py-1 rounded-full flex-shrink-0"
				style={{ 
					backgroundColor: 'rgba(255, 255, 255, 0.05)', 
					color: COLORS.textMuted,
					fontFamily: 'DM Sans, sans-serif'
				}}
			>
				{track}
			</span>
		</div>
	)
}

// Quick Action Button
interface QuickActionButtonProps {
	title: string
	description: string
	to: string
	primary?: boolean
}

const QuickActionButton: React.FC<QuickActionButtonProps> = ({ title, description, to, primary }) => (
	<Link
		to={to}
		className="block p-5 rounded-xl transition-all duration-300"
		style={{ 
			backgroundColor: primary ? 'rgba(255, 107, 0, 0.1)' : 'rgba(0, 0, 0, 0.2)',
			border: `1px solid ${primary ? 'rgba(255, 107, 0, 0.3)' : 'rgba(255, 255, 255, 0.05)'}`
		}}
		onMouseEnter={(e) => {
			e.currentTarget.style.borderColor = COLORS.primary
			e.currentTarget.style.boxShadow = '0 0 20px rgba(255, 107, 0, 0.2)'
			e.currentTarget.style.transform = 'translateY(-2px)'
		}}
		onMouseLeave={(e) => {
			e.currentTarget.style.borderColor = primary ? 'rgba(255, 107, 0, 0.3)' : 'rgba(255, 255, 255, 0.05)'
			e.currentTarget.style.boxShadow = 'none'
			e.currentTarget.style.transform = 'translateY(0)'
		}}
	>
		<p 
			className="text-sm font-bold mb-1"
			style={{ color: primary ? COLORS.primary : COLORS.text, fontFamily: 'DM Sans, sans-serif' }}
		>
			{title}
		</p>
		<p 
			className="text-xs"
			style={{ color: COLORS.textMuted, fontFamily: 'DM Sans, sans-serif' }}
		>
			{description}
		</p>
	</Link>
)

export default DashboardPage