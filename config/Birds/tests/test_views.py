# tests/test_views.py
# python manage.py test Birds.tests

import pytest
from rest_framework.test import APIClient
from django.urls import reverse
from django.test import TestCase
from Birds.models import Birds, Location, BirdSpecies, NestingSite, NestingStatus, MigrationRoute, SightingDuringMigration


@pytest.fixture
def api_client():
    return APIClient()


@pytest.fixture
def bird_data():
    return {
        "name": "Орлан-белохвост",
        "description": "Крупная хищная птица"
    }


@pytest.fixture
def location_data():
    return {
        "name": "Астраханский заповедник",
        "description": "Дельта Волги"
    }


@pytest.fixture
def bird_species_data():
    return {
        "name": "Aquila chrysaetos",
        "family": "Ястребиные",
        "typical_nesting": "Скалы, крупные деревья",
        "conservation_status": "Вызывающие наименьшие опасения",
        "description": "Крупный орёл"
    }


@pytest.fixture
def nesting_site_data():
    return {
        "name": "Дупла старых деревьев",
        "description": "В сосновых лесах"
    }


@pytest.fixture
def migration_route_data():
    return {
        "name": "Восточно-Европейский путь",
        "description": "Через Каспий"
    }


@pytest.fixture
def nesting_status_data(nesting_site_data):
    nesting_site = NestingSite.objects.create(**nesting_site_data)
    return {
        "name": "Активное гнездование",
        "nesting_site": nesting_site.id,
        "description": "Птицы высиживают яйца"
    }


@pytest.fixture
def sighting_during_migration_data(migration_route_data):
    migration_route = MigrationRoute.objects.create(**migration_route_data)
    return {
        "name": "Массовый пролёт",
        "during_migration": migration_route.id,
        "description": "Тысячи птиц за день"
    }


class BaseViewSetTest(TestCase):
    def setUp(self):
        self.client = APIClient()


class TestBirdsViewSet(BaseViewSetTest):
    def setUp(self):
        super().setUp()
        self.bird_data = {
            "name": "Орлан-белохвост",
            "description": "Крупная хищная птица"
        }
        self.bird = Birds.objects.create(**self.bird_data)

    def test_list_birds(self):
        response = self.client.get(reverse('birds-list'))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['name'], self.bird_data['name'])

    def test_create_bird(self):
        new_data = {"name": "Сапсан", "description": "Самая быстрая птица"}
        response = self.client.post(reverse('birds-list'), new_data, format='json')
        self.assertEqual(response.status_code, 201)
        self.assertEqual(Birds.objects.count(), 2)

    def test_retrieve_bird(self):
        response = self.client.get(reverse('birds-detail', args=[self.bird.id]))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['name'], self.bird_data['name'])

    def test_update_bird(self):
        updated_data = {"name": "Скопа", "description": "Рыболов"}
        response = self.client.put(reverse('birds-detail', args=[self.bird.id]), updated_data, format='json')
        self.assertEqual(response.status_code, 200)
        self.bird.refresh_from_db()
        self.assertEqual(self.bird.name, "Скопа")

    def test_partial_update_bird(self):
        response = self.client.patch(reverse('birds-detail', args=[self.bird.id]), {"name": "Беркут"}, format='json')
        self.assertEqual(response.status_code, 200)
        self.bird.refresh_from_db()
        self.assertEqual(self.bird.name, "Беркут")

    def test_delete_bird(self):
        response = self.client.delete(reverse('birds-detail', args=[self.bird.id]))
        self.assertEqual(response.status_code, 204)
        self.assertEqual(Birds.objects.count(), 0)


class TestLocationViewSet(BaseViewSetTest):
    def setUp(self):
        super().setUp()
        self.location_data = {
            "name": "Астраханский заповедник",
            "description": "Дельта Волги"
        }
        self.location = Location.objects.create(**self.location_data)

    def test_list_locations(self):
        response = self.client.get(reverse('location-list'))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)

    def test_create_location(self):
        new_data = {"name": "Баргузинский заповедник", "description": "Байкал"}
        response = self.client.post(reverse('location-list'), new_data, format='json')
        self.assertEqual(response.status_code, 201)
        self.assertEqual(Location.objects.count(), 2)

    def test_retrieve_location(self):
        response = self.client.get(reverse('location-detail', args=[self.location.id]))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['name'], self.location_data['name'])

    def test_update_location(self):
        updated_data = {"name": "Кавказский заповедник", "description": "Горы"}
        response = self.client.put(reverse('location-detail', args=[self.location.id]), updated_data, format='json')
        self.assertEqual(response.status_code, 200)
        self.location.refresh_from_db()
        self.assertEqual(self.location.name, "Кавказский заповедник")

    def test_delete_location(self):
        response = self.client.delete(reverse('location-detail', args=[self.location.id]))
        self.assertEqual(response.status_code, 204)
        self.assertEqual(Location.objects.count(), 0)


