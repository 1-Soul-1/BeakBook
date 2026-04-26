# tests/test_models.py
import pytest
from ..models import (
    Birds, Location, BirdSpecies, NestingSite, 
    NestingStatus, MigrationRoute, SightingDuringMigration
)


@pytest.mark.django_db
class TestBirdsModel:
    
    def test_create_birds_with_all_fields(self):
        # Тест создания птицы со всеми полями
        bird = Birds.objects.create(
            name="Соловей",
            description="Певчая птица семейства мухоловковых"
        )
        
        assert bird.id is not None
        assert bird.name == "Соловей"
        assert bird.description == "Певчая птица семейства мухоловковых"
    
    def test_create_birds_with_minimal_fields(self):
        # Тест создания птицы только с обязательным полем name
        bird = Birds.objects.create(name="Воробей")
        
        assert bird.id is not None
        assert bird.name == "Воробей"
        assert bird.description is None
    
    def test_birds_str_method(self):
        # Тест строкового представления модели Birds
        bird = Birds.objects.create(name="Синица")
        
        assert str(bird) == "Синица"
    
    def test_birds_blank_description(self):
        # Тест создания птицы с пустым описанием
        bird = Birds.objects.create(name="Дятел", description="")
        
        assert bird.description == ""


@pytest.mark.django_db
class TestLocationModel:
    
    def test_create_location_with_all_fields(self):
        # Тест создания места обитания со всеми полями
        location = Location.objects.create(
            name="Лесная опушка",
            description="Сосновый лес, богатый грибами и ягодами"
        )
        
        assert location.id is not None
        assert location.name == "Лесная опушка"
        assert location.description == "Сосновый лес, богатый грибами и ягодами"
    
    def test_create_location_with_minimal_fields(self):
        # Тест создания места обитания только с обязательным полем name
        location = Location.objects.create(name="Болото")
        
        assert location.id is not None
        assert location.name == "Болото"
        assert location.description is None
    
    def test_location_str_method(self):
        # Тест строкового представления модели Location
        location = Location.objects.create(name="Поле")
        
        assert str(location) == "Поле"
    
    def test_location_blank_description(self):
        # Тест создания места обитания с пустым описанием
        location = Location.objects.create(name="Городской парк", description="")
        
        assert location.description == ""


@pytest.mark.django_db
class TestBirdSpeciesModel:
    
    def test_create_bird_species_with_all_fields(self):
        # Тест создания вида птицы со всеми полями
        species = BirdSpecies.objects.create(
            name="Обыкновенный соловей",
            family="Мухоловковые",
            typical_nesting="Кустарники, опушки лесов",
            conservation_status="Вызывающий наименьшие опасения",
            description="Известен своим красивым пением"
        )
        
        assert species.id is not None
        assert species.name == "Обыкновенный соловей"
        assert species.family == "Мухоловковые"
        assert species.typical_nesting == "Кустарники, опушки лесов"
        assert species.conservation_status == "Вызывающий наименьшие опасения"
        assert species.description == "Известен своим красивым пением"
    
    def test_create_bird_species_with_minimal_fields(self):
        # Тест создания вида птицы только с обязательным полем name
        species = BirdSpecies.objects.create(name="Белый аист")
        
        assert species.id is not None
        assert species.name == "Белый аист"
        assert species.family is None
        assert species.typical_nesting is None
        assert species.conservation_status is None
        assert species.description is None
    
    def test_bird_species_str_method(self):
        # Тест строкового представления модели BirdSpecies
        species = BirdSpecies.objects.create(name="Черный дрозд")
        
        assert str(species) == "Черный дрозд"
    
    def test_bird_species_blank_fields(self):
        # Тест создания вида птицы с пустыми необязательными полями
        species = BirdSpecies.objects.create(
            name="Сизый голубь",
            family="",
            typical_nesting="",
            conservation_status="",
            description=""
        )
        
        assert species.family == ""
        assert species.typical_nesting == ""
        assert species.conservation_status == ""
        assert species.description == ""


