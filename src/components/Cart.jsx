import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ShoppingCart, X, Plus, Minus, Trash2 } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';


const Cart = () => {
  const { t } = useTranslation();
  const [qtyDraft, setQtyDraft] = useState({});
  const { 
    cartItems, 
    updateQuantity, 
    removeFromCart, 
    getCartTotal, 
    getCartItemsCount, 
    clearCart,
    isOpen,
    setIsOpen 
  } = useCart();
  const navigate = useNavigate();

  console.log('🛒 Cart Component: Rendering with isOpen =', isOpen, 'items count =', cartItems.length);

  useEffect(() => {
  const previousOverflow = document.body.style.overflow;

  if (isOpen) {
    console.log('🛒 Cart: Disabling body scroll');
    document.body.style.overflow = 'hidden';
  } else {
    console.log('🛒 Cart: Re-enabling body scroll');
    document.body.style.overflow = '';
  }

  return () => {
    console.log('🛒 Cart: Cleanup restoring previous body scroll');
    document.body.style.overflow = previousOverflow;
  };
}, [isOpen]);

  const formatPrice = (price) => {
    const numPrice = parseFloat(price.replace(/[^\d.]/g, ''));
    return numPrice.toLocaleString('ru-RU') + ' ₸';
  };

  const handleCheckout = () => {
    console.log('🛒 Cart: Checkout clicked');
    setIsOpen(false);
    navigate('/checkout');
  };

  const handleClose = () => {
    console.log('🛒 Cart: Close button clicked');
    setIsOpen(false);
  };

  const handleBackdropClick = (e) => {
    console.log('🛒 Cart: Backdrop clicked');
    if (e.target === e.currentTarget) {
      setIsOpen(false);
    }
  };

  const handleModalClick = (e) => {
    console.log('🛒 Cart: Modal content clicked');
    e.stopPropagation();
  };

  if (!isOpen) {
    console.log('🛒 Cart: Not rendering because isOpen is false');
    return null;
  }

  console.log('🛒 Cart: Rendering modal portal to document.body');

  return createPortal((
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4"
      onClick={handleBackdropClick}
    >
      <div 
        className="bg-white dark:bg-gray-900 rounded-lg w-full max-w-md max-h-[90vh] flex flex-col shadow-xl border border-gray-200 dark:border-gray-700"
        onClick={handleModalClick}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t('cart.title')} ({getCartItemsCount()})
          </h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors text-gray-600 dark:text-gray-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {cartItems.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <ShoppingCart className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
              <p className="text-lg dark:text-gray-300">{t('cart.empty')}</p>
              <p className="text-sm dark:text-gray-400">{t('cart.emptyDescription')}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map(item => (
                <div key={item.id} className="flex items-center space-x-4 p-4 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800">
                  <img
                    src={item.image || 'https://via.placeholder.com/100x100?text=No+Image'}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-lg"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/100x100?text=No+Image';
                    }}
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white">{item.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{formatPrice(item.price)}</p>

                    <div className="flex items-center space-x-2 mt-2">
                      <button
                        onClick={() => {
                          console.log('🛒 Cart: Decrease quantity for', item.name);
                          updateQuantity(item.id, item.quantity - 50);
                        }}
                        className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors text-gray-600 dark:text-gray-400"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <input
                        type="number"
                        min={50}
                        inputMode="numeric"
                        value={qtyDraft[item.id] ?? item.quantity}
                        onChange={(e) => {
                          const value = e.target.value;
                          console.log('🛒 Cart: Input changed for', item.name, 'value:', value);
                          setQtyDraft(prev => ({ ...prev, [item.id]: value }));
                          updateQuantity(item.id, value);
                        }}
                        onBlur={() => {
                          const val = qtyDraft[item.id] ?? item.quantity;
                          console.log('🛒 Cart: Input blurred for', item.name, 'final value:', val);
                          updateQuantity(item.id, val);
                          setQtyDraft(prev => { const p = { ...prev }; delete p[item.id]; return p; });
                        }}
                        className="w-24 text-center border border-gray-300 dark:border-gray-600 rounded-md py-1 no-number-spin bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                      <button
                        onClick={() => {
                          console.log('🛒 Cart: Increase quantity for', item.name);
                          updateQuantity(item.id, item.quantity + 50);
                        }}
                        className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors text-gray-600 dark:text-gray-400"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          console.log('🛒 Cart: Remove item', item.name);
                          removeFromCart(item.id);
                        }}
                        className="p-1 hover:bg-red-100 dark:hover:bg-red-900 text-red-600 dark:text-red-400 rounded-full transition-colors ml-2"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="border-t border-gray-200 dark:border-gray-700 p-6 space-y-4">
            <div className="flex justify-between items-center text-lg font-semibold">
              <span className="text-gray-900 dark:text-white">{t('cart.total')}</span>
              <span className="text-blue-600 dark:text-blue-400">
                {getCartTotal().toLocaleString('ru-RU')} ₸
              </span>
            </div>

            <div className="space-y-2">
              <button
                onClick={handleCheckout}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                {t('cart.checkout')}
              </button>
              <button
                onClick={() => {
                  console.log('🛒 Cart: Clear cart clicked');
                  clearCart();
                }}
                className="w-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                {t('cart.clearCart')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  ), document.body);
};

export default Cart;