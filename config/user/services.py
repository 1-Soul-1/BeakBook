from typing import List, Optional, Dict, Any
from django.db.models import Prefetch
from django.shortcuts import get_object_or_404
from .models import User, ObservationEntry


class ObservationService:
    
    @staticmethod
    def get_user_with_observations(user_id: int) -> Optional[User]:
        user = User.objects.filter(id=user_id).prefetch_related(
            Prefetch('observations')
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
        observations = ObservationEntry.objects.filter(bird_species_id=species_id)
        return list(observations)
    
    @staticmethod
    def get_observations_with_wiki_articles() -> List[ObservationEntry]:
        observations = ObservationEntry.objects.filter(wiki_article__isnull=False)
        return list(observations)
    
    @staticmethod
    def add_wiki_to_observation(observation_id: int, wiki_article_id: int) -> ObservationEntry:
        from wiki.models import Wiki
        observation = get_object_or_404(ObservationEntry, id=observation_id)
        wiki_article = get_object_or_404(Wiki, id=wiki_article_id)
        observation.wiki_article = wiki_article
        observation.save()
        return observation
    
    @staticmethod
    def get_full_observation_details(observation_id: int) -> Dict[str, Any]:
        observation = get_object_or_404(ObservationEntry, id=observation_id)
        return {
            'id': observation.id,
            'name': observation.name,
            'user': {
                'id': observation.user.id,
                'name': observation.user.name,
            },
            'bird_activity': observation.bird_activity,
            'notes': observation.notes,
            'location': observation.location,
            'observation_date': observation.observation_date,
        }
    
    @staticmethod
    def filter_observations_by_activity(activity_keyword: str) -> List[ObservationEntry]:
        observations = ObservationEntry.objects.filter(bird_activity__icontains=activity_keyword)
        return list(observations)