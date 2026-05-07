import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";

const API = "/api";

const fetchAPI = (url, options = {}) =>
  fetch(url, {
    ...options,
    headers: { "ngrok-skip-browser-warning": "true", ...options.headers },
  });

const ADMIN_SECRET = process.env.NEXT_PUBLIC_ADMIN_SECRET || "";

const CATEGORIES = [
  "Football", "Basketball", "Volleyball", "Tennis", "Swimming",
  "Chess", "Music", "Art", "Dance", "Drama", "Coding", "Science",
  "Wrestling", "Boxing", "Judo", "Athletics", "Other",
];

const DISTRICTS = [
  "Сүхбаатар", "Баянзүрх", "Хан-Уул", "Баянгол",
  "Чингэлтэй", "Сонгинохайрхан", "Налайх", "Багануур", "Багахангай",
];

const fonts = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,700;0,9..144,800;1,9..144,700&family=DM+Sans:wght@400;500;600;700&display=swap');
  .ac-display { font-family: 'Fraunces', serif; }
  .ac-sans { font-family: 'DM Sans', sans-serif; }
`;

const styles = `
  * { box-sizing: border-box; margin: 0; padding: 0; }

  .ac-page {
    min-height: 100vh;
    background: #0d0118;
    padding: 48px 24px 96px;
  }

  .ac-header {
    max-width: 860px;
    margin: 0 auto 48px;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 20px;
    flex-wrap: wrap;
  }

  .ac-badge {
    font-family: 'DM Sans', sans-serif;
    font-size: 10px; font-weight: 700;
    letter-spacing: 0.15em; text-transform: uppercase;
    color: #a78bfa; background: rgba(124,58,237,0.15);
    border: 1px solid rgba(124,58,237,0.3);
    border-radius: 6px; padding: 5px 10px;
    display: inline-block; margin-bottom: 12px;
  }

  .ac-title {
    font-family: 'Fraunces', serif;
    font-size: clamp(2.2rem, 5vw, 3.4rem);
    font-weight: 800; color: #fff;
    letter-spacing: -0.04em; line-height: 1.1;
  }
  .ac-title em { color: #a78bfa; font-style: italic; }

  .ac-sub {
    font-family: 'DM Sans', sans-serif;
    font-size: 14px; color: rgba(255,255,255,0.4);
    margin-top: 8px; line-height: 1.6;
  }

  .ac-tabs {
    max-width: 860px; margin: 0 auto 32px;
    display: flex; gap: 4px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(124,58,237,0.2);
    border-radius: 12px; padding: 4px;
  }
  .ac-tab {
    flex: 1; padding: 10px 16px; border-radius: 9px;
    font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 600;
    cursor: pointer; border: none; transition: all 0.2s;
    background: transparent; color: rgba(255,255,255,0.4);
    display: flex; align-items: center; justify-content: center; gap: 7px;
  }
  .ac-tab.active {
    background: rgba(124,58,237,0.25); color: #a78bfa;
    border: 1px solid rgba(124,58,237,0.3);
  }

  .ac-card {
    max-width: 860px; margin: 0 auto;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(124,58,237,0.2);
    border-radius: 24px; padding: 48px;
    backdrop-filter: blur(12px);
  }

  .ac-section {
    margin-bottom: 40px; padding-bottom: 40px;
    border-bottom: 1px solid rgba(124,58,237,0.08);
  }
  .ac-section:last-of-type { border-bottom: none; margin-bottom: 0; padding-bottom: 0; }

  .ac-section-label {
    font-family: 'DM Sans', sans-serif;
    font-size: 10px; font-weight: 700;
    letter-spacing: 0.15em; text-transform: uppercase;
    color: #7c3aed; margin-bottom: 20px;
    display: flex; align-items: center; gap: 8px;
  }
  .ac-section-label::after { content: ''; flex: 1; height: 1px; background: rgba(124,58,237,0.15); }

  .ac-grid { display: grid; gap: 18px; }
  .ac-grid-2 { grid-template-columns: 1fr 1fr; }
  .ac-grid-3 { grid-template-columns: 1fr 1fr 1fr; }

  .ac-field label {
    font-family: 'DM Sans', sans-serif;
    font-size: 11px; font-weight: 700;
    color: rgba(255,255,255,0.35);
    letter-spacing: 0.08em; text-transform: uppercase;
    display: block; margin-bottom: 8px;
  }

  .ac-input {
    width: 100%; padding: 13px 16px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(124,58,237,0.2);
    border-radius: 10px;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px; color: #fff; outline: none;
    transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
  }
  .ac-input::placeholder { color: rgba(255,255,255,0.2); }
  .ac-input:focus {
    border-color: #7c3aed;
    background: rgba(124,58,237,0.08);
    box-shadow: 0 0 0 3px rgba(124,58,237,0.12);
  }
  .ac-input option { background: #1a0533; color: #fff; }
  .ac-textarea { resize: vertical; min-height: 110px; line-height: 1.65; }

  .ac-pricing-toggle { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
  .ac-pricing-btn {
    padding: 14px; border-radius: 10px; cursor: pointer;
    font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 700;
    transition: all 0.2s; border: 1px solid rgba(124,58,237,0.2);
    background: transparent; color: rgba(255,255,255,0.35);
  }
  .ac-pricing-btn.active { background: rgba(124,58,237,0.2); border-color: #7c3aed; color: #a78bfa; }

  .ac-submit {
    width: 100%; padding: 16px; border-radius: 12px; border: none; cursor: pointer;
    font-family: 'DM Sans', sans-serif; font-size: 15px; font-weight: 700;
    background: linear-gradient(135deg, #7c3aed, #4c1d95); color: #fff;
    box-shadow: 0 4px 24px rgba(124,58,237,0.4);
    transition: all 0.2s; margin-top: 40px;
    display: flex; align-items: center; justify-content: center; gap: 10px;
  }
  .ac-submit:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 32px rgba(124,58,237,0.5); }
  .ac-submit:disabled { opacity: 0.5; cursor: not-allowed; }

  .ac-error {
    background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.2);
    border-radius: 10px; padding: 12px 16px; margin-top: 16px;
    font-family: 'DM Sans', sans-serif; font-size: 13px; color: #f87171;
  }

  .ac-upload-btn {
    font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 600;
    color: #a78bfa; background: rgba(124,58,237,0.12);
    border: 1px solid rgba(124,58,237,0.3);
    border-radius: 8px; padding: 9px 18px; cursor: pointer; transition: all 0.2s;
  }
  .ac-upload-btn:hover { background: rgba(124,58,237,0.22); }

  .ac-clubs-list { max-width: 860px; margin: 48px auto 0; }
  .ac-clubs-title {
    font-family: 'DM Sans', sans-serif; font-size: 10px; font-weight: 700;
    letter-spacing: 0.15em; text-transform: uppercase;
    color: rgba(255,255,255,0.3); margin-bottom: 16px;
    display: flex; align-items: center; gap: 8px;
  }
  .ac-clubs-title::after { content: ''; flex: 1; height: 1px; background: rgba(255,255,255,0.06); }

  .ac-club-row {
    display: flex; align-items: center; justify-content: space-between;
    padding: 14px 20px;
    background: rgba(255,255,255,0.02); border: 1px solid rgba(124,58,237,0.1);
    border-radius: 12px; margin-bottom: 10px;
    animation: ac-fadeIn 0.3s ease; gap: 12px; flex-wrap: wrap;
  }
  .ac-club-row-left { display: flex; align-items: center; gap: 14px; }

  .ac-avatar {
    width: 40px; height: 40px; border-radius: 10px;
    background: linear-gradient(135deg, #7c3aed, #4c1d95);
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
    font-family: 'Fraunces', serif; font-size: 14px; font-weight: 800; color: #fff;
    overflow: hidden;
  }

  .ac-club-name { font-family: 'Fraunces', serif; font-size: 16px; font-weight: 700; color: #fff; letter-spacing: -0.02em; }
  .ac-club-meta { font-family: 'DM Sans', sans-serif; font-size: 12px; color: rgba(255,255,255,0.3); margin-top: 2px; }

  .ac-tag {
    font-family: 'DM Sans', sans-serif; font-size: 11px; font-weight: 600;
    padding: 3px 10px; border-radius: 20px;
    background: rgba(124,58,237,0.15); color: #a78bfa;
    border: 1px solid rgba(124,58,237,0.2);
  }
  .ac-tag.free { background: rgba(34,197,94,0.1); color: #4ade80; border-color: rgba(34,197,94,0.2); }
  .ac-tag.pending { background: rgba(245,158,11,0.1); color: #fbbf24; border-color: rgba(245,158,11,0.2); }

  .ac-approve-btn {
    font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 700;
    padding: 7px 16px; border-radius: 8px; cursor: pointer; border: none;
    background: linear-gradient(135deg, #22c55e, #16a34a); color: #fff;
    transition: all 0.2s; box-shadow: 0 2px 8px rgba(34,197,94,0.3);
  }
  .ac-approve-btn:hover { transform: translateY(-1px); box-shadow: 0 4px 14px rgba(34,197,94,0.4); }
  .ac-approve-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

  .ac-reject-btn {
    font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 700;
    padding: 7px 16px; border-radius: 8px; cursor: pointer;
    background: transparent; color: #f87171;
    border: 1px solid rgba(239,68,68,0.3);
    transition: all 0.2s;
  }
  .ac-reject-btn:hover { background: rgba(239,68,68,0.1); }
  .ac-reject-btn:disabled { opacity: 0.5; cursor: not-allowed; }

  .ac-empty {
    text-align: center; padding: 48px 24px;
    font-family: 'DM Sans', sans-serif; font-size: 14px;
    color: rgba(255,255,255,0.2);
  }

  @keyframes ac-fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }

  @media (max-width: 640px) {
    .ac-card { padding: 28px 20px; }
    .ac-grid-2, .ac-grid-3 { grid-template-columns: 1fr; }
  }
`;

const empty = {
  name: "", category: "", description: "", foundedYear: "",
  pricingType: "free", address: "", district: "",
  email: "", phone: "", website: "",
};

export default function AdminCreateClub() {
  const router = useRouter();

  // Auth — all hooks must be at the top unconditionally
  const [authed, setAuthed]   = useState(false);
  const [pwInput, setPwInput] = useState("");
  const [pwError, setPwError] = useState(false);

  const [activeTab, setActiveTab] = useState("pending");
  const [form, setForm]       = useState(empty);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const [created, setCreated] = useState([]);

  const [pendingClubs, setPendingClubs]     = useState([]);
  const [pendingLoading, setPendingLoading] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const [logo, setLogo]                   = useState(null);
  const [logoPreview, setLogoPreview]     = useState(null);
  const [bannerPhotos, setBannerPhotos]   = useState([]);
  const [bannerPreviews, setBannerPreviews] = useState([]);

  const logoRef   = useRef();
  const bannerRef = useRef();

  useEffect(() => {
    if (authed && activeTab === "pending") loadPendingClubs();
  }, [activeTab, authed]);

  function handleLogin() {
    if (pwInput === ADMIN_SECRET) {
      setAuthed(true);
      setPwError(false);
    } else {
      setPwError(true);
    }
  }

  if (!authed) {
    return (
      <>
        <style>{fonts + styles}</style>
        <div style={{
          minHeight: "100vh", background: "#0d0118",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <div style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(124,58,237,0.25)",
            borderRadius: "20px", padding: "48px 40px",
            width: "100%", maxWidth: "380px",
          }}>
            <div className="ac-badge" style={{ marginBottom: "20px" }}>⚡ Admin Panel</div>
            <h2 className="ac-display" style={{ fontSize: "26px", color: "#fff", letterSpacing: "-0.03em", marginBottom: "8px" }}>
              Enter password
            </h2>
            <p className="ac-sans" style={{ fontSize: "13px", color: "rgba(255,255,255,0.3)", marginBottom: "28px" }}>
              This page is restricted to admins only.
            </p>
            <input
              className="ac-input"
              type="password"
              placeholder="Admin secret..."
              value={pwInput}
              onChange={e => { setPwInput(e.target.value); setPwError(false); }}
              onKeyDown={e => e.key === "Enter" && handleLogin()}
              style={{ marginBottom: "12px" }}
              autoFocus
            />
            {pwError && (
              <div className="ac-error" style={{ marginBottom: "12px" }}>
                ⚠ Incorrect password
              </div>
            )}
            <button className="ac-submit" onClick={handleLogin} style={{ marginTop: "8px" }}>
              Enter →
            </button>
          </div>
        </div>
      </>
    );
  }

  async function loadPendingClubs() {
    setPendingLoading(true);
    try {
      const res = await fetchAPI(`${API}/admin/pending-clubs`, {
        headers: { "x-admin-secret": ADMIN_SECRET },
      });
      const data = await res.json();
      if (data.success) setPendingClubs(data.clubs);
    } catch {
      // silent
    } finally {
      setPendingLoading(false);
    }
  }

  async function handleApprove(clubId) {
    setActionLoadingId(clubId);
    try {
      const res = await fetchAPI(`${API}/admin/approve-club/${clubId}`, {
        method: "POST",
        headers: { "x-admin-secret": ADMIN_SECRET },
      });
      const data = await res.json();
      if (data.success) {
        setPendingClubs(prev => prev.filter(c => c.id !== clubId));
      }
    } catch {
      // silent
    } finally {
      setActionLoadingId(null);
    }
  }

  async function handleReject(clubId) {
    if (!confirm("Энэ клубыг устгах уу?")) return;
    setActionLoadingId(clubId);
    try {
      const res = await fetchAPI(`${API}/admin/reject-club/${clubId}`, {
        method: "DELETE",
        headers: { "x-admin-secret": ADMIN_SECRET },
      });
      const data = await res.json();
      if (data.success) {
        setPendingClubs(prev => prev.filter(c => c.id !== clubId));
      }
    } catch {
      // silent
    } finally {
      setActionLoadingId(null);
    }
  }

  function set(key, val) { setForm(f => ({ ...f, [key]: val })); }

  function handleLogoUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    setLogo(file);
    setLogoPreview(URL.createObjectURL(file));
  }

  function handleBannerUpload(e) {
    const files = Array.from(e.target.files);
    const previews = files.map(f => URL.createObjectURL(f));
    setBannerPhotos(prev => [...prev, ...files].slice(0, 5));
    setBannerPreviews(prev => [...prev, ...previews].slice(0, 5));
  }

  function removeBanner(i) {
    setBannerPhotos(prev => prev.filter((_, idx) => idx !== i));
    setBannerPreviews(prev => prev.filter((_, idx) => idx !== i));
  }

  async function handleCreate() {
    setError("");
    if (!form.name.trim() || !form.category || !form.description.trim() || !form.email.trim()) {
      setError("Club name, category, description and email are required.");
      return;
    }

    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("name",        form.name);
      fd.append("category",    form.category);
      fd.append("description", form.description);
      fd.append("email",       form.email);
      fd.append("pricingType", form.pricingType);
      if (form.foundedYear) fd.append("foundedYear", form.foundedYear);
      if (form.address)     fd.append("address",     form.address);
      if (form.district)    fd.append("district",    form.district);
      if (form.phone)       fd.append("phone",       form.phone);
      if (form.website)     fd.append("website",     form.website);
      if (logo) fd.append("logo", logo);
      bannerPhotos.forEach(file => fd.append("bannerPhotos", file));

      const res = await fetchAPI(`${API}/adminCreateClub`, {
        method: "POST",
        headers: { "x-admin-secret": ADMIN_SECRET },
        body: fd,
      });

      const data = await res.json();
      if (!res.ok) { setError(data.message || "Failed to create club."); return; }

      setCreated(prev => [{ ...form, id: data.clubId, logoPreview, createdAt: new Date() }, ...prev]);
      setForm(empty);
      setLogo(null);
      setLogoPreview(null);
      setBannerPhotos([]);
      setBannerPreviews([]);
    } catch {
      setError("Could not reach the server.");
    } finally {
      setLoading(false);
    }
  }

  const inp = "ac-input";

  return (
    <>
      <style>{fonts + styles}</style>
      <div className="ac-page">

        <div className="ac-header">
          <div>
            <span className="ac-badge">⚡ Admin Panel</span>
            <h1 className="ac-display ac-title">
              Club <em>management</em>
            </h1>
            <p className="ac-sans ac-sub">
              Approve pending clubs or create new ones instantly.
            </p>
          </div>

          <a href="/page1" style={{
            fontFamily: "'DM Sans', sans-serif", fontSize: "13px", fontWeight: 600,
            color: "rgba(255,255,255,0.5)", textDecoration: "none",
            border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px",
            padding: "9px 16px", background: "rgba(255,255,255,0.04)",
            transition: "all 0.2s", display: "inline-block",
          }}>
            ← Browse clubs
          </a>
        </div>
        <div className="ac-tabs">
          <button
            className={`ac-tab${activeTab === "pending" ? " active" : ""}`}
            onClick={() => setActiveTab("pending")}
          >
            ⏳ Хүлээгдэж байгаа
            {pendingClubs.length > 0 && (
              <span style={{
                background: "#f59e0b", color: "#000", fontSize: "10px",
                fontWeight: 800, borderRadius: "20px", padding: "2px 7px",
              }}>
                {pendingClubs.length}
              </span>
            )}
          </button>
          <button
            className={`ac-tab${activeTab === "create" ? " active" : ""}`}
            onClick={() => setActiveTab("create")}
          >
            ✦ Клуб үүсгэх
          </button>
        </div>
        {activeTab === "pending" && (
          <div style={{ maxWidth: 860, margin: "0 auto" }}>
            {pendingLoading ? (
              <div className="ac-empty">Ачааллаж байна...</div>
            ) : pendingClubs.length === 0 ? (
              <div className="ac-empty">
                <div style={{ fontSize: 40, marginBottom: 16 }}>✅</div>
                Хүлээгдэж байгаа клуб байхгүй байна
              </div>
            ) : (
              pendingClubs.map(club => (
                <div key={club.id} style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(124,58,237,0.2)",
                  borderRadius: 16, padding: "20px 24px",
                  marginBottom: 12, animation: "ac-fadeIn 0.3s ease",
                }}>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
                    <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                      <div className="ac-avatar">
                        {club.logo
                          ? <img src={club.logo} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                          : club.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()
                        }
                      </div>
                      <div>
                        <div className="ac-club-name">{club.name}</div>
                        <div className="ac-club-meta">
                          {club.category} · {club.email}
                          {club.district ? ` · ${club.district}` : ""}
                        </div>
                        <div style={{ marginTop: 8, display: "flex", gap: 6, flexWrap: "wrap" }}>
                          <span className="ac-tag">{club.category}</span>
                          <span className={`ac-tag${club.pricing_type === "free" ? " free" : ""}`}>
                            {club.pricing_type === "free" ? "Free" : "Paid"}
                          </span>
                          <span className="ac-tag pending">⏳ Хүлээгдэж байна</span>
                        </div>
                        {club.description && (
                          <p className="ac-sans" style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginTop: 8, lineHeight: 1.6, maxWidth: 400 }}>
                            {club.description.slice(0, 120)}{club.description.length > 120 ? "..." : ""}
                          </p>
                        )}
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 8, alignItems: "center", flexShrink: 0 }}>
                      <button
                        className="ac-approve-btn"
                        onClick={() => handleApprove(club.id)}
                        disabled={actionLoadingId === club.id}
                      >
                        {actionLoadingId === club.id ? "..." : "✓ Зөвшөөрөх"}
                      </button>
                      <button
                        className="ac-reject-btn"
                        onClick={() => handleReject(club.id)}
                        disabled={actionLoadingId === club.id}
                      >
                        Устгах
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}

            {!pendingLoading && (
              <button
                onClick={loadPendingClubs}
                className="ac-sans"
                style={{
                  marginTop: 16, background: "transparent",
                  border: "1px solid rgba(124,58,237,0.2)", borderRadius: 8,
                  color: "rgba(255,255,255,0.3)", fontSize: 12, fontWeight: 600,
                  padding: "8px 18px", cursor: "pointer",
                }}
              >
                ↻ Дахин ачаалах
              </button>
            )}
          </div>
        )}
        {activeTab === "create" && (
          <>
            <div className="ac-card">
              <div className="ac-section">
                <div className="ac-section-label">Basic Info</div>
                <div className="ac-grid" style={{ gap: 18 }}>
                  <div className="ac-grid ac-grid-2">
                    <div className="ac-field">
                      <label>Club Name *</label>
                      <input className={inp} placeholder="e.g. Ulaanbaatar FC"
                        value={form.name} onChange={e => set("name", e.target.value)} />
                    </div>
                    <div className="ac-field">
                      <label>Category *</label>
                      <select className={inp} value={form.category} onChange={e => set("category", e.target.value)}>
                        <option value="">Select category…</option>
                        {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="ac-field">
                    <label>Description *</label>
                    <textarea className={`${inp} ac-textarea`}
                      placeholder="What is this club about?"
                      value={form.description} onChange={e => set("description", e.target.value)} />
                  </div>
                  <div className="ac-field" style={{ maxWidth: 200 }}>
                    <label>Founded Year</label>
                    <input className={inp} type="number" placeholder="e.g. 2019" min="1900" max="2030"
                      value={form.foundedYear} onChange={e => set("foundedYear", e.target.value)} />
                  </div>
                </div>
              </div>

              <div className="ac-section">
                <div className="ac-section-label">Media (optional)</div>
                <div style={{ marginBottom: "24px" }}>
                  <div className="ac-field"><label>Club Logo</label></div>
                  <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                    <div style={{ width: "72px", height: "72px", borderRadius: "14px", background: "rgba(124,58,237,0.1)", border: "1.5px dashed rgba(124,58,237,0.3)", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", flexShrink: 0 }}>
                      {logoPreview
                        ? <img src={logoPreview} alt="Logo" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        : <svg width="24" height="24" fill="none" stroke="#7c3aed" strokeWidth="1.5" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="4"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                      }
                    </div>
                    <div>
                      <button className="ac-upload-btn" onClick={() => logoRef.current.click()}>
                        {logoPreview ? "Change logo" : "Upload logo"}
                      </button>
                      <p className="ac-sans" style={{ fontSize: "11px", color: "rgba(255,255,255,0.25)", marginTop: "5px" }}>PNG or JPG, recommended 400×400px</p>
                      <input ref={logoRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleLogoUpload} />
                    </div>
                  </div>
                </div>

                <div className="ac-field">
                  <label>Banner Photos <span style={{ fontWeight: 400, textTransform: "none", letterSpacing: 0, color: "rgba(255,255,255,0.2)" }}>(up to 5)</span></label>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: "10px" }}>
                  {bannerPreviews.map((src, i) => (
                    <div key={i} style={{ position: "relative", aspectRatio: "16/9", borderRadius: "8px", overflow: "hidden", background: "rgba(255,255,255,0.05)" }}>
                      <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      <button onClick={() => removeBanner(i)} style={{ position: "absolute", top: "5px", right: "5px", background: "rgba(0,0,0,0.6)", border: "none", borderRadius: "50%", width: "20px", height: "20px", cursor: "pointer", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", padding: 0 }}>
                        <svg width="9" height="9" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12"/></svg>
                      </button>
                    </div>
                  ))}
                  {bannerPreviews.length < 5 && (
                    <div onClick={() => bannerRef.current.click()} style={{ aspectRatio: "16/9", borderRadius: "8px", background: "rgba(255,255,255,0.02)", border: "1px dashed rgba(124,58,237,0.25)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: "pointer", gap: "4px" }}>
                      <svg width="18" height="18" fill="none" stroke="#7c3aed" strokeWidth="1.5" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                      <span className="ac-sans" style={{ fontSize: "10px", color: "rgba(124,58,237,0.6)", fontWeight: 600 }}>Add</span>
                    </div>
                  )}
                </div>
                <input ref={bannerRef} type="file" accept="image/*" multiple style={{ display: "none" }} onChange={handleBannerUpload} />
              </div>

              <div className="ac-section">
                <div className="ac-section-label">Membership</div>
                <div className="ac-field">
                  <label>Type</label>
                  <div className="ac-pricing-toggle">
                    {["free", "paid"].map(t => (
                      <button key={t}
                        className={`ac-pricing-btn${form.pricingType === t ? " active" : ""}`}
                        onClick={() => set("pricingType", t)}>
                        {t === "free" ? "🆓 Free to join" : "💳 Paid membership"}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="ac-section">
                <div className="ac-section-label">Location</div>
                <div className="ac-grid ac-grid-2">
                  <div className="ac-field">
                    <label>Street Address</label>
                    <input className={inp} placeholder="Суурин 4, Сүхбаатар дүүрэг"
                      value={form.address} onChange={e => set("address", e.target.value)} />
                  </div>
                  <div className="ac-field">
                    <label>District</label>
                    <select className={inp} value={form.district} onChange={e => set("district", e.target.value)}>
                      <option value="">Select district…</option>
                      {DISTRICTS.map(d => <option key={d}>{d}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              <div className="ac-section">
                <div className="ac-section-label">Contact</div>
                <div className="ac-grid ac-grid-3">
                  <div className="ac-field">
                    <label>Email *</label>
                    <input className={inp} type="email" placeholder="club@email.com"
                      value={form.email} onChange={e => set("email", e.target.value)} />
                  </div>
                  <div className="ac-field">
                    <label>Phone</label>
                    <input className={inp} type="tel" placeholder="+976 ···"
                      value={form.phone} onChange={e => set("phone", e.target.value)} />
                  </div>
                  <div className="ac-field">
                    <label>Website</label>
                    <input className={inp} type="url" placeholder="https://…"
                      value={form.website} onChange={e => set("website", e.target.value)} />
                  </div>
                </div>
              </div>

              {error && <div className="ac-error">⚠ {error}</div>}

              <button className="ac-submit" onClick={handleCreate} disabled={loading}>
                {loading
                  ? <span style={{ opacity: 0.7 }}>Creating…</span>
                  : <><svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg> Create Club instantly</>
                }
              </button>
            </div>

            {created.length > 0 && (
              <div className="ac-clubs-list">
                <div className="ac-clubs-title">Created this session ({created.length})</div>
                {created.map((c, i) => (
                  <div className="ac-club-row" key={i}>
                    <div className="ac-club-row-left">
                      <div className="ac-avatar">
                        {c.logoPreview
                          ? <img src={c.logoPreview} alt="logo" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                          : c.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()
                        }
                      </div>
                      <div>
                        <div className="ac-display ac-club-name">{c.name}</div>
                        <div className="ac-sans ac-club-meta">
                          {c.category}{c.district ? ` · ${c.district}` : ""}{c.email ? ` · ${c.email}` : ""}
                        </div>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <span className={`ac-tag${c.pricingType === "free" ? " free" : ""}`}>
                        {c.pricingType === "free" ? "Free" : "Paid"}
                      </span>
                      <a href={`/club-detail?id=${c.id}`} style={{
                        fontFamily: "'DM Sans', sans-serif", fontSize: "12px", fontWeight: 600,
                        color: "#a78bfa", textDecoration: "none",
                      }}>
                        View →
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

      </div>
    </>
  );
}