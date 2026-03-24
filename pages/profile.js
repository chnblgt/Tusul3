import { useState } from "react";

const MOCK_USER = {
  name: "Bat-Erdene Gantulga",
  username: "baterdenee",
  avatar: null,
  bio: "Bio example",
  location: "Ulaanbaatar, Mongolia",
  email: "Bold12IZQ@gmail.com",
  phone: "+976 911",
  joinedDate: "May 2026",
};

const MOCK_CLUBS = [
  { id: 1, name: "Naadam Heritage Club", category: "Culture", members: 340, enrolled: true, color: "#f0fdf4", accent: "#22c55e" },
  { id: 2, name: "UB Photography Circle", category: "Arts", members: 218, enrolled: true, color: "#faf5ff", accent: "#a855f7" },
  { id: 3, name: "Mongolian Hikers", category: "Outdoors", members: 892, enrolled: false, color: "#fff7ed", accent: "#f97316" },
  { id: 4, name: "Tech Builders MN", category: "Technology", members: 155, enrolled: true, color: "#eff6ff", accent: "#3b82f6" },
  { id: 5, name: "Ulaanbaatar Book Club", category: "Literature", members: 74, enrolled: false, color: "#fef2f2", accent: "#ef4444" },
];

const BANNER_VIDEO_ID = "QRms3dr_lYM";

