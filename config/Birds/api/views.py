from rest_framework import viewsets
from ..models import Birds, Location, BirdSpecies, NestingSite, NestingStatus, MigrationRoute, SightingDuringMigration
from .serializers import BirdsSerializer, LocationSerializer, BirdSpeciesSerializer, NestingSiteSerializer, NestingStatusSerializer, MigrationRouteSerializer, SightingDuringMigrationSerializer

class BirdsViewSet(viewsets.ModelViewSet):
    queryset = Birds.objects.all()
    serializer_class = BirdsSerializer

class LocationViewSet(viewsets.ModelViewSet):
    queryset = Location.objects.all()
    serializer_class = LocationSerializer

class BirdSpeciesViewSet(viewsets.ModelViewSet):
    queryset = BirdSpecies.objects.all()
    serializer_class = BirdSpeciesSerializer

class NestingSiteViewSet(viewsets.ModelViewSet):
    queryset = NestingSite.objects.all()
    serializer_class = NestingSiteSerializer

class NestingStatusViewSet(viewsets.ModelViewSet):
    queryset = NestingStatus.objects.all()
    serializer_class = NestingStatusSerializer

class MigrationRouteViewSet(viewsets.ModelViewSet):
    queryset = MigrationRoute.objects.all()
    serializer_class = MigrationRouteSerializer

class SightingDuringMigrationViewSet(viewsets.ModelViewSet):
    queryset = SightingDuringMigration.objects.all()
    serializer_class = SightingDuringMigrationSerializer

# Валидациявходящих данных; вызов метода серивеса; сериализация результатов.