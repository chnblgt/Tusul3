import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Header from "@/waterbottle/Header";
import Footer from "@/waterbottle/Footer";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const CATEGORY_STYLES = {
  football:   { accent: "#22c55e", bg: "#f0fdf4" },
  basketball: { accent: "#f97316", bg: "#fff7ed" },
  volleyball: { accent: "#eab308", bg: "#fefce8" },
  tennis:     { accent: "#84cc16", bg: "#f7fee7" },
  swimming:   { accent: "#3b82f6", bg: "#eff6ff" },
  chess:      { accent: "#64748b", bg: "#f8fafc" },
  music:      { accent: "#ec4899", bg: "#fdf2f8" },
  art:        { accent: "#a855f7", bg: "#faf5ff" },
  dance:      { accent: "#ef4444", bg: "#fef2f2" },
  drama:      { accent: "#6366f1", bg: "#eef2ff" },
  coding:     { accent: "#06b6d4", bg: "#ecfeff" },
  science:    { accent: "#14b8a6", bg: "#f0fdfa" },
  wrestling:  { accent: "#dc2626", bg: "#fef2f2" },
  boxing:     { accent: "#b45309", bg: "#fffbeb" },
  judo:       { accent: "#7c3aed", bg: "#f5f0ff" },
  athletics:  { accent: "#16a34a", bg: "#f0fdf4" },
  other:      { accent: "#6b7280", bg: "#f9fafb" },
};

