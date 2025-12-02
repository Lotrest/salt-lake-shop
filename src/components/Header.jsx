import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { User, LogOut, Menu, X, Sun, Moon } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useTranslation } from "react-i18next";
import { useTheme } from "../contexts/ThemeContext";
import AuthModal from "./AuthModal";
import Cart from "./Cart";
import LanguageSwitcher from "./LanguageSwitcher";
import { useCart } from "../contexts/CartContext";

const Header = () => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const { clearCart } = useCart();
  const { t } = useTranslation();
  const { isDark, toggleTheme } = useTheme();

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const headerRef = useRef(null);
  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const setVar = () =>
      document.documentElement.style.setProperty("--nav-h", `${el.offsetHeight}px`);
    setVar();
    const ro = new ResizeObserver(setVar);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const isActive = (path) => location.pathname === path;

  const handleAuthClick = () => {
    if (user) {
      clearCart();
      logout();
    } else {
      setIsAuthModalOpen(true);
    }
  };

  return (
    <>
      <header
        ref={headerRef}
        className="sticky top-0 z-40 border-b-0 shadow-none 
             bg-[rgba(15,23,42,0.6)] dark:bg-[rgba(0,0,0,0.6)] 
             backdrop-blur-md backdrop-saturate-150 
             supports-[backdrop-filter]:bg-[rgba(255,255,255,0.05)] 
             dark:supports-[backdrop-filter]:bg-[rgba(0,0,0,0.4)] 
             transition-all duration-300"
             >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* === ЛОГО === */}
            <Link to="/" className="flex items-center gap-2">
              <img
  src="/images/logo.png"
  alt="Salt Lake"
  className="h-10 sm:h-12 w-auto"
/>
              <span className="text-xl sm:text-2xl font-bold text-blue-600 dark:text-blue-400">
                Salt Lake
              </span>
            </Link>

            {/* === НАВИГАЦИЯ === */}
            <nav className="hidden md:flex space-x-8">
              {[
                { to: "/", label: t("header.nav.home") },
                { to: "/catalog", label: t("header.nav.catalog") },
                { to: "/news", label: t("header.nav.news") },
                { to: "/about", label: t("header.nav.about") },
                { to: "/contacts", label: t("header.nav.contacts") },
              ].map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`px-3 py-2 text-sm font-medium ${
                    isActive(item.to)
                      ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
                      : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* === КНОПКИ СПРАВА === */}
            <div className="hidden md:flex items-center space-x-4">
              <LanguageSwitcher />
              <button
                onClick={toggleTheme}
                className="p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                title={isDark ? t("header.theme.light") : t("header.theme.dark")}
              >
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <Cart />
              {user ? (
                <div className="flex items-center space-x-3">
                  <Link
                    to={user.role === "admin" ? "/admin" : "/profile"}
                    className="inline-flex items-center text-sm text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    <User className="w-4 h-4 mr-1" />
                    <span>
                      {user.role === "admin" ? t("header.admin") : t("header.profile")}
                    </span>
                  </Link>
                  <span className="hidden lg:inline text-sm text-gray-500 dark:text-gray-400">
                    {user.name}
                  </span>
                  <button
                    onClick={handleAuthClick}
                    className="p-2 text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                    title={t("header.nav.logout")}
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleAuthClick}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  {t("header.nav.login")}
                </button>
              )}
            </div>

            {/* === МОБИЛЬНОЕ МЕНЮ === */}
            <button
              onClick={() => setIsMobileMenuOpen((s) => !s)}
              className="md:hidden p-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* === МОБИЛЬНОЕ ВЫПАДАЮЩЕЕ МЕНЮ === */}
          {isMobileMenuOpen && (
            <div className="md:hidden border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 py-4">
              <nav className="flex flex-col space-y-4 px-4">
                <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>
                  {t("header.nav.home")}
                </Link>
                <Link to="/catalog" onClick={() => setIsMobileMenuOpen(false)}>
                  {t("header.nav.catalog")}
                </Link>
                <Link to="/news" onClick={() => setIsMobileMenuOpen(false)}>
                  {t("header.nav.news")}
                </Link>
                <Link to="/about" onClick={() => setIsMobileMenuOpen(false)}>
                  {t("header.nav.about")}
                </Link>
                <Link to="/contacts" onClick={() => setIsMobileMenuOpen(false)}>
                  {t("header.nav.contacts")}
                </Link>
              </nav>

              <div className="mt-4 flex items-center justify-between px-4">
                <LanguageSwitcher />
                <button
                  onClick={toggleTheme}
                  className="p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                  title={isDark ? t("header.theme.light") : t("header.theme.dark")}
                >
                  {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>
              </div>

              <div className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-4 px-4 flex flex-col space-y-3">
                <Cart />
                {user ? (
                  <div className="flex items-center justify-between">
                    <Link
                      to={user.role === "admin" ? "/admin" : "/profile"}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="inline-flex items-center text-sm text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                    >
                      <User className="w-4 h-4 mr-1" />
                      <span>
                        {user.role === "admin" ? t("header.admin") : t("header.profile")}
                      </span>
                    </Link>
                    <button
                      onClick={handleAuthClick}
                      className="p-2 text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                    >
                      <LogOut className="w-5 h-5" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleAuthClick}
                    className="w-full bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
                  >
                    {t("header.nav.login")}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* фикс дефолтной высоты переменной */}
      <style>{`
        :root {
          --nav-h: 64px;
        }
      `}</style>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </>
  );
};

export default Header;
