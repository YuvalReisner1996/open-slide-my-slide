import type { CSSProperties, ReactNode } from 'react';
import type { Page, SlideMeta } from '@open-slide/core';

/** Exported thumbnails from the Google Slides deck (1600×900). */
import gs00 from './assets/google-slide-00.png';
import gs01 from './assets/google-slide-01.png';
import gs02 from './assets/google-slide-02.png';
import gs03 from './assets/google-slide-03.png';
import gs04 from './assets/google-slide-04.png';
import gs05 from './assets/google-slide-05.png';
import gs06 from './assets/google-slide-06.png';
import gs07 from './assets/google-slide-07.png';
import gs08 from './assets/google-slide-08.png';
import gs09 from './assets/google-slide-09.png';
import gs10 from './assets/google-slide-10.png';
import gs11 from './assets/google-slide-11.png';
import gs12 from './assets/google-slide-12.png';
import gs13 from './assets/google-slide-13.png';
/** Interactive world map (choropleth) — copied from transaction_fee. */
import mapInteractiveUrl from './assets/world-map-selling-sites.html?url';

/** ─── Design tokens ───────────────────────────────────────────────── */
const C = {
  bg: '#070b14',
  bgCard: '#0f1629',
  bgElevated: '#141d33',
  text: '#eef2ff',
  muted: '#8c9cb8',
  accent: '#f59e0b',
  accent2: '#38bdf8',
  accentMuted: 'rgba(245, 158, 11, 0.15)',
  line: 'rgba(148, 163, 184, 0.22)',
  rail: '#f59e0b',
};

const T = {
  hero: 118,
  h1: 76,
  h2: 52,
  h3: 34,
  body: 28,
  small: 22,
  caption: 18,
};

const PAD = { x: 128, y: 88 } as const;
const GAP = 28;
const RADIUS = 18;

const fill: CSSProperties = {
  width: '100%',
  height: '100%',
  fontFamily:
    'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
  boxSizing: 'border-box',
  position: 'relative',
};

/** Left accent rail + safe padding */
function Shell(props: {
  children: ReactNode;
  variant?: 'solid' | 'mesh';
  rail?: boolean;
}) {
  const bg =
    props.variant === 'mesh'
      ? `linear-gradient(165deg, ${C.bg} 0%, #10192e 40%, #0a0e18 100%)`
      : C.bg;
  return (
    <div style={{ ...fill, background: bg, overflow: 'hidden' }}>
      {props.rail !== false && (
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: 6,
            background: `linear-gradient(180deg, ${C.rail} 0%, ${C.accent2} 100%)`,
            opacity: 0.95,
          }}
        />
      )}
      <div style={{ position: 'relative', height: '100%', width: '100%' }}>
        {props.children}
      </div>
    </div>
  );
}

function Eyebrow(props: { children: ReactNode; color?: string }) {
  return (
    <div
      style={{
        fontSize: T.caption,
        letterSpacing: '0.28em',
        fontWeight: 700,
        color: props.color ?? C.accent,
        textTransform: 'uppercase',
        marginBottom: 14,
      }}
    >
      {props.children}
    </div>
  );
}

function DeckTitle(props: { children: ReactNode; subtitle?: string }) {
  return (
    <header style={{ marginBottom: GAP + 8 }}>
      <h2
        style={{
          fontSize: T.h1,
          fontWeight: 800,
          lineHeight: 1.08,
          margin: 0,
          color: C.text,
          letterSpacing: '-0.02em',
          maxWidth: 1680,
        }}
      >
        {props.children}
      </h2>
      {props.subtitle ? (
        <p
          style={{
            fontSize: T.body,
            color: C.muted,
            marginTop: 16,
            maxWidth: 1180,
            lineHeight: 1.5,
          }}
        >
          {props.subtitle}
        </p>
      ) : null}
    </header>
  );
}

