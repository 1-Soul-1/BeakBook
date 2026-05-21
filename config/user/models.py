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
    
    # убрано auto_now_add=True, добавлен default
    observation_date = models.DateTimeField(
        default=timezone.now,  # Автоматически устанавливается, если не указано
        blank=True,
        verbose_name="Дата наблюдения"
    )
    location = models.CharField(max_length=200, blank=True, null=True, verbose_name="Место наблюдения")

    def save(self, *args, **kwargs):
        # Если дата не установлена, устанавливаем текущую
        if not self.observation_date:
            self.observation_date = timezone.now()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.name} - {self.user.name}"