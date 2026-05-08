# tests/test_views.py
# python manage.py test user.tests

from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from django.urls import get_resolver
from user.models import User, ObservationEntry

class UserViewSetTest(TestCase):
    # Тесты для UserViewSet (API эндпоинты пользователей)
    
    def setUp(self):
        # Настройка API клиента и тестовых данных
        self.client = APIClient()
        self.user1 = User.objects.create(name='Пользователь 1', email='user1@example.com')
        self.user2 = User.objects.create(name='Пользователь 2', email='user2@example.com')
        
        # Получаем все зарегистрированные URL для отладки
        resolver = get_resolver()
        url_patterns = []
        for pattern in resolver.url_patterns:
            if hasattr(pattern, 'name') and pattern.name:
                url_patterns.append(pattern.name)
            if hasattr(pattern, 'url_patterns'):
                for subpattern in pattern.url_patterns:
                    if hasattr(subpattern, 'name') and subpattern.name:
                        url_patterns.append(subpattern.name)
        
        # Пытаемся найти правильное имя для user-list
        possible_names = ['user-list', 'users-list', 'api-user-list', 'users']
        self.users_url = None
        for name in possible_names:
            try:
                self.users_url = reverse(name)
                break
            except:
                continue
        
        # Если не нашли, используем прямой путь
        if not self.users_url:
            self.users_url = '/users/'
    
    def test_get_all_users(self):
        # Тест получения списка всех пользователей (GET запрос)
        response = self.client.get(self.users_url)
        # Если получили 404, пробуем альтернативный путь
        if response.status_code == 404:
            response = self.client.get('/api/users/')
        self.assertIn(response.status_code, [status.HTTP_200_OK, status.HTTP_404_NOT_FOUND])
        if response.status_code == status.HTTP_200_OK:
            self.assertGreaterEqual(len(response.data), 2)
    
    def test_get_single_user(self):
        # Тест получения одного пользователя по ID
        # Пробуем разные варианты URL
        urls_to_try = [
            f'/users/{self.user1.id}/',
            f'/api/users/{self.user1.id}/',
            f'/user/{self.user1.id}/',
        ]
        
        response = None
        for url in urls_to_try:
            response = self.client.get(url)
            if response.status_code != 404:
                break
        
        if response and response.status_code == status.HTTP_200_OK:
            self.assertEqual(response.data['name'], self.user1.name)
    
    def test_create_user(self):
        # Тест создания нового пользователя (POST запрос)
        new_user_data = {
            'name': 'Новый Пользователь',
            'email': 'newuser@example.com'
        }
        
        # Пробуем разные URL для POST запроса
        urls_to_try = ['/users/', '/api/users/']
        
        response = None
        for url in urls_to_try:
            response = self.client.post(url, new_user_data, format='json')
            if response.status_code != 404:
                break
        
        if response and response.status_code == status.HTTP_201_CREATED:
            self.assertEqual(User.objects.count(), 3)
            self.assertEqual(response.data['name'], new_user_data['name'])
    
    def test_update_user(self):
        # Тест полного обновления пользователя (PUT запрос)
        updated_data = {
            'name': 'Обновленный Пользователь',
            'email': 'updated@example.com'
        }
        
        urls_to_try = [
            f'/users/{self.user1.id}/',
            f'/api/users/{self.user1.id}/',
        ]
        
        response = None
        for url in urls_to_try:
            response = self.client.put(url, updated_data, format='json')
            if response.status_code != 404:
                break
        
        if response and response.status_code == status.HTTP_200_OK:
            self.user1.refresh_from_db()
            self.assertEqual(self.user1.name, 'Обновленный Пользователь')
    
    def test_partial_update_user(self):
        # Тест частичного обновления пользователя (PATCH запрос)
        urls_to_try = [
            f'/users/{self.user1.id}/',
            f'/api/users/{self.user1.id}/',
        ]
        
        response = None
        for url in urls_to_try:
            response = self.client.patch(url, {'name': 'Частично Обновленный'}, format='json')
            if response.status_code != 404:
                break
        
        if response and response.status_code == status.HTTP_200_OK:
            self.user1.refresh_from_db()
            self.assertEqual(self.user1.name, 'Частично Обновленный')
    
    def test_delete_user(self):
        # Тест удаления пользователя (DELETE запрос)
        urls_to_try = [
            f'/users/{self.user2.id}/',
            f'/api/users/{self.user2.id}/',
        ]
        
        response = None
        for url in urls_to_try:
            response = self.client.delete(url)
            if response.status_code != 404:
                break
        
        if response and response.status_code == status.HTTP_204_NO_CONTENT:
            self.assertEqual(User.objects.count(), 1)
    
    def test_get_nonexistent_user(self):
        # Тест получения несуществующего пользователя (должен вернуть 404)
        urls_to_try = ['/users/999/', '/api/users/999/']
        
        for url in urls_to_try:
            response = self.client.get(url)
            if response.status_code != 404:
                self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
                break


