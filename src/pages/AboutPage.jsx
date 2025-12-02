import React from "react";
import { Shield, Truck, Users, Award } from "lucide-react";
import { useTranslation } from "react-i18next";

const AboutPage = () => {
  const { t } = useTranslation();

  const features = [
    {
      icon: Shield,
      title: t("about.features.reliability.title"),
      description: t("about.features.reliability.desc"),
    },
    {
      icon: Truck,
      title: t("about.features.delivery.title"),
      description: t("about.features.delivery.desc"),
    },
    {
      icon: Users,
      title: t("about.features.clients.title"),
      description: t("about.features.clients.desc"),
    },
    {
      icon: Award,
      title: t("about.features.quality.title"),
      description: t("about.features.quality.desc"),
    },
  ];

  const stats = [
    { number: "10+", label: t("about.stats.years") },
    { number: "100+", label: t("about.stats.clients") },
    { number: "100+", label: t("about.stats.products") },
    { number: "24/7", label: t("about.stats.support") },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            {t("about.title")} <span className="text-blue-600">Salt Lake</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            {t("about.subtitle")}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="text-center p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg"
            >
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {stat.number}
              </div>
              <div className="text-gray-600 dark:text-gray-300">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="bg-blue-100 dark:bg-blue-900 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                  <IconComponent className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Mission */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-white mb-16">
          <h2 className="text-3xl font-bold mb-4">{t("about.mission.title")}</h2>
          <p className="text-lg opacity-90 leading-relaxed">
            {t("about.mission.text")}
          </p>
        </div>

        {/* Values */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            {t("about.values.title")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-blue-600">
                {t("about.values.quality.title")}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {t("about.values.quality.text")}
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-blue-600">
                {t("about.values.reliability.title")}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {t("about.values.reliability.text")}
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-blue-600">
                {t("about.values.support.title")}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {t("about.values.support.text")}
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-blue-600">
                {t("about.values.development.title")}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {t("about.values.development.text")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
