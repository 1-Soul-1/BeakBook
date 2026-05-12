from django.contrib import admin
from .models import Wiki, BirdPhoto, BirdCall

@admin.register(Wiki)
class WikiAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'author')
    search_fields = ('name', 'author')

@admin.register(BirdPhoto)
class BirdPhotoAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'bird_photo', 'author')
    search_fields = ('name', 'author')
    list_filter = ('bird_photo',)

@admin.register(BirdCall)
class BirdCallAdmin(admin.ModelAdmin):
    list_display = ('id', 'description')
    search_fields = ('description',)