@pytest.mark.django_db
class TestNestingSiteModel:
    
    def test_create_nesting_site_with_all_fields(self):
        # Тест создания места гнездования со всеми полями
        site = NestingSite.objects.create(
            name="Дупло",
            description="Естественное углубление в дереве"
        )
        
        assert site.id is not None
        assert site.name == "Дупло"
        assert site.description == "Естественное углубление в дереве"
    
    def test_create_nesting_site_with_minimal_fields(self):
        # Тест создания места гнездования только с обязательным полем name
        site = NestingSite.objects.create(name="Скала")
        
        assert site.id is not None
        assert site.name == "Скала"
        assert site.description is None
    
    def test_nesting_site_str_method(self):
        # Тест строкового представления модели NestingSite
        site = NestingSite.objects.create(name="Земляная нора")
        
        assert str(site) == "Земляная нора"
    
    def test_nesting_site_blank_description(self):
        # Тест создания места гнездования с пустым описанием
        site = NestingSite.objects.create(name="Крыша дома", description="")
        
        assert site.description == ""


@pytest.mark.django_db
class TestNestingStatusModel:
    
    def test_create_nesting_status_with_all_fields(self):
        # Тест создания статуса гнездования со всеми полями
        site = NestingSite.objects.create(name="Дупло")
        status = NestingStatus.objects.create(
            name="Активное гнездование",
            nesting_site=site,
            description="Птицы активно строят гнездо и высиживают птенцов"
        )
        
        assert status.id is not None
        assert status.name == "Активное гнездование"
        assert status.nesting_site == site
        assert status.description == "Птицы активно строят гнездо и высиживают птенцов"
    
    def test_create_nesting_status_with_minimal_fields(self):
        # Тест создания статуса гнездования с минимальными полями
        site = NestingSite.objects.create(name="Куст")
        status = NestingStatus.objects.create(
            name="Завершенное гнездование",
            nesting_site=site
        )
        
        assert status.id is not None
        assert status.name == "Завершенное гнездование"
        assert status.nesting_site == site
        assert status.description is None
    
    def test_nesting_status_str_method(self):
        # Тест строкового представления модели NestingStatus
        site = NestingSite.objects.create(name="Ниша в здании")
        status = NestingStatus.objects.create(name="Подготовка к гнездованию", nesting_site=site)
        
        assert str(status) == "Подготовка к гнездованию"
    
    def test_nesting_status_cascade_delete(self):
        # Тест каскадного удаления статусов при удалении места гнездования
        site = NestingSite.objects.create(name="Искусственное гнездовье")
        status = NestingStatus.objects.create(
            name="Занято",
            nesting_site=site
        )
        
        site.delete()
        
        assert NestingStatus.objects.filter(id=status.id).count() == 0
    
    def test_nesting_status_blank_description(self):
        # Тест создания статуса гнездования с пустым описанием
        site = NestingSite.objects.create(name="Ветки")
        status = NestingStatus.objects.create(
            name="Пустует",
            nesting_site=site,
            description=""
        )
        
        assert status.description == ""


@pytest.mark.django_db
class TestMigrationRouteModel:
    
    def test_create_migration_route_with_all_fields(self):
        # Тест создания миграционного маршрута со всеми полями
        route = MigrationRoute.objects.create(
            name="Восточно-европейский путь",
            description="Через Черное море и Ближний Восток"
        )
        
        assert route.id is not None
        assert route.name == "Восточно-европейский путь"
        assert route.description == "Через Черное море и Ближний Восток"
    
    def test_create_migration_route_with_minimal_fields(self):
        # Тест создания миграционного маршрута только с обязательным полем name
        route = MigrationRoute.objects.create(name="Скандинавский путь")
        
        assert route.id is not None
        assert route.name == "Скандинавский путь"
        assert route.description is None
    
    def test_migration_route_str_method(self):
        # Тест строкового представления модели MigrationRoute
        route = MigrationRoute.objects.create(name="Средиземноморский путь")
        
        assert str(route) == "Средиземноморский путь"
    
    def test_migration_route_blank_description(self):
        # Тест создания миграционного маршрута с пустым описанием
        route = MigrationRoute.objects.create(name="Атлантический путь", description="")
        
        assert route.description == ""


