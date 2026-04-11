import Link from 'next/link'
import { formatRelative } from '@/lib/utils/dates'
import { channelLabel } from '@/lib/utils/labels'
import { GuideButton } from '@/components/ui/GuideModal'
import type { InteractionWithContact } from '@/types'

// Channel icons — small SVGs, visually distinct
function ChannelIcon({ channel }: { channel: string }) {
  const base = 'w-6 h-6 rounded-full flex items-center justify-center shrink-0'

  if (channel === 'linkedin') {
    return (
      <div className={`${base} bg-[rgba(79,122,255,0.12)]`}>
        <svg className="w-3 h-3 text-[#4F7AFF]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
          <circle cx="4" cy="4" r="2" />
        </svg>
      </div>
    )
  }
  if (channel === 'email') {
    return (
      <div className={`${base} bg-[rgba(251,191,36,0.1)]`}>
        <svg className="w-3 h-3 text-[#FBBF24]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      </div>
    )
  }
  if (channel === 'call') {
    return (
      <div className={`${base} bg-[rgba(34,197,94,0.1)]`}>
        <svg className="w-3 h-3 text-[#22C55E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      </div>
    )
  }
  // in_person
  return (
    <div className={`${base} bg-[rgba(167,139,250,0.1)]`}>
      <svg className="w-3 h-3 text-[#A78BFA]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    </div>
  )
}

interface RecentActivityProps {
  interactions: InteractionWithContact[]
}

export function RecentActivity({ interactions }: RecentActivityProps) {
  return (
    <div className="bg-[#0D0D14] border border-[rgba(255,255,255,0.06)] rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold text-[#EDEDF2]">Recent Activity</h2>
          <GuideButton guideKey="interaction" />
        </div>
        <Link href="/contacts" className="text-xs text-[#4F7AFF] hover:text-[#7A9BFF] transition-colors font-medium">
          See all
        </Link>
      </div>

      {interactions.length === 0 ? (
        <p className="text-xs text-[#585870]">
          No activity yet.{' '}
          <Link href="/contacts/new" className="text-[#4F7AFF] hover:text-[#7A9BFF]">
            Add a contact
          </Link>
        </p>
      ) : (
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-3 top-3 bottom-3 w-px bg-[rgba(255,255,255,0.04)]" />

          <div className="space-y-0">
            {interactions.map((interaction, i) => {
              const contactName = interaction.contacts?.name
              const description = interaction.notes?.trim()
                ? interaction.notes.length > 40
                  ? interaction.notes.slice(0, 40) + '…'
                  : interaction.notes
                : `${channelLabel(interaction.channel)} interaction`

              return (
                <div
                  key={interaction.id}
                  className="relative flex items-start gap-3 py-2.5 border-b border-[rgba(255,255,255,0.03)] last:border-0"
                >
                  {/* Icon sits on the timeline */}
                  <ChannelIcon channel={interaction.channel} />

                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-[#EDEDF2] leading-snug">
                      <span className="font-semibold">{channelLabel(interaction.channel)}</span>
                      {contactName && (
                        <span className="text-[#8888A8] font-normal"> with {contactName}</span>
                      )}
                      {' '}
                      <span className="text-[#585870] text-xs">— {description}</span>
                    </p>
                  </div>

                  <span className="text-[10px] text-[#585870] shrink-0 mt-0.5">
                    {i === 0 ? 'Today' : formatRelative(interaction.date)}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
