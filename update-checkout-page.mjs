import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Обновляем CheckoutPage...');

const checkoutPagePath = path.join(__dirname, 'src', 'pages', 'CheckoutPage.jsx');

if (fs.existsSync(checkoutPagePath)) {
  let content = fs.readFileSync(checkoutPagePath, 'utf8');
  
  // Добавляем импорт useTranslation
  if (!content.includes("useTranslation")) {
    content = content.replace(
      "import React, { useState } from 'react';",
      "import React, { useState } from 'react';\nimport { useTranslation } from 'react-i18next';"
    );
  }
  
  // Добавляем useTranslation в компонент
  if (!content.includes("const { t } = useTranslation();")) {
    content = content.replace(
      "const CheckoutPage = () => {",
      "const CheckoutPage = () => {\n  const { t } = useTranslation();"
    );
  }
  
  // Заменяем тексты (только основные, чтобы не перегружать)
  const replacements = [
    { search: 'Корзина пуста', replace: "{t('cart.empty')}" },
    { search: 'Добавьте товары из каталога', replace: "{t('cart.emptyDescription')}" },
    { search: 'Перейти в каталог', replace: "{t('home.startShopping')}" },
    { search: 'Назад', replace: "{t('common.back')}" },
    { search: 'Оформление заказа', replace: "{t('checkout.title')}" },
    { search: 'Имя *', replace: "{t('checkout.name')}" },
    { search: 'Телефон *', replace: "{t('checkout.phone')}" },
    { search: 'Компания', replace: "{t('checkout.company')}" },
    { search: 'Город *', replace: "{t('checkout.city')}" },
    { search: 'Адрес *', replace: "{t('checkout.address')}" },
    { search: 'Примечания к заказу', replace: "{t('checkout.notes')}" },
    { search: 'Способ оплаты', replace: "{t('checkout.paymentMethod')}" },
    { search: 'Наличными', replace: "{t('checkout.cash')}" },
    { search: 'Картой', replace: "{t('checkout.card')}" },
    { search: 'Обрабатывается...', replace: "{t('checkout.processing')}" },
    { search: 'Оформить заказ', replace: "{t('checkout.placeOrder')}" },
    { search: 'Заказ оформлен!', replace: "{t('checkout.orderComplete')}" },
    { search: 'Ваш заказ', replace: "{t('checkout.orderNumber')}" },
    { search: 'успешно принят в обработку', replace: "{t('checkout.successMessage')}" },
    { search: 'Что дальше?', replace: "{t('checkout.nextSteps')}" },
    { search: 'Мы свяжемся с вами в течение 1 часа', replace: "{t('checkout.contactYou')}" },
    { search: 'Подтвердим детали заказа и способ оплаты', replace: "{t('checkout.confirmDetails')}" },
    { search: 'Доставка будет выполнена в течение 1 дня', replace: "{t('checkout.deliveryTime')}" },
    { search: 'Оплата: 100% постоплата после получения', replace: "{t('checkout.paymentTerms')}" },
    { search: 'Продолжить покупки', replace: "{t('checkout.continueShopping')}" },
    { search: 'На главную', replace: "{t('checkout.goHome')}" },
    { search: 'Условия оплаты:', replace: "{t('checkout.paymentConditions')}" },
    { search: '100% постоплата после получения', replace: "{t('checkout.postPayment')}" },
    { search: 'Доставка: 1 день', replace: "{t('checkout.delivery')}" },
    { search: 'Цены указаны с НДС', replace: "{t('checkout.pricesIncludeVAT')}" },
    { search: 'Ваш заказ', replace: "{t('checkout.orderDetails')}" },
    { search: 'Итого:', replace: "{t('cart.total')}" }
  ];
  
  replacements.forEach(({ search, replace }) => {
    const regex = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
    content = content.replace(regex, replace);
  });
  
  fs.writeFileSync(checkoutPagePath, content);
  console.log('✅ CheckoutPage обновлен!');
} else {
  console.log('❌ CheckoutPage.jsx не найден');
}