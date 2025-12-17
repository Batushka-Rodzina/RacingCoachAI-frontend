// src/components/SessionTable.tsx
import React from 'react';

interface LapData {
  id: number;
  lapNumber: number;
  lapTime: string;
  s1: string;
  s2: string;
  s3: string;
  isPersonalBest?: boolean;
}

const sessions: LapData[] = [
  { id: 1, lapNumber: 12, lapTime: "1:24.302", s1: "28.102", s2: "32.400", s3: "23.800", isPersonalBest: true },
  { id: 2, lapNumber: 11, lapTime: "1:25.110", s1: "28.450", s2: "32.610", s3: "24.050" },
  { id: 3, lapNumber: 10, lapTime: "1:24.890", s1: "28.220", s2: "32.550", s3: "24.120" },
  { id: 4, lapNumber: 9, lapTime: "1:26.400", s1: "29.100", s2: "33.100", s3: "24.200" },
];

const SessionTable: React.FC = () => {
  return (
    <div className="bg-neutral-900/50 border border-white/10 rounded-xl overflow-hidden shadow-2xl">
      <div className="p-5 border-b border-white/10 flex justify-between items-center bg-neutral-900/80">
        <h3 className="font-orbitron text-sm font-bold text-cyan-400 tracking-wider uppercase">
          Recent Laps - Spa-Francorchamps
        </h3>
        <span className="text-xs text-gray-500 italic">Sorted by newest</span>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="text-gray-500 uppercase text-[10px] tracking-widest bg-black/20">
            <tr>
              <th className="px-6 py-4 font-medium">Lap</th>
              <th className="px-6 py-4 font-medium text-white">Lap Time</th>
              <th className="px-6 py-4 font-medium">S1</th>
              <th className="px-6 py-4 font-medium">S2</th>
              <th className="px-6 py-4 font-medium">S3</th>
              <th className="px-6 py-4 font-medium text-right">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 font-mono">
            {sessions.map((lap) => (
              <tr 
                key={lap.id} 
                className={`hover:bg-white/5 transition-colors group ${lap.isPersonalBest ? 'bg-cyan-500/5' : ''}`}
              >
                <td className="px-6 py-4 text-gray-400">{lap.lapNumber}</td>
                <td className={`px-6 py-4 font-bold ${lap.isPersonalBest ? 'text-cyan-400' : 'text-white'}`}>
                  {lap.lapTime}
                  {lap.isPersonalBest && <span className="ml-2 text-[10px] bg-cyan-500/20 px-1.5 py-0.5 rounded text-cyan-400 uppercase">PB</span>}
                </td>
                <td className="px-6 py-4 text-gray-300">{lap.s1}</td>
                <td className="px-6 py-4 text-gray-300">{lap.s2}</td>
                <td className="px-6 py-4 text-gray-300">{lap.s3}</td>
                <td className="px-6 py-4 text-right">
                  <button className="text-gray-500 hover:text-cyan-400 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 inline">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SessionTable;