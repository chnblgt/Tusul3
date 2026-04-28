import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import Header from "@/waterbottle/Header";
import Footer from "@/waterbottle/Footer";

const MapComponent = dynamic(() => import("@/waterbottle/Mapcomponent"), { ssr: false });

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const fetchAPI = (url, options = {}) =>
  fetch(url, {
    ...options,
    headers: { "ngrok-skip-browser-warning": "true", ...options.headers },
  });


const fonts = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,700;0,9..144,800;1,9..144,700&family=DM+Sans:wght@400;500;600;700&display=swap');
  .cd-display { font-family: 'Fraunces', serif; }
  .cd-sans { font-family: 'DM Sans', sans-serif; }
`;

const styles = `
  .cd-back {
    display: inline-flex; align-items: center; gap: 7px;
    font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 600;
    color: rgba(255,255,255,0.85); background: rgba(255,255,255,0.12);
    border: 1px solid rgba(255,255,255,0.18); border-radius: 7px;
    padding: 7px 14px; cursor: pointer; text-decoration: none;
    transition: background 0.2s; backdrop-filter: blur(8px); line-height: 1;
  }
  .cd-back:hover { background: rgba(255,255,255,0.22); color: #fff; }

  .cd-section-title {
    font-family: 'Fraunces', serif; font-size: 20px; font-weight: 800;
    color: #1a0533; letter-spacing: -0.03em; margin: 0 0 20px;
    padding-bottom: 12px; border-bottom: 1px solid rgba(124,58,237,0.08);
  }

  .cd-contact-row {
    display: flex; align-items: center; gap: 10px;
    font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500;
    color: #555; text-decoration: none; transition: color 0.2s;
  }
  .cd-contact-row:hover { color: #7c3aed; }

  .cd-modal-overlay {
    position: fixed; inset: 0; background: rgba(13,1,24,0.5);
    display: flex; align-items: center; justify-content: center;
    z-index: 9000; padding: 24px; backdrop-filter: blur(4px);
  }
  .cd-modal {
    background: #fff; border-radius: 20px; padding: 36px;
    width: 100%; max-width: 460px;
    box-shadow: 0 24px 80px rgba(13,1,24,0.2);
    animation: cd-modalIn 0.2s cubic-bezier(0.22,1,0.36,1);
  }
  @keyframes cd-modalIn {
    from { opacity: 0; transform: scale(0.95) translateY(10px); }
    to   { opacity: 1; transform: scale(1) translateY(0); }
  }
`;

function PhotoPlaceholder({ index }) {
  const gradients = [
    "linear-gradient(135deg, #1a0533 0%, #3b0764 100%)",
    "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
    "linear-gradient(135deg, #14532d 0%, #166534 100%)",
  ];
  return (
    <div style={{ width: "100%", height: "100%", background: gradients[index % 3], display: "flex", alignItems: "center", justifyContent: "center" }}>
      <svg width="32" height="32" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" viewBox="0 0 24 24">
        <rect x="3" y="3" width="18" height="18" rx="4" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21 15 16 10 5 21" />
      </svg>
    </div>
  );
}
function parseTiers(club) {
  const raw = club?.tiers;
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function parseBanners(club) {
  const raw = club?.banner;
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [parsed];
  } catch {
    return typeof raw === "string" ? [raw] : [];
  }
}

function buildSlides(club) {
  const banners = parseBanners(club);
  if (banners.length > 0) return banners;
  if (club?.logo)          return [club.logo];
  return [null, null, null];
}

export default function ClubDetailPage() {
  const router = useRouter();
  const { id } = router.query;

  const [club, setClub]               = useState(null);
  const [loading, setLoading]         = useState(true);
  const [enrolled, setEnrolled]       = useState(false);
  const [activePhoto, setActivePhoto] = useState(0);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetchAPI(`${API}/clubs/${id}`)
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          setClub(data.club);
          const user = JSON.parse(localStorage.getItem("user") || "null");
          if (user) {
            fetchAPI(`${API}/myClubs/${user.id}`)
              .then(r => r.json())
              .then(d => {
                if (d.success) setEnrolled(d.clubs.some(c => c.id === data.club.id));
              });
          }
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => { setActivePhoto(0); }, [club]);

  async function handleJoin() {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    if (!user) { router.push("/signin"); return; }

    setActionLoading(true);
    try {
      if (enrolled) {
        await fetchAPI(`${API}/leaveClub/${user.id}/${club.id}`, { method: "DELETE" });
        setEnrolled(false);
      } else {
        await fetchAPI(`${API}/joinClub`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user.id, clubId: club.id }),
        });
        setEnrolled(true);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setActionLoading(false);
      setShowJoinModal(false);
    }
  }
  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#fff" }}>
        <style>{fonts + styles}</style>
        <Header />
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <p className="cd-sans" style={{ color: "#9879d4", fontSize: "15px" }}>Loading...</p>
        </div>
      </div>
    );
  }

  if (!club) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#fff" }}>
        <style>{fonts + styles}</style>
        <Header />
        <main style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ textAlign: "center" }}>
            <h2 className="cd-display" style={{ color: "#1a0533", fontSize: "24px" }}>Club not found</h2>
            <a href="/page1" className="cd-sans" style={{ color: "#7c3aed", fontWeight: 600 }}>← Browse clubs</a>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const slides = buildSlides(club);
  const pricingType = club.pricing_type || "free";
  const tiers = parseTiers(club);

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#fff" }}>
      <style>{fonts + styles}</style>
      <Header />
      <div style={{ position: "relative", height: "420px", background: "#0d0118", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0 }}>
          {slides[activePhoto]
            ? <img src={slides[activePhoto]} alt="Club banner" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            : <PhotoPlaceholder index={activePhoto} />
          }
        </div>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(13,1,24,0.1) 0%, rgba(13,1,24,0.7) 100%)", zIndex: 1 }} />

        {slides.length > 1 && (
          <div style={{ position: "absolute", bottom: "20px", left: "50%", transform: "translateX(-50%)", display: "flex", gap: "8px", zIndex: 3 }}>
            {slides.map((_, i) => (
              <button key={i} onClick={() => setActivePhoto(i)} style={{
                width: i === activePhoto ? "24px" : "8px", height: "8px", borderRadius: "4px",
                border: "none", cursor: "pointer", padding: 0,
                background: i === activePhoto ? "#fff" : "rgba(255,255,255,0.4)", transition: "all 0.3s",
              }} />
            ))}
          </div>
        )}

        <a href="/page1" className="cd-back" style={{ position: "absolute", top: "20px", left: "24px", zIndex: 3 }}>
          <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          All clubs
        </a>

        <div style={{ position: "absolute", bottom: "44px", left: "0", right: "0", padding: "0 48px", zIndex: 2, display: "flex", alignItems: "flex-end", gap: "20px" }}>
          <div style={{
            width: "80px", height: "80px", borderRadius: "16px", flexShrink: 0,
            background: "#1a0533", border: "3px solid rgba(255,255,255,0.2)",
            display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden",
          }}>
            {club.logo
              ? <img src={club.logo} alt={`${club.name} logo`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              : <span style={{ fontFamily: "'Fraunces', serif", fontSize: "28px", fontWeight: 800, color: "#fff" }}>
                  {club.name?.charAt(0).toUpperCase()}
                </span>
            }
          </div>
          <div style={{ flex: 1 }}>
            <h1 className="cd-display" style={{ fontSize: "clamp(1.6rem, 4vw, 2.6rem)", fontWeight: 800, color: "#fff", letterSpacing: "-0.04em", lineHeight: 1.15, margin: "0 0 8px" }}>
              {club.name}
            </h1>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {club.category && (
                <span className="cd-sans" style={{ fontSize: "12px", fontWeight: 600, color: "rgba(255,255,255,0.75)", background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.18)", borderRadius: "6px", padding: "4px 10px", backdropFilter: "blur(8px)" }}>
                  {club.category}
                </span>
              )}
              {club.district && (
                <span className="cd-sans" style={{ fontSize: "12px", fontWeight: 600, color: "rgba(255,255,255,0.75)", background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.18)", borderRadius: "6px", padding: "4px 10px", backdropFilter: "blur(8px)" }}>
                  📍 {club.district}
                </span>
              )}
              <span className="cd-sans" style={{ fontSize: "12px", fontWeight: 600, color: pricingType === "free" ? "#4ade80" : "#a78bfa", background: pricingType === "free" ? "rgba(34,197,94,0.15)" : "rgba(124,58,237,0.2)", border: `1px solid ${pricingType === "free" ? "rgba(34,197,94,0.3)" : "rgba(124,58,237,0.3)"}`, borderRadius: "6px", padding: "4px 10px" }}>
                {pricingType === "free" ? "Free" : "Paid"}
              </span>
            </div>
          </div>
        </div>
      </div>
      <main style={{ flex: 1, maxWidth: "1200px", margin: "0 auto", width: "100%", padding: "48px 48px 80px", display: "grid", gridTemplateColumns: "1fr 340px", gap: "48px", alignItems: "start" }}>
        <div>
          <section style={{ marginBottom: "40px" }}>
            <h2 className="cd-section-title">About</h2>
            <p className="cd-sans" style={{ fontSize: "15px", color: "#555", lineHeight: 1.8 }}>
              {club.description}
            </p>
          </section>

          <section style={{ marginBottom: "40px" }}>
            <h2 className="cd-section-title">Details</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              {[
                ["Category",   club.category],
                ["Founded",    club.founded_year ? `${club.founded_year}` : null],
                ["Membership", pricingType === "free" ? "Free to join" : "Paid membership"],
                ["District",   club.district],
              ].filter(([, v]) => v).map(([label, value]) => (
                <div key={label} style={{ background: "#fdfcff", border: "1.5px solid rgba(124,58,237,0.08)", borderRadius: "12px", padding: "16px 20px" }}>
                  <p className="cd-sans" style={{ fontSize: "10px", fontWeight: 700, color: "#9879d4", letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 4px" }}>{label}</p>
                  <p className="cd-sans" style={{ fontSize: "14px", fontWeight: 600, color: "#1a0533", margin: 0 }}>{value}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
        <div>
          <div style={{ position: "sticky", top: "90px", display: "flex", flexDirection: "column", gap: "20px" }}>
            <div style={{ background: "#fff", border: "1.5px solid rgba(124,58,237,0.12)", borderRadius: "18px", overflow: "hidden", boxShadow: "0 4px 24px rgba(124,58,237,0.06)" }}>
              <div style={{ padding: "10px 14px", borderBottom: "1px solid rgba(124,58,237,0.06)", display: "flex", alignItems: "center", gap: "6px", background: "#fdfcff" }}>
                <svg width="12" height="12" fill="none" stroke="#9879d4" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                <span className="cd-sans" style={{ fontSize: "11.5px", color: "#9879d4", fontWeight: 600 }}>Location</span>
              </div>
              <div style={{ height: "180px" }}>
                <MapComponent />
              </div>
              <div style={{ padding: "14px 16px", background: "#fdfcff" }}>
                <p className="cd-sans" style={{ fontSize: "13px", color: "#555", margin: 0, lineHeight: 1.6 }}>{club.address || "Ulaanbaatar, Mongolia"}</p>
              </div>
            </div>
            <div style={{ background: "#fff", border: "1.5px solid rgba(124,58,237,0.12)", borderRadius: "18px", padding: "22px", boxShadow: "0 4px 24px rgba(124,58,237,0.06)" }}>
              <h3 className="cd-sans" style={{ fontSize: "11px", fontWeight: 700, color: "#9879d4", letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 16px" }}>Contact</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "13px" }}>
                {club.email && (
                  <a href={`mailto:${club.email}`} className="cd-contact-row">
                    <svg width="14" height="14" fill="none" stroke="#9879d4" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                    <span>{club.email}</span>
                  </a>
                )}
                {club.phone && (
                  <a href={`tel:${club.phone}`} className="cd-contact-row">
                    <svg width="14" height="14" fill="none" stroke="#9879d4" strokeWidth="2" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.42 2 2 0 0 1 3.6 1.25h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.96a16 16 0 0 0 6.13 6.13l1.07-1.07a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                    <span>{club.phone}</span>
                  </a>
                )}
                {club.website && (
                  <a href={club.website} target="_blank" rel="noopener noreferrer" className="cd-contact-row">
                    <svg width="14" height="14" fill="none" stroke="#9879d4" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                    <span>{club.website.replace(/^https?:\/\//, "")}</span>
                  </a>
                )}
              </div>
            </div>
            <div style={{ background: "linear-gradient(135deg, #1a0533 0%, #3b0764 100%)", borderRadius: "18px", padding: "24px" }}>
              <p className="cd-display" style={{ fontSize: "20px", fontWeight: 800, color: "#fff", margin: "0 0 8px", letterSpacing: "-0.03em" }}>Ready to join?</p>
              <p className="cd-sans" style={{ fontSize: "13px", color: "#a78bfa", margin: "0 0 20px", lineHeight: 1.6 }}>
                {pricingType === "free" ? "It's completely free. Join now and get started." : `${tiers.length > 0 ? tiers.length + " membership tier" + (tiers.length > 1 ? "s" : "") + " available" : "Paid membership"}. View pricing details below.`}
              </p>
              <button
                onClick={() => { if (pricingType === "free") handleJoin(); else setShowJoinModal(true); }}
                disabled={actionLoading}
                className="cd-sans"
                style={{
                  width: "100%", padding: "13px",
                  background: enrolled ? "rgba(167,139,250,0.2)" : "#fff",
                  color: enrolled ? "#a78bfa" : "#1a0533",
                  border: enrolled ? "1px solid rgba(167,139,250,0.3)" : "none",
                  borderRadius: "10px", fontWeight: 700, fontSize: "14px", cursor: "pointer",
                }}
              >
                {actionLoading ? "..." : enrolled ? "✓ You're enrolled" : pricingType === "free" ? "Join for free →" : "View membership →"}
              </button>
            </div>
          </div>
        </div>
      </main>
      {showJoinModal && (
        <div className="cd-modal-overlay" onClick={e => e.target === e.currentTarget && setShowJoinModal(false)}>
          <div className="cd-modal" style={{ maxWidth: tiers.length > 1 ? "560px" : "460px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}>
              <div>
                <h2 className="cd-display" style={{ fontSize: "22px", fontWeight: 800, color: "#1a0533", margin: "0 0 4px", letterSpacing: "-0.03em" }}>
                  Join {club.name}
                </h2>
                <p className="cd-sans" style={{ fontSize: "12px", color: "#9879d4", margin: 0, fontWeight: 600 }}>
                  💳 Paid membership
                </p>
              </div>
              <button onClick={() => setShowJoinModal(false)} style={{ background: "rgba(124,58,237,0.06)", border: "1px solid rgba(124,58,237,0.12)", borderRadius: "8px", cursor: "pointer", color: "#9879d4", padding: "7px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12" /></svg>
              </button>
            </div>
            {tiers.length > 0 ? (
              <>
                <p className="cd-sans" style={{ fontSize: "13px", color: "#888", marginBottom: "16px", lineHeight: 1.6 }}>
                  Choose a membership plan and contact the club to enroll.
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "24px" }}>
                  {tiers.map((tier, i) => {
                    const periodLabel = { monthly: "/ сар", quarterly: "/ улирал", yearly: "/ жил", once: "нэг удаа" }[tier.period] || tier.period;
                    return (
                      <div key={i} style={{
                        border: i === 0 ? "2px solid #7c3aed" : "1.5px solid rgba(124,58,237,0.12)",
                        borderRadius: "14px", padding: "18px 20px",
                        background: i === 0 ? "linear-gradient(135deg, #f5f0ff 0%, #fdfcff 100%)" : "#fdfcff",
                        position: "relative",
                      }}>
                        {i === 0 && (
                          <span className="cd-sans" style={{
                            position: "absolute", top: "-10px", left: "16px",
                            background: "#7c3aed", color: "#fff",
                            fontSize: "10px", fontWeight: 700, letterSpacing: "0.06em",
                            padding: "3px 10px", borderRadius: "20px",
                          }}>POPULAR</span>
                        )}
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                          <div>
                            <p className="cd-sans" style={{ fontSize: "15px", fontWeight: 700, color: "#1a0533", margin: "0 0 3px" }}>{tier.name}</p>
                            {tier.description && (
                              <p className="cd-sans" style={{ fontSize: "12px", color: "#888", margin: 0 }}>{tier.description}</p>
                            )}
                          </div>
                          <div style={{ textAlign: "right", flexShrink: 0, marginLeft: "16px" }}>
                            <p className="cd-display" style={{ fontSize: "22px", fontWeight: 800, color: "#7c3aed", margin: "0 0 1px", letterSpacing: "-0.03em" }}>
                              ₮{Number(tier.price).toLocaleString()}
                            </p>
                            <p className="cd-sans" style={{ fontSize: "11px", color: "#bbb", margin: 0, fontWeight: 600 }}>{periodLabel}</p>
                          </div>
                        </div>
                        {tier.features && (
                          <div style={{ marginTop: "12px", paddingTop: "12px", borderTop: "1px solid rgba(124,58,237,0.08)" }}>
                            {tier.features.split(",").map(f => f.trim()).filter(Boolean).map((feat, fi) => (
                              <div key={fi} style={{ display: "flex", alignItems: "center", gap: "7px", marginBottom: "5px" }}>
                                <svg width="12" height="12" fill="none" stroke="#22c55e" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
                                <span className="cd-sans" style={{ fontSize: "12px", color: "#555" }}>{feat}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              <p className="cd-sans" style={{ fontSize: "14px", color: "#555", marginBottom: "20px", lineHeight: 1.7 }}>
                Гишүүнчлэлийн нарийвчилсан мэдээлэл авахын тулд клубтай холбогдоно уу.
              </p>
            )}
            <div style={{ background: "#f5f0ff", border: "1px solid rgba(124,58,237,0.12)", borderRadius: "12px", padding: "14px 18px", marginBottom: "20px", display: "flex", alignItems: "center", gap: "12px" }}>
              <svg width="16" height="16" fill="none" stroke="#7c3aed" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              <p className="cd-sans" style={{ fontSize: "13px", color: "#5b21b6", margin: 0 }}>
                Бүртгүүлэхийн тулд <strong>{club.email}</strong> рүү имэйл илгээнэ үү.
              </p>
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              <a
                href={`mailto:${club.email}?subject=Membership inquiry — ${club.name}`}
                className="cd-sans"
                style={{
                  flex: 1, padding: "14px", textAlign: "center",
                  background: "linear-gradient(135deg, #7c3aed, #4c1d95)", color: "#fff",
                  border: "none", borderRadius: "10px", fontWeight: 700, fontSize: "14px",
                  cursor: "pointer", boxShadow: "0 4px 16px rgba(124,58,237,0.3)",
                  textDecoration: "none", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                }}
              >
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                Имэйл илгээх →
              </a>
              <button
                onClick={handleJoin}
                disabled={actionLoading}
                className="cd-sans"
                style={{
                  padding: "14px 20px", background: enrolled ? "#fef2f2" : "#f5f0ff",
                  color: enrolled ? "#ef4444" : "#7c3aed",
                  border: `1.5px solid ${enrolled ? "rgba(239,68,68,0.2)" : "rgba(124,58,237,0.2)"}`,
                  borderRadius: "10px", fontWeight: 700, fontSize: "13px", cursor: "pointer",
                  whiteSpace: "nowrap",
                }}
              >
                {actionLoading ? "..." : enrolled ? "Leave" : "Quick join"}
              </button>
            </div>

            <p className="cd-sans" style={{ textAlign: "center", fontSize: "11.5px", color: "#c4b5fd", marginTop: "14px" }}>
              Та хэзээ ч профайлаасаа клубаас гарах боломжтой.
            </p>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}