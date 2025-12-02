import React, { useRef, useState, useMemo, useEffect } from "react";
import { MessageCircle, X, Send, Sparkles } from "lucide-react";
import { useCart } from "../contexts/CartContext";
import { useTranslation } from "react-i18next";
import ChatProductCard from "./ChatProductCard";

const API_URL = "https://my-backend-production-3416.up.railway.app";

const ChatWidget = () => {
  const { t, i18n } = useTranslation();
  const { cartItems } = useCart();

  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [typing, setTyping] = useState(false);
  const [showQuick, setShowQuick] = useState(true);

  // ✅ Сохраняем sessionId между перезагрузками
  const [sessionId, setSessionId] = useState(() => localStorage.getItem("chatSessionId"));

  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: t("chat.greeting"),
      products: [],
      ui: {},
    },
  ]);

  const bottomRef = useRef(null);

  // 📦 Снимок корзины (для контекста)
  const cartSnapshot = useMemo(
    () =>
      cartItems.map((i) => ({
        id: i.id,
        name: i.name,
        quantity: i.quantity,
      })),
    [cartItems]
  );

  // 🔽 Автопрокрутка вниз при появлении новых сообщений
  useEffect(() => {
    if (open && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [open, messages]);

  // 🤖 Отправка запроса к ассистенту
  const ask = async (text) => {
    if (!text.trim()) return;

    const newMessages = [...messages, { role: "user", content: text }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);
    setTyping(true);
    setShowQuick(false);

    try {
      const res = await fetch(`${API_URL}/api/assistant`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          messages: newMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
          // язык фиксируется при первом сообщении
          locale: sessionId ? undefined : i18n.language || "ru",
          cartSnapshot,
          limit: 33,
        }),
      });

      const data = await res.json();

      // ✅ Если сервер прислал новый sessionId — сохраняем
      if (data.sessionId && data.sessionId !== sessionId) {
        setSessionId(data.sessionId);
        localStorage.setItem("chatSessionId", data.sessionId);
      }

      const reply = data?.reply || t("chat.error.general");

      // ✅ Добавляем ответ ассистента
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: reply,
          products: data.products || [],
          ui: data.ui || {},
        },
      ]);
    } catch (err) {
      console.error("❌ Assistant error:", err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: t("chat.error.network"),
          products: [],
          ui: {},
        },
      ]);
    } finally {
      setLoading(false);
      setTyping(false);
    }
  };

  // ⚡ Быстрые кнопки
  const quick = [
    t("chat.quick.stars5"),
    t("chat.quick.logo"),
    t("chat.quick.delivery"),
    t("chat.quick.eco"),
  ];

  return (
    <>
      {/* === Кнопка открытия === */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 left-6 z-50 bg-[#1e3a8a] text-white p-4 rounded-full shadow-lg hover:bg-[#1e40af] transition-all animate-bounce-gentle"
          aria-label={t("chat.open")}
        >
          <MessageCircle className="w-6 h-6 animate-pulse-slow" />
        </button>
      )}

      {/* === Окно чата === */}
      {open && (
        <div className="fixed bottom-6 left-6 z-50 w-[92vw] max-w-md rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 flex flex-col animate-scale-in">
          {/* Заголовок */}
          <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src="/images/logo.png"
                alt="Salt Lake"
                className="w-7 h-7 rounded-lg object-contain"
              />
              <div>
                <div className="text-sm font-semibold text-gray-900 dark:text-white">
                  {t("chat.title")}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 animate-pulse-slow" />{" "}
                  {t("chat.status")}
                </div>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="p-2 text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition"
              aria-label={t("chat.close")}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* 💬 Сообщения */}
          <div className="px-3 py-3 space-y-3 h-80 overflow-y-auto">
            {messages.map((m, idx) => (
              <div key={idx} className="flex flex-col space-y-2 animate-slide-up">
                <div
                  className={`flex ${
                    m.role === "assistant" ? "justify-start" : "justify-end"
                  }`}
                >
                  <div
                    className={`${
                      m.role === "assistant"
                        ? "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                        : "bg-[#1e3a8a] text-white"
                    } px-3 py-2 rounded-2xl max-w-[80%] whitespace-pre-wrap`}
                  >
                    {m.content}
                  </div>
                </div>

                {/* 🛍️ Карточки продуктов */}
                {m.role === "assistant" && m.products?.length > 0 && (
                  <div className="grid grid-cols-2 gap-3 ml-2">
                    {m.products.map((p) => (
                      <ChatProductCard
                        key={p.id}
                        product={p}
                        cartLabel={m.ui?.cartLabel || "В корзину"}
                      />
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* ⌨️ Индикатор печати */}
            {typing && (
              <div className="flex justify-start">
                <div className="bg-gray-100 dark:bg-gray-800 text-gray-500 px-3 py-2 rounded-2xl text-sm flex gap-1">
                  <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></span>
                  <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* ⚙️ Быстрые кнопки */}
          {showQuick && (
            <div className="px-3 pb-2 flex gap-2 flex-wrap">
              {quick.map((q, i) => (
                <button
                  key={i}
                  onClick={() => ask(q)}
                  className="text-xs px-3 py-1 rounded-full border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition animate-fade-in"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* 📩 Поле ввода */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              ask(input);
            }}
            className="p-3 border-t border-gray-200 dark:border-gray-700 flex items-center gap-2"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t("chat.placeholder")}
              className="flex-1 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl px-3 py-2 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-[#1e3a8a] transition"
            />
            <button
              disabled={loading || !input.trim()}
              className="bg-[#1e3a8a] disabled:opacity-50 text-white px-3 py-2 rounded-xl hover:bg-[#1e40af] transition inline-flex items-center gap-1 animate-scale-in"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">{t("chat.send")}</span>
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default ChatWidget;
