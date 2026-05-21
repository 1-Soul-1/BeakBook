from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from user.models import User, ObservationEntry
from user.api.serializers import (
    UserSerializer, ObservationEntrySerializer, 
    CreateObservationSerializer, UserWithObservationsSerializer  # ✅ теперь импорт работает
)
from user.services import ObservationService


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    
    @action(detail=True, methods=['get'])
    def observations(self, request, pk=None):
        """Получить пользователя с его наблюдениями"""
        user = ObservationService.get_user_with_observations(pk)
        if not user:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = UserWithObservationsSerializer(user)
        return Response(serializer.data)


class ObservationEntryViewSet(viewsets.ModelViewSet):
    queryset = ObservationEntry.objects.all()
    serializer_class = ObservationEntrySerializer
    
    def get_serializer_class(self):
        if self.action == 'create':
            return CreateObservationSerializer
        return ObservationEntrySerializer
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        data = serializer.validated_data
        
        # Извлекаем ManyToMany поля
        bird_species_list = data.pop('bird_species', [])
        wiki_articles_list = data.pop('wiki_articles', [])
        
        observation = ObservationEntry.objects.create(**data)
        
        # Добавляем связи ManyToMany
        observation.bird_species.set(bird_species_list)
        observation.wiki_articles.set(wiki_articles_list)
        
        result_serializer = ObservationEntrySerializer(observation)
        return Response(result_serializer.data, status=status.HTTP_201_CREATED)