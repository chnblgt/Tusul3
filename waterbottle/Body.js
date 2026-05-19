import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useTranslation } from "./useTranslation";
const MapComponent = dynamic(() => import("./Mapcomponent"), { ssr: false });

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const FONT = `@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&display=swap');`;

const G = `
  ${FONT}

  @keyframes bd-up {
    from { opacity: 0; transform: translateY(22px); }
    to   { opacity: 1; transform: none; }
  }
  .bd-a1 { animation: bd-up 0.7s cubic-bezier(0.16,1,0.3,1) both; }
  .bd-a2 { animation: bd-up 0.7s cubic-bezier(0.16,1,0.3,1) 0.1s both; }
  .bd-a3 { animation: bd-up 0.7s cubic-bezier(0.16,1,0.3,1) 0.22s both; }
  .bd-a4 { animation: bd-up 0.7s cubic-bezier(0.16,1,0.3,1) 0.34s both; }
  .bd-a5 { animation: bd-up 0.7s cubic-bezier(0.16,1,0.3,1) 0.46s both; }

  .bd-cta-fill {
    display: inline-flex; align-items: center; gap: 8px;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px; font-weight: 600;
    text-decoration: none;
    padding: 13px 28px;
    border-radius: 10px;
    background: var(--accent);
    color: var(--text-on-accent);
    transition: all 0.22s;
    letter-spacing: 0.01em;
  }
  .bd-cta-fill:hover { opacity: 0.88; transform: translateY(-2px); box-shadow: 0 8px 24px var(--accent-glow); }

  .bd-cta-ghost {
    display: inline-flex; align-items: center; gap: 8px;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px; font-weight: 500;
    text-decoration: none;
    padding: 13px 28px;
    border-radius: 10px;
    border: 1px solid var(--border-card);
    color: var(--text-secondary);
    transition: all 0.22s;
  }
  .bd-cta-ghost:hover { color: var(--text-primary); border-color: var(--border-subtle); background: var(--bg-input); }

  .bd-feat-card {
    background: var(--bg-card);
    border: 1px solid var(--border-card);
    border-radius: 16px;
    padding: 28px;
    text-decoration: none;
    display: flex; flex-direction: column;
    transition: transform 0.22s cubic-bezier(0.34,1.4,0.64,1), box-shadow 0.22s, border-color 0.2s;
  }
  .bd-feat-card:hover {
    transform: translateY(-5px);
    box-shadow: var(--shadow-hover);
    border-color: var(--accent);
  }

  .bd-tag {
    display: inline-block;
    font-family: 'DM Sans', sans-serif;
    font-size: 10px; font-weight: 700;
    letter-spacing: 0.12em; text-transform: uppercase;
    color: var(--accent);
    background: var(--accent-soft);
    padding: 3px 10px; border-radius: 20px;
  }

  .bd-step-num {
    font-family: 'DM Serif Display', serif;
    font-size: 56px; font-style: italic;
    color: var(--accent); opacity: 0.2;
    line-height: 1; display: block; margin-bottom: 12px;
  }

  .bd-marquee-wrap {
    overflow: hidden; padding: 14px 0;
    border-top: 1px solid var(--border-subtle);
    border-bottom: 1px solid var(--border-subtle);
    background: var(--bg-card);
  }
  .bd-marquee {
    display: flex; gap: 0;
    animation: bd-scroll 32s linear infinite;
    white-space: nowrap;
  }
  @keyframes bd-scroll {
    from { transform: translateX(0); }
    to   { transform: translateX(-50%); }
  }
  .bd-marquee-item {
    font-family: 'DM Sans', sans-serif;
    font-size: 12px; font-weight: 500;
    color: var(--text-muted);
    letter-spacing: 0.06em; text-transform: uppercase;
    padding: 0 24px; flex-shrink: 0;
    display: flex; align-items: center; gap: 12px;
  }
  .bd-marquee-dot {
    width: 3px; height: 3px; border-radius: 50%;
    background: var(--accent); opacity: 0.5; flex-shrink: 0;
  }

  .bd-hero {
    min-height: 90vh;
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
  .bd-hero-left {
    padding: 80px 64px 80px 60px;
    display: flex; flex-direction: column; justify-content: center;
    border-right: 1px solid var(--border-subtle);
  }
  .bd-hero-map {
    position: relative; overflow: hidden; min-height: 400px;
    zIndex: 0; isolation: isolate;
  }
  .bd-steps-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 32px;
  }
  .bd-feat-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
  }
  .bd-leaders-grid {
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 48px;
    align-items: center;
  }

  @media (max-width: 900px) {
    .bd-hero { grid-template-columns: 1fr; min-height: auto; }
    .bd-hero-left { padding: 60px 24px 48px; border-right: none; border-bottom: 1px solid var(--border-subtle); }
    .bd-hero-map { min-height: 280px; }
    .bd-steps-grid { grid-template-columns: 1fr; gap: 24px; }
    .bd-feat-grid { grid-template-columns: 1fr; }
    .bd-leaders-grid { grid-template-columns: 1fr; gap: 24px; }
  }

  @media (max-width: 600px) {
    .bd-hero-left { padding: 48px 16px 40px; }
    .bd-section-pad { padding: 72px 16px !important; }
    .bd-section-pad-bottom { padding: 0 16px 72px !important; }
    .bd-leaders-pad { padding: 60px 16px !important; }
  }
`;

