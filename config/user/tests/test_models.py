# tests/test_models.py
# python manage.py test user.tests

import pytest
from django.test import TestCase
from django.db import IntegrityError
from user.models import User, ObservationEntry

class UserModelTest(TestCase):
    # Тесты для модели User
    
    def setUp(self):
        # Создание тестовых данных
        self.user_data = {
            'name': 'Иван Петров',
            'email': 'ivan@example.com'
        }
        self.user = User.objects.create(**self.user_data)
    
    def test_create_user(self):
        # Тест создания пользователя
        user = User.objects.create(
            name='Тестовый Пользователь',
            email='test@example.com'
        )
        self.assertEqual(user.name, 'Тестовый Пользователь')
        self.assertEqual(user.email, 'test@example.com')
    
    def test_user_str_method(self):
        # Тест строкового представления пользователя
        self.assertEqual(str(self.user), self.user.name)
    
    def test_user_email_nullable(self):
        # Тест что email может быть null
        user = User.objects.create(name='Пользователь без email', email=None)
        self.assertIsNone(user.email)
    
    def test_user_email_blank(self):
        # Тест что email может быть пустым
        user = User.objects.create(name='Пользователь с пустым email', email='')
        self.assertEqual(user.email, '')
    
    def test_user_name_required(self):
        # Тест что name обязательное поле
        user = User(name='', email='test@example.com')
        with pytest.raises(Exception):
            user.full_clean()
    
    def test_user_update(self):
        # Тест обновления пользователя
        self.user.name = 'Обновленное Имя'
        self.user.save()
        updated_user = User.objects.get(id=self.user.id)
        self.assertEqual(updated_user.name, 'Обновленное Имя')


class ObservationEntryModelTest(TestCase):
    # Тесты для модели ObservationEntry
    
    def setUp(self):
        # Создание тестового пользователя и наблюдения
        self.user = User.objects.create(
            name='Наблюдатель',
            email='observer@example.com'
        )
        self.observation_data = {
            'name': 'Наблюдение за синицей',
            'observation_entry': self.user,
            'bird_activity': 'Синица кормится на кормушке',
            'notes': 'Дополнительные заметки'
        }
        self.observation = ObservationEntry.objects.create(**self.observation_data)
    
    def test_create_observation(self):
        # Тест создания записи наблюдений
        observation = ObservationEntry.objects.create(
            name='Новое наблюдение',
            observation_entry=self.user,
            bird_activity='Активность птицы',
            notes='Заметки'
        )
        self.assertEqual(observation.name, 'Новое наблюдение')
        self.assertEqual(observation.observation_entry, self.user)
    
    def test_observation_str_method(self):
        # Тест строкового представления наблюдения
        self.assertEqual(str(self.observation), self.observation.name)
    
    def test_observation_bird_activity_nullable(self):
        # Тест что bird_activity может быть null
        observation = ObservationEntry.objects.create(
            name='Наблюдение без активности',
            observation_entry=self.user,
            bird_activity=None,
            notes='Только заметки'
        )
        self.assertIsNone(observation.bird_activity)
    
    def test_observation_notes_blank(self):
        # Тест что notes может быть пустым
        observation = ObservationEntry.objects.create(
            name='Наблюдение без заметок',
            observation_entry=self.user,
            bird_activity='Активность есть',
            notes=''
        )
        self.assertEqual(observation.notes, '')
    
    def test_observation_foreign_key_constraint(self):
        # Тест внешнего ключа - каскадное удаление
        observation_count = ObservationEntry.objects.filter(observation_entry=self.user).count()
        self.assertEqual(observation_count, 1)
        
        # Сохраняем ID пользователя до удаления
        user_id = self.user.id
        
        # Удаляем пользователя
        self.user.delete()
        
        # Проверяем, что наблюдения удалились (фильтруем по ID, а не по объекту)
        observation_count_after = ObservationEntry.objects.filter(observation_entry_id=user_id).count()
        self.assertEqual(observation_count_after, 0)
    
    def test_observation_required_fields(self):
        # Тест обязательных полей
        observation = ObservationEntry(
            name='',
            observation_entry=self.user
        )
        with pytest.raises(Exception):
            observation.full_clean()
    
    def test_observation_update(self):
        # Тест обновления наблюдения
        self.observation.bird_activity = 'Обновленная активность'
        self.observation.save()
        updated_observation = ObservationEntry.objects.get(id=self.observation.id)
        self.assertEqual(updated_observation.bird_activity, 'Обновленная активность')
    
    def test_multiple_observations_per_user(self):
        # Тест что у пользователя может быть несколько наблюдений
        ObservationEntry.objects.create(
            name='Наблюдение 2',
            observation_entry=self.user,
            bird_activity='Активность 2'
        )
        ObservationEntry.objects.create(
            name='Наблюдение 3',
            observation_entry=self.user,
            bird_activity='Активность 3'
        )
        
        observations = ObservationEntry.objects.filter(observation_entry=self.user)
        self.assertEqual(observations.count(), 3)