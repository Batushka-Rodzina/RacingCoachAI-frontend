// src/components/VerificationModal.tsx
import React, { useState } from 'react';

interface VerificationModalProps {
  isOpen: boolean;
  email: string;
  onVerify: (code: string) => void;
  onClose: () => void;
}

const VerificationModal: React.FC<VerificationModalProps> = ({ isOpen, email, onVerify, onClose }) => {
  const [code, setCode] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onVerify(code);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Overlay - przyciemnienie tła */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      
      {/* Okno Modala */}
      <div className="relative bg-neutral-900 border border-cyan-500/30 p-8 rounded-2xl max-w-sm w-full shadow-[0_0_50px_rgba(6,182,212,0.2)]">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-cyan-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#22d3ee" className="w-8 h-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
            </svg>
          </div>
          <h2 className="text-xl font-orbitron font-bold text-white uppercase tracking-wider">Verify Email</h2>
          <p className="text-gray-400 text-sm mt-2">
            We've sent a 6-digit code to <br/> <span className="text-cyan-400">{email}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="text"
            maxLength={6}
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))} // Tylko cyfry
            placeholder="000000"
            className="w-full bg-black border border-neutral-700 text-white text-center text-3xl tracking-[0.5em] py-3 rounded-lg focus:outline-none focus:border-cyan-500 transition-all font-mono"
            required
          />
          
          <button
            type="submit"
            className="w-full py-3 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-lg transition-all shadow-lg shadow-cyan-500/20"
          >
            Verify & Finish
          </button>
        </form>

        <button 
          onClick={onClose}
          className="mt-4 w-full text-xs text-gray-500 hover:text-white transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default VerificationModal;