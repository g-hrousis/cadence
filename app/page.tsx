import type { Metadata } from 'next'
import Link from 'next/link'
import './landing.css'

export const metadata: Metadata = {
  title: 'Cadence OS — Job Search CRM for Serious Job Seekers',
  description: 'Track every contact, every application, every follow-up — in one place. Cadence OS is the job search CRM built for people who treat the hunt like a system.',
  alternates: { canonical: 'https://cadenceos.app' },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'SoftwareApplication',
      name: 'Cadence OS',
      alternateName: 'Cadence',
      applicationCategory: 'BusinessApplication',
      applicationSubCategory: 'Job Search CRM',
      operatingSystem: 'Web',
      url: 'https://cadenceos.app',
      description: 'Cadence OS is a job search CRM that helps serious job seekers track contacts, manage follow-ups, and never let a warm lead go cold. Features pipeline tracking, relationship warmth scoring, interaction logging, and smart follow-up reminders.',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD', availability: 'https://schema.org/InStock' },
      featureList: [
        'Job application pipeline tracking',
        'Contact relationship management with warmth scoring',
        'Interaction logging (LinkedIn, email, calls, in-person)',
        'Automatic follow-up task creation',
        'Network cold-contact alerts',
        'Screenshot-to-contact AI import',
        'Dashboard analytics and pipeline health',
        'Bulk import for contacts and jobs',
        'Mobile-responsive with bottom tab navigation',
      ],
      audience: { '@type': 'Audience', audienceType: 'Job seekers, Career changers, Recent graduates' },
      creator: { '@type': 'Organization', name: 'Cadence OS', url: 'https://cadenceos.app' },
    },
    {
      '@type': 'WebSite',
      name: 'Cadence OS',
      url: 'https://cadenceos.app',
      description: 'Job search CRM for serious job seekers',
      potentialAction: {
        '@type': 'RegisterAction',
        target: 'https://cadenceos.app/signup',
        name: 'Get started for free',
      },
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What is Cadence OS?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Cadence OS is a job search CRM (Customer Relationship Manager) designed specifically for job seekers. It helps you track job applications, manage your professional network, log interactions with recruiters and hiring managers, and set follow-up reminders so no opportunity slips through the cracks.',
          },
        },
        {
          '@type': 'Question',
          name: 'Is Cadence OS free?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes, Cadence OS is free to get started with no credit card required. Sign up at cadenceos.app/signup and begin tracking your job search pipeline immediately.',
          },
        },
        {
          '@type': 'Question',
          name: 'How does Cadence OS help with job searching?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Cadence OS tracks every contact in your network with warmth scores, manages your job application pipeline across stages (Networking, Applied, Interviewing, Offer, Rejected), logs every interaction by channel (LinkedIn, email, calls, in-person), and surfaces smart follow-up reminders so you never let a warm lead go cold.',
          },
        },
        {
          '@type': 'Question',
          name: 'What makes Cadence OS different from a spreadsheet?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Cadence OS automatically tracks relationship warmth, creates follow-up tasks based on your interaction history, visualizes your pipeline health, alerts you when contacts are going cold, and can even extract contact information from LinkedIn screenshots using AI — all things a spreadsheet requires significant manual effort to replicate.',
          },
        },
        {
          '@type': 'Question',
          name: 'Who is Cadence OS designed for?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Cadence OS is built for active job seekers who want to manage their job search systematically — whether you are a recent graduate, a career changer, or an experienced professional. It is especially useful for those who rely heavily on networking, as it helps track relationship health across a large number of contacts.',
          },
        },
      ],
    },
  ],
}

