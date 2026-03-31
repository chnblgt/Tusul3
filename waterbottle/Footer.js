export default function Footer() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,700;0,9..144,800&family=DM+Sans:wght@400;500;600&display=swap');
        .ft-logo { font-family: 'Fraunces', serif; }
        .ft-body { font-family: 'DM Sans', sans-serif; }
        .ft-link {
          color: #a08ac0;
          text-decoration: none;
          font-size: 13px;
          font-family: 'DM Sans', sans-serif;
          font-weight: 500;
          transition: color 0.2s;
          display: block;
          line-height: 1;
        }
        .ft-link:hover { color: #e9d5ff; }
        .ft-social {
          width: 36px; height: 36px;
          border: 1px solid rgba(167,139,250,0.2);
          border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: all 0.2s;
          font-size: 11px; font-weight: 700;
          color: #a08ac0; text-decoration: none;
          font-family: 'DM Sans', sans-serif;
          letter-spacing: 0.02em;
        }
        .ft-social:hover {
          border-color: #7c3aed;
          color: #e9d5ff;
          transform: translateY(-2px);
          background: rgba(124,58,237,0.15);
        }
      `}</style>

      <footer>
       <div style={{
  height: "120px",
  background: "linear-gradient(to bottom, #ffffff 0%, #f8f5ff 20%, #ede6ff 38%, #d4c8f0 52%, #9b88c8 68%, #43385d 85%, #0d0118 100%)",
}} />
        <div style={{ background: "#0d0118" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "52px 36px 44px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: "56px", marginBottom: "52px" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "18px" }}>
                  <img src="/assets/logo_white.png" alt="Logo" width={30} height={30} style={{ borderRadius: "7px" }} />
                  <span className="ft-logo" style={{ fontSize: "17px", fontWeight: 800, letterSpacing: "-0.03em" }}>
                    <span style={{ color: "#fff" }}>Duguilan</span><span style={{ color: "#fff" }}>.mn</span>
                  </span>
                </div>
                <p style={{ color: "#7a6090", fontSize: "13px", lineHeight: 1.75, maxWidth: "220px", fontFamily: "'DM Sans', sans-serif", margin: "0 0 22px" }}>
                  Discover clubs, events, and experiences across Mongolia.
                </p>
                <div style={{ display: "flex", gap: "8px" }}>
                  <a className="ft-social">FB</a>
                  <a className="ft-social">IG</a>
                  <a className="ft-social">TW</a>
                </div>
              </div>
              <div>
                <h3 style={{
                  color: "#5b3d8a", fontSize: "10px", fontWeight: 700,
                  letterSpacing: "0.14em", textTransform: "uppercase",
                  marginBottom: "20px", fontFamily: "'DM Sans', sans-serif",
                }}>
                  Navigate
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                  {[
                    { label: "Home", href: "/page" },
                    { label: "Categories", href: "/page1" },
                    { label: "Events", href: "#" },
                    { label: "About Us", href: "#" },
                    { label: "Register Club", href: "/club-register" },
                  ].map(({ label, href }) => (
                    <a key={label} href={href} className="ft-link">{label}</a>
                  ))}
                </div>
              </div>
              <div>
                <h3 style={{
                  color: "#5b3d8a", fontSize: "10px", fontWeight: 700,
                  letterSpacing: "0.14em", textTransform: "uppercase",
                  marginBottom: "20px", fontFamily: "'DM Sans', sans-serif",
                }}>
                  Contact
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                  {[
                    "Ulaanbaatar, Mongolia",
                    "info@duguilan.mn",
                    "+976 99116769",
                  ].map(t => (
                    <span key={t} style={{ color: "#7a6090", fontSize: "13px", fontFamily: "'DM Sans', sans-serif", fontWeight: 500 }}>{t}</span>
                  ))}
                </div>
              </div>
            </div>

            <div style={{
              borderTop: "1px solid rgba(124,58,237,0.12)",
              paddingTop: "28px",
              display: "flex", justifyContent: "space-between", alignItems: "center",
            }}>
              <p style={{ color: "#ffffff", fontSize: "12px", fontFamily: "'DM Sans', sans-serif", fontWeight: 500 }}>
                © 2026 Duguilan.mn — School Project
              </p>
              <span style={{
                fontSize: "10.5px", color: "#ffffff",
                fontWeight: 700, letterSpacing: "0.1em",
                textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif",
              }}>
                Made by Enjoy Crew
              </span>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}