from rest_framework import serializers
from ..models import User, ObservationEntry

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'

class ObservationEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = ObservationEntry
        fields = '__all__'