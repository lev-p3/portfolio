export type Guest = {
  id: string;
  name: string;
  groupId: string;
  tableId: string;
  confirmed?: boolean;
};

export type GuestGroup = {
  id: string;
  name: string;
  note: string;
};

export type Table = {
  id: string;
  label: string;
  capacity: number;
  x: number;
  y: number;
};

export const wedding = {
  couple: "Александр & София",
  monogram: "A/S",
  dateIso: "2026-09-19T16:30:00+03:00",
  dateDisplay: "19 сентября 2026",
  timeDisplay: "16:30",
  venue: "Villa Verde, Подмосковье",
  address: "Лесная аллея, 17",
  heroImage: "/media/editorial-couple.png",
  cinemagraphs: [
    {
      title: "Утро в саду",
      poster: "/media/editorial-couple.png",
      video: "",
      caption: "Тихий свет, лен, шелк и первые бокалы просекко.",
    },
    {
      title: "Вечерние огни",
      poster: "/media/editorial-couple.png",
      video: "",
      caption: "Когда сад переходит в ночь, включаются свечи и искры.",
    },
  ],
  palette: [
    { name: "Sage", hex: "#4A5D23", text: "Глубокий зеленый шалфей" },
    { name: "Sand", hex: "#D8C3A5", text: "Теплый песочный" },
    { name: "Ivory", hex: "#FFF9F0", text: "Мягкий айвори" },
    { name: "Gold", hex: "#D4AF37", text: "Сдержанное золото" },
  ],
  dressCards: [
    {
      title: "Для неё",
      front: "Шелк, лен, сатин, мягкий драпированный силуэт.",
      details:
        "Платья-комбинации, костюмы из тонкого льна, миди и макси без активного принта. Украшения лучше выбрать деликатные: жемчуг, золото, прозрачные камни.",
      refs: ["silk slip", "linen suit", "sage midi", "gold accent"],
    },
    {
      title: "Для него",
      front: "Лен, шерсть fresco, светлые рубашки и глубокие зеленые акценты.",
      details:
        "Костюмы в sand, olive, graphite, молочные рубашки, лоферы или классические туфли. Галстук необязателен; платок или бутоньерка отлично поддержат палитру.",
      refs: ["linen blazer", "olive suit", "ivory shirt", "velvet loafer"],
    },
  ],
  timeline: [
    { time: "16:30", title: "Сбор гостей", text: "Welcome drinks и первые снимки в саду." },
    { time: "17:00", title: "Церемония", text: "Короткая камерная церемония на открытой террасе." },
    { time: "18:00", title: "Ужин", text: "Сезонное меню, тосты и мягкая неоклассика." },
    { time: "20:30", title: "Огни / Торт", text: "Сад зажигается, появляются искры и свечи." },
    { time: "21:00", title: "Танцы", text: "Плейлист становится смелее, ночь становится длиннее." },
  ],
};

export const groups: GuestGroup[] = [
  { id: "g1", name: "Семья Морозовых", note: "Родители и сестра невесты" },
  { id: "g2", name: "Семья Волковых", note: "Близкие родственники жениха" },
  { id: "g3", name: "Друзья пары", note: "Университет и путешествия" },
];

export const tables: Table[] = [
  { id: "t1", label: "Стол 1 · Семья", capacity: 8, x: 26, y: 34 },
  { id: "t2", label: "Стол 2 · Друзья", capacity: 10, x: 56, y: 35 },
  { id: "t3", label: "Стол 3 · Garden", capacity: 8, x: 42, y: 66 },
  { id: "t4", label: "Стол молодоженов", capacity: 4, x: 76, y: 62 },
];

export const guests: Guest[] = [
  { id: "p1", name: "Анна Морозова", groupId: "g1", tableId: "t1" },
  { id: "p2", name: "Ирина Морозова", groupId: "g1", tableId: "t1" },
  { id: "p3", name: "Дмитрий Морозов", groupId: "g1", tableId: "t1" },
  { id: "p4", name: "Михаил Волков", groupId: "g2", tableId: "t4" },
  { id: "p5", name: "Елена Волкова", groupId: "g2", tableId: "t4" },
  { id: "p6", name: "Мария Орлова", groupId: "g3", tableId: "t2" },
  { id: "p7", name: "Павел Соколов", groupId: "g3", tableId: "t2" },
  { id: "p8", name: "Ксения Белова", groupId: "g3", tableId: "t3" },
];
