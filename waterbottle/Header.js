import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useTheme } from "./useTheme";
import { useTranslation } from "./useTranslation";
import { useRouter } from "next/router";

const FONT = `@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&display=swap');`;

export default function Header({ user = null }) {
  const router = useRouter();
  const { mode } = useTheme();
  const { lang, toggleLang } = useTranslation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen,   setMobileOpen]   = useState(false);
  const [scrolled,     setScrolled]     = useState(false);
  const [currentUser,  setCurrentUser]  = useState(null);
  const dropdownRef = useRef(null);

  function refreshUser() {
    if (user) { setCurrentUser(user); return; }
    const stored = localStorage.getItem("user");
    if (stored) {
      try { setCurrentUser(JSON.parse(stored)); }
      catch { setCurrentUser(null); }
    } else { setCurrentUser(null); }
  }

  useEffect(() => {
    refreshUser();
    router.events?.on("routeChangeComplete", () => { refreshUser(); setMobileOpen(false); });
    window.addEventListener("storage", refreshUser);
    return () => {
      router.events?.off("routeChangeComplete", refreshUser);
      window.removeEventListener("storage", refreshUser);
    };
  }, []);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    const fn = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setDropdownOpen(false);
    };
    document.addEventListener("click", fn);
    return () => document.removeEventListener("click", fn);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  function getInitials(name) {
    if (!name) return "?";
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  }

  function handleSignOut() {
    localStorage.removeItem("user");
    setCurrentUser(null);
    setDropdownOpen(false);
    setMobileOpen(false);
    router.push("/page");
  }

  const loggedIn = currentUser !== null;
  const displayName = currentUser?.name || currentUser?.username || "User";
  const navLinks = [
    { label: "Explore", href: "/page1" },
    { label: "Events", href: "#" },
    { label: "About", href: "/about" },
  ];

  return (
    <>
      <style>{`
        ${FONT}

        .hdr-nav-link {
          font-family: 'DM Sans', sans-serif;
          font-size: 14px; font-weight: 500;
          color: var(--text-secondary);
          text-decoration: none;
          letter-spacing: 0.01em;
          padding: 6px 0;
          position: relative;
          transition: color 0.2s;
        }
        .hdr-nav-link::after {
          content: '';
          position: absolute; bottom: 0; left: 0;
          width: 0; height: 1.5px;
          background: var(--accent);
          transition: width 0.25s;
        }
        .hdr-nav-link:hover { color: var(--text-primary); }
        .hdr-nav-link:hover::after { width: 100%; }

        .hdr-ghost {
          font-family: 'DM Sans', sans-serif;
          font-size: 13px; font-weight: 500;
          color: var(--text-secondary);
          text-decoration: none;
          padding: 8px 16px;
          border: 1px solid var(--border-subtle);
          border-radius: 8px;
          transition: all 0.2s;
          white-space: nowrap;
        }
        .hdr-ghost:hover { color: var(--text-primary); border-color: var(--border-card); background: var(--bg-input); }

        .hdr-primary {
          font-family: 'DM Sans', sans-serif;
          font-size: 13px; font-weight: 600;
          color: var(--text-on-accent);
          text-decoration: none;
          padding: 9px 20px;
          border-radius: 8px;
          background: var(--accent);
          transition: all 0.2s;
          letter-spacing: 0.02em;
          white-space: nowrap;
        }
        .hdr-primary:hover { opacity: 0.88; transform: translateY(-1px); }

        .hdr-avatar {
          width: 34px; height: 34px;
          border-radius: 50%;
          background: var(--accent);
          color: var(--text-on-accent);
          font-family: 'DM Sans', sans-serif;
          font-size: 11px; font-weight: 700;
          border: 2px solid var(--border-subtle);
          cursor: pointer; overflow: hidden;
          display: flex; align-items: center; justify-content: center;
          transition: border-color 0.2s, transform 0.2s;
        }
        .hdr-avatar:hover { border-color: var(--accent); transform: scale(1.05); }

        @keyframes hdr-drop-in {
          from { opacity: 0; transform: translateY(-6px) scale(0.97); }
          to   { opacity: 1; transform: none; }
        }
        .hdr-dropdown {
          position: absolute; top: calc(100% + 10px); right: 0;
          background: var(--bg-card);
          border: 1px solid var(--border-subtle);
          border-radius: 14px;
          min-width: 210px;
          box-shadow: var(--shadow-drop);
          animation: hdr-drop-in 0.15s ease;
          overflow: hidden; z-index: 99999;
        }
        .hdr-dd-item {
          display: flex; align-items: center; gap: 10px;
          padding: 10px 16px;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px; font-weight: 500;
          color: var(--text-primary);
          text-decoration: none;
          transition: background 0.15s;
          cursor: pointer;
          background: none; border: none;
          width: 100%; text-align: left;
          box-sizing: border-box;
        }
        .hdr-dd-item:hover { background: var(--bg-input) !important; }

        /* ── Burger: hidden on desktop ── */
        .hdr-burger {
          display: none;
          flex-direction: column; justify-content: center; gap: 5px;
          width: 36px; height: 36px;
          background: none; border: none; cursor: pointer; padding: 6px;
          border-radius: 8px; transition: background 0.2s;
          flex-shrink: 0;
        }
        .hdr-burger:hover { background: var(--bg-input); }
        .hdr-burger span {
          display: block; height: 1.5px; border-radius: 2px;
          background: var(--text-primary);
          transition: all 0.25s cubic-bezier(0.4,0,0.2,1);
          transform-origin: center;
        }
        .hdr-burger.open span:nth-child(1) { transform: translateY(6.5px) rotate(45deg); }
        .hdr-burger.open span:nth-child(2) { opacity: 0; transform: scaleX(0); }
        .hdr-burger.open span:nth-child(3) { transform: translateY(-6.5px) rotate(-45deg); }

        @keyframes hdr-slide-in {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: none; }
        }
        .hdr-mobile-menu {
          position: fixed; top: 64px; left: 0; right: 0; bottom: 0;
          background: var(--bg-card);
          border-top: 1px solid var(--border-subtle);
          z-index: 999;
          flex-direction: column;
          padding: 20px 16px 40px;
          overflow-y: auto;
          animation: hdr-slide-in 0.2s ease both;
          display: none;
        }
        .hdr-mobile-menu.open { display: flex; }

        .hdr-mobile-link {
          font-family: 'DM Sans', sans-serif;
          font-size: 17px; font-weight: 500;
          color: var(--text-primary);
          text-decoration: none;
          padding: 16px 4px;
          border-bottom: 1px solid var(--border-subtle);
          display: block; transition: color 0.2s;
        }
        .hdr-mobile-link:hover { color: var(--accent); }

        /* ── Responsive breakpoint ── */
        @media (max-width: 768px) {
          .hdr-nav-desktop { display: none !important; }
          .hdr-auth-desktop { display: none !important; }
          .hdr-burger { display: flex !important; }
        }
      `}</style>

      <header style={{
        position: "sticky", top: 0, zIndex: 1000,
        isolation: "isolate",
        background: scrolled ? "var(--bg-header)" : "transparent",
        borderBottom: scrolled ? "1px solid var(--border-subtle)" : "1px solid transparent",
        backdropFilter: scrolled ? "blur(16px)" : "none",
        transition: "background 0.3s, border-color 0.3s",
      }}>
        <div style={{
          maxWidth: "1200px", margin: "0 auto",
          padding: "0 20px", height: "64px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          gap: "12px",
        }}>
          {/* Logo */}
          <Link href="/page" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
            <div style={{
              width: "30px", height: "30px",
              background: "var(--accent)", borderRadius: "8px",
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}>
              <img src="/assets/logo_white.png" alt="" width={17} height={17} style={{ display: "block" }} />
            </div>
            <span style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: "20px", color: "var(--text-primary)",
              letterSpacing: "-0.01em", fontStyle: "normal",
              whiteSpace: "nowrap",
            }}>
              Duguilan<span style={{ color: "var(--accent)", fontStyle: "italic" }}>.com</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hdr-nav-desktop" style={{ display: "flex", alignItems: "center", gap: "28px" }}>
            {navLinks.map(({ label, href }) => (
              <Link key={label} href={href} className="hdr-nav-link">{label}</Link>
            ))}
          </nav>

          {/* Desktop Auth */}
          <div className="hdr-auth-desktop" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            {/* Language toggle */}
            {/* <button
              onClick={toggleLang}
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "12px", fontWeight: 700,
                color: "var(--text-secondary)",
                background: "var(--bg-input)",
                border: "1px solid var(--border-subtle)",
                borderRadius: "8px", padding: "6px 12px",
                cursor: "pointer", letterSpacing: "0.06em",
                transition: "all 0.2s",
              }}
              onMouseEnter={e => { e.currentTarget.style.color = "var(--accent)"; e.currentTarget.style.borderColor = "var(--accent)"; }}
              onMouseLeave={e => { e.currentTarget.style.color = "var(--text-secondary)"; e.currentTarget.style.borderColor = "var(--border-subtle)"; }}
              title={lang === "en" ? "Монгол хэл рүү" : "Switch to English"}
            > 
              {lang === "en" ? "MN" : "EN"}
            </button> */}
            {!loggedIn ? (
              <>
                <Link href="/signin" className="hdr-ghost">Sign in</Link>
                <Link href="/signup" className="hdr-primary">Get started</Link>
              </>
            ) : (
              <div ref={dropdownRef} style={{ position: "relative" }}>
                <button className="hdr-avatar" onClick={(e) => { e.stopPropagation(); setDropdownOpen(v => !v); }}>
                  {currentUser?.avatar
                    ? <img src={currentUser.avatar} alt={displayName} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    : getInitials(displayName)
                  }
                </button>
                {dropdownOpen && (
                  <div className="hdr-dropdown">
                    <div style={{ padding: "14px 16px 10px", borderBottom: "1px solid var(--border-subtle)" }}>
                      <p style={{ fontFamily: "'DM Serif Display', serif", fontSize: "16px", color: "var(--text-primary)", margin: "0 0 2px" }}>{displayName}</p>
                      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", color: "var(--text-muted)", margin: 0, fontWeight: 400 }}>
                        @{currentUser?.username || ""}
                      </p>
                    </div>
                    <button className="hdr-dd-item" onClick={() => { setDropdownOpen(false); router.push("/profile"); }}>
                      <svg width="13" height="13" fill="none" stroke="var(--accent)" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
                      My Profile
                    </button>
                    <button className="hdr-dd-item" onClick={() => { setDropdownOpen(false); router.push("/settings"); }}>
                      <svg width="13" height="13" fill="none" stroke="var(--accent)" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06-.06a2 2 0 0 1-2.83-2.83l-.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
                      Settings
                    </button>
                    <div style={{ height: "1px", background: "var(--border-subtle)", margin: "4px 0" }} />
                    <button className="hdr-dd-item" onClick={handleSignOut}
                      style={{ color: "#d93025" }}
                      onMouseEnter={e => e.currentTarget.style.background = "rgba(217,48,37,0.06)"}
                      onMouseLeave={e => e.currentTarget.style.background = "none"}>
                      <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile burger — always last so it sits on the right */}
          <button
            className={`hdr-burger${mobileOpen ? " open" : ""}`}
            onClick={() => setMobileOpen(v => !v)}
            aria-label="Menu"
          >
            <span /><span /><span />
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      <div className={`hdr-mobile-menu${mobileOpen ? " open" : ""}`}>
        <div>
          {navLinks.map(({ label, href }) => (
            <Link key={label} href={href} className="hdr-mobile-link" onClick={() => setMobileOpen(false)}>
              {label}
            </Link>
          ))}
          {/* Language toggle in mobile */}
          <button
            onClick={toggleLang}
            style={{
              display: "block", width: "100%", textAlign: "left",
              padding: "16px 0", background: "none", border: "none",
              borderBottom: "1px solid var(--border-subtle)",
              fontFamily: "'DM Sans', sans-serif", fontSize: "18px",
              fontWeight: 600, color: "var(--accent)", cursor: "pointer",
            }}
          >
            {lang === "en" ? "🇲🇳 Монгол" : "🇬🇧 English"}
          </button>
        </div>

        <div style={{ marginTop: "24px" }}>
          {loggedIn ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <div style={{
                padding: "16px", borderRadius: "14px",
                background: "var(--bg-input)", marginBottom: "4px",
                display: "flex", alignItems: "center", gap: "12px",
              }}>
                <div style={{
                  width: "48px", height: "48px", borderRadius: "50%",
                  background: "var(--accent)", overflow: "hidden",
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>
                  {currentUser?.avatar
                    ? <img src={currentUser.avatar} alt={displayName} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    : <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "15px", fontWeight: 700, color: "#fff" }}>{getInitials(displayName)}</span>
                  }
                </div>
                <div>
                  <p style={{ fontFamily: "'DM Serif Display',serif", fontSize: "17px", color: "var(--text-primary)", margin: 0 }}>{displayName}</p>
                  <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "12px", color: "var(--text-muted)", margin: 0 }}>@{currentUser?.username || ""}</p>
                </div>
              </div>
              {[{ label: "My Profile", href: "/profile" }, { label: "Settings", href: "/settings" }].map(({ label, href }) => (
                <Link key={label} href={href} onClick={() => setMobileOpen(false)} style={{
                  display: "block", padding: "15px 16px", borderRadius: "12px",
                  background: "var(--bg-input)", fontFamily: "'DM Sans',sans-serif",
                  fontSize: "15px", fontWeight: 500, color: "var(--text-primary)", textDecoration: "none",
                }}>{label}</Link>
              ))}
              <button onClick={handleSignOut} style={{
                display: "block", padding: "15px 16px", borderRadius: "12px",
                background: "rgba(217,48,37,0.06)", border: "none", cursor: "pointer",
                fontFamily: "'DM Sans',sans-serif", fontSize: "15px", fontWeight: 600,
                color: "#d93025", textAlign: "left", width: "100%",
              }}>Sign out</button>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <Link href="/signin" onClick={() => setMobileOpen(false)} style={{
                display: "block", padding: "16px", borderRadius: "12px",
                border: "1px solid var(--border-subtle)", textAlign: "center",
                fontFamily: "'DM Sans',sans-serif", fontSize: "16px", fontWeight: 500,
                color: "var(--text-primary)", textDecoration: "none",
              }}>Sign in</Link>
              <Link href="/signup" onClick={() => setMobileOpen(false)} style={{
                display: "block", padding: "16px", borderRadius: "12px",
                background: "var(--accent)", textAlign: "center",
                fontFamily: "'DM Sans',sans-serif", fontSize: "16px", fontWeight: 600,
                color: "#fff", textDecoration: "none",
              }}>Get started</Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}