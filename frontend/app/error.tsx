'use client';

import { useEffect } from 'react';
import { RefreshCcw, Home } from 'lucide-react';
import Link from 'next/link';

/** A cracked wax seal — the signature confirmation mark, broken. */
function BrokenSeal({ size = 120 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none" aria-hidden="true">
      <circle cx="60" cy="60" r="52" stroke="var(--color-danger)" strokeOpacity="0.22" strokeWidth="1.5" />
      <circle cx="60" cy="60" r="44" stroke="var(--color-danger)" strokeOpacity="0.14" strokeWidth="1.5" />
      {/* Left half of the seal, sheared away */}
      <path
        d="M 44 25 A 36 36 0 0 0 44 95"
        stroke="var(--color-ink-faint)"
        strokeWidth="6"
        strokeLinecap="round"
        transform="translate(-5, -3) rotate(-6 60 60)"
      />
      {/* Right half, sheared the other way */}
      <path
        d="M 76 25 A 36 36 0 0 1 76 95"
        stroke="var(--color-danger)"
        strokeWidth="6"
        strokeLinecap="round"
        transform="translate(5, 3) rotate(6 60 60)"
      />
      {/* Fracture line down the middle */}
      <path
        d="M 60 20 L 65 42 L 54 58 L 66 76 L 58 100"
        stroke="var(--color-danger)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.75"
      />
    </svg>
  );
}

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error('[LumenLock] Unhandled render error:', error);
  }, [error]);

  return (
    <div className="min-h-[76vh] flex items-center justify-center relative overflow-hidden" style={{ padding: 'var(--spacing-4)' }}>
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse 60% 50% at 50% 40%, var(--color-danger-soft), transparent 70%)',
          pointerEvents: 'none',
        }}
      />
      <div className="text-center flex flex-col items-center relative" style={{ gap: 'var(--spacing-2)', maxWidth: '44ch' }}>
        <div style={{ marginBottom: 'var(--spacing-1)' }}>
          <BrokenSeal />
        </div>

        <p className="type-eyebrow" style={{ color: 'var(--color-danger)', justifyContent: 'center' }}>
          Seal verification failed
        </p>

        <h1 className="type-display-lg" style={{ color: 'var(--color-ink)' }}>
          Something broke the chain of trust
        </h1>

        <p className="type-body-sm" style={{ color: 'var(--color-ink-muted)' }}>
          {error.message || 'The page hit an unexpected error before it could render. No funds or contract state were affected.'}
        </p>

        {error.digest && (
          <p className="type-mono-sm" style={{ color: 'var(--color-ink-faint)', marginTop: '-6px' }}>
            Reference: {error.digest}
          </p>
        )}

        <div className="flex items-center gap-3 flex-wrap justify-center" style={{ marginTop: 'var(--spacing-2)' }}>
          <button onClick={reset} className="btn-primary" id="error-reset-btn">
            <RefreshCcw style={{ width: 15, height: 15 }} />
            Try Again
          </button>
          <Link href="/" className="btn-secondary" id="error-home-btn">
            <Home style={{ width: 15, height: 15 }} />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
