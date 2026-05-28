import EmergencyMap from '../components/EmergencyMap';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// const ROUTE_POINTS = [
//   [29.548, 75.270],
//   [29.545, 75.267],
//   [29.542, 75.264],
//   [29.539, 75.261],
//   [29.536, 75.258],
//   [29.533, 75.255],
// ];

const TIMELINE_EVENTS = [
  { icon: '📍', label: 'Location Acquired',     delay: 1200 },
  { icon: '🚑', label: 'Ambulance Assigned',    delay: 4000 },
  { icon: '🏥', label: 'Trauma Center Alerted', delay: 7000 },
  { icon: '👮', label: 'Police Notified',        delay: 10000 },
  { icon: '🛣️', label: 'Ambulance En Route',    delay: 13000 },
];

const TRIAGE_MAP = {
  bleeding: {
    match: ['bleeding', 'blood'],
    steps: [
      'Apply firm pressure to the wound — do not remove',
      'Keep the person still and lying down',
      'Do not give food or water',
      'Ambulance ETA priority upgraded',
    ],
  },
  head: {
    match: ['head', 'unconscious', 'faint'],
    steps: [
      'Do NOT move the neck or spine',
      'Keep airway open — tilt chin gently',
      'Monitor breathing every 30 seconds',
      'Trauma neurosurgery team alerted',
    ],
  },
  fire: {
    match: ['fire', 'burn', 'smoke'],
    steps: [
      'Move at least 30 meters from the vehicle',
      'Cool burns with clean running water — 10 minutes',
      'Do not apply cream, toothpaste, or ice',
      'Fire brigade dispatched alongside ambulance',
    ],
  },
  default: {
    steps: [
      'Keep the person calm and still',
      'Move them only if there is immediate danger',
      'Keep bystanders away from the scene',
      'Share your exact location with responders',
    ],
  },
};

function classifyTriage(text) {
  const t = text.toLowerCase();
  for (const [, cfg] of Object.entries(TRIAGE_MAP)) {
    if (cfg.match && cfg.match.some(k => t.includes(k))) return cfg;
  }
  return TRIAGE_MAP.default;
}

