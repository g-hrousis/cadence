import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { IntakeForm } from '@/components/onboarding/IntakeForm'
import { CadenceLogo } from '@/components/ui/CadenceLogo'
import type { Profile } from '@/types'

export default async function OnboardingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // If they already have a profile, let them edit but don't force them here
  const { data: existingProfile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const profile = existingProfile as Profile | null
  const isEdit = !!profile?.first_name

  return (
    <div className="min-h-screen bg-[#09090E] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Wordmark */}
        <div className="mb-8 flex items-center justify-center gap-3">
          <CadenceLogo size={36} />
          <span className="text-2xl font-bold text-[#EDEDF2] tracking-tight">Cadence</span>
        </div>

        {/* Card */}
        <div className="c-card-p">
          <div className="mb-6">
            <h1 className="text-lg font-bold text-[#EDEDF2] mb-1">
              {isEdit ? 'Edit your profile' : "Let\u2019s get to know you"}
            </h1>
            <p className="text-sm text-[#8888A8]">
              {isEdit
                ? 'Update your information below.'
                : 'A few quick details so Cadence can surface what matters to you.'}
            </p>
          </div>

          <IntakeForm
            firstName={profile?.first_name ?? undefined}
            lastName={profile?.last_name ?? undefined}
            targetedJob={profile?.targeted_job ?? undefined}
            industry={profile?.industry ?? undefined}
          />
        </div>

        {isEdit && (
          <p className="text-center mt-4">
            <a href="/dashboard" className="text-xs text-[#585870] hover:text-[#8888A8] transition-colors">
              ← Back to dashboard
            </a>
          </p>
        )}
      </div>
    </div>
  )
}
