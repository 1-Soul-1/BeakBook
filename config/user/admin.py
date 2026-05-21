from django.contrib import admin
from .models import User, ObservationEntry

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'email')
    search_fields = ('name', 'email')

@admin.register(ObservationEntry)
class ObservationEntryAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'user', 'observation_date')
    search_fields = ('name', 'bird_activity', 'notes')
    list_filter = ('user', 'observation_date')
    filter_horizontal = ('bird_species', 'wiki_articles', 'bird_photos')  # 👈 удобный виджет ManyToMany
    fieldsets = (
        (None, {
            'fields': ('name', 'user', 'bird_species', 'wiki_articles', 'bird_photos')
        }),
        ('Детали наблюдения', {
            'fields': ('bird_activity', 'notes', 'observation_date', 'location')
        }),
        ('Локации и миграции', {
            'fields': ('location_obj', 'migration_route', 'nesting_site', 'nesting_status', 'sighting_during_migration')
        }),
    )