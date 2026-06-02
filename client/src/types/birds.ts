export type ConservationStatus = 'исчезающий' | 'редкий' | 'уязвимый' | 'обычный';

export type BirdSpecies = {
  name: string;
  family: string;
  status: ConservationStatus;
  statusText: string;
  statusClass: string; // 'endangered' | 'vulnerable' | 'rare' | 'common'
};