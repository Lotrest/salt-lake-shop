import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { 
  Edit, 
  Save, 
  X, 
  Plus, 
  Trash2, 
  Search, 
  Users, 
  ShoppingCart, 
  Package, 
  BarChart3, 
  ArrowLeft,
  Filter,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  CheckCircle,
  ImagePlus 
} from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import { useNavigate } from 'react-router-dom';

const API_URL =
  import.meta.env.VITE_API_URL?.replace(/\/$/, '') ||
  'https://my-backend-production-3416.up.railway.app';

// Функция для нормализации URL изображений
const normalizeImageUrl = (url) => {
  if (!url || typeof url !== 'string') return '';
  const trimmedUrl = url.trim();
  if (!trimmedUrl) return '';
  
  // Добавляем протокол если отсутствует
  if (!trimmedUrl.startsWith('http://') && !trimmedUrl.startsWith('https://')) {
    return `https://${trimmedUrl}`;
  }
  return trimmedUrl;
};

// Функция для проверки валидности URL
const isValidUrl = (string) => {
  try {
    const url = new URL(normalizeImageUrl(string));
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch (_) {
    return false;
  }
};

const getFullUrl = (url) => {
  if (!url) return '/placeholder.png';
  if (url.startsWith('http')) return url;
  return `${API_URL}${url.startsWith('/') ? '' : '/'}${url}`;
};

// Компонент для управления изображениями
const ImageManager = ({ images, onImagesChange }) => {
  const { t } = useTranslation();
  const [imageErrors, setImageErrors] = useState({});
  const [imageLoaders, setImageLoaders] = useState({});

  const addImage = () => {
    onImagesChange([...images, '']);
  };

  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
    
    // Удаляем ошибку для удаленного изображения
    const newErrors = { ...imageErrors };
    delete newErrors[index];
    setImageErrors(newErrors);

    const newLoaders = { ...imageLoaders };
    delete newLoaders[index];
    setImageLoaders(newLoaders);
  };

  const updateImage = (index, url) => {
    const newImages = images.map((img, i) => i === index ? url : img);
    onImagesChange(newImages);
    
    // Сбрасываем ошибку при изменении URL
    if (imageErrors[index]) {
      const newErrors = { ...imageErrors };
      delete newErrors[index];
      setImageErrors(newErrors);
    }

    // Устанавливаем загрузку для нового URL
    if (url.trim() && isValidUrl(url)) {
      setImageLoaders(prev => ({ ...prev, [index]: true }));
    }
  };

  const moveImage = (fromIndex, toIndex) => {
    if (toIndex < 0 || toIndex >= images.length) return;
    
    const newImages = [...images];
    const [movedImage] = newImages.splice(fromIndex, 1);
    newImages.splice(toIndex, 0, movedImage);
    onImagesChange(newImages);
    
    // Обновляем индексы ошибок и загрузчиков
    const updateIndexes = (obj) => {
      const newObj = {};
      Object.keys(obj).forEach(key => {
        const oldIndex = parseInt(key);
        if (oldIndex === fromIndex) {
          newObj[toIndex] = obj[oldIndex];
        } else if (oldIndex > fromIndex && oldIndex <= toIndex) {
          newObj[oldIndex - 1] = obj[oldIndex];
        } else if (oldIndex < fromIndex && oldIndex >= toIndex) {
          newObj[oldIndex + 1] = obj[oldIndex];
        } else {
          newObj[oldIndex] = obj[oldIndex];
        }
      });
      return newObj;
    };

    setImageErrors(updateIndexes(imageErrors));
    setImageLoaders(updateIndexes(imageLoaders));
  };

  const handleImageError = (index) => {
    setImageErrors(prev => ({
      ...prev,
      [index]: true
    }));
    setImageLoaders(prev => ({
      ...prev,
      [index]: false
    }));
  };

  const handleImageLoad = (index) => {
    setImageErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[index];
      return newErrors;
    });
    setImageLoaders(prev => ({
      ...prev,
      [index]: false
    }));
  };

  const validateImageUrl = (url) => {
    if (!url.trim()) {
      return { isValid: false, message: t('admin.imageManager.errors.emptyUrl') };
    }
    if (!isValidUrl(url)) {
      return { isValid: false, message: t('admin.imageManager.errors.invalidUrl') };
    }
    return { isValid: true, message: '' };
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">
        {t('admin.imageManager.title')}
      </label>
      
      {images.map((url, index) => {
        const validation = validateImageUrl(url);
        const hasError = imageErrors[index] || !validation.isValid;
        const isLoading = imageLoaders[index];
        
        return (
          <div key={index} className="flex items-center gap-3 p-3 border rounded-lg bg-gray-50">
            <div className="flex items-center gap-2 text-gray-400">
              <button 
                type="button"
                onClick={() => moveImage(index, index - 1)}
                disabled={index === 0}
                className="p-1 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                ↑
              </button>
              <button 
                type="button"
                onClick={() => moveImage(index, index + 1)}
                disabled={index === images.length - 1}
                className="p-1 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                ↓
              </button>
            </div>
            
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  value={url}
                  onChange={(e) => updateImage(index, e.target.value)}
                  className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none ${
                    hasError ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder={t('admin.imageManager.placeholder')}
                />
                {!validation.isValid && url.trim() && (
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                    <AlertCircle className="w-4 h-4 text-red-500" />
                  </div>
                )}
                {validation.isValid && url.trim() && !hasError && (
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  </div>
                )}
              </div>
              {!validation.isValid && url.trim() && (
                <p className="text-xs text-red-500 mt-1">{validation.message}</p>
              )}
            </div>
            
            <div className="w-16 h-16 bg-white border rounded overflow-hidden flex-shrink-0 relative">
              {url && !hasError ? (
                <>
                  {isLoading && (
                    <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                    </div>
                  )}
                  <img 
                    src={normalizeImageUrl(url)} 
                    alt={`Preview ${index + 1}`}
                    className={`w-full h-full object-cover ${isLoading ? 'opacity-0' : 'opacity-100'}`}
                    onError={() => handleImageError(index)}
                    onLoad={() => handleImageLoad(index)}
                    onLoadStart={() => setImageLoaders(prev => ({ ...prev, [index]: true }))}
                  />
                </>
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400 text-xs text-center p-1">
                  {hasError ? t('admin.imageManager.error') : t('admin.imageManager.noImage')}
                </div>
              )}
            </div>
            
            <button
              type="button"
              onClick={() => removeImage(index)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        );
      })}
      
      <button
        type="button"
        onClick={addImage}
        className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors text-sm flex items-center"
      >
        <Plus className="w-4 h-4 mr-2" />
        {t('admin.imageManager.addButton')}
      </button>
      
      <p className="text-xs text-gray-500">
        {t('admin.imageManager.helpText')}
      </p>
    </div>
  );
};

const AdminPage = () => {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null);
  const [activeTab, setActiveTab] = useState('products');
  const [backendStatus, setBackendStatus] = useState('checking');
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  
  // Состояния для фильтрации
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSubcategory, setSelectedSubcategory] = useState('all');
  const [subcategories, setSubcategories] = useState([]);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [subcategoriesOpen, setSubcategoriesOpen] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const [designs, setDesigns] = useState([]);
  // Показать уведомление
  const showNotification = (message, type = 'info') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 5000);
  };

  // Обновленный subcategoriesMap с новой структурой для косметики и минибаров
  const subcategoriesMap = { 
    textile: [ 
      { value: 'towels', label: t('admin.categories.subcategories.towels') }, 
      { value: 'slippers', label: t('admin.categories.subcategories.slippers') }, 
      { value: 'robes', label: t('admin.categories.subcategories.robes') } ,
      { value: 'pillowcases', label: t('admin.categories.subcategories.pillowcases') },
{ value: 'sheets', label: t('admin.categories.subcategories.sheets') },
{ value: 'duvet_covers', label: t('admin.categories.subcategories.duvet_covers') },
{ value: 'mattress_covers', label: t('admin.categories.subcategories.mattress_covers') },
{ value: 'double_set', label: t('admin.categories.subcategories.double_set') },
{ value: 'single_set', label: t('admin.categories.subcategories.single_set') },
{ value: 'pillows', label: t('admin.categories.subcategories.pillows') },
{ value: 'blankets', label: t('admin.categories.subcategories.blankets') },
    ], 
    accessories: [ 
      { value: 'standard', label: t('admin.categories.subcategories.standard') }, 
      { value: 'eco', label: t('admin.categories.subcategories.eco') }, 
      { value: 'shoes', label: t('admin.categories.subcategories.shoes') }, 
      { value: 'razor', label: t('admin.categories.subcategories.razor') }, 
      { value: 'cosmetic', label: t('admin.categories.subcategories.cosmetic') }, 
      { value: 'tooth', label: t('admin.categories.subcategories.tooth') },
      { value: 'lumiere_business', label: t('categories.cosmetics.items.lumiere_business') },
      { value: 'lumiere_standard', label: t('categories.cosmetics.items.lumiere_standard') },
      { value: 'lumiere_econom', label: t('categories.cosmetics.items.lumiere_econom') },
    ], 
    cosmetics: [  
  { value: 'shampoo_greenery', label: t('admin.categories.subcategories.shampoo_greenery') }, 
  { value: 'showerGel_greenery', label: t('admin.categories.subcategories.gel_greenery') }, 
  { value: 'lotion_greenery', label: t('admin.categories.subcategories.lotion_greenery') }, 
  { value: 'conditioner_greenery', label: t('admin.categories.subcategories.conditioner_greenery') },  
  { value: 'shampoo_comfort', label: t('admin.categories.subcategories.shampoo_comfort') }, 
  { value: 'showerGel_comfort', label: t('admin.categories.subcategories.gel_comfort') }, 
  { value: 'lotion_comfort', label: t('admin.categories.subcategories.lotion_comfort') }, 
  { value: 'conditioner_comfort', label: t('admin.categories.subcategories.conditioner_comfort') },  
  { value: 'shampoo_aroma', label: t('admin.categories.subcategories.shampoo_aroma') }, 
  { value: 'showerGel_aroma', label: t('admin.categories.subcategories.gel_aroma') }, 
  { value: 'lotion_aroma', label: t('admin.categories.subcategories.lotion_aroma') }, 
  { value: 'conditioner_aroma', label: t('admin.categories.subcategories.conditioner_aroma') },
  
  
   

  { value: 'allegrini_one_for_you', label: t('categories.cosmetics.items.allegrini_one_for_you') },
  { value: 'allegrini_bamboo', label: t('categories.cosmetics.items.allegrini_bamboo') },
  { value: 'allegrini_aloesir', label: t('categories.cosmetics.items.allegrini_aloesir') },
  { value: 'allegrini_acqua', label: t('categories.cosmetics.items.allegrini_acqua') },
  { value: 'allegrini_havana', label: t('categories.cosmetics.items.allegrini_havana') },
  { value: 'allegrini_natura_siberica', label: t('categories.cosmetics.items.allegrini_natura_siberica') },
  { value: 'allegrini_argan', label: t('categories.cosmetics.items.allegrini_argan') },
  { value: 'allegrini_kid_set', label: t('categories.cosmetics.items.allegrini_kid_set') },
  { value: 'allegrini_skinus', label: t('categories.cosmetics.items.allegrini_skinus') },
  { value: 'allegrini_accessories', label: t('categories.cosmetics.items.allegrini_accessories') },


  { value: 'ada_lifestyle', label: t('categories.cosmetics.items.ada_lifestyle') },
  { value: 'ada_luxury', label: t('categories.cosmetics.items.ada_luxury') },
  { value: 'ada_300ml', label: t('categories.cosmetics.items.ada_300ml') },

  { value: 'mezo_hotel_collection', label: t('categories.cosmetics.items.mezo_hotel_collection') },
  { value: 'mezo_all_for_you', label: t('categories.cosmetics.items.mezo_all_for_you') },
  { value: 'mezo_no_name', label: t('categories.cosmetics.items.mezo_no_name') },
  { value: 'mezo_lucio', label: t('categories.cosmetics.items.mezo_lucio') },
  { value: 'mezo_argana', label: t('categories.cosmetics.items.mezo_argana') },
  { value: 'mezo_amber_wood', label: t('categories.cosmetics.items.mezo_amber_wood') },
  { value: 'mezo_lavender', label: t('categories.cosmetics.items.mezo_lavender') },
  { value: 'mezo_rumah', label: t('categories.cosmetics.items.mezo_rumah') },
  { value: 'mezo_marrone', label: t('categories.cosmetics.items.mezo_marrone') },
  { value: 'mezo_basic', label: t('categories.cosmetics.items.mezo_basic') },
  { value: 'mezo_kids', label: t('categories.cosmetics.items.mezo_kids') },
  { value: 'mezo_canisters5', label: t('categories.cosmetics.items.mezo_canisters5') },
  { value: 'mezo_additional', label: t('categories.cosmetics.items.mezo_additional') },
  { value: 'mezo_wall_cosmetics', label: t('categories.cosmetics.items.mezo_wall_cosmetics') },
],
    minibars: [ 
      { value: 'accessories', label: t('admin.categories.subcategories.minibars') } 
    ],  
    custom_logo: [ 
      { value: 'robes', label: t('admin.categories.subcategories.logo_robes') }, 
      { value: 'slippers', label: t('admin.categories.subcategories.logo_slippers') }, 
      { value: 'boxes', label: t('admin.categories.subcategories.boxes') } 
    ] 
  };

  // 2.2. Добавлено dimensions в стейт нового товара
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    subcategory: '',
    brand: '',
    images: [''],
    dimensions: '' // 👈 мини-заказ (шт)
  });

  // Функция для загрузки подкатегорий
  const fetchSubcategories = async (category = 'all') => {
    try {
      const response = await fetch(`${API_URL}/api/subcategories?category=${category}`);
      if (response.ok) {
        const data = await response.json();
        setSubcategories(data.subcategories || []);
      }
    } catch (error) {
      console.error('❌ Error fetching subcategories:', error);
      setSubcategories([]);
    }
  };

  // Обработчик выбора категории
  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setSelectedSubcategory('all');
    fetchSubcategories(category);
    setCategoriesOpen(false);
  };

  // Обработчик сброса фильтров
  const clearFilters = () => {
    setSelectedCategory('all');
    setSelectedSubcategory('all');
    setQuery('');
    setCategoriesOpen(false);
    setSubcategoriesOpen(false);
    fetchSubcategories('all');
  };

  useEffect(() => {
    const checkBackend = async () => {
      try {
        const response = await fetch(`${API_URL}/api/health`);
        setBackendStatus(response.ok ? 'healthy' : 'unhealthy');
      } catch {
        setBackendStatus('unreachable');
      }
    };
    
    checkBackend();
  }, []);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }
    fetchData();
  }, [user, navigate]);

  useEffect(() => {
    if (activeTab === 'products') {
      fetchSubcategories(selectedCategory);
    }
  }, [activeTab, selectedCategory]);

  const fetchData = async () => {
  try {
    setLoading(true);
    console.log('🔄 Загрузка данных для админки...');
    
    const [ordersRes, usersRes, productsRes, designsRes] = await Promise.all([
      fetch(`${API_URL}/api/orders`, { 
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      }),
      fetch(`${API_URL}/api/users`, { 
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      }),
      fetch(`${API_URL}/api/products`),
      fetch(`${API_URL}/api/designs`) // 👈 новый запрос для логотипных дизайнов
    ]);

    let ordersData = { orders: [] };
    let usersData = { users: [] };
    let productsData = { products: [] };

    if (ordersRes.ok) {
      ordersData = await ordersRes.json();
      console.log('📦 Заказы загружены:', ordersData.orders?.length || 0);
      setOrders(ordersData.orders || []);
    }

    if (usersRes.ok) {
      usersData = await usersRes.json();
      console.log('👥 Пользователи загружены:', usersData.users?.length || 0);
      setUsers(usersData.users || []);
    }

    if (productsRes.ok) {
      productsData = await productsRes.json();
      console.log('📊 Товары загружены:', productsData.products?.length || 0);
      setProducts(productsData.products || []);
    }

    // 👇 Новый блок для загрузки дизайнов
    if (designsRes.ok) {
      const data = await designsRes.json();
      console.log('🎨 Дизайны загружены:', data.designs?.length || 0);
      setDesigns(data.designs || []);
    } else {
      console.error('❌ Ошибка загрузки дизайнов:', designsRes.status);
    }

  } catch (error) {
    console.error('❌ Ошибка загрузки данных:', error);
    showNotification(t('admin.notifications.loadError'), 'error');
  } finally {
    setLoading(false);
  }
};

  // Фильтрация товаров
  const filteredProducts = products.filter(product => {
    const matchesSearch = query === '' || 
      product.name?.toLowerCase().includes(query.toLowerCase()) ||
      product.description?.toLowerCase().includes(query.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSubcategory = selectedSubcategory === 'all' || product.subcategory === selectedSubcategory;
    
    return matchesSearch && matchesCategory && matchesSubcategory;
  });

  // Функция для добавления товара
  const handleAddProduct = async (e) => {
    e.preventDefault();
    
    // Валидация обязательных полей
    if (!newProduct.name?.trim()) {
      showNotification(t('admin.productForm.validation.name'), 'error');
      return;
    }
    
    if (!newProduct.price) {
      showNotification(t('admin.productForm.validation.price'), 'error');
      return;
    }
    
    if (!newProduct.category) {
      showNotification(t('admin.productForm.validation.category'), 'error');
      return;
    }

    // Валидация для custom_logo - dimensions обязателен
    if (newProduct.category === 'custom_logo' && !newProduct.dimensions) {
      showNotification(t('admin.productForm.validation.dimensions'), 'error');
      return;
    }

    // Валидация изображений
    const validImages = newProduct.images
      .filter(url => url.trim() !== '')
      .map(url => normalizeImageUrl(url.trim()));

    if (validImages.length === 0) {
      showNotification(t('admin.productForm.validation.images'), 'error');
      return;
    }

    // Проверка валидности URL изображений
    const invalidUrls = validImages.filter(url => !isValidUrl(url));
    if (invalidUrls.length > 0) {
      showNotification(t('admin.productForm.validation.invalidImages'), 'error');
      return;
    }

    try {
      console.log('📤 Отправка данных нового товара:', newProduct);
      
      // Очистка и подготовка данных
      const productData = {
        name: newProduct.name.trim(),
        description: newProduct.description?.trim() || '',
        price: newProduct.price.toString().trim(),
        category: newProduct.category,
        subcategory: newProduct.subcategory || '',
        brand: newProduct.brand?.trim() || null,
        images: validImages,
        // 2.5. Добавлено dimensions при отправке на сервер
        dimensions: newProduct.dimensions?.toString().trim() || '',
      };

      console.log('📤 Отправляемые данные:', productData);
      
      const response = await fetch(`${API_URL}/api/products`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(productData)
      });

      let result;
      try {
        result = await response.json();
      } catch (parseError) {
        console.error('❌ Ошибка парсинга ответа:', parseError);
        throw new Error(t('admin.notifications.parseError'));
      }

      console.log('📥 Ответ сервера:', result);
      
      if (response.ok && result.success) {
        setProducts(prev => [result.product, ...prev]);
        // Полный сброс формы
        setNewProduct({ 
          name: '', 
          description: '', 
          price: '', 
          category: '', 
          subcategory: '', 
          brand: '',
          images: [''],
          dimensions: ''
        });
        showNotification(t('admin.notifications.successAdd'), 'success');
      } else {
        const errorMessage = result.error || `Ошибка ${response.status}`;
        console.error('❌ Ошибка при добавлении товара:', errorMessage);
        showNotification(`${t('admin.notifications.addError')}: ${errorMessage}`, 'error');
      }
    } catch (error) {
      console.error('❌ Ошибка добавления товара:', error);
      showNotification(`${t('admin.notifications.addError')}: ${error.message}`, 'error');
    }
  };

  // Функция для редактирования товара
  const handleEditClick = (product) => {
    setEditingProduct(product);
    setNewProduct({
      name: product.name,
      description: product.description || '',
      price: product.price,
      category: product.category,
      subcategory: product.subcategory || '',
      brand: product.brand || '',
      // 2.3. Подтягиваем dimensions при редактировании
      dimensions: product.dimensions || '',
      images: product.images && product.images.length > 0 
        ? product.images.map(img => img.url) 
        : ['']
    });
  };

  // Функция для отмены редактирования
  const handleCancelEdit = () => {
    setEditingProduct(null);
    setNewProduct({
      name: '',
      description: '',
      price: '',
      category: '',
      subcategory: '',
      brand: '',
      images: [''],
      // 2.3. Сбрасываем dimensions
      dimensions: ''
    });
  };

  // Функция для обновления товара
  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    if (!editingProduct) {
      showNotification(t('admin.productForm.validation.noProduct'), 'error');
      return;
    }

    if (!newProduct.name?.trim()) {
      showNotification(t('admin.productForm.validation.name'), 'error');
      return;
    }
    
    if (!newProduct.price) {
      showNotification(t('admin.productForm.validation.price'), 'error');
      return;
    }
    
    if (!newProduct.category) {
      showNotification(t('admin.productForm.validation.category'), 'error');
      return;
    }

    // Валидация для custom_logo - dimensions обязателен
    if (newProduct.category === 'custom_logo' && !newProduct.dimensions) {
      showNotification(t('admin.productForm.validation.dimensions'), 'error');
      return;
    }

    // Валидация изображений
    const validImages = newProduct.images
      .filter(url => url.trim() !== '')
      .map(url => normalizeImageUrl(url.trim()));

    if (validImages.length === 0) {
      showNotification(t('admin.productForm.validation.images'), 'error');
      return;
    }

    // Проверка валидности URL изображений
    const invalidUrls = validImages.filter(url => !isValidUrl(url));
    if (invalidUrls.length > 0) {
      showNotification(t('admin.productForm.validation.invalidImages'), 'error');
      return;
    }

    try {
      console.log('🔄 Обновление товара:', editingProduct.id, newProduct);
      
      const productData = {
        name: newProduct.name.trim(),
        description: newProduct.description?.trim() || '',
        price: newProduct.price.toString().trim(),
        category: newProduct.category,
        subcategory: newProduct.subcategory || '',
        brand: newProduct.brand?.trim() || null,
        images: validImages,
        // 2.5. Добавлено dimensions при обновлении
        dimensions: newProduct.dimensions?.toString().trim() || '',
      };

      console.log('📤 Отправляемые данные:', productData);

      const response = await fetch(`${API_URL}/api/products/${editingProduct.id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(productData)
      });

      let result;
      try {
        result = await response.json();
      } catch (parseError) {
        console.error('❌ Ошибка парсинга ответа:', parseError);
        throw new Error(t('admin.notifications.parseError'));
      }

      console.log('📥 Ответ сервера при обновлении:', result);
      
      if (response.ok && result.success) {
        setProducts(prev => prev.map(p => p.id === editingProduct.id ? result.product : p));
        handleCancelEdit();
        showNotification(t('admin.notifications.successUpdate'), 'success');
      } else {
        const errorMessage = result.error || `Ошибка ${response.status}`;
        console.error('❌ Ошибка при обновлении товара:', errorMessage);
        showNotification(`${t('admin.notifications.updateError')}: ${errorMessage}`, 'error');
      }
    } catch (error) {
      console.error('❌ Ошибка обновления товара:', error);
      showNotification(`${t('admin.notifications.updateError')}: ${error.message}`, 'error');
    }
  };

  // Функция для удаления товара
  const handleDeleteProduct = async (productId) => {
    if (!confirm(t('admin.productForm.deleteConfirmation'))) {
      return;
    }

    try {
      console.log('🗑️ Удаление товара с ID:', productId);
      
      const response = await fetch(`${API_URL}/api/products/${productId}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      console.log('📥 Статус ответа при удалении:', response.status);
      
      if (response.ok) {
        setProducts(prev => prev.filter(p => p.id !== productId));
        showNotification(t('admin.notifications.successDelete'), 'success');
      } else {
        const errorData = await response.json().catch(() => ({ error: t('admin.notifications.unknownError') }));
        const errorMessage = errorData.error || `Ошибка ${response.status}`;
        console.error('❌ Ошибка при удалении товара:', errorMessage);
        showNotification(`${t('admin.notifications.deleteError')}: ${errorMessage}`, 'error');
      }
    } catch (error) {
      console.error('❌ Ошибка удаления товара:', error);
      showNotification(t('admin.notifications.deleteError'), 'error');
    }
  };

  const stats = {
    totalUsers: users.length,
    totalOrders: orders.length,
    totalProducts: products.length,
    totalRevenue: orders.reduce((sum, order) => sum + (order.total_amount || 0), 0)
  };

  const tabs = [
    { id: 'products', name: t('admin.tabs.products'), icon: Package, count: products.length },
    { id: 'designs', name: t('admin.tabs.designs'), icon: ImagePlus },
    { id: 'orders', name: t('admin.tabs.orders'), icon: ShoppingCart, count: orders.length },
    { id: 'users', name: t('admin.tabs.users'), icon: Users, count: users.length },
    { id: 'statistics', name: t('admin.tabs.statistics'), icon: BarChart3 }
  ];

  // 2.1. Категории для фильтрации с добавлением custom_logo
  const categories = [
    { id: 'all', name: t('admin.categories.all') },
    { id: 'textile', name: t('admin.categories.textile') },
    { id: 'accessories', name: t('admin.categories.accessories') },
    { id: 'cosmetics', name: t('admin.categories.cosmetics') },
    { id: 'minibars', name: t('admin.categories.minibars') },
    { id: 'custom_logo', name: t('admin.categories.custom_logo') }
  ];

  // Рендер формы товара
  const renderProductForm = () => (
    <form onSubmit={editingProduct ? handleUpdateProduct : handleAddProduct}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-3 sm:mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('admin.productForm.name')} *
          </label>
          <input
            type="text"
            value={newProduct.name}
            onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none bg-white text-gray-900"
            placeholder={t('admin.productForm.namePlaceholder')}
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('admin.productForm.category')} *
          </label>
          <select 
            value={newProduct.category}
            onChange={(e) => setNewProduct({...newProduct, category: e.target.value, subcategory: ''})}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none bg-white text-gray-900"
            required
          >
            <option value="">{t('admin.productForm.categoryPlaceholder')}</option>
            {/* 2.4.A Добавлена опция для логотипной продукции */}
            <option value="custom_logo">{t('admin.categories.custom_logo')}</option>
            <option value="textile">{t('admin.categories.textile')}</option>
            <option value="accessories">{t('admin.categories.accessories')}</option>
            <option value="cosmetics">{t('admin.categories.cosmetics')}</option>
            <option value="minibars">{t('admin.categories.minibars')}</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-3 sm:mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('admin.productForm.price')} *
          </label>
          <input
            type="text"
            value={newProduct.price}
            onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none bg-white text-gray-900"
            placeholder={t('admin.productForm.pricePlaceholder')}
            required
          />
        </div>

        {/* 2.4.B Поле минимального заказа для custom_logo */}
        {newProduct.category === 'custom_logo' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('admin.productForm.dimensions')} *
            </label>
            <input
              type="number"
              min={1}
              value={newProduct.dimensions}
              onChange={(e) => setNewProduct({ ...newProduct, dimensions: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none bg-white text-gray-900"
              placeholder={t('admin.productForm.dimensionsPlaceholder')}
              required
            />
          </div>
        )}
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('admin.productForm.subcategory')}
          </label>
          <select
            value={newProduct.subcategory}
            onChange={(e) => setNewProduct({...newProduct, subcategory: e.target.value})}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none bg-white text-gray-900"
          >
            <option value="">{t('admin.productForm.subcategoryPlaceholder')}</option>
            {newProduct.category && subcategoriesMap[newProduct.category]?.map(sub => (
              <option key={sub.value} value={sub.value}>
                {sub.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Добавленное поле для бренда */}
      <div className="mb-3 sm:mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {t('admin.productForm.brand')}
        </label>
        <input
          type="text"
          value={newProduct.brand}
          onChange={(e) => setNewProduct({...newProduct, brand: e.target.value})}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none bg-white text-gray-900"
          placeholder={t('admin.productForm.brandPlaceholder')}
        />
      </div>
      
      <div className="mb-3 sm:mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {t('admin.productForm.description')}
        </label>
        <textarea
          rows="3"
          value={newProduct.description}
          onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none bg-white text-gray-900"
          placeholder={t('admin.productForm.descriptionPlaceholder')}
        />
      </div>
      
      {/* Компонент управления изображениями */}
      <ImageManager 
        images={newProduct.images}
        onImagesChange={(images) => setNewProduct({...newProduct, images})}
      />
      
      <div className="flex flex-col sm:flex-row gap-3 mt-4">
        <button 
          type="submit"
          className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center text-sm sm:text-base"
        >
          {editingProduct ? (
            <>
              <Save className="w-4 h-4 mr-2" />
              {t('admin.productForm.saveButton')}
            </>
          ) : (
            <>
              <Plus className="w-4 h-4 mr-2" />
              {t('admin.productForm.addButton')}
            </>
          )}
        </button>
        
        {editingProduct && (
          <button 
            type="button"
            onClick={handleCancelEdit}
            className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors flex items-center justify-center text-sm sm:text-base"
          >
            <X className="w-4 h-4 mr-2" />
            {t('admin.productForm.cancelButton')}
          </button>
        )}
      </div>
    </form>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <LoadingSpinner size="large" text={t('admin.loading')} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Уведомления */}
      {notification.show && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm ${
          notification.type === 'success' ? 'bg-green-500 text-white' :
          notification.type === 'error' ? 'bg-red-500 text-white' :
          'bg-blue-500 text-white'
        }`}>
          <div className="flex items-center">
            {notification.type === 'success' && <CheckCircle className="w-5 h-5 mr-2" />}
            {notification.type === 'error' && <AlertCircle className="w-5 h-5 mr-2" />}
            <span>{notification.message}</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-4 space-y-3 sm:space-y-0">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => navigate('/')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="min-w-0 flex-1">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">{t('admin.title')}</h1>
                <p className="text-xs sm:text-sm text-gray-600 truncate">{t('admin.welcome', { name: user?.name })}</p>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <button
                onClick={fetchData}
                className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors text-xs sm:text-sm flex-1 sm:flex-none text-center min-w-[120px]"
              >
                {t('admin.refresh')}
              </button>
              <button
                onClick={logout}
                className="bg-gray-200 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-300 transition-colors text-xs sm:text-sm flex-1 sm:flex-none text-center min-w-[120px]"
              >
                {t('admin.logout')}
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 py-3 sm:py-4">
            <div className="bg-white p-3 sm:p-4 rounded-lg border shadow-sm text-center">
              <div className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-600">{stats.totalUsers}</div>
              <div className="text-xs sm:text-sm text-gray-600 truncate">{t('admin.stats.users')}</div>
            </div>
            <div className="bg-white p-3 sm:p-4 rounded-lg border shadow-sm text-center">
              <div className="text-lg sm:text-xl lg:text-2xl font-bold text-green-600">{stats.totalOrders}</div>
              <div className="text-xs sm:text-sm text-gray-600 truncate">{t('admin.stats.orders')}</div>
            </div>
            <div className="bg-white p-3 sm:p-4 rounded-lg border shadow-sm text-center">
              <div className="text-lg sm:text-xl lg:text-2xl font-bold text-purple-600">{stats.totalProducts}</div>
              <div className="text-xs sm:text-sm text-gray-600 truncate">{t('admin.stats.products')}</div>
            </div>
            <div className="bg-white p-3 sm:p-4 rounded-lg border shadow-sm text-center">
              <div className="text-lg sm:text-xl lg:text-2xl font-bold text-orange-600 truncate">
                {stats.totalRevenue.toLocaleString('ru-RU')} ₸
              </div>
              <div className="text-xs sm:text-sm text-gray-600 truncate">{t('admin.stats.revenue')}</div>
            </div>
          </div>

          {/* Mobile tabs dropdown */}
          <div className="block sm:hidden border-t pt-3">
            <select
              value={activeTab}
              onChange={(e) => setActiveTab(e.target.value)}
              className="w-full p-2 border rounded-lg bg-white text-gray-900 text-sm"
            >
              {tabs.map(tab => {
                const IconComponent = tab.icon;
                return (
                  <option key={tab.id} value={tab.id} className="text-gray-900">
                    {tab.name} {tab.count !== undefined && `(${tab.count})`}
                  </option>
                );
              })}
            </select>
          </div>

          {/* Desktop Tabs */}
          <div className="hidden sm:block border-t">
            <nav className="-mb-px flex space-x-4 lg:space-x-8 overflow-x-auto">
              {tabs.map(tab => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-1 lg:space-x-2 py-3 px-1 border-b-2 font-medium text-sm whitespace-nowrap flex-shrink-0 ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <IconComponent className="w-4 h-4" />
                    <span>{tab.name}</span>
                    {tab.count !== undefined && (
                      <span className="bg-gray-100 text-gray-900 px-1.5 py-0.5 rounded-full text-xs">
                        {tab.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
        {/* Search and Filters */}
        <div className="mb-4 sm:mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                <input
                  type="text"
                  placeholder={t('admin.search.placeholder')}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full pl-9 sm:pl-10 pr-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none bg-white text-gray-900"
                />
              </div>
            </div>

            {/* Mobile Filter Button */}
            <div className="block lg:hidden">
              <button
                onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-gray-50"
              >
                <Filter className="w-4 h-4" />
                {t('admin.filters.title')}
                {mobileFiltersOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>

            {/* Desktop Filters */}
            <div className="hidden lg:flex gap-4">
              {/* Category Filter */}
              <div className="relative">
                <button
                  onClick={() => setCategoriesOpen(!categoriesOpen)}
                  className={`flex items-center gap-2 px-4 py-2 border rounded-lg bg-white text-sm min-w-[160px] justify-between ${
                    selectedCategory !== 'all'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-gray-300 text-gray-700'
                  }`}
                >
                  <span>{categories.find(c => c.id === selectedCategory)?.name || t('admin.categories.all')}</span>
                  {categoriesOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>

                {categoriesOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                    {categories.map(category => (
                      <button
                        key={category.id}
                        onClick={() => handleCategorySelect(category.id)}
                        className={`w-full text-left px-4 py-2 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg ${
                          selectedCategory === category.id ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                        }`}
                      >
                        {category.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Subcategory Filter */}
              <div className="relative">
                <button
                  onClick={() => setSubcategoriesOpen(!subcategoriesOpen)}
                  disabled={selectedCategory === 'all' || subcategories.length === 0}
                  className={`flex items-center gap-2 px-4 py-2 border rounded-lg bg-white text-sm min-w-[160px] justify-between ${
                    selectedSubcategory !== 'all'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-gray-300 text-gray-700'
                  } ${(selectedCategory === 'all' || subcategories.length === 0) ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <span>
                    {selectedSubcategory === 'all' 
                      ? t('admin.filters.allSubcategories') 
                      : subcategories.find(s => s === selectedSubcategory) || t('admin.filters.subcategory')
                    }
                  </span>
                  {subcategoriesOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>

                {subcategoriesOpen && selectedCategory !== 'all' && subcategories.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                    <button
                      onClick={() => {
                        setSelectedSubcategory('all');
                        setSubcategoriesOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 hover:bg-gray-50 rounded-t-lg ${
                        selectedSubcategory === 'all' ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                      }`}
                    >
                      {t('admin.filters.allSubcategories')}
                    </button>
                    {subcategories.map(subcategory => (
                      <button
                        key={subcategory}
                        onClick={() => {
                          setSelectedSubcategory(subcategory);
                          setSubcategoriesOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2 hover:bg-gray-50 last:rounded-b-lg ${
                          selectedSubcategory === subcategory ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                        }`}
                      >
                        {subcategory}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Clear Filters Button */}
              {(selectedCategory !== 'all' || selectedSubcategory !== 'all' || query) && (
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg bg-white hover:bg-gray-50"
                >
                  {t('admin.filters.clear')}
                </button>
              )}
            </div>
          </div>

          {/* Mobile Filters */}
          {mobileFiltersOpen && (
            <div className="lg:hidden mt-4 p-4 bg-white border border-gray-300 rounded-lg space-y-4">
              {/* Category Filter Mobile */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('admin.filters.category')}</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => handleCategorySelect(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg bg-white text-gray-900"
                >
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Subcategory Filter Mobile */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('admin.filters.subcategory')}</label>
                <select
                  value={selectedSubcategory}
                  onChange={(e) => setSelectedSubcategory(e.target.value)}
                  disabled={selectedCategory === 'all' || subcategories.length === 0}
                  className="w-full p-2 border border-gray-300 rounded-lg bg-white text-gray-900 disabled:opacity-50"
                >
                  <option value="all">{t('admin.filters.allSubcategories')}</option>
                  {subcategories.map(subcategory => (
                    <option key={subcategory} value={subcategory}>
                      {subcategory}
                    </option>
                  ))}
                </select>
              </div>

              {/* Clear Filters Mobile */}
              {(selectedCategory !== 'all' || selectedSubcategory !== 'all' || query) && (
                <button
                  onClick={clearFilters}
                  className="w-full px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg bg-white hover:bg-gray-50"
                >
                  {t('admin.filters.clearAll')}
                </button>
              )}
            </div>
          )}

          {/* Filter Stats */}
          <div className="mt-3 text-sm text-gray-600">
            {t('admin.filters.showing', { count: filteredProducts.length, total: products.length })}
            {(selectedCategory !== 'all' || selectedSubcategory !== 'all') && (
              <span className="ml-2">
                • {categories.find(c => c.id === selectedCategory)?.name}
                {selectedSubcategory !== 'all' && ` • ${selectedSubcategory}`}
              </span>
            )}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'products' && (
          <div className="space-y-4 sm:space-y-6">
            {/* Add/Edit Product Form */}
            <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center">
                {editingProduct ? <Edit className="w-5 h-5 mr-2" /> : <Plus className="w-5 h-5 mr-2" />}
                {editingProduct ? t('admin.productForm.editTitle') : t('admin.productForm.addTitle')}
              </h3>
              
              {renderProductForm()}
            </div>

            {/* Products List */}
            <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
              <div className="px-4 sm:px-6 py-3 sm:py-4 border-b flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  {t('admin.products.title', { count: filteredProducts.length, total: products.length })}
                </h3>
                {(selectedCategory !== 'all' || selectedSubcategory !== 'all') && (
                  <button
                    onClick={clearFilters}
                    className="mt-2 sm:mt-0 text-sm text-blue-600 hover:text-blue-800"
                  >
                    {t('admin.filters.clear')}
                  </button>
                )}
              </div>
              <div className="divide-y">
                {filteredProducts.map(product => (
                  <div key={product.id} className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between hover:bg-gray-50 space-y-3 sm:space-y-0">
                    <div className="flex items-center space-x-3 sm:space-x-4 min-w-0">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
                        <img 
                          src={product.images && product.images.length > 0 
                            ? product.images[0].url 
                            : 'https://via.placeholder.com/60x60?text=No+Image'
                          } 
                          alt={product.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/60x60?text=Error';
                          }}
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="font-semibold text-gray-900 truncate">{product.name}</h4>
                        {/* 2.6. Показываем мини-заказ для custom_logo */}
                        <p className="text-sm text-gray-600 truncate">
                          {product.price} • {product.category}
                          {product.subcategory && ` • ${product.subcategory}`}
                          {product.brand && ` • ${product.brand}`}
                          {product.category === 'custom_logo' && product.dimensions && ` • ${t('admin.productForm.minOrder')}: ${product.dimensions} ${t('admin.productForm.pcs')}`}
                        </p>
                        {product.description && (
                          <p className="text-sm text-gray-500 mt-1 line-clamp-2">{product.description}</p>
                        )}
                        <p className="text-xs text-gray-400 mt-1">
                          {t('admin.products.imagesCount', { count: product.images?.length || 0 })}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2 self-end sm:self-auto">
                      <button 
                        onClick={() => handleEditClick(product)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title={t('admin.products.edit')}
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteProduct(product.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title={t('admin.products.delete')}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <div className="px-4 sm:px-6 py-3 sm:py-4 border-b">
              <h3 className="text-lg font-semibold text-gray-900">{t('admin.orders.title', { count: orders.length })}</h3>
            </div>
            <div className="divide-y">
              {orders.map(order => (
                <div key={order.id} className="p-4 sm:p-6 hover:bg-gray-50">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start space-y-2 sm:space-y-0 mb-3">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 truncate">
                        #{order.order_number} - {order.customer_name || t('admin.orders.noName')}
                      </h4>
                      <p className="text-sm text-gray-600 truncate">
                        {order.customer_phone} • {order.customer_email}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-blue-600 whitespace-nowrap">
                        {order.total_amount?.toLocaleString('ru-RU')} ₸
                      </div>
                      <div className="text-xs sm:text-sm text-gray-500">
                        {new Date(order.created_at).toLocaleString('ru-RU')}
                      </div>
                    </div>
                  </div>
                  
                  {order.items && order.items.length > 0 && (
                    <div className="bg-gray-50 rounded-lg p-3">
                      <h5 className="font-medium mb-2 text-sm text-gray-900">{t('admin.orders.items')}:</h5>
                      <div className="space-y-1">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex justify-between text-xs sm:text-sm">
                            <span className="truncate flex-1 mr-2 text-gray-900">{item.name} × {item.quantity}</span>
                            <span className="font-medium whitespace-nowrap text-gray-900">{item.price}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <div className="px-4 sm:px-6 py-3 sm:py-4 border-b">
              <h3 className="text-lg font-semibold text-gray-900">{t('admin.users.title', { count: users.length })}</h3>
            </div>
            <div className="divide-y">
              {users.map(userItem => (
                <div key={userItem.id} className="p-4 sm:p-6 flex flex-col sm:flex-row sm:justify-between sm:items-center hover:bg-gray-50 space-y-2 sm:space-y-0">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 truncate">{userItem.name}</h4>
                    <p className="text-sm text-gray-600 truncate">{userItem.email}</p>
                    {userItem.phone && <p className="text-xs text-gray-500 truncate">{userItem.phone}</p>}
                  </div>
                  <div className="flex items-center space-x-2 sm:space-x-4">
                    <span className={`px-2 py-1 rounded-full text-xs whitespace-nowrap ${
                      userItem.role === 'admin' 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {userItem.role === 'admin' ? t('admin.users.roleAdmin') : t('admin.users.roleUser')}
                    </span>
                    <span className="text-xs sm:text-sm text-gray-500 whitespace-nowrap">
                      {new Date(userItem.createdAt).toLocaleDateString('ru-RU')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'designs' && (
  <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
    <div className="px-4 sm:px-6 py-3 sm:py-4 border-b flex justify-between items-center">
      <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
        <ImagePlus className="w-5 h-5 text-blue-600" />
        {t('admin.designs.title', { count: designs.length })}
      </h3>
      <button
        onClick={fetchData}
        className="bg-blue-600 text-white text-sm px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors"
      >
        {t('admin.refresh')}
      </button>
    </div>

    {designs.length === 0 ? (
      <div className="text-center py-10 text-gray-500">
        {t('admin.designs.empty')}
      </div>
    ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 p-5">
        {designs.map((design) => (
          <div
            key={design.id}
            className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden shadow hover:shadow-md transition-shadow"
          >
            <div className="bg-white h-52 flex items-center justify-center border-b relative">
              
  <img
  src={
    design.thumbUrl?.startsWith('http')
      ? design.thumbUrl
      : design.thumbUrl
      ? getFullUrl(design.thumbUrl || design.mockupUrl)
      : design.mockupUrl?.startsWith('http')
      ? design.mockupUrl
      : design.mockupUrl
      ? getFullUrl(design.thumbUrl || design.mockupUrl)
      : '/placeholder.png'
  }
  alt={design.productType || 'Design preview'}
  className="w-full h-48 object-contain bg-white"
/>
              <div className="absolute top-2 right-2 bg-white bg-opacity-80 rounded-full px-2 py-1 text-xs text-gray-600">
                #{design.id}
              </div>
            </div>

            <div className="p-4 flex flex-col justify-between h-[140px]">
              <div>
                <h4 className="font-semibold text-gray-800 truncate">
                  {design.name || t('admin.designs.noName')}
                </h4>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(design.createdAt).toLocaleString('ru-RU')}
                </p>
              </div>

              <div className="flex gap-2 mt-3">
                <a
  href={
    design.mockupUrl?.startsWith('http')
      ? design.mockupUrl
      : design.mockupUrl
      ? getFullUrl(design.mockupUrl || design.thumbUrl)
      : design.thumbUrl?.startsWith('http')
      ? design.thumbUrl
      : design.thumbUrl
      ? getFullUrl(design.mockupUrl || design.thumbUrl)
      : '#'
  }
  target="_blank"
  rel="noreferrer"
  className="flex-1 bg-blue-600 text-white text-center text-sm py-1.5 rounded-lg hover:bg-blue-700 transition"
>
  {t('admin.designs.view')}
</a>
                <button
  onClick={async () => {
    try {
      const fileUrl = design.mockupUrl || design.thumbUrl;
      if (!fileUrl) {
        alert(t('admin.designs.noImageError'));
        return;
      }

      const response = await fetch(fileUrl);
      if (!response.ok) throw new Error(t('admin.designs.downloadError'));

      const blob = await response.blob();
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `${design.id}.png`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(link.href);
    } catch (err) {
      console.error("Ошибка скачивания:", err);
      alert(t('admin.designs.downloadFailed'));
    }
  }}
  className="flex-1 bg-green-600 text-white text-center text-sm py-1.5 rounded-lg hover:bg-green-700 transition"
>
  {t('admin.designs.download')}
</button>
              </div>

              <button
                onClick={async () => {
                  if (!confirm(t('admin.designs.deleteConfirmation'))) return;
                  await fetch(`${API_URL}/api/designs/${design.id}`, {
                    method: 'DELETE',
                    credentials: 'include',
                  });
                  setDesigns((prev) => prev.filter((d) => d.id !== design.id));
                }}
                className="mt-2 bg-red-100 text-red-600 text-sm rounded-lg py-1 hover:bg-red-200 transition"
              >
                {t('admin.designs.delete')}
              </button>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
)}

        {activeTab === 'statistics' && (
          <div className="space-y-4 sm:space-y-6">
            <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 sm:mb-4">{t('admin.statistics.title')}</h3>
              
              {(() => {
                const productStatsMap = {};
                let totalRevenue = 0;
                let totalItemsSold = 0;

                orders.forEach(order => {
                  (order.items || []).forEach(item => {
                    const key = item.productId + '|' + item.name;
                    if (!productStatsMap[key]) {
                      productStatsMap[key] = { 
                        id: item.productId, 
                        name: item.name, 
                        quantity: 0,
                        revenue: 0 
                      };
                    }
                    
                    const quantity = Number(item.quantity) || 0;
                    const price = parseInt(String(item.price || '0').replace(/[^\d]/g, '')) || 0;
                    const itemRevenue = price * quantity;
                    
                    productStatsMap[key].quantity += quantity;
                    productStatsMap[key].revenue += itemRevenue;
                    totalRevenue += itemRevenue;
                    totalItemsSold += quantity;
                  });
                });

                const productStats = Object.values(productStatsMap).sort((a, b) => b.revenue - a.revenue);

                return (
                  <div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4 text-center">
                        <div className="text-xl sm:text-2xl font-bold text-blue-600">{orders.length}</div>
                        <div className="text-xs sm:text-sm text-blue-800">{t('admin.statistics.totalOrders')}</div>
                      </div>
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4 text-center">
                        <div className="text-xl sm:text-2xl font-bold text-green-600">{totalItemsSold}</div>
                        <div className="text-xs sm:text-sm text-green-800">{t('admin.statistics.itemsSold')}</div>
                      </div>
                      <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 sm:p-4 text-center">
                        <div className="text-xl sm:text-2xl font-bold text-purple-600 truncate">
                          {totalRevenue.toLocaleString('ru-RU')} ₸
                        </div>
                        <div className="text-xs sm:text-sm text-purple-800">{t('admin.statistics.totalRevenue')}</div>
                      </div>
                    </div>

                    {productStats.length === 0 ? (
                      <div className="text-center py-6 sm:py-8 text-gray-500">
                        {t('admin.statistics.noData')}
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-xs sm:text-sm">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left py-2 sm:py-3 font-medium">{t('admin.statistics.table.product')}</th>
                              <th className="text-left py-2 sm:py-3 font-medium">{t('admin.statistics.table.quantity')}</th>
                              <th className="text-left py-2 sm:py-3 font-medium">{t('admin.statistics.table.revenue')}</th>
                              <th className="text-left py-2 sm:py-3 font-medium">{t('admin.statistics.table.share')}</th>
                            </tr>
                          </thead>
                          <tbody>
                            {productStats.map((stat, index) => {
                              const percentage = totalRevenue > 0 ? (stat.revenue / totalRevenue * 100).toFixed(1) : 0;
                              return (
                                <tr key={stat.id} className="border-b hover:bg-gray-50">
                                  <td className="py-2 sm:py-3">
                                    <div className="font-medium truncate max-w-[120px] sm:max-w-none">{stat.name}</div>
                                    <div className="text-gray-500 text-xs">ID: {stat.id}</div>
                                  </td>
                                  <td className="py-2 sm:py-3">{stat.quantity} {t('admin.statistics.table.pcs')}</td>
                                  <td className="py-2 sm:py-3 font-medium whitespace-nowrap">
                                    {stat.revenue.toLocaleString('ru-RU')} ₸
                                  </td>
                                  <td className="py-2 sm:py-3">
                                    <div className="flex items-center space-x-2">
                                      <div className="w-12 sm:w-16 bg-gray-200 rounded-full h-2">
                                        <div 
                                          className="bg-blue-600 h-2 rounded-full" 
                                          style={{ width: `${percentage}%` }}
                                        ></div>
                                      </div>
                                      <span className="text-gray-600 text-xs sm:text-sm">{percentage}%</span>
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;