from django.contrib import admin
from django.db import models
from wiki.models import Wiki, BirdPhoto, BirdCall  # Убрал BirdSpecies

@admin.register(Wiki)
class WikiAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'author')
    search_fields = ('name', 'author')
    list_display_links = ('id', 'name')

@admin.register(BirdPhoto)
class BirdPhotoAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'bird_photo', 'author')
    search_fields = ('name', 'author')
    list_filter = ('bird_photo',)
    list_display_links = ('id', 'name')
    
    formfield_overrides = {
        models.TextField: {'widget': admin.widgets.AdminTextareaWidget(attrs={'rows': 3, 'cols': 70})},
    }

@admin.register(BirdCall)
class BirdCallAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'bird_species')
    search_fields = ('name', 'description')
    list_filter = ('bird_species',)
    list_display_links = ('id', 'name')
    
    formfield_overrides = {
        models.TextField: {'widget': admin.widgets.AdminTextareaWidget(attrs={'rows': 5, 'cols': 80})},
    }