'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWallet } from '../../hooks/useWallet';
import { formatAddress } from '../../types';
import {
  ShoppingBag,
  LayoutDashboard,
  Activity,
  ArrowLeftRight,
  BarChart3,
  Settings,
  Menu,
  X,
  Wallet,
  ChevronDown,
  LogOut,
  Copy,
  ExternalLink,
  AlertTriangle,
  Check,
} from 'lucide-react';
import { SealIcon } from '../ui/SealIcon';

const navItems = [
  { href: '/marketplace', label: 'Marketplace', icon: ShoppingBag },
  { href: '/dashboard',   label: 'Dashboard',   icon: LayoutDashboard },
  { href: '/activity',    label: 'Activity',     icon: Activity },
  { href: '/transactions',label: 'Transactions', icon: ArrowLeftRight },
  { href: '/analytics',   label: 'Analytics',    icon: BarChart3 },
];

/** The signature interlocking-ring wordmark, reused at nav scale. */
function Wordmark({ size = 30 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none" aria-hidden="true" className="shrink-0">
      <rect x="1" y="1" width="26" height="26" rx="8" fill="url(#navFillFade)" stroke="url(#navStrokeFade)" strokeWidth="1.3" />
      <path d="M 10.3 8.7 A 5.1 5.1 0 0 0 10.3 19.3" stroke="url(#navRingA)" strokeWidth="2" strokeLinecap="round" />
      <path d="M 17.7 8.7 A 5.1 5.1 0 0 1 17.7 19.3" stroke="url(#navRingB)" strokeWidth="2" strokeLinecap="round" />
      <defs>
        <linearGradient id="navFillFade" x1="0" y1="0" x2="28" y2="28">
          <stop offset="0%" stopColor="rgba(124,92,252,0.22)" />
          <stop offset="100%" stopColor="rgba(63,224,197,0.10)" />
        </linearGradient>
        <linearGradient id="navStrokeFade" x1="0" y1="0" x2="28" y2="28">
          <stop offset="0%" stopColor="#9B82FF" />
          <stop offset="100%" stopColor="#3FE0C5" />
        </linearGradient>
        <linearGradient id="navRingA" x1="5" y1="8" x2="16" y2="20">
          <stop offset="0%" stopColor="#9B82FF" />
          <stop offset="100%" stopColor="#5B3FE0" />
        </linearGradient>
        <linearGradient id="navRingB" x1="12" y1="8" x2="23" y2="20">
          <stop offset="0%" stopColor="#F5BE5C" />
          <stop offset="100%" stopColor="#E8A63D" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const { address, status, connect, disconnect, isConnected, isTestnet } = useWallet();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [walletMenuOpen, setWalletMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const walletMenuRef = useRef<HTMLDivElement>(null);

  const isActive = (href: string) =>
    pathname === href || (href !== '/' && pathname.startsWith(href + '/'));

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const openExplorer = () => {
    if (address) {
      const explorerUrl = process.env.NEXT_PUBLIC_EXPLORER_URL || 'https://stellar.expert/explorer/testnet';
      window.open(`${explorerUrl}/account/${address}`, '_blank');
    }
  };

  // Close wallet dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (walletMenuRef.current && !walletMenuRef.current.contains(e.target as Node)) {
        setWalletMenuOpen(false);
      }
    }
    if (walletMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [walletMenuOpen]);

  // Trap focus in mobile drawer
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  // Deepen the glass + hairline once the page has scrolled past the hero
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => { setMobileOpen(false); }, [pathname]);

  return (
    <>
      <header
        className="sticky top-0 z-50 transition-shadow duration-300"
        style={{
          backgroundColor: scrolled ? 'rgba(6,6,15,0.78)' : 'rgba(6,6,15,0.42)',
          backdropFilter: scrolled ? 'blur(20px) saturate(180%)' : 'blur(14px) saturate(150%)',
          WebkitBackdropFilter: scrolled ? 'blur(20px) saturate(180%)' : 'blur(14px) saturate(150%)',
          borderBottom: scrolled ? '1px solid rgba(124,92,252,0.22)' : '1px solid var(--glass-border)',
          boxShadow: scrolled ? '0 12px 40px rgba(0,0,0,0.4)' : 'none',
        }}
      >
        <div className="container-wide nav-row justify-between">
          {/* ── Logo ── */}
          <Link
            href="/"
            className="flex items-center gap-2.5 shrink-0 group"
            style={{ textDecoration: 'none' }}
            aria-label="LumenLock home"
          >
            <div className="transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6">
              <Wordmark />
            </div>
            <span
              className="text-gradient-violet"
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                fontSize: '1.1rem',
                letterSpacing: '-0.02em',
                whiteSpace: 'nowrap',
              }}
            >
              LumenLock
            </span>
          </Link>

          {/* ── Desktop Nav — glass capsule with a sliding active pill ── */}
          <div
            className="hidden md:flex items-center gap-0.5 glass-chip"
            role="menubar"
            style={{ padding: '5px' }}
          >
            {navItems.map(({ href, label, icon: Icon }) => {
              const active = isActive(href);
              return (
                <Link
                  key={href}
                  href={href}
                  role="menuitem"
                  className="relative flex items-center gap-1.5 whitespace-nowrap"
                  style={{
                    fontFamily: 'var(--font-ui)',
                    fontSize: '0.85rem',
                    fontWeight: 500,
                    padding: '7px 14px',
                    borderRadius: 'var(--radius-pill)',
                    color: active ? 'var(--color-ink)' : 'var(--color-ink-muted)',
                    textDecoration: 'none',
                    transition: 'color 0.2s ease',
                  }}
                  aria-current={active ? 'page' : undefined}
                >
                  {active && (
                    <motion.span
                      layoutId="nav-active-pill"
                      className="absolute inset-0"
                      style={{
                        borderRadius: 'var(--radius-pill)',
                        background: 'var(--glass-bg-strong)',
                        border: '1px solid var(--glass-border-strong)',
                        boxShadow: '0 0 0 1px rgba(124,92,252,0.15), 0 4px 16px rgba(124,92,252,0.18)',
                      }}
                      transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-1.5">
                    <Icon className="shrink-0" style={{ width: 14, height: 14 }} />
                    {label}
                  </span>
                </Link>
              );
            })}
          </div>

          {/* ── Right Side: Settings + Wallet ── */}
          <div className="flex items-center gap-2 shrink-0">

            {/* Settings icon (desktop only) */}
            <Link
              href="/settings"
              className="glass-icon-btn hidden md:flex items-center justify-center shrink-0"
              aria-label="Settings"
            >
              <Settings className="shrink-0" style={{ width: 16, height: 16 }} />
            </Link>

            {/* Wallet Button — 3 states */}
            {isConnected && address ? (
              /* ── Connected: pill with address ── */
              <div className="relative" ref={walletMenuRef}>
                <button
                  onClick={() => setWalletMenuOpen(!walletMenuOpen)}
                  className="glass-wallet-pill flex items-center gap-2"
                  id="wallet-menu-button"
                  aria-expanded={walletMenuOpen}
                  aria-haspopup="true"
                  aria-controls="wallet-dropdown"
                >
                  <span className="relative flex shrink-0" style={{ width: 7, height: 7 }} aria-hidden="true">
                    <span
                      className="absolute inline-flex h-full w-full rounded-full opacity-60"
                      style={{ backgroundColor: 'var(--color-success)', animation: 'ping 2s cubic-bezier(0,0,0.2,1) infinite' }}
                    />
                    <span
                      className="relative inline-flex rounded-full"
                      style={{ width: 7, height: 7, backgroundColor: 'var(--color-success)' }}
                    />
                  </span>
                  <span className="hidden sm:block">{formatAddress(address)}</span>
                  {isTestnet && (
                    <span
                      className="hidden sm:block badge-base"
                      style={{
                        background: 'var(--color-accent-soft)',
                        color: 'var(--color-accent-bright)',
                        fontSize: '0.65rem',
                        padding: '1px 6px',
                      }}
                    >
                      Testnet
                    </span>
                  )}
                  <ChevronDown
                    className={`shrink-0 transition-transform duration-200 ${walletMenuOpen ? 'rotate-180' : ''}`}
                    style={{ width: 14, height: 14, opacity: 0.7 }}
                  />
                </button>

                <AnimatePresence>
                  {walletMenuOpen && (
                    <motion.div
                      id="wallet-dropdown"
                      className="absolute right-0 mt-2 w-64 py-2"
                      initial={{ opacity: 0, y: -6, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -6, scale: 0.98 }}
                      transition={{ duration: 0.16, ease: [0.2, 0.8, 0.2, 1] }}
                      style={{
                        background: 'var(--color-surface-raised)',
                        border: '1px solid var(--glass-border-strong)',
                        borderRadius: 'var(--radius-lg)',
                        boxShadow: 'var(--shadow-dropdown)',
                        backdropFilter: 'blur(24px) saturate(160%)',
                        WebkitBackdropFilter: 'blur(24px) saturate(160%)',
                        zIndex: 100,
                      }}
                      role="menu"
                    >
                      {/* Full address */}
                      <div
                        className="px-4 py-3"
                        style={{ borderBottom: '1px solid var(--color-border)' }}
                      >
                        <p className="type-caption mb-1" style={{ color: 'var(--color-ink-faint)' }}>
                          Connected Wallet
                        </p>
                        <p
                          className="text-xs break-all leading-relaxed"
                          style={{ color: 'var(--color-ink)', fontFamily: 'var(--font-mono)' }}
                        >
                          {address}
                        </p>
                      </div>

                      {/* Copy address */}
                      <button
                        onClick={copyAddress}
                        className="flex items-center gap-2 w-full px-4 py-2 text-sm transition-colors"
                        style={{ color: 'var(--color-ink-muted)', fontFamily: 'var(--font-ui)' }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                        role="menuitem"
                        aria-label="Copy wallet address"
                      >
                        {copied ? (
                          <Check className="shrink-0" style={{ width: 15, height: 15, color: 'var(--color-success)' }} />
                        ) : (
                          <Copy className="shrink-0" style={{ width: 15, height: 15 }} />
                        )}
                        {copied ? 'Copied!' : 'Copy Address'}
                      </button>

                      {/* View on explorer */}
                      <button
                        onClick={openExplorer}
                        className="flex items-center gap-2 w-full px-4 py-2 text-sm transition-colors"
                        style={{ color: 'var(--color-ink-muted)', fontFamily: 'var(--font-ui)' }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                        role="menuitem"
                        aria-label="View wallet on Stellar Explorer"
                      >
                        <ExternalLink className="shrink-0" style={{ width: 15, height: 15 }} />
                        View on Explorer
                      </button>

                      {/* Disconnect */}
                      <div style={{ borderTop: '1px solid var(--color-border)' }} className="mt-1 pt-1">
                        <button
                          onClick={() => { disconnect(); setWalletMenuOpen(false); }}
                          className="flex items-center gap-2 w-full px-4 py-2 text-sm transition-colors"
                          style={{ color: 'var(--color-danger)', fontFamily: 'var(--font-ui)' }}
                          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-danger-soft)')}
                          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                          role="menuitem"
                        >
                          <LogOut className="shrink-0" style={{ width: 15, height: 15 }} />
                          Disconnect
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

            ) : status === 'connecting' ? (
              /* ── Connecting: disabled state ── */
              <button
                disabled
                className="wallet-btn btn-primary flex items-center justify-center gap-2"
                style={{ opacity: 0.65, cursor: 'not-allowed' }}
                id="connect-wallet-btn"
                aria-label="Connecting wallet…"
              >
                <SealIcon variant="loading" size={16} className="shrink-0" />
                Connecting…
              </button>

            ) : (
              /* ── Disconnected ── */
              <button
                onClick={connect}
                className="wallet-btn btn-primary flex items-center justify-center gap-2"
                id="connect-wallet-btn"
              >
                <Wallet className="shrink-0" style={{ width: 15, height: 15 }} />
                Connect Wallet
              </button>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="glass-icon-btn md:hidden flex items-center justify-center"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav"
            >
              {mobileOpen
                ? <X className="shrink-0" style={{ width: 20, height: 20 }} />
                : <Menu className="shrink-0" style={{ width: 20, height: 20 }} />
              }
            </button>
          </div>
        </div>

        {/* Network Warning Banner */}
        {isConnected && !isTestnet && (
          <div
            className="flex items-center justify-center gap-2 px-4 text-sm font-medium"
            style={{
              backgroundColor: 'rgba(242,107,107,0.14)',
              borderTop: '1px solid rgba(242,107,107,0.25)',
              color: '#F8A6A6',
              fontFamily: 'var(--font-ui)',
              height: '40px',
            }}
            role="alert"
          >
            <AlertTriangle className="shrink-0" style={{ width: 15, height: 15 }} />
            <span>Switch Freighter to Testnet to use LumenLock.</span>
            <a
              href="https://www.freighter.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline ml-1 transition-opacity hover:opacity-80"
            >
              Learn How
            </a>
          </div>
        )}

        <style jsx>{`
          .glass-icon-btn {
            width: 36px;
            height: 36px;
            border-radius: var(--radius-md);
            border: 1px solid var(--glass-border);
            background: var(--glass-bg);
            color: var(--color-ink-muted);
            backdrop-filter: blur(14px);
            -webkit-backdrop-filter: blur(14px);
            transition: color 0.2s ease, border-color 0.2s ease, background 0.2s ease, transform 0.2s ease;
          }
          .glass-icon-btn:hover {
            color: var(--color-ink);
            border-color: var(--color-accent2-border);
            background: var(--glass-bg-strong);
            transform: translateY(-1px);
          }
          .glass-wallet-pill {
            background: var(--glass-bg);
            border: 1px solid var(--glass-border-strong);
            border-radius: var(--radius-pill);
            color: var(--color-ink);
            font-family: var(--font-mono);
            font-size: 0.8125rem;
            padding: 7px 14px;
            height: 36px;
            cursor: pointer;
            backdrop-filter: blur(16px) saturate(160%);
            -webkit-backdrop-filter: blur(16px) saturate(160%);
            transition: border-color 0.2s ease, background 0.2s ease, box-shadow 0.2s ease;
          }
          .glass-wallet-pill:hover {
            border-color: var(--color-accent2-border);
            background: var(--glass-bg-strong);
            box-shadow: 0 0 0 1px rgba(124,92,252,0.12), 0 6px 20px rgba(124,92,252,0.14);
          }
          @keyframes ping {
            75%, 100% { transform: scale(2.2); opacity: 0; }
          }
        `}</style>
      </header>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-40 md:hidden"
            aria-hidden="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ backgroundColor: 'rgba(2,2,8,0.7)', backdropFilter: 'blur(4px)' }}
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile Slide-out Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            id="mobile-nav"
            className="fixed top-0 left-0 h-full w-72 z-50 md:hidden flex flex-col"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', stiffness: 340, damping: 34 }}
            style={{
              background: 'rgba(9,9,22,0.92)',
              backdropFilter: 'blur(28px) saturate(160%)',
              WebkitBackdropFilter: 'blur(28px) saturate(160%)',
              borderRight: '1px solid var(--glass-border-strong)',
              boxShadow: 'var(--shadow-vault)',
            }}
            aria-label="Mobile navigation"
          >
            {/* Drawer Header */}
            <div
              className="flex items-center justify-between px-5 shrink-0"
              style={{ height: '64px', borderBottom: '1px solid var(--color-invert-line)' }}
            >
              <Link
                href="/"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2.5"
                style={{ textDecoration: 'none' }}
              >
                <Wordmark size={26} />
                <span style={{ fontFamily: 'var(--font-display)', color: 'var(--color-invert-ink)', fontWeight: 700 }}>
                  LumenLock
                </span>
              </Link>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-2 rounded-lg"
                style={{ color: 'rgba(245,243,255,0.6)' }}
                aria-label="Close menu"
              >
                <X style={{ width: 20, height: 20 }} />
              </button>
            </div>

            {/* Nav Links */}
            <div className="flex-1 overflow-y-auto py-3 px-3">
              {navItems.map(({ href, label, icon: Icon }, i) => {
                const active = isActive(href);
                return (
                  <motion.div
                    key={href}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.04 * i, duration: 0.25, ease: [0.2, 0.8, 0.2, 1] }}
                  >
                    <Link
                      href={href}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3 w-full mb-1 rounded-lg"
                      style={{
                        padding: '11px 12px',
                        fontSize: '0.9375rem',
                        fontFamily: 'var(--font-ui)',
                        fontWeight: 500,
                        textDecoration: 'none',
                        color: active ? 'var(--color-invert-ink)' : 'rgba(245,243,255,0.6)',
                        background: active ? 'var(--color-accent2-soft)' : 'transparent',
                        border: active ? '1px solid var(--color-accent2-border)' : '1px solid transparent',
                      }}
                      aria-current={active ? 'page' : undefined}
                    >
                      <Icon
                        className="shrink-0"
                        style={{
                          width: 17,
                          height: 17,
                          color: active ? 'var(--color-accent2-bright)' : 'rgba(245,243,255,0.4)',
                        }}
                      />
                      {label}
                    </Link>
                  </motion.div>
                );
              })}
              <Link
                href="/settings"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 w-full rounded-lg"
                style={{
                  padding: '11px 12px',
                  fontSize: '0.9375rem',
                  fontFamily: 'var(--font-ui)',
                  fontWeight: 500,
                  textDecoration: 'none',
                  color: 'rgba(245,243,255,0.6)',
                }}
              >
                <Settings className="shrink-0" style={{ width: 17, height: 17, color: 'rgba(245,243,255,0.4)' }} />
                Settings
              </Link>
            </div>

            {/* Drawer Footer: Wallet */}
            <div
              className="px-4 py-4 shrink-0"
              style={{ borderTop: '1px solid var(--color-invert-line)' }}
            >
              {isConnected && address ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
                  <p className="type-caption" style={{ color: 'rgba(245,243,255,0.4)' }}>Connected</p>
                  <p
                    className="text-xs break-all"
                    style={{ color: 'var(--color-invert-ink)', fontFamily: 'var(--font-mono)' }}
                  >
                    {formatAddress(address)}
                  </p>
                  <button
                    onClick={() => { disconnect(); setMobileOpen(false); }}
                    className="w-full text-sm flex items-center justify-center gap-2 rounded-full"
                    style={{
                      color: '#F8A6A6',
                      border: '1px solid rgba(242,107,107,0.35)',
                      padding: '9px 16px',
                      background: 'transparent',
                    }}
                  >
                    <LogOut style={{ width: 15, height: 15 }} />
                    Disconnect
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => { connect(); setMobileOpen(false); }}
                  disabled={status === 'connecting'}
                  className="btn-primary w-full"
                >
                  <Wallet style={{ width: 15, height: 15 }} />
                  {status === 'connecting' ? 'Connecting…' : 'Connect Wallet'}
                </button>
              )}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
}
