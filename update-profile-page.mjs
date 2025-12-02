import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Обновляем ProfilePage...');

const profilePagePath = path.join(__dirname, 'src', 'pages', 'ProfilePage.jsx');

if (fs.existsSync(profilePagePath)) {
  let content = fs.readFileSync(profilePagePath, 'utf8');
  
  // Добавляем импорт useTranslation
  if (!content.includes("useTranslation")) {
    content = content.replace(
      "import React, { useEffect, useState } from 'react';",
      "import React, { useEffect, useState } from 'react';\nimport { useTranslation } from 'react-i18next';"
    );
  }
  
  // Добавляем useTranslation в компонент
  if (!content.includes("const { t } = useTranslation();")) {
    content = content.replace(
      "const ProfilePage = () => {",
      "const ProfilePage = () => {\n  const { t } = useTranslation();"
    );
  }
  
  // Заменяем тексты
  const replacements = [
    { search: 'Профиль', replace: "{t('profile.title')}" },
    { search: 'Войдите, чтобы увидеть профиль.', replace: "{t('profile.accessDenied')}" },
    { search: 'Личные данные', replace: "{t('profile.personalData')}" },
    { search: 'История заказов', replace: "{t('profile.orderHistory')}" },
    { search: 'Заказов пока нет.', replace: "{t('profile.noOrders')}" },
    { search: 'Заказ #', replace: "{t('profile.orderNumber')}" },
    { search: 'Позиций:', replace: "{t('profile.itemsCount')}" },
    { search: 'Сумма:', replace: "{t('profile.totalAmount')}" },
    { search: 'Повторить заказ', replace: "{t('profile.repeatOrder')}" },
    { search: 'Загрузка…', replace: "{t('profile.loading')}" },
    { search: 'Имя', replace: "{t('auth.name')}" },
    { search: 'Email', replace: "{t('auth.email')}" },
    { search: 'Телефон', replace: "{t('auth.phone')}" }
  ];
  
  replacements.forEach(({ search, replace }) => {
    const regex = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
    content = content.replace(regex, replace);
  });
  
  fs.writeFileSync(profilePagePath, content);
  console.log('✅ ProfilePage обновлен!');
} else {
  console.log('❌ ProfilePage.jsx не найден');
}