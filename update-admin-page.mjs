import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Обновляем AdminPage...');

const adminPagePath = path.join(__dirname, 'src', 'pages', 'AdminPage.jsx');

if (fs.existsSync(adminPagePath)) {
  let content = fs.readFileSync(adminPagePath, 'utf8');
  
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
      "const AdminPage = () => {",
      "const AdminPage = () => {\n  const { t } = useTranslation();"
    );
  }
  
  // Заменяем тексты
  const replacements = [
    { search: 'Доступ запрещён', replace: "{t('admin.accessDenied')}" },
    { search: 'Админ-панель', replace: "{t('admin.title')}" },
    { search: 'Всего:', replace: "{t('admin.totalUsers')}" },
    { search: 'пользователей', replace: "{t('admin.users')}" },
    { search: 'заказов', replace: "{t('admin.orders')}" },
    { search: 'Поиск по пользователям и заказам...', replace: "{t('admin.search')}" },
    { search: 'Пользователи', replace: "{t('admin.users')}" },
    { search: 'Заказы', replace: "{t('admin.orders')}" },
    { search: 'Статистика продаж', replace: "{t('admin.statistics')}" },
    { search: 'Товар', replace: "{t('admin.product')}" },
    { search: 'Количество', replace: "{t('admin.quantity')}" },
    { search: 'Общая сумма', replace: "{t('admin.totalSum')}" },
    { search: 'Недостаточно данных для статистики', replace: "{t('admin.notEnoughData')}" },
    { search: 'Загрузка...', replace: "{t('common.loading')}" }
  ];
  
  replacements.forEach(({ search, replace }) => {
    const regex = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
    content = content.replace(regex, replace);
  });
  
  fs.writeFileSync(adminPagePath, content);
  console.log('✅ AdminPage обновлен!');
} else {
  console.log('❌ AdminPage.jsx не найден');
}