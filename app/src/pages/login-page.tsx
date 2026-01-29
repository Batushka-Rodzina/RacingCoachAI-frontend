// src/pages/login-page.tsx
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import TrackBackground from '../components/Trackbackground.tsx'

// === KOLORY PREMIUM IRACING ===
const COLORS = {
	primary: '#ff6b00',
	primaryHover: '#ff8533',
	gold: '#d4af37',
	carbon: '#1a1a1a',
	text: '#e5e5e5',
	textMuted: '#737373',
	danger: '#dc2626',
}

const LoginPage: React.FC = () => {
	const navigate = useNavigate()
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [error, setError] = useState('')
	const [isLoading, setIsLoading] = useState(false)

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		setError('')
		setIsLoading(true)

		// Symulacja logowania
		setTimeout(() => {
			setIsLoading(false)
			navigate('/dashboard')
		}, 1000)
	}

	return (
		<div className="bg-neutral-950 min-h-screen relative flex items-center justify-center text-white font-sans p-4 overflow-hidden">
			{/* Google Fonts */}
			<style>{`
				@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;600;700&family=Michroma&display=swap');
				
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
					animation: pulse-glow 3s ease-in-out infinite;
				}

				.input-field {
					background: linear-gradient(145deg, #141414 0%, #1a1a1a 100%);
				}

				.input-field:focus {
					border-color: ${COLORS.primary};
					box-shadow: 0 0 0 3px rgba(255, 107, 0, 0.15);
				}
			`}</style>

			{/* Background */}
			<TrackBackground showTrackName={false} showIndicators={false} />
			<div className="absolute inset-0 bg-neutral-950/50 z-10" />

			<div className="w-full max-w-md relative z-20">
				{/* Logo */}
				<h1 className="text-3xl font-bold mb-10 text-center">
					<Link
						to="/"
						className="relative inline-block group"
						style={{
							color: COLORS.primary,
							fontFamily: 'Michroma, sans-serif',
							letterSpacing: '0.15em',
						}}
					>
						<span className="tracking-widest uppercase">BOLIDE</span>
						<span
							className="absolute -bottom-1 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full"
							style={{
								backgroundColor: COLORS.primary,
								boxShadow: `0 0 8px ${COLORS.primary}`,
							}}
						/>
					</Link>
				</h1>

				{/* Form Card */}
				<div
					className="carbon-texture backdrop-blur-sm p-8 md:p-10 rounded-2xl"
					style={{
						backgroundColor: 'rgba(26, 26, 26, 0.95)',
						border: '1px solid rgba(255, 107, 0, 0.2)',
						boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5), 0 0 40px rgba(255, 107, 0, 0.1)',
					}}
				>
					<h2
						className="text-3xl font-black mb-2 text-center uppercase tracking-wide"
						style={{
							fontFamily: 'Bebas Neue, sans-serif',
							color: COLORS.text,
						}}
					>
						Welcome Back
					</h2>
					<p
						className="text-center mb-8 text-sm"
						style={{ color: COLORS.textMuted, fontFamily: 'DM Sans, sans-serif' }}
					>
						Sign in to continue your racing journey
					</p>

					<form onSubmit={handleSubmit} className="space-y-5" style={{ fontFamily: 'DM Sans, sans-serif' }}>
						{/* Email */}
						<div>
							<label
								htmlFor="email"
								className="block text-sm font-medium mb-2 uppercase tracking-wider"
								style={{ color: COLORS.textMuted }}
							>
								Email Address
							</label>
							<input
								type="email"
								id="email"
								name="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
								className="input-field w-full px-5 py-4 text-white rounded-xl focus:outline-none transition-all duration-200"
								style={{
									fontFamily: 'DM Sans, sans-serif',
									border: '1px solid rgba(255, 255, 255, 0.1)',
								}}
								placeholder="driver@example.com"
							/>
						</div>

						{/* Password */}
						<div>
							<label
								htmlFor="password"
								className="block text-sm font-medium mb-2 uppercase tracking-wider"
								style={{ color: COLORS.textMuted }}
							>
								Password
							</label>
							<input
								type="password"
								id="password"
								name="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
								className="input-field w-full px-5 py-4 text-white rounded-xl focus:outline-none transition-all duration-200"
								style={{
									fontFamily: 'DM Sans, sans-serif',
									border: '1px solid rgba(255, 255, 255, 0.1)',
								}}
								placeholder="••••••••"
							/>
						</div>

						{/* Forgot Password */}
						<div className="flex justify-end">
							<Link
								to="/forgot-password"
								className="text-xs font-medium transition-colors duration-200"
								style={{ color: COLORS.textMuted }}
								onMouseEnter={(e) => (e.currentTarget.style.color = COLORS.primary)}
								onMouseLeave={(e) => (e.currentTarget.style.color = COLORS.textMuted)}
							>
								Forgot password?
							</Link>
						</div>

						{/* Error Message */}
						{error && (
							<div
								className="text-sm font-medium text-center py-3 px-4 rounded-xl"
								style={{
									color: COLORS.danger,
									backgroundColor: 'rgba(220, 38, 38, 0.1)',
									border: '1px solid rgba(220, 38, 38, 0.3)',
								}}
							>
								{error}
							</div>
						)}

						{/* Submit Button */}
						<button
							type="submit"
							disabled={isLoading}
							className={`glow-button w-full px-6 py-4 rounded-xl text-black font-bold text-base transition-all duration-200 uppercase tracking-widest ${
								isLoading ? 'opacity-70 cursor-not-allowed' : ''
							}`}
							style={{
								backgroundColor: COLORS.primary,
								fontFamily: 'DM Sans, sans-serif',
								letterSpacing: '0.1em',
							}}
							onMouseEnter={(e) => {
								if (!isLoading) e.currentTarget.style.backgroundColor = COLORS.primaryHover
							}}
							onMouseLeave={(e) => {
								e.currentTarget.style.backgroundColor = COLORS.primary
							}}
						>
							{isLoading ? 'Signing in...' : 'Sign In'}
						</button>
					</form>

					{/* Divider */}
					<div className="flex items-center gap-4 my-8">
						<div className="flex-1 h-px" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }} />
						<span
							className="text-sm uppercase tracking-wider font-medium"
							style={{ color: COLORS.textMuted, fontFamily: 'DM Sans, sans-serif' }}
						>
							or
						</span>
						<div className="flex-1 h-px" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }} />
					</div>

					{/* Register Link */}
					<p className="text-center text-sm" style={{ fontFamily: 'DM Sans, sans-serif', color: COLORS.textMuted }}>
						Don't have an account?{' '}
						<Link
							to="/register"
							className="font-semibold transition-all duration-200"
							style={{ color: COLORS.primary }}
							onMouseEnter={(e) => {
								e.currentTarget.style.color = COLORS.primaryHover
								e.currentTarget.style.textDecoration = 'underline'
							}}
							onMouseLeave={(e) => {
								e.currentTarget.style.color = COLORS.primary
								e.currentTarget.style.textDecoration = 'none'
							}}
						>
							Create account
						</Link>
					</p>
				</div>
			</div>
		</div>
	)
}

export default LoginPage