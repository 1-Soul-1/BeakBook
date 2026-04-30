# tests/test_models.py
# python manage.py test wiki.tests

import pytest
from django.test import TestCase
from wiki.models import Wiki, BirdPhoto, BirdCall


@pytest.mark.django_db
class TestWikiModel(TestCase):
    
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
class TestBirdPhotoModel(TestCase):
    
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
class TestBirdCallModel(TestCase):
    
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
        # Теперь это не вызовет ошибку, так как __str__ возвращает строку
        assert str(bird_call) == "Без описания"  # или "" если вы выбрали пустую строку
    
    def test_bird_call_str_method_blank_description(self):
        bird_call = BirdCall.objects.create(description="")
        # В зависимости от реализации __str__
        assert str(bird_call) == "" or str(bird_call) == "Без описания"