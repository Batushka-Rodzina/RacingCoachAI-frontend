// src/components/Sidebar.tsx
import React from 'react';
import { Link } from 'react-router-dom';

interface SidebarProps {
  activeTab?: 'dashboard' | 'telemetry';
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab = 'dashboard' }) => {
  return (
    <aside className="w-64 bg-neutral-950 border-r border-white/10 p-6 flex flex-col">
      <div 
        className="mb-10 text-2xl font-orbitron font-bold tracking-widest"
        style={{ color: '#bffa76' }}
      >
        BOLIDE
      </div>
      
      <nav className="flex-1 space-y-2">
        <SidebarItem 
          label="Overview" 
          to="/dashboard" 
          active={activeTab === 'dashboard'} 
        />
        <SidebarItem 
          label="Telemetry" 
          to="/telemetry" 
          active={activeTab === 'telemetry'} 
        />
      </nav>

      <div className="mt-auto pt-6 border-t border-white/10">
        <Link to="/login" className="text-gray-500 hover:text-red-400 text-sm transition-colors">
          Log out
        </Link>
      </div>
    </aside>
  );
};

const SidebarItem = ({ label, to, active = false }: { label: string, to: string, active?: boolean }) => (
  <Link to={to} className="block">
    <div 
      className={`px-4 py-3 rounded-lg cursor-pointer transition-all ${
        active ? 'text-black font-bold' : 'text-gray-400 hover:bg-white/5 hover:text-white'
      }`}
      style={active ? { backgroundColor: '#bffa76' } : {}}
    >
      {label}
    </div>
  </Link>
);

export default Sidebar;