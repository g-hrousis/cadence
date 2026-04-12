import Link from 'next/link'

export default function LandingPage() {
  return (
    <div className="landing-root">
      <style>{`
        .landing-root {
          background: var(--landing-bg);
          color: var(--landing-text);
          font-family: var(--font-dm-sans), system-ui, sans-serif;
          min-height: 100vh;
          overflow-x: hidden;
        }
        /* ── Nav ── */
        .landing-nav {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 100;
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid var(--landing-border);
          background: rgba(10,10,8,0.7);
        }
        .landing-nav-inner {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
          height: 64px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .landing-logo {
          font-family: var(--font-dm-serif);
          font-size: 1.375rem;
          color: var(--landing-text);
          letter-spacing: -0.02em;
          text-decoration: none;
        }
        .landing-logo-dot { color: var(--landing-accent); }
        .landing-nav-links {
          display: flex;
          align-items: center;
          gap: 32px;
        }
        .landing-nav-link {
          color: var(--landing-muted);
          text-decoration: none;
          font-size: 0.875rem;
          transition: color 0.2s;
        }
        .landing-nav-link:hover { color: var(--landing-text); }
        .landing-nav-cta {
          background: var(--landing-accent);
          color: #0a0a08;
          padding: 8px 18px;
          border-radius: 8px;
          font-size: 0.875rem;
          font-weight: 500;
          text-decoration: none;
          transition: opacity 0.2s;
        }
        .landing-nav-cta:hover { opacity: 0.88; }
        @media (max-width: 639px) {
          .landing-nav-link:not(.landing-nav-cta) { display: none; }
        }
        /* ── Hero ── */
        .landing-hero {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          padding: 120px 24px 80px;
          overflow: hidden;
        }
        .landing-blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(120px);
          pointer-events: none;
        }
        .landing-blob-1 {
          top: 15%; left: 10%;
          width: 500px; height: 500px;
          background: radial-gradient(circle, rgba(200,240,96,0.18) 0%, transparent 70%);
          animation: drift 18s ease-in-out infinite alternate;
        }
        .landing-blob-2 {
          bottom: 20%; right: 8%;
          width: 400px; height: 400px;
          background: radial-gradient(circle, rgba(126,240,200,0.14) 0%, transparent 70%);
          animation: drift 18s ease-in-out infinite alternate-reverse;
        }
        .landing-hero-content {
          position: relative;
          z-index: 1;
          text-align: center;
          max-width: 760px;
          width: 100%;
        }
        .landing-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          border: 1px solid var(--landing-border);
          border-radius: 999px;
          padding: 6px 14px;
          margin-bottom: 32px;
          font-size: 0.8rem;
          color: var(--landing-muted);
          opacity: 0;
          animation: fadeUp 0.6s ease forwards 0s;
        }
        .landing-pulse-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: var(--landing-accent);
          animation: pulse 2s ease-in-out infinite;
          display: inline-block;
        }
        .landing-h1 {
          font-family: var(--font-dm-serif);
          font-size: clamp(2.6rem, 6vw, 4.25rem);
          line-height: 1.1;
          letter-spacing: -0.03em;
          margin-bottom: 24px;
          color: var(--landing-text);
          opacity: 0;
          animation: fadeUp 0.6s ease forwards 0.1s;
        }
        .landing-h1-accent {
          color: var(--landing-accent);
          font-style: italic;
        }
        .landing-sub {
          font-size: clamp(1rem, 2vw, 1.2rem);
          color: var(--landing-muted);
          line-height: 1.7;
          max-width: 560px;
          margin: 0 auto 40px;
          opacity: 0;
          animation: fadeUp 0.6s ease forwards 0.2s;
        }
        .landing-ctas {
          display: flex;
          gap: 12px;
          justify-content: center;
          flex-wrap: wrap;
          margin-bottom: 64px;
          opacity: 0;
          animation: fadeUp 0.6s ease forwards 0.3s;
        }
        .landing-btn-primary {
          background: var(--landing-accent);
          color: #0a0a08;
          padding: 13px 28px;
          border-radius: 10px;
          font-weight: 500;
          font-size: 0.95rem;
          text-decoration: none;
          transition: opacity 0.2s;
        }
        .landing-btn-primary:hover { opacity: 0.88; }
        .landing-btn-ghost {
          border: 1px solid var(--landing-border);
          color: var(--landing-text);
          padding: 13px 28px;
          border-radius: 10px;
          font-weight: 400;
          font-size: 0.95rem;
          text-decoration: none;
          transition: border-color 0.2s;
        }
        .landing-btn-ghost:hover { border-color: rgba(255,255,255,0.2); }
        .landing-pipeline {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          opacity: 0;
          animation: fadeUp 0.6s ease forwards 0.45s;
        }
        .landing-stage {
          padding: 14px 18px;
          border-top: 1px solid var(--landing-border);
          border-bottom: 1px solid var(--landing-border);
          border-right: 1px solid var(--landing-border);
          background: var(--landing-card-bg);
          text-align: center;
          min-width: 100px;
        }
        .landing-stage:first-child {
          border-left: 1px solid var(--landing-border);
          border-radius: 10px 0 0 10px;
        }
        .landing-stage:last-child { border-radius: 0 10px 10px 0; }
        .landing-stage-emoji { font-size: 1.25rem; margin-bottom: 6px; }
        .landing-stage-label {
          font-family: var(--font-dm-mono);
          font-size: 0.7rem;
          color: var(--landing-muted);
          margin-bottom: 4px;
          letter-spacing: 0.04em;
        }
        .landing-stage-count {
          font-family: var(--font-dm-mono);
          font-size: 1.1rem;
          font-weight: 500;
          color: var(--landing-text);
        }
        .landing-stage-count-accent { color: var(--landing-accent); }
        /* ── Stats Bar ── */
        .landing-stats {
          border-top: 1px solid var(--landing-border);
          border-bottom: 1px solid var(--landing-border);
          padding: 40px 24px;
        }
        .landing-stats-inner {
          max-width: 900px;
          margin: 0 auto;
          display: flex;
          justify-content: space-around;
          flex-wrap: wrap;
          gap: 40px;
        }
        .landing-stat { text-align: center; }
        .landing-stat-number {
          font-family: var(--font-dm-serif);
          font-size: 2.75rem;
          color: var(--landing-accent);
          line-height: 1;
          margin-bottom: 8px;
        }
        .landing-stat-label {
          font-size: 0.85rem;
          color: var(--landing-muted);
          max-width: 180px;
        }
        /* ── Features ── */
        .landing-section {
          padding: 100px 24px;
          max-width: 1000px;
          margin: 0 auto;
        }
        .landing-section-header { text-align: center; margin-bottom: 56px; }
        .landing-eyebrow-label {
          font-family: var(--font-dm-mono);
          font-size: 0.75rem;
          color: var(--landing-accent);
          letter-spacing: 0.12em;
          text-transform: uppercase;
          margin-bottom: 12px;
        }
        .landing-h2 {
          font-family: var(--font-dm-serif);
          font-size: clamp(1.8rem, 4vw, 2.6rem);
          color: var(--landing-text);
          letter-spacing: -0.02em;
        }
        .landing-features-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          border: 1px solid var(--landing-border);
          border-radius: 14px;
          overflow: hidden;
        }
        @media (max-width: 639px) {
          .landing-features-grid { grid-template-columns: 1fr; }
          .landing-feature-card { border-right: none !important; }
          .landing-feature-card:nth-child(odd) { border-right: none; }
          .landing-how-grid { grid-template-columns: 1fr !important; }
        }
        .landing-feature-card {
          padding: 36px 32px;
          background: var(--landing-card-bg);
        }
        .landing-feature-card-br { border-right: 1px solid var(--landing-border); }
        .landing-feature-card-bb { border-bottom: 1px solid var(--landing-border); }
        .landing-feature-icon { font-size: 2rem; margin-bottom: 16px; }
        .landing-feature-title {
          font-family: var(--font-dm-sans);
          font-size: 1.05rem;
          font-weight: 500;
          color: var(--landing-text);
          margin-bottom: 10px;
        }
        .landing-feature-desc {
          font-size: 0.875rem;
          color: var(--landing-muted);
          line-height: 1.65;
        }
        /* ── How It Works ── */
        .landing-how {
          padding: 80px 24px 100px;
          background: rgba(255,255,255,0.015);
          border-top: 1px solid var(--landing-border);
          border-bottom: 1px solid var(--landing-border);
        }
        .landing-how-inner { max-width: 1000px; margin: 0 auto; }
        .landing-how-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 32px;
        }
        .landing-step-num {
          font-family: var(--font-dm-mono);
          font-size: 0.75rem;
          color: var(--landing-accent);
          letter-spacing: 0.1em;
          margin-bottom: 16px;
        }
        .landing-step-title {
          font-family: var(--font-dm-sans);
          font-size: 1.1rem;
          font-weight: 500;
          color: var(--landing-text);
          margin-bottom: 10px;
        }
        .landing-step-desc {
          font-size: 0.875rem;
          color: var(--landing-muted);
          line-height: 1.65;
        }
        /* ── CTA Band ── */
        .landing-cta-band {
          padding: 100px 24px;
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        .landing-cta-glow {
          position: absolute;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          width: 600px; height: 400px;
          background: radial-gradient(ellipse, rgba(200,240,96,0.1) 0%, transparent 70%);
          pointer-events: none;
        }
        .landing-cta-content {
          position: relative;
          z-index: 1;
          max-width: 600px;
          margin: 0 auto;
        }
        .landing-cta-h2 {
          font-family: var(--font-dm-serif);
          font-size: clamp(2rem, 4.5vw, 3rem);
          color: var(--landing-text);
          letter-spacing: -0.025em;
          margin-bottom: 24px;
          line-height: 1.15;
        }
        .landing-cta-sub {
          color: var(--landing-muted);
          margin-bottom: 36px;
          font-size: 1rem;
          line-height: 1.6;
        }
        /* ── Footer ── */
        .landing-footer {
          border-top: 1px solid var(--landing-border);
          padding: 28px 24px;
        }
        .landing-footer-inner {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 16px;
        }
        .landing-footer-logo {
          font-family: var(--font-dm-serif);
          font-size: 1.1rem;
          color: var(--landing-text);
        }
        .landing-footer-copy {
          font-size: 0.8rem;
          color: var(--landing-muted);
        }
        .landing-footer-links { display: flex; gap: 24px; }
        .landing-footer-link {
          font-size: 0.8rem;
          color: var(--landing-muted);
          text-decoration: none;
          transition: color 0.2s;
        }
        .landing-footer-link:hover { color: var(--landing-text); }
        /* Noise overlay */
        .landing-noise {
          position: fixed;
          inset: 0;
          z-index: 9999;
          pointer-events: none;
          opacity: 0.028;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)'/%3E%3C/svg%3E");
        }
      `}</style>

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