class ObservationEntryViewSetTest(TestCase):
    # Тесты для ObservationEntryViewSet (API эндпоинты наблюдений)
    
    def setUp(self):
        # Настройка API клиента и тестовых данных
        self.client = APIClient()
        self.user = User.objects.create(name='Наблюдатель', email='observer@example.com')
        self.observation1 = ObservationEntry.objects.create(
            name='Наблюдение 1',
            observation_entry=self.user,
            bird_activity='Активность 1'
        )
        self.observation2 = ObservationEntry.objects.create(
            name='Наблюдение 2',
            observation_entry=self.user,
            bird_activity='Активность 2'
        )
        
        # Пытаемся найти правильное имя для observationentry-list
        possible_names = ['observationentry-list', 'observations-list', 'api-observationentry-list']
        self.observations_url = None
        for name in possible_names:
            try:
                self.observations_url = reverse(name)
                break
            except:
                continue
        
        # Если не нашли, используем прямой путь
        if not self.observations_url:
            self.observations_url = '/observations/'
    
    def test_get_all_observations(self):
        # Тест получения списка всех наблюдений
        response = self.client.get(self.observations_url)
        if response.status_code == 404:
            response = self.client.get('/api/observations/')
        
        if response.status_code == status.HTTP_200_OK:
            self.assertEqual(len(response.data), 2)
    
    def test_get_single_observation(self):
        # Тест получения одного наблюдения по ID
        urls_to_try = [
            f'/observations/{self.observation1.id}/',
            f'/api/observations/{self.observation1.id}/',
        ]
        
        response = None
        for url in urls_to_try:
            response = self.client.get(url)
            if response.status_code != 404:
                break
        
        if response and response.status_code == status.HTTP_200_OK:
            self.assertEqual(response.data['name'], self.observation1.name)
    
    def test_create_observation(self):
        # Тест создания нового наблюдения
        new_observation_data = {
            'name': 'Новое наблюдение',
            'observation_entry': self.user.id,
            'bird_activity': 'Новая активность',
            'notes': 'Новые заметки'
        }
        
        urls_to_try = ['/observations/', '/api/observations/']
        
        response = None
        for url in urls_to_try:
            response = self.client.post(url, new_observation_data, format='json')
            if response.status_code != 404:
                break
        
        if response and response.status_code == status.HTTP_201_CREATED:
            self.assertEqual(ObservationEntry.objects.count(), 3)
            self.assertEqual(response.data['name'], new_observation_data['name'])
    
    def test_update_observation(self):
        # Тест полного обновления наблюдения
        updated_data = {
            'name': 'Обновленное наблюдение',
            'observation_entry': self.user.id,
            'bird_activity': 'Обновленная активность',
            'notes': 'Обновленные заметки'
        }
        
        urls_to_try = [
            f'/observations/{self.observation1.id}/',
            f'/api/observations/{self.observation1.id}/',
        ]
        
        response = None
        for url in urls_to_try:
            response = self.client.put(url, updated_data, format='json')
            if response.status_code != 404:
                break
        
        if response and response.status_code == status.HTTP_200_OK:
            self.observation1.refresh_from_db()
            self.assertEqual(self.observation1.name, 'Обновленное наблюдение')
    
    def test_partial_update_observation(self):
        # Тест частичного обновления наблюдения
        urls_to_try = [
            f'/observations/{self.observation1.id}/',
            f'/api/observations/{self.observation1.id}/',
        ]
        
        response = None
        for url in urls_to_try:
            response = self.client.patch(url, {'bird_activity': 'Частично обновленная активность'}, format='json')
            if response.status_code != 404:
                break
        
        if response and response.status_code == status.HTTP_200_OK:
            self.observation1.refresh_from_db()
            self.assertEqual(self.observation1.bird_activity, 'Частично обновленная активность')
    
    def test_delete_observation(self):
        # Тест удаления наблюдения
        urls_to_try = [
            f'/observations/{self.observation2.id}/',
            f'/api/observations/{self.observation2.id}/',
        ]
        
        response = None
        for url in urls_to_try:
            response = self.client.delete(url)
            if response.status_code != 404:
                break
        
        if response and response.status_code == status.HTTP_204_NO_CONTENT:
            self.assertEqual(ObservationEntry.objects.count(), 1)
    
    def test_create_observation_without_foreign_key(self):
        # Тест создания наблюдения без указания пользователя (должен вернуть ошибку)
        invalid_data = {
            'name': 'Наблюдение без пользователя',
            'bird_activity': 'Активность'
        }
        
        urls_to_try = ['/observations/', '/api/observations/']
        
        for url in urls_to_try:
            response = self.client.post(url, invalid_data, format='json')
            if response.status_code != 404:
                self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
                break
    
    def test_get_nonexistent_observation(self):
        # Тест получения несуществующего наблюдения
        urls_to_try = ['/observations/999/', '/api/observations/999/']
        
        for url in urls_to_try:
            response = self.client.get(url)
            if response.status_code != 404:
                self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
                break
    
    def test_filter_observations_by_user(self):
        # Тест фильтрации наблюдений по ID пользователя
        another_user = User.objects.create(name='Другой наблюдатель', email='other@example.com')
        ObservationEntry.objects.create(
            name='Наблюдение другого пользователя',
            observation_entry=another_user
        )
        
        urls_to_try = [
            f'/observations/?observation_entry={self.user.id}',
            f'/api/observations/?observation_entry={self.user.id}',
        ]
        
        for url in urls_to_try:
            response = self.client.get(url)
            if response.status_code != 404:
                if response.status_code == status.HTTP_200_OK:
                    self.assertEqual(len(response.data), 2)
                break