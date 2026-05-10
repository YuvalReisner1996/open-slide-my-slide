import type { Page, SlideMeta } from '@open-slide/core';
import { useEffect, useMemo, useState } from 'react';

import {
  COHORT_ONLINE_GPV_USD_MAR2026,
  COHORT_TOTAL,
  ONLINE_GPV_USD_BY_ISO,
  UNMON_BY_ISO,
  topGpProvidersForCountry,
} from './mapCohortData';

/** Compact USD: $1.4M, $87K, $574, $8 — used in the sidebar so each row stays narrow. */
const fmtUsdCompact = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  notation: 'compact',
  maximumFractionDigits: 1,
});

/** Tooltip / cover number — fuller precision. */
const fmtUsdShort = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

/** Compact share label: "<1%" for fractions below 0.5%, "Math.round" otherwise. */
function fmtPct(numerator: number, denominator: number): string {
  if (denominator <= 0) return '0%';
  const pct = (100 * numerator) / denominator;
  if (pct > 0 && pct < 0.5) return '<1%';
  return `${Math.round(pct)}%`;
}

/**
 * Choropleth UI for unmonetized selling sites — Mar 2026 cohort.
 * All embedded counts and tooltip payment-provider rows live in `./mapCohortData.ts` (refresh together from Trino).
 */

/**
 * Visual system: cool neutral canvas, ink text, ocean-backed map land pops forward.
 * Choropleth: frost → deep teal (high contrast vs ocean + “no data” gray).
 */
const palette = {
  bg: '#edf1f8',
  bgElevated: '#f6f8fd',
  surface: '#ffffff',
  surfaceInset: '#eef3fa',
  ocean: '#dceaf5',
  text: '#0f172a',
  muted: '#5c6b80',
  accent: '#0e7490',
  accentMuted: '#155e75',
  empty: '#e4eaf2',
  stroke: 'rgba(30, 41, 59, 0.12)',
  /** Coastline — darker blue-gray so land reads distinctly from ocean (#dceaf5). */
  landStroke: 'rgba(44, 82, 118, 0.82)',
  cardShadow: '0 2px 8px rgba(15, 23, 42, 0.06), 0 12px 32px rgba(15, 23, 42, 0.06)',
};

const font = {
  sans: '"IBM Plex Sans", "SF Pro Display", system-ui, sans-serif',
  mono: '"IBM Plex Mono", ui-monospace, monospace',
};

/** Natural Earth 110m — cleaner topology than admin-0 datasets geo-countries. */
const GEO_URL_PRIMARY =
  'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_admin_0_countries.geojson';

const GEO_URL_FALLBACK =
  'https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson';

/** When NE reports ISO_A2 -99, resolve via ADM0_A3 (subset — extend if join misses). */
const NE_ADM_TO_ISO2: Record<string, string> = {
  FRA: 'FR',
  NOR: 'NO',
  KOS: 'XK',
};

function isoFromFeature(props: Record<string, unknown>): string | null {
  const isoRaw =
    props.ISO_A2 ??
    props['ISO3166-1-Alpha-2'] ??
    props.iso_a2 ??
    props.WB_A2 ??
    props.ISO_A2_EH;
  let s = isoRaw != null ? String(isoRaw).trim().toUpperCase() : '';

  if ((!s || s === '-99') && props.WB_A2 != null) {
    const wb = String(props.WB_A2).trim().toUpperCase();
    if (wb.length === 2 && wb !== '-99') s = wb;
  }
  if (!s || s === '-99') {
    const adm = String(props.ADM0_A3 ?? '').toUpperCase();
    if (adm && NE_ADM_TO_ISO2[adm]) s = NE_ADM_TO_ISO2[adm];
  }

  if (!s || s === '-99' || !/^[A-Z]{2}$/.test(s)) return null;
  if (s === 'UK') return 'GB';
  return s;
}

/** Plate Carrée — matches prior HTML choropleth shape closely enough for slides */
function projectRing(ring: number[][], mapW: number, mapH: number): string {
  if (!ring.length) return '';
  const pts = ring.map(([lon, lat]) => {
    const x = ((lon + 180) / 360) * mapW;
    const y = ((90 - lat) / 180) * mapH;
    return [x, y] as const;
  });
  let d = `M ${pts[0][0]} ${pts[0][1]}`;
  for (let i = 1; i < pts.length; i++) {
    d += ` L ${pts[i][0]} ${pts[i][1]}`;
  }
  return `${d} Z`;
}

