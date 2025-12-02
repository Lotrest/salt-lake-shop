import React from 'react';
import { RefreshCw } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const LoadingSpinner = ({ size = 'medium', text = null }) => {
  const { t } = useTranslation();
  
  const sizeClasses = {
    small: 'w-6 h-6',
    medium: 'w-8 h-8',
    large: 'w-12 h-12'
  };

  const textSizes = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg'
  };

  return (
    <div className="flex flex-col items-center justify-center py-8">
      <RefreshCw className={`${sizeClasses[size]} animate-spin text-blue-600 mb-4`} />
      <p className={`text-gray-600 ${textSizes[size]}`}>
        {text || t('common.loading')}
      </p>
    </div>
  );
};

export default LoadingSpinner;