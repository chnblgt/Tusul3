import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Header from "@/waterbottle/Header";
import Footer from "@/waterbottle/Footer";
import Link from "next/link";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const fetchAPI = (url, opts = {}) =>
  fetch(url, { ...opts, headers: { "ngrok-skip-browser-warning": "true", ...opts.headers } });

const CATEGORY_STYLES = {
  football:   { accent: "#16a34a", bg: "#f0fdf4" },
  basketball: { accent: "#ea580c", bg: "#fff7ed" },
  volleyball: { accent: "#ca8a04", bg: "#fefce8" },
  tennis:     { accent: "#65a30d", bg: "#f7fee7" },
  swimming:   { accent: "#2563eb", bg: "#eff6ff" },
  chess:      { accent: "#475569", bg: "#f8fafc" },
  music:      { accent: "#db2777", bg: "#fdf2f8" },
  art:        { accent: "#9333ea", bg: "#faf5ff" },
  dance:      { accent: "#dc2626", bg: "#fef2f2" },
  drama:      { accent: "#4f46e5", bg: "#eef2ff" },
  coding:     { accent: "#0891b2", bg: "#ecfeff" },
  science:    { accent: "#0d9488", bg: "#f0fdfa" },
  wrestling:  { accent: "#b91c1c", bg: "#fef2f2" },
  boxing:     { accent: "#92400e", bg: "#fffbeb" },
  judo:       { accent: "#6030c8", bg: "#f5f0ff" },
  athletics:  { accent: "#15803d", bg: "#f0fdf4" },
  other:      { accent: "#4b5563", bg: "#f9fafb" },
};

function getStyle(cat) {
  return CATEGORY_STYLES[(cat || "").toLowerCase()] || { accent: "#6030c8", bg: "#f5f0ff" };
}

