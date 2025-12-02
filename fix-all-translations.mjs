import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Исправляем ВСЕ переводы...');

// Полные переводы для всего сайта
const completeTranslations = {
  ru: {
    header: {
      home: "Главная",
      catalog: "Каталог", 
      about: "О нас",
      contacts: "Контакты",
      profile: "Профиль",
      admin: "Админка",
      login: "Войти",
      logout: "Выйти"
    },
    catalog: {
      title: "Каталог товаров",
      description: "Широкий ассортимент качественных товаров для вашего бизнеса",
      search: "Поиск товаров по названию...",
      addToCart: "В корзину",
      noProducts: "Товары не найдены"
    },
    categories: {
      all: "Все товары",
      textile: "Текстиль",
      accessories: "Аксессуары",
      cosmetics: "Косметика",
      towels: "Полотенца",
      slippers: "Тапочки",
      robes: "Халаты",
      accessories_all: "Все аксессуары",
      standard: "Standard",
      eco: "Eco",
      shoes: "Для обуви",
      sewing: "Швейные наборы",
      razor: "Бритвенный набор",
      cosmetic: "Косметический набор",
      tooth: "Зубной набор",
      shampoo: "Шампунь",
      gel: "Гель для душа",
      lotion: "Лосьон для тела",
      soap: "Мыло",
      conditioner: "Кондиционер"
    },
    products: {
      tooth_kit: {
        name: "Зубной набор",
        description: "Качественный зубной набор для гостиниц"
      },
      shower_cap: {
        name: "Шапочка для душа",
        description: "Одноразовая шапочка для душа, гипоаллергенная"
      },
      razor_kit: {
        name: "Бритвенный набор",
        description: "Компактный бритвенный набор для гостей"
      },
      cosmetic_kit: {
        name: "Косметический набор",
        description: "Компактный косметический набор для гостей"
      },
      hairbrush: {
        name: "Расческа",
        description: "Качественная расческа для волос"
      },
      shoe_horn: {
        name: "Рожок для обуви",
        description: "Удобный рожок для обуви"
      },
      shoe_sponge: {
        name: "Губка для обуви",
        description: "Губка для ухода за обувью"
      },
      washcloth: {
        name: "Мочалка",
        description: "Мягкая мочалка для душа"
      },
      shoe_wipe: {
        name: "Салфетка для обуви",
        description: "Салфетка для чистки обуви"
      },
      sanitary_bag: {
        name: "Санитарный пакет",
        description: "Гигиенический пакет для личных вещей"
      },
      sewing_kit: {
        name: "Швейный набор",
        description: "Компактный швейный набор для мелкого ремонта"
      }
    }
  },
  kk: {
    header: {
      home: "Басты",
      catalog: "Каталог",
      about: "Біз туралы", 
      contacts: "Байланыс",
      profile: "Профиль",
      admin: "Админ",
      login: "Кіру",
      logout: "Шығу"
    },
    catalog: {
      title: "Тауарлар каталогы",
      description: "Сіздің бизнесіңізге арналған сапалы тауарлардың кең таңдауы",
      search: "Тауарларды атауы бойынша іздеу...",
      addToCart: "Себетке",
      noProducts: "Тауарлар табылмады"
    },
    categories: {
      all: "Барлық тауарлар",
      textile: "Текстиль",
      accessories: "Аксессуарлар",
      cosmetics: "Косметика",
      towels: "Сүлгілер",
      slippers: "Тақиялар",
      robes: "Халаттар",
      accessories_all: "Барлық аксессуарлар",
      standard: "Standard",
      eco: "Eco",
      shoes: "Аяқ киім үшін",
      sewing: "Тігін жинақтары",
      razor: "Қырық жинағы",
      cosmetic: "Косметика жинағы",
      tooth: "Тіс жинағы",
      shampoo: "Шампунь",
      gel: "Душ гелі",
      lotion: "Дене лосьоны",
      soap: "Сабын",
      conditioner: "Кондиционер"
    },
    products: {
      tooth_kit: {
        name: "Тіс жинағы",
        description: "Мейманханаларға арналған сапалы тіс жинағы"
      },
      shower_cap: {
        name: "Душ баскиімі",
        description: "Бір реттік душ баскиімі, гипоаллергенді"
      },
      razor_kit: {
        name: "Қырық жинағы",
        description: "Қонақтарға арналған ыңғайлы қырық жинағы"
      },
      cosmetic_kit: {
        name: "Косметика жинағы",
        description: "Қонақтарға арналған ыңғайлы косметика жинағы"
      },
      hairbrush: {
        name: "Тарақ",
        description: "Шаш үшін сапалы тарақ"
      },
      shoe_horn: {
        name: "Аяқ киім қасығы",
        description: "Ыңғайлы аяқ киім қасығы"
      },
      shoe_sponge: {
        name: "Аяқ киім губкасы",
        description: "Аяқ киімге күтім жасауға арналған губка"
      },
      washcloth: {
        name: "Жуғыш",
        description: "Душ үшін жұмсақ жуғыш"
      },
      shoe_wipe: {
        name: "Аяқ киім салфеткасы",
        description: "Аяқ киімді тазалауға арналған салфетка"
      },
      sanitary_bag: {
        name: "Санитарлық пакет",
        description: "Жеке заттарға арналған гигиеналық пакет"
      },
      sewing_kit: {
        name: "Тігін жинағы",
        description: "Шағын жөндеулерге арналған ыңғайлы тігін жинағы"
      }
    }
  },
  en: {
    header: {
      home: "Home",
      catalog: "Catalog",
      about: "About",
      contacts: "Contacts",
      profile: "Profile",
      admin: "Admin", 
      login: "Login",
      logout: "Logout"
    },
    catalog: {
      title: "Product Catalog",
      description: "Wide range of quality products for your business",
      search: "Search products by name...",
      addToCart: "Add to Cart",
      noProducts: "Products not found"
    },
    categories: {
      all: "All products",
      textile: "Textile",
      accessories: "Accessories",
      cosmetics: "Cosmetics",
      towels: "Towels",
      slippers: "Slippers",
      robes: "Robes",
      accessories_all: "All accessories",
      standard: "Standard",
      eco: "Eco",
      shoes: "For shoes",
      sewing: "Sewing kits",
      razor: "Razor kit",
      cosmetic: "Cosmetic kit",
      tooth: "Tooth kit",
      shampoo: "Shampoo",
      gel: "Shower gel",
      lotion: "Body lotion",
      soap: "Soap",
      conditioner: "Conditioner"
    },
    products: {
      tooth_kit: {
        name: "Tooth Kit",
        description: "Quality tooth kit for hotels"
      },
      shower_cap: {
        name: "Shower Cap",
        description: "Disposable shower cap, hypoallergenic"
      },
      razor_kit: {
        name: "Razor Kit",
        description: "Compact razor kit for guests"
      },
      cosmetic_kit: {
        name: "Cosmetic Kit",
        description: "Compact cosmetic kit for guests"
      },
      hairbrush: {
        name: "Hairbrush",
        description: "Quality hairbrush"
      },
      shoe_horn: {
        name: "Shoe Horn",
        description: "Convenient shoe horn"
      },
      shoe_sponge: {
        name: "Shoe Sponge",
        description: "Sponge for shoe care"
      },
      washcloth: {
        name: "Washcloth",
        description: "Soft washcloth for shower"
      },
      shoe_wipe: {
        name: "Shoe Wipe",
        description: "Wipe for shoe cleaning"
      },
      sanitary_bag: {
        name: "Sanitary Bag",
        description: "Hygienic bag for personal items"
      },
      sewing_kit: {
        name: "Sewing Kit",
        description: "Compact sewing kit for minor repairs"
      }
    }
  }
};

