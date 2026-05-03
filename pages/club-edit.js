import { useState, useEffect, useRef } from "react";
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
  .ce-fadein  { animation: ce-fadeUp 0.4s cubic-bezier(.22,1,.36,1) both; }
  .ce-section {
    background: #fff; border: 1.5px solid rgba(124,58,237,0.12);
    border-radius: 18px; padding: 36px; margin-bottom: 24px;
    box-shadow: 0 2px 16px rgba(124,58,237,0.04);
  }
  .ce-upload-btn {
    font-family:'DM Sans',sans-serif; font-size:13px; font-weight:600;
    color:#7c3aed; background:#f5f0ff;
    border:1.5px solid rgba(124,58,237,0.2); border-radius:8px;
    padding:9px 18px; cursor:pointer; transition:all 0.2s;
  }
  .ce-upload-btn:hover { background:#ede9fe; border-color:#7c3aed; }
`;

export default function ClubEditPage() {
  const router  = useRouter();
  const { id: clubId } = router.query;

  const [user,    setUser]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [error,   setError]   = useState("");
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    clubName: "", category: "", description: "", foundedYear: "",
    address: "", district: "", email: "", phone: "", website: "",
    lat: null, lng: null,
    logo: null, logoPreview: null,
    existingLogo: null,
    bannerPhotos: [], bannerPreviews: [],
    existingBanners: [],
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
          setError("Энэ клубыг засах эрх байхгүй байна.");
          setLoading(false);
          return;
        }
        const c = data.club;
        // Parse banners — handle both column names and string/array
        let existingBanners = [];
        const rawBanners = c.banner_photos || c.banner;
        if (rawBanners) {
          if (Array.isArray(rawBanners)) {
            existingBanners = rawBanners;
          } else {
            try { existingBanners = JSON.parse(rawBanners); } catch { existingBanners = []; }
          }
        }

        setForm(f => ({
          ...f,
          clubName:        c.name         || "",
          category:        c.category     || "",
          description:     c.description  || "",
          foundedYear:     c.founded_year || "",
          address:         c.address      || "",
          district:        c.district     || "",
          email:           c.email        || "",
          phone:           c.phone        || "",
          website:         c.website      || "",
          lat:             c.lat          || null,
          lng:             c.lng          || null,
          existingLogo:    c.logo         || null,
          existingBanners,
        }));
      } catch {
        setError("Серверт холбогдож чадсангүй.");
      } finally {
        setLoading(false);
      }
    }
    loadClub();
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

  function removeExistingBanner(i) {
    setForm(f => ({ ...f, existingBanners: f.existingBanners.filter((_, idx) => idx !== i) }));
  }

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

      const res  = await fetchAPI(`${API}/clubs/${clubId}`, {
        method: "PUT",
        body: fd,
        headers: { "x-user-id": String(user.id) },
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message || "Засварлахад алдаа гарлаа."); return; }
      setSuccess(true);
      setTimeout(() => router.push(`/club-owner-dashboard?clubId=${clubId}`), 1500);
    } catch {
      setError("Серверт холбогдож чадсангүй.");
    } finally {
      setSaving(false);
    }
  }

  const inp = { width:"100%", padding:"13px 16px", border:"1.5px solid rgba(124,58,237,0.2)", borderRadius:"10px", fontSize:"14px", color:"#1a0533", background:"#fdfcff", outline:"none", boxSizing:"border-box", fontFamily:"'DM Sans',sans-serif", transition:"border-color 0.2s, box-shadow 0.2s" };
  const labelStyle = { fontSize:"11px", fontWeight:700, color:"#9879d4", letterSpacing:"0.1em", textTransform:"uppercase", display:"block", marginBottom:"7px", fontFamily:"'DM Sans',sans-serif" };
  const focus = {
    onFocus: e => { e.target.style.borderColor="#7c3aed"; e.target.style.boxShadow="0 0 0 3px rgba(124,58,237,0.1)"; },
    onBlur:  e => { e.target.style.borderColor="rgba(124,58,237,0.2)"; e.target.style.boxShadow="none"; },
  };

  if (loading) return (
    <div style={{ minHeight:"100vh", background:"#fff", display:"flex", alignItems:"center", justifyContent:"center" }}>
      <style>{fonts}</style>
      <p className="ce-sans" style={{ color:"#9879d4", fontSize:"15px" }}>Ачааллаж байна...</p>
    </div>
  );

  if (error && !form.clubName) return (
    <div style={{ minHeight:"100vh", background:"#fff", display:"flex", flexDirection:"column" }}>
      <style>{fonts}</style>
      <Header />
      <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:16 }}>
        <div style={{ fontSize:"48px" }}>🔒</div>
        <p className="ce-display" style={{ fontSize:"22px", color:"#1a0533", fontWeight:800 }}>{error}</p>
        <a href="/page1" className="ce-sans" style={{ color:"#7c3aed", fontWeight:600, fontSize:"14px" }}>← Клубууд руу буцах</a>
      </div>
      <Footer />
    </div>
  );

  const totalBanners = form.existingBanners.length + form.bannerPhotos.length;

  return (
    <div style={{ minHeight:"100vh", display:"flex", flexDirection:"column", background:"#f8f6ff" }}>
      <style>{fonts}</style>
      <Header />
      <div style={{ height:"2px", background:"linear-gradient(90deg,#4c1d95,#7c3aed,#c4b5fd,#7c3aed,#4c1d95)" }}/>

      <main style={{ flex:1, padding:"48px 24px 96px" }}>
        <div style={{ maxWidth:"720px", margin:"0 auto" }}>

          <div className="ce-fadein" style={{ marginBottom:"36px" }}>
            <button onClick={() => router.push(`/club-owner-dashboard?clubId=${clubId}`)} className="ce-sans"
              style={{ display:"inline-flex", alignItems:"center", gap:"7px", fontSize:"13px", fontWeight:600, color:"#555", background:"rgba(26,5,51,0.04)", border:"1px solid rgba(26,5,51,0.1)", borderRadius:"7px", padding:"7px 14px", cursor:"pointer", marginBottom:"28px" }}
              onMouseEnter={e => { e.currentTarget.style.background="rgba(124,58,237,0.06)"; e.currentTarget.style.color="#7c3aed"; }}
              onMouseLeave={e => { e.currentTarget.style.background="rgba(26,5,51,0.04)"; e.currentTarget.style.color="#555"; }}>
              <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg>
              Back to Dashboard
            </button>
            <h1 className="ce-display" style={{ fontSize:"clamp(1.8rem,4vw,2.8rem)", fontWeight:800, color:"#1a0533", letterSpacing:"-0.04em", lineHeight:1.15, margin:"0 0 8px" }}>
              Edit <span style={{ color:"#7c3aed", fontStyle:"italic" }}>your club</span>
            </h1>
            <p className="ce-sans" style={{ color:"#888", fontSize:"14px" }}>Changes will be saved immediately.</p>
          </div>

          {error && (
            <div style={{ background:"#fef2f2", border:"1px solid rgba(239,68,68,0.2)", borderRadius:"10px", padding:"12px 16px", marginBottom:"20px", fontSize:"13px", color:"#dc2626", fontFamily:"'DM Sans',sans-serif" }}>
              {error}
            </div>
          )}

          {success && (
            <div style={{ background:"#f0fdf4", border:"1px solid rgba(34,197,94,0.2)", borderRadius:"10px", padding:"12px 16px", marginBottom:"20px", fontSize:"13px", color:"#166534", fontFamily:"'DM Sans',sans-serif", display:"flex", alignItems:"center", gap:"8px" }}>
              <svg width="14" height="14" fill="none" stroke="#22c55e" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
              Амжилттай хадгаллаа! Буцаж байна...
            </div>
          )}

          {/* Basic Info */}
          <div className="ce-section ce-fadein">
            <h2 className="ce-display" style={{ fontSize:"18px", fontWeight:800, color:"#1a0533", margin:"0 0 24px", letterSpacing:"-0.02em" }}>Basic Info</h2>
            <div style={{ display:"flex", flexDirection:"column", gap:"20px" }}>
              <div><label style={labelStyle}>Club Name *</label><input style={inp} value={form.clubName} onChange={e => setField("clubName", e.target.value)} {...focus}/></div>
              <div>
                <label style={labelStyle}>Category *</label>
                <select style={{ ...inp, appearance:"none", cursor:"pointer", backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%239879d4' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`, backgroundRepeat:"no-repeat", backgroundPosition:"right 14px center" }}
                  value={form.category} onChange={e => setField("category", e.target.value)}>
                  <option value="">Select a category…</option>
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Description *</label>
                <textarea style={{ ...inp, resize:"vertical", minHeight:"120px", lineHeight:1.65 }} value={form.description} onChange={e => setField("description", e.target.value)} {...focus}/>
                <span className="ce-sans" style={{ fontSize:"11.5px", color:"#bbb", marginTop:"4px", display:"block" }}>{form.description.length} characters</span>
              </div>
              <div><label style={labelStyle}>Founded Year</label><input style={{ ...inp, maxWidth:"180px" }} type="number" min="1900" max="2030" value={form.foundedYear} onChange={e => setField("foundedYear", e.target.value)}/></div>
            </div>
          </div>

          {/* Media */}
          <div className="ce-section ce-fadein">
            <h2 className="ce-display" style={{ fontSize:"18px", fontWeight:800, color:"#1a0533", margin:"0 0 24px", letterSpacing:"-0.02em" }}>Media</h2>
            <div style={{ marginBottom:"28px" }}>
              <label style={labelStyle}>Club Logo</label>
              <div style={{ display:"flex", alignItems:"center", gap:"20px" }}>
                <div style={{ width:"80px", height:"80px", borderRadius:"14px", background:"#f5f0ff", border:"1.5px dashed rgba(124,58,237,0.3)", display:"flex", alignItems:"center", justifyContent:"center", overflow:"hidden", flexShrink:0 }}>
                  {form.logoPreview
                    ? <img src={form.logoPreview} style={{ width:"100%", height:"100%", objectFit:"cover" }} alt="Logo"/>
                    : form.existingLogo
                      ? <img src={form.existingLogo} style={{ width:"100%", height:"100%", objectFit:"cover" }} alt="Logo"/>
                      : <svg width="24" height="24" fill="none" stroke="#c4b5fd" strokeWidth="1.5" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="4"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                  }
                </div>
                <div>
                  <button className="ce-upload-btn" onClick={() => logoRef.current.click()}>
                    {form.existingLogo || form.logoPreview ? "Change logo" : "Upload logo"}
                  </button>
                  <p className="ce-sans" style={{ fontSize:"12px", color:"#bbb", marginTop:"6px" }}>PNG or JPG, recommended 400×400px</p>
                  <input ref={logoRef} type="file" accept="image/*" style={{ display:"none" }} onChange={handleLogoUpload}/>
                </div>
              </div>
            </div>
            <div>
              <label style={labelStyle}>Banner Photos <span style={{ fontWeight:400, textTransform:"none", letterSpacing:0, color:"#bbb", marginLeft:6 }}>(up to 5)</span></label>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(130px,1fr))", gap:"10px" }}>
                {form.existingBanners.map((src, i) => (
                  <div key={`existing-${i}`} style={{ position:"relative", aspectRatio:"16/9", borderRadius:"10px", overflow:"hidden", background:"#f5f0ff" }}>
                    <img src={src} style={{ width:"100%", height:"100%", objectFit:"cover" }} alt={`Banner ${i+1}`}/>
                    <button onClick={() => removeExistingBanner(i)} style={{ position:"absolute", top:"5px", right:"5px", background:"rgba(0,0,0,0.55)", border:"none", borderRadius:"50%", width:"20px", height:"20px", cursor:"pointer", color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", padding:0 }}>
                      <svg width="9" height="9" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12"/></svg>
                    </button>
                  </div>
                ))}
                {form.bannerPreviews.map((src, i) => (
                  <div key={`new-${i}`} style={{ position:"relative", aspectRatio:"16/9", borderRadius:"10px", overflow:"hidden", background:"#f5f0ff" }}>
                    <img src={src} style={{ width:"100%", height:"100%", objectFit:"cover" }} alt={`New ${i+1}`}/>
                    <div style={{ position:"absolute", top:"5px", left:"5px", background:"rgba(124,58,237,0.7)", borderRadius:"4px", padding:"2px 6px" }}>
                      <span className="ce-sans" style={{ fontSize:"9px", color:"#fff", fontWeight:700 }}>NEW</span>
                    </div>
                    <button onClick={() => removeNewBanner(i)} style={{ position:"absolute", top:"5px", right:"5px", background:"rgba(0,0,0,0.55)", border:"none", borderRadius:"50%", width:"20px", height:"20px", cursor:"pointer", color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", padding:0 }}>
                      <svg width="9" height="9" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12"/></svg>
                    </button>
                  </div>
                ))}
                {totalBanners < 5 && (
                  <div onClick={() => bannerRef.current.click()} style={{ aspectRatio:"16/9", borderRadius:"10px", background:"#fdfcff", border:"1.5px dashed rgba(124,58,237,0.25)", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", cursor:"pointer", gap:"5px" }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor="#7c3aed"; e.currentTarget.style.background="#f5f0ff"; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor="rgba(124,58,237,0.25)"; e.currentTarget.style.background="#fdfcff"; }}>
                    <svg width="18" height="18" fill="none" stroke="#c4b5fd" strokeWidth="1.5" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                    <span className="ce-sans" style={{ fontSize:"10px", color:"#c4b5fd", fontWeight:600 }}>Add photo</span>
                  </div>
                )}
              </div>
              <input ref={bannerRef} type="file" accept="image/*" multiple style={{ display:"none" }} onChange={handleBannerUpload}/>
            </div>
          </div>

          {/* Location & Contact */}
          <div className="ce-section ce-fadein">
            <h2 className="ce-display" style={{ fontSize:"18px", fontWeight:800, color:"#1a0533", margin:"0 0 24px", letterSpacing:"-0.02em" }}>Location & Contact</h2>
            <div style={{ display:"flex", flexDirection:"column", gap:"20px" }}>
              <div><label style={labelStyle}>Street Address *</label><input style={inp} value={form.address} onChange={e => setField("address", e.target.value)} {...focus}/></div>
              <div>
                <label style={labelStyle}>District</label>
                <select style={{ ...inp, appearance:"none", cursor:"pointer", backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%239879d4' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`, backgroundRepeat:"no-repeat", backgroundPosition:"right 14px center" }}
                  value={form.district} onChange={e => setField("district", e.target.value)}>
                  <option value="">Select district…</option>
                  {DISTRICTS.map(d => <option key={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Map Pin <span style={{ fontWeight:400, textTransform:"none", letterSpacing:0, color:"#bbb", marginLeft:6 }}>— click to update</span></label>
                <div style={{ background: form.lat ? "#f0fdf4" : "#f5f0ff", border:`1px solid ${form.lat ? "rgba(34,197,94,0.25)" : "rgba(124,58,237,0.15)"}`, borderRadius:"10px", padding:"10px 14px", marginBottom:"10px", display:"flex", alignItems:"center", gap:"8px" }}>
                  {form.lat ? (
                    <>
                      <svg width="14" height="14" fill="none" stroke="#22c55e" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
                      <span className="ce-sans" style={{ fontSize:"12.5px", color:"#166534" }}>📍 {form.lat.toFixed(4)}, {form.lng.toFixed(4)}</span>
                      <button onClick={() => setForm(f => ({ ...f, lat:null, lng:null }))} className="ce-sans" style={{ marginLeft:"auto", background:"none", border:"none", cursor:"pointer", color:"#dc2626", fontSize:"12px", fontWeight:600 }}>Remove</button>
                    </>
                  ) : (
                    <>
                      <svg width="14" height="14" fill="none" stroke="#7c3aed" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                      <span className="ce-sans" style={{ fontSize:"12.5px", color:"#7c3aed" }}>Tap the map to set a pin.</span>
                    </>
                  )}
                </div>
                <div style={{ borderRadius:"14px", overflow:"hidden", border:"1.5px solid rgba(124,58,237,0.18)" }}>
                  <MapPicker pickMode={true} onPick={handleMapPick} pickedLat={form.lat} pickedLng={form.lng} height="280px"/>
                </div>
              </div>
              <div style={{ height:"1px", background:"rgba(124,58,237,0.08)" }}/>
              <div><label style={labelStyle}>Contact Email *</label><input style={inp} type="email" value={form.email} onChange={e => setField("email", e.target.value)} {...focus}/></div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"16px" }}>
                <div><label style={labelStyle}>Phone</label><input style={inp} type="tel" value={form.phone} onChange={e => setField("phone", e.target.value)}/></div>
                <div><label style={labelStyle}>Website</label><input style={inp} type="url" value={form.website} onChange={e => setField("website", e.target.value)}/></div>
              </div>
            </div>
          </div>

          <div className="ce-fadein" style={{ display:"flex", justifyContent:"flex-end", gap:"12px" }}>
            <button onClick={() => router.push(`/club-owner-dashboard?clubId=${clubId}`)} className="ce-sans"
              style={{ padding:"13px 28px", borderRadius:"10px", border:"1.5px solid rgba(124,58,237,0.2)", background:"none", color:"#7c3aed", fontWeight:600, fontSize:"14px", cursor:"pointer" }}>
              Cancel
            </button>
            <button onClick={handleSave} disabled={saving} className="ce-sans"
              style={{ padding:"13px 32px", borderRadius:"10px", background:"linear-gradient(135deg,#7c3aed,#4c1d95)", border:"none", color:"#fff", fontWeight:700, fontSize:"14px", cursor:saving?"not-allowed":"pointer", opacity:saving?0.7:1, boxShadow:"0 4px 16px rgba(124,58,237,0.35)" }}>
              {saving ? "Хадгалж байна..." : "Save Changes ✓"}
            </button>
          </div>

        </div>
      </main>
      <Footer />
    </div>
  );
}