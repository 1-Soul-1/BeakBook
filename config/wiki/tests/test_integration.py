# tests/test_integration.py
# python manage.py test wiki.tests
import pytest
from django.test import TestCase
from ..models import Wiki, BirdPhoto, BirdCall


@pytest.mark.django_db
class TestIntegration(TestCase):
    
    def test_complete_bird_workflow(self):
        wiki = Wiki.objects.create(
            name="Соловей",
            description="Знаменитая певчая птица",
            author="Орнитолог Иванов"
        )
        
        photo = BirdPhoto.objects.create(
            name="Соловей поет",
            bird_photo=wiki,
            author="Фотограф Петров"
        )
        
        bird_call = BirdCall.objects.create(
            description="Сложные трели с щелчками и свистами"
        )
        
        assert wiki.birdphoto_set.count() == 1
        assert wiki.birdphoto_set.first().name == "Соловей поет"
        
        wiki.delete()
        assert BirdPhoto.objects.filter(id=photo.id).count() == 0
        assert BirdCall.objects.filter(id=bird_call.id).count() == 1