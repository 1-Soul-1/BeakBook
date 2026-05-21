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
        'bird_species',
        'wiki_article',
        'location',
        'observation_date',
    )
    search_fields = ('name', 'bird_activity', 'notes', 'location')
    list_filter = ('user', 'observation_date', 'bird_species', 'wiki_article')
    # Убираем observation_date из readonly_fields, чтобы можно было редактировать
    readonly_fields = ()  # или оставьте пустым
    list_select_related = ('user', 'bird_species', 'wiki_article')
    
    # Опционально: можно добавить поле observation_date в fieldsets
    fieldsets = (
        (None, {
            'fields': ('name', 'user', 'bird_species', 'wiki_article', 
                      'bird_activity', 'notes', 'observation_date', 'location')
        }),
    )