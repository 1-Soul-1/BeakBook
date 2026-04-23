from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, ObservationEntryViewSet

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'observation-entries', ObservationEntryViewSet)

urlpatterns = [
    path('', include(router.urls)),
]