/** Full-area slide picture from Google Slides + optional short caption in plain English. */
function SlideFigure(props: { src: string; caption?: ReactNode }) {
  return (
    <div
      style={{
        flex: 1,
        minHeight: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
      }}
    >
      <div
        style={{
          flex: 1,
          minHeight: 0,
          borderRadius: RADIUS,
          overflow: 'hidden',
          border: `1px solid ${C.line}`,
          background: '#050811',
        }}
      >
        <img
          src={props.src}
          alt=""
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            display: 'block',
          }}
        />
      </div>
      {props.caption ? (
        <p style={{ fontSize: T.caption, color: C.muted, margin: 0, lineHeight: 1.45 }}>
          {props.caption}
        </p>
      ) : null}
    </div>
  );
}

const jargonHint =
  'Terms in this deck: GPV, payment provider, transaction fee, Un-monetized, population, fee rate, premium plan, third party payment provider.';

/** ─── Pages ───────────────────────────────────────────────────────── */

const Cover: Page = () => (
  <Shell rail={false}>
    <div
      style={{
        ...fill,
        padding: `${PAD.y}px ${PAD.x}px`,
        display: 'flex',
        flexDirection: 'column',
        gap: 20,
        boxSizing: 'border-box',
      }}
    >
      <SlideFigure
        src={gs00}
        caption={`Cover slide from Google Slides. ${jargonHint}`}
      />
    </div>
  </Shell>
);

const Background: Page = () => (
  <Shell variant="mesh">
    <div
      style={{
        padding: `${PAD.y}px ${PAD.x}px`,
        height: '100%',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
      }}
    >
      <Eyebrow color={C.accent2}>Foundation</Eyebrow>
      <DeckTitle subtitle="Simple idea: we measure GPV, decide which population counts, then apply a fee rate by premium plan (see CONTEXT / SQL for detail).">
        Why these numbers line up
      </DeckTitle>
      <SlideFigure
        src={gs01}
        caption="Same foundation slide as Google Slides — fee base, cohort, and rates."
      />
    </div>
  </Shell>
);

const Shopify: Page = () => (
  <Shell>
    <div
      style={{
        padding: `${PAD.y}px ${PAD.x}px`,
        height: '100%',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
      }}
    >
      <Eyebrow color={C.accent2}>Competitor</Eyebrow>
      <DeckTitle subtitle="Shopify: plans, payment provider choice, and transaction fees — picture matches Google Slides.">
        Shopify snapshot
      </DeckTitle>
      <SlideFigure src={gs02} />
    </div>
  </Shell>
);

const Sqsp: Page = () => (
  <Shell>
    <div
      style={{
        padding: `${PAD.y}px ${PAD.x}px`,
        height: '100%',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
      }}
    >
      <Eyebrow color="#a78bfa">Competitor</Eyebrow>
      <DeckTitle subtitle="Squarespace: bundled pricing vs payment stack — same slide as Google.">
        Squarespace snapshot
      </DeckTitle>
      <SlideFigure src={gs03} />
    </div>
  </Shell>
);

const Woo: Page = () => (
  <Shell>
    <div
      style={{
        padding: `${PAD.y}px ${PAD.x}px`,
        height: '100%',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
      }}
    >
      <Eyebrow color="#34d399">Competitor</Eyebrow>
      <DeckTitle subtitle="WooCommerce: third party payment providers change the fee story — same slide as Google.">
        WooCommerce snapshot
      </DeckTitle>
      <SlideFigure src={gs04} />
    </div>
  </Shell>
);

const BigCommerce: Page = () => (
  <Shell>
    <div
      style={{
        padding: `${PAD.y}px ${PAD.x}px`,
        height: '100%',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
      }}
    >
      <Eyebrow color={C.accent}>Competitor</Eyebrow>
      <DeckTitle subtitle="BigCommerce: payment provider rules matter for transaction fees — same slide as Google.">
        BigCommerce snapshot
      </DeckTitle>
      <SlideFigure src={gs05} />
    </div>
  </Shell>
);

