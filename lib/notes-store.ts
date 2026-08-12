'use client'

// Quick notes logged against a client (HubSpot-style "log a note"). localStorage
// for the demo; swap for POST /api/v1/clients/:id/notes later.

export interface ClientNote {
  id: string
  clientId: string
  text: string
  createdAt: number
}

const KEY = 'supra-client-notes'
const listeners = new Set<() => void>()

function read(): ClientNote[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return JSON.parse(raw) as ClientNote[]
  } catch {
    /* ignore */
  }
  return []
}
function write(notes: ClientNote[]) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(KEY, JSON.stringify(notes))
  } catch {
    /* ignore */
  }
  listeners.forEach((l) => l())
}

export function getNotes(clientId: string): ClientNote[] {
  return read().filter((n) => n.clientId === clientId).sort((a, b) => b.createdAt - a.createdAt)
}
export function addNote(clientId: string, text: string): ClientNote {
  const note: ClientNote = { id: `note-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, clientId, text: text.trim(), createdAt: Date.now() }
  write([note, ...read()])
  return note
}
export function subscribeNotes(cb: () => void): () => void {
  listeners.add(cb)
  return () => listeners.delete(cb)
}
