import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Header from "@/waterbottle/Header";
import Footer from "@/waterbottle/Footer";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const DEFAULT_USER = {
  name: "User",
  username: "",
  avatar: null,
  bio: "",
  location: "",
  email: "",
  phone: "",
  joinedDate: "",
};

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

export default function ProfilePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("clubs");
  const [editOpen, setEditOpen] = useState(false);
  const [user, setUser] = useState(DEFAULT_USER);
  const [editData, setEditData] = useState(DEFAULT_USER);
  const [saved, setSaved] = useState(DEFAULT_USER);
  const [clubs, setClubs] = useState([]);
  const [totalClubs, setTotalClubs] = useState(0); 
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveError, setSaveError] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) { router.replace("/signin"); return; }
    const u = JSON.parse(stored);
    setUser(u);
    setSaved(u);
    setEditData(u);
    fetch(`${API}/myClubs/${u.id}`)
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          const colored = data.clubs.map((c, i) => ({
            ...c,
            enrolled: true,
            accent: ["#22c55e", "#a855f7", "#f97316", "#3b82f6", "#ef4444"][i % 5],
            bg:     ["#f0fdf4", "#faf5ff", "#fff7ed", "#eff6ff", "#fef2f2"][i % 5],
          }));
          setClubs(colored);
        }
      })
      .catch(() => {});
    fetch(`${API}/clubs`)
      .then(r => r.json())
      .then(data => { if (data.success) setTotalClubs(data.clubs.length); })
      .catch(() => {});
  }, []);

  async function toggleEnroll(clubId) {
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    const userId = storedUser.id;
    if (!userId) return;

    const isEnrolled = clubs.find(c => c.id === clubId)?.enrolled;

    try {
      if (isEnrolled) {
        await fetch(`${API}/leaveClub/${userId}/${clubId}`, { method: "DELETE" });
        setClubs(prev => prev.filter(c => c.id !== clubId));
      } else {
        await fetch(`${API}/joinClub`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, clubId }),
        });
        setClubs(prev => prev.map(c => c.id === clubId ? { ...c, enrolled: true } : c));
      }
    } catch (e) {
      console.error("Toggle enroll failed", e);
    }
  }

  async function handleSave() {
    setSaveError("");
    setSaveLoading(true);
    try {
      const res = await fetch(`${API}/updateUser/${saved.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name:     editData.name,
          bio:      editData.bio,
          location: editData.location,
          phone:    editData.phone,
        }),
      });
      const result = await res.json();
      if (!res.ok) { setSaveError(result.message || "Хадгалахад алдаа гарлаа"); return; }
      const updated = { ...saved, ...editData };
      setSaved(updated);
      localStorage.setItem("user", JSON.stringify(updated));
      setEditOpen(false);
    } catch {
      setSaveError("Сервертэй холбогдож чадсангүй.");
    } finally {
      setSaveLoading(false);
    }
  }

  const enrolledClubs = clubs.filter(c => c.enrolled);

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

      <div style={{ height: "220px", background: "linear-gradient(135deg, #0d0118 0%, #1a0533 50%, #3b0764 100%)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "-60px", right: "-60px", width: "280px", height: "280px", borderRadius: "50%", background: "rgba(124,58,237,0.1)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "-40px", left: "20%", width: "160px", height: "160px", borderRadius: "50%", background: "rgba(167,139,250,0.06)", pointerEvents: "none" }} />
      </div>

      <main style={{ flex: 1 }}>
        <div style={{ maxWidth: "960px", margin: "0 auto", padding: "0 48px 96px" }}>

          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginTop: "-60px", paddingBottom: "28px", position: "relative", zIndex: 10 }}>
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
                : getInitials(saved.name || "U")
              }
            </div>

            <button onClick={() => setEditOpen(true)} className="pp-sans" style={{
              display: "flex", alignItems: "center", gap: "7px",
              padding: "11px 20px", borderRadius: "9px",
              border: "1.5px solid rgba(124,58,237,0.2)",
              background: "#fff", color: "#7c3aed",
              fontSize: "13.5px", fontWeight: 600, cursor: "pointer",
              transition: "all 0.2s", marginBottom: "6px",
            }}>
              Edit Profile
            </button>
          </div>

          <div style={{ marginBottom: "36px" }}>
            <h1 className="pp-display" style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 800, color: "#1a0533", letterSpacing: "-0.04em", margin: "0 0 4px" }}>
              {saved.name || saved.username}
            </h1>
            <p className="pp-sans" style={{ fontSize: "15px", color: "#9879d4", fontWeight: 500, margin: "0 0 12px" }}>
              @{saved.username}
            </p>
            {saved.bio && (
              <p className="pp-sans" style={{ fontSize: "15px", color: "#666", lineHeight: 1.7, margin: "0 0 18px", maxWidth: "500px" }}>
                {saved.bio}
              </p>
            )}
          </div>
          <div style={{
            display: "flex", gap: "32px", padding: "24px 28px",
            background: "#fdfcff", border: "1.5px solid rgba(124,58,237,0.1)",
            borderRadius: "16px", marginBottom: "40px",
          }}>
            {[
              [enrolledClubs.length, "Clubs joined"],
              [totalClubs, "Clubs available"],
              ["UB", "City"],
            ].map(([val, lbl]) => (
              <div key={lbl}>
                <div className="pp-display" style={{ fontSize: "24px", fontWeight: 800, color: "#1a0533", letterSpacing: "-0.03em", lineHeight: 1 }}>{val}</div>
                <div className="pp-sans" style={{ fontSize: "11px", color: "#9879d4", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", marginTop: "4px" }}>{lbl}</div>
              </div>
            ))}
          </div>

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
          {activeTab === "clubs" && (
            <div>
              {enrolledClubs.length > 0 ? (
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
                            overflow: "hidden",
                          }}>
                            {club.logo
                              ? <img src={club.logo} alt={club.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                              : <span style={{ fontSize: "18px", fontWeight: 800, color: club.accent, fontFamily: "'Fraunces', serif" }}>{club.name[0]}</span>
                            }
                          </div>
                          <span className="pp-sans" style={{
                            fontSize: "10px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase",
                            padding: "3px 8px", borderRadius: "5px",
                            background: "#f0fdf4", color: "#22c55e",
                          }}>Enrolled</span>
                        </div>
                        <div className="pp-display" style={{ fontSize: "16px", fontWeight: 800, color: "#1a0533", marginBottom: "4px" }}>{club.name}</div>
                        <div className="pp-sans" style={{ fontSize: "12px", color: "#888", marginBottom: "14px" }}>{club.category}</div>
                        <button onClick={() => toggleEnroll(club.id)} className="pp-sans" style={{
                          width: "100%", padding: "9px", borderRadius: "8px",
                          border: "1.5px solid rgba(124,58,237,0.15)",
                          background: "none", color: "#7c3aed",
                          fontSize: "12.5px", fontWeight: 600, cursor: "pointer",
                        }}>
                          Leave club
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div style={{ textAlign: "center", padding: "80px 0" }}>
                  <div style={{ width: "64px", height: "64px", borderRadius: "18px", background: "#f5f0ff", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", fontSize: "28px" }}>🏆</div>
                  <h3 className="pp-display" style={{ fontSize: "20px", color: "#1a0533", marginBottom: "8px", fontWeight: 800 }}>No clubs yet</h3>
                  <p className="pp-sans" style={{ color: "#888", fontSize: "14px", marginBottom: "24px" }}>Browse clubs and join one that interests you</p>
                  <a href="/page1" className="pp-sans" style={{
                    background: "linear-gradient(135deg, #7c3aed, #4c1d95)", color: "#fff",
                    padding: "12px 28px", borderRadius: "9px",
                    fontWeight: 700, fontSize: "14px", textDecoration: "none",
                  }}>Browse clubs →</a>
                </div>
              )}
            </div>
          )}
          {activeTab === "activity" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{
                display: "flex", alignItems: "center", gap: "16px",
                padding: "18px 22px",
                background: "#fff", border: "1.5px solid rgba(124,58,237,0.08)",
                borderRadius: "14px",
              }}>
                <div style={{ width: "40px", height: "40px", borderRadius: "11px", flexShrink: 0, background: "#7c3aed18", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px" }}>✨</div>
                <div style={{ flex: 1 }}>
                  <p className="pp-sans" style={{ fontSize: "14px", color: "#1a0533", fontWeight: 500, margin: 0 }}>Created Duguilan.mn account</p>
                </div>
                <span className="pp-sans" style={{ fontSize: "12px", color: "#bbb", fontWeight: 500 }}>
                  {saved.created_at ? new Date(saved.created_at).toLocaleDateString() : ""}
                </span>
              </div>

              {enrolledClubs.length === 0 ? (
                <div style={{ textAlign: "center", padding: "60px 0" }}>
                  <div style={{ fontSize: "32px", marginBottom: "12px" }}>📭</div>
                  <p className="pp-sans" style={{ color: "#bbb", fontSize: "14px" }}>No club activity yet — join a club!</p>
                  <a href="/page1" className="pp-sans" style={{
                    display: "inline-block", marginTop: "16px",
                    background: "linear-gradient(135deg, #7c3aed, #4c1d95)", color: "#fff",
                    padding: "10px 24px", borderRadius: "9px",
                    fontWeight: 700, fontSize: "13px", textDecoration: "none",
                  }}>Browse clubs →</a>
                </div>
              ) : (
                enrolledClubs.map((club) => (
                  <div key={club.id} style={{
                    display: "flex", alignItems: "center", gap: "16px",
                    padding: "18px 22px",
                    background: "#fff", border: "1.5px solid rgba(124,58,237,0.08)",
                    borderRadius: "14px",
                  }}>
                    <div style={{
                      width: "40px", height: "40px", borderRadius: "11px", flexShrink: 0,
                      background: club.bg, display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "18px", fontFamily: "'Fraunces', serif", fontWeight: 800, color: club.accent,
                      overflow: "hidden",
                    }}>
                      {club.logo
                        ? <img src={club.logo} alt={club.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        : club.name[0]
                      }
                    </div>
                    <div style={{ flex: 1 }}>
                      <p className="pp-sans" style={{ fontSize: "14px", color: "#1a0533", fontWeight: 600, margin: "0 0 2px" }}>
                        Joined <strong>{club.name}</strong>
                      </p>
                      <p className="pp-sans" style={{ fontSize: "12px", color: "#888", margin: 0 }}>{club.category}</p>
                    </div>
                    <span className="pp-sans" style={{
                      fontSize: "11px", fontWeight: 700, padding: "3px 9px", borderRadius: "5px",
                      background: club.bg, color: club.accent,
                    }}>{club.category}</span>
                  </div>
                ))
              )}
            </div>
          )}

        </div>
      </main>

      <Footer />
      {editOpen && (
        <div className="pp-modal-overlay" onClick={e => e.target === e.currentTarget && setEditOpen(false)}>
          <div className="pp-modal">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "28px" }}>
              <h2 className="pp-display" style={{ fontSize: "22px", fontWeight: 800, color: "#1a0533", margin: 0 }}>Edit Profile</h2>
              <button onClick={() => setEditOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#c4b5fd", padding: 0 }}>
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12"/></svg>
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
              {[
                { key: "name",     label: "Full Name", type: "text", placeholder: "Your full name" },
                { key: "phone",    label: "Phone",     type: "tel",  placeholder: "+976 ···" },
                { key: "location", label: "Location",  type: "text", placeholder: "City, Country" },
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
              }}>Cancel</button>
              <button onClick={handleSave} disabled={saveLoading} className="pp-sans" style={{
                flex: 1, padding: "13px", borderRadius: "9px", border: "none",
                background: "linear-gradient(135deg, #7c3aed, #4c1d95)", color: "#fff",
                fontSize: "14px", fontWeight: 700, cursor: saveLoading ? "not-allowed" : "pointer",
                opacity: saveLoading ? 0.7 : 1,
              }}>
                {saveLoading ? "Хадгалж байна..." : "Save changes"}
              </button>
            </div>
            {saveError && <p className="pp-sans" style={{ color: "#dc2626", fontSize: "13px", marginTop: "10px", textAlign: "center" }}>{saveError}</p>}
          </div>
        </div>
      )}
    </div>
  );
}