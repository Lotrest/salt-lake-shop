import React from "react";
import { MapPin, Phone, Mail, Clock, MessageCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

const ContactsPage = () => {
  const { t } = useTranslation();

  const contactInfo = [
    {
      icon: MapPin,
      title: t("contacts.address"),
      content: t("contacts.addressValue"),
      description: t("contacts.addressDescription"),
    },
    {
      icon: Phone,
      title: t("contacts.phone"),
      content: "+7 (775) 701-62-66",
      description: t("contacts.phoneDescription"),
    },
    {
      icon: MapPin,
      title: t("contacts.branchAddress"),
      content: t("contacts.branchAddressValue"),
      description: t("contacts.branchAddressDescription"),
    },
    {
      icon: Phone,
      title: t("contacts.branchPhone"),
      content: t("contacts.branchPhoneNumber"),
      description: t("contacts.branchPhoneDescription"),
    },
    {
      icon: Mail,
      title: t("contacts.email"),
      content: "saltlake.kz@gmail.com",
      description: t("contacts.emailDescription"),
    },
    {
      icon: Clock,
      title: t("contacts.workingHours"),
      content: t("contacts.weekdays"),
      description: t("contacts.weekend"),
    },
  ];

  const openWhatsApp = () => {
    const phone = "77757016266";
    const message = t("contacts.whatsappMessage");
    const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  const callPhone = () => {
    window.location.href = "tel:+77757016266";
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            {t("contacts.title")}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            {t("contacts.subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                {t("contacts.contactInfo")}
              </h2>

              <div className="space-y-6">
                {contactInfo.map((item, index) => {
                  const IconComponent = item.icon;
                  return (
                    <div key={index} className="flex items-start space-x-4">
                      <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-xl flex-shrink-0">
                        <IconComponent className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
                          {item.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 text-lg font-medium">
                          {item.content}
                        </p>
                        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Contact Methods */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              {t("contacts.quickContact")}
            </h2>

            <div className="space-y-6">
              {/* WhatsApp */}
              <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-6">
                <div className="flex items-center space-x-3 mb-3">
                  <MessageCircle className="w-6 h-6 text-green-500" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    WhatsApp
                  </h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {t("contacts.whatsappDescription")}
                </p>
                <button
                  onClick={openWhatsApp}
                  className="w-full bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-lg transition-colors font-medium flex items-center justify-center space-x-2"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>{t("contacts.whatsappButton")}</span>
                </button>
              </div>

              {/* Phone */}
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6">
                <div className="flex items-center space-x-3 mb-3">
                  <Phone className="w-6 h-6 text-blue-600" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {t("contacts.phone")}
                  </h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {t("contacts.phoneDescription")}
                </p>
                <button
                  onClick={callPhone}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg transition-colors font-medium flex items-center justify-center space-x-2"
                >
                  <Phone className="w-5 h-5" />
                  <span>+7 (775) 701-62-66</span>
                </button>
              </div>

              {/* Telegram */}
<div className="bg-sky-50 dark:bg-sky-900/20 rounded-xl p-6">
  <div className="flex items-center space-x-3 mb-3">
    <MessageCircle className="w-6 h-6 text-sky-500" />
    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
      {t("contacts.telegramTitle")}
    </h3>
  </div>
  <p className="text-gray-600 dark:text-gray-300 mb-4">
    {t("contacts.telegramDescription")}
  </p>
  <button
    onClick={() => window.open("https://t.me/SaltLakeManagerbot", "_blank")}
    className="w-full bg-sky-500 hover:bg-sky-600 text-white py-3 px-4 rounded-lg transition-colors font-medium flex items-center justify-center space-x-2"
  >
    <MessageCircle className="w-5 h-5" />
    <span>{t("contacts.telegramButton")}</span>
  </button>
</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactsPage;
