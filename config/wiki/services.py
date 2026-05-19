from typing import List, Set
from django.db.models import Prefetch
from .models import Wiki, BirdPhoto, BirdCall

class WikiMediaService:
    
    @staticmethod
    def get_wiki_with_photos(wiki_ids: List[int]) -> List['Wiki']:
        wiki_set = set(wiki_ids)
        wikis = Wiki.objects.filter(id__in=wiki_set).prefetch_related(
            Prefetch('birdphoto_set', queryset=BirdPhoto.objects.only('id', 'name', 'photographer'))
        )
        return list(wikis)
    
    @staticmethod
    def get_photos_by_bird_species(species_id: int) -> List['BirdPhoto']:
        photos = BirdPhoto.objects.filter(bird_species_id=species_id).prefetch_related(
            Prefetch('wiki', queryset=Wiki.objects.only('id', 'name'))
        )
        return list(photos)
    
    @staticmethod
    def get_calls_by_bird_species(species_id: int) -> List['BirdCall']:
        calls = BirdCall.objects.filter(bird_species_id=species_id)
        return list(calls)
    
    @staticmethod
    def get_photos_with_wiki() -> List['BirdPhoto']:
        photos = BirdPhoto.objects.select_related('wiki').filter(wiki__isnull=False)
        return list(photos)
    
    @staticmethod
    def filter_photos_by_photographer(photographer_name: str) -> List['BirdPhoto']:
        photos = BirdPhoto.objects.filter(photographer__icontains=photographer_name).select_related('wiki')
        return list(photos)
    
    @staticmethod
    def get_wiki_with_media(wiki_id: int) -> 'Wiki':
        wiki = Wiki.objects.filter(id=wiki_id).prefetch_related(
            Prefetch('birdphoto_set', queryset=BirdPhoto.objects.only('id', 'name', 'image')),
            Prefetch('birdcall_set', queryset=BirdCall.objects.only('id', 'name'))
        ).first()
        return wiki
    
    @staticmethod
    def get_all_photos_grouped_by_species() -> List['BirdPhoto']:
        photos = BirdPhoto.objects.select_related('bird_species').filter(bird_species__isnull=False).order_by('bird_species__name')
        return list(photos)