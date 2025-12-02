import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Добавляем полные переводы для сайта...');

// Полные переводы для всего сайта
const completeTranslations = {
  header: {
    home: { ru: "Главная", kk: "Басты", en: "Home" },
    catalog: { ru: "Каталог", kk: "Каталог", en: "Catalog" },
    about: { ru: "О нас", kk: "Біз туралы", en: "About" },
    contacts: { ru: "Контакты", kk: "Байланыс", en: "Contacts" },
    profile: { ru: "Профиль", kk: "Профиль", en: "Profile" },
    admin: { ru: "Админка", kk: "Админ", en: "Admin" },
    login: { ru: "Войти", kk: "Кіру", en: "Login" },
    logout: { ru: "Выйти", kk: "Шығу", en: "Logout" }
  },
  
  catalog: {
    title: { ru: "Каталог товаров", kk: "Тауарлар каталогы", en: "Product Catalog" },
    description: { ru: "Широкий ассортимент качественных товаров для вашего бизнеса", kk: "Сіздің бизнесіңізге арналған сапалы тауарлардың кең таңдауы", en: "Wide range of quality products for your business" },
    search: { ru: "🔍 Поиск товаров по названию...", kk: "🔍 Тауарларды атауы бойынша іздеу...", en: "🔍 Search products by name..." },
    allProducts: { ru: "Все товары", kk: "Барлық тауарлар", en: "All Products" },
    textile: { ru: "Текстиль", kk: "Текстиль", en: "Textile" },
    accessories: { ru: "Аксессуары", kk: "Аксессуарлар", en: "Accessories" },
    cosmetics: { ru: "Косметика", kk: "Косметика", en: "Cosmetics" },
    noProducts: { ru: "Товары не найдены", kk: "Тауарлар табылмады", en: "Products not found" },
    addToCart: { ru: "В корзину", kk: "Себетке", en: "Add to Cart" },
    inCart: { ru: "В корзине", kk: "Себетте", en: "In Cart" }
  },
  
  cart: {
    title: { ru: "Корзина", kk: "Себет", en: "Cart" },
    empty: { ru: "Корзина пуста", kk: "Себет бос", en: "Cart is empty" },
    emptyDescription: { ru: "Добавьте товары из каталога", kk: "Каталогтан тауарларды қосыңыз", en: "Add products from catalog" },
    total: { ru: "Итого", kk: "Барлығы", en: "Total" },
    clearCart: { ru: "Очистить корзину", kk: "Себетті тазалау", en: "Clear Cart" },
    checkout: { ru: "Оформить заказ", kk: "Тапсырыс беру", en: "Checkout" },
    items: { ru: "товаров", kk: "тауарлар", en: "items" }
  },
  
  common: {
    loading: { ru: "Загрузка...", kk: "Жүктелуде...", en: "Loading..." },
    success: { ru: "Успешно", kk: "Сәтті", en: "Success" },
    error: { ru: "Ошибка", kk: "Қате", en: "Error" },
    save: { ru: "Сохранить", kk: "Сақтау", en: "Save" },
    cancel: { ru: "Отмена", kk: "Болдырмау", en: "Cancel" }
  }
};

// Обновляем каждый файл перевода
['ru', 'kk', 'en'].forEach(lang => {
  const filePath = path.join(__dirname, 'public', 'locales', lang, 'translation.json');
  
  if (fs.existsSync(filePath)) {
    let translations = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    // Добавляем новые переводы
    Object.keys(completeTranslations).forEach(category => {
      if (!translations[category]) {
        translations[category] = {};
      }
      
      Object.keys(completeTranslations[category]).forEach(key => {
        translations[category][key] = completeTranslations[category][key][lang];
      });
    });
    
    // Сохраняем обновленный файл
    fs.writeFileSync(filePath, JSON.stringify(translations, null, 2));
    console.log(`✅ Обновлен: public/locales/${lang}/translation.json`);
  } else {
    console.log(`❌ Файл не найден: ${filePath}`);
  }
});

console.log('🎉 Все переводы добавлены автоматически!');
console.log('📝 Теперь можно добавлять переводы в другие компоненты:');
console.log('   - CatalogPage.jsx - заголовки, поиск, кнопки');
console.log('   - Cart.jsx - текст корзины');
console.log('   - Другие страницы');