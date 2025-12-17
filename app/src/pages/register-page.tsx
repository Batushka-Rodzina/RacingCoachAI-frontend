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
      <AnimatedCarIntro />
      <div className="absolute inset-0 bg-neutral-950/70 z-10" />

      <div className="w-full max-w-md relative z-20">
        <h1 className="text-3xl font-orbitron font-bold mb-8 text-center">
          <Link to="/" className="relative inline-block text-cyan-400 group">
            <span className="tracking-widest uppercase">Bolide</span>
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cyan-400 transition-all duration-300 group-hover:w-full shadow-[0_0_8px_#22d3ee]"></span>
          </Link>
        </h1>

        <div className="bg-neutral-900/90 backdrop-blur-sm border border-white/10 p-8 md:p-10 rounded-xl shadow-2xl">
          <h2 className="text-2xl font-semibold mb-6 text-gray-200 text-center uppercase tracking-tight">
            Create account
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-1">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-neutral-800 text-white border border-neutral-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-cyan-500 transition"
                placeholder="driver@example.com"
              />
            </div>

            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-400 mb-1">
                Username
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full px-4 py-3 bg-neutral-800 text-white border border-neutral-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-cyan-500 transition"
                placeholder="Choose your name"
              />
            </div>

            {/* POPRAWIONE LABELE PONIŻEJ (Usunięto 'name') */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-400 mb-1">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-neutral-800 text-white border border-neutral-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-cyan-500 transition"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-400 mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-neutral-800 text-white border border-neutral-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-cyan-500 transition"
                placeholder="Repeat password"
              />
            </div>

            {error && <p className="text-red-500 text-sm font-medium text-center">{error}</p>}

            <button
              type="submit"
              className="w-full px-4 py-3 rounded-lg bg-cyan-500 text-black font-bold text-base hover:bg-cyan-400 transition shadow-lg shadow-cyan-500/20 mt-4"
            >
              Register
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-400">
            Already have an account?{' '}
            <Link to="/login" className="text-cyan-400 font-semibold hover:text-cyan-300 hover:underline transition">
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