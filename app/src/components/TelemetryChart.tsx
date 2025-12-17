// src/components/TelemetryChart.tsx
import React from 'react';

const data = [
  { speed: 200, throttle: 100, brake: 0 },
  { speed: 220, throttle: 100, brake: 0 },
  { speed: 240, throttle: 100, brake: 0 },
  { speed: 210, throttle: 0, brake: 80 }, // Hamowanie
  { speed: 150, throttle: 0, brake: 100 },
  { speed: 120, throttle: 20, brake: 30 },
  { speed: 140, throttle: 100, brake: 0 }, // Wyjście
  { speed: 180, throttle: 100, brake: 0 },
  { speed: 210, throttle: 100, brake: 0 },
];

const TelemetryChart: React.FC = () => {
  const width = 500;
  const height = 150;
  const padding = 20;

  // Funkcja zamieniająca dane na punkty SVG (x, y)
  const getPoints = (key: 'speed' | 'throttle' | 'brake', maxVal: number) => {
    return data.map((d, i) => {
      const x = (i / (data.length - 1)) * (width - padding * 2) + padding;
      const y = height - (d[key] / maxVal) * (height - padding * 2) - padding;
      return `${x},${y}`;
    }).join(' ');
  };

  return (
    <div className="bg-neutral-900/50 border border-white/10 rounded-xl p-6 shadow-2xl transition-all hover:border-cyan-500/30">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-orbitron text-sm font-bold text-cyan-400 tracking-wider uppercase">
          Manual Telemetry Overlay
        </h3>
        <div className="flex gap-4 text-[10px] uppercase font-bold tracking-widest">
          <span className="text-cyan-400">● Speed</span>
          <span className="text-green-500">● Gas</span>
          <span className="text-red-500">● Brake</span>
        </div>
      </div>
      
      <div className="relative w-full aspect-[5/2]">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
          {/* Linie siatki */}
          <line x1={padding} y1={padding} x2={width-padding} y2={padding} stroke="#333" strokeWidth="1" />
          <line x1={padding} y1={height/2} x2={width-padding} y2={height/2} stroke="#222" strokeWidth="1" />
          <line x1={padding} y1={height-padding} x2={width-padding} y2={height-padding} stroke="#333" strokeWidth="1" />

          {/* Wykres GAZU (Zielony) */}
          <polyline
            points={getPoints('throttle', 100)}
            fill="none"
            stroke="#22c55e"
            strokeWidth="2"
            strokeDasharray="4"
            opacity="0.5"
            strokeLinejoin="round"
          />

          {/* Wykres HAMULCA (Czerwony) */}
          <polyline
            points={getPoints('brake', 100)}
            fill="none"
            stroke="#ef4444"
            strokeWidth="2"
            strokeLinejoin="round"
          />

          {/* Wykres PRĘDKOŚCI (Cyjan - Główny z cieniem) */}
          <filter id="neon">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          
          <polyline
            points={getPoints('speed', 300)}
            fill="none"
            stroke="#22d3ee"
            strokeWidth="3"
            strokeLinejoin="round"
            filter="url(#neon)"
          />
        </svg>
      </div>
    </div>
  );
};

export default TelemetryChart;