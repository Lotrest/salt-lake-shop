import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Обновляем ContactsPage с переводами...');

const contactsPagePath = path.join(__dirname, 'src', 'pages', 'ContactsPage.jsx');

if (fs.existsSync(contactsPagePath)) {
  let content = fs.readFileSync(contactsPagePath, 'utf8');
  
  // Добавляем импорт useTranslation если его нет
  if (!content.includes("useTranslation")) {
    content = content.replace(
      "import React, { useState } from \"react\";",
      "import React, { useState } from \"react\";\nimport { useTranslation } from 'react-i18next';"
    );
  }
  
  // Добавляем useTranslation в компонент
  if (!content.includes("const { t } = useTranslation();")) {
    content = content.replace(
      "const ContactsPage = () => {",
      "const ContactsPage = () => {\n  const { t } = useTranslation();"
    );
  }
  
  // Заменяем тексты на переводы
  const replacements = [
    { search: 'Контакты', replace: "{t('contacts.title')}" },
    { search: 'Свяжитесь с нами', replace: "{t('contacts.contactUs')}" },
    { search: 'Адрес', replace: "{t('contacts.address')}" },
    { search: 'На казахском:', replace: "{t('contacts.addressKz')}" },
    { search: 'На русском:', replace: "{t('contacts.addressRu')}" },
    { search: 'Телефон', replace: "{t('contacts.phone')}" },
    { search: 'Электронная почта', replace: "{t('contacts.email')}" },
    { search: 'Режим работы:', replace: "{t('contacts.workingHours')}" }
  ];
  
  replacements.forEach(({ search, replace }) => {
    const regex = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
    content = content.replace(regex, replace);
  });
  
  fs.writeFileSync(contactsPagePath, content);
  console.log('✅ ContactsPage обновлен с переводами!');
} else {
  console.log('❌ ContactsPage.jsx не найден');
}