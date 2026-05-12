from django.contrib import admin
from .models import User, ObservationEntry

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'email')
    search_fields = ('name', 'email')

@admin.register(ObservationEntry)
class ObservationEntryAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'observation_entry', 'bird_activity')
    search_fields = ('name', 'bird_activity')
    list_filter = ('observation_entry',)