class TestBirdSpeciesViewSet(BaseViewSetTest):
    def setUp(self):
        super().setUp()
        self.species_data = {
            "name": "Aquila chrysaetos",
            "family": "Ястребиные",
            "typical_nesting": "Скалы, крупные деревья",
            "conservation_status": "Вызывающие наименьшие опасения",
            "description": "Крупный орёл"
        }
        self.species = BirdSpecies.objects.create(**self.species_data)

    def test_list_bird_species(self):
        response = self.client.get(reverse('birdspecies-list'))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)

    def test_create_bird_species(self):
        new_data = {
            "name": "Falco peregrinus",
            "family": "Соколиные",
            "typical_nesting": "Скалы",
            "conservation_status": "Вызывающие наименьшие опасения",
            "description": "Сапсан"
        }
        response = self.client.post(reverse('birdspecies-list'), new_data, format='json')
        self.assertEqual(response.status_code, 201)
        self.assertEqual(BirdSpecies.objects.count(), 2)

    def test_retrieve_bird_species(self):
        response = self.client.get(reverse('birdspecies-detail', args=[self.species.id]))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['family'], self.species_data['family'])

    def test_update_bird_species(self):
        updated_data = self.species_data.copy()
        updated_data['conservation_status'] = 'На грани исчезновения'
        response = self.client.put(reverse('birdspecies-detail', args=[self.species.id]), updated_data, format='json')
        self.assertEqual(response.status_code, 200)
        self.species.refresh_from_db()
        self.assertEqual(self.species.conservation_status, 'На грани исчезновения')

    def test_delete_bird_species(self):
        response = self.client.delete(reverse('birdspecies-detail', args=[self.species.id]))
        self.assertEqual(response.status_code, 204)
        self.assertEqual(BirdSpecies.objects.count(), 0)


class TestNestingSiteViewSet(BaseViewSetTest):
    def setUp(self):
        super().setUp()
        self.nesting_site_data = {
            "name": "Дупла старых деревьев",
            "description": "В сосновых лесах"
        }
        self.nesting_site = NestingSite.objects.create(**self.nesting_site_data)

    def test_list_nesting_sites(self):
        response = self.client.get(reverse('nestingsite-list'))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)

    def test_create_nesting_site(self):
        new_data = {"name": "Гнездовые ящики", "description": "Искусственные гнездовья"}
        response = self.client.post(reverse('nestingsite-list'), new_data, format='json')
        self.assertEqual(response.status_code, 201)
        self.assertEqual(NestingSite.objects.count(), 2)

    def test_retrieve_nesting_site(self):
        response = self.client.get(reverse('nestingsite-detail', args=[self.nesting_site.id]))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['name'], self.nesting_site_data['name'])

    def test_update_nesting_site(self):
        updated_data = {"name": "Скальные ниши", "description": "В горах"}
        response = self.client.put(reverse('nestingsite-detail', args=[self.nesting_site.id]), updated_data, format='json')
        self.assertEqual(response.status_code, 200)
        self.nesting_site.refresh_from_db()
        self.assertEqual(self.nesting_site.name, "Скальные ниши")

    def test_delete_nesting_site(self):
        response = self.client.delete(reverse('nestingsite-detail', args=[self.nesting_site.id]))
        self.assertEqual(response.status_code, 204)
        self.assertEqual(NestingSite.objects.count(), 0)


