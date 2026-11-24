export type CategoryId = "espressos" | "coados" | "gelados" | "comer" | "sem-cafe";

export type Badge = "da casa" | "vegano" | "sem glúten";

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  /** preço em centavos */
  price: number;
  category: CategoryId;
  badges?: Badge[];
  notes?: string;
}

export const categories: { id: CategoryId; label: string }[] = [
  { id: "espressos", label: "Espressos" },
  { id: "coados", label: "Coados" },
  { id: "gelados", label: "Gelados" },
  { id: "comer", label: "Para comer" },
  { id: "sem-cafe", label: "Sem café" },
];

// Preços e itens provisórios: revisar com a cafeteria antes de publicar.
export const menu: MenuItem[] = [
  { id: "espresso", name: "Espresso", description: "Dose curta do grão da semana, extraída em 28 segundos.", price: 850, category: "espressos", notes: "caramelo, cacau" },
  { id: "cortado", name: "Cortado", description: "Espresso com um dedo de leite vaporizado.", price: 1090, category: "espressos" },
  { id: "cappuccino", name: "Cappuccino", description: "Espresso duplo, leite cremoso e espuma fina.", price: 1450, category: "espressos" },
  { id: "flat-white", name: "Flat white", description: "Mais café, menos espuma. Servido em xícara de 180 ml.", price: 1590, category: "espressos", badges: ["da casa"] },
  { id: "latte", name: "Latte", description: "Espresso e leite vaporizado em copo alto.", price: 1550, category: "espressos" },

  { id: "v60", name: "Coado na V60", description: "Grão de origem única, preparado na hora em 3 minutos.", price: 1790, category: "coados", notes: "frutas vermelhas, mel" },
  { id: "chemex", name: "Chemex para dois", description: "500 ml de café filtrado, bom para dividir.", price: 3190, category: "coados", badges: ["da casa"], notes: "laranja, chocolate ao leite" },
  { id: "prensa", name: "Prensa francesa", description: "Corpo encorpado, infusão de 4 minutos.", price: 1950, category: "coados", notes: "nozes, rapadura" },

  { id: "cold-brew", name: "Cold brew", description: "Extraído a frio por 18 horas, servido com gelo.", price: 1690, category: "gelados", badges: ["vegano"] },
  { id: "espresso-tonica", name: "Espresso tônica", description: "Água tônica, gelo e uma dose dupla por cima.", price: 1850, category: "gelados", badges: ["vegano", "da casa"] },
  { id: "affogato", name: "Affogato", description: "Sorvete de baunilha com espresso quente derramado na mesa.", price: 2190, category: "gelados", badges: ["sem glúten"] },
  { id: "latte-gelado", name: "Latte gelado", description: "Espresso duplo, leite gelado e gelo.", price: 1750, category: "gelados" },

  { id: "pao-de-queijo", name: "Pão de queijo", description: "Três unidades, saídas do forno a cada hora.", price: 1190, category: "comer", badges: ["sem glúten"] },
  { id: "croissant", name: "Croissant de manteiga", description: "Massa folhada fermentada por dois dias.", price: 1490, category: "comer" },
  { id: "tosta-cogumelos", name: "Tosta de cogumelos", description: "Pão de fermentação natural, cogumelos salteados e tomilho.", price: 3290, category: "comer", badges: ["vegano"] },
  { id: "tosta-burrata", name: "Tosta de burrata", description: "Burrata, tomate assado e azeite no pão da casa.", price: 3790, category: "comer", badges: ["da casa"] },
  { id: "bolo-fuba", name: "Bolo de fubá", description: "Fatia generosa com goiabada cremosa.", price: 1250, category: "comer", badges: ["sem glúten"] },

  { id: "chocolate", name: "Chocolate quente", description: "Chocolate 60% cacau batido com leite.", price: 1650, category: "sem-cafe", badges: ["sem glúten"] },
  { id: "cha", name: "Chá da casa", description: "Folhas inteiras, escolha entre três blends do dia.", price: 1100, category: "sem-cafe", badges: ["vegano"] },
  { id: "matcha", name: "Matcha latte", description: "Matcha cerimonial batido à mão com leite vaporizado.", price: 1990, category: "sem-cafe" },
];

export const formatBRL = (cents: number) =>
  (cents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
