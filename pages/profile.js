import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import Header from "@/waterbottle/Header";
import Footer from "@/waterbottle/Footer";
import Link from "next/link";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function safeJson(res) {
  const text = await res.text();
  try { return JSON.parse(text); }
  catch { return null; }
}

const fetchAPI = (url, options = {}) =>
  fetch(url, {
    ...options,
    headers: { "ngrok-skip-browser-warning": "true", ...options.headers },
  });

const DEFAULT_USER = { name:"User", username:"", avatar:null, bio:"", location:"", email:"", phone:"", joinedDate:"" };

function getInitials(name) {
  return (name || "U").split(" ").map(n=>n[0]).join("").toUpperCase().slice(0,2);
}

const fonts = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,700;0,9..144,800;1,9..144,700&family=DM+Sans:wght@400;500;600;700&display=swap');
  .pp-display { font-family: 'Fraunces', serif; }
  .pp-sans    { font-family: 'DM Sans', sans-serif; }

  @keyframes pp-fadeUp  { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:none} }
  @keyframes pp-shimmer { 0%{background-position:-300% center} 100%{background-position:300% center} }
  @keyframes pp-orb1    { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(20px,-14px) scale(1.06)} }
  @keyframes pp-orb2    { 0%,100%{transform:translate(0,0)} 50%{transform:translate(-14px,18px)} }

  .pp-fadein { animation: pp-fadeUp .5s cubic-bezier(.22,1,.36,1) both; }

  .pp-tab {
    font-family:'DM Sans',sans-serif; font-size:14px; font-weight:500;
    background:none; border:none;
    padding:14px 20px; cursor:pointer;
    position:relative; transition:color .2s; line-height:1;
    color: var(--text-muted);
  }
  .pp-tab.active { color: var(--text-primary); font-weight:700; }
  .pp-tab.active::after {
    content:''; position:absolute; bottom:-1px; left:0; right:0;
    height:2px; background:var(--accent); border-radius:2px 2px 0 0;
  }
  .pp-tab:hover:not(.active) { color:var(--accent); }

  .pp-club-card {
    background: var(--bg-card);
    border: 1.5px solid var(--border-card);
    border-radius:18px; padding:22px;
    transition:transform .2s cubic-bezier(.34,1.56,.64,1),box-shadow .2s,background 0.3s,border-color 0.3s;
    cursor:pointer; text-decoration:none; display:block;
  }
  .pp-club-card:hover { transform:translateY(-4px); box-shadow:var(--shadow-card-hover); }

  .pp-input {
    width:100%; padding:13px 16px;
    border:1.5px solid var(--input-border); border-radius:10px;
    font-size:14px; color:var(--input-text); background:var(--bg-input);
    outline:none; box-sizing:border-box;
    font-family:'DM Sans',sans-serif;
    transition:border-color .2s,box-shadow .2s,background 0.3s,color 0.3s;
  }
  .pp-input:focus { border-color:var(--accent); box-shadow:0 0 0 3px var(--accent-soft); }
  .pp-input::placeholder { color: var(--text-muted) !important; }

  .pp-modal-overlay {
    position:fixed; inset:0; background:rgba(13,1,24,.6);
    display:flex; align-items:center; justify-content:center;
    z-index:9000; padding:24px; backdrop-filter:blur(8px);
  }
  .pp-modal {
    background:var(--bg-card); border-radius:22px; padding:36px;
    width:100%; max-width:500px;
    border:1.5px solid var(--border-subtle);
    box-shadow:0 28px 80px rgba(13,1,24,.35);
    animation:pp-fadeUp .22s cubic-bezier(.22,1,.36,1);
  }

  .pp-stat-card {
    background:var(--bg-card); border:1.5px solid var(--border-card);
    border-radius:16px; padding:22px 24px;
    transition:transform .18s,box-shadow .18s,background 0.3s,border-color 0.3s;
  }
  .pp-stat-card:hover { transform:translateY(-3px); box-shadow:var(--shadow-card-hover); }

  .pp-edit-btn {
    display:flex; align-items:center; gap:8px;
    padding:11px 20px; border-radius:10px;
    border:1.5px solid var(--border-subtle);
    background:var(--bg-card); color:var(--accent);
    font-size:13.5px; font-weight:600; cursor:pointer;
    font-family:'DM Sans',sans-serif;
    transition:all .18s; margin-bottom:6px;
  }
  .pp-edit-btn:hover {
    background:rgba(124,58,237,.08); border-color:rgba(124,58,237,.4);
    transform:translateY(-1px); box-shadow:0 4px 14px rgba(124,58,237,.12);
  }

  .pp-avatar-upload {
    position:absolute; inset:0; display:flex; align-items:center; justify-content:center;
    background:rgba(13,1,24,.55); border-radius:50%;
    opacity:0; transition:opacity .2s; cursor:pointer;
  }
  .pp-avatar-wrap:hover .pp-avatar-upload { opacity:1; }

  .pp-activity-row {
    display:flex; align-items:center; gap:16px;
    padding:18px 22px;
    background:var(--bg-card); border:1.5px solid var(--border-card);
    border-radius:16px; transition:box-shadow .15s, background 0.3s, border-color 0.3s;
  }
  .pp-activity-row:hover { box-shadow:var(--shadow-card-hover); }
