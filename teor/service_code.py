# Вся алгоритмическая логика; работа с несколькими моделями; рассчёты; валидация, требущая доступ к БД.
# from typing import List, Set
# from django.db.models import Prefetch
# from Product.models import Dish
# from .models import dish

# class DishesSelectionService:
#     # сервис для подбора продуктов по выбранной категории и ____

#     # Метод класса, который не получает автоматически ссылку на экземпляр класса(self) и не получает ссылку на сам класс.
#     # Формально ведёт себя, как обычная функция, но логически принадлежит самому классу и вызывается через класс или его экземпляр.

#     @staticmethod
#     def get_possible_dishes(category_id: int, product_ids: List[int]) -> List['Dish']:
#         # возвращаем список продуктов с заданной категорией, для которых все ингредиенты содержатся product_id
#         # получает ___ нужной категории с предварительной загрузкой ингредиентов
#         dishes = Dish.objects.filter(category_id=category_id).prefetch_related(
#             Prefetch('products', queryset=Product.objects.only('id'))
#         )
#         product_set = set(product_ids)
#         result = []
#         for dish in dishes:
#             dish_product_set = set(dish.products.values_list('id', flat=True))
#             if dish_product_set.issubset(product_set):
#                 result.append(dish)
#         return result
    
#     @staticmethod
#     # для формы выбора возвращаем все категории с их продуктами
#     def get_dish_and_category():
#         return Category.objects.prefetch_related('dishes').all()