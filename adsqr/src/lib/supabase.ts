import { createClient as createSupabaseClient, SupabaseClient } from '@supabase/supabase-js'

// Lazy initialization to avoid build-time errors
let supabaseInstance: SupabaseClient | null = null

function getSupabaseInstance(): SupabaseClient {
  if (!supabaseInstance) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

    // For build-time, return a dummy client if env vars are missing
    // Runtime will fail when actually used
    if (!supabaseUrl || !supabaseAnonKey) {
      // Return a client with invalid URL - runtime calls will fail gracefully
      supabaseInstance = createSupabaseClient('https://placeholder.supabase.co', 'placeholder')
    } else {
      supabaseInstance = createSupabaseClient(supabaseUrl, supabaseAnonKey)
    }
  }
  return supabaseInstance
}

export function createClient() {
  return getSupabaseInstance()
}
