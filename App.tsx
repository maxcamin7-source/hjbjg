
import React, { useState, useEffect, useMemo } from 'react';
import { Layout } from './components/Layout';
import { PlayerMarketCard } from './components/PlayerMarketCard';
import { AIModal } from './components/AIModal';
import { Player, Portfolio, Holding, Trade } from './types';
import { MOCK_PLAYERS, INITIAL_BALANCE } from './constants';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { geminiService } from './services/geminiService';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'market' | 'portfolio'>('dashboard');
  const [balance, setBalance] = useState(INITIAL_BALANCE);
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [selectedPlayerForAI, setSelectedPlayerForAI] = useState<Player | null>(null);
  const [news, setNews] = useState<string>("Loading market news...");

  useEffect(() => {
    const fetchNews = async () => {
      const newsText = await geminiService.getMarketNews();
      setNews(newsText);
    };
    fetchNews();
  }, []);

  const portfolioValue = useMemo(() => {
    return holdings.reduce((acc, holding) => {
      const player = MOCK_PLAYERS.find(p => p.id === holding.playerId);
      return acc + (player ? player.currentPrice * holding.shares : 0);
    }, 0);
  }, [holdings]);

  const totalWealth = balance + portfolioValue;

  const handleTrade = (player: Player) => {
    setSelectedPlayerForAI(player);
  };

  const executeTrade = (type: 'BUY' | 'SELL', shares: number) => {
    if (!selectedPlayerForAI) return;
    
    const cost = selectedPlayerForAI.currentPrice * shares;

    if (type === 'BUY') {
      if (balance < cost) {
        alert("Insufficient funds!");
        return;
      }
      setBalance(prev => prev - cost);
      setHoldings(prev => {
        const existing = prev.find(h => h.playerId === selectedPlayerForAI.id);
        if (existing) {
          return prev.map(h => h.playerId === selectedPlayerForAI.id 
            ? { ...h, shares: h.shares + shares, avgBuyPrice: (h.avgBuyPrice * h.shares + cost) / (h.shares + shares) }
            : h
          );
        }
        return [...prev, { playerId: selectedPlayerForAI.id, shares, avgBuyPrice: selectedPlayerForAI.currentPrice }];
      });
    } else {
      const holding = holdings.find(h => h.playerId === selectedPlayerForAI.id);
      if (!holding || holding.shares < shares) {
        alert("Not enough shares!");
        return;
      }
      setBalance(prev => prev + cost);
      setHoldings(prev => {
        return prev.map(h => h.playerId === selectedPlayerForAI.id 
          ? { ...h, shares: h.shares - shares }
          : h
        ).filter(h => h.shares > 0);
      });
    }

    setTrades(prev => [{
      id: Math.random().toString(36).substr(2, 9),
      playerId: selectedPlayerForAI.id,
      type,
      shares,
      price: selectedPlayerForAI.currentPrice,
      timestamp: new Date().toISOString()
    }, ...prev]);
  };

  const renderDashboard = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-zinc-900/50 border border-zinc-800 p-6 rounded-3xl">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-1">Total Net Worth</h2>
              <div className="text-3xl font-black">${totalWealth.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
            </div>
            <div className="text-right">
              <div className="text-xs text-emerald-400 font-bold bg-emerald-500/10 px-2 py-1 rounded">
                +14.2% Overall
              </div>
            </div>
          </div>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={[
                { date: 'Mon', val: totalWealth * 0.95 },
                { date: 'Tue', val: totalWealth * 0.97 },
                { date: 'Wed', val: totalWealth * 0.96 },
                { date: 'Thu', val: totalWealth * 0.98 },
                { date: 'Fri', val: totalWealth },
              ]}>
                <defs>
                  <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="val" stroke="#10b981" fillOpacity={1} fill="url(#colorVal)" strokeWidth={3} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '12px' }}
                  itemStyle={{ color: '#10b981' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-3xl flex flex-col">
          <h2 className="text-zinc-300 font-bold mb-4 flex items-center gap-2">
             <span className="text-emerald-500">★</span> Trending News
          </h2>
          <div className="flex-1 overflow-auto space-y-4 pr-2">
            {news.split('\n').filter(line => line.trim()).map((n, i) => (
              <div key={i} className="border-l-2 border-emerald-500 pl-3 py-1">
                <p className="text-sm text-zinc-400 leading-snug">{n.replace(/^[-*•]\s+/, '')}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-4 border-t border-zinc-800">
             <button onClick={() => setActiveTab('market')} className="w-full text-center text-xs text-zinc-500 hover:text-white transition-colors uppercase font-bold tracking-widest">
               View All Markets
             </button>
          </div>
        </div>
      </div>

      <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-6">
        <h2 className="text-lg font-bold mb-6">Recent Trades</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-zinc-500 text-xs text-left uppercase tracking-wider">
                <th className="pb-4">Player</th>
                <th className="pb-4">Type</th>
                <th className="pb-4">Shares</th>
                <th className="pb-4">Price</th>
                <th className="pb-4">Total</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {trades.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-zinc-500 italic">No trades executed yet. Visit the market to start building your roster.</td>
                </tr>
              ) : (
                trades.map(trade => {
                  const player = MOCK_PLAYERS.find(p => p.id === trade.playerId);
                  return (
                    <tr key={trade.id} className="border-t border-zinc-800/50">
                      <td className="py-4 font-bold">{player?.name || 'Unknown'}</td>
                      <td className="py-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${trade.type === 'BUY' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                          {trade.type}
                        </span>
                      </td>
                      <td className="py-4 font-mono">{trade.shares}</td>
                      <td className="py-4 font-mono">${trade.price.toFixed(2)}</td>
                      <td className="py-4 font-mono font-bold">${(trade.shares * trade.price).toFixed(2)}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderMarket = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-black tracking-tight">Player Market</h2>
          <p className="text-zinc-500 text-sm">Real-time valuation based on fantasy performance.</p>
        </div>
        <div className="flex gap-2">
          {['All', 'QB', 'WR', 'RB', 'TE'].map(pos => (
            <button key={pos} className="bg-zinc-900 border border-zinc-800 px-3 py-1 rounded-lg text-xs font-bold text-zinc-400 hover:text-white hover:bg-zinc-800">
              {pos}
            </button>
          ))}
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_PLAYERS.map(player => (
          <PlayerMarketCard key={player.id} player={player} onTrade={handleTrade} />
        ))}
      </div>
    </div>
  );

  const renderPortfolio = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
             <h2 className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-1">Portfolio Assets</h2>
             <div className="text-4xl font-black">${portfolioValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
             <p className="text-sm text-zinc-500 mt-2">Managing {holdings.length} players</p>
          </div>
          <div className="flex gap-4">
            <div className="bg-zinc-800/50 p-4 rounded-2xl border border-zinc-700/50 text-center min-w-[120px]">
              <div className="text-[10px] text-zinc-500 uppercase font-bold mb-1">Available Cash</div>
              <div className="text-lg font-bold">${balance.toFixed(2)}</div>
            </div>
            <div className="bg-zinc-800/50 p-4 rounded-2xl border border-zinc-700/50 text-center min-w-[120px]">
              <div className="text-[10px] text-zinc-500 uppercase font-bold mb-1">Yield (24h)</div>
              <div className="text-lg font-bold text-emerald-400">+3.1%</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {holdings.length === 0 ? (
          <div className="py-20 text-center bg-zinc-900/20 border border-dashed border-zinc-800 rounded-3xl">
            <div className="text-4xl mb-4">🏈</div>
            <h3 className="text-xl font-bold mb-2">Your Roster is Empty</h3>
            <p className="text-zinc-500 max-w-sm mx-auto">Head to the market to scout top performers and start building your financial dynasty.</p>
            <button 
              onClick={() => setActiveTab('market')}
              className="mt-6 bg-emerald-500 text-black px-6 py-3 rounded-xl font-bold hover:bg-emerald-400 transition-colors"
            >
              Go to Market
            </button>
          </div>
        ) : (
          holdings.map(holding => {
            const player = MOCK_PLAYERS.find(p => p.id === holding.playerId);
            if (!player) return null;
            const currentTotal = player.currentPrice * holding.shares;
            const totalProfit = currentTotal - (holding.avgBuyPrice * holding.shares);
            const profitPct = (totalProfit / (holding.avgBuyPrice * holding.shares)) * 100;

            return (
              <div key={holding.playerId} className="bg-zinc-900/50 border border-zinc-800 p-5 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-4 hover:border-zinc-700 transition-all">
                <div className="flex items-center gap-4 w-full md:w-auto">
                  <img src={player.imageUrl} alt={player.name} className="w-14 h-14 rounded-xl object-cover" />
                  <div>
                    <h3 className="font-bold text-lg">{player.name}</h3>
                    <div className="text-xs text-zinc-500">{holding.shares} Shares @ ${holding.avgBuyPrice.toFixed(2)} avg</div>
                  </div>
                </div>
                
                <div className="flex flex-row md:flex-col justify-between md:items-end w-full md:w-auto border-t md:border-t-0 border-zinc-800 pt-4 md:pt-0">
                  <div className="text-lg font-mono font-bold">${currentTotal.toFixed(2)}</div>
                  <div className={`text-sm font-bold ${totalProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {totalProfit >= 0 ? '+' : ''}${totalProfit.toFixed(2)} ({profitPct.toFixed(1)}%)
                  </div>
                </div>

                <div className="flex gap-2 w-full md:w-auto">
                  <button 
                    onClick={() => handleTrade(player)}
                    className="flex-1 md:flex-none px-6 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-xl text-xs font-bold transition-all"
                  >
                    Quick Trade
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab} balance={balance}>
      {activeTab === 'dashboard' && renderDashboard()}
      {activeTab === 'market' && renderMarket()}
      {activeTab === 'portfolio' && renderPortfolio()}

      {selectedPlayerForAI && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <AIModal 
            player={selectedPlayerForAI} 
            onClose={() => setSelectedPlayerForAI(null)} 
          />
          
          {/* Quick Trade UI integrated into or near Modal for UX convenience */}
          <div className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-zinc-900 border border-zinc-700 p-4 rounded-3xl shadow-2xl z-[120] flex items-center gap-4 animate-in slide-in-from-bottom-10 duration-300">
            <div className="flex items-center gap-3 pr-4 border-r border-zinc-800">
               <img src={selectedPlayerForAI.imageUrl} className="w-10 h-10 rounded-lg" />
               <div className="font-bold">${selectedPlayerForAI.currentPrice.toFixed(2)}</div>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => { executeTrade('BUY', 1); setSelectedPlayerForAI(null); }}
                className="bg-emerald-500 text-black px-6 py-2 rounded-xl font-bold text-sm hover:bg-emerald-400"
              >
                Buy 1 Share
              </button>
              <button 
                onClick={() => { executeTrade('SELL', 1); setSelectedPlayerForAI(null); }}
                className="bg-zinc-800 text-white px-6 py-2 rounded-xl font-bold text-sm hover:bg-zinc-700"
              >
                Sell 1 Share
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default App;
