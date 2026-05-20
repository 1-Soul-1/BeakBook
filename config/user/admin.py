from django.contrib import admin
from .models import User, ObservationEntry


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'email')
    search_fields = ('name', 'email')


@admin.register(ObservationEntry)
class ObservationEntryAdmin(admin.ModelAdmin):
    list_display = (
    'id',
    'name',
    'user',
    'bird_species',        # Вид птицы
    'wiki_article',        # Связанная статья
    'location',            # Место наблюдения
    'observation_date',
    )
    search_fields = ('name', 'bird_activity', 'notes', 'location')
    list_filter = ('user', 'observation_date', 'bird_species', 'wiki_article')
    readonly_fields = ('observation_date',)
    list_select_related = ('user', 'bird_species', 'wiki_article')  