import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';

const CheckoutPage = () => {
  const { t } = useTranslation();
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    company: '',
    address: '',
    city: t('checkout.defaultCity'),
    notes: '',
    payment_method: 'cash'
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [isPageLoading, setIsPageLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsPageLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const formatPrice = (price) => {
    const numPrice = parseFloat(price.replace(/[^\d]/g, ''));
    return numPrice.toLocaleString('ru-RU') + ' ₸';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert(t('checkout.loginRequired'));
      navigate('/');
      return;
    }
    setIsProcessing(true);

    const payload = {
      customer_name: formData.name,
      customer_email: user?.email || null,
      customer_phone: formData.phone,
      customer_company: formData.company || null,
      customer_address: formData.address,
      customer_city: formData.city,
      notes: formData.notes || null,
      items: cartItems.map((item) => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        image: item.image || null,
        designId: item.designId || null,
      })),
      total_amount: getCartTotal(),
      payment_method: formData.payment_method,
    };

    try {
      const API =
        import.meta.env.VITE_API_BASE ||
        'https://my-backend-production-3416.up.railway.app';
      const res = await fetch(`${API}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(t('checkout.orderError'));

      const data = await res.json();
      setOrderNumber(data.order_number || 'SL-' + Date.now().toString().slice(-6));
      setOrderComplete(true);
      clearCart();

      const ordersRaw = localStorage.getItem('orders');
      const orders = ordersRaw ? JSON.parse(ordersRaw) : [];
      orders.unshift({
        ...payload,
        order_number: data.order_number,
        created_at: new Date().toISOString(),
      });
      localStorage.setItem('orders', JSON.stringify(orders));
    } catch {
      const fallbackNumber = 'SL-' + Date.now().toString().slice(-6);
      setOrderNumber(fallbackNumber);
      setOrderComplete(true);
      clearCart();
      const ordersRaw = localStorage.getItem('orders');
      const orders = ordersRaw ? JSON.parse(ordersRaw) : [];
      orders.unshift({
        ...payload,
        order_number: fallbackNumber,
        created_at: new Date().toISOString(),
      });
      localStorage.setItem('orders', JSON.stringify(orders));
    } finally {
      setIsProcessing(false);
    }
  };

  if (isPageLoading)
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <LoadingSpinner size="large" text={t('checkout.loading')} />
      </div>
    );

  if (orderComplete)
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center border border-gray-200 dark:border-gray-700">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>

            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {t('checkout.orderComplete')}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
              {t('checkout.orderNumber')}{' '}
              <strong className="text-blue-600 dark:text-blue-400">
                #{orderNumber}
              </strong>{' '}
              {t('checkout.successMessage')}
            </p>
            <p className="text-gray-700 dark:text-gray-300 mb-6 max-w-xl mx-auto">
              {t('checkout.thankYouMessage')}
            </p>

            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-8">
              <p className="text-blue-800 dark:text-blue-300 mb-2">
                <strong>{t('checkout.nextSteps')}</strong>
              </p>
              <ul className="text-blue-700 dark:text-blue-400 text-sm space-y-1">
                <li>• {t('checkout.contactYou')}</li>
                <li>• {t('checkout.confirmDetails')}</li>
                <li>• {t('checkout.deliveryTime')}</li>
                <li>• {t('checkout.paymentTerms')}</li>
              </ul>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => navigate('/catalog')}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                {t('checkout.continueShopping')}
              </button>
              <button
                onClick={() => navigate('/')}
                className="w-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-3 px-6 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                {t('checkout.goHome')}
              </button>
            </div>
          </div>
        </div>
      </div>
    );

  if (cartItems.length === 0)
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            {t('cart.empty')}
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            {t('checkout.addProductsToCart')}
          </p>
          <button
            onClick={() => navigate('/catalog')}
            className="bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            {t('home.startShopping')}
          </button>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            {t('common.back')}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Форма заказа */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{t('checkout.title')}</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('checkout.name')} *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder={t('checkout.namePlaceholder')}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('checkout.phone')} *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder={t('checkout.phonePlaceholder')}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('checkout.company')}
                </label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder={t('checkout.companyPlaceholder')}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('checkout.city')} *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('checkout.address')} *
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder={t('checkout.addressPlaceholder')}
                  />
                </div>
              </div>

              {/* Способ оплаты */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('checkout.paymentMethod')}
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <label className={`flex items-center justify-center border rounded-lg py-2 cursor-pointer select-none transition ${
                    formData.payment_method === 'cash' 
                      ? 'border-blue-600 text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20' 
                      : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-500'
                  }`}>
                    <input
                      type="radio"
                      name="payment_method"
                      value="cash"
                      checked={formData.payment_method === 'cash'}
                      onChange={handleInputChange}
                      className="hidden"
                    />
                    {t('checkout.cash')}
                  </label>
                  <label className={`flex items-center justify-center border rounded-lg py-2 cursor-pointer select-none transition ${
                    formData.payment_method === 'card' 
                      ? 'border-blue-600 text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20' 
                      : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-500'
                  }`}>
                    <input
                      type="radio"
                      name="payment_method"
                      value="card"
                      checked={formData.payment_method === 'card'}
                      onChange={handleInputChange}
                      className="hidden"
                    />
                    {t('checkout.card')}
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('checkout.notes')}
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                  placeholder={t('checkout.notesPlaceholder')}
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {isProcessing ? t('checkout.processing') : t('checkout.placeOrder')}
              </button>
            </form>
          </div>

          {/* Сводка заказа */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 h-fit border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{t('checkout.orderDetails')}</h3>

            <div className="space-y-4 mb-6">
              {cartItems.map(item => (
                <div key={item.id} className="flex items-center space-x-3">
                  <img
                    src={item.image || 'https://via.placeholder.com/100x100?text=No+Image'}
                    alt={item.name}
                    className="w-12 h-12 object-cover rounded-lg"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/100x100?text=No+Image';
                    }}
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 dark:text-white">{item.name}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {formatPrice(item.price)} × {item.quantity}
                    </p>
                  </div>
                  <div className="font-semibold text-gray-900 dark:text-white">
                    {formatPrice((parseFloat(item.price.replace(/[^\d]/g, '')) * item.quantity).toString())}
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <div className="flex justify-between items-center text-xl font-bold">
                <span className="text-gray-900 dark:text-white">{t('cart.total')}</span>
                <span className="text-blue-600 dark:text-blue-400">
                  {getCartTotal().toLocaleString('ru-RU')} ₸
                </span>
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">{t('checkout.paymentConditions')}</h4>
              <ul className="text-blue-700 dark:text-blue-400 text-sm space-y-1">
                <li>• {t('checkout.postPayment')}</li>
                <li>• {t('checkout.delivery')}</li>
                <li>• {t('checkout.pricesIncludeVAT')}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;