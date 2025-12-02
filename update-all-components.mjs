import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Автоматически обновляем все компоненты с переводами...');

// Компоненты для обновления
const components = [
  {
    file: 'Cart.jsx',
    path: 'src/components/Cart.jsx',
    replacements: [
      { search: 'Корзина', replace: "{t('cart.title')}" },
      { search: 'Корзина пуста', replace: "{t('cart.empty')}" },
      { search: 'Добавьте товары из каталога', replace: "{t('cart.emptyDescription')}" },
      { search: 'Итого', replace: "{t('cart.total')}" },
      { search: 'Очистить корзину', replace: "{t('cart.clearCart')}" },
      { search: 'Оформить заказ', replace: "{t('cart.checkout')}" },
      { search: 'товаров', replace: "{t('cart.items')}" }
    ]
  },
  {
    file: 'CatalogPage.jsx', 
    path: 'src/pages/CatalogPage.jsx',
    replacements: [
      { search: 'Каталог товаров', replace: "{t('catalog.title')}" },
      { search: 'Широкий ассортимент качественных товаров для вашего бизнеса', replace: "{t('catalog.description')}" },
      { search: '🔍 Поиск товаров по названию...', replace: "{t('catalog.search')}" },
      { search: 'Все товары', replace: "{t('catalog.allProducts')}" },
      { search: 'Текстиль', replace: "{t('catalog.textile')}" },
      { search: 'Аксессуары', replace: "{t('catalog.accessories')}" },
      { search: 'Косметика', replace: "{t('catalog.cosmetics')}" },
      { search: 'Товары не найдены', replace: "{t('catalog.noProducts')}" },
      { search: 'В корзину', replace: "{t('catalog.addToCart')}" }
    ]
  }
];

components.forEach(({ file, path: filePath, replacements }) => {
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    let updated = false;
    
    // Добавляем импорт useTranslation если его нет
    if (!content.includes("useTranslation")) {
      content = content.replace(
        "import React", 
        "import { useTranslation } from 'react-i18next';\nimport React"
      );
      updated = true;
    }
    
    // Добавляем useTranslation в компонент если его нет
    if (!content.includes("const { t } = useTranslation();")) {
      const componentMatch = content.match(/(const \w+ = \(\) => {)/);
      if (componentMatch) {
        content = content.replace(componentMatch[1], `${componentMatch[1]}\n  const { t } = useTranslation();`);
        updated = true;
      }
    }
    
    // Заменяем тексты на переводы
    replacements.forEach(({ search, replace }) => {
      if (content.includes(search)) {
        const regex = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
        content = content.replace(regex, replace);
        updated = true;
      }
    });
    
    if (updated) {
      fs.writeFileSync(filePath, content);
      console.log(`✅ Обновлен: ${file}`);
    } else {
      console.log(`ℹ️  Не требует обновления: ${file}`);
    }
  } else {
    console.log(`❌ Файл не найден: ${file}`);
  }
});

console.log('🎉 Все компоненты обновлены автоматически!');