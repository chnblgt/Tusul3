// about.js — fully translated reference implementation
import Header from "@/waterbottle/Header";
import Footer from "@/waterbottle/Footer";
import { useTranslation } from "@/waterbottle/useTranslation";

const FONT = `@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&display=swap');`;

const team = [
  { name: "Khangarid Jargalsaihan",  roleKey: "Full-Stack Developer", focusKey: "Backend & API",        color: "#6366f1" },
  { name: "Delgermurun Ganbold",     roleKey: "Graphic Designer",     focusKey: "UX/UI Designer",       color: "#6366f1" },
  { name: "Chinbiligt Dovchinbazar", roleKey: "Full-Stack Developer", focusKey: "Backend & API & Lead", color: "#6366f1" },
  { name: "Temuulen Temuujin",       roleKey: "Developer",            focusKey: "Frontend developer",   color: "#6366f1" },
  { name: "Gan-Erdene Undrakhtamir", roleKey: "Developer",            focusKey: "Frontend developer",   color: "#6366f1" },
];

const CSS = `
  ${FONT}

  @keyframes ab-up { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:none} }
  .ab-a1 { animation: ab-up 0.7s ease both; }
  .ab-a2 { animation: ab-up 0.7s ease 0.15s both; opacity: 0; }
  .ab-a3 { animation: ab-up 0.7s ease 0.3s both; opacity: 0; }

  .ab-member {
    padding: 28px;
    border: 1px solid var(--border-subtle);
    border-radius: 14px;
    background: var(--bg-card);
    transition: transform 0.22s cubic-bezier(0.34,1.4,0.64,1), box-shadow 0.22s;
  }
  .ab-member:hover { transform: translateY(-5px); box-shadow: var(--shadow-hover); }

  .ab-value-card {
    padding: 22px;
    border: 1px solid var(--border-subtle);
    border-radius: 12px;
    background: var(--bg-card);
    transition: background 0.35s;
  }

  .ab-story-grid {
    display: grid;
    grid-template-columns: 1fr 2fr;
    gap: 80px;
    align-items: start;
  }

  /* Language toggle button */
  .ab-lang-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 7px 14px;
    border-radius: 8px;
    border: 1.5px solid var(--border-subtle);
    background: var(--bg-card);
    color: var(--text-muted);
    font-family: 'DM Sans', sans-serif;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.06em;
    cursor: pointer;
    transition: all 0.2s;
  }
  .ab-lang-btn:hover {
    background: var(--accent-soft);
    color: var(--accent);
    border-color: var(--accent);
  }

  @media (max-width: 768px) {
    .ab-story-grid {
      grid-template-columns: 1fr;
      gap: 32px;
    }
  }

  @media (max-width: 480px) {
    .ab-value-grid {
      grid-template-columns: 1fr !important;
    }
    .ab-member { padding: 20px; }
  }
`;

