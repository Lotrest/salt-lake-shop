import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Исправляем недостающие переводы...');

// Добавляем недостающие переводы
const missingTranslations = {
  ru: {
    about: {
      description1: "Мы предлагаем гостиничную косметику и текстиль безупречного качества, профессиональные моющие средства для стирки и уборки, оборудование, а также производим полное техническое обслуживание гостиниц и ресторанов.",
      description2: "Благодаря прямым поставкам от заводов–производителей наши клиенты получают лучшие цены и сертифицированные товары.",
      deliveryTimeValue: "1 день",
      paymentTermsValue: "100% постоплата в течение недели после поставки",
      pricesValue: "Все цены указаны в тенге, с учетом НДС и доставки до склада в г. Алматы"
    },
    contacts: {
      weekdays: "Понедельник - Пятница: 9:00 - 18:00",
      saturday: "Суббота: выходной", 
      sunday: "Воскресенье: выходной"
    }
  },
  kk: {
    about: {
      description1: "Біз мейманхана косметикасы мен таза сапалы текстильді, кір жуу және тазалауға арналған кәсіптікі тазалау құралдарын, жабдықтарды, сондай-ақ мейманханалар мен мейрамханаларды толық техникалық қызмет көрсетуді ұсынамыз.",
      description2: "Өндіруші зауыттардан тікелей жеткізу арқасында біздің клиенттер ең жақсы бағалар мен сертификатталған тауарлар алады.",
      deliveryTimeValue: "1 күн",
      paymentTermsValue: "Жеткізілгеннен кейін бір апта ішінде 100% кейін төлем",
      pricesValue: "Барлық бағалар теңгеде көрсетілген, ҚҚС және Алматы қаласындағы қоймаға дейін жеткізу қосылған"
    },
    contacts: {
      weekdays: "Дүйсенбі - Жұма: 9:00 - 18:00",
      saturday: "Сенбі: демалыс",
      sunday: "Жексенбі: демалыс"
    }
  },
  en: {
    about: {
      description1: "We offer hotel cosmetics and textiles of impeccable quality, professional detergents for laundry and cleaning, equipment, and also provide complete technical maintenance of hotels and restaurants.",
      description2: "Thanks to direct supplies from manufacturers, our customers get the best prices and certified products.",
      deliveryTimeValue: "1 day",
      paymentTermsValue: "100% post-payment within a week after delivery",
      pricesValue: "All prices are indicated in tenge, including VAT and delivery to the warehouse in Almaty"
    },
    contacts: {
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
    let translations = {};
    
    if (fs.existsSync(filePath)) {
      const fileContent = fs.readFileSync(filePath, 'utf8');
      translations = JSON.parse(fileContent);
    }
    
    // Добавляем недостающие переводы
    Object.keys(missingTranslations[lang]).forEach(category => {
      if (!translations[category]) translations[category] = {};
      Object.keys(missingTranslations[lang][category]).forEach(key => {
        translations[category][key] = missingTranslations[lang][category][key];
      });
    });
    
    fs.writeFileSync(filePath, JSON.stringify(translations, null, 2));
    console.log(`✅ Исправлены переводы: public/locales/${lang}/translation.json`);
    
  } catch (error) {
    console.log(`❌ Ошибка с файлом ${filePath}:`, error.message);
  }
});

console.log('🎉 Недостающие переводы добавлены!');