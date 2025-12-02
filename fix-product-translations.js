// fix-product-translations.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Исправляем переводы для товаров...');

const fixedTranslations = {
  ru: {
    products: {
      title: "Управление товарами",
      addProduct: "Добавить новый товар",
      existingProducts: "Существующие товары",
      productName: "Название товара *",
      category: "Категория",
      price: "Цена *", 
      image: "Изображение (URL)",
      description: "Описание товара",
      requiredFields: "* - обязательные поля",
      addButton: "Добавить товар",
      edit: "Редактировать",
      delete: "Удалить",
      categories: {
        textile: "Текстиль",
        accessories: "Аксессуары",
        cosmetics: "Косметика",
        hygiene: "Гигиена"
      },
      subcategories: {
        // Текстиль
        towels: "Полотенца",
        slippers: "Тапочки", 
        robes: "Халаты",
        // Аксессуары
        standard: "Standard",
        eco: "Eco",
        shoes: "Для обуви",
        sewing: "Швейные наборы",
        razor: "Бритвенный набор",
        cosmetic: "Косметический набор", 
        tooth: "Зубной набор",
        // Косметика
        shampoo: "Шампунь",
        gel: "Гель для душа",
        lotion: "Лосьон для тела",
        soap: "Мыло",
        conditioner: "Кондиционер",
        // Гигиена
        shower_cap: "Шапочка для душа",
        sanitary: "Санитарные принадлежности"
      }
    }
  },
  kk: {
    products: {
      title: "Тауарларды басқару",
      addProduct: "Жаңа тауар қосу",
      existingProducts: "Бар тауарлар", 
      productName: "Тауар атауы *",
      category: "Санат",
      price: "Бағасы *",
      image: "Сурет (URL)",
      description: "Тауар сипаттамасы",
      requiredFields: "* - міндетті өрістер",
      addButton: "Тауар қосу",
      edit: "Өңдеу",
      delete: "Жою",
      categories: {
        textile: "Текстиль",
        accessories: "Аксессуарлар",
        cosmetics: "Косметика",
        hygiene: "Гигиена"
      },
      subcategories: {
        towels: "Сүлгілер",
        slippers: "Тақиялар",
        robes: "Халаттар",
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
        conditioner: "Кондиционер",
        shower_cap: "Душ баскиімі",
        sanitary: "Санитарлық бұйымдар"
      }
    }
  },
  en: {
    products: {
      title: "Product Management",
      addProduct: "Add New Product",
      existingProducts: "Existing Products",
      productName: "Product Name *",
      category: "Category",
      price: "Price *",
      image: "Image (URL)", 
      description: "Product Description",
      requiredFields: "* - required fields",
      addButton: "Add Product",
      edit: "Edit",
      delete: "Delete",
      categories: {
        textile: "Textile",
        accessories: "Accessories",
        cosmetics: "Cosmetics", 
        hygiene: "Hygiene"
      },
      subcategories: {
        towels: "Towels",
        slippers: "Slippers",
        robes: "Robes",
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
        conditioner: "Conditioner",
        shower_cap: "Shower cap",
        sanitary: "Sanitary products"
      }
    }
  }
};

['ru', 'kk', 'en'].forEach(lang => {
  const filePath = path.join(__dirname, 'public', 'locales', lang, 'translation.json');
  
  if (fs.existsSync(filePath)) {
    let translations = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    // Полностью заменяем раздел products
    translations.products = fixedTranslations[lang].products;
    
    fs.writeFileSync(filePath, JSON.stringify(translations, null, 2));
    console.log(`✅ Переводы исправлены: ${lang}`);
  } else {
    console.log(`❌ Файл не найден: ${filePath}`);
  }
});

console.log('🎉 Переводы исправлены!');