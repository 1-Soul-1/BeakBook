# wiki/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import WikiViewSet, BirdPhotoViewSet, BirdCallViewSet

router = DefaultRouter()
router.register(r'wikis', WikiViewSet, basename='wiki')
router.register(r'photos', BirdPhotoViewSet, basename='birdphoto')
router.register(r'calls', BirdCallViewSet, basename='birdcall')

urlpatterns = [
    path('', include(router.urls)),
]