import { useState, useRef } from "react";
import { useRouter } from "next/router";
import Header from "@/waterbottle/Header";
import Footer from "@/waterbottle/Footer";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const CATEGORIES = [
  "Football", "Basketball", "Volleyball", "Tennis", "Swimming",
  "Chess", "Music", "Art", "Dance", "Drama", "Coding", "Science",
  "Wrestling", "Boxing", "Judo", "Athletics", "Other",
];

const STEPS = ["Basic Info", "Media", "Pricing", "Location & Contact"];

const fonts = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,700;0,9..144,800;1,9..144,700&family=DM+Sans:wght@400;500;600;700&display=swap');
  .reg-display { font-family: 'Fraunces', serif; }
  .reg-sans { font-family: 'DM Sans', sans-serif; }
`;

const extraStyles = `
  .reg-back {
    display: inline-flex; align-items: center; gap: 7px;
    font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 600;
    color: #555; background: rgba(26,5,51,0.04);
    border: 1px solid rgba(26,5,51,0.1); border-radius: 7px;
    padding: 7px 14px; cursor: pointer; text-decoration: none;
    transition: background 0.2s, color 0.2s; line-height: 1; margin-bottom: 32px;
    display: inline-flex;
  }
  .reg-back:hover { background: rgba(124,58,237,0.06); color: #7c3aed; border-color: rgba(124,58,237,0.2); }
  .reg-upload-btn {
    font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 600;
    color: #7c3aed; background: #f5f0ff;
    border: 1.5px solid rgba(124,58,237,0.2); border-radius: 8px;
    padding: 9px 18px; cursor: pointer; transition: all 0.2s;
  }
  .reg-upload-btn:hover { background: #ede9fe; border-color: #7c3aed; }
`;

export default function ClubRegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    clubName: "",
    category: "",
    description: "",
    foundedYear: "",
    logo: null,           // File object
    logoPreview: null,    // Object URL for preview
    bannerPhotos: [],     // Array of File objects
    bannerPreviews: [],   // Array of Object URLs
    pricingType: "free",
    tiers: [{ name: "Basic", price: "", period: "monthly", description: "", features: "" }],
    address: "",
    district: "",
    email: "",
    phone: "",
    website: "",
  });

  const logoRef = useRef();
  const bannerRef = useRef();

  function setField(key, value) {
    setForm(f => ({ ...f, [key]: value }));
  }

  function handleLogoUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    setForm(f => ({ ...f, logo: file, logoPreview: URL.createObjectURL(file) }));
  }

  function handleBannerUpload(e) {
    const files = Array.from(e.target.files);
    const newPreviews = files.map(f => URL.createObjectURL(f));
    setForm(f => ({
      ...f,
      bannerPhotos: [...f.bannerPhotos, ...files].slice(0, 5),
      bannerPreviews: [...f.bannerPreviews, ...newPreviews].slice(0, 5),
    }));
  }

  function removeBanner(i) {
    setForm(f => ({
      ...f,
      bannerPhotos: f.bannerPhotos.filter((_, idx) => idx !== i),
      bannerPreviews: f.bannerPreviews.filter((_, idx) => idx !== i),
    }));
  }

  function addTier() {
    setForm(f => ({ ...f, tiers: [...f.tiers, { name: "", price: "", period: "monthly", description: "", features: "" }] }));
  }

  function removeTier(i) {
    setForm(f => ({ ...f, tiers: f.tiers.filter((_, idx) => idx !== i) }));
  }

  function setTierField(i, key, value) {
    setForm(f => ({ ...f, tiers: f.tiers.map((t, idx) => idx === i ? { ...t, [key]: value } : t) }));
  }

  function canProceed() {
    if (step === 0) return form.clubName.trim() && form.category && form.description.trim();
    if (step === 1) return true;
    if (step === 2) return form.pricingType === "free" || form.tiers.every(t => t.name && t.price);
    if (step === 3) return form.email.trim() && form.address.trim();
    return true;
  }

  async function handleSubmit() {
    setError("");
    setLoading(true);

    try {
      // ── Use FormData so image files are included in the request ──────────
      const fd = new FormData();
      fd.append("name",         form.clubName);
      fd.append("category",     form.category);
      fd.append("description",  form.description);
      fd.append("email",        form.email);
      fd.append("address",      form.address);
      fd.append("district",     form.district);
      fd.append("pricingType",  form.pricingType);
      if (form.foundedYear) fd.append("foundedYear", form.foundedYear);
      if (form.phone)       fd.append("phone",       form.phone);
      if (form.website)     fd.append("website",     form.website);

      // Attach image files if the user uploaded them
      if (form.logo) {
        fd.append("logo", form.logo);
      }
      form.bannerPhotos.forEach(file => {
        fd.append("bannerPhotos", file);
      });

      // Do NOT set Content-Type header — browser sets it automatically with
      // the correct multipart boundary when using FormData.
      const response = await fetch(`${API}/registerClub`, {
        method: "POST",
        body: fd,
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.message || "Клуб бүртгэхэд алдаа гарлаа");
        return;
      }

      setSubmitted(true);
    } catch (err) {
      setError("Сервертэй холбогдож чадсангүй. Backend ажиллаж байгаа эсэхийг шалгана уу.");
    } finally {
      setLoading(false);
    }
  }

  const inp = {
    width: "100%", padding: "13px 16px",
    border: "1.5px solid rgba(124,58,237,0.2)", borderRadius: "10px",
    fontSize: "14px", color: "#1a0533", background: "#fdfcff",
    outline: "none", boxSizing: "border-box", fontFamily: "'DM Sans', sans-serif",
    transition: "border-color 0.2s, box-shadow 0.2s",
  };

  const labelStyle = {
    fontSize: "11px", fontWeight: 700, color: "#9879d4",
    letterSpacing: "0.1em", textTransform: "uppercase",
    display: "block", marginBottom: "7px", fontFamily: "'DM Sans', sans-serif",
  };

  if (submitted) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#fff" }}>
        <style>{fonts}</style>
        <Header />
        <div style={{ height: "2px", background: "linear-gradient(90deg, #4c1d95, #7c3aed, #c4b5fd, #7c3aed, #4c1d95)" }} />
        <main style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "80px 24px" }}>
          <div style={{ textAlign: "center", maxWidth: "480px" }}>
            <div style={{
              width: "80px", height: "80px", borderRadius: "20px",
              background: "linear-gradient(135deg, #7c3aed, #a78bfa)",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 28px", boxShadow: "0 12px 40px rgba(124,58,237,0.3)",
            }}>
              <svg width="36" height="36" fill="none" stroke="#fff" strokeWidth="2.5" viewBox="0 0 24 24">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h1 className="reg-display" style={{ fontSize: "2.4rem", fontWeight: 800, color: "#1a0533", letterSpacing: "-0.04em", margin: "0 0 16px" }}>
              Club registered!
            </h1>
            <p className="reg-sans" style={{ fontSize: "15px", color: "#888", lineHeight: 1.7, marginBottom: "36px" }}>
              <strong style={{ color: "#1a0533" }}>{form.clubName}</strong> амжилттай бүртгэгдлээ. Одоо browse хуудсанд харагдаж байна!
            </p>
            <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
              <a href="/page1" className="reg-sans" style={{
                background: "linear-gradient(135deg, #7c3aed, #4c1d95)", color: "#fff",
                padding: "13px 28px", borderRadius: "9px",
                textDecoration: "none", fontWeight: 700, fontSize: "14px",
                boxShadow: "0 4px 16px rgba(124,58,237,0.3)",
              }}>
                Browse clubs →
              </a>
              <a href="/page" className="reg-sans" style={{
                background: "#f5f0ff", color: "#7c3aed", padding: "13px 28px",
                borderRadius: "9px", textDecoration: "none", fontWeight: 600, fontSize: "14px",
                border: "1.5px solid rgba(124,58,237,0.2)",
              }}>
                Back to home
              </a>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#fff" }}>
      <style>{fonts + extraStyles}</style>
      <Header />
      <div style={{ height: "2px", background: "linear-gradient(90deg, #4c1d95, #7c3aed, #c4b5fd, #7c3aed, #4c1d95)" }} />

      <main style={{ flex: 1, padding: "56px 24px 96px" }}>
        <div style={{ maxWidth: "720px", margin: "0 auto" }}>

          <div style={{ marginBottom: "48px" }}>
            <a href="/page" className="reg-back">
              <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <polyline points="15 18 9 12 15 6" />
              </svg>
              Back
            </a>
            <h1 className="reg-display" style={{ fontSize: "clamp(2rem, 5vw, 3.2rem)", fontWeight: 800, color: "#1a0533", letterSpacing: "-0.04em", lineHeight: 1.15, margin: "0 0 10px" }}>
              Register your <span style={{ color: "#7c3aed", fontStyle: "italic" }}>club</span>
            </h1>
            <p className="reg-sans" style={{ color: "#888", fontSize: "15px", lineHeight: 1.7 }}>
              Fill in the details below and your club will appear on the browse page immediately.
            </p>
          </div>

          {/* Step indicator */}
          <div style={{ display: "flex", marginBottom: "48px" }}>
            {STEPS.map((s, i) => (
              <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", position: "relative" }}>
                {i < STEPS.length - 1 && (
                  <div style={{ position: "absolute", top: "17px", left: "50%", right: "-50%", height: "2px", background: i < step ? "#7c3aed" : "rgba(124,58,237,0.12)", transition: "background 0.3s", zIndex: 0 }} />
                )}
                <div style={{ width: "34px", height: "34px", borderRadius: "50%", zIndex: 1, display: "flex", alignItems: "center", justifyContent: "center", background: i < step ? "#7c3aed" : i === step ? "#1a0533" : "#fff", border: `2px solid ${i <= step ? (i < step ? "#7c3aed" : "#1a0533") : "rgba(124,58,237,0.2)"}`, color: i <= step ? "#fff" : "#bbb", fontSize: "12px", fontWeight: 700, fontFamily: "'DM Sans', sans-serif" }}>
                  {i < step ? <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12" /></svg> : i + 1}
                </div>
                <span className="reg-sans" style={{ fontSize: "11px", fontWeight: 600, marginTop: "8px", color: i === step ? "#1a0533" : i < step ? "#7c3aed" : "#bbb", textAlign: "center" }}>{s}</span>
              </div>
            ))}
          </div>

          {error && (
            <div style={{ background: "#fef2f2", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "10px", padding: "12px 16px", marginBottom: "24px", fontSize: "13px", color: "#dc2626", fontFamily: "'DM Sans', sans-serif" }}>
              {error}
            </div>
          )}

          <div style={{ background: "#fff", border: "1.5px solid rgba(124,58,237,0.12)", borderRadius: "20px", padding: "48px", boxShadow: "0 4px 32px rgba(124,58,237,0.06)" }}>

            {/* ── Step 0: Basic Info ── */}
            {step === 0 && (
              <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                <div>
                  <label style={labelStyle}>Club Name *</label>
                  <input style={inp} placeholder="e.g. Ulaanbaatar FC" value={form.clubName}
                    onChange={e => setField("clubName", e.target.value)}
                    onFocus={e => { e.target.style.borderColor = "#7c3aed"; e.target.style.boxShadow = "0 0 0 3px rgba(124,58,237,0.1)"; }}
                    onBlur={e => { e.target.style.borderColor = "rgba(124,58,237,0.2)"; e.target.style.boxShadow = "none"; }}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Category *</label>
                  <select style={{ ...inp, appearance: "none", cursor: "pointer", backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%239879d4' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 14px center" }}
                    value={form.category} onChange={e => setField("category", e.target.value)}>
                    <option value="">Select a category…</option>
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Description *</label>
                  <textarea style={{ ...inp, resize: "vertical", lineHeight: 1.65, minHeight: "120px" }}
                    placeholder="Tell people what your club is about, your goals, what members can expect…"
                    value={form.description} onChange={e => setField("description", e.target.value)}
                    onFocus={e => { e.target.style.borderColor = "#7c3aed"; e.target.style.boxShadow = "0 0 0 3px rgba(124,58,237,0.1)"; }}
                    onBlur={e => { e.target.style.borderColor = "rgba(124,58,237,0.2)"; e.target.style.boxShadow = "none"; }}
                  />
                  <span className="reg-sans" style={{ fontSize: "11.5px", color: "#bbb", marginTop: "5px", display: "block" }}>
                    {form.description.length} characters
                  </span>
                </div>
                <div>
                  <label style={labelStyle}>Founded Year</label>
                  <input style={{ ...inp, maxWidth: "180px" }} placeholder="e.g. 2019" type="number" min="1900" max="2030"
                    value={form.foundedYear} onChange={e => setField("foundedYear", e.target.value)} />
                </div>
              </div>
            )}

            {/* ── Step 1: Media ── */}
            {step === 1 && (
              <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
                {/* Logo */}
                <div>
                  <label style={labelStyle}>Club Logo</label>
                  <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                    <div style={{ width: "90px", height: "90px", borderRadius: "16px", background: "#f5f0ff", border: "1.5px dashed rgba(124,58,237,0.3)", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", flexShrink: 0 }}>
                      {form.logoPreview
                        ? <img src={form.logoPreview} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="Logo preview" />
                        : <svg width="28" height="28" fill="none" stroke="#c4b5fd" strokeWidth="1.5" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="4" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>
                      }
                    </div>
                    <div>
                      <button className="reg-upload-btn" onClick={() => logoRef.current.click()}>
                        {form.logoPreview ? "Change logo" : "Upload logo"}
                      </button>
                      <p className="reg-sans" style={{ fontSize: "12px", color: "#bbb", marginTop: "6px" }}>PNG or JPG, recommended 400×400px</p>
                      {/* Hidden file input — logo */}
                      <input ref={logoRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleLogoUpload} />
                    </div>
                  </div>
                </div>

                {/* Banner photos */}
                <div>
                  <label style={labelStyle}>Banner Photos <span style={{ color: "#bbb", fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>(up to 5)</span></label>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: "12px" }}>
                    {form.bannerPreviews.map((src, i) => (
                      <div key={i} style={{ position: "relative", aspectRatio: "16/9", borderRadius: "10px", overflow: "hidden", background: "#f5f0ff" }}>
                        <img src={src} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt={`Banner ${i + 1}`} />
                        <button onClick={() => removeBanner(i)} style={{ position: "absolute", top: "6px", right: "6px", background: "rgba(0,0,0,0.5)", border: "none", borderRadius: "50%", width: "22px", height: "22px", cursor: "pointer", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", padding: 0 }}>
                          <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12" /></svg>
                        </button>
                      </div>
                    ))}
                    {form.bannerPreviews.length < 5 && (
                      <div onClick={() => bannerRef.current.click()} style={{ aspectRatio: "16/9", borderRadius: "10px", background: "#fdfcff", border: "1.5px dashed rgba(124,58,237,0.25)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: "pointer", gap: "6px" }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = "#7c3aed"; e.currentTarget.style.background = "#f5f0ff"; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(124,58,237,0.25)"; e.currentTarget.style.background = "#fdfcff"; }}
                      >
                        <svg width="20" height="20" fill="none" stroke="#c4b5fd" strokeWidth="1.5" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                        <span className="reg-sans" style={{ fontSize: "11px", color: "#c4b5fd", fontWeight: 600 }}>Add photo</span>
                      </div>
                    )}
                  </div>
                  {/* Hidden file input — banners (multiple) */}
                  <input ref={bannerRef} type="file" accept="image/*" multiple style={{ display: "none" }} onChange={handleBannerUpload} />
                </div>
              </div>
            )}

            {/* ── Step 2: Pricing ── */}
            {step === 2 && (
              <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
                <div>
                  <label style={labelStyle}>Membership Type</label>
                  <div style={{ display: "flex", gap: "12px" }}>
                    {["free", "paid"].map(type => (
                      <button key={type} onClick={() => setField("pricingType", type)} className="reg-sans" style={{ flex: 1, padding: "14px", borderRadius: "10px", cursor: "pointer", border: `1.5px solid ${form.pricingType === type ? "#7c3aed" : "rgba(124,58,237,0.15)"}`, background: form.pricingType === type ? "#f5f0ff" : "#fff", color: form.pricingType === type ? "#7c3aed" : "#888", fontWeight: 700, fontSize: "14px", transition: "all 0.2s" }}>
                        {type === "free" ? "🆓 Free to join" : "💳 Paid membership"}
                      </button>
                    ))}
                  </div>
                </div>

                {form.pricingType === "paid" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    {form.tiers.map((tier, i) => (
                      <div key={i} style={{ border: "1.5px solid rgba(124,58,237,0.12)", borderRadius: "14px", padding: "24px", background: "#fdfcff" }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "18px" }}>
                          <span className="reg-sans" style={{ fontSize: "12px", fontWeight: 700, color: "#9879d4", letterSpacing: "0.08em", textTransform: "uppercase" }}>Tier {i + 1}</span>
                          {form.tiers.length > 1 && <button onClick={() => removeTier(i)} className="reg-sans" style={{ background: "none", border: "none", cursor: "pointer", color: "#f87171", fontSize: "12px", fontWeight: 600 }}>Remove</button>}
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "14px", marginBottom: "14px" }}>
                          <div><label style={labelStyle}>Tier Name *</label><input style={inp} placeholder="e.g. Basic" value={tier.name} onChange={e => setTierField(i, "name", e.target.value)} /></div>
                          <div><label style={labelStyle}>Price (₮) *</label><input style={inp} placeholder="e.g. 15000" type="number" value={tier.price} onChange={e => setTierField(i, "price", e.target.value)} /></div>
                          <div>
                            <label style={labelStyle}>Period</label>
                            <select style={{ ...inp, appearance: "none", cursor: "pointer" }} value={tier.period} onChange={e => setTierField(i, "period", e.target.value)}>
                              <option value="monthly">Monthly</option>
                              <option value="quarterly">Quarterly</option>
                              <option value="yearly">Yearly</option>
                              <option value="once">One-time</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    ))}
                    {form.tiers.length < 4 && (
                      <button onClick={addTier} className="reg-sans" style={{ border: "1.5px dashed rgba(124,58,237,0.25)", borderRadius: "12px", padding: "16px", background: "none", cursor: "pointer", color: "#9879d4", fontWeight: 600, fontSize: "13.5px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                        Add another tier
                      </button>
                    )}
                  </div>
                )}

                {form.pricingType === "free" && (
                  <div style={{ background: "#f0fdf4", border: "1px solid rgba(34,197,94,0.2)", borderRadius: "12px", padding: "20px 24px", display: "flex", alignItems: "center", gap: "14px" }}>
                    <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "#dcfce7", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <svg width="18" height="18" fill="none" stroke="#22c55e" strokeWidth="2" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12" /></svg>
                    </div>
                    <p className="reg-sans" style={{ fontSize: "13.5px", color: "#166534", margin: 0, lineHeight: 1.6 }}>
                      Your club is free to join — no membership fees.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* ── Step 3: Location & Contact ── */}
            {step === 3 && (
              <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                <div>
                  <label style={labelStyle}>Street Address *</label>
                  <input style={inp} placeholder="e.g. Суурин 4, Сүхбаатар дүүрэг" value={form.address}
                    onChange={e => setField("address", e.target.value)}
                    onFocus={e => { e.target.style.borderColor = "#7c3aed"; e.target.style.boxShadow = "0 0 0 3px rgba(124,58,237,0.1)"; }}
                    onBlur={e => { e.target.style.borderColor = "rgba(124,58,237,0.2)"; e.target.style.boxShadow = "none"; }}
                  />
                </div>
                <div>
                  <label style={labelStyle}>District</label>
                  <select style={{ ...inp, appearance: "none", cursor: "pointer", backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%239879d4' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 14px center" }}
                    value={form.district} onChange={e => setField("district", e.target.value)}>
                    <option value="">Select district…</option>
                    {["Сүхбаатар", "Баянзүрх", "Хан-Уул", "Баянгол", "Чингэлтэй", "Сонгинохайрхан", "Налайх", "Багануур", "Багахангай"].map(d => <option key={d}>{d}</option>)}
                  </select>
                </div>
                <div style={{ height: "1px", background: "rgba(124,58,237,0.08)" }} />
                <div>
                  <label style={labelStyle}>Contact Email *</label>
                  <input style={inp} type="email" placeholder="club@email.com" value={form.email}
                    onChange={e => setField("email", e.target.value)}
                    onFocus={e => { e.target.style.borderColor = "#7c3aed"; e.target.style.boxShadow = "0 0 0 3px rgba(124,58,237,0.1)"; }}
                    onBlur={e => { e.target.style.borderColor = "rgba(124,58,237,0.2)"; e.target.style.boxShadow = "none"; }}
                  />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  <div>
                    <label style={labelStyle}>Phone</label>
                    <input style={inp} type="tel" placeholder="+976 ···" value={form.phone} onChange={e => setField("phone", e.target.value)} />
                  </div>
                  <div>
                    <label style={labelStyle}>Website</label>
                    <input style={inp} type="url" placeholder="https://…" value={form.website} onChange={e => setField("website", e.target.value)} />
                  </div>
                </div>

                {/* Summary */}
                <div style={{ background: "#f5f0ff", border: "1px solid rgba(124,58,237,0.12)", borderRadius: "14px", padding: "20px 24px", marginTop: "8px" }}>
                  <p className="reg-sans" style={{ fontSize: "11px", fontWeight: 700, color: "#9879d4", letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 14px" }}>Summary</p>
                  {[
                    ["Club",       form.clubName  || "—"],
                    ["Category",   form.category  || "—"],
                    ["Membership", form.pricingType === "free" ? "Free" : `${form.tiers.length} paid tier${form.tiers.length > 1 ? "s" : ""}`],
                    ["Address",    form.address   || "—"],
                    ["Logo",       form.logo ? "✓ Uploaded" : "Not uploaded"],
                    ["Banners",    form.bannerPhotos.length ? `${form.bannerPhotos.length} photo${form.bannerPhotos.length > 1 ? "s" : ""}` : "None"],
                  ].map(([k, v]) => (
                    <div key={k} style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                      <span className="reg-sans" style={{ fontSize: "13px", color: "#9879d4" }}>{k}</span>
                      <span className="reg-sans" style={{ fontSize: "13px", fontWeight: 600, color: "#1a0533" }}>{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Navigation buttons */}
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "40px", paddingTop: "28px", borderTop: "1px solid rgba(124,58,237,0.08)" }}>
              <button onClick={() => setStep(s => s - 1)} disabled={step === 0} className="reg-sans" style={{ padding: "12px 24px", borderRadius: "9px", cursor: step === 0 ? "default" : "pointer", border: "1.5px solid rgba(124,58,237,0.15)", background: "none", color: step === 0 ? "#ddd" : "#555", fontWeight: 600, fontSize: "14px" }}>
                ← Back
              </button>

              {step < STEPS.length - 1 ? (
                <button onClick={() => canProceed() && setStep(s => s + 1)} className="reg-sans"
                  style={{ padding: "12px 28px", borderRadius: "9px", cursor: canProceed() ? "pointer" : "not-allowed", background: canProceed() ? "#1a0533" : "#e5e7eb", color: canProceed() ? "#fff" : "#bbb", fontWeight: 600, fontSize: "14px", border: "none" }}
                  onMouseEnter={e => { if (canProceed()) e.currentTarget.style.background = "#7c3aed"; }}
                  onMouseLeave={e => { if (canProceed()) e.currentTarget.style.background = "#1a0533"; }}
                >
                  Continue →
                </button>
              ) : (
                <button onClick={() => canProceed() && handleSubmit()} disabled={loading} className="reg-sans"
                  style={{ padding: "12px 28px", borderRadius: "9px", cursor: canProceed() && !loading ? "pointer" : "not-allowed", background: canProceed() ? "linear-gradient(135deg, #7c3aed, #4c1d95)" : "#e5e7eb", color: canProceed() ? "#fff" : "#bbb", fontWeight: 700, fontSize: "14px", border: "none", boxShadow: canProceed() ? "0 4px 16px rgba(124,58,237,0.35)" : "none" }}>
                  {loading ? "Бүртгэж байна..." : "Register Club 🚀"}
                </button>
              )}
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </div>
  );
}