import type { CSSProperties, ReactNode } from 'react';
import type { Page, SlideMeta } from '@open-slide/core';

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

/** ─── Pages ───────────────────────────────────────────────────────── */

const Cover: Page = () => (
  <div
    style={{
      ...fill,
      background: `linear-gradient(135deg, #060912 0%, #121a30 50%, #0d1324 100%)`,
      color: C.text,
      display: 'grid',
      gridTemplateColumns: '1.15fr 1fr',
      gap: 0,
    }}
  >
    <div
      style={{
        padding: `${PAD.y + 24}px ${PAD.x}px`,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        paddingBottom: 100,
        borderRight: `1px solid ${C.line}`,
      }}
    >
      <Eyebrow>Wix eCommerce · Analysis</Eyebrow>
      <h1
        style={{
          fontSize: T.hero,
          fontWeight: 900,
          lineHeight: 1.02,
          margin: '0 0 32px',
          letterSpacing: '-0.03em',
        }}
      >
        Transaction Fee
        <br />
        <span style={{ color: C.accent }}>analysis</span>
      </h1>
      <p style={{ fontSize: 32, color: C.muted, lineHeight: 1.45, maxWidth: 920 }}>
        CY2025 unmon cohort · competitor benchmarks · selling-site economics ·
        scenario sensitivity
      </p>
      <div
        style={{
          display: 'flex',
          gap: 16,
          marginTop: 48,
          flexWrap: 'wrap',
        }}
      >
        {['Benchmark', 'Cohort sizing', 'Fee ladder', 'Scenarios'].map((tag) => (
          <span
            key={tag}
            style={{
              fontSize: T.small,
              padding: '10px 18px',
              borderRadius: 999,
              border: `1px solid ${C.line}`,
              color: C.muted,
              background: 'rgba(255,255,255,0.03)',
            }}
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
    <div
      style={{
        position: 'relative',
        padding: PAD.y,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'stretch',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 48,
          borderRadius: RADIUS + 4,
          background: `radial-gradient(ellipse 80% 60% at 70% 30%, ${C.accentMuted} 0%, transparent 55%)`,
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          marginLeft: 24,
          borderRadius: RADIUS,
          border: `1px solid ${C.line}`,
          background: C.bgCard,
          padding: '40px 36px',
          fontSize: T.small,
          color: C.muted,
          lineHeight: 1.55,
        }}
      >
        <div style={{ fontSize: T.caption, color: C.accent2, marginBottom: 12 }}>
          Story arc
        </div>
        <ol style={{ margin: 0, paddingLeft: 22, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <li>Market context & competitor fee posture</li>
          <li>Scale of selling sites & unmon cohort</li>
          <li>Plan-linked fee ladder & YoY volume</li>
          <li>Sensitivity + merchant reaction paths</li>
        </ol>
      </div>
    </div>
  </div>
);

const Background: Page = () => (
  <Shell variant="mesh">
    <div style={{ padding: `${PAD.y}px ${PAD.x}px ${PAD.y}px ${PAD.x + 14}px` }}>
      <Eyebrow color={C.accent2}>Foundation</Eyebrow>
      <DeckTitle subtitle="Definitions that gate every number in this deck — aligned with production ecom SQL & CONTEXT.md.">
        Why this work matters
      </DeckTitle>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: GAP,
          alignItems: 'stretch',
        }}
      >
        {[
          {
            k: 'Fee base',
            body: (
              <>
                <strong style={{ color: C.text }}>Unmon GPV</strong> rows (
                <code style={{ color: C.accent2 }}>collection_usd IS NULL</code>)
                — illustrative transaction-fee sizing on selling volume.
              </>
            ),
          },
          {
            k: 'Cohort',
            body: (
              <>
                <strong style={{ color: C.text }}>Business + active</strong> premium,
                selling sites, CY2025 scope —{' '}
                <strong style={{ color: C.text }}>QA excluded</strong> (prod
                anti-join).
              </>
            ),
          },
          {
            k: 'Rates',
            body: (
              <>
                Fee % from <strong style={{ color: C.text }}>plan tier → fee_rates</strong>;
                list ΔP from Editor ladder & break-even math in CONTEXT.
              </>
            ),
          },
        ].map((col, i) => (
          <div
            key={col.k}
            style={{
              background: C.bgElevated,
              borderRadius: RADIUS,
              padding: '28px 26px',
              border: `1px solid ${C.line}`,
              display: 'flex',
              flexDirection: 'column',
              gap: 14,
              minHeight: 260,
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                background: i === 1 ? C.accentMuted : 'rgba(56,189,248,0.12)',
                color: i === 1 ? C.accent : C.accent2,
                fontWeight: 900,
                fontSize: T.h3,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {i + 1}
            </div>
            <div style={{ fontSize: T.caption, color: C.accent, fontWeight: 700 }}>
              {col.k}
            </div>
            <div style={{ fontSize: T.body, color: C.muted, lineHeight: 1.55 }}>{col.body}</div>
          </div>
        ))}
      </div>
    </div>
  </Shell>
);

function CompetitorLayout(props: {
  label: string;
  title: string;
  accent: string;
  bullets: string[];
}) {
  return (
    <Shell>
      <div
        style={{
          padding: `${PAD.y}px ${PAD.x}px ${PAD.y}px ${PAD.x + 14}px`,
          display: 'grid',
          gridTemplateColumns: '340px 1fr',
          gap: 48,
          alignItems: 'start',
          height: '100%',
        }}
      >
        <div>
          <Eyebrow color={props.accent}>{props.label}</Eyebrow>
          <div
            style={{
              width: 120,
              height: 120,
              borderRadius: 28,
              background: `${props.accent}22`,
              border: `2px solid ${props.accent}55`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 52,
              fontWeight: 900,
              color: props.accent,
              marginTop: 8,
            }}
          >
            {props.title.slice(0, 1)}
          </div>
          <div
            style={{
              fontSize: T.h2,
              fontWeight: 800,
              marginTop: 28,
              lineHeight: 1.1,
              color: C.text,
            }}
          >
            {props.title}
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18, paddingTop: 36 }}>
          {props.bullets.map((b, i) => (
            <div
              key={i}
              style={{
                display: 'grid',
                gridTemplateColumns: '52px 1fr',
                gap: 18,
                alignItems: 'start',
              }}
            >
              <div
                style={{
                  height: 52,
                  width: 52,
                  borderRadius: '50%',
                  border: `2px solid ${C.line}`,
                  color: props.accent,
                  fontWeight: 800,
                  fontSize: T.small,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {i + 1}
              </div>
              <p style={{ margin: 0, fontSize: T.body, color: C.muted, lineHeight: 1.55 }}>{b}</p>
            </div>
          ))}
        </div>
      </div>
    </Shell>
  );
}

const Shopify: Page = () => (
  <CompetitorLayout
    label="Competitor lens"
    title="Shopify"
    accent={C.accent2}
    bullets={[
      'Commerce platforms pair subscriptions with payment / transaction fees — total cost of ownership is plan + PSP + GMV fee.',
      'Merchants benchmark headline subscription vs stack economics.',
      'Analog for how sellers trade off fee burden vs checkout choice.',
    ]}
  />
);

const Sqsp: Page = () => (
  <CompetitorLayout
    label="Competitor lens"
    title="Squarespace"
    accent="#a78bfa"
    bullets={[
      'Bundled site + commerce; pricing posture shapes migration narratives.',
      'Contrast with Wix Editor / Studio ladders and integrated Payments.',
      'Benchmark framing — verify live pricing before external quotes.',
    ]}
  />
);

const Woo: Page = () => (
  <CompetitorLayout
    label="Competitor lens"
    title="WooCommerce"
    accent="#34d399"
    bullets={[
      'Self-hosted + plugins + PSP choice → fragmented fee picture vs all-in-one.',
      'Shows why integrated Wix Payments / monetization path is a lever.',
      'Pairs with “volume shifts to native PSP” scenarios in our bridge.',
    ]}
  />
);

const BigCommerce: Page = () => (
  <CompetitorLayout
    label="Competitor lens"
    title="BigCommerce"
    accent={C.accent}
    bullets={[
      'Mid-market / SaaS commerce — explicit processor rules & penalties.',
      'Frames “approved rails” and compliance-style fee language.',
      'Next slide: concrete penalty used in this deck.',
    ]}
  />
);

const BigCommercePenalty: Page = () => (
  <Shell>
    <div style={{ padding: `${PAD.y}px ${PAD.x}px ${PAD.y}px ${PAD.x + 14}px` }}>
      <Eyebrow>BigCommerce · plan-pricing-updates</Eyebrow>
      <DeckTitle subtitle="How peers monetize alignment with preferred processors — mirrors strategic importance of Wix Payments shift in our model.">
        Processor rules & penalties
      </DeckTitle>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 36,
          alignItems: 'stretch',
        }}
      >
        <div
          style={{
            borderRadius: RADIUS,
            padding: '36px 32px',
            background: `linear-gradient(145deg, ${C.bgElevated} 0%, #1a243f 100%)`,
            border: `1px solid ${C.line}`,
          }}
        >
          <div style={{ fontSize: T.caption, color: C.accent, marginBottom: 12 }}>
            Observed policy
          </div>
          <div style={{ fontSize: 56, fontWeight: 900, color: C.text, lineHeight: 1.1 }}>
            2% penalty fee
          </div>
          <p style={{ fontSize: T.body, color: C.muted, marginTop: 20, lineHeight: 1.55 }}>
            For not using BigCommerce-approved processors — platforms monetize rails
            alignment, not subscription alone.
          </p>
        </div>
        <div
          style={{
            borderRadius: RADIUS,
            padding: '32px 28px',
            border: `1px dashed ${C.line}`,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: 16,
          }}
        >
          <div style={{ fontSize: T.caption, color: C.accent2 }}>Bridge to Wix model</div>
          <p style={{ fontSize: T.body, color: C.muted, margin: 0, lineHeight: 1.55 }}>
            Shifting NM unmon onto <strong style={{ color: C.text }}>Wix Payments</strong>{' '}
            drives collections & peels illustrative fee on that slice — parameterized as{' '}
            <code style={{ color: C.accent2 }}>p_monetize_nonchurn</code>.
          </p>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              fontSize: T.small,
              color: C.muted,
            }}
          >
            <span style={{ flex: 1, height: 2, background: C.line }} />
            <span>Scenario SQL</span>
            <span style={{ flex: 1, height: 2, background: C.line }} />
          </div>
        </div>
      </div>
    </div>
  </Shell>
);

const SummarizedTable: Page = () => (
  <Shell variant="mesh">
    <div style={{ padding: `${PAD.y}px ${PAD.x}px ${PAD.y}px ${PAD.x + 14}px` }}>
      <Eyebrow color={C.accent2}>Benchmark summary</Eyebrow>
      <DeckTitle subtitle="One glance across platforms — positioning vs fee / payments story.">
        Summarized table
      </DeckTitle>
      <div
        style={{
          borderRadius: RADIUS + 4,
          overflow: 'hidden',
          border: `1px solid ${C.line}`,
          background: C.bgCard,
        }}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: T.body - 2 }}>
          <thead>
            <tr style={{ background: 'rgba(245,158,11,0.08)' }}>
              {['Platform', 'Positioning', 'Fee / payments takeaway'].map((h) => (
                <th
                  key={h}
                  style={{
                    textAlign: 'left',
                    padding: '18px 22px',
                    color: C.accent,
                    fontSize: T.small,
                    fontWeight: 700,
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              ['Shopify', 'Bundled commerce + ecosystem', 'Plan + Shopify Payments vs gateways — TCO benchmark'],
              ['Squarespace', 'Design-led SMB commerce', 'Contrast ladder vs Wix Editor / Studio'],
              ['WooCommerce', 'Self-hosted + PSP mix', 'Fragmented fees → integrated PSP upside'],
              ['BigCommerce', 'B2B / mid-market SaaS', 'Approved processors + penalty framing'],
            ].map(([p, pos, fee], i) => (
              <tr
                key={p}
                style={{
                  borderTop: `1px solid ${C.line}`,
                  background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)',
                }}
              >
                <td style={{ padding: '18px 22px', fontWeight: 800, color: C.text }}>{p}</td>
                <td style={{ padding: '18px 22px', color: C.muted }}>{pos}</td>
                <td style={{ padding: '18px 22px', color: C.muted }}>{fee}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </Shell>
);

const SellingSites: Page = () => (
  <Shell>
    <div style={{ padding: `${PAD.y}px ${PAD.x}px ${PAD.y}px ${PAD.x + 14}px` }}>
      <Eyebrow>Platform scale</Eyebrow>
      <DeckTitle subtitle="Headline magnitudes from source deck — anchor for opportunity sizing.">
        Selling sites
      </DeckTitle>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: GAP,
        }}
      >
        {[
          { label: 'Online GPV', value: '$5.2B', hint: 'Platform reference scale' },
          { label: 'Segment spotlight', value: '$514M', hint: 'Per deck narrative' },
          { label: 'Activity magnitude', value: '236K', hint: 'Seller / volume proxy' },
        ].map((x) => (
          <div
            key={x.label}
            style={{
              borderRadius: RADIUS,
              padding: '32px 28px',
              background: C.bgElevated,
              border: `1px solid ${C.line}`,
              borderTop: `4px solid ${C.accent2}`,
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
              minHeight: 220,
            }}
          >
            <div style={{ fontSize: T.small, color: C.muted, fontWeight: 600 }}>{x.label}</div>
            <div style={{ fontSize: 72, fontWeight: 900, color: C.text, letterSpacing: '-0.02em' }}>
              {x.value}
            </div>
            <div style={{ fontSize: T.caption, color: C.muted, marginTop: 'auto' }}>{x.hint}</div>
          </div>
        ))}
      </div>
    </div>
  </Shell>
);

const PremiumBreakdown: Page = () => (
  <Shell variant="mesh">
    <div style={{ padding: `${PAD.y}px ${PAD.x}px ${PAD.y}px ${PAD.x + 14}px` }}>
      <Eyebrow>Cohort</Eyebrow>
      <DeckTitle subtitle="CY2025 unmon cohort · business + active premium · unmon GPV > 0 · QA excluded (CONTEXT / Trino).">
        Premium breakdown — unmonetized selling sites
      </DeckTitle>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: GAP,
          marginBottom: 36,
        }}
      >
        {[
          ['53,085', 'Sites in cohort'],
          ['2,864', 'One-step upgrade (fee economics)'],
          ['5.4%', 'Share of cohort'],
        ].map(([n, l]) => (
          <div
            key={l}
            style={{
              padding: '32px 26px',
              borderRadius: RADIUS,
              background: C.bgCard,
              border: `1px solid ${C.line}`,
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: 58, fontWeight: 900, color: C.accent }}>{n}</div>
            <div style={{ fontSize: T.small, color: C.muted, marginTop: 12 }}>{l}</div>
          </div>
        ))}
      </div>
      <div
        style={{
          display: 'flex',
          gap: 20,
          flexWrap: 'wrap',
          padding: '22px 26px',
          borderRadius: RADIUS,
          background: 'rgba(56,189,248,0.06)',
          border: `1px solid ${C.line}`,
        }}
      >
        <span style={{ fontSize: T.caption, color: C.accent2, fontWeight: 700 }}>Also in CONTEXT</span>
        <span style={{ fontSize: T.small, color: C.muted }}>
          Illustrative unmon fee @ current tier ~<strong style={{ color: C.text }}>$6.4M</strong> · list-Δ
          premium (annual pool) ~<strong style={{ color: C.text }}>$0.58M</strong>
        </span>
      </div>
    </div>
  </Shell>
);

