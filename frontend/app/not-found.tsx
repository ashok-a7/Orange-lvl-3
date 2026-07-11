import Link from 'next/link';
import { Home, ShoppingBag } from 'lucide-react';

/** An empty seal outline — a mark that was never stamped. */
function UnsealedMark({ size = 120 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none" aria-hidden="true">
      <circle cx="60" cy="60" r="52" stroke="var(--color-border-strong)" strokeWidth="1.5" strokeDasharray="2 6" />
      <path
        d="M 44 25 A 36 36 0 0 0 44 95"
        stroke="var(--color-border-strong)"
        strokeWidth="5"
        strokeLinecap="round"
        strokeDasharray="1 9"
      />
      <path
        d="M 76 25 A 36 36 0 0 1 76 95"
        stroke="var(--color-border-strong)"
        strokeWidth="5"
        strokeLinecap="round"
        strokeDasharray="1 9"
      />
      <text
        x="60"
        y="68"
        textAnchor="middle"
        fontFamily="var(--font-mono)"
        fontSize="15"
        fill="var(--color-ink-faint)"
      >
        ?
      </text>
    </svg>
  );
}

export default function NotFound() {
  return (
    <div className="min-h-[76vh] flex items-center justify-center" style={{ padding: 'var(--spacing-4)' }}>
      <div className="text-center flex flex-col items-center" style={{ gap: 'var(--spacing-2)', maxWidth: '44ch' }}>
        <div style={{ marginBottom: 'var(--spacing-1)' }}>
          <UnsealedMark />
        </div>

        <p className="type-eyebrow" style={{ color: 'var(--color-accent)', justifyContent: 'center' }}>
          404 · No matching entry
        </p>

        <h1 className="type-display-lg" style={{ color: 'var(--color-ink)' }}>
          This ledger entry doesn&apos;t exist
        </h1>

        <p className="type-body-sm" style={{ color: 'var(--color-ink-muted)' }}>
          The listing, escrow, or page you&apos;re looking for was never recorded — or has since
          moved. Nothing here was settled, refunded, or disputed.
        </p>

        <div className="flex items-center gap-3 flex-wrap justify-center" style={{ marginTop: 'var(--spacing-2)' }}>
          <Link href="/" className="btn-primary" id="not-found-home-btn">
            <Home style={{ width: 15, height: 15 }} />
            Back to Home
          </Link>
          <Link href="/marketplace" className="btn-secondary" id="not-found-marketplace-btn">
            <ShoppingBag style={{ width: 15, height: 15 }} />
            Browse Marketplace
          </Link>
        </div>
      </div>
    </div>
  );
}
