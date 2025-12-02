export const PRODUCT_TEMPLATES = {
  box_tooth: {
    id: 'box_tooth',
    label: 'Зубные коробочки',
    // твой чистый мокап-фон (без текста): положи в /public/editor/...
    baseImage: '/editor/boxes/tooth-base@2000.png',
    // рабочее поле печати в пикселях исходного мокапа
    printArea: { x: 220, y: 520, w: 1560, h: 290 }, // вписывай по твоему макету
    // высокое разрешение для принта
    printSize: { w: 2128, h: 356 }, // то, что ты указал в UI
    backgroundTintable: true // даём менять цвет изделия (заливка под мокапом)
  },

  slippers: {
    id: 'slippers',
    label: 'Тапочки',
    baseImage: '/editor/slippers/slippers-base@2400.png',
    printArea: { x: 620, y: 650, w: 1160, h: 760 },
    printSize: { w: 1800, h: 1200 },
    backgroundTintable: false // тапочки белые — не тонируем
  },

  robe: {
    id: 'robe',
    label: 'Халаты',
    baseImage: '/editor/robes/robe-base@2400.png',
    printArea: { x: 720, y: 420, w: 980, h: 1180 },
    printSize: { w: 1300, h: 1600 },
    backgroundTintable: false
  }
};
