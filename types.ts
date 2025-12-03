export interface CastMember {
  role: string;
  actor: string;
}

export interface ShowRecord {
  id: string;
  title: string;
  date: string; // ISO string YYYY-MM-DD
  time: string;
  location: string;
  price: number;
  posterImage?: string; // Base64
  seatImage?: string; // Base64
  seatLocation?: string;
  cast: CastMember[];
  status: 'watched' | 'towatch';
  notes?: string;
}

export interface MonthlyStats {
  totalSpent: number;
  totalShows: number;
  uniqueShows: number;
}

export interface User {
  username: string;
  isLoggedIn: boolean;
}
