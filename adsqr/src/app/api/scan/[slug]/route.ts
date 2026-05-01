// AdsQr MVP - Phase 1
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase'

// GET /api/scan/[slug] - Record scan
export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = createClient()
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://adsqr.rezapp.com'

  // Find QR code
  const { data: qr } = await supabase
    .from('qr_codes')
    .select('*, campaigns(*)')
    .eq('qr_slug', slug)
    .single()

  if (!qr) return NextResponse.redirect(`${appUrl}/scan/not-found`)
  if (!qr.is_active) return NextResponse.redirect(`${appUrl}/scan/inactive`)

  // Get user from auth header (if present)
  const authHeader = req.headers.get('authorization') ?? ''
  const accessToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null
  let userId = null
  let user = null

  if (accessToken) {
    const supabaseAuth = createClient()
    const { data } = await supabaseAuth.auth.getUser(accessToken)
    userId = data.user?.id
    user = data.user
  }

  // Record scan event
  const { data: scanEvent } = await supabase
    .from('scan_events')
    .insert({
      qr_id: qr.id,
      campaign_id: qr.campaign_id,
      user_id: userId,
      coins_credited: !!userId,
      coins_amount: userId ? qr.campaigns.scan_reward : 0
    })
    .select()
    .single()

  // Update QR stats
  await supabase.rpc('increment_scan_count', { qr_id: qr.id })

  // If user authenticated, credit coins
  if (userId && qr.campaigns.scan_reward > 0) {
    // TODO: Call REZ Wallet API to credit coins
    // For now, record local transaction
    await supabase.from('coin_transactions').insert({
      campaign_id: qr.campaign_id,
      user_id: userId,
      amount: qr.campaigns.scan_reward,
      coin_type: 'rez',
      reason: 'scan'
    })
  }

  // Redirect to landing page
  return NextResponse.redirect(`${appUrl}/scan/${slug}?scanned=true`)
}
