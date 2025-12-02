import React, { createContext, useContext, useState, useEffect } from 'react';

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
  const [isOpen, setIsOpen] = useState(false);

  // Загрузка из localStorage
  useEffect(() => {
    try {
      console.log('🛒 CartProvider: Loading cart from localStorage');
      const storedCart = localStorage.getItem('cart');
      if (storedCart) {
        const parsedCart = JSON.parse(storedCart);
        if (Array.isArray(parsedCart)) {
          setCartItems(parsedCart);
          console.log('🛒 CartProvider: Loaded', parsedCart.length, 'items from localStorage');
        }
      }
    } catch (error) {
      console.error('🛒 CartProvider: Error loading cart:', error);
      setCartItems([]);
    }
  }, []);

  // Сохранение в localStorage
  useEffect(() => {
    try {
      console.log('🛒 CartProvider: Saving cart to localStorage, items:', cartItems.length);
      localStorage.setItem('cart', JSON.stringify(cartItems));
    } catch (error) {
      console.error('🛒 CartProvider: Error saving cart:', error);
    }
  }, [cartItems]);

  const addToCart = (product) => {
    console.log('🛒 addToCart: Adding product:', product.name);
    
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      
      if (existingItem) {
        const newItems = prevItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 50 }
            : item
        );
        console.log('🛒 addToCart: Updated existing item, new quantity:', existingItem.quantity + 50);
        return newItems;
      } else {
        const newItem = { 
          ...product, 
          quantity: 50,
          id: product.id || String(Math.random()),
          image: product.image || product.images?.[0]?.url || 'https://via.placeholder.com/100x100?text=No+Image'
        };
        const newItems = [...prevItems, newItem];
        console.log('🛒 addToCart: Added new item, total items:', newItems.length);
        return newItems;
      }
    });
  };

  const removeFromCart = (productId) => {
    console.log('🛒 removeFromCart: Removing product ID:', productId);
    setCartItems(prevItems => {
      const newItems = prevItems.filter(item => item.id !== productId);
      console.log('🛒 removeFromCart: Removed item, remaining items:', newItems.length);
      return newItems;
    });
  };

  const updateQuantity = (productId, newQuantity) => {
    const quantity = Math.max(50, parseInt(newQuantity) || 50);
    console.log('🛒 updateQuantity: Product ID:', productId, 'New quantity:', quantity);
    
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === productId
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    console.log('🛒 clearCart: Clearing all items');
    setCartItems([]);
  };

  const getCartTotal = () => {
    const total = cartItems.reduce((total, item) => {
      try {
        const price = parseFloat(String(item.price).replace(/[^\d.]/g, '')) || 0;
        return total + (price * item.quantity);
      } catch {
        return total;
      }
    }, 0);
    console.log('🛒 getCartTotal: Total:', total);
    return total;
  };

  const getCartItemsCount = () => {
    const count = cartItems.reduce((total, item) => total + item.quantity, 0);
    console.log('🛒 getCartItemsCount: Count:', count);
    return count;
  };

  const setIsOpenWithLog = (value) => {
    console.log('🛒 setIsOpen: Setting isOpen to:', value);
    setIsOpen(value);
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemsCount,
    isOpen,
    setIsOpen: setIsOpenWithLog
  };

  console.log('🛒 CartProvider: Rendering with isOpen:', isOpen, 'items:', cartItems.length);

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};