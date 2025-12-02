import React, { useEffect, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";

import desktop1 from "../assets/images/myphoto3.jpg";
import mobile1 from "../assets/images/myphoto33.jpg";
import desktop2 from "../assets/images/myphoto.jpg";
import mobile2 from "../assets/images/myphoto_mobile.jpg";

export default function HeroSection() {
  const { t } = useTranslation();
  const [index, setIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const touchStartX = useRef(null);

  // ✅ Следим за размером экрана
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ✅ Слайды
  const SLIDES = [
    {
      id: "saltlake",
      title: "Salt Lake",
      subtitle: t("hero.saltlake.subtitle"),
      tagline: t("hero.tagline"),
      cta: { href: "/catalog", label: t("hero.saltlake.cta") },
      images: { desktop: desktop1, mobile: mobile1, lqip: desktop1 },
    },
    {
      id: "standard",
      title: "STANDARD COLLECTION",
      subtitle: t("hero.standard.subtitle"),
      tagline: t("hero.tagline"),
      cta: { href: "/catalog?cat=accessories&sub=standard", label: t("hero.standard.cta") },
      images: { desktop: desktop2, mobile: mobile2, lqip: desktop2 },
    },
  ];

  const next = useCallback(() => setIndex((i) => (i + 1) % SLIDES.length), []);
  const prev = useCallback(
    () => setIndex((i) => (i - 1 + SLIDES.length) % SLIDES.length),
    []
  );

  // ✅ Автопрокрутка
  useEffect(() => {
    const id = setInterval(next, 6000);
    return () => clearInterval(id);
  }, [next]);

  // ✅ Предзагрузка следующего слайда
  useEffect(() => {
    const preload = (src) => {
      if (!src) return;
      const img = new Image();
      img.src = src;
      img.decoding = "async";
    };
    const s = SLIDES[(index + 1) % SLIDES.length];
    preload(s.images.desktop);
    preload(s.images.mobile);
  }, [index]);

  // ✅ Обработка свайпов (мобильная версия)
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) next(); // свайп влево
      else prev(); // свайп вправо
    }
    touchStartX.current = null;
  };

  const slide = SLIDES[index];
  const currentImage = isMobile ? slide.images.mobile : slide.images.desktop;

  return (
    <section
      className="relative w-full overflow-hidden select-none"
      style={{ height: "100vh" }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* 🔹 Фон */}
      <AnimatePresence initial={false} mode="wait">
        <motion.img
          key={slide.id + (isMobile ? "_mobile" : "_desktop")}
          src={currentImage}
          alt={slide.title}
          decoding="async"
          fetchpriority="high"
          initial={{ opacity: 0.6, scale: 1.02 }}       // ⚡ сразу видно фон
          animate={{ opacity: 1, scale: 1 }}            // плавное проявление
          exit={{ opacity: 0.85, scale: 1.01 }}         // мягкий уход
          transition={{ duration: 0.35, ease: "easeOut" }} // быстрее появления
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: "center center" }}
          onError={(e) => (e.currentTarget.src = slide.images.lqip)}
        />
      </AnimatePresence>

      {/* затемнение */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />

      {/* 🔹 Контент */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 z-10">
        <motion.div
          key={slide.title}
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-white"
        >
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1 mb-4 backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-sm">{slide.tagline}</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold drop-shadow-lg">
            {slide.title}
          </h1>
          <p className="mt-4 text-lg md:text-2xl text-white/90 max-w-2xl mx-auto">
            {slide.subtitle}
          </p>

          <div className="mt-8">
            <a
              href={slide.cta.href}
              className="px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg transition"
            >
              {slide.cta.label}
            </a>
          </div>
        </motion.div>
      </div>

      {/* 🔹 Буллеты */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-10 flex gap-2">
        {SLIDES.map((s, i) => (
          <button
            key={s.id}
            onClick={() => setIndex(i)}
            className={`h-2.5 rounded-full transition-all ${
              i === index ? "w-8 bg-white" : "w-3 bg-white/60 hover:bg-white/90"
            }`}
          />
        ))}
      </div>

      {/* 🔹 Стрелки (только для ПК) */}
      {!isMobile && (
        <>
          <button
            onClick={prev}
            className="absolute left-6 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-3 rounded-full transition z-20"
          >
            <ChevronLeft size={28} />
          </button>
          <button
            onClick={next}
            className="absolute right-6 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-3 rounded-full transition z-20"
          >
            <ChevronRight size={28} />
          </button>
        </>
      )}
    </section>
  );
}
