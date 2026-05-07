from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, ObservationEntryViewSet

# Создаем роутер
router = DefaultRouter()
# Регистрируем ViewSet'ы с явными именами
router.register(r'users', UserViewSet, basename='user')
router.register(r'observations', ObservationEntryViewSet, basename='observationentry')

urlpatterns = [
    path('api/', include(router.urls)),
]