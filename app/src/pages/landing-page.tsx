// src/pages/landing-page.tsx

import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import type { Variants } from 'framer-motion'
import AnimatedCarIntro from '../components/AnimatedCarIntro'

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
	icon: string
}

interface TestimonialItem {
	quote: string
	author: string
	role: string
	improvement: string
}

interface LiveActivityItem {
	user: string
	action: string
	track: string
	time: string
}
// =============================

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
	const [currentActivityIndex, setCurrentActivityIndex] = useState(0)

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

	// Live activity feed rotation
	useEffect(() => {
		const interval = setInterval(() => {
			setCurrentActivityIndex((prev) => (prev + 1) % liveActivities.length)
		}, 3000)
		return () => clearInterval(interval)
	}, [])

	// --- DANE DLA SEKCJI HOW IT WORKS ---
	const howItWorksData: HowItWorksItem[] = [
		{
			step: 1,
			title: 'Data Sync & Upload',
			desc: 'Seamlessly integrate your iRacing telemetry files. Our platform handles the complex data processing, allowing you to focus purely on driving and analysis.',
			image: '/images/core-feature-1.png',
			direction: 'left',
		},
		{
			step: 2,
			title: 'Deep Analysis Engine',
			desc: 'Our proprietary engine compares your driving against ideal benchmarks, highlighting micro-differences in braking points, throttle application, and steering angle.',
			image: '/images/core-feature-2.png',
			direction: 'right',
		},
		{
			step: 3,
			title: 'Actionable Recommendations',
			desc: 'Receive immediate, easy-to-understand recommendations on where you can gain time, including setup tweaks and driving line adjustments.',
			image: '/images/core-feature-3.png',
			direction: 'left',
		},
	]

	// --- DANE DLA SEKCJI KEY INSIGHTS ---
	const featureData: FeatureItem[] = [
		{
			icon: '⚡',
			title: 'Dynamic Lap Delta',
			desc: 'See exactly where you gain or lose time against your target, sector by sector, turn by turn. This is the difference between fast and fastest.',
		},
		{
			icon: '📊',
			title: 'Optimal Inputs Mapping',
			desc: 'Detailed charts for steering, throttle, and brake input overlays show where you are too aggressive or too timid compared to pro drivers.',
		},
		{
			icon: '✅',
			title: 'Live Setup Validation',
			desc: 'Evaluate the effectiveness of your setup changes instantly, using tire temps, pressures, and suspension data after every run.',
		},
	]

	// --- TESTIMONIALS ---
	const testimonials: TestimonialItem[] = [
		{
			quote: "Shaved 3 seconds off my lap time in just one week! The AI insights are incredible.",
			author: "John Davis",
			role: "iRacing Pro",
			improvement: "-3.2s"
		},
		{
			quote: "Finally consistent laptimes. Bolide showed me exactly where I was losing time.",
			author: "Sarah Chen",
			role: "GT3 Specialist",
			improvement: "-2.8s"
		},
		{
			quote: "Game changer for setup optimization. My tire temps are perfect now.",
			author: "Mike Rodriguez",
			role: "Endurance Racer",
			improvement: "-1.9s"
		}
	]

	// --- LIVE ACTIVITIES ---
	const liveActivities: LiveActivityItem[] = [
		{ user: "Alex M.", action: "just set new PB at", track: "Monza", time: "1:47.203" },
		{ user: "Sarah K.", action: "improved by 1.2s at", track: "Spa-Francorchamps", time: "2:17.891" },
		{ user: "Mike T.", action: "unlocked achievement", track: "Master of Eau Rouge", time: "" },
		{ user: "Emma L.", action: "completed analysis at", track: "Silverstone", time: "1:56.445" },
	]

	return (
		<div className="bg-neutral-950 text-white overflow-x-hidden min-h-screen relative">
			{/* Google Fonts - Dodane na górze */}
			<style>{`
				@import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@300;400;500;600;700&family=Space+Grotesk:wght@300;400;500;600;700&family=Michroma&family=Orbitron:wght@400;500;600;700;800;900&display=swap');
				
				@keyframes gradientShift {
					0%, 100% { background-position: 0% 50%; }
					50% { background-position: 100% 50%; }
				}

				@keyframes slideUp {
					from { transform: translateY(0); opacity: 1; }
					to { transform: translateY(-20px); opacity: 0; }
				}

				.gradient-bg {
					background: linear-gradient(135deg, #000000 0%, #0a0a0a 50%, #000000 100%);
					background-size: 200% 200%;
					animation: gradientShift 15s ease infinite;
				}

				.glow-button {
					position: relative;
					overflow: hidden;
				}

				.glow-button::before {
					content: '';
					position: absolute;
					inset: 0;
					background: #bffa76;
					filter: blur(20px);
					opacity: 0.3;
					z-index: -1;
					transition: opacity 0.3s;
				}

				.glow-button:hover::before {
					opacity: 0.6;
				}
			`}</style>

			{/* SCROLL PROGRESS BAR */}
			<div className="fixed top-0 left-0 w-full h-1 bg-neutral-900 z-[60]">
				<div 
					className="h-full transition-all duration-300"
					style={{ 
						width: `${scrollProgress}%`,
						background: 'linear-gradient(90deg, #bffa76 0%, #aae965 100%)'
					}}
				/>
			</div>

			{/* 🏎️ Animacja samochodu (WIDEO) - Z-index: 0 */}
			<AnimatedCarIntro />

			{/* 1. HEADER - Z-index: 50 */}
			<motion.header
				className="sticky top-0 z-50 bg-neutral-950/80 backdrop-blur border-b border-white/10"
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
			>
				<div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
					<Link
						to="/"
						className="text-2xl font-black tracking-wider"
						style={{ 
							color: '#bffa76',
							fontFamily: 'Michroma, sans-serif',
							letterSpacing: '0.15em'
						}}
					>
						BOLIDE
					</Link>

					<nav className="flex gap-4 md:gap-8 text-sm items-center" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
						<Link 
							to="/login" 
							className="transition font-medium"
							style={{ color: 'rgb(209 213 219)' }}
							onMouseEnter={(e) => e.currentTarget.style.color = '#bffa76'}
							onMouseLeave={(e) => e.currentTarget.style.color = 'rgb(209 213 219)'}
						>
							Log in
						</Link>
						<Link
							to="/register"
							className="px-4 py-2 rounded-lg text-black font-semibold transition"
							style={{ backgroundColor: '#bffa76' }}
							onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#aae965'}
							onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#bffa76'}
						>
							Start Free
						</Link>
						<Link
							to="/dashboard"
							className="px-8 py-4 text-black font-bold rounded-full transition"
							style={{ backgroundColor: '#bffa76' }}
							onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#aae965'}
							onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#bffa76'}
						>
							Go to Dashboard
						</Link>
					</nav>
				</div>
			</motion.header>

			{/* 2. HERO SECTION - Z-index: 10 */}
			<section className="relative overflow-hidden pt-32 pb-48 md:pt-48 md:pb-64 z-10">
				<div className="absolute inset-0" />

				<motion.div
					className="relative max-w-4xl mx-auto px-6 text-center"
					initial="initial"
					animate="animate"
					variants={stagger}
				>
					<motion.h1
						className="text-5xl md:text-7xl font-black tracking-tight"
						variants={fadeInUp}
						style={{ fontFamily: 'Rajdhani, sans-serif', letterSpacing: '-0.02em' }}
					>
						Data-Driven Performance.{' '}
						<span style={{ color: '#bffa76' }}>Instant</span> Gains.
					</motion.h1>

					<motion.p
						className="mt-6 max-w-2xl mx-auto text-gray-300 text-xl font-light"
						variants={fadeInUp}
						style={{ fontFamily: 'Space Grotesk, sans-serif', lineHeight: '1.7' }}
					>
						The ultimate platform for sim racers to transform raw telemetry into
						instant, actionable insights. Master every corner and every setup.
					</motion.p>

					<motion.div variants={fadeInUp}>
						<Link
							to="/register"
							className="glow-button inline-block mt-12 px-10 py-4 rounded-xl text-black font-bold text-lg transition shadow-lg uppercase tracking-widest relative z-10"
							style={{ 
								backgroundColor: '#bffa76',
								boxShadow: '0 10px 40px rgba(191, 250, 118, 0.2)',
								fontFamily: 'Rajdhani, sans-serif',
								letterSpacing: '0.1em'
							}}
							onMouseEnter={(e) => {
								e.currentTarget.style.backgroundColor = '#aae965'
								e.currentTarget.style.boxShadow = '0 10px 40px rgba(170, 233, 101, 0.3)'
							}}
							onMouseLeave={(e) => {
								e.currentTarget.style.backgroundColor = '#bffa76'
								e.currentTarget.style.boxShadow = '0 10px 40px rgba(191, 250, 118, 0.2)'
							}}
						>
							Start Your Free Trial
						</Link>
					</motion.div>

					{/* STATS COUNTERS */}
					<motion.div 
						className="grid grid-cols-3 gap-8 mt-20 max-w-3xl mx-auto"
						variants={fadeInUp}
					>
						<div className="text-center">
							<div 
								className="text-4xl md:text-5xl font-black mb-2"
								style={{ color: '#bffa76', fontFamily: 'Rajdhani, sans-serif' }}
							>
								<AnimatedCounter end={52000} suffix="+" />
							</div>
							<div 
								className="text-sm text-gray-400 uppercase tracking-wider"
								style={{ fontFamily: 'Space Grotesk, sans-serif' }}
							>
								Sim Racers
							</div>
						</div>
						<div className="text-center">
							<div 
								className="text-4xl md:text-5xl font-black mb-2"
								style={{ color: '#bffa76', fontFamily: 'Rajdhani, sans-serif' }}
							>
								<AnimatedCounter end={2} suffix=".4s" duration={1.5} />
							</div>
							<div 
								className="text-sm text-gray-400 uppercase tracking-wider"
								style={{ fontFamily: 'Space Grotesk, sans-serif' }}
							>
								Avg Time Saved
							</div>
						</div>
						<div className="text-center">
							<div 
								className="text-4xl md:text-5xl font-black mb-2"
								style={{ color: '#bffa76', fontFamily: 'Rajdhani, sans-serif' }}
							>
								<AnimatedCounter end={94} suffix="%" duration={1.8} />
							</div>
							<div 
								className="text-sm text-gray-400 uppercase tracking-wider"
								style={{ fontFamily: 'Space Grotesk, sans-serif' }}
							>
								Success Rate
							</div>
						</div>
					</motion.div>
				</motion.div>
			</section>

			{/* 3. HOW IT WORKS */}
			<section className="py-24 border-t border-white/10 z-10 relative">
				<div className="max-w-7xl mx-auto px-6">
					<motion.h2
						className="text-4xl font-bold mb-16 text-center uppercase tracking-wide"
						initial="initial"
						whileInView="whileInView"
						variants={slideInFromSide('left')}
						viewport={{ once: true, amount: 0.3 }}
						style={{ fontFamily: 'Rajdhani, sans-serif', letterSpacing: '0.05em' }}
					>
						How it Works
					</motion.h2>

					<div className="space-y-20">
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
											className="text-7xl font-black block mb-4 opacity-30"
											style={{ 
												color: '#bffa76',
												fontFamily: 'Michroma, sans-serif'
											}}
										>
											{item.step}
										</span>
										<h3 
											className="text-3xl font-bold mb-4"
											style={{ fontFamily: 'Rajdhani, sans-serif' }}
										>
											{item.title}
										</h3>
										<p 
											className="text-gray-400 text-lg leading-relaxed"
											style={{ fontFamily: 'Space Grotesk, sans-serif' }}
										>
											{item.desc}
										</p>
									</motion.div>

									<motion.div
										variants={scaleUp}
										initial="initial"
										whileInView="whileInView"
										viewport={{ once: true, amount: 0.5 }}
									>
										<img
											src={item.image}
											alt={item.title}
											className="rounded-xl border border-white/10 shadow-lg"
										/>
									</motion.div>
								</motion.div>

								{/* Animated connection line */}
								{index < howItWorksData.length - 1 && (
									<div className="flex justify-center my-12">
										<motion.div
											className="w-1 h-16 rounded-full relative overflow-hidden"
											style={{ backgroundColor: 'rgba(191, 250, 118, 0.2)' }}
											initial="initial"
											whileInView="whileInView"
											viewport={{ once: true }}
										>
											<motion.div
												className="absolute top-0 left-0 w-full h-8 rounded-full"
												style={{ backgroundColor: '#bffa76' }}
												animate={{
													y: [0, 32, 0],
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

			{/* 4. KEY INSIGHTS */}
			<section className="py-24 border-t border-white/10 z-10 relative">
				<div className="max-w-7xl mx-auto px-6">
					<motion.h2
						className="text-4xl font-bold mb-16 text-center uppercase tracking-wide"
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
						style={{ fontFamily: 'Rajdhani, sans-serif', letterSpacing: '0.05em' }}
					>
						The Competitive Advantage
					</motion.h2>

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
								className="rounded-xl bg-neutral-900 p-6 transition flex flex-col h-full group cursor-pointer"
								variants={fadeInUp}
								style={{
									border: '1px solid rgba(255, 255, 255, 0.1)'
								}}
								whileHover={{ 
									y: -8,
									boxShadow: '0 20px 40px rgba(191, 250, 118, 0.1)'
								}}
								onMouseEnter={(e) => e.currentTarget.style.borderColor = 'rgba(191, 250, 118, 0.4)'}
								onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
							>
								<div className="text-4xl mb-4">{feature.icon}</div>
								<h3 
									className="text-xl font-bold mb-3 uppercase tracking-wide"
									style={{ 
										color: '#bffa76',
										fontFamily: 'Rajdhani, sans-serif'
									}}
								>
									{feature.title}
								</h3>
								<p 
									className="text-gray-400 leading-relaxed"
									style={{ fontFamily: 'Space Grotesk, sans-serif' }}
								>
									{feature.desc}
								</p>
							</motion.div>
						))}
					</motion.div>
				</div>
			</section>

			{/* 5. TESTIMONIALS */}
			<section className="py-24 border-t border-white/10 z-10 relative bg-neutral-900/20">
				<div className="max-w-7xl mx-auto px-6">
					<motion.h2
						className="text-4xl font-bold mb-16 text-center uppercase tracking-wide"
						initial={{ opacity: 0, y: 50 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						style={{ fontFamily: 'Rajdhani, sans-serif' }}
					>
						What Racers Say
					</motion.h2>

					<div className="grid gap-8 md:grid-cols-3">
						{testimonials.map((testimonial, i) => (
							<motion.div
								key={i}
								className="bg-neutral-900/50 border border-white/10 rounded-xl p-6 relative"
								initial={{ opacity: 0, y: 30 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ delay: i * 0.2 }}
							>
								<div 
									className="absolute -top-4 right-4 text-4xl font-black px-3 py-1 rounded-lg"
									style={{ 
										backgroundColor: '#bffa76', 
										color: '#000',
										fontFamily: 'Rajdhani, sans-serif'
									}}
								>
									{testimonial.improvement}
								</div>
								<div className="text-5xl mb-4 opacity-20">"</div>
								<p 
									className="text-gray-300 mb-6 italic"
									style={{ fontFamily: 'Space Grotesk, sans-serif' }}
								>
									{testimonial.quote}
								</p>
								<div className="border-t border-white/10 pt-4">
									<p 
										className="font-bold text-white"
										style={{ fontFamily: 'Rajdhani, sans-serif' }}
									>
										{testimonial.author}
									</p>
									<p className="text-sm text-gray-500">{testimonial.role}</p>
								</div>
							</motion.div>
						))}
					</div>
				</div>
			</section>

			{/* 6. BEFORE/AFTER COMPARISON */}
			<section className="py-24 border-t border-white/10 z-10 relative">
				<div className="max-w-4xl mx-auto px-6">
					<motion.h2
						className="text-4xl font-bold mb-16 text-center uppercase tracking-wide"
						initial={{ opacity: 0, y: 50 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						style={{ fontFamily: 'Rajdhani, sans-serif' }}
					>
						Your Progress
					</motion.h2>

					<div className="grid md:grid-cols-2 gap-8">
						{/* BEFORE */}
						<motion.div
							className="bg-red-900/10 border border-red-500/20 rounded-xl p-8"
							initial={{ opacity: 0, x: -50 }}
							whileInView={{ opacity: 1, x: 0 }}
							viewport={{ once: true }}
						>
							<div className="text-center mb-6">
								<span 
									className="text-sm uppercase tracking-wider text-red-400 font-bold"
									style={{ fontFamily: 'Rajdhani, sans-serif' }}
								>
									Before Bolide
								</span>
							</div>
							<div className="space-y-4 text-center" style={{ fontFamily: 'Space Mono, monospace' }}>
								<div>
									<div className="text-3xl font-bold text-red-400">1:45.302</div>
									<div className="text-sm text-gray-500">Lap Time</div>
								</div>
								<div>
									<div className="text-xl text-gray-400">±0.8s</div>
									<div className="text-sm text-gray-500">Consistency</div>
								</div>
								<div>
									<div className="text-xl text-gray-400">Guessing</div>
									<div className="text-sm text-gray-500">Setup Approach</div>
								</div>
							</div>
						</motion.div>

						{/* AFTER */}
						<motion.div
							className="bg-green-900/10 border rounded-xl p-8 relative overflow-hidden"
							style={{ borderColor: 'rgba(191, 250, 118, 0.3)' }}
							initial={{ opacity: 0, x: 50 }}
							whileInView={{ opacity: 1, x: 0 }}
							viewport={{ once: true }}
						>
							<div 
								className="absolute top-4 right-4 px-3 py-1 rounded-lg text-xs font-bold"
								style={{ 
									backgroundColor: '#bffa76',
									color: '#000'
								}}
							>
								-2.4s
							</div>
							<div className="text-center mb-6">
								<span 
									className="text-sm uppercase tracking-wider font-bold"
									style={{ 
										color: '#bffa76',
										fontFamily: 'Rajdhani, sans-serif'
									}}
								>
									After Bolide
								</span>
							</div>
							<div className="space-y-4 text-center" style={{ fontFamily: 'Space Mono, monospace' }}>
								<div>
									<div 
										className="text-3xl font-bold"
										style={{ color: '#bffa76' }}
									>
										1:42.891
									</div>
									<div className="text-sm text-gray-500">Lap Time</div>
								</div>
								<div>
									<div className="text-xl text-white">±0.1s</div>
									<div className="text-sm text-gray-500">Consistency</div>
								</div>
								<div>
									<div className="text-xl text-white">Data-Driven</div>
									<div className="text-sm text-gray-500">Setup Approach</div>
								</div>
							</div>
						</motion.div>
					</div>
				</div>
			</section>

			{/* 7. CTA BOTTOM */}
			<section className="py-24 border-t border-white/10 text-center z-10 relative">
				<motion.div
					className="max-w-4xl mx-auto px-6"
					initial={{ opacity: 0, scale: 0.8 }}
					whileInView={{ opacity: 1, scale: 1 }}
					viewport={{ once: true, amount: 0.5 }}
					transition={{ duration: 0.7 }}
				>
					<h2 
						className="text-4xl font-black mb-6"
						style={{ fontFamily: 'Rajdhani, sans-serif' }}
					>
						Ready to Shave Off Seconds?
					</h2>
					<p 
						className="text-lg text-gray-400 mb-10 font-light"
						style={{ fontFamily: 'Space Grotesk, sans-serif' }}
					>
						Join thousands of sim racers who use Bolide to stop guessing and
						start dominating.
					</p>
					<Link
						to="/register"
						className="glow-button inline-block px-14 py-5 rounded-2xl text-black font-bold text-lg transition shadow-xl uppercase tracking-widest relative z-10"
						style={{ 
							backgroundColor: '#bffa76',
							boxShadow: '0 25px 50px rgba(191, 250, 118, 0.3)',
							fontFamily: 'Rajdhani, sans-serif',
							letterSpacing: '0.15em'
						}}
						onMouseEnter={(e) => {
							e.currentTarget.style.backgroundColor = '#aae965'
							e.currentTarget.style.boxShadow = '0 25px 50px rgba(170, 233, 101, 0.4)'
						}}
						onMouseLeave={(e) => {
							e.currentTarget.style.backgroundColor = '#bffa76'
							e.currentTarget.style.boxShadow = '0 25px 50px rgba(191, 250, 118, 0.3)'
						}}
					>
						DOMINATE IRACING NOW
					</Link>
				</motion.div>
			</section>

			{/* 8. FOOTER */}
			<footer 
				className="py-8 border-t border-white/10 text-center text-gray-500 text-sm z-10 relative"
				style={{ fontFamily: 'Space Grotesk, sans-serif' }}
			>
				© 2025 Bolide. Built for speed.
			</footer>
		</div>
	)
}

export default LandingPage