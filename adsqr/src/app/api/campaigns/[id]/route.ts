// AdsQr MVP - Phase 1
// FIX: Added auth check to prevent IDOR
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase'

// GET /api/campaigns/[id]
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = createClient()

  // FIX: Add auth check to prevent IDOR
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // FIX: Ensure user can only see their own campaigns
  const { data: campaign } = await supabase
    .from('campaigns')
    .select('*, qr_codes(count)')
    .eq('id', id)
    .eq('brand_id', user.id)  // FIX: Prevent IDOR - only show owned campaigns
    .single()

  if (!campaign) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  return NextResponse.json({ campaign })
}

// PATCH /api/campaigns/[id]
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { data: campaign } = await supabase
    .from('campaigns')
    .update({ ...body, updated_at: new Date().toISOString() })
    .eq('id', id)
    .eq('brand_id', user.id)  // Ensure ownership
    .select()
    .single()

  if (!campaign) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  return NextResponse.json({ campaign })
}
