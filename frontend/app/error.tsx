'use client';

import { AlertTriangle, RefreshCcw, Home } from 'lucide-react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-[70vh] flex items-center justify-center" style={{ paddingTop: 'var(--spacing-6)', paddingBottom: 'var(--spacing-6)' }}>
      <div className="text-center flex flex-col items-center" style={{ gap: 'var(--spacing-4)', maxWidth: '50ch' }}>
        {/* Error Icon */}
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            backgroundColor: 'var(--color-danger-soft)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
          }}
        >
          <AlertTriangle style={{ width: 40, height: 40, color: 'var(--color-danger)' }} />
        </div>

        {/* Error Title */}
        <div>
          <p className="type-caption" style={{ color: 'var(--color-danger)', marginBottom: 'var(--spacing-1)' }}>
            ERROR OCCURRED
          </p>
          <h1 className="type-display-lg" style={{ color: 'var(--color-ink)' }}>
            Something went wrong
          </h1>
        </div>

        {/* Error Message */}
        <p className="type-body" style={{ color: 'var(--color-ink-muted)', lineHeight: 1.7 }}>
          {error.message || 'An unexpected error occurred. Our team has been notified. Please try again or contact support.'}
        </p>

        {/* Error Digest */}
        {error.digest && (
          <div
            style={{
              backgroundColor: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              padding: 'var(--spacing-2)',
              width: '100%',
              textAlign: 'left',
            }}
          >
            <p className="type-caption" style={{ color: 'var(--color-ink-faint)', marginBottom: 'var(--spacing-1)' }}>
              Error ID
            </p>
            <code
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.8rem',
                color: 'var(--color-ink-muted)',
                wordBreak: 'break-all',
              }}
            >
              {error.digest}
            </code>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 w-full" style={{ marginTop: 'var(--spacing-2)' }}>
          <button
            onClick={reset}
            className="btn-primary flex-1"
            style={{ justifyContent: 'center' }}
          >
            <RefreshCcw style={{ width: 17, height: 17 }} />
            Try Again
          </button>
          <Link href="/" className="btn-secondary flex-1" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
            <Home style={{ width: 17, height: 17 }} />
            Go Home
          </Link>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
      `}</style>
    </div>
  );
}
