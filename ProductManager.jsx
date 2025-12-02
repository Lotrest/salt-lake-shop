
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { addProductTranslation } from '../utils/auto-translate-products';

const ProductManager = () => {
  const { t } = useTranslation();
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    category: ''
  });
  const [message, setMessage] = useState('');

  const handleAddProduct = async () => {
    if (!newProduct.name) {
      setMessage('Введите название товара');
      return;
    }

    try {
      // Автоматически добавляем переводы
      const productKey = await addProductTranslation(newProduct.name, newProduct.description);
      
      setMessage(`✅ Товар "${newProduct.name}" добавлен! Ключ перевода: ${productKey}`);
      setNewProduct({ name: '', description: '', price: '', category: '' });
      
      // Можно также отправить данные на бэкенд
      // await fetch('/api/products', { method: 'POST', body: JSON.stringify(newProduct) });
      
    } catch (error) {
      setMessage(`❌ Ошибка: ${error.message}`);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Добавить новый товар</h3>
      
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Название товара"
          value={newProduct.name}
          onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
          className="w-full p-2 border rounded"
        />
        
        <textarea
          placeholder="Описание товара"
          value={newProduct.description}
          onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
          className="w-full p-2 border rounded"
          rows="3"
        />
        
        <input
          type="text"
          placeholder="Цена (например: 195 ₸)"
          value={newProduct.price}
          onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
          className="w-full p-2 border rounded"
        />
        
        <input
          type="text"
          placeholder="Категория"
          value={newProduct.category}
          onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
          className="w-full p-2 border rounded"
        />
        
        <button
          onClick={handleAddProduct}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Добавить товар
        </button>
        
        {message && (
          <div className={`p-3 rounded ${
            message.includes('✅') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductManager;