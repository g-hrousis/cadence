'use client'

import { useState } from 'react'
import { ContactForm } from './ContactForm'
import { ScreenshotImport, type ExtractedContact } from './ScreenshotImport'

export function NewContactClient() {
  const [extracted, setExtracted] = useState<ExtractedContact | null>(null)
  const [formKey, setFormKey] = useState(0)

  function handleExtracted(values: ExtractedContact) {
    setExtracted(values)
    setFormKey(k => k + 1) // remount form so defaultValues apply
  }

  return (
    <div>
      <ScreenshotImport onExtracted={handleExtracted} />
      <div className="border-t border-border-subtle pt-6">
        <ContactForm key={formKey} initialValues={extracted ?? undefined} />
      </div>
    </div>
  )
}
