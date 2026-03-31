import { useState } from "react";
import Header from "@/waterbottle/Header";
import Footer from "@/waterbottle/Footer";

const categories = [
  { name: "Football",    icon: "football",   accent: "#22c55e",  bg: "#f0fdf4",  desc: "Leagues, training & 5-a-side",   count: "8 clubs" },
  { name: "Basketball",  icon: "basketball", accent: "#f97316",  bg: "#fff7ed",  desc: "Teams for all skill levels",      count: "5 clubs" },
  { name: "Volleyball",  icon: "volleyball", accent: "#eab308",  bg: "#fefce8",  desc: "Indoor & beach volleyball",       count: "4 clubs" },
  { name: "Tennis",      icon: "tennis",     accent: "#84cc16",  bg: "#f7fee7",  desc: "Singles, doubles & coaching",     count: "3 clubs" },
  { name: "Swimming",    icon: "swimming",   accent: "#3b82f6",  bg: "#eff6ff",  desc: "Pool sessions & competitions",    count: "3 clubs" },
  { name: "Chess",       icon: "chess",      accent: "#64748b",  bg: "#f8fafc",  desc: "Casual play to tournaments",      count: "2 clubs" },
  { name: "Music",       icon: "music",      accent: "#ec4899",  bg: "#fdf2f8",  desc: "Bands, choirs & jam sessions",    count: "6 clubs" },
  { name: "Art",         icon: "art",        accent: "#a855f7",  bg: "#faf5ff",  desc: "Painting, drawing & galleries",   count: "4 clubs" },
  { name: "Dance",       icon: "dance",      accent: "#ef4444",  bg: "#fef2f2",  desc: "Contemporary, hip-hop & more",    count: "5 clubs" },
  { name: "Drama",       icon: "drama",      accent: "#6366f1",  bg: "#eef2ff",  desc: "Theatre, improv & performance",   count: "3 clubs" },
  { name: "Coding",      icon: "coding",     accent: "#06b6d4",  bg: "#ecfeff",  desc: "Projects, hackathons & learning", count: "4 clubs" },
  { name: "Science",     icon: "science",    accent: "#14b8a6",  bg: "#f0fdfa",  desc: "Experiments & science fairs",     count: "2 clubs" },
];

function CategoryIcon({ type, size = 22 }) {
  const s = { width: `${size}px`, height: `${size}px` };
  switch (type) {
    case "football":   return <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><circle cx="12" cy="12" r="10"/><path d="M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20M2 12h20"/></svg>;
    case "basketball": return <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2v20M4.5 4.5c4 3 11 3 15 0M4.5 19.5c4-3 11-3 15 0"/></svg>;
    case "volleyball": return <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><circle cx="12" cy="12" r="10"/><path d="M12 2c3 4 3 12 0 20M2 12c4-3 12-3 20 0M4 6c5 5 12 6 16 2"/></svg>;
    case "tennis":     return <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><circle cx="12" cy="12" r="10"/><path d="M5 3c4 4 4 14 0 18M19 3c-4 4-4 14 0 18"/></svg>;
    case "swimming":   return <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M2 16c1-1 2.5-1 4 0s2.5 1 4 0 2.5-1 4 0 2.5 1 4 0 2.5-1 4 0"/><path d="M2 20c1-1 2.5-1 4 0s2.5 1 4 0 2.5-1 4 0 2.5 1 4 0 2.5-1 4 0"/><circle cx="10" cy="6" r="2"/><path d="M12 6l3 4-4 2"/></svg>;
    case "chess":      return <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M8 21h8M10 21V11M14 21V11M6 11h12l-2-4h-8l-2 4z"/><path d="M10 7V3h4v4M9 3h6"/></svg>;
    case "music":      return <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>;
    case "art":        return <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><circle cx="13.5" cy="6.5" r="2"/><circle cx="17.5" cy="10.5" r="1.5"/><circle cx="8.5" cy="7.5" r="1.5"/><circle cx="6.5" cy="12.5" r="1.5"/><path d="M12 22C6.5 22 2 17.5 2 12S6.5 2 12 2s10 4.5 10 10c0 2-1 3-3 3h-2c-1 0-2 1-2 2 0 .5.2 1 .5 1.3.3.3.5.7.5 1.2 0 1.5-1 2.5-4 2.5z"/></svg>;
    case "dance":      return <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><circle cx="12" cy="4" r="2"/><path d="M12 6v6M8 22l2-6 2 1 2-1 2 6M7 12l5 2 5-2"/></svg>;
    case "drama":      return <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M2 4c0 0 4-2 9 0M15 7c0 0 4 0 7-3M2 4c0 7 4 12 9 14M22 4c0 7-4 12-9 14"/><circle cx="7" cy="9" r="1" fill="currentColor"/><circle cx="17" cy="9" r="1" fill="currentColor"/><path d="M6 13c1.5 1 3 1.5 5 1M18 13c-1.5 1-3 1.5-5 1"/></svg>;
    case "coding":     return <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/><line x1="14" y1="4" x2="10" y2="20"/></svg>;
    case "science":    return <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M9 3h6M10 3v7l-5 8c-1 1.5 0 3 2 3h10c2 0 3-1.5 2-3l-5-8V3"/><circle cx="12" cy="16" r="1" fill="currentColor"/><circle cx="10" cy="14" r="0.5" fill="currentColor"/><circle cx="14" cy="15" r="0.5" fill="currentColor"/></svg>;
    default: return null;
  }
}

