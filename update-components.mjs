import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔄 Начинаем автоматическое обновление компонентов...');

// Компоненты для обновления
const components = [
  'Header.jsx',
  'CatalogPage.jsx', 
  'HomePage.jsx',
  'CheckoutPage.jsx',
  'ProfilePage.jsx',
  'AdminPage.jsx',
  'Cart.jsx',
  'AuthModal.jsx'
];

let updatedCount = 0;

components.forEach(component => {
  const componentPath = path.join(__dirname, 'src', 'components', component);
  const pagePath = path.join(__dirname, 'src', 'pages', component);
  
  let filePath = '';
  if (fs.existsSync(componentPath)) {
    filePath = componentPath;
  } else if (fs.existsSync(pagePath)) {
    filePath = pagePath;
  }
  
  if (filePath && fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Заменяем импорт useLanguage на useTranslation
    if (content.includes("useLanguage")) {
      content = content.replace(
        /import { useLanguage } from ['"][^'"]+['"];/g,
        "import { useTranslation } from 'react-i18next';"
      );
      
      // Заменяем использование useLanguage на useTranslation
      content = content.replace(
        /const { t } = useLanguage\(\);/g,
        "const { t } = useTranslation();"
      );
      
      fs.writeFileSync(filePath, content);
      console.log(`✅ Обновлен: ${path.basename(filePath)}`);
      updatedCount++;
    }
  }
});

// Удаляем старый LanguageContext если он есть
const languageContextPath = path.join(__dirname, 'src', 'contexts', 'LanguageContext.jsx');
if (fs.existsSync(languageContextPath)) {
  fs.unlinkSync(languageContextPath);
  console.log('🗑️ Удален старый LanguageContext.jsx');
}

console.log(`🎉 Обновлено ${updatedCount} компонентов!`);
console.log('🚀 Тестируем: npm run dev');