const BridgeVisual: Page = () => (
  <Shell>
    <div
      style={{
        ...fill,
        display: 'grid',
        gridTemplateColumns: '1fr auto 1fr',
        alignItems: 'center',
        padding: `0 ${PAD.x}px`,
        gap: 40,
      }}
    >
      <div style={{ textAlign: 'right' }}>
        <div style={{ fontSize: T.caption, color: C.accent, marginBottom: 12 }}>Part I</div>
        <div style={{ fontSize: T.h2, fontWeight: 800, color: C.text }}>Market context</div>
        <div style={{ fontSize: T.body, color: C.muted, marginTop: 12 }}>
          Competitors & fee posture
        </div>
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <div
          style={{
            fontSize: T.h3,
            fontWeight: 900,
            color: C.accent2,
            padding: '16px 28px',
            borderRadius: 999,
            border: `2px solid ${C.accent2}`,
          }}
        >
          →
        </div>
      </div>
      <div style={{ textAlign: 'left' }}>
        <div style={{ fontSize: T.caption, color: C.accent2, marginBottom: 12 }}>Part II</div>
        <div style={{ fontSize: T.h2, fontWeight: 800, color: C.text }}>Our data</div>
        <div style={{ fontSize: T.body, color: C.muted, marginTop: 12 }}>
          Unmon cohort · ladder · sensitivity
        </div>
      </div>
    </div>
  </Shell>
);