const TRANSLATIONS = {
  en: {
    tag: "Mongolia's Simplest Club Platform",
    heroH1: "Find your",
    heroAccent: "people.",
    heroDesc: "Discover clubs, sports, arts, and tech communities across Ulaanbaatar. Built for teens who want to grow.",
    exploreBtn: "Explore clubs",
    createBtn: "Create account",
    statClubs: "Active clubs",
    statCats: "Categories",
    statSimple: "Always",
    statSimpleLabel: "Simple",
    howLabel: "How it works",
    howH2a: "Three steps to",
    howH2b: "belonging.",
    steps: [
      { num: "01", title: "Create your account", desc: "Sign up in seconds. Free, always. Just your name and email." },
      { num: "02", title: "Discover clubs", desc: "Browse sports, arts, tech and more. Filter by location or interest." },
      { num: "03", title: "Join and connect", desc: "Join for free, attend events, and meet your people." },
    ],
    exploreLabel: "Explore",
    exploreH2a: "Start",
    exploreH2b: "somewhere.",
    viewAll: "View all clubs →",
    allCats: "All Categories",
    allCatsDesc: "Football to photography — find what moves you.",
    sportsTitle: "Sports Clubs",
    sportsDesc: "Football, basketball, volleyball — teams open for new members.",
    sportsBtn: "Explore →",
    eventsTitle: "Upcoming Events",
    eventsDesc: "Tryouts, meetups and open sessions happening near you.",
    comingSoon: "Coming soon",
    leadersLabel: "For Club Leaders",
    leadersH2a: "List your club on",
    leadersH2b: "Duguilan.com",
    leadersDesc: "Reach hundreds of students looking for clubs like yours. Free to register, easy to manage.",
    registerBtn: "Register your club",
    browseFirst: "Or browse clubs first →",
  },
  mn: {
    tag: "Монголын хамгийн энгийн клубын платформ",
    heroH1: "Өөрийнхөө",
    heroAccent: "хүмүүсийг ол.",
    heroDesc: "Улаанбаатар даяар спорт, урлаг, технологийн клубуудыг нээ. Өсөхийг хүсдэг залуучуудад зориулсан.",
    exploreBtn: "Клубуудыг үзэх",
    createBtn: "Бүртгүүлэх",
    statClubs: "Идэвхтэй клуб",
    statCats: "Ангилал",
    statSimple: "Үргэлж",
    statSimpleLabel: "Энгийн",
    howLabel: "Хэрхэн ажилладаг",
    howH2a: "Гурван алхамаар",
    howH2b: "нэгдэнэ.",
    steps: [
      { num: "01", title: "Бүртгэл үүсгэх", desc: "Хэдхэн секундэд бүртгүүл. Үнэгүй, үргэлж. Зөвхөн нэр болон имэйл хаяг." },
      { num: "02", title: "Клубуудыг нээх", desc: "Спорт, урлаг, технологи болон бусдыг харах. Байршил эсвэл сонирхлоор шүүх." },
      { num: "03", title: "Нэгдэж холбогдох", desc: "Үнэгүй нэгдэж, арга хэмжээнд оролцож, өөрийн хүмүүстэй уулз." },
    ],
    exploreLabel: "Судлах",
    exploreH2a: "Эхэл",
    exploreH2b: "хаанаас ч болов.",
    viewAll: "Бүх клубыг харах →",
    allCats: "Бүх ангилал",
    allCatsDesc: "Хөлбөмбөгоос фотографи хүртэл — өөрт тохирохыг ол.",
    sportsTitle: "Спортын клубууд",
    sportsDesc: "Хөлбөмбөг, бөсгөлдөр, волейбол — шинэ гишүүд хүлээн авч байна.",
    sportsBtn: "Судлах →",
    eventsTitle: "Удахгүй болох арга хэмжээ",
    eventsDesc: "Шалгаруулалт, уулзалт болон нээлттэй хичээлүүд.",
    comingSoon: "Удахгүй",
    leadersLabel: "Клубын удирдагчдад",
    leadersH2a: "Клубаа",
    leadersH2b: "Duguilan.com-д бүртгүүл",
    leadersDesc: "Таны клуб хайж буй олон зуун оюутанд хүр. Бүртгүүлэх үнэгүй, удирдахад хялбар.",
    registerBtn: "Клубаа бүртгүүлэх",
    browseFirst: "Эсвэл эхлээд клубуудыг үзэх →",
  },
};