class TestNestingStatusViewSet(BaseViewSetTest):
    def setUp(self):
        super().setUp()
        self.nesting_site = NestingSite.objects.create(
            name="Дупла старых деревьев",
            description="В сосновых лесах"
        )
        self.status_data = {
            "name": "Активное гнездование",
            "nesting_site": self.nesting_site.id,
            "description": "Птицы высиживают яйца"
        }
        self.status = NestingStatus.objects.create(
            name="Активное гнездование",
            nesting_site=self.nesting_site,
            description="Птицы высиживают яйца"
        )

    def test_list_nesting_statuses(self):
        response = self.client.get(reverse('nestingstatus-list'))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)

    def test_create_nesting_status(self):
        new_data = {
            "name": "Завершённое гнездование",
            "nesting_site": self.nesting_site.id,
            "description": "Птенцы вылетели"
        }
        response = self.client.post(reverse('nestingstatus-list'), new_data, format='json')
        self.assertEqual(response.status_code, 201)
        self.assertEqual(NestingStatus.objects.count(), 2)

    def test_retrieve_nesting_status(self):
        response = self.client.get(reverse('nestingstatus-detail', args=[self.status.id]))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['name'], self.status_data['name'])

    def test_update_nesting_status(self):
        updated_data = self.status_data.copy()
        updated_data['name'] = 'Завершённое гнездование'
        response = self.client.put(reverse('nestingstatus-detail', args=[self.status.id]), updated_data, format='json')
        self.assertEqual(response.status_code, 200)
        self.status.refresh_from_db()
        self.assertEqual(self.status.name, 'Завершённое гнездование')

    def test_delete_nesting_status(self):
        response = self.client.delete(reverse('nestingstatus-detail', args=[self.status.id]))
        self.assertEqual(response.status_code, 204)
        self.assertEqual(NestingStatus.objects.count(), 0)


class TestMigrationRouteViewSet(BaseViewSetTest):
    def setUp(self):
        super().setUp()
        self.route_data = {
            "name": "Восточно-Европейский путь",
            "description": "Через Каспий"
        }
        self.route = MigrationRoute.objects.create(**self.route_data)

    def test_list_migration_routes(self):
        response = self.client.get(reverse('migrationroute-list'))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)

    def test_create_migration_route(self):
        new_data = {"name": "Западно-Сибирский путь", "description": "Через Урал"}
        response = self.client.post(reverse('migrationroute-list'), new_data, format='json')
        self.assertEqual(response.status_code, 201)
        self.assertEqual(MigrationRoute.objects.count(), 2)

    def test_retrieve_migration_route(self):
        response = self.client.get(reverse('migrationroute-detail', args=[self.route.id]))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['name'], self.route_data['name'])

    def test_update_migration_route(self):
        updated_data = {"name": "Черноморский путь", "description": "Через Босфор"}
        response = self.client.put(reverse('migrationroute-detail', args=[self.route.id]), updated_data, format='json')
        self.assertEqual(response.status_code, 200)
        self.route.refresh_from_db()
        self.assertEqual(self.route.name, "Черноморский путь")

    def test_delete_migration_route(self):
        response = self.client.delete(reverse('migrationroute-detail', args=[self.route.id]))
        self.assertEqual(response.status_code, 204)
        self.assertEqual(MigrationRoute.objects.count(), 0)


class TestSightingDuringMigrationViewSet(BaseViewSetTest):
    def setUp(self):
        super().setUp()
        self.migration_route = MigrationRoute.objects.create(
            name="Восточно-Европейский путь",
            description="Через Каспий"
        )
        self.sighting_data = {
            "name": "Массовый пролёт",
            "during_migration": self.migration_route.id,
            "description": "Тысячи птиц за день"
        }
        self.sighting = SightingDuringMigration.objects.create(
            name="Массовый пролёт",
            during_migration=self.migration_route,
            description="Тысячи птиц за день"
        )

    def test_list_sightings(self):
        response = self.client.get(reverse('sightingduringmigration-list'))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)

    def test_create_sighting(self):
        new_data = {
            "name": "Одиночная особь",
            "during_migration": self.migration_route.id,
            "description": "Одиночный пролёт"
        }
        response = self.client.post(reverse('sightingduringmigration-list'), new_data, format='json')
        self.assertEqual(response.status_code, 201)
        self.assertEqual(SightingDuringMigration.objects.count(), 2)

    def test_retrieve_sighting(self):
        response = self.client.get(reverse('sightingduringmigration-detail', args=[self.sighting.id]))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['name'], self.sighting_data['name'])

    def test_update_sighting(self):
        updated_data = self.sighting_data.copy()
        updated_data['description'] = 'Обновлённое описание'
        response = self.client.put(reverse('sightingduringmigration-detail', args=[self.sighting.id]), updated_data, format='json')
        self.assertEqual(response.status_code, 200)
        self.sighting.refresh_from_db()
        self.assertEqual(self.sighting.description, 'Обновлённое описание')

    def test_delete_sighting(self):
        response = self.client.delete(reverse('sightingduringmigration-detail', args=[self.sighting.id]))
        self.assertEqual(response.status_code, 204)
        self.assertEqual(SightingDuringMigration.objects.count(), 0)