# Operaê Engine

> Motor de e-commerce operacional brasileiro — modular, integrável e pronto para produção.

---

## O que é

O Operaê Engine é o núcleo técnico do [Operaê](https://operae.com.br): uma engine de e-commerce construída para o mercado brasileiro, com todas as integrações que lojistas realmente precisam funcionando desde o primeiro dia.

Este repositório é o laboratório de modularização da engine. O objetivo é extrair cada integração do projeto original (Tá Pra Pesca) em módulos independentes, reutilizáveis e configuráveis por loja — sem reescrever o que já funciona em produção.

---

## Contexto

O Tá Pra Pesca (`taprapesca.com.br`) é a prova de conceito viva da engine. Tudo que está neste repositório foi extraído de um sistema funcionando em produção, com pedidos reais, pagamentos reais e logística automatizada.

A modularização transforma esse sistema específico em um template genérico que pode ser implantado para qualquer lojista em horas.

---

## Módulos

| Módulo | Responsabilidade | Status |
|---|---|---|
| `store-config` | Configuração por loja (credenciais, tema, margens) | 🔄 Em extração |
| `bling` | Sincronização bidirecional com ERP Bling | 🔄 Em extração |
| `checkout` | PIX nativo + Mercado Pago + cálculo de frete | 🔄 Em extração |
| `shipping` | Melhor Envio — carrinho, rastreio, NF-e | 🔄 Em extração |
| `storefront` | Catálogo, PDP, landing pages, painel admin | 🔄 Em extração |
| `analytics` | GTM, Meta Pixel, GA4, TikTok Pixel, Google Ads | 🔄 Em extração |

---

## Stack

- **Framework:** Next.js 15 + React 19 + TypeScript
- **Banco de dados:** Supabase (Postgres + Auth + Realtime)
- **Deploy:** Vercel + Cloudflare CDN
- **ERP:** Bling (OAuth 2.0, sync bidirecional)
- **Pagamento:** Mercado Pago (PIX nativo + Checkout Pro)
- **Frete:** Melhor Envio (cálculo real + carrinho automatizado)
- **Email:** Resend
- **UI:** Tailwind CSS + shadcn/ui

---

## Como funciona a configuração por loja

Cada loja tem seu próprio `store-config.json` em `store-configs/<store-id>/`. O código nunca lê variáveis de ambiente diretamente — sempre lê via `loadStoreConfig()`.

```
store-configs/
├── taprapesca/
│   ├── store-config.json    ← configurações da loja
│   └── .env.local           ← secrets (nunca commitado)
└── _template/
    └── store-config.json    ← base para novo cliente
```

Para rodar localmente apontando para uma loja específica:

```bash
STORE_ID=taprapesca npm run dev
```

---

## Estrutura do projeto

```
operae-engine/
├── store-configs/          ← configuração por cliente
├── src/
│   ├── modules/            ← módulos extraídos (bling, checkout, shipping...)
│   ├── lib/                ← utilitários compartilhados
│   │   ├── store-config.ts ← loader de configuração
│   │   ├── supabase.ts
│   │   └── constants.ts
│   └── app/                ← rotas Next.js
├── scripts/
│   ├── validate-config.ts  ← valida store-config antes de implantar
│   └── test-module.ts      ← testa módulo isolado sem Next.js
└── package.json
```

---

## Rodando localmente

```bash
# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp store-configs/_template/.env.example store-configs/taprapesca/.env.local
# Preencher os valores no .env.local

# Rodar em desenvolvimento
STORE_ID=taprapesca npm run dev
```

---

## Validando um módulo isolado

```bash
# Testa o módulo Bling sem precisar subir o Next.js
npx tsx scripts/test-module.ts -- bling taprapesca

# Valida o store-config de um cliente antes de implantar
npx tsx scripts/validate-config.ts -- taprapesca
```

---

## Critério de sucesso da modularização

> Consigo criar `store-configs/novo-cliente/store-config.json`, rodar `STORE_ID=novo-cliente npm run dev` e a loja abre com nome, cores e integrações do novo cliente — sem alterar uma linha de código.

Se qualquer módulo ainda lê `process.env.BLING_*`, `process.env.MP_*` ou `process.env.ME_*` diretamente, a extração não está completa.

---

## Ecossistema Operaê

| Produto | Repositório | Status |
|---|---|---|
| **Operaê Engine** | `operae-engine` (este repo) | Em modularização |
| **Guiamos** | `listify` | Em produção — [guiamos.com.br](https://guiamos.com.br) |
| **Tá Pra Pesca** | `ta-pra-pesca` | Em produção — prova de conceito da engine |

---

## Roadmap

- [ ] Extrair `store-config.json` e loader tipado
- [ ] Adicionar `store_id` em todas as tabelas Supabase
- [ ] Extrair módulo `bling`
- [ ] Extrair módulo `checkout`
- [ ] Extrair módulo `shipping`
- [ ] Extrair módulo `storefront`
- [ ] Extrair módulo `analytics`
- [ ] Criar `scripts/validate-config.ts`
- [ ] Implantar segundo cliente (segmento diferente de pesca)
- [ ] Multi-tenant: subdomínio por loja (`cliente.operae.com.br`)

---

## Time

**Léo Mendes** — Tech Lead  
**Lucas Carvalho** — Business Lead

---

*Operaê • Maio 2026*