'use client'

import { useRef, useState } from 'react'

export interface ExtractedContact {
  name: string
  company: string
  role: string
  email: string
  notes: string
}

interface Props {
  onExtracted: (values: ExtractedContact) => void
}

export function ScreenshotImport({ onExtracted }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')
  const [error, setError] = useState<string | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [dragging, setDragging] = useState(false)

  async function processFile(file: File) {
    const VALID = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    if (!VALID.includes(file.type)) {
      setError('Use a JPEG, PNG, GIF, or WebP image.')
      setStatus('error')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be under 5 MB.')
      setStatus('error')
      return
    }

    setPreview(URL.createObjectURL(file))
    setStatus('loading')
    setError(null)

    const fd = new FormData()
    fd.append('image', file)

    try {
      const res = await fetch('/api/extract-contact', { method: 'POST', body: fd })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error ?? 'Extraction failed.')
        setStatus('error')
        return
      }

      onExtracted(data)
      setStatus('done')
    } catch {
      setError('Network error — please try again.')
      setStatus('error')
    }
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) processFile(file)
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) processFile(file)
  }

  function reset() {
    setStatus('idle')
    setError(null)
    setPreview(null)
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-2">
        <p className="text-xs font-semibold text-text-muted uppercase tracking-wider">Import from screenshot</p>
        {(status === 'done' || status === 'error') && (
          <button onClick={reset} className="text-[10px] text-text-ghost hover:text-text-secondary transition-colors">
            Try another
          </button>
        )}
      </div>

      {status === 'idle' && (
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={e => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          className={`
            relative flex flex-col items-center justify-center gap-2 px-4 py-6 rounded-xl border-2 border-dashed cursor-pointer transition-colors
            ${dragging
              ? 'border-[var(--c-accent)] bg-[rgba(200,240,96,0.06)]'
              : 'border-border-normal hover:border-border-strong hover:bg-surface-elevated'}
          `}
        >
          <svg className="w-8 h-8 text-text-ghost" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-sm text-text-secondary text-center">
            Drop a screenshot here or <span className="text-[var(--c-accent)] font-medium">click to upload</span>
          </p>
          <p className="text-xs text-text-ghost">LinkedIn profile · business card · email signature</p>
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/gif,image/webp"
            className="hidden"
            onChange={handleFile}
          />
        </div>
      )}

      {status === 'loading' && (
        <div className="flex items-center gap-3 px-4 py-4 rounded-xl border border-border-subtle bg-surface-elevated">
          {preview && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt="" className="w-14 h-14 rounded-lg object-cover shrink-0" />
          )}
          <div>
            <p className="text-sm font-medium text-text-primary">Extracting contact info…</p>
            <p className="text-xs text-text-muted mt-0.5">AI is reading your screenshot</p>
          </div>
          <svg className="w-5 h-5 text-[var(--c-accent)] animate-spin ml-auto shrink-0" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
          </svg>
        </div>
      )}

      {status === 'done' && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-[rgba(34,197,94,0.2)] bg-[rgba(34,197,94,0.06)]">
          <svg className="w-4 h-4 text-[#22C55E] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
          <p className="text-sm text-text-secondary">
            Contact info extracted — <span className="text-text-primary font-medium">form pre-filled below</span>. Review and save.
          </p>
        </div>
      )}

      {status === 'error' && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-[rgba(248,113,113,0.2)] bg-[rgba(248,113,113,0.06)]">
          <svg className="w-4 h-4 text-[#F87171] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          <p className="text-sm text-[#F87171]">{error}</p>
        </div>
      )}
    </div>
  )
}
