import React from "react";
import { ShoppingCart } from "lucide-react";
import { useCart } from "../contexts/CartContext";

const ChatProductCard = ({ product, cartLabel }) => {
  const { addToCart } = useCart();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden min-w-[150px] max-w-[180px] animate-scale-in">
      {/* Изображение товара */}
      <div className="w-full h-24 bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
        <img
          src={product.image || "https://via.placeholder.com/200x150?text=No+Image"}
          alt={product.name}
          className="max-w-full max-h-full object-contain"
          onError={(e) =>
            (e.currentTarget.src = "https://via.placeholder.com/200x150?text=No+Image")
          }
        />
      </div>

      {/* Описание и кнопка */}
      <div className="p-2">
        <a
          href={product.url || "#"}
          className="block text-xs font-semibold text-gray-900 dark:text-gray-100 line-clamp-2 hover:underline"
          title={product.name}
        >
          {product.name}
        </a>

        <div className="mt-1 flex items-center justify-between">
          <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
            {product.price}
          </span>
          <button
            onClick={() => addToCart(product)}
            className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs bg-blue-600 text-white hover:bg-blue-700 transition"
            title={cartLabel || "В корзину"} // 👈 подсказка на языке пользователя
          >
            <ShoppingCart className="w-3 h-3" />
            {cartLabel || "В корз."} {/* 👈 динамическая надпись */}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatProductCard;
