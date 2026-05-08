"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";
const FACEBOOK_APP_ID  = process.env.NEXT_PUBLIC_FACEBOOK_APP_ID  || "";

const fetchAPI = (url, opts = {}) =>
  fetch(url, { ...opts, headers: { "ngrok-skip-browser-warning": "true", ...opts.headers } });
const COLORS = {
  "--bg-page":        "#fafaf8",
  "--bg-card":        "#ffffff",
  "--bg-input":       "#f3efe8",
  "--text-primary":   "#1a1714",  
  "--text-secondary": "#3a342c",
  "--text-muted":     "#7a6f65",
  "--text-on-accent": "#ffffff",
  "--input-text":     "#1a1714",  
  "--border-subtle":  "rgba(0,0,0,0.08)",
  "--border-input":   "rgba(0,0,0,0.13)",
  "--border-card":    "rgba(0,0,0,0.06)",
  "--text-accent":    "#6030c8",   
  "--accent-soft":    "rgba(96,48,200,0.08)",
};

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,600;1,300;1,400&family=Outfit:wght@300;400;500;600;700&display=swap');
  .au-serif { font-family: 'Cormorant Garamond', serif; }
  .au-sans  { font-family: 'Outfit', sans-serif; }

  @keyframes au-up { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:none} }
  .au-card { animation: au-up 0.6s cubic-bezier(0.16,1,0.3,1) both; }

  /* ── Inputs: bigger, darker text ── */
  .au-input {
    width: 100%;
    padding: 15px 18px;                        /* +2px taller than before */
    border: 1px solid var(--border-input);
    border-radius: 8px;
    font-size: 15px;                           /* up from 14px */
    font-family: 'Outfit', sans-serif;
    font-weight: 400;
    color: #1a1714;                            /* hard-coded dark — never beige */
    background: var(--bg-input);
    outline: none;
    box-sizing: border-box;
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  .au-input::placeholder { color: #9a8f82; font-weight: 300; }
  .au-input:focus {
    border-color: var(--text-accent);
    box-shadow: 0 0 0 3px var(--accent-soft);
  }

  /* ── Labels ── */
  .au-label {
    font-family: 'Outfit', sans-serif;
    font-size: 10px; font-weight: 700;
    letter-spacing: 0.14em; text-transform: uppercase;
    color: var(--text-muted); display: block; margin-bottom: 8px;
  }

  /* ── Primary button — dark fill like signup ── */
  .au-btn-primary {
    width: 100%; padding: 15px;               /* matches input height */
    background: var(--text-primary);
    color: var(--bg-page);
    border: none; border-radius: 8px;
    font-size: 14px; font-weight: 600; letter-spacing: 0.04em;
    font-family: 'Outfit', sans-serif;
    cursor: pointer; transition: all 0.2s;
  }
  .au-btn-primary:hover { background: var(--text-accent); transform: translateY(-1px); }
  .au-btn-primary:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

  /* ── Social buttons ── */
  .au-btn-social {
    width: 100%; padding: 14px;
    background: var(--bg-input);
    color: var(--text-secondary);
    border: 1px solid var(--border-subtle);
    border-radius: 8px;
    font-size: 14px; font-weight: 500;
    font-family: 'Outfit', sans-serif;
    cursor: pointer; transition: all 0.2s;
    display: flex; align-items: center; justify-content: center; gap: 10px;
  }
  .au-btn-social:hover { background: #eceae4; color: var(--text-primary); transform: translateY(-1px); }
  .au-btn-social:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

  /* ── Error / warning banners ── */
  .au-error {
    background: rgba(239,68,68,0.08);
    border: 1px solid rgba(239,68,68,0.2);
    border-radius: 8px; padding: 11px 15px;
    font-size: 13px; color: #dc2626;
    font-family: 'Outfit', sans-serif; line-height: 1.5;
  }
  .au-warn {
    background: rgba(245,158,11,0.07);
    border: 1px solid rgba(245,158,11,0.2);
    border-radius: 8px; padding: 14px 16px;
    font-size: 13px; color: var(--text-secondary);
    font-family: 'Outfit', sans-serif; line-height: 1.65;
  }
`;

export default function SignInPage() {
  const router = useRouter();
  const [email,          setEmail]          = useState("");
  const [password,       setPassword]       = useState("");
  const [showPw,         setShowPw]         = useState(false);
  const [loading,        setLoading]        = useState(false);
  const [socialLoading,  setSocialLoading]  = useState("");
  const [error,          setError]          = useState("");
  const [unverified,     setUnverified]     = useState("");
  const [resendLoading,  setResendLoading]  = useState(false);
  const [resendMsg,      setResendMsg]      = useState("");

  useEffect(() => { setEmail(""); setPassword(""); }, []);
  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) return;
    const s = document.createElement("script");
    s.src = "https://accounts.google.com/gsi/client";
    s.async = true; s.defer = true;
    s.onload = () => {
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleGoogleCredential,
        auto_select: false,
      });
    };
    document.head.appendChild(s);
    return () => { try { document.head.removeChild(s); } catch {} };
  }, []);
  useEffect(() => {
    if (!FACEBOOK_APP_ID || window.FB) return;
    window.fbAsyncInit = () => {
      window.FB.init({ appId: FACEBOOK_APP_ID, cookie: true, xfbml: false, version: "v19.0" });
    };
    const s = document.createElement("script");
    s.src = "https://connect.facebook.net/en_US/sdk.js";
    s.async = true; s.defer = true;
    document.head.appendChild(s);
  }, []);

  function saveUser(user) {
    localStorage.setItem("user", JSON.stringify(user));
    router.push("/page");
  }

  async function handleSignIn() {
    setError(""); setUnverified(""); setResendMsg("");
    if (!email || !password) { setError("Please enter your email and password."); return; }
    setLoading(true);
    try {
      const res = await fetchAPI(`${API}/signin`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.status === 403 && data.requiresVerification) { setUnverified(email); return; }
      if (!res.ok) { setError(data.message || "Sign in failed."); return; }
      saveUser(data.user);
    } catch { setError("Could not connect. Please check your connection."); }
    finally { setLoading(false); }
  }

  async function handleResend() {
    setResendLoading(true); setResendMsg("");
    try {
      const res = await fetchAPI(`${API}/resend-verification`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: unverified, type: "user" }),
      });
      const data = await res.json();
      setResendMsg(data.message || "Link sent.");
    } catch { setResendMsg("Failed to send. Please try again."); }
    finally { setResendLoading(false); }
  }

  async function handleGoogleCredential(response) {
    if (!response?.credential) return;
    setSocialLoading("google"); setError("");
    try {
      const res = await fetchAPI(`${API}/auth/google`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: response.credential }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message || "Google sign-in failed."); return; }
      saveUser(data.user);
    } catch { setError("Google sign-in failed."); }
    finally { setSocialLoading(""); }
  }

  function handleGoogleClick() {
    if (!GOOGLE_CLIENT_ID) { setError("Google sign-in is not configured."); return; }
    window.google?.accounts.id.prompt();
  }

  function handleFacebookClick() {
    if (!FACEBOOK_APP_ID || !window.FB) { setError("Facebook sign-in is not configured."); return; }
    setSocialLoading("facebook"); setError("");
    window.FB.login(async res => {
      if (!res.authResponse) { setError("Facebook login cancelled."); setSocialLoading(""); return; }
      try {
        const r = await fetchAPI(`${API}/auth/facebook`, {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: res.authResponse.accessToken }),
        });
        const data = await r.json();
        if (!r.ok) { setError(data.message || "Facebook sign-in failed."); return; }
        saveUser(data.user);
      } catch { setError("Facebook sign-in failed."); }
      finally { setSocialLoading(""); }
    }, { scope: "public_profile,email" });
  }

  const eyeOpen = (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
    </svg>
  );
  const eyeClosed = (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#fafaf8", display: "flex", flexDirection: "column", ...COLORS }}>
      <style>{CSS}</style>
      <div id="g_id_hidden_btn" style={{ position: "absolute", opacity: 0, pointerEvents: "none" }} />
      <div style={{
        padding: "16px clamp(16px, 4vw, 40px)",
        borderBottom: "1px solid var(--border-subtle)",
        background: "var(--bg-card)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        transition: "background 0.3s",
      }}>
        <Link href="/page" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: "30px", height: "30px", background: "var(--text-primary)", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <img src="/assets/logo_white.png" alt="" width={17} height={17} />
          </div>
          <span className="au-serif" style={{ fontSize: "22px", fontWeight: 600, fontStyle: "normal", color: "var(--text-primary)", letterSpacing: "0.01em" }}>
            Duguilan<span style={{ fontStyle: "italic", color: "var(--text-accent)" }}>.com</span>
          </span>
        </Link>
        <Link href="/signup" className="au-sans"
          style={{ fontSize: "15px", fontWeight: 500, color: "var(--text-muted)", textDecoration: "none", transition: "color 0.2s" }}
          onMouseEnter={e => e.target.style.color = "var(--text-primary)"}
          onMouseLeave={e => e.target.style.color = "var(--text-muted)"}
        >
          No account? <span style={{ color: "var(--text-accent)", fontWeight: 600 }}>Sign up</span>
        </Link>
      </div>
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "48px 16px" }}>
        <div className="au-card" style={{ width: "100%", maxWidth: "440px" }}>
          <div style={{ marginBottom: "32px" }}>
            <h1 className="au-serif" style={{
              fontSize: "38px", fontWeight: 300, lineHeight: 1.1,
              color: "var(--text-primary)", margin: "0 0 8px",
              letterSpacing: "-0.02em",
            }}>
              Welcome <em style={{ fontStyle: "italic", color: "var(--text-accent)" }}>back.</em>
            </h1>
            <p className="au-sans" style={{ fontSize: "14px", fontWeight: 300, color: "var(--text-muted)", margin: 0 }}>
              Sign in to your Duguilan.com account.
            </p>
          </div>
          {unverified && (
            <div className="au-warn" style={{ marginBottom: "20px" }}>
              <p style={{ margin: "0 0 6px", fontWeight: 600, color: "var(--text-primary)" }}>Email not verified</p>
              <p style={{ margin: "0 0 10px" }}>
                We sent a verification link to <strong style={{ color: "var(--text-primary)" }}>{unverified}</strong>.
              </p>
              {resendMsg
                ? <p style={{ margin: 0, color: "#166534", fontWeight: 600 }}>{resendMsg}</p>
                : <button onClick={handleResend} disabled={resendLoading} style={{
                    background: "none", border: "none",
                    cursor: resendLoading ? "not-allowed" : "pointer",
                    color: "var(--text-accent)", fontWeight: 700, fontSize: "13px",
                    fontFamily: "'Outfit', sans-serif",
                    textDecoration: "underline", padding: 0, opacity: resendLoading ? 0.6 : 1,
                  }}>
                    {resendLoading ? "Sending…" : "Resend link →"}
                  </button>
              }
            </div>
          )}

          {error && <div className="au-error" style={{ marginBottom: "20px" }}>{error}</div>}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px", marginBottom: "24px" }}>
            <div>
              <label className="au-label">Email</label>
              <input
                className="au-input" type="email" placeholder="your@email.com"
                autoComplete="new-password" value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="au-label">Password</label>
              <div style={{ position: "relative" }}>
                <input
                  className="au-input"
                  type={showPw ? "text" : "password"}
                  placeholder="Enter your password"
                  autoComplete="new-password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleSignIn()}
                  style={{ paddingRight: "46px" }}
                />
                <button type="button" onClick={() => setShowPw(!showPw)} style={{
                  position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)",
                  background: "none", border: "none", cursor: "pointer",
                  color: "var(--text-muted)", padding: 0,
                }}>
                  {showPw ? eyeClosed : eyeOpen}
                </button>
              </div>
            </div>
          </div>

          <button className="au-btn-primary" onClick={handleSignIn} disabled={loading} style={{ marginBottom: "28px" }}>
            {loading ? "Signing in…" : "Sign in →"}
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
            <div style={{ flex: 1, height: "1px", background: "var(--border-subtle)" }} />
            <span className="au-sans" style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: 500 }}>or continue with</span>
            <div style={{ flex: 1, height: "1px", background: "var(--border-subtle)" }} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "28px" }}>
            <button className="au-btn-social" onClick={handleFacebookClick} disabled={!!socialLoading}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="#1877F2">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              {socialLoading === "facebook" ? "Connecting…" : "Facebook"}
            </button>
            <button className="au-btn-social" onClick={handleGoogleClick} disabled={!!socialLoading}>
              <svg width="17" height="17" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              {socialLoading === "google" ? "Connecting…" : "Google"}
            </button>
          </div>

          <p className="au-sans" style={{ textAlign: "center", fontSize: "13px", color: "var(--text-muted)", margin: 0 }}>
            Already have an account?{" "}
            <Link href="/signup" style={{ color: "var(--text-accent)", fontWeight: 600, textDecoration: "none" }}>Sign up</Link>
          </p>

        </div>
      </div>
    </div>
  );
}