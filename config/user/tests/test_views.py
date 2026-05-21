# user/tests/test_views.py
# python manage.py test user.tests
# pytest -v

from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from user.models import User, ObservationEntry


class UserViewSetTest(TestCase):
    # Тесты для UserViewSet (API эндпоинты пользователей)
    
    def setUp(self):
        # Настройка API клиента и тестовых данных
        self.client = APIClient()
        self.user1 = User.objects.create(name='Пользователь 1', email='user1@example.com')
        self.user2 = User.objects.create(name='Пользователь 2', email='user2@example.com')
    
    def test_get_all_users(self):
        # Тест получения списка всех пользователей (GET запрос)
        url = reverse('user-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)
    
    def test_get_single_user(self):
        # Тест получения одного пользователя по ID
        url = reverse('user-detail', args=[self.user1.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], self.user1.name)
    
    def test_create_user(self):
        # Тест создания нового пользователя (POST запрос)
        new_user_data = {
            'name': 'Новый Пользователь',
            'email': 'newuser@example.com'
        }
        url = reverse('user-list')
        response = self.client.post(url, new_user_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(User.objects.count(), 3)
        self.assertEqual(response.data['name'], new_user_data['name'])
    
    def test_update_user(self):
        # Тест полного обновления пользователя (PUT запрос)
        updated_data = {
            'name': 'Обновленный Пользователь',
            'email': 'updated@example.com'
        }
        url = reverse('user-detail', args=[self.user1.id])
        response = self.client.put(url, updated_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.user1.refresh_from_db()
        self.assertEqual(self.user1.name, 'Обновленный Пользователь')
    
    def test_partial_update_user(self):
        # Тест частичного обновления пользователя (PATCH запрос)
        url = reverse('user-detail', args=[self.user1.id])
        response = self.client.patch(url, {'name': 'Частично Обновленный'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.user1.refresh_from_db()
        self.assertEqual(self.user1.name, 'Частично Обновленный')
    
    def test_delete_user(self):
        # Тест удаления пользователя (DELETE запрос)
        url = reverse('user-detail', args=[self.user2.id])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(User.objects.count(), 1)
    
    def test_get_nonexistent_user(self):
        # Тест получения несуществующего пользователя (должен вернуть 404)
        url = reverse('user-detail', args=[999])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


class ObservationEntryViewSetTest(TestCase):
    # Тесты для ObservationEntryViewSet (API эндпоинты наблюдений)
    
    def setUp(self):
        # Настройка API клиента и тестовых данных
        self.client = APIClient()
        self.user = User.objects.create(name='Наблюдатель', email='observer@example.com')
        self.observation1 = ObservationEntry.objects.create(
            name='Наблюдение 1',
            user=self.user,
            bird_activity='Активность 1'
        )
        self.observation2 = ObservationEntry.objects.create(
            name='Наблюдение 2',
            user=self.user,
            bird_activity='Активность 2'
        )
    
    def test_get_all_observations(self):
        # Тест получения списка всех наблюдений
        url = reverse('observationentry-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)
    
    def test_get_single_observation(self):
        # Тест получения одного наблюдения по ID
        url = reverse('observationentry-detail', args=[self.observation1.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], self.observation1.name)
    
    def test_create_observation(self):
        # Тест создания нового наблюдения
        new_observation_data = {
            'name': 'Новое наблюдение',
            'user': self.user.id,
            'bird_activity': 'Новая активность',
            'notes': 'Новые заметки'
        }
        url = reverse('observationentry-list')
        response = self.client.post(url, new_observation_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(ObservationEntry.objects.count(), 3)
        self.assertEqual(response.data['name'], new_observation_data['name'])
    
    def test_update_observation(self):
        # Тест полного обновления наблюдения
        updated_data = {
            'name': 'Обновленное наблюдение',
            'user': self.user.id,
            'bird_activity': 'Обновленная активность',
            'notes': 'Обновленные заметки'
        }
        url = reverse('observationentry-detail', args=[self.observation1.id])
        response = self.client.put(url, updated_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.observation1.refresh_from_db()
        self.assertEqual(self.observation1.name, 'Обновленное наблюдение')
    
    def test_partial_update_observation(self):
        # Тест частичного обновления наблюдения
        url = reverse('observationentry-detail', args=[self.observation1.id])
        response = self.client.patch(url, {'bird_activity': 'Частично обновленная активность'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.observation1.refresh_from_db()
        self.assertEqual(self.observation1.bird_activity, 'Частично обновленная активность')
    
    def test_delete_observation(self):
        # Тест удаления наблюдения
        url = reverse('observationentry-detail', args=[self.observation2.id])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(ObservationEntry.objects.count(), 1)
    
    def test_create_observation_without_foreign_key(self):
        # Тест создания наблюдения без указания пользователя (должен вернуть ошибку)
        invalid_data = {
            'name': 'Наблюдение без пользователя',
            'bird_activity': 'Активность'
        }
        url = reverse('observationentry-list')
        response = self.client.post(url, invalid_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('user', response.data)
    
    def test_get_nonexistent_observation(self):
        # Тест получения несуществующего наблюдения
        url = reverse('observationentry-detail', args=[999])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
    
    def test_filter_observations_by_user(self):
        # Тест проверки связи наблюдений с пользователями
        
        # Создаем пользователей
        user1 = User.objects.create(name='Пользователь 1', email='user1@example.com')
        user2 = User.objects.create(name='Пользователь 2', email='user2@example.com')
        
        # Создаем наблюдения
        observation1 = ObservationEntry.objects.create(
            name='Наблюдение 1',
            user=user1,
            bird_activity='Активность 1'
        )
        
        observation2 = ObservationEntry.objects.create(
            name='Наблюдение 2',
            user=user1,
            bird_activity='Активность 2'
        )
        
        observation3 = ObservationEntry.objects.create(
            name='Наблюдение 3',
            user=user2,
            bird_activity='Активность 3'
        )
        
        # Получаем все наблюдения через API
        url = reverse('observationentry-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Проверяем, что все наблюдения возвращаются (3 новых + 2 из setUp = 5)
        self.assertEqual(len(response.data), 5)
        
        # Проверяем, что у каждого наблюдения есть поле user
        for observation in response.data:
            self.assertIn('user', observation)
            self.assertIsNotNone(observation['user'])
        
        # Проверяем, что наблюдения user1 имеют правильные имена
        user1_obs = [obs for obs in response.data if obs.get('user') == user1.id]
        user1_names = [obs['name'] for obs in user1_obs]
        self.assertIn('Наблюдение 1', user1_names)
        self.assertIn('Наблюдение 2', user1_names)
        self.assertEqual(len(user1_obs), 2)
        
        # Проверяем, что наблюдение user2 имеет правильное имя
        user2_obs = [obs for obs in response.data if obs.get('user') == user2.id]
        user2_names = [obs['name'] for obs in user2_obs]
        self.assertIn('Наблюдение 3', user2_names)
        self.assertEqual(len(user2_obs), 1)
        
        # Проверяем, что наблюдения из setUp принадлежат правильному пользователю
        user_setup_obs = [obs for obs in response.data if obs.get('user') == self.user.id]
        setup_names = [obs['name'] for obs in user_setup_obs]
        self.assertIn('Наблюдение 1', setup_names)
        self.assertIn('Наблюдение 2', setup_names)
        self.assertEqual(len(user_setup_obs), 2)
        
        # Проверяем соответствие между API данными и БД
        for observation in response.data:
            db_observation = ObservationEntry.objects.get(id=observation['id'])
            self.assertEqual(db_observation.user.id, observation['user'])
            self.assertEqual(db_observation.name, observation['name'])
            self.assertEqual(db_observation.bird_activity, observation['bird_activity'])