export default function AboutPage() {
  const { lang, toggleLang, t } = useTranslation();

  const T  = t("about");   // about-page strings
  const TL = t("langToggle"); // button label

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--bg-page)", transition: "background 0.35s" }}>
      <style>{CSS}</style>

      {/* Pass lang + toggle down so Header can show the button too if desired */}
      <Header lang={lang} toggleLang={toggleLang} />

      <main style={{ flex: 1 }}>

        {/* ── Hero / Mission ───────────────────────────────────────── */}
        <section style={{
          padding: "clamp(72px, 10vw, 120px) clamp(20px, 4vw, 32px) clamp(64px, 8vw, 100px)",
          borderBottom: "1px solid var(--border-subtle)",
          background: "var(--bg-card)", transition: "background 0.35s",
        }}>
          <div style={{ maxWidth: "900px", margin: "0 auto", textAlign: "center" }} className="ab-a1">

            {/* Language toggle — top right of hero */}
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "20px" }}>
              <button
                className="ab-lang-btn"
                onClick={toggleLang}
                title={TL.title}
              >
                🌐 {TL.label}
              </button>
            </div>

            <span style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "10px", fontWeight: 700, letterSpacing: "0.18em",
              textTransform: "uppercase", color: "var(--text-muted)",
              display: "block", marginBottom: "20px",
            }}>{T.missionLabel}</span>

            <h1 style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: "clamp(2.4rem, 7vw, 5rem)",
              fontWeight: 400, lineHeight: 1.1,
              color: "var(--text-primary)", margin: "0 0 28px",
              letterSpacing: "-0.03em", transition: "color 0.35s",
            }}>
              {T.missionHeadline1}<br />
              <em style={{ fontStyle: "italic", color: "var(--accent)" }}>{T.missionHeadlineAccent}</em>
            </h1>

            <p style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "clamp(14px, 2vw, 16px)", fontWeight: 300, lineHeight: 1.85,
              color: "var(--text-secondary)", maxWidth: "580px",
              margin: "0 auto", transition: "color 0.35s",
            }}>
              {T.missionBody}
            </p>
          </div>
        </section>

        {/* ── Our Story ────────────────────────────────────────────── */}
        <section style={{ padding: "clamp(60px, 8vw, 100px) clamp(20px, 4vw, 32px)", transition: "background 0.35s" }} className="ab-a2">
          <div style={{ maxWidth: "900px", margin: "0 auto" }}>
            <div className="ab-story-grid">
              <div>
                <span style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "10px", fontWeight: 700, letterSpacing: "0.16em",
                  textTransform: "uppercase", color: "var(--text-muted)",
                  display: "block", marginBottom: "16px",
                }}>{T.storyLabel}</span>
                <h2 style={{
                  fontFamily: "'DM Serif Display', serif",
                  fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
                  fontWeight: 400, lineHeight: 1.15,
                  color: "var(--text-primary)", margin: 0,
                  letterSpacing: "-0.02em", transition: "color 0.35s",
                }}>
                  {T.storyHeadline1} <em style={{ fontStyle: "italic", color: "var(--accent)" }}>{T.storyHeadlineAccent}</em>
                </h2>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                <p style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "15px", fontWeight: 300, lineHeight: 1.85,
                  color: "var(--text-secondary)", margin: 0, transition: "color 0.35s",
                }}>
                  {/* Keep "Nest IT School" bold in both languages */}
                  {T.storyP1.split("Nest IT School").map((part, i, arr) =>
                    i < arr.length - 1
                      ? <span key={i}>{part}<strong style={{ fontWeight: 600, color: "var(--text-primary)" }}>Nest IT School</strong></span>
                      : <span key={i}>{part}</span>
                  )}
                </p>
                <p style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "15px", fontWeight: 300, lineHeight: 1.85,
                  color: "var(--text-secondary)", margin: 0, transition: "color 0.35s",
                }}>
                  {T.storyP2}
                </p>

                <div className="ab-value-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", paddingTop: "10px" }}>
                  {T.values.map(({ label, desc }) => (
                    <div key={label} className="ab-value-card">
                      <p style={{
                        fontFamily: "'DM Serif Display', serif",
                        fontSize: "15px", fontWeight: 400,
                        color: "var(--accent)", margin: "0 0 8px",
                      }}>— {label}</p>
                      <p style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: "12px", fontWeight: 300,
                        color: "var(--text-muted)", margin: 0,
                      }}>{desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── The Team ─────────────────────────────────────────────── */}
        <section style={{ padding: "clamp(60px, 8vw, 100px) clamp(20px, 4vw, 32px)", background: "var(--bg-section)", transition: "background 0.35s" }} className="ab-a3">
          <div style={{ maxWidth: "900px", margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: "clamp(40px, 5vw, 60px)" }}>
              <span style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "10px", fontWeight: 700, letterSpacing: "0.16em",
                textTransform: "uppercase", color: "var(--text-muted)",
                display: "block", marginBottom: "16px",
              }}>{T.teamLabel}</span>
              <h2 style={{
                fontFamily: "'DM Serif Display', serif",
                fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
                fontWeight: 400, lineHeight: 1.15,
                color: "var(--text-primary)", margin: 0,
                letterSpacing: "-0.02em", transition: "color 0.35s",
              }}>
                {T.teamHeadline1} <em style={{ fontStyle: "italic", color: "var(--accent)" }}>{T.teamHeadlineAccent}</em>
              </h2>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: "16px" }}>
              {team.map(({ name, roleKey, focusKey, color }) => {
                const role  = T.roles?.[roleKey]  || roleKey;
                const focus = T.focuses?.[focusKey] || focusKey;
                return (
                  <div key={name} className="ab-member">
                    <div style={{
                      width: "44px", height: "44px", borderRadius: "4px",
                      background: `${color}14`, border: `1px solid ${color}28`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      marginBottom: "16px",
                      fontFamily: "'DM Serif Display', serif",
                      fontSize: "22px", fontStyle: "italic", color,
                    }}>
                      {name[0]}
                    </div>
                    <p style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: "13px", fontWeight: 600,
                      color: "var(--text-primary)", margin: "0 0 4px",
                      lineHeight: 1.3, transition: "color 0.35s",
                    }}>{name}</p>
                    <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", fontWeight: 600, color, margin: "0 0 8px" }}>{role}</p>
                    <span style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: "10px", fontWeight: 500, color: "var(--text-muted)",
                      background: "var(--bg-input)", padding: "2px 8px",
                      borderRadius: "20px", display: "inline-block",
                    }}>{focus}</span>
                  </div>
                );
              })}
            </div>

            <p style={{
              fontFamily: "'DM Sans', sans-serif",
              textAlign: "center", marginTop: "56px",
              color: "var(--text-muted)", fontSize: "13px", fontWeight: 300,
              transition: "color 0.35s",
            }}>
              {T.teamFooter}{" "}
              <strong style={{ fontWeight: 600, color: "var(--text-primary)" }}>Nest IT School</strong>
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}