'use client';

import Link from 'next/link';
import { useRef, useEffect, useState } from 'react';

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
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <circle cx="9" cy="12" r="6" /><circle cx="15" cy="12" r="6" />
      </svg>
    ),
  },
  {
    n: '02',
    title: 'Milestone Releases',
    description: 'Split payments across project milestones — 30% on start, 70% on delivery, configurable per listing.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="5" y1="4" x2="5" y2="20" /><polyline points="5,4 19,4 15,10 19,16 5,16" />
      </svg>
    ),
  },
  {
    n: '03',
    title: 'Deadline Protection',
    description: 'If the seller goes silent, the buyer gets a full refund after the 7-day deadline. Nothing locked forever.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <circle cx="12" cy="12" r="8" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="12" x2="15" y2="14" />
      </svg>
    ),
  },
  {
    n: '04',
    title: 'Dispute Arbitration',
    description: 'Disputes freeze funds and route to a designated arbiter. Resolution credits the winner automatically.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
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
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
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
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
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

// ─── Wax seal (signature element) ─────────────────────────────────────────────
function Seal({ size = 96, active = false, tone = 'accent' }: { size?: number; active?: boolean; tone?: 'accent' | 'invert' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={`ll-seal ll-seal--${tone} ${active ? 'll-seal--active' : ''}`}
      aria-hidden="true"
    >
      <circle cx="50" cy="50" r="46" className="ll-seal-ring-outer" />
      <circle cx="50" cy="50" r="38" className="ll-seal-ring-inner" />
      {Array.from({ length: 28 }).map((_, i) => {
        const angle = (i / 28) * Math.PI * 2;
        const x1 = 50 + Math.cos(angle) * 43;
        const y1 = 50 + Math.sin(angle) * 43;
        const x2 = 50 + Math.cos(angle) * 47;
        const y2 = 50 + Math.sin(angle) * 47;
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} className="ll-seal-tick" />;
      })}
      <path d="M35 51 L45 61 L67 38" className="ll-seal-check" fill="none" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ─── Feature line item ──────────────────────────────────────────────────────
function FeatureItem({ feature, delay }: { feature: (typeof features)[number]; delay: number }) {
  const { ref, visible } = useScrollReveal();
  return (
    <div ref={ref} className={`ll-ledger-item ${visible ? 'll-fade-up' : 'll-hidden'}`} style={{ animationDelay: `${delay}ms` }}>
      <span className="type-mono ll-ledger-num">{feature.n}</span>
      <div className="ll-ledger-icon">{feature.icon}</div>
      <div className="ll-ledger-body">
        <h3 className="type-heading" style={{ color: 'var(--color-ink)', marginBottom: 6 }}>{feature.title}</h3>
        <p className="type-body-sm" style={{ color: 'var(--color-ink-muted)', maxWidth: '58ch' }}>{feature.description}</p>
      </div>
    </div>
  );
}

// ─── How It Works Step ──────────────────────────────────────────────────────
function HowItWorksStep({ item, index }: { item: (typeof howItWorks)[number]; index: number }) {
  const { ref, visible } = useScrollReveal(0.2);
  return (
    <div ref={ref} className={`${visible ? 'll-fade-up' : 'll-hidden'}`} style={{ animationDelay: `${index * 100}ms` }}>
      <div className="ll-card" style={{ height: '100%', display: 'flex', flexDirection: 'column', padding: 'var(--spacing-4)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)', marginBottom: 'var(--spacing-3)' }}>
          <span className="type-mono" style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--color-accent)' }}>{item.step}</span>
          {item.sealed && <Seal size={32} active={true} tone="accent" />}
        </div>
        <h3 className="type-heading" style={{ color: 'var(--color-ink)', marginBottom: 'var(--spacing-2)' }}>{item.title}</h3>
        <p className="type-body-sm" style={{ color: 'var(--color-ink-muted)', flex: 1 }}>{item.description}</p>
      </div>
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────
export default function LandingPage() {
  const [heroVisible, setHeroVisible] = useState(false);
  const hiw = useScrollReveal(0.1);
  const receipt = useScrollReveal(0.3);

  useEffect(() => {
    const t = setTimeout(() => setHeroVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="overflow-hidden" style={{ background: 'var(--color-bg)' }}>
      {/* ── Hero Section ────────────────────────────────────────────────────────────── */}
      <section className="relative" style={{ paddingTop: 'var(--spacing-12)', paddingBottom: 'var(--spacing-12)' }}>
        <div className="ll-hero-grid" aria-hidden="true" />
        <div className="container-wide relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 items-center" style={{ gap: 'var(--spacing-8)' }}>
            {/* Left: Hero Copy */}
            <div>
              <p className={`type-caption ll-fade-slot ${heroVisible ? 'll-in' : ''}`} style={{ color: 'var(--color-accent)', marginBottom: 'var(--spacing-3)', transitionDelay: '0ms' }}>
                SOROBAN SMART CONTRACT · STELLAR NETWORK
              </p>

              <h1 className={`type-display-xl ll-fade-slot ${heroVisible ? 'll-in' : ''}`} style={{ color: 'var(--color-ink)', maxWidth: '15ch', marginBottom: 'var(--spacing-4)', transitionDelay: '80ms' }}>
                Escrow, <em style={{ fontStyle: 'italic', color: 'var(--color-accent)' }}>sealed</em> on-chain.
              </h1>

              <p className={`type-body ll-fade-slot ${heroVisible ? 'll-in' : ''}`} style={{ color: 'var(--color-ink-muted)', maxWidth: '52ch', marginBottom: 'var(--spacing-6)', transitionDelay: '160ms', lineHeight: 1.7 }}>
                LumenLock brings bilateral confirmation, milestone-based release, and dispute arbitration to the Stellar ecosystem — the escrow primitive every P2P marketplace has been missing.
              </p>

              <div className={`flex flex-col sm:flex-row gap-4 ll-fade-slot ${heroVisible ? 'll-in' : ''}`} style={{ transitionDelay: '240ms' }}>
                <Link href="/marketplace" className="btn-primary" id="explore-marketplace-btn">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                  </svg>
                  Explore Marketplace
                </Link>
                <Link href="/dashboard" className="btn-secondary" id="open-dashboard-btn">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
                  </svg>
                  Open Dashboard
                </Link>
              </div>
            </div>

            {/* Right: Receipt Artifact */}
            <div ref={receipt.ref} className={`flex justify-center ll-receipt-stage ${receipt.visible ? 'll-receipt-in' : ''}`} aria-hidden="true">
              <div className="ll-receipt">
                <div className="ll-receipt-head">
                  <span className="type-mono-sm">ESCROW #0417</span>
                  <span className="type-mono-sm ll-receipt-net">TESTNET</span>
                </div>
                <div className="ll-receipt-rule" />

                <div className="ll-receipt-row"><span>Listing</span><span className="ll-leader" /><span className="type-mono-sm">Website Redesign</span></div>
                <div className="ll-receipt-row"><span>Asset</span><span className="ll-leader" /><span className="type-mono-sm">USDC</span></div>
                <div className="ll-receipt-row"><span>Amount</span><span className="ll-leader" /><span className="type-mono-sm">1,250.00</span></div>
                <div className="ll-receipt-row"><span>Buyer confirmed</span><span className="ll-leader" /><span className="type-mono-sm">✓</span></div>
                <div className="ll-receipt-row"><span>Seller confirmed</span><span className="ll-leader" /><span className="type-mono-sm">✓</span></div>

                <div className="ll-receipt-rule" />
                <div className="ll-receipt-status">
                  <span className="type-mono-sm">STATUS</span>
                  <span className="type-mono-sm ll-receipt-status-value">RELEASED</span>
                </div>

                <div className="ll-receipt-seal">
                  <Seal size={72} active={receipt.visible} tone="accent" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats Ledger Strip ───────────────────────────────────────────────── */}
      <section>
        <div className="gold-line" />
        <div className="container-wide">
          <div className="flex flex-col sm:flex-row items-stretch" style={{ padding: 'var(--spacing-4) 0' }}>
            {stats.map(({ label, value }, i) => (
              <div key={label} className="ll-stat-cell" style={{ borderRight: i < stats.length - 1 ? '1px solid var(--color-border)' : undefined }}>
                <span className="type-mono ll-stat-value">{value}</span>
                <span className="type-caption" style={{ color: 'var(--color-ink-faint)' }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="gold-line" />
      </section>

      {/* ── Feature Ledger ───────────────────────────────────────────────────── */}
      <section style={{ paddingTop: 'var(--spacing-12)', paddingBottom: 'var(--spacing-12)' }} id="features">
        <div className="container-wide">
          <div className="text-center" style={{ maxWidth: 700, margin: '0 auto var(--spacing-8)' }}>
            <p className="type-caption" style={{ color: 'var(--color-accent)', marginBottom: 'var(--spacing-2)' }}>REGISTER OF CAPABILITIES</p>
            <h2 className="type-display-lg" style={{ color: 'var(--color-ink)', marginBottom: 'var(--spacing-3)' }}>The Escrow Primitive Stellar Was Missing</h2>
            <p className="type-body" style={{ color: 'var(--color-ink-muted)' }}>Stellar's native claimable balances support conditional release — but not bilateral confirmation, dispute freezing, or milestone-based partial releases. LumenLock fills that gap.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--spacing-4)' }}>
            {features.map((feature, i) => (
              <FeatureItem key={feature.n} feature={feature} delay={i * 80} />
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ───────────────────────────────────────────────────── */}
      <section style={{ paddingTop: 'var(--spacing-12)', paddingBottom: 'var(--spacing-12)', backgroundColor: 'var(--color-surface)' }} ref={hiw.ref}>
        <div className="container-wide">
          <div className="text-center" style={{ maxWidth: 700, margin: '0 auto var(--spacing-8)' }}>
            <p className="type-caption" style={{ color: 'var(--color-accent)', marginBottom: 'var(--spacing-2)' }}>THE SETTLEMENT TRAIL</p>
            <h2 className="type-display-lg" style={{ color: 'var(--color-ink)' }}>How It Works</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--spacing-4)' }}>
            {howItWorks.map((item, i) => (
              <HowItWorksStep key={item.step} item={item} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Section ────────────────────────────────────────────────────── */}
      <section style={{ paddingTop: 'var(--spacing-12)', paddingBottom: 'var(--spacing-12)' }}>
        <div className="container-narrow">
          <div className="text-center" style={{ maxWidth: 600, margin: '0 auto' }}>
            <p className="type-caption" style={{ color: 'var(--color-accent)', marginBottom: 'var(--spacing-2)' }}>GET STARTED TODAY</p>
            <h2 className="type-display-lg" style={{ color: 'var(--color-ink)', marginBottom: 'var(--spacing-4)' }}>Ready to transact trustlessly?</h2>
            <p className="type-body" style={{ color: 'var(--color-ink-muted)', marginBottom: 'var(--spacing-6)' }}>Connect your Stellar wallet and start buying or selling on the decentralized marketplace. Every trade is protected by an on-chain escrow vault.</p>
            <Link href="/marketplace" className="btn-primary" id="cta-marketplace-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
              </svg>
              Get Started
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
