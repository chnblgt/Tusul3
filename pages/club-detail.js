import { useState } from "react";
import dynamic from "next/dynamic";
import Header from "@/waterbottle/Header";
import Footer from "@/waterbottle/Footer";

const MapComponent = dynamic(() => import("@/waterbottle/Mapcomponent"), { ssr: false });

// ─── Mock data (replace with real data fetching later) ───────────────────────
const MOCK_CLUB = {
  id: "ulaanbaatar-fc",
  name: "Ulaanbaatar FC",
  category: "Football",
  accent: "#22c55e",
  accentBg: "#f0fdf4",
  founded: 2017,
  memberCount: 342,
  description: `Ulaanbaatar FC is one of the most active football clubs in the city, welcoming players of all skill levels — from complete beginners to seasoned athletes. We train three times a week at the National Sports Complex and compete in the Ulaanbaatar Amateur League each season.\n\nOur community is built on passion for the game, discipline on and off the pitch, and a deep love for Mongolian football culture. Whether you're looking to get fit, make lifelong friends, or compete seriously, UBFC is the place for you.`,
  bannerPhotos: [null, null, null],
  logo: null,
  address: "Суурин 4, Сүхбаатар дүүрэг, Улаанбаатар",
  district: "Сүхбаатар",
  coords: [47.9057, 106.8832],
  email: "info@ubfc.mn",
  phone: "+976 9911 6769",
  website: "https://ubfc.mn",
  pricingType: "paid",
  tiers: [
    {
      name: "Basic",
      price: "15,000",
      period: "monthly",
      description: "Perfect for casual players",
      features: ["3 training sessions/week", "Locker room access", "Club jersey"],
    },
    {
      name: "Pro",
      price: "28,000",
      period: "monthly",
      description: "For competitive players",
      features: ["Unlimited training", "Personal coaching", "Match kit", "Video analysis", "Priority selection"],
      popular: true,
    },
    {
      name: "Yearly",
      price: "140,000",
      period: "yearly",
      description: "Best value — 2 months free",
      features: ["All Pro features", "2 months free", "Annual kit included", "Camp discounts"],
    },
  ],
};

// ─── Components ──────────────────────────────────────────────────────────────

