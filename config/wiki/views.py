from rest_framework import viewsets
from .models import Wiki, BirdPhoto, BirdCall
from .serializers import WikiSerializer, BirdPhotoSerializer, BirdCallSerializer

class WikiViewSet(viewsets.ModelViewSet):
    queryset = Wiki.objects.all()
    serializer_class = WikiSerializer

class BirdPhotoViewSet(viewsets.ModelViewSet):
    queryset = BirdPhoto.objects.all()
    serializer_class = BirdPhotoSerializer

class BirdCallViewSet(viewsets.ModelViewSet):
    queryset = BirdCall.objects.all()
    serializer_class = BirdCallSerializer   