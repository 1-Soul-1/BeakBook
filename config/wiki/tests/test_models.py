# tests/test_models.py
import pytest
from ..models import Wiki, BirdPhoto, BirdCall


@pytest.mark.django_db
class TestWikiModel:
    
    def test_create_wiki_with_all_fields(self):
        wiki = Wiki.objects.create(
            name="Соловей",
            description="Певчая птица семейства мухоловковых",
            author="Иван Иванов"
        )
        
        assert wiki.id is not None
        assert wiki.name == "Соловей"
        assert wiki.description == "Певчая птица семейства мухоловковых"
        assert wiki.author == "Иван Иванов"
    
    def test_create_wiki_with_minimal_fields(self):
        wiki = Wiki.objects.create(name="Воробей")
        
        assert wiki.id is not None
        assert wiki.name == "Воробей"
        assert wiki.description is None
        assert wiki.author is None
    
    def test_wiki_str_method(self):
        wiki = Wiki.objects.create(name="Синица")
        
        assert str(wiki) == "Синица"
    
    def test_wiki_blank_fields(self):
        wiki = Wiki.objects.create(
            name="Дятел",
            description="",
            author=""
        )
        
        assert wiki.description == ""
        assert wiki.author == ""


@pytest.mark.django_db
class TestBirdPhotoModel:
    
    def test_create_bird_photo(self):
        wiki = Wiki.objects.create(name="Снегирь")
        bird_photo = BirdPhoto.objects.create(
            name="Снегирь на ветке",
            bird_photo=wiki,
            author="Петр Петров"
        )
        
        assert bird_photo.id is not None
        assert bird_photo.name == "Снегирь на ветке"
        assert bird_photo.bird_photo == wiki
        assert bird_photo.author == "Петр Петров"
    
    def test_bird_photo_str_method(self):
        wiki = Wiki.objects.create(name="Клёст")
        bird_photo = BirdPhoto.objects.create(
            name="Клёст на елке",
            bird_photo=wiki
        )
        
        assert str(bird_photo) == "Клёст на елке"
    
    def test_bird_photo_cascade_delete(self):
        wiki = Wiki.objects.create(name="Кукушка")
        bird_photo = BirdPhoto.objects.create(
            name="Кукушка в лесу",
            bird_photo=wiki
        )
        
        wiki.delete()
        
        assert BirdPhoto.objects.filter(id=bird_photo.id).count() == 0
    
    def test_bird_photo_optional_author(self):
        wiki = Wiki.objects.create(name="Галка")
        bird_photo = BirdPhoto.objects.create(
            name="Галка на крыше",
            bird_photo=wiki,
            author=None
        )
        
        assert bird_photo.author is None
        assert bird_photo.id is not None


@pytest.mark.django_db
class TestBirdCallModel:
    
    def test_create_bird_call_with_description(self):
        bird_call = BirdCall.objects.create(
            description="Мелодичный свист, похожий на флейту"
        )
        
        assert bird_call.id is not None
        assert bird_call.description == "Мелодичный свист, похожий на флейту"
    
    def test_create_bird_call_without_description(self):
        bird_call = BirdCall.objects.create(description=None)
        
        assert bird_call.id is not None
        assert bird_call.description is None
    
    def test_bird_call_str_method_with_description(self):
        bird_call = BirdCall.objects.create(
            description="Громкое 'ку-ку'"
        )
        
        assert str(bird_call) == "Громкое 'ку-ку'"
    
    def test_bird_call_str_method_empty_description(self):
        bird_call = BirdCall.objects.create(description=None)
        
        assert str(bird_call) is None
    
    def test_bird_call_blank_description(self):
        bird_call = BirdCall.objects.create(description="")
        
        assert bird_call.description == ""


# tests/test_serializers.py
import pytest
from ..models import Wiki, BirdPhoto, BirdCall
from ..serializers import WikiSerializer, BirdPhotoSerializer, BirdCallSerializer


@pytest.mark.django_db
class TestWikiSerializer:
    
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


# tests/test_views.py
import pytest
from rest_framework.test import APIClient
from django.urls import reverse
from ..models import Wiki, BirdPhoto, BirdCall


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


# tests/test_integration.py
import pytest
from ..models import Wiki, BirdPhoto, BirdCall


@pytest.mark.django_db
class TestIntegration:
    
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