function useCountUp(target, dur = 1200) {
  const [val, setVal] = useState(0);
  const started = useRef(false);
  useEffect(() => {
    if (!target || started.current) return;
    started.current = true;
    const t0 = performance.now();
    const tick = now => {
      const p = Math.min((now - t0) / dur, 1);
      const e = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(e * target));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [target]);
  return val;
}

const MARQUEE_ITEMS = [
  "Football", "Basketball", "Volleyball", "Tennis", "Swimming",
  "Chess", "Music", "Art", "Dance", "Drama", "Coding", "Science",
  "Wrestling", "Boxing", "Judo", "Athletics",
];

export default function Body() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [clubCount, setClubCount] = useState(0);
  const [categoryCount, setCategoryCount] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const { lang } = useTranslation();
  const T = TRANSLATIONS[lang] || TRANSLATIONS.en;

  const animClubs = useCountUp(loaded ? clubCount : 0);
  const animCats  = useCountUp(loaded ? categoryCount : 0);

  useEffect(() => {
    setLoggedIn(!!localStorage.getItem("user"));
    fetch(`${API}/clubs`, { headers: { "ngrok-skip-browser-warning": "true" } })
      .then(r => r.json()).catch(() => ({ success: false }))
      .then(d => {
        if (d.success && d.clubs) {
          setClubCount(d.clubs.length);
          setCategoryCount(new Set(d.clubs.map(c => c.category).filter(Boolean)).size);
        }
        setLoaded(true);
      });
  }, []);

  const allMarquee = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];

  return (
    <main style={{ flex: 1, background: "var(--bg-page)", transition: "background 0.35s" }}>
      <style>{G}</style>

      {/* ── HERO ── */}
      <section className="bd-hero">
        <div className="bd-hero-left">
          <div className="bd-a1" style={{ marginBottom: "28px" }}>
            <span className="bd-tag">{T.tag}</span>
          </div>

          <h1 className="bd-a2" style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: "clamp(2.4rem, 5vw, 4.2rem)",
            fontWeight: 400, lineHeight: 1.1,
            color: "var(--text-primary)",
            margin: "0 0 24px",
            letterSpacing: "-0.025em",
            transition: "color 0.35s",
          }}>
            {T.heroH1}<br />
            <span style={{ color: "var(--accent)", fontStyle: "italic" }}>{T.heroAccent}</span>
          </h1>

          <p className="bd-a3" style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "16px", fontWeight: 300, lineHeight: 1.8,
            color: "var(--text-secondary)",
            maxWidth: "380px", margin: "0 0 40px",
            transition: "color 0.35s",
          }}>
            {T.heroDesc}
          </p>

          <div className="bd-a4" style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginBottom: "48px" }}>
            <Link href="/page1" className="bd-cta-fill">{T.exploreBtn}</Link>
            {!loggedIn && <Link href="/signup" className="bd-cta-ghost">{T.createBtn}</Link>}
          </div>

          <div className="bd-a5" style={{ display: "flex", gap: "0" }}>
            {[
              { val: animClubs > 0 ? `${animClubs}+` : "—", label: T.statClubs },
              { val: animCats > 0 ? `${animCats}+` : "—", label: T.statCats },
              { val: T.statSimple, label: T.statSimpleLabel },
            ].map(({ val, label }, i) => (
              <div key={label} style={{
                paddingRight: "24px",
                paddingLeft: i === 0 ? 0 : "24px",
                borderRight: i < 2 ? "1px solid var(--border-subtle)" : "none",
              }}>
                <span style={{
                  fontFamily: "'DM Serif Display', serif",
                  fontSize: "clamp(20px, 4vw, 28px)", fontStyle: "italic",
                  color: "var(--text-primary)", display: "block",
                  lineHeight: 1, marginBottom: "4px",
                  transition: "color 0.35s",
                }}>{val}</span>
                <span style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "10px", fontWeight: 600,
                  letterSpacing: "0.1em", textTransform: "uppercase",
                  color: "var(--text-muted)",
                }}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bd-hero-map">
          <MapComponent height="100%" />
          <div style={{
            position: "absolute", inset: 0, pointerEvents: "none",
            background: "linear-gradient(to right, var(--bg-page) 0%, transparent 8%, transparent 92%, var(--bg-page) 100%)",
          }} />
        </div>
      </section>

      {/* ── MARQUEE ── */}
      <div className="bd-marquee-wrap">
        <div className="bd-marquee">
          {allMarquee.map((item, i) => (
            <span key={i} className="bd-marquee-item">
              {item}
              <span className="bd-marquee-dot" />
            </span>
          ))}
        </div>
      </div>

      {/* ── HOW IT WORKS ── */}
      <section className="bd-section-pad" style={{ padding: "120px 32px", background: "var(--bg-page)", transition: "background 0.35s" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{
            display: "flex", alignItems: "flex-end",
            justifyContent: "space-between",
            marginBottom: "64px", paddingBottom: "32px",
            borderBottom: "1px solid var(--border-subtle)",
          }}>
            <div>
              <span style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "10px", fontWeight: 700,
                letterSpacing: "0.16em", textTransform: "uppercase",
                color: "var(--text-muted)", display: "block", marginBottom: "12px",
              }}>{T.howLabel}</span>
              <h2 style={{
                fontFamily: "'DM Serif Display', serif",
                fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)",
                fontWeight: 400, color: "var(--text-primary)",
                margin: 0, letterSpacing: "-0.02em",
                transition: "color 0.35s",
              }}>
                {T.howH2a} <em style={{ fontStyle: "italic", color: "var(--accent)" }}>{T.howH2b}</em>
              </h2>
            </div>
          </div>

          <div className="bd-steps-grid">
            {T.steps.map(({ num, title, desc }) => (
              <div key={num} style={{ padding: "0 0 32px", borderBottom: "2px solid var(--border-subtle)" }}>
                <span className="bd-step-num">{num}</span>
                <h3 style={{
                  fontFamily: "'DM Serif Display', serif",
                  fontSize: "22px", fontWeight: 400,
                  color: "var(--text-primary)", margin: "0 0 12px",
                  letterSpacing: "-0.01em", transition: "color 0.35s",
                }}>{title}</h3>
                <p style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "14px", fontWeight: 300, lineHeight: 1.8,
                  color: "var(--text-secondary)", margin: 0, transition: "color 0.35s",
                }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── EXPLORE ── */}
      <section className="bd-section-pad-bottom" style={{ padding: "0 32px 120px", background: "var(--bg-page)", transition: "background 0.35s" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{
            display: "flex", alignItems: "flex-end",
            justifyContent: "space-between",
            marginBottom: "48px", paddingBottom: "32px",
            borderBottom: "1px solid var(--border-subtle)",
            flexWrap: "wrap", gap: "12px",
          }}>
            <div>
              <span style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "10px", fontWeight: 700,
                letterSpacing: "0.16em", textTransform: "uppercase",
                color: "var(--text-muted)", display: "block", marginBottom: "12px",
              }}>{T.exploreLabel}</span>
              <h2 style={{
                fontFamily: "'DM Serif Display', serif",
                fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)",
                fontWeight: 400, color: "var(--text-primary)",
                margin: 0, letterSpacing: "-0.02em", transition: "color 0.35s",
              }}>
                {T.exploreH2a} <em style={{ fontStyle: "italic", color: "var(--accent)" }}>{T.exploreH2b}</em>
              </h2>
            </div>
            <Link href="/page1" style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "13px", fontWeight: 600,
              letterSpacing: "0.06em", textTransform: "uppercase",
              color: "var(--text-muted)", textDecoration: "none",
              transition: "color 0.2s",
            }}
              onMouseEnter={e => e.target.style.color = "var(--text-primary)"}
              onMouseLeave={e => e.target.style.color = "var(--text-muted)"}
            >
              {T.viewAll}
            </Link>
          </div>

          <div className="bd-feat-grid">
            <Link href="/page1" className="bd-feat-card" style={{ background: "var(--accent)", borderColor: "transparent" }}>
              <div style={{
                width: "42px", height: "42px",
                border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: "10px", background: "rgba(255,255,255,0.1)",
                display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "32px",
              }}>
                <svg width="18" height="18" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="1.5" viewBox="0 0 24 24">
                  <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
                  <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
                </svg>
              </div>
              <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "22px", fontWeight: 400, color: "var(--text-on-accent)", margin: "0 0 10px", lineHeight: 1.3 }}>{T.allCats}</h3>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", fontWeight: 300, color: "rgba(255,255,255,0.65)", lineHeight: 1.75, margin: "0 0 auto" }}>
                {T.allCatsDesc}
              </p>
              <div style={{ marginTop: "24px" }}>
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.55)" }}>
                  {categoryCount > 0 ? `${categoryCount} categories →` : "Explore →"}
                </span>
              </div>
            </Link>

            <Link href="/page1?cat=sports" className="bd-feat-card">
              <div style={{ width: "42px", height: "42px", border: "1px solid rgba(22,163,74,0.25)", borderRadius: "10px", background: "rgba(22,163,74,0.08)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "32px" }}>
                <svg width="18" height="18" fill="none" stroke="#16a34a" strokeWidth="1.5" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                  <path d="M2 12h20"/>
                </svg>
              </div>
              <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "22px", fontWeight: 400, color: "var(--text-primary)", margin: "0 0 10px", lineHeight: 1.3, transition: "color 0.35s" }}>{T.sportsTitle}</h3>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", fontWeight: 300, color: "var(--text-secondary)", lineHeight: 1.75, margin: "0 0 auto", transition: "color 0.35s" }}>
                {T.sportsDesc}
              </p>
              <div style={{ marginTop: "24px" }}>
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#16a34a" }}>{T.sportsBtn}</span>
              </div>
            </Link>

            <div className="bd-feat-card">
              <div style={{ width: "42px", height: "42px", border: "1px solid rgba(217,119,6,0.25)", borderRadius: "10px", background: "rgba(217,119,6,0.08)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "32px" }}>
                <svg width="18" height="18" fill="none" stroke="#d97706" strokeWidth="1.5" viewBox="0 0 24 24">
                  <rect x="3" y="4" width="18" height="18" rx="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
              </div>
              <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "22px", fontWeight: 400, color: "var(--text-primary)", margin: "0 0 10px", lineHeight: 1.3, transition: "color 0.35s" }}>{T.eventsTitle}</h3>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", fontWeight: 300, color: "var(--text-secondary)", lineHeight: 1.75, margin: "0 0 auto", transition: "color 0.35s" }}>
                {T.eventsDesc}
              </p>
              <div style={{ marginTop: "24px" }}>
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "10px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#d97706", background: "rgba(217,119,6,0.1)", border: "1px solid rgba(217,119,6,0.2)", padding: "3px 10px", borderRadius: "20px", display: "inline-block" }}>{T.comingSoon}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOR CLUB LEADERS ── */}
      <section className="bd-leaders-pad" style={{
        padding: "80px 32px",
        background: "var(--bg-section)",
        borderTop: "1px solid var(--border-subtle)",
        transition: "background 0.35s",
      }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div className="bd-leaders-grid">
            <div>
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "10px", fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--text-muted)", display: "block", marginBottom: "12px" }}>{T.leadersLabel}</span>
              <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(1.6rem, 3.5vw, 2.6rem)", fontWeight: 400, lineHeight: 1.15, color: "var(--text-primary)", margin: "0 0 12px", letterSpacing: "-0.02em", transition: "color 0.35s" }}>
                {T.leadersH2a} <em style={{ fontStyle: "italic", color: "var(--accent)" }}>{T.leadersH2b}</em>
              </h2>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "14px", fontWeight: 300, lineHeight: 1.8, color: "var(--text-secondary)", margin: 0, maxWidth: "480px", transition: "color 0.35s" }}>
                {T.leadersDesc}
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", flexShrink: 0 }}>
              <Link href="/club-register" className="bd-cta-fill" style={{ textAlign: "center" }}>
                {T.registerBtn}
              </Link>
              <Link href="/page1" style={{ fontFamily: "'DM Sans', sans-serif", textAlign: "center", fontSize: "12px", fontWeight: 500, color: "var(--text-muted)", textDecoration: "none", transition: "color 0.2s" }}
                onMouseEnter={e => e.target.style.color = "var(--text-primary)"}
                onMouseLeave={e => e.target.style.color = "var(--text-muted)"}
              >
                {T.browseFirst}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}