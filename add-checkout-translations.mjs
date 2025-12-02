import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Добавляем недостающие переводы для CheckoutPage...');

const checkoutTranslations = {
  ru: {
    checkout: {
      loginRequired: "Пожалуйста, войдите в аккаунт, чтобы оформить заказ.",
      orderError: "Не удалось оформить заказ",
      thankYouMessage: "Спасибо вам большое за доверие к Salt Lake — вы для нас ценны. Мы бережно обработаем заказ и быстро свяжемся с вами.",
      addProductsToCart: "Добавьте товары в корзину для оформления заказа",
      namePlaceholder: "Ваше имя",
      phonePlaceholder: "+7 777 123 45 67",
      companyPlaceholder: "Название компании",
      addressPlaceholder: "Улица, дом",
      notesPlaceholder: "Дополнительная информация..."
    }
  },
  kk: {
    checkout: {
      loginRequired: "Тапсырыс беру үшін аккаунтыңызға кіріңіз.",
      orderError: "Тапсырысты рәсімдеу мүмкін болмады",
      thankYouMessage: "Salt Lake-ке деген сеніміңіз үшін үлкен рахмет — сіз біз үшін құндысыз. Біз тапсырысты мұқият өңдейміз және тез арада сізбен байланысамыз.",
      addProductsToCart: "Тапсырыс беру үшін себетке тауарларды қосыңыз",
      namePlaceholder: "Сіздің атыңыз",
      phonePlaceholder: "+7 777 123 45 67",
      companyPlaceholder: "Компания атауы",
      addressPlaceholder: "Көше, үй",
      notesPlaceholder: "Қосымша ақпарат..."
    }
  },
  en: {
    checkout: {
      loginRequired: "Please log in to your account to place an order.",
      orderError: "Failed to place order",
      thankYouMessage: "Thank you very much for trusting Salt Lake - you are valuable to us. We will carefully process your order and contact you quickly.",
      addProductsToCart: "Add products to cart to place an order",
      namePlaceholder: "Your name",
      phonePlaceholder: "+7 777 123 45 67",
      companyPlaceholder: "Company name",
      addressPlaceholder: "Street, house",
      notesPlaceholder: "Additional information..."
    }
  }
};

// Обновляем файлы переводов
['ru', 'kk', 'en'].forEach(lang => {
  const filePath = path.join(__dirname, 'public', 'locales', lang, 'translation.json');
  
  try {
    let translations = {};
    
    if (fs.existsSync(filePath)) {
      const fileContent = fs.readFileSync(filePath, 'utf8');
      translations = JSON.parse(fileContent);
    }
    
    // Добавляем переводы для checkout
    if (!translations.checkout) translations.checkout = {};
    Object.keys(checkoutTranslations[lang].checkout).forEach(key => {
      translations.checkout[key] = checkoutTranslations[lang].checkout[key];
    });
    
    fs.writeFileSync(filePath, JSON.stringify(translations, null, 2));
    console.log(`✅ Добавлены переводы для Checkout: public/locales/${lang}/translation.json`);
    
  } catch (error) {
    console.log(`❌ Ошибка с файлом ${filePath}:`, error.message);
  }
});

console.log('🎉 Переводы для CheckoutPage добавлены!');