from rest_framework import serializers
from ..models import Wiki, BirdPhoto, BirdCall

class WikiSerializer(serializers.ModelSerializer):
    class Meta:
        model = Wiki
        fields = '__all__'

class BirdPhotoSerializer(serializers.ModelSerializer):
    class Meta:
        model = BirdPhoto
        fields = '__all__'

class BirdCallSerializer(serializers.ModelSerializer):
    class Meta:
        model = BirdCall
        fields = '__all__'