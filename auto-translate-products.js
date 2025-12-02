
export const autoTranslateProduct = (productName, productDescription = '') => {
  const translationMap = {
    // Основные категории товаров
    "Зубной": { name: "tooth_kit", desc: "tooth_kit_desc" },
    "зубной": { name: "tooth_kit", desc: "tooth_kit_desc" },
    "Шапочка": { name: "shower_cap", desc: "shower_cap_desc" },
    "шапочка": { name: "shower_cap", desc: "shower_cap_desc" },
    "Бритвен": { name: "razor_kit", desc: "razor_kit_desc" },
    "бритвен": { name: "razor_kit", desc: "razor_kit_desc" },
    "Косметическ": { name: "cosmetic_kit", desc: "cosmetic_kit_desc" },
    "косметическ": { name: "cosmetic_kit", desc: "cosmetic_kit_desc" },
    "Расческа": { name: "hairbrush", desc: "hairbrush_desc" },
    "расческа": { name: "hairbrush", desc: "hairbrush_desc" },
    "Рожок": { name: "shoe_horn", desc: "shoe_horn_desc" },
    "рожок": { name: "shoe_horn", desc: "shoe_horn_desc" },
    "Губка": { name: "shoe_sponge", desc: "shoe_sponge_desc" },
    "губка": { name: "shoe_sponge", desc: "shoe_sponge_desc" },
    "Мочалка": { name: "washcloth", desc: "washcloth_desc" },
    "мочалка": { name: "washcloth", desc: "washcloth_desc" },
    "Салфетка": { name: "shoe_wipe", desc: "shoe_wipe_desc" },
    "салфетка": { name: "shoe_wipe", desc: "shoe_wipe_desc" },
    "Санитарный": { name: "sanitary_bag", desc: "sanitary_bag_desc" },
    "санитарный": { name: "sanitary_bag", desc: "sanitary_bag_desc" },
    "Швейный": { name: "sewing_kit", desc: "sewing_kit_desc" },
    "швейный": { name: "sewing_kit", desc: "sewing_kit_desc" },
    
    // Новые категории
    "Полотенце": { name: "towel", desc: "towel_desc" },
    "полотенце": { name: "towel", desc: "towel_desc" },
    "Халат": { name: "robe", desc: "robe_desc" },
    "халат": { name: "robe", desc: "robe_desc" },
    "Тапочки": { name: "slippers", desc: "slippers_desc" },
    "тапочки": { name: "slippers", desc: "slippers_desc" },
    "Шампунь": { name: "shampoo", desc: "shampoo_desc" },
    "шампунь": { name: "shampoo", desc: "shampoo_desc" },
    "Гель": { name: "shower_gel", desc: "shower_gel_desc" },
    "гель": { name: "shower_gel", desc: "shower_gel_desc" },
    "Мыло": { name: "soap", desc: "soap_desc" },
    "мыло": { name: "soap", desc: "soap_desc" },
  };

  // Ищем совпадение в названии товара
  for (const [keyword, translation] of Object.entries(translationMap)) {
    if (productName.includes(keyword)) {
      return translation.name;
    }
  }

  // Если не нашли совпадение, создаем ключ из названия
  return productName
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .replace(/\s+/g, '_')
    .substring(0, 30);
};

// Функция для автоматического добавления переводов в файлы
export const addProductTranslation = async (productName, productDescription) => {
  const productKey = autoTranslateProduct(productName);
  
  const translations = {
    ru: {
      name: productName,
      description: productDescription || `${productName} - качественный товар для гостиниц`
    },
    kk: {
      name: `${productName} (казахский)`,
      description: productDescription || `${productName} - мейманханалар үшін сапалы тауар`
    },
    en: {
      name: `${productName} (english)`, 
      description: productDescription || `${productName} - quality product for hotels`
    }
  };

  // Добавляем переводы во все языковые файлы
  for (const lang of ['ru', 'kk', 'en']) {
    try {
      const filePath = `./public/locales/${lang}/translation.json`;
      const fs = await import('fs');
      
      if (fs.existsSync(filePath)) {
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const existingTranslations = JSON.parse(fileContent);
        
        if (!existingTranslations.products) {
          existingTranslations.products = {};
        }
        
        existingTranslations.products[productKey] = translations[lang];
        
        fs.writeFileSync(filePath, JSON.stringify(existingTranslations, null, 2));
        console.log(`✅ Перевод добавлен для ${lang}: ${productKey}`);
      }
    } catch (error) {
      console.error(`❌ Ошибка добавления перевода для ${lang}:`, error);
    }
  }
  
  return productKey;
};