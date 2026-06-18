// src/types/observation.ts
export type Observation = {
  id: number;
  birdName: string;
  family: string;
  status: 'исчезающий' | 'редкий' | 'уязвимый' | 'обычный';
  statusText: string;
  statusClass: string;
  location: string;
  notes: string;
  date: string;        // YYYY-MM-DD
  timestamp: number;
  favorite: boolean;
  photo: string | null;
};