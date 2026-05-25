// LEGADO: será removido após migração completa para lib/supabase-server.ts
// Não usar em código novo — use createServiceClient() de lib/supabase-server.ts nas rotas de API
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { persistSession: false },
})
