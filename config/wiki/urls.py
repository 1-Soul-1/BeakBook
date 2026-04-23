from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import WikiViewSet, BirdPhotoViewSet, BirdCallViewSet

router = DefaultRouter()
router.register(r'wiki', WikiViewSet)
router.register(r'bird-photos', BirdPhotoViewSet)
router.register(r'bird-calls', BirdCallViewSet)

urlpatterns = [
    path('', include(router.urls)),
]