import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
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
`;

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

const HOW_STEPS = [
  { num: "01", title: "Create your account", desc: "Sign up in seconds. Free, always. Just your name and email." },
  { num: "02", title: "Discover clubs", desc: "Browse sports, arts, tech and more. Filter by location or interest." },
  { num: "03", title: "Join and connect", desc: "Join for free, attend events, and meet your people." },
];

export default function Body() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [clubCount, setClubCount] = useState(0);
  const [categoryCount, setCategoryCount] = useState(0);
  const [loaded, setLoaded] = useState(false);

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

      <section style={{
        minHeight: "90vh",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
      }}>
        <div style={{
          padding: "80px 64px 80px 60px",
          display: "flex", flexDirection: "column", justifyContent: "center",
          borderRight: "1px solid var(--border-subtle)",
        }}>
          <div className="bd-a1" style={{ marginBottom: "28px" }}>
            <span className="bd-tag">Mongolia's Simplest Club Platform</span>
          </div>

          <h1 className="bd-a2" style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: "clamp(2.8rem, 5vw, 4.2rem)",
            fontWeight: 400, lineHeight: 1.1,
            color: "var(--text-primary)",
            margin: "0 0 24px",
            letterSpacing: "-0.025em",
            transition: "color 0.35s",
          }}>
            Find your<br />
            <span style={{ color: "var(--accent)", fontStyle: "italic" }}>people.</span>
          </h1>

          <p className="bd-a3" style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "16px", fontWeight: 300, lineHeight: 1.8,
            color: "var(--text-secondary)",
            maxWidth: "380px", margin: "0 0 40px",
            transition: "color 0.35s",
          }}>
            Discover clubs, sports, arts, and tech communities across Ulaanbaatar. Built for teens who want to grow.
          </p>

          <div className="bd-a4" style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginBottom: "56px" }}>
            <a href="/page1" className="bd-cta-fill">Explore clubs</a>
            {!loggedIn && <a href="/signup" className="bd-cta-ghost">Create account</a>}
          </div>
          <div className="bd-a5" style={{ display: "flex", gap: "0" }}>
            {[
              { val: animClubs > 0 ? `${animClubs}+` : "—", label: "Active clubs" },
              { val: animCats > 0 ? `${animCats}+` : "—", label: "Categories" },
              { val: "Free", label: "Always" },
            ].map(({ val, label }, i) => (
              <div key={label} style={{
                paddingRight: "32px",
                paddingLeft: i === 0 ? 0 : "32px",
                borderRight: i < 2 ? "1px solid var(--border-subtle)" : "none",
              }}>
                <span style={{
                  fontFamily: "'DM Serif Display', serif",
                  fontSize: "28px", fontStyle: "italic",
                  color: "var(--text-primary)", display: "block",
                  lineHeight: 1, marginBottom: "4px",
                  transition: "color 0.35s",
                }}>{val}</span>
                <span style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "11px", fontWeight: 600,
                  letterSpacing: "0.1em", textTransform: "uppercase",
                  color: "var(--text-muted)",
                }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ position: "relative", overflow: "hidden", minHeight: "400px", zIndex: 0, isolation: "isolate" }}>
          <MapComponent height="100%" />
          <div style={{
            position: "absolute", inset: 0, pointerEvents: "none",
            background: "linear-gradient(to right, var(--bg-page) 0%, transparent 8%, transparent 92%, var(--bg-page) 100%)",
          }} />
        </div>
      </section>
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
      <section style={{ padding: "120px 32px", background: "var(--bg-page)", transition: "background 0.35s" }}>
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
              }}>How it works</span>
              <h2 style={{
                fontFamily: "'DM Serif Display', serif",
                fontSize: "clamp(2rem, 3.5vw, 2.8rem)",
                fontWeight: 400, color: "var(--text-primary)",
                margin: 0, letterSpacing: "-0.02em",
                transition: "color 0.35s",
              }}>
                Three steps to <em style={{ fontStyle: "italic", color: "var(--accent)" }}>belonging.</em>
              </h2>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "32px" }}>
            {HOW_STEPS.map(({ num, title, desc }) => (
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
      <section style={{ padding: "0 32px 120px", background: "var(--bg-page)", transition: "background 0.35s" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{
            display: "flex", alignItems: "flex-end",
            justifyContent: "space-between",
            marginBottom: "48px", paddingBottom: "32px",
            borderBottom: "1px solid var(--border-subtle)",
          }}>
            <div>
              <span style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "10px", fontWeight: 700,
                letterSpacing: "0.16em", textTransform: "uppercase",
                color: "var(--text-muted)", display: "block", marginBottom: "12px",
              }}>Explore</span>
              <h2 style={{
                fontFamily: "'DM Serif Display', serif",
                fontSize: "clamp(2rem, 3.5vw, 2.8rem)",
                fontWeight: 400, color: "var(--text-primary)",
                margin: 0, letterSpacing: "-0.02em", transition: "color 0.35s",
              }}>
                Start <em style={{ fontStyle: "italic", color: "var(--accent)" }}>somewhere.</em>
              </h2>
            </div>
            <a href="/page1" style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "13px", fontWeight: 600,
              letterSpacing: "0.06em", textTransform: "uppercase",
              color: "var(--text-muted)", textDecoration: "none",
              transition: "color 0.2s",
            }}
              onMouseEnter={e => e.target.style.color = "var(--text-primary)"}
              onMouseLeave={e => e.target.style.color = "var(--text-muted)"}
            >
              View all clubs →
            </a>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
            <a href="/page1" className="bd-feat-card" style={{ background: "var(--accent)", borderColor: "transparent" }}>
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
              <h3 style={{
                fontFamily: "'DM Serif Display', serif",
                fontSize: "22px", fontWeight: 400,
                color: "var(--text-on-accent)", margin: "0 0 10px", lineHeight: 1.3,
              }}>All Categories</h3>
              <p style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "13px", fontWeight: 300,
                color: "rgba(255,255,255,0.65)", lineHeight: 1.75, margin: "0 0 auto",
              }}>
                Football to photography — find what moves you.
              </p>
              <div style={{ marginTop: "24px" }}>
                <span style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "11px", fontWeight: 700,
                  letterSpacing: "0.08em", textTransform: "uppercase",
                  color: "rgba(255,255,255,0.55)",
                }}>
                  {categoryCount > 0 ? `${categoryCount} categories →` : "Explore →"}
                </span>
              </div>
            </a>
            <a href="/page1?cat=sports" className="bd-feat-card">
              <div style={{
                width: "42px", height: "42px",
                border: "1px solid rgba(22,163,74,0.25)",
                borderRadius: "10px", background: "rgba(22,163,74,0.08)",
                display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "32px",
              }}>
                <svg width="18" height="18" fill="none" stroke="#16a34a" strokeWidth="1.5" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                  <path d="M2 12h20"/>
                </svg>
              </div>
              <h3 style={{
                fontFamily: "'DM Serif Display', serif",
                fontSize: "22px", fontWeight: 400,
                color: "var(--text-primary)", margin: "0 0 10px", lineHeight: 1.3,
                transition: "color 0.35s",
              }}>Sports Clubs</h3>
              <p style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "13px", fontWeight: 300,
                color: "var(--text-secondary)", lineHeight: 1.75, margin: "0 0 auto",
                transition: "color 0.35s",
              }}>
                Football, basketball, volleyball — teams open for new members.
              </p>
              <div style={{ marginTop: "24px" }}>
                <span style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "11px", fontWeight: 700,
                  letterSpacing: "0.08em", textTransform: "uppercase", color: "#16a34a",
                }}>
                  Explore →
                </span>
              </div>
            </a>
            <a href="#" className="bd-feat-card">
              <div style={{
                width: "42px", height: "42px",
                border: "1px solid rgba(217,119,6,0.25)",
                borderRadius: "10px", background: "rgba(217,119,6,0.08)",
                display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "32px",
              }}>
                <svg width="18" height="18" fill="none" stroke="#d97706" strokeWidth="1.5" viewBox="0 0 24 24">
                  <rect x="3" y="4" width="18" height="18" rx="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
              </div>
              <h3 style={{
                fontFamily: "'DM Serif Display', serif",
                fontSize: "22px", fontWeight: 400,
                color: "var(--text-primary)", margin: "0 0 10px", lineHeight: 1.3,
                transition: "color 0.35s",
              }}>Upcoming Events</h3>
              <p style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "13px", fontWeight: 300,
                color: "var(--text-secondary)", lineHeight: 1.75, margin: "0 0 auto",
                transition: "color 0.35s",
              }}>
                Tryouts, meetups and open sessions happening near you.
              </p>
              <div style={{ marginTop: "24px" }}>
                <span style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "10px", fontWeight: 700,
                  letterSpacing: "0.1em", textTransform: "uppercase",
                  color: "#d97706", background: "rgba(217,119,6,0.1)",
                  border: "1px solid rgba(217,119,6,0.2)",
                  padding: "3px 10px", borderRadius: "20px", display: "inline-block",
                }}>Coming soon</span>
              </div>
            </a>
          </div>
        </div>
      </section>
      <section style={{
        padding: "80px 32px",
        background: "var(--bg-section)",
        borderTop: "1px solid var(--border-subtle)",
        transition: "background 0.35s",
      }}>
        <div style={{
          maxWidth: "1200px", margin: "0 auto",
          display: "grid", gridTemplateColumns: "1fr auto",
          gap: "48px", alignItems: "center",
        }}>
          <div>
            <span style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "10px", fontWeight: 700, letterSpacing: "0.16em",
              textTransform: "uppercase", color: "var(--text-muted)",
              display: "block", marginBottom: "12px",
            }}>For Club Leaders</span>
            <h2 style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)",
              fontWeight: 400, lineHeight: 1.15,
              color: "var(--text-primary)", margin: "0 0 12px",
              letterSpacing: "-0.02em", transition: "color 0.35s",
            }}>
              List your club on <em style={{ fontStyle: "italic", color: "var(--accent)" }}>Duguilan.mn</em>
            </h2>
            <p style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "14px", fontWeight: 300, lineHeight: 1.8,
              color: "var(--text-secondary)", margin: 0, maxWidth: "480px",
              transition: "color 0.35s",
            }}>
              Reach hundreds of students looking for clubs like yours. Free to register, easy to manage.
            </p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", flexShrink: 0 }}>
            <a href="/club-register" className="bd-cta-fill" style={{ textAlign: "center" }}>
              Register your club
            </a>
            <a href="/page1" style={{
              fontFamily: "'DM Sans', sans-serif",
              textAlign: "center", fontSize: "12px", fontWeight: 500,
              color: "var(--text-muted)", textDecoration: "none", transition: "color 0.2s",
            }}
              onMouseEnter={e => e.target.style.color = "var(--text-primary)"}
              onMouseLeave={e => e.target.style.color = "var(--text-muted)"}
            >
              Or browse clubs first →
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}