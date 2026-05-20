from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from user.models import User, ObservationEntry
from user.api.serializers import (
    UserSerializer, ObservationEntrySerializer, 
    CreateObservationSerializer, UserWithObservationsSerializer
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
        """Создание наблюдения с привязкой к птице и статье"""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        data = serializer.validated_data
        
        observation = ObservationEntry.objects.create(
            user=data['user'],
            name=data['name'],
            bird_species=data.get('bird_species'),
            wiki_article=data.get('wiki_article'),
            bird_activity=data.get('bird_activity', ''),
            notes=data.get('notes', ''),
            location=data.get('location', '')
        )
        
        result_serializer = ObservationEntrySerializer(observation)
        return Response(result_serializer.data, status=status.HTTP_201_CREATED)