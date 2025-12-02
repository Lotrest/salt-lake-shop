
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔍 Проверяем текущее состояние админки...');

const adminPagePath = path.join(__dirname, 'src', 'pages', 'AdminPage.jsx');

if (fs.existsSync(adminPagePath)) {
  const content = fs.readFileSync(adminPagePath, 'utf8');
  
  console.log('\n=== ТЕКУЩЕЕ СОСТОЯНИЕ АДМИНКИ ===');
  
  // Проверяем поисковую панель
  if (content.includes('placeholder="{t(\'admin.search\')}"')) {
    console.log('❌ Поисковая панель: НЕПРАВИЛЬНЫЙ СИНТАКСИС');
  } else if (content.includes('placeholder={t(\'admin.search\')}')) {
    console.log('✅ Поисковая панель: правильно');
  } else {
    console.log('❌ Поисковая панель: перевод отсутствует');
  }
  
  // Проверяем заголовки таблицы
  if (content.includes('<th className="text-left py-2">Имя</th>')) {
    console.log('❌ Заголовок "Имя": не переведен');
  } else if (content.includes('{t(\'admin.name\')}')) {
    console.log('✅ Заголовок "Имя": переведен');
  }
  
  if (content.includes('<th className="text-left py-2">Email</th>')) {
    console.log('❌ Заголовок "Email": не переведен');
  } else if (content.includes('{t(\'admin.email\')}')) {
    console.log('✅ Заголовок "Email": переведен');
  }
  
  // Проверяем функцию getProductKey
  if (content.includes('getProductKey')) {
    console.log('✅ Функция getProductKey: присутствует');
  } else {
    console.log('❌ Функция getProductKey: отсутствует');
  }
  
  // Проверяем логику статистики
  if (content.includes('translatedName = t(`products.${productKey}.name`')) {
    console.log('✅ Логика статистики: использует переводы');
  } else {
    console.log('❌ Логика статистики: не использует переводы');
  }
  
  console.log('\n=== РЕКОМЕНДАЦИИ ===');
  
  const issues = [];
  if (!content.includes('placeholder={t(\'admin.search\')}')) {
    issues.push('- Исправить поисковую панель');
  }
  if (content.includes('>Имя<') || content.includes('>Email<') || content.includes('>Телефон<')) {
    issues.push('- Исправить заголовки таблицы пользователей');
  }
  if (!content.includes('getProductKey')) {
    issues.push('- Добавить функцию getProductKey');
  }
  if (!content.includes('translatedName = t(`products.${productKey}.name`')) {
    issues.push('- Обновить логику статистики для переводов');
  }
  
  if (issues.length === 0) {
    console.log('✅ Все проблемы решены!');
  } else {
    console.log('❌ Необходимо исправить:');
    issues.forEach(issue => console.log(issue));
  }
  
} else {
  console.log('❌ AdminPage.jsx не найден');
}