`;

export default function ProfilePage() {
  const router = useRouter();
  const [activeTab,    setActiveTab]    = useState("clubs");
  const [editOpen,     setEditOpen]     = useState(false);
  const [user,         setUser]         = useState(DEFAULT_USER);
  const [editData,     setEditData]     = useState(DEFAULT_USER);
  const [saved,        setSaved]        = useState(DEFAULT_USER);
  const [clubs,        setClubs]        = useState([]);
  const [ownedClubs,   setOwnedClubs]   = useState([]);
  const [totalClubs,   setTotalClubs]   = useState(0);
  const [totalMembers, setTotalMembers] = useState(0);
  const [saveLoading,  setSaveLoading]  = useState(false);
  const [saveError,    setSaveError]    = useState("");
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [pendingAvatarFile, setPendingAvatarFile] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(()=>{
    const stored = localStorage.getItem("user");
    if (!stored) { router.replace("/signin"); return; }
    const u = JSON.parse(stored);
    setUser(u); setSaved(u); setEditData(u);
    if (u.avatar) setAvatarPreview(u.avatar);

    fetchAPI(`${API}/myClubs/${u.id}`)
      .then(r=>safeJson(r))
      .then(data=>{
        if (data?.success) {
          const mapped = data.clubs.map((c,i)=>({
            ...c, enrolled:true,
            accent:["#22c55e","#a855f7","#f97316","#3b82f6","#ef4444"][i%5],
            bg:    ["#f0fdf4","#faf5ff","#fff7ed","#eff6ff","#fef2f2"][i%5],
          }));
          setClubs(mapped);
        }
      }).catch(()=>{});

    fetchAPI(`${API}/clubs`)
      .then(r=>safeJson(r))
      .then(data=>{
        if (data?.success) {
          const owned = (data.clubs||[]).filter(c=>String(c.owner_id)===String(u.id)).map((c,i)=>({
            ...c,
            accent:["#22c55e","#a855f7","#f97316","#3b82f6","#ef4444"][i%5],
            bg:    ["#f0fdf4","#faf5ff","#fff7ed","#eff6ff","#fef2f2"][i%5],
          }));
          setOwnedClubs(owned);
          setTotalClubs(data.clubs?.length ?? 0);
        }
      }).catch(()=>{});

    fetchAPI(`${API}/stats`)
      .then(r=>safeJson(r))
      .then(data=>{ if (data?.success) setTotalMembers(data.memberCount ?? 0); })
      .catch(()=>{});
  }, []);

  function handleAvatarChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const previewUrl = URL.createObjectURL(file);
    setAvatarPreview(previewUrl);
    setPendingAvatarFile(file);
    // reset input so same file can be re-selected
    e.target.value = "";
  }

  async function toggleEnroll(clubId) {
    const u = JSON.parse(localStorage.getItem("user") || "{}");
    if (!u.id) return;
    const enrolled = clubs.find(c=>c.id===clubId)?.enrolled;
    try {
      if (enrolled) {
        await fetchAPI(`${API}/leaveClub/${u.id}/${clubId}`, { method:"DELETE" });
        setClubs(prev=>prev.filter(c=>c.id!==clubId));
      } else {
        await fetchAPI(`${API}/joinClub`, { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({userId:u.id,clubId}) });
        setClubs(prev=>prev.map(c=>c.id===clubId?{...c,enrolled:true}:c));
      }
    } catch(e) { console.error(e); }
  }

  async function handleSave() {
    setSaveError(""); setSaveLoading(true);
    try {
      let avatarUrl = saved.avatar;
      if (pendingAvatarFile) {
        const formData = new FormData();
        formData.append("avatar", pendingAvatarFile);
        const uploadRes = await fetchAPI(`${API}/uploadAvatar/${saved.id}`, {
          method: "POST",
          body: formData,
        });
        const uploadResult = await safeJson(uploadRes);
        if (uploadResult?.success && uploadResult.avatarUrl) {
          avatarUrl = uploadResult.avatarUrl;
        }
      }

      const res = await fetchAPI(`${API}/updateUser/${saved.id}`, {
        method:"PUT", headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          name:editData.name, bio:editData.bio,
          location:editData.location, phone:editData.phone,
          avatar: avatarUrl,
        }),
      });
      const result = await safeJson(res);
      if (!result) { setSaveError("Сервертэй холбогдож чадсангүй."); return; }
      if (!res.ok) { setSaveError(result.message || "Хадгалахад алдаа гарлаа"); return; }
      const updated = {...saved, ...editData, avatar: avatarUrl};
      setSaved(updated);
      setUser(updated);
      setAvatarPreview(avatarUrl);
      setPendingAvatarFile(null);
      localStorage.setItem("user", JSON.stringify(updated));
      setEditOpen(false);
    } catch { setSaveError("Сервертэй холбогдож чадсангүй."); }
    finally { setSaveLoading(false); }
  }

  const enrolledClubs = clubs.filter(c=>c.enrolled);

  const labelStyle = {
    fontSize:"11px",fontWeight:700,color:"var(--text-muted)",letterSpacing:".1em",
    textTransform:"uppercase",display:"block",marginBottom:"7px",fontFamily:"'DM Sans',sans-serif",
  };

  return (
    <div style={{minHeight:"100vh",display:"flex",flexDirection:"column",background:"var(--bg-page)",transition:"background 0.3s"}}>
      <style>{fonts}</style>
      <Header user={saved}/>
      <div style={{height:"220px",background:"linear-gradient(135deg,var(--bg-section) 0%,var(--bg-card) 100%)",position:"relative",overflow:"hidden"}}>
        <svg aria-hidden="true" style={{position:"absolute",inset:0,width:"100%",height:"100%",pointerEvents:"none"}}>
          <defs>
            <pattern id="prof-hatch" width="36" height="36" patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
              <line x1="0" y1="0" x2="0" y2="36" stroke="var(--accent)" strokeWidth="0.5" strokeOpacity="0.12"/>
            </pattern>
            <pattern id="prof-dots" width="22" height="22" patternUnits="userSpaceOnUse">
              <circle cx="1.5" cy="1.5" r="1" fill="var(--accent)" fillOpacity="0.08"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#prof-hatch)"/>
          <rect width="100%" height="100%" fill="url(#prof-dots)"/>
        </svg>
        <div style={{position:"absolute",top:"-80px",right:"-80px",width:"320px",height:"320px",borderRadius:"50%",background:"rgba(124,58,237,.13)",animation:"pp-orb1 9s ease-in-out infinite",pointerEvents:"none"}}/>
        <div style={{position:"absolute",bottom:"-60px",left:"18%",width:"200px",height:"200px",borderRadius:"50%",background:"rgba(167,139,250,.08)",animation:"pp-orb2 12s ease-in-out infinite",pointerEvents:"none"}}/>
        {saved.username && (
          <div style={{position:"absolute",bottom:"20px",left:"48px",fontFamily:"'Fraunces',serif",fontSize:"72px",fontWeight:800,color:"var(--accent-soft)",letterSpacing:"-0.06em",lineHeight:1,userSelect:"none",pointerEvents:"none"}}>
            @{saved.username}
          </div>
        )}
      </div>

      <main style={{flex:1}}>
        <div style={{maxWidth:"960px",margin:"0 auto",padding:"0 48px 96px"}}>
          <div style={{display:"flex",alignItems:"flex-end",justifyContent:"space-between",marginTop:"-62px",paddingBottom:"28px",position:"relative",zIndex:10}}>
            <div style={{position:"relative"}}>
              <div
                className="pp-avatar-wrap"
                style={{position:"relative",width:"120px",height:"120px",borderRadius:"50%",flexShrink:0}}
              >
                <div style={{
                  width:"120px",height:"120px",borderRadius:"50%",
                  border:"4px solid var(--bg-card)",
                  background:"var(--accent)",
                  color:"#fff",fontFamily:"'Fraunces',serif",
                  fontSize:"36px",fontWeight:800,
                  display:"flex",alignItems:"center",justifyContent:"center",
                  overflow:"hidden",
                  boxShadow:"0 8px 32px rgba(26,5,51,.28),0 0 0 1px rgba(124,58,237,.15)",
                  transition:"box-shadow 0.2s",
                }}>
                  {(avatarPreview || saved.avatar)
                    ? <img src={avatarPreview || saved.avatar} alt={saved.name} style={{width:"100%",height:"100%",objectFit:"cover"}}/>
                    : getInitials(saved.name || "U")
                  }
                </div>
              </div>
            </div>

            <div style={{display:"flex",gap:"10px",alignItems:"center"}}>
              <button onClick={()=>setEditOpen(true)} className="pp-edit-btn">
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
                Edit Profile
              </button>
            </div>
          </div>
          <div className="pp-fadein" style={{marginBottom:"32px"}}>
            <h1 className="pp-display" style={{
              fontSize:"clamp(1.8rem,4vw,2.6rem)",fontWeight:800,
              color:"var(--text-primary)",letterSpacing:"-0.04em",
              margin:"0 0 4px",transition:"color 0.3s",
            }}>
              {saved.name || saved.username}
            </h1>
            <p className="pp-sans" style={{fontSize:"15px",color:"var(--text-muted)",fontWeight:500,margin:"0 0 14px",transition:"color 0.3s"}}>
              @{saved.username}
            </p>
            {saved.bio && (
              <p className="pp-sans" style={{
                fontSize:"15px",color:"var(--text-secondary)",
                lineHeight:1.75,margin:"0 0 14px",maxWidth:"480px",
                transition:"color 0.3s",
              }}>{saved.bio}</p>
            )}
            <div style={{display:"flex",gap:"8px",flexWrap:"wrap"}}>
              {saved.location && (
                <span className="pp-sans" style={{
                  display:"inline-flex",alignItems:"center",gap:"5px",
                  fontSize:"12.5px",color:"var(--text-muted)",fontWeight:500,
                  background:"var(--bg-input)",padding:"4px 10px",borderRadius:"6px",
                  border:"1px solid var(--border-subtle)",transition:"all 0.3s",
                }}>
                  <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  {saved.location}
                </span>
              )}
              {saved.email && (
                <span className="pp-sans" style={{
                  display:"inline-flex",alignItems:"center",gap:"5px",
                  fontSize:"12.5px",color:"var(--text-muted)",fontWeight:500,
                  background:"var(--bg-input)",padding:"4px 10px",borderRadius:"6px",
                  border:"1px solid var(--border-subtle)",transition:"all 0.3s",
                }}>
                  <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                  {saved.email}
                </span>
              )}
              {saved.created_at && (
                <span className="pp-sans" style={{
                  display:"inline-flex",alignItems:"center",gap:"5px",
                  fontSize:"12.5px",color:"var(--text-muted)",fontWeight:500,
                  background:"var(--bg-input)",padding:"4px 10px",borderRadius:"6px",
                  border:"1px solid var(--border-subtle)",transition:"all 0.3s",
                }}>
                  <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                  Joined {new Date(saved.created_at).toLocaleDateString("en-US",{month:"short",year:"numeric"})}
                </span>
              )}
            </div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"14px",marginBottom:"40px"}}>
            {[
              { val:enrolledClubs.length, label:"Clubs joined",    icon:"🏆", color:"var(--accent)" },
              { val:totalClubs,           label:"Clubs available", icon:"🌐", color:"#3b82f6" },
              { val:totalMembers,         label:"Total members",   icon:"👥", color:"#22c55e" },
            ].map(({val,label,icon,color})=>(
              <div key={label} className="pp-stat-card">
                <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:"10px"}}>
                  <div className="pp-display" style={{
                    fontSize:"28px",fontWeight:800,color:"var(--text-primary)",
                    letterSpacing:"-0.03em",lineHeight:1,transition:"color 0.3s",
                  }}>
                    {val > 0 ? val : "0"}
                  </div>
                  <div style={{
                    width:"34px",height:"34px",borderRadius:"9px",
                    background:`${color}18`,
                    display:"flex",alignItems:"center",justifyContent:"center",fontSize:"16px",
                  }}>
                    {icon}
                  </div>
                </div>
                <div className="pp-sans" style={{
                  fontSize:"11.5px",color:"var(--text-muted)",
                  fontWeight:600,textTransform:"uppercase",letterSpacing:".08em",
                  transition:"color 0.3s",
                }}>{label}</div>
                <div style={{
                  marginTop:"12px",height:"3px",borderRadius:"2px",
                  background:`linear-gradient(90deg,${color}40,${color})`,
                  width:`${Math.min((val/Math.max(totalClubs||1,1))*100,100)}%`,
                  minWidth:"12px",
                }}/>
              </div>
            ))}
          </div>
          <div style={{borderBottom:"1px solid var(--border-subtle)",marginBottom:"36px",display:"flex",transition:"border-color 0.3s"}}>
            {[["clubs","My Clubs"],["myclubs","My Club"],["activity","Activity"]].map(([id,lbl])=>(
              <button key={id} className={`pp-tab${activeTab===id?" active":""}`} onClick={()=>setActiveTab(id)}>
                {lbl}
                {id==="clubs" && (
                  <span className="pp-sans" style={{
                    marginLeft:"7px",fontSize:"10px",fontWeight:700,
                    background:activeTab===id?"rgba(124,58,237,.12)":"var(--bg-input)",
                    color:activeTab===id?"var(--accent)":"var(--text-muted)",
                    borderRadius:"20px",padding:"2px 7px",
                    transition:"all 0.3s",
                  }}>
                    {enrolledClubs.length}
                  </span>
                )}
                {id==="myclubs" && ownedClubs.length > 0 && (
                  <span className="pp-sans" style={{
                    marginLeft:"7px",fontSize:"10px",fontWeight:700,
                    background:activeTab===id?"rgba(124,58,237,.12)":"var(--bg-input)",
                    color:activeTab===id?"var(--accent)":"var(--text-muted)",
                    borderRadius:"20px",padding:"2px 7px",
                    transition:"all 0.3s",
                  }}>
                    {ownedClubs.length}
                  </span>
                )}
              </button>
            ))}
          </div>
          {activeTab==="clubs" && (
            <div>
              {enrolledClubs.length > 0 ? (
                <div>
                  <p className="pp-sans" style={{
                    fontSize:"10.5px",fontWeight:700,color:"var(--text-muted)",
                    letterSpacing:".12em",textTransform:"uppercase",margin:"0 0 18px",
                    transition:"color 0.3s",
                  }}>
                    Enrolled · {enrolledClubs.length}
                  </p>
                  <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:"14px"}}>
                    {enrolledClubs.map(club=>(
                      <div key={club.id} className="pp-club-card" onClick={()=>router.push(`/club-detail?id=${club.id}`)}>
                        {club.banner ? (
                          <div style={{height:"72px",borderRadius:"10px",overflow:"hidden",marginBottom:"16px",background:club.bg}}>
                            {(() => {
                              try {
                                const imgs = JSON.parse(club.banner);
                                return <img src={imgs[0]} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>;
                              } catch { return null; }
                            })()}
                          </div>
                        ) : (
                          <div style={{height:"56px",borderRadius:"10px",marginBottom:"16px",background:`linear-gradient(135deg,${club.accent}18,${club.accent}08)`,border:`1px solid ${club.accent}18`}}/>
                        )}
                        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"12px"}}>
                          <div style={{width:"42px",height:"42px",borderRadius:"11px",background:club.bg,border:`1.5px solid ${club.accent}22`,display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden"}}>
                            {club.logo
                              ? <img src={club.logo} alt={club.name} style={{width:"100%",height:"100%",objectFit:"cover"}}/>
                              : <span style={{fontSize:"18px",fontWeight:800,color:club.accent,fontFamily:"'Fraunces',serif"}}>{club.name[0]}</span>
                            }
                          </div>
                          <span className="pp-sans" style={{fontSize:"10px",fontWeight:700,letterSpacing:".08em",textTransform:"uppercase",padding:"3px 8px",borderRadius:"5px",background:"rgba(34,197,94,.1)",color:"#22c55e",border:"1px solid rgba(34,197,94,.2)"}}>
                            Enrolled
                          </span>
                        </div>
                        <div className="pp-display" style={{fontSize:"16px",fontWeight:800,color:"var(--text-primary)",marginBottom:"4px",transition:"color 0.3s"}}>{club.name}</div>
                        <div className="pp-sans" style={{fontSize:"12px",color:"var(--text-muted)",marginBottom:"14px",transition:"color 0.3s"}}>{club.category}</div>
                        <button onClick={()=>toggleEnroll(club.id)} className="pp-sans" style={{
                          width:"100%",padding:"9px",borderRadius:"8px",
                          border:"1.5px solid var(--border-subtle)",
                          background:"none",color:"var(--accent)",
                          fontSize:"12.5px",fontWeight:600,cursor:"pointer",
                          transition:"background .15s",
                        }}
                          onMouseEnter={e=>e.currentTarget.style.background="rgba(124,58,237,.06)"}
                          onMouseLeave={e=>e.currentTarget.style.background="none"}>
                          Leave club
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div style={{textAlign:"center",padding:"80px 0"}}>
                  <div style={{width:"68px",height:"68px",borderRadius:"20px",background:"var(--bg-input)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 20px",fontSize:"30px"}}>🏆</div>
                  <h3 className="pp-display" style={{fontSize:"22px",color:"var(--text-primary)",marginBottom:"8px",fontWeight:800,transition:"color 0.3s"}}>No clubs yet</h3>
                  <p className="pp-sans" style={{color:"var(--text-muted)",fontSize:"14px",marginBottom:"24px",transition:"color 0.3s"}}>Browse clubs and join one that interests you</p>
                  <Link href="/page1" className="pp-sans" style={{background:"var(--accent)",color:"var(--text-on-accent)",padding:"13px 28px",borderRadius:"10px",fontWeight:700,fontSize:"14px",textDecoration:"none"}}>
                    Browse clubs →
                  </Link>
                </div>
              )}
            </div>
          )}
          {activeTab==="myclubs" && (
            <div>
              {ownedClubs.length > 0 ? (
                <div>
                  <p className="pp-sans" style={{
                    fontSize:"10.5px",fontWeight:700,color:"var(--text-muted)",
                    letterSpacing:".12em",textTransform:"uppercase",margin:"0 0 18px",
                    transition:"color 0.3s",
                  }}>
                    Owned · {ownedClubs.length}
                  </p>
                  <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:"14px"}}>
                    {ownedClubs.map(club=>(
                      <div key={club.id} className="pp-club-card">
                        {club.banner ? (
                          <div style={{height:"72px",borderRadius:"10px",overflow:"hidden",marginBottom:"16px",background:club.bg}}>
                            {(()=>{
                              try { const imgs=JSON.parse(club.banner); return <img src={imgs[0]} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>; }
                              catch { return null; }
                            })()}
                          </div>
                        ) : (
                          <div style={{height:"56px",borderRadius:"10px",marginBottom:"16px",background:`linear-gradient(135deg,${club.accent}18,${club.accent}08)`,border:`1px solid ${club.accent}18`}}/>
                        )}
                        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"12px"}}>
                          <div style={{width:"42px",height:"42px",borderRadius:"11px",background:club.bg,border:`1.5px solid ${club.accent}22`,display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden"}}>
                            {club.logo
                              ? <img src={club.logo} alt={club.name} style={{width:"100%",height:"100%",objectFit:"cover"}}/>
                              : <span style={{fontSize:"18px",fontWeight:800,color:club.accent,fontFamily:"'Fraunces',serif"}}>{club.name[0]}</span>
                            }
                          </div>
                          <span className="pp-sans" style={{fontSize:"10px",fontWeight:700,letterSpacing:".08em",textTransform:"uppercase",padding:"3px 8px",borderRadius:"5px",background:"rgba(124,58,237,.1)",color:"var(--accent)",border:"1px solid rgba(124,58,237,.2)"}}>
                            Owner
                          </span>
                        </div>
                        <div className="pp-display" style={{fontSize:"16px",fontWeight:800,color:"var(--text-primary)",marginBottom:"4px",transition:"color 0.3s"}}>{club.name}</div>
                        <div className="pp-sans" style={{fontSize:"12px",color:"var(--text-muted)",marginBottom:"14px",transition:"color 0.3s"}}>{club.category}</div>
                        <div style={{display:"flex",gap:"8px"}}>
                          <button onClick={()=>router.push(`/club-detail?id=${club.id}`)} className="pp-sans" style={{
                            flex:1,padding:"9px",borderRadius:"8px",
                            border:"1.5px solid var(--border-subtle)",
                            background:"none",color:"var(--text-secondary)",
                            fontSize:"12.5px",fontWeight:600,cursor:"pointer",
                            transition:"background .15s",
                          }}
                            onMouseEnter={e=>e.currentTarget.style.background="var(--accent-soft)"}
                            onMouseLeave={e=>e.currentTarget.style.background="none"}>
                            View Club
                          </button>
                          <button onClick={()=>router.push(`/club-edit?id=${club.id}`)} className="pp-sans" style={{
                            flex:1,padding:"9px",borderRadius:"8px",
                            border:"1.5px solid var(--accent)",
                            background:"var(--accent)",color:"var(--text-on-accent)",
                            fontSize:"12.5px",fontWeight:700,cursor:"pointer",
                            transition:"opacity .15s",
                          }}
                            onMouseEnter={e=>e.currentTarget.style.opacity="0.85"}
                            onMouseLeave={e=>e.currentTarget.style.opacity="1"}>
                            Edit Club
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div style={{textAlign:"center",padding:"80px 0"}}>
                  <div style={{width:"68px",height:"68px",borderRadius:"20px",background:"var(--bg-input)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 20px",fontSize:"30px"}}>🏠</div>
                  <h3 className="pp-display" style={{fontSize:"22px",color:"var(--text-primary)",marginBottom:"8px",fontWeight:800,transition:"color 0.3s"}}>No owned clubs</h3>
                  <p className="pp-sans" style={{color:"var(--text-muted)",fontSize:"14px",marginBottom:"24px",transition:"color 0.3s"}}>You haven't registered a club yet</p>
                  <Link href="/register-club" className="pp-sans" style={{background:"var(--accent)",color:"var(--text-on-accent)",padding:"13px 28px",borderRadius:"10px",fontWeight:700,fontSize:"14px",textDecoration:"none"}}>
                    Register a Club →
                  </Link>
                </div>
              )}
            </div>
          )}
          {activeTab==="activity" && (
            <div style={{display:"flex",flexDirection:"column",gap:"12px"}}>
              <div className="pp-activity-row">
                <div style={{width:"42px",height:"42px",borderRadius:"12px",flexShrink:0,background:"rgba(124,58,237,.12)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"19px"}}>✨</div>
                <div style={{flex:1}}>
                  <p className="pp-sans" style={{fontSize:"14px",color:"var(--text-primary)",fontWeight:500,margin:0,transition:"color 0.3s"}}>Created Duguilan.com account</p>
                </div>
                <span className="pp-sans" style={{fontSize:"12px",color:"var(--text-muted)",fontWeight:500,transition:"color 0.3s"}}>
                  {saved.created_at ? new Date(saved.created_at).toLocaleDateString() : ""}
                </span>
              </div>

              {enrolledClubs.length === 0 ? (
                <div style={{textAlign:"center",padding:"60px 0"}}>
                  <div style={{fontSize:"34px",marginBottom:"12px"}}>📭</div>
                  <p className="pp-sans" style={{color:"var(--text-muted)",fontSize:"14px",transition:"color 0.3s"}}>No club activity yet — join a club!</p>
                  <Link href="/page1" className="pp-sans" style={{display:"inline-block",marginTop:"16px",background:"var(--accent)",color:"var(--text-on-accent)",padding:"10px 24px",borderRadius:"9px",fontWeight:700,fontSize:"13px",textDecoration:"none"}}>
                    Browse clubs →
                  </Link>
                </div>
              ) : enrolledClubs.map(club=>(
                <div key={club.id} className="pp-activity-row">
                  <div style={{width:"42px",height:"42px",borderRadius:"12px",flexShrink:0,background:club.bg,display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden",fontFamily:"'Fraunces',serif",fontWeight:800,fontSize:"19px",color:club.accent}}>
                    {club.logo ? <img src={club.logo} alt={club.name} style={{width:"100%",height:"100%",objectFit:"cover"}}/> : club.name[0]}
                  </div>
                  <div style={{flex:1}}>
                    <p className="pp-sans" style={{fontSize:"14px",color:"var(--text-primary)",fontWeight:600,margin:"0 0 2px",transition:"color 0.3s"}}>
                      Joined <strong>{club.name}</strong>
                    </p>
                    <p className="pp-sans" style={{fontSize:"12px",color:"var(--text-muted)",margin:0,transition:"color 0.3s"}}>{club.category}</p>
                  </div>
                  <span className="pp-sans" style={{fontSize:"11px",fontWeight:700,padding:"3px 9px",borderRadius:"5px",background:club.bg,color:club.accent}}>{club.category}</span>
                </div>
              ))}
            </div>
          )}

        </div>
      </main>
      <Footer/>
      {editOpen && (
        <div className="pp-modal-overlay" onClick={e=>{ if(e.target===e.currentTarget){ setEditOpen(false); setEditData(saved); setAvatarPreview(saved.avatar||null); setPendingAvatarFile(null); }}}>
          <div className="pp-modal">
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"28px"}}>
              <h2 className="pp-display" style={{fontSize:"22px",fontWeight:800,color:"var(--text-primary)",margin:0,transition:"color 0.3s"}}>Edit Profile</h2>
              <button onClick={()=>{ setEditOpen(false); setEditData(saved); setAvatarPreview(saved.avatar||null); setPendingAvatarFile(null); }} style={{background:"none",border:"none",cursor:"pointer",color:"var(--text-muted)",padding:0,transition:"color .15s"}}
                onMouseEnter={e=>e.currentTarget.style.color="var(--accent)"} onMouseLeave={e=>e.currentTarget.style.color="var(--text-muted)"}>
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12"/></svg>
              </button>
            </div>
            <div style={{
              display:"flex",alignItems:"center",gap:"16px",
              padding:"16px",borderRadius:"14px",
              background:"var(--bg-input)",border:"1.5px solid var(--border-subtle)",
              marginBottom:"22px",
            }}>
              <div
                className="pp-avatar-wrap"
                onClick={()=>fileInputRef.current?.click()}
                style={{position:"relative",width:"64px",height:"64px",borderRadius:"50%",cursor:"pointer",flexShrink:0}}
              >
                <div style={{
                  width:"64px",height:"64px",borderRadius:"50%",overflow:"hidden",
                  background:"var(--accent)",
                  display:"flex",alignItems:"center",justifyContent:"center",
                  color:"#fff",fontFamily:"'Fraunces',serif",fontSize:"20px",fontWeight:800,
                }}>
                  {(avatarPreview || saved.avatar)
                    ? <img src={avatarPreview || saved.avatar} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
                    : getInitials(saved.name || "U")
                  }
                </div>
                <div className="pp-avatar-upload" style={{borderRadius:"50%"}}>
                  <svg width="16" height="16" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                    <circle cx="12" cy="13" r="4"/>
                  </svg>
                </div>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{display:"none"}}
                onChange={handleAvatarChange}
              />
              <div style={{flex:1}}>
                <p className="pp-sans" style={{fontSize:"13.5px",fontWeight:600,color:"var(--text-primary)",margin:"0 0 6px",transition:"color 0.3s"}}>Profile photo</p>
                <button
                  type="button"
                  onClick={()=>fileInputRef.current?.click()}
                  className="pp-sans"
                  style={{
                    display:"inline-flex",alignItems:"center",gap:"6px",
                    padding:"7px 14px",borderRadius:"8px",
                    border:"1.5px solid var(--accent-soft)",
                    background:"var(--accent-soft)",
                    color:"var(--accent)",fontSize:"12.5px",fontWeight:600,
                    cursor:"pointer",fontFamily:"'DM Sans',sans-serif",
                    transition:"all .15s",
                  }}
                  onMouseEnter={e=>{e.currentTarget.style.background="var(--accent-soft)";e.currentTarget.style.borderColor="var(--accent)";}}
                  onMouseLeave={e=>{e.currentTarget.style.background="var(--accent-soft)";e.currentTarget.style.borderColor="var(--accent-soft)";}}
                >
                  <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
                  </svg>
                  {pendingAvatarFile ? "Change photo" : "Upload photo"}
                </button>
                {pendingAvatarFile && (
                  <p className="pp-sans" style={{fontSize:"11px",color:"#22c55e",margin:"5px 0 0",fontWeight:500}}>✓ New photo ready</p>
                )}
              </div>
            </div>

            <div style={{display:"flex",flexDirection:"column",gap:"18px"}}>
              {[
                {key:"name",    label:"Full Name", type:"text", placeholder:"Your full name"},
                {key:"phone",   label:"Phone",     type:"tel",  placeholder:"+976 ···"},
                {key:"location",label:"Location",  type:"text", placeholder:"City, Country"},
              ].map(({key,label,type,placeholder})=>(
                <div key={key}>
                  <label className="pp-sans" style={labelStyle}>{label}</label>
                  <input className="pp-input" type={type} placeholder={placeholder}
                    value={editData[key]||""}
                    onChange={e=>setEditData(d=>({...d,[key]:e.target.value}))}/>
                </div>
              ))}
              <div>
                <label className="pp-sans" style={labelStyle}>Bio</label>
                <textarea className="pp-input" placeholder="Tell people about yourself…"
                  value={editData.bio||""}
                  onChange={e=>setEditData(d=>({...d,bio:e.target.value}))}
                  rows={3} style={{resize:"vertical",lineHeight:1.65}}/>
              </div>
            </div>

            <div style={{display:"flex",gap:"12px",marginTop:"28px"}}>
              <button onClick={()=>{ setEditOpen(false); setEditData(saved); setAvatarPreview(saved.avatar||null); setPendingAvatarFile(null); }} className="pp-sans" style={{
                flex:1,padding:"13px",borderRadius:"9px",
                border:"1.5px solid var(--border-subtle)",
                background:"none",color:"var(--text-secondary)",
                fontSize:"14px",fontWeight:600,cursor:"pointer",
                transition:"background .15s",
              }}
                onMouseEnter={e=>e.currentTarget.style.background="var(--bg-input)"}
                onMouseLeave={e=>e.currentTarget.style.background="none"}>
                Cancel
              </button>
              <button onClick={handleSave} disabled={saveLoading} className="pp-sans" style={{
                flex:1,padding:"13px",borderRadius:"9px",border:"none",
                background:"var(--accent)",
                color:"#fff",fontSize:"14px",fontWeight:700,
                cursor:saveLoading?"not-allowed":"pointer",
                opacity:saveLoading?.7:1,transition:"opacity .15s",
              }}>
                {saveLoading ? "Хадгалж байна…" : "Save changes"}
              </button>
            </div>
            {saveError && <p className="pp-sans" style={{color:"#dc2626",fontSize:"13px",marginTop:"10px",textAlign:"center"}}>{saveError}</p>}
          </div>
        </div>
      )}
    </div>
  );
}