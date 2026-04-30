# tests/test_serializers.py
# python manage.py test wiki.tests
import pytest
from django.test import TestCase
from ..models import Wiki, BirdPhoto, BirdCall
from ..serializers import WikiSerializer, BirdPhotoSerializer, BirdCallSerializer


@pytest.mark.django_db
class TestWikiSerializer(TestCase):
    
    def test_wiki_serializer_valid_data(self):
        data = {
            'name': 'Филин',
            'description': 'Ночная хищная птица',
            'author': 'Михаил Сидоров'
        }
        serializer = WikiSerializer(data=data)
        
        assert serializer.is_valid()
        wiki = serializer.save()
        assert wiki.name == 'Филин'
    
    def test_wiki_serializer_missing_name(self):
        data = {
            'description': 'Только описание',
            'author': 'Автор'
        }
        serializer = WikiSerializer(data=data)
        
        assert not serializer.is_valid()
        assert 'name' in serializer.errors


@pytest.mark.django_db
class TestBirdPhotoSerializer:
    
    def test_bird_photo_serializer_valid_data(self):
        wiki = Wiki.objects.create(name="Орел")
        data = {
            'name': 'Орел в полете',
            'bird_photo': wiki.id,
            'author': 'Анна Смирнова'
        }
        serializer = BirdPhotoSerializer(data=data)
        
        assert serializer.is_valid()
        bird_photo = serializer.save()
        assert bird_photo.name == 'Орел в полете'
        assert bird_photo.bird_photo == wiki
    
    def test_bird_photo_serializer_missing_bird_photo(self):
        data = {
            'name': 'Фото птицы',
            'author': 'Автор'
        }
        serializer = BirdPhotoSerializer(data=data)
        
        assert not serializer.is_valid()
        assert 'bird_photo' in serializer.errors


@pytest.mark.django_db
class TestBirdCallSerializer:
    
    def test_bird_call_serializer_valid_data(self):
        data = {
            'description': 'Трели соловья'
        }
        serializer = BirdCallSerializer(data=data)
        
        assert serializer.is_valid()
        bird_call = serializer.save()
        assert bird_call.description == 'Трели соловья'
    
    def test_bird_call_serializer_empty_description(self):
        data = {'description': ''}
        serializer = BirdCallSerializer(data=data)
        
        assert serializer.is_valid()
        bird_call = serializer.save()
        assert bird_call.description == ''