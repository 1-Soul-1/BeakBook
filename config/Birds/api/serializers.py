from rest_framework import serializers
from ..models import Birds, Location, BirdSpecies, NestingSite, NestingStatus, MigrationRoute, SightingDuringMigration

class BirdsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Birds
        fields = '__all__'

class LocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Location
        fields = '__all__'

class BirdSpeciesSerializer(serializers.ModelSerializer):
    class Meta:
        model = BirdSpecies
        fields = '__all__'

class NestingSiteSerializer(serializers.ModelSerializer):
    class Meta:
        model = NestingSite
        fields = '__all__'

class NestingStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = NestingStatus
        fields = '__all__'

class MigrationRouteSerializer(serializers.ModelSerializer):
    class Meta:
        model = MigrationRoute
        fields = '__all__'

class SightingDuringMigrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = SightingDuringMigration
        fields = '__all__'