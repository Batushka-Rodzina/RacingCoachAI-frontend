// src/pages/landing-page.tsx

import React from 'react'
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
}
// =============================

// Prawidłowa definicja łagodzenia 'easeOut' (Bézier curve)
const EASE_OUT: [number, number, number, number] = [0, 0, 0.58, 1]

// --- Warianty Animacji Framer Motion ---

const fadeInUp: Variants = {
	initial: { y: 60, opacity: 0 },
	animate: { y: 0, opacity: 1, transition: { duration: 0.6 } },
}

// Wariant dla tekstu wjeżdżającego z boku
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

// Wariant skalowania elementu przy wejściu
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

const LandingPage: React.FC = () => {
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
			title: 'Dynamic Lap Delta',
			desc: 'See exactly where you gain or lose time against your target, sector by sector, turn by turn. This is the difference between fast and fastest.',
		},
		{
			title: 'Optimal Inputs Mapping',
			desc: 'Detailed charts for steering, throttle, and brake input overlays show where you are too aggressive or too timid compared to pro drivers.',
		},
		{
			title: 'Live Setup Validation',
			desc: 'Evaluate the effectiveness of your setup changes instantly, using tire temps, pressures, and suspension data after every run.',
		},
	]

	return (
		<div className="bg-neutral-950 text-white overflow-x-hidden min-h-screen relative">
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
						className="font-orbitron text-xl font-bold"
						style={{ color: '#bffa76' }}
					>
						Bolide
					</Link>

					<nav className="flex gap-4 md:gap-8 text-sm text-gray-300 items-center">
						<Link 
							to="/login" 
							className="transition"
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
						className="text-5xl md:text-7xl font-extrabold tracking-tight"
						variants={fadeInUp}
					>
						Data-Driven Performance.{' '}
						<span style={{ color: '#bffa76' }}>Instant</span> Gains.
					</motion.h1>

					<motion.p
						className="mt-6 max-w-2xl mx-auto text-gray-300 text-xl"
						variants={fadeInUp}
					>
						The ultimate platform for sim racers to transform raw telemetry into
						instant, actionable insights. Master every corner and every setup.
					</motion.p>

					<motion.div variants={fadeInUp}>
						<Link
							to="/register"
							className="inline-block mt-12 px-10 py-4 rounded-xl text-black font-semibold text-lg transition shadow-lg"
							style={{ 
								backgroundColor: '#bffa76',
								boxShadow: '0 10px 40px rgba(191, 250, 118, 0.2)'
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
				</motion.div>
			</section>

			{/* 3. HOW IT WORKS */}
			<section className="py-24 border-t border-white/10 z-10 relative">
				<div className="max-w-7xl mx-auto px-6">
					<motion.h2
						className="text-4xl font-bold mb-16 text-center"
						initial="initial"
						whileInView="whileInView"
						variants={slideInFromSide('left')}
						viewport={{ once: true, amount: 0.3 }}
					>
						How it Works
					</motion.h2>

					<div className="space-y-20">
						{howItWorksData.map((item) => (
							<motion.div
								key={item.step}
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
										className="text-5xl font-extrabold block mb-4 opacity-50"
										style={{ color: '#bffa76' }}
									>
										{item.step}
									</span>
									<h3 className="text-3xl font-bold mb-4">{item.title}</h3>
									<p className="text-gray-400 text-lg">{item.desc}</p>
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
						))}
					</div>
				</div>
			</section>

			{/* 4. KEY INSIGHTS */}
			<section className="py-24 border-t border-white/10 z-10 relative">
				<div className="max-w-7xl mx-auto px-6">
					<motion.h2
						className="text-3xl font-bold mb-16 text-center"
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
								className="rounded-xl bg-neutral-900 p-6 transition flex flex-col h-full"
								variants={fadeInUp}
								style={{
									border: '1px solid rgba(255, 255, 255, 0.1)'
								}}
								onMouseEnter={(e) => e.currentTarget.style.border = '1px solid rgba(191, 250, 118, 0.4)'}
								onMouseLeave={(e) => e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.1)'}
							>
								<h3 
									className="text-xl font-semibold mb-3"
									style={{ color: '#bffa76' }}
								>
									{feature.title}
								</h3>
								<p className="text-gray-400">{feature.desc}</p>
							</motion.div>
						))}
					</motion.div>
				</div>
			</section>

			{/* 5. CTA BOTTOM */}
			<section className="py-24 border-t border-white/10 text-center z-10 relative">
				<motion.div
					className="max-w-4xl mx-auto px-6"
					initial={{ opacity: 0, scale: 0.8 }}
					whileInView={{ opacity: 1, scale: 1 }}
					viewport={{ once: true, amount: 0.5 }}
					transition={{ duration: 0.7 }}
				>
					<h2 className="text-4xl font-extrabold mb-6">
						Ready to Shave Off Seconds?
					</h2>
					<p className="text-lg text-gray-400 mb-10">
						Join thousands of sim racers who use Bolide to stop guessing and
						start dominating.
					</p>
					<Link
						to="/register"
						className="inline-block px-14 py-5 rounded-2xl text-black font-bold text-lg transition shadow-xl"
						style={{ 
							backgroundColor: '#bffa76',
							boxShadow: '0 25px 50px rgba(191, 250, 118, 0.3)'
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

			{/* 6. FOOTER */}
			<footer className="py-8 border-t border-white/10 text-center text-gray-500 text-sm z-10 relative">
				© 2025 Bolide. Built for speed.
			</footer>
		</div>
	)
}

export default LandingPage