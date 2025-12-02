// src/pages/CatalogPage.jsx
import React, { useState, useEffect, useRef } from "react";
import { useCart } from "../contexts/CartContext";
import { useTranslation } from "react-i18next";
import {
  Search,
  ShoppingCart,
  ArrowLeft,
  ChevronRight,
  ChevronLeft,
  RefreshCw,
} from "lucide-react";
import ProductImageModal from "../components/ProductImageModal";
import SkeletonLoader from "../components/SkeletonLoader";
import CustomLogoCard from "../components/CustomLogoCard";
import { useNavigate } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
const API_URL = "https://my-backend-production-3416.up.railway.app";

/* ===== FastImage ===== */
const FastImage = ({ img, alt = "", className = "", priority = false, contain = true }) => {
  const [hdLoaded, setHdLoaded] = useState(false);
  const obj = contain ? "object-contain" : "object-cover";
  const srcMain = img?.url || "https://via.placeholder.com/800x600?text=No+Image";
  const srcAvif = img?.sources?.avif;
  const srcWebp = img?.sources?.webp;
  const srcJpg = img?.sources?.jpg || srcMain;
  const thumb = img?.thumb || img?.lqip;
  
  return (
    <div className={`relative w-full h-full ${className}`}>
      {thumb && (
        <img
          src={thumb}
          alt=""
          aria-hidden
          className={`absolute inset-0 w-full h-full ${obj} blur-md scale-105 opacity-70 transition-opacity duration-300 ${
            hdLoaded ? "opacity-0" : "opacity-100"
          }`}
          loading="eager"
          decoding="async"
        />
      )}
      <picture>
        {srcAvif && <source srcSet={srcAvif} type="image/avif" />}
        {srcWebp && <source srcSet={srcWebp} type="image/webp" />}
        <img
          src={srcJpg}
          alt={alt}
          className={`w-full h-full ${obj} transition-opacity duration-300 ${
            hdLoaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={() => setHdLoaded(true)}
          onError={(e) => {
            e.currentTarget.src = "https://via.placeholder.com/800x600?text=No+Image";
            setHdLoaded(true);
          }}
          loading={priority ? "eager" : "lazy"}
          fetchpriority={priority ? "high" : "auto"}
          decoding="async"
        />
      </picture>
    </div>
  );
};

/* ===== Карусель изображений ===== */
const ProductImageCarousel = ({ images, productName, onImageClick }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const wrapRef = useRef(null);

  const list =
    Array.isArray(images) && images.length > 0
      ? images
      : [{ url: "https://via.placeholder.com/800x600?text=No+Image" }];

  useEffect(() => {
    if (!list.length) return;
    const next = new Image();
    next.src = list[(currentIndex + 1) % list.length].url;
  }, [currentIndex, list]);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const onScroll = () => {
      const w = el.clientWidth;
      const i = Math.round(el.scrollLeft / w);
      if (i !== currentIndex) setCurrentIndex(i);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [currentIndex]);

  const goTo = (i) => {
    const el = wrapRef.current;
    if (!el) return;
    const w = el.clientWidth;
    el.scrollTo({ left: i * w, behavior: "smooth" });
  };

  const next = (e) => {
    e.stopPropagation();
    goTo((currentIndex + 1) % list.length);
  };
  const prev = (e) => {
    e.stopPropagation();
    goTo((currentIndex - 1 + list.length) % list.length);
  };

  const onWheel = (e) => {
    const el = wrapRef.current;
    if (!el) return;
    const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    if (delta === 0) return;
    e.preventDefault();
    el.scrollBy({ left: delta, behavior: "auto" });
  };

  return (
    <div className="relative w-full h-48 bg-gray-100 dark:bg-gray-700 overflow-hidden group rounded-t-2xl">
      <div
        ref={wrapRef}
        onWheel={onWheel}
        onClick={onImageClick}
        className="w-full h-full flex overflow-x-auto overscroll-x-contain scroll-smooth snap-x snap-mandatory scrollbar-none cursor-pointer"
      >
        {list.map((img, idx) => (
          <div key={idx} className="w-full h-full shrink-0 snap-center flex items-center justify-center">
            <FastImage img={img} alt={`${productName} - ${idx + 1}`} className="p-4" contain priority={idx === 0} />
          </div>
        ))}
      </div>

      {list.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={next}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </>
      )}
    </div>
  );
};

/* ===== Карточка товара ===== */
const ProductCard = ({ product, onImageClick, onAddToCart }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { t, i18n } = useTranslation();
  const lang = i18n.language.split("-")[0];

  const name = product[`name_${lang}`] || product.name_ru || product.name;
  const desc = product[`description_${lang}`] || product.description_ru || product.description;
  const specifications =
    product[`specifications_${lang}`] || product.specifications_ru || product.specifications;

  const toggleExpanded = (e) => {
    e.stopPropagation();
    setIsExpanded((s) => !s);
  };
  const handleAddToCartClick = (e) => {
    e.stopPropagation();
    onAddToCart(product);
  };

  return (
    <div className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 flex flex-col h-full border border-gray-200 dark:border-gray-700">
      <ProductImageCarousel images={product.images} productName={name} onImageClick={onImageClick} />

      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300 leading-tight mb-3">
          {name}
        </h3>

        <div className="mb-4 flex-grow">
          <p
  className={`text-gray-600 dark:text-gray-300 text-sm leading-relaxed transition-all duration-300 ${
    isExpanded ? "max-h-none" : "line-clamp-6 min-h-[60px]"
  }`}
>
  {desc}
</p>
          {desc && desc.length > 120 && (
            <button
              onClick={toggleExpanded}
              className="mt-2 text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline transition-colors"
            >
              {isExpanded ? t("product.showLess") : t("product.showMore")}
            </button>
          )}
        </div>

        <div className="space-y-2 mb-4">
          {specifications && (
            <div className="text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
              <span className="font-semibold text-gray-700 dark:text-gray-300 block mb-1">
                {t("product.characteristics")}:
              </span>
              <span>{specifications}</span>
            </div>
          )}
          {product.package && (
            <div className="text-xs text-gray-500 dark:text-gray-400">
              <span className="font-semibold text-gray-700 dark:text-gray-300">
                {t("product.package")}:
              </span>
              <span className="ml-1">{product.package}</span>
            </div>
          )}
          {product.weight && (
            <div className="text-xs text-gray-500 dark:text-gray-400">
              <span className="font-semibold text-gray-700 dark:text-gray-300">
                {t("product.weight")}:
              </span>
              <span className="ml-1">{product.weight}</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100 dark:border-gray-700">
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-blue-600 dark:text-blue-400 whitespace-nowrap">
              {product.price}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {product.unit || t("product.perUnit")}
            </span>
          </div>

          <button
            onClick={handleAddToCartClick}
            className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-blue-500/25 flex items-center gap-2 font-semibold group"
          >
            <ShoppingCart className="w-5 h-5 transform group-hover:scale-110 transition-transform duration-300" />
            {t("cart.addToCart")}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ===== Страница каталога ===== */
const CatalogPage = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language.split("-")[0];
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const handleAddToCart = (product) => {
    addToCart(product);
  };

  // === Состояния ===
  const [products, setProducts] = useState([]);
  const [cachedProducts, setCachedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState(null);
  
  // ✅ Состояние для пагинации
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // ✅ фикс: принудительный ререндер при смене языка
  const [langVersion, setLangVersion] = useState(0);
  useEffect(() => {
    const update = () => setLangVersion((v) => v + 1);
    i18n.on("languageChanged", update);
    return () => i18n.off("languageChanged", update);
  }, [i18n]);

  // ✅ Сброс страницы при изменении фильтров
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedSubcategoryId, searchQuery]);

  // === Категории с переводом ===
  
const categories = React.useMemo(
  () => [
    {
      id: "textile",
      name: t("categories.textile.name"),
      description: t("categories.textile.description"),
      icon: "🛏️",
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      image: "https://storage.imgbly.com/imgbly/0UaWbTOauX.jpg",
      subcategories: [
        { id: "towels", name: t("categories.textile.sub.towels") },
        { id: "slippers", name: t("categories.textile.sub.slippers") },
        { id: "robes", name: t("categories.textile.sub.robes") },
        { id: "pillowcases", name: t("categories.textile.sub.pillowcases") },
        { id: "sheets", name: t("categories.textile.sub.sheets") },
        { id: "duvet_covers", name: t("categories.textile.sub.duvet_covers") },
        { id: "mattress_covers", name: t("categories.textile.sub.mattress_covers") },
        { id: "double_set", name: t("categories.textile.sub.double_set") },
        { id: "single_set", name: t("categories.textile.sub.single_set") },
        { id: "pillows", name: t("categories.textile.sub.pillows") },
        { id: "blankets", name: t("categories.textile.sub.blankets") },
      ],
    },
    {
      id: "accessories",
      name: t("categories.accessories.name"),
      description: t("categories.accessories.description"),
      icon: "🧴",
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50 dark:bg-green-900/20",
      image: "https://storage.imgbly.com/imgbly/8gFbZlvhas.jpg",
      subcategories: [
        { id: "standard", name: t("categories.accessories.sub.standard") },
        { id: "eco", name: t("categories.accessories.sub.eco") },
        //{ id: "shoes", name: t("categories.accessories.sub.shoes") },
        //{ id: "razor", name: t("categories.accessories.sub.razor") },
        //{ id: "cosmetic", name: t("categories.accessories.sub.cosmetic") },
        //{ id: "tooth", name: t("categories.accessories.sub.tooth") },
        { id: "lumiere_business", name: t("categories.accessories.sub.lumiere_business") },
        { id: "lumiere_standard", name: t("categories.accessories.sub.lumiere_standard") },
        { id: "lumiere_econom", name: t("categories.accessories.sub.lumiere_econom") },
      ],
    },
    {
      id: "cosmetics",
      name: t("categories.cosmetics.name"),
      description: t("categories.cosmetics.description"),
      icon: "✨",
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
      image: "https://storage.imgbly.com/imgbly/uFxUssU4tF.jpg",
      groupedSubcategories: [
        // === СТАРЫЕ ГРУППЫ ===
        {
          title: t("categories.cosmetics.groups.greenery"),
          items: [
            { id: "shampoo_greenery", name: t("categories.cosmetics.items.shampoo") },
            { id: "showerGel_greenery", name: t("categories.cosmetics.items.showerGel") },
            { id: "lotion_greenery", name: t("categories.cosmetics.items.lotion") },
            { id: "conditioner_greenery", name: t("categories.cosmetics.items.conditioner") },
          ],
        },
        {
          title: t("categories.cosmetics.groups.comfort"),
          items: [
            { id: "shampoo_comfort_line", name: t("categories.cosmetics.items.shampoo") },
            { id: "showerGel_comfort_line", name: t("categories.cosmetics.items.showerGel") },
            { id: "lotion_comfort_line", name: t("categories.cosmetics.items.lotion") },
            { id: "conditioner_comfort_line", name: t("categories.cosmetics.items.conditioner") },
          ],
        },
        {
          title: t("categories.cosmetics.groups.aroma"),
          items: [
            { id: "shampoo_aroma_garden", name: t("categories.cosmetics.items.shampoo") },
            { id: "showerGel_aroma_garden", name: t("categories.cosmetics.items.showerGel") },
            { id: "lotion_aroma_garden", name: t("categories.cosmetics.items.lotion") },
            { id: "conditioner_aroma_garden", name: t("categories.cosmetics.items.conditioner") },
          ],
        },

        // === НОВЫЕ ГРУППЫ ===
       /* {
          title: t("categories.cosmetics.groups.lumiere"),
          items: [
            { id: "lumiere_business", name: t("categories.cosmetics.items.lumiere_business") },
            { id: "lumiere_standard", name: t("categories.cosmetics.items.lumiere_standard") },
            { id: "lumiere_econom", name: t("categories.cosmetics.items.lumiere_econom") },
          ],
        },*/
        {
          title: t("categories.cosmetics.groups.allegrini"),
          items: [
            { id: "allegrini_one_for_you", name: t("categories.cosmetics.items.allegrini_one_for_you") },
            { id: "allegrini_bamboo", name: t("categories.cosmetics.items.allegrini_bamboo") },
            { id: "allegrini_aloesir", name: t("categories.cosmetics.items.allegrini_aloesir") },
            { id: "allegrini_acqua", name: t("categories.cosmetics.items.allegrini_acqua") },
            { id: "allegrini_havana", name: t("categories.cosmetics.items.allegrini_havana") },
            { id: "allegrini_natura_siberica", name: t("categories.cosmetics.items.allegrini_natura_siberica") },
            { id: "allegrini_argan", name: t("categories.cosmetics.items.allegrini_argan") },
            { id: "allegrini_kid_set", name: t("categories.cosmetics.items.allegrini_kid_set") },
            { id: "allegrini_skinus", name: t("categories.cosmetics.items.allegrini_skinus") },
            { id: "allegrini_accessories", name: t("categories.cosmetics.items.allegrini_accessories") },
          ],
        },
        {
          title: t("categories.cosmetics.groups.ada"),
          items: [
            { id: "ada_lifestyle", name: t("categories.cosmetics.items.ada_lifestyle") },
            { id: "ada_luxury", name: t("categories.cosmetics.items.ada_luxury") },
            { id: "ada_300ml", name: t("categories.cosmetics.items.ada_300ml") },
          ],
        },
        {
          title: t("categories.cosmetics.groups.mezo"),
          items: [
            { id: "mezo_hotel_collection", name: t("categories.cosmetics.items.mezo_hotel_collection") },
            { id: "mezo_all_for_you", name: t("categories.cosmetics.items.mezo_all_for_you") },
            { id: "mezo_lucio", name: t("categories.cosmetics.items.mezo_lucio") },
            { id: "mezo_argana", name: t("categories.cosmetics.items.mezo_argana") },
            { id: "mezo_lavender", name: t("categories.cosmetics.items.mezo_lavender") },
            { id: "mezo_rumah", name: t("categories.cosmetics.items.mezo_rumah") },
            { id: "mezo_marrone", name: t("categories.cosmetics.items.mezo_marrone") },
            { id: "mezo_basic", name: t("categories.cosmetics.items.mezo_basic") },
            { id: "mezo_kids", name: t("categories.cosmetics.items.mezo_kids") },
          ],
        },
      ],
    },
    {
      id: "minibars",
      name: t("categories.minibars.name"),
      description: t("categories.minibars.description"),
      icon: "🧊",
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50 dark:bg-orange-900/20",
      image: "https://storage.imgbly.com/imgbly/WUKapqx9Qr.jpg",
      subcategories: [{ id: "minibar", name: t("categories.minibars.name") }],
    },
    {
      id: "custom_logo",
      name: t("categories.custom_logo.name"),
      description: t("categories.custom_logo.description"),
      icon: "🎨",
      color: "from-pink-500 to-pink-600",
      bgColor: "bg-pink-50 dark:bg-pink-900/20",
      image: "https://storage.imgbly.com/imgbly/S7uosnybvx.png",
      subcategories: [
        { id: "robes", name: t("categories.custom_logo.sub.robes") },
        { id: "slippers", name: t("categories.custom_logo.sub.slippers") },
        { id: "boxes", name: t("categories.custom_logo.sub.boxes") },
        { id: "pillowcases", name: t("categories.textile.sub.pillowcases") },
      ],
    },
  ],
  [t, langVersion]
);

  const fetchProducts = async () => {
    try {
      setError("");
      const res = await fetch(`${API_URL}/api/products?lng=${lang}`);
      const data = await res.json();

      // 🔹 Небольшая задержка, чтобы переход был плавным
      await new Promise((r) => setTimeout(r, 100));

      if (data.success && Array.isArray(data.products)) {
        setProducts(data.products);
      } else {
        setProducts([]);
      }
    } catch (err) {
      setError(t("catalog.loadError"));
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    setLoading(true);
    fetchProducts();
  };

  // === Обновление товаров при смене языка ===
  useEffect(() => {
    if (products.length > 0) {
      fetchProducts();
    } else {
      setLoading(true);
      fetchProducts();
    }
  }, [lang]);

  // === Синхронизация с URL ===
  useEffect(() => {
    const catId = searchParams.get("cat");
    const subId = searchParams.get("sub");

    if (catId) {
      setSelectedCategoryId(catId);
      if (subId) setSelectedSubcategoryId(subId);
      else setSelectedSubcategoryId(null);
    } else {
      setSelectedCategoryId(null);
      setSelectedSubcategoryId(null);
    }
  }, [searchParams]);

  // === Обработчики категорий и подкатегорий ===
  const handleCategoryClick = (category) => {
    if (category.id === "custom_logo") {
      navigate("/custom-logo");
      return;
    }
    setSelectedCategoryId(category.id);
    setSelectedSubcategoryId(null);
    setSearchParams({ cat: category.id });
  };

  const handleSubcategoryClick = (subcategory) => {
    setSelectedSubcategoryId(subcategory.id);
    setSearchParams({ cat: selectedCategoryId, sub: subcategory.id });
  };

  const handleBackToCategories = () => {
    setSelectedCategoryId(null);
    setSelectedSubcategoryId(null);
    setSearchParams({});
    setSearchQuery("");
  };

  const handleBackToSubcategories = () => {
    setSelectedSubcategoryId(null);
    setSearchParams({ cat: selectedCategoryId });
    setSearchQuery("");
  };

  // === Фикс: перерендер при смене языка для надписей ===
  useEffect(() => {
    setProducts((prev) => [...prev]);
  }, [i18n.language]);

  const normalizedProducts = products.map((p) => ({
    ...p,
    category: p.category?.toLowerCase?.().trim(),
    subcategory: p.subcategory?.toLowerCase?.().trim(),
  }));

  // === Фильтрация товаров ===
  const filteredProducts = selectedCategoryId
    ? normalizedProducts.filter((p) => {
        const cat = p.category?.toLowerCase()?.trim() || "";
        const sub = p.subcategory?.toLowerCase()?.trim() || "";
        const selectedCat = selectedCategoryId?.toLowerCase()?.trim();
        const selectedSub = selectedSubcategoryId?.toLowerCase()?.trim();

        const matchesCategory = cat === selectedCat;
        const matchesSubcategory = !selectedSub || sub === selectedSub;

        const nameLocalized =
          (p[`name_${lang}`] && p[`name_${lang}`].trim()) ||
          p.name_ru ||
          p.name ||
          "";
        const descLocalized =
          (p[`description_${lang}`] && p[`description_${lang}`].trim()) ||
          p.description_ru ||
          p.description ||
          "";

        const matchesSearch =
          searchQuery === "" ||
          nameLocalized.toLowerCase().includes(searchQuery.toLowerCase()) ||
          descLocalized.toLowerCase().includes(searchQuery.toLowerCase());

        return matchesCategory && matchesSubcategory && matchesSearch;
      })
    : [];

  const selectedCategory = categories.find(c => c.id === selectedCategoryId);
  const selectedSubcategory =
    selectedCategory?.subcategories?.find(s => s.id === selectedSubcategoryId) ||
    selectedCategory?.groupedSubcategories?.flatMap(g => g.items).find(s => s.id === selectedSubcategoryId) ||
    null;

  if (loading && !cachedProducts.length) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SkeletonLoader count={6} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ===== Заголовок ===== */}
        <div className="flex justify-between items-center mb-8">
          {selectedCategory ? (
            <div className="flex-1">
              <div className="flex items-center gap-4 flex-wrap">
                <button
                  onClick={
                    selectedSubcategory
                      ? handleBackToSubcategories
                      : handleBackToCategories
                  }
                  className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                  {selectedSubcategory
                    ? t("catalog.backToX", { name: selectedCategory.name })
                    : t("catalog.backToCategories")}
                </button>

                <div className="h-6 w-px bg-gray-300 dark:bg-gray-600"></div>

                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {selectedSubcategory ? selectedSubcategory.name : selectedCategory.name}
                </h1>
              </div>
            </div>
          ) : (
            <div className="flex-1 text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                {t("catalog.title")}
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                {t("catalog.description")}
              </p>
            </div>
          )}

          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span className="hidden sm:inline">{t("catalog.refreshBtn")}</span>
          </button>
        </div>

        {/* Ошибка */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
            <div className="flex items-center justify-between">
              <span>{error}</span>
              <button
                onClick={handleRefresh}
                className="text-red-700 hover:text-red-800 font-medium"
              >
                {t("catalog.tryAgain")}
              </button>
            </div>
          </div>
        )}

        {/* ===== Поиск ===== */}
        {selectedCategory && (
          <div className="mb-8">
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder={
                  selectedSubcategory
                    ? t("catalog.searchIn", { name: selectedSubcategory.name })
                    : t("catalog.searchIn", { name: selectedCategory.name })
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
          </div>
        )}

        {/* ===== Категории ===== */}
        {!selectedCategory && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category) => (
              <div
                key={category.id}
                onClick={() => handleCategoryClick(category)}
                className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden cursor-pointer transform transition-all duration-500 hover:scale-105 hover:shadow-2xl border border-gray-200 dark:border-gray-700"
                role="button"
                tabIndex={0}
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-80`} />
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6 text-center">
                    <span className="text-4xl mb-3 transform group-hover:scale-110 transition-transform duration-300">
                      {category.icon}
                    </span>
                    <h3 className="text-2xl font-bold mb-2">{category.name}</h3>
                    <p className="text-white/90 text-sm leading-relaxed">{category.description}</p>
                  </div>
                </div>
                <div className={`p-6 ${category.bgColor} border-t border-gray-200 dark:border-gray-700`}>
                  <div className="flex items-center justify-between">
                    <div
                      className="flex items-center justify-center gap-2 text-blue-600 dark:text-blue-400 group-hover:gap-3 transition-all duration-300"
                    >
                      <span className="font-semibold">{t("catalog.view")}</span>
                      <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ===== Подкатегории ===== */}
        {selectedCategory && !selectedSubcategory && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
              {t("catalog.subcategoriesOf", { name: selectedCategory.name })}
            </h2>

            {selectedCategory.groupedSubcategories ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {selectedCategory.groupedSubcategories.map((group, idx) => {
                  const productsInGroup = products.filter(
                    (p) =>
                      p.category === selectedCategory.id &&
                      group.items.some((item) => item.id === p.subcategory)
                  );
                  return (
                    <div
                      key={idx}
                      className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
                    >
                      <h3 className="text-xl font-bold text-center text-gray-900 dark:text-white mb-4 pb-3 border-b border-gray-200 dark:border-gray-600">
                        {group.title}
                      </h3>
                      <div className="space-y-3">
                        {group.items.map((item) => {
                          const productsInItem = products.filter(
                            (p) =>
                              p.category === selectedCategory.id &&
                              p.subcategory === item.id
                          );
                          return (
                            <button
                              key={item.id}
                              onClick={() =>
                                handleSubcategoryClick({
                                  id: item.id,
                                  name: `${item.name} - ${group.title}`,
                                })
                              }
                              className="w-full group bg-gray-50 dark:bg-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl p-4 transition-all duration-300 transform hover:-translate-y-1 text-left border border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-600"
                            >
                              <div className="flex items-center justify-between">
                                <div>
                                  <h4 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                    {item.name}
                                  </h4>
                                </div>
                                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transform group-hover:translate-x-1 transition-all" />
                              </div>
                            </button>
                          );
                        })}
                      </div>
                      <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-600 text-center">
                       
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {selectedCategory.subcategories.map((subcategory) => {
                  const productsInSubcategory = products.filter(
                    (p) =>
                      p.category === selectedCategory.id &&
                      p.subcategory === subcategory.id
                  );
                  return (
                    <button
                      key={subcategory.id}
                      onClick={() => handleSubcategoryClick(subcategory)}
                      className="group bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-200 dark:border-gray-700 text-left"
                    >
                      <div className="flex items-center justify-between">
                        <h3
                          key={`${subcategory.id}-${langVersion}`}
                          className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors"
                        >
                          {subcategory.name}
                        </h3>
                        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transform group-hover:translate-x-1 transition-all" />
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ===== Сетка товаров с пагинацией ===== */}
        {selectedCategory && selectedSubcategory && (
          <>
            <div className="mb-6 text-center">
              <p className="text-gray-600 dark:text-gray-400">
                {t("catalog.foundIn", {
                  count: filteredProducts.length,
                  name: selectedSubcategory.name,
                })}
                {searchQuery && t("catalog.querySuffix", { q: searchQuery })}
              </p>
            </div>

            {selectedCategory.id === "custom_logo" ? (
              (() => {
                const customItems = products.filter(
                  (p) =>
                    p.category === "custom_logo" &&
                    p.subcategory === selectedSubcategory.id
                );
                if (customItems.length === 0) {
                  return (
                    <div className="text-center py-10">
                      <p className="text-gray-600 dark:text-gray-300">
                        {t("catalog.templatesEmpty", {
                          name: selectedSubcategory.name,
                        })}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        {t("catalog.templatesEmptyHint")}
                      </p>
                    </div>
                  );
                }
                return (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {customItems.map((p) => {
                      const baseImageUrl = p.images?.[0]?.url || "";
                      const minOrder = parseInt(p.dimensions || "3000", 10) || 3000;
                      return (
                        <CustomLogoCard
                          key={p.id}
                          baseImageUrl={baseImageUrl}
                          name={p[`name_${lang}`] || p.name_ru || p.name}
                          price={Number(String(p.price).replace(/[^\d]/g, "")) || 1}
                          minOrder={minOrder}
                        />
                      );
                    })}
                  </div>
                );
              })()
            ) : (
              <div className="relative transition-all duration-500">
                {/* === Пагинированные товары === */}
                {(() => {
                  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
                  const paginatedProducts = filteredProducts.slice(
                    (currentPage - 1) * itemsPerPage,
                    currentPage * itemsPerPage
                  );

                  return (
                    <>
                      {/* Сетка карточек */}
                      <div
                        className={`transition-opacity duration-300 ${
                          loading ? "opacity-0" : "opacity-100"
                        }`}
                      >
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                          {(loading ? cachedProducts : paginatedProducts).map((product) => (
                            <ProductCard
                              key={product.id}
                              product={product}
                              onImageClick={() => setSelectedProduct(product)}
                              onAddToCart={handleAddToCart}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Нет товаров */}
                      {!loading && filteredProducts.length === 0 && (
                        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                          {t("catalog.notFound")}
                        </div>
                      )}

                      {/* === Пагинация === */}
                      {!loading && totalPages > 1 && (
                        <div className="flex justify-center mt-10 mb-6 gap-2 flex-wrap">
                          <button
                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                              currentPage === 1
                                ? "bg-gray-200 dark:bg-gray-700 text-gray-500 cursor-not-allowed"
                                : "bg-blue-600 text-white hover:bg-blue-700 dark:hover:bg-blue-500"
                            }`}
                          >
                            ←
                          </button>

                          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <button
                              key={page}
                              onClick={() => {
                                setCurrentPage(page);
                                window.scrollTo({ top: 0, behavior: "smooth" });
                              }}
                              className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all duration-300 ${
                                currentPage === page
                                  ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md"
                                  : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/30"
                              }`}
                            >
                              {page}
                            </button>
                          ))}

                          <button
                            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                              currentPage === totalPages
                                ? "bg-gray-200 dark:bg-gray-700 text-gray-500 cursor-not-allowed"
                                : "bg-blue-600 text-white hover:bg-blue-700 dark:hover:bg-blue-500"
                            }`}
                          >
                            →
                          </button>
                        </div>
                      )}
                    </>
                  );
                })()}
              </div>
            )}
          </>
        )}
      </div>

      {/* 🔹 Модалка товара */}
      {selectedProduct && (
        <ProductImageModal
          product={selectedProduct}
          isOpen={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
};

export default CatalogPage;