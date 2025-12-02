import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Начинаем автоматическую миграцию на i18next...');

// 1. Создаем папки локалей
const localesPath = path.join(__dirname, 'public', 'locales');
['ru', 'kk', 'en'].forEach(lang => {
  const langPath = path.join(localesPath, lang);
  if (!fs.existsSync(langPath)) {
    fs.mkdirSync(langPath, { recursive: true });
    console.log(`✅ Создана папка: ${langPath}`);
  }
});

// 2. Базовые переводы (минимум для запуска)
const baseTranslations = {
  ru: {
    header: { home: "Главная", catalog: "Каталог", about: "О нас", contacts: "Контакты", profile: "Профиль", admin: "Админка", login: "Войти", logout: "Выйти" },
    catalog: { title: "Каталог товаров", description: "Широкий ассортимент качественных товаров для вашего бизнеса", search: "🔍 Поиск товаров по названию...", allProducts: "Все товары", textile: "Текстиль", accessories: "Аксессуары", cosmetics: "Косметика", noProducts: "Товары не найдены", addToCart: "В корзину" },
    cart: { title: "Корзина", empty: "Корзина пуста", total: "Итого", checkout: "Оформить заказ" },
    common: { loading: "Загрузка...", back: "Назад" }
  },
  kk: {
    header: { home: "Басты", catalog: "Каталог", about: "Біз туралы", contacts: "Байланыс", profile: "Профиль", admin: "Админ", login: "Кіру", logout: "Шығу" },
    catalog: { title: "Тауарлар каталогы", description: "Сіздің бизнесіңізге арналған сапалы тауарлардың кең таңдауы", search: "🔍 Тауарларды атауы бойынша іздеу...", allProducts: "Барлық тауарлар", textile: "Текстиль", accessories: "Аксессуарлар", cosmetics: "Косметика", noProducts: "Тауарлар табылмады", addToCart: "Себетке" },
    cart: { title: "Себет", empty: "Себет бос", total: "Барлығы", checkout: "Тапсырыс беру" },
    common: { loading: "Жүктелуде...", back: "Артқа" }
  },
  en: {
    header: { home: "Home", catalog: "Catalog", about: "About", contacts: "Contacts", profile: "Profile", admin: "Admin", login: "Login", logout: "Logout" },
    catalog: { title: "Product Catalog", description: "Wide range of quality products for your business", search: "🔍 Search products by name...", allProducts: "All Products", textile: "Textile", accessories: "Accessories", cosmetics: "Cosmetics", noProducts: "Products not found", addToCart: "Add to Cart" },
    cart: { title: "Cart", empty: "Cart is empty", total: "Total", checkout: "Checkout" },
    common: { loading: "Loading...", back: "Back" }
  }
};

// 3. Создаем JSON файлы
Object.keys(baseTranslations).forEach(lang => {
  const filePath = path.join(localesPath, lang, 'translation.json');
  fs.writeFileSync(filePath, JSON.stringify(baseTranslations[lang], null, 2));
  console.log(`✅ Создан файл перевода: ${filePath}`);
});

// 4. Создаем файл i18n.js
const i18nContent = `import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'ru',
    debug: false,
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage']
    },
    backend: {
      loadPath: '/locales/{{lng}}/translation.json',
    }
  });

export default i18n;`;

fs.writeFileSync(path.join(__dirname, 'src', 'i18n.js'), i18nContent);
console.log('✅ Создан файл: src/i18n.js');

// 5. Обновляем App.jsx
const appPath = path.join(__dirname, 'src', 'App.jsx');
if (fs.existsSync(appPath)) {
  let appContent = fs.readFileSync(appPath, 'utf8');
  
  // Добавляем импорт i18n если его нет
  if (!appContent.includes("import './i18n'")) {
    appContent = appContent.replace(
      'import React from "react";',
      'import React from "react";\nimport "./i18n"; // ✅ i18n'
    );
    fs.writeFileSync(appPath, appContent);
    console.log('✅ Обновлен файл: src/App.jsx');
  }
}

// 6. Создаем автоматический LanguageSwitcher для i18next
const languageSwitcherContent = `import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const languages = [
    { code: 'ru', name: 'РУ', flag: '🇷🇺' },
    { code: 'kk', name: 'ҚАЗ', flag: '🇰🇿' },
    { code: 'en', name: 'EN', flag: '🇺🇸' }
  ];

  return (
    <div className="flex items-center space-x-1 bg-white border border-gray-200 rounded-lg p-1">
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => i18n.changeLanguage(lang.code)}
          className={\`flex items-center space-x-1 px-3 py-1 rounded-md text-sm font-medium transition-all \${i18n.language === lang.code
            ? 'bg-blue-600 text-white shadow-sm'
            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
          }\`}
          title={lang.code === 'ru' ? 'Русский' : lang.code === 'kk' ? 'Қазақша' : 'English'}
        >
          <span className="text-base">{lang.flag}</span>
          <span>{lang.name}</span>
        </button>
      ))}
    </div>
  );
};

export default LanguageSwitcher;`;

fs.writeFileSync(path.join(__dirname, 'src', 'components', 'LanguageSwitcher.jsx'), languageSwitcherContent);
console.log('✅ Создан файл: src/components/LanguageSwitcher.jsx');

console.log('🎉 АВТОМАТИЧЕСКАЯ МИГРАЦИЯ ЗАВЕРШЕНА!');
console.log('📝 Теперь нужно обновить компоненты:');
console.log('   - Заменить useLanguage() на useTranslation()');
console.log('   - Удалить старый LanguageContext');
console.log('🚀 Запустите: npm run dev');