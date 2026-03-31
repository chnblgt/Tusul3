import { useState, useRef, useEffect } from "react";

export default function Header({ user = null }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [hoveredLink, setHoveredLink] = useState(null);
  const [signinHover, setSigninHover] = useState(false);
  const [signupHover, setSignupHover] = useState(false);
  const [pfpHover, setPfpHover] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const loggedIn = user !== null;
  const displayUser = user || { name: "Bat-Erdene", username: "baterdenee", avatar: null };

  function getInitials(name) {
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  }

  const navLinks = [
    { label: "Categories", href: "/page1" },
    { label: "Events", href: "#" },
    { label: "About", href: "/about" },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,700;0,9..144,800;1,9..144,700&family=DM+Sans:wght@400;500;600&display=swap');
        @keyframes dropIn {
          from { opacity: 0; transform: translateY(-8px) scale(0.96); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .hdr-nav-link {
          position: relative;
          text-decoration: none;
          font-size: 13.5px;
          font-weight: 500;
          letter-spacing: 0.01em;
          transition: color 0.2s;
          font-family: 'DM Sans', sans-serif;
          padding-bottom: 3px;
        }
        .hdr-nav-link::after {
          content: '';
          position: absolute;
          bottom: 0; left: 0;
          width: 0%; height: 1.5px;
          background: #7c3aed;
          transition: width 0.25s ease;
          border-radius: 2px;
        }
        .hdr-nav-link:hover::after { width: 100%; }
      `}</style>

      <header style={{
        background: "rgba(255,253,255,0.94)",
        borderBottom: "1px solid rgba(124,58,237,0.1)",
        position: "sticky",
        top: 0,
        zIndex: 1000,
        fontFamily: "'DM Sans', sans-serif",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
      }}>
        <div style={{ height: "2px", background: "linear-gradient(90deg, #4c1d95, #7c3aed, #c4b5fd, #7c3aed, #4c1d95)" }} />

        <div style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 36px",
          height: "72px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}>

          <a href="/page" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
            <img src="/assets/logo1.png" alt="Logo" width={28} height={28}
              style={{ borderRadius: "7px", objectFit: "cover", display: "block" }} />
            <span style={{
              fontFamily: "'Fraunces', serif",
              fontSize: "20px", fontWeight: 800,
              color: "#1a0533", letterSpacing: "-0.03em",
            }}>
              Duguilan.mn
            </span>
          </a>

          <nav style={{ display: "flex", alignItems: "center", gap: "36px" }}>
            {navLinks.map(({ label, href }) => (
              <a key={label} href={href} className="hdr-nav-link"
                onMouseEnter={() => setHoveredLink(label)}
                onMouseLeave={() => setHoveredLink(null)}
                style={{ color: hoveredLink === label ? "#7c3aed" : "#555", fontSize: "16px" }}
              >
                {label}
              </a>
            ))}
          </nav>

          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            {!loggedIn && (
              <>
                <a href="/signin"
                  onMouseEnter={() => setSigninHover(true)}
                  onMouseLeave={() => setSigninHover(false)}
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "16px", fontWeight: 500,
                    color: signinHover ? "#7c3aed" : "#555",
                    textDecoration: "none", transition: "color 0.2s",
                  }}
                >
                  Sign in
                </a>
                <a href="/signup"
                  onMouseEnter={() => setSignupHover(true)}
                  onMouseLeave={() => setSignupHover(false)}
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "16px", fontWeight: 600,
                    background: signupHover ? "#6d28d9" : "#1a0533",
                    color: "#fff",
                    padding: "8px 18px", borderRadius: "6px",
                    textDecoration: "none", letterSpacing: "0.02em",
                    transition: "background 0.2s, transform 0.15s, box-shadow 0.2s",
                    transform: signupHover ? "translateY(-1px)" : "none",
                    display: "inline-block",
                    boxShadow: signupHover ? "0 4px 16px rgba(109,40,217,0.4)" : "0 2px 8px rgba(26,5,51,0.18)",
                  }}
                >
                  Sign up
                </a>
              </>
            )}

            <div ref={dropdownRef} style={{ position: "relative" }}>
              <button
                onMouseEnter={() => setPfpHover(true)}
                onMouseLeave={() => setPfpHover(false)}
                onClick={() => loggedIn ? setDropdownOpen((v) => !v) : window.location.href = "/profile"}
                style={{
                  width: "34px", height: "34px", minWidth: "34px",
                  borderRadius: "50%",
                  border: `2px solid ${pfpHover ? "#7c3aed" : "rgba(124,58,237,0.25)"}`,
                  background: "#1a0533", color: "#fff",
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "12px", fontWeight: 700,
                  cursor: "pointer", overflow: "hidden",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "border-color 0.2s, transform 0.15s, box-shadow 0.2s",
                  transform: pfpHover ? "translateY(-1px)" : "none",
                  boxShadow: pfpHover ? "0 4px 14px rgba(124,58,237,0.35)" : "none",
                  padding: 0, outline: "none", flexShrink: 0,
                }}
              >
                {loggedIn && displayUser.avatar
                  ? <img src={displayUser.avatar} alt={displayUser.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  : loggedIn
                    ? getInitials(displayUser.name)
                    : <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                      </svg>
                }
              </button>

              {loggedIn && dropdownOpen && (
                <div style={{
                  position: "absolute", top: "calc(100% + 12px)", right: 0,
                  background: "#fff",
                  border: "1px solid rgba(124,58,237,0.1)",
                  borderRadius: "14px",
                  boxShadow: "0 20px 60px rgba(26,5,51,0.12), 0 2px 8px rgba(124,58,237,0.06)",
                  minWidth: "210px", zIndex: 2000, overflow: "hidden",
                  animation: "dropIn 0.18s cubic-bezier(.22,.68,0,1.2)",
                }}>
                  <div style={{ padding: "16px 18px 12px", borderBottom: "1px solid #f5f0ff" }}>
                    <p style={{ fontFamily: "'Fraunces', serif", fontWeight: 700, fontSize: "15px", color: "#1a0533", margin: "0 0 2px", letterSpacing: "-0.02em" }}>
                      {displayUser.name}
                    </p>
                    <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12px", color: "#9879d4", margin: 0, fontWeight: 500 }}>
                      @{displayUser.username}
                    </p>
                  </div>

                  {[
                    { label: "My Profile", href: "/profile", icon: <><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></> },
                    { label: "Settings", href: "/settings", icon: <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l-.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></> },
                  ].map(({ label, href, icon }) => (
                    <a key={label} href={href}
                      onMouseEnter={e => e.currentTarget.style.background = "#f8f4ff"}
                      onMouseLeave={e => e.currentTarget.style.background = "none"}
                      style={{
                        display: "flex", alignItems: "center", gap: "10px",
                        padding: "10px 18px",
                        fontFamily: "'DM Sans', sans-serif", fontSize: "13.5px", fontWeight: 500,
                        color: "#333", textDecoration: "none",
                      }}
                    >
                      <svg width="14" height="14" fill="none" stroke="#7c3aed" strokeWidth="2" viewBox="0 0 24 24">{icon}</svg>
                      {label}
                    </a>
                  ))}

                  <div style={{ height: "1px", background: "#f5f0ff", margin: "2px 0" }} />

                  <button onClick={() => {}}
                    onMouseEnter={e => e.currentTarget.style.background = "#fff5f5"}
                    onMouseLeave={e => e.currentTarget.style.background = "none"}
                    style={{
                      display: "flex", alignItems: "center", gap: "10px",
                      padding: "10px 18px", width: "100%",
                      fontFamily: "'DM Sans', sans-serif", fontSize: "13.5px", fontWeight: 500,
                      color: "#c0392b", background: "none", border: "none",
                      textAlign: "left", cursor: "pointer",
                    }}
                  >
                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                      <polyline points="16 17 21 12 16 7"/>
                      <line x1="21" y1="12" x2="9" y2="12"/>
                    </svg>
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
}