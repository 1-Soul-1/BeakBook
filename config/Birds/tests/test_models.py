# tests/test_models.py
# python manage.py test Birds.tests
import pytest
from django.test import TestCase
from Birds.models import (
    Birds, Location, BirdSpecies, NestingSite, 
    NestingStatus, MigrationRoute, SightingDuringMigration
)

@pytest.mark.django_db
class TestBirdsModel(TestCase):
    
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
class TestLocationModel(TestCase):
    
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
class TestBirdSpeciesModel(TestCase):
    
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
class TestNestingSiteModel(TestCase):
    
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
class TestNestingStatusModel(TestCase):
    
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
class TestMigrationRouteModel(TestCase):
    
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
class TestSightingDuringMigrationModel(TestCase):
    
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