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

const navItems = [
  { href: '/marketplace', label: 'Marketplace', icon: ShoppingBag },
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/activity', label: 'Activity', icon: Activity },
  { href: '/transactions', label: 'Transactions', icon: ArrowLeftRight },
  { href: '/analytics', label: 'Analytics', icon: BarChart3 },
];

export function Navbar() {
  const pathname = usePathname();
  const { address, status, connect, disconnect, isConnected, isTestnet } = useWallet();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [walletMenuOpen, setWalletMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);
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
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  return (
    <>
      <header
        className="sticky top-0 z-50"
        style={{
          backgroundColor: 'rgba(250, 250, 248, 0.92)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderBottom: '1px solid var(--color-border)',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        }}
      >
        <div className="container-wide nav-row justify-between">
          {/* ── Logo ── */}
          <Link
            href="/"
            className="flex items-center gap-2 shrink-0 group"
            style={{ textDecoration: 'none' }}
            aria-label="LumenLock home"
          >
            <svg
              width="28"
              height="28"
              viewBox="0 0 28 28"
              fill="none"
              aria-hidden="true"
              className="transition-all duration-300 group-hover:scale-110 shrink-0"
            >
              <rect x="1" y="1" width="26" height="26" rx="7" fill="var(--color-trust-soft)" stroke="var(--color-trust)" strokeWidth="1.5" />
              <path d="M 10.5 9 A 5 5 0 0 0 10.5 19" stroke="var(--color-trust)" strokeWidth="2" strokeLinecap="round" />
              <path d="M 17.5 9 A 5 5 0 0 1 17.5 19" stroke="var(--color-accent)" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                fontSize: '1.15rem',
                color: 'var(--color-ink)',
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
                  className={`nav-item${active ? ' nav-item-active' : ''}`}
                  aria-current={active ? 'page' : undefined}
                >
                  <Icon
                    className="shrink-0"
                    style={{
                      width: 17,
                      height: 17,
                      color: active ? 'var(--color-accent)' : 'var(--color-ink-faint)',
                    }}
                  />
                  {label}
                </Link>
              );
            })}
          </div>

          {/* ── Right Side: Settings + Wallet ── */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Settings icon (desktop only) */}
            <Link
              href="/settings"
              className="hidden md:flex items-center justify-center shrink-0"
              style={{
                width: 40,
                height: 40,
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border)',
                color: 'var(--color-ink-faint)',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--color-ink)';
                e.currentTarget.style.borderColor = 'var(--color-border-strong)';
                e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.03)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--color-ink-faint)';
                e.currentTarget.style.borderColor = 'var(--color-border)';
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
              aria-label="Settings"
            >
              <Settings className="shrink-0" style={{ width: 18, height: 18 }} />
            </Link>

            {/* Wallet Button — 3 states */}
            {isConnected && address ? (
              /* ── Connected: pill with address ── */
              <div className="relative" ref={walletMenuRef}>
                <button
                  onClick={() => setWalletMenuOpen(!walletMenuOpen)}
                  className="wallet-btn flex items-center gap-2"
                  style={{
                    backgroundColor: 'var(--color-surface-raised)',
                    border: '1.5px solid var(--color-border-strong)',
                    borderRadius: 'var(--radius-pill)',
                    color: 'var(--color-ink)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    padding: '8px 16px',
                    height: '40px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--color-accent-border)';
                    e.currentTarget.style.backgroundColor = 'var(--color-surface)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--color-border-strong)';
                    e.currentTarget.style.backgroundColor = 'var(--color-surface-raised)';
                  }}
                  id="wallet-menu-button"
                  aria-expanded={walletMenuOpen}
                  aria-haspopup="true"
                  aria-controls="wallet-dropdown"
                >
                  <div
                    className="rounded-full shrink-0"
                    style={{ width: 8, height: 8, backgroundColor: 'var(--color-success)', flexShrink: 0 }}
                    aria-hidden="true"
                  />
                  <span className="hidden sm:block">{formatAddress(address)}</span>
                  {isTestnet && (
                    <span
                      className="hidden sm:block badge-base"
                      style={{
                        background: 'var(--color-warning-soft)',
                        color: 'var(--color-warning)',
                        fontSize: '0.65rem',
                        padding: '2px 6px',
                      }}
                    >
                      Testnet
                    </span>
                  )}
                  <ChevronDown
                    className={`shrink-0 transition-transform duration-200 ${walletMenuOpen ? 'rotate-180' : ''}`}
                    style={{ width: 15, height: 15, color: 'var(--color-ink-muted)' }}
                  />
                </button>

                {walletMenuOpen && (
                  <div
                    id="wallet-dropdown"
                    className="absolute right-0 mt-2 w-72 ll-card py-2 animate-fade-up"
                    style={{ boxShadow: 'var(--shadow-dropdown)', zIndex: 100 }}
                    role="menu"
                  >
                    {/* Full address */}
                    <div
                      className="px-4 py-3"
                      style={{ borderBottom: '1px solid var(--color-border)' }}
                    >
                      <p className="type-caption mb-2" style={{ color: 'var(--color-ink-faint)' }}>
                        Connected Wallet
                      </p>
                      <p
                        className="text-xs break-all leading-relaxed font-mono"
                        style={{ color: 'var(--color-ink)' }}
                      >
                        {address}
                      </p>
                    </div>

                    {/* Copy address */}
                    <button
                      onClick={copyAddress}
                      className="flex items-center gap-2 w-full px-4 py-2 text-sm transition-colors"
                      style={{ color: 'var(--color-ink-muted)' }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-surface)')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                      role="menuitem"
                      aria-label="Copy wallet address"
                    >
                      {copied ? (
                        <Check className="shrink-0" style={{ width: 16, height: 16, color: 'var(--color-success)' }} />
                      ) : (
                        <Copy className="shrink-0" style={{ width: 16, height: 16 }} />
                      )}
                      <span style={{ fontWeight: 600 }}>{copied ? 'Copied!' : 'Copy Address'}</span>
                    </button>

                    {/* View on explorer */}
                    <button
                      onClick={openExplorer}
                      className="flex items-center gap-2 w-full px-4 py-2 text-sm transition-colors"
                      style={{ color: 'var(--color-ink-muted)' }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-surface)')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                      role="menuitem"
                      aria-label="View wallet on Stellar Explorer"
                    >
                      <ExternalLink className="shrink-0" style={{ width: 16, height: 16 }} />
                      <span style={{ fontWeight: 600 }}>View on Explorer</span>
                    </button>

                    {/* Disconnect */}
                    <div style={{ borderTop: '1px solid var(--color-border)' }} className="mt-1 pt-1">
                      <button
                        onClick={() => {
                          disconnect();
                          setWalletMenuOpen(false);
                        }}
                        className="flex items-center gap-2 w-full px-4 py-2 text-sm transition-colors"
                        style={{ color: 'var(--color-danger)' }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-danger-soft)')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                        role="menuitem"
                        aria-label="Disconnect wallet"
                      >
                        <LogOut className="shrink-0" style={{ width: 16, height: 16 }} />
                        <span style={{ fontWeight: 600 }}>Disconnect</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* ── Not Connected: Connect Button ── */
              <button
                onClick={connect}
                className="btn-primary"
                id="connect-wallet-btn"
                style={{ padding: '10px 20px', height: '40px', fontSize: '0.95rem' }}
              >
                <Wallet style={{ width: 17, height: 17 }} />
                <span className="hidden sm:inline">Connect Wallet</span>
                <span className="sm:hidden">Connect</span>
              </button>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden flex items-center justify-center"
              style={{
                width: 40,
                height: 40,
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border)',
                color: 'var(--color-ink)',
                backgroundColor: 'transparent',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.03)';
                e.currentTarget.style.borderColor = 'var(--color-border-strong)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.borderColor = 'var(--color-border)';
              }}
              aria-label="Toggle mobile menu"
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? (
                <X style={{ width: 20, height: 20 }} />
              ) : (
                <Menu style={{ width: 20, height: 20 }} />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 top-[68px] z-40 bg-black/50 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
          style={{ animation: 'fade-up 0.2s ease' }}
        >
          <nav
            className="bg-white border-b border-gray-200 animate-fade-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="container-wide py-4 flex flex-col gap-2">
              {navItems.map(({ href, label, icon: Icon }) => {
                const active = isActive(href);
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      active
                        ? 'bg-accent-soft text-accent font-bold'
                        : 'text-ink-muted hover:bg-surface'
                    }`}
                    onClick={() => setMobileOpen(false)}
                  >
                    <Icon style={{ width: 18, height: 18 }} />
                    {label}
                  </Link>
                );
              })}
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
