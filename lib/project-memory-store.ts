'use client'

// Per-project file memory — files the founder (or an employee) attaches to a
// project so its context sticks around. For this demo the files are stored
// and shown, not yet parsed into any agent prompt — that wiring comes later.

export interface ProjectFile {
  id: string
  projectId: string // employeeId for now — one project per employee
  name: string
  size: number
  mimeType: string
  dataUrl?: string // small images only, for a thumbnail preview
  note: string
  addedAt: number
}

const KEY = 'supra-project-files'
const listeners = new Set<() => void>()

function read(): ProjectFile[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return JSON.parse(raw) as ProjectFile[]
  } catch {
    /* ignore */
  }
  return []
}
function write(files: ProjectFile[]) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(KEY, JSON.stringify(files))
  } catch {
    /* ignore */
  }
  listeners.forEach((l) => l())
}

export function getFiles(projectId: string): ProjectFile[] {
  return read()
    .filter((f) => f.projectId === projectId)
    .sort((a, b) => b.addedAt - a.addedAt)
}

export function addFile(projectId: string, input: { name: string; size: number; mimeType: string; dataUrl?: string; note: string }): ProjectFile {
  const file: ProjectFile = {
    id: `file-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    projectId,
    name: input.name,
    size: input.size,
    mimeType: input.mimeType,
    dataUrl: input.dataUrl,
    note: input.note.trim(),
    addedAt: Date.now(),
  }
  write([file, ...read()])
  return file
}

export function removeFile(id: string) {
  write(read().filter((f) => f.id !== id))
}

export function updateFileNote(id: string, note: string) {
  write(read().map((f) => (f.id === id ? { ...f, note } : f)))
}

export function subscribeFiles(cb: () => void): () => void {
  listeners.add(cb)
  return () => listeners.delete(cb)
}
