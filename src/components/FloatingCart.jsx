import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../contexts/CartContext';

const FloatingCart = () => {
  const { setIsOpen, getCartItemsCount } = useCart();

  const handleClick = () => {
    console.log('🛒 FloatingCart button clicked!');
    console.log('🛒 Calling setIsOpen(true)');
    setIsOpen(true);
  };

  console.log('🛒 FloatingCart rendering, count:', getCartItemsCount());

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={handleClick}
        className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-110 group relative animate-bounce-gentle"
      >
        <ShoppingCart className="w-6 h-6" />
        {getCartItemsCount() > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center animate-pulse">
            {getCartItemsCount()}
          </span>
        )}
      </button>
    </div>
  );
};

export default FloatingCart;