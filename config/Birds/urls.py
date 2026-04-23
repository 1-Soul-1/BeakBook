from django.urls import path,include
from rest_framework.routers import DefaultRouter
from .views import BirdsSerializer, LocationSerializer, BirdSpeciesSerializer, NestingSiteSerializer, NestingStatusSerializer, MigrationRouteSerializer, SightingDuringMigrationSerializer


router = DefaultRouter()
router.register(r'Birds',BirdsSerializer)
# router.register(r'location',LocationSerializer)
# router.register(r'species',BirdSpeciesSerializer)
# router.register(r'nesting_site',NestingSiteSerializer)
# router.register(r'nesting_status',NestingStatusSerializer)
# router.register(r'migration_route',MigrationRouteSerializer)
# router.register(r'during_migration',SightingDuringMigrationSerializer)

urlpatterns = [
    path('',include(router.urls)),
]