from rest_framework import viewsets
from ..models import User, ObservationEntry
from .serializers import UserSerializer, ObservationEntrySerializer

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class ObservationEntryViewSet(viewsets.ModelViewSet):
    queryset = ObservationEntry.objects.all()
    serializer_class = ObservationEntrySerializer