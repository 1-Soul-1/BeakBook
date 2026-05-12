from django.contrib import admin
from .models import (
    Birds, Location, BirdSpecies, NestingSite, 
    NestingStatus, MigrationRoute, SightingDuringMigration
)

@admin.register(Birds)
class BirdsAdmin(admin.ModelAdmin):
    list_display = ('id', 'name')
    search_fields = ('name',)

@admin.register(Location)
class LocationAdmin(admin.ModelAdmin):
    list_display = ('id', 'name')
    search_fields = ('name',)

@admin.register(BirdSpecies)
class BirdSpeciesAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'family', 'conservation_status')
    search_fields = ('name', 'family')

@admin.register(NestingSite)
class NestingSiteAdmin(admin.ModelAdmin):
    list_display = ('id', 'name')
    search_fields = ('name',)

@admin.register(NestingStatus)
class NestingStatusAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'nesting_site')
    search_fields = ('name',)
    list_filter = ('nesting_site',)

@admin.register(MigrationRoute)
class MigrationRouteAdmin(admin.ModelAdmin):
    list_display = ('id', 'name')
    search_fields = ('name',)

@admin.register(SightingDuringMigration)
class SightingDuringMigrationAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'during_migration')
    search_fields = ('name',)
    list_filter = ('during_migration',)