const UnmonYoY: Page = () => (
  <Shell variant="mesh">
    <div
      style={{
        padding: `${PAD.y}px ${PAD.x}px ${PAD.y}px ${PAD.x + 14}px`,
        display: 'grid',
        gridTemplateColumns: 'minmax(380px, 0.85fr) 1fr',
        gap: 44,
        alignItems: 'start',
      }}
    >
      <div>
        <Eyebrow>Trend</Eyebrow>
        <DeckTitle subtitle="Unmon path growth → revenue-at-risk & upside from monetization / fee policy. Pair with transaction_fee/*.html charts for exact series.">
          Unmonetized GPV increased YoY
        </DeckTitle>
      </div>
      <div
        style={{
          marginTop: 52,
          height: 420,
          borderRadius: RADIUS,
          background: `linear-gradient(165deg, ${C.bgElevated} 0%, #162038 100%)`,
          border: `1px solid ${C.line}`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 32,
        }}
      >
        <div style={{ fontSize: T.caption, color: C.muted, marginBottom: 16 }}>Visual placeholder</div>
        <div style={{ fontSize: T.small, color: C.muted, textAlign: 'center', maxWidth: 420 }}>
          Drop exported chart here (PNG in <code style={{ color: C.accent2 }}>assets/</code>) or paste from
          Tableau / deck export
        </div>
        <div
          style={{
            marginTop: 28,
            width: '85%',
            height: 8,
            borderRadius: 4,
            background: `linear-gradient(90deg, ${C.accent}44 0%, ${C.accent2}44 100%)`,
          }}
        />
      </div>
    </div>
  </Shell>
);

