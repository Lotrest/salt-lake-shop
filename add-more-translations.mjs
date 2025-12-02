import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Добавляем переводы для загрузки, профиля, корзины и авторизации...');

const moreTranslations = {
  ru: {
    common: {
      loading: "Загрузка...",
      success: "Успешно",
      error: "Ошибка",
      save: "Сохранить",
      cancel: "Отмена",
      back: "Назад",
      yes: "Да",
      no: "Нет",
      confirm: "Подтвердить"
    },
    auth: {
      login: "Вход",
      register: "Регистрация",
      email: "Email",
      password: "Пароль",
      name: "Имя",
      phone: "Телефон",
      confirmPassword: "Подтвердите пароль",
      forgotPassword: "Забыли пароль?",
      rememberMe: "Запомнить меня",
      noAccount: "Нет аккаунта?",
      hasAccount: "Уже есть аккаунт?",
      demoCredentials: "Для демонстрации:",
      demoEmail: "Email: admin@saltlake.kz",
      demoPassword: "Пароль: 123456"
    },
    profile: {
      title: "Профиль",
      personalData: "Личные данные",
      orderHistory: "История заказов",
      noOrders: "Заказов пока нет.",
      orderNumber: "Заказ #",
      itemsCount: "Позиций:",
      totalAmount: "Сумма:",
      repeatOrder: "Повторить заказ",
      accessDenied: "Войдите, чтобы увидеть профиль.",
      loading: "Загрузка…"
    },
    cart: {
      title: "Корзина",
      empty: "Корзина пуста",
      emptyDescription: "Добавьте товары из каталога",
      total: "Итого:",
      clearCart: "Очистить корзину",
      checkout: "Оформить заказ",
      items: "товаров",
      remove: "Удалить",
      quantity: "Количество",
      price: "Цена",
      subtotal: "Промежуточный итог"
    },
    checkout: {
      title: "Оформление заказа",
      orderDetails: "Детали заказа",
      customerInfo: "Информация о клиенте",
      shippingAddress: "Адрес доставки",
      paymentMethod: "Способ оплаты",
      name: "Имя *",
      phone: "Телефон *",
      company: "Компания",
      city: "Город *",
      address: "Адрес *",
      notes: "Примечания к заказу",
      cash: "Наличными",
      card: "Картой",
      processing: "Обрабатывается...",
      placeOrder: "Оформить заказ",
      orderComplete: "Заказ оформлен!",
      orderNumber: "Ваш заказ #",
      successMessage: "успешно принят в обработку",
      nextSteps: "Что дальше?",
      contactYou: "Мы свяжемся с вами в течение 1 часа",
      confirmDetails: "Подтвердим детали заказа и способ оплаты",
      deliveryTime: "Доставка будет выполнена в течение 1 дня",
      paymentTerms: "Оплата: 100% постоплата после получения",
      continueShopping: "Продолжить покупки",
      goHome: "На главную",
      paymentConditions: "Условия оплаты:",
      postPayment: "100% постоплата после получения",
      delivery: "Доставка: 1 день",
      pricesIncludeVAT: "Цены указаны с НДС"
    },
    admin: {
      title: "Админ-панель",
      users: "Пользователи",
      orders: "Заказы",
      statistics: "Статистика продаж",
      search: "Поиск по пользователям и заказам...",
      totalUsers: "Всего пользователей:",
      totalOrders: "Всего заказов:",
      accessDenied: "Доступ запрещён",
      product: "Товар",
      quantity: "Количество",
      totalSum: "Общая сумма",
      notEnoughData: "Недостаточно данных для статистики"
    }
  },
  kk: {
    common: {
      loading: "Жүктелуде...",
      success: "Сәтті",
      error: "Қате",
      save: "Сақтау",
      cancel: "Болдырмау",
      back: "Артқа",
      yes: "Иә",
      no: "Жоқ",
      confirm: "Растау"
    },
    auth: {
      login: "Кіру",
      register: "Тіркелу",
      email: "Email",
      password: "Құпия сөз",
      name: "Аты",
      phone: "Телефон",
      confirmPassword: "Құпия сөзді растау",
      forgotPassword: "Құпия сөзді ұмыттыңыз ба?",
      rememberMe: "Мені есте сақтау",
      noAccount: "Аккаунт жоқ па?",
      hasAccount: "Аккаунтыңыз бар ма?",
      demoCredentials: "Демо үшін:",
      demoEmail: "Email: admin@saltlake.kz",
      demoPassword: "Құпия сөз: 123456"
    },
    profile: {
      title: "Профиль",
      personalData: "Жеке деректер",
      orderHistory: "Тапсырыс тарихы",
      noOrders: "Тапсырыстар әлі жоқ.",
      orderNumber: "Тапсырыс #",
      itemsCount: "Позициялар:",
      totalAmount: "Жалпы сома:",
      repeatOrder: "Тапсырысты қайталау",
      accessDenied: "Профильді көру үшін кіріңіз.",
      loading: "Жүктелуде…"
    },
    cart: {
      title: "Себет",
      empty: "Себет бос",
      emptyDescription: "Каталогтан тауарларды қосыңыз",
      total: "Барлығы:",
      clearCart: "Себетті тазалау",
      checkout: "Тапсырыс беру",
      items: "тауарлар",
      remove: "Жою",
      quantity: "Саны",
      price: "Бағасы",
      subtotal: "Аралық қорытынды"
    },
    checkout: {
      title: "Тапсырыс рәсімдеу",
      orderDetails: "Тапсырыс мәліметтері",
      customerInfo: "Клиент туралы ақпарат",
      shippingAddress: "Жеткізу мекенжайы",
      paymentMethod: "Төлем әдісі",
      name: "Аты *",
      phone: "Телефон *",
      company: "Компания",
      city: "Қала *",
      address: "Мекенжай *",
      notes: "Тапсырыс бойынша ескертпелер",
      cash: "Қолма-қол ақша",
      card: "Картамен",
      processing: "Өңделуде...",
      placeOrder: "Тапсырыс беру",
      orderComplete: "Тапсырыс рәсімделді!",
      orderNumber: "Сіздің тапсырысыңыз #",
      successMessage: "сәтті қабылданды",
      nextSteps: "Әрі қарай не істеу керек?",
      contactYou: "Біз сізбен 1 сағат ішінде хабарласамыз",
      confirmDetails: "Тапсырыс мәліметтерін және төлем әдісін растаймыз",
      deliveryTime: "Жеткізу 1 күн ішінде орындалады",
      paymentTerms: "Төлем: алудан кейін 100% кейін төлем",
      continueShopping: "Сатып алуды жалғастыру",
      goHome: "Басты бетке",
      paymentConditions: "Төлем шарттары:",
      postPayment: "Алудан кейін 100% кейін төлем",
      delivery: "Жеткізу: 1 күн",
      pricesIncludeVAT: "Бағалар ҚҚС қосылған"
    },
    admin: {
      title: "Админ-панель",
      users: "Пайдаланушылар",
      orders: "Тапсырыстар",
      statistics: "Сату статистикасы",
      search: "Пайдаланушылар мен тапсырыстар бойынша іздеу...",
      totalUsers: "Барлық пайдаланушылар:",
      totalOrders: "Барлық тапсырыстар:",
      accessDenied: "Қол жеткізу шектеулі",
      product: "Тауар",
      quantity: "Саны",
      totalSum: "Жалпы сома",
      notEnoughData: "Статистика үшін деректер жеткіліксіз"
    }
  },
  en: {
    common: {
      loading: "Loading...",
      success: "Success",
      error: "Error",
      save: "Save",
      cancel: "Cancel",
      back: "Back",
      yes: "Yes",
      no: "No",
      confirm: "Confirm"
    },
    auth: {
      login: "Login",
      register: "Register",
      email: "Email",
      password: "Password",
      name: "Name",
      phone: "Phone",
      confirmPassword: "Confirm Password",
      forgotPassword: "Forgot Password?",
      rememberMe: "Remember Me",
      noAccount: "Don't have an account?",
      hasAccount: "Already have an account?",
      demoCredentials: "For demonstration:",
      demoEmail: "Email: admin@saltlake.kz",
      demoPassword: "Password: 123456"
    },
    profile: {
      title: "Profile",
      personalData: "Personal Data",
      orderHistory: "Order History",
      noOrders: "No orders yet.",
      orderNumber: "Order #",
      itemsCount: "Items:",
      totalAmount: "Total amount:",
      repeatOrder: "Repeat Order",
      accessDenied: "Log in to see profile.",
      loading: "Loading…"
    },
    cart: {
      title: "Cart",
      empty: "Cart is empty",
      emptyDescription: "Add products from catalog",
      total: "Total:",
      clearCart: "Clear Cart",
      checkout: "Checkout",
      items: "items",
      remove: "Remove",
      quantity: "Quantity",
      price: "Price",
      subtotal: "Subtotal"
    },
    checkout: {
      title: "Checkout",
      orderDetails: "Order Details",
      customerInfo: "Customer Information",
      shippingAddress: "Shipping Address",
      paymentMethod: "Payment Method",
      name: "Name *",
      phone: "Phone *",
      company: "Company",
      city: "City *",
      address: "Address *",
      notes: "Order Notes",
      cash: "Cash",
      card: "Card",
      processing: "Processing...",
      placeOrder: "Place Order",
      orderComplete: "Order Complete!",
      orderNumber: "Your order #",
      successMessage: "has been successfully accepted for processing",
      nextSteps: "What's next?",
      contactYou: "We will contact you within 1 hour",
      confirmDetails: "We will confirm order details and payment method",
      deliveryTime: "Delivery will be completed within 1 day",
      paymentTerms: "Payment: 100% post-payment after receipt",
      continueShopping: "Continue Shopping",
      goHome: "Go Home",
      paymentConditions: "Payment conditions:",
      postPayment: "100% post-payment after receipt",
      delivery: "Delivery: 1 day",
      pricesIncludeVAT: "Prices include VAT"
    },
    admin: {
      title: "Admin Panel",
      users: "Users",
      orders: "Orders",
      statistics: "Sales Statistics",
      search: "Search users and orders...",
      totalUsers: "Total users:",
      totalOrders: "Total orders:",
      accessDenied: "Access denied",
      product: "Product",
      quantity: "Quantity",
      totalSum: "Total sum",
      notEnoughData: "Not enough data for statistics"
    }
  }
};

// Обновляем файлы переводов
['ru', 'kk', 'en'].forEach(lang => {
  const filePath = path.join(__dirname, 'public', 'locales', lang, 'translation.json');
  
  try {
    let translations = {};
    
    if (fs.existsSync(filePath)) {
      const fileContent = fs.readFileSync(filePath, 'utf8');
      translations = JSON.parse(fileContent);
    }
    
    // Добавляем новые переводы
    Object.keys(moreTranslations[lang]).forEach(category => {
      if (!translations[category]) {
        translations[category] = {};
      }
      Object.keys(moreTranslations[lang][category]).forEach(key => {
        translations[category][key] = moreTranslations[lang][category][key];
      });
    });
    
    fs.writeFileSync(filePath, JSON.stringify(translations, null, 2));
    console.log(`✅ Добавлены переводы: public/locales/${lang}/translation.json`);
    
  } catch (error) {
    console.log(`❌ Ошибка с файлом ${filePath}:`, error.message);
  }
});

console.log('🎉 Все переводы добавлены!');