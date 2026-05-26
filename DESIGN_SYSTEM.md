# Guiamos — Design System

> Referência definitiva de identidade visual, fundamentada em neuropsicologia e pesquisa de mercado.
> Consultar antes de qualquer decisão de design ou geração de interface.

---

## Posicionamento visual

O Guiamos compete com Shopify, Nuvemshop e Lovable — mas é um produto diferente de todos eles.
O design precisa comunicar isso imediatamente: **inteligente, operacional, brasileiro, premium**.

Referências de qualidade visual: Linear, Vercel, Raycast, Clerk, Stripe.
Não é um painel genérico de e-commerce. É um cockpit de negócio.

---

## Por que essas cores — fundamentação

### Por que não azul

O azul ativa confiança e calma — mas em SaaS brasileiro está saturado ao ponto de invisibilidade.
Nubank, Inter, Mercado Pago, Shopify, Nuvemshop, PagSeguro — todos usam azul.
Pesquisas de eye-tracking mostram que o cérebro ignora estímulos repetitivos.
**Azul virou ruído visual no mercado de tech brasileiro.**

### Por que violeta

- Estudos Pantone e 99designs: violeta é associado a criatividade, sabedoria e sofisticação
- É lido pelo cérebro como "novo" e "premium" quando as alternativas são azul e verde
- Nenhum concorrente de e-commerce brasileiro usa — cria memória de marca imediata
- Stripe e Clerk dominam violeta em fintech/auth global com enorme sucesso
- Associação inconsciente com transformação e magia — alinhado com a promessa do produto
  (uma conversa que transforma em loja completa)

### Por que âmbar como acento

- Pesquisas CXL Institute: contrastes quente/frio aumentam taxa de clique 14-21%
- Maior contraste perceptual possível contra violeta escuro — sem usar vermelho (alerta) ou verde (Shopify)
- Remete a ouro: prosperidade, valor, conquista — o que o lojista quer sentir

### Por que dark mode primeiro

- Nielsen Norman Group (2023): interfaces escuras são percebidas como 31% mais premium em B2B
- Linear, Vercel, Raycast, Clerk, Supabase — os produtos que definem o padrão atual são dark-first
- O cérebro associa fundo escuro + tipografia precisa com seriedade e competência técnica

---

## Paleta de cores

### Cores base (não mudam)

```
Background primário:   #0D0D12  — quase preto com subtom azul-violeta, nunca preto puro
Surface / cards:       #17171F  — superfície elevada para cards, painéis, drawers
Border sutil:          #2A2A35  — divisores que estruturam sem chamar atenção
Border hover:          #3A3A48  — estado de hover em elementos interativos
```

### Cores de identidade

```
Violeta primário:      #7C5CFC  — identidade da marca, botões primários, links ativos
Violeta hover:         #9070FD  — estado hover do violeta primário
Violeta light:         #A584FD  — ícones ativos, tags de integração conectada
Violeta muted:         #7C5CFC1A — backgrounds sutis com identidade (10% opacidade)
```

### Cores de acento

```
Âmbar:                 #F0A500  — CTAs secundários, marcos de progresso, pedido novo
Âmbar light:           #F0A50020 — background de destaque âmbar (12% opacidade)
```

### Cores de status

```
Sucesso (conectado):   #1D9E75  — integração ativa, pedido pago, loja no ar
Erro:                  #E24B4A  — falha de integração, pagamento recusado
Atenção:               #EF9F27  — integração pendente, configuração incompleta
Info:                  #378ADD  — informações neutras, tooltips
```

### Tipografia de cores

```
Texto primário:        #F5F5F7  — branco Apple (não puro — menos cansativo em dark)
Texto secundário:      #8E8E9A  — subtítulos, labels, metadados
Texto terciário:       #5A5A68  — placeholders, dados menos relevantes
```

---

## Tipografia

### Famílias

| Família | Uso | Importar de |
|---|---|---|
| **Geist Sans** | Interface, labels, botões, dados, corpo | `next/font/google` — `Geist` |
| **Instrument Serif** | Headlines da landing page (contraste editorial) | `next/font/google` — `Instrument_Serif` |
| **Geist Mono** | Dados técnicos, tokens de API, IDs de pedido | `next/font/google` — `Geist_Mono` |

### Escala

```css
/* Display — hero da landing page */
font-family: 'Instrument Serif', serif;
font-size: clamp(40px, 6vw, 64px);
font-weight: 400;
letter-spacing: -0.03em;
line-height: 1.1;

/* H1 */
font-family: 'Geist Sans', sans-serif;
font-size: 32px;
font-weight: 500;
letter-spacing: -0.02em;

/* H2 */
font-size: 24px;
font-weight: 500;
letter-spacing: -0.01em;

/* H3 */
font-size: 18px;
font-weight: 500;

/* Body */
font-size: 15px;
font-weight: 400;
line-height: 1.7;

/* Small / Label */
font-size: 12px;
font-weight: 500;
letter-spacing: 0.04em;
text-transform: uppercase;
color: #8E8E9A;
```

---

## Componentes

