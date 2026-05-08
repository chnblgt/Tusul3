import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import dynamic from "next/dynamic";
import Header from "@/waterbottle/Header";
import Footer from "@/waterbottle/Footer";

const MapPicker = dynamic(() => import("@/waterbottle/Mapcomponent"), { ssr: false });

const API = "/api";

const fetchAPI = (url, options = {}) =>
  fetch(url, {
    ...options,
    headers: { "ngrok-skip-browser-warning": "true", ...options.headers },
  });

const CATEGORIES = [
  "Football", "Basketball", "Volleyball", "Tennis", "Swimming",
  "Chess", "Music", "Art", "Dance", "Drama", "Coding", "Science",
  "Wrestling", "Boxing", "Judo", "Athletics", "Other",
];

const DISTRICTS = ["Сүхбаатар","Баянзүрх","Хан-Уул","Баянгол","Чингэлтэй","Сонгинохайрхан","Налайх","Багануур","Багахангай"];

const fonts = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,700;0,9..144,800;1,9..144,700&family=DM+Sans:wght@400;500;600;700&display=swap');
  .ce-display { font-family: 'Fraunces', serif; }
  .ce-sans    { font-family: 'DM Sans', sans-serif; }

  @keyframes ce-fadeUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:none} }
  .ce-fadein { animation: ce-fadeUp 0.4s cubic-bezier(.22,1,.36,1) both; }

  .ce-section {
    background: var(--bg-card);
    border: 1px solid var(--border-subtle);
    border-radius: 18px; padding: 32px; margin-bottom: 20px;
    transition: background 0.35s, border-color 0.35s;
  }

  .ce-section-title {
    font-family: 'Fraunces', serif;
    font-size: 17px; font-weight: 800; color: var(--text-primary);
    margin: 0 0 22px; letter-spacing: -0.02em;
    display: flex; align-items: center; gap: 10px;
    padding-bottom: 16px; border-bottom: 1px solid var(--border-subtle);
  }

  .ce-label {
    font-family: 'DM Sans', sans-serif;
    font-size: 11px; font-weight: 700;
    color: var(--text-muted);
    letter-spacing: 0.1em; text-transform: uppercase;
    display: block; margin-bottom: 7px;
    transition: color 0.35s;
  }

  .ce-input {
    width: 100%; padding: 12px 14px;
    border: 1.5px solid var(--border-input);
    border-radius: 10px; font-size: 14px;
    color: var(--text-primary);
    background: var(--bg-input);
    outline: none; box-sizing: border-box;
    font-family: 'DM Sans', sans-serif;
    transition: border-color 0.2s, box-shadow 0.2s, background 0.35s;
  }
  .ce-input:focus {
    border-color: var(--accent) !important;
    box-shadow: 0 0 0 3px var(--accent-glow) !important;
  }
  .ce-input::placeholder { color: var(--text-muted) !important; }

  .ce-member-row {
    display: flex; align-items: center; gap: 12px;
    padding: 10px 0; border-bottom: 1px solid var(--border-subtle);
  }
  .ce-member-row:last-child { border-bottom: none; }

  .ce-upload-btn {
    font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 600;
    color: var(--accent); background: var(--accent-soft);
    border: 1.5px solid var(--border-subtle); border-radius: 8px;
    padding: 9px 18px; cursor: pointer; transition: all 0.2s;
  }
  .ce-upload-btn:hover {
    border-color: var(--accent);
    box-shadow: 0 2px 8px var(--accent-glow);
  }

  .ce-back-btn {
    display: inline-flex; align-items: center; gap: 7px;
    font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 600;
    color: var(--text-muted); background: var(--bg-card);
    border: 1px solid var(--border-subtle); border-radius: 7px;
    padding: 7px 14px; cursor: pointer; margin-bottom: 24px;
    transition: all 0.2s;
  }
  .ce-back-btn:hover { background: var(--accent-soft); color: var(--accent); border-color: var(--border-card); }
