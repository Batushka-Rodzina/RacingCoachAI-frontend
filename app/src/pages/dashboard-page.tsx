// src/pages/dashboard-page.tsx
import React from 'react';
import Sidebar from '../components/Sidebar';
import StatCard from '../components/StatCard';
import SessionTable from '../components/SessionTable';
import TelemetryChart from '../components/TelemetryChart'; 

const DashboardPage: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-black text-white font-sans overflow-x-hidden">
      <Sidebar />

      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-orbitron font-bold text-cyan-400 uppercase tracking-wider">
              Race Dashboard
            </h1>
            <p className="text-gray-400 mt-1">Welcome back, Driver.</p>
          </div>
          {/* Status Live */}
          <div className="bg-neutral-900 border border-white/10 px-4 py-2 rounded-lg flex items-center gap-3">
             <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_#22c55e]"></div>
             <span className="text-xs uppercase tracking-widest font-bold">Live Link Active</span>
          </div>
        </header>

        {/* Statystyki - Górny rząd */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard title="Best Lap" value="1:24.302" unit="min" trend="down" />
          <StatCard title="Top Speed" value="312" unit="km/h" trend="up" />
          <StatCard title="Avg. Temp" value="84" unit="°C" trend="stable" />
          <StatCard title="Total Distance" value="1,420" unit="km" />
        </div>

        {/* Środkowy rząd: Wykres Telemetrii + Dodatkowe Info */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
          {/* Wykres zajmuje 2 z 3 kolumn */}
          <div className="lg:col-span-2">
            <TelemetryChart />
          </div>

          {/* Mały widget boczny (np. info o torze) */}
          <div className="bg-neutral-900/50 border border-white/10 rounded-xl p-6 flex flex-col justify-center">
            <h3 className="text-gray-500 text-xs uppercase tracking-widest mb-4 font-bold">Current Track</h3>
            <p className="text-2xl font-orbitron font-bold text-white mb-2">Spa-Francorchamps</p>
            <div className="space-y-2 border-t border-white/5 pt-4">
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">Surface Temp</span>
                <span className="text-cyan-400 font-bold">38°C</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">Air Temp</span>
                <span className="text-white font-bold">24°C</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">Humidity</span>
                <span className="text-white font-bold">45%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Dolny rząd: Tabela sesji */}
        <div className="grid grid-cols-1 gap-6">
          <SessionTable />
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;