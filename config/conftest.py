import pytest 
from Birds.models import Birds,Location,BirdSpecies,NestingSite,NestingStatus,MigrationRoute,SightingDuringMigration
from rest_framework.test import APIClient
import os
import django

@pytest.fixture
def birds():
    return Birds.objects.create(
        name = "birdsTest",
        description = "b_descTest"
    )

@pytest.fixture 
def create_birds():
    def _create_birds(name = "Birds Test", description = "B_DescTest"):
        return Birds.objects.create(name = name, description = description)
    return _create_birds



@pytest.fixture
def location():
    return Location.objects.create(
        name = "locationTest",
        description = "l_descTest"
    )

@pytest.fixture 
def create_location():
    def _create_location(name = "Location Test", description = "L_DescTest"):
        return Location.objects.create(name = name, description = description)
    return _create_location



@pytest.fixture
def species():
    return BirdSpecies.objects.create(
        name = "speciesTest",
        family = "familyTest",
        typical_nesting = "typicalNTest",
        conservation_status  = "conv_statusTest",
        description = "s_descTest"
    )

@pytest.fixture 
def create_species():
    def _create_species(name = "Species Test", description = "S_DescTest", family = "FamilyTest", typical_nesting = "TypicalNTest", conservation_status  = "ConvStatusTest"):
        return BirdSpecies.objects.create(name = name, description = description, family = family, typical_nesting = typical_nesting, conservation_status = conservation_status)
    return _create_species



def nesting_site():
    return NestingSite.objects.create(
        name = "nesting_siteTest",
        description = "nsi_descTest"
    )

@pytest.fixture 
def create_nesting_site():
    def _create_nesting_site(name = "Nesting Site Test", description = "NSi_DescTest"):
        return NestingSite.objects.create(name = name, description = description)
    return _create_nesting_site



def nesting_status():
    return NestingStatus.objects.create(
        name = "nesting_statusTest",
        description = "nst_descTest"
    )

@pytest.fixture 
def create_nesting_status():
    def _create_nesting_status(name = "Nesting Status Test", description = "NSt_DescTest"):
        return NestingStatus.objects.create(name = name, description = description)
    return _create_nesting_status



def migration_route():
    return MigrationRoute.objects.create(
        name = "migration_routeTest",
        description = "mr_descTest"
    )

@pytest.fixture 
def create_migration_route():
    def _create_migration_route(name = "Migration Route Test", description = "MR_DescTest"):
        return MigrationRoute.objects.create(name = name, description = description)
    return _create_migration_route



def sighting_during_migration():
    return SightingDuringMigration.objects.create(
        name = "sighting_during_migrationTest",
        during_migration = True,
        description = "sdm_descTest"
    )

@pytest.fixture 
def create_sighting_during_migration():
    def _create_sighting_during_migration(name = "Sighting During Migration Test", description = "SDM_DescTest"):
        return SightingDuringMigration.objects.create(name = name, description = description)
    return _create_sighting_during_migration



# @pytest.fixture
# def client():
#     return APIClient()