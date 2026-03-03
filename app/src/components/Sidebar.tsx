// src/components/Sidebar.tsx
import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

// === KOLORY PREMIUM IRACING ===
const COLORS = {
	primary: '#ff6b00',
	primaryHover: '#ff8533',
	gold: '#d4af37',
	carbon: '#1a1a1a',
	carbonLight: '#2d2d2d',
	text: '#e5e5e5',
	textMuted: '#737373',
}

interface SidebarProps {
	activeTab?: 'dashboard' | 'telemetry' | 'coach' | 'community' | 'team' | 'settings'
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab }) => {
	const location = useLocation()
	
	// Automatyczne wykrywanie aktywnej zakładki
	const currentTab = activeTab || (
		location.pathname.includes('telemetry') ? 'telemetry' :
		location.pathname.includes('coach') ? 'coach' :
		location.pathname.includes('community') ? 'community' :
		location.pathname.includes('team') ? 'team' :
		location.pathname.includes('settings') ? 'settings' : 'dashboard'
	)

	// Czy Analyze jest rozwinięte - domyślnie tak jeśli jesteśmy na telemetry lub coach
	const [analyzeExpanded, setAnalyzeExpanded] = useState(
		currentTab === 'telemetry' || currentTab === 'coach'
	)

	// Sprawdź czy aktywna zakładka jest w Analyze
	const isAnalyzeActive = currentTab === 'telemetry' || currentTab === 'coach'

	return (
		<aside className="w-72 min-h-screen flex flex-col relative">
			{/* Google Fonts */}
			<style>{`
				@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;600;700&family=Michroma&family=JetBrains+Mono:wght@400;500&display=swap');
				
				.carbon-sidebar {
					background-color: ${COLORS.carbon};
					background-image: 
						linear-gradient(45deg, #151515 25%, transparent 25%),
						linear-gradient(-45deg, #151515 25%, transparent 25%),
						linear-gradient(45deg, transparent 75%, #151515 75%),
						linear-gradient(-45deg, transparent 75%, #151515 75%);
					background-size: 4px 4px;
					background-position: 0 0, 0 2px, 2px -2px, -2px 0px;
				}

				.sidebar-item-active {
					background: linear-gradient(90deg, ${COLORS.primary} 0%, ${COLORS.primaryHover} 100%);
					box-shadow: 0 4px 15px rgba(255, 107, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1);
				}

				.sidebar-item-hover:hover {
					background: rgba(255, 107, 0, 0.1);
					border-color: rgba(255, 107, 0, 0.3);
				}

				.submenu-item-active {
					background: rgba(255, 107, 0, 0.15);
					border-left: 2px solid ${COLORS.primary};
				}

				.submenu-item:hover {
					background: rgba(255, 107, 0, 0.08);
				}
			`}</style>

			{/* Carbon background */}
			<div className="carbon-sidebar absolute inset-0 opacity-50" />
			
			{/* Gradient overlay */}
			<div 
				className="absolute inset-0 pointer-events-none"
				style={{
					background: 'linear-gradient(180deg, rgba(26,26,26,0.95) 0%, rgba(26,26,26,0.98) 100%)'
				}}
			/>

			{/* Border prawa */}
			<div 
				className="absolute right-0 top-0 bottom-0 w-px"
				style={{ backgroundColor: 'rgba(255, 107, 0, 0.15)' }}
			/>

			{/* Content */}
			<div className="relative z-10 flex flex-col h-full p-6">
				{/* Logo */}
				<Link to="/" className="block mb-10">
					<div 
						className="text-2xl font-bold tracking-widest flex items-center gap-3"
						style={{ 
							color: COLORS.primary,
							fontFamily: 'Michroma, sans-serif',
							letterSpacing: '0.15em'
						}}
					>
						BOLIDE
					</div>
					<div 
						className="text-[10px] uppercase tracking-widest mt-1 font-medium"
						style={{ color: COLORS.textMuted, fontFamily: 'DM Sans, sans-serif' }}
					>
						Telemetry Coach
					</div>
				</Link>

				{/* Navigation */}
				<nav className="flex-1 space-y-1">
					<p 
						className="text-[10px] uppercase tracking-widest mb-4 px-4 font-bold"
						style={{ color: COLORS.textMuted, fontFamily: 'DM Sans, sans-serif' }}
					>
						Menu
					</p>
					
					{/* Overview */}
					<SidebarItem
						label="Overview"
						to="/dashboard"
						active={currentTab === 'dashboard'}
					/>

					{/* Analyze - Expandable */}
					<div>
						{/* Analyze Header */}
						<button
							onClick={() => setAnalyzeExpanded(!analyzeExpanded)}
							className={`
								w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-200 
								border border-transparent
								${isAnalyzeActive ? 'bg-white/5' : 'sidebar-item-hover'}
							`}
							style={{ 
								color: isAnalyzeActive ? COLORS.primary : COLORS.text,
								fontFamily: 'DM Sans, sans-serif',
								fontWeight: 500,
							}}
						>
							<span className="text-sm">Analyze</span>
							<svg 
								className={`w-4 h-4 transition-transform duration-200 ${analyzeExpanded ? 'rotate-180' : ''}`}
								fill="none" 
								stroke="currentColor" 
								viewBox="0 0 24 24"
							>
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
							</svg>
						</button>

						{/* Submenu */}
						{analyzeExpanded && (
							<div className="mt-1 ml-4 space-y-1">
								<SubmenuItem
									label="Telemetry"
									to="/telemetry"
									active={currentTab === 'telemetry'}
								/>
								<SubmenuItem
									label="Coach AI"
									to="/coach"
									active={currentTab === 'coach'}
								/>
							</div>
						)}
					</div>

					{/* Community */}
					<SidebarItem
						label="Community"
						to="/community"
						active={currentTab === 'community'}
					/>

					{/* Team */}
					<SidebarItem
						label="Team"
						to="/team"
						active={currentTab === 'team'}
					/>

					{/* Settings */}
					<SidebarItem
						label="Settings"
						to="/settings"
						active={currentTab === 'settings'}
					/>
				</nav>

				{/* User section */}
				<div 
					className="mt-auto pt-6 border-t"
					style={{ borderColor: 'rgba(255, 255, 255, 0.05)' }}
				>
					{/* User info */}
					<div className="flex items-center gap-3 mb-4 px-2">
						<div 
							className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold"
							style={{ 
								backgroundColor: 'rgba(255, 107, 0, 0.15)',
								color: COLORS.primary,
								fontFamily: 'DM Sans, sans-serif'
							}}
						>
							AZ
						</div>
						<div className="flex-1 min-w-0">
							<p 
								className="text-sm font-semibold truncate"
								style={{ color: COLORS.text, fontFamily: 'DM Sans, sans-serif' }}
							>
								Andrii Zhupanov
							</p>
							<p 
								className="text-xs truncate"
								style={{ color: COLORS.textMuted, fontFamily: 'DM Sans, sans-serif' }}
							>
								Pro Driver
							</p>
						</div>
					</div>

					{/* Logout */}
					<Link 
						to="/login" 
						className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm transition-all duration-200"
						style={{ 
							color: COLORS.textMuted,
							fontFamily: 'DM Sans, sans-serif'
						}}
						onMouseEnter={(e) => {
							e.currentTarget.style.color = '#dc2626'
							e.currentTarget.style.backgroundColor = 'rgba(220, 38, 38, 0.1)'
						}}
						onMouseLeave={(e) => {
							e.currentTarget.style.color = COLORS.textMuted
							e.currentTarget.style.backgroundColor = 'transparent'
						}}
					>
						<span className="font-medium">Log out</span>
					</Link>
				</div>
			</div>
		</aside>
	)
}

