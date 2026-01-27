// src/components/VerificationModal.tsx
import React, { useState, useRef, useEffect } from 'react'

// === KOLORY PREMIUM IRACING ===
const COLORS = {
	primary: '#ff6b00',
	primaryHover: '#ff8533',
	gold: '#d4af37',
	carbon: '#1a1a1a',
	text: '#e5e5e5',
	textMuted: '#737373',
}

interface VerificationModalProps {
	isOpen: boolean
	email: string
	onVerify: (code: string) => void
	onClose: () => void
}

const VerificationModal: React.FC<VerificationModalProps> = ({ isOpen, email, onVerify, onClose }) => {
	const [code, setCode] = useState(['', '', '', '', '', ''])
	const inputRefs = useRef<(HTMLInputElement | null)[]>([])

	useEffect(() => {
		if (isOpen && inputRefs.current[0]) {
			inputRefs.current[0].focus()
		}
	}, [isOpen])

	if (!isOpen) return null

	const handleChange = (index: number, value: string) => {
		if (!/^\d*$/.test(value)) return // Tylko cyfry

		const newCode = [...code]
		newCode[index] = value.slice(-1) // Tylko ostatnia cyfra
		setCode(newCode)

		// Auto-focus na następne pole
		if (value && index < 5) {
			inputRefs.current[index + 1]?.focus()
		}
	}

	const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
		if (e.key === 'Backspace' && !code[index] && index > 0) {
			inputRefs.current[index - 1]?.focus()
		}
	}

	const handlePaste = (e: React.ClipboardEvent) => {
		e.preventDefault()
		const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
		const newCode = [...code]
		for (let i = 0; i < pastedData.length; i++) {
			newCode[i] = pastedData[i]
		}
		setCode(newCode)
		if (pastedData.length === 6) {
			inputRefs.current[5]?.focus()
		}
	}

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		const fullCode = code.join('')
		if (fullCode.length === 6) {
			onVerify(fullCode)
		}
	}

	const isComplete = code.every(digit => digit !== '')

	return (
		<div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
			{/* Google Fonts */}
			<style>{`
				@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
				
				@keyframes pulse-glow {
					0%, 100% { box-shadow: 0 0 20px rgba(255, 107, 0, 0.3); }
					50% { box-shadow: 0 0 40px rgba(255, 107, 0, 0.6); }
				}

				.glow-button {
					animation: pulse-glow 3s ease-in-out infinite;
				}

				.carbon-modal {
					background-image: 
						linear-gradient(45deg, #1a1a1a 25%, transparent 25%),
						linear-gradient(-45deg, #1a1a1a 25%, transparent 25%),
						linear-gradient(45deg, transparent 75%, #1a1a1a 75%),
						linear-gradient(-45deg, transparent 75%, #1a1a1a 75%);
					background-size: 4px 4px;
					background-position: 0 0, 0 2px, 2px -2px, -2px 0px;
				}

				.code-input:focus {
					border-color: ${COLORS.primary};
					box-shadow: 0 0 0 3px rgba(255, 107, 0, 0.2);
				}
			`}</style>

			{/* Overlay */}
			<div 
				className="absolute inset-0 backdrop-blur-sm"
				style={{ backgroundColor: 'rgba(0, 0, 0, 0.85)' }}
				onClick={onClose} 
			/>

			{/* Modal */}
			<div 
				className="carbon-modal relative p-8 md:p-10 rounded-2xl max-w-md w-full"
				style={{
					backgroundColor: 'rgba(26, 26, 26, 0.95)',
					border: '1px solid rgba(255, 107, 0, 0.2)',
					boxShadow: '0 25px 80px rgba(0, 0, 0, 0.5), 0 0 60px rgba(255, 107, 0, 0.1)'
				}}
			>
				{/* Close button */}
				<button
					onClick={onClose}
					className="absolute top-4 right-4 p-2 rounded-lg transition-all duration-200"
					style={{ color: COLORS.textMuted }}
					onMouseEnter={(e) => {
						e.currentTarget.style.color = COLORS.text
						e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)'
					}}
					onMouseLeave={(e) => {
						e.currentTarget.style.color = COLORS.textMuted
						e.currentTarget.style.backgroundColor = 'transparent'
					}}
				>
					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
						<path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
					</svg>
				</button>

				{/* Icon */}
				<div className="text-center mb-6">
					<div 
						className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-5"
						style={{ 
							backgroundColor: 'rgba(255, 107, 0, 0.1)',
							border: '1px solid rgba(255, 107, 0, 0.2)'
						}}
					>
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke={COLORS.primary} className="w-10 h-10">
							<path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
						</svg>
					</div>
					
					<h2 
						className="text-3xl font-black uppercase tracking-wide mb-2"
						style={{ 
							fontFamily: 'Bebas Neue, sans-serif',
							color: COLORS.text
						}}
					>
						Verify Your Email
					</h2>
					<p 
						className="text-sm"
						style={{ color: COLORS.textMuted, fontFamily: 'DM Sans, sans-serif' }}
					>
						We've sent a 6-digit code to
					</p>
					<p 
						className="text-sm font-semibold mt-1"
						style={{ color: COLORS.primary, fontFamily: 'DM Sans, sans-serif' }}
					>
						{email}
					</p>
				</div>

				{/* Code input */}
				<form onSubmit={handleSubmit} className="space-y-6">
					<div className="flex justify-center gap-3">
						{code.map((digit, index) => (
							<input
								key={index}
								ref={(el) => { inputRefs.current[index] = el }}
								type="text"
								inputMode="numeric"
								maxLength={1}
								value={digit}
								onChange={(e) => handleChange(index, e.target.value)}
								onKeyDown={(e) => handleKeyDown(index, e)}
								onPaste={index === 0 ? handlePaste : undefined}
								className="code-input w-12 h-14 text-center text-2xl font-bold rounded-xl transition-all duration-200 outline-none"
								style={{
									backgroundColor: 'rgba(0, 0, 0, 0.4)',
									border: '1px solid rgba(255, 255, 255, 0.1)',
									color: COLORS.text,
									fontFamily: 'JetBrains Mono, monospace'
								}}
							/>
						))}
					</div>

					<button
						type="submit"
						disabled={!isComplete}
						className={`glow-button w-full py-4 rounded-xl font-bold text-base uppercase tracking-widest transition-all duration-200 ${
							isComplete ? '' : 'opacity-50 cursor-not-allowed'
						}`}
						style={{
							backgroundColor: COLORS.primary,
							color: '#000',
							fontFamily: 'DM Sans, sans-serif'
						}}
						onMouseEnter={(e) => {
							if (isComplete) e.currentTarget.style.backgroundColor = COLORS.primaryHover
						}}
						onMouseLeave={(e) => {
							e.currentTarget.style.backgroundColor = COLORS.primary
						}}
					>
						Verify & Continue
					</button>
				</form>

				{/* Resend */}
				<div className="mt-6 text-center">
					<p 
						className="text-sm"
						style={{ color: COLORS.textMuted, fontFamily: 'DM Sans, sans-serif' }}
					>
						Didn't receive the code?{' '}
						<button 
							className="font-semibold transition-colors duration-200"
							style={{ color: COLORS.primary }}
							onMouseEnter={(e) => e.currentTarget.style.color = COLORS.primaryHover}
							onMouseLeave={(e) => e.currentTarget.style.color = COLORS.primary}
						>
							Resend
						</button>
					</p>
				</div>
			</div>
		</div>
	)
}

export default VerificationModal