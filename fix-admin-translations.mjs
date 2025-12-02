
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Исправляем админку...');

// 1. Исправим App.jsx для белого экрана
const appPath = path.join(__dirname, 'src', 'App.jsx');
if (fs.existsSync(appPath)) {
  let appContent = fs.readFileSync(appPath, 'utf8');
  
  // Добавляем импорт Navigate
  if (!appContent.includes('Navigate')) {
    appContent = appContent.replace(
      "import { BrowserRouter, Routes, Route } from \"react-router-dom\";",
      "import { BrowserRouter, Routes, Route, Navigate } from \"react-router-dom\";"
    );
  }
  
  // Исправляем маршрут админки
  appContent = appContent.replace(
    '<Route path="/admin" element={<AdminPage />} />',
    '<Route path="/admin" element={user?.role === \'admin\' ? <AdminPage /> : <Navigate to="/" />} />'
  );
  
  fs.writeFileSync(appPath, appContent);
  console.log('✅ App.jsx исправлен');
}

// 2. Исправим админку
const adminPath = path.join(__dirname, 'src', 'pages', 'AdminPage.jsx');
if (fs.existsSync(adminPath)) {
  let adminContent = fs.readFileSync(adminPath, 'utf8');
  
  // Исправляем поисковую панель - убираем фигурные скобки
  adminContent = adminContent.replace(
    'placeholder="{t(\'admin.search\')}"',
    'placeholder={t(\'admin.search\')}'
  );
  
  // Исправляем заголовки таблицы пользователей
  adminContent = adminContent.replace(
    `<tr className="border-b">
                                    <th className="text-left py-2">Имя</th>
                                    <th className="text-left py-2">Email</th>
                                    <th className="text-left py-2">Телефон</th>
                                    <th className="text-left py-2">Роль</th>
                                    <th className="text-left py-2">Дата регистрации</th>
                                </tr>`,
    `<tr className="border-b">
                                    <th className="text-left py-2">{t('admin.name')}</th>
                                    <th className="text-left py-2">{t('admin.email')}</th>
                                    <th className="text-left py-2">{t('admin.phone')}</th>
                                    <th className="text-left py-2">{t('admin.role')}</th>
                                    <th className="text-left py-2">{t('admin.registrationDate')}</th>
                                </tr>`
  );
  
  // Добавляем функцию getProductKey для переводов товаров
  if (!adminContent.includes('getProductKey')) {
    const getProductKeyFunction = `
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
    };`;
    
    adminContent = adminContent.replace(
      'const [query, setQuery] = useState(\'\');',
      `const [query, setQuery] = useState('');${getProductKeyFunction}`
    );
  }
  
  // Обновляем логику статистики для использования переводов
  const newStatsLogic = `
    // Статистика по товарам с переводами
    const productStatsMap = {};
    orders.forEach(o => {
        (o.items || []).forEach(it => {
            const productKey = getProductKey(it.name);
            const translatedName = t(\`products.\${productKey}.name\`, { defaultValue: it.name });
            const key = it.productId + '|' + translatedName;
            if (!productStatsMap[key]) {
                productStatsMap[key] = { 
                    id: it.productId, 
                    name: translatedName, 
                    qty: 0,
                    total: 0 
                };
            }
            productStatsMap[key].qty += Number(it.quantity) || 0;
            const price = parseInt(it.price.replace(/[^\\\\d]/g, '') || 0);
            productStatsMap[key].total += price * (Number(it.quantity) || 0);
        });
    });

    const productStats = Object.values(productStatsMap)
        .sort((a, b) => b.qty - a.qty);`;
  
  // Находим и заменяем старую логику статистики
  const statsStart = adminContent.indexOf('// {t(\'admin.statistics\')} по товарам');
  if (statsStart !== -1) {
    const statsEnd = adminContent.indexOf('const productStats = Object.values(productStatsMap)');
    if (statsEnd !== -1) {
      const endLine = adminContent.indexOf(';', statsEnd) + 1;
      adminContent = adminContent.substring(0, statsStart) + newStatsLogic + adminContent.substring(endLine);
    }
  }
  
  fs.writeFileSync(adminPath, adminContent);
  console.log('✅ AdminPage.jsx исправлен');
}

// 3. Обновляем переводы
console.log('🔄 Обновляем переводы...');

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
    console.log(`✅ Переводы обновлены: ${lang}`);
  }
});

console.log('🎉 Админка исправлена!');
console.log('📝 Перезапустите сервер: npm run dev');