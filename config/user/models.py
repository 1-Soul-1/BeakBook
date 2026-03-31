from django.db import models

class User(models.Model):
    name = models.CharField(max_length = 100)
    email = models.TextField(blank=True,null=True)

    def __str__(self):
        return self.name
    
class ObservationEntry(models.Model):
    name = models.CharField(max_length = 100)
    observation_entry = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name="Гнездовье")
    email = models.TextField(blank=True,null=True)

    def __str__(self):
        return self.name