// Обновляем каждый файл перевода
['ru', 'kk', 'en'].forEach(lang => {
  const filePath = path.join(__dirname, 'public', 'locales', lang, 'translation.json');
  
  try {
    let existingTranslations = {};
    
    // Читаем существующие переводы если файл есть
    if (fs.existsSync(filePath)) {
      const fileContent = fs.readFileSync(filePath, 'utf8');
      existingTranslations = JSON.parse(fileContent);
    }
    
    // Объединяем существующие переводы с новыми
    const mergedTranslations = deepMerge(existingTranslations, completeTranslations[lang]);
    
    // Сохраняем обновленный файл
    fs.writeFileSync(filePath, JSON.stringify(mergedTranslations, null, 2));
    console.log(`✅ Обновлен: public/locales/${lang}/translation.json`);
    
  } catch (error) {
    console.log(`❌ Ошибка с файлом ${filePath}:`, error.message);
  }
});

// Функция для глубокого слияния объектов
function deepMerge(target, source) {
  const result = { ...target };
  
  for (const key in source) {
    if (source[key] instanceof Object && key in target && target[key] instanceof Object) {
      result[key] = deepMerge(target[key], source[key]);
    } else {
      result[key] = source[key];
    }
  }
  
  return result;
}

console.log('🎉 ВСЕ переводы добавлены!');
console.log('🔄 Перезагрузите страницу и проверьте работу переводов.');