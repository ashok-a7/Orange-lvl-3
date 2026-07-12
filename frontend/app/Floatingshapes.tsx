'use client';

/**
 * FloatingShapes — a small constellation of rotating outline geometry
 * (hexagons + rings, echoing Soroban's honeycomb contracts and
 * original LumenLock seal) that drifts gently behind hero content.
 *
 * Pure SVG + CSS keyframes (geo-spin / geo-spin-rev / geo-drift, defined
 * in globals.css) — no JS animation loop, so it's effectively free.
 */
export function FloatingShapes() {
  return (
    <div aria-hidden="true" style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {/* Large hexagon, slow clockwise spin — top right */}
      <svg
        className="geo-spin hidden sm:block"
        width="260"
        height="260"
        viewBox="0 0 100 100"
        style={{ position: 'absolute', top: '2%', right: '4%', opacity: 0.28 }}
      >
        <polygon
          points="50,4 91,27 91,73 50,96 9,73 9,27"
          fill="none"
          stroke="url(#hexGradA)"
          strokeWidth="0.9"
        />
        <defs>
          <linearGradient id="hexGradA" x1="0" y1="0" x2="100" y2="100">
            <stop offset="0%" stopColor="#9B82FF" />
            <stop offset="100%" stopColor="#3FE0C5" />
          </linearGradient>
        </defs>
      </svg>

      {/* Small hexagon, counter spin, drifting — left side */}
      <svg
        className="geo-spin-rev geo-drift hidden md:block"
        width="140"
        height="140"
        viewBox="0 0 100 100"
        style={{ position: 'absolute', top: '48%', left: '2%', opacity: 0.22 }}
      >
        <polygon
          points="50,4 91,27 91,73 50,96 9,73 9,27"
          fill="none"
          stroke="#E8A63D"
          strokeWidth="1.1"
        />
      </svg>

      {/* Thin ring, slow spin — bottom right */}
      <svg
        className="geo-spin"
        width="180"
        height="180"
        viewBox="0 0 100 100"
        style={{ position: 'absolute', bottom: '6%', right: '10%', opacity: 0.2 }}
      >
        <circle cx="50" cy="50" r="42" fill="none" stroke="#7C5CFC" strokeWidth="0.8" strokeDasharray="2 5" />
      </svg>

      {/* Small drifting triangle outline — top left */}
      <svg
        className="geo-drift hidden lg:block"
        width="90"
        height="90"
        viewBox="0 0 100 100"
        style={{ position: 'absolute', top: '14%', left: '18%', opacity: 0.18 }}
      >
        <polygon points="50,10 90,85 10,85" fill="none" stroke="#3FE0C5" strokeWidth="1.2" />
      </svg>

      {/* Tiny orbiting dot ring — accent detail near center-right */}
      <svg
        className="geo-spin-rev hidden md:block"
        width="70"
        height="70"
        viewBox="0 0 100 100"
        style={{ position: 'absolute', top: '68%', right: '30%', opacity: 0.3 }}
      >
        <circle cx="50" cy="8" r="4" fill="#E8A63D" />
        <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(232,166,61,0.25)" strokeWidth="0.6" />
      </svg>
    </div>
  );
}
