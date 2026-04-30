from django.db import models

class Wiki(models.Model):
    name = models.CharField(max_length = 100)
    description = models.TextField(blank=True,null=True)
    author = models.TextField(blank=True,null=True)

    def __str__(self):
        return self.name

class BirdPhoto(models.Model):
    name = models.CharField(max_length = 100)
    bird_photo = models.ForeignKey(Wiki, on_delete=models.CASCADE, verbose_name="Фото птицы")
    author = models.TextField(blank=True,null=True)

    def __str__(self):
        return self.name

class BirdCall(models.Model):
    description = models.TextField(blank=True,null=True)

    def __str__(self):
        # Возвращаем строку, даже если description None или пустой
        if self.description:
            return self.description
        return "Без описания"  # или return "" (пустую строку)