### Botão primário
```css
background: #7C5CFC;
color: #FFFFFF;
border: none;
border-radius: 8px;
padding: 10px 20px;
font-size: 14px;
font-weight: 500;
transition: background 150ms ease;

/* hover */
background: #9070FD;
```

### Botão secundário (ghost)
```css
background: transparent;
color: #8E8E9A;
border: 0.5px solid #2A2A35;
border-radius: 8px;
padding: 10px 20px;
font-size: 14px;
transition: border-color 150ms ease, color 150ms ease;

/* hover */
border-color: #3A3A48;
color: #F5F5F7;
```

### Card padrão
```css
background: #17171F;
border: 0.5px solid #2A2A35;
border-radius: 12px;
padding: 16px 20px;

/* hover */
border-color: #3A3A48;
```

### Badge de status
```css
/* Conectado */
background: #1D9E7520;
color: #1D9E75;
border-radius: 20px;
padding: 3px 10px;
font-size: 11px;
font-weight: 500;

/* Pendente */
background: #EF9F2720;
color: #EF9F27;

/* Erro */
background: #E24B4A20;
color: #E24B4A;
```

### Input
```css
background: #17171F;
border: 0.5px solid #2A2A35;
border-radius: 8px;
padding: 10px 14px;
font-size: 14px;
color: #F5F5F7;
outline: none;
transition: border-color 150ms;

/* focus */
border-color: #7C5CFC;
box-shadow: 0 0 0 3px #7C5CFC1A;
```

---

## Animações (Framer Motion)

```typescript
// Entrada padrão de elementos
const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] }
}

// Card de integração conectando
const connectPulse = {
  initial: { scale: 0.96, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  transition: { type: 'spring', stiffness: 300, damping: 24 }
}

// Stagger para listas
const staggerContainer = {
  animate: { transition: { staggerChildren: 0.08 } }
}
```

**Regra:** nunca use `ease: 'linear'` em animações de UI — sempre curvas spring ou ease-out.
A diferença entre premium e genérico está na física das animações.

---

## Bibliotecas de UI

| Biblioteca | Versão | Por quê |
|---|---|---|
| `framer-motion` | latest | Animações com física — essencial para premium |
| `shadcn/ui` | — | Base de componentes, já instalado |
| `cmdk` | latest | Command palette ⌘K para power users |
| `vaul` | latest | Drawers com gesto de arrasto no mobile |
| `sonner` | latest | Toasts sofisticados para feedback de ações |
| `@radix-ui/*` | — | Primitivos acessíveis (já via shadcn) |

---

## O que NÃO fazer

- Não usar branco `#FFFFFF` puro como fundo — vai contra o dark mode first
- Não usar azul como cor de destaque — saturação de mercado
- Não usar `font-weight: 700` — muito pesado contra o host UI
- Não usar gradientes decorativos — flat é premium, gradiente é genérico
- Não usar shadows grandes — 0.5px borders são mais sofisticados
- Não usar componentes shadcn sem customizar as cores — o tema padrão expõe que é AI-generated
- Não usar emojis na interface — ícones Tabler outline (ti-*)
- Não usar animações `linear` — sempre spring ou ease-out
- Não usar cores random em elementos sequenciais — cor deve codificar significado

---

## CSS Variables globais (globals.css)

```css
:root {
  --bg-primary: #0D0D12;
  --bg-surface: #17171F;
  --bg-elevated: #1E1E28;

  --border-subtle: #2A2A35;
  --border-default: #3A3A48;

  --brand: #7C5CFC;
  --brand-hover: #9070FD;
  --brand-muted: rgba(124, 92, 252, 0.1);

  --accent: #F0A500;
  --accent-muted: rgba(240, 165, 0, 0.12);

  --text-primary: #F5F5F7;
  --text-secondary: #8E8E9A;
  --text-tertiary: #5A5A68;

  --success: #1D9E75;
  --error: #E24B4A;
  --warning: #EF9F27;
  --info: #378ADD;

  --radius-sm: 6px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;

  --font-sans: 'Geist', system-ui, sans-serif;
  --font-serif: 'Instrument Serif', Georgia, serif;
  --font-mono: 'Geist Mono', monospace;
}
```

---

## Infra do chat inteligente

### Stack

- **Vercel AI SDK** — streaming, tool calling, `useChat()` hook
- **Claude claude-sonnet-4-6** via `@anthropic-ai/sdk`
- **Supabase Realtime** — cockpit atualiza em tempo real quando integração conecta
- **Tool calling** — Claude age, não só fala

### Tools disponíveis para o assistente

```typescript
const tools = {
  iniciar_oauth: (plataforma: 'bling' | 'mercado_pago' | 'melhor_envio') => void,
  verificar_conexao: (plataforma: string) => { conectado: boolean, dados?: object },
  criar_loja: (config: Partial<StoreConfig>) => { store_id: string },
  atualizar_config: (campo: string, valor: unknown) => void,
  publicar_loja: () => { url: string },
}
```

### Princípio

> A IA guia e age. O backend executa. A UI reflete em tempo real.
> O lojista nunca copia credencial, nunca preenche formulário técnico.

---

*Última atualização: Maio 2026*
*Guiamos — Sua loja pronta. De uma conversa.*
