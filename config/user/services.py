from typing import List, Optional, Dict, Any
from django.db.models import Prefetch
from django.shortcuts import get_object_or_404
from Birds.models import BirdSpecies
from wiki.models import Wiki
from .models import User, ObservationEntry


class ObservationService:
    
    @staticmethod
    def get_user_with_observations(user_id: int) -> Optional[User]:
        user = User.objects.filter(id=user_id).prefetch_related(
            Prefetch('observations'),
            'observations__bird_species',  # ✅ добавляем prefetch для ManyToMany
            'observations__wiki_articles'   # ✅ добавляем prefetch для ManyToMany
        ).first()
        return user
    
    @staticmethod
    def get_observation_summary(user_id: int) -> dict:
        user = ObservationService.get_user_with_observations(user_id)
        if not user:
            return {}
        
        observations = list(user.observations.all())
        
        return {
            'user_name': user.name,
            'user_email': user.email,
            'total_observations': len(observations),
            'observations': observations
        }
    
    @staticmethod
    def get_observations_by_bird_species(species_id: int) -> List[ObservationEntry]:
        """Получить все наблюдения, где указан определенный вид птицы"""
        observations = ObservationEntry.objects.filter(bird_species__id=species_id)
        return list(observations)
    
    @staticmethod
    def get_observations_with_wiki_articles() -> List[ObservationEntry]:
        """Получить наблюдения, у которых есть связанные статьи"""
        observations = ObservationEntry.objects.filter(wiki_articles__isnull=False).distinct()
        return list(observations)
    
    @staticmethod
    def add_wiki_to_observation(observation_id: int, wiki_article_id: int) -> ObservationEntry:
        """Добавить статью к наблюдению (через ManyToMany)"""
        from wiki.models import Wiki
        observation = get_object_or_404(ObservationEntry, id=observation_id)
        wiki_article = get_object_or_404(Wiki, id=wiki_article_id)
        observation.wiki_articles.add(wiki_article)  # ✅ используем add() для ManyToMany
        observation.save()
        return observation
    
    @staticmethod
    def add_bird_species_to_observation(observation_id: int, species_id: int) -> ObservationEntry:
        """Добавить вид птицы к наблюдению (через ManyToMany)"""
        from Birds.models import BirdSpecies
        observation = get_object_or_404(ObservationEntry, id=observation_id)
        bird_species = get_object_or_404(BirdSpecies, id=species_id)
        observation.bird_species.add(bird_species)  # ✅ используем add() для ManyToMany
        observation.save()
        return observation
    
    @staticmethod
    def remove_wiki_from_observation(observation_id: int, wiki_article_id: int) -> ObservationEntry:
        """Удалить статью из наблюдения"""
        from wiki.models import Wiki
        observation = get_object_or_404(ObservationEntry, id=observation_id)
        wiki_article = get_object_or_404(Wiki, id=wiki_article_id)
        observation.wiki_articles.remove(wiki_article)  # ✅ используем remove() для ManyToMany
        observation.save()
        return observation
    
    @staticmethod
    def get_full_observation_details(observation_id: int) -> Dict[str, Any]:
        observation = get_object_or_404(
            ObservationEntry.objects.prefetch_related(
                'bird_species', 
                'wiki_articles',
                'user'
            ), 
            id=observation_id
        )
        return {
            'id': observation.id,
            'name': observation.name,
            'user': {
                'id': observation.user.id,
                'name': observation.user.name,
            },
            'bird_species': [
                {'id': species.id, 'name': species.name} 
                for species in observation.bird_species.all()
            ],  # ✅ возвращаем список видов
            'wiki_articles': [
                {'id': article.id, 'name': article.name} 
                for article in observation.wiki_articles.all()
            ],  # ✅ возвращаем список статей
            'bird_activity': observation.bird_activity,
            'notes': observation.notes,
            'location': observation.location,
            'observation_date': observation.observation_date,
        }
    
    @staticmethod
    def filter_observations_by_activity(activity_keyword: str) -> List[ObservationEntry]:
        observations = ObservationEntry.objects.filter(bird_activity__icontains=activity_keyword)
        return list(observations)
    
    @staticmethod
    def get_observations_by_multiple_species(species_ids: List[int]) -> List[ObservationEntry]:
        """Получить наблюдения, содержащие любые из указанных видов"""
        observations = ObservationEntry.objects.filter(bird_species__id__in=species_ids).distinct()
        return list(observations)
    
    @staticmethod
    def get_observations_by_multiple_wikis(wiki_ids: List[int]) -> List[ObservationEntry]:
        """Получить наблюдения, содержащие любые из указанных статей"""
        observations = ObservationEntry.objects.filter(wiki_articles__id__in=wiki_ids).distinct()
        return list(observations)