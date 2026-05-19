from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    BirdsViewSet, LocationViewSet, BirdSpeciesViewSet,
    NestingSiteViewSet, NestingStatusViewSet,
    MigrationRouteViewSet, SightingDuringMigrationViewSet
)

router = DefaultRouter()
router.register(r'birds', BirdsViewSet)
router.register(r'locations', LocationViewSet)
router.register(r'species', BirdSpeciesViewSet)
router.register(r'nesting-sites', NestingSiteViewSet)
router.register(r'nesting-statuses', NestingStatusViewSet)
router.register(r'migration-routes', MigrationRouteViewSet)
router.register(r'sightings-during-migration', SightingDuringMigrationViewSet)

urlpatterns = [
    path('', include(router.urls)),
]