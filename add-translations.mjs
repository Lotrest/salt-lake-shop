import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Добавляем переводы автоматически...');

// Новые переводы которые нужно добавить
const newTranslations = {
  header: {
    home: { ru: "Главная", kk: "Басты", en: "Home" },
    catalog: { ru: "Каталог", kk: "Каталог", en: "Catalog" },
    about: { ru: "О нас", kk: "Біз туралы", en: "About" },
    contacts: { ru: "Контакты", kk: "Байланыс", en: "Contacts" },
    profile: { ru: "Профиль", kk: "Профиль", en: "Profile" },
    admin: { ru: "Админка", kk: "Админ", en: "Admin" },
    login: { ru: "Войти", kk: "Кіру", en: "Login" },
    logout: { ru: "Выйти", kk: "Шығу", en: "Logout" }
  }
};

// Обновляем каждый файл перевода
['ru', 'kk', 'en'].forEach(lang => {
  const filePath = path.join(__dirname, 'public', 'locales', lang, 'translation.json');
  
  if (fs.existsSync(filePath)) {
    let translations = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    // Добавляем новые переводы
    Object.keys(newTranslations).forEach(category => {
      if (!translations[category]) {
        translations[category] = {};
      }
      
      Object.keys(newTranslations[category]).forEach(key => {
        translations[category][key] = newTranslations[category][key][lang];
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