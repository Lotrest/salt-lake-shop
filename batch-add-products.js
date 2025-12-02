import { addProductTranslation } from '../utils/auto-translate-products.js';

const newProducts = [
  {
    name: "Полотенце банное",
    description: "Мягкое банное полотенце для гостиниц"
  },
  {
    name: "Халат махровый", 
    description: "Комфортный махровый халат для гостей"
  },
  {
    name: "Тапочки одноразовые",
    description: "Гигиенические одноразовые тапочки"
  }
];

const addAllProducts = async () => {
  for (const product of newProducts) {
    console.log(`Добавляем товар: ${product.name}`);
    await addProductTranslation(product.name, product.description);
  }
  console.log('🎉 Все товары добавлены!');
};

addAllProducts();