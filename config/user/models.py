from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.db import models
from django.utils import timezone

class UserManager(BaseUserManager):
    def create_user(self, email, name, password=None):
        if not email:
            raise ValueError('Email обязателен')
        user = self.model(email=self.normalize_email(email), name=name)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, name, password=None):
        user = self.create_user(email, name, password)
        user.is_admin = True
        user.save(using=self._db)
        return user

class User(AbstractBaseUser):
    email = models.EmailField(unique=True, verbose_name="Email")
    name = models.CharField(max_length=100, verbose_name="Имя")
    is_active = models.BooleanField(default=True)
    is_admin = models.BooleanField(default=False)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name']

    def __str__(self):
        return self.name

    def has_perm(self, perm, obj=None):
        return True

    def has_module_perms(self, app_label):
        return True

    @property
    def is_staff(self):
        return self.is_admin

# Модель наблюдений (была в вашем коде)
class ObservationEntry(models.Model):
    name = models.CharField(max_length=100, verbose_name="Название")
    user = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name="Пользователь", related_name='observations')

    # Внешние ключи к другим приложениям – если их нет, укажите null=True, blank=True
    bird_species = models.ManyToManyField(
        'Birds.BirdSpecies',
        blank=True,
        verbose_name="Виды птиц",
        related_name='observations'
    )
    wiki_articles = models.ManyToManyField(
        'wiki.Wiki',
        blank=True,
        verbose_name="Связанные статьи",
        related_name='observations'
    )
    bird_activity = models.TextField(blank=True, null=True, verbose_name="Активность птиц")
    notes = models.TextField(blank=True, null=True, verbose_name="Примечание/заметка")
    observation_date = models.DateTimeField(default=timezone.now, verbose_name="Дата наблюдения")
    location = models.CharField(max_length=200, blank=True, null=True, verbose_name="Место наблюдения")

    # Опциональные поля для геоданных (если нет моделей – убираем или оставляем с null=True)
    location_obj = models.ForeignKey(
        'Birds.Location',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        verbose_name="Локация наблюдения",
        related_name='observations'
    )
    migration_route = models.ForeignKey(
        'Birds.MigrationRoute',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        verbose_name="Маршрут миграции",
        related_name='observations'
    )
    nesting_site = models.ForeignKey(
        'Birds.NestingSite',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        verbose_name="Гнездовье",
        related_name='observations'
    )
    nesting_status = models.ForeignKey(
        'Birds.NestingStatus',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        verbose_name="Статус гнездования",
        related_name='observations'
    )
    sighting_during_migration = models.ForeignKey(
        'Birds.SightingDuringMigration',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        verbose_name="Наблюдение во время миграции",
        related_name='observations'
    )
    bird_photos = models.ManyToManyField(
        'wiki.BirdPhoto',
        blank=True,
        verbose_name="Фотографии птицы",
        related_name='observations'
    )

    def __str__(self):
        return f"{self.name} - {self.user.name}"