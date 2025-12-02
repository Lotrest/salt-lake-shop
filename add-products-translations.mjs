import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Добавляем переводы товаров в файлы...');

// Переводы для всех товаров
const productTranslations = {
  products: {
    tooth_kit: {
      name: { ru: "Зубной набор", kk: "Тіс жинағы", en: "Tooth Kit" },
      description: { ru: "Качественный зубной набор для гостиниц", kk: "Мейманханаларға арналған сапалы тіс жинағы", en: "Quality tooth kit for hotels" }
    },
    shower_cap: {
      name: { ru: "Шапочка для душа", kk: "Душ баскиімі", en: "Shower Cap" },
      description: { ru: "Одноразовая шапочка для душа, гипоаллергенная", kk: "Бір реттік душ баскиімі, гипоаллергенді", en: "Disposable shower cap, hypoallergenic" }
    },
    razor_kit: {
      name: { ru: "Бритвенный набор", kk: "Қырық жинағы", en: "Razor Kit" },
      description: { ru: "Компактный бритвенный набор для гостей", kk: "Қонақтарға арналған ыңғайлы қырық жинағы", en: "Compact razor kit for guests" }
    },
    cosmetic_kit: {
      name: { ru: "Косметический набор", kk: "Косметика жинағы", en: "Cosmetic Kit" },
      description: { ru: "Компактный косметический набор для гостей", kk: "Қонақтарға арналған ыңғайлы косметика жинағы", en: "Compact cosmetic kit for guests" }
    },
    hairbrush: {
      name: { ru: "Расческа", kk: "Тарақ", en: "Hairbrush" },
      description: { ru: "Качественная расческа для волос", kk: "Шаш үшін сапалы тарақ", en: "Quality hairbrush" }
    },
    shoe_horn: {
      name: { ru: "Рожок для обуви", kk: "Аяқ киім қасығы", en: "Shoe Horn" },
      description: { ru: "Удобный рожок для обуви", kk: "Ыңғайлы аяқ киім қасығы", en: "Convenient shoe horn" }
    },
    shoe_sponge: {
      name: { ru: "Губка для обуви", kk: "Аяқ киім губкасы", en: "Shoe Sponge" },
      description: { ru: "Губка для ухода за обувью", kk: "Аяқ киімге күтім жасауға арналған губка", en: "Sponge for shoe care" }
    },
    washcloth: {
      name: { ru: "Мочалка", kk: "Жуғыш", en: "Washcloth" },
      description: { ru: "Мягкая мочалка для душа", kk: "Душ үшін жұмсақ жуғыш", en: "Soft washcloth for shower" }
    },
    shoe_wipe: {
      name: { ru: "Салфетка для обуви", kk: "Аяқ киім салфеткасы", en: "Shoe Wipe" },
      description: { ru: "Салфетка для чистки обуви", kk: "Аяқ киімді тазалауға арналған салфетка", en: "Wipe for shoe cleaning" }
    },
    sanitary_bag: {
      name: { ru: "Санитарный пакет", kk: "Санитарлық пакет", en: "Sanitary Bag" },
      description: { ru: "Гигиенический пакет для личных вещей", kk: "Жеке заттарға арналған гигиеналық пакет", en: "Hygienic bag for personal items" }
    },
    sewing_kit: {
      name: { ru: "Швейный набор", kk: "Тігін жинағы", en: "Sewing Kit" },
      description: { ru: "Компактный швейный набор для мелкого ремонта", kk: "Шағын жөндеулерге арналған ыңғайлы тігін жинағы", en: "Compact sewing kit for minor repairs" }
    }
  }
};

// Обновляем файлы переводов
['ru', 'kk', 'en'].forEach(lang => {
  const filePath = path.join(__dirname, 'public', 'locales', lang, 'translation.json');
  
  if (fs.existsSync(filePath)) {
    const translations = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    // Добавляем переводы товаров
    translations.products = {};
    Object.keys(productTranslations.products).forEach(productKey => {
      translations.products[productKey] = {
        name: productTranslations.products[productKey].name[lang],
        description: productTranslations.products[productKey].description[lang]
      };
    });
    
    fs.writeFileSync(filePath, JSON.stringify(translations, null, 2));
    console.log(`✅ Добавлены переводы товаров: public/locales/${lang}/translation.json`);
  }
});

console.log('🎉 Переводы товаров добавлены!');