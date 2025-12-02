    import React from 'react';

    const SkeletonLoader = ({ type = 'card', count = 1 }) => {
      const SkeletonCard = () => (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700 animate-pulse">
          <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent animate-shimmer bg-[length:200px_100%] bg-repeat-x"></div>
          </div>
          <div className="p-6">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-3 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent animate-shimmer bg-[length:200px_100%] bg-repeat-x"></div>
            </div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent animate-shimmer bg-[length:200px_100%] bg-repeat-x"></div>
            </div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-4 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent animate-shimmer bg-[length:200px_100%] bg-repeat-x"></div>
            </div>
            <div className="flex justify-between items-center">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-20 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent animate-shimmer bg-[length:200px_100%] bg-repeat-x"></div>
              </div>
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg w-24 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent animate-shimmer bg-[length:200px_100%] bg-repeat-x"></div>
              </div>
            </div>
          </div>
        </div>
      );

      const SkeletonText = () => (
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent animate-shimmer bg-[length:200px_100%] bg-repeat-x"></div>
          </div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent animate-shimmer bg-[length:200px_100%] bg-repeat-x"></div>
          </div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent animate-shimmer bg-[length:200px_100%] bg-repeat-x"></div>
          </div>
        </div>
      );

      if (type === 'text') {
        return <SkeletonText />;
      }

      return (
        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6`}>
          {Array.from({ length: count }).map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      );
    };

    // Добавьте эту строку в конец файла:
    export default SkeletonLoader;