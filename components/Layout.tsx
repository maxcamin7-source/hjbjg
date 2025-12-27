
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: 'dashboard' | 'market' | 'portfolio') => void;
  balance: number;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab, balance }) => {
  return (
    <div className="min-h-screen flex flex-col max-w-5xl mx-auto px-4 sm:px-6">
      <header className="py-6 flex justify-between items-center sticky top-0 bg-[#0a0a0c] z-50 border-b border-zinc-800/50 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <div className="bg-emerald-500 text-black font-bold px-2 py-1 rounded text-sm tracking-tighter">GSE</div>
          <h1 className="text-xl font-bold tracking-tight">Gridiron Stock Exchange</h1>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Buying Power</span>
            <span className="text-emerald-400 font-mono font-bold text-lg">
              ${balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </header>

      <main className="flex-1 py-6">
        {children}
      </main>

      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-zinc-900/90 border border-zinc-800 px-2 py-2 rounded-2xl flex items-center gap-2 shadow-2xl backdrop-blur-xl z-50">
        <button 
          onClick={() => setActiveTab('dashboard')}
          className={`px-6 py-2 rounded-xl transition-all ${activeTab === 'dashboard' ? 'bg-emerald-500 text-black font-semibold' : 'text-zinc-400 hover:text-white hover:bg-zinc-800'}`}
        >
          Dashboard
        </button>
        <button 
          onClick={() => setActiveTab('market')}
          className={`px-6 py-2 rounded-xl transition-all ${activeTab === 'market' ? 'bg-emerald-500 text-black font-semibold' : 'text-zinc-400 hover:text-white hover:bg-zinc-800'}`}
        >
          Market
        </button>
        <button 
          onClick={() => setActiveTab('portfolio')}
          className={`px-6 py-2 rounded-xl transition-all ${activeTab === 'portfolio' ? 'bg-emerald-500 text-black font-semibold' : 'text-zinc-400 hover:text-white hover:bg-zinc-800'}`}
        >
          Portfolio
        </button>
      </nav>
      
      <div className="h-24"></div> {/* Bottom spacing for nav */}
    </div>
  );
};
