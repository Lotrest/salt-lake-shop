    import fs from 'fs';
    import path from 'path';
    import { fileURLToPath } from 'url';

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    console.log('🚀 Обновляем HomePage с переводами...');

    const homePagePath = path.join(__dirname, 'src', 'pages', 'HomePage.jsx');

    if (fs.existsSync(homePagePath)) {
    let content = fs.readFileSync(homePagePath, 'utf8');
    
    // Добавляем импорт useTranslation если его нет
    if (!content.includes("useTranslation")) {
        content = content.replace(
        "import React, { useEffect, useState } from \"react\";",
        "import React, { useEffect, useState } from \"react\";\nimport { useTranslation } from 'react-i18next';"
        );
    }
    
    // Добавляем useTranslation в компонент
    if (!content.includes("const { t } = useTranslation();")) {
        content = content.replace(
        "const HomePage = () => {",
        "const HomePage = () => {\n  const { t } = useTranslation();"
        );
    }
    
    // Заменяем тексты на переводы
    const replacements = [
        { search: 'Профессиональное решение для вашего бизнеса.', replace: "{t('home.subtitle1')}" },
        { search: 'Качественные товары и услуги с доставкой по всему Казахстану.', replace: "{t('home.subtitle2')}" },
        { search: 'Начать покупки →', replace: "{t('home.startShopping')}" },
        { search: 'Связаться с нами', replace: "{t('home.contactUs')}" },
        { search: 'Почему выбирают Salt Lake?', replace: "{t('home.whyChoose')}" },
        { search: 'Мы предоставляем комплексные решения для бизнеса с высоким качеством обслуживания', replace: "{t('home.whyDescription')}" },
        { search: 'Быстрая доставка', replace: "{t('home.fastDelivery')}" },
        { search: 'Доставка по всему Казахстану в кратчайшие сроки с возможностью отслеживания', replace: "{t('home.fastDeliveryDesc')}" },
        { search: 'Гарантия качества', replace: "{t('home.qualityGuarantee')}" },
        { search: 'Все товары проходят строгий контроль качества и имеют официальную гарантию', replace: "{t('home.qualityGuaranteeDesc')}" },
        { search: '24/7 Поддержка', replace: "{t('home.support')}" },
        { search: 'Круглосуточная техническая поддержка и консультации по всем вопросам', replace: "{t('home.supportDesc')}" },
        { search: 'Отзывы клиентов', replace: "{t('home.reviews')}" },
        { search: 'Средняя оценка', replace: "{t('home.averageRating')}" },
        { search: 'Отзывов пока нет. Будьте первым!', replace: "{t('home.noReviews')}" },
        { search: 'Оставить отзыв', replace: "{t('home.leaveReview')}" },
        { search: 'Ваше имя', replace: "{t('home.yourName')}" },
        { search: 'Оценка:', replace: "{t('home.rating')}:" },
        { search: 'Текст отзыва', replace: "{t('home.reviewText')}" },
        { search: 'Отправить', replace: "{t('home.send')}" },
        { search: 'Войдите в аккаунт, чтобы оставить отзыв.', replace: "{t('home.loginToReview')}" },
        { search: 'Готовы начать сотрудничество?', replace: "{t('home.readyToCooperate')}" },
        { search: 'Свяжитесь с нами сегодня и получите персональное предложение для вашего бизнеса', replace: "{t('home.ctaDescription')}" }
    ];
    
    replacements.forEach(({ search, replace }) => {
        const regex = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
        content = content.replace(regex, replace);
    });
    
    fs.writeFileSync(homePagePath, content);
    console.log('✅ HomePage обновлен с переводами!');
    } else {
    console.log('❌ HomePage.jsx не найден');
    }