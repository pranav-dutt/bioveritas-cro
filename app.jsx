// ─────────────────────────────────────────────────────────────────────────────
// BioVeritas CRO — Tweaks island.
// The whole site lives as static HTML in index.html so it's directly editable.
// This script mounts ONLY the Tweaks panel and pushes color choices to :root
// CSS variables so the design recolors live across every section.
// ─────────────────────────────────────────────────────────────────────────────

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "palette": ["#0E2A47", "#2A8A8E", "#FFFFFF"],
  "headerStyle": "blur",
  "showFloaters": true,
  "density": "regular"
}/*EDITMODE-END*/;

// Curated palettes — each is [ink (navy/dark), accent, bg].
// All keep white-ish bg + dark ink + a single accent, consistent with the
// CRO brief (white, deep blue, navy, related shades).
const PALETTE_OPTIONS = [
  ["#0E2A47", "#2A8A8E", "#FFFFFF"], // logo navy + logo teal eye  (DEFAULT)
  ["#0B1E3F", "#2563A6", "#FFFFFF"], // classic deep blue
  ["#0A2540", "#3B82C4", "#FFFFFF"], // navy + cobalt
  ["#11324C", "#0F8A6A", "#FFFFFF"], // navy + emerald (biotech)
  ["#1B2E4A", "#7C5BD8", "#FFFFFF"], // navy + violet (pharma futurist)
  ["#102A4C", "#C2410C", "#FFFFFF"], // navy + warm clinical accent
];

function TweakBar() {
  const [t, setTweak] = window.useTweaks(TWEAK_DEFAULTS);

  // Apply CSS variables whenever palette changes.
  React.useEffect(() => {
    const root = document.documentElement;
    const [ink, accent, bg] = t.palette;
    root.style.setProperty('--ink', ink);
    root.style.setProperty('--accent', accent);
    root.style.setProperty('--bg', bg);

    // derive ink-soft as a mid step
    root.style.setProperty('--ink-soft', mix(ink, '#ffffff', 0.18));
    // derive soft surface
    root.style.setProperty('--soft', mix(bg, ink, 0.04));
    root.style.setProperty('--line', mix(bg, ink, 0.10));
  }, [t.palette]);

  React.useEffect(() => {
    const header = document.querySelector('.site-header');
    if (!header) return;
    if (t.headerStyle === 'solid') {
      header.style.background = 'var(--bg)';
      header.style.backdropFilter = 'none';
      header.style.WebkitBackdropFilter = 'none';
    } else if (t.headerStyle === 'transparent') {
      header.style.background = 'transparent';
      header.style.backdropFilter = 'none';
      header.style.WebkitBackdropFilter = 'none';
      header.style.borderBottomColor = 'transparent';
    } else {
      // blur (default)
      header.style.background = '';
      header.style.backdropFilter = '';
      header.style.WebkitBackdropFilter = '';
      header.style.borderBottomColor = '';
    }
  }, [t.headerStyle]);

  React.useEffect(() => {
    document.querySelectorAll('.hero-floater').forEach(el => {
      el.style.display = t.showFloaters ? '' : 'none';
    });
  }, [t.showFloaters]);

  React.useEffect(() => {
    const root = document.documentElement;
    const map = {
      compact:  { padX: '20px', sectionPad: '70px' },
      regular:  { padX: 'clamp(20px, 4vw, 56px)', sectionPad: 'clamp(80px, 9vw, 140px)' },
      spacious: { padX: 'clamp(28px, 5vw, 80px)', sectionPad: 'clamp(110px, 12vw, 180px)' },
    };
    const v = map[t.density] || map.regular;
    root.style.setProperty('--pad-x', v.padX);
    document.querySelectorAll('section').forEach(s => {
      if (s.classList.contains('compact')) return;
      s.style.paddingTop = v.sectionPad;
      s.style.paddingBottom = v.sectionPad;
    });
  }, [t.density]);

  return (
    <window.TweaksPanel title="Tweaks">
      <window.TweakSection label="Brand palette" />
      <window.TweakColor
        label="Theme"
        value={t.palette}
        options={PALETTE_OPTIONS}
        onChange={(v) => setTweak('palette', v)}
      />

      <window.TweakSection label="Header" />
      <window.TweakRadio
        label="Style"
        value={t.headerStyle}
        options={['blur', 'solid', 'transparent']}
        onChange={(v) => setTweak('headerStyle', v)}
      />

      <window.TweakSection label="Layout" />
      <window.TweakRadio
        label="Density"
        value={t.density}
        options={['compact', 'regular', 'spacious']}
        onChange={(v) => setTweak('density', v)}
      />
      <window.TweakToggle
        label="Hero badges"
        value={t.showFloaters}
        onChange={(v) => setTweak('showFloaters', v)}
      />
    </window.TweaksPanel>
  );
}

// ── tiny color helper ─────────────────────────────────────────────────────
function mix(a, b, t) {
  const ca = hex(a), cb = hex(b);
  const r = Math.round(ca[0] + (cb[0] - ca[0]) * t);
  const g = Math.round(ca[1] + (cb[1] - ca[1]) * t);
  const bl = Math.round(ca[2] + (cb[2] - ca[2]) * t);
  return `rgb(${r}, ${g}, ${bl})`;
}
function hex(s) {
  s = s.replace('#', '');
  if (s.length === 3) s = s.split('').map(c => c + c).join('');
  return [parseInt(s.slice(0, 2), 16), parseInt(s.slice(2, 4), 16), parseInt(s.slice(4, 6), 16)];
}

const root = ReactDOM.createRoot(document.getElementById('tweak-root'));
root.render(<TweakBar />);
