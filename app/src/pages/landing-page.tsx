// src/pages/landing-page.tsx

import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import type { Variants } from 'framer-motion'
import AnimatedTrackBackground from '../components/Trackbackground.tsx'

// === INTERFEJSY DANYCH ===
interface HowItWorksItem {
	step: number
	title: string
	desc: string
	image: string
	direction: 'left' | 'right'
}

interface FeatureItem {
	title: string
	desc: string
}

interface TestimonialItem {
	quote: string
	author: string
	role: string
	iRating: number
	avatar: string
	improvement: string
	series: string
}

// =============================

// === KOLORY PREMIUM IRACING ===
const COLORS = {
	primary: '#ff6b00',      // iRacing Orange
	primaryHover: '#ff8533',
	gold: '#d4af37',         // Elite/Pro Gold
	carbon: '#1a1a1a',
	carbonLight: '#2d2d2d',
	danger: '#dc2626',
	success: '#22c55e',
	text: '#e5e5e5',
	textMuted: '#737373',
}

// Prawidłowa definicja łagodzenia 'easeOut' (Bézier curve)
const EASE_OUT: [number, number, number, number] = [0, 0, 0.58, 1]

// --- Warianty Animacji Framer Motion ---

const fadeInUp: Variants = {
	initial: { y: 60, opacity: 0 },
	animate: { y: 0, opacity: 1, transition: { duration: 0.6 } },
}

const slideInFromSide = (direction: 'left' | 'right'): Variants => ({
	initial: { x: direction === 'left' ? -100 : 100, opacity: 0 },
	whileInView: {
		x: 0,
		opacity: 1,
		transition: {
			duration: 0.7,
			ease: EASE_OUT,
		},
	},
})

const scaleUp: Variants = {
	initial: { scale: 0.9, opacity: 0 },
	whileInView: { scale: 1, opacity: 1, transition: { duration: 0.8 } },
}

const stagger: Variants = {
	animate: {
		transition: {
			staggerChildren: 0.1,
		},
	},
}

// Komponent licznika animowanego
const AnimatedCounter: React.FC<{ end: number; suffix?: string; duration?: number }> = ({ 
	end, 
	suffix = '', 
	duration = 2 
}) => {
	const [count, setCount] = useState(0)

	useEffect(() => {
		let startTime: number
		let animationFrame: number

		const animate = (currentTime: number) => {
			if (!startTime) startTime = currentTime
			const progress = Math.min((currentTime - startTime) / (duration * 1000), 1)
			
			setCount(Math.floor(progress * end))
			
			if (progress < 1) {
				animationFrame = requestAnimationFrame(animate)
			}
		}

		animationFrame = requestAnimationFrame(animate)
		return () => cancelAnimationFrame(animationFrame)
	}, [end, duration])

	return <span>{count.toLocaleString()}{suffix}</span>
}

