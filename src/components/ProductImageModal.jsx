import React, { useState, useEffect } from 'react';
import { X, ZoomIn, ZoomOut, RotateCw, ChevronLeft, ChevronRight } from 'lucide-react';

const ProductImageModal = ({ product, isOpen, onClose }) => {
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setScale(1);
      setRotation(0);
      setIsZoomed(false);
      setCurrentImageIndex(0);
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleZoomIn = () => {
    setScale(prev => {
      const newScale = Math.min(prev + 0.25, 3);
      setIsZoomed(newScale > 1);
      return newScale;
    });
  };

  const handleZoomOut = () => {
    setScale(prev => {
      const newScale = Math.max(prev - 0.25, 0.5);
      setIsZoomed(newScale > 1);
      return newScale;
    });
  };

  const handleRotate = () => setRotation(prev => (prev + 90) % 360);
  
  const handleReset = () => {
    setScale(1);
    setRotation(0);
    setIsZoomed(false);
  };

  const handleImageClick = (e) => {
    if (isZoomed) {
      handleReset();
    } else {
      handleZoomIn();
    }
  };

  const nextImage = () => {
    if (product.images && product.images.length > 1) {
      setCurrentImageIndex((prev) => 
        prev === product.images.length - 1 ? 0 : prev + 1
      );
      setScale(1);
      setRotation(0);
      setIsZoomed(false);
    }
  };

  const prevImage = () => {
    if (product.images && product.images.length > 1) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? product.images.length - 1 : prev - 1
      );
      setScale(1);
      setRotation(0);
      setIsZoomed(false);
    }
  };

  if (!isOpen || !product) return null;

  const currentImage = product.images && product.images[currentImageIndex] 
    ? product.images[currentImageIndex].url 
    : 'https://via.placeholder.com/600x400?text=No+Image';

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center z-50 p-4 cursor-zoom-out"
      onClick={onClose}
    >
      <div className="relative max-w-4xl max-h-full w-full h-full flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
        {/* Кнопки управления */}
        <div className="absolute top-4 right-4 flex gap-3 z-10 bg-black/50 backdrop-blur-sm rounded-2xl p-3">
          <button
            onClick={handleZoomIn}
            className="p-3 text-white hover:bg-white/20 rounded-xl transition-all duration-300 hover:scale-110"
            title="Увеличить"
          >
            <ZoomIn className="w-5 h-5" />
          </button>
          <button
            onClick={handleZoomOut}
            className="p-3 text-white hover:bg-white/20 rounded-xl transition-all duration-300 hover:scale-110"
            title="Уменьшить"
          >
            <ZoomOut className="w-5 h-5" />
          </button>
          <button
            onClick={handleRotate}
            className="p-3 text-white hover:bg-white/20 rounded-xl transition-all duration-300 hover:scale-110"
            title="Повернуть"
          >
            <RotateCw className="w-5 h-5" />
          </button>
          <button
            onClick={handleReset}
            className="p-3 text-white hover:bg-white/20 rounded-xl transition-all duration-300 hover:scale-110"
            title="Сбросить"
          >
            ↺
          </button>
          <button
            onClick={onClose}
            className="p-3 text-white hover:bg-red-500/50 rounded-xl transition-all duration-300 hover:scale-110"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Навигация по изображениям */}
        {product.images && product.images.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                prevImage();
              }}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-3 rounded-full hover:bg-black/70 transition-all z-10"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                nextImage();
              }}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-3 rounded-full hover:bg-black/70 transition-all z-10"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}

        {/* Изображение с нормальным размером для компьютера */}
        <div className="flex justify-center items-center w-full h-full p-4">
          <div 
            className={`relative transition-all duration-500 ${
              isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'
            }`}
            style={{
              transform: `scale(${scale}) rotate(${rotation}deg)`,
              transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              maxWidth: '90vw',
              maxHeight: '80vh'
            }}
          >
            <img
              src={currentImage}
              alt={product.name}
              className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-2xl"
              onClick={handleImageClick}
              style={{
                transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
              onError={(e) => {
                console.error('Modal image failed to load:', e.target.src);
                e.target.src = 'https://via.placeholder.com/600x400?text=Image+Error';
                e.target.onerror = null;
              }}
            />
          </div>
        </div>

        {/* Информация о номере изображения */}
        {product.images && product.images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-xl text-sm backdrop-blur-sm border border-white/20">
            📷 {currentImageIndex + 1} / {product.images.length}
          </div>
        )}

        {/* Индикатор масштаба */}
        {scale !== 1 && (
          <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-1 rounded-xl text-sm backdrop-blur-sm border border-white/20">
            Масштаб: {Math.round(scale * 100)}%
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductImageModal;