`;

export default function ClubEditPage() {
  const router  = useRouter();
  const { id: clubId } = router.query;

  const [user,    setUser]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [error,   setError]   = useState("");
  const [success, setSuccess] = useState(false);
  const [members, setMembers] = useState([]);
  const [membersLoading, setMembersLoading] = useState(false);

  const [form, setForm] = useState({
    clubName: "", category: "", description: "", foundedYear: "",
    address: "", district: "", email: "", phone: "", website: "",
    lat: null, lng: null,
    logo: null, logoPreview: null, existingLogo: null,
    bannerPhotos: [], bannerPreviews: [], existingBanners: [],
    qpay_info: "", dans_info: "",
  });

  const logoRef   = useRef();
  const bannerRef = useRef();

  function setField(key, value) { setForm(f => ({ ...f, [key]: value })); }

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) { router.push("/signin"); return; }
    setUser(JSON.parse(stored));
  }, []);

  useEffect(() => {
    if (!router.isReady || !user || !clubId) return;

    async function loadClub() {
      try {
        const res  = await fetchAPI(`${API}/clubs/${clubId}`);
        const data = await res.json();
        if (!data.success) { setError("Клуб олдсонгүй."); setLoading(false); return; }
        if (String(data.club.owner_id) !== String(user.id)) {
          setError("Энэ клубыг засах эрх байхгүй байна."); setLoading(false); return;
        }
        const c = data.club;
        let existingBanners = [];
        const rawBanners = c.banner_photos || c.banner;
        if (rawBanners) {
          if (Array.isArray(rawBanners)) { existingBanners = rawBanners; }
          else { try { existingBanners = JSON.parse(rawBanners); } catch { existingBanners = []; } }
        }
        setForm(f => ({
          ...f,
          clubName:     c.name         || "",
          category:     c.category     || "",
          description:  c.description  || "",
          foundedYear:  c.founded_year || "",
          address:      c.address      || "",
          district:     c.district     || "",
          email:        c.email        || "",
          phone:        c.phone        || "",
          website:      c.website      || "",
          lat:          c.lat          || null,
          lng:          c.lng          || null,
          existingLogo: c.logo         || null,
          existingBanners,
          qpay_info:    c.qpay_info    || "",
          dans_info:    c.dans_info    || "",
        }));
      } catch { setError("Серверт холбогдож чадсангүй."); }
      finally { setLoading(false); }
    }

    async function loadMembers() {
      const stored = localStorage.getItem("user");
      if (!stored) return;
      const u = JSON.parse(stored);
      setMembersLoading(true);
      try {
        const res  = await fetchAPI(`${API}/club/${clubId}/members`, { headers: { "x-user-id": String(u.id) } });
        const data = await res.json();
        if (data.success) setMembers(data.members || []);
      } catch {}
      finally { setMembersLoading(false); }
    }

    loadClub();
    loadMembers();
  }, [router.isReady, user, clubId]);

  function handleLogoUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    setForm(f => ({ ...f, logo: file, logoPreview: URL.createObjectURL(file) }));
  }

  function handleBannerUpload(e) {
    const files = Array.from(e.target.files);
    const newPreviews = files.map(f => URL.createObjectURL(f));
    const total = form.existingBanners.length + form.bannerPhotos.length;
    const canAdd = Math.max(0, 5 - total);
    setForm(f => ({
      ...f,
      bannerPhotos:   [...f.bannerPhotos,   ...files.slice(0, canAdd)],
      bannerPreviews: [...f.bannerPreviews, ...newPreviews.slice(0, canAdd)],
    }));
  }

  function removeExistingBanner(i) { setForm(f => ({ ...f, existingBanners: f.existingBanners.filter((_, idx) => idx !== i) })); }
  function removeNewBanner(i) {
    setForm(f => ({
      ...f,
      bannerPhotos:   f.bannerPhotos.filter((_, idx) => idx !== i),
      bannerPreviews: f.bannerPreviews.filter((_, idx) => idx !== i),
    }));
  }

  function handleMapPick(lat, lng) { setForm(f => ({ ...f, lat, lng })); }

  async function handleSave() {
    if (!form.clubName.trim() || !form.category || !form.description.trim() || !form.email.trim() || !form.address.trim()) {
      setError("Заавал бөглөх талбаруудыг бөглөнө үү."); return;
    }
    setError(""); setSaving(true);
    try {
      const fd = new FormData();
      fd.append("name",        form.clubName);
      fd.append("category",    form.category);
      fd.append("description", form.description);
      fd.append("email",       form.email);
      fd.append("address",     form.address);
      fd.append("district",    form.district);
      if (form.foundedYear) fd.append("foundedYear", form.foundedYear);
      if (form.phone)       fd.append("phone",       form.phone);
      if (form.website)     fd.append("website",     form.website);
      if (form.lat != null) fd.append("lat",         form.lat);
      if (form.lng != null) fd.append("lng",         form.lng);
      if (form.logo)        fd.append("logo",        form.logo);
      fd.append("existingBanners", JSON.stringify(form.existingBanners));
      form.bannerPhotos.forEach(file => fd.append("bannerPhotos", file));
      fd.append("qpay_info", form.qpay_info || "");
      fd.append("dans_info", form.dans_info || "");

      const res  = await fetchAPI(`${API}/clubs/${clubId}`, { method: "PUT", body: fd, headers: { "x-user-id": String(user.id) } });
      const data = await res.json();
      if (!res.ok) { setError(data.message || "Засварлахад алдаа гарлаа."); return; }
      setSuccess(true);
      setTimeout(() => router.push(`/club-owner-dashboard?clubId=${clubId}`), 1500);
    } catch { setError("Серверт холбогдож чадсангүй."); }
    finally { setSaving(false); }
  }

  const selectArrow = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%239a8f82' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`;

  const shell = (body) => (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--bg-page)", transition: "background 0.35s, color 0.35s" }}>
      <style>{fonts}</style>
      <Header />{body}<Footer />
    </div>
  );

  if (loading) return shell(
    <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p className="ce-sans" style={{ color: "var(--text-muted)", fontSize: "15px" }}>Ачааллаж байна…</p>
    </div>
  );

  if (error && !form.clubName) return shell(
    <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, padding: "32px" }}>
      <div style={{ width: 56, height: 56, borderRadius: 14, background: "var(--accent-soft)", border: "1px solid var(--border-subtle)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <svg width="22" height="22" fill="none" stroke="var(--accent)" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
      </div>
      <p className="ce-display" style={{ fontSize: "22px", color: "var(--text-primary)", fontWeight: 800 }}>{error}</p>
      <Link href="/page1" className="ce-sans" style={{ color: "var(--accent)", fontWeight: 600, fontSize: "14px" }}>← Клубууд руу буцах</Link>
    </div>
  );

  const totalBanners = form.existingBanners.length + form.bannerPhotos.length;

  return shell(
    <>
      <div style={{ height: "2px", background: "linear-gradient(90deg,var(--accent),var(--text-accent,var(--accent)),var(--accent))" }} />
      <main style={{ flex: 1, padding: "48px 24px 96px" }}>
        <div style={{ maxWidth: "720px", margin: "0 auto" }}>
          <div className="ce-fadein" style={{ marginBottom: "32px" }}>
            <button onClick={() => router.push(`/club-detail?id=${clubId}`)} className="ce-back-btn">
              <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg>
              Back to Club
            </button>
            <h1 className="ce-display" style={{ fontSize: "clamp(1.8rem,4vw,2.6rem)", fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.04em", lineHeight: 1.15, margin: "0 0 6px" }}>
              Edit <em style={{ fontStyle: "italic", color: "var(--accent)" }}>your club</em>
            </h1>
            <p className="ce-sans" style={{ color: "var(--text-muted)", fontSize: "14px", margin: 0 }}>Changes will be saved immediately.</p>
          </div>
          {error && (
            <div className="ce-fadein" style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "10px", padding: "12px 16px", marginBottom: "20px", fontSize: "13px", color: "#dc2626", fontFamily: "'DM Sans',sans-serif", display: "flex", alignItems: "center", gap: "8px" }}>
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              {error}
            </div>
          )}
          {success && (
            <div className="ce-fadein" style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)", borderRadius: "10px", padding: "12px 16px", marginBottom: "20px", fontSize: "13px", color: "#16a34a", fontFamily: "'DM Sans',sans-serif", display: "flex", alignItems: "center", gap: "8px" }}>
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
              Амжилттай хадгаллаа! Буцаж байна…
            </div>
          )}

          <div className="ce-section ce-fadein">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
              <h2 className="ce-section-title" style={{ borderBottom: "none", paddingBottom: 0, margin: 0 }}>
                Members
                <span className="ce-sans" style={{ fontSize: "13px", fontWeight: 600, color: "var(--accent)", background: "var(--accent-soft)", borderRadius: "20px", padding: "2px 10px" }}>
                  {membersLoading ? "…" : members.length}
                </span>
              </h2>
              <button onClick={() => router.push(`/club-owner-dashboard?clubId=${clubId}`)} className="ce-sans"
                style={{ fontSize: "12px", fontWeight: 600, color: "var(--accent)", background: "var(--accent-soft)", border: "none", borderRadius: "8px", padding: "7px 14px", cursor: "pointer", transition: "all 0.2s" }}>
                Full Dashboard →
              </button>
            </div>

            {membersLoading ? (
              <p className="ce-sans" style={{ fontSize: "13px", color: "var(--text-muted)", textAlign: "center", padding: "16px 0" }}>Loading members…</p>
            ) : members.length === 0 ? (
              <div style={{ textAlign: "center", padding: "24px 0" }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: "var(--bg-input)", border: "1px solid var(--border-subtle)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 10px" }}>
                  <svg width="18" height="18" fill="none" stroke="var(--text-muted)" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
                </div>
                <p className="ce-sans" style={{ fontSize: "13.5px", color: "var(--text-muted)", margin: 0 }}>No one has joined yet. Share your club!</p>
              </div>
            ) : (
              <>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px", marginBottom: "16px" }}>
                  {[
                    { label: "Total",      value: members.length },
                    { label: "This month", value: members.filter(m => { if (!m.joined_at) return false; const d = new Date(m.joined_at), now = new Date(); return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear(); }).length },
                    { label: "Paid",       value: members.filter(m => m.payment_status === "confirmed").length },
                  ].map(({ label, value }) => (
                    <div key={label} style={{ background: "var(--accent-soft)", border: "1px solid var(--border-subtle)", borderRadius: "10px", padding: "12px", textAlign: "center" }}>
                      <p className="ce-sans" style={{ fontSize: "22px", fontWeight: 700, color: "var(--accent)", margin: "0 0 2px" }}>{value}</p>
                      <p className="ce-sans" style={{ fontSize: "11px", color: "var(--text-muted)", margin: 0 }}>{label}</p>
                    </div>
                  ))}
                </div>
                <div style={{ maxHeight: "280px", overflowY: "auto" }}>
                  {members.map((m, i) => (
                    <div key={m.id || i} className="ce-member-row">
                      <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "var(--accent-soft)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, overflow: "hidden" }}>
                        {m.photo
                          ? <img src={m.photo} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                          : <span className="ce-sans" style={{ fontSize: "13px", fontWeight: 700, color: "var(--accent)" }}>{(m.name || "?")[0].toUpperCase()}</span>
                        }
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p className="ce-sans" style={{ fontSize: "13.5px", fontWeight: 600, color: "var(--text-primary)", margin: "0 0 1px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{m.name || "Unknown"}</p>
                        <p className="ce-sans" style={{ fontSize: "11.5px", color: "var(--text-muted)", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{m.email || "—"}</p>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "3px", flexShrink: 0 }}>
                        {m.tier_name && (
                          <span className="ce-sans" style={{ fontSize: "10.5px", fontWeight: 700, color: "var(--accent)", background: "var(--accent-soft)", borderRadius: "20px", padding: "2px 8px" }}>{m.tier_name}</span>
                        )}
                        {m.payment_status && (
                          <span className="ce-sans" style={{ fontSize: "10px", fontWeight: 600,
                            color: m.payment_status === "confirmed" ? "#16a34a" : m.payment_status === "pending" ? "#b45309" : "#dc2626",
                            background: m.payment_status === "confirmed" ? "rgba(34,197,94,0.08)" : m.payment_status === "pending" ? "rgba(234,179,8,0.08)" : "rgba(239,68,68,0.08)",
                            borderRadius: "20px", padding: "2px 8px" }}>
                            {m.payment_status}
                          </span>
                        )}
                        {m.joined_at && <span className="ce-sans" style={{ fontSize: "10px", color: "var(--text-muted)" }}>{new Date(m.joined_at).toLocaleDateString()}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
          <div className="ce-section ce-fadein">
            <h2 className="ce-section-title">
              <svg width="16" height="16" fill="none" stroke="var(--accent)" strokeWidth="2" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
              Basic Info
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
              <div>
                <label className="ce-label">Club Name *</label>
                <input className="ce-input" value={form.clubName} onChange={e => setField("clubName", e.target.value)} placeholder="Your club name" />
              </div>
              <div>
                <label className="ce-label">Category *</label>
                <select className="ce-input" value={form.category} onChange={e => setField("category", e.target.value)}
                  style={{ appearance: "none", cursor: "pointer", backgroundImage: selectArrow, backgroundRepeat: "no-repeat", backgroundPosition: "right 14px center" }}>
                  <option value="">Select a category…</option>
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="ce-label">Description *</label>
                <textarea className="ce-input" style={{ resize: "vertical", minHeight: "120px", lineHeight: 1.65 }}
                  value={form.description} onChange={e => setField("description", e.target.value)} placeholder="Describe your club…" />
                <span className="ce-sans" style={{ fontSize: "11.5px", color: "var(--text-muted)", marginTop: "4px", display: "block" }}>{form.description.length} characters</span>
              </div>
              <div>
                <label className="ce-label">Founded Year</label>
                <input className="ce-input" style={{ maxWidth: "180px" }} type="number" min="1900" max="2030" value={form.foundedYear} onChange={e => setField("foundedYear", e.target.value)} placeholder="e.g. 2020" />
              </div>
            </div>
          </div>
          <div className="ce-section ce-fadein">
            <h2 className="ce-section-title">
              <svg width="16" height="16" fill="none" stroke="var(--accent)" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="4"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
              Media
            </h2>
            <div style={{ marginBottom: "28px" }}>
              <label className="ce-label">Club Logo</label>
              <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                <div style={{ width: "80px", height: "80px", borderRadius: "14px", background: "var(--bg-input)", border: "1.5px dashed var(--border-input)", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", flexShrink: 0 }}>
                  {(form.logoPreview || form.existingLogo)
                    ? <img src={form.logoPreview || form.existingLogo} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="Logo" />
                    : <svg width="24" height="24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="4"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                  }
                </div>
                <div>
                  <button className="ce-upload-btn" onClick={() => logoRef.current.click()}>
                    {form.existingLogo || form.logoPreview ? "Change logo" : "Upload logo"}
                  </button>
                  <p className="ce-sans" style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "6px" }}>PNG or JPG, recommended 400×400px</p>
                  <input ref={logoRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleLogoUpload} />
                </div>
              </div>
            </div>
            <div>
              <label className="ce-label">
                Banner Photos
                <span style={{ fontWeight: 400, textTransform: "none", letterSpacing: 0, color: "var(--text-muted)", marginLeft: 6 }}>(up to 5)</span>
              </label>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px,1fr))", gap: "10px" }}>
                {form.existingBanners.map((src, i) => (
                  <div key={`ex-${i}`} style={{ position: "relative", aspectRatio: "16/9", borderRadius: "10px", overflow: "hidden", background: "var(--bg-input)" }}>
                    <img src={src} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt={`Banner ${i + 1}`} />
                    <button onClick={() => removeExistingBanner(i)} style={{ position: "absolute", top: "5px", right: "5px", background: "rgba(0,0,0,0.55)", border: "none", borderRadius: "50%", width: "20px", height: "20px", cursor: "pointer", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", padding: 0 }}>
                      <svg width="9" height="9" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12"/></svg>
                    </button>
                  </div>
                ))}
                {form.bannerPreviews.map((src, i) => (
                  <div key={`new-${i}`} style={{ position: "relative", aspectRatio: "16/9", borderRadius: "10px", overflow: "hidden", background: "var(--bg-input)" }}>
                    <img src={src} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt={`New ${i + 1}`} />
                    <div style={{ position: "absolute", top: "5px", left: "5px", background: "var(--accent)", borderRadius: "4px", padding: "2px 6px" }}>
                      <span className="ce-sans" style={{ fontSize: "9px", color: "var(--text-on-accent)", fontWeight: 700 }}>NEW</span>
                    </div>
                    <button onClick={() => removeNewBanner(i)} style={{ position: "absolute", top: "5px", right: "5px", background: "rgba(0,0,0,0.55)", border: "none", borderRadius: "50%", width: "20px", height: "20px", cursor: "pointer", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", padding: 0 }}>
                      <svg width="9" height="9" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12"/></svg>
                    </button>
                  </div>
                ))}
                {totalBanners < 5 && (
                  <div onClick={() => bannerRef.current.click()} style={{ aspectRatio: "16/9", borderRadius: "10px", background: "var(--bg-input)", border: "1.5px dashed var(--border-input)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: "pointer", gap: "5px", transition: "all 0.2s" }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.background = "var(--accent-soft)"; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border-input)"; e.currentTarget.style.background = "var(--bg-input)"; }}>
                    <svg width="18" height="18" fill="none" stroke="var(--text-muted)" strokeWidth="1.5" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                    <span className="ce-sans" style={{ fontSize: "10px", color: "var(--text-muted)", fontWeight: 600 }}>Add photo</span>
                  </div>
                )}
              </div>
              <input ref={bannerRef} type="file" accept="image/*" multiple style={{ display: "none" }} onChange={handleBannerUpload} />
            </div>
          </div>
          <div className="ce-section ce-fadein">
            <h2 className="ce-section-title">
              <svg width="16" height="16" fill="none" stroke="var(--accent)" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              Location & Contact
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
              <div>
                <label className="ce-label">Street Address *</label>
                <input className="ce-input" value={form.address} onChange={e => setField("address", e.target.value)} placeholder="e.g. Baga toiruu 12" />
              </div>
              <div>
                <label className="ce-label">District</label>
                <select className="ce-input" value={form.district} onChange={e => setField("district", e.target.value)}
                  style={{ appearance: "none", cursor: "pointer", backgroundImage: selectArrow, backgroundRepeat: "no-repeat", backgroundPosition: "right 14px center" }}>
                  <option value="">Select district…</option>
                  {DISTRICTS.map(d => <option key={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label className="ce-label">
                  Map Pin
                  <span style={{ fontWeight: 400, textTransform: "none", letterSpacing: 0, color: "var(--text-muted)", marginLeft: 6 }}>— click map to update</span>
                </label>
                <div style={{ background: form.lat ? "rgba(34,197,94,0.06)" : "var(--bg-input)", border: `1px solid ${form.lat ? "rgba(34,197,94,0.25)" : "var(--border-subtle)"}`, borderRadius: "10px", padding: "10px 14px", marginBottom: "10px", display: "flex", alignItems: "center", gap: "8px", transition: "all 0.35s" }}>
                  {form.lat ? (
                    <>
                      <svg width="14" height="14" fill="none" stroke="#16a34a" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
                      <span className="ce-sans" style={{ fontSize: "12.5px", color: "#16a34a" }}>{form.lat.toFixed(4)}, {form.lng.toFixed(4)}</span>
                      <button onClick={() => setForm(f => ({ ...f, lat: null, lng: null }))} className="ce-sans" style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer", color: "#dc2626", fontSize: "12px", fontWeight: 600 }}>Remove</button>
                    </>
                  ) : (
                    <>
                      <svg width="14" height="14" fill="none" stroke="var(--text-muted)" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                      <span className="ce-sans" style={{ fontSize: "12.5px", color: "var(--text-muted)" }}>Tap the map to set a pin</span>
                    </>
                  )}
                </div>
                <div style={{ borderRadius: "14px", overflow: "hidden", border: "1.5px solid var(--border-subtle)" }}>
                  <MapPicker pickMode={true} onPick={handleMapPick} pickedLat={form.lat} pickedLng={form.lng} height="280px" />
                </div>
              </div>

              <div style={{ height: "1px", background: "var(--border-subtle)" }} />

              <div>
                <label className="ce-label">Contact Email *</label>
                <input className="ce-input" type="email" value={form.email} onChange={e => setField("email", e.target.value)} placeholder="club@example.com" />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div>
                  <label className="ce-label">Phone</label>
                  <input className="ce-input" type="tel" value={form.phone} onChange={e => setField("phone", e.target.value)} placeholder="+976 9999 9999" />
                </div>
                <div>
                  <label className="ce-label">Website</label>
                  <input className="ce-input" type="url" value={form.website} onChange={e => setField("website", e.target.value)} placeholder="https://…" />
                </div>
              </div>
            </div>
          </div>
          <div className="ce-section ce-fadein">
            <h2 className="ce-section-title">
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
              Payment Info
            </h2>
            <p className="ce-sans" style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "20px", lineHeight: 1.6 }}>
              Гишүүд төлбөр хийхэд харуулах QPay QR код эсвэл данс мэдээлэл оруулна уу. Хэрэв үлдээвэл харуулахгүй.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
              <div>
                <label className="ce-label">
                  <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                    <span style={{ background: "#0066cc", color: "#fff", borderRadius: "5px", padding: "1px 6px", fontSize: "10px", fontWeight: 800 }}>Q</span>
                    QPay мэдээлэл
                  </span>
                </label>
                <textarea
                  className="ce-input"
                  rows={4}
                  value={form.qpay_info}
                  onChange={e => setField("qpay_info", e.target.value)}
                  placeholder={"QPay QR image URL эсвэл данс дугаар:\nжишээ: https://... эсвэл\nQPay данс: 1234567890"}
                  style={{ resize: "vertical", minHeight: "100px" }}
                />
                {form.qpay_info && form.qpay_info.startsWith("http") && (
                  <div style={{ marginTop: "10px", textAlign: "center" }}>
                    <img src={form.qpay_info} alt="QPay QR preview" style={{ maxWidth: "140px", borderRadius: "10px", border: "1px solid var(--border-subtle)" }} onError={e => e.target.style.display="none"} />
                    <p className="ce-sans" style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "6px" }}>QR урьдчилан харах</p>
                  </div>
                )}
              </div>
              <div>
                <label className="ce-label">
                  <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                    <span style={{ background: "#e8420a", color: "#fff", borderRadius: "5px", padding: "1px 5px", fontSize: "9px", fontWeight: 800 }}>DANS</span>
                    Данс / Bank Transfer
                  </span>
                </label>
                <textarea
                  className="ce-input"
                  rows={4}
                  value={form.dans_info}
                  onChange={e => setField("dans_info", e.target.value)}
                  placeholder={"Банкны данс мэдээлэл:\nжишээ:\nХаан банк: 5000123456\nДансны эзэн: Батбаяр"}
                  style={{ resize: "vertical", minHeight: "100px" }}
                />
              </div>
            </div>
          </div>

          <div className="ce-fadein" style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
            <button onClick={() => router.push(`/club-owner-dashboard?clubId=${clubId}`)} className="ce-sans"
              style={{ padding: "12px 28px", borderRadius: "10px", border: "1.5px solid var(--border-subtle)", background: "var(--bg-card)", color: "var(--text-muted)", fontWeight: 600, fontSize: "14px", cursor: "pointer", transition: "all 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.background = "var(--accent-soft)"; e.currentTarget.style.color = "var(--accent)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "var(--bg-card)"; e.currentTarget.style.color = "var(--text-muted)"; }}>
              Cancel
            </button>
            <button onClick={handleSave} disabled={saving} className="ce-sans"
              style={{ padding: "12px 32px", borderRadius: "10px", background: "var(--accent)", border: "none", color: "var(--text-on-accent)", fontWeight: 700, fontSize: "14px", cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.7 : 1, boxShadow: "0 4px 16px var(--accent-glow)", transition: "all 0.2s" }}>
              {saving ? "Хадгалж байна…" : "Save Changes"}
            </button>
          </div>

        </div>
      </main>
    </>
  );
}