function getInitials(name) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

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
    setClubs((prev) => prev.map((c) => c.id === id ? { ...c, enrolled: !c.enrolled } : c));
  }

  const enrolledClubs = clubs.filter((c) => c.enrolled);
  const followedClubs = clubs.filter((c) => !c.enrolled);

  const ytSrc = `https://www.youtube.com/embed/${BANNER_VIDEO_ID}?autoplay=1&loop=1&mute=1&playlist=${BANNER_VIDEO_ID}&controls=0&showinfo=0&modestbranding=1&rel=0&disablekb=1&fs=0`;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,800;0,900;1,700;1,800&family=Lora:ital,wght@0,400;0,500;0,600;1,400;1,500&display=swap');

        @keyframes pp-fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes pp-slideUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }

        .pp-root {
          min-height: 100vh;
          background: #fff;
          font-family: 'Lora', serif;
        }
        .pp-root *, .pp-root *::before, .pp-root *::after { box-sizing: border-box; }

        /* Banner */
        .pp-banner {
          height: 280px;
          position: relative;
          background: #0d0118;
          overflow: hidden;
        }
        .pp-banner-iframe {
          position: absolute;
          top: 50%; left: 50%;
          width: 100vw;
          height: calc(100vw * 9 / 16);
          min-height: 400%;
          transform: translate(-50%, -62%) scale(1.5);
          border: none;
          pointer-events: none;
        }
        .pp-back-btn {
          position: absolute;
          top: 18px; left: 22px;
          z-index: 10;
          display: flex; align-items: center; gap: 7px;
          font-family: 'Lora', serif;
          font-size: 13px; font-weight: 600;
          color: #fff;
          background: rgba(26,5,51,0.5);
          border: 1px solid rgba(255,255,255,0.15);
          backdrop-filter: blur(10px);
          border-radius: 7px;
          padding: 7px 14px;
          cursor: pointer;
          text-decoration: none;
          transition: background 0.2s, transform 0.15s;
          line-height: 1;
        }
        .pp-back-btn:hover {
          background: rgba(124,58,237,0.6);
          transform: translateY(-1px);
        }
        .pp-banner-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(to bottom, rgba(13,1,24,0.15) 0%, rgba(13,1,24,0.55) 100%);
          pointer-events: none; z-index: 1;
        }

        .pp-body {
          max-width: 900px;
          margin: 0 auto;
          padding: 0 48px 120px;
        }

        .pp-avatar-row {
          display: flex; align-items: flex-end;
          justify-content: space-between;
          margin-top: -56px;
          padding-bottom: 32px;
          position: relative; z-index: 10;
        }
        .pp-avatar {
          width: 120px; height: 120px;
          border-radius: 50%;
          border: 5px solid #fff;
          background: #1a0533;
          color: #fff;
          font-family: 'Playfair Display', serif;
          font-size: 36px; font-weight: 800;
          display: flex; align-items: center; justify-content: center;
          overflow: hidden;
          box-shadow: 0 8px 32px rgba(26,5,51,0.18);
          flex-shrink: 0;
          position: relative; z-index: 10;
        }
        .pp-avatar img { width: 100%; height: 100%; object-fit: cover; }

        .pp-edit-btn {
          font-family: 'Lora', serif;
          font-size: 13px; font-weight: 600;
          padding: 12px 24px; border-radius: 9px;
          border: 2px solid rgba(124,58,237,0.4);
          background: #fff; color: #7c3aed; background: #f0ebff;
          cursor: pointer;
          transition: border-color 0.2s, background 0.2s, transform 0.15s, box-shadow 0.2s;
          display: flex; align-items: center; gap: 6px;
          margin-bottom: 6px; line-height: 1;
        }
        .pp-edit-btn:hover {
          border-color: #7c3aed; background: #f0ebff;
          background: #f8f4ff;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(124,58,237,0.12);
        }

        .pp-name {
          font-family: 'Playfair Display', serif;
          font-size: 42px; font-weight: 800;
          color: #1a0533; letter-spacing: -0.04em; margin: 0;
        }
        .pp-username { font-size: 18px; color: #9879d4; font-weight: 500; margin-top: 3px; }
        .pp-bio { font-size: 18px; color: #666; line-height: 1.7; margin-top: 12px; max-width: 480px; }

        .pp-meta { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 20px; }
        .pp-meta-pill {
          display: flex; align-items: center; gap: 5px;
          font-size: 15px; color: #7c3aed; font-weight: 500;
          background: #f8f4ff;
          border: 1px solid rgba(124,58,237,0.12);
          border-radius: 20px; padding: 6px 14px;
        }
        .pp-meta-pill a { color: #7c3aed; text-decoration: none; font-weight: 600; }
        .pp-meta-pill a:hover { text-decoration: underline; }

        .pp-tabs { display: flex; border-bottom: 1px solid rgba(26,5,51,0.08); margin-top: 40px; }
        .pp-tab {
          font-family: 'Lora', serif;
          font-size: 17px; font-weight: 500;
          color: #bbb; background: none; border: none;
          padding: 16px 24px; cursor: pointer;
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

        .pp-section-label { font-size: 13px !important;
          font-size: 13px; font-weight: 700;
          text-transform: uppercase; letter-spacing: 0.1em;
          color: #9879d4; margin: 44px 0 18px;
        }

        .club-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 22px; }
        @media (max-width: 600px) { .club-grid { grid-template-columns: 1fr; } }

        .club-card {
          background: #fff;
          border: 2px solid rgba(124,58,237,0.1);
          border-radius: 22px; padding: 30px 32px;
          display: flex; align-items: flex-start; gap: 14px;
          transition: box-shadow 0.2s, transform 0.15s, border-color 0.2s;
          position: relative;
        }
        .club-card:hover {
          box-shadow: 0 8px 24px rgba(26,5,51,0.08);
          transform: translateY(-2px);
          border-color: rgba(124,58,237,0.15);
        }

        .club-name {
          font-family: 'Playfair Display', serif; font-size: 22px; font-weight: 700;
          color: #1a0533; letter-spacing: -0.02em; line-height: 1.3; margin: 0;
        }
        
          display: inline-block; font-size: 10px; font-weight: 700;
          text-transform: uppercase; letter-spacing: 0.07em;
          border-radius: 5px; padding: 2px 7px; margin-top: 5px;
        }
        .club-members { font-size: 16px; color: #aaa; margin-top: 7px; font-weight: 500; }

        
          position: absolute; top: 14px; right: 16px;
          font-size: 11px; font-weight: 600;
          background: none; border: 1px solid rgba(26,5,51,0.1);
          border-radius: 6px; padding: 4px 10px;
          color: #aaa; cursor: pointer;
          transition: border-color 0.2s, color 0.2s, background 0.2s; line-height: 1;
          font-family: 'Lora', serif;
        }
        .club-leave-btn:hover { border-color: #fca5a5; color: #dc2626; background: #fef2f2; }

        
          position: absolute; top: 14px; right: 16px;
          font-size: 11px; font-weight: 600;
          background: #1a0533; border: none;
          border-radius: 6px; padding: 4px 10px;
          color: #fff; cursor: pointer;
          transition: background 0.2s; line-height: 1;
          font-family: 'Lora', serif;
        }
        .club-join-btn:hover { background: #6d28d9; box-shadow: 0 4px 14px rgba(124,58,237,0.4); }

        .pp-empty { padding: 52px 0; text-align: center; color: #ccc; font-size: 14px; font-family: 'Lora', serif; }
        .pp-empty-icon {
          width: 56px; height: 56px; border-radius: 16px;
          background: #f8f4ff; border: 1px solid rgba(124,58,237,0.1);
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 14px; font-size: 24px;
        }

        .pp-activity-item {
          display: flex; align-items: center; gap: 14px;
          padding: 18px 22px; background: #fff;
          border: 2px solid rgba(124,58,237,0.1);
          border-radius: 16px; margin-bottom: 16px;
          transition: border-color 0.2s;
        }
        .pp-activity-item:hover { border-color: rgba(124,58,237,0.15); }

        .pp-about-item {
          display: flex; align-items: center; gap: 14px;
          padding: 18px 22px; background: #fff;
          border: 2px solid rgba(124,58,237,0.1);
          border-radius: 16px; margin-bottom: 16px;
          transition: border-color 0.2s;
        }
        .pp-about-item:hover { border-color: rgba(124,58,237,0.15); }

        .pp-modal-overlay {
          position: fixed; inset: 0;
          background: rgba(13,1,24,0.4);
          backdrop-filter: blur(6px);
          z-index: 3000;
          display: flex; align-items: center; justify-content: center;
          padding: 20px; animation: pp-fadeIn 0.15s ease;
        }
        .pp-modal {
          background: #fff; border-radius: 20px; padding: 36px;
          width: 100%; max-width: 480px; max-height: 90vh; overflow-y: auto;
          box-shadow: 0 32px 80px rgba(26,5,51,0.2);
          animation: pp-slideUp 0.2s cubic-bezier(.22,.68,0,1.2);
          border: 1px solid rgba(124,58,237,0.1);
        }
        
          font-family: 'Playfair Display', serif; font-size: 28px; font-weight: 800;
          color: #1a0533; letter-spacing: -0.03em; margin: 0 0 28px;
        }
        .pp-field { margin-bottom: 16px; }
        
          display: block; font-size: 13px; font-weight: 700;
          text-transform: uppercase; letter-spacing: 0.08em;
          color: #9879d4; margin-bottom: 7px;
          font-family: 'Lora', serif;
        }
        
          width: 100%; font-family: 'Lora', serif;
          font-size: 16px; font-weight: 500; color: #1a0533;
          background: #fdfcff;
          border: 1.5px solid rgba(124,58,237,0.15);
          border-radius: 9px; padding: 11px 14px; outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .pp-input:focus {
          border-color: #7c3aed; background: #f0ebff;
          box-shadow: 0 0 0 3px rgba(124,58,237,0.1);
        }
        .pp-textarea { resize: vertical; min-height: 80px; line-height: 1.65; }

        .pp-modal-actions { display: flex; gap: 10px; justify-content: flex-end; margin-top: 40px; }
        .pp-cancel-btn {
          font-family: 'Lora', serif; font-size: 13px; font-weight: 600;
          padding: 10px 20px; border-radius: 8px;
          border: 1.5px solid rgba(26,5,51,0.12); background: #fff; color: #888;
          cursor: pointer; transition: border-color 0.2s, color 0.2s;
        }
        .pp-cancel-btn:hover { border-color: #aaa; color: #555; }
        .pp-save-btn {
          font-family: 'Lora', serif; font-size: 13px; font-weight: 700;
          padding: 10px 24px; border-radius: 8px;
          border: none; background: #1a0533; color: #fff;
          cursor: pointer; transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
        }
        .pp-save-btn:hover {
          background: #7c3aed;
          transform: translateY(-1px);
          box-shadow: 0 4px 16px rgba(124,58,237,0.35);
        }
      `}</style>

      <div className="pp-root">

        {/* Banner */}
        <div className="pp-banner">
          <a href="/page" className="pp-back-btn">
            <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
            Back
          </a>
          <iframe
            className="pp-banner-iframe"
            src={ytSrc}
            title="Banner video"
            allow="autoplay; encrypted-media"
            allowFullScreen={false}
          />
          <div className="pp-banner-overlay" />
        </div>

        <div className="pp-body">
          <div className="pp-avatar-row">
            <div className="pp-avatar">
              {saved.avatar
                ? <img src={saved.avatar} alt={saved.name} />
                : getInitials(saved.name)
              }
            </div>
            <button className="pp-edit-btn" onClick={() => { setEditData({ ...saved }); setEditOpen(true); }}>
              <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
              Edit profile
            </button>
          </div>

          <div className="pp-name">{saved.name}</div>
          <div className="pp-username">@{saved.username}</div>
          {saved.bio && <p className="pp-bio">{saved.bio}</p>}

          <div className="pp-meta">
            {saved.location && (
              <span className="pp-meta-pill">
                <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                {saved.location}
              </span>
            )}
            {saved.website && (
              <span className="pp-meta-pill">
                <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                <a href={saved.website} target="_blank" rel="noopener noreferrer">
                  {saved.website.replace(/^https?:\/\//, "")}
                </a>
              </span>
            )}
            {saved.joinedDate && (
              <span className="pp-meta-pill">
                <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                Joined {saved.joinedDate}
              </span>
            )}
          </div>

          <div className="pp-tabs">
            {[
              { key: "clubs", label: "My Clubs" },
              { key: "activity", label: "Activity" },
              { key: "about", label: "About" },
            ].map(({ key, label }) => (
              <button
                key={key}
                className={`pp-tab${activeTab === key ? " active" : ""}`}
                onClick={() => setActiveTab(key)}
              >
                {label}
              </button>
            ))}
          </div>

          {activeTab === "clubs" && (
            <div>
              <div className="pp-section-label">Enrolled in ({enrolledClubs.length})</div>
              {enrolledClubs.length === 0 ? (
                <div className="pp-empty">
                  <div className="pp-empty-icon">🏛️</div>
                  Not enrolled in any clubs yet
                </div>
              ) : (
                <div className="club-grid">
                  {enrolledClubs.map((club) => (
                    <div key={club.id} className="club-card">
                      <div style={{ flex: 1, minWidth: 0, paddingRight: "60px" }}>
                        <div className="club-name">{club.name}</div>
                        <span className="club-cat" style={{ background: club.color, color: club.accent }}>{club.category}</span>
                        <div className="club-members">{club.members.toLocaleString()} members</div>
                      </div>
                      <button className="club-leave-btn" onClick={() => toggleEnroll(club.id)}>Leave</button>
                    </div>
                  ))}
                </div>
              )}

              <div className="pp-section-label">Following ({followedClubs.length})</div>
              {followedClubs.length === 0 ? (
                <div className="pp-empty">
                  <div className="pp-empty-icon">🔍</div>
                  Not following any clubs
                </div>
              ) : (
                <div className="club-grid">
                  {followedClubs.map((club) => (
                    <div key={club.id} className="club-card">
                      <div style={{ flex: 1, minWidth: 0, paddingRight: "60px" }}>
                        <div className="club-name">{club.name}</div>
                        <span className="club-cat" style={{ background: club.color, color: club.accent }}>{club.category}</span>
                        <div className="club-members">{club.members.toLocaleString()} members</div>
                      </div>
                      <button className="club-join-btn" onClick={() => toggleEnroll(club.id)}>Join</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "activity" && (
            <div>
              <div className="pp-section-label">Recent</div>
              {[
                { icon: "🏹", text: "Joined Naadam Heritage Club", time: "2 days ago" },
                { icon: "📷", text: "Enrolled in UB Photography Circle", time: "1 week ago" },
                { icon: "💻", text: "Joined Tech Builders MN", time: "3 weeks ago" },
              ].map((item, i) => (
                <div key={i} className="pp-activity-item">
                  <span style={{ fontSize: "18px" }}>{item.icon}</span>
                  <span style={{ flex: 1, fontSize: "18px", color: "#333", fontWeight: 500, fontFamily: "'Lora', serif" }}>{item.text}</span>
                  <span style={{ fontSize: "15px", color: "#bbb", whiteSpace: "nowrap", fontFamily: "'Lora', serif" }}>{item.time}</span>
                </div>
              ))}
            </div>
          )}

          {activeTab === "about" && (
            <div style={{ paddingTop: "24px" }}>
              {[
                { label: "Full name", value: saved.name, icon: "👤" },
                { label: "Email", value: saved.email, icon: "✉️" },
                { label: "Phone", value: saved.phone, icon: "📞" },
                { label: "Location", value: saved.location, icon: "📍" },
                { label: "Website", value: saved.website, icon: "🌐", link: true },
              ].map(({ label, value, icon, link }) => value ? (
                <div key={label} className="pp-about-item">
                  <span style={{ fontSize: "17px", width: "22px", textAlign: "center" }}>{icon}</span>
                  <div>
                    <div style={{ fontSize: "14px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#9879d4", marginBottom: "3px", fontFamily: "'Lora', serif" }}>{label}</div>
                    {link
                      ? <a href={value} target="_blank" rel="noopener noreferrer" style={{ fontSize: "17px", fontWeight: 500, color: "#7c3aed", textDecoration: "none", fontFamily: "'Lora', serif" }}>{value.replace(/^https?:\/\//, "")}</a>
                      : <div style={{ fontSize: "18px", fontWeight: 500, color: "#1a0533", fontFamily: "'Lora', serif" }}>{value}</div>
                    }
                  </div>
                </div>
              ) : null)}
            </div>
          )}
        </div>
      </div>

      {editOpen && (
        <div className="pp-modal-overlay" onClick={(e) => e.target === e.currentTarget && setEditOpen(false)}>
          <div className="pp-modal">
            <div className="pp-modal-title">Edit Profile</div>
            {[
              { key: "name", label: "Full Name", type: "text" },
              { key: "username", label: "Username", type: "text" },
              { key: "phone", label: "Phone", type: "text" },
            ].map(({ key, label, type }) => (
              <div className="pp-field" key={key}>
                <label className="pp-label">{label}</label>
                <input
                  className="pp-input"
                  type={type}
                  value={editData[key] || ""}
                  onChange={(e) => setEditData((d) => ({ ...d, [key]: e.target.value }))}
                />
              </div>
            ))}
            <div className="pp-field">
              <label className="pp-label">Bio</label>
              <textarea
                className="pp-input pp-textarea"
                value={editData.bio || ""}
                onChange={(e) => setEditData((d) => ({ ...d, bio: e.target.value }))}
              />
            </div>
            <div className="pp-modal-actions">
              <button className="pp-cancel-btn" onClick={() => setEditOpen(false)}>Cancel</button>
              <button className="pp-save-btn" onClick={handleSave}>Save changes</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}