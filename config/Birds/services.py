from typing import List, Set
from django.db.models import Prefetch
from .models import Birds, Location, BirdSpecies, NestingSite, NestingStatus, MigrationRoute, SightingDuringMigration

class BirdObservationService:
    
    @staticmethod
    def get_birds_by_location(location_id: int) -> List['Birds']:
        birds = Birds.objects.filter(location_id=location_id).prefetch_related(
            Prefetch('birdspecies_set', queryset=BirdSpecies.objects.only('id', 'name'))
        )
        return list(birds)
    
    @staticmethod
    def get_birds_with_nesting_status() -> List['Birds']:
        birds = Birds.objects.prefetch_related(
            Prefetch('nestingstatus_set', queryset=NestingStatus.objects.select_related('nesting_site'))
        ).all()
        return list(birds)
    
    @staticmethod
    def get_species_by_conservation_status(status: str) -> List['BirdSpecies']:
        species = BirdSpecies.objects.filter(conservation_status=status).prefetch_related(
            Prefetch('birds_set', queryset=Birds.objects.only('id', 'name'))
        )
        return list(species)
    
    @staticmethod
    def get_migration_routes_with_sightings() -> List['MigrationRoute']:
        routes = MigrationRoute.objects.prefetch_related(
            Prefetch('sightingduringmigration_set', queryset=SightingDuringMigration.objects.only('id', 'name'))
        ).all()
        return list(routes)
    
    @staticmethod
    def get_nesting_sites_with_statuses() -> List['NestingSite']:
        sites = NestingSite.objects.prefetch_related(
            Prefetch('nestingstatus_set', queryset=NestingStatus.objects.only('id', 'name'))
        ).all()
        return list(sites)
    
    @staticmethod
    def filter_birds_by_species(species_ids: List[int]) -> List['Birds']:
        bird_species_set = set(species_ids)
        birds = Birds.objects.prefetch_related(
            Prefetch('birdspecies_set', queryset=BirdSpecies.objects.only('id'))
        )
        result = []
        for bird in birds:
            bird_species_ids = set(bird.birdspecies_set.values_list('id', flat=True))
            if bird_species_ids.issubset(bird_species_set):
                result.append(bird)
        return result
    
    @staticmethod
    def get_all_locations_with_birds() -> List['Location']:
        return Location.objects.prefetch_related('birds_set').all()