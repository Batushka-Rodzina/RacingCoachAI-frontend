// src/components/StatCard.tsx
import React from 'react';

interface StatProps {
  title: string;
  value: string;
  unit?: string;
  trend?: 'up' | 'down' | 'stable';
}

const StatCard: React.FC<StatProps> = ({ title, value, unit, trend }) => {
  // Funkcja pomocnicza do renderowania ikony trendu
  const renderTrend = () => {
    if (trend === 'up') return <span className="text-green-500 text-xs ml-1">▲</span>;
    if (trend === 'down') return <span className="text-red-500 text-xs ml-1">▼</span>;
    if (trend === 'stable') return <span className="text-gray-500 text-xs ml-1">●</span>;
    return null;
  };

  return (
    <div className="bg-neutral-900 border border-white/5 p-5 rounded-xl hover:border-cyan-500/50 transition-all group shadow-lg">
      <h3 className="text-gray-500 text-xs uppercase tracking-tighter mb-2 font-medium">
        {title}
      </h3>
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-bold font-orbitron group-hover:text-cyan-400 transition-colors">
          {value}
        </span>
        {unit && <span className="text-gray-500 text-xs ml-1">{unit}</span>}
        {renderTrend()} {/* Tutaj używamy zmiennej trend */}
      </div>
    </div>
  );
};

export default StatCard;