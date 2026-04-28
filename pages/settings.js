import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import Header from "@/waterbottle/Header";
import Footer from "@/waterbottle/Footer";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [dark, setDark] = useState(false);
  const [activeSection, setActiveSection] = useState("appearance");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const fileInputRef = useRef(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [form, setForm] = useState({ name: "", bio: "", location: "", phone: "", avatar: null });

  const [pwForm, setPwForm] = useState({ current: "", next: "", confirm: "" });
  const [pwError, setPwError] = useState("");
  const [pwSaved, setPwSaved] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) { router.replace("/signin"); return; }
    const u = JSON.parse(stored);
    setUser(u);
    setForm({ name: u.name || "", bio: u.bio || "", location: u.location || "", phone: u.phone || "", avatar: u.avatar || null });
    if (u.avatar) setAvatarPreview(u.avatar);

    const theme = localStorage.getItem("theme");
    setDark(theme === "dark");
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", dark ? "dark" : "light");
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  function handleAvatarChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target.result;
      setAvatarPreview(dataUrl);
      setForm(f => ({ ...f, avatar: dataUrl }));
    };
    reader.readAsDataURL(file);
  }

  async function saveProfile() {
    if (!user) return;
    setSaving(true);
    try {
      await fetch(`${API}/updateUser/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const updated = { ...user, ...form };
      localStorage.setItem("user", JSON.stringify(updated));
      setUser(updated);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (e) {
      console.error(e);
    }
    setSaving(false);
  }

  const T = dark ? tokens.dark : tokens.light;

  const sections = [
    { id: "appearance", label: "Appearance", icon: <SunIcon /> },
    { id: "profile",    label: "Profile",    icon: <UserIcon /> },
    { id: "account",    label: "Account",    icon: <ShieldIcon /> },
  ];

  const initials = (user?.name || user?.username || "?")[0]?.toUpperCase();

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: T.pageBg, transition: "background 0.3s, color 0.3s" }}>
      <style>{css(T)}</style>
      <Header />

      <main style={{ flex: 1, padding: "48px 24px" }}>
        <div style={{ maxWidth: "860px", margin: "0 auto" }}>

          <div style={{ marginBottom: "36px" }}>
            <p className="st-sans" style={{ fontSize: "11px", fontWeight: 700, color: T.accent, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "6px" }}>
              Your account
            </p>
            <h1 className="st-display" style={{ fontSize: "clamp(28px,5vw,40px)", fontWeight: 800, color: T.heading, letterSpacing: "-0.04em", margin: 0 }}>
              Settings
            </h1>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: "28px", alignItems: "start" }}>
            <nav style={{ background: T.cardBg, border: `1px solid ${T.border}`, borderRadius: "16px", padding: "8px", position: "sticky", top: "96px" }}>
              {sections.map(s => (
                <button
                  key={s.id}
                  onClick={() => setActiveSection(s.id)}
                  className="st-nav-btn"
                  style={{
                    width: "100%", display: "flex", alignItems: "center", gap: "10px",
                    padding: "10px 12px", borderRadius: "10px", border: "none", cursor: "pointer",
                    background: activeSection === s.id ? T.navActive : "transparent",
                    color: activeSection === s.id ? T.accent : T.muted,
                    fontWeight: activeSection === s.id ? 700 : 500,
                    fontSize: "13.5px", fontFamily: "'DM Sans', sans-serif",
                    marginBottom: "2px", transition: "all 0.15s", textAlign: "left",
                  }}
                >
                  <span style={{ color: activeSection === s.id ? T.accent : T.muted, opacity: 0.8 }}>{s.icon}</span>
                  {s.label}
                </button>
              ))}
            </nav>
            <div style={{ background: T.cardBg, border: `1px solid ${T.border}`, borderRadius: "20px", overflow: "hidden" }}>
              {activeSection === "appearance" && (
                <div className="st-section">
                  <div className="st-section-header" style={{ borderColor: T.border }}>
                    <h2 className="st-display" style={{ color: T.heading }}>Appearance</h2>
                    <p className="st-sans" style={{ color: T.muted }}>Choose how Duguilan.mn looks for you.</p>
                  </div>
                  <div className="st-section-body">
                    <div className="st-row" style={{ borderColor: T.border }}>
                      <div>
                        <p className="st-sans st-label" style={{ color: T.heading }}>Theme</p>
                        <p className="st-sans st-hint" style={{ color: T.muted }}>Switch between light and dark mode.</p>
                      </div>
                      <div style={{ display: "flex", gap: "10px" }}>
                        {[
                          { id: "light", label: "☀️ Light" },
                          { id: "dark",  label: "🌙 Dark"  },
                        ].map(opt => (
                          <button
                            key={opt.id}
                            onClick={() => setDark(opt.id === "dark")}
                            style={{
                              padding: "9px 18px", borderRadius: "10px", cursor: "pointer",
                              fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: "13px",
                              border: `2px solid ${(!dark && opt.id === "light") || (dark && opt.id === "dark") ? T.accent : T.border}`,
                              background: (!dark && opt.id === "light") || (dark && opt.id === "dark") ? T.navActive : "transparent",
                              color: (!dark && opt.id === "light") || (dark && opt.id === "dark") ? T.accent : T.muted,
                              transition: "all 0.2s",
                            }}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Preview card */}
                    <div style={{ padding: "20px 28px 28px" }}>
                      <p className="st-sans" style={{ fontSize: "11px", fontWeight: 700, color: T.muted, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "12px" }}>Preview</p>
                      <div style={{
                        background: dark ? "#1a0533" : "#fdfcff",
                        border: `1.5px solid ${dark ? "rgba(167,139,250,0.2)" : "rgba(124,58,237,0.1)"}`,
                        borderRadius: "16px", padding: "24px",
                        display: "flex", alignItems: "center", gap: "16px",
                        transition: "all 0.3s",
                      }}>
                        <div style={{
                          width: "48px", height: "48px", borderRadius: "14px",
                          background: "linear-gradient(135deg,#7c3aed,#4c1d95)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          color: "#fff", fontWeight: 800, fontSize: "18px",
                          fontFamily: "'Fraunces', serif",
                        }}>D</div>
                        <div>
                          <p className="st-display" style={{ margin: 0, fontWeight: 800, fontSize: "16px", color: dark ? "#fff" : "#1a0533", letterSpacing: "-0.02em" }}>
                            Duguilan.mn
                          </p>
                          <p className="st-sans" style={{ margin: 0, fontSize: "12px", color: dark ? "#a78bfa" : "#9879d4", fontWeight: 500 }}>
                            {dark ? "Dark mode active 🌙" : "Light mode active ☀️"}
                          </p>
                        </div>
                        <div style={{ marginLeft: "auto" }}>
                          <span style={{
                            fontSize: "11px", fontWeight: 700, fontFamily: "'DM Sans', sans-serif",
                            background: dark ? "rgba(124,58,237,0.2)" : "rgba(124,58,237,0.08)",
                            color: "#7c3aed", padding: "4px 10px", borderRadius: "20px",
                            border: "1px solid rgba(124,58,237,0.2)",
                          }}>
                            {dark ? "Dark" : "Light"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {activeSection === "profile" && (
                <div className="st-section">
                  <div className="st-section-header" style={{ borderColor: T.border }}>
                    <h2 className="st-display" style={{ color: T.heading }}>Profile</h2>
                    <p className="st-sans" style={{ color: T.muted }}>Update your public profile information.</p>
                  </div>
                  <div className="st-section-body">
                    <div className="st-row" style={{ borderColor: T.border }}>
                      <div>
                        <p className="st-sans st-label" style={{ color: T.heading }}>Profile photo</p>
                        <p className="st-sans st-hint" style={{ color: T.muted }}>Your profile picture shown across the site.</p>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                        <div style={{
                          width: "56px", height: "56px", borderRadius: "50%", overflow: "hidden",
                          background: "linear-gradient(135deg,#7c3aed,#4c1d95)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          color: "#fff", fontWeight: 800, fontSize: "22px",
                          fontFamily: "'Fraunces', sans-serif",
                          border: `2px solid ${T.border}`,
                          flexShrink: 0,
                        }}>
                          {(avatarPreview || user?.avatar)
                            ? <img src={avatarPreview || user.avatar} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="avatar" />
                            : initials
                          }
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                          <button
                            onClick={() => fileInputRef.current?.click()}
                            style={{
                              padding: "8px 16px", borderRadius: "9px", cursor: "pointer",
                              fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: "13px",
                              border: `1.5px solid ${T.border}`,
                              background: T.navActive, color: T.accent,
                              transition: "all 0.2s",
                            }}
                            onMouseEnter={e => { e.currentTarget.style.borderColor = T.accent; }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; }}
                          >
                            Upload photo
                          </button>
                          {avatarPreview && avatarPreview !== user?.avatar && (
                            <button
                              onClick={() => { setAvatarPreview(user?.avatar || null); setForm(f => ({ ...f, avatar: user?.avatar || null })); }}
                              style={{
                                padding: "5px 16px", borderRadius: "8px", cursor: "pointer",
                                fontFamily: "'DM Sans', sans-serif", fontWeight: 500, fontSize: "12px",
                                border: `1px solid rgba(239,68,68,0.25)`,
                                background: "transparent", color: "#ef4444",
                                transition: "all 0.2s",
                              }}
                            >
                              Remove
                            </button>
                          )}
                        </div>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          style={{ display: "none" }}
                          onChange={handleAvatarChange}
                        />
                      </div>
                    </div>

                    {[
                      { key: "name",     label: "Display name", hint: "Your full name shown on your profile.", placeholder: "e.g. Chinbiligt" },
                      { key: "bio",      label: "Bio",          hint: "A short description about yourself.", placeholder: "Tell us about yourself…", multiline: true },
                      { key: "location", label: "Location",     hint: "Your city or district.", placeholder: "e.g. Ulaanbaatar, Khan-Uul" },
                      { key: "phone",    label: "Phone",        hint: "Contact number (optional).", placeholder: "+976 9999 9999" },
                    ].map(({ key, label, hint, placeholder, multiline }) => (
                      <div key={key} className="st-row st-row-col" style={{ borderColor: T.border }}>
                        <div style={{ marginBottom: "10px" }}>
                          <p className="st-sans st-label" style={{ color: T.heading }}>{label}</p>
                          <p className="st-sans st-hint" style={{ color: T.muted }}>{hint}</p>
                        </div>
                        {multiline
                          ? <textarea
                              className="st-input"
                              value={form[key]}
                              onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                              placeholder={placeholder}
                              rows={3}
                              style={{ background: T.inputBg, border: `1.5px solid ${T.border}`, color: T.heading, resize: "vertical" }}
                            />
                          : <input
                              className="st-input"
                              value={form[key]}
                              onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                              placeholder={placeholder}
                              style={{ background: T.inputBg, border: `1.5px solid ${T.border}`, color: T.heading }}
                            />
                        }
                      </div>
                    ))}

                    <div style={{ padding: "20px 28px", display: "flex", alignItems: "center", gap: "12px" }}>
                      <button
                        onClick={saveProfile}
                        disabled={saving}
                        style={{
                          background: "linear-gradient(135deg,#7c3aed,#4c1d95)", color: "#fff",
                          border: "none", padding: "10px 24px", borderRadius: "10px",
                          fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "14px",
                          cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.7 : 1,
                          transition: "opacity 0.2s",
                        }}
                      >
                        {saving ? "Saving…" : "Save changes"}
                      </button>
                      {saved && (
                        <span className="st-sans" style={{ fontSize: "13px", color: "#22c55e", fontWeight: 600 }}>
                          ✓ Saved!
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}
              {activeSection === "account" && (
                <div className="st-section">
                  <div className="st-section-header" style={{ borderColor: T.border }}>
                    <h2 className="st-display" style={{ color: T.heading }}>Account</h2>
                    <p className="st-sans" style={{ color: T.muted }}>Manage your account details and security.</p>
                  </div>
                  <div className="st-section-body">

                    <div className="st-row" style={{ borderColor: T.border }}>
                      <div>
                        <p className="st-sans st-label" style={{ color: T.heading }}>Email address</p>
                        <p className="st-sans st-hint" style={{ color: T.muted }}>Your verified login email.</p>
                      </div>
                      <div style={{
                        background: T.inputBg, border: `1.5px solid ${T.border}`,
                        borderRadius: "10px", padding: "10px 14px",
                        fontFamily: "'DM Sans', sans-serif", fontSize: "14px", color: T.muted,
                        display: "flex", alignItems: "center", gap: "8px",
                      }}>
                        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                          <polyline points="22,6 12,13 2,6"/>
                        </svg>
                        {user?.email || "—"}
                      </div>
                    </div>

                    <div className="st-row" style={{ borderColor: T.border }}>
                      <div>
                        <p className="st-sans st-label" style={{ color: T.heading }}>Username</p>
                        <p className="st-sans st-hint" style={{ color: T.muted }}>Your unique handle on Duguilan.mn.</p>
                      </div>
                      <div style={{
                        background: T.inputBg, border: `1.5px solid ${T.border}`,
                        borderRadius: "10px", padding: "10px 14px",
                        fontFamily: "'DM Sans', sans-serif", fontSize: "14px", color: T.muted,
                        display: "flex", alignItems: "center", gap: "8px",
                      }}>
                        @{user?.username || "—"}
                      </div>
                    </div>

                    <div className="st-row" style={{ borderColor: T.border }}>
                      <div>
                        <p className="st-sans st-label" style={{ color: T.heading }}>Member since</p>
                        <p className="st-sans st-hint" style={{ color: T.muted }}>When you joined Duguilan.mn.</p>
                      </div>
                      <span className="st-sans" style={{ fontSize: "14px", color: T.muted }}>
                        {user?.created_at ? new Date(user.created_at).toLocaleDateString("en-GB", { year: "numeric", month: "long", day: "numeric" }) : "—"}
                      </span>
                    </div>
                    <div style={{ margin: "24px 28px 28px", background: dark ? "rgba(239,68,68,0.06)" : "#fff5f5", border: "1.5px solid rgba(239,68,68,0.15)", borderRadius: "14px", padding: "20px 24px" }}>
                      <p className="st-sans" style={{ fontWeight: 700, fontSize: "13px", color: "#ef4444", marginBottom: "4px" }}>Danger zone</p>
                      <p className="st-sans" style={{ fontSize: "12px", color: T.muted, marginBottom: "14px" }}>
                        Sign out from your account on this device.
                      </p>
                      <button
                        onClick={() => { localStorage.removeItem("user"); router.push("/page"); }}
                        style={{
                          background: "transparent", border: "1.5px solid rgba(239,68,68,0.4)",
                          color: "#ef4444", padding: "8px 18px", borderRadius: "9px",
                          fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: "13px",
                          cursor: "pointer", transition: "all 0.2s",
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = "rgba(239,68,68,0.08)"; }}
                        onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
                      >
                        Sign out →
                      </button>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

const tokens = {
  light: {
    pageBg:   "radial-gradient(ellipse at 20% 30%, #ddd6fe 0%, #ede9fe 30%, #f5f3ff 55%, #faf5ff 75%, #ffffff 100%)",
    cardBg:   "#fff",
    border:   "rgba(124,58,237,0.1)",
    heading:  "#1a0533",
    muted:    "#888",
    accent:   "#7c3aed",
    navActive:"rgba(124,58,237,0.08)",
    inputBg:  "#fdfcff",
  },
  dark: {
    pageBg:   "#0d0118",
    cardBg:   "rgba(255,255,255,0.04)",
    border:   "rgba(167,139,250,0.15)",
    heading:  "#fff",
    muted:    "#a78bfa",
    accent:   "#c4b5fd",
    navActive:"rgba(196,181,253,0.1)",
    inputBg:  "rgba(255,255,255,0.05)",
  },
};

function css(T) {
  return `
    @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,700;0,9..144,800;1,9..144,700&family=DM+Sans:wght@400;500;600;700&display=swap');
    .st-display { font-family: 'Fraunces', serif; }
    .st-sans    { font-family: 'DM Sans', sans-serif; }

    .st-section-header {
      padding: 28px 28px 20px;
      border-bottom: 1px solid;
    }
    .st-section-header h2 {
      font-size: 20px; font-weight: 800; letter-spacing: -0.03em; margin: 0 0 4px;
    }
    .st-section-header p {
      font-size: 13px; margin: 0;
    }
    .st-section-body { padding: 0; }

    .st-row {
      display: flex; align-items: center; justify-content: space-between;
      gap: 20px; padding: 20px 28px;
      border-bottom: 1px solid;
    }
    .st-row-col { flex-direction: column; align-items: stretch; }

    .st-label { font-size: 14px; font-weight: 600; margin: 0 0 2px; }
    .st-hint  { font-size: 12px; margin: 0; }

    .st-input {
      width: 100%; padding: 10px 14px; border-radius: 10px;
      font-family: 'DM Sans', sans-serif; font-size: 14px;
      outline: none; box-sizing: border-box;
      transition: border-color 0.2s;
    }
    .st-input:focus { border-color: #7c3aed !important; box-shadow: 0 0 0 3px rgba(124,58,237,.1); }
    .st-input::placeholder { color: #bbb; }

    .st-nav-btn:hover { background: ${T.navActive} !important; color: ${T.accent} !important; }
  `;
}

function SunIcon() {
  return (
    <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="5"/>
      <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
      <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
    </svg>
  );
}
function UserIcon() {
  return (
    <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  );
}
function ShieldIcon() {
  return (
    <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  );
}