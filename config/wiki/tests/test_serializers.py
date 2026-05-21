# wiki/tests/test_serializers.py
# python manage.py test wiki.tests
# pytest -v

import pytest
from django.test import TestCase
from wiki.models import Wiki, BirdPhoto, BirdCall
from wiki.api.serializers import WikiSerializer, BirdPhotoSerializer, BirdCallSerializer


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
class TestBirdPhotoSerializer(TestCase):
    
    def test_bird_photo_serializer_valid_data(self):
        wiki = Wiki.objects.create(name="Орел")
        data = {
            'name': 'Орел в полете',
            'wiki': wiki.id,
            'photographer': 'Анна Смирнова'
        }
        serializer = BirdPhotoSerializer(data=data)
        
        assert serializer.is_valid()
        bird_photo = serializer.save()
        assert bird_photo.name == 'Орел в полете'
        assert bird_photo.wiki == wiki
    
    def test_bird_photo_serializer_missing_wiki(self):
        """Поле wiki не обязательное, так как null=True, blank=True"""
        data = {
            'name': 'Фото птицы',
            'photographer': 'Автор'
        }
        serializer = BirdPhotoSerializer(data=data)
        
        # Поле wiki не обязательно, поэтому сериализатор должен быть валидным
        assert serializer.is_valid()
        bird_photo = serializer.save()
        assert bird_photo.wiki is None
        assert bird_photo.name == 'Фото птицы'
    
    def test_bird_photo_serializer_missing_name(self):
        """Поле name обязательное, так как не имеет null=True, blank=True"""
        data = {
            'wiki': 1,
            'photographer': 'Автор'
        }
        serializer = BirdPhotoSerializer(data=data)
        
        assert not serializer.is_valid()
        assert 'name' in serializer.errors


@pytest.mark.django_db
class TestBirdCallSerializer(TestCase):
    
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