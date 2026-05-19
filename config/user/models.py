from django.db import models

class User(models.Model):
    name = models.CharField(max_length = 100, verbose_name="Имя")
    email = models.TextField(blank=True,null=True, verbose_name="Почта")

    def __str__(self):
        return self.name
    
class ObservationEntry(models.Model):
    name = models.CharField(max_length = 100, verbose_name="Имя")
    observation_entry = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name="Запись наблюдений")
    bird_activity = models.TextField(blank=True,null=True, verbose_name="Примечание/заметка")
    notes = models.TextField(blank=True,null=True, verbose_name="Активность птиц")

    def __str__(self):
        return self.name