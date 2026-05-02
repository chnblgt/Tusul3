import { useState, useRef } from "react";
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

// Payment step only appears for paid clubs
const ALL_STEPS = ["Basic Info", "Media", "Pricing", "Payment", "Location & Contact"];

// Mongolian banks
const MN_BANKS = [
  "Хаан банк", "Голомт банк", "Хас банк", "Төрийн банк",
  "Тээвэр хөгжлийн банк", "Капитал банк", "Ариг банк", "Богд банк",
  "Карго банк", "М банк",
];

// Preset belt colors — clubs can also add custom ranks
const PRESET_DANS = [
  { label: "White",  color: "#f8f8f8", border: "#ddd" },
  { label: "Yellow", color: "#fef08a", border: "#ca8a04" },
  { label: "Orange", color: "#fdba74", border: "#ea580c" },
  { label: "Green",  color: "#86efac", border: "#16a34a" },
  { label: "Blue",   color: "#93c5fd", border: "#2563eb" },
  { label: "Purple", color: "#c4b5fd", border: "#7c3aed" },
  { label: "Brown",  color: "#a78966", border: "#78350f" },
  { label: "Red",    color: "#fca5a5", border: "#dc2626" },
  { label: "Black",  color: "#1a0533", border: "#000" },
];

const fonts = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,700;0,9..144,800;1,9..144,700&family=DM+Sans:wght@400;500;600;700&display=swap');
  .reg-display { font-family: 'Fraunces', serif; }
  .reg-sans { font-family: 'DM Sans', sans-serif; }

  @keyframes reg-fadeUp  { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:none} }
  @keyframes reg-pop     { 0%{opacity:0;transform:scale(.7)} 65%{transform:scale(1.05)} 100%{opacity:1;transform:scale(1)} }
  @keyframes reg-ripple  { 0%{transform:scale(1);opacity:.4} 100%{transform:scale(2.8);opacity:0} }
  @keyframes reg-check   { from{stroke-dashoffset:50;opacity:0} to{stroke-dashoffset:0;opacity:1} }
  @keyframes reg-confetti{
    0%{transform:translateY(-10px) rotate(0deg);opacity:1}
    100%{transform:translateY(280px) rotate(540deg);opacity:0}
  }

  .reg-success-card {
    background:rgba(255,255,255,0.97);
    backdrop-filter:blur(24px);
    border:1.5px solid rgba(124,58,237,0.1);
    border-radius:28px;
    padding:56px 52px 52px;
    box-shadow:0 32px 80px rgba(124,58,237,0.12),0 4px 20px rgba(26,5,51,0.05);
    text-align:center;
    position:relative;
    overflow:hidden;
  }
  .reg-success-card::before {
    content:'';position:absolute;top:0;left:15%;right:15%;height:1px;
    background:linear-gradient(90deg,transparent,rgba(124,58,237,0.25),transparent);
  }
  .reg-btn-primary {
    display:inline-flex;align-items:center;justify-content:center;gap:8px;
    padding:15px 36px;background:linear-gradient(135deg,#7c3aed,#4c1d95);
    color:#fff;border-radius:14px;text-decoration:none;font-weight:700;
    font-size:14.5px;font-family:'DM Sans',sans-serif;
    box-shadow:0 8px 28px rgba(124,58,237,0.38);
    transition:transform .18s,box-shadow .18s;border:none;cursor:pointer;
  }
  .reg-btn-primary:hover{transform:translateY(-2px);box-shadow:0 12px 36px rgba(124,58,237,.52);}
  .reg-btn-ghost {
    display:inline-flex;align-items:center;justify-content:center;gap:6px;
    padding:13px 28px;background:transparent;color:#7c3aed;border-radius:12px;
    text-decoration:none;font-weight:600;font-size:13.5px;
    font-family:'DM Sans',sans-serif;border:1.5px solid rgba(124,58,237,0.2);
    transition:background .18s,border-color .18s,transform .18s;
  }
  .reg-btn-ghost:hover{background:rgba(124,58,237,.06);border-color:rgba(124,58,237,.4);transform:translateY(-1px);}
`;

const extraStyles = `
  .reg-back {
    display:inline-flex;align-items:center;gap:7px;
    font-family:'DM Sans',sans-serif;font-size:13px;font-weight:600;
    color:#555;background:rgba(26,5,51,0.04);
    border:1px solid rgba(26,5,51,0.1);border-radius:7px;
    padding:7px 14px;cursor:pointer;text-decoration:none;
    transition:background 0.2s,color 0.2s;line-height:1;margin-bottom:32px;
  }
  .reg-back:hover{background:rgba(124,58,237,.06);color:#7c3aed;border-color:rgba(124,58,237,.2);}
  .reg-upload-btn {
    font-family:'DM Sans',sans-serif;font-size:13px;font-weight:600;
    color:#7c3aed;background:#f5f0ff;
    border:1.5px solid rgba(124,58,237,0.2);border-radius:8px;
    padding:9px 18px;cursor:pointer;transition:all 0.2s;
  }
  .reg-upload-btn:hover{background:#ede9fe;border-color:#7c3aed;}
  .dan-chip {
    display:inline-flex;align-items:center;gap:6px;
    padding:6px 12px;border-radius:999px;font-size:12.5px;font-weight:600;
    font-family:'DM Sans',sans-serif;cursor:pointer;transition:all 0.15s;
    border:1.5px solid transparent;
  }
  .dan-chip:hover{transform:translateY(-1px);box-shadow:0 3px 10px rgba(0,0,0,0.1);}
  .payment-tab {
    flex:1;padding:13px;border-radius:10px;cursor:pointer;
    font-family:'DM Sans',sans-serif;font-size:13.5px;font-weight:700;
    transition:all 0.2s;display:flex;align-items:center;justify-content:center;gap:8px;
  }
`;

function Confetti() {
  const items = Array.from({ length: 22 }, (_, i) => ({
    color: ["#7c3aed","#a78bfa","#c4b5fd","#22c55e","#fbbf24","#ec4899","#38bdf8"][i % 7],
    left: `${5 + (i * 4.4) % 90}%`,
    delay: `${(i * 0.07).toFixed(2)}s`,
    dur: `${0.7 + (i % 5) * 0.14}s`,
    size: i % 3 === 0 ? 9 : 6,
    circle: i % 4 === 0,
  }));
  return (
    <div style={{ position:"absolute", top:0, left:0, right:0, height:"260px", overflow:"hidden", pointerEvents:"none", zIndex:0 }}>
      {items.map((p, i) => (
        <div key={i} style={{ position:"absolute", top:"-10px", left:p.left, width:`${p.size}px`, height:`${p.circle ? p.size : p.size * 1.7}px`, borderRadius: p.circle ? "50%" : "2px", background: p.color, animation:`reg-confetti ${p.dur} ${p.delay} ease-in both` }}/>
      ))}
    </div>
  );
}

function SubmittedPage({ clubName }) {
  const steps = [
    { done:true,  label:"Клуб бүртгэгдлээ",   sub:"Таны мэдээлэл хүлээн авлаа" },
    { done:true,  label:"Имэйл илгээлээ",       sub:"Баталгаажуулах линк очсон байна" },
    { done:false, label:"Admin хянаж байна",     sub:"Ихэвчлэн 24 цагийн дотор" },
    { done:false, label:"Клуб нийтлэгдэнэ",      sub:"Browse хуудсанд харагдана" },
  ];
  return (
    <div style={{ minHeight:"100vh", display:"flex", flexDirection:"column", background:"radial-gradient(ellipse at 20% 20%, #ede9fe 0%, #f5f0ff 30%, #faf8ff 60%, #ffffff 100%)" }}>
      <style>{fonts}</style>
      <div style={{ height:3, background:"linear-gradient(90deg,#4c1d95,#7c3aed,#c4b5fd,#7c3aed,#4c1d95)" }}/>
      <nav style={{ padding:"20px 36px" }}>
        <a href="/page" style={{ display:"inline-flex", alignItems:"center", gap:10, textDecoration:"none" }}>
          <div style={{ width:32, height:32, borderRadius:10, background:"linear-gradient(135deg,#1a0533,#3b0764)", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <span style={{ color:"#c4b5fd", fontWeight:800, fontSize:15, fontFamily:"'Fraunces',serif" }}>D</span>
          </div>
          <span className="reg-display" style={{ fontSize:19, color:"#1a0533" }}>Duguilan<span style={{ color:"#7c3aed" }}>.mn</span></span>
        </a>
      </nav>
      <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", padding:"16px 16px 72px" }}>
        <div style={{ width:"100%", maxWidth:520, animation:"reg-fadeUp .5s cubic-bezier(.22,1,.36,1) both" }}>
          <div className="reg-success-card">
            <Confetti/>
            <div style={{ position:"relative", width:88, height:88, margin:"0 auto 28px", zIndex:1 }}>
              {[0,1].map(i => (
                <div key={i} style={{ position:"absolute", inset:0, borderRadius:"50%", border:"2px solid rgba(34,197,94,0.22)", animation:`reg-ripple 2.2s ${i*0.6}s ease-out infinite` }}/>
              ))}
              <div style={{ position:"absolute", inset:0, borderRadius:"24px", background:"linear-gradient(145deg,#dcfce7,#bbf7d0)", border:"2px solid rgba(34,197,94,0.2)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                <svg width="38" height="38" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <polyline points="20 6 9 17 4 12" style={{ strokeDasharray:50, animation:"reg-check .6s .3s cubic-bezier(.22,1,.36,1) both" }}/>
                </svg>
              </div>
            </div>
            <div style={{ position:"relative", zIndex:1 }}>
              <h1 className="reg-display" style={{ fontSize:28, fontWeight:800, color:"#1a0533", letterSpacing:"-0.03em", lineHeight:1.2, margin:"0 0 10px" }}>Клуб бүртгэгдлээ! 🎉</h1>
              <p className="reg-sans" style={{ fontSize:15, color:"#555", lineHeight:1.8, margin:"0 0 6px" }}>
                <strong style={{ color:"#1a0533" }}>{clubName}</strong> амжилттай бүртгэгдлээ.
              </p>
              <p className="reg-sans" style={{ fontSize:13.5, color:"#9879d4", lineHeight:1.7, margin:"0 0 32px" }}>
                Имэйл хаяг руу баталгаажуулах линк илгээлээ.
              </p>
              <div style={{ background:"linear-gradient(135deg,#fdfcff,#f8f4ff)", border:"1.5px solid rgba(124,58,237,0.1)", borderRadius:18, padding:"22px 24px", marginBottom:32, textAlign:"left" }}>
                <p className="reg-sans" style={{ fontSize:10, fontWeight:800, color:"#9879d4", letterSpacing:".12em", textTransform:"uppercase", margin:"0 0 18px" }}>Клубийн явц</p>
                {steps.map((s, i) => (
                  <div key={i} style={{ display:"flex", gap:14, alignItems:"flex-start", paddingBottom: i < steps.length-1 ? 16 : 0 }}>
                    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", flexShrink:0 }}>
                      <div style={{ width:28, height:28, borderRadius:"50%", background: s.done ? "linear-gradient(135deg,#22c55e,#16a34a)" : "rgba(124,58,237,0.06)", border:`1.5px solid ${s.done ? "#22c55e" : "rgba(124,58,237,0.14)"}`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                        {s.done ? <svg width="11" height="11" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
                          : <span className="reg-sans" style={{ fontSize:10, fontWeight:700, color:"#c4b5fd" }}>{i+1}</span>}
                      </div>
                      {i < steps.length-1 && <div style={{ width:2, height:18, marginTop:4, background: s.done ? "linear-gradient(to bottom,#22c55e,rgba(124,58,237,0.1))" : "rgba(124,58,237,0.1)" }}/>}
                    </div>
                    <div style={{ paddingTop:3 }}>
                      <p className="reg-sans" style={{ fontSize:13, fontWeight:700, color: s.done ? "#1a0533" : "#9879d4", margin:"0 0 2px" }}>{s.label}</p>
                      <p className="reg-sans" style={{ fontSize:11.5, color:"#bbb", lineHeight:1.5, margin:0 }}>{s.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:12, alignItems:"center" }}>
                <a href="/page1" className="reg-btn-primary" style={{ width:"100%", maxWidth:300 }}>Browse clubs →</a>
                <a href="/page" className="reg-btn-ghost" style={{ width:"100%", maxWidth:300 }}>← Нүүр хуудас руу буцах</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ClubRegisterPage() {
  const [step, setStep]           = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState("");

  const [form, setForm] = useState({
    // Step 0
    clubName: "", category: "", description: "", foundedYear: "",
    // Step 1
    logo: null, logoPreview: null, bannerPhotos: [], bannerPreviews: [],
    // Step 2
    pricingType: "free",
    tiers: [{ name: "Basic", price: "", period: "monthly", description: "", features: "" }],
    // Step 3 — Payment (paid clubs only)
    dans: [],           // [{ label, color, price }]
    customDan: "",
    paymentMethod: "qpay",          // "qpay" | "bank" | "both"
    qpayMerchantId: "",
    bankName: "", bankAccount: "", bankAccountName: "",
    // Step 4 — Location
    address: "", district: "", email: "", phone: "", website: "",
    lat: null, lng: null,
  });

  const logoRef   = useRef();
  const bannerRef = useRef();

  function setField(key, value) { setForm(f => ({ ...f, [key]: value })); }

  // Dans helpers
  function togglePresetDan(preset) {
    setForm(f => {
      const exists = f.dans.find(d => d.label === preset.label);
      if (exists) return { ...f, dans: f.dans.filter(d => d.label !== preset.label) };
      return { ...f, dans: [...f.dans, { label: preset.label, color: preset.color, price: "" }] };
    });
  }
  function addCustomDan() {
    const label = form.customDan.trim();
    if (!label || form.dans.find(d => d.label === label)) return;
    setForm(f => ({ ...f, dans: [...f.dans, { label, color: "#e5e7eb", price: "" }], customDan: "" }));
  }
  function removeDan(label) { setForm(f => ({ ...f, dans: f.dans.filter(d => d.label !== label) })); }
  function setDanPrice(label, price) { setForm(f => ({ ...f, dans: f.dans.map(d => d.label === label ? { ...d, price } : d) })); }

  // Media helpers
  function handleLogoUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    setForm(f => ({ ...f, logo: file, logoPreview: URL.createObjectURL(file) }));
  }
  function handleBannerUpload(e) {
    const files = Array.from(e.target.files);
    const newPreviews = files.map(f => URL.createObjectURL(f));
    setForm(f => ({ ...f, bannerPhotos: [...f.bannerPhotos, ...files].slice(0, 5), bannerPreviews: [...f.bannerPreviews, ...newPreviews].slice(0, 5) }));
  }
  function removeBanner(i) {
    setForm(f => ({ ...f, bannerPhotos: f.bannerPhotos.filter((_, idx) => idx !== i), bannerPreviews: f.bannerPreviews.filter((_, idx) => idx !== i) }));
  }

  // Tier helpers
  function addTier() { setForm(f => ({ ...f, tiers: [...f.tiers, { name: "", price: "", period: "monthly", description: "", features: "" }] })); }
  function removeTier(i) { setForm(f => ({ ...f, tiers: f.tiers.filter((_, idx) => idx !== i) })); }
  function setTierField(i, key, value) { setForm(f => ({ ...f, tiers: f.tiers.map((t, idx) => idx === i ? { ...t, [key]: value } : t) })); }

  function handleMapPick(lat, lng) { setForm(f => ({ ...f, lat, lng })); }

  // Skip Payment step for free clubs
  const STEPS = form.pricingType === "paid" ? ALL_STEPS : ALL_STEPS.filter(s => s !== "Payment");

  function canProceed() {
    const s = STEPS[step];
    if (s === "Basic Info")  return form.clubName.trim() && form.category && form.description.trim();
    if (s === "Media")       return true;
    if (s === "Pricing")     return form.pricingType === "free" || form.tiers.every(t => t.name && t.price);
    if (s === "Payment") {
      const hasQpay = form.qpayMerchantId.trim();
      const hasBank = form.bankName && form.bankAccount.trim() && form.bankAccountName.trim();
      if (form.paymentMethod === "qpay") return !!hasQpay;
      if (form.paymentMethod === "bank") return !!hasBank;
      if (form.paymentMethod === "both") return !!(hasQpay && hasBank);
    }
    if (s === "Location & Contact") return form.email.trim() && form.address.trim();
    return true;
  }

  async function handleSubmit() {
    setError(""); setLoading(true);
    try {
      const fd = new FormData();
      fd.append("name", form.clubName); fd.append("category", form.category);
      fd.append("description", form.description); fd.append("email", form.email);
      fd.append("address", form.address); fd.append("district", form.district);
      fd.append("pricingType", form.pricingType);
      if (form.foundedYear) fd.append("foundedYear", form.foundedYear);
      if (form.phone)       fd.append("phone", form.phone);
      if (form.website)     fd.append("website", form.website);
      if (form.logo)        fd.append("logo", form.logo);
      if (form.lat != null) fd.append("lat", form.lat);
      if (form.lng != null) fd.append("lng", form.lng);
      form.bannerPhotos.forEach(file => fd.append("bannerPhotos", file));
      if (form.pricingType === "paid") {
        if (form.tiers.length)      fd.append("tiers", JSON.stringify(form.tiers));
        if (form.dans.length)       fd.append("dans",  JSON.stringify(form.dans));
        fd.append("paymentMethod",  form.paymentMethod);
        if (form.qpayMerchantId)    fd.append("qpayMerchantId",  form.qpayMerchantId);
        if (form.bankName)          fd.append("bankName",         form.bankName);
        if (form.bankAccount)       fd.append("bankAccount",      form.bankAccount);
        if (form.bankAccountName)   fd.append("bankAccountName",  form.bankAccountName);
      }
      const response = await fetchAPI(`${API}/registerClub`, { method: "POST", body: fd });
      const result   = await response.json();
      if (!response.ok) { setError(result.message || "Клуб бүртгэхэд алдаа гарлаа"); return; }
      setSubmitted(true);
    } catch {
      setError("Сервертэй холбогдож чадсангүй. Backend ажиллаж байгаа эсэхийг шалгана уу.");
    } finally { setLoading(false); }
  }

  if (submitted) return <SubmittedPage clubName={form.clubName} />;

  const inp = { width:"100%", padding:"13px 16px", border:"1.5px solid rgba(124,58,237,0.2)", borderRadius:"10px", fontSize:"14px", color:"#1a0533", background:"#fdfcff", outline:"none", boxSizing:"border-box", fontFamily:"'DM Sans', sans-serif", transition:"border-color 0.2s, box-shadow 0.2s" };
  const labelStyle = { fontSize:"11px", fontWeight:700, color:"#9879d4", letterSpacing:"0.1em", textTransform:"uppercase", display:"block", marginBottom:"7px", fontFamily:"'DM Sans', sans-serif" };
  const focusHandlers = {
    onFocus: e => { e.target.style.borderColor="#7c3aed"; e.target.style.boxShadow="0 0 0 3px rgba(124,58,237,0.1)"; },
    onBlur:  e => { e.target.style.borderColor="rgba(124,58,237,0.2)"; e.target.style.boxShadow="none"; },
  };
  const stepName = STEPS[step];

  return (
    <div style={{ minHeight:"100vh", display:"flex", flexDirection:"column", background:"#fff" }}>
      <style>{fonts + extraStyles}</style>
      <Header />
      <main style={{ flex:1, padding:"56px 24px 96px" }}>
        <div style={{ maxWidth:"720px", margin:"0 auto" }}>

          <div style={{ marginBottom:"48px" }}>
            <a href="/page" className="reg-back">
              <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg>
              Back
            </a>
            <h1 className="reg-display" style={{ fontSize:"clamp(2rem, 5vw, 3.2rem)", fontWeight:800, color:"#1a0533", letterSpacing:"-0.04em", lineHeight:1.15, margin:"0 0 10px" }}>
              Register your <span style={{ color:"#7c3aed", fontStyle:"italic" }}>club</span>
            </h1>
            <p className="reg-sans" style={{ color:"#888", fontSize:"15px", lineHeight:1.7 }}>Fill in the details below. Your club will appear on the browse page after admin approval.</p>
          </div>

          {/* Step indicator */}
          <div style={{ display:"flex", marginBottom:"48px" }}>
            {STEPS.map((s, i) => (
              <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", position:"relative" }}>
                {i < STEPS.length-1 && <div style={{ position:"absolute", top:"17px", left:"50%", right:"-50%", height:"2px", background: i < step ? "#7c3aed" : "rgba(124,58,237,0.12)", transition:"background 0.3s", zIndex:0 }}/>}
                <div style={{ width:"34px", height:"34px", borderRadius:"50%", zIndex:1, display:"flex", alignItems:"center", justifyContent:"center", background: i < step ? "#7c3aed" : i === step ? "#1a0533" : "#fff", border:`2px solid ${i <= step ? (i < step ? "#7c3aed" : "#1a0533") : "rgba(124,58,237,0.2)"}`, color: i <= step ? "#fff" : "#bbb", fontSize:"12px", fontWeight:700, fontFamily:"'DM Sans', sans-serif" }}>
                  {i < step ? <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg> : i+1}
                </div>
                <span className="reg-sans" style={{ fontSize:"10px", fontWeight:600, marginTop:"8px", color: i === step ? "#1a0533" : i < step ? "#7c3aed" : "#bbb", textAlign:"center" }}>{s}</span>
              </div>
            ))}
          </div>

          {error && <div style={{ background:"#fef2f2", border:"1px solid rgba(239,68,68,0.2)", borderRadius:"10px", padding:"12px 16px", marginBottom:"24px", fontSize:"13px", color:"#dc2626", fontFamily:"'DM Sans', sans-serif" }}>{error}</div>}

          <div style={{ background:"#fff", border:"1.5px solid rgba(124,58,237,0.12)", borderRadius:"20px", padding:"48px", boxShadow:"0 4px 32px rgba(124,58,237,0.06)" }}>

            {/* ── STEP: Basic Info ── */}
            {stepName === "Basic Info" && (
              <div style={{ display:"flex", flexDirection:"column", gap:"24px" }}>
                <div><label style={labelStyle}>Club Name *</label><input style={inp} placeholder="e.g. Ulaanbaatar FC" value={form.clubName} onChange={e => setField("clubName", e.target.value)} {...focusHandlers}/></div>
                <div>
                  <label style={labelStyle}>Category *</label>
                  <select style={{ ...inp, appearance:"none", cursor:"pointer", backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%239879d4' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`, backgroundRepeat:"no-repeat", backgroundPosition:"right 14px center" }} value={form.category} onChange={e => setField("category", e.target.value)}>
                    <option value="">Select a category…</option>
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Description *</label>
                  <textarea style={{ ...inp, resize:"vertical", lineHeight:1.65, minHeight:"120px" }} placeholder="Tell people what your club is about…" value={form.description} onChange={e => setField("description", e.target.value)} {...focusHandlers}/>
                  <span className="reg-sans" style={{ fontSize:"11.5px", color:"#bbb", marginTop:"5px", display:"block" }}>{form.description.length} characters</span>
                </div>
                <div><label style={labelStyle}>Founded Year</label><input style={{ ...inp, maxWidth:"180px" }} placeholder="e.g. 2019" type="number" min="1900" max="2030" value={form.foundedYear} onChange={e => setField("foundedYear", e.target.value)}/></div>
              </div>
            )}

            {/* ── STEP: Media ── */}
            {stepName === "Media" && (
              <div style={{ display:"flex", flexDirection:"column", gap:"32px" }}>
                <div>
                  <label style={labelStyle}>Club Logo</label>
                  <div style={{ display:"flex", alignItems:"center", gap:"20px" }}>
                    <div style={{ width:"90px", height:"90px", borderRadius:"16px", background:"#f5f0ff", border:"1.5px dashed rgba(124,58,237,0.3)", display:"flex", alignItems:"center", justifyContent:"center", overflow:"hidden", flexShrink:0 }}>
                      {form.logoPreview ? <img src={form.logoPreview} style={{ width:"100%", height:"100%", objectFit:"cover" }} alt="Logo"/> : <svg width="28" height="28" fill="none" stroke="#c4b5fd" strokeWidth="1.5" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="4"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>}
                    </div>
                    <div>
                      <button className="reg-upload-btn" onClick={() => logoRef.current.click()}>{form.logoPreview ? "Change logo" : "Upload logo"}</button>
                      <p className="reg-sans" style={{ fontSize:"12px", color:"#bbb", marginTop:"6px" }}>PNG or JPG, recommended 400×400px</p>
                      <input ref={logoRef} type="file" accept="image/*" style={{ display:"none" }} onChange={handleLogoUpload}/>
                    </div>
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>Banner Photos <span style={{ color:"#bbb", fontWeight:400, textTransform:"none", letterSpacing:0 }}>(up to 5)</span></label>
                  <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(140px, 1fr))", gap:"12px" }}>
                    {form.bannerPreviews.map((src, i) => (
                      <div key={i} style={{ position:"relative", aspectRatio:"16/9", borderRadius:"10px", overflow:"hidden", background:"#f5f0ff" }}>
                        <img src={src} style={{ width:"100%", height:"100%", objectFit:"cover" }} alt={`Banner ${i+1}`}/>
                        <button onClick={() => removeBanner(i)} style={{ position:"absolute", top:"6px", right:"6px", background:"rgba(0,0,0,0.5)", border:"none", borderRadius:"50%", width:"22px", height:"22px", cursor:"pointer", color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", padding:0 }}>
                          <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12"/></svg>
                        </button>
                      </div>
                    ))}
                    {form.bannerPreviews.length < 5 && (
                      <div onClick={() => bannerRef.current.click()} style={{ aspectRatio:"16/9", borderRadius:"10px", background:"#fdfcff", border:"1.5px dashed rgba(124,58,237,0.25)", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", cursor:"pointer", gap:"6px" }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor="#7c3aed"; e.currentTarget.style.background="#f5f0ff"; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor="rgba(124,58,237,0.25)"; e.currentTarget.style.background="#fdfcff"; }}>
                        <svg width="20" height="20" fill="none" stroke="#c4b5fd" strokeWidth="1.5" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                        <span className="reg-sans" style={{ fontSize:"11px", color:"#c4b5fd", fontWeight:600 }}>Add photo</span>
                      </div>
                    )}
                  </div>
                  <input ref={bannerRef} type="file" accept="image/*" multiple style={{ display:"none" }} onChange={handleBannerUpload}/>
                </div>
              </div>
            )}

            {/* ── STEP: Pricing ── */}
            {stepName === "Pricing" && (
              <div style={{ display:"flex", flexDirection:"column", gap:"28px" }}>
                <div>
                  <label style={labelStyle}>Membership Type</label>
                  <div style={{ display:"flex", gap:"12px" }}>
                    {["free","paid"].map(type => (
                      <button key={type} onClick={() => setField("pricingType", type)} className="reg-sans"
                        style={{ flex:1, padding:"14px", borderRadius:"10px", cursor:"pointer", border:`1.5px solid ${form.pricingType===type?"#7c3aed":"rgba(124,58,237,0.15)"}`, background:form.pricingType===type?"#f5f0ff":"#fff", color:form.pricingType===type?"#7c3aed":"#888", fontWeight:700, fontSize:"14px", transition:"all 0.2s" }}>
                        {type==="free"?"🆓 Free to join":"💳 Paid membership"}
                      </button>
                    ))}
                  </div>
                </div>
                {form.pricingType==="paid" && (
                  <div style={{ display:"flex", flexDirection:"column", gap:"16px" }}>
                    {form.tiers.map((tier, i) => (
                      <div key={i} style={{ border:"1.5px solid rgba(124,58,237,0.12)", borderRadius:"14px", padding:"24px", background:"#fdfcff" }}>
                        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"18px" }}>
                          <span className="reg-sans" style={{ fontSize:"12px", fontWeight:700, color:"#9879d4", letterSpacing:"0.08em", textTransform:"uppercase" }}>Tier {i+1}</span>
                          {form.tiers.length>1 && <button onClick={() => removeTier(i)} className="reg-sans" style={{ background:"none", border:"none", cursor:"pointer", color:"#f87171", fontSize:"12px", fontWeight:600 }}>Remove</button>}
                        </div>
                        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:"14px" }}>
                          <div><label style={labelStyle}>Tier Name *</label><input style={inp} placeholder="e.g. Basic" value={tier.name} onChange={e => setTierField(i,"name",e.target.value)}/></div>
                          <div><label style={labelStyle}>Price (₮) *</label><input style={inp} placeholder="e.g. 15000" type="number" value={tier.price} onChange={e => setTierField(i,"price",e.target.value)}/></div>
                          <div>
                            <label style={labelStyle}>Period</label>
                            <select style={{ ...inp, appearance:"none", cursor:"pointer" }} value={tier.period} onChange={e => setTierField(i,"period",e.target.value)}>
                              <option value="monthly">Monthly</option><option value="quarterly">Quarterly</option><option value="yearly">Yearly</option><option value="once">One-time</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    ))}
                    {form.tiers.length<4 && (
                      <button onClick={addTier} className="reg-sans" style={{ border:"1.5px dashed rgba(124,58,237,0.25)", borderRadius:"12px", padding:"16px", background:"none", cursor:"pointer", color:"#9879d4", fontWeight:600, fontSize:"13.5px", display:"flex", alignItems:"center", justifyContent:"center", gap:"8px" }}>
                        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                        Add another tier
                      </button>
                    )}
                  </div>
                )}
                {form.pricingType==="free" && (
                  <div style={{ background:"#f0fdf4", border:"1px solid rgba(34,197,94,0.2)", borderRadius:"12px", padding:"20px 24px", display:"flex", alignItems:"center", gap:"14px" }}>
                    <div style={{ width:"36px", height:"36px", borderRadius:"10px", background:"#dcfce7", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                      <svg width="18" height="18" fill="none" stroke="#22c55e" strokeWidth="2" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
                    </div>
                    <p className="reg-sans" style={{ fontSize:"13.5px", color:"#166534", margin:0, lineHeight:1.6 }}>Your club is free to join — no membership fees.</p>
                  </div>
                )}
              </div>
            )}

            {/* ── STEP: Payment (paid clubs only) ── */}
            {stepName === "Payment" && (
              <div style={{ display:"flex", flexDirection:"column", gap:"32px" }}>

                {/* Dans / Belt Ranks */}
                <div>
                  <label style={labelStyle}>
                    Dans / Belt Ranks
                    <span style={{ fontWeight:400, textTransform:"none", letterSpacing:0, color:"#bbb", marginLeft:6 }}>— optional</span>
                  </label>
                  <p className="reg-sans" style={{ fontSize:"12.5px", color:"#9879d4", marginBottom:"14px", lineHeight:1.6 }}>
                    Click a belt to add it to your club. You can also type a custom rank. Each dan can have its own upgrade fee.
                  </p>

                  {/* Preset belt chips */}
                  <div style={{ display:"flex", flexWrap:"wrap", gap:"8px", marginBottom:"16px" }}>
                    {PRESET_DANS.map(p => {
                      const active = !!form.dans.find(d => d.label === p.label);
                      return (
                        <button key={p.label} className="dan-chip" onClick={() => togglePresetDan(p)}
                          style={{ background: active ? p.color : "#f9f9f9", borderColor: active ? p.border : "#e5e7eb", color: p.label==="Black" ? (active?"#fff":"#1a0533") : "#1a0533", boxShadow: active ? `0 2px 8px ${p.border}55` : "none" }}>
                          <span style={{ width:10, height:10, borderRadius:"50%", background:p.color, border:`1.5px solid ${p.border}`, display:"inline-block", flexShrink:0 }}/>
                          {p.label}
                          {active && <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>}
                        </button>
                      );
                    })}
                  </div>

                  {/* Custom dan */}
                  <div style={{ display:"flex", gap:"10px", marginBottom:"20px" }}>
                    <input style={{ ...inp, flex:1 }} placeholder="Custom rank e.g. 1st Kyu, Beginner…"
                      value={form.customDan} onChange={e => setField("customDan", e.target.value)}
                      onKeyDown={e => e.key==="Enter" && addCustomDan()} {...focusHandlers}/>
                    <button onClick={addCustomDan} className="reg-sans"
                      style={{ padding:"0 20px", borderRadius:"10px", background:"#7c3aed", color:"#fff", border:"none", cursor:"pointer", fontWeight:700, fontSize:"13px", whiteSpace:"nowrap" }}>
                      + Add
                    </button>
                  </div>

                  {/* Dan list with prices */}
                  {form.dans.length > 0 ? (
                    <div style={{ display:"flex", flexDirection:"column", gap:"10px" }}>
                      <p className="reg-sans" style={{ fontSize:"11px", fontWeight:700, color:"#9879d4", letterSpacing:"0.08em", textTransform:"uppercase", margin:0 }}>Upgrade fee per rank (₮)</p>
                      {form.dans.map(dan => (
                        <div key={dan.label} style={{ display:"flex", alignItems:"center", gap:"12px", padding:"12px 16px", borderRadius:"12px", background:"#fdfcff", border:"1.5px solid rgba(124,58,237,0.1)" }}>
                          <span style={{ width:14, height:14, borderRadius:"50%", background:dan.color, border:"1.5px solid #ccc", flexShrink:0 }}/>
                          <span className="reg-sans" style={{ fontSize:"13.5px", fontWeight:600, color:"#1a0533", flex:1 }}>{dan.label}</span>
                          <input style={{ ...inp, width:"140px", padding:"9px 12px", fontSize:"13px" }} type="number" placeholder="e.g. 20000" value={dan.price} onChange={e => setDanPrice(dan.label, e.target.value)}/>
                          <span className="reg-sans" style={{ fontSize:"12px", color:"#9879d4" }}>₮</span>
                          <button onClick={() => removeDan(dan.label)} style={{ background:"none", border:"none", cursor:"pointer", color:"#f87171", padding:"4px" }}>
                            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12"/></svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ padding:"14px 18px", borderRadius:"10px", background:"#f9f9fb", border:"1.5px dashed rgba(124,58,237,0.15)", textAlign:"center" }}>
                      <span className="reg-sans" style={{ fontSize:"12.5px", color:"#bbb" }}>No ranks added yet — click a belt above or type a custom name</span>
                    </div>
                  )}
                </div>

                <div style={{ height:"1px", background:"rgba(124,58,237,0.08)" }}/>

                {/* Payment method */}
                <div>
                  <label style={labelStyle}>How will members pay? *</label>
                  <p className="reg-sans" style={{ fontSize:"12.5px", color:"#9879d4", marginBottom:"14px", lineHeight:1.6 }}>
                    Choose how members send their membership fee to your club.
                  </p>
                  <div style={{ display:"flex", gap:"10px", marginBottom:"24px" }}>
                    {[
                      { value:"qpay", label:"QPay only",     emoji:"📱" },
                      { value:"bank", label:"Bank transfer",  emoji:"🏦" },
                      { value:"both", label:"Both",           emoji:"✅" },
                    ].map(opt => (
                      <button key={opt.value} className="payment-tab" onClick={() => setField("paymentMethod", opt.value)}
                        style={{ border:`1.5px solid ${form.paymentMethod===opt.value?"#7c3aed":"rgba(124,58,237,0.15)"}`, background:form.paymentMethod===opt.value?"#f5f0ff":"#fff", color:form.paymentMethod===opt.value?"#7c3aed":"#888" }}>
                        {opt.emoji} {opt.label}
                      </button>
                    ))}
                  </div>

                  {/* QPay */}
                  {(form.paymentMethod==="qpay"||form.paymentMethod==="both") && (
                    <div style={{ padding:"24px", borderRadius:"14px", background:"#fdfcff", border:"1.5px solid rgba(124,58,237,0.12)", marginBottom:"16px" }}>
                      <div style={{ display:"flex", alignItems:"center", gap:"8px", marginBottom:"16px" }}>
                        <span style={{ fontSize:"18px" }}>📱</span>
                        <span className="reg-sans" style={{ fontSize:"13px", fontWeight:700, color:"#1a0533" }}>QPay</span>
                        <span style={{ fontSize:"11px", padding:"2px 8px", borderRadius:"999px", background:"rgba(124,58,237,0.08)", color:"#7c3aed", fontFamily:"'DM Sans',sans-serif", fontWeight:600 }}>Recommended in Mongolia</span>
                      </div>
                      <label style={labelStyle}>QPay Merchant / Invoice Receiver ID *</label>
                      <input style={inp} placeholder="e.g. MYCLUB_MN" value={form.qpayMerchantId} onChange={e => setField("qpayMerchantId", e.target.value)} {...focusHandlers}/>
                      <p className="reg-sans" style={{ fontSize:"11.5px", color:"#bbb", marginTop:"6px" }}>
                        This is the merchant name or ID from your QPay Business account. Members will see a QR code to scan and pay.
                      </p>
                    </div>
                  )}

                  {/* Bank */}
                  {(form.paymentMethod==="bank"||form.paymentMethod==="both") && (
                    <div style={{ padding:"24px", borderRadius:"14px", background:"#fdfcff", border:"1.5px solid rgba(124,58,237,0.12)" }}>
                      <div style={{ display:"flex", alignItems:"center", gap:"8px", marginBottom:"20px" }}>
                        <span style={{ fontSize:"18px" }}>🏦</span>
                        <span className="reg-sans" style={{ fontSize:"13px", fontWeight:700, color:"#1a0533" }}>Bank Transfer</span>
                      </div>
                      <div style={{ display:"flex", flexDirection:"column", gap:"16px" }}>
                        <div>
                          <label style={labelStyle}>Bank *</label>
                          <select style={{ ...inp, appearance:"none", cursor:"pointer", backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%239879d4' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`, backgroundRepeat:"no-repeat", backgroundPosition:"right 14px center" }}
                            value={form.bankName} onChange={e => setField("bankName", e.target.value)}>
                            <option value="">Select bank…</option>
                            {MN_BANKS.map(b => <option key={b}>{b}</option>)}
                          </select>
                        </div>
                        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"14px" }}>
                          <div><label style={labelStyle}>Account Number *</label><input style={inp} placeholder="e.g. 1234567890" value={form.bankAccount} onChange={e => setField("bankAccount", e.target.value)} {...focusHandlers}/></div>
                          <div><label style={labelStyle}>Account Holder Name *</label><input style={inp} placeholder="e.g. Duguilan FC ХХК" value={form.bankAccountName} onChange={e => setField("bankAccountName", e.target.value)} {...focusHandlers}/></div>
                        </div>
                        <p className="reg-sans" style={{ fontSize:"11.5px", color:"#bbb", margin:0 }}>
                          Members will see these details when paying their fee. Make sure the name matches exactly.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ── STEP: Location & Contact ── */}
            {stepName === "Location & Contact" && (
              <div style={{ display:"flex", flexDirection:"column", gap:"24px" }}>
                <div><label style={labelStyle}>Street Address *</label><input style={inp} placeholder="e.g. Суурин 4, Сүхбаатар дүүрэг" value={form.address} onChange={e => setField("address", e.target.value)} {...focusHandlers}/></div>
                <div>
                  <label style={labelStyle}>District</label>
                  <select style={{ ...inp, appearance:"none", cursor:"pointer", backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%239879d4' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`, backgroundRepeat:"no-repeat", backgroundPosition:"right 14px center" }}
                    value={form.district} onChange={e => setField("district", e.target.value)}>
                    <option value="">Select district…</option>
                    {["Сүхбаатар","Баянзүрх","Хан-Уул","Баянгол","Чингэлтэй","Сонгинохайрхан","Налайх","Багануур","Багахангай"].map(d => <option key={d}>{d}</option>)}
                  </select>
                </div>

                {/* Map */}
                <div>
                  <label style={labelStyle}>Pin Your Location <span style={{ fontWeight:400, textTransform:"none", letterSpacing:0, color:"#bbb", marginLeft:6 }}>— click to drop a pin</span></label>
                  <div style={{ background:form.lat?"#f0fdf4":"#f5f0ff", border:`1px solid ${form.lat?"rgba(34,197,94,0.25)":"rgba(124,58,237,0.15)"}`, borderRadius:"10px", padding:"10px 14px", marginBottom:"10px", display:"flex", alignItems:"center", gap:"8px" }}>
                    {form.lat ? (
                      <>
                        <svg width="14" height="14" fill="none" stroke="#22c55e" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
                        <span className="reg-sans" style={{ fontSize:"12.5px", color:"#166534" }}>Pin set! Your club will appear on the homepage map.</span>
                        <button onClick={() => setForm(f => ({ ...f, lat:null, lng:null }))} className="reg-sans" style={{ marginLeft:"auto", background:"none", border:"none", cursor:"pointer", color:"#dc2626", fontSize:"12px", fontWeight:600 }}>Remove pin</button>
                      </>
                    ) : (
                      <>
                        <svg width="14" height="14" fill="none" stroke="#7c3aed" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                        <span className="reg-sans" style={{ fontSize:"12.5px", color:"#7c3aed" }}>Tap the map to mark where your club meets.</span>
                      </>
                    )}
                  </div>
                  <div style={{ borderRadius:"14px", overflow:"hidden", border:"1.5px solid rgba(124,58,237,0.18)" }}>
                    <MapPicker pickMode={true} onPick={handleMapPick} pickedLat={form.lat} pickedLng={form.lng} height="300px"/>
                  </div>
                </div>

                <div style={{ height:"1px", background:"rgba(124,58,237,0.08)" }}/>
                <div><label style={labelStyle}>Contact Email *</label><input style={inp} type="email" placeholder="club@email.com" value={form.email} onChange={e => setField("email", e.target.value)} {...focusHandlers}/></div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"16px" }}>
                  <div><label style={labelStyle}>Phone</label><input style={inp} type="tel" placeholder="+976 ···" value={form.phone} onChange={e => setField("phone", e.target.value)}/></div>
                  <div><label style={labelStyle}>Website</label><input style={inp} type="url" placeholder="https://…" value={form.website} onChange={e => setField("website", e.target.value)}/></div>
                </div>

                {/* Summary */}
                <div style={{ background:"#f5f0ff", border:"1px solid rgba(124,58,237,0.12)", borderRadius:"14px", padding:"20px 24px", marginTop:"8px" }}>
                  <p className="reg-sans" style={{ fontSize:"11px", fontWeight:700, color:"#9879d4", letterSpacing:"0.1em", textTransform:"uppercase", margin:"0 0 14px" }}>Summary</p>
                  {[
                    ["Club",       form.clubName || "—"],
                    ["Category",   form.category || "—"],
                    ["Membership", form.pricingType==="free" ? "Free" : `${form.tiers.length} paid tier${form.tiers.length>1?"s":""}`],
                    ...(form.pricingType==="paid" ? [
                      ["Dans",    form.dans.length ? form.dans.map(d=>d.label).join(", ") : "None"],
                      ["Payment", form.paymentMethod==="qpay" ? "QPay" : form.paymentMethod==="bank" ? "Bank transfer" : "QPay + Bank"],
                    ] : []),
                    ["Address",  form.address || "—"],
                    ["Map pin",  form.lat ? `📍 ${form.lat.toFixed(4)}, ${form.lng.toFixed(4)}` : "Not set"],
                    ["Logo",     form.logo ? "✓ Uploaded" : "Not uploaded"],
                    ["Banners",  form.bannerPhotos.length ? `${form.bannerPhotos.length} photo${form.bannerPhotos.length>1?"s":""}` : "None"],
                  ].map(([k,v]) => (
                    <div key={k} style={{ display:"flex", justifyContent:"space-between", marginBottom:"8px" }}>
                      <span className="reg-sans" style={{ fontSize:"13px", color:"#9879d4" }}>{k}</span>
                      <span className="reg-sans" style={{ fontSize:"13px", fontWeight:600, color:"#1a0533", textAlign:"right", maxWidth:"60%" }}>{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Nav */}
            <div style={{ display:"flex", justifyContent:"space-between", marginTop:"40px", paddingTop:"28px", borderTop:"1px solid rgba(124,58,237,0.08)" }}>
              <button onClick={() => setStep(s=>s-1)} disabled={step===0} className="reg-sans"
                style={{ padding:"12px 24px", borderRadius:"9px", cursor:step===0?"default":"pointer", border:"1.5px solid rgba(124,58,237,0.15)", background:"none", color:step===0?"#ddd":"#555", fontWeight:600, fontSize:"14px" }}>
                ← Back
              </button>
              {step < STEPS.length-1 ? (
                <button onClick={() => canProceed() && setStep(s=>s+1)} className="reg-sans"
                  style={{ padding:"12px 28px", borderRadius:"9px", cursor:canProceed()?"pointer":"not-allowed", background:canProceed()?"#1a0533":"#e5e7eb", color:canProceed()?"#fff":"#bbb", fontWeight:600, fontSize:"14px", border:"none" }}
                  onMouseEnter={e => { if(canProceed()) e.currentTarget.style.background="#7c3aed"; }}
                  onMouseLeave={e => { if(canProceed()) e.currentTarget.style.background="#1a0533"; }}>
                  Continue →
                </button>
              ) : (
                <button onClick={() => canProceed() && handleSubmit()} disabled={loading} className="reg-sans"
                  style={{ padding:"12px 28px", borderRadius:"9px", cursor:canProceed()&&!loading?"pointer":"not-allowed", background:canProceed()?"linear-gradient(135deg,#7c3aed,#4c1d95)":"#e5e7eb", color:canProceed()?"#fff":"#bbb", fontWeight:700, fontSize:"14px", border:"none", boxShadow:canProceed()?"0 4px 16px rgba(124,58,237,0.35)":"none" }}>
                  {loading?"Бүртгэж байна...":"Submit Club 🚀"}
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