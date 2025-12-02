import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Обновляем AuthModal...');

const authModalPath = path.join(__dirname, 'src', 'components', 'AuthModal.jsx');

if (fs.existsSync(authModalPath)) {
  let content = fs.readFileSync(authModalPath, 'utf8');
  
  // Добавляем импорт useTranslation
  if (!content.includes("useTranslation")) {
    content = content.replace(
      "import React, { useState } from 'react';",
      "import React, { useState } from 'react';\nimport { useTranslation } from 'react-i18next';"
    );
  }
  
  // Добавляем useTranslation в компонент
  if (!content.includes("const { t } = useTranslation();")) {
    content = content.replace(
      "const AuthModal = ({ isOpen, onClose }) => {",
      "const AuthModal = ({ isOpen, onClose }) => {\n  const { t } = useTranslation();"
    );
  }
  
  // Заменяем тексты
  const replacements = [
    { search: 'Вход', replace: "{t('auth.login')}" },
    { search: 'Регистрация', replace: "{t('auth.register')}" },
    { search: 'Имя', replace: "{t('auth.name')}" },
    { search: 'Email', replace: "{t('auth.email')}" },
    { search: 'Телефон', replace: "{t('auth.phone')}" },
    { search: 'Пароль', replace: "{t('auth.password')}" },
    { search: 'Ваше имя', replace: "{t('auth.name')}" },
    { search: 'you@example.com', replace: "{t('auth.email')}" },
    { search: 'Ваш пароль', replace: "{t('auth.password')}" },
    { search: 'Войти', replace: "{t('auth.login')}" },
    { search: 'Зарегистрироваться', replace: "{t('auth.register')}" },
    { search: 'Загрузка...', replace: "{t('common.loading')}" },
    { search: 'Нет аккаунта?', replace: "{t('auth.noAccount')}" },
    { search: 'Уже есть аккаунт?', replace: "{t('auth.hasAccount')}" },
    { search: 'Зарегистрироваться', replace: "{t('auth.register')}" },
    { search: 'Войти', replace: "{t('auth.login')}" },
    { search: 'Для демонстрации:', replace: "{t('auth.demoCredentials')}" },
    { search: 'Email: admin@saltlake.kz', replace: "{t('auth.demoEmail')}" },
    { search: 'Пароль: 123456', replace: "{t('auth.demoPassword')}" }
  ];
  
  replacements.forEach(({ search, replace }) => {
    const regex = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
    content = content.replace(regex, replace);
  });
  
  fs.writeFileSync(authModalPath, content);
  console.log('✅ AuthModal обновлен!');
} else {
  console.log('❌ AuthModal.jsx не найден');
}