import { createClient, type SupabaseClient } from '@supabase/supabase-js'

let _client: SupabaseClient | null = null

function getInstance(): SupabaseClient {
  if (!_client) {
    _client = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { persistSession: false } }
    )
  }
  return _client
}

// Proxy defers createClient() to first use — env vars absent at build time won't throw
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const supabase = new Proxy({} as SupabaseClient, {
  get(_, prop: string | symbol) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (getInstance() as any)[prop as string]
  },
})
