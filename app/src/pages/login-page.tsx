// src/pages/login-page.tsx

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AnimatedCarIntro from '../components/AnimatedCarIntro'; // Używamy ulepszonego komponentu

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Tutaj umieść logikę do wysłania danych logowania do API.
    console.log('Logowanie danych:', { email, password });
  };

  return (
    // Zmieniamy główny div, aby był kontenerem dla tła (relative)
    <div className="bg-neutral-950 min-h-screen relative flex items-center justify-center text-white font-sans p-4">
      
      {/* 🏎️ Animacja samochodu (WIDEO) - Z-index: 0 */}
      <AnimatedCarIntro />
      
      {/* Overlay - Zapewnia widoczność formularza nad wideo */}
      <div className="absolute inset-0 bg-neutral-950/70 z-10" />

      <div className="w-full max-w-md relative z-20"> {/* z-20 zapewnia, że formularz jest na wierzchu */}
        
        {/* NAGŁÓWEK JAK NA STRONIE GŁÓWNEJ */}
        <h1 className="text-3xl font-orbitron font-bold text-cyan-400 mb-8 text-center">
          Bolide
        </h1>

        {/* Dodano backdrop-blur i podniesiono z-index */}
        <div className="bg-neutral-900/90 backdrop-blur-sm border border-white/10 p-8 md:p-10 rounded-xl shadow-2xl">
          
          <h2 className="text-2xl font-semibold mb-6 text-gray-200 text-center">
            Log in
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Pole Email */}
            <div>
              <label 
                htmlFor="email" 
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-neutral-800 text-white border border-neutral-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 transition"
                placeholder="Enter your email"
              />
            </div>

            {/* Pole Hasło */}
            <div>
              <label 
                htmlFor="password" 
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-neutral-800 text-white border border-neutral-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 transition"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              className="w-full px-4 py-3 rounded-lg bg-cyan-500 text-black font-bold text-base hover:bg-cyan-400 transition shadow-lg shadow-cyan-500/20"
            >
              Log in
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-400">
            Sign up{' '}
            <Link 
              to="/register"
              className="text-cyan-400 font-semibold hover:text-cyan-300 hover:underline transition"
            >
              Sign up
            </Link>
          </p>
          
        </div>
      </div>
    </div>
  );
};

export default LoginPage;