function PhotoPlaceholder({ index, accent }) {
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

export default function ClubDetailPage({ club = MOCK_CLUB }) {
  const [enrolled, setEnrolled] = useState(false);
  const [activePhoto, setActivePhoto] = useState(0);
  const [selectedTier, setSelectedTier] = useState(null);
  const [showJoinModal, setShowJoinModal] = useState(false);

  const periodLabel = { monthly: "/mo", quarterly: "/qtr", yearly: "/yr", once: " one-time" };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#fff" }}>
      <style>{fonts + styles}</style>
      <Header />
      <div style={{ height: "2px", background: "linear-gradient(90deg, #4c1d95, #7c3aed, #c4b5fd, #7c3aed, #4c1d95)" }} />

      {/* ── Hero banner ── */}
      <div style={{ position: "relative", height: "420px", background: "#0d0118", overflow: "hidden" }}>
        {/* Main photo */}
        <div style={{ position: "absolute", inset: 0 }}>
          {club.bannerPhotos[activePhoto]
            ? <img src={club.bannerPhotos[activePhoto]} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            : <PhotoPlaceholder index={activePhoto} accent={club.accent} />
          }
        </div>

        {/* Gradient overlay */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to bottom, rgba(13,1,24,0.1) 0%, rgba(13,1,24,0.7) 100%)",
          zIndex: 1,
        }} />

        {/* Photo thumbnails */}
        {club.bannerPhotos.length > 1 && (
          <div style={{
            position: "absolute", bottom: "20px", left: "50%", transform: "translateX(-50%)",
            display: "flex", gap: "8px", zIndex: 3,
          }}>
            {club.bannerPhotos.map((_, i) => (
              <button key={i} onClick={() => setActivePhoto(i)} style={{
                width: i === activePhoto ? "24px" : "8px",
                height: "8px", borderRadius: "4px", border: "none", cursor: "pointer", padding: 0,
                background: i === activePhoto ? "#fff" : "rgba(255,255,255,0.4)",
                transition: "all 0.3s",
              }} />
            ))}
          </div>
        )}

        {/* Back button */}
        <a href="/page1" className="cd-back" style={{ position: "absolute", top: "20px", left: "24px", zIndex: 3 }}>
          <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          All clubs
        </a>

        {/* Club identity on hero */}
        <div style={{
          position: "absolute", bottom: "44px", left: "0", right: "0",
          padding: "0 48px", zIndex: 2,
          display: "flex", alignItems: "flex-end", gap: "20px",
        }}>
          {/* Logo */}
          <div style={{
            width: "80px", height: "80px", borderRadius: "16px", flexShrink: 0,
            background: club.logo ? "transparent" : "#1a0533",
            border: "3px solid rgba(255,255,255,0.2)",
            display: "flex", alignItems: "center", justifyContent: "center",
            overflow: "hidden",
          }}>
            {club.logo
              ? <img src={club.logo} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              : <span style={{ fontFamily: "'Fraunces', serif", fontSize: "28px", fontWeight: 800, color: "#fff" }}>
                  {club.name.split(" ").map(w => w[0]).join("").slice(0, 2)}
                </span>
            }
          </div>
          <div>
            <div style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
              <span style={{
                background: club.accentBg, color: club.accent,
                padding: "3px 10px", borderRadius: "20px",
                fontSize: "11px", fontWeight: 700, letterSpacing: "0.08em",
                textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif",
              }}>{club.category}</span>
              {club.pricingType === "free" && (
                <span style={{
                  background: "#f0fdf4", color: "#22c55e",
                  padding: "3px 10px", borderRadius: "20px",
                  fontSize: "11px", fontWeight: 700, letterSpacing: "0.08em",
                  textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif",
                }}>Free</span>
              )}
            </div>
            <h1 className="cd-display" style={{
              fontSize: "clamp(1.8rem, 4vw, 3rem)", fontWeight: 800, color: "#fff",
              letterSpacing: "-0.04em", margin: 0, lineHeight: 1.1,
              textShadow: "0 2px 12px rgba(0,0,0,0.3)",
            }}>{club.name}</h1>
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <main style={{ flex: 1 }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 48px 96px" }}>

          {/* Stats + Join bar */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "28px 0", borderBottom: "1px solid rgba(124,58,237,0.08)",
            flexWrap: "wrap", gap: "20px",
          }}>
            <div style={{ display: "flex", gap: "40px" }}>
              {[
                [club.memberCount.toLocaleString(), "Members"],
                [club.founded ? `Est. ${club.founded}` : "—", "Founded"],
                [club.district || "UB", "District"],
              ].map(([val, lbl]) => (
                <div key={lbl}>
                  <div className="cd-display" style={{ fontSize: "22px", fontWeight: 800, color: "#1a0533", letterSpacing: "-0.03em", lineHeight: 1 }}>{val}</div>
                  <div className="cd-sans" style={{ fontSize: "11px", color: "#9879d4", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", marginTop: "4px" }}>{lbl}</div>
                </div>
              ))}
            </div>

            <button
              onClick={() => {
                if (club.pricingType === "free") setEnrolled(v => !v);
                else setShowJoinModal(true);
              }}
              className="cd-join-btn"
              style={{
                background: enrolled ? "#f5f0ff" : "linear-gradient(135deg, #7c3aed, #4c1d95)",
                color: enrolled ? "#7c3aed" : "#fff",
                border: enrolled ? "1.5px solid rgba(124,58,237,0.3)" : "none",
              }}
            >
              {enrolled ? (
                <><svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg> Enrolled</>
              ) : (
                <>{club.pricingType === "free" ? "Join for free" : "Join this club"} →</>
              )}
            </button>
          </div>

          {/* Two-col layout */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: "56px", paddingTop: "52px" }}>

            {/* Left col */}
            <div>

              {/* About */}
              <section style={{ marginBottom: "56px" }}>
                <h2 className="cd-section-title">About</h2>
                {club.description.split("\n\n").map((para, i) => (
                  <p key={i} className="cd-sans" style={{ fontSize: "15px", color: "#555", lineHeight: 1.8, marginBottom: "16px" }}>{para}</p>
                ))}
              </section>

              {/* Pricing */}
              {club.pricingType === "paid" && (
                <section style={{ marginBottom: "56px" }}>
                  <h2 className="cd-section-title">Membership</h2>
                  <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                    {club.tiers.map((tier, i) => (
                      <div key={i} className={`cd-tier${tier.popular ? " cd-tier-popular" : ""}`}>
                        {tier.popular && (
                          <div style={{
                            position: "absolute", top: "-11px", left: "20px",
                            background: "linear-gradient(135deg, #7c3aed, #4c1d95)",
                            color: "#fff", fontSize: "10px", fontWeight: 700,
                            letterSpacing: "0.1em", textTransform: "uppercase",
                            padding: "3px 10px", borderRadius: "20px",
                            fontFamily: "'DM Sans', sans-serif",
                          }}>Most Popular</div>
                        )}
                        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "10px" }}>
                          <div>
                            <div className="cd-display" style={{ fontSize: "18px", fontWeight: 800, color: "#1a0533", letterSpacing: "-0.02em" }}>{tier.name}</div>
                            {tier.description && <div className="cd-sans" style={{ fontSize: "13px", color: "#888", marginTop: "2px" }}>{tier.description}</div>}
                          </div>
                          <div style={{ textAlign: "right" }}>
                            <span className="cd-display" style={{ fontSize: "24px", fontWeight: 800, color: "#1a0533", letterSpacing: "-0.03em" }}>
                              ₮{tier.price}
                            </span>
                            <span className="cd-sans" style={{ fontSize: "12px", color: "#9879d4", fontWeight: 600 }}>
                              {periodLabel[tier.period] || `/${tier.period}`}
                            </span>
                          </div>
                        </div>
                        {tier.features && (
                          <div style={{ display: "flex", flexWrap: "wrap", gap: "7px", marginTop: "12px" }}>
                            {tier.features.map((f, j) => (
                              <span key={j} className="cd-sans" style={{
                                display: "flex", alignItems: "center", gap: "5px",
                                fontSize: "12.5px", color: "#555", fontWeight: 500,
                                background: tier.popular ? "rgba(124,58,237,0.06)" : "#f8f8f8",
                                border: `1px solid ${tier.popular ? "rgba(124,58,237,0.12)" : "#f0f0f0"}`,
                                borderRadius: "6px", padding: "4px 10px",
                              }}>
                                <svg width="10" height="10" fill="none" stroke={tier.popular ? "#7c3aed" : "#22c55e"} strokeWidth="2.5" viewBox="0 0 24 24">
                                  <polyline points="20 6 9 17 4 12" />
                                </svg>
                                {f}
                              </span>
                            ))}
                          </div>
                        )}
                        <button
                          onClick={() => { setSelectedTier(i); setShowJoinModal(true); }}
                          className="cd-sans"
                          style={{
                            marginTop: "16px", width: "100%",
                            padding: "11px", borderRadius: "9px",
                            border: tier.popular ? "none" : "1.5px solid rgba(124,58,237,0.2)",
                            background: tier.popular ? "linear-gradient(135deg, #7c3aed, #4c1d95)" : "#fff",
                            color: tier.popular ? "#fff" : "#7c3aed",
                            fontWeight: 700, fontSize: "13.5px", cursor: "pointer",
                            transition: "all 0.2s",
                          }}
                          onMouseEnter={e => {
                            if (!tier.popular) { e.currentTarget.style.background = "#f5f0ff"; }
                            else { e.currentTarget.style.opacity = "0.9"; }
                          }}
                          onMouseLeave={e => {
                            if (!tier.popular) { e.currentTarget.style.background = "#fff"; }
                            else { e.currentTarget.style.opacity = "1"; }
                          }}
                        >
                          Choose {tier.name}
                        </button>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {club.pricingType === "free" && (
                <section style={{ marginBottom: "56px" }}>
                  <h2 className="cd-section-title">Membership</h2>
                  <div style={{
                    background: "#f0fdf4", border: "1.5px solid rgba(34,197,94,0.2)",
                    borderRadius: "14px", padding: "28px",
                    display: "flex", alignItems: "center", gap: "20px",
                  }}>
                    <div style={{
                      width: "52px", height: "52px", borderRadius: "14px",
                      background: "#dcfce7", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                    }}>
                      <svg width="24" height="24" fill="none" stroke="#22c55e" strokeWidth="2" viewBox="0 0 24 24">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                    <div>
                      <div className="cd-display" style={{ fontSize: "20px", fontWeight: 800, color: "#166534", marginBottom: "4px" }}>Free to join</div>
                      <p className="cd-sans" style={{ fontSize: "14px", color: "#166534", opacity: 0.8, margin: 0 }}>
                        This club has no membership fees. Just click Join and you're in.
                      </p>
                    </div>
                  </div>
                </section>
              )}
            </div>

            {/* Right col — sticky sidebar */}
            <div>
              <div style={{ position: "sticky", top: "90px", display: "flex", flexDirection: "column", gap: "20px" }}>

                {/* Location card */}
                <div style={{
                  background: "#fff", border: "1.5px solid rgba(124,58,237,0.12)",
                  borderRadius: "18px", overflow: "hidden",
                  boxShadow: "0 4px 24px rgba(124,58,237,0.06)",
                }}>
                  <div style={{
                    padding: "10px 14px",
                    borderBottom: "1px solid rgba(124,58,237,0.06)",
                    display: "flex", alignItems: "center", gap: "6px",
                    background: "#fdfcff",
                  }}>
                    <svg width="12" height="12" fill="none" stroke="#9879d4" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                    </svg>
                    <span className="cd-sans" style={{ fontSize: "11.5px", color: "#9879d4", fontWeight: 600 }}>Location</span>
                  </div>
                  <div style={{ height: "180px" }}>
                    <MapComponent />
                  </div>
                  <div style={{ padding: "14px 16px", background: "#fdfcff" }}>
                    <p className="cd-sans" style={{ fontSize: "13px", color: "#555", margin: 0, lineHeight: 1.6 }}>{club.address}</p>
                  </div>
                </div>

                {/* Contact card */}
                <div style={{
                  background: "#fff", border: "1.5px solid rgba(124,58,237,0.12)",
                  borderRadius: "18px", padding: "22px",
                  boxShadow: "0 4px 24px rgba(124,58,237,0.06)",
                }}>
                  <h3 className="cd-sans" style={{ fontSize: "11px", fontWeight: 700, color: "#9879d4", letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 16px" }}>
                    Contact
                  </h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "13px" }}>
                    {club.email && (
                      <a href={`mailto:${club.email}`} className="cd-contact-row">
                        <svg width="14" height="14" fill="none" stroke="#9879d4" strokeWidth="2" viewBox="0 0 24 24">
                          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                          <polyline points="22,6 12,13 2,6"/>
                        </svg>
                        <span>{club.email}</span>
                      </a>
                    )}
                    {club.phone && (
                      <a href={`tel:${club.phone}`} className="cd-contact-row">
                        <svg width="14" height="14" fill="none" stroke="#9879d4" strokeWidth="2" viewBox="0 0 24 24">
                          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.42 2 2 0 0 1 3.6 1.25h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.96a16 16 0 0 0 6.13 6.13l1.07-1.07a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                        </svg>
                        <span>{club.phone}</span>
                      </a>
                    )}
                    {club.website && (
                      <a href={club.website} target="_blank" rel="noopener noreferrer" className="cd-contact-row">
                        <svg width="14" height="14" fill="none" stroke="#9879d4" strokeWidth="2" viewBox="0 0 24 24">
                          <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/>
                          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                        </svg>
                        <span>{club.website.replace(/^https?:\/\//, "")}</span>
                      </a>
                    )}
                  </div>
                </div>

                {/* CTA card */}
                <div style={{
                  background: "linear-gradient(135deg, #1a0533 0%, #3b0764 100%)",
                  borderRadius: "18px", padding: "24px",
                }}>
                  <p className="cd-display" style={{ fontSize: "20px", fontWeight: 800, color: "#fff", margin: "0 0 8px", letterSpacing: "-0.03em" }}>
                    Ready to join?
                  </p>
                  <p className="cd-sans" style={{ fontSize: "13px", color: "#a78bfa", margin: "0 0 20px", lineHeight: 1.6 }}>
                    {club.pricingType === "free"
                      ? "It's completely free. Join now and get started."
                      : `${club.tiers.length} membership option${club.tiers.length > 1 ? "s" : ""} available.`}
                  </p>
                  <button
                    onClick={() => {
                      if (club.pricingType === "free") setEnrolled(v => !v);
                      else setShowJoinModal(true);
                    }}
                    className="cd-sans"
                    style={{
                      width: "100%", padding: "13px",
                      background: enrolled ? "rgba(167,139,250,0.2)" : "#fff",
                      color: enrolled ? "#a78bfa" : "#1a0533",
                      border: enrolled ? "1px solid rgba(167,139,250,0.3)" : "none",
                      borderRadius: "10px", fontWeight: 700, fontSize: "14px",
                      cursor: "pointer", transition: "all 0.2s",
                    }}
                    onMouseEnter={e => { if (!enrolled) e.currentTarget.style.background = "#f5f0ff"; }}
                    onMouseLeave={e => { if (!enrolled) e.currentTarget.style.background = "#fff"; }}
                  >
                    {enrolled ? "✓ You're enrolled" : club.pricingType === "free" ? "Join for free →" : "View membership →"}
                  </button>
                </div>

              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ── Join modal ── */}
      {showJoinModal && (
        <div className="cd-modal-overlay" onClick={e => e.target === e.currentTarget && setShowJoinModal(false)}>
          <div className="cd-modal">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}>
              <h2 className="cd-display" style={{ fontSize: "22px", fontWeight: 800, color: "#1a0533", margin: 0, letterSpacing: "-0.03em" }}>
                Join {club.name}
              </h2>
              <button onClick={() => setShowJoinModal(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#bbb", padding: 0 }}>
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            {club.pricingType === "paid" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "24px" }}>
                {club.tiers.map((tier, i) => (
                  <div key={i}
                    onClick={() => setSelectedTier(i)}
                    style={{
                      padding: "16px", borderRadius: "12px", cursor: "pointer",
                      border: `1.5px solid ${selectedTier === i ? "#7c3aed" : "rgba(124,58,237,0.12)"}`,
                      background: selectedTier === i ? "#f5f0ff" : "#fdfcff",
                      transition: "all 0.2s",
                      display: "flex", justifyContent: "space-between", alignItems: "center",
                    }}>
                    <div>
                      <div className="cd-sans" style={{ fontWeight: 700, fontSize: "14px", color: "#1a0533" }}>{tier.name}</div>
                      {tier.description && <div className="cd-sans" style={{ fontSize: "12px", color: "#888" }}>{tier.description}</div>}
                    </div>
                    <div className="cd-display" style={{ fontSize: "18px", fontWeight: 800, color: selectedTier === i ? "#7c3aed" : "#1a0533" }}>
                      ₮{tier.price}<span className="cd-sans" style={{ fontSize: "11px", color: "#9879d4", fontWeight: 500 }}>{periodLabel[tier.period]}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={() => { setEnrolled(true); setShowJoinModal(false); }}
              disabled={club.pricingType === "paid" && selectedTier === null}
              className="cd-sans"
              style={{
                width: "100%", padding: "14px",
                background: (club.pricingType === "free" || selectedTier !== null) ? "linear-gradient(135deg, #7c3aed, #4c1d95)" : "#e5e7eb",
                color: (club.pricingType === "free" || selectedTier !== null) ? "#fff" : "#bbb",
                border: "none", borderRadius: "10px", fontWeight: 700, fontSize: "14px",
                cursor: (club.pricingType === "free" || selectedTier !== null) ? "pointer" : "not-allowed",
                boxShadow: (club.pricingType === "free" || selectedTier !== null) ? "0 4px 16px rgba(124,58,237,0.3)" : "none",
              }}
            >
              {club.pricingType === "free" ? "Confirm & Join →" : selectedTier !== null ? `Join with ${club.tiers[selectedTier].name} →` : "Select a tier to continue"}
            </button>

            <p className="cd-sans" style={{ textAlign: "center", fontSize: "12px", color: "#bbb", marginTop: "14px" }}>
              You can leave the club at any time from your profile.
            </p>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

const fonts = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,700;0,9..144,800;1,9..144,700&family=DM+Sans:wght@400;500;600;700&display=swap');
  .cd-display { font-family: 'Fraunces', serif; }
  .cd-sans { font-family: 'DM Sans', sans-serif; }
`;

const styles = `
  .cd-back {
    display: inline-flex; align-items: center; gap: 7px;
    font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 600;
    color: rgba(255,255,255,0.85);
    background: rgba(255,255,255,0.12);
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

  .cd-tier {
    background: #fff; border: 1.5px solid rgba(124,58,237,0.12);
    border-radius: 16px; padding: 24px; position: relative;
    transition: box-shadow 0.2s, transform 0.2s;
  }
  .cd-tier:hover { box-shadow: 0 8px 32px rgba(124,58,237,0.1); transform: translateY(-2px); }
  .cd-tier-popular {
    border-color: #7c3aed;
    box-shadow: 0 4px 24px rgba(124,58,237,0.12);
    background: linear-gradient(to bottom right, #fdfcff, #f5f0ff);
  }

  .cd-contact-row {
    display: flex; align-items: center; gap: 10px;
    font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500;
    color: #555; text-decoration: none; transition: color 0.2s;
  }
  .cd-contact-row:hover { color: #7c3aed; }

  .cd-join-btn {
    font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 700;
    padding: 12px 28px; border-radius: 9px; cursor: pointer;
    display: flex; align-items: center; gap: 7px;
    transition: all 0.2s; line-height: 1;
    box-shadow: 0 4px 16px rgba(124,58,237,0.25);
  }
  .cd-join-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 24px rgba(124,58,237,0.35); }

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