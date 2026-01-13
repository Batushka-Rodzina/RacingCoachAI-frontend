// src/pages/dashboard-page.tsx
import React from 'react';
import Sidebar from '../components/Sidebar';
import StatCard from '../components/StatCard';
import SessionTable from '../components/SessionTable';

const DashboardPage: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-black text-white font-sans overflow-x-hidden">
      <Sidebar />

      <main className="flex-1 p-8 overflow-y-auto custom-scrollbar">
        {/* --- PROFILE HERO SECTION --- */}
        <section className="relative bg-neutral-900/40 border border-white/10 rounded-2xl p-8 mb-10 overflow-hidden">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-cyan-500/10 to-transparent opacity-50" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
            {/* Avatar */}
            <div className="relative group">
              <div className="w-32 h-32 rounded-2xl bg-neutral-800 border-2 border-white/10 flex items-center justify-center overflow-hidden group-hover:border-cyan-400 transition-colors shadow-xl">
                <span className="text-gray-500 text-xs text-center px-4 uppercase font-bold tracking-tighter">
                  No profile image
                </span>
              </div>
            </div>

            {/* User Info */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center gap-3 mb-2">
                <h2 className="text-4xl font-orbitron font-black tracking-tight text-white uppercase">
                  Andrii Zhupanov
                </h2>
                <div className="bg-neutral-800 px-3 py-1 rounded-full border border-white/10 flex items-center gap-2 w-fit mx-auto md:mx-0">
                  <span className="text-yellow-500 text-sm">🏆</span>
                  <span className="text-xs font-bold text-gray-300">Level 22</span>
                </div>
              </div>
              <p className="text-gray-400 max-w-xl text-sm leading-relaxed mb-6">
                Professional SimRacer | Soul of Racing Team Member | Specialized in GT3 Analysis
              </p>
              <div className="flex flex-wrap justify-center md:justify-start gap-4">
                <button className="bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-bold py-2 px-6 rounded-lg transition-all uppercase tracking-widest shadow-[0_0_15px_rgba(37,99,235,0.4)]">
                  Customize profile
                </button>
                <div className="flex items-center gap-4 px-4 py-2 bg-black/30 rounded-lg border border-white/5">
                    <div className="flex flex-col">
                        <span className="text-[9px] text-gray-500 uppercase font-bold">Team</span>
                        <span className="text-xs font-bold text-cyan-400 uppercase">Soul of Racing</span>
                    </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- PERFORMANCE QUICK STATS --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard title="Best Lap (Spa)" value="1:24.302" unit="min" trend="down" />
          <StatCard title="Win Rate" value="12.5" unit="%" trend="up" />
          <StatCard title="Safety Rating" value="4.95" unit="SR" trend="stable" />
          <StatCard title="Time on Track" value="209" unit="h" />
        </div>

        {/* --- DETAILED STATISTICS GRID --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
          <div className="lg:col-span-2 bg-neutral-900/30 border border-white/10 rounded-2xl p-6">
             <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-orbitron font-bold text-white uppercase tracking-wider">Career Progress</h3>
                <span className="text-[10px] text-gray-500 uppercase font-bold italic">Laps Driven: 4,635</span>
             </div>
             {/* Tu w przyszłości można wstawić mały wykres progresu (np. iRating over time) */}
             <div className="h-48 flex items-center justify-center border border-white/5 rounded-xl bg-black/20 italic text-gray-600 text-sm">
                Career progress chart placeholder
             </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-xl font-orbitron font-bold text-white uppercase tracking-wider px-2">Driver Bio</h3>
            <div className="bg-neutral-900/50 border border-white/10 rounded-2xl p-6 space-y-4">
                <div className="space-y-1">
                    <p className="text-[10px] text-gray-500 uppercase font-black">Preferred Category</p>
                    <p className="text-white font-bold">GT3 / Formula</p>
                </div>
                <div className="space-y-1">
                    <p className="text-[10px] text-gray-500 uppercase font-black">Favorite Track</p>
                    <p className="text-white font-bold">Spa-Francorchamps</p>
                </div>
                <div className="space-y-1">
                    <p className="text-[10px] text-gray-500 uppercase font-black">Member Since</p>
                    <p className="text-white font-bold">Feb 24, 2025</p>
                </div>
            </div>
          </div>
        </div>

        {/* --- RECENT SESSIONS --- */}
        <section>
          <div className="flex justify-between items-end mb-6 px-2">
            <h3 className="text-xl font-orbitron font-bold text-white uppercase tracking-wider">Recent Sessions</h3>
            <button className="text-[10px] text-cyan-400 hover:text-cyan-300 uppercase font-bold tracking-widest underline decoration-cyan-400/30 underline-offset-4">
              View Full History
            </button>
          </div>
          <SessionTable />
        </section>
      </main>
    </div>
  );
};

export default DashboardPage;