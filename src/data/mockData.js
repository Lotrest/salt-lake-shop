// Mock data for the application

export const mockProducts = [
  {
    id: 1,
    name: "Зубной набор",
    description: "Качественный зубной набор для гостиниц",
    price: "195 ₸",
    category: "accessories",
    collection: "Standard",
    image: "https://customer-assets.emergentagent.com/job_retailtech-kz/artifacts/3x496cu5_%D1%89%D0%B5%D1%82%D0%BA%D0%B0.png",
    hasVariants: true,
    variants: [
      {
        id: "1a",
        name: "Зубной набор (закрытый)",
        description: "Качественный зубной набор в закрытой упаковке",
        price: "195 ₸",
        image: "https://customer-assets.emergentagent.com/job_retailtech-kz/artifacts/3x496cu5_%D1%89%D0%B5%D1%82%D0%BA%D0%B0.png"
      },
      {
        id: "1b",
        name: "Зубной набор (открытый)",
        description: "Профессиональный зубной набор в экологичной упаковке",
        price: "195 ₸",
        image: "https://customer-assets.emergentagent.com/job_retailtech-kz/artifacts/kpblw7yd_%D1%89%D0%B5%D1%82%D0%BA%D0%B0%20%D0%BE%D1%82%D0%BA%D1%80%D1%8B%D1%82%D0%B0%D1%8F.jpg"
      }
    ]
  },
  {
    id: 2,
    name: "Шапочка для душа",
    description: "Одноразовая шапочка для душа, гипоаллергенная",
    price: "95 ₸",
    category: "For the shower",
    image: "https://customer-assets.emergentagent.com/job_retailtech-kz/artifacts/kllp6pxq_%D1%88%D0%B0%D0%BF%D0%BE%D1%87%D0%BA%D0%B0.jpg",
    hasVariants: false
  },
  {
    id: 3,
    name: "Бритвенный набор",
    description: "Компактный бритвенный набор для гостей",
    price: "199 ₸",
    category: "accessories",
    collection: "Eco",
    image: "https://i.postimg.cc/pdLLqzpQ/image.png",
    hasVariants: false
  },
  {
    id: 4,
    name: "Косметический набор",
    description: "Компактный бритвенный набор для гостей",
    price: "108 ₸",
    category: "",
    image: "https://i.postimg.cc/Bvmdsw4y/image.jpg",
    hasVariants: false
  },
  {
    id: 5,
    name: "Расческа",
    description: "Компактный бритвенный набор для гостей",
    price: "119 ₸",
    category: "Hairbrush",
    image: "https://i.postimg.cc/9fDBRxys/image.jpg",
    hasVariants: false
  },
  {
    id: 6,
    name: "Рожок для обуви",
    description: "Компактный бритвенный набор для гостей",
    price: "118 ₸",
    category: "accessories",
    image: "https://i.postimg.cc/y6jSKmZR/image.jpg",
    hasVariants: false
  },
  {
    id: 7,
    name: "Губка для обуви",
    description: "Компактный бритвенный набор для гостей",
    price: "95 ₸",
    category: "accessories",
    image: "https://i.postimg.cc/52gC48GT/image.jpg",
    hasVariants: false
  },
  {
    id: 8,
    name: "Мочалка",
    description: "Компактный бритвенный набор для гостей",
    price: "248 ₸",
    category: "accessories",
    image: "https://i.postimg.cc/tJ4cc3Kb/image.png",
    hasVariants: false
  },
  {
    id: 9,
    name: "Салфетка для обуви",
    description: "Компактный бритвенный набор для гостей",
    price: "107 ₸",
    category: "accessories",
    image: "https://i.postimg.cc/KY4rC9zJ/image.png",
    hasVariants: false
  },
  {
    id: 10,
    name: "Санитарный пакет",
    description: "Компактный бритвенный набор для гостей",
    price: "107 ₸", 
    category: "accessories",
    image: "https://i.postimg.cc/QMR5whvd/image.jpg",
    hasVariants: false
  },
  {
    id: 11,
    name: "Швейный набор",
    description: "Компактный бритвенный набор для гостей",
    price: "108 ₸",
    category: "accessories",
    image: "https://i.postimg.cc/X77Z2rXg/image.png",
    hasVariants: false
  }
];

export const mockTestimonials = [
  {
    id: 1,
    name: "Асель Нурланова",
    position: "Директор отеля 'Алматы Плаза'",
    text: "Отличное качество продукции и профессиональный сервис. Сотрудничаем уже более 2 лет.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=80&h=80&fit=crop&crop=face"
  },
  {
    id: 2,
    name: "Бауржан Касымов",
    position: "Управляющий сетью ресторанов",
    text: "Быстрая доставка и всегда актуальный ассортимент. Рекомендуем всем коллегам.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face"
  },
  {
    id: 3,
    name: "Гульнар Абдуллаева",
    position: "Менеджер по закупкам",
    text: "Конкурентные цены и высокое качество. Очень довольны сотрудничеством.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face"
  }
];