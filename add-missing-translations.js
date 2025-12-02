// add-missing-translations.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Добавляем недостающие переводы...');

const missingTranslations = {
  ru: {
    products: {
      namePlaceholder: "Например: Полотенце банное",
      pricePlaceholder: "Например: 195 ₸",
      imagePlaceholder: "https://example.com/image.jpg",
      descriptionPlaceholder: "Подробное описание товара...",
      selectCategory: "Выберите категорию",
      selectSubcategory: "Выберите подкатегорию",
      subcategory: "Подкатегория",
      fillRequired: "Заполните обязательные поля",
      addSuccess: "Товар успешно добавлен!",
      addError: "Ошибка при добавлении товара",
      deleteSuccess: "Товар успешно удален!",
      deleteError: "Ошибка при удалении товара",
      confirmDelete: "Вы уверены, что хотите удалить этот товар?",
      noProducts: "Товары не найдены"
    }
  },
  kk: {
    products: {
      namePlaceholder: "Мысалы: Сүлгі",
      pricePlaceholder: "Мысалы: 195 ₸",
      imagePlaceholder: "https://example.com/image.jpg", 
      descriptionPlaceholder: "Тауардың егжей-тегжейлі сипаттамасы...",
      selectCategory: "Санатты таңдаңыз",
      selectSubcategory: "Ішкі санатты таңдаңыз",
      subcategory: "Ішкі санат",
      fillRequired: "Міндетті өрістерді толтырыңыз",
      addSuccess: "Тауар сәтті қосылды!",
      addError: "Тауарды қосу кезінде қате",
      deleteSuccess: "Тауар сәтті жойылды!",
      deleteError: "Тауарды жою кезінде қате",
      confirmDelete: "Сіз бұл тауарды жойғыңыз келетініне сенімдісіз бе?",
      noProducts: "Тауарлар табылмады"
    }
  },
  en: {
    products: {
      namePlaceholder: "For example: Bath towel",
      pricePlaceholder: "For example: 195 ₸",
      imagePlaceholder: "https://example.com/image.jpg",
      descriptionPlaceholder: "Detailed product description...",
      selectCategory: "Select category",
      selectSubcategory: "Select subcategory", 
      subcategory: "Subcategory",
      fillRequired: "Fill required fields",
      addSuccess: "Product successfully added!",
      addError: "Error adding product",
      deleteSuccess: "Product successfully deleted!",
      deleteError: "Error deleting product",
      confirmDelete: "Are you sure you want to delete this product?",
      noProducts: "No products found"
    }
  }
};

['ru', 'kk', 'en'].forEach(lang => {
  const filePath = path.join(__dirname, 'public', 'locales', lang, 'translation.json');
  
  if (fs.existsSync(filePath)) {
    let translations = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    if (!translations.products) translations.products = {};
    Object.keys(missingTranslations[lang].products).forEach(key => {
      translations.products[key] = missingTranslations[lang].products[key];
    });
    
    fs.writeFileSync(filePath, JSON.stringify(translations, null, 2));
    console.log(`✅ Переводы добавлены: ${lang}`);
  }
});

console.log('🎉 Недостающие переводы добавлены!');