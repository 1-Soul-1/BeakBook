from rest_framework import serializers
from user.models import User, ObservationEntry
from Birds.models import BirdSpecies
from wiki.models import Wiki


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'


class ObservationEntrySerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.name', read_only=True)
    bird_species_names = serializers.SlugRelatedField(
        many=True, read_only=True, slug_field='name', source='bird_species'
    )
    wiki_article_titles = serializers.SlugRelatedField(
        many=True, read_only=True, slug_field='name', source='wiki_articles'
    )
    bird_photos_ids = serializers.PrimaryKeyRelatedField(
        many=True, read_only=True, source='bird_photos'
    )

    class Meta:
        model = ObservationEntry
        fields = '__all__'
        read_only_fields = ['observation_date']


class CreateObservationSerializer(serializers.ModelSerializer):
    bird_species = serializers.PrimaryKeyRelatedField(
        many=True, queryset=BirdSpecies.objects.all(), required=False
    )
    wiki_articles = serializers.PrimaryKeyRelatedField(
        many=True, queryset=Wiki.objects.all(), required=False
    )

    class Meta:
        model = ObservationEntry
        fields = [
            'name', 'user', 'bird_species', 'wiki_articles',
            'bird_activity', 'notes', 'location_obj',
            'migration_route', 'nesting_site', 'nesting_status',
            'sighting_during_migration', 'bird_photos', 'location'
        ]


# ✅ Добавьте этот класс обратно
class UserWithObservationsSerializer(serializers.ModelSerializer):
    observations = ObservationEntrySerializer(many=True, read_only=True)
    total_observations = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = ['id', 'name', 'email', 'observations', 'total_observations']
    
    def get_total_observations(self, obj):
        return obj.observations.count()