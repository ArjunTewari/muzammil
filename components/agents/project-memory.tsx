'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, FileText, FileImage, FileVideo, File as FileIcon, Trash2, Database } from 'lucide-react'
import {
  getFiles,
  addFile,
  removeFile,
  updateFileNote,
  subscribeFiles,
  type ProjectFile,
} from '@/lib/project-memory-store'

const MAX_INLINE_PREVIEW_BYTES = 300_000

function iconFor(mimeType: string) {
  if (mimeType.startsWith('image/')) return FileImage
  if (mimeType.startsWith('video/')) return FileVideo
  if (mimeType.includes('pdf') || mimeType.startsWith('text/')) return FileText
  return FileIcon
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

// Files attached to a project become its "memory" — stored and shown here,
// not yet parsed into any agent prompt (that wiring lands with real AI
// integration). This is scoped per project (one project per employee).
export function ProjectMemory({ projectId }: { projectId: string }) {
  const [files, setFiles] = useState<ProjectFile[]>([])
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const refresh = () => setFiles(getFiles(projectId))
    refresh()
    return subscribeFiles(refresh)
  }, [projectId])

  async function handleFiles(fileList: FileList | null) {
    if (!fileList) return
    for (const f of Array.from(fileList)) {
      let dataUrl: string | undefined
      if (f.type.startsWith('image/') && f.size <= MAX_INLINE_PREVIEW_BYTES) {
        dataUrl = await new Promise<string>((resolve) => {
          const reader = new FileReader()
          reader.onload = () => resolve(reader.result as string)
          reader.readAsDataURL(f)
        })
      }
      addFile(projectId, { name: f.name, size: f.size, mimeType: f.type || 'application/octet-stream', dataUrl, note: '' })
    }
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div className="rounded-[12px] border border-[var(--color-border-brand)] bg-[var(--color-surface)] p-4" style={{ boxShadow: 'var(--shadow-card)' }}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Database size={14} className="text-[var(--color-gold)]" />
          <p className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">
            Project Memory
          </p>
          {files.length > 0 && (
            <span className="text-[11px] text-[var(--color-text-tertiary)]" style={{ fontFamily: 'var(--font-jetbrains-mono)' }}>
              {files.length}
            </span>
          )}
        </div>
        <button
          onClick={() => inputRef.current?.click()}
          className="flex items-center gap-1.5 text-xs text-[var(--color-gold)] hover:underline cursor-pointer"
        >
          <Upload size={12} /> Add files
        </button>
        <input ref={inputRef} type="file" multiple className="hidden" onChange={(e) => handleFiles(e.target.files)} />
      </div>

      <p className="text-[11px] text-[var(--color-text-tertiary)] mb-3 leading-snug">
        Anything added here becomes part of this project&apos;s memory and can shape the final output — briefs, references, past creative, brand assets.
      </p>

      {files.length === 0 ? (
        <button
          onClick={() => inputRef.current?.click()}
          className="w-full flex flex-col items-center justify-center gap-1.5 rounded-[10px] border border-dashed border-[var(--color-border-brand)] py-6 text-[var(--color-text-tertiary)] hover:border-[var(--color-gold-border)] hover:text-[var(--color-text-secondary)] transition-colors cursor-pointer"
        >
          <Upload size={16} />
          <span className="text-xs">Drop files here or click to add</span>
        </button>
      ) : (
        <div className="space-y-2">
          <AnimatePresence initial={false}>
            {files.map((f) => {
              const Icon = iconFor(f.mimeType)
              return (
                <motion.div
                  key={f.id}
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="rounded-[10px] border border-[var(--color-border-brand)] bg-[var(--color-surface-elevated)] p-2.5"
                >
                  <div className="flex items-start gap-2.5">
                    {f.dataUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={f.dataUrl} alt={f.name} className="w-9 h-9 rounded-[6px] object-cover flex-shrink-0" />
                    ) : (
                      <div className="w-9 h-9 rounded-[6px] bg-[var(--color-surface)] border border-[var(--color-border-brand)] flex items-center justify-center flex-shrink-0">
                        <Icon size={14} className="text-[var(--color-text-tertiary)]" />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-xs font-medium text-[var(--color-text-primary)] truncate">{f.name}</p>
                        <button
                          onClick={() => removeFile(f.id)}
                          className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-[6px] text-[var(--color-text-tertiary)] hover:text-[var(--color-status-red)] hover:bg-[var(--color-surface)] transition-colors cursor-pointer"
                          aria-label={`Remove ${f.name}`}
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                      <p className="text-[10px] text-[var(--color-text-tertiary)]" style={{ fontFamily: 'var(--font-jetbrains-mono)' }}>
                        {formatSize(f.size)} · {new Date(f.addedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      </p>
                      <input
                        defaultValue={f.note}
                        onBlur={(e) => updateFileNote(f.id, e.target.value)}
                        placeholder="Add a note — what is this, why does it matter?"
                        className="w-full mt-1.5 text-[11px] bg-transparent border-b border-transparent hover:border-[var(--color-border-brand)] focus:border-[var(--color-gold-border)] text-[var(--color-text-secondary)] placeholder:text-[var(--color-text-tertiary)] outline-none py-0.5 transition-colors"
                      />
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
