from typing import List, Set
from django.db.models import Prefetch
from Birds.models import Birds, Location, BirdSpecies, NestingSite, NestingStatus, MigrationRoute, SightingDuringMigration
from .models import wiki

class WikiSelectionService:
    # сервис для подбора ___ по выбранной ____ и ____

    # Метод класса, который не получает автоматически ссылку на экземпляр класса(self) и не получает ссылку на сам класс.
    # Формально ведёт себя, как обычная функция, но логически принадлежит самому классу и вызывается через класс или его экземпляр.
    @staticmethod
    