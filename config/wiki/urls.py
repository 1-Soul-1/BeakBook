from django.urls import path,include
from rest_framework.routers import DefaultRouter
from .views import WikiSerializer, BirdPhotoSerializer, BirdCallSerializer


router = DefaultRouter()
router.register(r'wiki',WikiSerializer)
router.register(r'bird_photo',BirdPhotoSerializer)
router.register(r'bird_call',BirdCallSerializer)

urlpatterns = [
    path('',include(router.urls)),
]