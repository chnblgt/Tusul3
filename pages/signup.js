"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const fetchAPI = (url, options = {}) =>
  fetch(url, {
    ...options,
    headers: { "ngrok-skip-browser-warning": "true", ...options.headers },
  });


const fonts = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,700;0,9..144,800;1,9..144,700&family=DM+Sans:wght@400;500;600;700&display=swap');
  .su-display { font-family: 'Fraunces', serif; }
  .su-sans { font-family: 'DM Sans', sans-serif; }
  .su-input {
    width: 100%; padding: 13px 16px;
    border: 1.5px solid rgba(124,58,237,0.2); border-radius: 10px;
    font-size: 14px; color: #1a0533; background: #fdfcff;
    outline: none; box-sizing: border-box; font-family: 'DM Sans', sans-serif;
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  .su-input:focus { border-color: #7c3aed; box-shadow: 0 0 0 3px rgba(124,58,237,0.1); }
  .su-label { font-size: 11px; font-weight: 700; color: #9879d4; letter-spacing: 0.1em; text-transform: uppercase; display: block; margin-bottom: 7px; font-family: 'DM Sans', sans-serif; }
  .su-btn-primary {
    width: 100%; padding: 13px;
    background: linear-gradient(135deg, #7c3aed, #4c1d95); color: #fff;
    border: none; border-radius: 10px; font-size: 14px; font-weight: 700;
    cursor: pointer; font-family: 'DM Sans', sans-serif;
    transition: opacity 0.2s, transform 0.15s; box-shadow: 0 4px 16px rgba(124,58,237,0.3); margin-top: 4px;
  }
  .su-btn-primary:hover { opacity: 0.92; transform: translateY(-1px); }
  .su-btn-primary:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
  .su-mode-toggle { display: flex; background: #f5f0ff; border: 1.5px solid rgba(124,58,237,0.15); border-radius: 12px; padding: 4px; margin-bottom: 28px; }
  .su-mode-btn { flex: 1; padding: 10px; border: none; border-radius: 9px; font-size: 13.5px; font-weight: 600; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all 0.2s; }
  .su-error { background: #fef2f2; border: 1px solid rgba(239,68,68,0.2); border-radius: 8px; padding: 10px 14px; font-size: 13px; color: #dc2626; font-family: 'DM Sans', sans-serif; margin-bottom: 16px; }
  @keyframes su-fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
  .su-fadein { animation: su-fadeUp 0.45s cubic-bezier(0.22,1,0.36,1) forwards; }
  @keyframes su-pulse {
    0%, 100% { opacity: 0.3; transform: scale(1); }
    50%       { opacity: 1;   transform: scale(1.4); }
  }
`;

const CATEGORIES = [
  "Football","Basketball","Volleyball","Tennis","Swimming","Chess","Music","Art","Dance","Drama","Coding","Science","Wrestling","Boxing","Judo","Athletics","Other",
];

function PasswordStrength({ password }) {
  if (!password) return null;
  const s = password.length < 8
    ? { label: "Weak", color: "#ef4444", width: "33%" }
    : password.length < 12
      ? { label: "Fair", color: "#f59e0b", width: "66%" }
      : { label: "Strong", color: "#22c55e", width: "100%" };
  return (
    <div style={{ marginTop: "6px" }}>
      <div style={{ height: "3px", borderRadius: "4px", background: "rgba(124,58,237,0.1)", overflow: "hidden" }}>
        <div style={{ height: "100%", width: s.width, background: s.color, borderRadius: "4px", transition: "width 0.3s, background 0.3s" }} />
      </div>
      <span className="su-sans" style={{ fontSize: "11px", color: s.color, fontWeight: 600, marginTop: "4px", display: "block" }}>{s.label} password</span>
    </div>
  );
}

function InputField({ label, children }) {
  return <div><label className="su-label">{label}</label>{children}</div>;
}
function VerifyPrompt({ email, type, onResend, resendLoading, resendMsg }) {
  const router = useRouter();

  useEffect(() => {
    if (!email || type !== "user") return;
    const interval = setInterval(async () => {
      try {
        const res = await fetchAPI(`${API}/check-verified?email=${encodeURIComponent(email)}`);
        const data = await res.json();
        if (data.verified && data.user) {
          clearInterval(interval);
          localStorage.setItem("user", JSON.stringify(data.user));
          router.push("/page");
        }
      } catch (_) {}
    }, 3000);
    return () => clearInterval(interval);
  }, [email, type, router]);

  return (
    <div className="su-fadein" style={{ textAlign: "center" }}>
      <div style={{ width: "72px", height: "72px", borderRadius: "20px", background: "linear-gradient(135deg,#f5f0ff,#ede9fe)", border: "2px solid rgba(124,58,237,0.15)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", fontSize: "34px" }}>
        ✉️
      </div>
      <h2 className="su-display" style={{ fontSize: "22px", fontWeight: 800, color: "#1a0533", margin: "0 0 10px", letterSpacing: "-0.03em" }}>
        Имэйлээ шалгана уу
      </h2>
      <p className="su-sans" style={{ color: "#666", fontSize: "14px", lineHeight: 1.7, margin: "0 0 6px" }}>
        Баталгаажуулах линкийг
      </p>
      <p className="su-sans" style={{ color: "#7c3aed", fontWeight: 700, fontSize: "14px", margin: "0 0 28px", wordBreak: "break-all" }}>
        {email}
      </p>
      <p className="su-sans" style={{ color: "#888", fontSize: "13px", margin: "0 0 20px", lineHeight: 1.6 }}>
        руу илгээлээ. Линкийг дарж бүртгэлээ идэвхжүүлнэ үү.{type === "club" ? " Баталгаажсаны дараа admin хянах шатанд орно." : ""}
      </p>

      {type === "user" && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 20 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#7c3aed", animation: "su-pulse 1.4s ease-in-out infinite" }}/>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#7c3aed", animation: "su-pulse 1.4s ease-in-out 0.2s infinite" }}/>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#7c3aed", animation: "su-pulse 1.4s ease-in-out 0.4s infinite" }}/>
          <span className="su-sans" style={{ fontSize: 12.5, color: "#9879d4", fontWeight: 500, marginLeft: 4 }}>
            Баталгаажуулахыг хүлээж байна…
          </span>
        </div>
      )}

      {resendMsg ? (
        <p className="su-sans" style={{ color: "#22c55e", fontSize: "13px", fontWeight: 600, marginBottom: "16px" }}>{resendMsg}</p>
      ) : (
        <button
          className="su-sans"
          onClick={onResend}
          disabled={resendLoading}
          style={{ background: "none", border: "1.5px solid rgba(124,58,237,0.2)", borderRadius: "9px", padding: "10px 22px", color: "#7c3aed", fontWeight: 600, fontSize: "13px", cursor: resendLoading ? "not-allowed" : "pointer", opacity: resendLoading ? 0.6 : 1, marginBottom: "20px" }}
        >
          {resendLoading ? "Илгээж байна..." : "Линк дахин илгээх"}
        </button>
      )}

      <p className="su-sans" style={{ fontSize: "13px", color: "#9ca3af", marginTop: "12px" }}>
        <a href="/signin" style={{ color: "#7c3aed", fontWeight: 700, textDecoration: "none" }}>← Нэвтрэх хуудас руу буцах</a>
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
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showCf, setShowCf] = useState(false);
  const [clubName, setClubName] = useState("");
  const [clubCategory, setClubCategory] = useState("");
  const [clubEmail, setClubEmail] = useState("");
  const [clubPhone, setClubPhone] = useState("");
  const [clubWebsite, setClubWebsite] = useState("");
  const [clubDesc, setClubDesc] = useState("");

  const match = confirm && password === confirm;
  const mismatch = confirm && password !== confirm;

  async function handleUserSignUp() {
    setError("");
    if (!username || !email || !password || !confirm) { setError("Бүх талбарыг бөглөнө үү"); return; }
    if (password.length < 8) { setError("Нууц үг хамгийн багадаа 8 тэмдэгт байх ёстой"); return; }
    if (password !== confirm) { setError("Нууц үг таарахгүй байна"); return; }

    setLoading(true);
    try {
      const response = await fetchAPI(`${API}/createUser`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password, passwordMatch: confirm }),
      });
      const result = await response.json();
      if (!response.ok) { setError(result.message || "Бүртгэлд алдаа гарлаа"); return; }
      setVerifyEmail(email);
      setVerifyType("user");
    } catch {
      setError("Сервертэй холбогдож чадсангүй. Дахин оролдоно уу.");
    } finally {
      setLoading(false);
    }
  }

  async function handleClubSignUp() {
    setError("");
    if (!clubName || !clubCategory || !clubEmail || !clubDesc) { setError("Бүх талбарыг бөглөнө үү"); return; }
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("name", clubName);
      fd.append("category", clubCategory);
      fd.append("email", clubEmail);
      fd.append("description", clubDesc);
      if (clubPhone) fd.append("phone", clubPhone);
      if (clubWebsite) fd.append("website", clubWebsite);

      const response = await fetchAPI(`${API}/registerClub`, { method: "POST", body: fd });
      const result = await response.json();
      if (!response.ok) { setError(result.message || "Бүртгэлд алдаа гарлаа"); return; }
      setVerifyEmail(clubEmail);
      setVerifyType("club");
    } catch {
      setError("Сервертэй холбогдож чадсангүй. Дахин оролдоно уу.");
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    setResendLoading(true);
    setResendMsg("");
    try {
      const res = await fetchAPI(`${API}/resend-verification`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: verifyEmail, type: verifyType }),
      });
      const result = await res.json();
      setResendMsg(result.message || "Линк илгээлээ.");
    } catch {
      setResendMsg("Илгээхэд алдаа гарлаа. Дахин оролдоно уу.");
    } finally {
      setResendLoading(false);
    }
  }

  const inp = { className: "su-input", autoComplete: "new-password" };
  const selectStyle = { width: "100%", padding: "13px 16px", border: "1.5px solid rgba(124,58,237,0.2)", borderRadius: "10px", fontSize: "14px", color: "#1a0533", background: "#fdfcff", outline: "none", boxSizing: "border-box", fontFamily: "'DM Sans', sans-serif", appearance: "none", cursor: "pointer", backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%239879d4' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 14px center" };
  const eyeOpen = <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>;
  const eyeClosed = <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>;

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "radial-gradient(ellipse at 20% 30%, #ddd6fe 0%, #ede9fe 30%, #f5f3ff 55%, #faf5ff 75%, #ffffff 100%)" }}>
      <style>{fonts}</style>

      <div style={{ height: "3px", background: "linear-gradient(90deg, #4c1d95, #7c3aed, #c4b5fd, #7c3aed, #4c1d95)" }} />
      <div style={{ padding: "20px 36px" }}>
        <a href="/page" style={{ display: "inline-flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
          <img src="/assets/logo1.png" alt="Logo" width={28} height={28} style={{ borderRadius: "7px" }} />
          <span className="su-display" style={{ fontSize: "18px", fontWeight: 800, color: "#1a0533", letterSpacing: "-0.03em" }}>Duguilan.mn</span>
        </a>
      </div>

      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "16px 16px 64px" }}>
        <div style={{ width: "100%", maxWidth: "460px" }}>
          <div style={{ background: "#fff", border: "1.5px solid rgba(124,58,237,0.15)", borderRadius: "20px", padding: "44px 40px 40px", boxShadow: "0 12px 48px rgba(124,58,237,0.1), 0 2px 8px rgba(26,5,51,0.06)" }}>
            {verifyEmail ? (
              <VerifyPrompt
                email={verifyEmail}
                type={verifyType}
                onResend={handleResend}
                resendLoading={resendLoading}
                resendMsg={resendMsg}
              />
            ) : (
              <>
                <div style={{ display: "flex", justifyContent: "center", marginBottom: "24px" }}>
                  <div style={{ width: "56px", height: "56px", borderRadius: "14px", background: "linear-gradient(135deg, #1a0533, #3b0764)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 6px 20px rgba(26,5,51,0.25)" }}>
                    <a href="/page">
                      <img src="/assets/logo_white.png" alt="Logo" width={32} height={32} style={{ borderRadius: "7px" }} />
                    </a>
                  </div>
                </div>

                <h1 className="su-display" style={{ margin: "0 0 6px", textAlign: "center", fontSize: "24px", fontWeight: 800, color: "#1a0533", letterSpacing: "-0.04em" }}>Create an account</h1>
                <p className="su-sans" style={{ margin: "0 0 28px", textAlign: "center", fontSize: "13.5px", color: "#9879d4", fontWeight: 500 }}>Join Duguilan.mn today</p>

                <div className="su-mode-toggle">
                  {[["user", "Personal"], ["club", "Club"]].map(([m, lbl]) => (
                    <button key={m} className="su-mode-btn" onClick={() => { setMode(m); setError(""); }} style={{
                      background: mode === m ? "#fff" : "transparent", color: mode === m ? "#7c3aed" : "#9879d4",
                      boxShadow: mode === m ? "0 2px 8px rgba(124,58,237,0.15)" : "none",
                      border: mode === m ? "1px solid rgba(124,58,237,0.15)" : "1px solid transparent",
                    }}>{lbl}</button>
                  ))}
                </div>

                {error && <div className="su-error">{error}</div>}

                {mode === "user" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    <InputField label="Username">
                      <input {...inp} type="text" placeholder="your_username" value={username} onChange={e => setUsername(e.target.value)} />
                    </InputField>
                    <InputField label="Email">
                      <input {...inp} type="email" placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)} />
                    </InputField>
                    <InputField label="Password">
                      <div style={{ position: "relative" }}>
                        <input {...inp} type={showPw ? "text" : "password"} placeholder="Min. 8 characters" value={password} onChange={e => setPassword(e.target.value)} style={{ paddingRight: "44px" }} />
                        <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#c4b5fd" }}>{showPw ? eyeClosed : eyeOpen}</button>
                      </div>
                      <PasswordStrength password={password} />
                    </InputField>
                    <InputField label="Confirm Password">
                      <div style={{ position: "relative" }}>
                        <input {...inp} type={showCf ? "text" : "password"} placeholder="Re-enter your password" value={confirm} onChange={e => setConfirm(e.target.value)}
                          style={{ paddingRight: "44px", borderColor: mismatch ? "#ef4444" : match ? "#22c55e" : "rgba(124,58,237,0.2)" }} />
                        <button type="button" onClick={() => setShowCf(!showCf)} style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#c4b5fd" }}>{showCf ? eyeClosed : eyeOpen}</button>
                      </div>
                      {mismatch && <span className="su-sans" style={{ fontSize: "11px", color: "#ef4444", fontWeight: 600, marginTop: "4px", display: "block" }}>Passwords don&apos;t match</span>}
                      {match && <span className="su-sans" style={{ fontSize: "11px", color: "#22c55e", fontWeight: 600, marginTop: "4px", display: "block" }}>Passwords match ✓</span>}
                    </InputField>
                    <button className="su-btn-primary" onClick={handleUserSignUp} disabled={loading}>
                      {loading ? "Үүсгэж байна..." : "Create Account →"}
                    </button>
                  </div>
                )}

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
                      <input {...inp} type="email" placeholder="club@email.com" value={clubEmail} onChange={e => setClubEmail(e.target.value)} />
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
                      <textarea className="su-input" placeholder="Brief description…" value={clubDesc} onChange={e => setClubDesc(e.target.value)} rows={3} style={{ resize: "vertical", lineHeight: 1.6 }} />
                    </InputField>
                    <button className="su-btn-primary" onClick={handleClubSignUp} disabled={loading}>
                      {loading ? "Үүсгэж байна..." : "Register Club →"}
                    </button>
                    <p className="su-sans" style={{ fontSize: "12px", color: "#9879d4", textAlign: "center", margin: "4px 0 0", lineHeight: 1.5 }}>
                      Your club will be reviewed and approved by an admin before going live.
                    </p>
                  </div>
                )}

                <p className="su-sans" style={{ textAlign: "center", marginTop: "20px", fontSize: "13px", color: "#9ca3af" }}>
                  Already have an account?{" "}
                  <a href="/signin" style={{ color: "#7c3aed", fontWeight: 700, textDecoration: "none" }}>Sign in</a>
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}