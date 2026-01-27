// src/pages/login-page.tsx
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import AnimatedTrackBackground from '../components/Animatedtrackbackground'

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

const LoginPage: React.FC = () => {
	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		console.log('Login attempt:', { username, password })
	}

	return (
		<div className="bg-neutral-950 min-h-screen relative flex items-center justify-center text-white font-sans p-4">
			{/* Google Fonts */}
			<style>{`
				@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600;700&family=Michroma&display=swap');
				
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

				.input-carbon {
					background: linear-gradient(145deg, #141414 0%, #1a1a1a 100%);
				}
			`}</style>

			<AnimatedTrackBackground />
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
							letterSpacing: '0.15em'
						}}
					>
						<span className="tracking-widest uppercase">BOLIDE</span>
						<span 
							className="absolute -bottom-1 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full"
							style={{ 
								backgroundColor: COLORS.primary,
								boxShadow: `0 0 8px ${COLORS.primary}`
							}}
						></span>
					</Link>
				</h1>

				{/* Karta formularza */}
				<div 
					className="carbon-texture backdrop-blur-sm p-10 md:p-12 rounded-2xl"
					style={{
						backgroundColor: 'rgba(26, 26, 26, 0.95)',
						border: '1px solid rgba(255, 107, 0, 0.2)',
						boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5), 0 0 40px rgba(255, 107, 0, 0.1)'
					}}
				>
					<h2 
						className="text-3xl font-black mb-8 text-center uppercase tracking-wide"
						style={{ 
							fontFamily: 'Bebas Neue, sans-serif',
							color: COLORS.text
						}}
					>
						Sign In to Your Account
					</h2>

					<form onSubmit={handleSubmit} className="space-y-6" style={{ fontFamily: 'DM Sans, sans-serif' }}>
						{/* Username Input */}
						<div>
							<label
								htmlFor="username"
								className="block text-sm font-medium mb-3 uppercase tracking-wider"
								style={{ color: COLORS.textMuted }}
							>
								Username
							</label>
							<input
								type="text"
								id="username"
								value={username}
								onChange={(e) => setUsername(e.target.value)}
								required
								className="input-carbon w-full px-5 py-4 text-white rounded-xl focus:outline-none transition-all duration-200"
								style={{
									fontFamily: 'DM Sans, sans-serif',
									border: '1px solid rgba(255, 255, 255, 0.1)',
								}}
								onFocus={(e) => {
									e.currentTarget.style.borderColor = COLORS.primary
									e.currentTarget.style.boxShadow = `0 0 0 2px rgba(255, 107, 0, 0.2)`
								}}
								onBlur={(e) => {
									e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'
									e.currentTarget.style.boxShadow = 'none'
								}}
								placeholder="Enter your username"
							/>
						</div>

						{/* Password Input */}
						<div>
							<label
								htmlFor="password"
								className="block text-sm font-medium mb-3 uppercase tracking-wider"
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
								className="input-carbon w-full px-5 py-4 text-white rounded-xl focus:outline-none transition-all duration-200"
								style={{
									fontFamily: 'DM Sans, sans-serif',
									border: '1px solid rgba(255, 255, 255, 0.1)',
								}}
								onFocus={(e) => {
									e.currentTarget.style.borderColor = COLORS.primary
									e.currentTarget.style.boxShadow = `0 0 0 2px rgba(255, 107, 0, 0.2)`
								}}
								onBlur={(e) => {
									e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'
									e.currentTarget.style.boxShadow = 'none'
								}}
								placeholder="••••••••"
							/>
						</div>

						{/* Forgot Password Link */}
						<div className="text-right">
							<Link
								to="/forgot-password"
								className="text-sm transition-colors duration-200"
								style={{ 
									color: COLORS.textMuted,
									fontFamily: 'DM Sans, sans-serif'
								}}
								onMouseEnter={(e) => e.currentTarget.style.color = COLORS.primary}
								onMouseLeave={(e) => e.currentTarget.style.color = COLORS.textMuted}
							>
								Forgot password?
							</Link>
						</div>

						{/* Login Button */}
						<button
							type="submit"
							className="glow-button w-full px-6 py-4 rounded-xl text-black font-bold text-base transition-all duration-200 uppercase tracking-widest mt-4"
							style={{ 
								backgroundColor: COLORS.primary,
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
							Login
						</button>
					</form>

					{/* Divider */}
					<div className="flex items-center gap-4 my-8">
						<div 
							className="flex-1 h-px"
							style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
						/>
						<span 
							className="text-sm uppercase tracking-wider font-medium"
							style={{ color: COLORS.textMuted, fontFamily: 'DM Sans, sans-serif' }}
						>
							or
						</span>
						<div 
							className="flex-1 h-px"
							style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
						/>
					</div>

					{/* Create Account Link */}
					<p 
						className="text-center text-sm"
						style={{ fontFamily: 'DM Sans, sans-serif', color: COLORS.textMuted }}
					>
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
							Create an account
						</Link>
					</p>
				</div>
			</div>
		</div>
	)
}

export default LoginPage