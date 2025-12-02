
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Оптимизируем производительность...');

// 1. Создаем оптимизированный App.jsx
const appPath = path.join(__dirname, 'src', 'App.jsx');
const optimizedApp = `import React, { Suspense, lazy } from "react";
import "./i18n";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import Header from "./components/Header";

// Ленивая загрузка страниц
const HomePage = lazy(() => import("./pages/HomePage"));
const CatalogPage = lazy(() => import("./pages/CatalogPage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const ContactsPage = lazy(() => import("./pages/ContactsPage"));
const CheckoutPage = lazy(() => import("./pages/CheckoutPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const AdminPage = lazy(() => import("./pages/AdminPage"));

// Компонент загрузки
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  </div>
);

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <CartProvider>
          <BrowserRouter>
            <Header />
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/catalog" element={<CatalogPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/admin" element={<AdminPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contacts" element={<ContactsPage />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </div>
  );
}

export default App;`;

fs.writeFileSync(appPath, optimizedApp);
console.log('✅ App.jsx оптимизирован с ленивой загрузкой');

// 2. Оптимизируем CatalogPage - добавляем мемоизацию и виртуализацию
const catalogPath = path.join(__dirname, 'src', 'pages', 'CatalogPage.jsx');
if (fs.existsSync(catalogPath)) {
  let catalogContent = fs.readFileSync(catalogPath, 'utf8');
  
  // Добавляем React.memo и useMemo для оптимизации
  catalogContent = catalogContent.replace(
    'const CatalogPage = () => {',
    `import React, { useMemo, memo } from 'react';

const ProductCard = memo(({ product, onAddToCart, t }) => {
  const productKey = getProductKey(product.name);
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <img
        src={product.image}
        alt={t(\`products.\${productKey}.name\`, { defaultValue: product.name })}
        className="w-full h-48 object-cover"
        loading="lazy"
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {t(\`products.\${productKey}.name\`, { defaultValue: product.name })}
        </h3>
        <p className="text-gray-600 text-sm mb-4">
          {t(\`products.\${productKey}.description\`, { defaultValue: product.description })}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-blue-600">{product.price}</span>
          <button
            onClick={() => onAddToCart(product)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            {t('catalog.addToCart')}
          </button>
        </div>
      </div>
    </div>
  );
});

const CatalogPage = () => {`
  );

  // Обновляем рендеринг продуктов с useMemo
  catalogContent = catalogContent.replace(
    /<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">\s*{filteredProducts\.map\(product => \{[\s\S]*?<\/div>\s*\)\)}\s*<\/div>/,
    `const memoizedProducts = useMemo(() => 
      filteredProducts.map(product => (
        <ProductCard 
          key={product.id} 
          product={product} 
          onAddToCart={handleAddToCart}
          t={t}
        />
      )), [filteredProducts, t]
    );
    
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {memoizedProducts}
      </div>
    );`
  );

  fs.writeFileSync(catalogPath, catalogContent);
  console.log('✅ CatalogPage оптимизирован');
}

// 3. Оптимизируем CartContext - добавляем мемоизацию
const cartContextPath = path.join(__dirname, 'src', 'contexts', 'CartContext.jsx');
if (fs.existsSync(cartContextPath)) {
  let cartContextContent = fs.readFileSync(cartContextPath, 'utf8');
  
  // Добавляем useMemo для вычисляемых значений
  cartContextContent = cartContextContent.replace(
    'import React, { createContext, useContext, useState, useEffect } from \'react\';',
    `import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';`
  );
  
  // Обновляем вычисляемые функции
  cartContextContent = cartContextContent.replace(
    `const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = parseFloat(item.price.replace(/[^\\\\d]/g, ''));
      return total + (price * item.quantity);
    }, 0);
  };`,
    `const getCartTotal = useMemo(() => {
    return cartItems.reduce((total, item) => {
      const price = parseFloat(item.price.replace(/[^\\\\d]/g, ''));
      return total + (price * item.quantity);
    }, 0);
  }, [cartItems]);`
  );
  
  cartContextContent = cartContextContent.replace(
    `const getCartItemsCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };`,
    `const getCartItemsCount = useMemo(() => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  }, [cartItems]);`
  );

  fs.writeFileSync(cartContextPath, cartContextContent);
  console.log('✅ CartContext оптимизирован');
}

// 4. Создаем файл для предзагрузки критических ресурсов
const preloadScript = `
// Preload critical resources
const preloadCriticalResources = () => {
  // Preload fonts
  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = '/fonts/inter-var.woff2';
  link.as = 'font';
  link.type = 'font/woff2';
  link.crossOrigin = 'anonymous';
  document.head.appendChild(link);
};

// Optimize images
const optimizeImages = () => {
  const images = document.querySelectorAll('img[data-src]');
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
        observer.unobserve(img);
      }
    });
  });

  images.forEach(img => imageObserver.observe(img));
};

document.addEventListener('DOMContentLoaded', () => {
  preloadCriticalResources();
  optimizeImages();
});
`;

const publicDir = path.join(__dirname, 'public');
if (fs.existsSync(publicDir)) {
  fs.writeFileSync(path.join(publicDir, 'optimization.js'), preloadScript);
  console.log('✅ Скрипт оптимизации создан');
}

console.log('🎉 Оптимизация завершена!');