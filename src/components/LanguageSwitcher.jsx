// src/components/LanguageSwitcher.jsx
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Globe, ChevronDown } from "lucide-react";

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    { code: "ru", name: "Русский", short: "RU", flag: "🇷🇺" },
    { code: "kk", name: "Қазақша", short: "ҚАЗ", flag: "🇰🇿" },
    { code: "en", name: "English", short: "EN", flag: "🇺🇸" },
  ];

  const currentLanguage =
    languages.find((lang) => lang.code === i18n.language.split("-")[0]) ||
    languages[0];

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem("i18nextLng", lng);
    document.documentElement.lang = lng;
    setIsOpen(false);
  };

  return (
    <div className="relative z-50">
      {/* Кнопка переключателя */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 text-gray-700 dark:text-gray-200 hover:text-blue-600 transition-colors rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-blue-300 min-w-[80px]"
      >
        <Globe className="w-4 h-4" />
        <span className="text-sm font-medium hidden sm:inline">
          {currentLanguage.short}
        </span>
        <span className="text-sm font-medium sm:hidden">
          {currentLanguage.flag}
        </span>
        <ChevronDown
          className={`w-4 h-4 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Выпадающее меню */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 sm:left-auto sm:right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 py-2">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => changeLanguage(lang.code)}
                className={`w-full flex items-center space-x-3 px-4 py-2 text-left transition-colors ${
                  i18n.language.startsWith(lang.code)
                    ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                    : "text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
              >
                <span className="text-lg">{lang.flag}</span>
                <div className="flex-1">
                  <div className="font-medium text-sm">{lang.name}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {lang.short}
                  </div>
                </div>
                {i18n.language.startsWith(lang.code) && (
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default LanguageSwitcher;
  