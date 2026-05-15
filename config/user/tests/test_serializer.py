# tests/test_serializers.py
# python manage.py test user.tests

import pytest
from django.test import TestCase
from user.models import User, ObservationEntry
from config.user.api.serializers import UserSerializer, ObservationEntrySerializer

class UserSerializerTest(TestCase):
    # Тесты для сериализатора User
    
    def setUp(self):
        # Подготовка тестовых данных
        self.user_data = {
            'name': 'Тестовый Пользователь',
            'email': 'test@example.com'
        }
        self.user = User.objects.create(**self.user_data)
    
    def test_user_serializer_valid_data(self):
        # Тест валидных данных для UserSerializer
        serializer = UserSerializer(data=self.user_data)
        self.assertTrue(serializer.is_valid())
        user = serializer.save()
        self.assertEqual(user.name, self.user_data['name'])
        self.assertEqual(user.email, self.user_data['email'])
    
    def test_user_serializer_missing_name(self):
        # Тест отсутствия обязательного поля name
        invalid_data = {'email': 'test@example.com'}
        serializer = UserSerializer(data=invalid_data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('name', serializer.errors)
    
    def test_user_serializer_update(self):
        # Тест обновления через сериализатор
        updated_data = {'name': 'Обновленное Имя', 'email': 'updated@example.com'}
        serializer = UserSerializer(instance=self.user, data=updated_data)
        self.assertTrue(serializer.is_valid())
        updated_user = serializer.save()
        self.assertEqual(updated_user.name, 'Обновленное Имя')
        self.assertEqual(updated_user.email, 'updated@example.com')
    
    def test_user_serializer_partial_update(self):
        # Тест частичного обновления
        serializer = UserSerializer(instance=self.user, data={'name': 'Новое Имя'}, partial=True)
        self.assertTrue(serializer.is_valid())
        updated_user = serializer.save()
        self.assertEqual(updated_user.name, 'Новое Имя')
        self.assertEqual(updated_user.email, self.user.email)
    
    def test_user_serializer_serialization(self):
        # Тест сериализации объекта User в JSON
        serializer = UserSerializer(self.user)
        data = serializer.data
        self.assertEqual(data['id'], self.user.id)
        self.assertEqual(data['name'], self.user.name)
        self.assertEqual(data['email'], self.user.email)


class ObservationEntrySerializerTest(TestCase):
    # Тесты для сериализатора ObservationEntry
    
    def setUp(self):
        # Создание тестового пользователя и данных наблюдения
        self.user = User.objects.create(
            name='Наблюдатель',
            email='observer@example.com'
        )
        self.observation_data = {
            'name': 'Наблюдение за птицей',
            'observation_entry': self.user.id,
            'bird_activity': 'Птица поет',
            'notes': 'Звонкое пение'
        }
        self.observation = ObservationEntry.objects.create(
            name='Существующее наблюдение',
            observation_entry=self.user,
            bird_activity='Старая активность'
        )
    
    def test_observation_serializer_valid_data(self):
        # Тест валидных данных для ObservationEntrySerializer
        serializer = ObservationEntrySerializer(data=self.observation_data)
        self.assertTrue(serializer.is_valid())
        observation = serializer.save()
        self.assertEqual(observation.name, self.observation_data['name'])
        self.assertEqual(observation.observation_entry.id, self.observation_data['observation_entry'])
    
    def test_observation_serializer_missing_name(self):
        # Тест отсутствия обязательного поля name
        invalid_data = {
            'observation_entry': self.user.id,
            'bird_activity': 'Активность'
        }
        serializer = ObservationEntrySerializer(data=invalid_data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('name', serializer.errors)
    
    def test_observation_serializer_missing_foreign_key(self):
        # Тест отсутствия внешнего ключа
        invalid_data = {
            'name': 'Наблюдение',
            'bird_activity': 'Активность'
        }
        serializer = ObservationEntrySerializer(data=invalid_data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('observation_entry', serializer.errors)
    
    def test_observation_serializer_update(self):
        # Тест полного обновления через сериализатор
        updated_data = {
            'name': 'Обновленное наблюдение',
            'observation_entry': self.user.id,
            'bird_activity': 'Новая активность',
            'notes': 'Обновленные заметки'
        }
        serializer = ObservationEntrySerializer(instance=self.observation, data=updated_data)
        self.assertTrue(serializer.is_valid())
        updated_observation = serializer.save()
        self.assertEqual(updated_observation.name, 'Обновленное наблюдение')
        self.assertEqual(updated_observation.bird_activity, 'Новая активность')
    
    def test_observation_serializer_partial_update(self):
        # Тест частичного обновления
        serializer = ObservationEntrySerializer(
            instance=self.observation, 
            data={'bird_activity': 'Обновленная активность'}, 
            partial=True
        )
        self.assertTrue(serializer.is_valid())
        updated_observation = serializer.save()
        self.assertEqual(updated_observation.bird_activity, 'Обновленная активность')
        self.assertEqual(updated_observation.name, self.observation.name)
    
    def test_observation_serializer_serialization(self):
        # Тест сериализации объекта ObservationEntry в JSON
        serializer = ObservationEntrySerializer(self.observation)
        data = serializer.data
        self.assertEqual(data['id'], self.observation.id)
        self.assertEqual(data['name'], self.observation.name)
        self.assertEqual(data['observation_entry'], self.observation.observation_entry.id)