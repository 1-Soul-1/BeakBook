from django.db import models

class Wiki(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    author = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.name

class BirdPhoto(models.Model):
    name = models.CharField(max_length=100)
    bird_photo = models.ForeignKey(Wiki, on_delete=models.CASCADE, verbose_name="Фото птицы")
    author = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.name

class BirdCall(models.Model):
    name = models.CharField(max_length=100, verbose_name="Название звука/крика", default="", blank=True)  # <-- добавил default="", blank=True
    bird_species = models.ForeignKey('Birds.BirdSpecies', on_delete=models.CASCADE, verbose_name="Вид птицы", null=True, blank=True)
    description = models.TextField(blank=True, null=True, verbose_name="Описание звука")

    def __str__(self):
        return self.name if self.name else "Без названия"