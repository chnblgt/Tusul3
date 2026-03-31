import dynamic from "next/dynamic";
const MapComponent = dynamic(() => import("./Mapcomponent"), { ssr: false });

const fonts = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,700;0,9..144,800;1,9..144,700&family=DM+Sans:wght@400;500;600;700&display=swap');
  .hb-display { font-family: 'Fraunces', serif; }
  .hb-sans { font-family: 'DM Sans', sans-serif; }

  @keyframes hb-fadeUp {
    from { opacity: 0; transform: translateY(28px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .hb-a1 { animation: hb-fadeUp 0.6s cubic-bezier(0.22,1,0.36,1) forwards; }
  .hb-a2 { animation: hb-fadeUp 0.6s cubic-bezier(0.22,1,0.36,1) 0.1s forwards; opacity: 0; }
  .hb-a3 { animation: hb-fadeUp 0.6s cubic-bezier(0.22,1,0.36,1) 0.2s forwards; opacity: 0; }
  .hb-a4 { animation: hb-fadeUp 0.6s cubic-bezier(0.22,1,0.36,1) 0.3s forwards; opacity: 0; }
  .hb-a5 { animation: hb-fadeUp 0.6s cubic-bezier(0.22,1,0.36,1) 0.4s forwards; opacity: 0; }

  @keyframes hb-spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
  @keyframes hb-spin-rev  { from { transform: rotate(0deg); } to { transform: rotate(-360deg); } }
  @keyframes hb-float {
    0%, 100% { transform: translateY(0px); }
    50%       { transform: translateY(-10px); }
  }

  .hb-cta-primary {
    font-family: 'DM Sans', sans-serif;
    font-size: 14px; font-weight: 700;
    background: linear-gradient(135deg, #7c3aed, #4c1d95);
    color: #fff;
    padding: 14px 28px; border-radius: 9px;
    text-decoration: none; display: inline-block;
    transition: transform 0.15s, box-shadow 0.2s, opacity 0.2s;
    letter-spacing: 0.01em;
    box-shadow: 0 4px 20px rgba(124,58,237,0.35);
  }
  .hb-cta-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 28px rgba(124,58,237,0.45);
    opacity: 0.92;
  }

  .hb-cta-secondary {
    font-family: 'DM Sans', sans-serif;
    font-size: 14px; font-weight: 600;
    color: #1a0533; padding: 14px 28px;
    border-radius: 9px; border: 1.5px solid rgba(26,5,51,0.15);
    text-decoration: none; display: inline-block;
    transition: border-color 0.2s, color 0.2s, background 0.2s, transform 0.15s;
  }
  .hb-cta-secondary:hover {
    border-color: #7c3aed; color: #7c3aed;
    background: rgba(124,58,237,0.04); transform: translateY(-1px);
  }

  .hb-feat-card {
    transition: transform 0.22s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.22s ease;
    text-decoration: none; display: block;
  }
  .hb-feat-card:hover {
    transform: translateY(-6px);
    box-shadow: 0 24px 56px rgba(26,5,51,0.13);
  }

  .hb-how-card {
    background: #fff;
    border: 1.5px solid rgba(124,58,237,0.1);
    border-radius: 20px; padding: 28px 24px;
    transition: transform 0.2s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.2s;
  }
  .hb-how-card:hover { transform: translateY(-4px); box-shadow: 0 16px 40px rgba(124,58,237,0.1); }

  .hb-geo-ring1 { animation: hb-spin-slow 50s linear infinite; transform-origin: 160px 200px; }
  .hb-geo-ring2 { animation: hb-spin-rev  70s linear infinite; transform-origin: 160px 200px; }
  .hb-geo-float { animation: hb-float 7s ease-in-out infinite; }
`;

const GeoBg = () => (
  <svg
    aria-hidden="true"
    style={{
      position: "absolute", inset: 0, width: "100%", height: "100%",
      pointerEvents: "none", overflow: "hidden",
    }}
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="xMidYMid slice"
  >
    <defs>
      <pattern id="hatch" width="36" height="36" patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
        <line x1="0" y1="0" x2="0" y2="36" stroke="#7c3aed" strokeWidth="0.45" strokeOpacity="0.07"/>
      </pattern>
      <pattern id="dots" width="26" height="26" patternUnits="userSpaceOnUse">
        <circle cx="1.5" cy="1.5" r="1.1" fill="#7c3aed" fillOpacity="0.07"/>
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#hatch)"/>
    <rect x="45%" width="55%" height="100%" fill="url(#dots)"/>
    <g className="hb-geo-ring1">
      <polygon points="160,68 254,120 254,224 160,276 66,224 66,120" fill="none" stroke="#7c3aed" strokeWidth="1.2" strokeOpacity="0.18" />
    </g>
    <g className="hb-geo-ring2">
      <polygon points="160,108 228,146 228,222 160,260 92,222 92,146" fill="none" stroke="#a78bfa" strokeWidth="0.8" strokeOpacity="0.13" />
    </g>
    <g className="hb-geo-float" style={{ transformOrigin: "78% 22%" }}>
      <rect x="-22" y="-22" width="44" height="44" rx="3" fill="none" stroke="#a78bfa" strokeWidth="1.3" strokeOpacity="0.2" transform="translate(78%, 22%) rotate(45)" />
    </g>
    <circle cx="24%" cy="48%" r="260" fill="none" stroke="#7c3aed" strokeWidth="1.2" strokeOpacity="0.09" strokeDasharray="7 14" />
    <circle cx="24%" cy="48%" r="185" fill="none" stroke="#c4b5fd" strokeWidth="0.7" strokeOpacity="0.08" strokeDasharray="4 18" />
  </svg>
);

const HOW_STEPS = [
  {
    num: "01",
    title: "Create your account",
    desc: "Sign up in seconds — no fees, no paperwork. Just your name and email.",
    icon: (
      <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
      </svg>
    ),
    accent: "#7c3aed",
  },
  {
    num: "02",
    title: "Discover clubs",
    desc: "Browse by sport, art, tech and more. Find what excites you.",
    icon: (
      <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
      </svg>
    ),
    accent: "#ec4899",
  },
  {
    num: "03",
    title: "Join & connect",
    desc: "Join for free or pick a membership tier. Meet your people.",
    icon: (
      <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
    accent: "#f97316",
  },
];

export default function Body() {
  return (
    <main style={{ flex: 1, background: "#fff" }}>
      <style>{fonts}</style>

      {/* Hero Section */}
      <section style={{
        background: "radial-gradient(ellipse at 30% 50%, #ede9fe 0%, #f5f0ff 40%, #fdfcff 70%, #fff 100%)",
        borderBottom: "1px solid rgba(124,58,237,0.08)",
        position: "relative",
        overflow: "hidden",
      }}>
        <GeoBg />
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 48px", position: "relative", zIndex: 1 }}>
          <div style={{
            display: "grid", gridTemplateColumns: "1fr 1fr",
            gap: "64px", alignItems: "center", padding: "72px 0 80px",
          }}>
            <div>
              <div className="hb-a1" style={{
                display: "inline-flex", alignItems: "center", gap: "8px",
                background: "#fff", border: "1.5px solid rgba(124,58,237,0.2)",
                padding: "5px 12px", borderRadius: "20px", marginBottom: "28px",
                boxShadow: "0 2px 12px rgba(124,58,237,0.1)",
              }}>
                <div style={{ width: "7px", height: "7px", background: "#22c55e", borderRadius: "50%", boxShadow: "0 0 0 3px rgba(34,197,94,0.2)" }} />
                <span className="hb-sans" style={{ fontSize: "11px", fontWeight: 700, color: "#7c3aed", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                  Now live in Ulaanbaatar
                </span>
              </div>

              <h1 className="hb-display hb-a2" style={{
                fontSize: "clamp(2.8rem, 5vw, 4.4rem)", fontWeight: 800, lineHeight: 1.1,
                color: "#1a0533", letterSpacing: "-0.04em", marginBottom: "24px",
              }}>
                <span style={{ fontStyle: "italic" }}>Түүхээ</span>{" "}
                <span style={{ fontStyle: "italic" }}>эхлүүл,</span>
                <br />
                <span style={{ fontStyle: "italic", color: "#7c3aed" }}>тэмүүлэлдээ</span>
                <br />
                <span style={{ fontStyle: "italic" }}>нэгд.</span>
              </h1>

              <p className="hb-sans hb-a3" style={{
                fontSize: "15px", color: "#666", lineHeight: 1.75,
                maxWidth: "400px", marginBottom: "32px",
              }}>
                Discover clubs, sports teams, and creative communities across Ulaanbaatar — all in one place.
              </p>

              <div className="hb-a4" style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginBottom: "36px" }}>
                <a href="/page1" className="hb-cta-primary">Browse Clubs →</a>
                <a href="/signup" className="hb-cta-secondary">Create Account</a>
              </div>

              <div className="hb-a5" style={{
                display: "flex", gap: "36px",
                paddingTop: "24px", borderTop: "1px solid rgba(26,5,51,0.07)",
              }}>
                {[["6+", "Club types"], ["5+", "Members"], ["Free", "To join"]].map(([num, label]) => (
                  <div key={label}>
                    <div className="hb-display" style={{ fontSize: "26px", fontWeight: 800, color: "#1a0533", letterSpacing: "-0.04em", lineHeight: 1 }}>{num}</div>
                    <div className="hb-sans" style={{ fontSize: "11px", color: "#9879d4", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", marginTop: "4px" }}>{label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="hb-a3" style={{
              background: "#fff", borderRadius: "22px",
              border: "1.5px solid rgba(124,58,237,0.15)",
              overflow: "hidden", boxShadow: "0 20px 60px rgba(26,5,51,0.1), 0 4px 12px rgba(124,58,237,0.08)",
            }}>
              <div style={{ padding: "12px 16px", borderBottom: "1px solid rgba(124,58,237,0.08)", display: "flex", alignItems: "center", justifyContent: "space-between", background: "#fdfcff" }}>
                <div style={{ display: "flex", gap: "6px" }}>
                  {["#ff5f57", "#febc2e", "#28c840"].map(c => <div key={c} style={{ width: "10px", height: "10px", borderRadius: "50%", background: c }} />)}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <svg width="12" height="12" fill="none" stroke="#9879d4" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  <span className="hb-sans" style={{ fontSize: "11px", color: "#9879d4", fontWeight: 600 }}>Ulaanbaatar, Mongolia</span>
                </div>
                <div style={{ width: "40px" }} />
              </div>
              <div style={{ height: "300px", width: "100%", position: "relative", zIndex: 0 }}>
                <MapComponent />
              </div>
              <div style={{ padding: "10px 16px", borderTop: "1px solid rgba(124,58,237,0.08)", display: "flex", alignItems: "center", justifyContent: "space-between", background: "#fdfcff" }}>
                <span className="hb-sans" style={{ fontSize: "11px", color: "#9879d4", fontWeight: 500 }}>Capital of Mongolia</span>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <div style={{ width: "6px", height: "6px", background: "#22c55e", borderRadius: "50%", boxShadow: "0 0 0 3px rgba(34,197,94,0.2)" }} />
                  <span className="hb-sans" style={{ fontSize: "11px", color: "#22c55e", fontWeight: 700 }}>Active</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section style={{ padding: "80px 0 60px", background: "#fff", position: "relative", overflow: "hidden" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 48px", position: "relative", zIndex: 1 }}>
          <div style={{ marginBottom: "40px", textAlign: "center" }}>
            <p className="hb-sans" style={{ fontSize: "10.5px", fontWeight: 700, color: "#9879d4", letterSpacing: "0.12em", textTransform: "uppercase", margin: "0 0 8px" }}>Simple & free</p>
            <h2 className="hb-display" style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)", fontWeight: 800, color: "#1a0533", letterSpacing: "-0.04em", margin: "0 auto 10px", maxWidth: "600px" }}>How it works</h2>
            <p className="hb-sans" style={{ fontSize: "14px", color: "#888", lineHeight: 1.7, maxWidth: "400px", margin: "0 auto" }}>Getting started takes less than a minute.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
            {HOW_STEPS.map((step, i) => (
              <div key={i} className="hb-how-card">
                <div style={{ width: "46px", height: "46px", borderRadius: "12px", background: `${step.accent}14`, border: `1.5px solid ${step.accent}28`, display: "flex", alignItems: "center", justifyContent: "center", color: step.accent, marginBottom: "20px" }}>{step.icon}</div>
                <div className="hb-sans" style={{ fontSize: "10px", fontWeight: 700, color: "#c4b5fd", letterSpacing: "0.12em", marginBottom: "8px" }}>{step.num}</div>
                <h3 className="hb-display" style={{ fontSize: "18px", fontWeight: 800, color: "#1a0533", letterSpacing: "-0.02em", margin: "0 0 8px", lineHeight: 1.25 }}>{step.title}</h3>
                <p className="hb-sans" style={{ fontSize: "13px", color: "#888", lineHeight: 1.65, margin: 0 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Section */}
      <section style={{ padding: "40px 0 80px", background: "#fff" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 48px" }}>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: "32px" }}>
            <div>
              <p className="hb-sans" style={{ fontSize: "10.5px", fontWeight: 700, color: "#9879d4", letterSpacing: "0.12em", textTransform: "uppercase", margin: "0 0 6px" }}>Explore</p>
              <h2 className="hb-display" style={{ fontSize: "26px", fontWeight: 800, color: "#1a0533", letterSpacing: "-0.03em", margin: 0 }}>Featured</h2>
            </div>
            <a href="/page1" className="hb-sans" style={{ fontSize: "13.5px", fontWeight: 600, color: "#7c3aed", textDecoration: "none" }} onMouseEnter={e => e.target.style.textDecoration = "underline"} onMouseLeave={e => e.target.style.textDecoration = "none"}>View all →</a>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
            <a href="/page1" className="hb-feat-card" style={{ background: "linear-gradient(145deg, #1a0533 0%, #2d0a57 60%, #3b0764 100%)", borderRadius: "20px", padding: "28px 24px", border: "1px solid rgba(167,139,250,0.12)", display: "flex", flexDirection: "column", justifyContent: "space-between", textDecoration: "none" }}>
              <div>
                <div style={{ width: "44px", height: "44px", background: "rgba(124,58,237,0.3)", border: "1px solid rgba(167,139,250,0.2)", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px" }}>
                  <svg width="20" height="20" fill="none" stroke="#c4b5fd" strokeWidth="1.8" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
                </div>
                <h3 className="hb-display" style={{ fontSize: "18px", fontWeight: 800, color: "#fff", marginBottom: "7px", letterSpacing: "-0.02em", lineHeight: 1.25 }}>Browse All Categories</h3>
                <p className="hb-sans" style={{ fontSize: "12.5px", color: "#a78bfa", lineHeight: 1.6, margin: 0 }}>From football to photography, find clubs that match your passion.</p>
              </div>
              <div style={{ marginTop: "16px" }}><span className="hb-sans" style={{ fontSize: "11px", color: "#c4b5fd", fontWeight: 700 }}>12 categories →</span></div>
            </a>

            <a href="/page1?cat=sports" className="hb-feat-card" style={{ background: "#fff", borderRadius: "20px", padding: "28px 24px", border: "1.5px solid rgba(26,5,51,0.08)", display: "flex", flexDirection: "column", justifyContent: "space-between", textDecoration: "none" }}>
              <div>
                <div style={{ width: "44px", height: "44px", background: "#f0fdf4", border: "1.5px solid rgba(22,163,74,0.15)", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px" }}>
                  <svg width="20" height="20" fill="none" stroke="#16a34a" strokeWidth="1.8" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/><path d="M2 12h20"/></svg>
                </div>
                <h3 className="hb-display" style={{ fontSize: "18px", fontWeight: 800, color: "#1a0533", marginBottom: "7px", letterSpacing: "-0.02em", lineHeight: 1.25 }}>Sports Clubs</h3>
                <p className="hb-sans" style={{ fontSize: "12.5px", color: "#888", lineHeight: 1.6, margin: 0 }}>Football, basketball, volleyball teams open for new members.</p>
              </div>
              <div style={{ marginTop: "16px" }}><span className="hb-sans" style={{ fontSize: "11px", color: "#16a34a", fontWeight: 700 }}>Explore →</span></div>
            </a>

            <a href="/events" className="hb-feat-card" style={{ background: "#fff", borderRadius: "20px", padding: "28px 24px", border: "1.5px solid rgba(26,5,51,0.08)", display: "flex", flexDirection: "column", justifyContent: "space-between", textDecoration: "none" }}>
              <div>
                <div style={{ width: "44px", height: "44px", background: "#fffbeb", border: "1.5px solid rgba(217,119,6,0.15)", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px" }}>
                  <svg width="20" height="20" fill="none" stroke="#d97706" strokeWidth="1.8" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                </div>
                <h3 className="hb-display" style={{ fontSize: "18px", fontWeight: 800, color: "#1a0533", marginBottom: "7px", letterSpacing: "-0.02em", lineHeight: 1.25 }}>Upcoming Events</h3>
                <p className="hb-sans" style={{ fontSize: "12.5px", color: "#888", lineHeight: 1.6, margin: 0 }}>Tryouts, meetups, and open sessions happening soon.</p>
              </div>
              <div style={{ marginTop: "16px" }}><span className="hb-sans" style={{ display: "inline-block", fontSize: "10px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", padding: "3px 9px", borderRadius: "5px", color: "#d97706", background: "#fffbeb", border: "1px solid rgba(217,119,6,0.15)" }}>Coming soon</span></div>
            </a>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section style={{ padding: "0 0 80px", background: "#fff" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 48px" }}>
          <div style={{ background: "linear-gradient(135deg, #1a0533 0%, #2d0a57 50%, #3b0764 100%)", borderRadius: "20px", padding: "56px 48px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "40px", flexWrap: "wrap", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "relative", zIndex: 1 }}>
              <p className="hb-sans" style={{ fontSize: "10.5px", fontWeight: 700, color: "#a78bfa", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "10px" }}>Run a club?</p>
              <h2 className="hb-display" style={{ fontSize: "clamp(1.6rem, 3vw, 2.4rem)", fontWeight: 800, color: "#fff", letterSpacing: "-0.04em", margin: "0 0 10px", lineHeight: 1.2 }}>Get your club listed on Duguilan.mn</h2>
              <p className="hb-sans" style={{ fontSize: "14px", color: "#a78bfa", margin: 0, lineHeight: 1.65, maxWidth: "450px" }}>Reach hundreds of students looking for clubs just like yours. It's completely free to register.</p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", position: "relative", zIndex: 1, flexShrink: 0 }}>
              <a href="/club-register" className="hb-sans" style={{ background: "#fff", color: "#1a0533", padding: "14px 32px", borderRadius: "10px", fontWeight: 700, fontSize: "14px", textDecoration: "none", transition: "background 0.2s" }} onMouseEnter={e => e.currentTarget.style.background = "#f5f0ff"} onMouseLeave={e => e.currentTarget.style.background = "#fff"}>Register your club →</a>
              <a href="/page1" className="hb-sans" style={{ color: "#a78bfa", fontSize: "13px", fontWeight: 600, textDecoration: "none", textAlign: "center" }} onMouseEnter={e => e.target.style.color = "#fff"} onMouseLeave={e => e.target.style.color = "#a78bfa"}>Or browse clubs first</a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}