import type { Metadata } from 'next';
import { QueryClientProvider } from './providers/QueryClientProvider';
import { Navbar } from './components/layout/Navbar';
import { ToastContainer } from './components/ui/ToastContainer';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'LumenLock — Decentralized Escrow Marketplace on Stellar',
    template: '%s | LumenLock',
  },
  description:
    'LumenLock is a trustless decentralized marketplace with built-in Soroban escrow settlement. Buy and sell digital products with bilateral confirmation, milestone releases, and dispute arbitration on Stellar.',
  keywords: [
    'Stellar',
    'Soroban',
    'escrow',
    'marketplace',
    'decentralized',
    'blockchain',
    'DeFi',
    'smart contracts',
    'P2P',
    'trustless',
  ],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_APP_URL || 'https://lumenlock.dev',
    siteName: 'LumenLock',
    title: 'LumenLock — Decentralized Escrow Marketplace on Stellar',
    description: 'Trustless P2P marketplace with Soroban-powered escrow settlement',
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://lumenlock.dev'}/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'LumenLock - Decentralized Escrow Marketplace',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LumenLock',
    description: 'Trustless P2P marketplace with Soroban-powered escrow settlement',
    creator: '@lumenlock',
  },
  robots: {
    index: true,
    follow: true,
    'max-image-preview': 'large',
    'max-snippet': -1,
    'max-video-preview': -1,
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="theme-color" content="#0A0A0A" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,600;0,700;1,600&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-ink)', fontFamily: 'var(--font-ui)' }}>
        <QueryClientProvider>
          <div
            className="min-h-screen flex flex-col"
            style={{ backgroundColor: 'var(--color-bg)' }}
          >
            <Navbar />
            <main className="flex-1">{children}</main>
            <ToastContainer />

            {/* Footer */}
            <footer
              className="py-8"
              style={{
                borderTop: '1px solid var(--color-border)',
                backgroundColor: 'var(--color-surface)',
              }}
            >
              <div className="container-wide">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                  {/* Logo & Description */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <svg width="24" height="24" viewBox="0 0 28 28" fill="none" aria-hidden="true">
                        <rect x="1" y="1" width="26" height="26" rx="7" fill="var(--color-trust-soft)" stroke="var(--color-trust)" strokeWidth="1.5" />
                        <path d="M 10.5 9 A 5 5 0 0 0 10.5 19" stroke="var(--color-trust)" strokeWidth="2" strokeLinecap="round" />
                        <path d="M 17.5 9 A 5 5 0 0 1 17.5 19" stroke="var(--color-accent)" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                      <span
                        className="font-bold text-base"
                        style={{ fontFamily: 'var(--font-display)', color: 'var(--color-ink)' }}
                      >
                        LumenLock
                      </span>
                    </div>
                    <p className="type-body-sm" style={{ color: 'var(--color-ink-muted)' }}>
                      Trustless P2P marketplace with Soroban-powered escrow settlement on Stellar.
                    </p>
                  </div>

                  {/* Quick Links */}
                  <div>
                    <h3 className="type-caption" style={{ color: 'var(--color-ink)', marginBottom: 'var(--spacing-2)' }}>
                      Platform
                    </h3>
                    <div className="flex flex-col gap-2">
                      <a href="/marketplace" className="ll-footer-link">
                        Marketplace
                      </a>
                      <a href="/dashboard" className="ll-footer-link">
                        Dashboard
                      </a>
                      <a href="/activity" className="ll-footer-link">
                        Activity
                      </a>
                      <a href="/transactions" className="ll-footer-link">
                        Transactions
                      </a>
                    </div>
                  </div>

                  {/* Resources */}
                  <div>
                    <h3 className="type-caption" style={{ color: 'var(--color-ink)', marginBottom: 'var(--spacing-2)' }}>
                      Resources
                    </h3>
                    <div className="flex flex-col gap-2">
                      <a
                        href="https://stellar.org"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ll-footer-link ll-footer-link--stellar"
                      >
                        Built on Stellar
                      </a>
                      <a
                        href="https://soroban.stellar.org"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ll-footer-link"
                      >
                        Soroban Docs
                      </a>
                      <a
                        href="https://stellar.expert"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ll-footer-link"
                      >
                        Stellar Expert
                      </a>
                    </div>
                  </div>
                </div>

                {/* Divider */}
                <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 'var(--spacing-4)' }}>
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="type-body-sm" style={{ color: 'var(--color-ink-faint)' }}>
                      © {new Date().getFullYear()} LumenLock. All rights reserved.
                    </p>
                    <div className="flex items-center gap-4">
                      <a href="#" className="ll-footer-link" aria-label="Privacy Policy">
                        Privacy
                      </a>
                      <a href="#" className="ll-footer-link" aria-label="Terms of Service">
                        Terms
                      </a>
                      <a href="#" className="ll-footer-link" aria-label="Contact">
                        Contact
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </footer>
          </div>
        </QueryClientProvider>
      </body>
    </html>
  );
}