function getStyle(category) {
  const key = (category || "").toLowerCase();
  return CATEGORY_STYLES[key] || { accent: "#7c3aed", bg: "#f5f0ff" };
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
    margin-bottom: 40px;
  }
  .p1-back:hover { background: rgba(124,58,237,0.06); color: #7c3aed; border-color: rgba(124,58,237,0.2); }
`;

const FILTERS = ["All", "Sports", "Arts & Culture", "Tech & Science"];

const FILTER_MAP = {
  "Sports":         ["Football", "Basketball", "Volleyball", "Tennis", "Swimming", "Dance", "Wrestling", "Boxing", "Judo", "Athletics"],
  "Arts & Culture": ["Music", "Art", "Drama"],
  "Tech & Science": ["Coding", "Science", "Chess"],
};

export default function CategoriesPage() {
  const router = useRouter();
  const [search, setSearch]           = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [clubs, setClubs]             = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState("");

  useEffect(() => {
    fetch(`${API}/clubs`)
      .then(r => r.json())
      .then(data => {
        if (data.success) setClubs(data.clubs);
        else setError("Клубуудыг ачаалахад алдаа гарлаа");
      })
      .catch(() => setError("Сервертэй холбогдож чадсангүй"))
      .finally(() => setLoading(false));
  }, []);

  const filtered = clubs.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
                        c.category.toLowerCase().includes(search.toLowerCase());
    const matchFilter = activeFilter === "All" || (FILTER_MAP[activeFilter] || []).map(f => f.toLowerCase()).includes(c.category.toLowerCase());
    return matchSearch && matchFilter;
  });

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#fff" }}>
      <style>{fonts}</style>
      <Header />
      <div style={{ height: "2px", background: "linear-gradient(90deg, #4c1d95, #7c3aed, #c4b5fd, #7c3aed, #4c1d95)" }} />

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
                  {loading ? "..." : `${clubs.length} Clubs`}
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
                Explore every club across Ulaanbaatar. Pick one, or pick a few.
              </p>
            </div>

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

          {loading ? (
            <div style={{ textAlign: "center", padding: "100px 0" }}>
              <p className="p1-sans" style={{ color: "#9879d4", fontSize: "15px" }}>Клубуудыг ачааллаж байна...</p>
            </div>
          ) : error ? (
            <div style={{ textAlign: "center", padding: "100px 0" }}>
              <div style={{ width: "72px", height: "72px", borderRadius: "20px", background: "#fef2f2", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", fontSize: "32px" }}>⚠️</div>
              <h3 className="p1-display" style={{ fontSize: "24px", color: "#1a0533", marginBottom: "10px", fontWeight: 800 }}>Холбогдож чадсангүй</h3>
              <p className="p1-sans" style={{ color: "#888", fontSize: "14px", marginBottom: "28px" }}>{error}</p>
              <button onClick={() => window.location.reload()} className="p1-sans" style={{
                background: "linear-gradient(135deg, #7c3aed, #4c1d95)", color: "#fff",
                border: "none", padding: "12px 28px", borderRadius: "9px",
                fontSize: "14px", fontWeight: 600, cursor: "pointer",
              }}>
                Дахин оролдох
              </button>
            </div>
          ) : filtered.length > 0 ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "16px" }}>
              {filtered.map((club, i) => {
                const { accent, bg } = getStyle(club.category);
                return (
                  <a
                    key={club.id}
                    href={`/club-detail?id=${club.id}`}
                    className="p1-card p1-card-in"
                    style={{ animationDelay: `${i * 40}ms` }}
                  >
                    <div style={{
                      position: "absolute", top: 0, left: "24px", right: "24px",
                      height: "2px", background: accent,
                      borderRadius: "0 0 2px 2px", opacity: 0.6,
                    }} />

                    <div style={{
                      width: "52px", height: "52px",
                      background: bg,
                      border: `1.5px solid ${accent}28`,
                      borderRadius: "14px",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      marginBottom: "20px",
                      boxShadow: `0 4px 12px ${accent}18`,
                      overflow: "hidden",
                    }}>
                      {club.logo
                        ? <img src={club.logo} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt={club.name} />
                        : <span style={{ fontFamily: "'Fraunces', serif", fontSize: "22px", fontWeight: 800, color: accent }}>
                            {club.name[0]}
                          </span>
                      }
                    </div>

                    <div className="p1-display" style={{
                      fontSize: "18px", fontWeight: 800,
                      color: "#1a0533", letterSpacing: "-0.02em", lineHeight: 1.2,
                      marginBottom: "6px",
                    }}>
                      {club.name}
                    </div>

                    <p className="p1-sans" style={{
                      fontSize: "12.5px", color: "#888", lineHeight: 1.6,
                      margin: "0 0 auto", flexGrow: 1, paddingBottom: "18px",
                    }}>
                      {club.description?.slice(0, 80)}{club.description?.length > 80 ? "..." : ""}
                    </p>

                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "16px", borderTop: `1px solid ${accent}18` }}>
                      <span className="p1-sans" style={{
                        fontSize: "11px", fontWeight: 700,
                        color: accent, background: bg,
                        padding: "3px 9px", borderRadius: "5px",
                        letterSpacing: "0.06em",
                      }}>
                        {club.category}
                      </span>
                      <span className="p1-sans" style={{
                        fontSize: "11px", fontWeight: 600,
                        color: club.pricing_type === "free" ? "#22c55e" : "#7c3aed",
                        background: club.pricing_type === "free" ? "#f0fdf4" : "#f5f0ff",
                        padding: "3px 9px", borderRadius: "5px",
                      }}>
                        {club.pricing_type === "free" ? "Free" : "Paid"}
                      </span>
                    </div>
                  </a>
                );
              })}
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "100px 0" }}>
              <div style={{
                width: "72px", height: "72px", borderRadius: "20px",
                background: "#f5f0ff", border: "1px solid rgba(124,58,237,0.12)",
                display: "flex", alignItems: "center", justifyContent: "center",
                margin: "0 auto 24px", fontSize: "32px",
              }}>🔍</div>
              <h3 className="p1-display" style={{ fontSize: "24px", color: "#1a0533", marginBottom: "10px", fontWeight: 800 }}>
                {clubs.length === 0 ? "Клуб байхгүй байна" : "Олдсонгүй"}
              </h3>
              <p className="p1-sans" style={{ color: "#888", fontSize: "14px", marginBottom: "28px" }}>
                {clubs.length === 0 ? "Эхний клубыг бүртгүүлээрэй!" : "Өөр хайлт туршина уу"}
              </p>
              {clubs.length === 0 ? (
                <a href="/club-register" className="p1-sans" style={{
                  background: "linear-gradient(135deg, #7c3aed, #4c1d95)", color: "#fff",
                  border: "none", padding: "12px 28px", borderRadius: "9px",
                  fontSize: "14px", fontWeight: 600, textDecoration: "none",
                  display: "inline-block",
                }}>
                  Register a club →
                </a>
              ) : (
                <button onClick={() => { setSearch(""); setActiveFilter("All"); }} className="p1-sans" style={{
                  background: "linear-gradient(135deg, #7c3aed, #4c1d95)", color: "#fff",
                  border: "none", padding: "12px 28px", borderRadius: "9px",
                  fontSize: "14px", fontWeight: 600, cursor: "pointer",
                }}>
                  Clear filters
                </button>
              )}
            </div>
          )}
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
              whiteSpace: "nowrap", flexShrink: 0,
              position: "relative", zIndex: 1,
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