// === KOMPONENTY ===

interface SidebarItemProps {
	label: string
	to: string
	active?: boolean
}

const SidebarItem: React.FC<SidebarItemProps> = ({ label, to, active = false }) => (
	<Link to={to} className="block">
		<div 
			className={`
				flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-200 
				border border-transparent
				${active ? 'sidebar-item-active' : 'sidebar-item-hover'}
			`}
			style={{ 
				color: active ? '#000' : COLORS.text,
				fontFamily: 'DM Sans, sans-serif',
				fontWeight: active ? 600 : 500,
			}}
		>
			<span className="text-sm">{label}</span>
			{active && (
				<div className="ml-auto w-1.5 h-1.5 rounded-full bg-black/30" />
			)}
		</div>
	</Link>
)

interface SubmenuItemProps {
	label: string
	to: string
	active?: boolean
}

const SubmenuItem: React.FC<SubmenuItemProps> = ({ label, to, active = false }) => (
	<Link to={to} className="block">
		<div 
			className={`
				flex items-center gap-3 px-4 py-2.5 rounded-lg cursor-pointer transition-all duration-200
				${active ? 'submenu-item-active' : 'submenu-item'}
			`}
			style={{ 
				color: active ? COLORS.primary : COLORS.textMuted,
				fontFamily: 'DM Sans, sans-serif',
				fontWeight: active ? 600 : 400,
				fontSize: '13px',
			}}
		>
			<div 
				className="w-1.5 h-1.5 rounded-full"
				style={{ backgroundColor: active ? COLORS.primary : 'rgba(255,255,255,0.2)' }}
			/>
			<span>{label}</span>
		</div>
	</Link>
)

export default Sidebar