function geometryToPath(
  geom: GeoJSON.Polygon | GeoJSON.MultiPolygon,
  mapW: number,
  mapH: number,
): string {
  if (geom.type === 'Polygon') {
    return geom.coordinates.map((ring) => projectRing(ring as number[][], mapW, mapH)).join(' ');
  }
  return geom.coordinates
    .flatMap((poly) =>
      (poly as number[][][]).map((ring) => projectRing(ring as number[][], mapW, mapH)),
    )
    .join(' ');
}

/** Sequential ramp: very light cyan → deep teal (reads clearly on ocean + UI grays). */
function choroplethFill(v: number, vmin: number, vmax: number): string {
  const lo = Math.log10(Math.max(1, vmin));
  const hi = Math.log10(Math.max(2, vmax));
  const t = Math.max(0, Math.min(1, (Math.log10(Math.max(1, v)) - lo) / (hi - lo || 1)));
  const low = [236, 252, 254];
  const high = [8, 89, 112];
  const r = Math.round(low[0] + (high[0] - low[0]) * t);
  const g = Math.round(low[1] + (high[1] - low[1]) * t);
  const b = Math.round(low[2] + (high[2] - low[2]) * t);
  return `rgb(${r},${g},${b})`;
}

/** Log-spaced tick values for legend labels (inclusive of range). */
function legendTickValues(vmin: number, vmax: number, maxTicks: number): number[] {
  const lo = Math.log10(Math.max(1, vmin));
  const hi = Math.log10(Math.max(2, vmax));
  const step = (hi - lo) / (maxTicks - 1);
  const out: number[] = [];
  for (let i = 0; i < maxTicks; i++) {
    out.push(Math.round(Math.pow(10, lo + step * i)));
  }
  out[0] = Math.max(1, vmin);
  out[out.length - 1] = vmax;
  return out;
}

type PathRow = { iso: string; d: string };

type HoverTip = {
  iso: string;
  n: number;
  gpv: number;
  x: number;
  y: number;
};

const regionNamesEn = new Intl.DisplayNames(['en'], { type: 'region' });

function countryNameFromIso(iso: string): string {
  try {
    const name = regionNamesEn.of(iso.toUpperCase());
    return name ?? iso;
  } catch {
    return iso;
  }
}

const Cover: Page = () => (
  <div
    style={{
      width: '100%',
      height: '100%',
      background: `linear-gradient(145deg, ${palette.bgElevated} 0%, ${palette.bg} 42%)`,
      padding: '120px 140px',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
    }}
  >
    <p
      style={{
        fontFamily: font.mono,
        fontSize: 26,
        color: palette.accentMuted,
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        margin: 0,
      }}
    >
      eCom · Monetization
    </p>
    <h1
      style={{
        fontFamily: font.sans,
        fontSize: 112,
        fontWeight: 700,
        color: palette.text,
        lineHeight: 1.05,
        margin: '24px 0 0',
        maxWidth: 1600,
      }}
    >
      Unmonetized selling sites
    </h1>
    <p
      style={{
        fontFamily: font.sans,
        fontSize: 44,
        color: palette.muted,
        margin: '28px 0 0',
        maxWidth: 1400,
        lineHeight: 1.35,
      }}
    >
      Geographic spread · March 2026 snapshot · QA sites excluded
    </p>
    <p
      style={{
        fontFamily: font.mono,
        fontSize: 28,
        color: palette.muted,
        marginTop: 56,
      }}
    >
      Cohort total · {COHORT_TOTAL.toLocaleString()} sites · Mar 2026 online GPV{' '}
      {fmtUsdCompact.format(COHORT_ONLINE_GPV_USD_MAR2026)}
    </p>
  </div>
);

