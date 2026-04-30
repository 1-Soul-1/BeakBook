# wiki/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import WikiViewSet, BirdPhotoViewSet, BirdCallViewSet

router = DefaultRouter()
router.register(r'wikis', WikiViewSet, basename='wiki')  # Исправлено: views.WikiViewSet -> WikiViewSet
router.register(r'photos', BirdPhotoViewSet, basename='birdphoto')  # Исправлено
router.register(r'calls', BirdCallViewSet, basename='birdcall')  # Исправлено

urlpatterns = [
    path('', include(router.urls)),
]