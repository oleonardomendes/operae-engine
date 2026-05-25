# Operaê Engine — Regras de Arquitetura para o Claude Code

Leia este arquivo inteiro antes de qualquer alteração no projeto.
Estas regras não são sugestões — são invariantes da arquitetura.

---

## Contexto do projeto

Este repositório é a modularização do e-commerce Tá Pra Pesca em uma engine reutilizável para múltiplos clientes. O objetivo é que qualquer loja possa ser configurada apenas alterando `store-configs/<store-id>/store-config.json`, sem tocar no código.

O projeto usa **Next.js 15**, **TypeScript**, **Supabase** e **Tailwind CSS + shadcn/ui**.

---

## Regra 1 — Nenhum módulo lê `process.env` diretamente

**PROIBIDO em qualquer arquivo dentro de `src/modules/`:**
```ts
// ❌ NUNCA faça isso em um módulo
const token = process.env.BLING_ACCESS_TOKEN
const secret = process.env.MP_SECRET
```

**CORRETO — receba o config como parâmetro:**
```ts
// ✅ Sempre assim
import type { StoreConfig } from '@/lib/store-config'

export function createBlingClient(config: StoreConfig) {
  return new BlingClient({ accessToken: config.bling.access_token })
}
```

A única exceção é `src/lib/store-config.ts`, que é o único ponto do sistema que lê variáveis de ambiente.

---

## Regra 2 — Módulos não importam de outros módulos

**PROIBIDO:**
```ts
// ❌ src/modules/checkout/pix.ts importando de outro módulo
import { getBlingOrder } from '@/modules/bling/orders'
```

**CORRETO — módulos só importam de `src/lib/`:**
```ts
// ✅
import { supabase } from '@/lib/supabase'
import type { StoreConfig } from '@/lib/store-config'
```

Se dois módulos precisam compartilhar algo, esse algo vai para `src/lib/`.

---

## Regra 3 — Cada módulo tem um `index.ts` que exporta tudo

Toda interface pública de um módulo passa pelo `index.ts`. Nenhum arquivo fora do módulo importa de um arquivo interno diretamente.

```
src/modules/bling/
├── client.ts       ← instância do client Bling
├── products.ts     ← sync de produtos
├── orders.ts       ← criação de pedidos
├── contacts.ts     ← busca/criação de contatos
└── index.ts        ← exporta tudo que é público
```

```ts
// ✅ Importação correta de fora do módulo
import { syncBlingProducts, createBlingOrder } from '@/modules/bling'

// ❌ Importação proibida de fora do módulo
import { syncBlingProducts } from '@/modules/bling/products'
```

---

## Regra 4 — `store_id` em toda operação de banco

Toda query no Supabase que acessa dados de loja inclui `store_id`. Nunca faça uma query sem filtrar por loja.

```ts
// ❌ Sem store_id — vaza dados entre lojas
const { data } = await supabase.from('produtos').select('*')

// ✅ Sempre com store_id
const { data } = await supabase
  .from('produtos')
  .select('*')
  .eq('store_id', config.store_id)
```

---

## Regra 5 — Webhooks identificam a loja pelo payload

Todo webhook recebido (Mercado Pago, Bling, Melhor Envio) deve identificar a loja pelo `store_id` antes de processar.

```ts
// ✅ Padrão de roteamento de webhook
export async function POST(req: NextRequest) {
  const body = await req.json()
  const storeId = body.metadata?.store_id ?? body.external_reference?.split(':')[0]
  const config = loadStoreConfig(storeId)
  // ... processar com o config correto
}
```

---

## Regra 6 — Erros são tipados e nunca silenciosos

```ts
// ❌ Erro silencioso
try {
  await createBlingOrder(config, order)
} catch {}

// ✅ Erro propagado com contexto
try {
  await createBlingOrder(config, order)
} catch (err) {
  throw new Error(`[bling] Falha ao criar pedido ${order.id}: ${err instanceof Error ? err.message : err}`)
}
```

---

## Regra 7 — Tipos antes de implementação

Antes de implementar qualquer função nova, defina o tipo de entrada e saída. Sem `any`. Sem `as unknown as`.

