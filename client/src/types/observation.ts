export type Observation = {
  id: string;
  birdId: number;
  birdName: string;
  location: string;
  notes: string;
  date: string;
  photo?: string;
  favorite: boolean;
};