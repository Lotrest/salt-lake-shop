
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Добавляем переводы для управления товарами...');

const productTranslations = {
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
        towels: "Полотенца",
        slippers: "Тапочки",
        robes: "Халаты",
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
        conditioner: "Кондиционер"
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
        conditioner: "Conditioner"
      }
    }
  }
};

['ru', 'kk', 'en'].forEach(lang => {
  const filePath = path.join(__dirname, 'public', 'locales', lang, 'translation.json');
  
  if (fs.existsSync(filePath)) {
    let translations = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    if (!translations.products) translations.products = {};
    Object.keys(productTranslations[lang].products).forEach(key => {
      translations.products[key] = productTranslations[lang].products[key];
    });
    
    fs.writeFileSync(filePath, JSON.stringify(translations, null, 2));
    console.log(`✅ Переводы добавлены: ${lang}`);
  }
});

console.log('🎉 Переводы для управления товарами добавлены!');