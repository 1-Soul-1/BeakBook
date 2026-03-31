from django.db import models

class Birds(models.Model):
    name = models.CharField(max_length = 100)
    description = models.TextField(blank=True,null=True)

    def __str__(self):
        return self.name

class Location(models.Model):
    name = models.CharField(max_length = 100)
    description = models.TextField(blank=True,null=True)

    def __str__(self):
        return self.name
    
class BirdSpecies(models.Model):
    name = models.CharField(max_length = 100)
    description = models.TextField(blank=True,null=True)

    def __str__(self):
        return self.name
    
class NestingSite(models.Model):
    name = models.CharField(max_length = 100)
    description = models.TextField(blank=True,null=True)

    def __str__(self):
        return self.name
    
class NestingSite(models.Model):
    name = models.CharField(max_length = 100)
    nesting_site = models.ForeignKey(NestingSite, on_delete=models.CASCADE, verbose_name="Гнездовье")
    description = models.TextField(blank=True,null=True)

    def __str__(self):
        return self.name
    
class MigrationRoute(models.Model):
    name = models.CharField(max_length = 100)
    description = models.TextField(blank=True,null=True)

    def __str__(self):
        return self.name
    
class SightingDuringMigration(models.Model):
    name = models.CharField(max_length = 100)
    nesting_site = models.ForeignKey(MigrationRoute, on_delete=models.CASCADE, verbose_name="Гнездовье")
    description = models.TextField(blank=True,null=True)
