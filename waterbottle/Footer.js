import { useDarkMode } from "./useDarkMode";

export default function Footer() {
  const { dark } = useDarkMode();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,700;0,9..144,800&family=DM+Sans:wght@400;500;600&display=swap');
        .ft-logo { font-family: 'Fraunces', serif; }
        .ft-body { font-family: 'DM Sans', sans-serif; }
        .ft-link {
          text-decoration: none;
          font-size: 13px;
          font-family: 'DM Sans', sans-serif;
          font-weight: 500;
          transition: color 0.2s;
          display: block;
          line-height: 1;
        }
        .ft-social {
          width: 36px; height: 36px;
          border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: all 0.2s;
          font-size: 11px; font-weight: 700;
          text-decoration: none;
          font-family: 'DM Sans', sans-serif;
          letter-spacing: 0.02em;
        }
      `}</style>

      <footer style={{ background: "var(--bg-card)", borderTop: "2px solid var(--border-subtle)", transition: "background 0.3s, border-color 0.3s", boxShadow: "0 -4px 24px rgba(26,5,51,0.10)", position: "relative", zIndex: 10 }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "52px 36px 44px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: "56px", marginBottom: "52px" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "18px" }}>
                <img src="/assets/logo1.png" alt="Logo" width={30} height={30} style={{ borderRadius: "7px" }} />
                <span className="ft-logo" style={{
                  fontSize: "17px", fontWeight: 800, letterSpacing: "-0.03em",
                  color: "var(--text-primary)", transition: "color 0.3s",
                }}>
                  Duguilan<span style={{ color: "#7c3aed" }}>.mn</span>
                </span>
              </div>
              <p style={{
                color: "var(--text-muted)", fontSize: "13px", lineHeight: 1.75,
                maxWidth: "220px", fontFamily: "'DM Sans', sans-serif",
                margin: "0 0 22px", transition: "color 0.3s",
              }}>
                Discover clubs, events, and experiences across Mongolia.
              </p>
              <div style={{ display: "flex", gap: "8px" }}>
                {["FB", "IG", "TW"].map(s => (
                  <a key={s} className="ft-social" style={{
                    border: `1px solid var(--border-subtle)`,
                    background: dark ? "rgba(124,58,237,0.08)" : "rgba(124,58,237,0.04)",
                    color: "var(--text-muted)",
                    transition: "all 0.2s",
                  }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = "#7c3aed";
                      e.currentTarget.style.color = dark ? "#c4b5fd" : "#7c3aed";
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.background = "rgba(124,58,237,0.15)";
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = "var(--border-subtle)";
                      e.currentTarget.style.color = "var(--text-muted)";
                      e.currentTarget.style.transform = "none";
                      e.currentTarget.style.background = dark ? "rgba(124,58,237,0.08)" : "rgba(124,58,237,0.04)";
                    }}
                  >{s}</a>
                ))}
              </div>
            </div>
            <div>
              <h3 style={{
                color: "var(--text-muted)", fontSize: "10px", fontWeight: 700,
                letterSpacing: "0.14em", textTransform: "uppercase",
                marginBottom: "20px", fontFamily: "'DM Sans', sans-serif",
                transition: "color 0.3s",
              }}>
                Navigate
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                {[
                  { label: "Home",           href: "/page" },
                  { label: "Categories",     href: "/page1" },
                  { label: "Events",         href: "#" },
                  { label: "About Us",       href: "#" },
                  { label: "Register Club",  href: "/club-register" },
                ].map(({ label, href }) => (
                  <a key={label} href={href} className="ft-link"
                    style={{ color: "var(--text-muted)" }}
                    onMouseEnter={e => e.currentTarget.style.color = "#7c3aed"}
                    onMouseLeave={e => e.currentTarget.style.color = "var(--text-muted)"}
                  >{label}</a>
                ))}
              </div>
            </div>
            <div>
              <h3 style={{
                color: "var(--text-muted)", fontSize: "10px", fontWeight: 700,
                letterSpacing: "0.14em", textTransform: "uppercase",
                marginBottom: "20px", fontFamily: "'DM Sans', sans-serif",
                transition: "color 0.3s",
              }}>
                Contact
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                {[
                  "Ulaanbaatar, Mongolia",
                  "info@duguilan.mn",
                  "+976 99116769",
                ].map(t => (
                  <span key={t} style={{
                    color: "var(--text-muted)", fontSize: "13px",
                    fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
                    transition: "color 0.3s",
                  }}>{t}</span>
                ))}
              </div>
            </div>
          </div>
          <div style={{
            borderTop: "1px solid var(--border-subtle)",
            paddingTop: "28px",
            display: "flex", justifyContent: "space-between", alignItems: "center",
            transition: "border-color 0.3s",
          }}>
            <p style={{
              color: "var(--text-secondary)", fontSize: "12px",
              fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
              transition: "color 0.3s",
            }}>
              © 2026 Duguilan.mn — School Project
            </p>
            <span style={{
              fontSize: "10.5px", color: "var(--text-muted)",
              fontWeight: 700, letterSpacing: "0.1em",
              textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif",
              transition: "color 0.3s",
            }}>
              Made by Enjoy Crew
            </span>
          </div>
        </div>
      </footer>
    </>
  );
}