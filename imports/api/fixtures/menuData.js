export const MENU_CATEGORIES = [
  { id: 'all',     label: 'Всё меню', image: '⚡' },
  { id: 'pizza',   label: 'Пицца',    image: '🍕' },
  { id: 'sushi',   label: 'Суши',     image: '🍱' },
  { id: 'hot',     label: 'Горячее',  image: '🍜' },
  { id: 'burgers', label: 'Бургеры',  image: '🍔' },
  { id: 'drinks',  label: 'Напитки',  image: '🥤' }
];

export const INITIAL_MENU_ITEMS = [
  // Пицца
  {
    name: 'Пицца Масала',
    category: 'pizza',
    price: 499,
    description: '30 см, традиционное тесто, 600 г',
    image: '/menu/pizza/masala.webp'
  },
  {
    name: 'Пицца Пепперони',
    category: 'pizza',
    price: 390,
    description: '30 см, традиционное тесто, 550 г',
    image: '/menu/pizza/peperoni.webp'
  },
  {
    name: 'Пицца Сырная',
    category: 'pizza',
    price: 599,
    description: '30 см, традиционное тесто, 470 г',
    image: '/menu/pizza/cheese.webp'
  },
  {
    name: 'Пицца Мясной микс',
    category: 'pizza',
    price: 699,
    description: '30 см, традиционное тесто, 590 г',
    image: '/menu/pizza/meat.webp'
  },
  {
    name: 'Пицца Карбонара',
    category: 'pizza',
    price: 499,
    description: '30 см, традиционное тесто, 590 г',
    image: '/menu/pizza/сarbonara.webp'
  },

  // Суши
  {
    name: 'Сет Вкуснофф',
    category: 'sushi',
    price: 1749,
    description: '170 Ккал • 7 г белка • 12 г жира • 30 г углеводов',
    image: '/menu/suhi/siake.png'
  },
  {
    name: 'Сет Комбо',
    category: 'sushi',
    price: 1969,
    description: '230 Ккал • 9 г белка • 12 г жира • 35 г углеводов',
    image: '/menu/suhi/hanami.png'
  },
  {
    name: 'Сет Клёвый',
    category: 'sushi',
    price: 1530,
    description: '200 Ккал • 10 г белка • 9 г жира • 18 г углеводов',
    image: '/menu/suhi/klev.png'
  },
  {
    name: 'Сет Антикризисный',
    category: 'sushi',
    price: 1499,
    description: 'Калифорния темпура, Запечённый с курицей, Чикен краб, Чука темпура, 32 шт',
    image: '/menu/suhi/shef.png'
  },
  {
    name: 'Сет Филармония',
    category: 'sushi',
    price: 1400,
    description: 'Сакана хот, Бекон темпура, Калифорния, Сим Сим, 32 шт',
    image: '/menu/suhi/filarmonia.png'
  },

  // Горячее
  {
    name: 'Курица на углях',
    category: 'hot',
    price: 1120,
    description: 'Цыплёнок-бройлер, масло растительное, соль, специи',
    image: '/menu/hot/kur.png'
  },
  {
    name: 'Свинина с картофелем',
    category: 'hot',
    price: 480,
    description: 'Свинина, картофель отварной, зелёный лук',
    image: '/menu/hot/svin.png'
  },
  {
    name: 'Сковородка со свининой',
    category: 'hot',
    price: 549,
    description: 'Свинина, морковь, лук, болгарский перец, картофель, помидор, чеснок, зелень, цукини',
    image: '/menu/hot/skovorod.png'
  },
  {
    name: 'Курочка в сливках с картофелем',
    category: 'hot',
    price: 430,
    description: 'Картофель, куриное бедро, шампиньоны, лук, сыр гауда, сливки, черри, зелень',
    image: '/menu/hot/kursliv.png'
  },
  {
    name: 'Наггетсы куриные',
    category: 'hot',
    price: 250,
    description: 'Наггетсы куриные, 10 шт',
    image: '/menu/hot/naget.png'
  },

  // Бургеры
  {
    name: 'Месть мясника',
    category: 'burgers',
    price: 900,
    description: 'Котлеты из мраморной говядины',
    image: '/menu/burger/mesnick.png'
  },
  {
    name: 'Стартер',
    category: 'burgers',
    price: 385,
    description: 'Котлета из мраморной говядины, сыры чеддер и моцарелла',
    image: '/menu/burger/starter.png'
  },
  {
    name: 'Беконатор',
    category: 'burgers',
    price: 865,
    description: 'Говяжья котлета, сыры чеддер и моцарелла, обжаренный бекон',
    image: '/menu/burger/beconator.png'
  },
  {
    name: 'Казак',
    category: 'burgers',
    price: 550,
    description: 'Говяжья котлета, фирменный соус и барбекю, томат',
    image: '/menu/burger/kazak.png'
  },
  {
    name: 'Фёдор',
    category: 'burgers',
    price: 1740,
    description: '4 котлеты из мраморной говядины, сыры чеддер и моцарелла, лук гриль',
    image: '/menu/burger/fedor.png'
  },

  // Напитки
  {
    name: 'Эвервесс Кола',
    category: 'drinks',
    price: 189.99,
    description: 'EVERVESS Cola – современная и вкусная кола от бренда премиальных газированных напитков',
    image: '/menu/drinks/cola.webp'
  },
  {
    name: 'Эвервесс Кола б/с 0,5',
    category: 'drinks',
    price: 189.99,
    description: 'EVERVESS Cola Без Сахара освежит бодрящей волной пузырьков и подарит яркий вкус',
    image: '/menu/drinks/colazero.webp'
  },
  {
    name: 'Вода Аква Минерале газ 0,5',
    category: 'drinks',
    price: 169.99,
    description: 'Aqua Minerale — питьевая вода с свежим и мягким вкусом',
    image: '/menu/drinks/aqua.webp'
  },
  {
    name: 'Фрустайл Лимон Лайм 0,5',
    category: 'drinks',
    price: 189.99,
    description: 'Frustyle — необычный газированный напиток / лимонад',
    image: '/menu/drinks/lemon.png'
  },
  {
    name: 'Липтон Лимон 0,5',
    category: 'drinks',
    price: 214.99,
    description: 'Lipton Ice Tea Lemon — освежающее яркое удовольствие в любое время года',
    image: '/menu/drinks/lipton.webp'
  }
];
