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
    description:
      'Funds release only when BOTH buyer and seller independently confirm. No single point of trust.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
        <circle cx="9" cy="12" r="6" />
        <circle cx="15" cy="12" r="6" />
      </svg>
    ),
  },
  {
    n: '02',
    title: 'Milestone Releases',
    description:
      'Split payments across project milestones — 30% on start, 70% on delivery, configurable per listing.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <line x1="5" y1="4" x2="5" y2="20" />
        <polyline points="5,4 19,4 15,10 19,16 5,16" />
      </svg>
    ),
  },
  {
    n: '03',
    title: 'Deadline Protection',
    description:
      'If the seller goes silent, the buyer gets a full refund after the 7-day deadline. Nothing locked forever.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
        <circle cx="12" cy="12" r="8" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="12" x2="15" y2="14" />
      </svg>
    ),
  },
  {
    n: '04',
    title: 'Dispute Arbitration',
    description:
      'Disputes freeze funds and route to a designated arbiter. Resolution credits the winner automatically.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="4" x2="12" y2="20" />
        <line x1="4" y1="8" x2="20" y2="8" />
        <path d="M4,8 Q2,12 4,16 Q6,12 4,8" />
        <path d="M20,8 Q22,12 20,16 Q18,12 20,8" />
        <line x1="8" y1="20" x2="16" y2="20" />
      </svg>
    ),
  },
  {
    n: '05',
    title: 'Multi-Asset Support',
    description:
      'Accept XLM, USDC, or any Stellar Asset Contract token. Any SEP-41 compliant asset works out of the box.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
        <ellipse cx="12" cy="7" rx="7" ry="2.5" />
        <path d="M5,7 Q5,11 12,11 Q19,11 19,7" />
        <path d="M5,11 Q5,15 12,15 Q19,15 19,11" />
        <path d="M5,15 Q5,19 12,19 Q19,19 19,15" />
      </svg>
    ),
  },
  {
    n: '06',
    title: 'Composable Primitives',
    description:
      'Built as a reusable Soroban escrow layer. Any marketplace or P2P app on Stellar can build on top of it.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="12,3 21,8.5 12,14 3,8.5 12,3" />
        <line x1="3" y1="13.5" x2="12" y2="19" />
        <line x1="21" y1="13.5" x2="12" y2="19" />
      </svg>
    ),
  },
];

