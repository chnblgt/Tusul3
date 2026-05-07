import Header from "@/waterbottle/Header";
import Footer from "@/waterbottle/Footer";

const FONT = `@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&display=swap');`;

const team = [
  { name: "Chinbiligt Dovchinbazar", role: "Full-Stack Developer", focus: "Backend & API",       color: "#5533bb" },
  { name: "Khangarid Jargalsaihan",  role: "Full-Stack Developer", focus: "Backend & API",       color: "#2563eb" },
  { name: "Temuulen Temuujin",       role: "Developer",            focus: "Engineering",          color: "#0d9488" },
  { name: "Delgermurun Ganbold",     role: "Graphic Designer",     focus: "UI & Design Systems", color: "#ca8a04" },
  { name: "Gan-Erdene Undrakhtamir", role: "Developer",            focus: "API Integration",      color: "#db2777" },
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
`;

export default function AboutPage() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--bg-page)", transition: "background 0.35s" }}>
      <style>{CSS}</style>
      <Header />

      <main style={{ flex: 1 }}>
        <section style={{
          padding: "120px 32px 100px",
          borderBottom: "1px solid var(--border-subtle)",
          background: "var(--bg-card)", transition: "background 0.35s",
        }}>
          <div style={{ maxWidth: "900px", margin: "0 auto", textAlign: "center" }} className="ab-a1">
            <span style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "10px", fontWeight: 700, letterSpacing: "0.18em",
              textTransform: "uppercase", color: "var(--text-muted)",
              display: "block", marginBottom: "20px",
            }}>Our Mission</span>

            <h1 style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: "clamp(3rem, 7vw, 5rem)",
              fontWeight: 400, lineHeight: 1.1,
              color: "var(--text-primary)", margin: "0 0 28px",
              letterSpacing: "-0.03em", transition: "color 0.35s",
            }}>
              Spend your time<br />
              <em style={{ fontStyle: "italic", color: "var(--accent)" }}>productively.</em>
            </h1>

            <p style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "16px", fontWeight: 300, lineHeight: 1.85,
              color: "var(--text-secondary)", maxWidth: "580px",
              margin: "0 auto", transition: "color 0.35s",
            }}>
              Duguilan.com provides quick access to clubs and activities across Ulaanbaatar. Every student deserves an easy way to discover their passions and turn free time into meaningful growth.
            </p>
          </div>
        </section>

        <section style={{ padding: "100px 32px", transition: "background 0.35s" }} className="ab-a2">
          <div style={{ maxWidth: "900px", margin: "0 auto" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "80px", alignItems: "start" }}>
              <div>
                <span style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "10px", fontWeight: 700, letterSpacing: "0.16em",
                  textTransform: "uppercase", color: "var(--text-muted)",
                  display: "block", marginBottom: "16px",
                }}>Our Story</span>
                <h2 style={{
                  fontFamily: "'DM Serif Display', serif",
                  fontSize: "clamp(2rem, 4vw, 2.8rem)",
                  fontWeight: 400, lineHeight: 1.15,
                  color: "var(--text-primary)", margin: 0,
                  letterSpacing: "-0.02em", transition: "color 0.35s",
                }}>
                  Built with <em style={{ fontStyle: "italic", color: "var(--accent)" }}>purpose.</em>
                </h2>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                <p style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "15px", fontWeight: 300, lineHeight: 1.85,
                  color: "var(--text-secondary)", margin: 0, transition: "color 0.35s",
                }}>
                  What started as a simple idea at <strong style={{ fontWeight: 600, color: "var(--text-primary)" }}>Nest IT School</strong> has grown into a dedicated platform for the Mongolian student community. Ulaanbaatar is full of talent — finding the right place to start is often the hardest part.
                </p>
                <p style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "15px", fontWeight: 300, lineHeight: 1.85,
                  color: "var(--text-secondary)", margin: 0, transition: "color 0.35s",
                }}>
                  Duguilan.com bridges that gap by centralising information and helping club leaders reach the people who need them most.
                </p>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", paddingTop: "10px" }}>
                  {[
                    { marker: "—", label: "Accessible", desc: "Free for everyone, always" },
                    { marker: "—", label: "Community-first", desc: "Built around connection" },
                    { marker: "—", label: "Student-focused", desc: "Made for young Mongolians" },
                    { marker: "—", label: "Open platform", desc: "Any club can join" },
                  ].map(({ marker, label, desc }) => (
                    <div key={label} className="ab-value-card">
                      <p style={{
                        fontFamily: "'DM Serif Display', serif",
                        fontSize: "15px", fontWeight: 400,
                        color: "var(--accent)", margin: "0 0 8px",
                      }}>{marker} {label}</p>
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
        <section style={{ padding: "100px 32px", background: "var(--bg-section)", transition: "background 0.35s" }} className="ab-a3">
          <div style={{ maxWidth: "900px", margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: "60px" }}>
              <span style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "10px", fontWeight: 700, letterSpacing: "0.16em",
                textTransform: "uppercase", color: "var(--text-muted)",
                display: "block", marginBottom: "16px",
              }}>The Team</span>
              <h2 style={{
                fontFamily: "'DM Serif Display', serif",
                fontSize: "clamp(2rem, 4vw, 2.8rem)",
                fontWeight: 400, lineHeight: 1.15,
                color: "var(--text-primary)", margin: 0,
                letterSpacing: "-0.02em", transition: "color 0.35s",
              }}>
                Who built <em style={{ fontStyle: "italic", color: "var(--accent)" }}>this.</em>
              </h2>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "16px" }}>
              {team.map(({ name, role, focus, color }) => (
                <div key={name} className="ab-member">
                  <div style={{
                    width: "44px", height: "44px", borderRadius: "10px",
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
              ))}
            </div>

            <p style={{
              fontFamily: "'DM Sans', sans-serif",
              textAlign: "center", marginTop: "56px",
              color: "var(--text-muted)", fontSize: "13px", fontWeight: 300,
              transition: "color 0.35s",
            }}>
              Built with care by a student team at{" "}
              <strong style={{ fontWeight: 600, color: "var(--text-primary)" }}>Nest IT School</strong>
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}