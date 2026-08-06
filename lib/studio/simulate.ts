import type { AgentRunResult, Finding, StudioAgent } from './types'

// Deterministic fallback so the demo works with no API key. Review mode = a
// BFSI red-flag scan; generate mode = a templated draft. It also honours
// "correction" memories (a dismissed finding stays dismissed) so the
// "it learned" moment works fully offline.

interface Rule {
  test: RegExp
  severity: Finding['severity']
  title: string
  rule: string
  suggestion: string
}

const RED_FLAGS: Rule[] = [
  {
    test: /\b(guarantee[ds]?|assured|risk[-\s]?free|no\s+risk|100%\s*safe)\b/i,
    severity: 'high',
    title: 'Guaranteed / assured returns language',
    rule: 'SEBI/AMFI: no guaranteed, assured or risk-free return claims.',
    suggestion: 'Remove the guarantee. Frame as potential/historical with a risk caveat.',
  },
  {
    test: /\b(\d{1,3}(\.\d+)?)\s*%\s*(returns?|cagr|p\.?a\.?|per\s*annum|annually)?/i,
    severity: 'high',
    title: 'Return figure without disclaimer',
    rule: 'Return/performance figures require a risk disclaimer + "past performance is not indicative of future results".',
    suggestion: 'Attach the mandatory disclaimer and the past-performance caveat wherever the number appears.',
  },
  {
    test: /\b(best|number\s*one|no\.?\s*1|#1|top[-\s]?performing|highest[-\s]?returning)\b/i,
    severity: 'medium',
    title: 'Unsubstantiated superlative / ranking claim',
    rule: 'No "best/number one" claims without a verifiable, cited basis.',
    suggestion: 'Drop the superlative or cite a dated, third-party source for the ranking.',
  },
  {
    test: /\b(double|triple|multiply)\s+(your\s+)?(money|wealth|investment)|grow\s+(your\s+)?money\s+fast|get\s+rich/i,
    severity: 'medium',
    title: 'Implied quick / effortless wealth',
    rule: 'No language implying quick or effortless wealth creation.',
    suggestion: 'Replace with disciplined, long-horizon framing (e.g. the power of staying invested).',
  },
]

const DISCLAIMER = /market\s+risk|scheme\s+related\s+documents|subject\s+to\s+market/i

function idFor(seed: string): string {
  return `f-${seed.replace(/\W+/g, '').slice(0, 20)}-${Math.random().toString(36).slice(2, 6)}`
}

// A finding is suppressed if a correction memory names its title (dismissed before).
function suppressed(title: string, memory: string[]): boolean {
  return memory.some((m) => m.toLowerCase().includes(title.toLowerCase()))
}

export function simulateRun(agent: StudioAgent, input: string, memory: string[]): AgentRunResult {
  if (agent.mode === 'generate') {
    const draft = [
      `**Draft from ${agent.name}**`,
      '',
      `Goal: ${agent.goal}`,
      '',
      '1. Hook — open with the core tension, no hype.',
      '2. Value — make the idea tangible and specific.',
      '3. Proof — one concrete, compliant data point.',
      '4. CTA — a single, clear next step.',
      '',
      '_Mutual fund investments are subject to market risks, read all scheme related documents carefully._',
    ].join('\n')
    return {
      mode: 'generate',
      output: draft,
      notes: ['Simulated draft (no API key) — structure follows your rules; wire ANTHROPIC_API_KEY for live copy.'],
      confidence: 0.55,
      reasoning: 'Produced a rule-compliant skeleton offline; the live agent writes finished copy in your brand voice.',
    }
  }

  // review mode
  const findings: Finding[] = []
  for (const r of RED_FLAGS) {
    const m = input.match(r.test)
    if (m && !suppressed(r.title, memory)) {
      findings.push({
        id: idFor(r.title),
        severity: r.severity,
        title: r.title,
        quote: m[0].trim(),
        rule: r.rule,
        suggestion: r.suggestion,
      })
    }
  }
  // Missing mandatory disclaimer
  const missingDisclaimer = 'Missing mandatory disclaimer'
  if (input.trim().length > 40 && !DISCLAIMER.test(input) && !suppressed(missingDisclaimer, memory)) {
    findings.push({
      id: idFor(missingDisclaimer),
      severity: 'medium',
      title: missingDisclaimer,
      rule: 'Every MF communication must carry the market-risk / scheme-documents disclaimer.',
      suggestion: 'Add: "Mutual fund investments are subject to market risks, read all scheme related documents carefully."',
    })
  }

  return {
    mode: 'review',
    verdict: findings.length ? 'flag' : 'pass',
    findings,
    confidence: findings.length ? 0.72 : 0.6,
    reasoning: findings.length
      ? `Scanned against your rules and found ${findings.length} risk${findings.length > 1 ? 's' : ''} to fix before this ships.`
      : 'Scanned against your rules — nothing flagged. (Simulated; wire ANTHROPIC_API_KEY for deeper review.)',
  }
}
