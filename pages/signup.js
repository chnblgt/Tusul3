"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const fetchAPI = (url, opts = {}) =>
  fetch(url, { ...opts, headers: { "ngrok-skip-browser-warning": "true", ...opts.headers } });

const CATEGORIES = ["Football","Basketball","Volleyball","Tennis","Swimming","Chess","Music","Art","Dance","Drama","Coding","Science","Wrestling","Boxing","Judo","Athletics","Other"];

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,600;1,300;1,400&family=Outfit:wght@300;400;500;600;700&display=swap');
  .au-serif { font-family: 'Cormorant Garamond', serif; }
  .au-sans  { font-family: 'Outfit', sans-serif; }

  @keyframes au-up { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:none} }
  .au-card { animation: au-up 0.6s cubic-bezier(0.16,1,0.3,1) both; }

  .au-input {
    width: 100%; padding: 12px 16px;
    border: 1px solid var(--input-border); border-radius: 8px;
    font-size: 14px; font-family: 'Outfit', sans-serif; font-weight: 400;
    color: var(--input-text); background: var(--bg-input);
    outline: none; box-sizing: border-box;
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  .au-input:focus {
    border-color: var(--text-accent);
    box-shadow: 0 0 0 3px rgba(96,48,200,0.08);
  }

  .au-label {
    font-family: 'Outfit', sans-serif;
    font-size: 10px; font-weight: 700;
    letter-spacing: 0.14em; text-transform: uppercase;
    color: var(--text-muted); display: block; margin-bottom: 7px;
  }

  .au-btn-primary {
    width: 100%; padding: 12px;
    background: var(--text-primary); color: var(--bg-page);
    border: none; border-radius: 8px;
    font-size: 13px; font-weight: 600; letter-spacing: 0.04em;
    font-family: 'Outfit', sans-serif; cursor: pointer;
    transition: all 0.2s;
  }
  .au-btn-primary:hover { background: var(--text-accent); transform: translateY(-1px); }
  .au-btn-primary:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

  .au-error {
    background: rgba(239,68,68,0.08); border: 1px solid rgba(239,68,68,0.2);
    border-radius: 8px; padding: 10px 14px;
    font-size: 13px; color: #dc2626; font-family: 'Outfit', sans-serif;
  }

  @keyframes au-pulse {
    0%,100% { opacity: 0.3; transform: scale(1); }
    50%     { opacity: 1; transform: scale(1.4); }
  }
`;

function PasswordStrength({ pw }) {
  if (!pw) return null;
  const s = pw.length < 8
    ? { label: "Weak", color: "#ef4444", w: "33%" }
    : pw.length < 12
    ? { label: "Fair", color: "#f59e0b", w: "66%" }
    : { label: "Strong", color: "#22c55e", w: "100%" };
  return (
    <div style={{ marginTop: "6px" }}>
      <div style={{ height: "2px", borderRadius: "4px", background: "var(--border-subtle)", overflow: "hidden" }}>
        <div style={{ height: "100%", width: s.w, background: s.color, transition: "width 0.3s, background 0.3s" }} />
      </div>
      <span className="au-sans" style={{ fontSize: "11px", color: s.color, fontWeight: 600, marginTop: "4px", display: "block" }}>{s.label}</span>
    </div>
  );
}

function VerifyPrompt({ email, type, onResend, resendLoading, resendMsg }) {
  const router = useRouter();
  useEffect(() => {
    if (!email || type !== "user") return;
    const iv = setInterval(async () => {
      try {
        const r = await fetchAPI(`${API}/check-verified?email=${encodeURIComponent(email)}`);
        const d = await r.json();
        if (d.verified && d.user) {
          clearInterval(iv);
          localStorage.setItem("user", JSON.stringify(d.user));
          router.push("/page");
        }
      } catch {}
    }, 3000);
    return () => clearInterval(iv);
  }, [email, type, router]);

  return (
    <div style={{ textAlign: "center" }}>
      <div style={{
        width: "64px", height: "64px",
        border: "1px solid var(--border-subtle)", borderRadius: "12px",
        display: "flex", alignItems: "center", justifyContent: "center",
        margin: "0 auto 24px", fontSize: "28px",
        background: "var(--bg-input)",
      }}>✉️</div>

      <h2 className="au-serif" style={{
        fontSize: "28px", fontWeight: 300,
        color: "var(--text-primary)", margin: "0 0 12px",
        letterSpacing: "-0.02em", transition: "color 0.3s",
      }}>
        Check your<br /><em style={{ fontStyle: "italic" }}>email.</em>
      </h2>

      <p className="au-sans" style={{ color: "var(--text-muted)", fontSize: "13px", fontWeight: 300, lineHeight: 1.7, margin: "0 0 8px" }}>
        We sent a verification link to
      </p>
      <p className="au-sans" style={{ color: "var(--text-accent)", fontWeight: 600, fontSize: "14px", margin: "0 0 28px", wordBreak: "break-all" }}>
        {email}
      </p>

      {type === "user" && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", marginBottom: "20px" }}>
          {[0, 0.2, 0.4].map((delay, i) => (
            <div key={i} style={{
              width: "7px", height: "7px", borderRadius: "50%",
              background: "var(--text-accent)",
              animation: `au-pulse 1.4s ease-in-out ${delay}s infinite`,
            }} />
          ))}
          <span className="au-sans" style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: 400, marginLeft: "6px" }}>
            Waiting for verification…
          </span>
        </div>
      )}

      {resendMsg
        ? <p className="au-sans" style={{ color: "#22c55e", fontSize: "13px", fontWeight: 600, marginBottom: "16px" }}>{resendMsg}</p>
        : <button className="au-sans" onClick={onResend} disabled={resendLoading} style={{
            background: "none", border: "1px solid var(--border-subtle)",
            borderRadius: "8px", padding: "9px 20px",
            color: "var(--text-accent)", fontWeight: 600, fontSize: "13px",
            cursor: resendLoading ? "not-allowed" : "pointer",
            opacity: resendLoading ? 0.6 : 1, marginBottom: "20px",
            fontFamily: "'Outfit', sans-serif",
          }}>
            {resendLoading ? "Sending…" : "Resend link"}
          </button>
      }

      <p className="au-sans" style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "12px" }}>
        <a href="/signin" style={{ color: "var(--text-accent)", fontWeight: 600, textDecoration: "none" }}>← Back to sign in</a>
      </p>
    </div>
  );
}

export default function SignUpPage() {
  const router = useRouter();
  const [mode, setMode] = useState("user");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [verifyEmail, setVerifyEmail] = useState("");
  const [verifyType, setVerifyType] = useState("");
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMsg, setResendMsg] = useState("");

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

  const match    = confirm && password === confirm;
  const mismatch = confirm && password !== confirm;

  async function handleUserSignUp() {
    setError("");
    if (!username || !email || !password || !confirm) { setError("Please fill in all fields"); return; }
    if (password.length < 8) { setError("Password must be at least 8 characters"); return; }
    if (password !== confirm) { setError("Passwords do not match"); return; }
    setLoading(true);
    try {
      const r = await fetchAPI(`${API}/createUser`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password, passwordMatch: confirm }),
      });
      const d = await r.json();
      if (!r.ok) { setError(d.message || "Registration failed"); return; }
      setVerifyEmail(email); setVerifyType("user");
    } catch { setError("Could not connect to server. Please try again."); }
    finally { setLoading(false); }
  }

  async function handleClubSignUp() {
    setError("");
    if (!clubName || !clubCategory || !clubEmail || !clubDesc) { setError("Please fill in all required fields"); return; }
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("name", clubName); fd.append("category", clubCategory);
      fd.append("email", clubEmail); fd.append("description", clubDesc);
      if (clubPhone) fd.append("phone", clubPhone);
      if (clubWebsite) fd.append("website", clubWebsite);
      const r = await fetchAPI(`${API}/registerClub`, { method: "POST", body: fd });
      const d = await r.json();
      if (!r.ok) { setError(d.message || "Registration failed"); return; }
      setVerifyEmail(clubEmail); setVerifyType("club");
    } catch { setError("Could not connect to server."); }
    finally { setLoading(false); }
  }

  async function handleResend() {
    setResendLoading(true); setResendMsg("");
    try {
      const r = await fetchAPI(`${API}/resend-verification`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: verifyEmail, type: verifyType }),
      });
      const d = await r.json();
      setResendMsg(d.message || "Link sent.");
    } catch { setResendMsg("Failed to send. Please try again."); }
    finally { setResendLoading(false); }
  }

  const inp = { className: "au-input", autoComplete: "new-password" };
  const eyeOpen   = <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>;
  const eyeClosed = <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>;

  // Hardcode light/beige colours — signup page is always light regardless of theme
  const LIGHT = {
    "--bg-page":        "#fafaf8",
    "--bg-card":        "#ffffff",
    "--bg-input":       "#f3efe8",
    "--text-primary":   "#1a1714",
    "--text-secondary": "#4a4238",
    "--text-muted":     "#9a8f82",
    "--text-on-accent": "#ffffff",
    "--border-subtle":  "rgba(0,0,0,0.07)",
    "--border-card":    "rgba(0,0,0,0.06)",
    "--border-input":   "rgba(0,0,0,0.11)",
    "--accent":         "#1d6fbc",
    "--accent-soft":    "rgba(29,111,188,0.08)",
    "--accent-glow":    "rgba(29,111,188,0.18)",
  };

  return (
    <div style={{ minHeight: "100vh", background: "#fafaf8", display: "flex", flexDirection: "column", ...LIGHT }}>
      <style>{CSS}</style>
      <div style={{
        padding: "20px 32px",
        borderBottom: "1px solid var(--border-subtle)",
        background: "var(--bg-card)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        transition: "background 0.3s",
      }}>
        <a href="/page" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ width: "24px", height: "24px", background: "var(--text-primary)", borderRadius: "4px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <img src="/assets/logo_white.png" alt="" width={14} height={14} />
          </div>
          <span className="au-serif" style={{ fontSize: "18px", fontWeight: 600, fontStyle: "normal", color: "var(--text-primary)", letterSpacing: "0.01em" }}>
            Duguilan<span style={{ fontStyle: "italic", color: "var(--text-accent)" }}>.mn</span>
          </span>
        </a>
        <a href="/signin" className="au-sans" style={{ fontSize: "13px", fontWeight: 500, color: "var(--text-muted)", textDecoration: "none", transition: "color 0.2s" }}
          onMouseEnter={e => e.target.style.color = "var(--text-primary)"}
          onMouseLeave={e => e.target.style.color = "var(--text-muted)"}
        >
          Have an account? <span style={{ color: "var(--text-accent)", fontWeight: 600 }}>Sign in</span>
        </a>
      </div>

      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "48px 16px" }}>
        <div className="au-card" style={{ width: "100%", maxWidth: "440px" }}>

          {verifyEmail ? (
            <VerifyPrompt
              email={verifyEmail} type={verifyType}
              onResend={handleResend} resendLoading={resendLoading} resendMsg={resendMsg}
            />
          ) : (
            <>
              <div style={{ marginBottom: "32px" }}>
                <h1 className="au-serif" style={{
                  fontSize: "36px", fontWeight: 300, lineHeight: 1.1,
                  color: "var(--text-primary)", margin: "0 0 8px",
                  letterSpacing: "-0.02em", transition: "color 0.3s",
                }}>
                  Create an<br />
                  <em style={{ fontStyle: "italic", fontWeight: 400 }}>account.</em>
                </h1>
                <p className="au-sans" style={{ fontSize: "14px", fontWeight: 300, color: "var(--text-muted)", margin: 0 }}>
                  Join Duguilan.com today.
                </p>
              </div>
              <div style={{
                display: "flex", background: "var(--bg-input)",
                border: "1px solid var(--border-subtle)",
                borderRadius: "8px", padding: "3px", marginBottom: "28px",
              }}>
                {[["user", "Personal"], ["club", "Club"]].map(([m, lbl]) => (
                  <button key={m} onClick={() => { setMode(m); setError(""); }} className="au-sans" style={{
                    flex: 1, padding: "9px",
                    borderRadius: "6px", border: "none", cursor: "pointer",
                    fontSize: "13px", fontWeight: mode === m ? 600 : 400,
                    background: mode === m ? "var(--bg-card)" : "transparent",
                    color: mode === m ? "var(--text-primary)" : "var(--text-muted)",
                    boxShadow: mode === m ? "0 1px 6px rgba(0,0,0,0.08)" : "none",
                    transition: "all 0.2s",
                  }}>{lbl}</button>
                ))}
              </div>

              {error && <div className="au-error" style={{ marginBottom: "20px" }}>{error}</div>}

              {mode === "user" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  <div>
                    <label className="au-label">Username</label>
                    <input {...inp} type="text" placeholder="your_username" value={username} onChange={e => setUsername(e.target.value)} />
                  </div>
                  <div>
                    <label className="au-label">Email</label>
                    <input {...inp} type="email" placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)} />
                  </div>
                  <div>
                    <label className="au-label">Password</label>
                    <div style={{ position: "relative" }}>
                      <input {...inp} type={showPw ? "text" : "password"} placeholder="Min. 8 characters" value={password} onChange={e => setPassword(e.target.value)} style={{ paddingRight: "42px" }} />
                      <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", padding: 0 }}>{showPw ? eyeClosed : eyeOpen}</button>
                    </div>
                    <PasswordStrength pw={password} />
                  </div>
                  <div>
                    <label className="au-label">Confirm Password</label>
                    <div style={{ position: "relative" }}>
                      <input {...inp} type={showCf ? "text" : "password"} placeholder="Re-enter password" value={confirm} onChange={e => setConfirm(e.target.value)}
                        style={{ paddingRight: "42px", borderColor: mismatch ? "#ef4444" : match ? "#22c55e" : undefined }} />
                      <button type="button" onClick={() => setShowCf(!showCf)} style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", padding: 0 }}>{showCf ? eyeClosed : eyeOpen}</button>
                    </div>
                    {mismatch && <span className="au-sans" style={{ fontSize: "11px", color: "#ef4444", fontWeight: 600, marginTop: "4px", display: "block" }}>Passwords don&apos;t match</span>}
                    {match && <span className="au-sans" style={{ fontSize: "11px", color: "#22c55e", fontWeight: 600, marginTop: "4px", display: "block" }}>Passwords match ✓</span>}
                  </div>
                  <button className="au-btn-primary" onClick={handleUserSignUp} disabled={loading} style={{ marginTop: "4px" }}>
                    {loading ? "Creating account…" : "Create Account →"}
                  </button>
                </div>
              )}

              {mode === "club" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  <div>
                    <label className="au-label">Club Name</label>
                    <input {...inp} type="text" placeholder="e.g. Ulaanbaatar FC" value={clubName} onChange={e => setClubName(e.target.value)} />
                  </div>
                  <div>
                    <label className="au-label">Category</label>
                    <select className="au-input" value={clubCategory} onChange={e => setClubCategory(e.target.value)} style={{
                      appearance: "none", cursor: "pointer",
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23888' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
                      backgroundRepeat: "no-repeat", backgroundPosition: "right 14px center",
                    }}>
                      <option value="">Select a category…</option>
                      {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="au-label">Contact Email</label>
                    <input {...inp} type="email" placeholder="club@email.com" value={clubEmail} onChange={e => setClubEmail(e.target.value)} />
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                    <div>
                      <label className="au-label">Phone</label>
                      <input {...inp} type="tel" placeholder="+976 ···" value={clubPhone} onChange={e => setClubPhone(e.target.value)} />
                    </div>
                    <div>
                      <label className="au-label">Website</label>
                      <input {...inp} type="url" placeholder="https://…" value={clubWebsite} onChange={e => setClubWebsite(e.target.value)} />
                    </div>
                  </div>
                  <div>
                    <label className="au-label">About the Club</label>
                    <textarea className="au-input" placeholder="Brief description…" value={clubDesc} onChange={e => setClubDesc(e.target.value)} rows={3} style={{ resize: "vertical", lineHeight: 1.65 }} />
                  </div>
                  <button className="au-btn-primary" onClick={handleClubSignUp} disabled={loading} style={{ marginTop: "4px" }}>
                    {loading ? "Registering…" : "Register Club →"}
                  </button>
                  <p className="au-sans" style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: 300, textAlign: "center", margin: "4px 0 0", lineHeight: 1.6 }}>
                    Your club will be reviewed by an admin before going live.
                  </p>
                </div>
              )}

              <p className="au-sans" style={{ textAlign: "center", marginTop: "24px", fontSize: "13px", color: "var(--text-muted)" }}>
                Already have an account?{" "}
                <a href="/signin" style={{ color: "var(--text-accent)", fontWeight: 600, textDecoration: "none" }}>Sign in</a>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}