import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Обновляем AboutPage с переводами...');

const aboutPagePath = path.join(__dirname, 'src', 'pages', 'AboutPage.jsx');

if (fs.existsSync(aboutPagePath)) {
  let content = fs.readFileSync(aboutPagePath, 'utf8');
  
  // Добавляем импорт useTranslation если его нет
  if (!content.includes("useTranslation")) {
    content = content.replace(
      "import React from \"react\";",
      "import React from \"react\";\nimport { useTranslation } from 'react-i18next';"
    );
  }
  
  // Добавляем useTranslation в компонент
  if (!content.includes("const { t } = useTranslation();")) {
    content = content.replace(
      "const AboutPage = () => {",
      "const AboutPage = () => {\n  const { t } = useTranslation();"
    );
  }
  
  // Заменяем тексты на переводы
  const replacements = [
    { search: 'О нас', replace: "{t('about.title')}" },
    { search: 'Salt Lake Kazakhstan', replace: "{t('about.companyName')}" },
    { search: 'Компания «Salt Lake Kazakhstan» создаёт для Вас комфорт, который проявляется во всем!', replace: "{t('about.mainDescription')}" },
    { search: 'Условия работы:', replace: "{t('about.conditions')}" },
    { search: 'Срок поставки:', replace: "{t('about.deliveryTime')}" },
    { search: 'Условия оплаты:', replace: "{t('about.paymentTerms')}" },
    { search: 'Цены:', replace: "{t('about.prices')}" },
    { search: 'Контактная информация:', replace: "{t('about.contactInfo')}" },
    { search: 'На казахском языке:', replace: "{t('about.inKazakh')}" },
    { search: 'На русском языке:', replace: "{t('about.inRussian')}" },
    { search: 'Гостиничные принадлежности', replace: "{t('about.hotelSupplies')}" },
    { search: 'Косметика и текстиль премиум качества', replace: "{t('about.hotelSuppliesDesc')}" },
    { search: 'Моющие средства', replace: "{t('about.cleaningProducts')}" },
    { search: 'Профессиональные средства для уборки', replace: "{t('about.cleaningProductsDesc')}" },
    { search: 'Оборудование', replace: "{t('about.equipment')}" },
    { search: 'Качественное оборудование для гостиниц', replace: "{t('about.equipmentDesc')}" },
    { search: 'Техобслуживание', replace: "{t('about.maintenance')}" },
    { search: 'Полное обслуживание гостиниц и ресторанов', replace: "{t('about.maintenanceDesc')}" },
    { search: 'Доверьте нам заботу о комфорте ваших гостей!', replace: "{t('about.trustUs')}" }
  ];
  
  replacements.forEach(({ search, replace }) => {
    const regex = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
    content = content.replace(regex, replace);
  });
  
  fs.writeFileSync(aboutPagePath, content);
  console.log('✅ AboutPage обновлен с переводами!');
} else {
  console.log('❌ AboutPage.jsx не найден');
}