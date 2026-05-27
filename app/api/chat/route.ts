import { streamText, tool } from 'ai'
import { createGroq } from '@ai-sdk/groq'
import { z } from 'zod'
import { createServiceClient } from '@/lib/supabase-server'

const groq = createGroq({ apiKey: process.env.GROQ_API_KEY })

export const maxDuration = 60

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Mn}/gu, '')
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

export async function POST(req: Request) {
  const { messages } = await req.json()

  const supabase = createServiceClient()

  const result = streamText({
    model: groq('llama-3.3-70b-versatile'),
    maxSteps: 10,
    system: `Você é o assistente do Guiamos. Siga EXATAMENTE esta sequência, uma etapa por vez:

ETAPA 1: Pergunte se a loja está vinculada a um CNPJ ou vai operar como pessoa física (CPF). Apresente como duas opções claras.

SE CNPJ:
  ETAPA 2: Peça o CNPJ.
  ETAPA 3: Execute consultar_cnpj com o CNPJ informado.
  ETAPA 4: Mostre os dados encontrados (nome, regime, segmento) e confirme com o usuário.
  ETAPA 5: Execute criar_loja com os dados confirmados.

SE CPF (pessoa física):
  ETAPA 2: Pergunte o nome da loja.
  ETAPA 3: Pergunte o segmento/nicho.
  ETAPA 4: Informe que pessoa física opera como MEI ou autônomo e confirme.
  ETAPA 5: Execute criar_loja com regime 'MEI'.

PARA AMBOS, após criar_loja:
  ETAPA A: Execute iniciar_oauth('bling', store_id). Instrua o usuário a clicar no botão para conectar. Aguarde confirmação antes de prosseguir.
  ETAPA B: Execute iniciar_oauth('mercado_pago', store_id). Aguarde confirmação.
  ETAPA C: Execute iniciar_oauth('melhor_envio', store_id). Aguarde confirmação.
  ETAPA D: Se veio de CNPJ, o endereço já foi preenchido automaticamente. Confirme com o usuário. Se veio de CPF, pergunte o CEP de origem. Execute salvar_endereco.
  ETAPA E: Execute finalizar_onboarding. Parabenize e mostre o link do painel.

REGRAS:
- Uma etapa por vez. Nunca pule etapas.
- Após tool executar com sucesso, explique brevemente e instrua a próxima ação.
- Seja direto. Máximo 2 frases por mensagem.
- Sempre em português brasileiro.`,
    messages,
    tools: {
      consultar_cnpj: tool({
        description: 'Consulta dados da empresa na Receita Federal pelo CNPJ',
        parameters: z.object({
          cnpj: z.string().describe('CNPJ com ou sem formatação'),
        }),
        execute: async ({ cnpj }) => {
          const limpo = cnpj.replace(/\D/g, '')
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_APP_URL}/api/cnpj?cnpj=${limpo}`
          )
          if (!res.ok) return { sucesso: false, erro: 'CNPJ não encontrado' }
          const data = await res.json()
          return { sucesso: true, ...data }
        },
      }),

      criar_loja: tool({
        description: 'Cria o registro da loja no banco de dados',
        parameters: z.object({
          nome: z.string().describe('Nome da loja'),
          segmento: z.string().describe('Segmento ou nicho da loja'),
          regime: z.enum(['MEI', 'SN', 'LP']).describe('Regime tributário'),
        }),
        execute: async ({ nome, segmento, regime }) => {
          const storeId = slugify(nome)

          const { error } = await supabase.from('stores').insert({
            store_id: storeId,
            nome,
            segmento,
            regime,
            plano: 'starter',
          })

          if (error) return { sucesso: false, erro: error.message }
          return { sucesso: true, store_id: storeId, nome, segmento, regime }
        },
      }),

      iniciar_oauth: tool({
        description: 'Inicia o fluxo OAuth para conectar uma integração',
        parameters: z.object({
          plataforma: z.enum(['bling', 'mercado_pago', 'melhor_envio']),
          store_id: z.string(),
        }),
        execute: async ({ plataforma, store_id }) => {
          const baseUrl = process.env.NEXT_PUBLIC_APP_URL
          const callbackUrl = `${baseUrl}/api/oauth/${plataforma}/callback`

          const urls: Record<string, string> = {
            bling: `https://www.bling.com.br/Api/v3/oauth/authorize?response_type=code&client_id=${process.env.BLING_CLIENT_ID}&state=${store_id}`,
            mercado_pago: `https://auth.mercadopago.com.br/authorization?client_id=${process.env.MP_CLIENT_ID}&response_type=code&platform_id=mp&state=${store_id}&redirect_uri=${callbackUrl}`,
            melhor_envio: `https://melhorenvio.com.br/oauth/authorize?client_id=${process.env.ME_CLIENT_ID}&redirect_uri=${callbackUrl}&response_type=code&scope=cart-read+cart-write+companies-read+orders-read+products-read+shipping-calculate+shipping-checkout+shipping-generate+shipping-preview+shipping-print+shipping-tracking&state=${store_id}`,
          }

          return {
            sucesso: true,
            url: urls[plataforma],
            plataforma,
            instrucao: `Abra este link para conectar o ${plataforma}`,
          }
        },
      }),

      verificar_integracao: tool({
        description: 'Verifica se uma integração foi conectada com sucesso',
        parameters: z.object({
          plataforma: z.enum(['bling', 'mercado_pago', 'melhor_envio']),
          store_id: z.string(),
        }),
        execute: async ({ plataforma, store_id }) => {
          const { data } = await supabase
            .from('store_integrations')
            .select('plataforma, created_at')
            .eq('store_id', store_id)
            .eq('plataforma', plataforma)
            .single()

          return { conectado: !!data, plataforma }
        },
      }),

      salvar_endereco: tool({
        description: 'Salva o endereço de origem para cálculo de frete',
        parameters: z.object({
          store_id: z.string(),
          cep: z.string(),
          nome: z.string(),
          cidade: z.string(),
          uf: z.string(),
        }),
        execute: async ({ store_id, cep, nome, cidade, uf }) => {
          const { error } = await supabase
            .from('stores')
            .update({
              shipping_from_cep: cep,
              shipping_from_nome: nome,
              shipping_from_cidade: cidade,
              shipping_from_uf: uf,
            })
            .eq('store_id', store_id)

          return { sucesso: !error }
        },
      }),

      finalizar_onboarding: tool({
        description: 'Marca o onboarding como concluído e retorna a URL da loja',
        parameters: z.object({
          store_id: z.string(),
        }),
        execute: async ({ store_id }) => {
          await supabase
            .from('stores')
            .update({ onboarding_completo: true })
            .eq('store_id', store_id)

          const url = `${process.env.NEXT_PUBLIC_APP_URL}/painel`
          return { sucesso: true, url, store_id }
        },
      }),
    },
  })

  return result.toDataStreamResponse()
}
