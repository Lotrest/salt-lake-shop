// components/ProductImageModal.jsx
import React, { useState } from 'react';
import { X, ZoomIn, ZoomOut, RotateCw } from 'lucide-react';

const ProductImageModal = ({ image, name, dimensions, isOpen, onClose }) => {
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);

  if (!isOpen) return null;

  const handleZoomIn = () => setScale(prev => Math.min(prev + 0.25, 3));
  const handleZoomOut = () => setScale(prev => Math.max(prev - 0.25, 0.5));
  const handleRotate = () => setRotation(prev => (prev + 90) % 360);
  const handleReset = () => {
    setScale(1);
    setRotation(0);
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4 cursor-pointer"
      onClick={onClose}
    >
      <div className="relative max-w-4xl max-h-full" onClick={(e) => e.stopPropagation()}>
        {/* Кнопки управления */}
        <div className="absolute top-4 right-4 flex gap-2 z-10">
          <button
            onClick={handleZoomIn}
            className="bg-white bg-opacity-20 text-white p-2 rounded-full hover:bg-opacity-30 transition-all"
            title="Увеличить"
          >
            <ZoomIn className="w-5 h-5" />
          </button>
          <button
            onClick={handleZoomOut}
            className="bg-white bg-opacity-20 text-white p-2 rounded-full hover:bg-opacity-30 transition-all"
            title="Уменьшить"
          >
            <ZoomOut className="w-5 h-5" />
          </button>
          <button
            onClick={handleRotate}
            className="bg-white bg-opacity-20 text-white p-2 rounded-full hover:bg-opacity-30 transition-all"
            title="Повернуть"
          >
            <RotateCw className="w-5 h-5" />
          </button>
          <button
            onClick={handleReset}
            className="bg-white bg-opacity-20 text-white p-2 rounded-full hover:bg-opacity-30 transition-all"
            title="Сбросить"
          >
            ↺
          </button>
          <button
            onClick={onClose}
            className="bg-white bg-opacity-20 text-white p-2 rounded-full hover:bg-opacity-30 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Изображение */}
        <div className="flex justify-center items-center">
          <img
            src={image}
            alt={name}
            className="max-w-full max-h-[80vh] object-contain transition-transform duration-300"
            style={{
              transform: `scale(${scale}) rotate(${rotation}deg)`
            }}
          />
        </div>

        {/* Информация о размерах */}
        {dimensions && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-70 text-white px-4 py-2 rounded-lg text-sm">
            Размеры: {dimensions}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductImageModal;