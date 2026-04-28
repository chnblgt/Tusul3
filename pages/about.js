import Header from "@/waterbottle/Header";
import Footer from "@/waterbottle/Footer";

const team = [
  {
    name: "Chinbiligt Dovchinbazar",
    role: "Full-Stack Developer",
    focus: "Backend & API",
    color: "#7c3aed",
    bg: "#f5f0ff",
  },
  {
    name: "Khangarid Jargalsaihan",
    role: "Full-Stack Developerr",
    focus: "Backend & API",
    color: "#0ea5e9",
    bg: "#f0f9ff",
  },
  {
    name: "Temuulen Temuujin",
    role: "",
    focus: "",
    color: "#10b981",
    bg: "#f0fdf4",
  },
  {
    name: "Delgermurun Ganbold",
    role: "Graphic Designer",
    focus: "UI & Design Systems",
    color: "#f59e0b",
    bg: "#fffbeb",
  },
  {
    name: "Gan-Erdene Undrakhtamir",
    role: "API",
    focus: "Unemployed",
    color: "#ec4899",
    bg: "#fdf2f8",
  },
];

export default function AboutPage() {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        background: "var(--bg-page)",
        position: "relative",
      }}
    >
      <style>{styles}</style>
      <div aria-hidden="true" className="ab-bg-canvas">
        <div className="ab-orb ab-orb-1" />
        <div className="ab-orb ab-orb-2" />
        <div className="ab-orb ab-orb-3" />
        <div className="ab-orb ab-orb-4" />
        <div className="ab-orb ab-orb-5" />
        <svg className="ab-ring ab-ring-1" viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="150" cy="150" r="140" stroke="#7c3aed" strokeWidth="1" strokeOpacity="0.12" strokeDasharray="8 6" />
          <circle cx="150" cy="150" r="100" stroke="#a78bfa" strokeWidth="0.6" strokeOpacity="0.08" />
        </svg>
        <svg className="ab-ring ab-ring-2" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="100" cy="100" r="90" stroke="#c4b5fd" strokeWidth="1.2" strokeOpacity="0.15" strokeDasharray="4 8" />
        </svg>
        <svg className="ab-ring ab-ring-3" viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="10" y="10" width="140" height="140" rx="24" stroke="#7c3aed" strokeWidth="0.8" strokeOpacity="0.1" strokeDasharray="6 5" />
        </svg>
        <div className="ab-dot ab-dot-1" />
        <div className="ab-dot ab-dot-2" />
        <div className="ab-dot ab-dot-3" />
        <div className="ab-dot ab-dot-4" />
        <div className="ab-dot ab-dot-5" />
        <div className="ab-dot ab-dot-6" />
        <div className="ab-blob ab-blob-1" />
        <div className="ab-blob ab-blob-2" />
        <div className="ab-blob ab-blob-3" />
        <svg className="ab-tri ab-tri-1" viewBox="0 0 80 80" fill="none">
          <polygon points="40,4 76,72 4,72" stroke="#7c3aed" strokeWidth="1" strokeOpacity="0.1" fill="rgba(124,58,237,0.04)" />
        </svg>
        <svg className="ab-tri ab-tri-2" viewBox="0 0 60 60" fill="none">
          <polygon points="30,2 58,56 2,56" stroke="#a78bfa" strokeWidth="1" strokeOpacity="0.12" fill="rgba(167,139,250,0.06)" />
        </svg>
        <svg className="ab-tri ab-tri-3" viewBox="0 0 50 50" fill="none">
          <polygon points="25,2 48,46 2,46" stroke="#c4b5fd" strokeWidth="0.8" strokeOpacity="0.1" fill="none" />
        </svg>
        <svg className="ab-cross ab-cross-1" viewBox="0 0 24 24" fill="none">
          <line x1="12" y1="2" x2="12" y2="22" stroke="#7c3aed" strokeWidth="1.5" strokeOpacity="0.18" />
          <line x1="2" y1="12" x2="22" y2="12" stroke="#7c3aed" strokeWidth="1.5" strokeOpacity="0.18" />
        </svg>
        <svg className="ab-cross ab-cross-2" viewBox="0 0 24 24" fill="none">
          <line x1="12" y1="2" x2="12" y2="22" stroke="#a78bfa" strokeWidth="1.5" strokeOpacity="0.15" />
          <line x1="2" y1="12" x2="22" y2="12" stroke="#a78bfa" strokeWidth="1.5" strokeOpacity="0.15" />
        </svg>
        <svg className="ab-cross ab-cross-3" viewBox="0 0 24 24" fill="none">
          <line x1="12" y1="2" x2="12" y2="22" stroke="#c4b5fd" strokeWidth="1" strokeOpacity="0.12" />
          <line x1="2" y1="12" x2="22" y2="12" stroke="#c4b5fd" strokeWidth="1" strokeOpacity="0.12" />
        </svg>
        <svg className="ab-diamond ab-diamond-1" viewBox="0 0 40 40" fill="none">
          <rect x="5" y="5" width="30" height="30" rx="4" transform="rotate(45 20 20)" stroke="#7c3aed" strokeWidth="1" strokeOpacity="0.14" fill="rgba(124,58,237,0.05)" />
        </svg>
        <svg className="ab-diamond ab-diamond-2" viewBox="0 0 28 28" fill="none">
          <rect x="3" y="3" width="22" height="22" rx="3" transform="rotate(45 14 14)" stroke="#a78bfa" strokeWidth="1" strokeOpacity="0.12" fill="none" />
        </svg>
      </div>

      <Header />

      <main style={{ flex: 1, padding: "80px 24px", position: "relative", zIndex: 1 }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <section style={{ textAlign: "center", marginBottom: "100px" }} className="ab-a1">
            <span
              className="ab-sans"
              style={{
                color: "#7c3aed", fontWeight: 700, fontSize: "11px",
                letterSpacing: "0.14em", textTransform: "uppercase",
                background: "rgba(124,58,237,0.08)",
                border: "1px solid rgba(124,58,237,0.18)",
                padding: "5px 14px", borderRadius: "20px",
                display: "inline-block",
              }}
            >
              Our Mission
            </span>
            <h1
              className="ab-display"
              style={{
                fontSize: "clamp(40px, 8vw, 64px)", color: "var(--text-primary)",
                lineHeight: 1.1, marginTop: "24px", letterSpacing: "-0.04em",
              }}
            >
              Spend your time <br />
              <span style={{ color: "#7c3aed", fontStyle: "italic" }}>productively.</span>
            </h1>
            <p
              className="ab-sans"
              style={{
                fontSize: "18px", color: "var(--text-secondary)", maxWidth: "600px",
                margin: "30px auto 0", lineHeight: 1.7,
              }}
            >
              Duguilan.mn provides quick access to clubs and activities across
              Ulaanbaatar. We believe that every student deserves an easy way to
              discover their passions and turn their free time into meaningful
              growth.
            </p>
          </section>
          <section
            style={{
              background: "var(--bg-card)",
              backdropFilter: "blur(14px)",
              borderRadius: "32px",
              padding: "60px",
              border: "1px solid var(--border-subtle)",
              marginBottom: "100px",
              position: "relative",
              overflow: "hidden",
            }}
            className="ab-a2"
          >
            <div style={{
              position: "absolute", top: "-60px", right: "-60px",
              width: "200px", height: "200px", borderRadius: "50%",
              background: "radial-gradient(circle, rgba(196,181,253,0.25) 0%, transparent 70%)",
              pointerEvents: "none",
            }} />
            <h2
              className="ab-display"
              style={{ fontSize: "32px", color: "var(--text-primary)", marginBottom: "40px", letterSpacing: "-0.03em" }}
            >
              The Story
            </h2>
            <div
              className="ab-sans ab-story-grid"
              style={{ fontSize: "16px", color: "var(--text-secondary)", lineHeight: 1.8 }}
            >
              <div>
                <p>
                  What started as a simple idea at{" "}
                  <strong style={{ color: "var(--text-primary)" }}>Nest IT School</strong> has grown
                  into a dedicated platform for the Mongolian student community. We
                  noticed that while Ulaanbaatar is full of talent, finding the right
                  place to start is often the hardest part.
                </p>
              </div>
              <div>
                <p>
                  Duguilan.mn bridges that gap by centralising information and helping
                  club leaders reach the people who need them most. We are committed to
                  building a digital space where community and productivity meet.
                </p>
              </div>
            </div>
          </section>
          <section className="ab-a3">
            <div style={{ textAlign: "center", marginBottom: "48px" }}>
              <span
                className="ab-sans"
                style={{
                  color: "#7c3aed", fontWeight: 700, fontSize: "11px",
                  letterSpacing: "0.14em", textTransform: "uppercase",
                  background: "rgba(124,58,237,0.08)",
                  border: "1px solid rgba(124,58,237,0.18)",
                  padding: "5px 14px", borderRadius: "20px",
                  display: "inline-block", marginBottom: "16px",
                }}
              >
                The Team
              </span>
              <h2
                className="ab-display"
                style={{ fontSize: "36px", color: "var(--text-primary)", letterSpacing: "-0.03em", margin: "0 auto" }}
              >
                Who built this
              </h2>
            </div>

            <div className="ab-team-grid">
              {team.map((member) => (
                <div key={member.name} className="ab-member-card">
                  <div
                    style={{
                      width: "60px", height: "60px",
                      background: member.bg,
                      borderRadius: "16px",
                      marginBottom: "20px",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: member.color, fontWeight: 800, fontSize: "24px",
                      border: `1.5px solid ${member.color}22`,
                      flexShrink: 0,
                    }}
                  >
                    {member.name[0]}
                  </div>
                  <p
                    className="ab-sans"
                    style={{ fontWeight: 700, color: "var(--text-primary)", margin: "0 0 4px", lineHeight: 1.3, fontSize: "15px" }}
                  >
                    {member.name}
                  </p>
                  <p
                    className="ab-sans"
                    style={{
                      fontSize: "12px", color: member.color,
                      margin: "0 0 6px", fontWeight: 700, letterSpacing: "0.03em",
                    }}
                  >
                    {member.role}
                  </p>
                  <p
                    className="ab-sans"
                    style={{
                      fontSize: "11px", color: "var(--text-muted)",
                      margin: 0, fontWeight: 500,
                      background: "var(--bg-input)", padding: "3px 10px",
                      borderRadius: "20px", display: "inline-block",
                    }}
                  >
                    {member.focus}
                  </p>
                </div>
              ))}
            </div>

            <p
              className="ab-sans"
              style={{ textAlign: "center", marginTop: "56px", color: "#9879d4", fontSize: "14px" }}
            >
              Built with ❤️ by a student team at{" "}
              <strong style={{ color: "#7c3aed" }}>Nest IT School</strong>
            </p>
          </section>

        </div>
      </main>

      <Footer />
    </div>
  );
}

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,700;0,9..144,800;1,9..144,700&family=DM+Sans:wght@400;500;600;700&display=swap');
  .ab-display { font-family: 'Fraunces', serif; }
  .ab-sans    { font-family: 'DM Sans', sans-serif; }

  /* ── Entrance animations ── */
  @keyframes ab-fadeUp {
    from { opacity: 0; transform: translateY(22px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .ab-a1 { animation: ab-fadeUp 0.7s ease-out forwards; }
  .ab-a2 { animation: ab-fadeUp 0.7s ease-out 0.18s forwards; opacity: 0; }
  .ab-a3 { animation: ab-fadeUp 0.7s ease-out 0.36s forwards; opacity: 0; }

  /* ── Background canvas ── */
  .ab-bg-canvas {
    position: fixed; inset: 0;
    pointer-events: none; overflow: hidden; z-index: 0;
  }

  /* ── Orbs ── */
  @keyframes ab-orb-drift1 {
    0%,100% { transform: translate(0,0) scale(1); }
    33%     { transform: translate(40px,-30px) scale(1.05); }
    66%     { transform: translate(-20px,50px) scale(0.97); }
  }
  @keyframes ab-orb-drift2 {
    0%,100% { transform: translate(0,0) scale(1); }
    40%     { transform: translate(-60px,40px) scale(1.08); }
    70%     { transform: translate(30px,-20px) scale(0.95); }
  }
  @keyframes ab-orb-drift3 {
    0%,100% { transform: translate(0,0) rotate(0deg); }
    50%     { transform: translate(20px,30px) rotate(8deg); }
  }

  .ab-orb {
    position: absolute; border-radius: 50%; filter: blur(60px);
    opacity: 0.18;
  }
  .ab-orb-1 {
    width: 480px; height: 480px; top: -120px; left: -80px;
    background: radial-gradient(circle, #7c3aed, #4c1d95);
    animation: ab-orb-drift1 18s ease-in-out infinite;
  }
  .ab-orb-2 {
    width: 360px; height: 360px; top: 30%; right: -100px;
    background: radial-gradient(circle, #a78bfa, #7c3aed);
    animation: ab-orb-drift2 24s ease-in-out infinite;
  }
  .ab-orb-3 {
    width: 280px; height: 280px; bottom: 10%; left: 20%;
    background: radial-gradient(circle, #c4b5fd, #8b5cf6);
    animation: ab-orb-drift3 20s ease-in-out infinite;
  }
  .ab-orb-4 {
    width: 200px; height: 200px; top: 55%; left: -60px;
    background: radial-gradient(circle, #ddd6fe, #a78bfa);
    opacity: 0.14;
    animation: ab-orb-drift1 28s ease-in-out infinite reverse;
  }
  .ab-orb-5 {
    width: 320px; height: 320px; bottom: -80px; right: 10%;
    background: radial-gradient(circle, #ede9fe, #7c3aed);
    opacity: 0.12;
    animation: ab-orb-drift2 22s ease-in-out infinite 6s;
  }

  /* ── Rings ── */
  @keyframes ab-spin-slow { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
  @keyframes ab-spin-rev  { from{transform:rotate(0deg)} to{transform:rotate(-360deg)} }
  @keyframes ab-spin-tilt {
    0%,100% { transform: rotate(0deg) scale(1); }
    50%     { transform: rotate(180deg) scale(1.04); }
  }

  .ab-ring { position: absolute; }
  .ab-ring-1 {
    width: 340px; height: 340px; top: 60px; right: 80px;
    animation: ab-spin-slow 60s linear infinite;
    opacity: 0.7;
  }
  .ab-ring-2 {
    width: 220px; height: 220px; bottom: 200px; left: 40px;
    animation: ab-spin-rev 45s linear infinite;
    opacity: 0.7;
  }
  .ab-ring-3 {
    width: 180px; height: 180px; top: 45%; right: 15%;
    animation: ab-spin-tilt 30s ease-in-out infinite;
    opacity: 0.6;
  }

  /* ── Dots ── */
  @keyframes ab-dot-float {
    0%,100% { transform: translateY(0) scale(1); opacity: .5; }
    50%     { transform: translateY(-18px) scale(1.2); opacity: 1; }
  }

  .ab-dot {
    position: absolute; border-radius: 50%;
    background: #7c3aed;
  }
  .ab-dot-1 { width:10px; height:10px; top:22%; left:12%; opacity:.2; animation:ab-dot-float 5s ease-in-out infinite; }
  .ab-dot-2 { width:6px;  height:6px;  top:38%; right:22%; opacity:.18; animation:ab-dot-float 7s ease-in-out infinite 1s; background:#a78bfa; }
  .ab-dot-3 { width:8px;  height:8px;  bottom:35%; left:30%; opacity:.15; animation:ab-dot-float 6s ease-in-out infinite 2s; background:#c4b5fd; }
  .ab-dot-4 { width:12px; height:12px; top:70%; right:35%; opacity:.12; animation:ab-dot-float 8s ease-in-out infinite 0.5s; }
  .ab-dot-5 { width:5px;  height:5px;  top:15%; right:40%; opacity:.2; animation:ab-dot-float 4.5s ease-in-out infinite 3s; background:#4c1d95; }
  .ab-dot-6 { width:9px;  height:9px;  bottom:18%; right:12%; opacity:.16; animation:ab-dot-float 6.5s ease-in-out infinite 1.5s; background:#8b5cf6; }

  /* ── Blobs ── */
  @keyframes ab-blob-drift {
    0%,100% { transform: translate(0,0) rotate(0deg) scale(1); }
    33%     { transform: translate(30px,-40px) rotate(4deg) scale(1.06); }
    66%     { transform: translate(-20px,20px) rotate(-2deg) scale(0.96); }
  }

  .ab-blob {
    position: absolute; border-radius: 50%;
    filter: blur(30px); opacity: 0.08;
  }
  .ab-blob-1 {
    width: 160px; height: 120px; top: 20%; left: 55%;
    background: #7c3aed;
    animation: ab-blob-drift 16s ease-in-out infinite;
  }
  .ab-blob-2 {
    width: 100px; height: 140px; top: 65%; right: 28%;
    background: #4c1d95;
    animation: ab-blob-drift 21s ease-in-out infinite 4s;
  }
  .ab-blob-3 {
    width: 130px; height: 90px; bottom: 25%; left: 8%;
    background: #a78bfa;
    animation: ab-blob-drift 19s ease-in-out infinite 2s;
  }

  /* ── Triangles ── */
  @keyframes ab-tri-float {
    0%,100% { transform: translateY(0) rotate(0deg); }
    50%     { transform: translateY(-24px) rotate(10deg); }
  }
  @keyframes ab-tri-drift {
    0%,100% { transform: translate(0,0) rotate(0deg); }
    50%     { transform: translate(16px,-16px) rotate(-12deg); }
  }

  .ab-tri { position: absolute; }
  .ab-tri-1 { width:90px; height:90px; top:18%; left:6%; animation:ab-tri-float 11s ease-in-out infinite; opacity:.9; }
  .ab-tri-2 { width:65px; height:65px; bottom:28%; right:8%; animation:ab-tri-drift 14s ease-in-out infinite 3s; opacity:.9; }
  .ab-tri-3 { width:55px; height:55px; top:50%; left:44%; animation:ab-tri-float 9s ease-in-out infinite 1s; opacity:.8; }

  /* ── Crosses ── */
  @keyframes ab-cross-spin {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }
  @keyframes ab-cross-pulse {
    0%,100% { transform: scale(1) rotate(0deg); opacity:.8; }
    50%     { transform: scale(1.3) rotate(45deg); opacity:1; }
  }

  .ab-cross { position: absolute; }
  .ab-cross-1 { width:28px; height:28px; top:30%; right:12%; animation:ab-cross-spin 20s linear infinite; }
  .ab-cross-2 { width:22px; height:22px; bottom:40%; left:20%; animation:ab-cross-pulse 6s ease-in-out infinite; }
  .ab-cross-3 { width:18px; height:18px; top:78%; right:30%; animation:ab-cross-spin 15s linear infinite reverse; }

  /* ── Diamonds ── */
  @keyframes ab-diamond-float {
    0%,100% { transform: translateY(0) rotate(0deg); }
    50%     { transform: translateY(-20px) rotate(20deg); }
  }

  .ab-diamond { position: absolute; }
  .ab-diamond-1 { width:48px; height:48px; top:42%; left:3%; animation:ab-diamond-float 12s ease-in-out infinite; }
  .ab-diamond-2 { width:34px; height:34px; bottom:12%; left:55%; animation:ab-diamond-float 9s ease-in-out infinite 2s; }

  /* ── Team grid ── */
  .ab-team-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 24px;
  }

  .ab-member-card {
    background: var(--bg-card);
    padding: 32px 24px;
    border-radius: 24px;
    border: 1.5px solid var(--border-subtle);
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    transition: transform 0.22s cubic-bezier(.34,1.56,.64,1), box-shadow 0.22s ease;
  }
  .ab-member-card:hover {
    transform: translateY(-6px);
    box-shadow: 0 20px 48px rgba(124,58,237,0.1);
  }

  /* ── Story grid ── */
  .ab-story-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 40px;
  }

  /* ── Responsive ── */
  @media (max-width: 700px) {
    .ab-story-grid { grid-template-columns: 1fr !important; gap: 20px !important; }
    .ab-ring-1, .ab-ring-2, .ab-ring-3 { display: none; }
  }
`;