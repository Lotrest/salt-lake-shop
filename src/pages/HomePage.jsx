import React, { useEffect, useState } from "react";
import { Truck, Shield, Headphones, Star, Quote, Phone } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useTranslation } from "react-i18next";
import LoadingSpinner from "../components/LoadingSpinner";
import AuthModal from "../components/AuthModal";
import HeroSection from "../components/HeroSection";
import NewsSection from "../components/NewsSection";

const API_URL = "https://my-backend-production-3416.up.railway.app";

const HomePage = () => {
  const { user } = useAuth();
  const { t } = useTranslation();

  const [reviews, setReviews] = useState([]);
  const [form, setForm] = useState({ name: "", text: "", stars: 5 });
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // ===============================
  // 🔹 Загрузка отзывов
  // ===============================
  const fetchReviews = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`${API_URL}/api/reviews`, {
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) {
        const data = await res.json();
        setReviews(
          data.success && Array.isArray(data.reviews) ? data.reviews : []
        );
      } else {
        setReviews([]);
      }
    } catch (error) {
      console.error("Ошибка загрузки отзывов:", error);
      setReviews([]);
    } finally {
      setIsLoading(false);
    }
  };

  // ===============================
  // 🔹 Добавление отзыва
  // ===============================
  const addReview = async (e) => {
    e.preventDefault();
    if (!user) return;
    if (!form.name.trim() || !form.text.trim()) return;
    const stars = Math.min(5, Math.max(1, Number(form.stars) || 5));
    try {
      const res = await fetch(`${API_URL}/api/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: form.name.trim(),
          text: form.text.trim(),
          stars,
        }),
      });
      if (res.ok) {
        setForm({ name: "", text: "", stars: 5 });
        fetchReviews();
      }
    } catch (error) {
      console.error("Ошибка добавления отзыва:", error);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const avg = reviews.length
    ? (reviews.reduce((s, r) => s + (r.stars || 5), 0) / reviews.length).toFixed(1)
    : null;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="large" text={t("home.loading")} />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* ===== Hero Section ===== */}
      <HeroSection />

      {/* ===== Преимущества ===== */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              {t("home.whyChoose")}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              {t("home.whyDescription")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Truck,
                title: t("home.fastDelivery"),
                description: t("home.fastDeliveryDesc"),
                gradient: "from-green-500 to-blue-500",
              },
              {
                icon: Shield,
                title: t("home.qualityGuarantee"),
                description: t("home.qualityGuaranteeDesc"),
                gradient: "from-blue-500 to-purple-500",
              },
              {
                icon: Headphones,
                title: t("home.support"),
                description: t("home.supportDesc"),
                gradient: "from-purple-500 to-pink-500",
              },
            ].map((f, i) => (
              <div
                key={i}
                className="group bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 dark:border-gray-700"
              >
                <div
                  className={`bg-gradient-to-r ${f.gradient} w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                >
                  <f.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {f.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {f.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Новости ===== */}
      <NewsSection />

      {/* ===== Контакты ===== */}
      <section className="py-16 bg-gradient-to-r from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {t("home.contactUsTitle")}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto">
            {t("home.contactUsSubtitle")}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {/* Казахстан */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
              <div className="flex flex-col items-center space-y-3">
                <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full">
                  <Phone className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {t("home.kazakhstanTitle")}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-lg font-medium">
                  {t("home.kazakhstanPhone")}
                </p>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  {t("home.kazakhstanDesc")}
                </p>
                <a
                  href="tel:+77757016266"
                  className="mt-4 inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  {t("home.callNow")}
                </a>
              </div>
            </div>

            {/* Кыргызстан */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
              <div className="flex flex-col items-center space-y-3">
                <div className="bg-green-100 dark:bg-green-900 p-3 rounded-full">
                  <Phone className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {t("home.kyrgyzstanTitle")}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-lg font-medium">
                  {t("home.kyrgyzstanPhone")}
                </p>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  {t("home.kyrgyzstanDesc")}
                </p>
                <a
                  href="tel:+996707123456"
                  className="mt-4 inline-block bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  {t("home.callNow")}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Отзывы ===== */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              {t("home.reviewsTitle")}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              {t("home.reviewsSubtitle")}
            </p>
          </div>

          {/* Средний рейтинг */}
          {avg && (
            <div className="flex justify-center items-center mb-12">
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-4">
                  <div className="text-5xl font-bold text-yellow-500">{avg}</div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1 mb-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-6 h-6 ${
                            star <= Math.round(avg)
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-gray-600 dark:text-gray-400">
                      {t("home.basedOnReviews", { count: reviews.length })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Отзывы */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {reviews.slice(0, 6).map((review) => (
              <div
                key={review.id}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 dark:border-gray-700 group"
              >
                <Quote className="w-8 h-8 text-blue-500 mb-4 opacity-50 transform rotate-180" />
                <div className="flex items-center gap-2 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${
                        star <= (review.stars || 5)
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed italic">
                  "{review.text}"
                </p>
                <div className="flex items-center gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {review.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {review.name}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(review.created_at).toLocaleDateString("ru-RU", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Форма */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-gray-700 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 text-center">
              {t("home.leaveReview")}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
              {t("home.shareExperience")}
            </p>

            <form onSubmit={addReview} className="space-y-6">
              {!user ? (
                <div className="text-center py-4">
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {t("home.loginToReview")}
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsAuthModalOpen(true)}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {t("home.login")}
                  </button>
                </div>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t("home.yourName")}
                    </label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, name: e.target.value }))
                      }
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder={t("home.namePlaceholder")}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t("home.rating")}
                    </label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() =>
                            setForm((p) => ({ ...p, stars: star }))
                          }
                          className={`p-2 rounded-lg transition-all duration-200 ${
                            form.stars >= star
                              ? "bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-400"
                              : "bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500 hover:bg-yellow-50"
                          }`}
                        >
                          <Star
                            className={`w-6 h-6 ${
                              form.stars >= star ? "fill-current" : ""
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t("home.reviewText")}
                    </label>
                    <textarea
                      rows="4"
                      value={form.text}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, text: e.target.value }))
                      }
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                      placeholder={t("home.reviewPlaceholder")}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={!form.name.trim() || !form.text.trim()}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 px-6 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                  >
                    {t("home.publishReview")}
                  </button>
                </>
              )}
            </form>
          </div>
        </div>
      </section>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
};

export default HomePage;
