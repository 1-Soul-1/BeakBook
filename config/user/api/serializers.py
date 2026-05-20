from rest_framework import serializers
from user.models import User, ObservationEntry


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'


class ObservationEntrySerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.name', read_only=True)
    
    class Meta:
        model = ObservationEntry
        fields = '__all__'
        read_only_fields = ['observation_date']


# Временный упрощенный сериализатор для создания
class CreateObservationSerializer(serializers.ModelSerializer):
    class Meta:
        model = ObservationEntry
        fields = ['name', 'user', 'bird_species', 'wiki_article', 'bird_activity', 'notes', 'location']


# Временный упрощенный сериализатор
class UserWithObservationsSerializer(serializers.ModelSerializer):
    observations = ObservationEntrySerializer(many=True, read_only=True)
    total_observations = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = ['id', 'name', 'email', 'observations', 'total_observations']
    
    def get_total_observations(self, obj):
        return obj.observations.count()