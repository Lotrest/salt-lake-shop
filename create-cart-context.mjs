import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Проверяем CartContext.jsx...');

const cartContextPath = path.join(__dirname, 'src', 'contexts', 'CartContext.jsx');

const cartContextContent = `import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    // Загружаем корзину из localStorage при инициализации
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
  }, []);

  useEffect(() => {
    // Сохраняем корзину в localStorage при изменении
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const MIN_QTY = 50;
  const STEP_QTY = 50;

  const addToCart = (product) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);

      if (existingItem) {
        // Если товар уже есть в корзине, увеличиваем количество
        return prevItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: Math.max(MIN_QTY, item.quantity + STEP_QTY) }
            : item
        );
      } else {
        // Если товара нет в корзине, добавляем его
        return [...prevItems, { ...product, quantity: MIN_QTY }];
      }
    });
  };

  const removeFromCart = (productId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    const MIN_QTY = 50;
    const parsed = Number.isNaN(Number(newQuantity)) ? MIN_QTY : Math.floor(Number(newQuantity));
    const safeQty = Math.max(MIN_QTY, parsed);

    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === productId
          ? { ...item, quantity: safeQty }
          : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = parseFloat(item.price.replace(/[^\\\\d]/g, ''));
      return total + (price * item.quantity);
    }, 0);
  };

  const getCartItemsCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemsCount
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};`;

// Создаем файл если его нет
if (!fs.existsSync(cartContextPath)) {
  fs.writeFileSync(cartContextPath, cartContextContent);
  console.log('✅ CartContext.jsx создан!');
} else {
  console.log('✅ CartContext.jsx уже существует');
}