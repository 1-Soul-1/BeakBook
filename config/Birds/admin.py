from django.contrib import admin
from django.db import models
from django.forms import Textarea
from Birds.models import (
    Birds, Location, BirdSpecies, NestingSite, 
    NestingStatus, MigrationRoute, SightingDuringMigration
)

@admin.register(Birds)
class BirdsAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'description')
    search_fields = ('name',)
    list_display_links = ('id', 'name')
    formfield_overrides = {
        models.TextField: {'widget': Textarea(attrs={'rows': 3, 'cols': 70})},
    }

@admin.register(Location)
class LocationAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'description')
    search_fields = ('name',)
    list_display_links = ('id', 'name')
    formfield_overrides = {
        models.TextField: {'widget': Textarea(attrs={'rows': 3, 'cols': 70})},
    }

@admin.register(BirdSpecies)
class BirdSpeciesAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'family', 'conservation_status', 'typical_nesting')
    search_fields = ('name', 'family')
    list_display_links = ('id', 'name')
    fieldsets = (
        (None, {
            'fields': ('name', 'family', 'description')
        }),
        ('Детали вида', {
            'fields': ('typical_nesting', 'conservation_status'),
            'classes': ('collapse',)
        }),
    )
    formfield_overrides = {
        models.TextField: {'widget': Textarea(attrs={'rows': 4, 'cols': 70})},
    }

@admin.register(NestingSite)
class NestingSiteAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'description')
    search_fields = ('name',)
    list_display_links = ('id', 'name')
    formfield_overrides = {
        models.TextField: {'widget': Textarea(attrs={'rows': 3, 'cols': 70})},
    }

@admin.register(NestingStatus)
class NestingStatusAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'nesting_site', 'description')
    search_fields = ('name',)
    list_filter = ('nesting_site',)
    list_display_links = ('id', 'name')
    formfield_overrides = {
        models.TextField: {'widget': Textarea(attrs={'rows': 3, 'cols': 70})},
    }

@admin.register(MigrationRoute)
class MigrationRouteAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'description')
    search_fields = ('name',)
    list_display_links = ('id', 'name')
    formfield_overrides = {
        models.TextField: {'widget': Textarea(attrs={'rows': 3, 'cols': 70})},
    }

@admin.register(SightingDuringMigration)
class SightingDuringMigrationAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'during_migration', 'description')
    search_fields = ('name',)
    list_filter = ('during_migration',)
    list_display_links = ('id', 'name')
    formfield_overrides = {
        models.TextField: {'widget': Textarea(attrs={'rows': 3, 'cols': 70})},
    }