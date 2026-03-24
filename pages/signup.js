"use client";

import { useState } from "react";

export default function SignUpForm() {
  const [mode, setMode] = useState("user"); // "user" | "club"

  // User fields
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Club fields
  const [clubName, setClubName] = useState("");
  const [clubCategory, setClubCategory] = useState("");
  const [clubEmail, setClubEmail] = useState("");
  const [clubPhone, setClubPhone] = useState("");
  const [clubWebsite, setClubWebsite] = useState("");
  const [clubDescription, setClubDescription] = useState("");
  const [clubPassword, setClubPassword] = useState("");
  const [clubConfirmPassword, setClubConfirmPassword] = useState("");
  const [showClubPassword, setShowClubPassword] = useState(false);
  const [showClubConfirm, setShowClubConfirm] = useState(false);

  const passwordStrength = (pw) => {
    if (!pw) return null;
    if (pw.length < 6) return { label: "Weak", color: "#ef4444", width: "33%" };
    if (pw.length < 10) return { label: "Fair", color: "#f59e0b", width: "66%" };
    return { label: "Strong", color: "#10b981", width: "100%" };
  };

  const userStrength = passwordStrength(password);
  const clubStrength = passwordStrength(clubPassword);

  const passwordsMatch = confirmPassword && password === confirmPassword;
  const passwordsMismatch = confirmPassword && password !== confirmPassword;
  const clubPasswordsMatch = clubConfirmPassword && clubPassword === clubConfirmPassword;
  const clubPasswordsMismatch = clubConfirmPassword && clubPassword !== clubConfirmPassword;

  const inputStyle = {
    width: "100%",
    padding: "13px 16px",
    border: "1.5px solid #e5e7eb",
    borderRadius: "10px",
    fontSize: "14px",
    color: "#111827",
    background: "#fff",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.2s",
  };

  const labelStyle = {
    fontSize: "12px",
    fontWeight: "600",
    color: "#6b7280",
    letterSpacing: "0.4px",
    textTransform: "uppercase",
  };

  const EyeOpen = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
    </svg>
  );

  const EyeClosed = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );

  const PasswordField = ({ label, value, onChange, show, onToggle, strength, match, mismatch, placeholder = "Min. 8 characters", isConfirm = false }) => (
    <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
      <label style={labelStyle}>{label}</label>
      <div style={{ position: "relative" }}>
        <input
          type={show ? "text" : "password"}
          placeholder={isConfirm ? "Re-enter your password" : placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{
            ...inputStyle,
            padding: "13px 44px 13px 16px",
            border: `1.5px solid ${mismatch ? "#ef4444" : match ? "#10b981" : "#e5e7eb"}`,
          }}
          onFocus={(e) => { if (!mismatch && !match) e.target.style.borderColor = "#a78bfa"; }}
          onBlur={(e) => { if (!mismatch && !match) e.target.style.borderColor = "#e5e7eb"; }}
        />
        <button type="button" onClick={onToggle}
          style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
          {show ? <EyeClosed /> : <EyeOpen />}
        </button>
      </div>
      {strength && !isConfirm && (
        <div style={{ marginTop: "4px" }}>
          <div style={{ height: "4px", borderRadius: "4px", background: "#f3f4f6", overflow: "hidden" }}>
            <div style={{ height: "100%", width: strength.width, background: strength.color, borderRadius: "4px", transition: "width 0.3s, background 0.3s" }} />
          </div>
          <span style={{ fontSize: "11px", color: strength.color, fontWeight: "600", marginTop: "3px", display: "block" }}>{strength.label} password</span>
        </div>
      )}
      {mismatch && <span style={{ fontSize: "11px", color: "#ef4444", fontWeight: "600" }}>Passwords do not match</span>}
      {match && <span style={{ fontSize: "11px", color: "#10b981", fontWeight: "600" }}>Passwords match ✓</span>}
    </div>
  );

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "radial-gradient(ellipse at 20% 30%, #ddd6fe 0%, #ede9fe 30%, #f5f3ff 55%, #faf5ff 75%, #ffffff 100%)",
      fontFamily: "'Segoe UI', system-ui, sans-serif",
      padding: "32px 16px",
    }}>
      <div style={{ position: "relative", width: "100%", maxWidth: "420px" }}>

        {/* Purple offset shadow */}
        <div style={{
          position: "absolute",
          inset: 0,
          borderRadius: "20px",
          background: "#a78bfa",
          transform: "translate(6px, 8px)",
          zIndex: 0,
        }} />

        {/* Main card */}
        <div style={{
          position: "relative",
          zIndex: 1,
          borderRadius: "20px",
          border: "2.5px solid #a78bfa",
          background: "rgba(255,255,255,0.97)",
          padding: "40px 36px 36px",
          boxShadow: "0 4px 32px rgba(167,139,250,0.15)",
        }}>

          {/* Logo */}
          <a href="/page" style={{ display: "flex", justifyContent: "center", marginBottom: "18px" }}>
            <img src="/assets/logo.png" alt="Logo" width={80} height={80} style={{ borderRadius: "10px" }} />
          </a>

          {/* Title */}
          <h1 style={{ margin: "0 0 6px", textAlign: "center", fontSize: "22px", fontWeight: "700", color: "#111827", letterSpacing: "-0.3px" }}>
            Create an account
          </h1>
          <p style={{ margin: "0 0 24px", textAlign: "center", fontSize: "13px", color: "#9ca3af" }}>
            Join Duguilan.mn today
          </p>

          {/* Toggle Buttons */}
          <div style={{
            display: "flex",
            gap: "8px",
            marginBottom: "28px",
            background: "#f3f4f6",
            borderRadius: "12px",
            padding: "4px",
          }}>
            {["user", "club"].map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMode(m)}
                style={{
                  flex: 1,
                  padding: "9px",
                  border: "none",
                  borderRadius: "9px",
                  fontSize: "13px",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  background: mode === m ? "#7c3aed" : "transparent",
                  color: mode === m ? "#fff" : "#6b7280",
                  boxShadow: mode === m ? "0 2px 8px rgba(124,58,237,0.25)" : "none",
                }}
              >
                {m === "user" ? "User" : "Club"}
              </button>
            ))}
          </div>

          {/* USER FORM */}
          {mode === "user" && (
            <form onSubmit={(e) => e.preventDefault()} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>

              <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                <label style={labelStyle}>Username</label>
                <input type="text" placeholder="e.g. Erdenebold Erdenetugs" value={username}
                  onChange={(e) => setUsername(e.target.value)} style={inputStyle}
                  onFocus={(e) => e.target.style.borderColor = "#a78bfa"}
                  onBlur={(e) => e.target.style.borderColor = "#e5e7eb"} />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                <label style={labelStyle}>Email</label>
                <div style={{ position: "relative" }}>
                  <input type="email" placeholder="your@email.com" value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ ...inputStyle, padding: "13px 16px 13px 42px" }}
                    onFocus={(e) => e.target.style.borderColor = "#a78bfa"}
                    onBlur={(e) => e.target.style.borderColor = "#e5e7eb"} />
                  <svg style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}
                    width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </div>
              </div>

              <PasswordField label="Create New Password" value={password} onChange={setPassword}
                show={showPassword} onToggle={() => setShowPassword(!showPassword)} strength={userStrength} />

              <PasswordField label="Confirm Password" value={confirmPassword} onChange={setConfirmPassword}
                show={showConfirm} onToggle={() => setShowConfirm(!showConfirm)}
                match={passwordsMatch} mismatch={passwordsMismatch} isConfirm />

              <button type="submit" style={{
                width: "100%", padding: "13px", background: "#7c3aed", color: "#fff",
                border: "none", borderRadius: "10px", fontSize: "14px", fontWeight: "600",
                cursor: "pointer", transition: "background 0.2s", marginTop: "4px",
              }}
                onMouseEnter={(e) => e.currentTarget.style.background = "#a78bfa"}
                onMouseLeave={(e) => e.currentTarget.style.background = "#7c3aed"}>
                Create Account
              </button>
            </form>
          )}

          {/* CLUB FORM */}
          {mode === "club" && (
            <form onSubmit={(e) => e.preventDefault()} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>

              <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                <label style={labelStyle}>Club Name</label>
                <input type="text" placeholder="e.g. Ulaanbaatar FC" value={clubName}
                  onChange={(e) => setClubName(e.target.value)} style={inputStyle}
                  onFocus={(e) => e.target.style.borderColor = "#a78bfa"}
                  onBlur={(e) => e.target.style.borderColor = "#e5e7eb"} />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                <label style={labelStyle}>Category / Sport</label>
                <select value={clubCategory} onChange={(e) => setClubCategory(e.target.value)}
                  style={{ ...inputStyle, appearance: "none", backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%239ca3af' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 14px center", cursor: "pointer" }}
                  onFocus={(e) => e.target.style.borderColor = "#a78bfa"}
                  onBlur={(e) => e.target.style.borderColor = "#e5e7eb"}>
                  <option value="">Select a category…</option>
                  <option>Football</option>
                  <option>Basketball</option>
                  <option>Volleyball</option>
                  <option>Wrestling</option>
                  <option>Boxing</option>
                  <option>Judo</option>
                  <option>Swimming</option>
                  <option>Athletics</option>
                  <option>Other</option>
                </select>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                <label style={labelStyle}>Contact Email</label>
                <div style={{ position: "relative" }}>
                  <input type="email" placeholder="club@email.com" value={clubEmail}
                    onChange={(e) => setClubEmail(e.target.value)}
                    style={{ ...inputStyle, padding: "13px 16px 13px 42px" }}
                    onFocus={(e) => e.target.style.borderColor = "#a78bfa"}
                    onBlur={(e) => e.target.style.borderColor = "#e5e7eb"} />
                  <svg style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}
                    width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </div>
              </div>

              <div style={{ display: "flex", gap: "10px" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "5px", flex: 1 }}>
                  <label style={labelStyle}>Phone</label>
                  <input type="tel" placeholder="+976 ···" value={clubPhone}
                    onChange={(e) => setClubPhone(e.target.value)} style={inputStyle}
                    onFocus={(e) => e.target.style.borderColor = "#a78bfa"}
                    onBlur={(e) => e.target.style.borderColor = "#e5e7eb"} />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "5px", flex: 1 }}>
                  <label style={labelStyle}>Website</label>
                  <input type="url" placeholder="https://…" value={clubWebsite}
                    onChange={(e) => setClubWebsite(e.target.value)} style={inputStyle}
                    onFocus={(e) => e.target.style.borderColor = "#a78bfa"}
                    onBlur={(e) => e.target.style.borderColor = "#e5e7eb"} />
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                <label style={labelStyle}>About the Club</label>
                <textarea placeholder="Brief description of your club, goals, history…" value={clubDescription}
                  onChange={(e) => setClubDescription(e.target.value)}
                  rows={3}
                  style={{ ...inputStyle, padding: "13px 16px", resize: "vertical", lineHeight: "1.5" }}
                  onFocus={(e) => e.target.style.borderColor = "#a78bfa"}
                  onBlur={(e) => e.target.style.borderColor = "#e5e7eb"} />
              </div>

              <PasswordField label="Create Password" value={clubPassword} onChange={setClubPassword}
                show={showClubPassword} onToggle={() => setShowClubPassword(!showClubPassword)} strength={clubStrength} />

              <PasswordField label="Confirm Password" value={clubConfirmPassword} onChange={setClubConfirmPassword}
                show={showClubConfirm} onToggle={() => setShowClubConfirm(!showClubConfirm)}
                match={clubPasswordsMatch} mismatch={clubPasswordsMismatch} isConfirm />

              <button type="submit" style={{
                width: "100%", padding: "13px", background: "#7c3aed", color: "#fff",
                border: "none", borderRadius: "10px", fontSize: "14px", fontWeight: "600",
                cursor: "pointer", transition: "background 0.2s", marginTop: "4px",
              }}
                onMouseEnter={(e) => e.currentTarget.style.background = "#a78bfa"}
                onMouseLeave={(e) => e.currentTarget.style.background = "#7c3aed"}>
                Register Club
              </button>
            </form>
          )}

          {/* Divider */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px", margin: "22px 0" }}>
            <div style={{ flex: 1, height: "1px", background: "#e5e7eb" }} />
            <span style={{ fontSize: "13px", color: "#9ca3af" }}>or</span>
            <div style={{ flex: 1, height: "1px", background: "#e5e7eb" }} />
          </div>

          {/* Social Buttons */}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <button style={{
              width: "100%", padding: "13px", background: "#1877F2", color: "#fff",
              border: "none", borderRadius: "10px", fontSize: "14px", fontWeight: "500",
              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
              gap: "10px", transition: "background 0.2s",
            }}
              onMouseEnter={(e) => e.currentTarget.style.background = "#166fe5"}
              onMouseLeave={(e) => e.currentTarget.style.background = "#1877F2"}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              Continue with Facebook
            </button>

            <button style={{
              width: "100%", padding: "13px", background: "#fff", color: "#374151",
              border: "1.5px solid #e5e7eb", borderRadius: "10px", fontSize: "14px", fontWeight: "500",
              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
              gap: "10px", transition: "background 0.2s",
            }}
              onMouseEnter={(e) => e.currentTarget.style.background = "#f9fafb"}
              onMouseLeave={(e) => e.currentTarget.style.background = "#fff"}>
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Continue with Gmail
            </button>
          </div>

          {/* Sign in link */}
          <p style={{ textAlign: "center", marginTop: "20px", fontSize: "13px", color: "#9ca3af" }}>
            Already have an account?{" "}
            <a href="/signin" style={{ color: "#7c3aed", fontWeight: "600", textDecoration: "none" }}
              onMouseEnter={(e) => e.target.style.textDecoration = "underline"}
              onMouseLeave={(e) => e.target.style.textDecoration = "none"}>
              Sign in
            </a>
          </p>

        </div>
      </div>
    </div>
  );
}