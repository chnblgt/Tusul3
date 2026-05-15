import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import dynamic from "next/dynamic";
import Header from "@/waterbottle/Header";
import Footer from "@/waterbottle/Footer";

const MapPicker = dynamic(() => import("@/waterbottle/Mapcomponent"), { ssr: false });

const API = process.env.NEXT_PUBLIC_API_URL || "https://backend3-production-27e7.up.railway.app/clubs";

const fetchAPI = async (url, options = {}) => {
  try {
    return await fetch(url, {
      ...options,
      headers: { "ngrok-skip-browser-warning": "true", ...options.headers },
    });
  } catch { throw new Error("NETWORK_ERROR"); }
};

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
  return CATEGORY_STYLES[key] || { accent: "var(--accent)", bg: "var(--accent-soft)" };
}

const fonts = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,700;0,9..144,800;1,9..144,700&family=DM+Sans:wght@400;500;600;700&display=swap');
  .cd-display { font-family: 'Fraunces', serif; }
  .cd-sans    { font-family: 'DM Sans', sans-serif; }

  @keyframes cd-fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:none} }
  .cd-fadein { animation: cd-fadeUp 0.45s cubic-bezier(.22,1,.36,1) both; }

  .cd-info-card {
    background: var(--bg-card);
    border: 1px solid var(--border-subtle);
    border-radius: 16px; padding: 22px;
    transition: background 0.35s, border-color 0.35s;
  }

  .cd-join-btn {
    display: flex; align-items: center; justify-content: center; gap: 8px;
    padding: 13px 28px; width: 100%;
    background: var(--accent); color: var(--text-on-accent);
    border: none; border-radius: 12px;
    font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 700;
    cursor: pointer; transition: all 0.18s;
    box-shadow: 0 4px 16px var(--accent-glow);
  }
  .cd-join-btn:hover { opacity: 0.9; transform: translateY(-1px); box-shadow: 0 6px 24px var(--accent-glow); }
  .cd-join-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

  .cd-leave-btn {
    display: flex; align-items: center; justify-content: center; gap: 8px;
    padding: 13px 28px; width: 100%;
    background: transparent; color: var(--accent);
    border: 1.5px solid var(--border-subtle); border-radius: 12px;
    font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 700;
    cursor: pointer; transition: all 0.18s;
  }
  .cd-leave-btn:hover { background: var(--accent-soft); border-color: var(--border-card); }

  .cd-action-btn {
    display: flex; align-items: center; justify-content: center; gap: 8px;
    padding: 11px 20px; width: 100%;
    border: 1px solid var(--border-subtle);
    border-radius: 10px; cursor: pointer; transition: all 0.18s;
    font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 600;
    background: var(--bg-input); color: var(--text-secondary);
  }
  .cd-action-btn:hover { background: var(--accent-soft); color: var(--accent); border-color: var(--border-card); }
  .cd-action-btn.primary {
    background: var(--accent); color: var(--text-on-accent);
    border-color: var(--accent);
    box-shadow: 0 3px 12px var(--accent-glow);
  }
  .cd-action-btn.primary:hover { opacity: 0.9; }

  .cd-modal-overlay {
    position: fixed; inset: 0; background: rgba(0,0,0,0.55);
    display: flex; align-items: center; justify-content: center;
    z-index: 9999; padding: 24px;
  }
  .cd-modal {
    background: var(--bg-card); border-radius: 20px;
    padding: 32px; max-width: 480px; width: 100%;
    border: 1px solid var(--border-card);
    box-shadow: var(--shadow-drop);
    animation: cd-fadeUp 0.3s cubic-bezier(.22,1,.36,1) both;
  }
  .cd-tier-opt {
    border: 1.5px solid var(--border-subtle); border-radius: 12px;
    padding: 16px 18px; cursor: pointer; transition: all 0.18s;
    background: var(--bg-input);
  }
  .cd-tier-opt:hover { border-color: var(--border-card); background: var(--accent-soft); }
  .cd-tier-opt.selected { border-color: var(--accent); background: var(--accent-soft); }

  .cd-member-row {
    display: flex; align-items: center; gap: 10px;
    padding: 8px 0; border-bottom: 1px solid var(--border-subtle);
  }
  .cd-member-row:last-child { border-bottom: none; }

  .cd-back {
    display: inline-flex; align-items: center; gap: 7px;
    font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 600;
    color: var(--text-muted); background: var(--bg-card);
    border: 1px solid var(--border-subtle); border-radius: 8px;
    padding: 8px 14px; cursor: pointer; text-decoration: none;
    transition: all 0.2s; margin-bottom: 28px;
  }
  .cd-back:hover { background: var(--accent-soft); color: var(--accent); border-color: var(--border-card); }

  .cd-card-label {
    font-family: 'DM Sans', sans-serif; font-size: 11px; font-weight: 700;
    color: var(--text-muted); letter-spacing: 0.1em; text-transform: uppercase;
    margin: 0 0 12px; transition: color 0.35s;
  }

  .cd-contact-link {
    display: flex; align-items: center; gap: 10px;
    font-family: 'DM Sans', sans-serif; font-size: 13.5px;
    color: var(--text-secondary); text-decoration: none; transition: color 0.2s;
  }
  .cd-contact-link:hover { color: var(--accent); }
  .cd-contact-icon {
    width: 32px; height: 32px; border-radius: 9px;
    background: var(--bg-input); display: flex; align-items: center; justify-content: center;
    flex-shrink: 0; transition: background 0.35s;
  }
  @media (max-width: 900px) {
    .cd-page-layout { flex-direction: column !important; }
    .cd-sticky-sidebar { position: static !important; width: 100% !important; max-width: 100% !important; flex-shrink: 0; }
    .cd-main-grid { grid-template-columns: 1fr !important; }
  }

