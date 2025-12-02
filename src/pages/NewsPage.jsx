import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Calendar, ArrowRight } from "lucide-react";
import normalizeImageUrl from "../utils/normalizeImageUrl";
import { API_URL } from "../utils/api";

const NewsPage = () => {
  const { t, i18n } = useTranslation();
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedNews, setSelectedNews] = useState(null);

  useEffect(() => {
  const fetchNews = async () => {
    try {
      const lng = (i18n.language || "ru").split("-")[0];
      const res = await fetch(`${API_URL}/api/news?lng=${lng}`, {
        headers: { "Accept-Language": lng },
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.news)) {
        setNews(data.news);
      }
    } catch (err) {
      console.error(t("news.errorLoad"), err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ первый вызов независимо от языка
  fetchNews();

  // ✅ повторный вызов, когда язык меняется
  const timer = setTimeout(() => {
    if (i18n.language) fetchNews();
  }, 400);

  return () => clearTimeout(timer);
}, [i18n.language]);

  const formatDate = (dateString) => {
    const map = { ru: "ru-RU", kk: "kk-KZ", en: "en-US" };
    const lng = (i18n.language || "ru").split("-")[0];
    return new Date(dateString).toLocaleDateString(map[lng] || "ru-RU", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return <div className="p-8 text-center">{t("news.loading")}</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-8">
      <h1 className="text-4xl font-bold mb-10 text-gray-900 dark:text-white">
        {t("news.title")}
      </h1>

      {news.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-300">
          {t("news.empty")}
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {news.map((item) => {
            const lang = i18n.language?.split("-")[0] || "ru";
            const title =
              item[`title_${lang}`] || item.title_ru || item.title || t("news.noTitle");
            const excerpt =
              item[`excerpt_${lang}`] ||
              item.excerpt ||
              (item.content?.slice(0, 150) || "") + "...";
            const content =
              item[`content_${lang}`] || item.content_ru || item.content || "";

            return (
              <div
                key={item.id}
                className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer"
                onClick={() => setSelectedNews(item)}
              >
                <div className="relative overflow-hidden">
                  <img
                    src={normalizeImageUrl(item.imageUrl)}
                    alt={title}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      e.currentTarget.src = "/news-fallback.jpg";
                    }}
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                      {t("news.tag")}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-3">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(item.publishedAt)}</span>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                    {title}
                  </h3>

                  <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                    {excerpt}
                  </p>

                  <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold group-hover:gap-3 transition-all">
                    <span>{t("news.readMore")}</span>
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* === Модальное окно === */}
      {selectedNews && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="relative">
              <img
                src={normalizeImageUrl(selectedNews.imageUrl)}
                alt={selectedNews.title}
                className="w-full h-64 object-cover"
                onError={(e) => {
                  e.currentTarget.src = "/news-fallback.jpg";
                }}
              />
              <button
                onClick={() => setSelectedNews(null)}
                className="absolute top-4 right-4 bg-white dark:bg-gray-800 rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                aria-label={t("news.close")}
              >
                ✕
              </button>
            </div>

            <div className="p-8">
              {(() => {
                const lang = i18n.language?.split("-")[0] || "ru";
                const title =
                  selectedNews[`title_${lang}`] ||
                  selectedNews.title_ru ||
                  selectedNews.title ||
                  t("news.noTitle");
                const content =
                  selectedNews[`content_${lang}`] ||
                  selectedNews.content_ru ||
                  selectedNews.content ||
                  "";

                return (
                  <>
                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(selectedNews.publishedAt)}</span>
                      {selectedNews.author && (
                        <span>• {selectedNews.author}</span>
                      )}
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                      {title}
                    </h1>
                    <div className="prose dark:prose-invert max-w-none">
                      {content.split("\n").map((p, i) => (
                        <p
                          key={i}
                          className="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed"
                        >
                          {p}
                        </p>
                      ))}
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewsPage;
