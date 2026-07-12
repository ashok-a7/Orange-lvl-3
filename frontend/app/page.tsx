'use client';

import Link from 'next/link';
import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FloatingShapes } from './components/effects/FloatingShapes';

// ─── Data ─────────────────────────────────────────────────────────────────────
const stats = [
  { label: 'Contract Functions', value: '12+' },
  { label: 'State Transitions', value: '7' },
  { label: 'Supported Assets', value: '∞' },
  { label: 'Audit Tests', value: '15+' },
];

const features = [
  {
    n: '01',
    title: 'Bilateral Confirmation',
    description: 'Funds release only when BOTH buyer and seller independently confirm. No single point of trust.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
        <circle cx="9" cy="12" r="6" /><circle cx="15" cy="12" r="6" />
      </svg>
    ),
  },
  {
    n: '02',
    title: 'Milestone Releases',
    description: 'Split payments across project milestones — 30% on start, 70% on delivery, configurable per listing.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <line x1="5" y1="4" x2="5" y2="20" /><polyline points="5,4 19,4 15,10 19,16 5,16" />
      </svg>
    ),
  },
  {
    n: '03',
    title: 'Deadline Protection',
    description: 'If the seller goes silent, the buyer gets a full refund after the 7-day deadline. Nothing locked forever.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
        <circle cx="12" cy="12" r="8" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="12" x2="15" y2="14" />
      </svg>
    ),
  },
  {
    n: '04',
    title: 'Dispute Arbitration',
    description: 'Disputes freeze funds and route to a designated arbiter. Resolution credits the winner automatically.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="4" x2="12" y2="20" /><line x1="4" y1="8" x2="20" y2="8" />
        <path d="M4,8 Q2,12 4,16 Q6,12 4,8" /><path d="M20,8 Q22,12 20,16 Q18,12 20,8" />
        <line x1="8" y1="20" x2="16" y2="20" />
      </svg>
    ),
  },
  {
    n: '05',
    title: 'Multi-Asset Support',
    description: 'Accept XLM, USDC, or any Stellar Asset Contract token. Any SEP-41 compliant asset works out of the box.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
        <ellipse cx="12" cy="7" rx="7" ry="2.5" />
        <path d="M5,7 Q5,11 12,11 Q19,11 19,7" /><path d="M5,11 Q5,15 12,15 Q19,15 19,11" /><path d="M5,15 Q5,19 12,19 Q19,19 19,15" />
      </svg>
    ),
  },
  {
    n: '06',
    title: 'Composable Primitives',
    description: 'Built as a reusable Soroban escrow layer. Any marketplace or P2P app on Stellar can build on top of it.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="12,3 21,8.5 12,14 3,8.5 12,3" /><line x1="3" y1="13.5" x2="12" y2="19" /><line x1="21" y1="13.5" x2="12" y2="19" />
      </svg>
    ),
  },
];

const howItWorks = [
  { step: '01', title: 'Seller Lists', description: 'Seller creates a listing with price, asset, and optional milestone configuration.' },
  { step: '02', title: 'Buyer Opens Escrow', description: 'Buyer opens an escrow, locking the listing. Funds transfer to the vault on fund().' },
  { step: '03', title: 'Both Confirm', description: 'Buyer confirms receipt, seller confirms delivery. Funds release automatically.', sealed: true },
  { step: '04', title: 'Settled On-Chain', description: 'Funds move to the seller. Listing marked Completed. Full audit trail on Stellar.' },
];

// ─── Scroll-reveal hook ────────────────────────────────────────────────────────
function useScrollReveal(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);
  return { ref, visible };
}

