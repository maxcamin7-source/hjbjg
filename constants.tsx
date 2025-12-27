
import { Player } from './types';

export const INITIAL_BALANCE = 10000;

export const MOCK_PLAYERS: Player[] = [
  {
    id: '1',
    name: 'Patrick Mahomes',
    team: 'KC',
    position: 'QB',
    currentPrice: 842.50,
    change24h: 2.4,
    priceHistory: [
      { date: '2024-01-01', price: 810 },
      { date: '2024-01-02', price: 815 },
      { date: '2024-01-03', price: 830 },
      { date: '2024-01-04', price: 825 },
      { date: '2024-01-05', price: 842.50 },
    ],
    stats: { points: 342, yards: 4183, tds: 27 },
    imageUrl: 'https://picsum.photos/seed/mahomes/200/200'
  },
  {
    id: '2',
    name: 'Justin Jefferson',
    team: 'MIN',
    position: 'WR',
    currentPrice: 715.20,
    change24h: -1.2,
    priceHistory: [
      { date: '2024-01-01', price: 720 },
      { date: '2024-01-02', price: 725 },
      { date: '2024-01-03', price: 710 },
      { date: '2024-01-04', price: 718 },
      { date: '2024-01-05', price: 715.20 },
    ],
    stats: { points: 288, yards: 1809, tds: 8 },
    imageUrl: 'https://picsum.photos/seed/jefferson/200/200'
  },
  {
    id: '3',
    name: 'Christian McCaffrey',
    team: 'SF',
    position: 'RB',
    currentPrice: 910.00,
    change24h: 4.8,
    priceHistory: [
      { date: '2024-01-01', price: 850 },
      { date: '2024-01-02', price: 865 },
      { date: '2024-01-03', price: 880 },
      { date: '2024-01-04', price: 895 },
      { date: '2024-01-05', price: 910.00 },
    ],
    stats: { points: 391, yards: 2023, tds: 21 },
    imageUrl: 'https://picsum.photos/seed/cmc/200/200'
  },
  {
    id: '4',
    name: 'Tyreek Hill',
    team: 'MIA',
    position: 'WR',
    currentPrice: 785.40,
    change24h: 0.5,
    priceHistory: [
      { date: '2024-01-01', price: 780 },
      { date: '2024-01-02', price: 775 },
      { date: '2024-01-03', price: 790 },
      { date: '2024-01-04', price: 782 },
      { date: '2024-01-05', price: 785.40 },
    ],
    stats: { points: 312, yards: 1799, tds: 13 },
    imageUrl: 'https://picsum.photos/seed/tyreek/200/200'
  },
  {
    id: '5',
    name: 'Josh Allen',
    team: 'BUF',
    position: 'QB',
    currentPrice: 820.10,
    change24h: -3.1,
    priceHistory: [
      { date: '2024-01-01', price: 840 },
      { date: '2024-01-02', price: 835 },
      { date: '2024-01-03', price: 830 },
      { date: '2024-01-04', price: 825 },
      { date: '2024-01-05', price: 820.10 },
    ],
    stats: { points: 385, yards: 4306, tds: 29 },
    imageUrl: 'https://picsum.photos/seed/joshallen/200/200'
  }
];