export default function SosPage() {
  const navigate = useNavigate();
  const [location, setLocation] = useState(null);
  const [services, setServices] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [routeIndex, setRouteIndex] = useState(0);
  //const [ambulanceLocation, setAmbulanceLocation] = useState(ROUTE_POINTS[0]);
  const [timeline, setTimeline] = useState([
  {
    icon: '🚨',
    label: 'SOS Activated',
    time: new Date().toLocaleTimeString(),
  },
]);
  const [goldenTime, setGoldenTime] = useState(60 * 60);

  const [incidentText, setIncidentText] = useState('');
  const [triageResult, setTriageResult] = useState(null);
  const [triageOpen, setTriageOpen] = useState(false);

  // ── SOS trigger ──────────────────────────────────────────────────────────
  useEffect(() => { triggerSOS(); }, []);

  const triggerSOS = () => {
    setLoading(true);
    setError('');
    if (!navigator.geolocation) {
      setError('Geolocation not supported by this browser.');
      setLoading(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setLocation(loc);
        localStorage.setItem('lastLocation', JSON.stringify(loc));
        localStorage.setItem('lastSOS', Date.now().toString());
        setTimeout(() => { setServices(getDummyServices()); setLoading(false); }, 900);
      },
      () => {
        setError('Location access denied. Please enable location services.');
        setLoading(false);
      }
    );
  };

  const getDummyServices = () => ({
    hospitals: [
      { id: 1, name: 'City General Hospital', distance: '2.3 km', eta: '5 mins', phone: '112' },
      { id: 2, name: 'Trauma Center',         distance: '3.1 km', eta: '7 mins', phone: '112' },
    ],
    ambulances: [
      { id: 1, name: 'Ambulance Unit #1', distance: '1.5 km', eta: '4 mins', phone: '108' },
      { id: 2, name: 'Ambulance Unit #2', distance: '2.8 km', eta: '6 mins', phone: '108' },
    ],
    police: [
      { id: 1, name: 'Downtown Police Station', distance: '1.2 km', eta: '3 mins', phone: '100' },
    ],
    towing: [
      { id: 1, name: 'Quick Tow Services', distance: '4.1 km', eta: '8 mins', phone: '9800-TOW' },
    ],
  });

  // ── Ambulance movement ────────────────────────────────────────────────────
  // useEffect(() => {
  //   const id = setInterval(() => {
  //     setRouteIndex(prev => {
  //       const next = prev < ROUTE_POINTS.length - 1 ? prev + 1 : prev;
  //       setAmbulanceLocation(ROUTE_POINTS[next]);
  //       return next;
  //     });
  //   }, 2000);
  //   return () => clearInterval(id);
  // }, []);

  // ── Timeline ──────────────────────────────────────────────────────────────
  useEffect(() => {
    TIMELINE_EVENTS.forEach(({ icon, label, delay }) => {
      setTimeout(() => setTimeline(prev => [
  ...prev,
  {
    icon,
    label,
    time: new Date().toLocaleTimeString(),
  },
]), delay);
    });
  }, []);

  // ── Golden Hour countdown ─────────────────────────────────────────────────
  useEffect(() => {
    const id = setInterval(() => setGoldenTime(t => (t > 0 ? t - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, []);

  const minutes = Math.floor(goldenTime / 60);
  const seconds = goldenTime % 60;
  const goldenPct = (goldenTime / 3600) * 100;

  const handleTriage = () => {
    if (!incidentText.trim()) return;
    setTriageResult(classifyTriage(incidentText));
  };

  // ── Loading ───────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div style={styles.loadScreen}>
        <div style={styles.loadCard}>
          <div style={styles.loadPulse}>🚨</div>
          <p style={styles.loadTitle}>Locating emergency services</p>
          <p style={styles.loadSub}>Fetching your GPS coordinates…</p>
          <div style={styles.dots}>
            {[0, 1, 2].map(i => (
              <span key={i} style={{ ...styles.dot, animationDelay: `${i * 0.2}s` }} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.loadScreen}>
        <div style={styles.loadCard}>
          <p style={{ fontSize: 40, marginBottom: 12 }}>⚠️</p>
          <p style={{ ...styles.loadTitle, color: '#ff4444' }}>{error}</p>
          <button onClick={triggerSOS} style={styles.retryBtn}>Retry</button>
        </div>
      </div>
    );
  }

  // ── Main dashboard ────────────────────────────────────────────────────────
  return (
    <div style={styles.page}>
      <style>{css}</style>

      {/* ── TOP STATUS BAR ────────────────────────────── */}
      <div style={styles.statusBar}>
        <div style={styles.statusLeft}>
          <button
            onClick={() => navigate('/')}
            style={styles.backBtn}
            title="Back to Home"
          >
            ← Back
          </button>
          <span style={styles.sosBadge}>SOS ACTIVE</span>
          <span style={styles.statusCoords}>
            {location ? `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}` : 'Locating…'}
          </span>
        </div>
        <div style={styles.goldenPill}>
          <span style={styles.goldenDot} />
          <span style={styles.goldenLabel}>Golden Hour</span>
          <span style={styles.goldenTime}>
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </span>
        </div>
      </div>

      {/* ── GOLDEN HOUR PROGRESS BAR ──────────────────── */}
      <div style={styles.progressTrack}>
        <div
          style={{
            ...styles.progressFill,
            width: `${goldenPct}%`,
            background: goldenPct > 50 ? '#22c55e' : goldenPct > 20 ? '#f59e0b' : '#ef4444',
          }}
        />
      </div>

      {/* ── MAIN GRID ─────────────────────────────────── */}
      <div style={styles.grid}>

        {/* LEFT COLUMN */}
        <div style={styles.leftCol}>

          {/* MAP */}
          {location && (
            <div style={styles.mapWrapper}>
              <EmergencyMap
                userLocation={[location.lat, location.lng]}
                ambulanceLocation={[
                  location.lat - 0.02,
                  location.lng - 0.02,
                ]}
              />
              <div style={styles.mapOverlayBadge}>
                <span style={styles.mapPulse} />
                Ambulance en route — ETA&nbsp;<strong>5 min</strong>
              </div>
              <button
  onClick={() =>
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${location.lat},${location.lng}&travelmode=driving`,
      '_blank'
    )
  }
  style={styles.mapNavBtn}
>
  🗺️ Open Navigation
</button>
            </div>
          )}

          {/* SERVICES GRID */}
          {services && (
            <div style={styles.servicesGrid}>
              <ServiceTile icon="🏥" label="Hospital" items={services.hospitals} accent="#22c55e" />
              <ServiceTile icon="🚑" label="Ambulance" items={services.ambulances} accent="#3b82f6" />
              <ServiceTile icon="👮" label="Police" items={services.police} accent="#8b5cf6" />
              <ServiceTile icon="🚛" label="Towing" items={services.towing} accent="#f59e0b" />
            </div>
          )}
        </div>

        {/* RIGHT COLUMN */}
        <div style={styles.rightCol}>

          {/* TIMELINE */}
          <div style={styles.panel}>
            <p style={styles.panelTitle}>Dispatch Timeline</p>
            <div style={styles.timelineList}>
              {timeline.map((e, i) => (
                <div key={i} style={styles.timelineRow} className="tl-row">
                  <div style={styles.timelineDot} />
                  <div style={styles.timelineConnector(i < timeline.length - 1)} />
                  <div style={styles.timelineContent}>
                    <span style={styles.timelineIcon}>{e.icon}</span>
                    <div>
                      <p style={styles.timelineLabel}>{e.label}</p>
                      <p style={styles.timelineTime}>{e.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* TRIAGE ASSISTANT */}
          <div style={styles.panel}>
            <button
              style={styles.triageToggle}
              onClick={() => setTriageOpen(o => !o)}
            >
              <span>🧠 Emergency Guidance</span>
              <span style={{ fontSize: 12, opacity: 0.6 }}>{triageOpen ? '▲ collapse' : '▼ expand'}</span>
            </button>

            {triageOpen && (
              <div style={styles.triageBody} className="triage-in">
                <textarea
                  value={incidentText}
                  onChange={e => setIncidentText(e.target.value)}
                  placeholder="Describe what happened — e.g. 'head injury, unconscious, bleeding from leg'…"
                  style={styles.triageInput}
                />
                <button
                  onClick={handleTriage}
                  disabled={!incidentText.trim()}
                  style={{
                    ...styles.triageBtn,
                    opacity: incidentText.trim() ? 1 : 0.4,
                    cursor: incidentText.trim() ? 'pointer' : 'default',
                  }}
                >
                  Analyze
                </button>

                {triageResult && (
                  <div style={styles.triageResult}>
                    {triageResult.steps.map((step, i) => (
                      <div key={i} style={styles.triageStep}>
                        <span style={styles.triageNum}>{i + 1}</span>
                        <p style={styles.triageText}>{step}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* OPEN NAVIGATION */}
          {location && (
            <button
onClick={() =>
  window.open(
    `https://www.google.com/maps/dir/?api=1&destination=${location.lat},${location.lng}&travelmode=driving`,
    '_blank'
  )
}              style={styles.navBtn}
            >
              🗺️ Open in Google Maps
            </button>
          )}

        </div>
      </div>
    </div>
  );
}

// ─── ServiceTile ────────────────────────────────────────────────────────────
function ServiceTile({ icon, label, items, accent }) {
  const [open, setOpen] = useState(false);
  const closest = items[0];
  return (
    <div style={{ ...styles.tile, borderColor: `${accent}33` }}>
      <div style={styles.tileHeader} onClick={() => setOpen(o => !o)}>
        <span style={styles.tileIcon}>{icon}</span>
        <div style={styles.tileMeta}>
          <p style={styles.tileLabel}>{label}</p>
          <p style={{ ...styles.tileEta, color: accent }}>{closest.eta} · {closest.distance}</p>
        </div>
        <a
          href={`tel:${closest.phone}`}
          onClick={e => e.stopPropagation()}
          style={{ ...styles.tileCallBtn, background: `${accent}22`, color: accent }}
        >
          Call
        </a>
      </div>
      {open && items.length > 1 && (
        <div style={styles.tileExpanded}>
          {items.slice(1).map(s => (
            <div key={s.id} style={styles.tileRow}>
              <span style={styles.tileRowName}>{s.name}</span>
              <span style={{ ...styles.tileRowEta, color: accent }}>{s.eta}</span>
              <a href={`tel:${s.phone}`} style={{ ...styles.tileCallBtn, background: `${accent}22`, color: accent }}>Call</a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Inline styles ───────────────────────────────────────────────────────────
const styles = {
  page: {
    minHeight: '100vh',
    background: '#080a0f',
    color: '#fff',
    fontFamily: "'DM Sans', sans-serif",
    paddingBottom: 80,
    paddingTop: 88,   // fixed status bar (44px) + progress bar (3px) + navbar (≈41px)
  },

  // Loading
  loadScreen: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#080a0f',
  },
  loadCard: {
    textAlign: 'center',
    padding: '48px 40px',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 24,
  },
  loadPulse: {
    fontSize: 56,
    animation: 'pulse 1.4s ease-in-out infinite',
    display: 'block',
    marginBottom: 20,
  },
  loadTitle: {
    fontSize: 20,
    fontWeight: 600,
    color: '#fff',
    marginBottom: 6,
  },
  loadSub: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.4)',
    marginBottom: 20,
  },
  dots: { display: 'flex', gap: 8, justifyContent: 'center' },
  dot: {
    width: 8, height: 8,
    borderRadius: '50%',
    background: '#ff1a1a',
    animation: 'bounce 0.9s ease-in-out infinite',
    display: 'inline-block',
  },
  retryBtn: {
    marginTop: 16,
    padding: '10px 28px',
    background: '#ff1a1a',
    color: '#fff',
    border: 'none',
    borderRadius: 12,
    fontWeight: 700,
    cursor: 'pointer',
    fontSize: 14,
  },

  // Status bar
  statusBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px 16px',
    background: 'rgba(8,10,15,0.96)',
    borderBottom: '1px solid rgba(255,26,26,0.2)',
    flexWrap: 'nowrap',
    gap: 10,
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
  },
  statusLeft: { display: 'flex', alignItems: 'center', gap: 10 },
  backBtn: {
    background: 'rgba(255,255,255,0.08)',
    border: '1px solid rgba(255,255,255,0.12)',
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    fontWeight: 600,
    padding: '5px 12px',
    borderRadius: 8,
    cursor: 'pointer',
    letterSpacing: '0.03em',
    fontFamily: "'DM Sans', sans-serif",
    transition: 'background 0.15s',
    flexShrink: 0,
  },
  sosBadge: {
    background: '#ff1a1a',
    color: '#fff',
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: '0.12em',
    padding: '4px 10px',
    borderRadius: 6,
    fontFamily: 'monospace',
  },
  statusCoords: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.4)',
    fontFamily: 'monospace',
  },
  goldenPill: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    background: 'rgba(234,179,8,0.1)',
    border: '1px solid rgba(234,179,8,0.25)',
    borderRadius: 20,
    padding: '6px 14px',
  },
  goldenDot: {
    width: 7, height: 7,
    borderRadius: '50%',
    background: '#eab308',
    animation: 'pulse 1.5s ease-in-out infinite',
    display: 'inline-block',
  },
  goldenLabel: { fontSize: 11, color: '#eab308', letterSpacing: '0.08em', fontWeight: 600 },
  goldenTime: { fontSize: 18, fontWeight: 700, color: '#fff', fontFamily: 'monospace', letterSpacing: '0.05em' },

  // Progress bar
  progressTrack: {
    height: 3,
    background: 'rgba(255,255,255,0.06)',
    width: '100%',
    position: 'fixed',
    top: 44,    // sits right below the status bar
    left: 0,
    right: 0,
    zIndex: 999,
  },
  progressFill: { height: '100%', transition: 'width 1s linear, background 2s ease' },

  // Grid
  grid: {
    display: 'grid',
    gridTemplateColumns: 'minmax(0,1.5fr) minmax(0,1fr)',
    gap: 16,
    padding: '20px 20px 0',
    maxWidth: 1200,
    margin: '0 auto',
  },
  leftCol: { display: 'flex', flexDirection: 'column', gap: 16 },
  rightCol: { display: 'flex', flexDirection: 'column', gap: 16 },

  // Map
  mapWrapper: {
    borderRadius: 16,
    overflow: 'hidden',
    border: '1px solid rgba(255,26,26,0.2)',
    position: 'relative',
    height: 400,          // fixed — never grows and pushes header off screen
    flexShrink: 0,
    boxShadow: '0 0 30px rgba(239,68,68,0.15)',
  },
  mapOverlayBadge: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    background: 'rgba(0,0,0,0.75)',
    backdropFilter: 'blur(8px)',
    border: '1px solid rgba(59,130,246,0.4)',
    color: '#fff',
    fontSize: 12,
    padding: '6px 12px',
    borderRadius: 20,
    display: 'flex',
    alignItems: 'center',
    gap: 7,
  },
  mapPulse: {
    width: 8, height: 8,
    background: '#3b82f6',
    borderRadius: '50%',
    animation: 'pulse 1.2s ease-in-out infinite',
    display: 'inline-block',
    flexShrink: 0,
  },

  // Services grid
  servicesGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 10,
  },
  tile: {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid',
    borderRadius: 14,
    overflow: 'hidden',
    cursor: 'pointer',
    transition: 'background 0.15s',
  },
  tileHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '12px 14px',
  },
  tileIcon: { fontSize: 22, flexShrink: 0 },
  tileMeta: { flex: 1, minWidth: 0 },
  tileLabel: { fontSize: 13, fontWeight: 600, color: '#fff', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
  tileEta: { fontSize: 11, margin: '2px 0 0', fontFamily: 'monospace', fontWeight: 600 },
  tileCallBtn: {
    fontSize: 11,
    fontWeight: 700,
    padding: '5px 10px',
    borderRadius: 8,
    border: 'none',
    cursor: 'pointer',
    textDecoration: 'none',
    whiteSpace: 'nowrap',
    letterSpacing: '0.04em',
  },
  tileExpanded: {
    borderTop: '1px solid rgba(255,255,255,0.06)',
    padding: '8px 14px 12px',
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  tileRow: { display: 'flex', alignItems: 'center', gap: 8 },
  tileRowName: { flex: 1, fontSize: 12, color: 'rgba(255,255,255,0.6)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  tileRowEta: { fontSize: 11, fontFamily: 'monospace', fontWeight: 600 },

  // Panel
  panel: {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: 16,
    overflow: 'hidden',
  },
  panelTitle: {
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    color: 'rgba(255,255,255,0.4)',
    margin: 0,
    padding: '14px 16px 10px',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
  },

  // Timeline
  timelineList: { padding: '12px 16px 16px', display: 'flex', flexDirection: 'column', gap: 0 },
  timelineRow: { display: 'flex', alignItems: 'flex-start', gap: 12, position: 'relative', paddingBottom: 14 },
  timelineDot: {
    width: 10, height: 10,
    borderRadius: '50%',
    background: '#ff1a1a',
    flexShrink: 0,
    marginTop: 4,
    boxShadow: '0 0 6px rgba(255,26,26,0.6)',
  },
  timelineConnector: (show) => ({
    position: 'absolute',
    left: 4, top: 14,
    width: 2, height: 'calc(100% - 4px)',
    background: 'rgba(255,26,26,0.2)',
    display: show ? 'block' : 'none',
  }),
  timelineContent: { display: 'flex', alignItems: 'flex-start', gap: 10, flex: 1 },
  timelineIcon: { fontSize: 16, lineHeight: 1.4 },
  timelineLabel: { fontSize: 13, fontWeight: 500, color: '#fff', margin: 0, lineHeight: 1.4 },
  timelineTime: { fontSize: 11, color: 'rgba(255,255,255,0.3)', margin: '2px 0 0', fontFamily: 'monospace' },

  // Triage
  triageToggle: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: 'none',
    border: 'none',
    color: '#fff',
    fontSize: 14,
    fontWeight: 600,
    padding: '14px 16px',
    cursor: 'pointer',
    textAlign: 'left',
  },
  triageBody: { padding: '0 16px 16px', display: 'flex', flexDirection: 'column', gap: 10 },
  triageInput: {
    width: '100%',
    minHeight: 90,
    padding: '10px 12px',
    background: 'rgba(0,0,0,0.3)',
    border: '1px solid rgba(255,26,26,0.2)',
    borderRadius: 10,
    color: '#fff',
    fontSize: 13,
    resize: 'vertical',
    fontFamily: "'DM Sans', sans-serif",
    lineHeight: 1.5,
    boxSizing: 'border-box',
  },
  triageBtn: {
    padding: '9px 20px',
    background: '#ff1a1a',
    border: 'none',
    borderRadius: 10,
    color: '#fff',
    fontWeight: 700,
    fontSize: 13,
    letterSpacing: '0.04em',
    alignSelf: 'flex-start',
  },
  triageResult: {
    background: 'rgba(0,0,0,0.25)',
    border: '1px solid rgba(255,26,26,0.15)',
    borderRadius: 10,
    padding: '12px 14px',
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    animation: 'fadeIn 0.3s ease',
  },
  triageStep: { display: 'flex', alignItems: 'flex-start', gap: 10 },
  triageNum: {
    minWidth: 22, height: 22,
    background: 'rgba(255,26,26,0.2)',
    color: '#ff6666',
    fontSize: 11,
    fontWeight: 700,
    borderRadius: 6,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginTop: 1,
  },
  triageText: { fontSize: 13, color: 'rgba(255,255,255,0.8)', margin: 0, lineHeight: 1.5 },

  // Nav button
  navBtn: {
    width: '100%',
    padding: '13px 20px',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 14,
    color: '#fff',
    fontWeight: 600,
    fontSize: 14,
    cursor: 'pointer',
    letterSpacing: '0.03em',
    transition: 'background 0.15s',
    fontFamily: "'DM Sans', sans-serif",
  },
  mapNavBtn: {
  position: 'absolute',
  bottom: 12,
  right: 12,
  background: 'rgba(255,255,255,0.08)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255,255,255,0.12)',
  color: '#fff',
  padding: '8px 14px',
  borderRadius: 12,
  fontSize: 12,
  fontWeight: 600,
  cursor: 'pointer',
},
};

// ─── Keyframes injected once ─────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');

  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.6; transform: scale(0.92); }
  }
  @keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-6px); }
  }
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(6px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes tl-in {
    from { opacity: 0; transform: translateX(-8px); }
    to { opacity: 1; transform: translateX(0); }
  }
  .tl-row { animation: tl-in 0.4s ease both; }
  .triage-in { animation: fadeIn 0.3s ease both; }

  @media (max-width: 768px) {
    .sos-grid { grid-template-columns: 1fr !important; }
    .sos-services { grid-template-columns: 1fr 1fr !important; }
  }
`;