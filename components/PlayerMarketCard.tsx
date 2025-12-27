
import React from 'react';
import { Player } from '../types';
import { LineChart, Line, ResponsiveContainer, YAxis } from 'recharts';

interface PlayerMarketCardProps {
  player: Player;
  onTrade: (player: Player) => void;
}

export const PlayerMarketCard: React.FC<PlayerMarketCardProps> = ({ player, onTrade }) => {
  const isUp = player.change24h >= 0;

  return (
    <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-4 hover:border-zinc-700 transition-all group relative overflow-hidden">
      <div className="flex justify-between items-start mb-4">
        <div className="flex gap-3">
          <img src={player.imageUrl} alt={player.name} className="w-12 h-12 rounded-xl object-cover border border-zinc-800" />
          <div>
            <h3 className="font-bold group-hover:text-emerald-400 transition-colors">{player.name}</h3>
            <div className="flex items-center gap-2 text-xs text-zinc-500">
              <span className="bg-zinc-800 px-1.5 py-0.5 rounded font-mono text-zinc-400">{player.position}</span>
              <span>{player.team}</span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="font-mono font-bold">${player.currentPrice.toFixed(2)}</div>
          <div className={`text-xs font-medium ${isUp ? 'text-emerald-400' : 'text-rose-400'}`}>
            {isUp ? '+' : ''}{player.change24h}%
          </div>
        </div>
      </div>

      <div className="h-24 w-full mb-4 opacity-50 group-hover:opacity-100 transition-opacity">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={player.priceHistory}>
            <YAxis hide domain={['dataMin - 5', 'dataMax + 5']} />
            <Line 
              type="monotone" 
              dataKey="price" 
              stroke={isUp ? '#10b981' : '#f43f5e'} 
              strokeWidth={2} 
              dot={false} 
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <button 
        onClick={() => onTrade(player)}
        className="w-full bg-zinc-800 hover:bg-emerald-500 hover:text-black py-2.5 rounded-xl font-bold text-sm transition-all"
      >
        Trade Now
      </button>
    </div>
  );
};
