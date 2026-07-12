import type { Metadata, Viewport } from 'next';
import Link from 'next/link';
import { QueryClientProvider } from './providers/QueryClientProvider';
import { Navbar } from './components/layout/Navbar';
import { ToastContainer } from './components/ui/ToastContainer';
import { AnimatedBackground } from './components/effects/AnimatedBackground';
import './globals.css';
import './footer.css';

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
  ],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_APP_URL || 'https://lumenlock.dev',
    siteName: 'LumenLock',
    title: 'LumenLock — Decentralized Escrow Marketplace on Stellar',
    description: 'Trustless P2P marketplace with Soroban-powered escrow settlement',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LumenLock',
    description: 'Trustless P2P marketplace with Soroban-powered escrow settlement',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: '#06060F',
};

const footerColumns = [
  {
    heading: 'Product',
    links: [
      { href: '/marketplace', label: 'Marketplace' },
      { href: '/dashboard', label: 'Dashboard' },
      { href: '/activity', label: 'Activity' },
      { href: '/analytics', label: 'Analytics' },
    ],
  },
  {
    heading: 'Protocol',
    links: [
      { href: '/transactions', label: 'Transactions' },
      { href: '/settings', label: 'Settings' },
      { href: 'https://stellar.org', label: 'Built on Stellar', external: true, stellar: true },
      { href: 'https://www.freighter.app/', label: 'Freighter Wallet', external: true },
    ],
  },
  {
    heading: 'Trust',
    links: [
      { href: '/#how-it-works', label: 'How Escrow Works' },
      { href: '/#features', label: 'Contract Capabilities' },
      { href: '/dashboard', label: 'Dispute Resolution' },
    ],
  },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-ink)', fontFamily: 'var(--font-ui)' }}>
        <AnimatedBackground />
        <QueryClientProvider>
          <div
            className="min-h-screen flex flex-col"
            style={{ position: 'relative', zIndex: 1 }}
          >
            <Navbar />
            <main className="flex-1">{children}</main>
            <ToastContainer />

            {/* ── Footer — a closing vault plaque ─────────────────────────────── */}
            <footer className="ll-footer">
              <div className="ll-footer-grain" aria-hidden="true" />
              <div className="ll-footer-glow" aria-hidden="true" />

              <div className="container-wide">
                <div className="ll-footer-top">
                  {/* Brand column */}
                  <div>
                    <Link
                      href="/"
                      className="flex items-center gap-2.5"
                      style={{ textDecoration: 'none', width: 'fit-content' }}
                      aria-label="LumenLock home"
                    >
                      <svg width="26" height="26" viewBox="0 0 28 28" fill="none" aria-hidden="true">
                        <rect x="1" y="1" width="26" height="26" rx="7" fill="rgba(124,92,252,0.16)" stroke="var(--color-accent2-bright)" strokeWidth="1.5" />
                        <path d="M 10.5 9 A 5 5 0 0 0 10.5 19" stroke="rgba(245,243,255,0.72)" strokeWidth="2" strokeLinecap="round" />
                        <path d="M 17.5 9 A 5 5 0 0 1 17.5 19" stroke="var(--color-accent2-bright)" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                      <span className="ll-footer-brand-line">LumenLock</span>
                    </Link>
                    <p className="ll-footer-tagline">
                      A Soroban escrow primitive for Stellar — bilateral confirmation,
                      milestone releases, and arbitrated disputes, sealed on-chain.
                    </p>
                  </div>

                  {/* Link columns */}
                  {footerColumns.map((col) => (
                    <div key={col.heading} className="ll-footer-col">
                      <p className="ll-footer-heading">{col.heading}</p>
                      {col.links.map((link) => (
                        <a
                          key={link.label}
                          href={link.href}
                          target={link.external ? '_blank' : undefined}
                          rel={link.external ? 'noopener noreferrer' : undefined}
                          className={`ll-footer-link${link.stellar ? ' ll-footer-link--stellar' : ''}`}
                        >
                          {link.label}
                        </a>
                      ))}
                    </div>
                  ))}
                </div>

                <div className="ll-footer-bottom">
                  <p className="ll-footer-copy">© {new Date().getFullYear()} LumenLock. Settled on Stellar.</p>
                  <span className="ll-footer-status">
                    <span className="ll-footer-status-dot" aria-hidden="true" />
                    Testnet contracts live
                  </span>
                </div>
              </div>
            </footer>
          </div>
        </QueryClientProvider>
      </body>
    </html>
  );
}