const howItWorks = [
  {
    step: '01',
    title: 'Seller Lists',
    description: 'Seller creates a listing with price, asset, and optional milestone configuration.',
  },
  {
    step: '02',
    title: 'Buyer Opens Escrow',
    description: 'Buyer opens an escrow, locking the listing. Funds transfer to the vault on fund().',
  },
  {
    step: '03',
    title: 'Both Confirm',
    description: 'Buyer confirms receipt, seller confirms delivery. Funds release automatically.',
    sealed: true,
  },
  {
    step: '04',
    title: 'Settled On-Chain',
    description: 'Funds move to the seller. Listing marked Completed. Full audit trail on Stellar.',
  },
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
function Seal({ size = 96, active = false }: { size?: number; active?: boolean }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={`ll-seal ${active ? 'll-seal--active' : ''}`}
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
      <path
        d="M35 51 L45 61 L67 38"
        className="ll-seal-check"
        fill="none"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ─── Feature line item ──────────────────────────────────────────────────────
function FeatureItem({ feature, delay }: { feature: (typeof features)[number]; delay: number }) {
  const { ref, visible } = useScrollReveal();
  return (
    <div
      ref={ref}
      className={`ll-ledger-item ${visible ? 'll-fade-up' : 'll-hidden'}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <span className="ll-mono ll-ledger-num">{feature.n}</span>
      <div className="ll-ledger-icon">{feature.icon}</div>
      <div className="ll-ledger-body">
        <h3 className="ll-serif ll-ledger-title">{feature.title}</h3>
        <p className="ll-ledger-desc">{feature.description}</p>
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
    <div className="ll overflow-hidden">
      {/* ── Hero ────────────────────────────────────────────────────────────── */}
      <section className="ll-hero-section">
        <div className="ll-starfield" aria-hidden="true" />
        <div className="ll-container relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-12 lg:gap-10">
            {/* Left: copy */}
            <div>
              <p className={`ll-eyebrow ll-mono ll-fade-slot ${heroVisible ? 'll-in' : ''}`} style={{ transitionDelay: '0ms' }}>
                SOROBAN SMART CONTRACT · STELLAR NETWORK
              </p>

              <h1
                className={`ll-serif ll-h1 ll-fade-slot ${heroVisible ? 'll-in' : ''}`}
                style={{ transitionDelay: '80ms' }}
              >
                Escrow, <em className="ll-accent-italic">sealed</em> on-chain.
              </h1>

              <p className={`ll-body ll-lede ll-fade-slot ${heroVisible ? 'll-in' : ''}`} style={{ transitionDelay: '160ms' }}>
                LumenLock brings bilateral confirmation, milestone-based release, and dispute
                arbitration to the Stellar ecosystem — the escrow primitive every P2P
                marketplace has been missing.
              </p>

              <div className={`flex flex-col sm:flex-row gap-3 ll-fade-slot ${heroVisible ? 'll-in' : ''}`} style={{ transitionDelay: '240ms' }}>
                <Link href="/marketplace" className="ll-btn-primary" id="explore-marketplace-btn">
                  Explore Marketplace →
                </Link>
                <Link href="/dashboard" className="ll-btn-secondary" id="open-dashboard-btn">
                  Open Dashboard
                </Link>
              </div>
            </div>

            {/* Right: escrow receipt artifact */}
            <div
              ref={receipt.ref}
              className={`ll-receipt-stage ${receipt.visible ? 'll-receipt-in' : ''}`}
              aria-hidden="true"
            >
              <div className="ll-receipt">
                <div className="ll-receipt-head">
                  <span className="ll-mono">ESCROW #0417</span>
                  <span className="ll-mono ll-receipt-net">TESTNET</span>
                </div>
                <div className="ll-receipt-rule" />

                <div className="ll-receipt-row">
                  <span>Listing</span>
                  <span className="ll-leader" />
                  <span className="ll-mono">Website Redesign</span>
                </div>
                <div className="ll-receipt-row">
                  <span>Asset</span>
                  <span className="ll-leader" />
                  <span className="ll-mono">USDC</span>
                </div>
                <div className="ll-receipt-row">
                  <span>Amount</span>
                  <span className="ll-leader" />
                  <span className="ll-mono">1,250.00</span>
                </div>
                <div className="ll-receipt-row">
                  <span>Buyer confirmed</span>
                  <span className="ll-leader" />
                  <span className="ll-mono">✓</span>
                </div>
                <div className="ll-receipt-row">
                  <span>Seller confirmed</span>
                  <span className="ll-leader" />
                  <span className="ll-mono">✓</span>
                </div>

                <div className="ll-receipt-rule" />
                <div className="ll-receipt-status">
                  <span className="ll-mono">STATUS</span>
                  <span className="ll-mono ll-receipt-status-value">RELEASED</span>
                </div>

                <div className="ll-receipt-seal">
                  <Seal size={78} active={receipt.visible} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats Ledger Strip ───────────────────────────────────────────────── */}
      <section className="ll-hairline-y">
        <div className="ll-container">
          <div className="flex flex-col sm:flex-row items-stretch ll-stat-strip">
            {stats.map(({ label, value }, i) => (
              <div key={label} className="ll-stat-cell" style={{ borderRight: i < stats.length - 1 ? '1px solid var(--ll-line)' : undefined }}>
                <span className="ll-mono ll-stat-value">{value}</span>
                <span className="ll-mono ll-stat-label">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Feature Ledger ───────────────────────────────────────────────────── */}
      <section className="ll-section" id="features">
        <div className="ll-container">
          <div className="ll-section-head">
            <p className="ll-eyebrow ll-mono">REGISTER OF CAPABILITIES</p>
            <h2 className="ll-serif ll-h2">The Escrow Primitive Stellar Was Missing</h2>
            <p className="ll-body ll-section-sub">
              Stellar&apos;s native claimable balances support conditional release — but not
              bilateral confirmation, dispute freezing, or milestone-based partial releases.
              LumenLock fills that gap.
            </p>
          </div>

          <div className="ll-ledger">
            {features.map((feature, i) => (
              <FeatureItem key={feature.title} feature={feature} delay={i * 60} />
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ─────────────────────────────────────────────────────── */}
      <section className="ll-hairline-y ll-section ll-section--raised" id="how-it-works">
        <div className="ll-container">
          <div className="ll-section-head">
            <p className="ll-eyebrow ll-mono">THE SETTLEMENT TRAIL</p>
            <h2 className="ll-serif ll-h2">How It Works</h2>
            <p className="ll-body ll-section-sub">Four steps from listing to settlement.</p>
          </div>

          <div ref={hiw.ref} className={`ll-trail ${hiw.visible ? 'll-fade-up' : 'll-hidden'}`}>
            {howItWorks.map((step, i) => (
              <div key={step.step} className="ll-trail-row">
                <div className="ll-trail-marker">
                  {step.sealed ? <Seal size={40} active={hiw.visible} /> : <span className="ll-mono">{step.step}</span>}
                </div>
                {i < howItWorks.length - 1 && <div className="ll-trail-line" />}
                <div className="ll-trail-body">
                  <h3 className="ll-serif ll-trail-title">{step.title}</h3>
                  <p className="ll-body ll-trail-desc">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Band ─────────────────────────────────────────────────────────── */}
      <section className="ll-cta">
        <div className="ll-cta-seal-watermark" aria-hidden="true">
          <Seal size={340} />
        </div>
        <div className="ll-container relative z-10">
          <div className="ll-cta-inner">
            <p className="ll-eyebrow ll-mono">GET STARTED TODAY</p>
            <h2 className="ll-serif ll-h2">Ready to transact trustlessly?</h2>
            <p className="ll-body ll-section-sub" style={{ margin: 0, textAlign: 'left' }}>
              Connect your Stellar wallet and start buying or selling on the decentralized
              marketplace. Every trade is protected by an on-chain escrow vault.
            </p>
            <Link href="/marketplace" className="ll-btn-primary" id="cta-marketplace-btn" style={{ marginTop: '2rem' }}>
              Get Started →
            </Link>
          </div>
        </div>
      </section>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,500;0,9..144,600;1,9..144,500&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap');

        .ll {
          --ll-bg: #0a0c10;
          --ll-bg-raised: #0e1116;
          --ll-line: rgba(255, 255, 255, 0.08);
          --ll-line-strong: rgba(255, 255, 255, 0.16);
          --ll-ink: #ece7dd;
          --ll-ink-muted: #9a978d;
          --ll-ink-faint: #605d54;
          --ll-gold: #d7a84a;
          --ll-gold-soft: rgba(215, 168, 74, 0.14);
          --ll-paper: #efe6d2;
          --ll-paper-ink: #211a10;
          --ll-paper-line: rgba(33, 26, 16, 0.22);
          --ll-font-display: 'Fraunces', Georgia, serif;
          --ll-font-body: 'Inter', -apple-system, sans-serif;
          --ll-font-mono: 'IBM Plex Mono', ui-monospace, monospace;

          background: var(--ll-bg);
          color: var(--ll-ink);
          font-family: var(--ll-font-body);
        }

        .ll-container { max-width: 1180px; margin: 0 auto; padding: 0 24px; }
        .ll-section { padding: 96px 0; }
        .ll-section--raised { background: var(--ll-bg-raised); }
        .ll-hairline-y { border-top: 1px solid var(--ll-line); border-bottom: 1px solid var(--ll-line); }

        .ll-serif { font-family: var(--ll-font-display); }
        .ll-mono { font-family: var(--ll-font-mono); }
        .ll-body { font-family: var(--ll-font-body); color: var(--ll-ink-muted); line-height: 1.6; }

        .ll-eyebrow {
          font-size: 0.72rem;
          letter-spacing: 0.16em;
          color: var(--ll-gold);
          margin-bottom: 14px;
        }
        .ll-accent-italic { font-style: italic; color: var(--ll-gold); }

        .ll-h1 {
          font-size: clamp(2.6rem, 5vw, 4rem);
          font-weight: 500;
          line-height: 1.05;
          letter-spacing: -0.01em;
          max-width: 14ch;
          margin-bottom: 22px;
          color: var(--ll-ink);
        }
        .ll-h2 {
          font-size: clamp(1.9rem, 3.4vw, 2.6rem);
          font-weight: 500;
          line-height: 1.15;
          color: var(--ll-ink);
          margin-bottom: 14px;
        }
        .ll-lede { font-size: 1.08rem; max-width: 50ch; margin-bottom: 30px; }

        .ll-btn-primary, .ll-btn-secondary {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 13px 26px;
          font-size: 0.92rem;
          font-weight: 500;
          border-radius: 3px;
          text-decoration: none;
          transition: all 0.2s ease;
          font-family: var(--ll-font-body);
        }
        .ll-btn-primary {
          background: var(--ll-gold);
          color: #171105;
        }
        .ll-btn-primary:hover { background: #e6ba5c; transform: translateY(-1px); }
        .ll-btn-secondary {
          background: transparent;
          color: var(--ll-ink);
          border: 1px solid var(--ll-line-strong);
        }
        .ll-btn-secondary:hover { border-color: var(--ll-gold); color: var(--ll-gold); }

        /* Hero */
        .ll-hero-section { position: relative; padding: 100px 0 90px; overflow: hidden; }
        .ll-starfield {
          position: absolute; inset: 0; pointer-events: none;
          background-image: radial-gradient(1px 1px at 20% 30%, rgba(255,255,255,0.25) 50%, transparent 100%),
            radial-gradient(1px 1px at 70% 60%, rgba(255,255,255,0.18) 50%, transparent 100%),
            radial-gradient(1.5px 1.5px at 40% 80%, rgba(255,255,255,0.2) 50%, transparent 100%),
            radial-gradient(1px 1px at 85% 15%, rgba(255,255,255,0.2) 50%, transparent 100%);
          background-size: 100% 100%;
          opacity: 0.6;
        }

        .ll-fade-slot { opacity: 0; transform: translateY(16px); transition: opacity 0.6s ease, transform 0.6s ease; }
        .ll-fade-slot.ll-in { opacity: 1; transform: translateY(0); }

        /* Receipt */
        .ll-receipt-stage {
          display: flex; justify-content: center;
          opacity: 0; transform: translateY(24px) rotate(0deg);
          transition: opacity 0.7s ease, transform 0.7s ease;
        }
        .ll-receipt-stage.ll-receipt-in { opacity: 1; transform: translateY(0) rotate(-2.5deg); }
        .ll-receipt {
          position: relative;
          width: 340px;
          background: var(--ll-paper);
          color: var(--ll-paper-ink);
          padding: 26px 24px 30px;
          border-radius: 2px;
          box-shadow: 0 30px 60px -20px rgba(0,0,0,0.6), 0 0 0 1px rgba(0,0,0,0.04);
        }
        .ll-receipt-head { display: flex; justify-content: space-between; font-size: 0.75rem; letter-spacing: 0.04em; margin-bottom: 14px; }
        .ll-receipt-net { color: #8a6a2c; }
        .ll-receipt-rule { border-top: 1px dashed var(--ll-paper-line); margin: 12px 0; }
        .ll-receipt-row { display: flex; align-items: baseline; font-size: 0.82rem; margin-bottom: 9px; gap: 8px; }
        .ll-receipt-row > span:first-child { flex-shrink: 0; }
        .ll-receipt-row > span:last-child { flex-shrink: 0; font-size: 0.78rem; }
        .ll-leader { flex: 1; border-bottom: 1px dotted var(--ll-paper-line); position: relative; top: -3px; }
        .ll-receipt-status { display: flex; justify-content: space-between; align-items: center; margin-top: 4px; }
        .ll-receipt-status-value { color: #8a6a2c; font-weight: 500; letter-spacing: 0.04em; }
        .ll-receipt-seal { position: absolute; bottom: -22px; right: -18px; }

        /* Seal */
        .ll-seal { color: var(--ll-gold); opacity: 0; transform: scale(1.3) rotate(-25deg); transition: opacity 0.5s ease 0.15s, transform 0.5s cubic-bezier(0.34,1.56,0.64,1) 0.15s; }
        .ll-seal--active { opacity: 1; transform: scale(1) rotate(-8deg); }
        .ll-seal-ring-outer, .ll-seal-ring-inner { fill: none; stroke: currentColor; stroke-width: 1.4; }
        .ll-seal-tick { stroke: currentColor; stroke-width: 1.2; }
        .ll-seal-check { stroke: currentColor; }

        /* Stat strip */
        .ll-stat-strip { padding: 40px 0; }
        .ll-stat-cell { flex: 1; padding: 8px 28px; }
        .ll-stat-value { display: block; font-size: clamp(1.6rem, 3vw, 2.1rem); color: var(--ll-ink); margin-bottom: 6px; }
        .ll-stat-label { font-size: 0.7rem; letter-spacing: 0.08em; color: var(--ll-ink-faint); text-transform: uppercase; }

        /* Section head */
        .ll-section-head { text-align: center; max-width: 640px; margin: 0 auto 56px; }
        .ll-section-sub { text-align: center; margin: 0 auto; max-width: 56ch; }

        /* Ledger feature list */
        .ll-ledger { border-top: 1px solid var(--ll-line); }
        .ll-ledger-item {
          display: grid;
          grid-template-columns: 44px 40px 1fr;
          gap: 20px;
          align-items: start;
          padding: 26px 4px;
          border-bottom: 1px solid var(--ll-line);
        }
        .ll-ledger-num { color: var(--ll-ink-faint); font-size: 0.85rem; padding-top: 3px; }
        .ll-ledger-icon { color: var(--ll-gold); padding-top: 1px; }
        .ll-ledger-title { font-size: 1.15rem; font-weight: 500; margin-bottom: 6px; color: var(--ll-ink); }
        .ll-ledger-desc { font-size: 0.92rem; color: var(--ll-ink-muted); max-width: 60ch; }

        .ll-hidden { opacity: 0; }
        .ll-fade-up { animation: llFadeUp 0.6s ease forwards; }
        @keyframes llFadeUp { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }

        /* Trail (how it works) */
        .ll-trail { max-width: 640px; margin: 0 auto; }
        .ll-trail-row { display: grid; grid-template-columns: 48px 1fr; column-gap: 22px; position: relative; }
        .ll-trail-marker {
          grid-row: 1;
          width: 48px; height: 48px;
          border-radius: 50%;
          border: 1px solid var(--ll-line-strong);
          background: var(--ll-bg-raised);
          display: flex; align-items: center; justify-content: center;
          color: var(--ll-gold);
          z-index: 1;
        }
        .ll-trail-line { grid-column: 1; width: 1px; margin: 0 auto; background: var(--ll-line-strong); height: 100%; min-height: 60px; }
        .ll-trail-body { padding-bottom: 40px; padding-top: 8px; }
        .ll-trail-title { font-size: 1.15rem; font-weight: 500; margin-bottom: 6px; color: var(--ll-ink); }
        .ll-trail-desc { font-size: 0.92rem; color: var(--ll-ink-muted); }

        /* CTA */
        .ll-cta { position: relative; padding: 100px 0; overflow: hidden; background: var(--ll-bg-raised); border-top: 1px solid var(--ll-line); }
        .ll-cta-seal-watermark { position: absolute; right: -60px; top: 50%; transform: translateY(-50%); opacity: 0.05; }
        .ll-cta-seal-watermark .ll-seal { opacity: 1; transform: rotate(-6deg); }
        .ll-cta-inner { max-width: 560px; display: flex; flex-direction: column; align-items: flex-start; }
        .ll-cta-inner h2 { text-align: left; }

        @media (max-width: 1023px) {
          .ll-receipt-stage { margin-top: 48px; }
        }
        @media (max-width: 640px) {
          .ll-ledger-item { grid-template-columns: 32px 32px 1fr; }
          .ll-trail-row { grid-template-columns: 40px 1fr; }
          .ll-trail-marker { width: 40px; height: 40px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .ll-fade-slot, .ll-receipt-stage, .ll-seal, .ll-ledger-item { transition: none !important; animation: none !important; opacity: 1 !important; transform: none !important; }
        }
      `}</style>
    </div>
  );
}
