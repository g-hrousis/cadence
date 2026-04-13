import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@/lib/supabase/server'

const VALID_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'] as const
type ImageMediaType = typeof VALID_TYPES[number]

export async function POST(request: NextRequest) {
  // Auth — only logged-in users may call this
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: 'ANTHROPIC_API_KEY not configured' }, { status: 503 })
  }

  const formData = await request.formData()
  const file = formData.get('image') as File | null

  if (!file) return NextResponse.json({ error: 'No image provided' }, { status: 400 })
  if (file.size > 5 * 1024 * 1024) {
    return NextResponse.json({ error: 'Image too large — max 5 MB' }, { status: 400 })
  }
  if (!VALID_TYPES.includes(file.type as ImageMediaType)) {
    return NextResponse.json({ error: 'Unsupported file type — use JPEG, PNG, GIF, or WebP' }, { status: 400 })
  }

  const bytes = await file.arrayBuffer()
  const base64 = Buffer.from(bytes).toString('base64')

  const anthropic = new Anthropic()

  const message = await anthropic.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 512,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'image',
            source: {
              type: 'base64',
              media_type: file.type as ImageMediaType,
              data: base64,
            },
          },
          {
            type: 'text',
            text: 'Extract contact information from this screenshot (LinkedIn profile, business card, email signature, etc.). Return ONLY a JSON object with these exact fields — use an empty string if a field is not present: name, company, role, email, notes. For notes, include a short relevant snippet such as a headline, bio, or location if available.',
          },
        ],
      },
    ],
  })

  const raw = message.content[0].type === 'text' ? message.content[0].text : ''

  // Extract the JSON block — Claude may wrap it in markdown fences
  const jsonMatch = raw.match(/\{[\s\S]*\}/)
  if (!jsonMatch) {
    return NextResponse.json({ error: 'Could not parse contact information from image' }, { status: 422 })
  }

  let extracted: Record<string, string>
  try {
    extracted = JSON.parse(jsonMatch[0])
  } catch {
    return NextResponse.json({ error: 'Invalid response from AI' }, { status: 422 })
  }

  return NextResponse.json({
    name:    String(extracted.name    ?? '').trim().slice(0, 200),
    company: String(extracted.company ?? '').trim().slice(0, 200),
    role:    String(extracted.role    ?? '').trim().slice(0, 200),
    email:   String(extracted.email   ?? '').trim().slice(0, 254),
    notes:   String(extracted.notes   ?? '').trim().slice(0, 1000),
  })
}