export default function LandingPage() {
  return (
    <div className="landing-root">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Noise texture overlay */}
      <div className="landing-noise" aria-hidden="true" />

      {/* ── NAV ───────────────────────────────────────────────────────────── */}
      <nav className="landing-nav">
        <div className="landing-nav-inner">
          <span className="landing-logo">
            Cadence<span className="landing-logo-dot">.</span>
          </span>
          <div className="landing-nav-links">
            <a href="#features" className="landing-nav-link">Features</a>
            <a href="#how" className="landing-nav-link">How it works</a>
            <Link href="/login" className="landing-nav-link">Sign in</Link>
            <Link href="/signup" className="landing-nav-cta">Get started →</Link>
          </div>
        </div>
      </nav>

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section className="landing-hero">
        <div className="landing-blob landing-blob-1" aria-hidden="true" />
        <div className="landing-blob landing-blob-2" aria-hidden="true" />

        <div className="landing-hero-content">
          <div className="landing-eyebrow">
            <span className="landing-pulse-dot" />
            Career Pipeline OS
          </div>

          <h1 className="landing-h1">
            Your job search runs on{' '}
            <em className="landing-h1-accent">cadence</em>
          </h1>

          <p className="landing-sub">
            Track every contact, every application, every follow-up — in one place.
            Built for job seekers who treat the search like a system.
          </p>

          <div className="landing-ctas">
            <Link href="/signup" className="landing-btn-primary">Start for free</Link>
            <a href="#features" className="landing-btn-ghost">See how it works</a>
          </div>

          {/* Pipeline visual */}
          <div className="landing-pipeline">
            {([
              { emoji: '📨', label: 'Applied', count: '12' },
              { emoji: '📞', label: 'Following Up', count: '8' },
              { emoji: '🗓', label: 'Interviewing', count: '4', accent: true },
              { emoji: '🏁', label: 'Final Round', count: '2' },
              { emoji: '🎉', label: 'Offer', count: '1' },
            ] as const).map(stage => (
              <div key={stage.label} className="landing-stage">
                <div className="landing-stage-emoji">{stage.emoji}</div>
                <div className="landing-stage-label">{stage.label}</div>
                <div className={`landing-stage-count${'accent' in stage && stage.accent ? ' landing-stage-count-accent' : ''}`}>
                  {stage.count}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS BAR ─────────────────────────────────────────────────────── */}
      <div className="landing-stats">
        <div className="landing-stats-inner">
          {([
            { number: '73%', label: 'of jobs are filled through networking' },
            { number: '5–7', label: 'follow-ups before a response, on average' },
            { number: '0', label: 'warm leads dropped when you track everything' },
          ] as const).map(stat => (
            <div key={stat.number} className="landing-stat">
              <div className="landing-stat-number">{stat.number}</div>
              <div className="landing-stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── FEATURES ──────────────────────────────────────────────────────── */}
      <section id="features" className="landing-section">
        <div className="landing-section-header">
          <p className="landing-eyebrow-label">Features</p>
          <h2 className="landing-h2">Everything your job search needs</h2>
        </div>

        <div className="landing-features-grid">
          {([
            {
              icon: '📋', title: 'Pipeline Board',
              desc: 'Visualize every opportunity in a clear Kanban-style board. Move cards as you progress through each stage of the process.',
            },
            {
              icon: '🔔', title: 'Follow-up Reminders',
              desc: 'Never let a conversation go cold. Set smart reminders tied to each contact so you follow up at exactly the right time.',
            },
            {
              icon: '🗂', title: 'Contact Tracking',
              desc: 'Keep a full record of every person in your network — role, company, last touchpoint, and every interaction logged.',
            },
            {
              icon: '📊', title: 'Search Analytics',
              desc: 'See your pipeline health at a glance. Track response rates, conversion by stage, and activity over time.',
            },
          ] as const).map((feat, i) => (
            <div
              key={feat.title}
              className={`landing-feature-card${i % 2 === 0 ? ' landing-feature-card-br' : ''}${i < 2 ? ' landing-feature-card-bb' : ''}`}
            >
              <div className="landing-feature-icon">{feat.icon}</div>
              <h3 className="landing-feature-title">{feat.title}</h3>
              <p className="landing-feature-desc">{feat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ──────────────────────────────────────────────────── */}
      <section id="how" className="landing-how">
        <div className="landing-how-inner">
          <div className="landing-section-header">
            <p className="landing-eyebrow-label">How it works</p>
            <h2 className="landing-h2">Three steps to a smarter search</h2>
          </div>
          <div className="landing-how-grid">
            {([
              {
                step: '01', title: 'Add contacts',
                desc: 'Import or add people from your network — recruiters, hiring managers, referrals, and alumni.',
              },
              {
                step: '02', title: 'Track touchpoints',
                desc: 'Log every email, call, and coffee chat. See the full history of each relationship at a glance.',
              },
              {
                step: '03', title: 'Never miss a follow-up',
                desc: 'Cadence surfaces who needs a nudge so you stay top of mind without the mental overhead.',
              },
            ] as const).map(s => (
              <div key={s.step}>
                <div className="landing-step-num">{s.step}</div>
                <h3 className="landing-step-title">{s.title}</h3>
                <p className="landing-step-desc">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BAND ──────────────────────────────────────────────────────── */}
      <section className="landing-cta-band">
        <div className="landing-cta-glow" aria-hidden="true" />
        <div className="landing-cta-content">
          <h2 className="landing-cta-h2">Ready to run your search like a system?</h2>
          <p className="landing-cta-sub">
            Join job seekers who treat the job hunt like a pipeline — and close faster.
          </p>
          <Link href="/signup" className="landing-btn-primary">Start for free →</Link>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────────────────── */}
      <footer className="landing-footer">
        <div className="landing-footer-inner">
          <span className="landing-footer-logo">
            Cadence<span className="landing-logo-dot">.</span>
          </span>
          <span className="landing-footer-copy">
            © {new Date().getFullYear()} Cadence OS. All rights reserved.
          </span>
          <div className="landing-footer-links">
            <a href="#features" className="landing-footer-link">Features</a>
            <a href="#how" className="landing-footer-link">How it works</a>
            <Link href="/login" className="landing-footer-link">Sign in</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