`;

export default function ClubDetailPage() {
  const router = useRouter();
  const { id } = router.query;

  const [club,          setClub]          = useState(null);
  const [loading,       setLoading]       = useState(true);
  const [error,         setError]         = useState("");
  const [enrolled,      setEnrolled]      = useState(false);
  const [joining,       setJoining]       = useState(false);
  const [user,          setUser]          = useState(null);
  const [banners,       setBanners]       = useState([]);
  const [bannerIdx,     setBannerIdx]     = useState(0);
  const [members,       setMembers]       = useState([]);
  const [selectedTier,  setSelectedTier]  = useState(null);
  const [showTierModal, setShowTierModal] = useState(false);
  const [paymentInfo,   setPaymentInfo]   = useState(null);
  const [membershipStatus, setMembershipStatus] = useState(null); // 'free' | 'pending' | 'confirmed'

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
        } else { setError("Клуб олдсонгүй"); }
      })
      .catch(e => setError(
        e.message === "NETWORK_ERROR"
          ? "Сервертэй холбогдож чадсангүй — backend ажиллаж байгаа эсэхийг шалгана уу."
          : "Клуб ачааллахад алдаа гарлаа."
      ))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!user || !id) return;
    fetchAPI(`${API}/myClubs/${user.id}`)
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          const found = data.clubs.find(c => String(c.id) === String(id));
          setEnrolled(!!found);
        }
      })
      .catch(() => {});

    Promise.all([
      fetchAPI(`${API}/membershipStatus/${user.id}/${id}`).then(r => r.json()),
      fetchAPI(`${API}/clubs/${id}`).then(r => r.json()),
    ]).then(([statusData, clubData]) => {
      if (statusData.success) setMembershipStatus(statusData.payment_status);
      const isClubOwner = clubData.success && String(clubData.club.owner_id) === String(user.id);
      if (!isClubOwner && clubData.success && (clubData.club.qpay_info || clubData.club.dans_info)) {
        const tierName = statusData.tier_name || null;
        let tierPrice  = null;
        try {
          const parsedTiers = JSON.parse(clubData.club.tiers || "[]");
          const match = parsedTiers.find(t => t.name === tierName);
          if (match) tierPrice = match.price;
        } catch {}
        setPaymentInfo({
          clubName:  clubData.club.name      || "",
          qpay_info: clubData.club.qpay_info || null,
          dans_info: clubData.club.dans_info || null,
          tierName,
          amount:    tierPrice,
        });
      }
    }).catch(() => {});
  }, [user, id]);

  useEffect(() => {
    if (!user || !id) return;
    fetchAPI(`${API}/club/${id}/members`, { headers: { "x-user-id": String(user.id) } })
      .then(r => r.json())
      .then(data => { if (data.success) setMembers(data.members || []); })
      .catch(() => {});
  }, [user, id]);

  async function handleJoin() {
    if (!user) { router.push("/signin"); return; }
    if (enrolled) {
      setJoining(true);
      try {
        await fetchAPI(`${API}/leaveClub/${user.id}/${id}`, { method: "DELETE" });
        setEnrolled(false);
      } catch (e) { console.error(e); }
      finally { setJoining(false); }
      return;
    }
    if (club.pricing_type === "paid" && tiers.length > 0) { setShowTierModal(true); return; }
    setJoining(true);
    try {
      await fetchAPI(`${API}/joinClub`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, clubId: id }),
      });
      setEnrolled(true);
    } catch (e) { console.error(e); }
    finally { setJoining(false); }
  }

  async function handleConfirmJoin() {
    if (!selectedTier) return;
    setJoining(true);
    try {
      const res = await fetchAPI(`${API}/joinClub`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, clubId: id, tierId: selectedTier.name, tierPrice: selectedTier.price }),
      });
      const data = await res.json();
      if (!data.success) {
        alert(data.message || "Алдаа гарлаа");
        return;
      }
      setEnrolled(true);
      setMembershipStatus("pending");
      setShowTierModal(false);
      // Club data is already in state — show payment instructions immediately
      setPaymentInfo({
        clubName:  club.name       || "",
        tierName:  selectedTier.name,
        amount:    selectedTier.price,
        qpay_info: club.qpay_info  || null,
        dans_info: club.dans_info  || null,
      });
    } catch (e) { console.error(e); }
    finally { setJoining(false); }
  }

  const isOwner = user && club && String(club.owner_id) === String(user.id);
  const tiers   = club ? (() => { try { return JSON.parse(club.tiers || "[]"); } catch { return []; } })() : [];

  const shell = (body) => (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--bg-page)", transition: "background 0.35s, color 0.35s" }}>
      <style>{fonts}</style>
      <Header />{body}<Footer />
    </div>
  );

  if (loading) return shell(
    <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p className="cd-sans" style={{ color: "var(--text-muted)", fontSize: "15px" }}>Ачааллаж байна…</p>
    </div>
  );

  if (error || !club) return shell(
    <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 16, padding: "32px", textAlign: "center" }}>
      <div style={{ width: 56, height: 56, borderRadius: 14, background: "var(--accent-soft)", border: "1px solid var(--border-subtle)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <svg width="22" height="22" fill="none" stroke="var(--accent)" strokeWidth="1.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
      </div>
      <p className="cd-display" style={{ fontSize: "22px", color: "var(--text-primary)", fontWeight: 800 }}>{error || "Клуб олдсонгүй"}</p>
      <div style={{ display: "flex", gap: 12 }}>
        <button onClick={() => window.location.reload()} className="cd-sans"
          style={{ padding: "10px 22px", background: "var(--accent)", color: "var(--text-on-accent)", border: "none", borderRadius: 10, fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
          Retry
        </button>
        <Link href="/page1" className="cd-sans"
          style={{ padding: "10px 22px", color: "var(--accent)", fontWeight: 600, fontSize: 14, border: "1.5px solid var(--border-subtle)", borderRadius: 10, textDecoration: "none", display: "inline-flex", alignItems: "center", background: "var(--bg-card)" }}>
          ← Browse clubs
        </Link>
      </div>
    </div>
  );

  const { accent, bg } = getCategoryStyle(club.category);

  return shell(
    <>
      <div style={{ position: "relative", height: "260px", background: "var(--bg-section)", overflow: "hidden" }}>
        {banners.length > 0 ? (
          <>
            <img src={banners[bannerIdx]} alt="banner" style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.7 }} />
            {banners.length > 1 && (
              <div style={{ position: "absolute", bottom: "16px", left: "50%", transform: "translateX(-50%)", display: "flex", gap: "6px" }}>
                {banners.map((_, i) => (
                  <button key={i} onClick={() => setBannerIdx(i)} style={{
                    width: i === bannerIdx ? "20px" : "7px", height: "7px",
                    borderRadius: "4px", border: "none", cursor: "pointer",
                    background: i === bannerIdx ? "#fff" : "rgba(255,255,255,0.4)",
                    transition: "all 0.2s", padding: 0,
                  }} />
                ))}
              </div>
            )}
          </>
        ) : (
          <div style={{ position: "absolute", inset: 0, background: `linear-gradient(135deg, ${accent}18, ${accent}06)` }} />
        )}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 40%, var(--bg-page) 100%)" }} />
      </div>

      <main style={{ flex: 1 }}>
        <div style={{ maxWidth: "960px", margin: "0 auto", padding: "0 clamp(16px,4vw,32px) 96px" }}>
          <div style={{ paddingTop: "20px" }}>
            <Link href="/page1" className="cd-back">
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
              Browse clubs
            </Link>
          </div>

          <div className="cd-main-grid" style={{ display: "grid", gridTemplateColumns: "1fr min(300px, 100%)", gap: "32px", alignItems: "start" }}>
            <div className="cd-fadein">
              <div style={{ display: "flex", alignItems: "flex-start", gap: "20px", marginBottom: "24px" }}>
                <div style={{ width: "68px", height: "68px", borderRadius: "16px", flexShrink: 0, background: bg, border: `2px solid ${accent}28`, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", boxShadow: `0 4px 16px ${accent}20` }}>
                  {club.logo
                    ? <img src={club.logo} alt={club.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    : <span style={{ fontFamily: "'Fraunces',serif", fontSize: "26px", fontWeight: 800, color: accent }}>{club.name[0]}</span>
                  }
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap", marginBottom: "8px" }}>
                    <h1 className="cd-display" style={{ fontSize: "clamp(1.6rem,3.5vw,2.2rem)", fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.03em", margin: 0, lineHeight: 1.15 }}>
                      {club.name}
                    </h1>
                    {enrolled && !isOwner && (
                      <span className="cd-sans" style={{ fontSize: "11px", fontWeight: 700, padding: "3px 10px", borderRadius: "20px", background: "rgba(34,197,94,0.1)", color: "#16a34a", border: "1px solid rgba(34,197,94,0.2)" }}>Enrolled</span>
                    )}
                    {isOwner && (
                      <span className="cd-sans" style={{ fontSize: "11px", fontWeight: 700, padding: "3px 10px", borderRadius: "20px", background: "var(--accent-soft)", color: "var(--accent)", border: "1px solid var(--border-subtle)" }}>Owner</span>
                    )}
                  </div>
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    <span className="cd-sans" style={{ fontSize: "11px", fontWeight: 700, padding: "4px 10px", borderRadius: "6px", background: bg, color: accent, letterSpacing: "0.06em", textTransform: "uppercase" }}>{club.category}</span>
                    <span className="cd-sans" style={{ fontSize: "11px", fontWeight: 700, padding: "4px 10px", borderRadius: "6px", background: club.pricing_type === "free" ? "rgba(34,197,94,0.1)" : "var(--accent-soft)", color: club.pricing_type === "free" ? "#16a34a" : "var(--accent)" }}>
                      {club.pricing_type === "free" ? "Free" : "Paid"}
                    </span>
                    {club.founded_year && (
                      <span className="cd-sans" style={{ fontSize: "11px", fontWeight: 600, padding: "4px 10px", borderRadius: "6px", background: "var(--bg-input)", color: "var(--text-muted)" }}>
                        Est. {club.founded_year}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="cd-info-card" style={{ marginBottom: "16px" }}>
                <p className="cd-card-label">About</p>
                <p className="cd-sans" style={{ fontSize: "15px", color: "var(--text-secondary)", lineHeight: 1.75, margin: 0 }}>{club.description}</p>
              </div>
              {club.pricing_type === "paid" && tiers.length > 0 && (
                <div className="cd-info-card" style={{ marginBottom: "16px" }}>
                  <p className="cd-card-label">Membership Tiers</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {tiers.map((tier, i) => (
                      <div key={i} style={{ padding: "16px 18px", borderRadius: "12px", background: "var(--bg-input)", border: "1px solid var(--border-subtle)" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                          <span className="cd-sans" style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-primary)" }}>{tier.name}</span>
                          <span className="cd-sans" style={{ fontSize: "14px", fontWeight: 800, color: "var(--accent)" }}>
                            ₮{tier.price}<span style={{ fontSize: "11px", fontWeight: 500, color: "var(--text-muted)" }}>/{tier.period || "mo"}</span>
                          </span>
                        </div>
                        {tier.description && <p className="cd-sans" style={{ fontSize: "13px", color: "var(--text-muted)", margin: "0 0 6px", lineHeight: 1.5 }}>{tier.description}</p>}
                        {tier.features && (
                          <ul style={{ margin: 0, paddingLeft: "16px" }}>
                            {tier.features.split(",").map((f, j) => (
                              <li key={j} className="cd-sans" style={{ fontSize: "12.5px", color: "var(--text-muted)", lineHeight: 1.7 }}>{f.trim()}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {club.lat && club.lng && (
                <div className="cd-info-card" style={{ marginBottom: "16px" }}>
                  <p className="cd-card-label">Location</p>
                  {club.address && (
                    <p className="cd-sans" style={{ fontSize: "13.5px", color: "var(--text-secondary)", margin: "0 0 12px", display: "flex", alignItems: "center", gap: "6px" }}>
                      <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                      {club.address}{club.district ? `, ${club.district}` : ""}
                    </p>
                  )}
                  <div style={{ borderRadius: "12px", overflow: "hidden", border: "1px solid var(--border-subtle)" }}>
                    <MapPicker pickMode={false} pickedLat={parseFloat(club.lat)} pickedLng={parseFloat(club.lng)} height="240px" zoom={15} />
                  </div>
                </div>
              )}
            </div>
            <div style={{ position: "sticky", top: "24px" }} className="cd-fadein">
              {isOwner ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                  <div className="cd-info-card" style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <p className="cd-card-label">Manage</p>
                    <button onClick={() => router.push(`/club-edit?id=${id}`)} className="cd-action-btn primary">
                      <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                      Edit Club
                    </button>
                    <button onClick={() => router.push(`/club-owner-dashboard?clubId=${id}`)} className="cd-action-btn">
                      <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                      Full Dashboard
                    </button>
                  </div>
                  <div className="cd-info-card">
                    <p className="cd-card-label">
                      Members <span style={{ color: "var(--accent)" }}>({members.length})</span>
                    </p>
                    {members.length === 0 ? (
                      <p className="cd-sans" style={{ fontSize: "13px", color: "var(--text-muted)", textAlign: "center", padding: "12px 0" }}>No members yet</p>
                    ) : (
                      <div style={{ maxHeight: "220px", overflowY: "auto" }}>
                        {members.slice(0, 8).map((m, i) => (
                          <div key={m.id || i} className="cd-member-row">
                            <div style={{ width: "30px", height: "30px", borderRadius: "50%", background: "var(--accent-soft)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, overflow: "hidden" }}>
                              {m.photo
                                ? <img src={m.photo} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                : <span className="cd-sans" style={{ fontSize: "12px", fontWeight: 700, color: "var(--accent)" }}>{(m.name || "?")[0].toUpperCase()}</span>
                              }
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <p className="cd-sans" style={{ fontSize: "12.5px", fontWeight: 600, color: "var(--text-primary)", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{m.name || "Unknown"}</p>
                              {m.tier_name && <p className="cd-sans" style={{ fontSize: "10.5px", color: "var(--accent)", margin: 0 }}>{m.tier_name}</p>}
                            </div>
                          </div>
                        ))}
                        {members.length > 8 && (
                          <button onClick={() => router.push(`/club-owner-dashboard?clubId=${id}`)} className="cd-sans"
                            style={{ width: "100%", marginTop: "10px", padding: "8px", background: "var(--accent-soft)", border: "none", borderRadius: "8px", color: "var(--accent)", fontSize: "12px", fontWeight: 700, cursor: "pointer" }}>
                            +{members.length - 8} more →
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <>
                  <div className="cd-info-card" style={{ marginBottom: "14px" }}>
                    <button onClick={handleJoin} disabled={joining} className={enrolled ? "cd-leave-btn" : "cd-join-btn"}>
                      {joining ? "…" : enrolled ? "Leave club" : user ? "Join club" : "Sign in to join"}
                    </button>

                    {enrolled && membershipStatus === "pending" && (
                      <div style={{ marginTop: "12px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 14px", borderRadius: "10px", background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.2)", marginBottom: "10px" }}>
                          <svg width="14" height="14" fill="none" stroke="#f59e0b" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                          <span className="cd-sans" style={{ fontSize: "12.5px", color: "#d97706", fontWeight: 600 }}>Төлбөр баталгаажуулагдаагүй байна</span>
                        </div>
                        {paymentInfo && (
                          <button onClick={() => setPaymentInfo({ ...paymentInfo })} className="cd-action-btn" style={{ width: "100%" }}>
                            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
                            Төлбөрийн мэдээлэл харах
                          </button>
                        )}
                      </div>
                    )}

                    {enrolled && membershipStatus === "confirmed" && (
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 14px", borderRadius: "10px", background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)", marginTop: "12px" }}>
                        <svg width="14" height="14" fill="none" stroke="#22c55e" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
                        <span className="cd-sans" style={{ fontSize: "12.5px", color: "#16a34a", fontWeight: 600 }}>Гишүүнчлэл баталгаажсан</span>
                      </div>
                    )}

                    {!user && (
                      <p className="cd-sans" style={{ fontSize: "12px", color: "var(--text-muted)", textAlign: "center", margin: "10px 0 0" }}>
                        <Link href="/signin" style={{ color: "var(--accent)", fontWeight: 600, textDecoration: "none" }}>Sign in</Link>
                        {" or "}
                        <Link href="/signup" style={{ color: "var(--accent)", fontWeight: 600, textDecoration: "none" }}>create account</Link>
                      </p>
                    )}
                  </div>
                </>
              )}
              <div className="cd-info-card">
                <p className="cd-card-label">Contact</p>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {club.email && (
                    <Link href={`mailto:${club.email}`} className="cd-contact-link">
                      <div className="cd-contact-icon">
                        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                      </div>
                      {club.email}
                    </Link>
                  )}
                  {club.phone && (
                    <Link href={`tel:${club.phone}`} className="cd-contact-link">
                      <div className="cd-contact-icon">
                        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.55a16 16 0 0 0 6.29 6.29l1.42-1.42a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                      </div>
                      {club.phone}
                    </Link>
                  )}
                  {club.website && (
                    <Link href={club.website} target="_blank" rel="noopener noreferrer" className="cd-contact-link">
                      <div className="cd-contact-icon">
                        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                      </div>
                      {club.website.replace(/^https?:\/\//, "")}
                    </Link>
                  )}
                  {(club.address || club.district) && (
                    <div className="cd-contact-link">
                      <div className="cd-contact-icon">
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
      {showTierModal && (
        <div className="cd-modal-overlay" onClick={() => setShowTierModal(false)}>
          <div className="cd-modal" onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
              <div>
                <h2 className="cd-display" style={{ fontSize: "22px", fontWeight: 800, color: "var(--text-primary)", margin: "0 0 4px", letterSpacing: "-0.02em" }}>Choose a Tier</h2>
                <p className="cd-sans" style={{ fontSize: "13px", color: "var(--text-muted)", margin: 0 }}>
                  Select your membership to join <strong style={{ color: "var(--text-primary)" }}>{club.name}</strong>
                </p>
              </div>
              <button onClick={() => setShowTierModal(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", fontSize: "20px", lineHeight: 1, padding: "4px" }}>✕</button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "20px" }}>
              {tiers.map((tier, i) => (
                <div key={i} className={`cd-tier-opt${selectedTier?.name === tier.name ? " selected" : ""}`} onClick={() => setSelectedTier(tier)}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: tier.description ? "6px" : 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <div style={{ width: "18px", height: "18px", borderRadius: "50%", border: `2px solid ${selectedTier?.name === tier.name ? "var(--accent)" : "var(--border-subtle)"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        {selectedTier?.name === tier.name && <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--accent)" }} />}
                      </div>
                      <span className="cd-sans" style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-primary)" }}>{tier.name}</span>
                    </div>
                    <span className="cd-sans" style={{ fontSize: "15px", fontWeight: 800, color: "var(--accent)" }}>
                      ₮{Number(tier.price).toLocaleString()}
                      <span style={{ fontSize: "11px", fontWeight: 500, color: "var(--text-muted)" }}>/{tier.period || "mo"}</span>
                    </span>
                  </div>
                  {tier.description && <p className="cd-sans" style={{ fontSize: "12.5px", color: "var(--text-muted)", margin: "0 0 0 28px", lineHeight: 1.5 }}>{tier.description}</p>}
                  {tier.features && (
                    <ul style={{ margin: "6px 0 0 28px", paddingLeft: "14px" }}>
                      {tier.features.split(",").map((f, j) => (
                        <li key={j} className="cd-sans" style={{ fontSize: "12px", color: "var(--text-muted)", lineHeight: 1.6 }}>{f.trim()}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>

            <div style={{ background: "var(--accent-soft)", borderRadius: "10px", padding: "12px 14px", marginBottom: "20px", display: "flex", gap: "8px", alignItems: "flex-start" }}>
              <svg width="14" height="14" fill="none" stroke="var(--accent)" strokeWidth="2" viewBox="0 0 24 24" style={{ flexShrink: 0, marginTop: 1 }}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              <p className="cd-sans" style={{ fontSize: "12px", color: "var(--accent)", margin: 0, lineHeight: 1.5 }}>Payment is collected by the club owner. You&apos;ll get confirmation once verified.</p>
            </div>

            <button onClick={handleConfirmJoin} disabled={!selectedTier || joining} className="cd-join-btn" style={{ opacity: (!selectedTier || joining) ? 0.5 : 1 }}>
              {joining ? "Joining…" : selectedTier ? `Join as ${selectedTier.name} — ₮${Number(selectedTier.price).toLocaleString()}` : "Select a tier to continue"}
            </button>
          </div>
        </div>
      )}
      {paymentInfo && (
        <div className="cd-modal-overlay" onClick={() => setPaymentInfo(null)}>
          <div className="cd-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 520 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
              <div>
                <h2 className="cd-display" style={{ fontSize: "22px", fontWeight: 800, color: "var(--text-primary)", margin: "0 0 4px", letterSpacing: "-0.02em" }}>Төлбөр төлөх</h2>
                <p className="cd-sans" style={{ fontSize: "13px", color: "var(--text-muted)", margin: 0 }}>
                  <strong style={{ color: "var(--text-primary)" }}>{paymentInfo.clubName}</strong> — {paymentInfo.tierName} · ₮{Number(paymentInfo.amount).toLocaleString()}
                </p>
              </div>
              <button onClick={() => setPaymentInfo(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", fontSize: "20px", lineHeight: 1, padding: "4px" }}>✕</button>
            </div>

            {!paymentInfo.qpay_info && !paymentInfo.dans_info && (
              <div style={{ textAlign: "center", padding: "32px 0" }}>
                <div style={{ fontSize: "40px", marginBottom: "12px" }}>📋</div>
                <p className="cd-sans" style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.6 }}>
                  Клубын эзэн төлбөрийн мэдээлэл оруулаагүй байна.<br/>
                  Клубын холбоо барих мэдээллээр нэвтрэн төлбөрөө хийнэ үү.
                </p>
              </div>
            )}

            {paymentInfo.qpay_info && (
              <div style={{ marginBottom: "16px", padding: "20px", borderRadius: "14px", background: "var(--bg-input)", border: "1px solid var(--border-subtle)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
                  <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "#0066cc", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <span style={{ color: "#fff", fontSize: "13px", fontWeight: 800, fontFamily: "'DM Sans', sans-serif" }}>Q</span>
                  </div>
                  <span className="cd-sans" style={{ fontSize: "15px", fontWeight: 700, color: "var(--text-primary)" }}>SocialPay</span>
                </div>
                {paymentInfo.qpay_info.startsWith("http") ? (
                  <img src={paymentInfo.qpay_info} alt="QPay QR" style={{ width: "100%", maxWidth: "220px", display: "block", margin: "0 auto", borderRadius: "10px" }} />
                ) : (
                  <p className="cd-sans" style={{ fontSize: "14px", color: "var(--text-secondary)", margin: 0, lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{paymentInfo.qpay_info}</p>
                )}
              </div>
            )}

            {paymentInfo.dans_info && (
              <div style={{ marginBottom: "16px", padding: "20px", borderRadius: "14px", background: "var(--bg-input)", border: "1px solid var(--border-subtle)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
                  <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "#e8420a", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <span style={{ color: "#fff", fontSize: "11px", fontWeight: 800, fontFamily: "'DM Sans', sans-serif" }}>DANS</span>
                  </div>
                  <span className="cd-sans" style={{ fontSize: "15px", fontWeight: 700, color: "var(--text-primary)" }}>Данс / Bank Transfer</span>
                </div>
                <p className="cd-sans" style={{ fontSize: "14px", color: "var(--text-secondary)", margin: 0, lineHeight: 1.8, whiteSpace: "pre-wrap" }}>{paymentInfo.dans_info}</p>
              </div>
            )}

            <div style={{ background: "var(--accent-soft)", borderRadius: "10px", padding: "12px 14px", display: "flex", gap: "8px", alignItems: "flex-start" }}>
              <svg width="14" height="14" fill="none" stroke="var(--accent)" strokeWidth="2" viewBox="0 0 24 24" style={{ flexShrink: 0, marginTop: 1 }}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              <p className="cd-sans" style={{ fontSize: "12px", color: "var(--accent)", margin: 0, lineHeight: 1.5 }}>Төлбөр хийсний дараа клубын эзэн баталгаажуулна. Гишүүнчлэл идэвхжих болно.</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}