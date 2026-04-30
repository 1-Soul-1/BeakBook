# tests/test_serializers.py
# python manage.py test Birds.tests
import pytest
from django.test import TestCase
from Birds.models import (
    Birds, Location, BirdSpecies, NestingSite, 
    NestingStatus, MigrationRoute, SightingDuringMigration
)
from ..serializers import (
    BirdsSerializer, LocationSerializer, BirdSpeciesSerializer,
    NestingSiteSerializer, NestingStatusSerializer,
    MigrationRouteSerializer, SightingDuringMigrationSerializer
)


@pytest.mark.django_db
class TestBirdsSerializer(TestCase):
    
    def test_birds_serializer_valid_data(self):
        # Тест валидации корректных данных для сериализатора Birds
        data = {
            'name': 'Скворец',
            'description': 'Перелетная певчая птица'
        }
        serializer = BirdsSerializer(data=data)
        
        assert serializer.is_valid()
        bird = serializer.save()
        assert bird.name == 'Скворец'
    
    def test_birds_serializer_missing_name(self):
        # Тест валидации при отсутствии обязательного поля name
        data = {'description': 'Только описание'}
        serializer = BirdsSerializer(data=data)
        
        assert not serializer.is_valid()
        assert 'name' in serializer.errors


@pytest.mark.django_db
class TestLocationSerializer(TestCase):
    
    def test_location_serializer_valid_data(self):
        # Тест валидации корректных данных для сериализатора Location
        data = {
            'name': 'Залив',
            'description': 'Мелководный залив с камышами'
        }
        serializer = LocationSerializer(data=data)
        
        assert serializer.is_valid()
        location = serializer.save()
        assert location.name == 'Залив'
    
    def test_location_serializer_missing_name(self):
        # Тест валидации при отсутствии обязательного поля name у локации
        data = {'description': 'Описание места'}
        serializer = LocationSerializer(data=data)
        
        assert not serializer.is_valid()
        assert 'name' in serializer.errors


@pytest.mark.django_db
class TestBirdSpeciesSerializer(TestCase):
    
    def test_bird_species_serializer_valid_data(self):
        # Тест валидации корректных данных для сериализатора BirdSpecies
        data = {
            'name': 'Беркут',
            'family': 'Ястребиные',
            'typical_nesting': 'Скалы, большие деревья',
            'conservation_status': 'Редкий вид',
            'description': 'Крупный орел'
        }
        serializer = BirdSpeciesSerializer(data=data)
        
        assert serializer.is_valid()
        species = serializer.save()
        assert species.name == 'Беркут'
    
    def test_bird_species_serializer_missing_name(self):
        # Тест валидации при отсутствии обязательного поля name у вида птицы
        data = {'family': 'Врановые'}
        serializer = BirdSpeciesSerializer(data=data)
        
        assert not serializer.is_valid()
        assert 'name' in serializer.errors


@pytest.mark.django_db
class TestNestingSiteSerializer(TestCase):
    
    def test_nesting_site_serializer_valid_data(self):
        # Тест валидации корректных данных для сериализатора NestingSite
        data = {
            'name': 'Плато',
            'description': 'Открытое возвышенное место'
        }
        serializer = NestingSiteSerializer(data=data)
        
        assert serializer.is_valid()
        site = serializer.save()
        assert site.name == 'Плато'
    
    def test_nesting_site_serializer_missing_name(self):
        # Тест валидации при отсутствии обязательного поля name у места гнездования
        data = {'description': 'Описание места гнездования'}
        serializer = NestingSiteSerializer(data=data)
        
        assert not serializer.is_valid()
        assert 'name' in serializer.errors


@pytest.mark.django_db
class TestNestingStatusSerializer(TestCase):
    
    def test_nesting_status_serializer_valid_data(self):
        # Тест валидации корректных данных для сериализатора NestingStatus
        site = NestingSite.objects.create(name="Дерево")
        data = {
            'name': 'Гнездование начато',
            'nesting_site': site.id,
            'description': 'Птицы приступили к строительству'
        }
        serializer = NestingStatusSerializer(data=data)
        
        assert serializer.is_valid()
        status = serializer.save()
        assert status.name == 'Гнездование начато'
        assert status.nesting_site == site
    
    def test_nesting_status_serializer_missing_required_fields(self):
        # Тест валидации при отсутствии обязательных полей у статуса гнездования
        data = {'description': 'Только описание'}
        serializer = NestingStatusSerializer(data=data)
        
        assert not serializer.is_valid()
        assert 'name' in serializer.errors
        assert 'nesting_site' in serializer.errors


@pytest.mark.django_db
class TestMigrationRouteSerializer(TestCase):
    
    def test_migration_route_serializer_valid_data(self):
        # Тест валидации корректных данных для сериализатора MigrationRoute
        data = {
            'name': 'Западный путь',
            'description': 'Вдоль побережья Атлантики'
        }
        serializer = MigrationRouteSerializer(data=data)
        
        assert serializer.is_valid()
        route = serializer.save()
        assert route.name == 'Западный путь'
    
    def test_migration_route_serializer_missing_name(self):
        # Тест валидации при отсутствии обязательного поля name у маршрута миграции
        data = {'description': 'Описание миграционного пути'}
        serializer = MigrationRouteSerializer(data=data)
        
        assert not serializer.is_valid()
        assert 'name' in serializer.errors


@pytest.mark.django_db
class TestSightingDuringMigrationSerializer(TestCase):
    
    def test_sighting_serializer_valid_data(self):
        # Тест валидации корректных данных для сериализатора SightingDuringMigration
        route = MigrationRoute.objects.create(name="Северный путь")
        data = {
            'name': 'Массовая миграция',
            'during_migration': route.id,
            'description': 'Тысячи птиц за час'
        }
        serializer = SightingDuringMigrationSerializer(data=data)
        
        assert serializer.is_valid()
        sighting = serializer.save()
        assert sighting.name == 'Массовая миграция'
        assert sighting.during_migration == route
    
    def test_sighting_serializer_missing_required_fields(self):
        # Тест валидации при отсутствии обязательных полей у наблюдения
        data = {'description': 'Описание наблюдения'}
        serializer = SightingDuringMigrationSerializer(data=data)
        
        assert not serializer.is_valid()
        assert 'name' in serializer.errors
        assert 'during_migration' in serializer.errors