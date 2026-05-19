from typing import List, Set
from django.db.models import Prefetch
from .models import User, ObservationEntry

class ObservationService:
    
    @staticmethod
    def get_user_with_observations(user_id: int) -> User:
        user = User.objects.filter(id=user_id).prefetch_related(
            Prefetch('observationentry_set', queryset=ObservationEntry.objects.only('id', 'name', 'bird_activity'))
        ).first()
        return user
    
    @staticmethod
    def get_observations_by_user(user_ids: List[int]) -> List[ObservationEntry]:
        user_set = set(user_ids)
        observations = ObservationEntry.objects.filter(observation_entry_id__in=user_set).select_related('observation_entry')
        return list(observations)
    
    @staticmethod
    def get_users_with_notes() -> List[User]:
        users = User.objects.filter(observationentry__notes__isnull=False).distinct().prefetch_related(
            Prefetch('observationentry_set', queryset=ObservationEntry.objects.exclude(notes='').only('id', 'name', 'notes'))
        )
        return list(users)
    
    @staticmethod
    def filter_observations_by_activity(activity_keyword: str) -> List[ObservationEntry]:
        observations = ObservationEntry.objects.filter(bird_activity__icontains=activity_keyword).select_related('observation_entry')
        return list(observations)
    
    @staticmethod
    def get_all_users_with_observations() -> List[User]:
        users = User.objects.prefetch_related(
            Prefetch('observationentry_set', queryset=ObservationEntry.objects.only('id', 'name', 'bird_activity', 'notes'))
        ).all()
        return list(users)
    
    @staticmethod
    def get_observation_summary(user_id: int) -> dict:
        user = User.objects.filter(id=user_id).prefetch_related('observationentry_set').first()
        if not user:
            return {}
        observations = list(user.observationentry_set.all())
        return {
            'user_name': user.name,
            'total_observations': len(observations),
            'observations': observations
        }