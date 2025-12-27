
import React, { useEffect, useState } from 'react';
import { Player, AIInsight } from '../types';
import { geminiService } from '../services/geminiService';

interface AIModalProps {
  player: Player;
  onClose: () => void;
}

export const AIModal: React.FC<AIModalProps> = ({ player, onClose }) => {
  const [insight, setInsight] = useState<AIInsight | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInsight = async () => {
      setLoading(true);
      const data = await geminiService.getPlayerInsight(player);
      setInsight(data);
      setLoading(false);
    };
    fetchInsight();
  }, [player]);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-zinc-800 w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="p-6 border-b border-zinc-800 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-black font-bold">AI</div>
            <div>
              <h2 className="text-lg font-bold">Scout Report</h2>
              <p className="text-xs text-zinc-500">Analysis for {player.name}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-zinc-500 hover:text-white p-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-8">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 gap-4">
              <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-zinc-500 animate-pulse font-mono text-sm tracking-wider">CALCULATING PROBABILITIES...</p>
            </div>
          ) : insight ? (
            <div className="space-y-6">
              <div className="flex justify-between items-center bg-zinc-800/50 p-4 rounded-2xl border border-zinc-700/50">
                <div>
                  <div className="text-xs text-zinc-500 uppercase font-bold tracking-widest mb-1">Recommendation</div>
                  <div className={`text-2xl font-black ${insight.recommendation === 'BUY' ? 'text-emerald-400' : insight.recommendation === 'SELL' ? 'text-rose-400' : 'text-amber-400'}`}>
                    {insight.recommendation}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-zinc-500 uppercase font-bold tracking-widest mb-1">Confidence</div>
                  <div className="text-2xl font-mono font-bold">{(insight.confidence * 100).toFixed(0)}%</div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-zinc-300 mb-2">Summary</h3>
                <p className="text-zinc-400 leading-relaxed text-sm italic">"{insight.summary}"</p>
              </div>

              <div>
                <h3 className="text-sm font-bold text-zinc-300 mb-2">Key Insights</h3>
                <ul className="space-y-2">
                  {insight.reasoning.map((reason, i) => (
                    <li key={i} className="flex gap-3 items-start text-xs text-zinc-400">
                      <span className="text-emerald-500 font-bold">•</span>
                      <span>{reason}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : null}
        </div>

        <div className="p-6 bg-zinc-800/30 border-t border-zinc-800 flex gap-4">
           <button 
             onClick={onClose}
             className="flex-1 bg-emerald-500 text-black font-bold py-3 rounded-xl hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-500/10"
           >
             Close Report
           </button>
        </div>
      </div>
    </div>
  );
};
