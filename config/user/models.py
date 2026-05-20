from django.db import models
from django.utils import timezone
from Birds.models import BirdSpecies
from wiki.models import Wiki

class User(models.Model):
    name = models.CharField(max_length=100, verbose_name="Имя")
    email = models.TextField(blank=True, null=True, verbose_name="Почта")

    def __str__(self):
        return self.name
    
class ObservationEntry(models.Model):
    name = models.CharField(max_length=100, verbose_name="Название")
    user = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name="Пользователь", related_name='observations')
    
    bird_species = models.ForeignKey(
        BirdSpecies, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True, 
        verbose_name="Вид птицы",
        related_name='observations'
    )
    
    wiki_article = models.ForeignKey(
        Wiki, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True, 
        verbose_name="Связанная статья",
        related_name='observations'
    )
    
    bird_activity = models.TextField(blank=True, null=True, verbose_name="Активность птиц")
    notes = models.TextField(blank=True, null=True, verbose_name="Примечание/заметка")
    
    # auto_now_add=True автоматически устанавливает дату при создании
    observation_date = models.DateTimeField(auto_now_add=True, verbose_name="Дата наблюдения")
    location = models.CharField(max_length=200, blank=True, null=True, verbose_name="Место наблюдения")

    def __str__(self):
        return f"{self.name} - {self.user.name}"