@pytest.mark.django_db
class TestSightingDuringMigrationModel:
    
    def test_create_sighting_with_all_fields(self):
        # Тест создания наблюдения во время миграции со всеми полями
        route = MigrationRoute.objects.create(name="Черноморский путь")
        sighting = SightingDuringMigration.objects.create(
            name="Скопление аистов",
            during_migration=route,
            description="Отмечено более 1000 особей за день"
        )
        
        assert sighting.id is not None
        assert sighting.name == "Скопление аистов"
        assert sighting.during_migration == route
        assert sighting.description == "Отмечено более 1000 особей за день"
    
    def test_create_sighting_with_minimal_fields(self):
        # Тест создания наблюдения во время миграции с минимальными полями
        route = MigrationRoute.objects.create(name="Балтийский путь")
        sighting = SightingDuringMigration.objects.create(
            name="Пролет соловьев",
            during_migration=route
        )
        
        assert sighting.id is not None
        assert sighting.name == "Пролет соловьев"
        assert sighting.during_migration == route
        assert sighting.description is None
    
    def test_sighting_str_method(self):
        # Тест строкового представления модели SightingDuringMigration
        route = MigrationRoute.objects.create(name="Каспийский путь")
        sighting = SightingDuringMigration.objects.create(
            name="Остановка фламинго",
            during_migration=route
        )
        
        assert str(sighting) == "Остановка фламинго"
    
    def test_sighting_cascade_delete(self):
        # Тест каскадного удаления наблюдений при удалении маршрута миграции
        route = MigrationRoute.objects.create(name="Сибирский путь")
        sighting = SightingDuringMigration.objects.create(
            name="Массовый пролет",
            during_migration=route
        )
        
        route.delete()
        
        assert SightingDuringMigration.objects.filter(id=sighting.id).count() == 0
    
    def test_sighting_blank_description(self):
        # Тест создания наблюдения с пустым описанием
        route = MigrationRoute.objects.create(name="Уральский путь")
        sighting = SightingDuringMigration.objects.create(
            name="Встреча с редким видом",
            during_migration=route,
            description=""
        )
        
        assert sighting.description == ""


# tests/test_serializers.py
import pytest
from ..models import (
    Birds, Location, BirdSpecies, NestingSite, 
    NestingStatus, MigrationRoute, SightingDuringMigration
)
from ..serializers import (
    BirdsSerializer, LocationSerializer, BirdSpeciesSerializer,
    NestingSiteSerializer, NestingStatusSerializer,
    MigrationRouteSerializer, SightingDuringMigrationSerializer
)


@pytest.mark.django_db
class TestBirdsSerializer:
    
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
class TestLocationSerializer:
    
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
class TestBirdSpeciesSerializer:
    
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
class TestNestingSiteSerializer:
    
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
class TestNestingStatusSerializer:
    
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
class TestMigrationRouteSerializer:
    
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
class TestSightingDuringMigrationSerializer:
    
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


# tests/test_views.py
import pytest
from rest_framework.test import APIClient
from django.urls import reverse
from ..models import (
    Birds, Location, BirdSpecies, NestingSite, 
    NestingStatus, MigrationRoute, SightingDuringMigration
)


@pytest.mark.django_db
class TestBirdsViewSet:
    
    def setup_method(self):
        self.client = APIClient()
        self.bird_data = {
            'name': 'Соловей',
            'description': 'Певчая птица'
        }
    
    def test_list_birds_empty(self):
        # Тест получения пустого списка птиц через API
        url = reverse('birds-list')
        response = self.client.get(url)
        
        assert response.status_code == 200
        assert response.data == []
    
    def test_create_bird(self):
        # Тест создания новой птицы через API
        url = reverse('birds-list')
        response = self.client.post(url, self.bird_data, format='json')
        
        assert response.status_code == 201
        assert response.data['name'] == 'Соловей'
        assert Birds.objects.count() == 1
    
    def test_retrieve_bird(self):
        # Тест получения конкретной птицы через API
        bird = Birds.objects.create(**self.bird_data)
        url = reverse('birds-d