const FILTERS = ["All", "Sports", "Arts & Culture", "Tech & Science"];
const FILTER_MAP = {
  "Sports":         ["football","basketball","volleyball","tennis","swimming","dance","wrestling","boxing","judo","athletics"],
  "Arts & Culture": ["music","art","drama"],
  "Tech & Science": ["coding","science","chess"],
};

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,600;1,400;1,600&family=Outfit:wght@300;400;500;600;700&display=swap');
  .p1-serif { font-family: 'Cormorant Garamond', serif; }
  .p1-sans  { font-family: 'Outfit', sans-serif; }

  @keyframes p1-up { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:none} }
  .p1-card { animation: p1-up 0.4s ease both; }

  .p1-club-card {
    background: var(--bg-card);
    border: 1px solid var(--border-subtle);
    border-radius: 12px;
    padding: 24px;
    text-decoration: none;
    display: flex; flex-direction: column;
    position: relative; overflow: hidden;
    transition: transform 0.22s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.22s, border-color 0.2s;
  }
  .p1-club-card:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-card-hover);
    border-color: rgba(96,48,200,0.2);
  }

  .p1-search {
    width: 100%; padding: 12px 44px;
    font-size: 14px; font-family: 'Outfit', sans-serif;
    background: var(--bg-input); color: var(--input-text);
    border: 1px solid var(--input-border);
    border-radius: 8px; outline: none; box-sizing: border-box;
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  .p1-search:focus {
    border-color: var(--text-accent);
    box-shadow: 0 0 0 3px rgba(96,48,200,0.08);
  }
  .p1-search::placeholder { color: var(--text-muted); }

  .p1-filter {
    padding: 8px 16px; border-radius: 20px;
    font-family: 'Outfit', sans-serif;
    font-size: 12px; font-weight: 500;
    cursor: pointer; border: 1px solid var(--border-subtle);
    background: none; color: var(--text-secondary);
    transition: all 0.18s; white-space: nowrap;
    letter-spacing: 0.02em;
  }
  .p1-filter.active {
    background: var(--text-primary);
    color: var(--bg-page);
    border-color: var(--text-primary);
  }
  .p1-filter:hover:not(.active) {
    border-color: var(--text-primary);
    color: var(--text-primary);
  }

  .p1-header-inner {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 32px;
    flex-wrap: wrap;
  }

  .p1-search-wrap {
    width: 100%;
    max-width: 340px;
  }

  .p1-cta-banner {
    margin-top: 80px;
    padding: 48px;
    border: 1px solid var(--border-subtle);
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 32px;
    flex-wrap: wrap;
    background: var(--bg-card);
    transition: background 0.3s;
  }

  @media (max-width: 640px) {
    .p1-header-inner {
      flex-direction: column;
      align-items: flex-start;
      gap: 20px;
    }
    .p1-search-wrap {
      max-width: 100%;
    }
    .p1-cta-banner {
      padding: 28px 20px;
      margin-top: 48px;
      flex-direction: column;
      align-items: flex-start;
      gap: 20px;
    }
    .p1-cta-link {
      width: 100%;
      text-align: center;
    }
  }
`;

export default function CategoriesPage() {
  const [search, setSearch]           = useState("");
  const [filter, setFilter]           = useState("All");
  const [clubs, setClubs]             = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState("");

  useEffect(() => {
    fetchAPI(`${API}/clubs`)
      .then(r => r.json())
      .then(d => { if (d.success) setClubs(d.clubs); else setError("Could not load clubs"); })
      .catch(() => setError("Could not connect to server"))
      .finally(() => setLoading(false));
  }, []);

  const filtered = clubs.filter(c => {
    const matchSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.category.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      filter === "All" ||
      (FILTER_MAP[filter] || []).includes(c.category.toLowerCase());
    return matchSearch && matchFilter;
  });

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--bg-page)", transition: "background 0.3s" }}>
      <style>{CSS}</style>
      <Header />
      <div style={{
        borderBottom: "1px solid var(--border-subtle)",
        background: "var(--bg-card)",
        padding: "clamp(32px, 5vw, 56px) clamp(20px, 4vw, 32px) clamp(28px, 4vw, 40px)",
        transition: "background 0.3s",
      }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <Link href="/page" style={{
            display: "inline-flex", alignItems: "center", gap: "6px",
            fontFamily: "'Outfit', sans-serif",
            fontSize: "12px", fontWeight: 500,
            color: "var(--text-muted)",
            textDecoration: "none",
            letterSpacing: "0.04em",
            marginBottom: "28px",
            transition: "color 0.2s",
          }}
            onMouseEnter={e => e.currentTarget.style.color = "var(--text-primary)"}
            onMouseLeave={e => e.currentTarget.style.color = "var(--text-muted)"}
          >
            <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg>
            Back to home
          </Link>

          <div className="p1-header-inner">
            <div>
              <span className="p1-sans" style={{
                fontSize: "10px", fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase",
                color: "var(--text-muted)", display: "block", marginBottom: "12px",
              }}>
                {loading ? "…" : `${clubs.length} Clubs available`}
              </span>
              <h1 className="p1-serif" style={{
                fontSize: "clamp(2.4rem, 5vw, 4rem)",
                fontWeight: 300, lineHeight: 1.08,
                color: "var(--text-primary)", margin: "0 0 12px",
                letterSpacing: "-0.02em", transition: "color 0.3s",
              }}>
                Find your<br />
                <em style={{ fontStyle: "italic", fontWeight: 400, color: "var(--text-accent)" }}>perfect club.</em>
              </h1>
              <p className="p1-sans" style={{
                fontSize: "14px", fontWeight: 300, lineHeight: 1.75,
                color: "var(--text-secondary)", margin: 0, maxWidth: "340px",
                transition: "color 0.3s",
              }}>
                Explore every club across Ulaanbaatar.
              </p>
            </div>

            <div className="p1-search-wrap">
              <div style={{ position: "relative" }}>
                <svg style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}
                  width="15" height="15" fill="none" stroke="var(--text-muted)" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                </svg>
                <input
                  className="p1-search"
                  type="text"
                  placeholder="Search clubs…"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
                {search && (
                  <button onClick={() => setSearch("")} style={{
                    position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)",
                    background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", padding: 0,
                  }}>
                    <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12"/></svg>
                  </button>
                )}
              </div>
              {search && (
                <p className="p1-sans" style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "6px" }}>
                  {filtered.length} result{filtered.length !== 1 ? "s" : ""}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <main style={{ flex: 1 }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px clamp(20px, 4vw, 32px) 96px" }}>

          <div style={{ display: "flex", gap: "8px", marginBottom: "40px", flexWrap: "wrap" }}>
            {FILTERS.map(f => (
              <button
                key={f}
                className={`p1-filter ${filter === f ? "active" : ""}`}
                onClick={() => setFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>

          {loading ? (
            <div style={{ textAlign: "center", padding: "100px 0" }}>
              <div style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
                <div style={{
                  width: "40px", height: "40px", borderRadius: "50%",
                  border: "2px solid var(--border-subtle)",
                  borderTopColor: "var(--text-accent)",
                  animation: "spin 0.8s linear infinite",
                }} />
                <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
                <p className="p1-sans" style={{ color: "var(--text-muted)", fontSize: "14px", fontWeight: 300 }}>Loading clubs…</p>
              </div>
            </div>
          ) : error ? (
            <div style={{ textAlign: "center", padding: "100px 0" }}>
              <p className="p1-serif" style={{ fontSize: "28px", fontWeight: 300, color: "var(--text-primary)", marginBottom: "12px" }}>
                Could not connect
              </p>
              <p className="p1-sans" style={{ color: "var(--text-muted)", fontSize: "14px", marginBottom: "28px" }}>{error}</p>
              <button onClick={() => window.location.reload()} className="p1-sans" style={{
                background: "var(--text-primary)", color: "var(--bg-page)",
                border: "none", padding: "11px 24px", borderRadius: "6px",
                fontSize: "13px", fontWeight: 600, cursor: "pointer",
                letterSpacing: "0.04em",
              }}>
                Try again
              </button>
            </div>
          ) : filtered.length > 0 ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(280px, 100%), 1fr))", gap: "16px" }}>
              {filtered.map((club, i) => {
                const { accent, bg } = getStyle(club.category);
                return (
                  <Link
                    key={club.id}
                    href={`/club-detail?id=${club.id}`}
                    className="p1-club-card p1-card"
                    style={{ animationDelay: `${i * 35}ms` }}
                  >
                    <div style={{
                      position: "absolute", top: 0, left: 0, right: 0,
                      height: "2px", background: accent, opacity: 0.7,
                    }} />

                    <div style={{
                      width: "48px", height: "48px",
                      background: bg, border: `1px solid ${accent}22`,
                      borderRadius: "10px",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      marginBottom: "18px", overflow: "hidden",
                    }}>
                      {club.logo
                        ? <img src={club.logo} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt={club.name} />
                        : <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "20px", fontWeight: 600, color: accent }}>
                            {club.name[0]}
                          </span>
                      }
                    </div>

                    <div className="p1-serif" style={{
                      fontSize: "18px", fontWeight: 600,
                      color: "var(--text-primary)",
                      letterSpacing: "-0.01em", lineHeight: 1.25,
                      margin: "0 0 6px", transition: "color 0.3s",
                    }}>
                      {club.name}
                    </div>

                    <p className="p1-sans" style={{
                      fontSize: "13px", fontWeight: 300, lineHeight: 1.65,
                      color: "var(--text-secondary)",
                      margin: "0 0 auto", flexGrow: 1, paddingBottom: "18px",
                      transition: "color 0.3s",
                    }}>
                      {club.description?.slice(0, 90)}{club.description?.length > 90 ? "…" : ""}
                    </p>

                    <div style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      paddingTop: "16px", borderTop: `1px solid ${accent}14`,
                    }}>
                      <span className="p1-sans" style={{
                        fontSize: "10px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase",
                        color: accent, background: bg, padding: "3px 8px", borderRadius: "4px",
                      }}>
                        {club.category}
                      </span>
                      <span className="p1-sans" style={{
                        fontSize: "10px", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase",
                        color: club.pricing_type === "free" ? "#15803d" : "var(--text-accent)",
                      }}>
                        {club.pricing_type === "free" ? "Free" : "Paid"}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "100px 0" }}>
              <p className="p1-serif" style={{ fontSize: "28px", fontWeight: 300, color: "var(--text-primary)", marginBottom: "12px", transition: "color 0.3s" }}>
                {clubs.length === 0 ? "No clubs yet" : "Nothing found"}
              </p>
              <p className="p1-sans" style={{ color: "var(--text-muted)", fontSize: "14px", fontWeight: 300, marginBottom: "28px" }}>
                {clubs.length === 0 ? "Be the first to register a club!" : "Try a different search or filter."}
              </p>
              {clubs.length === 0 ? (
                <Link href="/club-register" className="p1-sans" style={{
                  background: "var(--text-primary)", color: "var(--bg-page)",
                  padding: "11px 24px", borderRadius: "6px",
                  fontSize: "13px", fontWeight: 600, textDecoration: "none",
                  display: "inline-block", letterSpacing: "0.04em",
                }}>Register a club →</Link>
              ) : (
                <button onClick={() => { setSearch(""); setFilter("All"); }} className="p1-sans" style={{
                  background: "var(--text-primary)", color: "var(--bg-page)",
                  border: "none", padding: "11px 24px", borderRadius: "6px",
                  fontSize: "13px", fontWeight: 600, cursor: "pointer",
                  letterSpacing: "0.04em",
                }}>Clear filters</button>
              )}
            </div>
          )}
          {!loading && clubs.length > 0 && (
            <div className="p1-cta-banner">
              <div>
                <span className="p1-sans" style={{
                  fontSize: "10px", fontWeight: 700, letterSpacing: "0.16em",
                  textTransform: "uppercase", color: "var(--text-muted)",
                  display: "block", marginBottom: "10px",
                }}>For Club Leaders</span>
                <h3 className="p1-serif" style={{
                  fontSize: "28px", fontWeight: 300,
                  color: "var(--text-primary)", margin: "0 0 8px",
                  letterSpacing: "-0.02em", transition: "color 0.3s",
                }}>
                  List your club on <em style={{ fontStyle: "italic" }}>Duguilan.com</em>
                </h3>
                <p className="p1-sans" style={{ fontSize: "13px", fontWeight: 300, color: "var(--text-secondary)", margin: 0, lineHeight: 1.75 }}>
                  Reach hundreds of students for free.
                </p>
              </div>
              <Link href="/club-register" className="p1-sans p1-cta-link" style={{
                background: "var(--text-primary)", color: "var(--bg-page)",
                padding: "13px 28px", borderRadius: "8px",
                fontSize: "13px", fontWeight: 600, letterSpacing: "0.04em",
                textDecoration: "none", whiteSpace: "nowrap", flexShrink: 0,
                transition: "background 0.2s",
              }}
                onMouseEnter={e => e.currentTarget.style.background = "var(--text-accent)"}
                onMouseLeave={e => e.currentTarget.style.background = "var(--text-primary)"}
              >
                Register your club →
              </Link>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}