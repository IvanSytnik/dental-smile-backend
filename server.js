const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Email transporter configuration for Outlook
const transporter = nodemailer.createTransport({
  host: 'smtp-mail.outlook.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    ciphers: 'SSLv3',
    rejectUnauthorized: false
  }
});

// Функция отправки в Telegram
async function sendToTelegram(message) {
  const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.log('Telegram not configured, skipping...');
    return false;
  }

  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'HTML'
      })
    });

    const result = await response.json();
    if (!result.ok) {
      console.error('Telegram error:', result);
      return false;
    }
    return true;
  } catch (error) {
    console.error('Telegram send error:', error);
    return false;
  }
}

// Функция отправки email
async function sendEmail(formData) {
  const { name, phone, email, service, message } = formData;

  const emailContent = `
    <h2>🦷 Новая заявка с сайта Dental Smile</h2>
    <hr>
    <p><strong>Имя:</strong> ${name}</p>
    <p><strong>Телефон:</strong> ${phone}</p>
    <p><strong>Email:</strong> ${email || 'Не указан'}</p>
    <p><strong>Услуга:</strong> ${service || 'Не выбрана'}</p>
    <p><strong>Сообщение:</strong></p>
    <p>${message || 'Не указано'}</p>
    <hr>
    <p><small>Отправлено: ${new Date().toLocaleString('de-DE', { timeZone: 'Europe/Berlin' })}</small></p>
  `;

  // Список получателей (можно указать несколько через запятую)
  const recipients = process.env.EMAIL_RECIPIENTS || process.env.EMAIL_USER;

  const mailOptions = {
    from: `"Dental Smile Website" <${process.env.EMAIL_USER}>`,
    to: recipients,
    subject: `🦷 Новая заявка: ${name} - ${phone}`,
    html: emailContent
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Email send error:', error);
    return false;
  }
}

// API endpoint для формы
app.post('/api/contact', async (req, res) => {
  const { name, phone, email, service, message } = req.body;

  // Валидация
  if (!name || !phone) {
    return res.status(400).json({
      success: false,
      message: 'Name and phone are required'
    });
  }

  console.log('📨 New contact form submission:', { name, phone, email, service });

  // Формируем сообщение для Telegram
  const telegramMessage = `
<b>🦷 Новая заявка с сайта!</b>

<b>Имя:</b> ${name}
<b>Телефон:</b> ${phone}
<b>Email:</b> ${email || 'Не указан'}
<b>Услуга:</b> ${service || 'Не выбрана'}
<b>Сообщение:</b> ${message || 'Не указано'}

<i>📅 ${new Date().toLocaleString('de-DE', { timeZone: 'Europe/Berlin' })}</i>
  `.trim();

  // Отправляем параллельно
  const results = await Promise.allSettled([
    sendEmail(req.body),
    sendToTelegram(telegramMessage)
  ]);

  const emailSent = results[0].status === 'fulfilled' && results[0].value;
  const telegramSent = results[1].status === 'fulfilled' && results[1].value;

  console.log(`Results - Email: ${emailSent}, Telegram: ${telegramSent}`);

  // Если хотя бы один способ сработал - успех
  if (emailSent || telegramSent) {
    return res.json({
      success: true,
      message: 'Form submitted successfully',
      details: { emailSent, telegramSent }
    });
  }

  return res.status(500).json({
    success: false,
    message: 'Failed to send notification'
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'Dental Smile Backend',
    version: '1.0.0',
    endpoints: {
      'POST /api/contact': 'Submit contact form',
      'GET /api/health': 'Health check'
    }
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📧 Email configured: ${process.env.EMAIL_USER ? 'Yes' : 'No'}`);
  console.log(`📱 Telegram configured: ${process.env.TELEGRAM_BOT_TOKEN ? 'Yes' : 'No'}`);
});