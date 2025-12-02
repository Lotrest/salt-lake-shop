// src/pages/ProfilePage.jsx
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import { ShoppingBag, Calendar, DollarSign, Package } from 'lucide-react';

const API_URL = 'https://my-backend-production-3416.up.railway.app';

const ProfilePage = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { clearCart, addToCart, updateQuantity } = useCart();
  const navigate = useNavigate();

  const [myOrders, setMyOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPageLoading, setIsPageLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      if (!user) {
        setIsLoading(false);
        setIsPageLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const res = await fetch(`${API_URL}/api/orders`, { credentials: 'include' });
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.orders)) {
            const userOrders = data.orders.filter(order => order.customer_email === user.email);
            setMyOrders(userOrders);
          } else setMyOrders([]);
        } else setMyOrders([]);
      } catch {
        setMyOrders([]);
      } finally {
        setIsLoading(false);
        setIsPageLoading(false);
      }
    };

    const timer = setTimeout(loadOrders, 800);
    return () => clearTimeout(timer);
  }, [user]);

  const handleRepeatOrder = (order) => {
    if (!order.items || !Array.isArray(order.items)) return;
    clearCart();
    order.items.forEach(item => {
      const product = {
        id: item.productId || item.id,
        name: item.name,
        price: item.price,
        image: item.image,
        category: ''
      };
      addToCart(product);
      if (item.quantity) updateQuantity(product.id, item.quantity);
    });
    navigate('/checkout');
  };

  const formatPrice = (price) => {
    if (typeof price === 'number') return price.toLocaleString('ru-RU') + ' ₸';
    return String(price || '0');
  };

  if (isPageLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <LoadingSpinner size="large" text={t('profile.loadingProfile')} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            {t('profile.title')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">{t('profile.manageYourAccount')}</p>
        </div>

        {!user ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 text-center">
            <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {t('profile.accessDenied')}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">{t('profile.loginToView')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Личная информация */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  {t('profile.personalData')}
                </h2>
                <div className="space-y-4">
                  <div>
                    <div className="text-gray-500 dark:text-gray-400 text-sm mb-1">
                      {t('auth.name')}
                    </div>
                    <div className="font-medium text-gray-900 dark:text-white">{user.name}</div>
                  </div>
                  <div>
                    <div className="text-gray-500 dark:text-gray-400 text-sm mb-1">
                      {t('auth.email')}
                    </div>
                    <div className="font-medium text-gray-900 dark:text-white">{user.email}</div>
                  </div>
                  {user.phone && (
                    <div>
                      <div className="text-gray-500 dark:text-gray-400 text-sm mb-1">
                        {t('auth.phone')}
                      </div>
                      <div className="font-medium text-gray-900 dark:text-white">{user.phone}</div>
                    </div>
                  )}
                  <div>
                    <div className="text-gray-500 dark:text-gray-400 text-sm mb-1">
                      {t('profile.role')}
                    </div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          user.role === 'admin'
                            ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                            : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                        }`}
                      >
                        {user.role}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* История заказов */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {t('profile.orderHistory')}
                  </h2>
                  <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                    <ShoppingBag className="w-4 h-4" />
                    <span>
                      {myOrders.length} {t('profile.orders')}
                    </span>
                  </div>
                </div>

                {isLoading ? (
                  <LoadingSpinner size="medium" text={t('profile.loadingOrders')} />
                ) : myOrders.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Package className="w-12 h-12 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {t('profile.noOrders')}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      {t('profile.noOrdersDescription')}
                    </p>
                    <button
                      onClick={() => navigate('/catalog')}
                      className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      {t('home.startShopping')}
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {myOrders.map((order, index) => (
                      <div
                        key={order.id || order.order_number || index}
                        className="border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:shadow-md transition-shadow"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
                          <div>
                            <div className="flex items-center space-x-2 mb-2">
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                {t('profile.orderNumber')} {order.order_number}
                              </h3>
                              <span
                                className={`px-2 py-1 rounded-full text-xs ${
                                  order.status === 'completed'
                                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                }`}
                              >
                                {order.status || t('profile.processing')}
                              </span>
                            </div>
                            <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                              <div className="flex items-center space-x-1">
                                <Calendar className="w-4 h-4" />
                                <span>
                                  {new Date(order.created_at || Date.now()).toLocaleDateString(
                                    'ru-RU'
                                  )}
                                </span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <DollarSign className="w-4 h-4" />
                                <span className="font-semibold">
                                  {formatPrice(order.total_amount)}
                                </span>
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={() => handleRepeatOrder(order)}
                            className="mt-3 sm:mt-0 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                          >
                            {t('profile.repeatOrder')}
                          </button>
                        </div>

                        {order.items && order.items.length > 0 && (
                          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                            <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                              {t('profile.orderItems')} ({order.items.length})
                            </h4>
                            <div className="space-y-3">
                              {order.items.map((item, itemIndex) => (
                                <div
                                  key={item.id || itemIndex}
                                  className="flex items-center space-x-3 bg-gray-50 dark:bg-gray-700 rounded-lg p-3"
                                >
                                  <img
                                    src={
                                      item.image ||
                                      'https://via.placeholder.com/60x60?text=No+Image'
                                    }
                                    alt={item.name}
                                    className="w-12 h-12 object-cover rounded-lg"
                                  />
                                  <div className="flex-1">
                                    <div className="font-medium text-gray-900 dark:text-white">
                                      {item.name}
                                    </div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400">
                                      {formatPrice(item.price)} × {item.quantity} {t('profile.pcs')}
                                    </div>
                                  </div>
                                  <div className="font-semibold text-gray-900 dark:text-white">
                                    {formatPrice(
                                      (parseInt(item.price.replace(/[^\d]/g, '') || 0) *
                                        item.quantity)
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Информация о доставке */}
                        <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <div className="text-gray-500 dark:text-gray-400 mb-1">
                                {t('checkout.deliveryAddress')}
                              </div>
                              <div className="text-gray-900 dark:text-white">
                                {order.customer_city}, {order.customer_address}
                              </div>
                            </div>
                            <div>
                              <div className="text-gray-500 dark:text-gray-400 mb-1">
                                {t('checkout.paymentMethod')}
                              </div>
                              <div className="text-gray-900 dark:text-white">
                                {order.payment_method === 'card'
                                  ? t('checkout.card')
                                  : t('checkout.cash')}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
