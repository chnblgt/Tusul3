"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";

const fonts = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,700;0,9..144,800;1,9..144,700&family=DM+Sans:wght@400;500;600;700&display=swap');
  .si-display { font-family: 'Fraunces', serif; }
  .si-sans { font-family: 'DM Sans', sans-serif; }
  .si-input {
    width: 100%; padding: 13px 16px;
    border: 1.5px solid rgba(124,58,237,0.2); border-radius: 10px;
    font-size: 14px; color: #1a0533; background: #fdfcff;
    outline: none; box-sizing: border-box; font-family: 'DM Sans', sans-serif;
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  .si-input:focus { border-color: #7c3aed; box-shadow: 0 0 0 3px rgba(124,58,237,0.1); }
  .si-btn-primary {
    width: 100%; padding: 13px;
    background: linear-gradient(135deg, #7c3aed, #4c1d95);
    color: #fff; border: none; border-radius: 10px;
    font-size: 14px; font-weight: 700; cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s;
    box-shadow: 0 4px 16px rgba(124,58,237,0.3);
  }
  .si-btn-primary:hover { opacity: 0.92; transform: translateY(-1px); }
  .si-btn-primary:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
  .si-social-btn {
    width: 100%; padding: 13px; border-radius: 10px;
    font-size: 14px; font-weight: 500; cursor: pointer;
    display: flex; align-items: center; justify-content: center; gap: 10px;
    font-family: 'DM Sans', sans-serif; transition: background 0.2s, transform 0.15s, opacity 0.2s;
  }
  .si-social-btn:hover { transform: translateY(-1px); }
  .si-social-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
  .si-error {
    background: #fef2f2; border: 1px solid rgba(239,68,68,0.2);
    border-radius: 8px; padding: 10px 14px;
    font-size: 13px; color: #dc2626; font-family: 'DM Sans', sans-serif;
  }
`;

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";
const FACEBOOK_APP_ID = process.env.NEXT_PUBLIC_FACEBOOK_APP_ID || "";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (GOOGLE_CLIENT_ID) {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = () => {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleGoogleCallback,
        });
      };
      document.body.appendChild(script);
    }

    if (FACEBOOK_APP_ID) {
      window.fbAsyncInit = function () {
        window.FB.init({ appId: FACEBOOK_APP_ID, cookie: true, xfbml: true, version: "v18.0" });
      };
      const script = document.createElement("script");
      script.src = "https://connect.facebook.net/en_US/sdk.js";
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    }
  }, []);

  async function saveUserAndRedirect(user) {
    localStorage.setItem("user", JSON.stringify(user));
    router.push("/page");
  }

  async function handleSignIn() {
    setError("");
    if (!email || !password) { setError("Имэйл болон нууц үгээ оруулна уу"); return; }
    setLoading(true);
    try {
      const response = await fetch(`${API}/signin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const result = await response.json();
      if (!response.ok) { setError(result.message || "Нэвтрэхэд алдаа гарлаа"); return; }
      await saveUserAndRedirect(result.user);
    } catch (err) {
      setError("Сервертэй холбогдож чадсангүй. Backend ажиллаж байгаа эсэхийг шалгана уу.");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleCallback(response) {
    if (!response.credential) return;
    setSocialLoading("google");
    setError("");
    try {
      const tokenRes = await fetch("https://oauth2.googleapis.com/tokeninfo?id_token=" + response.credential);
      const tokenData = await tokenRes.json();

      const res = await fetch(`${API}/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: tokenData.access_token || response.credential })
      });
      const result = await res.json();
      if (!res.ok) { setError(result.message || "Google нэвтрэлт амжилтгүй"); return; }
      await saveUserAndRedirect(result.user);
    } catch (e) {
      setError("Google нэвтрэлт амжилтгүй боллоо");
    } finally {
      setSocialLoading("");
    }
  }

  function handleGoogleClick() {
    if (!GOOGLE_CLIENT_ID) {
      setError("Google нэвтрэлт тохируулагдаагүй байна. .env файлд NEXT_PUBLIC_GOOGLE_CLIENT_ID нэмнэ үү.");
      return;
    }
    if (window.google) {
      window.google.accounts.id.prompt();
    }
  }

  function handleFacebookClick() {
    if (!FACEBOOK_APP_ID) {
      setError("Facebook нэвтрэлт тохируулагдаагүй байна. .env файлд NEXT_PUBLIC_FACEBOOK_APP_ID нэмнэ үү.");
      return;
    }
    setSocialLoading("facebook");
    setError("");
    window.FB.login(async (response) => {
      if (response.authResponse) {
        try {
          const res = await fetch(`${API}/auth/facebook`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token: response.authResponse.accessToken })
          });
          const result = await res.json();
          if (!res.ok) { setError(result.message || "Facebook нэвтрэлт амжилтгүй"); return; }
          await saveUserAndRedirect(result.user);
        } catch (e) {
          setError("Facebook нэвтрэлт амжилтгүй боллоо");
        } finally {
          setSocialLoading("");
        }
      } else {
        setError("Facebook нэвтрэлтийг цуцаллаа");
        setSocialLoading("");
      }
    }, { scope: "public_profile,email" });
  }

  return (
    <div style={{
      minHeight: "100vh", display: "flex", flexDirection: "column",
      background: "radial-gradient(ellipse at 20% 30%, #ddd6fe 0%, #ede9fe 30%, #f5f3ff 55%, #faf5ff 75%, #ffffff 100%)",
    }}>
      <style>{fonts}</style>
      <div style={{ height: "3px", background: "linear-gradient(90deg, #4c1d95, #7c3aed, #c4b5fd, #7c3aed, #4c1d95)" }} />

      <div style={{ padding: "20px 36px" }}>
        <a href="/page" style={{ display: "inline-flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
          <img src="/assets/logo1.png" alt="Logo" width={28} height={28} style={{ borderRadius: "7px" }} />
          <span className="si-display" style={{ fontSize: "18px", fontWeight: 800, color: "#1a0533", letterSpacing: "-0.03em" }}>
            Duguilan.mn
          </span>
        </a>
      </div>

      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px 16px 64px" }}>
        <div style={{ width: "100%", maxWidth: "420px" }}>
          <div style={{
            background: "#fff", border: "1.5px solid rgba(124,58,237,0.15)",
            borderRadius: "20px", padding: "44px 40px 40px",
            boxShadow: "0 12px 48px rgba(124,58,237,0.1), 0 2px 8px rgba(26,5,51,0.06)",
          }}>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: "28px" }}>
              <div style={{
                width: "64px", height: "64px", borderRadius: "16px",
                background: "linear-gradient(135deg, #1a0533, #3b0764)",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 8px 24px rgba(26,5,51,0.25)",
              }}>
                <img src="/assets/logo_white.png" alt="Logo" width={36} height={36} style={{ borderRadius: "8px" }} />
              </div>
            </div>

            <h1 className="si-display" style={{ margin: "0 0 6px", textAlign: "center", fontSize: "26px", fontWeight: 800, color: "#1a0533", letterSpacing: "-0.04em" }}>
              Welcome back
            </h1>
            <p className="si-sans" style={{ margin: "0 0 32px", textAlign: "center", fontSize: "13.5px", color: "#9879d4", fontWeight: 500 }}>
              Sign in to Duguilan.mn
            </p>

            {error && <div className="si-error" style={{ marginBottom: "20px" }}>{error}</div>}

            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div>
                <label className="si-sans" style={{ fontSize: "11px", fontWeight: 700, color: "#9879d4", letterSpacing: "0.1em", textTransform: "uppercase", display: "block", marginBottom: "7px" }}>
                  Email
                </label>
                <input className="si-input" type="email" placeholder="your@email.com" autoComplete="new-password" value={email} onChange={e => setEmail(e.target.value)} />
              </div>

              <div>
                <label className="si-sans" style={{ fontSize: "11px", fontWeight: 700, color: "#9879d4", letterSpacing: "0.1em", textTransform: "uppercase", display: "block", marginBottom: "7px" }}>
                  Password
                </label>
                <div style={{ position: "relative" }}>
                    <input
                    className="si-input"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    autoComplete="new-password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && handleSignIn()}
                    style={{ paddingRight: "44px" }}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", padding: 0, color: "#c4b5fd" }}>
                    {showPassword
                      ? <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                      : <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    }
                  </button>
                </div>
              </div>

              <button className="si-btn-primary" style={{ marginTop: "4px" }} onClick={handleSignIn} disabled={loading}>
                {loading ? "Нэвтэрч байна..." : "Sign in →"}
              </button>

              <p className="si-sans" style={{ textAlign: "center", fontSize: "13px", color: "#9ca3af", margin: "4px 0 0" }}>
                Don't have an account?{" "}
                <a href="/signup" style={{ color: "#7c3aed", fontWeight: 700, textDecoration: "none" }}>Sign up</a>
              </p>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "12px", margin: "24px 0" }}>
              <div style={{ flex: 1, height: "1px", background: "rgba(124,58,237,0.1)" }} />
              <span className="si-sans" style={{ fontSize: "12px", color: "#c4b5fd", fontWeight: 500 }}>or continue with</span>
              <div style={{ flex: 1, height: "1px", background: "rgba(124,58,237,0.1)" }} />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <button
                className="si-social-btn"
                style={{ background: "#1877F2", color: "#fff", border: "none" }}
                onClick={handleFacebookClick}
                disabled={socialLoading === "facebook"}
                onMouseEnter={e => { if (socialLoading !== "facebook") e.currentTarget.style.background = "#166fe5"; }}
                onMouseLeave={e => e.currentTarget.style.background = "#1877F2"}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                {socialLoading === "facebook" ? "Холбогдож байна..." : "Continue with Facebook"}
              </button>

              <button
                className="si-social-btn"
                style={{ background: "#fff", color: "#374151", border: "1.5px solid rgba(124,58,237,0.15)" }}
                onClick={handleGoogleClick}
                disabled={socialLoading === "google"}
                onMouseEnter={e => { if (socialLoading !== "google") e.currentTarget.style.background = "#fdfcff"; }}
                onMouseLeave={e => e.currentTarget.style.background = "#fff"}
              >
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                {socialLoading === "google" ? "Холбогдож байна..." : "Continue with Google"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}