export interface Category {
  id: string;
  label: string;
  image: string;
  href: string;
  featured?: boolean; // aparece na home
}

export const categories: Category[] = [
  // Categorias em destaque na Home (featured: true)
  { id: "acao", label: "AÇÃO", image: "/action-category.png", href: "/shop", featured: true },
  { id: "terror", label: "TERROR", image: "/terror-category.png", href: "/shop", featured: true },
  { id: "indie", label: "INDIE", image: "/indie-category.png", href: "/shop", featured: true },
  { id: "multiplayer", label: "MULTIPLAYER", image: "/multiplayer-category.png", href: "/shop", featured: true },
  { id: "casuais", label: "CASUAIS", image: "/casual-category.png", href: "/shop", featured: true },
  { id: "corrida", label: "CORRIDA", image: "/race-category.png", href: "/shop", featured: true },

  // Categorias adicionais (só aparecem na página de categorias)
  { id: "rpg", label: "RPG", image: "/rpg-category.png", href: "/shop" },
  { id: "estrategia", label: "ESTRATÉGIA", image: "/strategy-category.png", href: "/shop" },
  { id: "simulacao", label: "SIMULAÇÃO", image: "/simulation-category.png", href: "/shop" },
  { id: "vr", label: "VR", image: "/vr-category.png", href: "/shop" },
  { id: "roguelike", label: "ROGUELIKE", image: "/roguelike-category.png", href: "/shop" },
  { id: "mundo-aberto", label: "MUNDO ABERTO", image: "/open-world-category.png", href: "/shop" },
  { id: "anime", label: "ANIME", image: "/anime-category.png", href: "/shop" },
  { id: "fabricacao", label: "FABRICAÇÃO", image: "/crafting-category.png", href: "/shop" },
  { id: "faca-o-que-quiser", label: "FAÇA O QUE QUISER", image: "/sandbox-category.png", href: "/shop" },
  { id: "colorido", label: "COLORIDO", image: "/colorful-category.png", href: "/shop" },
  { id: "boa-trama", label: "BOA TRAMA", image: "/story-rich-category.png", href: "/shop" },
  { id: "primeira-pessoa", label: "PRIMEIRA PESSOA", image: "/pov-category.png", href: "/shop" },
  { id: "sobrevivencia", label: "SOBREVIVÊNCIA", image: "/survival-category.png", href: "/shop" },
  { id: "atmosferico", label: "ATMOSFÉRICO", image: "/atmospheric-category.png", href: "/shop" },
  { id: "impiedoso", label: "IMPIEDOSO", image: "/unforgiving-category.png", href: "/shop" },
];