/** Horizontal legend strip under map — scales with map column width (viewBox matches map width). */
function MapLegendBar({
  vmin,
  vmax,
  viewW,
}: {
  vmin: number;
  vmax: number;
  /** Same as map viewBox width so ticks align with choropleth scale. */
  viewW: number;
}) {
  const ticks = useMemo(() => legendTickValues(vmin, vmax, 5), [vmin, vmax]);
  const gradientId = 'unmon-choropleth-legend-h';
  const barH = 20;
  const pad = 6;
  /** Extra vertical space so labels are not clipped (baseline + descenders when scaled). */
  const labelGap = 26;
  const bottomPad = 10;
  const vbH = pad + barH + labelGap + bottomPad;

  return (
    <div style={{ marginTop: 12, width: '100%', flexShrink: 0, overflow: 'visible' }}>
      <svg
        width="100%"
        viewBox={`0 0 ${viewW} ${vbH}`}
        preserveAspectRatio="xMidYMid meet"
        style={{ display: 'block', height: 'auto', maxWidth: '100%', overflow: 'visible' }}
        role="img"
        aria-label="Legend: color scale for unmonetized selling site counts"
      >
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            {ticks.map((tv, i) => (
              <stop
                key={`h-${tv}-${i}`}
                offset={`${(100 * i) / (ticks.length - 1)}%`}
                stopColor={choroplethFill(tv, vmin, vmax)}
              />
            ))}
          </linearGradient>
        </defs>
        <rect
          x={pad}
          y={pad}
          width={viewW - pad * 2}
          height={barH}
          fill={`url(#${gradientId})`}
          stroke={palette.stroke}
          strokeWidth={1}
          rx={4}
        />
        {ticks.map((tv, i) => {
          const x = pad + ((viewW - pad * 2) * i) / (ticks.length - 1);
          const tickTop = pad + barH;
          return (
            <g key={`ht-${tv}-${i}`}>
              <line
                x1={x}
                y1={tickTop}
                x2={x}
                y2={tickTop + 6}
                stroke={palette.muted}
                strokeWidth={1}
              />
              <text
                x={x}
                y={tickTop + labelGap}
                dominantBaseline="alphabetic"
                textAnchor={i === 0 ? 'start' : i === ticks.length - 1 ? 'end' : 'middle'}
                fill={palette.text}
                style={{ fontFamily: font.mono, fontSize: 17 }}
              >
                {tv.toLocaleString()}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

const Choropleth: Page = () => {
  const [paths, setPaths] = useState<PathRow[] | null>(null);
  const [loadErr, setLoadErr] = useState<string | null>(null);
  /** Plate Carrée world 360°×180° → 2:1 frame reads balanced on slides */
  const mapW = 1680;
  const mapH = 840;

  const { vmin, vmax } = useMemo(() => {
    const vals = Object.values(UNMON_BY_ISO);
    return { vmin: Math.min(...vals), vmax: Math.max(...vals) };
  }, []);

  const pathsPaintOrder = useMemo(() => {
    if (!paths) return null;
    return [...paths].sort((a, b) => {
      const na = UNMON_BY_ISO[a.iso] ?? 0;
      const nb = UNMON_BY_ISO[b.iso] ?? 0;
      return na - nb;
    });
  }, [paths]);

  useEffect(() => {
    let cancelled = false;
    const urls = [GEO_URL_PRIMARY, GEO_URL_FALLBACK];

    (async () => {
      let geo: GeoJSON.FeatureCollection | null = null;
      for (const url of urls) {
        try {
          const r = await fetch(url);
          if (r.ok) {
            geo = (await r.json()) as GeoJSON.FeatureCollection;
            break;
          }
        } catch {
          /* try fallback */
        }
      }
      if (cancelled) return;
      if (!geo) {
        setLoadErr('Could not load map outlines (network).');
        return;
      }

      const merged = new Map<string, string>();
      for (const f of geo.features) {
        const p = (f.properties || {}) as Record<string, unknown>;
        if (String(p.ADM0_A3 ?? '').toUpperCase() === 'ATA') continue;

        const iso = isoFromFeature(p);
        if (!iso || !f.geometry) continue;
        const g = f.geometry;
        if (g.type !== 'Polygon' && g.type !== 'MultiPolygon') continue;
        const d = geometryToPath(g, mapW, mapH);
        if (!d) continue;
        merged.set(iso, merged.has(iso) ? `${merged.get(iso)} ${d}` : d);
      }

      setPaths([...merged.entries()].map(([iso, d]) => ({ iso, d })));
    })();

    return () => {
      cancelled = true;
    };
  }, [mapW, mapH]);

  const [hover, setHover] = useState<HoverTip | null>(null);
  const [sortMode, setSortMode] = useState<'sites' | 'gpv'>('sites');

  const topLines = useMemo(() => {
    const rows = Object.keys(UNMON_BY_ISO).map((iso) => ({
      iso,
      n: UNMON_BY_ISO[iso] ?? 0,
      gpv: ONLINE_GPV_USD_BY_ISO[iso] ?? 0,
    }));
    rows.sort((a, b) =>
      sortMode === 'sites' ? b.n - a.n || b.gpv - a.gpv : b.gpv - a.gpv || b.n - a.n,
    );
    return rows.slice(0, 24);
  }, [sortMode]);

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: `linear-gradient(165deg, ${palette.bgElevated} 0%, ${palette.bg} 50%)`,
        padding: '44px 52px 36px',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          gap: 24,
          flexShrink: 0,
        }}
      >
        <h2
          style={{
            fontFamily: font.sans,
            fontSize: 48,
            fontWeight: 650,
            color: palette.text,
            margin: 0,
            minWidth: 0,
          }}
        >
          Unmonetized selling site world map
        </h2>
        <p
          style={{
            fontFamily: font.mono,
            fontSize: 22,
            color: palette.muted,
            margin: 0,
            flexShrink: 0,
          }}
        >
          Mar 2026 · n = {COHORT_TOTAL.toLocaleString()} · GPV{' '}
          {fmtUsdCompact.format(COHORT_ONLINE_GPV_USD_MAR2026)}
        </p>
      </div>

      <div
        style={{
          display: 'flex',
          gap: 28,
          alignItems: 'stretch',
          flex: 1,
          minHeight: 0,
          marginTop: 16,
        }}
      >
        <div
          style={{
            flex: '1 1 0',
            minWidth: 0,
            background: palette.surface,
            borderRadius: 14,
            border: `1px solid ${palette.stroke}`,
            boxShadow: palette.cardShadow,
            padding: 10,
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            minHeight: 0,
          }}
        >
          {loadErr && (
            <p style={{ color: '#dc2626', fontFamily: font.sans, fontSize: 28, padding: 24 }}>
              {loadErr}
            </p>
          )}
          {!paths && !loadErr && (
            <p style={{ color: palette.muted, fontFamily: font.sans, fontSize: 28, padding: 24 }}>
              Loading map…
            </p>
          )}
          {pathsPaintOrder && (
            <>
              <div
                style={{
                  flex: 1,
                  minHeight: 0,
                  width: '100%',
                  position: 'relative',
                }}
              >
                <svg
                  viewBox={`0 0 ${mapW} ${mapH}`}
                  preserveAspectRatio="xMidYMid meet"
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    width: '100%',
                    height: '100%',
                    display: 'block',
                    cursor: 'crosshair',
                  }}
                  role="img"
                  aria-label="World choropleth of unmonetized selling sites"
                  onMouseMove={(e) => {
                    const t = e.target as SVGPathElement & { dataset?: { iso?: string } };
                    const iso = t.dataset?.iso ?? t.getAttribute?.('data-iso');
                    if (!iso) return;
                    const n = UNMON_BY_ISO[iso] ?? 0;
                    const gpv = ONLINE_GPV_USD_BY_ISO[iso] ?? 0;
                    setHover({ iso, n, gpv, x: e.clientX, y: e.clientY });
                  }}
                  onMouseLeave={() => setHover(null)}
                >
                <title>Unmonetized selling sites by country, March 2026</title>
                <rect width={mapW} height={mapH} fill={palette.ocean} />
                {pathsPaintOrder.map(({ iso, d }) => {
                  const n = UNMON_BY_ISO[iso] ?? 0;
                  const fill =
                    n > 0 ? choroplethFill(n, vmin, vmax) : palette.empty;
                  const isHot = hover?.iso === iso;
                  return (
                    <path
                      key={iso}
                      data-iso={iso}
                      d={d}
                      fill={fill}
                      fillOpacity={isHot ? 0.92 : 1}
                      stroke={isHot ? palette.accent : palette.landStroke}
                      strokeWidth={isHot ? 2.4 : 1}
                      style={{
                        cursor: 'pointer',
                        transition: 'stroke 0.08s ease, stroke-width 0.08s ease',
                      }}
                    />
                  );
                })}
              </svg>
              </div>
              <MapLegendBar vmin={vmin} vmax={vmax} viewW={mapW} />
            </>
          )}
          {hover && (
            <div
              style={{
                position: 'fixed',
                left: hover.x + 18,
                top: hover.y + 18,
                zIndex: 1000,
                pointerEvents: 'none',
                background: palette.surface,
                border: `1px solid ${palette.stroke}`,
                borderRadius: 10,
                padding: '14px 18px',
                boxShadow: '0 12px 40px rgba(15, 23, 42, 0.15)',
                minWidth: 220,
                maxWidth: 420,
              }}
            >
              <p
                style={{
                  fontFamily: font.sans,
                  fontSize: 28,
                  color: palette.text,
                  margin: 0,
                  fontWeight: 650,
                  lineHeight: 1.2,
                  maxWidth: 380,
                }}
              >
                {countryNameFromIso(hover.iso)}{' '}
                <span style={{ color: palette.muted, fontWeight: 500 }}>({hover.iso})</span>
              </p>
              <p
                style={{
                  fontFamily: font.sans,
                  fontSize: 26,
                  color: palette.text,
                  margin: '12px 0 0',
                  fontWeight: 600,
                }}
              >
                {hover.n.toLocaleString()} sites ({Math.round((100 * hover.n) / COHORT_TOTAL)}%)
              </p>
              {hover.gpv > 0 && (
                <p
                  style={{
                    fontFamily: font.sans,
                    fontSize: 22,
                    color: palette.muted,
                    margin: '6px 0 0',
                    fontWeight: 500,
                  }}
                >
                  Mar '26 online GPV · {fmtUsdShort.format(hover.gpv)} (
                  {fmtPct(hover.gpv, COHORT_ONLINE_GPV_USD_MAR2026)})
                </p>
              )}
              <div
                style={{
                  marginTop: 14,
                  paddingTop: 12,
                  borderTop: `1px solid ${palette.stroke}`,
                }}
              >
                <p
                  style={{
                    fontFamily: font.mono,
                    fontSize: 18,
                    color: palette.accentMuted,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    margin: '0 0 8px',
                  }}
                >
                  Top Payment providers
                </p>
                {(() => {
                  const providers = topGpProvidersForCountry(hover.iso);
                  if (!providers?.length) {
                    return (
                      <p
                        style={{
                          fontFamily: font.sans,
                          fontSize: 22,
                          color: palette.muted,
                          margin: 0,
                          lineHeight: 1.35,
                        }}
                      >
                        No Mar ’26 GPV breakdown for this country (unmon slice).
                      </p>
                    );
                  }
                  return providers.map(([provider, pct]) => (
                    <p
                      key={`${hover.iso}-${provider}`}
                      style={{
                        fontFamily: font.mono,
                        fontSize: 22,
                        color: palette.text,
                        margin: '0 0 6px',
                        lineHeight: 1.25,
                        wordBreak: 'break-word',
                      }}
                    >
                      {provider}{' '}
                      <span style={{ color: palette.muted }}>·</span>{' '}
                      <span style={{ fontWeight: 650 }}>{pct}%</span>
                      <span style={{ color: palette.muted, fontWeight: 400 }}> sites</span>
                    </p>
                  ));
                })()}
                <p style={{ fontFamily: font.sans, fontSize: 18, color: palette.muted, margin: '10px 0 0', lineHeight: 1.35 }}>
                  gp_agg Mar 2026; % can exceed 100% summed across providers when merchants use several at checkout.
                </p>
              </div>
            </div>
          )}
        </div>

        <div
          style={{
            flex: '0 0 400px',
            width: 400,
            maxWidth: 400,
            minWidth: 0,
            background: palette.surface,
            borderRadius: 14,
            border: `1px solid ${palette.stroke}`,
            boxShadow: palette.cardShadow,
            padding: '18px 18px 20px',
            overflowY: 'auto',
            boxSizing: 'border-box',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 8,
              margin: '0 0 8px',
            }}
          >
            <p
              style={{
                fontFamily: font.mono,
                fontSize: 20,
                color: palette.accentMuted,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                margin: 0,
              }}
            >
              Top countries
            </p>
            <div
              role="group"
              aria-label="Sort top countries by"
              style={{
                display: 'inline-flex',
                border: `1px solid ${palette.stroke}`,
                borderRadius: 999,
                padding: 2,
                background: palette.surfaceInset,
              }}
            >
              {(['sites', 'gpv'] as const).map((mode) => {
                const active = sortMode === mode;
                return (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setSortMode(mode)}
                    aria-pressed={active}
                    style={{
                      fontFamily: font.mono,
                      fontSize: 14,
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                      padding: '4px 10px',
                      borderRadius: 999,
                      border: 'none',
                      background: active ? palette.accent : 'transparent',
                      color: active ? '#ffffff' : palette.muted,
                      fontWeight: active ? 650 : 500,
                      cursor: active ? 'default' : 'pointer',
                      lineHeight: 1.2,
                    }}
                  >
                    {mode === 'sites' ? 'Sites' : 'GPV'}
                  </button>
                );
              })}
            </div>
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'auto 1fr auto',
              columnGap: 14,
              alignItems: 'baseline',
              margin: '0 0 8px',
              fontFamily: font.mono,
              fontSize: 13,
              color: palette.muted,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              whiteSpace: 'nowrap',
            }}
          >
            <span>ISO</span>
            <span>Sites (%)</span>
            <span style={{ textAlign: 'right' }}>Mar '26 GPV (%)</span>
          </div>
          {topLines.map(({ iso, n, gpv }) => (
            <div
              key={iso}
              style={{
                display: 'grid',
                gridTemplateColumns: 'auto 1fr auto',
                columnGap: 14,
                alignItems: 'baseline',
                margin: '0 0 9px',
                fontFamily: font.mono,
                fontSize: 21,
                color: palette.text,
                lineHeight: 1.25,
                whiteSpace: 'nowrap',
              }}
            >
              <span style={{ fontWeight: 600 }}>{iso}</span>
              <span style={{ minWidth: 0 }}>
                {n.toLocaleString()}{' '}
                <span style={{ color: palette.muted }}>({fmtPct(n, COHORT_TOTAL)})</span>
              </span>
              <span style={{ fontWeight: 600, textAlign: 'right' }}>
                {fmtUsdCompact.format(gpv)}{' '}
                <span style={{ color: palette.muted, fontWeight: 500 }}>
                  ({fmtPct(gpv, COHORT_ONLINE_GPV_USD_MAR2026)})
                </span>
              </span>
            </div>
          ))}
          <p style={{ fontFamily: font.sans, fontSize: 20, color: palette.muted, marginTop: 20 }}>
            Sites % is share of cohort (n = {COHORT_TOTAL.toLocaleString()}); GPV % is share of
            cohort online GPV (Mar 2026 · {fmtUsdCompact.format(COHORT_ONLINE_GPV_USD_MAR2026)}).
            Toggle <em>Sites / GPV</em> to re-rank the top 24.
          </p>
        </div>
      </div>

      <p
        style={{
          fontFamily: font.sans,
          fontSize: 18,
          color: palette.muted,
          margin: '14px 0 0',
          lineHeight: 1.45,
          flexShrink: 0,
          maxWidth: '72rem',
        }}
      >
        <span style={{ marginRight: 6 }}>*</span>
        Map totals exclude unmon selling sites that had Mar ’26{' '}
        <code style={{ fontSize: '0.92em', color: palette.text }}>gpv_agg</code> volume on a monetized
        provider path (
        <code style={{ fontSize: '0.92em', color: palette.text }}>wixpay_%</code>,{' '}
        <code style={{ fontSize: '0.92em', color: palette.text }}>pinwheel</code>, optional{' '}
        <code style={{ fontSize: '0.92em', color: palette.text }}>stripe</code>/
        <code style={{ fontSize: '0.92em', color: palette.text }}>paypal</code>/
        <code style={{ fontSize: '0.92em', color: palette.text }}>square</code>
        ).
      </p>
    </div>
  );
};

export const meta: SlideMeta = {
  title: 'Unmon selling sites map · Mar 2026',
};

export default [Cover, Choropleth] satisfies Page[];