const FeeLadder: Page = () => (
  <Shell>
    <div style={{ padding: `${PAD.y}px ${PAD.x}px ${PAD.y}px ${PAD.x + 14}px` }}>
      <Eyebrow>Pricing ladder</Eyebrow>
      <DeckTitle subtitle="Illustrative fee % by tier — txn_fee_cy2025 / CONTEXT Editor · Studio mapping.">
        Fee rate depends on premium plan
      </DeckTitle>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 1320 }}>
        {[
          ['2.0%', 'Editor: Core · Studio: Standard', 'Highest illustrative fee band'],
          ['1.0%', 'Editor: Business · Studio: Plus', 'Mid band'],
          ['0.6%', 'Editor: Business Elite · Studio: Elite', 'Lowest illustrative fee band'],
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
        Break-even GPV (fee economics): Core→Business ~<strong style={{ color: C.text }}>$1k/mo</strong>;
        Business→Elite ~<strong style={{ color: C.text }}>$30k/mo</strong> — CONTEXT formulas.
      </p>
    </div>
  </Shell>
);

const SensitivityAnalysis: Page = () => (
  <Shell variant="mesh">
    <div style={{ padding: `${PAD.y}px ${PAD.x}px ${PAD.y}px ${PAD.x + 14}px` }}>
      <Eyebrow>Sensitivity</Eyebrow>
      <DeckTitle subtitle="Bridge assumptions + payment/collections-style net by churn (CONTEXT snapshot).">
        Full year potential — scenario check
      </DeckTitle>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 36,
          alignItems: 'stretch',
        }}
      >
        <div
          style={{
            borderRadius: RADIUS,
            padding: '28px 26px',
            border: `1px solid ${C.line}`,
            background: C.bgCard,
          }}
        >
          <div style={{ fontSize: T.caption, color: C.accent2, marginBottom: 14 }}>
            Models (source deck)
          </div>
          <ul style={{ fontSize: T.body, color: C.muted, paddingLeft: 22, margin: 0, lineHeight: 1.55 }}>
            <li style={{ marginBottom: 14 }}>
              <strong style={{ color: C.text }}>New users only</strong> — premium → online sell.
            </li>
            <li>
              <strong style={{ color: C.text }}>All users</strong> — full cohort bridge (churn × monetize × upgrade).
            </li>
          </ul>
          <div
            style={{
              marginTop: 22,
              paddingTop: 18,
              borderTop: `1px solid ${C.line}`,
              fontSize: T.small,
              color: C.muted,
            }}
          >
            Defaults:{' '}
            <code style={{ color: C.accent2 }}>p_monetize_nonchurn = 0.15</code> · WP / churn yield{' '}
            <strong style={{ color: C.text }}>2.9%</strong>
          </div>
        </div>
        <div
          style={{
            borderRadius: RADIUS,
            padding: '28px 26px',
            border: `1px solid ${C.line}`,
            background: C.bgElevated,
          }}
        >
          <div style={{ fontSize: T.caption, color: C.accent, marginBottom: 14 }}>
            net_payment_collections_style_usd
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: T.body }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', padding: '12px 0', color: C.accent2 }}>Churn</th>
                <th style={{ textAlign: 'right', padding: '12px 0', color: C.accent2 }}>Net (USD)</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['1%', '5,882,217.66'],
                ['3%', '5,153,675.41'],
                ['5%', '4,425,133.17'],
              ].map(([c, v]) => (
                <tr key={c} style={{ borderTop: `1px solid ${C.line}` }}>
                  <td style={{ padding: '16px 0', color: C.text, fontWeight: 700 }}>{c}</td>
                  <td style={{ padding: '16px 0', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
                    {v}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p style={{ fontSize: T.caption, color: C.muted, marginTop: 16, lineHeight: 1.45 }}>
            Fee + WP shifted + list uplift − mon collections lost − premium churn lost · excludes retained
            baseline premium among survivors.
          </p>
        </div>
      </div>
    </div>
  </Shell>
);

const FourOptions: Page = () => (
  <Shell>
    <div style={{ padding: `${PAD.y - 8}px ${PAD.x}px ${PAD.y}px ${PAD.x + 14}px` }}>
      <Eyebrow>Merchant playbook</Eyebrow>
      <DeckTitle subtitle="Four mutually exclusive response paths in the scenario bridge — same structure as SQL buckets.">
        How site owners can react
      </DeckTitle>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 22,
        }}
      >
        {[
          {
            n: '01',
            t: 'Leave (churn)',
            m: 'Merchant exits or stops paying; cohort loses their volume.',
            w: 'Wix loses Premium + monetized GPV; mon-path collections at risk.',
            edge: C.accent,
          },
          {
            n: '02',
            t: 'Stay + Wix Payments',
            m: 'Part of NM unmon shifts onto WP (scenario share).',
            w: 'Illustrative fee off that slice; WP take on shifted GPV.',
            edge: C.accent2,
          },
          {
            n: '03',
            t: 'Stay + upgrade plan',
            m: 'One tier up → lower illustrative fee % on same unmon base.',
            w: 'Higher list ΔP; lower % fee on unmon.',
            edge: '#a78bfa',
          },
          {
            n: '04',
            t: 'Stay + pay on current plan',
            m: 'Keep tier; illustrative unmon fee at today’s rate.',
            w: 'Full illustrative unmon fee on this path.',
            edge: '#34d399',
          },
        ].map((x) => (
          <div
            key={x.n}
            style={{
              borderRadius: RADIUS,
              overflow: 'hidden',
              border: `1px solid ${C.line}`,
              background: C.bgCard,
              display: 'grid',
              gridTemplateColumns: '72px 1fr',
              minHeight: 200,
            }}
          >
            <div
              style={{
                background: `${x.edge}18`,
                color: x.edge,
                fontWeight: 900,
                fontSize: T.h3,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {x.n}
            </div>
            <div style={{ padding: '22px 24px', display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ fontSize: 30, fontWeight: 800, color: C.text }}>{x.t}</div>
              <div style={{ fontSize: T.small, color: C.muted, lineHeight: 1.45 }}>{x.m}</div>
              <div
                style={{
                  marginTop: 6,
                  paddingTop: 12,
                  borderTop: `1px solid ${C.line}`,
                  fontSize: T.small,
                  color: C.text,
                  lineHeight: 1.45,
                }}
              >
                <span style={{ color: C.accent2, fontWeight: 700 }}>Wix · </span>
                {x.w}
              </div>
            </div>
          </div>
        ))}
      </div>
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
