// src/App.jsx
import React, { Suspense, useEffect } from "react";
import "./i18n";
import "./App.css";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import { ThemeProvider } from "./contexts/ThemeContext";

import Header from "./components/Header";
import FloatingCart from "./components/FloatingCart";
import Cart from "./components/Cart";
import ScrollToTop from "./components/ScrollToTop";
import ChatWidget from "./components/ChatWidget";

import HomePage from "./pages/HomePage";
import CatalogPage from "./pages/CatalogPage";
import AboutPage from "./pages/AboutPage";
import ContactsPage from "./pages/ContactsPage";
import CheckoutPage from "./pages/CheckoutPage";
import ProfilePage from "./pages/ProfilePage";
import AdminPage from "./pages/AdminPage";
import NewsPage from "./pages/NewsPage";
import CustomLogoLanding from "./pages/CustomLogoLanding";
import LogoEditor from "./pages/LogoEditor";

import { useTranslation } from "react-i18next";

/* 🧩 Глобальный фикс скролла при навигации */
function ScrollUnlocker() {
  const location = useLocation();
  useEffect(() => {
    document.body.style.overflow = ""; // восстанавливает скролл при каждой смене страницы
  }, [location]);
  return null;
}

function App() {
  const { i18n } = useTranslation();

  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <Suspense fallback={<div className="text-center py-10">Loading...</div>}>
            <BrowserRouter>
              {/* === Фиксы === */}
              <ScrollToTop />
              <ScrollUnlocker /> {/* 👈 добавляем сюда */}
              
              <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300 flex flex-col">
                <Header />

                <main className="flex-grow">
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/catalog" element={<CatalogPage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/contacts" element={<ContactsPage />} />
                    <Route path="/checkout" element={<CheckoutPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/admin" element={<AdminPage />} />
                    <Route path="/news" element={<NewsPage />} />
                    <Route path="/custom-logo" element={<CustomLogoLanding />} />
                    <Route path="/logo-editor" element={<LogoEditor />} />
                  </Routes>
                </main>

                <FloatingCart />
                <Cart />
                <ChatWidget />
              </div>
            </BrowserRouter>
          </Suspense>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
