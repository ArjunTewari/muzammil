import { NextResponse } from 'next/server'
import type { AgentRunResult, RunRequest, RunResponse } from '@/lib/studio/types'
import { buildAgentPrompt, agentRunTool } from '@/lib/studio/prompt'
import { simulateRun } from '@/lib/studio/simulate'

export const runtime = 'nodejs'
export const maxDuration = 60

const ANTHROPIC_URL = 'https://api.anthropic.com/v1/messages'
const MODEL = process.env.SUPRA_MODEL ?? 'claude-sonnet-5'

function normalize(result: AgentRunResult, mode: RunRequest['agent']['mode']): AgentRunResult {
  const r: AgentRunResult = { ...result, mode }
  if (mode === 'review') {
    r.findings = (r.findings ?? []).map((f, i) => ({ ...f, id: f.id ?? `f-${i}-${Math.random().toString(36).slice(2, 6)}` }))
    r.verdict = r.verdict ?? (r.findings.length ? 'flag' : 'pass')
  }
  if (typeof r.confidence !== 'number') r.confidence = 0.6
  if (!r.reasoning) r.reasoning = 'Reviewed against the agent goal and rules.'
  return r
}

export async function POST(request: Request) {
  let req: RunRequest
  try {
    req = (await request.json()) as RunRequest
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }
  if (!req.agent || typeof req.input !== 'string') {
    return NextResponse.json({ error: 'agent and input are required' }, { status: 400 })
  }

  const apiKey = process.env.ANTHROPIC_API_KEY
  const memory = req.memory ?? []

  if (!apiKey) {
    const result = simulateRun(req.agent, req.input, memory)
    return NextResponse.json({ result, engine: 'simulated' } satisfies RunResponse)
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
        thinking: { type: 'adaptive' },
        output_config: { effort: 'medium' },
        system: buildAgentPrompt(req.agent, memory),
        tools: [agentRunTool],
        tool_choice: { type: 'auto' },
        messages: [{ role: 'user', content: `INPUT TO ${req.agent.mode === 'review' ? 'REVIEW' : 'PROCESS'}:\n\n${req.input}` }],
      }),
    })

    if (!res.ok) {
      const result = simulateRun(req.agent, req.input, memory)
      return NextResponse.json({ result, engine: 'simulated' } satisfies RunResponse)
    }

    const data = await res.json()
    const blocks: Array<{ type: string; name?: string; input?: unknown; text?: string }> = data.content ?? []
    let raw: Partial<AgentRunResult> | null = null

    const toolBlock = blocks.find((b) => b.type === 'tool_use' && b.name === 'agent_run')
    if (toolBlock?.input) {
      raw = toolBlock.input as Partial<AgentRunResult>
    } else {
      const text = blocks.filter((b) => b.type === 'text').map((b) => b.text ?? '').join('\n')
      const match = text.match(/\{[\s\S]*\}/)
      if (match) {
        try {
          raw = JSON.parse(match[0]) as Partial<AgentRunResult>
        } catch {
          raw = null
        }
      }
    }

    if (!raw) {
      const result = simulateRun(req.agent, req.input, memory)
      return NextResponse.json({ result, engine: 'simulated' } satisfies RunResponse)
    }

    return NextResponse.json({
      result: normalize(raw as AgentRunResult, req.agent.mode),
      engine: 'live',
    } satisfies RunResponse)
  } catch {
    const result = simulateRun(req.agent, req.input, memory)
    return NextResponse.json({ result, engine: 'simulated' } satisfies RunResponse)
  }
}
