import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Автоматическое обновление CatalogPage с переводами...');

const catalogPagePath = path.join(__dirname, 'src', 'pages', 'CatalogPage.jsx');

if (fs.existsSync(catalogPagePath)) {
  let content = fs.readFileSync(catalogPagePath, 'utf8');
  
  // 1. Добавляем функцию getProductKey если её нет
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
};
`;

  if (!content.includes('getProductKey')) {
    content = content.replace(
      /const \{ t \} = useTranslation\(\);?/,
      `const { t } = useTranslation();${getProductKeyFunction}`
    );
  }

  // 2. Обновляем категории для использования переводов
  const categoriesUpdate = `
  // Базовые категории быстрого фильтра
  const categories = [
    { id: "all", name: t('categories.all') },
  ];

  // Текстиль и подкатегории
  const textileCategories = [
    { id: "textile_towels", name: t('categories.towels') },
    { id: "textile_slippers", name: t('categories.slippers') },
    { id: "textile_robes", name: t('categories.robes') },
  ];

  const accessoriesSub = [
    { id: 'accessories_all', name: t('categories.accessories_all') },
    { id: 'accessories_standard', name: t('categories.standard') },
    { id: 'accessories_eco', name: t('categories.eco') },
    { id: 'accessories_shoes', name: t('categories.shoes') },
    { id: 'accessories_sewing', name: t('categories.sewing') },
    { id: 'accessories_razor', name: t('categories.razor') },
    { id: 'accessories_cosmetic', name: t('categories.cosmetic') },
    { id: 'accessories_tooth', name: t('categories.tooth') },
  ];

  const cosmeticsSub = [
    { id: 'cosmetics_shampoo', name: t('categories.shampoo') },
    { id: 'cosmetics_gel', name: t('categories.gel') },
    { id: 'cosmetics_lotion', name: t('categories.lotion') },
    { id: 'cosmetics_soap', name: t('categories.soap') },
    { id: 'cosmetics_conditioner', name: t('categories.conditioner') },
  ];
`;

  // Заменяем объявления категорий
  const categoryRegex = /\/\/ Базовые категории быстрого фильтра[\s\S]*?cosmeticsSub = \[[\s\S]*?\];/;
  if (categoryRegex.test(content)) {
    content = content.replace(categoryRegex, categoriesUpdate);
  }

  // 3. Обновляем логику поиска для работы с переводами
  const searchLogicUpdate = `  // Сначала применяем поиск
  if (searchQuery) {
    filteredProducts = filteredProducts.filter(product => {
      const productKey = getProductKey(product.name);
      const translatedName = t(\`products.\${productKey}.name\`, { defaultValue: product.name });
      const translatedDescription = t(\`products.\${productKey}.description\`, { defaultValue: product.description });
      
      return (
        translatedName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        translatedDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }`;

  // Заменяем логику поиска
  const searchRegex = /\/\/ Сначала применяем поиск[\s\S]*?filteredProducts\.filter\(product =>[^}]*}\)\);/;
  if (searchRegex.test(content)) {
    content = content.replace(searchRegex, searchLogicUpdate);
  }

  // 4. Обновляем логику фильтрации аксессуаров
  const updateFilterLogic = (filterType, conditions) => {
    conditions.forEach(({ key, pattern }) => {
      const oldPattern = new RegExp(`} else if \\(key === '${key}'\\) {[\\s\\S]*?filteredProducts = filteredProducts\\.filter\\(p =>[^;]*;\\)`, 'g');
      const newLogic = `} else if (key === '${key}') {
      filteredProducts = filteredProducts.filter(p => {
        const productKey = getProductKey(p.name);
        const translatedName = t(\`products.\${productKey}.name\`, { defaultValue: p.name });
        return ${pattern}.test(translatedName) || ${pattern}.test(p.name);
      })`;
      
      if (oldPattern.test(content)) {
        content = content.replace(oldPattern, newLogic);
      }
    });
  };

  // Обновляем фильтры для аксессуаров
  const accessoryFilters = [
    { key: 'shoes', pattern: '/обув|shoe/i' },
    { key: 'sewing', pattern: '/Швейный|sewing/i' },
    { key: 'razor', pattern: '/Бритвен|razor/i' },
    { key: 'cosmetic', pattern: '/Косметическ|cosmetic/i' },
    { key: 'tooth', pattern: '/Зубн|tooth/i' }
  ];

  updateFilterLogic('accessories', accessoryFilters);

  // 5. Обновляем логику фильтрации косметики
  const cosmeticsFilterUpdate = `  // Фильтрация для подменю косметики
  if (selectedCategory.startsWith('cosmetics_')) {
    const key = selectedCategory.split('_')[1];
    const map = {
      shampoo: /Шампун|shampoo/i,
      gel: /Гель\\\\s+для\\\\s+душа|shower\\\\s+gel/i,
      lotion: /Лосьон|lotion/i,
      soap: /Мыло|soap/i,
      conditioner: /Кондиционер|conditioner/i,
    };
    const re = map[key];
    if (re) {
      filteredProducts = filteredProducts.filter(p => {
        const productKey = getProductKey(p.name);
        const translatedName = t(\`products.\${productKey}.name\`, { defaultValue: p.name });
        return re.test(translatedName) || re.test(p.name);
      });
    }
  }`;

  const cosmeticsRegex = /\/\/ Фильтрация для подменю косметики[\s\S]*?filteredProducts = re \? filteredProducts\.filter\(p => re\.test\(p\.name\)\) : \[\];/;
  if (cosmeticsRegex.test(content)) {
    content = content.replace(cosmeticsRegex, cosmeticsFilterUpdate);
  }

  // 6. Обновляем рендеринг товаров с переводами
  const productsGridRegex = /<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">\s*{filteredProducts\.map\(product => \([\s\S]*?<\/div>\s*\)\)}\s*<\/div>/;
  
  const updatedProductsGrid = `<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map(product => {
            const productKey = getProductKey(product.name);
            return (
              <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <img
                  src={product.image}
                  alt={t(\`products.\${productKey}.name\`, { defaultValue: product.name })}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {t(\`products.\${productKey}.name\`, { defaultValue: product.name })}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {t(\`products.\${productKey}.description\`, { defaultValue: product.description })}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-blue-600">{product.price}</span>
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                    >
                      {t('catalog.addToCart')}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>`;

  if (productsGridRegex.test(content)) {
    content = content.replace(productsGridRegex, updatedProductsGrid);
  }

  // 7. Обновляем тексты кнопок категорий
  const categoryButtonsUpdate = {
    'Текстиль': "t('categories.textile')",
    'Аксессуары': "t('categories.accessories')", 
    'Косметика': "t('categories.cosmetics')"
  };

  Object.entries(categoryButtonsUpdate).forEach(([oldText, newText]) => {
    const regex = new RegExp(`>${oldText}<`, 'g');
    content = content.replace(regex, `>${newText}<`);
  });

  // 8. Обновляем сообщение "Товары не найдены"
  content = content.replace(
    /<p className="text-gray-500 text-lg">Товары не найдены<\/p>/,
    `<p className="text-gray-500 text-lg">{t('catalog.noProducts')}</p>`
  );

  fs.writeFileSync(catalogPagePath, content);
  console.log('✅ CatalogPage автоматически обновлен с переводами!');
} else {
  console.log('❌ CatalogPage.jsx не найден');
}

console.log('🎉 Автоматическое обновление завершено!');