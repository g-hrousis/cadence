'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { bulkImport } from './actions'
import type { ContactRow, JobRow } from './actions'

// ─── Types ────────────────────────────────────────────────────────────────────

type ContactEntry = ContactRow & { id: string }
type JobEntry = JobRow & { id: string }

const uid = () => Math.random().toString(36).slice(2)

const emptyContact = (): ContactEntry => ({ id: uid(), name: '', company: '', role: '' })
const emptyJob = (): JobEntry => ({ id: uid(), title: '', status: 'networking' })

const STATUSES = [
  { value: 'networking',   label: 'Networking' },
  { value: 'applied',      label: 'Applied' },
  { value: 'interviewing', label: 'Interviewing' },
  { value: 'offer',        label: 'Offer' },
]

const INPUT_CLASS =
  'w-full bg-surface-elevated border border-border-normal rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-ghost focus:outline-none focus:border-[var(--c-accent)] focus:ring-1 focus:ring-[rgba(200,240,96,0.2)] transition-colors'

// ─── Remove button ────────────────────────────────────────────────────────────

function RemoveBtn({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="h-9 w-8 flex items-center justify-center text-text-ghost hover:text-[#F87171] transition-colors rounded shrink-0"
      aria-label="Remove row"
    >
      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ImportPage() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const [contacts, setContacts] = useState<ContactEntry[]>(() => [
    emptyContact(), emptyContact(), emptyContact(),
  ])
  const [jobs, setJobs] = useState<JobEntry[]>(() => [
    emptyJob(), emptyJob(), emptyJob(),
  ])

  const [importError, setImportError] = useState<string | null>(null)
  const [done, setDone] = useState<{ contacts: number; jobs: number } | null>(null)

  // ── Contacts helpers ──────────────────────────────────────────────────────

  function setContact(id: string, field: keyof ContactRow, value: string) {
    setContacts(rows => rows.map(r => r.id === id ? { ...r, [field]: value } : r))
  }

  function removeContact(id: string) {
    setContacts(rows => rows.length > 1 ? rows.filter(r => r.id !== id) : rows)
  }

  // ── Jobs helpers ──────────────────────────────────────────────────────────

  function setJob(id: string, field: keyof JobRow, value: string) {
    setJobs(rows => rows.map(r => r.id === id ? { ...r, [field]: value } : r))
  }

  function removeJob(id: string) {
    setJobs(rows => rows.length > 1 ? rows.filter(r => r.id !== id) : rows)
  }

  // ── Import ────────────────────────────────────────────────────────────────

  const filledContacts = contacts.filter(r => r.name.trim())
  const filledJobs = jobs.filter(r => r.title.trim())
  const totalItems = filledContacts.length + filledJobs.length

  function handleImport() {
    setImportError(null)
    startTransition(async () => {
      const result = await bulkImport(contacts, jobs)
      if (result.error) {
        setImportError(result.error)
        return
      }
      setDone(result)
      setTimeout(() => router.push('/dashboard'), 1800)
    })
  }

  // ── Success state ─────────────────────────────────────────────────────────

  if (done) {
    const parts: string[] = []
    if (done.contacts > 0) parts.push(`${done.contacts} contact${done.contacts !== 1 ? 's' : ''}`)
    if (done.jobs > 0) parts.push(`${done.jobs} job${done.jobs !== 1 ? 's' : ''}`)

    return (
      <div className="max-w-lg mx-auto py-20 text-center">
        <div className="w-14 h-14 rounded-full bg-[rgba(200,240,96,0.12)] border border-[rgba(200,240,96,0.2)] flex items-center justify-center mx-auto mb-5">
          <svg className="w-6 h-6 text-[var(--c-accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-text-primary mb-2">Import complete</h2>
        <p className="text-text-secondary text-sm">Added {parts.join(' and ')}.</p>
        <p className="text-text-dim text-xs mt-2">Heading to your dashboard…</p>
      </div>
    )
  }

  // ── Form ──────────────────────────────────────────────────────────────────

  return (
    <div className="max-w-3xl">

      {/* Header */}
      <div className="mb-8">
        <Link href="/dashboard" className="text-xs text-text-dim hover:text-text-secondary mb-2 block transition-colors">
          ← Dashboard
        </Link>
        <h1 className="text-2xl font-bold text-text-primary tracking-tight">Quick Import</h1>
        <p className="text-sm text-text-secondary mt-1">
          Add the basics now — you can edit any entry later to fill in the details.
        </p>
      </div>

      {/* ── Contacts ───────────────────────────────────────────────────────── */}
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-3">
          <p className="text-xs font-semibold text-text-muted uppercase tracking-wider">Contacts</p>
          {filledContacts.length > 0 && (
            <span className="text-xs font-semibold text-[var(--c-accent)]">{filledContacts.length}</span>
          )}
        </div>

        {/* Column headers — desktop only */}
        <div className="hidden sm:grid sm:grid-cols-[1fr_1fr_1fr_32px] gap-2 mb-1.5 px-0.5">
          <span className="text-[10px] font-semibold text-text-ghost uppercase tracking-wider">Name *</span>
          <span className="text-[10px] font-semibold text-text-ghost uppercase tracking-wider">Company</span>
          <span className="text-[10px] font-semibold text-text-ghost uppercase tracking-wider">Role / Title</span>
          <span />
        </div>

        <div className="space-y-2">
          {contacts.map(row => (
            <div key={row.id} className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_1fr_32px] gap-2 items-center">
              <input
                value={row.name}
                onChange={e => setContact(row.id, 'name', e.target.value)}
                className={INPUT_CLASS}
                placeholder="Name *"
              />
              <input
                value={row.company}
                onChange={e => setContact(row.id, 'company', e.target.value)}
                className={INPUT_CLASS}
                placeholder="Company"
              />
              <input
                value={row.role}
                onChange={e => setContact(row.id, 'role', e.target.value)}
                className={INPUT_CLASS}
                placeholder="Role / Title"
              />
              <RemoveBtn onClick={() => removeContact(row.id)} />
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setContacts(rows => [...rows, emptyContact()])}
          className="mt-3 text-xs font-semibold text-[var(--c-accent)] hover:opacity-75 transition-opacity"
        >
          + Add contact
        </button>
      </div>

      {/* ── Jobs ───────────────────────────────────────────────────────────── */}
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-3">
          <p className="text-xs font-semibold text-text-muted uppercase tracking-wider">Jobs</p>
          {filledJobs.length > 0 && (
            <span className="text-xs font-semibold text-[var(--c-accent)]">{filledJobs.length}</span>
          )}
        </div>

        {/* Column headers — desktop only */}
        <div className="hidden sm:grid sm:grid-cols-[1fr_160px_32px] gap-2 mb-1.5 px-0.5">
          <span className="text-[10px] font-semibold text-text-ghost uppercase tracking-wider">Role at Company *</span>
          <span className="text-[10px] font-semibold text-text-ghost uppercase tracking-wider">Status</span>
          <span />
        </div>

        <div className="space-y-2">
          {jobs.map(row => (
            <div key={row.id} className="grid grid-cols-1 sm:grid-cols-[1fr_160px_32px] gap-2 items-center">
              <input
                value={row.title}
                onChange={e => setJob(row.id, 'title', e.target.value)}
                className={INPUT_CLASS}
                placeholder="Software Engineer at Acme *"
              />
              <select
                value={row.status}
                onChange={e => setJob(row.id, 'status', e.target.value)}
                className={INPUT_CLASS}
              >
                {STATUSES.map(s => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
              <RemoveBtn onClick={() => removeJob(row.id)} />
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setJobs(rows => [...rows, emptyJob()])}
          className="mt-3 text-xs font-semibold text-[var(--c-accent)] hover:opacity-75 transition-opacity"
        >
          + Add job
        </button>
      </div>

      {/* ── Submit ─────────────────────────────────────────────────────────── */}
      <div className="border-t border-border-subtle pt-6">
        {importError && (
          <p className="text-sm text-[#F87171] bg-[rgba(248,113,113,0.08)] border border-[rgba(248,113,113,0.2)] rounded-lg px-3 py-2 mb-4">
            {importError}
          </p>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <button
            type="button"
            onClick={handleImport}
            disabled={totalItems === 0 || isPending}
            className="bg-primary hover:opacity-90 text-primary-foreground text-sm font-semibold px-6 py-2.5 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isPending
              ? 'Importing…'
              : totalItems > 0
                ? `Import ${totalItems} item${totalItems !== 1 ? 's' : ''}`
                : 'Import'}
          </button>

          {totalItems > 0 && (
            <span className="text-xs text-text-dim">
              {[
                filledContacts.length > 0 && `${filledContacts.length} contact${filledContacts.length !== 1 ? 's' : ''}`,
                filledJobs.length > 0 && `${filledJobs.length} job${filledJobs.length !== 1 ? 's' : ''}`,
              ].filter(Boolean).join(' · ')}
            </span>
          )}
        </div>

        <p className="text-xs text-text-ghost mt-3">
          Empty rows are skipped. You can edit any entry after importing.
        </p>
      </div>
    </div>
  )
}
