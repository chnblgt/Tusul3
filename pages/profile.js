import { useState } from "react";
import Header from "@/waterbottle/Header";
import Footer from "@/waterbottle/Footer";

const MOCK_USER = {
  name: "Bat-Erdene Gantulga",
  username: "baterdenee",
  avatar: null,
  bio: "Passionate about sports and community building in Ulaanbaatar.",
  location: "Ulaanbaatar, Mongolia",
  email: "bat@duguilan.mn",
  phone: "+976 9911 6769",
  joinedDate: "May 2026",
};

const MOCK_CLUBS = [
  { id: 1, name: "Naadam Heritage Club", category: "Culture", members: 340, enrolled: true, accent: "#22c55e", bg: "#f0fdf4" },
  { id: 2, name: "UB Photography Circle", category: "Arts", members: 218, enrolled: true, accent: "#a855f7", bg: "#faf5ff" },
  { id: 3, name: "Mongolian Hikers", category: "Outdoors", members: 892, enrolled: false, accent: "#f97316", bg: "#fff7ed" },
  { id: 4, name: "Tech Builders MN", category: "Technology", members: 155, enrolled: true, accent: "#3b82f6", bg: "#eff6ff" },
  { id: 5, name: "Ulaanbaatar Book Club", category: "Literature", members: 74, enrolled: false, accent: "#ef4444", bg: "#fef2f2" },
];

function getInitials(name) {
  return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
}

