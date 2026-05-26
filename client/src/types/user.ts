export type User = {
    id: number;
    name: string;
    email: string;
}

export type ObservationEntry = {
    id: number;
    name: string;
    user: number;
    bird_species: number[];
    wiki_articles: number[];
    bird_activity: string;
    notes: string;
    observation_date: string;
    location: string;
    location_obj: number | null;
    migration_route: number | null;
    nesting_site: number | null;
    nesting_status: number | null;
    sighting_during_migration: number | null;
    bird_photos: number[];
}