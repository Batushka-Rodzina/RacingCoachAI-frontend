// src/pages/register-page.tsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AnimatedCarIntro from '../components/AnimatedCarIntro';
import VerificationModal from '../components/VerificationModal';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setIsModalOpen(true);
  };

  const handleVerifyCode = (code: string) => {
    console.log('Verifying code:', code);
    setIsModalOpen(false);
    navigate('/dashboard');
  };

  return (
    <div className="bg-neutral-950 min-h-screen relative flex items-center justify-center text-white font-sans p-4 overflow-hidden">
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Michroma&family=Inter:wght@300;400;500;600;700&display=swap');
      `}</style>

      <AnimatedCarIntro />
      <div className="absolute inset-0 bg-neutral-950/70 z-10" />

      <div className="w-full max-w-md relative z-20">
        <h1 className="text-3xl font-bold mb-8 text-center">
          <Link 
            to="/" 
            className="relative inline-block group"
            style={{ 
              color: '#bffa76',
              fontFamily: 'Michroma, sans-serif',
              letterSpacing: '0.15em'
            }}
          >
            <span className="tracking-widest uppercase">BOLIDE</span>
            <span 
              className="absolute -bottom-1 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full"
              style={{ 
                backgroundColor: '#bffa76',
                boxShadow: '0 0 8px #bffa76'
              }}
            ></span>
          </Link>
        </h1>

        <div className="bg-neutral-900/90 backdrop-blur-sm border border-white/10 p-8 md:p-10 rounded-xl shadow-2xl">
          <h2 
            className="text-2xl font-semibold mb-6 text-gray-200 text-center"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Create account
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4" style={{ fontFamily: 'Inter, sans-serif' }}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-neutral-800 text-white border border-neutral-700 rounded-lg focus:outline-none transition"
                style={{
                  fontFamily: 'Inter, sans-serif'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#bffa76'
                  e.currentTarget.style.boxShadow = '0 0 0 1px #bffa76'
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'rgb(64 64 64)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
                placeholder="driver@example.com"
              />
            </div>

            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">
                Username
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full px-4 py-3 bg-neutral-800 text-white border border-neutral-700 rounded-lg focus:outline-none transition"
                style={{
                  fontFamily: 'Inter, sans-serif'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#bffa76'
                  e.currentTarget.style.boxShadow = '0 0 0 1px #bffa76'
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'rgb(64 64 64)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
                placeholder="Choose your name"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-neutral-800 text-white border border-neutral-700 rounded-lg focus:outline-none transition"
                style={{
                  fontFamily: 'Inter, sans-serif'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#bffa76'
                  e.currentTarget.style.boxShadow = '0 0 0 1px #bffa76'
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'rgb(64 64 64)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
                placeholder="••••••••"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-neutral-800 text-white border border-neutral-700 rounded-lg focus:outline-none transition"
                style={{
                  fontFamily: 'Inter, sans-serif'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#bffa76'
                  e.currentTarget.style.boxShadow = '0 0 0 1px #bffa76'
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'rgb(64 64 64)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
                placeholder="Repeat password"
              />
            </div>

            {error && <p className="text-red-500 text-sm font-medium text-center">{error}</p>}

            <button
              type="submit"
              className="w-full px-4 py-3 rounded-lg text-black font-bold text-base transition shadow-lg mt-4 uppercase tracking-wide"
              style={{ 
                backgroundColor: '#bffa76',
                boxShadow: '0 10px 15px rgba(191, 250, 118, 0.2)',
                fontFamily: 'Inter, sans-serif',
                letterSpacing: '0.05em'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#aae965'
                e.currentTarget.style.boxShadow = '0 10px 15px rgba(170, 233, 101, 0.3)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#bffa76'
                e.currentTarget.style.boxShadow = '0 10px 15px rgba(191, 250, 118, 0.2)'
              }}
            >
              Register
            </button>
          </form>

          <p 
            className="mt-8 text-center text-sm text-gray-400"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Already have an account?{' '}
            <Link 
              to="/login" 
              className="font-semibold transition"
              style={{ color: '#bffa76' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#aae965'
                e.currentTarget.style.textDecoration = 'underline'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#bffa76'
                e.currentTarget.style.textDecoration = 'none'
              }}
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>

      <VerificationModal 
        isOpen={isModalOpen} 
        email={email} 
        onVerify={handleVerifyCode} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
};

export default RegisterPage;