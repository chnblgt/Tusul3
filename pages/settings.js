import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import Header from "@/waterbottle/Header";
import Footer from "@/waterbottle/Footer";
import { useTheme } from "@/waterbottle/useTheme";
import Link from "next/link";


const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const THEMES = ["light", "dark", "purple"];

const THEME_META = {
  light: {
    label: "Light",
    emoji: "☀️",
    desc: "White & warm beige",
    bg: "#fafaf8",
    card: "#ffffff",
    accent: "#1d6fbc",
    text: "#1a1714",
    border: "rgba(0,0,0,0.07)",
    preview: {
      pageBg: "#f0ece4",
      cardBg: "#ffffff",
      accentColor: "#1d6fbc",
      textColor: "#1a1714",
      mutedColor: "#9a8f82",
      badgeBg: "rgba(29,111,188,0.08)",
      badgeText: "#1d6fbc",
    },
  },
  dark: {
    label: "Dark",
    emoji: "🌙",
    desc: "True black & dark grey",
    bg: "#0a0a0a",
    card: "#181818",
    accent: "#4a9eff",
    text: "#ededed",
    border: "rgba(255,255,255,0.07)",
    preview: {
      pageBg: "#0a0a0a",
      cardBg: "#181818",
      accentColor: "#4a9eff",
      textColor: "#ededed",
      mutedColor: "#525252",
      badgeBg: "rgba(74,158,255,0.10)",
      badgeText: "#4a9eff",
    },
  },
  purple: {
    label: "Purple",
    emoji: "🔮",
    desc: "Deep violet world",
    bg: "#0c0516",
    card: "#1a0d2e",
    accent: "#b87cff",
    text: "#f0e8ff",
    border: "rgba(180,120,255,0.15)",
    preview: {
      pageBg: "#0c0516",
      cardBg: "#1a0d2e",
      accentColor: "#b87cff",
      textColor: "#f0e8ff",
      mutedColor: "#7a5fa8",
      badgeBg: "rgba(184,124,255,0.16)",
      badgeText: "#b87cff",
    },
  },
};