const fonts = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,700;0,9..144,800;1,9..144,700&family=DM+Sans:wght@400;500;600;700&display=swap');
  .p1-display { font-family: 'Fraunces', serif; }
  .p1-sans    { font-family: 'DM Sans', sans-serif; }

  @keyframes p1-fadeUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .p1-card-in { animation: p1-fadeUp 0.4s ease forwards; opacity: 0; }

  .p1-card {
    background: #fff;
    border: 1.5px solid rgba(124,58,237,0.1);
    border-radius: 20px;
    padding: 28px 24px;
    cursor: pointer;
    text-decoration: none;
    display: flex;
    flex-direction: column;
    transition: transform 0.22s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.22s ease, border-color 0.2s;
    position: relative;
    overflow: hidden;
  }
  .p1-card:hover {
    transform: translateY(-6px);
    box-shadow: 0 20px 52px rgba(26,5,51,0.1);
    border-color: rgba(124,58,237,0.2);
  }

  .p1-search {
    width: 100%;
    padding: 14px 44px;
    font-size: 14px;
    background: #fff;
    border: 1.5px solid rgba(124,58,237,0.15);
    border-radius: 12px;
    color: #1a0533;
    box-sizing: border-box;
    font-family: 'DM Sans', sans-serif;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  .p1-search:focus {
    border-color: #7c3aed;
    box-shadow: 0 0 0 3px rgba(124,58,237,0.1);
  }

  .p1-filter-btn {
    padding: 8px 16px;
    border-radius: 20px;
    font-family: 'DM Sans', sans-serif;
    font-size: 12.5px; font-weight: 600;
    cursor: pointer; border: 1.5px solid transparent;
    transition: all 0.2s; white-space: nowrap;
  }

  .p1-back {
    display: inline-flex; align-items: center; gap: 7px;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px; font-weight: 600;
    color: #555; background: rgba(26,5,51,0.04);
    border: 1px solid rgba(26,5,51,0.1); border-radius: 7px;
    padding: 7px 14px; cursor: pointer; text-decoration: none;
    transition: background 0.2s, color 0.2s; line-height: 1;
    margin-bottom: 40px; display: inline-flex;
  }
  .p1-back:hover { background: rgba(124,58,237,0.06); color: #7c3aed; border-color: rgba(124,58,237,0.2); }
`;

const FILTERS = ["All", "Sports", "Arts & Culture", "Tech & Science"];

const FILTER_MAP = {
  "Sports": ["Football", "Basketball", "Volleyball", "Tennis", "Swimming", "Dance"],
  "Arts & Culture": ["Music", "Art", "Drama"],
  "Tech & Science": ["Coding", "Science", "Chess"],
};

export default function CategoriesPage() {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  const filtered = categories.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase());
    const matchFilter = activeFilter === "All" || (FILTER_MAP[activeFilter] || []).includes(c.name);
    return matchSearch && matchFilter;
  });

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#fff" }}>
      <style>{fonts}</style>
      <Header />
      <div style={{ height: "2px", background: "linear-gradient(90deg, #4c1d95, #7c3aed, #c4b5fd, #7c3aed, #4c1d95)" }} />

      {/* ── Page hero ── */}
      <div style={{
        background: "radial-gradient(ellipse at 60% 0%, #ede9fe 0%, #f5f0ff 35%, #fdfcff 65%, #fff 100%)",
        borderBottom: "1px solid rgba(124,58,237,0.08)",
        padding: "64px 0 56px",
      }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 48px" }}>
          <a href="/page" className="p1-back">
            <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
            Back
          </a>

          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: "32px", flexWrap: "wrap" }}>
            <div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", marginBottom: "20px" }}>
                <span className="p1-sans" style={{
                  background: "#f5f0ff", color: "#7c3aed",
                  border: "1px solid rgba(124,58,237,0.15)",
                  padding: "4px 12px", borderRadius: "20px",
                  fontSize: "11px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase",
                }}>
                  {categories.length} Categories
                </span>
              </div>
              <h1 className="p1-display" style={{
                fontSize: "clamp(2.4rem, 5.5vw, 4rem)", fontWeight: 800, lineHeight: 1.1,
                color: "#1a0533", letterSpacing: "-0.04em", margin: "0 0 16px",
              }}>
                Find Your<br />
                <span style={{ color: "#7c3aed", fontStyle: "italic" }}>Perfect Club</span>
              </h1>
              <p className="p1-sans" style={{ fontSize: "15px", color: "#888", lineHeight: 1.7, margin: 0, maxWidth: "380px" }}>
                Explore every club and activity on offer across Ulaanbaatar. Pick one, or pick a few.
              </p>
            </div>

            {/* Search box */}
            <div style={{ width: "100%", maxWidth: "380px" }}>
              <div style={{ position: "relative", marginBottom: "12px" }}>
                <svg style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}
                  width="16" height="16" fill="none" stroke="#c4b5fd" strokeWidth="2" viewBox="0 0 24 24">
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
                    position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)",
                    background: "none", border: "none", cursor: "pointer", color: "#c4b5fd", padding: 0,
                  }}>
                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M18 6 6 18M6 6l12 12"/>
                    </svg>
                  </button>
                )}
              </div>
              {search && (
                <p className="p1-sans" style={{ fontSize: "12.5px", color: "#9879d4", fontWeight: 500, margin: 0 }}>
                  {filtered.length} result{filtered.length !== 1 ? "s" : ""}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <main style={{ flex: 1 }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "48px 48px 96px" }}>

          {/* Filter tabs */}
          <div style={{ display: "flex", gap: "8px", marginBottom: "40px", flexWrap: "wrap" }}>
            {FILTERS.map(f => (
              <button key={f} className="p1-filter-btn" onClick={() => setActiveFilter(f)} style={{
                background: activeFilter === f ? "#1a0533" : "#f5f0ff",
                color: activeFilter === f ? "#fff" : "#7c3aed",
                borderColor: activeFilter === f ? "#1a0533" : "rgba(124,58,237,0.15)",
                boxShadow: activeFilter === f ? "0 3px 12px rgba(26,5,51,0.2)" : "none",
              }}>
                {f}
              </button>
            ))}
          </div>

          {/* Grid */}
          {filtered.length > 0 ? (
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
              gap: "16px",
            }}>
              {filtered.map((cat, i) => (
                <a
                  key={cat.name}
                  href={`/club-detail?category=${encodeURIComponent(cat.name.toLowerCase())}`}
                  className="p1-card p1-card-in"
                  style={{ animationDelay: `${i * 40}ms` }}
                >
                  {/* Top accent line */}
                  <div style={{
                    position: "absolute", top: 0, left: "24px", right: "24px",
                    height: "2px", background: cat.accent,
                    borderRadius: "0 0 2px 2px", opacity: 0.6,
                  }} />

                  {/* Icon */}
                  <div style={{
                    width: "52px", height: "52px",
                    background: cat.bg,
                    border: `1.5px solid ${cat.accent}28`,
                    borderRadius: "14px",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: cat.accent, marginBottom: "20px",
                    boxShadow: `0 4px 12px ${cat.accent}18`,
                  }}>
                    <CategoryIcon type={cat.icon} size={22} />
                  </div>

                  {/* Name */}
                  <div className="p1-display" style={{
                    fontSize: "18px", fontWeight: 800,
                    color: "#1a0533", letterSpacing: "-0.02em", lineHeight: 1.2,
                    marginBottom: "6px",
                  }}>
                    {cat.name}
                  </div>

                  {/* Desc */}
                  <p className="p1-sans" style={{
                    fontSize: "12.5px", color: "#888", lineHeight: 1.6,
                    margin: "0 0 auto", flexGrow: 1, paddingBottom: "18px",
                  }}>
                    {cat.desc}
                  </p>

                  {/* Footer */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "16px", borderTop: `1px solid ${cat.accent}18` }}>
                    <span className="p1-sans" style={{
                      fontSize: "11px", fontWeight: 700,
                      color: cat.accent,
                      background: cat.bg,
                      padding: "3px 9px", borderRadius: "5px",
                      letterSpacing: "0.06em",
                    }}>
                      {cat.count}
                    </span>
                    <svg width="14" height="14" fill="none" stroke={cat.accent} strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </div>
                </a>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "100px 0" }}>
              <div style={{
                width: "72px", height: "72px", borderRadius: "20px",
                background: "#f5f0ff", border: "1px solid rgba(124,58,237,0.12)",
                display: "flex", alignItems: "center", justifyContent: "center",
                margin: "0 auto 24px", fontSize: "32px",
              }}>🔍</div>
              <h3 className="p1-display" style={{ fontSize: "24px", color: "#1a0533", marginBottom: "10px", fontWeight: 800, letterSpacing: "-0.02em" }}>
                Nothing found
              </h3>
              <p className="p1-sans" style={{ color: "#888", fontSize: "14px", marginBottom: "28px" }}>
                Try a different search or filter
              </p>
              <button onClick={() => { setSearch(""); setActiveFilter("All"); }} className="p1-sans" style={{
                background: "linear-gradient(135deg, #7c3aed, #4c1d95)", color: "#fff",
                border: "none", padding: "12px 28px", borderRadius: "9px",
                fontSize: "14px", fontWeight: 600, cursor: "pointer",
                boxShadow: "0 4px 16px rgba(124,58,237,0.3)",
              }}>
                Clear filters
              </button>
            </div>
          )}

          {/* Register CTA */}
          <div style={{
            marginTop: "72px",
            background: "linear-gradient(135deg, #1a0533 0%, #2d0a57 50%, #3b0764 100%)",
            borderRadius: "22px",
            padding: "48px 52px",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            gap: "28px", flexWrap: "wrap",
            position: "relative", overflow: "hidden",
          }}>
            <div style={{ position: "absolute", right: "-60px", top: "-60px", width: "240px", height: "240px", borderRadius: "50%", background: "rgba(124,58,237,0.15)", pointerEvents: "none" }} />
            <div style={{ position: "relative", zIndex: 1 }}>
              <p className="p1-sans" style={{ fontSize: "11px", fontWeight: 700, color: "#a78bfa", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "10px" }}>
                Run a club?
              </p>
              <h3 className="p1-display" style={{ fontSize: "26px", fontWeight: 800, color: "#fff", letterSpacing: "-0.03em", margin: "0 0 8px", lineHeight: 1.2 }}>
                Get your club listed on Duguilan.mn
              </h3>
              <p className="p1-sans" style={{ fontSize: "14px", color: "#a78bfa", margin: 0, lineHeight: 1.7 }}>
                Reach hundreds of students looking for clubs just like yours.
              </p>
            </div>
            <a href="/club-register" className="p1-sans" style={{
              background: "#fff", color: "#1a0533",
              padding: "14px 32px", borderRadius: "10px",
              fontWeight: 700, fontSize: "14px", textDecoration: "none",
              whiteSpace: "nowrap", flexShrink: 0, display: "inline-block",
              position: "relative", zIndex: 1,
              transition: "background 0.2s, color 0.2s",
            }}
              onMouseEnter={e => { e.currentTarget.style.background = "#f5f0ff"; e.currentTarget.style.color = "#7c3aed"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.color = "#1a0533"; }}
            >
              Register your club →
            </a>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}