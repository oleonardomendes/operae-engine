// =============================================================
// DADOS DOS KITS — edite aqui para atualizar a landing page
// =============================================================

export interface KitItem {
  text: string;
}

export interface KitBonus {
  text: string;
  sub: string;
}

export interface Kit {
  id: number;
  tag: string;
  tagStyle: "entry" | "mid" | "pro";
  name: string;
  nameBreak: string;
  tagline: string;
  price: number;
  items: KitItem[];
  bonus: KitBonus | null;
  productImages: string[];
  checkoutEnvKey: string;
  featured: boolean;
  ctaStyle: "outline" | "main" | "amber";
}

export const kits: Kit[] = [
  {
    id: 1,
    tag: "Iniciante",
    tagStyle: "entry",
    name: "Kit Rio",
    nameBreak: "& Tilápia",
    tagline: "Chega no pesqueiro e já pesca — molinete leve, vara na medida e linha inclusa pra não perder nem um lance.",
    price: 199,
    items: [
      { text: "Molinete Enjoylure SE3000 — 10+1 rolamentos" },
      { text: "Vara Enjoylure Maciça 1,80m p/ Molinete — 20 a 65lbs" },
    ],
    bonus: {
      text: "Linha de Pesca 100m inclusa",
      sub: "Brinde exclusivo — sem custo adicional",
    },
    productImages: [
      "https://jyoywekxcuyjfynobkpv.supabase.co/storage/v1/object/public/produto-imagens/81025-1778301907989.jpg",
      "https://jyoywekxcuyjfynobkpv.supabase.co/storage/v1/object/public/produto-imagens/30751-1778302128836.jpg",
    ],
    checkoutEnvKey: "NEXT_PUBLIC_KIT1_URL",
    featured: false,
    ctaStyle: "outline",
  },
  {
    id: 2,
    tag: "Fundo",
    tagStyle: "mid",
    name: "Kit Pesqueiro",
    nameBreak: "Fundo",
    tagline: "Isca no fundo, fisgada pesada — montado pra encarar pacu, tambaqui e o que mais aparecer.",
    price: 259,
    items: [
      { text: "Molinete CMIK FB6000 — carretel alumínio, 6 rolamentos" },
      { text: "Vara Enjoylure Maciça 2,10m p/ Molinete — 60 a 100lbs" },
      { text: "Linha CMIK Monofilamento 0,35mm 500m — 11,3kg" },
    ],
    bonus: {
      text: "Chumbada inclusa",
      sub: "Pronto pra pesca de fundo — sem custo adicional",
    },
    productImages: [
      "https://jyoywekxcuyjfynobkpv.supabase.co/storage/v1/object/public/produto-imagens/80153-1778302175005.jpg",
      "https://jyoywekxcuyjfynobkpv.supabase.co/storage/v1/object/public/produto-imagens/30752-1778302234039.jpg",
      "https://jyoywekxcuyjfynobkpv.supabase.co/storage/v1/object/public/produto-imagens/80360-1778302395852.jpg",
    ],
    checkoutEnvKey: "NEXT_PUBLIC_KIT2_URL",
    featured: true,
    ctaStyle: "amber",
  },
  {
    id: 3,
    tag: "Superfície",
    tagStyle: "pro",
    name: "Kit Pesqueiro",
    nameBreak: "Superfície",
    tagline: "Domine o pesqueiro na boia — vara de carbono, carretilha de precisão e boia cevadeira inclusa pra montar o ponto certo.",
    price: 329,
    items: [
      { text: "Carretilha CMIK SP200 — 18+1 rolamentos, recolhimento 8.1:1" },
      { text: "Vara Enjoylure Fibra de Carbono 2,40m p/ Carretilha — 15 a 60lbs" },
      { text: "Linha CMIK Monofilamento 0,35mm 500m — 11,3kg" },
    ],
    bonus: {
      text: "Boia Cevadeira inclusa",
      sub: "Brinde exclusivo — sem custo adicional",
    },
    productImages: [
      "https://jyoywekxcuyjfynobkpv.supabase.co/storage/v1/object/public/produto-imagens/712-1778302004530.jpg",
      "https://jyoywekxcuyjfynobkpv.supabase.co/storage/v1/object/public/produto-imagens/81041-1-1778302281009.jpg",
      "https://jyoywekxcuyjfynobkpv.supabase.co/storage/v1/object/public/produto-imagens/80360-1778302395852.jpg",
    ],
    checkoutEnvKey: "NEXT_PUBLIC_KIT3_URL",
    featured: false,
    ctaStyle: "main",
  },
];
