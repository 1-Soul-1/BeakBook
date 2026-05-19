from rest_framework import viewsets
from user.models import User, ObservationEntry
from user.api.serializers import UserSerializer, ObservationEntrySerializer

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class ObservationEntryViewSet(viewsets.ModelViewSet):
    queryset = ObservationEntry.objects.all()
    serializer_class = ObservationEntrySerializer