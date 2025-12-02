// src/i18n.js
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import Backend from "i18next-http-backend";

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    // 🟢 Делаем английский языком по умолчанию
    fallbackLng: "en",
    supportedLngs: ["ru", "en", "kk"],
    debug: false,

    backend: {
      loadPath: `${import.meta.env.BASE_URL}locales/{{lng}}/translation.json`,
    },

    detection: {
      // 🧭 порядок определения языка
      order: ["localStorage", "cookie", "querystring", "navigator", "htmlTag"],
      caches: ["localStorage", "cookie"],
      lookupLocalStorage: "i18nextLng",
    },

    interpolation: { escapeValue: false },
    returnEmptyString: false,
  });

// ✅ Добавляем pluralization-правила после инициализации
i18n.on("initialized", () => {
  if (i18n.services?.pluralResolver) {
    console.log("✅ pluralResolver готов — добавляем языковые правила");

    // 🇷🇺 Русский язык
    i18n.services.pluralResolver.addRule("ru", {
      numbers: [1, 2, 5],
      plurals: function (n) {
        const n10 = n % 10;
        const n100 = n % 100;
        if (n10 === 1 && n100 !== 11) return 0;
        if (n10 >= 2 && n10 <= 4 && (n100 < 10 || n100 >= 20)) return 1;
        return 2;
      },
    });

    // 🇬🇧 Английский язык
    i18n.services.pluralResolver.addRule("en", {
      numbers: [1, 2],
      plurals: function (n) {
        return n === 1 ? 0 : 1;
      },
    });

    // 🇰🇿 Казахский язык
    i18n.services.pluralResolver.addRule("kk", {
      numbers: [1],
      plurals: function () {
        return 0;
      },
    });
  } else {
    console.warn("⚠️ pluralResolver недоступен — пропущено добавление правил");
  }
});

// ✅ Обновляем <html lang="..."> при смене языка
i18n.on("languageChanged", (lng) => {
  if (typeof document !== "undefined") {
    document.documentElement.lang = lng;
  }
});

// ✅ Устанавливаем английский как дефолт при первом визите
if (!localStorage.getItem("i18nextLng")) {
  const userLang =
    navigator.language && ["ru", "en", "kk"].includes(navigator.language)
      ? navigator.language
      : "en"; // 🟢 было "ru", теперь "en"
  i18n.changeLanguage(userLang);
}

export default i18n;
