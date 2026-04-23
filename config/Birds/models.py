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
    family = models.TextField(blank=True,null=True)
    typical_nesting = models.TextField(blank=True, null=True)
    conservation_status = models.TextField(blank=True, null=True) 
    description = models.TextField(blank=True,null=True)

    def __str__(self):
        return self.name
    
class NestingSite(models.Model):
    name = models.CharField(max_length = 100)
    description = models.TextField(blank=True,null=True)

    def __str__(self):
        return self.name
    
class NestingStatus(models.Model):
    name = models.CharField(max_length = 100)
    nesting_site = models.ForeignKey(NestingSite, on_delete=models.CASCADE, verbose_name="Статус гнездованья")
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
    during_migration = models.ForeignKey(MigrationRoute, on_delete=models.CASCADE, verbose_name="Наблюдение во время миграции")
    description = models.TextField(blank=True,null=True)

    def __str__(self):
        return self.name