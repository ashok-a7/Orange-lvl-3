import Link from 'next/link';
import { Home, ArrowLeft, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center" style={{ paddingTop: 'var(--spacing-6)', paddingBottom: 'var(--spacing-6)' }}>
      <div className="text-center flex flex-col items-center" style={{ gap: 'var(--spacing-4)', maxWidth: '50ch' }}>
        {/* 404 Number */}
        <div
          style={{
            fontSize: 'clamp(3rem, 10vw, 6rem)',
            fontWeight: 700,
            fontFamily: 'var(--font-mono)',
            background: 'linear-gradient(135deg, var(--color-accent), var(--color-trust))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            letterSpacing: '-0.02em',
          }}
        >
          404
        </div>

        {/* Title */}
        <div>
          <p className="type-caption" style={{ color: 'var(--color-accent)', marginBottom: 'var(--spacing-1)' }}>
            PAGE NOT FOUND
          </p>
          <h1 className="type-display-lg" style={{ color: 'var(--color-ink)' }}>
            Lost in the void
          </h1>
        </div>

        {/* Description */}
        <p className="type-body" style={{ color: 'var(--color-ink-muted)', lineHeight: 1.7 }}>
          The page you&apos;re looking for doesn&apos;t exist or has been moved. Let&apos;s get you back on track.
        </p>

        {/* Illustration Placeholder */}
        <div
          style={{
            width: '100%',
            height: 200,
            borderRadius: 'var(--radius-lg)',
            backgroundColor: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 'var(--spacing-2)',
          }}
        >
          <Search style={{ width: 48, height: 48, color: 'var(--color-ink-faint)', opacity: 0.5 }} />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 w-full" style={{ marginTop: 'var(--spacing-2)' }}>
          <Link href="/" className="btn-primary flex-1" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
            <Home style={{ width: 17, height: 17 }} />
            Home
          </Link>
          <Link href="/marketplace" className="btn-secondary flex-1" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
            <ArrowLeft style={{ width: 17, height: 17 }} />
            Marketplace
          </Link>
        </div>

        {/* Help Text */}
        <p className="type-body-sm" style={{ color: 'var(--color-ink-faint)', marginTop: 'var(--spacing-2)' }}>
          Need help? <Link href="/settings" style={{ color: 'var(--color-accent)', textDecoration: 'none', fontWeight: 600, transition: 'opacity 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'} onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}>Contact support</Link>
        </p>
      </div>
    </div>
  );
}
