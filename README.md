# 🦷 Dental Smile Backend

Бэкенд для обработки форм сайта Dental Smile. Отправляет заявки на email и в Telegram.

## 🚀 Быстрый старт

### 1. Установка
```bash
npm install
```

### 2. Настройка
```bash
cp .env.example .env
# Отредактируй .env файл
```

### 3. Запуск
```bash
npm start
# или для разработки:
npm run dev
```

---

## 📧 Настройка Email (Gmail)

### Шаг 1: Включи двухфакторную аутентификацию
1. Иди на https://myaccount.google.com/security
2. Включи "Двухэтапная аутентификация"

### Шаг 2: Создай App Password
1. Иди на https://myaccount.google.com/apppasswords
2. Выбери "Почта" и "Другое (укажите название)"
3. Назови "Dental Smile Backend"
4. Скопируй полученный пароль (16 символов)

### Шаг 3: Заполни .env
```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=xxxx xxxx xxxx xxxx
EMAIL_RECIPIENTS=doctor@clinic.com,admin@clinic.com
```

---

## 📱 Настройка Telegram

### Шаг 1: Создай бота
1. Напиши @BotFather в Telegram
2. Отправь `/newbot`
3. Придумай имя и username
4. Скопируй токен

### Шаг 2: Получи Chat ID

**Для личных сообщений:**
1. Напиши что-нибудь своему боту
2. Открой: `https://api.telegram.org/bot<TOKEN>/getUpdates`
3. Найди `"chat":{"id":123456789}` — это твой ID

**Для группы:**
1. Добавь бота в группу
2. Сделай его администратором
3. Напиши что-нибудь в группе
4. Открой: `https://api.telegram.org/bot<TOKEN>/getUpdates`
5. Найди ID группы (начинается с `-100...`)

### Шаг 3: Заполни .env
```env
TELEGRAM_BOT_TOKEN=123456789:ABCdefGHIjklMNOpqrsTUVwxyz
TELEGRAM_CHAT_ID=-1001234567890
```

---

## 🌐 Деплой на Render (бесплатно)

### Шаг 1: Подготовка
1. Создай репозиторий на GitHub
2. Запуш код:
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/USERNAME/dental-smile-backend.git
git push -u origin main
```

### Шаг 2: Деплой
1. Иди на https://render.com
2. Sign up через GitHub
3. New → Web Service
4. Подключи репозиторий
5. Настройки:
   - **Name:** dental-smile-backend
   - **Runtime:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
6. Добавь Environment Variables (из .env)
7. Create Web Service

### Шаг 3: Получи URL
После деплоя получишь URL типа:
```
https://dental-smile-backend.onrender.com
```

---

## 🔌 API Endpoints

### POST /api/contact
Отправка формы

**Request:**
```json
{
  "name": "Иван Иванов",
  "phone": "+49 123 456 7890",
  "email": "ivan@example.com",
  "service": "Имплантация",
  "message": "Хочу записаться на консультацию"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Form submitted successfully",
  "details": {
    "emailSent": true,
    "telegramSent": true
  }
}
```

### GET /api/health
Проверка работоспособности

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

## 🔧 Интеграция с фронтендом

```javascript
const handleSubmit = async (formData) => {
  try {
    const response = await fetch('https://your-backend.onrender.com/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    
    const result = await response.json();
    
    if (result.success) {
      alert('Заявка отправлена!');
    } else {
      alert('Ошибка отправки');
    }
  } catch (error) {
    console.error('Error:', error);
  }
};
```

---

## 📝 Лицензия

MIT
