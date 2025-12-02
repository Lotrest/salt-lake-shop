import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Добавляем переводы для админки...');

const adminTranslations = {
  ru: {
    admin: {
      name: "Имя",
      email: "Email", 
      phone: "Телефон",
      role: "Роль",
      registrationDate: "Дата регистрации"
    }
  },
  kk: {
    admin: {
      name: "Аты",
      email: "Email",
      phone: "Телефон",
      role: "Рөл",
      registrationDate: "Тіркеу күні"
    }
  },
  en: {
    admin: {
      name: "Name",
      email: "Email",
      phone: "Phone", 
      role: "Role",
      registrationDate: "Registration Date"
    }
  }
};

['ru', 'kk', 'en'].forEach(lang => {
  const filePath = path.join(__dirname, 'public', 'locales', lang, 'translation.json');
  
  if (fs.existsSync(filePath)) {
    let translations = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    if (!translations.admin) translations.admin = {};
    
    Object.keys(adminTranslations[lang].admin).forEach(key => {
      translations.admin[key] = adminTranslations[lang].admin[key];
    });
    
    fs.writeFileSync(filePath, JSON.stringify(translations, null, 2));
    console.log(`✅ Переводы добавлены: ${lang}`);
  }
});

console.log('🎉 Переводы для админки добавлены!');