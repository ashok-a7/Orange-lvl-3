'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
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

/** The signature interlocking-seal wordmark, reused at nav scale. */
function Wordmark({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none" aria-hidden="true" className="shrink-0">
      <rect x="1" y="1" width="26" height="26" rx="7" fill="url(#navGoldFade)" stroke="var(--color-accent-bright)" strokeWidth="1.4" />
      <path d="M 10.5 9 A 5 5 0 0 0 10.5 19" stroke="var(--color-trust)" strokeWidth="2" strokeLinecap="round" />
      <path d="M 17.5 9 A 5 5 0 0 1 17.5 19" stroke="var(--color-accent-bright)" strokeWidth="2" strokeLinecap="round" />
      <defs>
        <linearGradient id="navGoldFade" x1="0" y1="0" x2="28" y2="28">
          <stop offset="0%" stopColor="rgba(194,138,23,0.16)" />
          <stop offset="100%" stopColor="rgba(43,75,199,0.08)" />
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

  return (
    <>
      <header
        className="sticky top-0 z-50 transition-shadow duration-300"
        style={{
          backgroundColor: scrolled ? 'rgba(9, 10, 12, 0.82)' : 'rgba(9, 10, 12, 0.68)',
          backdropFilter: 'blur(14px) saturate(140%)',
          WebkitBackdropFilter: 'blur(14px) saturate(140%)',
          borderBottom: scrolled ? '1px solid rgba(194,138,23,0.16)' : '1px solid var(--color-invert-line)',
          boxShadow: scrolled ? '0 12px 32px rgba(0,0,0,0.28)' : 'none',
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
            <div className="transition-transform duration-200 group-hover:scale-105 group-hover:rotate-3">
              <Wordmark />
            </div>
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                fontSize: '1.1rem',
                color: 'var(--color-invert-ink)',
                letterSpacing: '-0.02em',
                whiteSpace: 'nowrap',
              }}
            >
              LumenLock
            </span>
          </Link>

          {/* ── Desktop Nav ── */}
          <div className="hidden md:flex items-center gap-1" role="menubar">
            {navItems.map(({ href, label, icon: Icon }) => {
              const active = isActive(href);
              return (
                <Link
                  key={href}
                  href={href}
                  role="menuitem"
                  className="dark-nav-item"
                  data-active={active || undefined}
                  aria-current={active ? 'page' : undefined}
                >
                  <Icon className="shrink-0" style={{ width: 15, height: 15 }} />
                  {label}
                </Link>
              );
            })}
          </div>

          {/* ── Right Side: Settings + Wallet ── */}
          <div className="flex items-center gap-2 shrink-0">

            {/* Settings icon (desktop only) */}
            <Link
              href="/settings"
              className="dark-icon-btn hidden md:flex items-center justify-center shrink-0"
              aria-label="Settings"
            >
              <Settings className="shrink-0" style={{ width: 17, height: 17 }} />
            </Link>

            {/* Wallet Button — 3 states */}
            {isConnected && address ? (
              /* ── Connected: pill with address ── */
              <div className="relative" ref={walletMenuRef}>
                <button
                  onClick={() => setWalletMenuOpen(!walletMenuOpen)}
                  className="dark-wallet-pill flex items-center gap-2"
                  id="wallet-menu-button"
                  aria-expanded={walletMenuOpen}
                  aria-haspopup="true"
                  aria-controls="wallet-dropdown"
                >
                  <div
                    className="rounded-full shrink-0"
                    style={{ width: 7, height: 7, backgroundColor: 'var(--color-success)', boxShadow: '0 0 0 3px rgba(22,130,74,0.22)', flexShrink: 0 }}
                    aria-hidden="true"
                  />
                  <span className="hidden sm:block">{formatAddress(address)}</span>
                  {isTestnet && (
                    <span
                      className="hidden sm:block badge-base"
                      style={{
                        background: 'rgba(166,101,10,0.18)',
                        color: '#E3A23B',
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

                {walletMenuOpen && (
                  <div
                    id="wallet-dropdown"
                    className="absolute right-0 mt-2 w-64 py-2 animate-fade-up"
                    style={{
                      background: 'var(--color-surface-raised)',
                      border: '1px solid var(--color-border-strong)',
                      borderRadius: 'var(--radius-lg)',
                      boxShadow: 'var(--shadow-dropdown)',
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
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-surface)')}
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
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-surface)')}
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
                  </div>
                )}
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
              className="dark-icon-btn md:hidden flex items-center justify-center"
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
              backgroundColor: 'rgba(199,54,42,0.16)',
              borderTop: '1px solid rgba(199,54,42,0.22)',
              color: '#E8776C',
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
          .dark-nav-item {
            display: flex;
            align-items: center;
            gap: 7px;
            white-space: nowrap;
            font-family: var(--font-ui);
            font-size: 0.875rem;
            font-weight: 500;
            color: rgba(243, 238, 226, 0.56);
            text-decoration: none;
            padding: 7px 12px;
            border-radius: var(--radius-md);
            position: relative;
            transition: color 0.15s ease, background 0.15s ease;
          }
          .dark-nav-item:hover { color: var(--color-invert-ink); background: rgba(255,255,255,0.06); }
          .dark-nav-item[data-active] { color: var(--color-invert-ink); }
          .dark-nav-item[data-active]::after {
            content: '';
            position: absolute;
            left: 12px;
            right: 12px;
            bottom: 1px;
            height: 2px;
            border-radius: 2px;
            background: var(--gradient-gold);
          }
          .dark-icon-btn {
            width: 36px;
            height: 36px;
            border-radius: var(--radius-md);
            border: 1px solid var(--color-invert-line);
            color: rgba(243, 238, 226, 0.6);
            transition: color 0.15s ease, border-color 0.15s ease, background 0.15s ease;
          }
          .dark-icon-btn:hover {
            color: var(--color-invert-ink);
            border-color: rgba(194,138,23,0.4);
            background: rgba(255,255,255,0.05);
          }
          .dark-wallet-pill {
            background-color: rgba(255,255,255,0.06);
            border: 1px solid rgba(255,255,255,0.14);
            border-radius: var(--radius-pill);
            color: var(--color-invert-ink);
            font-family: var(--font-mono);
            font-size: 0.8125rem;
            padding: 7px 14px;
            height: 36px;
            cursor: pointer;
            transition: border-color 0.15s ease, background 0.15s ease;
          }
          .dark-wallet-pill:hover {
            border-color: rgba(194,138,23,0.45);
            background-color: rgba(255,255,255,0.09);
          }
        `}</style>
      </header>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden"
          aria-hidden="true"
          style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Slide-out Drawer */}
      <nav
        id="mobile-nav"
        className={`fixed top-0 left-0 h-full w-72 z-50 md:hidden flex flex-col transition-transform duration-300 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}
        style={{ backgroundColor: 'var(--color-invert-bg)', boxShadow: 'var(--shadow-vault)' }}
        aria-label="Mobile navigation"
        aria-hidden={!mobileOpen}
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
            <Wordmark size={24} />
            <span style={{ fontFamily: 'var(--font-display)', color: 'var(--color-invert-ink)', fontWeight: 700 }}>
              LumenLock
            </span>
          </Link>
          <button
            onClick={() => setMobileOpen(false)}
            className="p-2 rounded-lg"
            style={{ color: 'rgba(243,238,226,0.6)' }}
            aria-label="Close menu"
          >
            <X style={{ width: 20, height: 20 }} />
          </button>
        </div>

        {/* Nav Links */}
        <div className="flex-1 overflow-y-auto py-3 px-3">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 w-full mb-1 rounded-lg"
                style={{
                  padding: '11px 12px',
                  fontSize: '0.9375rem',
                  fontFamily: 'var(--font-ui)',
                  fontWeight: 500,
                  textDecoration: 'none',
                  color: active ? 'var(--color-invert-ink)' : 'rgba(243,238,226,0.6)',
                  background: active ? 'rgba(194,138,23,0.14)' : 'transparent',
                }}
                aria-current={active ? 'page' : undefined}
              >
                <Icon
                  className="shrink-0"
                  style={{
                    width: 17,
                    height: 17,
                    color: active ? 'var(--color-accent-bright)' : 'rgba(243,238,226,0.4)',
                  }}
                />
                {label}
              </Link>
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
              color: 'rgba(243,238,226,0.6)',
            }}
          >
            <Settings className="shrink-0" style={{ width: 17, height: 17, color: 'rgba(243,238,226,0.4)' }} />
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
              <p className="type-caption" style={{ color: 'rgba(243,238,226,0.4)' }}>Connected</p>
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
                  color: '#E8776C',
                  border: '1px solid rgba(199,54,42,0.35)',
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
      </nav>
    </>
  );
}
