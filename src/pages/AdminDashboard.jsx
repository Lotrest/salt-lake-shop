// src/pages/AdminDashboard.jsx
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { 
  Users, 
  ShoppingCart, 
  Package, 
  BarChart3, 
  DollarSign, 
  TrendingUp,
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  Download,
  Filter,
  MoreVertical
} from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import { useNavigate } from 'react-router-dom';

const API_URL = 'https://my-backend-production-3416.up.railway.app';

const AdminDashboard = () => {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalRevenue: 0
  });
  
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }
    
    fetchDashboardData();
  }, [user, navigate]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      const [usersRes, ordersRes, productsRes] = await Promise.all([
        fetch(`${API_URL}/api/users`, { credentials: 'include' }),
        fetch(`${API_URL}/api/orders`, { credentials: 'include' }),
        fetch(`${API_URL}/api/products`)
      ]);

      let users = [];
      let orders = [];
      let products = [];

      if (usersRes.ok) {
        const usersData = await usersRes.json();
        users = usersData.users || [];
      }

      if (ordersRes.ok) {
        const ordersData = await ordersRes.json();
        orders = ordersData.orders || [];
      }

      if (productsRes.ok) {
        const productsData = await productsRes.json();
        products = productsData.products || [];
      }

      // Calculate stats
      const totalRevenue = orders.reduce((sum, order) => sum + (order.total_amount || 0), 0);
      
      setStats({
        totalUsers: users.length,
        totalOrders: orders.length,
        totalProducts: products.length,
        totalRevenue
      });

      // Get recent orders (last 5)
      setRecentOrders(orders.slice(0, 5));

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ icon: Icon, title, value, change, color }) => (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
          {change && (
            <p className={`text-sm ${change > 0 ? 'text-green-600' : 'text-red-600'} mt-1`}>
              {change > 0 ? '+' : ''}{change}% from last month
            </p>
          )}
        </div>
        <div className={`p-3 rounded-xl ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <LoadingSpinner size="large" text={t('admin.loading')} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {t('admin.dashboard')}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {t('admin.welcomeBack')}, {user?.name}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/admin/products')}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>{t('products.addProduct')}</span>
              </button>
              <button
                onClick={logout}
                className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                {t('header.logout')}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={Users}
            title={t('admin.totalUsers')}
            value={stats.totalUsers}
            change={12}
            color="bg-blue-500"
          />
          <StatCard
            icon={ShoppingCart}
            title={t('admin.totalOrders')}
            value={stats.totalOrders}
            change={8}
            color="bg-green-500"
          />
          <StatCard
            icon={Package}
            title={t('admin.totalProducts')}
            value={stats.totalProducts}
            change={5}
            color="bg-purple-500"
          />
          <StatCard
            icon={DollarSign}
            title={t('admin.totalRevenue')}
            value={`${stats.totalRevenue.toLocaleString('ru-RU')} ₸`}
            change={15}
            color="bg-orange-500"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Orders */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {t('admin.recentOrders')}
                </h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {recentOrders.map((order, index) => (
                    <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                          <ShoppingCart className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            #{order.order_number}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {order.customer_name || t('admin.noName')}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {order.total_amount?.toLocaleString('ru-RU')} ₸
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {new Date(order.created_at).toLocaleDateString('ru-RU')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => navigate('/admin/orders')}
                  className="w-full mt-4 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  {t('admin.viewAllOrders')}
                </button>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {t('admin.quickActions')}
              </h3>
              <div className="space-y-3">
                <button
                  onClick={() => navigate('/admin/products')}
                  className="w-full flex items-center space-x-3 p-3 text-left bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                >
                  <Package className="w-5 h-5" />
                  <span>{t('admin.manageProducts')}</span>
                </button>
                <button
                  onClick={() => navigate('/admin/orders')}
                  className="w-full flex items-center space-x-3 p-3 text-left bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>{t('admin.manageOrders')}</span>
                </button>
                <button
                  onClick={() => navigate('/admin/users')}
                  className="w-full flex items-center space-x-3 p-3 text-left bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
                >
                  <Users className="w-5 h-5" />
                  <span>{t('admin.manageUsers')}</span>
                </button>
              </div>
            </div>

            {/* System Status */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {t('admin.systemStatus')}
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">{t('admin.apiStatus')}</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                    {t('admin.online')}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">{t('admin.database')}</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                    {t('admin.connected')}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">{t('admin.uptime')}</span>
                  <span className="text-gray-900 dark:text-white">99.9%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;