// ─── Signature element: the Bilateral Lock — two orbiting rings that lock ─────
function BilateralLock({ size = 88, active = false, spin = false }: { size?: number; active?: boolean; spin?: boolean }) {
  return (
    <div className={`bl-wrap ${active ? 'bl-active' : ''}`} style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox="0 0 100 100" className={spin ? 'geo-spin' : ''} style={{ position: 'absolute', inset: 0, opacity: 0.5 }} aria-hidden="true">
        <circle cx="50" cy="50" r="47" fill="none" stroke="url(#blOrbit)" strokeWidth="0.6" strokeDasharray="1 4" />
        <defs>
          <linearGradient id="blOrbit" x1="0" y1="0" x2="100" y2="100">
            <stop offset="0%" stopColor="#9B82FF" /><stop offset="100%" stopColor="#3FE0C5" />
          </linearGradient>
        </defs>
      </svg>
      <svg width={size} height={size} viewBox="0 0 100 100" fill="none" aria-hidden="true" style={{ position: 'absolute', inset: 0 }}>
        <path className="bl-arc-left" d="M 41 21 A 29 29 0 0 0 41 79" stroke="url(#blRingA)" strokeWidth="6.5" strokeLinecap="round" />
        <path className="bl-arc-right" d="M 59 21 A 29 29 0 0 1 59 79" stroke="url(#blRingB)" strokeWidth="6.5" strokeLinecap="round" />
        <defs>
          <linearGradient id="blRingA" x1="12" y1="20" x2="45" y2="80">
            <stop offset="0%" stopColor="#B4A1FF" /><stop offset="100%" stopColor="#5B3FE0" />
          </linearGradient>
          <linearGradient id="blRingB" x1="55" y1="20" x2="88" y2="80">
            <stop offset="0%" stopColor="#F9D68A" /><stop offset="100%" stopColor="#E8A63D" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

// ─── Feature card ──────────────────────────────────────────────────────
function FeatureCard({ feature, delay }: { feature: (typeof features)[number]; delay: number }) {
  const { ref, visible } = useScrollReveal();
  return (
    <div
      ref={ref}
      className={`ll-card ll-card-hover feature-card ${visible ? 'll-fade-up' : 'll-hidden'}`}
      style={{ animationDelay: `${delay}ms`, padding: 'var(--spacing-4)' }}
    >
      <div className="feature-card-icon">{feature.icon}</div>
      <span className="type-mono-sm feature-card-num">{feature.n}</span>
      <h3 className="type-heading" style={{ color: 'var(--color-ink)', margin: '14px 0 8px' }}>{feature.title}</h3>
      <p className="type-body-sm" style={{ color: 'var(--color-ink-muted)' }}>{feature.description}</p>
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────
export default function LandingPage() {
  const [heroVisible, setHeroVisible] = useState(false);
  const [stamped, setStamped] = useState(false);
  const hiw = useScrollReveal(0.1);
  const receipt = useScrollReveal(0.3);

  useEffect(() => {
    const t1 = setTimeout(() => setHeroVisible(true), 80);
    const t2 = setTimeout(() => setStamped(true), 620);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <div className="overflow-hidden">
      {/* ── Hero ────────────────────────────────────────────────────────────── */}
      <section className="relative" style={{ paddingTop: 'var(--spacing-12)', paddingBottom: 'var(--spacing-12)' }}>
        <FloatingShapes />
        <div className="container-wide relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 items-center" style={{ gap: 'var(--spacing-8)' }}>
            {/* Left: copy */}
            <div>
              <div className={`glass-chip ll-fade-slot ${heroVisible ? 'll-in' : ''}`} style={{ marginBottom: 'var(--spacing-3)', transitionDelay: '0ms', color: 'var(--color-accent2-bright)' }}>
                <span className="type-eyebrow" style={{ gap: 6 }}>
                  Soroban Smart Contract · Stellar Network
                </span>
              </div>

              <h1 className={`type-display-2xl ll-fade-slot ${heroVisible ? 'll-in' : ''}`} style={{ color: 'var(--color-ink)', maxWidth: '15ch', marginBottom: 'var(--spacing-3)', transitionDelay: '80ms' }}>
                Escrow,{' '}
                <span className="text-gradient-aurora">sealed</span>{' '}
                on-chain.
              </h1>

              <p className={`type-body ll-fade-slot ${heroVisible ? 'll-in' : ''}`} style={{ color: 'var(--color-ink-muted)', maxWidth: '52ch', marginBottom: 'var(--spacing-4)', transitionDelay: '160ms' }}>
                LumenLock brings bilateral confirmation, milestone-based release, and dispute
                arbitration to the Stellar ecosystem — the escrow primitive every P2P
                marketplace has been missing.
              </p>

              <div className={`flex flex-col sm:flex-row gap-3 ll-fade-slot ${heroVisible ? 'll-in' : ''}`} style={{ transitionDelay: '240ms' }}>
                <Link href="/marketplace" className="btn-primary" id="explore-marketplace-btn">Explore Marketplace →</Link>
                <Link href="/dashboard" className="btn-secondary" id="open-dashboard-btn">Open Dashboard</Link>
              </div>
            </div>

            {/* Right: escrow receipt artifact — frosted glass plaque, sealed by the Bilateral Lock */}
            <div ref={receipt.ref} className={`flex justify-center ll-receipt-stage ${receipt.visible ? 'll-receipt-in' : ''}`} aria-hidden="true">
              <div className="ll-receipt glass-border-glow">
                <div className="ll-receipt-head">
                  <span className="type-mono-sm">ESCROW #0417</span>
                  <span className="type-mono-sm ll-receipt-net">TESTNET</span>
                </div>
                <div className="ll-receipt-rule" />

                <div className="ll-receipt-row"><span>Listing</span><span className="ll-leader" /><span className="type-mono-sm">Website Redesign</span></div>
                <div className="ll-receipt-row"><span>Asset</span><span className="ll-leader" /><span className="type-mono-sm">USDC</span></div>
                <div className="ll-receipt-row"><span>Amount</span><span className="ll-leader" /><span className="type-mono-sm">1,250.00</span></div>
                <div className="ll-receipt-row"><span>Buyer confirmed</span><span className="ll-leader" /><span className="type-mono-sm" style={{ color: 'var(--color-success)' }}>✓</span></div>
                <div className="ll-receipt-row"><span>Seller confirmed</span><span className="ll-leader" /><span className="type-mono-sm" style={{ color: 'var(--color-success)' }}>✓</span></div>

                <div className="ll-receipt-rule" />
                <div className="ll-receipt-status">
                  <span className="type-mono-sm">STATUS</span>
                  <span className="type-mono-sm ll-receipt-status-value">RELEASED</span>
                </div>

                <div className="ll-receipt-seal">
                  {receipt.visible && stamped && (
                    <div className="ll-stamp-ring stamp-ring" aria-hidden="true" />
                  )}
                  <div className={stamped ? 'stamp-impact' : ''} style={{ opacity: stamped ? 1 : 0 }}>
                    <BilateralLock size={76} active spin />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats Strip ───────────────────────────────────────────────── */}
      <section>
        <div className="container-wide">
          <div className="glass-panel flex flex-col sm:flex-row items-stretch" style={{ padding: 'var(--spacing-3) 0' }}>
            {stats.map(({ label, value }, i) => (
              <div key={label} className="ll-stat-cell" style={{ borderRight: i < stats.length - 1 ? '1px solid var(--color-border)' : undefined }}>
                <span className="type-mono ll-stat-value text-gradient-violet">{value}</span>
                <span className="type-caption" style={{ color: 'var(--color-ink-faint)' }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Feature Grid ───────────────────────────────────────────────────── */}
      <section style={{ paddingTop: 'var(--spacing-12)', paddingBottom: 'var(--spacing-12)' }} id="features">
        <div className="container-wide">
          <div className="text-center" style={{ maxWidth: 640, margin: '0 auto var(--spacing-6)' }}>
            <p className="type-eyebrow" style={{ color: 'var(--color-accent2-bright)', marginBottom: 12, justifyContent: 'center' }}>Register of Capabilities</p>
            <h2 className="type-display-lg" style={{ color: 'var(--color-ink)', marginBottom: 'var(--spacing-2)' }}>
              The Escrow Primitive Stellar Was Missing
            </h2>
            <p className="type-body" style={{ color: 'var(--color-ink-muted)', maxWidth: '58ch', margin: '0 auto' }}>
              Stellar&apos;s native claimable balances support conditional release — but not
              bilateral confirmation, dispute freezing, or milestone-based partial releases.
              LumenLock fills that gap.
            </p>
          </div>

          <div className="feature-grid">
            {features.map((feature, i) => <FeatureCard key={feature.title} feature={feature} delay={i * 60} />)}
          </div>
        </div>
      </section>

      {/* ── How It Works ─────────────────────────────────────────────────────── */}
      <section className="relative" style={{ paddingTop: 'var(--spacing-12)', paddingBottom: 'var(--spacing-12)' }} id="how-it-works">
        <div
          aria-hidden="true"
          style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(180deg, transparent, rgba(124,92,252,0.05) 50%, transparent)',
            borderTop: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)',
          }}
        />
        <div className="container-wide relative">
          <div className="text-center" style={{ maxWidth: 640, margin: '0 auto var(--spacing-6)' }}>
            <p className="type-eyebrow" style={{ color: 'var(--color-ink-faint)', marginBottom: 12, justifyContent: 'center' }}>The Settlement Trail</p>
            <h2 className="type-display-lg" style={{ color: 'var(--color-ink)', marginBottom: 'var(--spacing-1)' }}>How It Works</h2>
            <p className="type-body" style={{ color: 'var(--color-ink-muted)' }}>Four steps from listing to settlement.</p>
          </div>

          <div ref={hiw.ref} className={`ll-trail ${hiw.visible ? 'll-fade-up' : 'll-hidden'}`}>
            {howItWorks.map((step, i) => (
              <div key={step.step} className="ll-trail-row">
                <div className="ll-trail-marker">
                  {step.sealed ? <BilateralLock size={40} active={hiw.visible} /> : <span className="type-mono-sm">{step.step}</span>}
                </div>
                {i < howItWorks.length - 1 && <div className="ll-trail-line" />}
                <div className="ll-trail-body">
                  <h3 className="type-heading" style={{ color: 'var(--color-ink)', marginBottom: 6 }}>{step.title}</h3>
                  <p className="type-body-sm" style={{ color: 'var(--color-ink-muted)' }}>{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Panel ─────────────────────────────────────────────────────── */}
      <motion.section
        className="relative"
        style={{ padding: 'var(--spacing-12) 0' }}
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
      >
        <div className="container-wide">
          <div className="glass-border-glow ll-cta vault-grain">
            <div className="ll-cta-glow-a" aria-hidden="true" />
            <div className="ll-cta-glow-b" aria-hidden="true" />
            <div className="ll-cta-inner relative z-10">
              <p className="type-eyebrow" style={{ color: 'var(--color-accent-bright)', marginBottom: 'var(--spacing-2)' }}>Get Started Today</p>
              <h2 className="type-display-lg" style={{ color: 'var(--color-invert-ink)', marginBottom: 'var(--spacing-3)' }}>Ready to transact trustlessly?</h2>
              <p className="type-body" style={{ color: 'rgba(245,243,255,0.62)', maxWidth: '48ch', marginBottom: 'var(--spacing-4)' }}>
                Connect your Stellar wallet and start buying or selling on the decentralized
                marketplace. Every trade is protected by an on-chain escrow vault.
              </p>
              <Link href="/marketplace" className="btn-primary" id="cta-marketplace-btn">Get Started →</Link>
            </div>
          </div>
        </div>
      </motion.section>

      <style jsx>{`
        .ll-hero-sealed {
          font-style: italic;
          font-family: var(--font-display);
        }

        .ll-fade-slot { opacity: 0; transform: translateY(16px); transition: opacity 0.6s ease, transform 0.6s ease; }
        .ll-fade-slot.ll-in { opacity: 1; transform: translateY(0); }

        .ll-receipt-stage { opacity: 0; transform: translateY(24px) rotate(0deg); transition: opacity 0.7s ease, transform 0.7s ease; }
        .ll-receipt-stage.ll-receipt-in { opacity: 1; transform: translateY(0) rotate(-2.5deg); }
        .ll-receipt {
          position: relative;
          width: 340px;
          background: rgba(2,2,8,0.66);
          color: var(--color-invert-ink);
          padding: 26px 24px 30px;
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-vault);
          backdrop-filter: blur(28px) saturate(160%);
          -webkit-backdrop-filter: blur(28px) saturate(160%);
        }
        .ll-receipt-head { display: flex; justify-content: space-between; opacity: 0.75; margin-bottom: 14px; }
        .ll-receipt-net { color: var(--color-cyan); }
        .ll-receipt-rule { border-top: 1px dashed var(--color-invert-line); margin: 12px 0; }
        .ll-receipt-row { display: flex; align-items: baseline; font-size: 0.85rem; margin-bottom: 9px; gap: 8px; }
        .ll-receipt-row > span:first-child { flex-shrink: 0; opacity: 0.65; }
        .ll-receipt-row > span:last-child { flex-shrink: 0; }
        .ll-leader { flex: 1; border-bottom: 1px dotted var(--color-invert-line); position: relative; top: -3px; }
        .ll-receipt-status { display: flex; justify-content: space-between; align-items: center; margin-top: 4px; }
        .ll-receipt-status-value { color: var(--color-accent-bright); font-weight: 600; letter-spacing: 0.04em; }
        .ll-receipt-seal { position: absolute; bottom: -22px; right: -14px; }
        .ll-stamp-ring {
          position: absolute; inset: 0;
          border-radius: 50%;
          border: 2px solid var(--color-accent-bright);
        }

        .bl-wrap { position: relative; }
        .bl-arc-left, .bl-arc-right { opacity: 0; transform-origin: 50px 50px; transition: opacity 0.5s ease 0.1s, transform 0.6s cubic-bezier(0.34,1.56,0.64,1) 0.1s; }
        .bl-arc-left { transform: translateX(-8px) scale(1.15); }
        .bl-arc-right { transform: translateX(8px) scale(1.15); }
        .bl-active .bl-arc-left, .bl-active .bl-arc-right { opacity: 1; transform: translateX(0) scale(1); }

        .ll-stat-cell { flex: 1; padding: 8px var(--spacing-3); }
        .ll-stat-value { display: block; font-size: clamp(1.6rem, 3vw, 2.25rem); margin-bottom: 6px; }

        .feature-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: var(--spacing-3);
        }
        .feature-card { position: relative; }
        .feature-card-icon {
          width: 44px; height: 44px; border-radius: var(--radius-md);
          display: flex; align-items: center; justify-content: center;
          color: var(--color-accent2-bright);
          background: var(--color-accent2-soft);
        }
        .feature-card-num {
          position: absolute; top: var(--spacing-4); right: var(--spacing-4);
          color: var(--color-ink-faint);
        }

        .ll-hidden { opacity: 0; }
        .ll-fade-up { animation: llFadeUp 0.6s ease forwards; }
        @keyframes llFadeUp { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }

        .ll-trail { max-width: 640px; margin: 0 auto; }
        .ll-trail-row { display: grid; grid-template-columns: 48px 1fr; column-gap: 22px; position: relative; }
        .ll-trail-marker {
          grid-row: 1; width: 48px; height: 48px; border-radius: 50%;
          border: 1px solid var(--color-border-strong);
          background: var(--color-surface);
          backdrop-filter: blur(12px);
          display: flex; align-items: center; justify-content: center;
          color: var(--color-accent2-bright); z-index: 1;
        }
        .ll-trail-line { grid-column: 1; width: 1px; margin: 0 auto; background: linear-gradient(180deg, var(--color-accent2-border), transparent); height: 100%; min-height: 60px; }
        .ll-trail-body { padding-bottom: 40px; padding-top: 8px; }

        .ll-cta { position: relative; padding: var(--spacing-12) var(--spacing-6); overflow: hidden; background: var(--color-invert-bg); }
        .ll-cta-glow-a { position: absolute; top: -20%; right: -10%; width: 420px; height: 420px; border-radius: 50%; background: radial-gradient(circle, rgba(124,92,252,0.25), transparent 70%); pointer-events: none; }
        .ll-cta-glow-b { position: absolute; bottom: -30%; left: -10%; width: 380px; height: 380px; border-radius: 50%; background: radial-gradient(circle, rgba(63,224,197,0.15), transparent 70%); pointer-events: none; }
        .ll-cta-inner { max-width: 560px; display: flex; flex-direction: column; align-items: flex-start; }

        @media (max-width: 1023px) { .ll-receipt-stage { margin-top: 48px; } }
        @media (max-width: 900px) {
          .feature-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 640px) {
          .feature-grid { grid-template-columns: 1fr; }
          .ll-trail-row { grid-template-columns: 40px 1fr; }
          .ll-trail-marker { width: 40px; height: 40px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .ll-fade-slot, .ll-receipt-stage, .bl-arc-left, .bl-arc-right { transition: none !important; animation: none !important; opacity: 1 !important; transform: none !important; }
        }
      `}</style>
    </div>
  );
}