const BigCommercePenalty: Page = () => (
  <Shell>
    <div
      style={{
        padding: `${PAD.y}px ${PAD.x}px`,
        height: '100%',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
      }}
    >
      <Eyebrow>BigCommerce · policy</Eyebrow>
      <DeckTitle subtitle="Extra fee when merchants don’t use BigCommerce’s approved payment providers — compare to our Wix Payments bridge.">
        Penalty on non-approved processors
      </DeckTitle>
      <SlideFigure
        src={gs06}
        caption="Read with the jargon list: transaction fee, payment provider, premium plan."
      />
    </div>
  </Shell>
);

const SummarizedTable: Page = () => (
  <Shell variant="mesh">
    <div
      style={{
        padding: `${PAD.y}px ${PAD.x}px`,
        height: '100%',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
      }}
    >
      <Eyebrow color={C.accent2}>Benchmark summary</Eyebrow>
      <DeckTitle subtitle="One table to compare platforms — transaction fees, payment providers, and positioning (same graphic as Google Slides).">
        Summarized table
      </DeckTitle>
      <SlideFigure src={gs07} />
    </div>
  </Shell>
);

const SellingSites: Page = () => (
  <Shell>
    <div
      style={{
        padding: `${PAD.y}px ${PAD.x}px`,
        height: '100%',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
      }}
    >
      <Eyebrow>Platform scale</Eyebrow>
      <DeckTitle subtitle="Selling sites and online GPV — headline sizes from the Google slide (QA excluded in SQL per CONTEXT).">
        Selling sites · GPV scale
      </DeckTitle>
      <SlideFigure
        src={gs08}
        caption="GPV = gross payment volume (money flowing through checkout)."
      />
    </div>
  </Shell>
);

const PremiumBreakdown: Page = () => (
  <Shell variant="mesh">
    <div
      style={{
        padding: `${PAD.y}px ${PAD.x}px`,
        height: '100%',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
      }}
    >
      <Eyebrow>Cohort</Eyebrow>
      <DeckTitle subtitle="Un-monetized selling sites on a premium plan — population counts and shares (same chart as Google Slides).">
        Premium breakdown — Un-monetized path
      </DeckTitle>
      <SlideFigure
        src={gs09}
        caption="Un-monetized = selling volume without our native monetized collections path in scope (see CONTEXT)."
      />
    </div>
  </Shell>
);

const BridgeVisual: Page = () => (
  <Shell>
    <div
      style={{
        padding: `${PAD.y}px ${PAD.x}px`,
        height: '100%',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        gap: 18,
        overflow: 'hidden',
      }}
    >
      <Eyebrow>Bridge</Eyebrow>
      <DeckTitle subtitle="Part I = competitors & fees. Part II = our cohort & scenarios. Below: same bridge slide from Google, then a live world map you can scroll (selling-site choropleth).">
        From market context → our data
      </DeckTitle>
      <div style={{ flex: '0 0 38%', minHeight: 0 }}>
        <SlideFigure src={gs10} caption="Static snapshot from Google Slides (includes map visuals)." />
      </div>
      <div style={{ flex: '1 1 52%', minHeight: 220, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ fontSize: T.caption, color: C.accent2, fontWeight: 700 }}>
          Interactive map (same choropleth as transaction_fee analysis)
        </div>
        <iframe
          title="Selling sites world map"
          src={mapInteractiveUrl}
          style={{
            flex: 1,
            minHeight: 260,
            width: '100%',
            border: `1px solid ${C.line}`,
            borderRadius: RADIUS,
            background: C.bgCard,
          }}
        />
        <a
          href={mapInteractiveUrl}
          target="_blank"
          rel="noreferrer"
          style={{ fontSize: T.caption, color: C.accent }}
        >
          Open map full screen in a new tab
        </a>
      </div>
    </div>
  </Shell>
);

