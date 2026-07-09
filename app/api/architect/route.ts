import { NextResponse } from 'next/server'
import type { ArchitectRequest, ArchitectResponse, ArchitectTurn } from '@/lib/architect/types'
import { buildSystemPrompt, architectTool } from '@/lib/architect/prompt'
import { simulateTurn } from '@/lib/architect/simulate'

export const runtime = 'nodejs'
export const maxDuration = 60

const ANTHROPIC_URL = 'https://api.anthropic.com/v1/messages'
const MODEL = process.env.MAESTRO_MODEL ?? 'claude-sonnet-5'

export async function POST(request: Request) {
  let req: ArchitectRequest
  try {
    req = (await request.json()) as ArchitectRequest
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const apiKey = process.env.ANTHROPIC_API_KEY
  const userTurns = req.messages.filter((m) => m.role === 'user').length

  // No key → deterministic simulation so the demo never breaks.
  if (!apiKey) {
    const { turn, turnNumber } = simulateTurn(req)
    return NextResponse.json({ turn, mode: 'simulated', turnNumber } satisfies ArchitectResponse)
  }

  try {
    const res = await fetch(ANTHROPIC_URL, {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 4000,
        // Extended thinking = the "thinking agent". With thinking on, tool_choice
        // MUST be auto (cannot force a tool) and temperature must be default.
        thinking: { type: 'enabled', budget_tokens: 1500 },
        system: buildSystemPrompt(req),
        tools: [architectTool],
        tool_choice: { type: 'auto' },
        messages: req.messages.map((m) => ({ role: m.role, content: m.content })),
      }),
    })

    if (!res.ok) {
      // Bad key / rate limit / model access → fall back rather than break the demo.
      const { turn, turnNumber } = simulateTurn(req)
      return NextResponse.json({
        turn,
        mode: 'simulated',
        turnNumber,
      } satisfies ArchitectResponse)
    }

    const data = await res.json()
    const blocks: Array<{ type: string; name?: string; input?: unknown; text?: string }> =
      data.content ?? []

    let turn: ArchitectTurn | null = null

    const toolBlock = blocks.find((b) => b.type === 'tool_use' && b.name === 'architect_turn')
    if (toolBlock?.input) {
      turn = toolBlock.input as ArchitectTurn
    } else {
      // Fallback: the model answered in prose — try to recover JSON from the text.
      const text = blocks
        .filter((b) => b.type === 'text')
        .map((b) => b.text ?? '')
        .join('\n')
      const match = text.match(/\{[\s\S]*\}/)
      if (match) {
        try {
          turn = JSON.parse(match[0]) as ArchitectTurn
        } catch {
          turn = null
        }
      }
    }

    if (!turn || !turn.decision) {
      const sim = simulateTurn(req)
      return NextResponse.json({
        turn: sim.turn,
        mode: 'simulated',
        turnNumber: sim.turnNumber,
      } satisfies ArchitectResponse)
    }

    return NextResponse.json({ turn, mode: 'live', turnNumber: userTurns } satisfies ArchitectResponse)
  } catch {
    const { turn, turnNumber } = simulateTurn(req)
    return NextResponse.json({ turn, mode: 'simulated', turnNumber } satisfies ArchitectResponse)
  }
}