const fonts = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,700;0,9..144,800;1,9..144,700&family=DM+Sans:wght@400;500;600;700&display=swap');
  .pp-display { font-family: 'Fraunces', serif; }
  .pp-sans { font-family: 'DM Sans', sans-serif; }

  @keyframes pp-fadeUp { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }

  .pp-tab {
    font-family: 'DM Sans', sans-serif;
    font-size: 14px; font-weight: 500;
    color: #bbb; background: none; border: none;
    padding: 14px 20px; cursor: pointer;
    position: relative; transition: color 0.2s; line-height: 1;
  }
  .pp-tab.active { color: #1a0533; font-weight: 700; }
  .pp-tab.active::after {
    content: ''; position: absolute;
    bottom: -1px; left: 0; right: 0;
    height: 2px; background: #7c3aed;
    border-radius: 2px 2px 0 0;
  }
  .pp-tab:hover:not(.active) { color: #7c3aed; }

  .pp-club-card {
    background: #fff;
    border: 1.5px solid rgba(124,58,237,0.12);
    border-radius: 16px;
    padding: 22px;
    transition: transform 0.2s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.2s;
    cursor: pointer;
    text-decoration: none;
    display: block;
  }
  .pp-club-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 16px 40px rgba(26,5,51,0.1);
  }

  .pp-input {
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
  .pp-input:focus {
    border-color: #7c3aed;
    box-shadow: 0 0 0 3px rgba(124,58,237,0.1);
  }

  .pp-modal-overlay {
    position: fixed; inset: 0;
    background: rgba(13,1,24,0.5);
    display: flex; align-items: center; justify-content: center;
    z-index: 9000; padding: 24px;
    backdrop-filter: blur(4px);
  }
  .pp-modal {
    background: #fff; border-radius: 20px; padding: 36px;
    width: 100%; max-width: 480px;
    box-shadow: 0 24px 80px rgba(13,1,24,0.2);
    animation: pp-fadeUp 0.2s cubic-bezier(0.22,1,0.36,1);
  }
`;

export default function ProfilePage({ user = MOCK_USER }) {
  const [activeTab, setActiveTab] = useState("clubs");
  const [editOpen, setEditOpen] = useState(false);
  const [editData, setEditData] = useState({ ...user });
  const [saved, setSaved] = useState({ ...user });
  const [clubs, setClubs] = useState(MOCK_CLUBS);

  function handleSave() {
    setSaved({ ...editData });
    setEditOpen(false);
  }

  function toggleEnroll(id) {
    setClubs(prev => prev.map(c => c.id === id ? { ...c, enrolled: !c.enrolled } : c));
  }

  const enrolledClubs = clubs.filter(c => c.enrolled);
  const exploringClubs = clubs.filter(c => !c.enrolled);

  const labelStyle = {
    fontSize: "11px", fontWeight: 700, color: "#9879d4",
    letterSpacing: "0.1em", textTransform: "uppercase",
    display: "block", marginBottom: "7px", fontFamily: "'DM Sans', sans-serif",
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#fff" }}>
      <style>{fonts}</style>
      <Header user={saved} />
      <div style={{ height: "2px", background: "linear-gradient(90deg, #4c1d95, #7c3aed, #c4b5fd, #7c3aed, #4c1d95)" }} />

      {/* Dark hero banner */}
      <div style={{ height: "220px", background: "linear-gradient(135deg, #0d0118 0%, #1a0533 50%, #3b0764 100%)", position: "relative", overflow: "hidden" }}>
        {/* Decorative circles */}
        <div style={{ position: "absolute", top: "-60px", right: "-60px", width: "280px", height: "280px", borderRadius: "50%", background: "rgba(124,58,237,0.1)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "-40px", left: "20%", width: "160px", height: "160px", borderRadius: "50%", background: "rgba(167,139,250,0.06)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 40%, rgba(255,255,255,0.03) 100%)" }} />
      </div>

      <main style={{ flex: 1 }}>
        <div style={{ maxWidth: "960px", margin: "0 auto", padding: "0 48px 96px" }}>

          {/* Avatar row */}
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginTop: "-60px", paddingBottom: "28px", position: "relative", zIndex: 10 }}>
            <div style={{ display: "flex", alignItems: "flex-end", gap: "20px" }}>
              <div style={{
                width: "116px", height: "116px", borderRadius: "50%",
                border: "5px solid #fff", background: "#1a0533",
                color: "#fff", fontFamily: "'Fraunces', serif",
                fontSize: "34px", fontWeight: 800,
                display: "flex", alignItems: "center", justifyContent: "center",
                overflow: "hidden", flexShrink: 0,
                boxShadow: "0 8px 32px rgba(26,5,51,0.2)",
              }}>
                {saved.avatar
                  ? <img src={saved.avatar} alt={saved.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  : getInitials(saved.name)
                }
              </div>
            </div>

            <button onClick={() => setEditOpen(true)} className="pp-sans" style={{
              display: "flex", alignItems: "center", gap: "7px",
              padding: "11px 20px", borderRadius: "9px",
              border: "1.5px solid rgba(124,58,237,0.2)",
              background: "#fff", color: "#7c3aed",
              fontSize: "13.5px", fontWeight: 600, cursor: "pointer",
              transition: "all 0.2s", marginBottom: "6px",
            }}
              onMouseEnter={e => { e.currentTarget.style.background = "#f5f0ff"; e.currentTarget.style.borderColor = "#7c3aed"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.borderColor = "rgba(124,58,237,0.2)"; }}
            >
              <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
              Edit Profile
            </button>
          </div>

          {/* Name & info */}
          <div style={{ marginBottom: "36px" }}>
            <h1 className="pp-display" style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 800, color: "#1a0533", letterSpacing: "-0.04em", margin: "0 0 4px" }}>
              {saved.name}
            </h1>
            <p className="pp-sans" style={{ fontSize: "15px", color: "#9879d4", fontWeight: 500, margin: "0 0 12px" }}>
              @{saved.username}
            </p>
            {saved.bio && (
              <p className="pp-sans" style={{ fontSize: "15px", color: "#666", lineHeight: 1.7, margin: "0 0 18px", maxWidth: "500px" }}>
                {saved.bio}
              </p>
            )}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {[
                { icon: <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/>, text: saved.location },
                { icon: <><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></>, text: saved.email },
                { icon: <><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></>, text: `Joined ${saved.joinedDate}` },
              ].map(({ icon, text }) => (
                <span key={text} className="pp-sans" style={{
                  display: "inline-flex", alignItems: "center", gap: "6px",
                  fontSize: "13px", color: "#7c3aed", fontWeight: 500,
                  background: "#f5f0ff", border: "1px solid rgba(124,58,237,0.12)",
                  borderRadius: "20px", padding: "5px 12px",
                }}>
                  <svg width="12" height="12" fill="none" stroke="#9879d4" strokeWidth="2" viewBox="0 0 24 24">{icon}</svg>
                  {text}
                </span>
              ))}
            </div>
          </div>

          {/* Stats bar */}
          <div style={{
            display: "flex", gap: "32px", padding: "24px 28px",
            background: "#fdfcff", border: "1.5px solid rgba(124,58,237,0.1)",
            borderRadius: "16px", marginBottom: "40px",
            boxShadow: "0 2px 12px rgba(124,58,237,0.05)",
          }}>
            {[
              [enrolledClubs.length, "Clubs joined"],
              [clubs.length, "Clubs discovered"],
              ["UB", "City"],
            ].map(([val, lbl]) => (
              <div key={lbl}>
                <div className="pp-display" style={{ fontSize: "24px", fontWeight: 800, color: "#1a0533", letterSpacing: "-0.03em", lineHeight: 1 }}>{val}</div>
                <div className="pp-sans" style={{ fontSize: "11px", color: "#9879d4", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", marginTop: "4px" }}>{lbl}</div>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div style={{ borderBottom: "1px solid rgba(26,5,51,0.08)", marginBottom: "36px", display: "flex" }}>
            {[["clubs", "My Clubs"], ["activity", "Activity"]].map(([id, lbl]) => (
              <button key={id} className={`pp-tab${activeTab === id ? " active" : ""}`} onClick={() => setActiveTab(id)}>
                {lbl}
                {id === "clubs" && (
                  <span className="pp-sans" style={{
                    marginLeft: "7px", fontSize: "10px", fontWeight: 700,
                    background: activeTab === id ? "#f5f0ff" : "#f5f5f5",
                    color: activeTab === id ? "#7c3aed" : "#bbb",
                    borderRadius: "20px", padding: "2px 7px",
                  }}>{enrolledClubs.length}</span>
                )}
              </button>
            ))}
          </div>

          {/* CLUBS TAB */}
          {activeTab === "clubs" && (
            <div>
              {enrolledClubs.length > 0 && (
                <div style={{ marginBottom: "44px" }}>
                  <p className="pp-sans" style={{ fontSize: "10.5px", fontWeight: 700, color: "#9879d4", letterSpacing: "0.12em", textTransform: "uppercase", margin: "0 0 18px" }}>
                    Enrolled · {enrolledClubs.length}
                  </p>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "14px" }}>
                    {enrolledClubs.map(club => (
                      <div key={club.id} className="pp-club-card">
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px" }}>
                          <div style={{
                            width: "42px", height: "42px", borderRadius: "11px",
                            background: club.bg, border: `1.5px solid ${club.accent}22`,
                            display: "flex", alignItems: "center", justifyContent: "center",
                          }}>
                            <span style={{ fontSize: "18px", fontWeight: 800, color: club.accent, fontFamily: "'Fraunces', serif" }}>
                              {club.name[0]}
                            </span>
                          </div>
                          <span className="pp-sans" style={{
                            fontSize: "10px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase",
                            padding: "3px 8px", borderRadius: "5px",
                            background: "#f0fdf4", color: "#22c55e",
                          }}>Enrolled</span>
                        </div>
                        <div className="pp-display" style={{ fontSize: "16px", fontWeight: 800, color: "#1a0533", marginBottom: "4px", letterSpacing: "-0.02em" }}>{club.name}</div>
                        <div className="pp-sans" style={{ fontSize: "12px", color: "#888", marginBottom: "14px" }}>{club.category} · {club.members.toLocaleString()} members</div>
                        <button onClick={() => toggleEnroll(club.id)} className="pp-sans" style={{
                          width: "100%", padding: "9px", borderRadius: "8px",
                          border: "1.5px solid rgba(124,58,237,0.15)",
                          background: "none", color: "#7c3aed",
                          fontSize: "12.5px", fontWeight: 600, cursor: "pointer",
                          transition: "all 0.2s",
                        }}
                          onMouseEnter={e => { e.currentTarget.style.background = "#fef2f2"; e.currentTarget.style.color = "#ef4444"; e.currentTarget.style.borderColor = "rgba(239,68,68,0.2)"; }}
                          onMouseLeave={e => { e.currentTarget.style.background = "none"; e.currentTarget.style.color = "#7c3aed"; e.currentTarget.style.borderColor = "rgba(124,58,237,0.15)"; }}
                        >
                          Leave club
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {exploringClubs.length > 0 && (
                <div>
                  <p className="pp-sans" style={{ fontSize: "10.5px", fontWeight: 700, color: "#9879d4", letterSpacing: "0.12em", textTransform: "uppercase", margin: "0 0 18px" }}>
                    Explore more
                  </p>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "14px" }}>
                    {exploringClubs.map(club => (
                      <div key={club.id} className="pp-club-card" style={{ opacity: 0.75 }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px" }}>
                          <div style={{
                            width: "42px", height: "42px", borderRadius: "11px",
                            background: club.bg, border: `1.5px solid ${club.accent}22`,
                            display: "flex", alignItems: "center", justifyContent: "center",
                          }}>
                            <span style={{ fontSize: "18px", fontWeight: 800, color: club.accent, fontFamily: "'Fraunces', serif" }}>
                              {club.name[0]}
                            </span>
                          </div>
                        </div>
                        <div className="pp-display" style={{ fontSize: "16px", fontWeight: 800, color: "#1a0533", marginBottom: "4px", letterSpacing: "-0.02em" }}>{club.name}</div>
                        <div className="pp-sans" style={{ fontSize: "12px", color: "#888", marginBottom: "14px" }}>{club.category} · {club.members.toLocaleString()} members</div>
                        <button onClick={() => toggleEnroll(club.id)} className="pp-sans" style={{
                          width: "100%", padding: "9px", borderRadius: "8px",
                          border: "none",
                          background: "linear-gradient(135deg, #7c3aed, #4c1d95)",
                          color: "#fff",
                          fontSize: "12.5px", fontWeight: 600, cursor: "pointer",
                          transition: "opacity 0.2s",
                          boxShadow: "0 3px 12px rgba(124,58,237,0.25)",
                        }}
                          onMouseEnter={e => e.currentTarget.style.opacity = "0.88"}
                          onMouseLeave={e => e.currentTarget.style.opacity = "1"}
                        >
                          Join club →
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {clubs.length === 0 && (
                <div style={{ textAlign: "center", padding: "80px 0" }}>
                  <div style={{ width: "64px", height: "64px", borderRadius: "18px", background: "#f5f0ff", border: "1px solid rgba(124,58,237,0.12)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", fontSize: "28px" }}>
                    🏆
                  </div>
                  <h3 className="pp-display" style={{ fontSize: "20px", color: "#1a0533", marginBottom: "8px", fontWeight: 800 }}>No clubs yet</h3>
                  <p className="pp-sans" style={{ color: "#888", fontSize: "14px", marginBottom: "24px" }}>Browse clubs and join one that interests you</p>
                  <a href="/page1" className="pp-sans" style={{
                    background: "linear-gradient(135deg, #7c3aed, #4c1d95)", color: "#fff",
                    padding: "12px 28px", borderRadius: "9px",
                    fontWeight: 700, fontSize: "14px", textDecoration: "none",
                    boxShadow: "0 4px 16px rgba(124,58,237,0.3)",
                  }}>
                    Browse clubs →
                  </a>
                </div>
              )}
            </div>
          )}

          {/* ACTIVITY TAB */}
          {activeTab === "activity" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {[
                { icon: "🏆", text: `Joined Naadam Heritage Club`, time: "2 days ago", accent: "#22c55e" },
                { icon: "📸", text: `Joined UB Photography Circle`, time: "1 week ago", accent: "#a855f7" },
                { icon: "💻", text: `Joined Tech Builders MN`, time: "2 weeks ago", accent: "#3b82f6" },
                { icon: "✨", text: `Created Duguilan.mn account`, time: `${saved.joinedDate}`, accent: "#7c3aed" },
              ].map((item, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "center", gap: "16px",
                  padding: "18px 22px",
                  background: "#fff", border: "1.5px solid rgba(124,58,237,0.08)",
                  borderRadius: "14px",
                  boxShadow: "0 2px 8px rgba(124,58,237,0.04)",
                }}>
                  <div style={{
                    width: "40px", height: "40px", borderRadius: "11px", flexShrink: 0,
                    background: `${item.accent}18`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "18px",
                  }}>{item.icon}</div>
                  <div style={{ flex: 1 }}>
                    <p className="pp-sans" style={{ fontSize: "14px", color: "#1a0533", fontWeight: 500, margin: 0 }}>{item.text}</p>
                  </div>
                  <span className="pp-sans" style={{ fontSize: "12px", color: "#bbb", fontWeight: 500, flexShrink: 0 }}>{item.time}</span>
                </div>
              ))}
            </div>
          )}

        </div>
      </main>

      <Footer />

      {/* Edit Modal */}
      {editOpen && (
        <div className="pp-modal-overlay" onClick={e => e.target === e.currentTarget && setEditOpen(false)}>
          <div className="pp-modal">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "28px" }}>
              <h2 className="pp-display" style={{ fontSize: "22px", fontWeight: 800, color: "#1a0533", margin: 0, letterSpacing: "-0.03em" }}>
                Edit Profile
              </h2>
              <button onClick={() => setEditOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#c4b5fd", padding: 0 }}>
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M18 6 6 18M6 6l12 12"/>
                </svg>
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
              {[
                { key: "name", label: "Full Name", type: "text", placeholder: "Your full name" },
                { key: "username", label: "Username", type: "text", placeholder: "your_username" },
                { key: "email", label: "Email", type: "email", placeholder: "your@email.com" },
                { key: "phone", label: "Phone", type: "tel", placeholder: "+976 ···" },
                { key: "location", label: "Location", type: "text", placeholder: "City, Country" },
              ].map(({ key, label, type, placeholder }) => (
                <div key={key}>
                  <label className="pp-sans" style={labelStyle}>{label}</label>
                  <input
                    className="pp-input"
                    type={type}
                    placeholder={placeholder}
                    value={editData[key] || ""}
                    onChange={e => setEditData(d => ({ ...d, [key]: e.target.value }))}
                  />
                </div>
              ))}

              <div>
                <label className="pp-sans" style={labelStyle}>Bio</label>
                <textarea
                  className="pp-input"
                  placeholder="Tell people about yourself…"
                  value={editData.bio || ""}
                  onChange={e => setEditData(d => ({ ...d, bio: e.target.value }))}
                  rows={3}
                  style={{ resize: "vertical", lineHeight: 1.65 }}
                />
              </div>
            </div>

            <div style={{ display: "flex", gap: "12px", marginTop: "28px" }}>
              <button onClick={() => setEditOpen(false)} className="pp-sans" style={{
                flex: 1, padding: "13px", borderRadius: "9px",
                border: "1.5px solid rgba(124,58,237,0.2)", background: "none",
                color: "#555", fontSize: "14px", fontWeight: 600, cursor: "pointer",
              }}>
                Cancel
              </button>
              <button onClick={handleSave} className="pp-sans" style={{
                flex: 1, padding: "13px", borderRadius: "9px", border: "none",
                background: "linear-gradient(135deg, #7c3aed, #4c1d95)", color: "#fff",
                fontSize: "14px", fontWeight: 700, cursor: "pointer",
                boxShadow: "0 4px 16px rgba(124,58,237,0.3)",
              }}>
                Save changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}