import React from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, Palette, Package, Truck } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function CustomLogoLanding() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
      {/* HERO */}
      <section className="relative bg-gradient-to-br from-blue-700 via-blue-600 to-blue-500 text-white py-24 overflow-hidden">
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative max-w-6xl mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold mb-4 drop-shadow-md">
            {t("logoLanding.hero.title")}
          </h1>
          <p className="text-lg md:text-xl mb-10 max-w-2xl mx-auto opacity-90 leading-relaxed">
            {t("logoLanding.hero.subtitle")}
          </p>
          <button
            onClick={() => navigate("/logo-editor")}
            className="bg-white text-blue-700 font-semibold px-6 py-3 rounded-xl shadow-lg hover:bg-gray-100 transition transform hover:-translate-y-1 flex items-center justify-center mx-auto gap-2"
          >
            <Sparkles className="w-5 h-5" />
            {t("logoLanding.hero.button")}
          </button>
        </div>
      </section>

      {/* PROCESS */}
      <section className="max-w-6xl mx-auto px-6 py-20 text-center">
        <h2 className="text-3xl font-bold mb-12 text-blue-700 dark:text-blue-400">
          {t("logoLanding.process.title")}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 hover:-translate-y-1 transition">
            <Palette className="w-10 h-10 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">
              {t("logoLanding.process.step1.title")}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {t("logoLanding.process.step1.text")}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 hover:-translate-y-1 transition">
            <Package className="w-10 h-10 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">
              {t("logoLanding.process.step2.title")}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {t("logoLanding.process.step2.text")}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 hover:-translate-y-1 transition">
            <Truck className="w-10 h-10 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">
              {t("logoLanding.process.step3.title")}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {t("logoLanding.process.step3.text")}
            </p>
          </div>
        </div>
      </section>

      {/* CASES */}
      <section className="bg-gray-100 dark:bg-gray-800 py-20">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-10 text-blue-700 dark:text-blue-400">
            {t("logoLanding.cases.title")}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto">
            {t("logoLanding.cases.subtitle")}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: t("logoLanding.cases.project1"), img: "/images/logo1.jpg" },
              { name: t("logoLanding.cases.project2"), img: "/images/logo2.jpg" },
              { name: t("logoLanding.cases.project3"), img: "/images/logo3.jpg" },
            ].map((c, i) => (
              <div
                key={i}
                className="rounded-2xl overflow-hidden bg-white dark:bg-gray-700 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition"
              >
                <img
                  src={c.img}
                  alt={c.name}
                  className="w-full h-56 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                    {c.name}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    {t("logoLanding.cases.description")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
