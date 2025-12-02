import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Добавляем переводы для всех страниц...');

// Переводы для всех страниц
const pagesTranslations = {
  ru: {
    home: {
      title: "Salt Lake",
      subtitle1: "Профессиональное решение для вашего бизнеса.",
      subtitle2: "Качественные товары и услуги с доставкой по всему Казахстану.",
      startShopping: "Начать покупки →",
      contactUs: "Связаться с нами",
      whyChoose: "Почему выбирают Salt Lake?",
      whyDescription: "Мы предоставляем комплексные решения для бизнеса с высоким качеством обслуживания",
      fastDelivery: "Быстрая доставка",
      fastDeliveryDesc: "Доставка по всему Казахстану в кратчайшие сроки с возможностью отслеживания",
      qualityGuarantee: "Гарантия качества",
      qualityGuaranteeDesc: "Все товары проходят строгий контроль качества и имеют официальную гарантию",
      support: "24/7 Поддержка",
      supportDesc: "Круглосуточная техническая поддержка и консультации по всем вопросам",
      reviews: "Отзывы клиентов",
      averageRating: "Средняя оценка",
      noReviews: "Отзывов пока нет. Будьте первым!",
      leaveReview: "Оставить отзыв",
      yourName: "Ваше имя",
      rating: "Оценка",
      reviewText: "Текст отзыва",
      send: "Отправить",
      loginToReview: "Войдите в аккаунт, чтобы оставить отзыв.",
      readyToCooperate: "Готовы начать сотрудничество?",
      ctaDescription: "Свяжитесь с нами сегодня и получите персональное предложение для вашего бизнеса"
    },
    about: {
      title: "О нас",
      companyName: "Salt Lake Kazakhstan",
      mainDescription: "Компания «Salt Lake Kazakhstan» создаёт для Вас комфорт, который проявляется во всем!",
      description1: "Мы предлагаем гостиничную косметику и текстиль безупречного качества, профессиональные моющие средства для стирки и уборки, оборудование, а также производим полное техническое обслуживание гостиниц и ресторанов.",
      description2: "Благодаря прямым поставкам от заводов–производителей наши клиенты получают лучшие цены и сертифицированные товары.",
      conditions: "Условия работы:",
      deliveryTime: "Срок поставки:",
      paymentTerms: "Условия оплаты:",
      prices: "Цены:",
      deliveryTimeValue: "1 день",
      paymentTermsValue: "100% постоплата в течение недели после поставки",
      pricesValue: "Все цены указаны в тенге, с учетом НДС и доставки до склада в г. Алматы",
      contactInfo: "Контактная информация:",
      inKazakh: "На казахском языке:",
      inRussian: "На русском языке:",
      addressKz: "Мекенжайы: Алматы қ., Садовый бульвары, 1г",
      addressRu: "Адрес: г. Алматы, Бульвар Садовый, 1г",
      phone: "Тел.: +7 775 701 62 66",
      email: "Эл. пошта: saltlake.kz@gmail.com",
      emailRu: "Эл. почта: saltlake.kz@gmail.com",
      hotelSupplies: "Гостиничные принадлежности",
      hotelSuppliesDesc: "Косметика и текстиль премиум качества",
      cleaningProducts: "Моющие средства",
      cleaningProductsDesc: "Профессиональные средства для уборки",
      equipment: "Оборудование",
      equipmentDesc: "Качественное оборудование для гостиниц",
      maintenance: "Техобслуживание",
      maintenanceDesc: "Полное обслуживание гостиниц и ресторанов",
      trustUs: "Доверьте нам заботу о комфорте ваших гостей!"
    },
    contacts: {
      title: "Контакты",
      contactUs: "Свяжитесь с нами",
      address: "Адрес",
      addressKz: "На казахском:",
      addressRu: "На русском:",
      addressKzValue: "Мекенжайы: Алматы қ., Садовый бульвары, 1г",
      addressRuValue: "Адрес: г. Алматы, Бульвар Садовый, 1г",
      phone: "Телефон",
      phoneValue: "+7 775 701 62 66",
      email: "Электронная почта",
      emailValue: "saltlake.kz@gmail.com",
      workingHours: "Режим работы:",
      weekdays: "Понедельник - Пятница: 9:00 - 18:00",
      saturday: "Суббота: выходной",
      sunday: "Воскресенье: выходной"
    }
  },
  kk: {
    home: {
      title: "Salt Lake",
      subtitle1: "Сіздің бизнесіңізге арналған кәсіби шешім.",
      subtitle2: "Қазақстан бойынша жеткізумен сапалы тауарлар мен қызметтер.",
      startShopping: "Сатып алуды бастау →",
      contactUs: "Бізбен хабарласыңыз",
      whyChoose: "Неге Salt Lake таңдайды?",
      whyDescription: "Біз бизнес үшін жоғары сапалы қызмет көрсетумен кешенді шешімдер ұсынамыз",
      fastDelivery: "Жылдам жеткізу",
      fastDeliveryDesc: "Қазақстан бойынша ең қысқа мерзімде жеткізу, бақылау мүмкіндігімен",
      qualityGuarantee: "Сапа кепілдігі",
      qualityGuaranteeDesc: "Барлық тауарлар қатаң сапа бақылауынан өтеді және ресми кепілдікке ие",
      support: "24/7 Қолдау",
      supportDesc: "Тәулік бойы техникалық қолдау және барлық мәселелер бойынша кеңес",
      reviews: "Клиенттердің пікірлері",
      averageRating: "Орташа баға",
      noReviews: "Пікірлер әлі жоқ. Бірінші болыңыз!",
      leaveReview: "Пікір қалдыру",
      yourName: "Сіздің атыңыз",
      rating: "Баға",
      reviewText: "Пікір мәтіні",
      send: "Жіберу",
      loginToReview: "Пікір қалдыру үшін аккаунтыңызға кіріңіз.",
      readyToCooperate: "Ынтымақтастықты бастауға дайынсыз ба?",
      ctaDescription: "Бізбен бүгін хабарласыңыз және бизнесіңізге арналған жеке ұсыныс алыңыз"
    },
    about: {
      title: "Біз туралы",
      companyName: "Salt Lake Kazakhstan",
      mainDescription: "«Salt Lake Kazakhstan» компаниясы Сіз үшін барлығында көрінетін ыңғайлылық жасайды!",
      description1: "Біз мейманхана косметикасы мен таза сапалы текстильді, кір жуу және тазалауға арналған кәсіптікі тазалау құралдарын, жабдықтарды, сондай-ақ мейманханалар мен мейрамханаларды толық техникалық қызмет көрсетуді ұсынамыз.",
      description2: "Өндіруші зауыттардан тікелей жеткізу арқасында біздің клиенттер ең жақсы бағалар мен сертификатталған тауарлар алады.",
      conditions: "Жұмыс жағдайлары:",
      deliveryTime: "Жеткізу мерзімі:",
      paymentTerms: "Төлем шарттары:",
      prices: "Бағалар:",
      deliveryTimeValue: "1 күн",
      paymentTermsValue: "Жеткізілгеннен кейін бір апта ішінде 100% кейін төлем",
      pricesValue: "Барлық бағалар теңгеде көрсетілген, ҚҚС және Алматы қаласындағы қоймаға дейін жеткізу қосылған",
      contactInfo: "Байланыс ақпараты:",
      inKazakh: "Қазақ тілінде:",
      inRussian: "Орыс тілінде:",
      addressKz: "Мекенжайы: Алматы қ., Садовый бульвары, 1г",
      addressRu: "Адрес: г. Алматы, Бульвар Садовый, 1г",
      phone: "Тел.: +7 775 701 62 66",
      email: "Эл. пошта: saltlake.kz@gmail.com",
      emailRu: "Эл. почта: saltlake.kz@gmail.com",
      hotelSupplies: "Мейманхана жабдықтары",
      hotelSuppliesDesc: "Премиум сапалы косметика мен текстиль",
      cleaningProducts: "Тазалау құралдары",
      cleaningProductsDesc: "Кәсіптік тазалау құралдары",
      equipment: "Жабдықтар",
      equipmentDesc: "Мейманханаларға арналған сапалы жабдықтар",
      maintenance: "Техникалық қызмет",
      maintenanceDesc: "Мейманханалар мен мейрамханаларды толық қызмет көрсету",
      trustUs: "Қонақтарыңыздың ыңғайлылығына бізге сеніп тапсырыңыз!"
    },
    contacts: {
      title: "Байланыс",
      contactUs: "Бізбен хабарласыңыз",
      address: "Мекенжай",
      addressKz: "Қазақ тілінде:",
      addressRu: "Орыс тілінде:",
      addressKzValue: "Мекенжайы: Алматы қ., Садовый бульвары, 1г",
      addressRuValue: "Адрес: г. Алматы, Бульвар Садовый, 1г",
      phone: "Телефон",
      phoneValue: "+7 775 701 62 66",
      email: "Электрондық пошта",
      emailValue: "saltlake.kz@gmail.com",
      workingHours: "Жұмыс кестесі:",
      weekdays: "Дүйсенбі - Жұма: 9:00 - 18:00",
      saturday: "Сенбі: демалыс",
      sunday: "Жексенбі: демалыс"
    }
  },
  en: {
    home: {
      title: "Salt Lake",
      subtitle1: "Professional solution for your business.",
      subtitle2: "Quality products and services with delivery throughout Kazakhstan.",
      startShopping: "Start Shopping →",
      contactUs: "Contact Us",
      whyChoose: "Why choose Salt Lake?",
      whyDescription: "We provide comprehensive business solutions with high quality service",
      fastDelivery: "Fast Delivery",
      fastDeliveryDesc: "Delivery throughout Kazakhstan in the shortest time with tracking capability",
      qualityGuarantee: "Quality Guarantee",
      qualityGuaranteeDesc: "All products undergo strict quality control and have official warranty",
      support: "24/7 Support",
      supportDesc: "Round-the-clock technical support and consultations on all issues",
      reviews: "Customer Reviews",
      averageRating: "Average rating",
      noReviews: "No reviews yet. Be the first!",
      leaveReview: "Leave a Review",
      yourName: "Your name",
      rating: "Rating",
      reviewText: "Review text",
      send: "Send",
      loginToReview: "Log in to your account to leave a review.",
      readyToCooperate: "Ready to start cooperation?",
      ctaDescription: "Contact us today and get a personal offer for your business"
    },
    about: {
      title: "About Us",
      companyName: "Salt Lake Kazakhstan",
      mainDescription: "Salt Lake Kazakhstan company creates comfort for you that manifests in everything!",
      description1: "We offer hotel cosmetics and textiles of impeccable quality, professional detergents for laundry and cleaning, equipment, and also provide complete technical maintenance of hotels and restaurants.",
      description2: "Thanks to direct supplies from manufacturers, our customers get the best prices and certified products.",
      conditions: "Working conditions:",
      deliveryTime: "Delivery time:",
      paymentTerms: "Payment terms:",
      prices: "Prices:",
      deliveryTimeValue: "1 day",
      paymentTermsValue: "100% post-payment within a week after delivery",
      pricesValue: "All prices are indicated in tenge, including VAT and delivery to the warehouse in Almaty",
      contactInfo: "Contact information:",
      inKazakh: "In Kazakh:",
      inRussian: "In Russian:",
      addressKz: "Address: Almaty, Sadovy Boulevard, 1g",
      addressRu: "Address: Almaty, Sadovy Boulevard, 1g",
      phone: "Phone: +7 775 701 62 66",
      email: "Email: saltlake.kz@gmail.com",
      emailRu: "Email: saltlake.kz@gmail.com",
      hotelSupplies: "Hotel Supplies",
      hotelSuppliesDesc: "Premium quality cosmetics and textiles",
      cleaningProducts: "Cleaning Products",
      cleaningProductsDesc: "Professional cleaning products",
      equipment: "Equipment",
      equipmentDesc: "Quality equipment for hotels",
      maintenance: "Maintenance",
      maintenanceDesc: "Complete maintenance of hotels and restaurants",
      trustUs: "Trust us with the comfort of your guests!"
    },
    contacts: {
      title: "Contacts",
      contactUs: "Contact Us",
      address: "Address",
      addressKz: "In Kazakh:",
      addressRu: "In Russian:",
      addressKzValue: "Address: Almaty, Sadovy Boulevard, 1g",
      addressRuValue: "Address: Almaty, Sadovy Boulevard, 1g",
      phone: "Phone",
      phoneValue: "+7 775 701 62 66",
      email: "Email",
      emailValue: "saltlake.kz@gmail.com",
      workingHours: "Working hours:",
      weekdays: "Monday - Friday: 9:00 - 18:00",
      saturday: "Saturday: day off",
      sunday: "Sunday: day off"
    }
  }
};

// Обновляем файлы переводов
['ru', 'kk', 'en'].forEach(lang => {
  const filePath = path.join(__dirname, 'public', 'locales', lang, 'translation.json');
  
  try {
    let existingTranslations = {};
    
    if (fs.existsSync(filePath)) {
      const fileContent = fs.readFileSync(filePath, 'utf8');
      existingTranslations = JSON.parse(fileContent);
    }
    
    // Добавляем переводы страниц
    Object.keys(pagesTranslations[lang]).forEach(page => {
      if (!existingTranslations[page]) {
        existingTranslations[page] = {};
      }
      existingTranslations[page] = {
        ...existingTranslations[page],
        ...pagesTranslations[lang][page]
      };
    });
    
    fs.writeFileSync(filePath, JSON.stringify(existingTranslations, null, 2));
    console.log(`✅ Добавлены переводы страниц: public/locales/${lang}/translation.json`);
    
  } catch (error) {
    console.log(`❌ Ошибка с файлом ${filePath}:`, error.message);
  }
});

console.log('🎉 Переводы для всех страниц добавлены!');
console.log('📝 Теперь нужно обновить компоненты страниц...');