```ts
// ❌
async function processBlingWebhook(data: any) {}

// ✅
interface BlingWebhookPayload {
  evento: 'produto' | 'pedido' | 'contato'
  dados: { id: number; situacao: string }
}
async function processBlingWebhook(payload: BlingWebhookPayload): Promise<void> {}
```

---

## Regra 8 — Sem lógica de negócio nas rotas Next.js

Rotas em `src/app/api/` fazem apenas: autenticação, validação de input, chamada de módulo, retorno de resposta. Lógica fica nos módulos.

```ts
// ✅ Rota limpa
export async function POST(req: NextRequest) {
  const user = await getAuthUser(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = WebhookSchema.parse(await req.json())
  const config = loadStoreConfig(body.store_id)

  await processCheckoutWebhook(config, body)  // lógica no módulo

  return NextResponse.json({ ok: true })
}
```

---

## Estrutura obrigatória de pastas

```
operae-engine/
├── store-configs/
│   ├── _template/            ← base para novo cliente (commitar)
│   │   └── store-config.json
│   └── <store-id>/           ← uma pasta por cliente
│       ├── store-config.json ← commitar (sem secrets)
│       └── .env.local        ← NUNCA commitar
├── src/
│   ├── modules/
│   │   ├── bling/
│   │   ├── checkout/
│   │   ├── shipping/
│   │   ├── storefront/
│   │   └── analytics/
│   ├── lib/
│   │   ├── store-config.ts   ← único ponto que lê env vars
│   │   ├── supabase.ts
│   │   └── constants.ts
│   └── app/
├── scripts/
│   ├── validate-config.ts
│   └── test-module.ts
└── CLAUDE.md                 ← este arquivo
```

---

## Como adicionar um novo módulo

1. Criar pasta `src/modules/<nome>/`
2. Criar `index.ts` com as exportações públicas
3. Todas as funções recebem `config: StoreConfig` como primeiro parâmetro
4. Nunca ler `process.env` dentro do módulo
5. Adicionar entrada na tabela de módulos do `README.md`
6. Testar isolado: `npx tsx scripts/test-module.ts -- <nome> <store-id>`

---

## Como extrair código existente para um módulo

1. Identificar todos os `process.env.*` usados pelo código
2. Adicionar os campos correspondentes ao `StoreConfig` e ao `store-config.json`
3. Mover o código para `src/modules/<nome>/`
4. Substituir leituras de `process.env` por `config.<campo>`
5. Rodar o projeto e confirmar que a loja de teste continua funcionando
6. Busca global por `process.env.BLING`, `process.env.MP_`, `process.env.ME_` — nenhuma ocorrência deve restar dentro de módulos

---

## Regra 9 — Nenhum cliente hardcoded no código

O operae-engine é uma plataforma, não uma loja.
**NUNCA** use `store_id` com valor fixo no código (`'taprapesca'`, `'cliente-x'`, etc.).

O `storeId` vem sempre de uma destas fontes:

- **Rotas autenticadas:** `user.user_metadata.store_id` (via `createAuthClient()`)
- **Webhooks:** query param `?store_id=` na URL registrada no provedor
- **Rota OAuth:** query param `?store_id=` validado contra tabela `stores`
- **Rotas de storefront (sem auth):** `loadStoreConfig()` lê `process.env.STORE_ID` do deployment

```ts
// ❌ NUNCA faça isso
const storeId = 'taprapesca'

// ✅ Rota autenticada
const { data: { user } } = await createAuthClient().auth.getUser()
const storeId = user?.user_metadata?.store_id

// ✅ Webhook MP
const storeId = new URL(req.url).searchParams.get('store_id')

// ✅ Storefront (deployment-scoped)
const config = loadStoreConfig() // lê STORE_ID do env
```

Qualquer `const storeId = 'valor-fixo'` é uma violação desta regra.

---

## Variável de ambiente que controla a loja ativa

```bash
# .env.local na raiz — define a loja do deployment de storefront
STORE_ID=<store-id>
```

O `loadStoreConfig()` usa `process.env.STORE_ID` para saber qual loja carregar.
Esta é a **única** variável de ambiente que o código principal lê diretamente.

---

## Critério de sucesso

> Criar `store-configs/loja-teste/store-config.json` com dados fictícios, rodar `STORE_ID=loja-teste npm run dev` e a aplicação iniciar com as configurações da loja de teste — sem alterar uma linha de código dos módulos.