const LandingPage: React.FC = () => {
	const [scrollProgress, setScrollProgress] = useState(0)

	// Scroll progress bar
	useEffect(() => {
		const handleScroll = () => {
			const totalHeight = document.documentElement.scrollHeight - window.innerHeight
			const progress = (window.scrollY / totalHeight) * 100
			setScrollProgress(progress)
		}

		window.addEventListener('scroll', handleScroll)
		return () => window.removeEventListener('scroll', handleScroll)
	}, [])

	// --- DANE DLA SEKCJI HOW IT WORKS ---
	const howItWorksData: HowItWorksItem[] = [
		{
			step: 1,
			title: 'Connect Your iRacing Account',
			desc: 'Link your iRacing profile in seconds. We automatically sync your .ibt telemetry files after each session — no manual uploads needed. Your data flows directly from iRacing servers to our analysis engine.',
			image: '/images/index5.png',
			direction: 'left',
		},
		{
			step: 2,
			title: 'AI Compares You to Aliens',
			desc: 'Our engine overlays your lap against 50,000+ reference laps from top-split drivers. See exactly where you brake 12 meters too early, where you lift when aliens stay flat, and which corners cost you the most time.',
			image: '/images/index4.png',
			direction: 'right',
		},
		{
			step: 3,
			title: 'Get Corner-Specific Coaching',
			desc: 'Receive prioritized tips like "Brake 8m later into T1" or "Carry 12 km/h more through Eau Rouge". Track your improvement over sessions and watch your iRating climb.',
			image: '/images/index3.png',
			direction: 'left',
		},
	]

	// --- DANE DLA SEKCJI KEY INSIGHTS ---
	const featureData: FeatureItem[] = [
		{
			title: 'Lap Delta Analysis',
			desc: 'Real-time delta breakdown showing exactly where you gain or lose tenths. See your gap to the reference lap update corner-by-corner with sector-specific insights.',
		},
		{
			title: 'Input Trace Overlay',
			desc: 'Compare your throttle, brake, and steering inputs directly against alien laps. Spot trail-braking deficiencies, throttle hesitation, and steering corrections instantly.',
		},
		{
			title: 'Setup Correlation',
			desc: 'A/B test your setups with data. See how spring rate changes affect tire temps, how wing adjustments impact corner speed, and find the perfect balance for your driving style.',
		},
	]

	// --- TESTIMONIALS Z IRATING ---
	const testimonials: TestimonialItem[] = [
		{
			quote: "Dropped 3 seconds at Spa in one week. The corner-by-corner breakdown showed me I was braking way too early into Les Combes. Fixed it, gained 1.2s just there.",
			author: "Marcus Eriksson",
			role: "GT3 Sprint Series",
			iRating: 5847,
			avatar: "ME",
			improvement: "-3.2s",
			series: "IMSA"
		},
		{
			quote: "Finally broke into top split. Bolide showed my throttle application out of slow corners was costing me 0.3s per lap. Now I'm consistently in the top 5.",
			author: "Jennifer Walsh",
			role: "Formula Driver",
			iRating: 4521,
			avatar: "JW",
			improvement: "-2.8s",
			series: "F4"
		},
		{
			quote: "The setup correlation feature is insane. Tested 6 different rear wing settings and found the perfect balance. My tire deg improved by 15% over stint.",
			author: "Carlos Mendez",
			role: "Endurance Specialist",
			iRating: 6203,
			avatar: "CM",
			improvement: "-1.9s",
			series: "IMSA Endurance"
		}
	]

	return (
		<div className="bg-neutral-950 text-white overflow-x-hidden min-h-screen relative">
			{/* Google Fonts */}
			<style>{`
				@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600;700&family=Michroma&family=JetBrains+Mono:wght@400;500;600&display=swap');
				
				:root {
					--color-primary: ${COLORS.primary};
					--color-primary-hover: ${COLORS.primaryHover};
					--color-gold: ${COLORS.gold};
					--color-carbon: ${COLORS.carbon};
					--color-carbon-light: ${COLORS.carbonLight};
				}

				@keyframes gradientShift {
					0%, 100% { background-position: 0% 50%; }
					50% { background-position: 100% 50%; }
				}

				@keyframes pulse-glow {
					0%, 100% { box-shadow: 0 0 20px rgba(255, 107, 0, 0.3); }
					50% { box-shadow: 0 0 40px rgba(255, 107, 0, 0.6); }
				}

				.carbon-texture {
					background-image: 
						linear-gradient(45deg, #1a1a1a 25%, transparent 25%),
						linear-gradient(-45deg, #1a1a1a 25%, transparent 25%),
						linear-gradient(45deg, transparent 75%, #1a1a1a 75%),
						linear-gradient(-45deg, transparent 75%, #1a1a1a 75%);
					background-size: 4px 4px;
					background-position: 0 0, 0 2px, 2px -2px, -2px 0px;
				}

				.glow-button {
					position: relative;
					overflow: hidden;
					animation: pulse-glow 3s ease-in-out infinite;
				}

				.glow-button::before {
					content: '';
					position: absolute;
					inset: 0;
					background: ${COLORS.primary};
					filter: blur(20px);
					opacity: 0.4;
					z-index: -1;
					transition: opacity 0.3s;
				}

				.glow-button:hover::before {
					opacity: 0.7;
				}

				.irating-badge {
					background: linear-gradient(135deg, ${COLORS.gold} 0%, #b8960c 100%);
					color: #000;
					font-weight: 700;
				}
			`}</style>

			{/* SCROLL PROGRESS BAR - Throttle style */}
			<div className="fixed top-0 left-0 w-full h-1.5 bg-neutral-900 z-[60]">
				<div 
					className="h-full transition-all duration-150"
					style={{ 
						width: `${scrollProgress}%`,
						background: `linear-gradient(90deg, ${COLORS.primary} 0%, ${COLORS.gold} 100%)`
					}}
				/>
			</div>

			{/* Animowane tło z torami */}
			<AnimatedTrackBackground />

			{/* 1. HEADER */}
			<motion.header
				className="sticky top-0 z-50 backdrop-blur-md border-b"
				style={{ 
					backgroundColor: 'rgba(10, 10, 10, 0.9)',
					borderColor: 'rgba(255, 107, 0, 0.2)'
				}}
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
			>
				<div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
					<div className="flex items-center gap-4">
						<Link
							to="/"
							className="text-2xl font-black tracking-wider"
							style={{ 
								color: COLORS.primary,
								fontFamily: 'Michroma, sans-serif',
								letterSpacing: '0.15em'
							}}
						>
							BOLIDE
						</Link>
						{/* iRacing Compatible Badge */}
						<div 
							className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider"
							style={{ 
								backgroundColor: 'rgba(255, 107, 0, 0.1)',
								border: '1px solid rgba(255, 107, 0, 0.3)',
								color: COLORS.primary,
								fontFamily: 'DM Sans, sans-serif'
							}}
						>
							<span>Built for iRacing</span>
						</div>
					</div>

					<nav className="flex gap-4 md:gap-6 text-sm items-center" style={{ fontFamily: 'DM Sans, sans-serif' }}>
						<Link 
							to="/login" 
							className="transition font-medium hidden md:block"
							style={{ color: COLORS.text }}
							onMouseEnter={(e) => e.currentTarget.style.color = COLORS.primary}
							onMouseLeave={(e) => e.currentTarget.style.color = COLORS.text}
						>
							Log in
						</Link>
						<Link
							to="/register"
							className="px-5 py-2.5 rounded-lg font-bold transition uppercase tracking-wide text-xs"
							style={{ 
								backgroundColor: COLORS.primary,
								color: '#000'
							}}
							onMouseEnter={(e) => e.currentTarget.style.backgroundColor = COLORS.primaryHover}
							onMouseLeave={(e) => e.currentTarget.style.backgroundColor = COLORS.primary}
						>
							Start Free
						</Link>
						<Link
							to="/dashboard"
							className="px-5 py-2.5 font-bold rounded-lg transition uppercase tracking-wide text-xs border"
							style={{ 
								borderColor: 'rgba(255, 107, 0, 0.5)',
								color: COLORS.primary
							}}
							onMouseEnter={(e) => {
								e.currentTarget.style.backgroundColor = 'rgba(255, 107, 0, 0.1)'
							}}
							onMouseLeave={(e) => {
								e.currentTarget.style.backgroundColor = 'transparent'
							}}
						>
							Dashboard
						</Link>
					</nav>
				</div>
			</motion.header>

			{/* 2. HERO SECTION */}
			<section className="relative overflow-hidden pt-32 pb-48 md:pt-48 md:pb-64 z-10">
				<div className="absolute inset-0" />

				<motion.div
					className="relative max-w-5xl mx-auto px-6 text-center"
					initial="initial"
					animate="animate"
					variants={stagger}
				>
					<motion.h1
						className="text-6xl md:text-8xl font-black tracking-tight leading-none"
						variants={fadeInUp}
						style={{ fontFamily: 'Bebas Neue, sans-serif', letterSpacing: '0.02em' }}
					>
						Find Your Missing{' '}
						<span style={{ color: COLORS.primary }}>2 Seconds</span>
					</motion.h1>

					<motion.p
						className="mt-8 max-w-2xl mx-auto text-xl font-light leading-relaxed"
						variants={fadeInUp}
						style={{ fontFamily: 'DM Sans, sans-serif', color: COLORS.text }}
					>
						AI-powered telemetry analysis that compares your driving to{' '}
						<span style={{ color: COLORS.gold }} className="font-semibold">top-split aliens</span>.
						See exactly where you lose time and get corner-specific coaching to climb the iRating ladder.
					</motion.p>

					<motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
						<Link
							to="/register"
							className="glow-button inline-block px-10 py-4 rounded-xl font-bold text-lg transition uppercase tracking-widest relative z-10"
							style={{ 
								backgroundColor: COLORS.primary,
								color: '#000',
								fontFamily: 'DM Sans, sans-serif',
								letterSpacing: '0.1em'
							}}
							onMouseEnter={(e) => {
								e.currentTarget.style.backgroundColor = COLORS.primaryHover
							}}
							onMouseLeave={(e) => {
								e.currentTarget.style.backgroundColor = COLORS.primary
							}}
						>
							Analyze Your First Lap Free
						</Link>
						<Link
							to="#how-it-works"
							className="inline-block px-10 py-4 rounded-xl font-bold text-lg transition uppercase tracking-widest border"
							style={{ 
								borderColor: 'rgba(255, 255, 255, 0.2)',
								color: COLORS.text,
								fontFamily: 'DM Sans, sans-serif',
								letterSpacing: '0.1em'
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
							See How It Works
						</Link>
					</motion.div>

					{/* STATS COUNTERS */}
					<motion.div 
						className="grid grid-cols-3 gap-8 mt-24 max-w-3xl mx-auto"
						variants={fadeInUp}
					>
						<div className="text-center">
							<div 
								className="text-5xl md:text-6xl font-black mb-2"
								style={{ color: COLORS.primary, fontFamily: 'Bebas Neue, sans-serif' }}
							>
								<AnimatedCounter end={52000} suffix="+" />
							</div>
							<div 
								className="text-sm uppercase tracking-wider font-medium"
								style={{ fontFamily: 'DM Sans, sans-serif', color: COLORS.textMuted }}
							>
								iRacers Trust Us
							</div>
						</div>
						<div className="text-center">
							<div 
								className="text-5xl md:text-6xl font-black mb-2"
								style={{ color: COLORS.primary, fontFamily: 'Bebas Neue, sans-serif' }}
							>
								<AnimatedCounter end={2} suffix=".4s" duration={1.5} />
							</div>
							<div 
								className="text-sm uppercase tracking-wider font-medium"
								style={{ fontFamily: 'DM Sans, sans-serif', color: COLORS.textMuted }}
							>
								Avg. Time Gained
							</div>
						</div>
						<div className="text-center">
							<div 
								className="text-5xl md:text-6xl font-black mb-2"
								style={{ color: COLORS.gold, fontFamily: 'Bebas Neue, sans-serif' }}
							>
								<AnimatedCounter end={847} suffix="" duration={1.8} />
							</div>
							<div 
								className="text-sm uppercase tracking-wider font-medium"
								style={{ fontFamily: 'DM Sans, sans-serif', color: COLORS.textMuted }}
							>
								Pro Drivers
							</div>
						</div>
					</motion.div>
				</motion.div>
			</section>

			{/* 4. HOW IT WORKS */}
			<section id="how-it-works" className="py-24 border-t z-10 relative" style={{ borderColor: 'rgba(255, 255, 255, 0.05)' }}>
				<div className="max-w-7xl mx-auto px-6">
					<motion.h2
						className="text-5xl md:text-6xl font-black mb-4 text-center uppercase"
						initial="initial"
						whileInView="whileInView"
						variants={slideInFromSide('left')}
						viewport={{ once: true, amount: 0.3 }}
						style={{ fontFamily: 'Bebas Neue, sans-serif', letterSpacing: '0.02em' }}
					>
						How it Works
					</motion.h2>
					<motion.p
						className="text-center mb-16 max-w-2xl mx-auto"
						initial={{ opacity: 0 }}
						whileInView={{ opacity: 1 }}
						viewport={{ once: true }}
						style={{ color: COLORS.textMuted, fontFamily: 'DM Sans, sans-serif' }}
					>
						From your last session to actionable insights in under 60 seconds
					</motion.p>

					<div className="space-y-24">
						{howItWorksData.map((item, index) => (
							<div key={item.step}>
								<motion.div
									className={`grid md:grid-cols-2 gap-12 items-center ${
										item.direction === 'right' ? 'md:grid-flow-col-reverse' : ''
									}`}
									initial="initial"
									whileInView="whileInView"
									viewport={{ once: true, amount: 0.3 }}
								>
									<motion.div
										variants={slideInFromSide(item.direction)}
										initial="initial"
										whileInView="whileInView"
									>
										<span 
											className="text-8xl font-black block mb-4"
											style={{ 
												color: COLORS.primary,
												opacity: 0.3,
												fontFamily: 'Bebas Neue, sans-serif'
											}}
										>
											0{item.step}
										</span>
										<h3 
											className="text-3xl md:text-4xl font-black mb-6 uppercase"
											style={{ fontFamily: 'Bebas Neue, sans-serif' }}
										>
											{item.title}
										</h3>
										<p 
											className="text-lg leading-relaxed"
											style={{ fontFamily: 'DM Sans, sans-serif', color: COLORS.text }}
										>
											{item.desc}
										</p>
									</motion.div>

									<motion.div
										variants={scaleUp}
										initial="initial"
										whileInView="whileInView"
										viewport={{ once: true, amount: 0.5 }}
										className="carbon-texture rounded-2xl p-1"
									>
										<div 
											className="rounded-xl overflow-hidden"
											style={{ 
												border: '1px solid rgba(255, 107, 0, 0.2)',
												boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5)'
											}}
										>
											<img
												src={item.image}
												alt={item.title}
												className="w-full h-auto"
											/>
										</div>
									</motion.div>
								</motion.div>

								{/* Connection line */}
								{index < howItWorksData.length - 1 && (
									<div className="flex justify-center my-16">
										<motion.div
											className="w-1 h-20 rounded-full relative overflow-hidden"
											style={{ backgroundColor: 'rgba(255, 107, 0, 0.2)' }}
											initial="initial"
											whileInView="whileInView"
											viewport={{ once: true }}
										>
											<motion.div
												className="absolute top-0 left-0 w-full h-10 rounded-full"
												style={{ backgroundColor: COLORS.primary }}
												animate={{
													y: [0, 40, 0],
												}}
												transition={{
													duration: 2,
													repeat: Infinity,
													ease: "easeInOut"
												}}
											/>
										</motion.div>
									</div>
								)}
							</div>
						))}
					</div>
				</div>
			</section>

			{/* 5. KEY FEATURES */}
			<section className="py-24 border-t z-10 relative" style={{ borderColor: 'rgba(255, 255, 255, 0.05)' }}>
				<div className="max-w-7xl mx-auto px-6">
					<motion.h2
						className="text-5xl md:text-6xl font-black mb-4 text-center uppercase"
						initial={{ opacity: 0, y: 50 }}
						whileInView={{
							opacity: 1,
							y: 0,
							transition: {
								duration: 0.6,
								ease: EASE_OUT,
							},
						}}
						viewport={{ once: true, amount: 0.5 }}
						style={{ fontFamily: 'Bebas Neue, sans-serif' }}
					>
						The Competitive Advantage
					</motion.h2>
					<motion.p
						className="text-center mb-16 max-w-2xl mx-auto"
						initial={{ opacity: 0 }}
						whileInView={{ opacity: 1 }}
						viewport={{ once: true }}
						style={{ color: COLORS.textMuted, fontFamily: 'DM Sans, sans-serif' }}
					>
						Professional-grade analysis tools used by top iRacing drivers
					</motion.p>

					<motion.div
						className="grid gap-8 md:grid-cols-3"
						initial="initial"
						whileInView="animate"
						viewport={{ once: true, amount: 0.3 }}
						variants={stagger}
					>
						{featureData.map((feature, i) => (
							<motion.div
								key={i}
								className="rounded-2xl p-8 transition flex flex-col h-full group cursor-pointer carbon-texture"
								variants={fadeInUp}
								style={{
									border: '1px solid rgba(255, 255, 255, 0.05)',
									backgroundColor: 'rgba(26, 26, 26, 0.8)'
								}}
								whileHover={{ 
									y: -8,
									boxShadow: `0 30px 60px rgba(255, 107, 0, 0.15)`
								}}
								onMouseEnter={(e) => e.currentTarget.style.borderColor = `rgba(255, 107, 0, 0.4)`}
								onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.05)'}
							>
								<div 
									className="w-12 h-1 rounded-full mb-6"
									style={{ backgroundColor: COLORS.primary }}
								/>
								<h3 
									className="text-2xl font-black mb-4 uppercase tracking-wide"
									style={{ 
										color: COLORS.text,
										fontFamily: 'Bebas Neue, sans-serif'
									}}
								>
									{feature.title}
								</h3>
								<p 
									className="leading-relaxed"
									style={{ fontFamily: 'DM Sans, sans-serif', color: COLORS.textMuted }}
								>
									{feature.desc}
								</p>
							</motion.div>
						))}
					</motion.div>
				</div>
			</section>

			{/* 6. TESTIMONIALS */}
			<section 
				className="py-24 border-t z-10 relative"
				style={{ 
					borderColor: 'rgba(255, 255, 255, 0.05)',
					backgroundColor: 'rgba(26, 26, 26, 0.3)'
				}}
			>
				<div className="max-w-7xl mx-auto px-6">
					<motion.h2
						className="text-5xl md:text-6xl font-black mb-4 text-center uppercase"
						initial={{ opacity: 0, y: 50 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						style={{ fontFamily: 'Bebas Neue, sans-serif' }}
					>
						What iRacers Say
					</motion.h2>
					<motion.p
						className="text-center mb-16 max-w-2xl mx-auto"
						initial={{ opacity: 0 }}
						whileInView={{ opacity: 1 }}
						viewport={{ once: true }}
						style={{ color: COLORS.textMuted, fontFamily: 'DM Sans, sans-serif' }}
					>
						Join thousands of drivers who've transformed their performance
					</motion.p>

					<div className="grid gap-8 md:grid-cols-3">
						{testimonials.map((testimonial, i) => (
							<motion.div
								key={i}
								className="rounded-2xl p-8 relative carbon-texture"
								style={{
									backgroundColor: 'rgba(26, 26, 26, 0.8)',
									border: '1px solid rgba(255, 255, 255, 0.05)'
								}}
								initial={{ opacity: 0, y: 30 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ delay: i * 0.2 }}
								whileHover={{ borderColor: 'rgba(255, 107, 0, 0.3)' }}
							>
								{/* Improvement Badge */}
								<div 
									className="absolute -top-4 right-6 text-3xl font-black px-4 py-2 rounded-lg"
									style={{ 
										backgroundColor: COLORS.primary, 
										color: '#000',
										fontFamily: 'JetBrains Mono, monospace'
									}}
								>
									{testimonial.improvement}
								</div>

								{/* Quote */}
								<div 
									className="text-6xl mb-4 leading-none"
									style={{ color: COLORS.primary, opacity: 0.3 }}
								>
									"
								</div>
								<p 
									className="mb-8 leading-relaxed"
									style={{ fontFamily: 'DM Sans, sans-serif', color: COLORS.text }}
								>
									{testimonial.quote}
								</p>

								{/* Author Info */}
								<div 
									className="border-t pt-6 flex items-center gap-4"
									style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}
								>
									{/* Avatar */}
									<div 
										className="w-14 h-14 rounded-xl flex items-center justify-center font-bold text-lg"
										style={{ 
											backgroundColor: 'rgba(255, 107, 0, 0.2)',
											color: COLORS.primary,
											fontFamily: 'DM Sans, sans-serif'
										}}
									>
										{testimonial.avatar}
									</div>
									<div className="flex-1">
										<p 
											className="font-bold text-lg"
											style={{ fontFamily: 'DM Sans, sans-serif', color: COLORS.text }}
										>
											{testimonial.author}
										</p>
										<p 
											className="text-sm"
											style={{ color: COLORS.textMuted, fontFamily: 'DM Sans, sans-serif' }}
										>
											{testimonial.role} • {testimonial.series}
										</p>
									</div>
									{/* iRating Badge */}
									<div 
										className="irating-badge px-3 py-1.5 rounded-lg text-sm font-mono"
										title="iRating"
									>
										{testimonial.iRating.toLocaleString()}
									</div>
								</div>
							</motion.div>
						))}
					</div>
				</div>
			</section>

			{/* 7. BEFORE/AFTER COMPARISON */}
			<section className="py-24 border-t z-10 relative" style={{ borderColor: 'rgba(255, 255, 255, 0.05)' }}>
				<div className="max-w-4xl mx-auto px-6">
					<motion.h2
						className="text-5xl md:text-6xl font-black mb-4 text-center uppercase"
						initial={{ opacity: 0, y: 50 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						style={{ fontFamily: 'Bebas Neue, sans-serif' }}
					>
						Your Progress
					</motion.h2>
					<motion.p
						className="text-center mb-16 max-w-2xl mx-auto"
						initial={{ opacity: 0 }}
						whileInView={{ opacity: 1 }}
						viewport={{ once: true }}
						style={{ color: COLORS.textMuted, fontFamily: 'DM Sans, sans-serif' }}
					>
						Real results from real drivers after 30 days with Bolide
					</motion.p>

					<div className="grid md:grid-cols-2 gap-8">
						{/* BEFORE */}
						<motion.div
							className="rounded-2xl p-8"
							style={{
								backgroundColor: 'rgba(220, 38, 38, 0.05)',
								border: '1px solid rgba(220, 38, 38, 0.2)'
							}}
							initial={{ opacity: 0, x: -50 }}
							whileInView={{ opacity: 1, x: 0 }}
							viewport={{ once: true }}
						>
							<div className="text-center mb-8">
								<span 
									className="text-sm uppercase tracking-widest font-bold"
									style={{ color: COLORS.danger, fontFamily: 'DM Sans, sans-serif' }}
								>
									Before Bolide
								</span>
							</div>
							<div className="space-y-6 text-center" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
								<div>
									<div className="text-4xl font-bold" style={{ color: COLORS.danger }}>1:45.302</div>
									<div className="text-sm mt-1" style={{ color: COLORS.textMuted }}>Best Lap Time</div>
								</div>
								<div>
									<div className="text-2xl" style={{ color: COLORS.textMuted }}>±0.8s</div>
									<div className="text-sm mt-1" style={{ color: COLORS.textMuted }}>Consistency Gap</div>
								</div>
								<div>
									<div className="text-2xl" style={{ color: COLORS.textMuted }}>3,200</div>
									<div className="text-sm mt-1" style={{ color: COLORS.textMuted }}>iRating</div>
								</div>
							</div>
						</motion.div>

						{/* AFTER */}
						<motion.div
							className="rounded-2xl p-8 relative overflow-hidden"
							style={{
								backgroundColor: 'rgba(255, 107, 0, 0.05)',
								border: `1px solid rgba(255, 107, 0, 0.3)`
							}}
							initial={{ opacity: 0, x: 50 }}
							whileInView={{ opacity: 1, x: 0 }}
							viewport={{ once: true }}
						>
							<div 
								className="absolute top-4 right-4 px-3 py-1.5 rounded-lg text-sm font-bold"
								style={{ 
									backgroundColor: COLORS.primary,
									color: '#000',
									fontFamily: 'JetBrains Mono, monospace'
								}}
							>
								-2.4s
							</div>
							<div className="text-center mb-8">
								<span 
									className="text-sm uppercase tracking-widest font-bold"
									style={{ 
										color: COLORS.primary,
										fontFamily: 'DM Sans, sans-serif'
									}}
								>
									After Bolide
								</span>
							</div>
							<div className="space-y-6 text-center" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
								<div>
									<div 
										className="text-4xl font-bold"
										style={{ color: COLORS.primary }}
									>
										1:42.891
									</div>
									<div className="text-sm mt-1" style={{ color: COLORS.textMuted }}>Best Lap Time</div>
								</div>
								<div>
									<div className="text-2xl" style={{ color: COLORS.text }}>±0.15s</div>
									<div className="text-sm mt-1" style={{ color: COLORS.textMuted }}>Consistency Gap</div>
								</div>
								<div>
									<div className="text-2xl" style={{ color: COLORS.gold }}>4,100</div>
									<div className="text-sm mt-1" style={{ color: COLORS.textMuted }}>iRating (+900)</div>
								</div>
							</div>
						</motion.div>
					</div>
				</div>
			</section>

			{/* 8. CTA BOTTOM */}
			<section 
				className="py-32 border-t text-center z-10 relative"
				style={{ 
					borderColor: 'rgba(255, 107, 0, 0.2)',
					background: 'linear-gradient(180deg, transparent 0%, rgba(255, 107, 0, 0.05) 100%)'
				}}
			>
				<motion.div
					className="max-w-4xl mx-auto px-6"
					initial={{ opacity: 0, scale: 0.9 }}
					whileInView={{ opacity: 1, scale: 1 }}
					viewport={{ once: true, amount: 0.5 }}
					transition={{ duration: 0.7 }}
				>
					<h2 
						className="text-5xl md:text-7xl font-black mb-6 uppercase"
						style={{ fontFamily: 'Bebas Neue, sans-serif' }}
					>
						Ready to Find Your{' '}
						<span style={{ color: COLORS.primary }}>Missing Seconds</span>?
					</h2>
					<p 
						className="text-xl mb-12 max-w-2xl mx-auto"
						style={{ fontFamily: 'DM Sans, sans-serif', color: COLORS.textMuted }}
					>
						Join 52,000+ sim racers who stopped guessing and started winning.
						First lap analysis is free — no credit card required.
					</p>
					<Link
						to="/register"
						className="glow-button inline-block px-16 py-6 rounded-2xl font-bold text-xl transition uppercase tracking-widest relative z-10"
						style={{ 
							backgroundColor: COLORS.primary,
							color: '#000',
							fontFamily: 'DM Sans, sans-serif',
							letterSpacing: '0.15em'
						}}
						onMouseEnter={(e) => {
							e.currentTarget.style.backgroundColor = COLORS.primaryHover
						}}
						onMouseLeave={(e) => {
							e.currentTarget.style.backgroundColor = COLORS.primary
						}}
					>
						Start Winning Now
					</Link>
				</motion.div>
			</section>

			{/* 9. FOOTER */}
			<footer 
				className="py-12 border-t text-center z-10 relative"
				style={{ 
					borderColor: 'rgba(255, 255, 255, 0.05)',
					fontFamily: 'DM Sans, sans-serif'
				}}
			>
				<div className="max-w-7xl mx-auto px-6">
					<div className="flex flex-col md:flex-row justify-between items-center gap-6">
						<div 
							className="text-2xl font-black tracking-wider"
							style={{ 
								color: COLORS.primary,
								fontFamily: 'Michroma, sans-serif'
							}}
						>
							BOLIDE
						</div>
						<div 
							className="flex items-center gap-2 text-sm"
							style={{ color: COLORS.textMuted }}
						>
							<span>🏁</span>
							<span>Built for iRacing</span>
							<span className="mx-2">•</span>
							<span>© 2025 Bolide</span>
						</div>
						<div className="flex gap-6 text-sm" style={{ color: COLORS.textMuted }}>
							<a href="#" className="hover:text-white transition">Privacy</a>
							<a href="#" className="hover:text-white transition">Terms</a>
							<a href="#" className="hover:text-white transition">Discord</a>
						</div>
					</div>
				</div>
			</footer>
		</div>
	)
}

export default LandingPage