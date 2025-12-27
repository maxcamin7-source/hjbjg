
export type PlayerPosition = 'QB' | 'RB' | 'WR' | 'TE' | 'K' | 'DEF';

export interface Player {
  id: string;
  name: string;
  team: string;
  position: PlayerPosition;
  currentPrice: number;
  change24h: number;
  priceHistory: { date: string; price: number }[];
  stats: {
    points: number;
    yards: number;
    tds: number;
  };
  imageUrl: string;
}

export interface Holding {
  playerId: string;
  shares: number;
  avgBuyPrice: number;
}

export interface Portfolio {
  balance: number;
  holdings: Holding[];
  history: { timestamp: string; totalValue: number }[];
}

export interface Trade {
  id: string;
  playerId: string;
  type: 'BUY' | 'SELL';
  shares: number;
  price: number;
  timestamp: string;
}

export interface AIInsight {
  summary: string;
  recommendation: 'BUY' | 'SELL' | 'HOLD';
  confidence: number;
  reasoning: string[];
}