const UnmonYoY: Page = () => (
  <Shell variant="mesh">
    <div
      style={{
        padding: `${PAD.y}px ${PAD.x}px`,
        height: '100%',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
      }}
    >
      <Eyebrow>Trend</Eyebrow>
      <DeckTitle subtitle="Year-over-year change in Un-monetized GPV — chart matches Google Slides (detail tables live in transaction_fee HTML exports).">
        Un-monetized GPV grew YoY
      </DeckTitle>
      <SlideFigure src={gs11} />
    </div>
  </Shell>
);

const FeeLadder: Page = () => (
  <Shell>
    <div style={{ padding: `${PAD.y}px ${PAD.x}px ${PAD.y}px ${PAD.x + 14}px` }}>
      <Eyebrow>Pricing ladder</Eyebrow>
      <DeckTitle subtitle="Higher premium plan tier → lower illustrative transaction fee rate on the same GPV (Editor / Studio mapping in CONTEXT).">
        Fee rate follows premium plan
      </DeckTitle>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 1320 }}>
        {[
          ['2.0%', 'Editor: Core · Studio: Standard', 'Highest fee rate band in the model'],
          ['1.0%', 'Editor: Business · Studio: Plus', 'Middle band'],
          ['0.6%', 'Editor: Business Elite · Studio: Elite', 'Lowest fee rate band'],
        ].map(([pct, tier, tag]) => (
          <div
            key={pct}
            style={{
              display: 'grid',
              gridTemplateColumns: '160px 1fr auto',
              gap: 28,
              alignItems: 'center',
              padding: '22px 26px',
              borderRadius: RADIUS,
              background: C.bgCard,
              border: `1px solid ${C.line}`,
            }}
          >
            <div style={{ fontSize: 48, fontWeight: 900, color: C.accent }}>{pct}</div>
            <div style={{ fontSize: T.body, color: C.text }}>{tier}</div>
            <div style={{ fontSize: T.caption, color: C.muted }}>{tag}</div>
          </div>
        ))}
      </div>
      <p style={{ fontSize: T.small, color: C.muted, marginTop: 28, maxWidth: 1100 }}>
        Rough break-even GPV to justify a plan step-up for fee savings alone: Core→Business about{' '}
        <strong style={{ color: C.text }}>$1k/mo</strong>; Business→Elite about{' '}
        <strong style={{ color: C.text }}>$30k/mo</strong> (CONTEXT formulas).
      </p>
    </div>
  </Shell>
);

const SensitivityAnalysis: Page = () => (
  <Shell variant="mesh">
    <div
      style={{
        padding: `${PAD.y}px ${PAD.x}px`,
        height: '100%',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
      }}
    >
      <Eyebrow>Sensitivity</Eyebrow>
      <DeckTitle subtitle="How net dollars move when churn changes — full-year scenario check (same slide picture as Google; numbers also in CONTEXT SQL).">
        Full year potential — sensitivity
      </DeckTitle>
      <SlideFigure
        src={gs13}
        caption="Net payment collections style USD after fee, payments shift, list uplift, and churn losses — see CONTEXT for exact formulas."
      />
    </div>
  </Shell>
);

const FourOptions: Page = () => (
  <Shell>
    <div
      style={{
        padding: `${PAD.y}px ${PAD.x}px`,
        height: '100%',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
      }}
    >
      <Eyebrow>Merchant playbook</Eyebrow>
      <DeckTitle subtitle="Four paths merchants can take — churn, move to Wix Payments, upgrade premium plan, or stay and pay the fee on current plan (matches bridge SQL buckets).">
        How site owners can react
      </DeckTitle>
      <SlideFigure src={gs12} />
    </div>
  </Shell>
);

export const meta: SlideMeta = {
  title: 'Transaction Fee analysis — CY2025 story',
};

export default [
  Cover,
  Background,
  Shopify,
  Sqsp,
  Woo,
  BigCommerce,
  BigCommercePenalty,
  SummarizedTable,
  SellingSites,
  PremiumBreakdown,
  BridgeVisual,
  UnmonYoY,
  FeeLadder,
  SensitivityAnalysis,
  FourOptions,
] satisfies Page[];
