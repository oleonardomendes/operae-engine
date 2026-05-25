/**
 * Valida o store-config de uma loja antes de implantar.
 * Uso: npx tsx scripts/validate-config.ts taprapesca
 */

import fs from 'fs'
import path from 'path'

const storeId = process.argv[2]

if (!storeId) {
  console.error('❌ Uso: npx tsx scripts/validate-config.ts <store-id>')
  process.exit(1)
}

// ─── Campos obrigatórios (não podem ser vazios ou null) ───────────────────────

const REQUIRED_FIELDS: string[] = [
  'store_id',
  'nome',
  'dominio',
  'regime',
  'tema.cor_primaria',
  'tema.logo_url',
  'bling.client_id',
  'bling.client_secret',
  'mercado_pago.access_token',
  'mercado_pago.public_key',
  'melhor_envio.token',
  'melhor_envio.from_cep',
  'melhor_envio.from_cidade',
  'melhor_envio.from_uf',
  'resend.from',
  'precificacao.margem_ml',
  'precificacao.margem_site',
  'precificacao.desconto_pix',
]

const VALID_REGIMES = ['MEI', 'SN', 'LP']

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getNestedValue(obj: Record<string, unknown>, path: string): unknown {
  return path.split('.').reduce((acc: unknown, key) => {
    if (acc && typeof acc === 'object') return (acc as Record<string, unknown>)[key]
    return undefined
  }, obj)
}

function isEnvRef(value: unknown): boolean {
  return typeof value === 'string' && value.startsWith('env:')
}

function checkEnvVar(value: string): boolean {
  const key = value.slice(4)
  return !!process.env[key]
}

// ─── Validação ────────────────────────────────────────────────────────────────

console.log(`\n🔍 Validando store-config de "${storeId}"...\n`)

const filePath = path.join(process.cwd(), 'store-configs', storeId, 'store-config.json')

if (!fs.existsSync(filePath)) {
  console.error(`❌ Arquivo não encontrado: ${filePath}`)
  process.exit(1)
}

// Carrega .env.local da loja se existir
const envPath = path.join(process.cwd(), 'store-configs', storeId, '.env.local')
if (fs.existsSync(envPath)) {
  const lines = fs.readFileSync(envPath, 'utf8').split('\n')
  for (const line of lines) {
    const eq = line.indexOf('=')
    if (eq > 0) {
      const key = line.slice(0, eq).trim()
      const val = line.slice(eq + 1).trim()
      if (!process.env[key]) process.env[key] = val
    }
  }
  console.log(`✅ .env.local carregado de store-configs/${storeId}/.env.local\n`)
} else {
  console.warn(`⚠️  .env.local não encontrado — variáveis env: não serão verificadas\n`)
}

const raw = JSON.parse(fs.readFileSync(filePath, 'utf8')) as Record<string, unknown>

const errors: string[] = []
const warnings: string[] = []

// Verifica campos obrigatórios
for (const field of REQUIRED_FIELDS) {
  const value = getNestedValue(raw, field)

  if (value === undefined || value === null || value === '') {
    errors.push(`Campo obrigatório vazio: "${field}"`)
    continue
  }

  if (isEnvRef(value)) {
    if (!checkEnvVar(value as string)) {
      errors.push(`Variável de ambiente não definida: "${(value as string).slice(4)}" (campo "${field}")`)
    } else {
      console.log(`  ✅ ${field} → ${value} (resolvida)`)
    }
  } else {
    console.log(`  ✅ ${field} → ${String(value).slice(0, 40)}`)
  }
}

// Valida regime tributário
const regime = raw.regime as string
if (regime && !VALID_REGIMES.includes(regime)) {
  errors.push(`Regime inválido: "${regime}". Valores aceitos: ${VALID_REGIMES.join(', ')}`)
}

// Valida margens (devem ser entre 0 e 1)
const precificacao = raw.precificacao as Record<string, number> | undefined
if (precificacao) {
  for (const [key, value] of Object.entries(precificacao)) {
    if (typeof value === 'number' && (value < 0 || value > 1)) {
      warnings.push(`precificacao.${key} = ${value} — valores de margem devem estar entre 0 e 1`)
    }
  }
}

// Verifica analytics (não obrigatório, mas avisa se vazio)
const analytics = raw.analytics as Record<string, string> | undefined
if (analytics) {
  if (!analytics.gtm_id) warnings.push('analytics.gtm_id está vazio — GTM não vai disparar')
  if (!analytics.meta_pixel_id) warnings.push('analytics.meta_pixel_id está vazio')
  if (!analytics.ga4_id) warnings.push('analytics.ga4_id está vazio')
}

// ─── Resultado ────────────────────────────────────────────────────────────────

console.log('')

if (warnings.length > 0) {
  console.log('⚠️  Avisos:')
  for (const w of warnings) console.log(`   • ${w}`)
  console.log('')
}

if (errors.length > 0) {
  console.error(`❌ ${errors.length} erro(s) encontrado(s):`)
  for (const e of errors) console.error(`   • ${e}`)
  console.error('\n🚫 Config inválido — corrija os erros antes de implantar.\n')
  process.exit(1)
}

console.log(`✅ store-config de "${storeId}" válido e pronto para implantar.\n`)
