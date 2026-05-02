import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import Header from "@/waterbottle/Header";
import Footer from "@/waterbottle/Footer";

const MapPicker = dynamic(() => import("@/waterbottle/Mapcomponent"), { ssr: false });

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const fetchAPI = (url, options = {}) =>
  fetch(url, {
    ...options,
    headers: { "ngrok-skip-browser-warning": "true", ...options.headers },
  });

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

function getCategoryStyle(category) {
  const key = (category || "").toLowerCase();
  return CATEGORY_STYLES[key] || { accent: "#7c3aed", bg: "#f5f0ff" };
}

const fonts = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,700;0,9..144,800;1,9..144,700&family=DM+Sans:wght@400;500;600;700&display=swap');
  .cd-display { font-family: 'Fraunces', serif; }
  .cd-sans    { font-family: 'DM Sans', sans-serif; }

  @keyframes cd-fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:none} }
  .cd-fadein { animation: cd-fadeUp 0.45s cubic-bezier(.22,1,.36,1) both; }

  .cd-join-btn {
    display: inline-flex; align-items: center; justify-content: center; gap: 8px;
    padding: 14px 36px;
    background: linear-gradient(135deg,#7c3aed,#4c1d95);
    color: #fff; border: none; border-radius: 14px;
    font-family: 'DM Sans', sans-serif; font-size: 15px; font-weight: 700;
    cursor: pointer; transition: transform .18s, box-shadow .18s;
    box-shadow: 0 8px 28px rgba(124,58,237,0.38);
    width: 100%;
  }
  .cd-join-btn:hover { transform: translateY(-2px); box-shadow: 0 12px 36px rgba(124,58,237,.52); }
  .cd-join-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

  .cd-leave-btn {
    display: inline-flex; align-items: center; justify-content: center; gap: 8px;
    padding: 14px 36px;
    background: none; color: #7c3aed;
    border: 1.5px solid rgba(124,58,237,0.3); border-radius: 14px;
    font-family: 'DM Sans', sans-serif; font-size: 15px; font-weight: 700;
    cursor: pointer; transition: all .18s; width: 100%;
  }
  .cd-leave-btn:hover { background: rgba(124,58,237,.06); border-color: rgba(124,58,237,.6); }

  .cd-info-card {
    background: var(--bg-card);
    border: 1.5px solid var(--border-card);
    border-radius: 18px; padding: 24px;
    transition: background 0.3s, border-color 0.3s;
  }

  .cd-back {
    display: inline-flex; align-items: center; gap: 7px;
    font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 600;
    color: var(--text-secondary); background: var(--bg-card);
    border: 1px solid var(--border-subtle); border-radius: 8px;
    padding: 8px 14px; cursor: pointer; text-decoration: none;
    transition: all 0.2s; margin-bottom: 28px; display: inline-flex;
  }
  .cd-back:hover { background: rgba(124,58,237,.06); color: #7c3aed; border-color: rgba(124,58,237,.3); }
`;

export default function ClubDetailPage() {
  const router = useRouter();
  const { id } = router.query;

  const [club,     setClub]     = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState("");
  const [enrolled, setEnrolled] = useState(false);
  const [joining,  setJoining]  = useState(false);
  const [user,     setUser]     = useState(null);
  const [banners,  setBanners]  = useState([]);
  const [bannerIdx,setBannerIdx]= useState(0);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetchAPI(`${API}/clubs/${id}`)
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          setClub(data.club);
          try {
            const imgs = JSON.parse(data.club.banner || "[]");
            if (Array.isArray(imgs)) setBanners(imgs);
          } catch { setBanners([]); }
        } else {
          setError("Клуб олдсонгүй");
        }
      })
      .catch(() => setError("Сервертэй холбогдож чадсангүй"))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!user || !id) return;
    fetchAPI(`${API}/myClubs/${user.id}`)
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          setEnrolled(data.clubs.some(c => String(c.id) === String(id)));
        }
      })
      .catch(() => {});
  }, [user, id]);

  async function handleJoin() {
    if (!user) { router.push("/signin"); return; }
    setJoining(true);
    try {
      if (enrolled) {
        await fetchAPI(`${API}/leaveClub/${user.id}/${id}`, { method: "DELETE" });
        setEnrolled(false);
      } else {
        await fetchAPI(`${API}/joinClub`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user.id, clubId: id }),
        });
        setEnrolled(true);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setJoining(false);
    }
  }

  if (loading) return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--bg-page)" }}>
      <style>{fonts}</style>
      <Header />
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p className="cd-sans" style={{ color: "var(--text-muted)", fontSize: "15px" }}>Ачааллаж байна...</p>
      </div>
      <Footer />
    </div>
  );

  if (error || !club) return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--bg-page)" }}>
      <style>{fonts}</style>
      <Header />
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 16 }}>
        <div style={{ fontSize: "48px" }}>😕</div>
        <p className="cd-display" style={{ fontSize: "22px", color: "var(--text-primary)", fontWeight: 800 }}>{error || "Клуб олдсонгүй"}</p>
        <a href="/page1" className="cd-sans" style={{ color: "#7c3aed", fontWeight: 600, fontSize: "14px" }}>← Browse clubs</a>
      </div>
      <Footer />
    </div>
  );

  const { accent, bg } = getCategoryStyle(club.category);
  const tiers = (() => { try { return JSON.parse(club.tiers || "[]"); } catch { return []; } })();

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--bg-page)", transition: "background 0.3s" }}>
      <style>{fonts}</style>
      <Header />
      <div style={{ position: "relative", height: "280px", background: `linear-gradient(135deg, #0d0118 0%, #1a0533 50%, #2d0a57 100%)`, overflow: "hidden" }}>
        {banners.length > 0 ? (
          <>
            <img
              src={banners[bannerIdx]}
              alt="banner"
              style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.55 }}
            />
            {banners.length > 1 && (
              <div style={{ position: "absolute", bottom: "16px", left: "50%", transform: "translateX(-50%)", display: "flex", gap: "6px" }}>
                {banners.map((_, i) => (
                  <button key={i} onClick={() => setBannerIdx(i)} style={{
                    width: i === bannerIdx ? "20px" : "7px", height: "7px",
                    borderRadius: "4px", border: "none", cursor: "pointer",
                    background: i === bannerIdx ? "#fff" : "rgba(255,255,255,0.4)",
                    transition: "all 0.2s", padding: 0,
                  }}/>
                ))}
              </div>
            )}
          </>
        ) : (
          <div style={{ position: "absolute", inset: 0, background: `linear-gradient(135deg, ${accent}22, ${accent}08)` }}/>
        )}
        <svg aria-hidden="true" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}>
          <defs><pattern id="cd-dots" width="22" height="22" patternUnits="userSpaceOnUse"><circle cx="1.5" cy="1.5" r="1" fill="#c4b5fd" fillOpacity="0.07"/></pattern></defs>
          <rect width="100%" height="100%" fill="url(#cd-dots)"/>
        </svg>
      </div>

      <main style={{ flex: 1 }}>
        <div style={{ maxWidth: "960px", margin: "0 auto", padding: "0 32px 96px" }}>
          <div style={{ paddingTop: "28px" }}>
            <a href="/page1" className="cd-back">
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
              Browse clubs
            </a>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: "32px", alignItems: "start" }}>
            <div className="cd-fadein">
              <div style={{ display: "flex", alignItems: "flex-start", gap: "20px", marginBottom: "28px" }}>
                <div style={{
                  width: "72px", height: "72px", borderRadius: "18px", flexShrink: 0,
                  background: bg, border: `2px solid ${accent}28`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  overflow: "hidden", boxShadow: `0 4px 16px ${accent}20`,
                }}>
                  {club.logo
                    ? <img src={club.logo} alt={club.name} style={{ width: "100%", height: "100%", objectFit: "cover" }}/>
                    : <span style={{ fontFamily: "'Fraunces',serif", fontSize: "28px", fontWeight: 800, color: accent }}>{club.name[0]}</span>
                  }
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap", marginBottom: "6px" }}>
                    <h1 className="cd-display" style={{
                      fontSize: "clamp(1.6rem,3.5vw,2.2rem)", fontWeight: 800,
                      color: "var(--text-primary)", letterSpacing: "-0.03em",
                      margin: 0, lineHeight: 1.15, transition: "color 0.3s",
                    }}>{club.name}</h1>
                    {enrolled && (
                      <span className="cd-sans" style={{
                        fontSize: "11px", fontWeight: 700, padding: "3px 10px",
                        borderRadius: "20px", background: "rgba(34,197,94,0.1)",
                        color: "#22c55e", border: "1px solid rgba(34,197,94,0.2)",
                      }}>✓ Enrolled</span>
                    )}
                  </div>
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    <span className="cd-sans" style={{
                      fontSize: "11px", fontWeight: 700, padding: "4px 10px",
                      borderRadius: "6px", background: bg, color: accent,
                      letterSpacing: "0.06em", textTransform: "uppercase",
                    }}>{club.category}</span>
                    <span className="cd-sans" style={{
                      fontSize: "11px", fontWeight: 700, padding: "4px 10px",
                      borderRadius: "6px",
                      background: club.pricing_type === "free" ? "rgba(34,197,94,0.1)" : "rgba(124,58,237,0.1)",
                      color: club.pricing_type === "free" ? "#22c55e" : "#7c3aed",
                    }}>{club.pricing_type === "free" ? "Free" : "Paid"}</span>
                    {club.founded_year && (
                      <span className="cd-sans" style={{
                        fontSize: "11px", fontWeight: 600, padding: "4px 10px",
                        borderRadius: "6px", background: "var(--bg-input)", color: "var(--text-muted)",
                        transition: "all 0.3s",
                      }}>Est. {club.founded_year}</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="cd-info-card" style={{ marginBottom: "20px" }}>
                <p className="cd-sans" style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 12px", transition: "color 0.3s" }}>About</p>
                <p className="cd-sans" style={{ fontSize: "15px", color: "var(--text-secondary)", lineHeight: 1.75, margin: 0, transition: "color 0.3s" }}>{club.description}</p>
              </div>
              {club.pricing_type === "paid" && tiers.length > 0 && (
                <div className="cd-info-card" style={{ marginBottom: "20px" }}>
                  <p className="cd-sans" style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 16px", transition: "color 0.3s" }}>Membership Tiers</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    {tiers.map((tier, i) => (
                      <div key={i} style={{
                        padding: "16px 18px", borderRadius: "12px",
                        background: "var(--bg-input)", border: "1.5px solid var(--border-subtle)",
                        transition: "all 0.3s",
                      }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                          <span className="cd-sans" style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-primary)", transition: "color 0.3s" }}>{tier.name}</span>
                          <span className="cd-sans" style={{ fontSize: "14px", fontWeight: 800, color: "#7c3aed" }}>
                            ₮{tier.price}<span style={{ fontSize: "11px", fontWeight: 500, color: "var(--text-muted)" }}>/{tier.period || "mo"}</span>
                          </span>
                        </div>
                        {tier.description && <p className="cd-sans" style={{ fontSize: "13px", color: "var(--text-muted)", margin: "0 0 6px", lineHeight: 1.5, transition: "color 0.3s" }}>{tier.description}</p>}
                        {tier.features && (
                          <ul style={{ margin: 0, paddingLeft: "16px" }}>
                            {tier.features.split(",").map((f, j) => (
                              <li key={j} className="cd-sans" style={{ fontSize: "12.5px", color: "var(--text-muted)", lineHeight: 1.7, transition: "color 0.3s" }}>{f.trim()}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {club.lat && club.lng && (
                <div className="cd-info-card" style={{ marginBottom: "20px" }}>
                  <p className="cd-sans" style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 12px", transition: "color 0.3s" }}>Location</p>
                  {club.address && (
                    <p className="cd-sans" style={{ fontSize: "13.5px", color: "var(--text-secondary)", margin: "0 0 12px", display: "flex", alignItems: "center", gap: "6px", transition: "color 0.3s" }}>
                      <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                      {club.address}{club.district ? `, ${club.district}` : ""}
                    </p>
                  )}
                  <div style={{ borderRadius: "12px", overflow: "hidden", border: "1.5px solid var(--border-subtle)" }}>
                    <MapPicker
                      pickMode={false}
                      pickedLat={parseFloat(club.lat)}
                      pickedLng={parseFloat(club.lng)}
                      height="240px"
                      zoom={15}
                    />
                  </div>
                </div>
              )}
            </div>
            <div style={{ position: "sticky", top: "24px" }} className="cd-fadein">
              <div className="cd-info-card" style={{ marginBottom: "16px" }}>
                <button
                  onClick={handleJoin}
                  disabled={joining}
                  className={enrolled ? "cd-leave-btn" : "cd-join-btn"}
                >
                  {joining ? "..." : enrolled ? "Leave club" : user ? "Join club" : "Sign in to join"}
                </button>
                {!user && (
                  <p className="cd-sans" style={{ fontSize: "12px", color: "var(--text-muted)", textAlign: "center", margin: "10px 0 0", transition: "color 0.3s" }}>
                    <a href="/signin" style={{ color: "#7c3aed", fontWeight: 600, textDecoration: "none" }}>Sign in</a> or <a href="/signup" style={{ color: "#7c3aed", fontWeight: 600, textDecoration: "none" }}>create account</a>
                  </p>
                )}
              </div>
              <div className="cd-info-card">
                <p className="cd-sans" style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 16px", transition: "color 0.3s" }}>Contact</p>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {club.email && (
                    <a href={`mailto:${club.email}`} className="cd-sans" style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "13.5px", color: "var(--text-secondary)", textDecoration: "none", transition: "color 0.2s" }}
                      onMouseEnter={e => e.currentTarget.style.color = "#7c3aed"}
                      onMouseLeave={e => e.currentTarget.style.color = "var(--text-secondary)"}>
                      <div style={{ width: "32px", height: "32px", borderRadius: "9px", background: "var(--bg-input)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "background 0.3s" }}>
                        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                      </div>
                      {club.email}
                    </a>
                  )}
                  {club.phone && (
                    <a href={`tel:${club.phone}`} className="cd-sans" style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "13.5px", color: "var(--text-secondary)", textDecoration: "none", transition: "color 0.2s" }}
                      onMouseEnter={e => e.currentTarget.style.color = "#7c3aed"}
                      onMouseLeave={e => e.currentTarget.style.color = "var(--text-secondary)"}>
                      <div style={{ width: "32px", height: "32px", borderRadius: "9px", background: "var(--bg-input)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "background 0.3s" }}>
                        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.55a16 16 0 0 0 6.29 6.29l1.42-1.42a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                      </div>
                      {club.phone}
                    </a>
                  )}
                  {club.website && (
                    <a href={club.website} target="_blank" rel="noopener noreferrer" className="cd-sans" style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "13.5px", color: "var(--text-secondary)", textDecoration: "none", transition: "color 0.2s" }}
                      onMouseEnter={e => e.currentTarget.style.color = "#7c3aed"}
                      onMouseLeave={e => e.currentTarget.style.color = "var(--text-secondary)"}>
                      <div style={{ width: "32px", height: "32px", borderRadius: "9px", background: "var(--bg-input)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "background 0.3s" }}>
                        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                      </div>
                      {club.website.replace(/^https?:\/\//, "")}
                    </a>
                  )}
                  {!club.address && !club.district ? null : (
                    <div className="cd-sans" style={{ display: "flex", alignItems: "flex-start", gap: "10px", fontSize: "13.5px", color: "var(--text-secondary)", transition: "color 0.3s" }}>
                      <div style={{ width: "32px", height: "32px", borderRadius: "9px", background: "var(--bg-input)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: "1px", transition: "background 0.3s" }}>
                        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                      </div>
                      <span>{club.address}{club.district ? `, ${club.district}` : ""}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}