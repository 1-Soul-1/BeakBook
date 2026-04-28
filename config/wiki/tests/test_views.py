# tests/test_views.py
import pytest
from rest_framework.test import APIClient
from django.urls import reverse
from Birds.models import Wiki, BirdPhoto, BirdCall


@pytest.mark.django_db
class TestWikiViewSet:
    
    def setup_method(self):
        self.client = APIClient()
        self.wiki_data = {
            'name': 'Соловей',
            'description': 'Певчая птица',
            'author': 'Иван Иванов'
        }
    
    def test_list_wikis_empty(self):
        url = reverse('wiki-list')
        response = self.client.get(url)
        
        assert response.status_code == 200
        assert response.data == []
    
    def test_create_wiki(self):
        url = reverse('wiki-list')
        response = self.client.post(url, self.wiki_data, format='json')
        
        assert response.status_code == 201
        assert response.data['name'] == 'Соловей'
        assert Wiki.objects.count() == 1
    
    def test_retrieve_wiki(self):
        wiki = Wiki.objects.create(**self.wiki_data)
        url = reverse('wiki-detail', args=[wiki.id])
        response = self.client.get(url)
        
        assert response.status_code == 200
        assert response.data['name'] == 'Соловей'
    
    def test_update_wiki(self):
        wiki = Wiki.objects.create(**self.wiki_data)
        url = reverse('wiki-detail', args=[wiki.id])
        updated_data = {'name': 'Соловей-красношейка', 'description': 'Редкий вид'}
        
        response = self.client.patch(url, updated_data, format='json')
        
        assert response.status_code == 200
        assert response.data['name'] == 'Соловей-красношейка'
    
    def test_delete_wiki(self):
        wiki = Wiki.objects.create(**self.wiki_data)
        url = reverse('wiki-detail', args=[wiki.id])
        
        response = self.client.delete(url)
        
        assert response.status_code == 204
        assert Wiki.objects.count() == 0


@pytest.mark.django_db
class TestBirdPhotoViewSet:
    
    def setup_method(self):
        self.client = APIClient()
        self.wiki = Wiki.objects.create(name="Снегирь")
        self.photo_data = {
            'name': 'Снегирь на ветке',
            'bird_photo': self.wiki.id,
            'author': 'Петр Петров'
        }
    
    def test_create_bird_photo(self):
        url = reverse('birdphoto-list')
        response = self.client.post(url, self.photo_data, format='json')
        
        assert response.status_code == 201
        assert response.data['name'] == 'Снегирь на ветке'
        assert BirdPhoto.objects.count() == 1
    
    def test_create_bird_photo_without_author(self):
        url = reverse('birdphoto-list')
        data = {
            'name': 'Снегирь зимой',
            'bird_photo': self.wiki.id
        }
        response = self.client.post(url, data, format='json')
        
        assert response.status_code == 201
        assert response.data['author'] is None


@pytest.mark.django_db
class TestBirdCallViewSet:
    
    def setup_method(self):
        self.client = APIClient()
        self.call_data = {
            'description': 'Мелодичные трели'
        }
    
    def test_create_bird_call(self):
        url = reverse('birdcall-list')
        response = self.client.post(url, self.call_data, format='json')
        
        assert response.status_code == 201
        assert response.data['description'] == 'Мелодичные трели'
        assert BirdCall.objects.count() == 1
    
    def test_bird_call_str_method_in_api(self):
        bird_call = BirdCall.objects.create(description='Ку-ку')
        url = reverse('birdcall-detail', args=[bird_call.id])
        response = self.client.get(url)
        
        assert response.status_code == 200
        assert str(bird_call) in str(response.data)