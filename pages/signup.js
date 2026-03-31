"use client";

import { useState } from "react";

const fonts = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,700;0,9..144,800;1,9..144,700&family=DM+Sans:wght@400;500;600;700&display=swap');
  .su-display { font-family: 'Fraunces', serif; }
  .su-sans { font-family: 'DM Sans', sans-serif; }

  .su-input {
    width: 100%;
    padding: 13px 16px;
    border: 1.5px solid rgba(124,58,237,0.2);
    border-radius: 10px;
    font-size: 14px;
    color: #1a0533;
    background: #fdfcff;
    outline: none;
    box-sizing: border-box;
    font-family: 'DM Sans', sans-serif;
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  .su-input:focus {
    border-color: #7c3aed;
    box-shadow: 0 0 0 3px rgba(124,58,237,0.1);
  }

  .su-label {
    font-size: 11px;
    font-weight: 700;
    color: #9879d4;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    display: block;
    margin-bottom: 7px;
    font-family: 'DM Sans', sans-serif;
  }

  .su-btn-primary {
    width: 100%;
    padding: 13px;
    background: linear-gradient(135deg, #7c3aed, #4c1d95);
    color: #fff;
    border: none;
    border-radius: 10px;
    font-size: 14px;
    font-weight: 700;
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s;
    box-shadow: 0 4px 16px rgba(124,58,237,0.3);
    margin-top: 4px;
  }
  .su-btn-primary:hover {
    opacity: 0.92;
    transform: translateY(-1px);
    box-shadow: 0 6px 24px rgba(124,58,237,0.4);
  }

  .su-social-btn {
    width: 100%;
    padding: 12px;
    border-radius: 10px;
    font-size: 13.5px;
    font-weight: 500;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    font-family: 'DM Sans', sans-serif;
    transition: background 0.2s, transform 0.15s;
  }
  .su-social-btn:hover { transform: translateY(-1px); }

  .su-mode-toggle {
    display: flex;
    gap: 0;
    background: #f5f0ff;
    border: 1.5px solid rgba(124,58,237,0.15);
    border-radius: 12px;
    padding: 4px;
    margin-bottom: 28px;
  }
  .su-mode-btn {
    flex: 1;
    padding: 10px;
    border: none;
    border-radius: 9px;
    font-size: 13.5px;
    font-weight: 600;
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    transition: all 0.2s;
  }
`;

const CATEGORIES = [
  "Football", "Basketball", "Volleyball", "Tennis", "Swimming",
  "Chess", "Music", "Art", "Dance", "Drama", "Coding", "Science",
  "Wrestling", "Boxing", "Judo", "Athletics", "Other",
];

function PasswordStrength({ password }) {
  if (!password) return null;
  const strength = password.length < 6
    ? { label: "Weak", color: "#ef4444", width: "33%" }
    : password.length < 10
      ? { label: "Fair", color: "#f59e0b", width: "66%" }
      : { label: "Strong", color: "#22c55e", width: "100%" };
  return (
    <div style={{ marginTop: "6px" }}>
      <div style={{ height: "3px", borderRadius: "4px", background: "rgba(124,58,237,0.1)", overflow: "hidden" }}>
        <div style={{ height: "100%", width: strength.width, background: strength.color, borderRadius: "4px", transition: "width 0.3s, background 0.3s" }} />
      </div>
      <span className="su-sans" style={{ fontSize: "11px", color: strength.color, fontWeight: 600, marginTop: "4px", display: "block" }}>{strength.label} password</span>
    </div>
  );
}

function InputField({ label, children }) {
  return (
    <div>
      <label className="su-label">{label}</label>
      {children}
    </div>
  );
}

export default function SignUpPage() {
  const [mode, setMode] = useState("user");

  // User fields
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showCf, setShowCf] = useState(false);

  // Club fields
  const [clubName, setClubName] = useState("");
  const [clubCategory, setClubCategory] = useState("");
  const [clubEmail, setClubEmail] = useState("");
  const [clubPhone, setClubPhone] = useState("");
  const [clubWebsite, setClubWebsite] = useState("");
  const [clubDesc, setClubDesc] = useState("");
  const [clubPw, setClubPw] = useState("");
  const [clubCf, setClubCf] = useState("");
  const [showCPw, setShowCPw] = useState(false);
  const [showCCf, setShowCCf] = useState(false);

  const match = confirm && password === confirm;
  const mismatch = confirm && password !== confirm;
  const clubMatch = clubCf && clubPw === clubCf;
  const clubMismatch = clubCf && clubPw !== clubCf;

  const eyeOpen = (
    <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
    </svg>
  );
  const eyeClosed = (
    <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  );

  const inp = { className: "su-input" };
  const selectStyle = {
    width: "100%", padding: "13px 16px",
    border: "1.5px solid rgba(124,58,237,0.2)", borderRadius: "10px",
    fontSize: "14px", color: "#1a0533", background: "#fdfcff",
    outline: "none", boxSizing: "border-box",
    fontFamily: "'DM Sans', sans-serif",
    appearance: "none", cursor: "pointer",
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%239879d4' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
    backgroundRepeat: "no-repeat", backgroundPosition: "right 14px center",
    transition: "border-color 0.2s, box-shadow 0.2s",
  };

  return (
    <div style={{
      minHeight: "100vh", display: "flex", flexDirection: "column",
      background: "radial-gradient(ellipse at 20% 30%, #ddd6fe 0%, #ede9fe 30%, #f5f3ff 55%, #faf5ff 75%, #ffffff 100%)",
    }}>
      <style>{fonts}</style>

      <div style={{ height: "3px", background: "linear-gradient(90deg, #4c1d95, #7c3aed, #c4b5fd, #7c3aed, #4c1d95)" }} />

      {/* Mini header */}
      <div style={{ padding: "20px 36px" }}>
        <a href="/page" style={{ display: "inline-flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
          <img src="/assets/logo1.png" alt="Logo" width={28} height={28} style={{ borderRadius: "7px" }} />
          <span className="su-display" style={{ fontSize: "18px", fontWeight: 800, color: "#1a0533", letterSpacing: "-0.03em" }}>
            Duguilan.mn
          </span>
        </a>
      </div>

      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "16px 16px 64px" }}>
        <div style={{ width: "100%", maxWidth: "460px" }}>
          <div style={{
            background: "#fff",
            border: "1.5px solid rgba(124,58,237,0.15)",
            borderRadius: "20px",
            padding: "44px 40px 40px",
            boxShadow: "0 12px 48px rgba(124,58,237,0.1), 0 2px 8px rgba(26,5,51,0.06)",
          }}>

            {/* Logo */}
            <div style={{ display: "flex", justifyContent: "center", marginBottom: "24px" }}>
              <div style={{
                width: "56px", height: "56px", borderRadius: "14px",
                background: "linear-gradient(135deg, #1a0533, #3b0764)",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 6px 20px rgba(26,5,51,0.25)",
              }}>
                <img src="/assets/logo_white.png" alt="Logo" width={32} height={32} style={{ borderRadius: "7px" }} />
              </div>
            </div>

            <h1 className="su-display" style={{ margin: "0 0 6px", textAlign: "center", fontSize: "24px", fontWeight: 800, color: "#1a0533", letterSpacing: "-0.04em" }}>
              Create an account
            </h1>
            <p className="su-sans" style={{ margin: "0 0 28px", textAlign: "center", fontSize: "13.5px", color: "#9879d4", fontWeight: 500 }}>
              Join Duguilan.mn today
            </p>

            {/* Mode toggle */}
            <div className="su-mode-toggle">
              {[["user", "Personal"], ["club", "Club"]].map(([m, lbl]) => (
                <button key={m} className="su-mode-btn" onClick={() => setMode(m)} style={{
                  background: mode === m ? "#fff" : "transparent",
                  color: mode === m ? "#7c3aed" : "#9879d4",
                  boxShadow: mode === m ? "0 2px 8px rgba(124,58,237,0.15)" : "none",
                  border: mode === m ? "1px solid rgba(124,58,237,0.15)" : "1px solid transparent",
                }}>
                  {lbl}
                </button>
              ))}
            </div>

            {/* USER FORM */}
            {mode === "user" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <InputField label="Username">
                  <input {...inp} type="text" placeholder="your_username" value={username} onChange={e => setUsername(e.target.value)} />
                </InputField>

                <InputField label="Email">
                  <div style={{ position: "relative" }}>
                    <svg style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}
                      width="15" height="15" fill="none" stroke="#c4b5fd" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                      <polyline points="22,6 12,13 2,6"/>
                    </svg>
                    <input {...inp} type="email" placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)} style={{ paddingLeft: "42px" }} />
                  </div>
                </InputField>

                <InputField label="Password">
                  <div style={{ position: "relative" }}>
                    <input {...inp} type={showPw ? "text" : "password"} placeholder="Min. 8 characters" value={password} onChange={e => setPassword(e.target.value)} style={{ paddingRight: "44px" }} />
                    <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#c4b5fd" }}>
                      {showPw ? eyeClosed : eyeOpen}
                    </button>
                  </div>
                  <PasswordStrength password={password} />
                </InputField>

                <InputField label="Confirm Password">
                  <div style={{ position: "relative" }}>
                    <input {...inp} type={showCf ? "text" : "password"} placeholder="Re-enter your password" value={confirm} onChange={e => setConfirm(e.target.value)}
                      style={{ paddingRight: "44px", borderColor: mismatch ? "#ef4444" : match ? "#22c55e" : "rgba(124,58,237,0.2)" }} />
                    <button type="button" onClick={() => setShowCf(!showCf)} style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#c4b5fd" }}>
                      {showCf ? eyeClosed : eyeOpen}
                    </button>
                  </div>
                  {mismatch && <span className="su-sans" style={{ fontSize: "11px", color: "#ef4444", fontWeight: 600, marginTop: "4px", display: "block" }}>Passwords don't match</span>}
                  {match && <span className="su-sans" style={{ fontSize: "11px", color: "#22c55e", fontWeight: 600, marginTop: "4px", display: "block" }}>Passwords match ✓</span>}
                </InputField>

                <button className="su-btn-primary">Create Account →</button>
              </div>
            )}

            {/* CLUB FORM */}
            {mode === "club" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <InputField label="Club Name">
                  <input {...inp} type="text" placeholder="e.g. Ulaanbaatar FC" value={clubName} onChange={e => setClubName(e.target.value)} />
                </InputField>

                <InputField label="Category">
                  <select style={selectStyle} value={clubCategory} onChange={e => setClubCategory(e.target.value)}>
                    <option value="">Select a category…</option>
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </InputField>

                <InputField label="Contact Email">
                  <div style={{ position: "relative" }}>
                    <svg style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}
                      width="15" height="15" fill="none" stroke="#c4b5fd" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                      <polyline points="22,6 12,13 2,6"/>
                    </svg>
                    <input {...inp} type="email" placeholder="club@email.com" value={clubEmail} onChange={e => setClubEmail(e.target.value)} style={{ paddingLeft: "42px" }} />
                  </div>
                </InputField>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <InputField label="Phone">
                    <input {...inp} type="tel" placeholder="+976 ···" value={clubPhone} onChange={e => setClubPhone(e.target.value)} />
                  </InputField>
                  <InputField label="Website">
                    <input {...inp} type="url" placeholder="https://…" value={clubWebsite} onChange={e => setClubWebsite(e.target.value)} />
                  </InputField>
                </div>

                <InputField label="About the Club">
                  <textarea className="su-input" placeholder="Brief description of your club…" value={clubDesc} onChange={e => setClubDesc(e.target.value)}
                    rows={3} style={{ resize: "vertical", lineHeight: 1.6 }} />
                </InputField>

                <InputField label="Password">
                  <div style={{ position: "relative" }}>
                    <input {...inp} type={showCPw ? "text" : "password"} placeholder="Min. 8 characters" value={clubPw} onChange={e => setClubPw(e.target.value)} style={{ paddingRight: "44px" }} />
                    <button type="button" onClick={() => setShowCPw(!showCPw)} style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#c4b5fd" }}>
                      {showCPw ? eyeClosed : eyeOpen}
                    </button>
                  </div>
                  <PasswordStrength password={clubPw} />
                </InputField>

                <InputField label="Confirm Password">
                  <div style={{ position: "relative" }}>
                    <input {...inp} type={showCCf ? "text" : "password"} placeholder="Re-enter password" value={clubCf} onChange={e => setClubCf(e.target.value)}
                      style={{ paddingRight: "44px", borderColor: clubMismatch ? "#ef4444" : clubMatch ? "#22c55e" : "rgba(124,58,237,0.2)" }} />
                    <button type="button" onClick={() => setShowCCf(!showCCf)} style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#c4b5fd" }}>
                      {showCCf ? eyeClosed : eyeOpen}
                    </button>
                  </div>
                  {clubMismatch && <span className="su-sans" style={{ fontSize: "11px", color: "#ef4444", fontWeight: 600, marginTop: "4px", display: "block" }}>Passwords don't match</span>}
                  {clubMatch && <span className="su-sans" style={{ fontSize: "11px", color: "#22c55e", fontWeight: 600, marginTop: "4px", display: "block" }}>Passwords match ✓</span>}
                </InputField>

                <button className="su-btn-primary">Register Club →</button>
              </div>
            )}

            {/* Divider */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px", margin: "24px 0" }}>
              <div style={{ flex: 1, height: "1px", background: "rgba(124,58,237,0.1)" }} />
              <span className="su-sans" style={{ fontSize: "12px", color: "#c4b5fd", fontWeight: 500 }}>or continue with</span>
              <div style={{ flex: 1, height: "1px", background: "rgba(124,58,237,0.1)" }} />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <button className="su-social-btn" style={{ background: "#1877F2", color: "#fff", border: "none" }}
                onMouseEnter={e => e.currentTarget.style.background = "#166fe5"}
                onMouseLeave={e => e.currentTarget.style.background = "#1877F2"}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                Continue with Facebook
              </button>

              <button className="su-social-btn" style={{ background: "#fff", color: "#374151", border: "1.5px solid rgba(124,58,237,0.15)" }}
                onMouseEnter={e => e.currentTarget.style.background = "#fdfcff"}
                onMouseLeave={e => e.currentTarget.style.background = "#fff"}>
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Continue with Google
              </button>
            </div>

            <p className="su-sans" style={{ textAlign: "center", marginTop: "20px", fontSize: "13px", color: "#9ca3af" }}>
              Already have an account?{" "}
              <a href="/signin" style={{ color: "#7c3aed", fontWeight: 700, textDecoration: "none" }}
                onMouseEnter={e => e.target.style.textDecoration = "underline"}
                onMouseLeave={e => e.target.style.textDecoration = "none"}>
                Sign in
              </a>
            </p>

            <div style={{ marginTop: "16px", paddingTop: "16px", borderTop: "1px solid rgba(124,58,237,0.08)", textAlign: "center" }}>
              <p className="su-sans" style={{ fontSize: "12px", color: "#c4b5fd", margin: "0 0 6px" }}>Running a club?</p>
              <a href="/club-register" className="su-sans" style={{ fontSize: "13px", fontWeight: 700, color: "#7c3aed", textDecoration: "none" }}
                onMouseEnter={e => e.target.style.textDecoration = "underline"}
                onMouseLeave={e => e.target.style.textDecoration = "none"}>
                Register your club →
              </a>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}