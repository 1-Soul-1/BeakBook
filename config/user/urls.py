from django.urls import path,include
from rest_framework.routers import DefaultRouter
from .views import UserSerializer, ObservationEntrySerializer


router = DefaultRouter()
router.register(r'user',UserSerializer)
router.register(r'observation_entry',ObservationEntrySerializer)

urlpatterns = [
    path('',include(router.urls)),
]