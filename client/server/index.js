const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 8000;
const SECRET_KEY = 'beakbook_secret_key_2024';

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Приветственные маршруты
app.get('/', (req, res) => {
  res.json({
    message: 'BeakBook API Server',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      auth: {
        register: 'POST /api/user/register/',
        login: 'POST /api/user/login/',
        me: 'GET /api/user/me/'
      },
      observations: {
        list: 'GET /api/observations/',
        create: 'POST /api/observations/',
        update: 'PUT /api/observations/:id/',
        delete: 'DELETE /api/observations/:id/'
      },
      wiki: {
        list: 'GET /api/wiki/wikis/'
      }
    }
  });
});

app.get('/api', (req, res) => {
  res.json({
    message: 'BeakBook API',
    version: '1.0.0',
    endpoints: {
      register: '/api/user/register/',
      login: '/api/user/login/',
      observations: '/api/observations/',
      wikis: '/api/wiki/wikis/'
    }
  });
});

// Путь к файлу с данными
const DATA_FILE = path.join(__dirname, 'data.json');

// Инициализация базы данных
function initDB() {
  if (!fs.existsSync(DATA_FILE)) {
    const initialData = {
      users: [],
      observations: [],
      wikis: [
        {
          id: 1,
          name: "Как помочь птицам зимой",
          description: "Устраивайте кормушки с несолёным салом, семечками, крупой. Не забывайте добавлять воду.",
          author: "Орнитолог"
        },
        {
          id: 2,
          name: "Красная книга Оренбуржья",
          description: "В Оренбургской области охраняется более 90 видов птиц, включая дрофу, балобана, сапсана, степного орла.",
          author: "Природоохранная служба"
        },
        {
          id: 3,
          name: "Степной орёл – символ степи",
          description: "Крупная хищная птица, гнездится на деревьях и скалах. Находится под угрозой исчезновения.",
          author: "Орнитолог"
        }
      ]
    };
    fs.writeFileSync(DATA_FILE, JSON.stringify(initialData, null, 2));
  }
}

// Вспомогательные функции
function readDB() {
  const data = fs.readFileSync(DATA_FILE);
  return JSON.parse(data);
}

function writeDB(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// Middleware для проверки токена
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Требуется авторизация' });
  }
  
  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Недействительный токен' });
    }
    req.user = user;
    next();
  });
}

// Маршруты

// Регистрация
app.post('/api/user/register/', async (req, res) => {
  try {
    const { email, name, password } = req.body;
    const db = readDB();
    
    // Проверка существующего пользователя
    if (db.users.find(u => u.email === email)) {
      return res.status(400).json({ error: 'Пользователь с таким email уже существует' });
    }
    
    // Хеширование пароля
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Создание пользователя
    const newUser = {
      id: Date.now().toString(),
      email,
      name,
      password: hashedPassword
    };
    
    db.users.push(newUser);
    writeDB(db);
    
    // Создание токена
    const token = jwt.sign({ id: newUser.id, email: newUser.email, name: newUser.name }, SECRET_KEY, { expiresIn: '30d' });
    
    res.json({
      token,
      user: { id: newUser.id, name: newUser.name, email: newUser.email }
    });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Вход
app.post('/api/user/login/', async (req, res) => {
  try {
    const { email, password } = req.body;
    const db = readDB();
    
    const user = db.users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({ error: 'Неверный email или пароль' });
    }
    
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Неверный email или пароль' });
    }
    
    const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, SECRET_KEY, { expiresIn: '30d' });
    
    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email }
    });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Получение текущего пользователя
app.get('/api/user/me/', authenticateToken, (req, res) => {
  res.json({ user: { id: req.user.id, name: req.user.name, email: req.user.email } });
});

// Получение всех наблюдений пользователя
app.get('/api/observations/', authenticateToken, (req, res) => {
  const db = readDB();
  const userObservations = db.observations.filter(o => o.userId === req.user.id);
  res.json(userObservations);
});

// Добавление наблюдения
app.post('/api/observations/', authenticateToken, (req, res) => {
  const db = readDB();
  const newObservation = {
    ...req.body,
    id: Date.now(),
    userId: req.user.id,
    createdAt: new Date().toISOString()
  };
  db.observations.push(newObservation);
  writeDB(db);
  res.json(newObservation);
});

// Обновление наблюдения
app.put('/api/observations/:id/', authenticateToken, (req, res) => {
  const db = readDB();
  const id = parseInt(req.params.id);
  const index = db.observations.findIndex(o => o.id === id && o.userId === req.user.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Наблюдение не найдено' });
  }
  db.observations[index] = { ...db.observations[index], ...req.body };
  writeDB(db);
  res.json(db.observations[index]);
});

// Удаление наблюдения
app.delete('/api/observations/:id/', authenticateToken, (req, res) => {
  const db = readDB();
  const id = parseInt(req.params.id);
  const newObservations = db.observations.filter(o => o.id !== id || o.userId !== req.user.id);
  db.observations = newObservations;
  writeDB(db);
  res.json({ message: 'Удалено' });
});

// Получение вики-статей
app.get('/api/wiki/wikis/', (req, res) => {
  const db = readDB();
  res.json(db.wikis);
});

// Запуск сервера
initDB();
app.listen(PORT, () => {
  console.log(`\n✅ Сервер запущен на http://localhost:${PORT}`);
  console.log(`📡 API доступен по адресу: http://localhost:${PORT}/api`);
  console.log(`📖 Документация: http://localhost:${PORT}/\n`);
});