export default function SettingsPage() {
  const router = useRouter();
  const { setTheme } = useTheme();
  const [user, setUser] = useState(null);
  const [activeTheme, setActiveTheme] = useState("light");
  const [activeSection, setActiveSection] = useState("appearance");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const fileInputRef = useRef(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [pendingAvatarFile, setPendingAvatarFile] = useState(null);
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

    const theme = localStorage.getItem("theme") || "light";
    const valid = THEMES.includes(theme) ? theme : "light";
    setActiveTheme(valid);
  }, []);

  function applyTheme(t) {
    setActiveTheme(t);
    setTheme(t);
  }

  function handleAvatarChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const previewUrl = URL.createObjectURL(file);
    setAvatarPreview(previewUrl);
    setPendingAvatarFile(file);
    e.target.value = "";
  }

  async function saveProfile() {
    if (!user) return;
    setSaving(true);
    try {
      let avatarUrl = form.avatar;
      if (pendingAvatarFile) {
        const formData = new FormData();
        formData.append("avatar", pendingAvatarFile);
        const uploadRes = await fetch(`${API}/uploadAvatar/${user.id}`, {
          method: "POST",
          headers: { "ngrok-skip-browser-warning": "true" },
          body: formData,
        });
        const uploadResult = await uploadRes.json().catch(() => null);
        if (uploadResult?.success && uploadResult.avatarUrl) {
          avatarUrl = uploadResult.avatarUrl;
        }
        setPendingAvatarFile(null);
      }
      const payload = { ...form, avatar: avatarUrl };
      await fetch(`${API}/updateUser/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", "ngrok-skip-browser-warning": "true" },
        body: JSON.stringify(payload),
      });
      const updated = { ...user, ...payload };
      localStorage.setItem("user", JSON.stringify(updated));
      setUser(updated);
      setForm({ name: updated.name || "", bio: updated.bio || "", location: updated.location || "", phone: updated.phone || "", avatar: updated.avatar || null });
      setAvatarPreview(updated.avatar || null);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (e) {
      console.error(e);
    }
    setSaving(false);
  }

  function cancelProfile() {
    if (!user) return;
    setForm({ name: user.name || "", bio: user.bio || "", location: user.location || "", phone: user.phone || "", avatar: user.avatar || null });
    setAvatarPreview(user.avatar || null);
    setPendingAvatarFile(null);
  }

  const T = tokens[activeTheme] || tokens.light;

  const sections = [
    { id: "appearance", label: "Appearance", icon: <SunIcon /> },
    { id: "profile",    label: "Profile",    icon: <UserIcon /> },
    { id: "account",    label: "Account",    icon: <ShieldIcon /> },
  ];

  const initials = (user?.name || user?.username || "?")[0]?.toUpperCase();

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--bg-page)", transition: "background 0.3s, color 0.3s" }}>
      <style>{css(T)}</style>
      <Header />

      <main style={{ flex: 1, padding: "48px 24px" }}>
        <div style={{ maxWidth: "860px", margin: "0 auto" }}>

          <div style={{ marginBottom: "36px" }}>
            <p className="st-sans" style={{ fontSize: "11px", fontWeight: 700, color: "var(--accent)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "6px" }}>
              Your account
            </p>
            <h1 className="st-display" style={{ fontSize: "clamp(28px,5vw,40px)", fontWeight: 400, color: "var(--text-primary)", letterSpacing: "-0.03em", margin: 0 }}>
              Settings
            </h1>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: "28px", alignItems: "start" }}>

            <nav style={{ background: "var(--bg-card)", border: "1px solid var(--border-subtle)", borderRadius: "16px", padding: "8px", position: "sticky", top: "96px" }}>
              {sections.map(s => (
                <button
                  key={s.id}
                  onClick={() => setActiveSection(s.id)}
                  className="st-nav-btn"
                  style={{
                    width: "100%", display: "flex", alignItems: "center", gap: "10px",
                    padding: "10px 12px", borderRadius: "10px", border: "none", cursor: "pointer",
                    background: activeSection === s.id ? "var(--accent-soft)" : "transparent",
                    color: activeSection === s.id ? "var(--accent)" : "var(--text-muted)",
                    fontWeight: activeSection === s.id ? 700 : 500,
                    fontSize: "13.5px", fontFamily: "'DM Sans', sans-serif",
                    marginBottom: "2px", transition: "all 0.15s", textAlign: "left",
                  }}
                >
                  <span style={{ opacity: 0.8 }}>{s.icon}</span>
                  {s.label}
                </button>
              ))}
            </nav>

            <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-subtle)", borderRadius: "20px", overflow: "hidden" }}>
              {activeSection === "appearance" && (
                <div className="st-section">
                  <div className="st-section-header">
                    <h2 className="st-display" style={{ color: "var(--text-primary)" }}>Appearance</h2>
                    <p className="st-sans" style={{ color: "var(--text-muted)" }}>Choose how Duguilan.com looks for you.</p>
                  </div>
                  <div className="st-section-body">
                    <div style={{ padding: "24px 28px 8px" }}>
                      <p className="st-sans" style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.12em", textTransform: "uppercase", margin: "0 0 16px" }}>
                        Theme
                      </p>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
                        {THEMES.map(t => {
                          const meta = THEME_META[t];
                          const active = activeTheme === t;
                          return (
                            <button
                              key={t}
                              onClick={() => applyTheme(t)}
                              style={{
                                padding: 0, border: `2px solid ${active ? "var(--accent)" : "var(--border-subtle)"}`,
                                borderRadius: "14px", cursor: "pointer", background: "none",
                                transition: "all 0.2s", overflow: "hidden",
                                outline: active ? `3px solid var(--accent-soft)` : "none",
                                outlineOffset: "2px",
                              }}
                            >
                              <div style={{
                                background: meta.preview.pageBg,
                                padding: "10px 10px 6px",
                                borderBottom: `1px solid ${meta.border}`,
                              }}>
                                <div style={{
                                  height: "18px", borderRadius: "6px",
                                  background: meta.preview.cardBg,
                                  border: `1px solid ${meta.border}`,
                                  display: "flex", alignItems: "center",
                                  padding: "0 6px", gap: "4px", marginBottom: "6px",
                                }}>
                                  <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: meta.preview.accentColor }} />
                                  <div style={{ flex: 1, height: "3px", borderRadius: "2px", background: meta.border }} />
                                </div>
                                <div style={{
                                  height: "32px", borderRadius: "6px",
                                  background: meta.preview.cardBg,
                                  border: `1px solid ${meta.border}`,
                                  padding: "5px 7px",
                                  display: "flex", flexDirection: "column", gap: "4px",
                                }}>
                                  <div style={{ height: "4px", width: "60%", borderRadius: "2px", background: meta.preview.textColor, opacity: 0.7 }} />
                                  <div style={{ height: "3px", width: "40%", borderRadius: "2px", background: meta.preview.mutedColor, opacity: 0.5 }} />
                                </div>
                              </div>
                              <div style={{
                                padding: "8px 10px",
                                background: meta.card,
                                display: "flex", alignItems: "center", justifyContent: "space-between",
                              }}>
                                <div style={{ textAlign: "left" }}>
                                  <p className="st-sans" style={{
                                    fontSize: "12px", fontWeight: active ? 700 : 600,
                                    color: active ? meta.accent : meta.text,
                                    margin: 0, lineHeight: 1.2,
                                  }}>{meta.emoji} {meta.label}</p>
                                  <p className="st-sans" style={{
                                    fontSize: "10px", color: meta.preview.mutedColor,
                                    margin: "2px 0 0", lineHeight: 1.2,
                                  }}>{meta.desc}</p>
                                </div>
                                {active && (
                                  <div style={{
                                    width: "16px", height: "16px", borderRadius: "50%",
                                    background: "var(--accent)",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    flexShrink: 0,
                                  }}>
                                    <svg width="9" height="9" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
                                  </div>
                                )}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                    <div style={{ padding: "20px 28px 28px" }}>
                      <p className="st-sans" style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "12px" }}>
                        Preview
                      </p>
                      <div style={{
                        background: "var(--bg-section)",
                        border: "1.5px solid var(--border-subtle)",
                        borderRadius: "16px", padding: "20px",
                        display: "flex", alignItems: "center", gap: "14px",
                        transition: "all 0.35s",
                      }}>
                        <div style={{
                          width: "44px", height: "44px", borderRadius: "12px",
                          background: "var(--accent)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          color: "var(--text-on-accent)",
                          fontFamily: "'DM Serif Display', serif",
                          fontStyle: "italic", fontSize: "20px", fontWeight: 400,
                          flexShrink: 0,
                        }}>D</div>
                        <div style={{ flex: 1 }}>
                          <p className="st-display" style={{ margin: 0, fontSize: "15px", color: "var(--text-primary)", letterSpacing: "-0.01em" }}>
                            Duguilan<span style={{ color: "var(--accent)", fontStyle: "italic" }}>.com</span>
                          </p>
                          <p className="st-sans" style={{ margin: "3px 0 0", fontSize: "12px", color: "var(--text-muted)", fontWeight: 400 }}>
                            Currently: <strong style={{ color: "var(--accent)" }}>{THEME_META[activeTheme]?.label} mode</strong>
                          </p>
                        </div>
                        <span style={{
                          fontSize: "11px", fontWeight: 700, fontFamily: "'DM Sans', sans-serif",
                          background: "var(--accent-soft)",
                          color: "var(--accent)", padding: "5px 12px", borderRadius: "20px",
                          border: "1px solid var(--accent-soft)",
                          letterSpacing: "0.04em",
                        }}>
                          {THEME_META[activeTheme]?.emoji}
                        </span>
                      </div>
                    </div>

                  </div>
                </div>
              )}
              {activeSection === "profile" && (
                <div className="st-section">
                  <div className="st-section-header">
                    <h2 className="st-display" style={{ color: "var(--text-primary)" }}>Profile</h2>
                    <p className="st-sans" style={{ color: "var(--text-muted)" }}>Update your public profile information.</p>
                  </div>
                  <div className="st-section-body">
                    <div className="st-row">
                      <div>
                        <p className="st-sans st-label" style={{ color: "var(--text-primary)" }}>Profile photo</p>
                        <p className="st-sans st-hint" style={{ color: "var(--text-muted)" }}>Your profile picture shown across the site.</p>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                        <div style={{
                          width: "56px", height: "56px", borderRadius: "50%", overflow: "hidden",
                          background: "var(--accent)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          color: "var(--text-on-accent)", fontWeight: 800, fontSize: "22px",
                          fontFamily: "'DM Serif Display', serif",
                          border: "2px solid var(--border-subtle)",
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
                              border: "1.5px solid var(--border-subtle)",
                              background: "var(--accent-soft)", color: "var(--accent)",
                              transition: "all 0.2s",
                            }}
                          >
                            Upload photo
                          </button>
                          {(pendingAvatarFile || (avatarPreview && avatarPreview !== user?.avatar)) && (
                            <button
                              onClick={() => { setAvatarPreview(user?.avatar || null); setPendingAvatarFile(null); setForm(f => ({ ...f, avatar: user?.avatar || null })); }}
                              style={{
                                padding: "5px 16px", borderRadius: "8px", cursor: "pointer",
                                fontFamily: "'DM Sans', sans-serif", fontWeight: 500, fontSize: "12px",
                                border: "1px solid rgba(239,68,68,0.25)",
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
                      <div key={key} className="st-row st-row-col">
                        <div style={{ marginBottom: "10px" }}>
                          <p className="st-sans st-label" style={{ color: "var(--text-primary)" }}>{label}</p>
                          <p className="st-sans st-hint" style={{ color: "var(--text-muted)" }}>{hint}</p>
                        </div>
                        {multiline
                          ? <textarea
                              className="st-input"
                              value={form[key]}
                              onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                              placeholder={placeholder}
                              rows={3}
                            />
                          : <input
                              className="st-input"
                              value={form[key]}
                              onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                              placeholder={placeholder}
                            />
                        }
                      </div>
                    ))}

                    <div style={{ padding: "20px 28px", display: "flex", alignItems: "center", gap: "12px" }}>
                      <button
                        onClick={saveProfile}
                        disabled={saving}
                        style={{
                          background: "var(--accent)", color: "var(--text-on-accent)",
                          border: "none", padding: "10px 24px", borderRadius: "10px",
                          fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "14px",
                          cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.7 : 1,
                          transition: "opacity 0.2s",
                        }}
                      >
                        {saving ? "Saving…" : "Save changes"}
                      </button>
                      <button
                        onClick={cancelProfile}
                        disabled={saving}
                        style={{
                          background: "none", color: "var(--text-muted)",
                          border: "1.5px solid var(--border-subtle)", padding: "10px 24px", borderRadius: "10px",
                          fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: "14px",
                          cursor: "pointer", transition: "all 0.2s",
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = "var(--accent-soft)"; }}
                        onMouseLeave={e => { e.currentTarget.style.background = "none"; }}
                      >
                        Cancel
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
                  <div className="st-section-header">
                    <h2 className="st-display" style={{ color: "var(--text-primary)" }}>Account</h2>
                    <p className="st-sans" style={{ color: "var(--text-muted)" }}>Manage your account details and security.</p>
                  </div>
                  <div className="st-section-body">

                    <div className="st-row">
                      <div>
                        <p className="st-sans st-label" style={{ color: "var(--text-primary)" }}>Email address</p>
                        <p className="st-sans st-hint" style={{ color: "var(--text-muted)" }}>Your verified login email.</p>
                      </div>
                      <div style={{
                        background: "var(--bg-input)", border: "1.5px solid var(--border-subtle)",
                        borderRadius: "10px", padding: "10px 14px",
                        fontFamily: "'DM Sans', sans-serif", fontSize: "14px", color: "var(--text-muted)",
                        display: "flex", alignItems: "center", gap: "8px",
                      }}>
                        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                          <polyline points="22,6 12,13 2,6"/>
                        </svg>
                        {user?.email || "—"}
                      </div>
                    </div>

                    <div className="st-row">
                      <div>
                        <p className="st-sans st-label" style={{ color: "var(--text-primary)" }}>Username</p>
                        <p className="st-sans st-hint" style={{ color: "var(--text-muted)" }}>Your unique handle on Duguilan.com.</p>
                      </div>
                      <div style={{
                        background: "var(--bg-input)", border: "1.5px solid var(--border-subtle)",
                        borderRadius: "10px", padding: "10px 14px",
                        fontFamily: "'DM Sans', sans-serif", fontSize: "14px", color: "var(--text-muted)",
                        display: "flex", alignItems: "center", gap: "8px",
                      }}>
                        @{user?.username || "—"}
                      </div>
                    </div>

                    <div className="st-row">
                      <div>
                        <p className="st-sans st-label" style={{ color: "var(--text-primary)" }}>Member since</p>
                        <p className="st-sans st-hint" style={{ color: "var(--text-muted)" }}>When you joined Duguilan.com.</p>
                      </div>
                      <span className="st-sans" style={{ fontSize: "14px", color: "var(--text-muted)" }}>
                        {user?.created_at ? new Date(user.created_at).toLocaleDateString("en-GB", { year: "numeric", month: "long", day: "numeric" }) : "—"}
                      </span>
                    </div>

                    <div style={{ margin: "24px 28px 28px", background: "rgba(239,68,68,0.05)", border: "1.5px solid rgba(239,68,68,0.15)", borderRadius: "14px", padding: "20px 24px" }}>
                      <p className="st-sans" style={{ fontWeight: 700, fontSize: "13px", color: "#ef4444", marginBottom: "4px" }}>Danger zone</p>
                      <p className="st-sans" style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "14px" }}>
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
  light:  { accent: "#1d6fbc" },
  dark:   { accent: "#4a9eff" },
  purple: { accent: "#b87cff" },
};

function css() {
  return `
    @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&display=swap');
    .st-display { font-family: 'DM Serif Display', serif; }
    .st-sans    { font-family: 'DM Sans', sans-serif; }

    .st-section-header {
      padding: 28px 28px 20px;
      border-bottom: 1px solid var(--border-subtle);
    }
    .st-section-header h2 {
      font-size: 20px; font-weight: 400; letter-spacing: -0.02em; margin: 0 0 4px;
    }
    .st-section-header p {
      font-size: 13px; margin: 0; font-weight: 300;
    }
    .st-section-body { padding: 0; }

    .st-row {
      display: flex; align-items: center; justify-content: space-between;
      gap: 20px; padding: 20px 28px;
      border-bottom: 1px solid var(--border-subtle);
    }
    .st-row-col { flex-direction: column; align-items: stretch; }

    .st-label { font-size: 14px; font-weight: 600; margin: 0 0 2px; }
    .st-hint  { font-size: 12px; margin: 0; font-weight: 300; }

    .st-input {
      width: 100%; padding: 10px 14px; border-radius: 10px;
      font-family: 'DM Sans', sans-serif; font-size: 14px;
      outline: none; box-sizing: border-box;
      border: 1.5px solid var(--border-input);
      background: var(--bg-input); color: var(--text-primary);
      transition: border-color 0.2s;
    }
    .st-input:focus { border-color: var(--accent) !important; box-shadow: 0 0 0 3px var(--accent-soft); }
    .st-input::placeholder { color: var(--text-muted) !important; }

    .st-nav-btn:hover { background: var(--accent-soft) !important; color: var(--accent) !important; }
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