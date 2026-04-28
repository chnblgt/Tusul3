import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
const MapComponent = dynamic(() => import("./Mapcomponent"), { ssr: false });

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const fonts = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,700;0,9..144,800;1,9..144,700&family=DM+Sans:wght@400;500;600;700&display=swap');
  .hb-display { font-family: 'Fraunces', serif; }
  .hb-sans    { font-family: 'DM Sans', sans-serif; }

  @keyframes hb-fadeUp {
    from { opacity: 0; transform: translateY(28px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .hb-a1 { animation: hb-fadeUp 0.6s cubic-bezier(0.22,1,0.36,1) both; }
  .hb-a2 { animation: hb-fadeUp 0.6s cubic-bezier(0.22,1,0.36,1) 0.1s both; }
  .hb-a3 { animation: hb-fadeUp 0.6s cubic-bezier(0.22,1,0.36,1) 0.2s both; }
  .hb-a4 { animation: hb-fadeUp 0.6s cubic-bezier(0.22,1,0.36,1) 0.3s both; }
  .hb-a5 { animation: hb-fadeUp 0.6s cubic-bezier(0.22,1,0.36,1) 0.4s both; }

  @keyframes hb-spin-slow { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
  @keyframes hb-spin-rev  { from{transform:rotate(0deg)} to{transform:rotate(-360deg)} }

  @keyframes hb-float {
    0%,100%{transform:translateY(0)} 50%{transform:translateY(-14px)}
  }
  @keyframes hb-float-alt {
    0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-11px) rotate(9deg)}
  }
  @keyframes hb-drift {
    0%,100%{transform:translate(0,0) rotate(0deg)}
    33%{transform:translate(8px,-11px) rotate(2deg)}
    66%{transform:translate(-6px,8px) rotate(-2deg)}
  }
  @keyframes hb-bounce-ball {
    0%,100%{ transform: translateY(0) rotate(0deg); }
    40%    { transform: translateY(-22px) rotate(180deg); }
    60%    { transform: translateY(-16px) rotate(240deg); }
  }
  @keyframes hb-aurora {
    0%  {transform:rotate(0deg)   scale(1);   opacity:.14}
    33% {transform:rotate(120deg) scale(1.08);opacity:.22}
    66% {transform:rotate(240deg) scale(.95); opacity:.1}
    100%{transform:rotate(360deg) scale(1);   opacity:.14}
  }
  @keyframes hb-count {
    from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)}
  }
  @keyframes hb-shimmer {
    0%{background-position:-400% center} 100%{background-position:400% center}
  }

  .hb-stat-num { animation: hb-count 0.5s 0.6s cubic-bezier(0.22,1,0.36,1) both; }

  .hb-cta-primary {
    font-family:'DM Sans',sans-serif; font-size:14px; font-weight:700;
    background:linear-gradient(135deg,#7c3aed,#4c1d95); color:#fff;
    padding:14px 28px; border-radius:9px; text-decoration:none; display:inline-block;
    transition:transform .15s,box-shadow .2s; letter-spacing:.01em;
    box-shadow:0 4px 20px rgba(124,58,237,.35);
  }
  .hb-cta-primary:hover { transform:translateY(-2px); box-shadow:0 8px 28px rgba(124,58,237,.45); }

  .hb-cta-secondary {
    font-family:'DM Sans',sans-serif; font-size:14px; font-weight:600;
    color:var(--text-primary); padding:14px 28px; border-radius:9px;
    border:1.5px solid var(--border-card); text-decoration:none; display:inline-block;
    transition:border-color .2s,color .2s,background .2s,transform .15s;
  }
  .hb-cta-secondary:hover { border-color:#7c3aed; color:#7c3aed; background:rgba(124,58,237,.06); transform:translateY(-1px); }

  .hb-feat-card {
    transition:transform .22s cubic-bezier(.34,1.56,.64,1),box-shadow .22s ease;
    text-decoration:none; display:block;
  }
  .hb-feat-card:hover { transform:translateY(-6px); box-shadow:var(--shadow-card-hover); }

  .hb-how-card {
    background:var(--bg-card); border:1.5px solid var(--border-subtle);
    border-radius:20px; padding:28px 24px;
    transition:transform .2s cubic-bezier(.34,1.56,.64,1),box-shadow .2s,background 0.3s,border-color 0.3s;
  }
  .hb-how-card:hover { transform:translateY(-4px); box-shadow:0 16px 40px rgba(124,58,237,.12); }

  .hb-stat-pill {
    background:var(--bg-card);
    border:1.5px solid var(--border-subtle);
    border-radius:16px; padding:18px 24px;
    transition:transform .2s,box-shadow .2s,background 0.3s;
  }
  .hb-stat-pill:hover { transform:translateY(-3px); box-shadow:0 12px 32px rgba(124,58,237,.12); }

  .hb-shimmer-badge {
    background:linear-gradient(90deg,#c4b5fd 0%,#7c3aed 40%,#c4b5fd 80%);
    background-size:300% auto;
    -webkit-background-clip:text; -webkit-text-fill-color:transparent;
    background-clip:text;
    animation:hb-shimmer 2.5s linear infinite;
  }

  .hb-geo-ring1 { animation:hb-spin-slow 55s linear infinite; transform-origin:50% 50%; }
  .hb-geo-ring2 { animation:hb-spin-rev  75s linear infinite; transform-origin:50% 50%; }
  .hb-geo-float { animation:hb-float 7s ease-in-out infinite; }
  .hb-geo-drift { animation:hb-drift 12s ease-in-out infinite; }

  /* Ball float classes */
  .hb-ball-1  { animation: hb-float      6s  ease-in-out infinite; }
  .hb-ball-2  { animation: hb-float-alt  8s  ease-in-out infinite 1s; }
  .hb-ball-3  { animation: hb-bounce-ball 5s ease-in-out infinite 0.5s; }
  .hb-ball-4  { animation: hb-float      9s  ease-in-out infinite 2s; }
  .hb-ball-5  { animation: hb-drift      11s ease-in-out infinite; }
  .hb-ball-6  { animation: hb-float-alt  7s  ease-in-out infinite 3s; }
  .hb-ball-7  { animation: hb-bounce-ball 6s ease-in-out infinite 1.5s; }
  .hb-ball-8  { animation: hb-float      10s ease-in-out infinite 0.8s; }
  .hb-ball-9  { animation: hb-drift      13s ease-in-out infinite 0.3s; }
  .hb-ball-10 { animation: hb-float-alt  9s  ease-in-out infinite 2.5s; }
  .hb-ball-11 { animation: hb-float      7s  ease-in-out infinite 1.2s; }
  .hb-ball-12 { animation: hb-bounce-ball 8s ease-in-out infinite 3.5s; }
`;

// ball1 = soccer, ball2 = volleyball, ball3 = basketball, ball4 = football/rugby
const Football   = ({ size = 72, opacity = 0.82 }) => (
  <img src="assets/ball1.png" width={size} height={size}
    style={{ opacity, display:"block", filter:"drop-shadow(0 4px 12px rgba(0,0,0,0.4))", objectFit:"contain" }}
    alt="soccer ball" />
);

const Volleyball = ({ size = 72, opacity = 0.82 }) => (
  <img src="assets/ball2.png" width={size} height={size}
    style={{ opacity, display:"block", filter:"drop-shadow(0 4px 12px rgba(0,0,80,0.4))", objectFit:"contain" }}
    alt="volleyball" />
);

const Basketball = ({ size = 72, opacity = 0.82 }) => (
  <img src="assets/ball3.png" width={size} height={size}
    style={{ opacity, display:"block", filter:"drop-shadow(0 8px 18px rgba(194,88,18,0.45))", objectFit:"contain" }}
    alt="basketball" />
);

const Rugby = ({ size = 72, opacity = 0.82 }) => (
  <img src="assets/ball4.png" width={size} height={size}
    style={{ opacity, display:"block", filter:"drop-shadow(0 8px 18px rgba(120,53,15,0.5))", objectFit:"contain" }}
    alt="football" />
);

const Tennis = ({ size = 72, opacity = 0.82 }) => (
  <img src="assets/ball1.png" width={size} height={size}
    style={{ opacity, display:"block", filter:"drop-shadow(0 8px 18px rgba(132,204,22,0.45))", objectFit:"contain" }}
    alt="soccer ball" />
);

const PAGE_BALLS = [
  { C: Basketball, size: 88,  op: 0.22, cls: "hb-ball-1",  top: "1%",   left: "2%" },
  { C: Volleyball, size: 64,  op: 0.20, cls: "hb-ball-2",  top: "2%",   left: "30%" },
  { C: Football,   size: 56,  op: 0.18, cls: "hb-ball-3",  top: "1%",   left: "55%" },
  { C: Tennis,     size: 48,  op: 0.16, cls: "hb-ball-4",  top: "3%",   right: "4%" },
  { C: Rugby,      size: 42,  op: 0.14, cls: "hb-ball-5",  top: "2%",   left: "78%" },

  { C: Volleyball, size: 52,  op: 0.18, cls: "hb-ball-6",  top: "14%",  left: "0%" },
  { C: Basketball, size: 38,  op: 0.14, cls: "hb-ball-7",  top: "12%",  left: "22%" },
  { C: Football,   size: 44,  op: 0.15, cls: "hb-ball-8",  top: "15%",  left: "46%" },
  { C: Tennis,     size: 60,  op: 0.17, cls: "hb-ball-9",  top: "13%",  left: "68%" },
  { C: Rugby,      size: 50,  op: 0.15, cls: "hb-ball-10", top: "16%",  right: "2%" },

  { C: Basketball, size: 72,  op: 0.20, cls: "hb-ball-11", top: "30%",  left: "1%" },
  { C: Volleyball, size: 40,  op: 0.14, cls: "hb-ball-1",  top: "28%",  left: "18%" },
  { C: Football,   size: 34,  op: 0.12, cls: "hb-ball-2",  top: "32%",  left: "38%" },
  { C: Tennis,     size: 56,  op: 0.16, cls: "hb-ball-3",  top: "29%",  left: "60%" },
  { C: Rugby,      size: 44,  op: 0.14, cls: "hb-ball-4",  top: "33%",  right: "0%" },

  { C: Football,   size: 66,  op: 0.19, cls: "hb-ball-5",  top: "47%",  left: "0%" },
  { C: Basketball, size: 46,  op: 0.15, cls: "hb-ball-6",  top: "45%",  left: "25%" },
  { C: Volleyball, size: 58,  op: 0.17, cls: "hb-ball-7",  top: "48%",  left: "50%" },
  { C: Tennis,     size: 36,  op: 0.12, cls: "hb-ball-8",  top: "46%",  left: "72%" },
  { C: Rugby,      size: 62,  op: 0.18, cls: "hb-ball-9",  top: "49%",  right: "1%" },

  { C: Basketball, size: 54,  op: 0.16, cls: "hb-ball-10", top: "62%",  left: "3%" },
  { C: Tennis,     size: 42,  op: 0.14, cls: "hb-ball-11", top: "63%",  left: "20%" },
  { C: Football,   size: 70,  op: 0.20, cls: "hb-ball-1",  top: "65%",  left: "44%" },
  { C: Volleyball, size: 48,  op: 0.15, cls: "hb-ball-2",  top: "61%",  left: "66%" },
  { C: Rugby,      size: 36,  op: 0.12, cls: "hb-ball-3",  top: "64%",  right: "2%" },

  { C: Volleyball, size: 80,  op: 0.20, cls: "hb-ball-4",  top: "78%",  left: "1%" },
  { C: Basketball, size: 44,  op: 0.14, cls: "hb-ball-5",  top: "79%",  left: "22%" },
  { C: Rugby,      size: 56,  op: 0.16, cls: "hb-ball-6",  top: "80%",  left: "45%" },
  { C: Tennis,     size: 68,  op: 0.18, cls: "hb-ball-7",  top: "77%",  left: "66%" },
  { C: Football,   size: 40,  op: 0.13, cls: "hb-ball-8",  top: "81%",  right: "1%" },

  { C: Basketball, size: 60,  op: 0.17, cls: "hb-ball-9",  top: "90%",  left: "10%" },
  { C: Volleyball, size: 36,  op: 0.12, cls: "hb-ball-10", top: "92%",  left: "35%" },
  { C: Football,   size: 52,  op: 0.15, cls: "hb-ball-11", top: "91%",  left: "58%" },
  { C: Tennis,     size: 44,  op: 0.13, cls: "hb-ball-1",  top: "93%",  right: "6%" },
];

function FloatingBalls() {
  return (
    <div style={{
      position: "fixed", inset: 0,
      pointerEvents: "none", zIndex: 0,
      overflow: "hidden",
    }}>
      {PAGE_BALLS.map(({ C, size, op, cls, top, left, right }, i) => (
        <div key={i} className={cls} style={{
          position: "absolute",
          top, left, right,
        }}>
          <C size={size} opacity={op}/>
        </div>
      ))}
    </div>
  );
}

const GeoBg = () => (
  <svg aria-hidden="true"
    style={{ position:"absolute", inset:0, width:"100%", height:"100%", pointerEvents:"none", overflow:"hidden" }}
    xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
    <defs>
      <pattern id="hb-hatch" width="38" height="38" patternUnits="userSpaceOnUse" patternTransform="rotate(32)">
        <line x1="0" y1="0" x2="0" y2="38" stroke="#7c3aed" strokeWidth="0.5" strokeOpacity="0.05"/>
      </pattern>
      <pattern id="hb-dots" width="24" height="24" patternUnits="userSpaceOnUse">
        <circle cx="1.5" cy="1.5" r="1.2" fill="#7c3aed" fillOpacity="0.05"/>
      </pattern>

      {/* Math & sport symbols scattered as a tile pattern */}
      <pattern id="hb-symbols" width="220" height="220" patternUnits="userSpaceOnUse">
        {/* ∑ sigma */}
        <text x="10" y="28" fontSize="22" fill="#7c3aed" fillOpacity="0.07" fontFamily="serif" fontWeight="700">∑</text>
        {/* π */}
        <text x="80" y="18" fontSize="18" fill="#a855f7" fillOpacity="0.07" fontFamily="serif" fontWeight="700">π</text>
        {/* ∞ infinity */}
        <text x="140" y="32" fontSize="20" fill="#7c3aed" fillOpacity="0.07" fontFamily="serif">∞</text>
        {/* △ triangle */}
        <text x="195" y="22" fontSize="16" fill="#c4b5fd" fillOpacity="0.08" fontFamily="serif">△</text>
        {/* √ root */}
        <text x="5" y="80" fontSize="20" fill="#6d28d9" fillOpacity="0.07" fontFamily="serif">√</text>
        {/* sport star */}
        <text x="55" y="75" fontSize="14" fill="#a78bfa" fillOpacity="0.08">★</text>
        {/* ÷ */}
        <text x="100" y="70" fontSize="22" fill="#7c3aed" fillOpacity="0.06" fontFamily="serif">÷</text>
        {/* θ theta */}
        <text x="155" y="78" fontSize="18" fill="#a855f7" fillOpacity="0.07" fontFamily="serif">θ</text>
        {/* ⊕ circle plus (team/club) */}
        <text x="195" y="75" fontSize="18" fill="#6d28d9" fillOpacity="0.07" fontFamily="serif">⊕</text>
        {/* α */}
        <text x="25" y="128" fontSize="17" fill="#7c3aed" fillOpacity="0.07" fontFamily="serif">α</text>
        {/* 42° angle */}
        <text x="72" y="120" fontSize="13" fill="#a78bfa" fillOpacity="0.07" fontFamily="serif">42°</text>
        {/* ≡ */}
        <text x="115" y="132" fontSize="20" fill="#7c3aed" fillOpacity="0.06" fontFamily="serif">≡</text>
        {/* β */}
        <text x="163" y="125" fontSize="17" fill="#a855f7" fillOpacity="0.07" fontFamily="serif">β</text>
        {/* sport whistle shape via circle */}
        <circle cx="205" cy="120" r="8" fill="none" stroke="#7c3aed" strokeWidth="1.2" strokeOpacity="0.07"/>
        {/* ∂ partial diff */}
        <text x="8" y="182" fontSize="19" fill="#6d28d9" fillOpacity="0.07" fontFamily="serif">∂</text>
        {/* ∫ integral */}
        <text x="55" y="190" fontSize="22" fill="#7c3aed" fillOpacity="0.06" fontFamily="serif">∫</text>
        {/* φ phi */}
        <text x="108" y="178" fontSize="17" fill="#a855f7" fillOpacity="0.07" fontFamily="serif">φ</text>
        {/* ≈ approx */}
        <text x="152" y="185" fontSize="18" fill="#7c3aed" fillOpacity="0.06" fontFamily="serif">≈</text>
        {/* ω omega */}
        <text x="195" y="180" fontSize="17" fill="#6d28d9" fillOpacity="0.07" fontFamily="serif">ω</text>
        {/* diamond shape */}
        <polygon points="35,205 42,215 35,225 28,215" fill="none" stroke="#a78bfa" strokeWidth="1" strokeOpacity="0.08"/>
        {/* × multiply */}
        <text x="80" y="216" fontSize="18" fill="#7c3aed" fillOpacity="0.07" fontFamily="serif">×</text>
        {/* Δ Delta */}
        <text x="130" y="212" fontSize="18" fill="#a855f7" fillOpacity="0.07" fontFamily="serif">Δ</text>
        {/* μ mu */}
        <text x="175" y="218" fontSize="16" fill="#6d28d9" fillOpacity="0.07" fontFamily="serif">μ</text>
      </pattern>

      <radialGradient id="hb-vignette" cx="50%" cy="50%" r="70%">
        <stop offset="0%"   stopColor="white" stopOpacity="0"/>
        <stop offset="100%" stopColor="white" stopOpacity="0.5"/>
      </radialGradient>
    </defs>

    <rect width="100%" height="100%" fill="url(#hb-hatch)"/>
    <rect width="100%" height="100%" fill="url(#hb-dots)" opacity="0.9"/>
    <rect width="100%" height="100%" fill="url(#hb-symbols)"/>
    {[320, 240, 160, 88].map((r, i) => (
      <circle key={r} cx="22%" cy="52%" r={r}
        fill="none"
        stroke={i % 2 === 0 ? "#7c3aed" : "#c4b5fd"}
        strokeWidth={i % 2 === 0 ? "1" : "0.7"}
        strokeOpacity={0.07 - i * 0.01}
        strokeDasharray={i % 2 === 0 ? "6 14" : "3 20"}
      />
    ))}
    {[280, 180, 100].map((r, i) => (
      <circle key={"r2"+r} cx="78%" cy="30%" r={r}
        fill="none"
        stroke="#a78bfa"
        strokeWidth="0.7"
        strokeOpacity={0.05 - i * 0.01}
        strokeDasharray="4 16"
      />
    ))}
    <ellipse cx="78%" cy="12%" rx="260" ry="160"
      fill="rgba(167,139,250,0.06)"
      style={{animation:"hb-aurora 18s ease-in-out infinite"}}
    />
    <ellipse cx="90%" cy="85%" rx="200" ry="130"
      fill="rgba(124,58,237,0.045)"
      style={{animation:"hb-aurora 22s 3s ease-in-out infinite reverse"}}
    />
    <ellipse cx="10%" cy="70%" rx="180" ry="120"
      fill="rgba(167,139,250,0.04)"
      style={{animation:"hb-aurora 26s 6s ease-in-out infinite"}}
    />
    <rect width="100%" height="100%" fill="url(#hb-vignette)"/>
  </svg>
);

function useCountUp(target, duration = 1200) {
  const [val, setVal] = useState(0);
  const started = useRef(false);
  useEffect(() => {
    if (!target || started.current) return;
    started.current = true;
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - t, 3);
      setVal(Math.round(ease * target));
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [target]);
  return val;
}

const HOW_STEPS = [
  {
    num:"01", title:"Create your account",
    desc:"Sign up in seconds — no fees, no paperwork. Just your name and email.",
    icon:<svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
    accent:"#7c3aed",
  },
  {
    num:"02", title:"Discover clubs",
    desc:"Browse by sport, art, tech and more. Find what excites you.",
    icon:<svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>,
    accent:"#ec4899",
  },
  {
    num:"03", title:"Join & connect",
    desc:"Join for free or pick a membership tier. Meet your people.",
    icon:<svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    accent:"#f97316",
  },
];

export default function Body() {
  const [loggedIn,      setLoggedIn]      = useState(false);
  const [clubCount,     setClubCount]     = useState(0);
  const [categoryCount, setCategoryCount] = useState(0);
  const [statsLoaded,   setStatsLoaded]   = useState(false);

  const animClubs = useCountUp(statsLoaded ? clubCount    : 0);
  const animCats  = useCountUp(statsLoaded ? categoryCount : 0);

  useEffect(() => {
    const user = localStorage.getItem("user");
    setLoggedIn(!!user);
    fetch(`${API}/clubs`).then(r => r.json()).catch(() => ({ success:false }))
      .then((clubsData) => {
        if (clubsData.success && clubsData.clubs) {
          const clubs = clubsData.clubs;
          setClubCount(clubs.length);
          const cats = new Set(clubs.map(c => c.category).filter(Boolean));
          setCategoryCount(cats.size);
        }
        setStatsLoaded(true);
      });
  }, []);

  const statItems = [
    { num: animCats  || categoryCount, label:"Club types",   suffix:"+" },
    { num: animClubs || clubCount,     label:"Active clubs",  suffix:""  },
  ];

  return (
    <main style={{ flex:1, background:"var(--bg-page)", transition:"background 0.3s", position:"relative" }}>
      <style>{fonts}</style>
      <FloatingBalls />
      <section style={{
        background:"var(--bg-hero)",
        borderBottom:"1px solid var(--border-subtle)",
        position:"relative", overflow:"hidden",
        transition:"background 0.3s",
        zIndex:1,
      }}>
        <GeoBg />
        <div style={{maxWidth:"1400px",margin:"0 auto",padding:"0 48px",position:"relative",zIndex:1}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"64px",alignItems:"center",padding:"72px 0 80px"}}>
            <div>
              <div className="hb-a1" style={{
                display:"inline-flex",alignItems:"center",gap:"8px",
                background:"var(--bg-card)",border:"1.5px solid rgba(124,58,237,.2)",
                padding:"5px 12px",borderRadius:"20px",marginBottom:"28px",
                boxShadow:"0 2px 12px rgba(124,58,237,.1)",
              }}>
                <div style={{width:"7px",height:"7px",background:"#9400D3",borderRadius:"50%",boxShadow:"0 0 0 3px rgba(65,15,96,.2)"}}/>
                <span className="hb-sans" style={{fontSize:"11px",fontWeight:700,color:"#7c3aed",letterSpacing:".06em",textTransform:"uppercase"}}>
                  Prepared by Nest team
                </span>
              </div>

              <h1 className="hb-display hb-a2" style={{
                fontSize:"clamp(2.8rem,5vw,4.4rem)",fontWeight:800,lineHeight:1.1,
                color:"var(--text-primary)",letterSpacing:"-0.04em",marginBottom:"24px",
                transition:"color 0.3s",
              }}>
                <span style={{fontStyle:"italic"}}>Түүхээ</span>{" "}
                <span style={{fontStyle:"italic"}}>эхлүүл,</span>
                <br/>
                <span style={{fontStyle:"italic",color:"#7c3aed"}}>тэмүүлэлдээ</span>
                <br/>
                <span style={{fontStyle:"italic"}}>нэгд.</span>
              </h1>

              <p className="hb-sans hb-a3" style={{fontSize:"15px",color:"var(--text-secondary)",lineHeight:1.75,maxWidth:"400px",marginBottom:"32px",transition:"color 0.3s"}}>
                Discover clubs, sports teams, and creative communities across Ulaanbaatar — all in one place.
              </p>

              <div className="hb-a4" style={{display:"flex",gap:"12px",flexWrap:"wrap",marginBottom:"36px"}}>
                <a href="/page1" className="hb-cta-primary">Browse Clubs →</a>
                {!loggedIn && <a href="/signup" className="hb-cta-secondary">Create Account</a>}
              </div>

              <div className="hb-a5" style={{
                display:"flex",gap:"0",
                paddingTop:"24px",borderTop:"1px solid var(--border-subtle)",
              }}>
                {statItems.map(({ num, label, suffix }, i) => (
                  <div key={label} style={{
                    flex:1, paddingRight: i < 2 ? "24px" : 0,
                    marginRight: i < 2 ? "24px" : 0,
                    borderRight: i < 2 ? "1px solid var(--border-subtle)" : "none",
                  }}>
                    <div className="hb-display hb-stat-num" style={{
                      fontSize:"26px",fontWeight:800,color:"var(--text-primary)",
                      letterSpacing:"-0.04em",lineHeight:1,transition:"color 0.3s",
                    }}>
                      {num > 0 ? `${num}${suffix}` : "—"}
                    </div>
                    <div className="hb-sans" style={{fontSize:"11px",color:"var(--text-muted)",fontWeight:600,textTransform:"uppercase",letterSpacing:".08em",marginTop:"4px",transition:"color 0.3s"}}>
                      {label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="hb-a3" style={{ position:"relative", padding:"36px" }}>
              <div className="hb-ball-1" style={{ position:"absolute", top:"-10px", right:"-10px", zIndex:0, pointerEvents:"none" }}>
                <Basketball size={80} opacity={0.75}/>
              </div>
              <div className="hb-ball-2" style={{ position:"absolute", top:"-8px", left:"-8px", zIndex:0, pointerEvents:"none" }}>
                <Volleyball size={76} opacity={0.72}/>
              </div>
              <div className="hb-ball-3" style={{ position:"absolute", top:"35%", right:"-18px", zIndex:0, pointerEvents:"none" }}>
                <Rugby size={58} opacity={0.6}/>
              </div>
              <div className="hb-ball-4" style={{ position:"absolute", top:"38%", left:"-16px", zIndex:0, pointerEvents:"none" }}>
                <Football size={54} opacity={0.58}/>
              </div>
              <div className="hb-ball-5" style={{ position:"absolute", bottom:"-6px", right:"18px", zIndex:0, pointerEvents:"none" }}>
                <Tennis size={52} opacity={0.55}/>
              </div>
              <div className="hb-ball-6" style={{ position:"absolute", bottom:"-4px", left:"16px", zIndex:0, pointerEvents:"none" }}>
                <Rugby size={48} opacity={0.5}/>
              </div>
              <div style={{
                position:"relative", zIndex:1,
                background:"var(--bg-card)",borderRadius:"22px",
                border:"1.5px solid var(--border-subtle)",
                overflow:"hidden",
                boxShadow:"var(--shadow-card)",
                transition:"background 0.3s, border-color 0.3s, box-shadow 0.3s",
              }}>
                <div style={{padding:"12px 16px",borderBottom:"1px solid var(--border-subtle)",display:"flex",alignItems:"center",justifyContent:"space-between",background:"var(--bg-input)",transition:"background 0.3s"}}>
                  <div style={{display:"flex",gap:"6px"}}>
                    {["#ff5f57","#febc2e","#28c840"].map(c => <div key={c} style={{width:"10px",height:"10px",borderRadius:"50%",background:c}}/>)}
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:"6px"}}>
                    <svg width="12" height="12" fill="none" stroke="#9879d4" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                    <span className="hb-sans" style={{fontSize:"11px",color:"var(--text-muted)",fontWeight:600,transition:"color 0.3s"}}>Ulaanbaatar, Mongolia</span>
                  </div>
                  <div style={{width:"40px"}}/>
                </div>
                <div style={{height:"300px",width:"100%",position:"relative",zIndex:0}}>
                  <MapComponent />
                </div>
                <div style={{padding:"10px 16px",borderTop:"1px solid var(--border-subtle)",display:"flex",alignItems:"center",justifyContent:"space-between",background:"var(--bg-input)",transition:"background 0.3s"}}>
                  <span className="hb-sans" style={{fontSize:"11px",color:"var(--text-muted)",fontWeight:500,transition:"color 0.3s"}}>Capital of Mongolia</span>
                  <div style={{display:"flex",alignItems:"center",gap:"6px"}}>
                    <div style={{width:"6px",height:"6px",background:"#22c55e",borderRadius:"50%",boxShadow:"0 0 0 3px rgba(34,197,94,.2)"}}/>
                    <span className="hb-sans" style={{fontSize:"11px",color:"#22c55e",fontWeight:700}}>Active</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
      <section style={{padding:"80px 0 60px",background:"var(--bg-section)",position:"relative",overflow:"hidden",transition:"background 0.3s",zIndex:1}}>
        <svg aria-hidden="true" style={{position:"absolute",inset:0,width:"100%",height:"100%",pointerEvents:"none"}}>
          <defs>
            <pattern id="hiw-grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#7c3aed" strokeWidth="0.4" strokeOpacity="0.04"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hiw-grid)"/>
        </svg>

        <div style={{maxWidth:"1400px",margin:"0 auto",padding:"0 48px",position:"relative",zIndex:1}}>
          <div style={{marginBottom:"40px",textAlign:"center"}}>
            <p className="hb-sans" style={{fontSize:"10.5px",fontWeight:700,color:"var(--text-muted)",letterSpacing:".12em",textTransform:"uppercase",margin:"0 0 8px",transition:"color 0.3s"}}>Simple & free</p>
            <h2 className="hb-display" style={{fontSize:"clamp(2rem,3.8vw,3rem)",fontWeight:800,color:"var(--text-primary)",letterSpacing:"-0.04em",margin:"0 auto 10px",maxWidth:"600px",transition:"color 0.3s"}}>How it works</h2>
            <p className="hb-sans" style={{fontSize:"14px",color:"var(--text-secondary)",lineHeight:1.7,maxWidth:"400px",margin:"0 auto",transition:"color 0.3s"}}>Getting started takes less than a minute.</p>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"20px"}}>
            {HOW_STEPS.filter((_, i) => !(loggedIn && i === 0)).map((step, i) => (
              <div key={i} className="hb-how-card">
                <div style={{width:"46px",height:"46px",borderRadius:"12px",background:`${step.accent}18`,border:`1.5px solid ${step.accent}30`,display:"flex",alignItems:"center",justifyContent:"center",color:step.accent,marginBottom:"20px"}}>{step.icon}</div>
                <div className="hb-sans" style={{fontSize:"10px",fontWeight:700,color:"#c4b5fd",letterSpacing:".12em",marginBottom:"8px"}}>{step.num}</div>
                <h3 className="hb-display" style={{fontSize:"20px",fontWeight:800,color:"var(--text-primary)",letterSpacing:"-0.02em",margin:"0 0 8px",lineHeight:1.25,transition:"color 0.3s"}}>{step.title}</h3>
                <p className="hb-sans" style={{fontSize:"13px",color:"var(--text-secondary)",lineHeight:1.65,margin:0,transition:"color 0.3s"}}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section style={{padding:"40px 0 80px",background:"var(--bg-section)",transition:"background 0.3s",zIndex:1,position:"relative"}}>
        <div style={{maxWidth:"1400px",margin:"0 auto",padding:"0 48px"}}>
          <div style={{display:"flex",alignItems:"baseline",justifyContent:"space-between",marginBottom:"32px"}}>
            <div>
              <p className="hb-sans" style={{fontSize:"10.5px",fontWeight:700,color:"var(--text-muted)",letterSpacing:".12em",textTransform:"uppercase",margin:"0 0 6px",transition:"color 0.3s"}}>Explore</p>
              <h2 className="hb-display" style={{fontSize:"26px",fontWeight:800,color:"var(--text-primary)",letterSpacing:"-0.03em",margin:0,transition:"color 0.3s"}}>Featured</h2>
            </div>
            <a href="/page1" className="hb-sans" style={{fontSize:"13.5px",fontWeight:600,color:"#7c3aed",textDecoration:"none"}}
              onMouseEnter={e=>e.target.style.textDecoration="underline"} onMouseLeave={e=>e.target.style.textDecoration="none"}>
              View all →
            </a>
          </div>

          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"20px"}}>
            <a href="/page1" className="hb-feat-card" style={{background:"linear-gradient(145deg,#1a0533 0%,#2d0a57 60%,#3b0764 100%)",borderRadius:"20px",padding:"28px 24px",border:"1px solid rgba(167,139,250,.15)",display:"flex",flexDirection:"column",justifyContent:"space-between",textDecoration:"none"}}>
              <div>
                <div style={{width:"44px",height:"44px",background:"rgba(124,58,237,.3)",border:"1px solid rgba(167,139,250,.2)",borderRadius:"12px",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:"16px"}}>
                  <svg width="20" height="20" fill="none" stroke="#c4b5fd" strokeWidth="1.8" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
                </div>
                <h3 className="hb-display" style={{fontSize:"21px",fontWeight:800,color:"#fff",marginBottom:"7px",letterSpacing:"-0.02em",lineHeight:1.25}}>Browse All Categories</h3>
                <p className="hb-sans" style={{fontSize:"12.5px",color:"#a78bfa",lineHeight:1.6,margin:0}}>From football to photography, find clubs that match your passion.</p>
              </div>
              <div style={{marginTop:"16px"}}>
                <span className="hb-sans hb-shimmer-badge" style={{fontSize:"11px",fontWeight:700}}>
                  {categoryCount > 0 ? `${categoryCount} categories →` : "Explore →"}
                </span>
              </div>
            </a>
            <a href="/page1?cat=sports" className="hb-feat-card" style={{background:"var(--bg-card)",borderRadius:"20px",padding:"28px 24px",border:"1.5px solid var(--border-card)",display:"flex",flexDirection:"column",justifyContent:"space-between",textDecoration:"none",transition:"background 0.3s"}}>
              <div>
                <div style={{width:"44px",height:"44px",background:"rgba(22,163,74,0.12)",border:"1.5px solid rgba(22,163,74,.2)",borderRadius:"12px",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:"16px"}}>
                  <svg width="20" height="20" fill="none" stroke="#16a34a" strokeWidth="1.8" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/><path d="M2 12h20"/></svg>
                </div>
                <h3 className="hb-display" style={{fontSize:"20px",fontWeight:800,color:"var(--text-primary)",marginBottom:"7px",letterSpacing:"-0.02em",lineHeight:1.25,transition:"color 0.3s"}}>Sports Clubs</h3>
                <p className="hb-sans" style={{fontSize:"12.5px",color:"var(--text-secondary)",lineHeight:1.6,margin:0,transition:"color 0.3s"}}>Football, basketball, volleyball teams open for new members.</p>
              </div>
              <div style={{marginTop:"16px"}}><span className="hb-sans" style={{fontSize:"11px",color:"#16a34a",fontWeight:700}}>Explore →</span></div>
            </a>
            <a href="/events" className="hb-feat-card" style={{background:"var(--bg-card)",borderRadius:"20px",padding:"28px 24px",border:"1.5px solid var(--border-card)",display:"flex",flexDirection:"column",justifyContent:"space-between",textDecoration:"none",transition:"background 0.3s"}}>
              <div>
                <div style={{width:"44px",height:"44px",background:"rgba(217,119,6,0.12)",border:"1.5px solid rgba(217,119,6,.2)",borderRadius:"12px",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:"16px"}}>
                  <svg width="20" height="20" fill="none" stroke="#d97706" strokeWidth="1.8" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                </div>
                <h3 className="hb-display" style={{fontSize:"20px",fontWeight:800,color:"var(--text-primary)",marginBottom:"7px",letterSpacing:"-0.02em",lineHeight:1.25,transition:"color 0.3s"}}>Upcoming Events</h3>
                <p className="hb-sans" style={{fontSize:"12.5px",color:"var(--text-secondary)",lineHeight:1.6,margin:0,transition:"color 0.3s"}}>Tryouts, meetups, and open sessions happening soon.</p>
              </div>
              <div style={{marginTop:"16px"}}>
                <span className="hb-sans" style={{fontSize:"10px",fontWeight:700,letterSpacing:".1em",textTransform:"uppercase",padding:"3px 9px",borderRadius:"5px",color:"#d97706",background:"rgba(217,119,6,0.1)",border:"1px solid rgba(217,119,6,.2)"}}>Coming soon</span>
              </div>
            </a>
          </div>
        </div>
      </section>
      <section style={{padding:"0 0 80px",background:"var(--bg-section)",transition:"background 0.3s",zIndex:1,position:"relative"}}>
        <div style={{maxWidth:"1400px",margin:"0 auto",padding:"0 48px"}}>
          <div style={{
            background:"linear-gradient(135deg,#1a0533 0%,#2d0a57 50%,#3b0764 100%)",
            borderRadius:"20px",padding:"56px 48px",
            display:"flex",alignItems:"center",justifyContent:"space-between",
            gap:"40px",flexWrap:"wrap",position:"relative",overflow:"hidden",
          }}>
            <svg aria-hidden="true" style={{position:"absolute",inset:0,width:"100%",height:"100%",pointerEvents:"none",opacity:.3}}>
              <defs>
                <pattern id="cta-hatch" width="28" height="28" patternUnits="userSpaceOnUse" patternTransform="rotate(40)">
                  <line x1="0" y1="0" x2="0" y2="28" stroke="#a78bfa" strokeWidth="0.5" strokeOpacity="0.2"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#cta-hatch)"/>
            </svg>
            <div style={{position:"absolute",top:"-80px",right:"-80px",width:"300px",height:"300px",borderRadius:"50%",background:"rgba(124,58,237,.12)",pointerEvents:"none"}}/>

            <div style={{position:"relative",zIndex:1}}>
              <p className="hb-sans" style={{fontSize:"10.5px",fontWeight:700,color:"#a78bfa",letterSpacing:".12em",textTransform:"uppercase",marginBottom:"10px"}}>Run a club?</p>
              <h2 className="hb-display" style={{fontSize:"clamp(2rem,3.5vw,2.8rem)",fontWeight:800,color:"#fff",letterSpacing:"-0.04em",margin:"0 0 10px",lineHeight:1.2}}>
                Get your club listed on Duguilan.mn
              </h2>
              <p className="hb-sans" style={{fontSize:"14px",color:"#a78bfa",margin:0,lineHeight:1.65,maxWidth:"450px"}}>
                Reach hundreds of students looking for clubs just like yours. It's completely free to register.
              </p>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:"10px",position:"relative",zIndex:1,flexShrink:0}}>
              <a href="/club-register" className="hb-sans" style={{background:"#fff",color:"#1a0533",padding:"14px 32px",borderRadius:"10px",fontWeight:700,fontSize:"14px",textDecoration:"none",transition:"background .2s"}}
                onMouseEnter={e=>e.currentTarget.style.background="#f5f0ff"} onMouseLeave={e=>e.currentTarget.style.background="#fff"}>
                Register your club →
              </a>
              <a href="/page1" className="hb-sans" style={{color:"#a78bfa",fontSize:"13px",fontWeight:600,textDecoration:"none",textAlign:"center"}}
                onMouseEnter={e=>e.target.style.color="#fff"} onMouseLeave={e=>e.target.style.color="#a78bfa"}>
                Or browse clubs first
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}