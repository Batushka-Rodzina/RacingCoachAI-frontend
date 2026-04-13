import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import TrackBackground from '../components/Trackbackground.tsx'
import VerificationModal from '../components/VerificationModal'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'

// === KOLORY PREMIUM IRACING ===
const COLORS = {
	primary: '#ff6b00',
	primaryHover: '#ff8533',
	gold: '#d4af37',
	carbon: '#1a1a1a',
	carbonLight: '#2d2d2d',
	text: '#e5e5e5',
	textMuted: '#737373',
	danger: '#dc2626',
}

const RegisterPage: React.FC = () => {
	const navigate = useNavigate()

	const [email, setEmail] = useState('')
	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')
	const [confirmPassword, setConfirmPassword] = useState('')

	const [error, setError] = useState('')
	const [successMsg, setSuccessMsg] = useState('')
	const [isLoading, setIsLoading] = useState(false)
	const [isModalOpen, setIsModalOpen] = useState(false)

	// KROK 1 & 2: Rejestracja i wysłanie kodu
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setError('')
		setSuccessMsg('')

		if (password !== confirmPassword) {
			setError('Passwords do not match.')
			return
		}

		if (password.length < 8) {
			setError('Password must be at least 8 characters.')
			return
		}

		setIsLoading(true)

		try {
			// 1. Wysłanie danych rejestracyjnych
			const regResponse = await fetch(`${BASE_URL}/api/auth/register`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email, username, password }),
			})

			if (!regResponse.ok) {
				const errData = await regResponse.json()
				// Formatowanie błędu Pydantic (FastAPI) na czytelny tekst
				const errMsg = Array.isArray(errData.detail)
					? errData.detail[0]?.msg
					: errData.detail || 'Registration failed.'
				throw new Error(errMsg)
			}

			// 2. Żądanie kodu weryfikacyjnego na maila
			const codeResponse = await fetch(`${BASE_URL}/api/auth/get-verify-code`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email }),
			})

			if (!codeResponse.ok) {
				throw new Error(
					'Account created, but failed to send verification code. Try logging in to trigger it again.'
				)
			}

			// 3. Jeśli oba kroki się udały, otwieramy modal
			setIsModalOpen(true)
		} catch (err: any) {
			console.error('Registration error:', err)
			setError(err.message || 'An unexpected error occurred.')
		} finally {
			setIsLoading(false)
		}
	}

	// KROK 3: Weryfikacja kodu z modala
	const handleVerifyCode = async (code: string) => {
		setIsLoading(true)
		setError('')

		try {
			const verifyResponse = await fetch(`${BASE_URL}/api/auth/verify`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email, verify_code: code }),
			})

			if (!verifyResponse.ok) {
				const errData = await verifyResponse.json()
				throw new Error(errData.detail || 'Invalid verification code.')
			}

			// Weryfikacja udana! Zamykamy modal i idziemy na stronę logowania
			setIsModalOpen(false)
			navigate('/login', {
				state: {
					message: 'Account verified successfully! You can now log in.',
				},
			})
		} catch (err: any) {
			console.error('Verification error:', err)
			setError(err.message || 'Verification failed. Please try again.')
			setIsModalOpen(false) // Zamykamy modal, żeby użytkownik zobaczył błąd
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<div className="bg-neutral-950 min-h-screen relative flex items-center justify-center text-white font-sans p-4 overflow-hidden">
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

        .input-carbon {
          background: linear-gradient(145deg, #141414 0%, #1a1a1a 100%);
        }

        .input-carbon:focus {
          border-color: ${COLORS.primary};
          box-shadow: 0 0 0 3px rgba(255, 107, 0, 0.15);
        }
      `}</style>

			<TrackBackground showTrackName={false} showIndicators={false} />
			<div className="absolute inset-0 bg-neutral-950/50 z-10" />

			<div className="w-full max-w-md relative z-20">
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

				<div
					className="carbon-texture backdrop-blur-sm p-8 md:p-10 rounded-2xl"
					style={{
						backgroundColor: 'rgba(26, 26, 26, 0.95)',
						border: '1px solid rgba(255, 107, 0, 0.2)',
						boxShadow:
							'0 25px 50px rgba(0, 0, 0, 0.5), 0 0 40px rgba(255, 107, 0, 0.1)',
					}}
				>
					<h2
						className="text-3xl font-black mb-2 text-center uppercase tracking-wide"
						style={{ fontFamily: 'Bebas Neue, sans-serif', color: COLORS.text }}
					>
						Create Your Account
					</h2>
					<p
						className="text-center mb-8 text-sm"
						style={{
							color: COLORS.textMuted,
							fontFamily: 'DM Sans, sans-serif',
						}}
					>
						Join the fastest-growing sim racing community
					</p>

					<form
						onSubmit={handleSubmit}
						className="space-y-5"
						style={{ fontFamily: 'DM Sans, sans-serif' }}
					>
						<InputField
							label="Email Address"
							type="email"
							id="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							placeholder="driver@example.com"
							required
						/>
						<InputField
							label="Username"
							type="text"
							id="username"
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							placeholder="Choose your driver name"
							required
						/>
						<InputField
							label="Password"
							type="password"
							id="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							placeholder="••••••••"
							required
						/>
						<InputField
							label="Confirm Password"
							type="password"
							id="confirmPassword"
							value={confirmPassword}
							onChange={(e) => setConfirmPassword(e.target.value)}
							placeholder="••••••••"
							required
						/>

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

						{/* Success Message (np. kiedy wyślemy kod ale user zamknie modal) */}
						{successMsg && (
							<div
								className="text-sm font-medium text-center py-3 px-4 rounded-xl"
								style={{
									color: '#10b981', // emerald-500
									backgroundColor: 'rgba(16, 185, 129, 0.1)',
									border: '1px solid rgba(16, 185, 129, 0.3)',
								}}
							>
								{successMsg}
							</div>
						)}

						<button
							type="submit"
							disabled={isLoading}
							className={`glow-button w-full px-6 py-4 rounded-xl text-black font-bold text-base transition-all duration-200 uppercase tracking-widest mt-2 ${
								isLoading ? 'opacity-70 cursor-not-allowed' : ''
							}`}
							style={{
								backgroundColor: COLORS.primary,
								fontFamily: 'DM Sans, sans-serif',
								letterSpacing: '0.1em',
							}}
							onMouseEnter={(e) => {
								if (!isLoading)
									e.currentTarget.style.backgroundColor = COLORS.primaryHover
							}}
							onMouseLeave={(e) => {
								e.currentTarget.style.backgroundColor = COLORS.primary
							}}
						>
							{isLoading ? 'Processing...' : 'Create Account'}
						</button>
					</form>

					<div className="flex items-center gap-4 my-8">
						<div
							className="flex-1 h-px"
							style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
						/>
						<span
							className="text-sm uppercase tracking-wider font-medium"
							style={{
								color: COLORS.textMuted,
								fontFamily: 'DM Sans, sans-serif',
							}}
						>
							or
						</span>
						<div
							className="flex-1 h-px"
							style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
						/>
					</div>

					<p
						className="text-center text-sm"
						style={{
							fontFamily: 'DM Sans, sans-serif',
							color: COLORS.textMuted,
						}}
					>
						Already have an account?{' '}
						<Link
							to="/login"
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
							Sign in
						</Link>
					</p>
				</div>

				<p
					className="text-center text-xs mt-6"
					style={{ color: COLORS.textMuted, fontFamily: 'DM Sans, sans-serif' }}
				>
					By creating an account, you agree to our{' '}
					<Link
						to="/terms"
						className="underline hover:text-white transition-colors"
					>
						Terms of Service
					</Link>{' '}
					and{' '}
					<Link
						to="/privacy"
						className="underline hover:text-white transition-colors"
					>
						Privacy Policy
					</Link>
				</p>
			</div>

			<VerificationModal
				isOpen={isModalOpen}
				email={email}
				onVerify={handleVerifyCode}
				onClose={() => {
					setIsModalOpen(false)
					setSuccessMsg('Check your email! Verification code has been sent.')
				}}
			/>
		</div>
	)
}

interface InputFieldProps {
	label: string
	type: string
	id: string
	value: string
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
	placeholder: string
	required?: boolean
}

const InputField: React.FC<InputFieldProps> = ({
	label,
	type,
	id,
	value,
	onChange,
	placeholder,
	required,
}) => (
	<div>
		<label
			htmlFor={id}
			className="block text-sm font-medium mb-2 uppercase tracking-wider"
			style={{ color: COLORS.textMuted }}
		>
			{label}
		</label>
		<input
			type={type}
			id={id}
			name={id}
			value={value}
			onChange={onChange}
			required={required}
			className="input-carbon w-full px-5 py-4 text-white rounded-xl focus:outline-none transition-all duration-200"
			style={{
				fontFamily: 'DM Sans, sans-serif',
				border: '1px solid rgba(255, 255, 255, 0.1)',
			}}
			placeholder={placeholder}
		/>
	</div>
)

export default RegisterPage
