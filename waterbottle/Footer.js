import Link from "next/link";

const FONT = `@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');`;

const navCols = [
  {
    heading: "Platform",
    links: [
      { label: "Home", href: "/page" },
      { label: "Explore Clubs", href: "/page1" },
      { label: "Events", href: "#" },
      { label: "Register a Club", href: "/club-register" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Contact", href: "#" },
      { label: "Privacy", href: "#" },
      { label: "Terms", href: "#" },
    ],
  },
];

export default function Footer() {
  return (
    <>
      <style>{`
        ${FONT}

        .ft-link {
          font-family: 'DM Sans', sans-serif;
          font-size: 13px; font-weight: 400;
          color: var(--text-muted);
          text-decoration: none;
          transition: color 0.2s;
          display: inline-block;
          line-height: 1;
        }
        .ft-link:hover { color: var(--text-primary); }

        .ft-social {
          width: 34px; height: 34px;
          border: 1px solid var(--border-subtle);
          border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          color: var(--text-muted);
          font-size: 10px; font-weight: 700;
          font-family: 'DM Sans', sans-serif;
          text-decoration: none;
          transition: all 0.2s;
          letter-spacing: 0.04em;
        }
        .ft-social:hover {
          border-color: var(--accent);
          color: var(--accent);
          background: var(--accent-soft);
        }

        .ft-grid {
          display: grid;
          grid-template-columns: 1.8fr 1fr 1fr 1fr;
          gap: 48px;
          margin-bottom: 56px;
        }

        @media (max-width: 768px) {
          .ft-grid {
            grid-template-columns: 1fr 1fr;
            gap: 32px;
            margin-bottom: 40px;
          }
          .ft-brand-col {
            grid-column: 1 / -1;
          }
        }

        @media (max-width: 480px) {
          .ft-grid {
            grid-template-columns: 1fr;
            gap: 28px;
          }
          .ft-brand-col {
            grid-column: auto;
          }
        }
      `}</style>

      <footer style={{
        borderTop: "1px solid var(--border-subtle)",
        background: "var(--bg-card)",
        transition: "background 0.35s",
      }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "clamp(40px, 6vw, 64px) clamp(20px, 4vw, 32px) clamp(32px, 5vw, 48px)" }}>
          <div className="ft-grid">
            {/* Brand */}
            <div className="ft-brand-col">
              <Link href="/page" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "8px", marginBottom: "18px" }}>
                <div style={{
                  width: "26px", height: "26px",
                  background: "var(--accent)",
                  borderRadius: "6px",
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>
                  <img src="/assets/logo_white.png" alt="" width={14} height={14} style={{ display: "block" }} />
                </div>
                <span style={{
                  fontFamily: "'DM Serif Display', serif",
                  fontSize: "18px",
                  color: "var(--text-primary)",
                  letterSpacing: "-0.01em",
                }}>
                  Duguilan<span style={{ color: "var(--accent)", fontStyle: "italic" }}>.com</span>
                </span>
              </Link>
              <p style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "13px", fontWeight: 300, lineHeight: 1.8,
                color: "var(--text-muted)",
                maxWidth: "220px", margin: "0 0 24px",
              }}>
                Mongolia&apos;s platform for discovering clubs, communities, and shared passions.
              </p>
              <div style={{ display: "flex", gap: "8px" }}>
                {["FB", "IG", "TW"].map(s => (
                  <Link key={s} href="#" className="ft-social">{s}</Link>
                ))}
              </div>
            </div>

            {/* Nav columns */}
            {navCols.map(({ heading, links }) => (
              <div key={heading}>
                <p style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "10px", fontWeight: 700,
                  letterSpacing: "0.14em", textTransform: "uppercase",
                  color: "var(--text-muted)", margin: "0 0 20px",
                }}>
                  {heading}
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                  {links.map(({ label, href }) => (
                    <Link key={label} href={href} className="ft-link">{label}</Link>
                  ))}
                </div>
              </div>
            ))}

            {/* Contact */}
            <div>
              <p style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "10px", fontWeight: 700,
                letterSpacing: "0.14em", textTransform: "uppercase",
                color: "var(--text-muted)", margin: "0 0 20px",
              }}>
                Contact
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                {[
                  { label: "Location", text: "Ulaanbaatar, Mongolia" },
                  { label: "Email", text: "duguilanmail@gmail.com" },
                  { label: "Phone", text: "+976 99116769" },
                ].map(({ label, text }) => (
                  <div key={text}>
                    <span style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: "10px", fontWeight: 600,
                      letterSpacing: "0.1em", textTransform: "uppercase",
                      color: "var(--accent)", display: "block", marginBottom: "3px",
                    }}>{label}</span>
                    <span style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: "13px", color: "var(--text-muted)", fontWeight: 400,
                    }}>{text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div style={{
            borderTop: "1px solid var(--border-subtle)",
            paddingTop: "28px",
            display: "flex", justifyContent: "space-between",
            alignItems: "center", flexWrap: "wrap", gap: "12px",
          }}>
            <p style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "12px", fontWeight: 400,
              color: "var(--text-muted)", margin: 0,
            }}>
              &copy; 2026 Duguilan.com &mdash; Nest IT School
            </p>
            <p style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "11px", fontWeight: 600,
              letterSpacing: "0.1em", textTransform: "uppercase",
              color: "var(--text-muted)", margin: 0,
            }}>
              Made with care by Enjoy Crew
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}