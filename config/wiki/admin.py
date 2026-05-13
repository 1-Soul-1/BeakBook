from django.contrib import admin
from django.db import models
from wiki.models import Wiki, BirdPhoto, BirdCall

@admin.register(Wiki)
class WikiAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'author')
    search_fields = ('name', 'author')
    list_display_links = ('id', 'name')

@admin.register(BirdPhoto)
class BirdPhotoAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'bird_species', 'photographer', 'image_preview')
    search_fields = ('name', 'photographer', 'bird_species__name')
    list_filter = ('bird_species',)
    list_display_links = ('id', 'name')
    
    def image_preview(self, obj):
        if obj.image:
            return f'<img src="{obj.image.url}" width="100" height="auto" />'
        return "Нет изображения"
    image_preview.allow_tags = True
    image_preview.short_description = "Превью"
    
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