const LandingPage: React.FC = () => {
	return (
		<div className="bg-neutral-950 text-white font-sans">
			<header className="sticky top-0 z-50 bg-neutral-950/80 backdrop-blur border-b border-white/10">
				<div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
					<span className="font-orbitron text-xl font-bold text-cyan-400">
						Race Analyzer Pro
					</span>

					<nav className="hidden md:flex gap-8 text-sm text-gray-300">
						<a href="#" className="hover:text-white">
							Dashboard
						</a>
						<a href="#" className="hover:text-white">
							Profile
						</a>
						<a href="#" className="hover:text-white">
							Setups
						</a>
						<a href="#" className="hover:text-white">
							Community
						</a>
					</nav>
				</div>
			</header>

			<section className="relative overflow-hidden">
				<img
					src="/images/ferrari.png"
					alt="Ferrari racing background"
					loading="lazy"
					className="absolute inset-0 w-full h-full object-cover"
				/>

				<div className="absolute inset-0 bg-linear-to-b from-cyan-500/20 via-black/40 to-black/80" />

				<div className="relative max-w-7xl mx-auto px-6 py-32 text-center">
					<h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
						Race Analyzer <span className="text-cyan-400">Pro</span>
					</h1>

					<p className="mt-6 max-w-2xl mx-auto text-gray-300 text-lg">
						The most powerful telemetry analysis platform built for iRacing sim
						racers.
					</p>

					<a
						href="#"
						className="inline-block mt-10 px-10 py-4 rounded-xl bg-cyan-500 text-black font-semibold hover:bg-cyan-400 transition"
					>
						Start Analyzing for Free
					</a>
				</div>
			</section>

			<section className="py-24 border-t border-white/10">
				<div className="max-w-7xl mx-auto px-6">
					<h2 className="text-3xl font-bold mb-12 text-center">
						✨ Core Features
					</h2>

					<div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
						{[
							{
								title: 'Deep Telemetry Analysis',
								desc: 'Compare your laps with the ideal lap and identify exactly where time is lost.',
								src: '/images/core-feature-1.png',
							},
							{
								title: 'Advanced Charts & Visuals',
								desc: 'Clear charts for speed, braking, throttle and steering input.',
								src: '/images/core-feature-2.png',
							},
							{
								title: 'Sector-Based Analysis',
								desc: 'Split the track into sectors and discover optimal braking points.',
								src: '/images/core-feature-3.png',
							},
						].map((f, i) => (
							<div
								key={i}
								className="rounded-2xl bg-neutral-900 border border-white/10 p-6 hover:border-cyan-400/40 transition"
							>
								<h3 className="text-xl font-semibold mb-3">{f.title}</h3>
								<p className="text-gray-400 mb-4">{f.desc}</p>
								<img
									src={f.src}
									className="rounded-lg h-50 w-full"
									alt="feature preview"
								/>
							</div>
						))}
					</div>
				</div>
			</section>

			<section className="py-24 bg-neutral-900/40 border-t border-white/10">
				<div className="max-w-7xl mx-auto px-6 grid gap-12 lg:grid-cols-2">
					<div>
						<h2 className="text-3xl font-bold mb-4">📊 Visual Advantage</h2>
						<p className="text-gray-400 mb-6">
							See your racing line, braking points and acceleration zones
							directly on a 2D track map.
						</p>
						<img
							src="/images/brake-points.png"
							className="rounded-xl"
							alt="track map"
						/>
					</div>

					<div className="rounded-2xl bg-neutral-900 border border-white/10 p-8">
						<h3 className="text-xl font-semibold mb-4">Tire Statistics</h3>
						<p className="text-gray-400 mb-6">
							Analyze tire temperatures and wear to optimize setup and driving
							style.
						</p>

						<div className="space-y-4 text-sm">
							<div>
								<p className="text-gray-300">Front Left</p>
								<div className="h-2 bg-neutral-800 rounded">
									<div className="h-2 bg-red-500 rounded w-[80%]" />
								</div>
								<p className="text-gray-500">Temp: 98°C | Wear: 14%</p>
							</div>

							<div>
								<p className="text-gray-300">Front Right</p>
								<div className="h-2 bg-neutral-800 rounded">
									<div className="h-2 bg-green-500 rounded w-[65%]" />
								</div>
								<p className="text-gray-500">Temp: 91°C | Wear: 8%</p>
							</div>
						</div>

						<p className="mt-6 text-yellow-400 text-sm">
							⚠ Recommendation: Front-left tire overheating. Adjust camber or
							reduce pressure.
						</p>
					</div>
				</div>
			</section>

			<section className="py-24 border-t border-white/10">
				<div className="max-w-7xl mx-auto px-6">
					<h2 className="text-3xl font-bold mb-12 text-center">
						🔬 Racing Line Analysis
					</h2>

					<div className="grid gap-8 md:grid-cols-3">
						{[
							{
								title: 'Optimal Braking Points',
								desc: 'Late braking detected in Turn 5. Potential gain: 0.150s.',
							},
							{
								title: 'Throttle Input',
								desc: 'Too aggressive throttle in Turn 9 causing oversteer.',
							},
							{
								title: 'Steering Efficiency',
								desc: 'Excessive steering corrections in high-speed sections.',
							},
						].map((c, i) => (
							<div
								key={i}
								className="rounded-xl bg-neutral-900 border border-white/10 p-6"
							>
								<h3 className="font-semibold mb-3">{c.title}</h3>
								<p className="text-gray-400">{c.desc}</p>
							</div>
						))}
					</div>
				</div>
			</section>

			<section className="py-24 bg-neutral-900/40 border-t border-white/10">
				<div className="max-w-5xl mx-auto px-6">
					<h2 className="text-3xl font-bold mb-12 text-center">
						🗣 What Fast Drivers Say
					</h2>

					<div className="grid gap-8 md:grid-cols-2">
						<blockquote className="bg-neutral-900 border border-white/10 p-6 rounded-xl">
							“My lap times improved by 0.5s instantly. Best telemetry tool I’ve
							ever used.”
							<footer className="mt-4 text-sm text-gray-400">— iRacerPL</footer>
						</blockquote>

						<blockquote className="bg-neutral-900 border border-white/10 p-6 rounded-xl">
							“Clean UI, insane insights. Perfect for finding milliseconds.”
							<footer className="mt-4 text-sm text-gray-400">
								— SpeedyAnn
							</footer>
						</blockquote>
					</div>
				</div>
			</section>

			<section className="py-32 text-center border-t border-white/10">
				<h2 className="text-4xl font-extrabold mb-10">
					🚀 Start in 3 Simple Steps
				</h2>

				<div className="max-w-6xl mx-auto px-6 grid gap-8 md:grid-cols-3 mb-12">
					{[
						'Create a free account',
						'Sync telemetry from iRacing',
						'Analyze and improve instantly',
					].map((s, i) => (
						<div
							key={i}
							className="bg-neutral-900 border border-white/10 p-6 rounded-xl hover:border-cyan-400/40 transition"
						>
							<span className="text-cyan-400 text-2xl font-bold">{i + 1}</span>
							<p className="mt-3 text-gray-400">{s}</p>
						</div>
					))}
				</div>

				<a
					href="#"
					className="inline-block px-14 py-5 rounded-2xl bg-cyan-500 text-black font-bold text-lg hover:bg-cyan-400 transition"
				>
					DOMINATE IRACING NOW
				</a>
			</section>

			<footer className="py-8 border-t border-white/10 text-center text-gray-500 text-sm">
				© 2025 Race Analyzer Pro. Powered by data. Built for speed.
			</footer>
		</div>
	)
}

export default LandingPage
