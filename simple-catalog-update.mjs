import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Простое обновление CatalogPage...');

const filePath = path.join(__dirname, 'src', 'pages', 'CatalogPage.jsx');

if (fs.existsSync(filePath)) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Добавляем функцию getProductKey
  const functionCode = `
// Функция для получения ключа перевода товара
const getProductKey = (productName) => {
  const keyMap = {
    "Зубной набор": "tooth_kit",
    "Шапочка для душа": "shower_cap", 
    "Бритвенный набор": "razor_kit",
    "Косметический набор": "cosmetic_kit",
    "Расческа": "hairbrush",
    "Рожок для обуви": "shoe_horn",
    "Губка для обуви": "shoe_sponge",
    "Мочалка": "washcloth",
    "Салфетка для обуви": "shoe_wipe",
    "Санитарный пакет": "sanitary_bag",
    "Швейный набор": "sewing_kit"
  };
  return keyMap[productName] || productName;
};
`;
  
  // Добавляем функцию если её нет
  if (!content.includes('getProductKey')) {
    content = content.replace(
      /const \{ t \} = useTranslation\(\);?/,
      `const { t } = useTranslation();${functionCode}`
    );
  }
  
  // Простые замены
  content = content.replace(/\{product\.name\}/g, "{t(`products.${getProductKey(product.name)}.name`)}");
  content = content.replace(/\{product\.description\}/g, "{t(`products.${getProductKey(product.name)}.description`)}");
  
  fs.writeFileSync(filePath, content);
  console.log('✅ CatalogPage обновлен!');
}

console.log('🎉 Готово! Перезагрузите страницу и проверьте переводы товаров.');