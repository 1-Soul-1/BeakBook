from django.db import models

class Wiki(models.Model):
    name = models.CharField(max_length=100, verbose_name="Имя")
    description = models.TextField(blank=True, null=True, verbose_name="Описание статьи")
    author = models.TextField(blank=True, null=True, verbose_name="Автор статьи")

    def __str__(self):
        return self.name

class BirdPhoto(models.Model):
    name = models.CharField(max_length=100, verbose_name="Название фото")
    bird_species = models.ForeignKey('Birds.BirdSpecies', on_delete=models.CASCADE, verbose_name="Вид птицы", null=True, blank=True)
    wiki = models.ForeignKey(Wiki, on_delete=models.CASCADE, verbose_name="Связанная статья", null=True, blank=True)
    photographer = models.CharField(max_length=100, blank=True, null=True, verbose_name="Фотограф")
    description = models.TextField(blank=True, null=True, verbose_name="Описание фото")
    image = models.ImageField(upload_to='bird_photos/', blank=True, null=True, verbose_name="Изображение")

    def __str__(self):
        return self.name

class BirdCall(models.Model):
    name = models.CharField(max_length=100, verbose_name="Название звука/крика", default="", blank=True)
    bird_species = models.ForeignKey('Birds.BirdSpecies', on_delete=models.CASCADE, verbose_name="Вид птицы", null=True, blank=True)
    description = models.TextField(blank=True, null=True, verbose_name="Описание звука")

    def __str__(self):
        return self.name if self.name else "Без названия"