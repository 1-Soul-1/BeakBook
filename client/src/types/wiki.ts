export type Wiki = {
    id: number;
    name: string;
    description: string;
    author: string;
}

export type BirdPhoto = {
    id: number;
    name: string;
    bird_species: number;
    wiki: number | null;
    photographer: string;
    description: string;
    image: string;
}

export type BirdCall = {
    id: number;
    name: string;
    bird_species: number;
    description: string;
}