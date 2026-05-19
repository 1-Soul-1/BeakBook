from django.db import models

class Birds(models.Model):
    name = models.CharField(max_length = 100, verbose_name="Имя")
    description = models.TextField(blank=True,null=True, verbose_name="Описание")

    def __str__(self):
        return self.name

class Location(models.Model):
    name = models.CharField(max_length = 100, verbose_name="Имя")
    description = models.TextField(blank=True,null=True, verbose_name="Описание")

    def __str__(self):
        return self.name
    
class BirdSpecies(models.Model):
    name = models.CharField(max_length = 100, verbose_name="Имя")
    family = models.TextField(blank=True,null=True, verbose_name="Семейство")
    typical_nesting = models.TextField(blank=True, null=True, verbose_name="Типичное гнездование")
    conservation_status = models.TextField(blank=True, null=True, verbose_name="Статус сохранения") 
    description = models.TextField(blank=True,null=True, verbose_name="Описание")

    def __str__(self):
        return self.name
    
class NestingSite(models.Model):
    name = models.CharField(max_length = 100, verbose_name="Имя")
    description = models.TextField(blank=True,null=True, verbose_name="Описание")

    def __str__(self):
        return self.name
    
class NestingStatus(models.Model):
    name = models.CharField(max_length = 100, verbose_name="Имя")
    nesting_site = models.ForeignKey(NestingSite, on_delete=models.CASCADE, verbose_name="Статус гнездованья")
    description = models.TextField(blank=True,null=True, verbose_name="Описание")

    def __str__(self):
        return self.name

class MigrationRoute(models.Model):
    name = models.CharField(max_length = 100, verbose_name="Имя")
    description = models.TextField(blank=True,null=True, verbose_name="Описание")

    def __str__(self):
        return self.name
    
class SightingDuringMigration(models.Model):
    name = models.CharField(max_length = 100, verbose_name="Имя")
    during_migration = models.ForeignKey(MigrationRoute, on_delete=models.CASCADE, verbose_name="Наблюдение во время миграции")
    description = models.TextField(blank=True,null=True, verbose_name="Описание")

    def __str__(self):
        return self.name