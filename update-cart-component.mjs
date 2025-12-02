import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Обновляем Cart компонент...');

const cartPath = path.join(__dirname, 'src', 'components', 'Cart.jsx');

if (fs.existsSync(cartPath)) {
  let content = fs.readFileSync(cartPath, 'utf8');
  
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
      "const Cart = () => {",
      "const Cart = () => {\n  const { t } = useTranslation();"
    );
  }
  
  // Заменяем тексты
  const replacements = [
    { search: 'Корзина', replace: "{t('cart.title')}" },
    { search: 'Корзина пуста', replace: "{t('cart.empty')}" },
    { search: 'Добавьте товары из каталога', replace: "{t('cart.emptyDescription')}" },
    { search: 'Итого:', replace: "{t('cart.total')}" },
    { search: 'Очистить корзину', replace: "{t('cart.clearCart')}" },
    { search: 'Оформить заказ', replace: "{t('cart.checkout')}" },
    { search: 'товаров', replace: "{t('cart.items')}" },
    { search: 'Удалить', replace: "{t('cart.remove')}" },
    { search: 'Количество', replace: "{t('cart.quantity')}" }
  ];
  
  replacements.forEach(({ search, replace }) => {
    const regex = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
    content = content.replace(regex, replace);
  });
  
  fs.writeFileSync(cartPath, content);
  console.log('✅ Cart компонент обновлен!');
} else {
  console.log('❌ Cart.jsx не найден');
}