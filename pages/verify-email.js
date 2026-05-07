import { useEffect, useState } from "react";
import { useRouter } from "next/router";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const fetchAPI = (url, options = {}) =>
  fetch(url, {
    ...options,
    headers: { "ngrok-skip-browser-warning": "true", ...options.headers },
  });


const css = `
  @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:wght@400;500;600;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; }

  .ve-serif { font-family: 'Instrument Serif', serif; }
  .ve-sans  { font-family: 'DM Sans', sans-serif; }

  @keyframes ve-spin     { to { transform: rotate(360deg); } }
  @keyframes ve-fadeUp   { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:none; } }
  @keyframes ve-pop      { 0%{opacity:0;transform:scale(.6)} 65%{transform:scale(1.05)} 100%{opacity:1;transform:scale(1)} }
  @keyframes ve-ripple   { 0%{transform:scale(1);opacity:.5} 100%{transform:scale(2.6);opacity:0} }
  @keyframes ve-check    { from{stroke-dashoffset:50;opacity:0} to{stroke-dashoffset:0;opacity:1} }
  @keyframes ve-float    { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
  @keyframes ve-shimmer  { 0%{background-position:-200% center} 100%{background-position:200% center} }
  @keyframes ve-confetti {
    0%  { transform:translateY(-10px) rotate(0deg);   opacity:1; }
    100%{ transform:translateY(260px) rotate(540deg); opacity:0; }
  }
  @keyframes ve-countdown {
    from { width: 100%; }
    to   { width: 0%; }
  }

  .ve-card {
    background: rgba(255,255,255,0.96);
    backdrop-filter: blur(32px);
    -webkit-backdrop-filter: blur(32px);
    border: 1.5px solid rgba(124,58,237,0.1);
    border-radius: 28px;
    padding: 56px 52px 52px;
    box-shadow:
      0 32px 80px rgba(124,58,237,0.12),
      0 4px 20px rgba(26,5,51,0.05),
      inset 0 1px 0 rgba(255,255,255,0.9);
    text-align: center;
    position: relative;
    overflow: hidden;
  }

  .ve-btn {
    display: inline-flex; align-items: center; justify-content: center; gap: 8px;
    padding: 15px 36px; background: linear-gradient(135deg, #7c3aed, #4c1d95);
    color: #fff; border-radius: 14px; text-decoration: none; font-weight: 700;
    font-size: 14.5px; font-family: 'DM Sans', sans-serif;
    box-shadow: 0 8px 28px rgba(124,58,237,0.38);
    transition: transform .18s, box-shadow .18s; border: none; cursor: pointer;
    letter-spacing: .01em; width: 100%; max-width: 300px;
  }
  .ve-btn:hover { transform: translateY(-2px); box-shadow: 0 12px 36px rgba(124,58,237,0.52); }

  .ve-btn-ghost {
    display: inline-flex; align-items: center; justify-content: center; gap: 6px;
    padding: 13px 28px; background: transparent; color: #7c3aed; border-radius: 12px;
    text-decoration: none; font-weight: 600; font-size: 13.5px;
    font-family: 'DM Sans', sans-serif; border: 1.5px solid rgba(124,58,237,0.2);
    transition: background .18s, border-color .18s, transform .18s;
    width: 100%; max-width: 300px;
  }
  .ve-btn-ghost:hover { background: rgba(124,58,237,0.06); border-color: rgba(124,58,237,0.4); transform: translateY(-1px); }

  .ve-shimmer {
    background: linear-gradient(90deg, #c4b5fd 0%, #7c3aed 40%, #c4b5fd 80%);
    background-size: 200% auto; -webkit-background-clip: text;
    -webkit-text-fill-color: transparent; background-clip: text;
    animation: ve-shimmer 2s linear infinite;
  }

  .ve-fadein { animation: ve-fadeUp .5s cubic-bezier(.22,1,.36,1) both; }
`;

function Background() {
  return (
    <div style={{ position:"fixed", inset:0, overflow:"hidden", pointerEvents:"none", zIndex:0 }}>
      <div style={{ position:"absolute", top:"-20%", left:"-10%", width:"60vw", height:"60vw", borderRadius:"50%", background:"radial-gradient(circle, rgba(167,139,250,0.15) 0%, transparent 65%)", animation:"ve-float 12s ease-in-out infinite" }}/>
      <div style={{ position:"absolute", bottom:"-15%", right:"-8%", width:"50vw", height:"50vw", borderRadius:"50%", background:"radial-gradient(circle, rgba(196,181,253,0.12) 0%, transparent 65%)", animation:"ve-float 16s ease-in-out infinite reverse" }}/>
      <svg style={{ position:"absolute", inset:0, width:"100%", height:"100%", opacity:0.5 }}>
        <defs><pattern id="dots" width="28" height="28" patternUnits="userSpaceOnUse"><circle cx="1.5" cy="1.5" r="1" fill="#7c3aed" fillOpacity="0.08"/></pattern></defs>
        <rect width="100%" height="100%" fill="url(#dots)"/>
      </svg>
    </div>
  );
}

function Confetti() {
  const items = Array.from({ length: 20 }, (_, i) => ({
    color: ["#7c3aed","#a78bfa","#c4b5fd","#22c55e","#fbbf24","#ec4899","#38bdf8"][i % 7],
    left: `${5 + (i * 4.8) % 90}%`, delay: `${(i * 0.08).toFixed(2)}s`,
    dur: `${0.65 + (i % 5) * 0.15}s`, size: i % 3 === 0 ? 9 : 6, circle: i % 4 === 0,
  }));
  return (
    <div style={{ position:"absolute", top:0, left:0, right:0, height:"240px", overflow:"hidden", pointerEvents:"none", zIndex:0 }}>
      {items.map((p, i) => (
        <div key={i} style={{ position:"absolute", top:"-10px", left:p.left, width:`${p.size}px`, height:`${p.circle ? p.size : p.size * 1.7}px`, borderRadius: p.circle ? "50%" : "2px", background: p.color, animation: `ve-confetti ${p.dur} ${p.delay} ease-in both` }}/>
      ))}
    </div>
  );
}

function Spinner() {
  return (
    <div style={{ textAlign:"center", padding:"12px 0" }}>
      <div style={{ position:"relative", width:80, height:80, margin:"0 auto 28px" }}>
        <div style={{ position:"absolute", inset:0, borderRadius:"50%", border:"2.5px solid rgba(124,58,237,0.08)" }}/>
        <div style={{ position:"absolute", inset:0, borderRadius:"50%", border:"2.5px solid transparent", borderTopColor:"#7c3aed", animation:"ve-spin .85s linear infinite" }}/>
        <div style={{ position:"absolute", inset:10, borderRadius:"50%", border:"2px solid transparent", borderTopColor:"#c4b5fd", animation:"ve-spin 1.3s linear infinite reverse" }}/>
        <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center" }}>
          <div style={{ width:12, height:12, borderRadius:"50%", background:"linear-gradient(135deg,#7c3aed,#a78bfa)" }}/>
        </div>
      </div>
      <h2 className="ve-serif ve-shimmer" style={{ fontSize:26, fontWeight:400, marginBottom:10 }}>Баталгаажуулж байна…</h2>
      <p className="ve-sans" style={{ fontSize:14, color:"#9879d4" }}>Таны имэйл шалгагдаж байна</p>
    </div>
  );
}

function SuccessIcon() {
  return (
    <div style={{ position:"relative", width:96, height:96, margin:"0 auto 28px" }}>
      {[0,1].map(i => (<div key={i} style={{ position:"absolute", inset:0, borderRadius:"50%", border:"2px solid rgba(34,197,94,0.25)", animation:`ve-ripple 2.2s ${i * 0.6}s ease-out infinite` }}/>))}
      <div style={{ position:"absolute", inset:0, borderRadius:"26px", background:"linear-gradient(145deg, #dcfce7, #bbf7d0)", border:"2px solid rgba(34,197,94,0.2)", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 16px 48px rgba(34,197,94,0.18), inset 0 1px 0 rgba(255,255,255,0.9)", animation:"ve-pop .5s cubic-bezier(.22,1,.36,1) both" }}>
        <svg width="42" height="42" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
          <polyline points="20 6 9 17 4 12" style={{ strokeDasharray:50, animation:"ve-check .6s .3s cubic-bezier(.22,1,.36,1) both" }}/>
        </svg>
      </div>
    </div>
  );
}

function ErrorIcon() {
  return (
    <div style={{ width:96, height:96, borderRadius:"26px", margin:"0 auto 28px", background:"linear-gradient(145deg,#fef2f2,#fee2e2)", border:"2px solid rgba(239,68,68,0.18)", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 16px 48px rgba(239,68,68,0.1)", animation:"ve-pop .5s cubic-bezier(.22,1,.36,1) both" }}>
      <svg width="40" height="40" fill="none" stroke="#dc2626" strokeWidth="2.5" strokeLinecap="round" viewBox="0 0 24 24">
        <line x1="18" y1="6" x2="6" y2="18" style={{ strokeDasharray:20, animation:"ve-check .3s .1s ease both" }}/>
        <line x1="6" y1="6" x2="18" y2="18" style={{ strokeDasharray:20, animation:"ve-check .3s .25s ease both" }}/>
      </svg>
    </div>
  );
}

function AlreadyIcon() {
  return (
    <div style={{ width:96, height:96, borderRadius:"26px", margin:"0 auto 28px", background:"linear-gradient(145deg,#f5f0ff,#ede9fe)", border:"2px solid rgba(124,58,237,0.14)", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 16px 48px rgba(124,58,237,0.1)", fontSize:40, animation:"ve-pop .5s cubic-bezier(.22,1,.36,1) both" }}>
      🔗
    </div>
  );
}

function ClubStatus() {
  const steps = [
    { done:true,  icon:"✓", label:"Имэйл баталгаажлаа",   sub:"Таны имэйл амжилттай шалгагдлаа" },
    { done:false, icon:"2", label:"Admin хянаж байна",      sub:"Ихэвчлэн 24 цагийн дотор" },
    { done:false, icon:"3", label:"Клуб нийтлэгдэнэ",       sub:"Хуудсанд харагдах болно" },
  ];
  return (
    <div style={{ background:"linear-gradient(135deg,#fdfcff,#f8f4ff)", border:"1.5px solid rgba(124,58,237,0.1)", borderRadius:18, padding:"22px 24px", marginBottom:28, textAlign:"left" }}>
      <p className="ve-sans" style={{ fontSize:10, fontWeight:800, color:"#9879d4", letterSpacing:".12em", textTransform:"uppercase", marginBottom:18 }}>Клубийн явц</p>
      {steps.map((s, i) => (
        <div key={i} style={{ display:"flex", gap:14, alignItems:"flex-start", paddingBottom: i < 2 ? 16 : 0 }}>
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center", flexShrink:0 }}>
            <div style={{ width:30, height:30, borderRadius:"50%", background: s.done ? "linear-gradient(135deg,#22c55e,#16a34a)" : "rgba(124,58,237,0.06)", border:`1.5px solid ${s.done ? "#22c55e" : "rgba(124,58,237,0.14)"}`, display:"flex", alignItems:"center", justifyContent:"center", boxShadow: s.done ? "0 4px 12px rgba(34,197,94,0.25)" : "none", flexShrink:0 }}>
              {s.done ? <svg width="12" height="12" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg> : <span className="ve-sans" style={{ fontSize:11, fontWeight:700, color:"#c4b5fd" }}>{s.icon}</span>}
            </div>
            {i < 2 && <div style={{ width:2, height:20, marginTop:4, background: s.done ? "linear-gradient(to bottom,#22c55e,rgba(124,58,237,0.1))" : "rgba(124,58,237,0.1)" }}/>}
          </div>
          <div style={{ paddingTop:4 }}>
            <p className="ve-sans" style={{ fontSize:13, fontWeight:700, color: s.done ? "#1a0533" : "#9879d4", marginBottom:2 }}>{s.label}</p>
            <p className="ve-sans" style={{ fontSize:11.5, color:"#bbb", lineHeight:1.5 }}>{s.sub}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function CountdownRedirect({ seconds, onDone, label }) {
  const [left, setLeft] = useState(seconds);
  useEffect(() => {
    if (left <= 0) { onDone(); return; }
    const t = setTimeout(() => setLeft(l => l - 1), 1000);
    return () => clearTimeout(t);
  }, [left, onDone]);
  return (
    <div style={{ marginTop:24, maxWidth:300, margin:"24px auto 0" }}>
      <p className="ve-sans" style={{ fontSize:12.5, color:"#9879d4", marginBottom:8, fontWeight:500 }}>
        {label.replace("{n}", left)}
      </p>
      <div style={{ height:3, borderRadius:4, background:"rgba(124,58,237,0.12)", overflow:"hidden" }}>
        <div style={{ height:"100%", borderRadius:4, background:"linear-gradient(90deg,#7c3aed,#c4b5fd)", animation:`ve-countdown ${seconds}s linear forwards` }}/>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  const router = useRouter();
  const { token, type } = router.query;
  const [status,     setStatus]     = useState("loading");
  const [message,    setMessage]    = useState("");
  const [verifyType, setVerifyType] = useState("");
  const [username,   setUsername]   = useState("");

  useEffect(() => {
    if (!router.isReady) return;
    if (!token || !type) {
      setStatus("error");
      setMessage("Баталгаажуулах линк буруу эсвэл дутуу байна.");
      return;
    }

    const endpoint = type === "user"
      ? `${API}/verify-and-login?token=${encodeURIComponent(token)}&type=${encodeURIComponent(type)}`
      : `${API}/verify-email?token=${encodeURIComponent(token)}&type=${encodeURIComponent(type)}`;

    fetch(endpoint)
      .then(async res => {
        const data = await res.json();
        if (res.ok && data.success) {
          setStatus("success");
          setMessage(data.message);
          setVerifyType(data.type || type);
          if (data.user) {
            localStorage.setItem("user", JSON.stringify(data.user));
            setUsername(data.user.username || data.user.name || "");
          }
        } else if (res.status === 404) {
          setStatus("already");
          setMessage(data.message || "Линк хүчингүй эсвэл аль хэдийн ашигласан байна.");
        } else {
          setStatus("error");
          setMessage(data.message || "Баталгаажуулахад алдаа гарлаа.");
        }
      })
      .catch(() => {
        setStatus("error");
        setMessage("Сервертэй холбогдож чадсангүй. Дахин оролдоно уу.");
      });
  }, [router.isReady, token, type]);

  const isClub = verifyType === "club";
  const handleAutoRedirect = () => router.push("/page");

  return (
    <div style={{ minHeight:"100vh", display:"flex", flexDirection:"column", background:"radial-gradient(ellipse at 20% 20%, #ede9fe 0%, #f5f0ff 30%, #faf8ff 60%, #ffffff 100%)", position:"relative" }}>
      <style>{css}</style>
      <Background/>
      <div style={{ height:3, background:"linear-gradient(90deg,#4c1d95,#7c3aed,#c4b5fd,#7c3aed,#4c1d95)", flexShrink:0, position:"relative", zIndex:2 }}/>
      <nav style={{ padding:"20px 36px", flexShrink:0, position:"relative", zIndex:2 }}>
        <a href="/page" style={{ display:"inline-flex", alignItems:"center", gap:10, textDecoration:"none" }}>
          <div style={{ width:34, height:34, borderRadius:10, background:"linear-gradient(135deg,#1a0533,#3b0764)", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 4px 14px rgba(26,5,51,0.25)" }}>
            <span style={{ color:"#c4b5fd", fontWeight:800, fontSize:15, fontFamily:"'Instrument Serif',serif" }}>D</span>
          </div>
          <span className="ve-serif" style={{ fontSize:20, color:"#1a0533", letterSpacing:"-0.02em" }}>
            Duguilan<span style={{ color:"#7c3aed" }}>.com</span>
          </span>
        </a>
      </nav>

      <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", padding:"16px 16px 72px", position:"relative", zIndex:1 }}>
        <div style={{ width:"100%", maxWidth:480 }}>
          <div className={status !== "loading" ? "ve-card ve-fadein" : "ve-card"}>
            <div style={{ position:"absolute", top:0, left:"15%", right:"15%", height:1, background:"linear-gradient(90deg,transparent,rgba(124,58,237,0.25),transparent)" }}/>
            {status === "success" && !isClub && <Confetti/>}

            <div style={{ position:"relative", zIndex:1 }}>
              {status === "loading" && <Spinner/>}

              {status === "success" && !isClub && (
                <>
                  <SuccessIcon/>
                  <h1 className="ve-serif" style={{ fontSize:28, color:"#1a0533", letterSpacing:"-0.02em", lineHeight:1.2, marginBottom:12 }}>
                    Тавтай морил{username ? `, ${username}` : ""}! 🎉
                  </h1>
                  <p className="ve-sans" style={{ fontSize:14.5, color:"#666", lineHeight:1.8, marginBottom:28, maxWidth:340, marginLeft:"auto", marginRight:"auto" }}>
                    Имэйл хаягаа амжилттай баталгаажууллаа. Та одоо нэвтэрсэн байна.
                  </p>
                  <div style={{ display:"flex", flexDirection:"column", gap:12, alignItems:"center" }}>
                    <button onClick={handleAutoRedirect} className="ve-btn">
                      <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                        <polyline points="9 22 9 12 15 12 15 22"/>
                      </svg>
                      Нүүр хуудас руу орох
                    </button>
                  </div>
                  <CountdownRedirect seconds={4} onDone={handleAutoRedirect} label="{n} секундын дараа автоматаар орно…"/>
                </>
              )}

              {status === "success" && isClub && (
                <>
                  <SuccessIcon/>
                  <h1 className="ve-serif" style={{ fontSize:28, color:"#1a0533", letterSpacing:"-0.02em", lineHeight:1.2, marginBottom:12 }}>
                    Имэйл баталгаажлаа! ✅
                  </h1>
                  <p className="ve-sans" style={{ fontSize:14.5, color:"#666", lineHeight:1.8, marginBottom:36, maxWidth:340, marginLeft:"auto", marginRight:"auto" }}>
                    Таны клубын имэйл амжилттай баталгаажлаа. Манай admin хянаж, удахгүй зөвшөөрнө.
                  </p>
                  <ClubStatus/>
                  <a href="/page" className="ve-btn-ghost" style={{ margin:"0 auto" }}>← Нүүр хуудас руу буцах</a>
                </>
              )}

              {status === "already" && (
                <>
                  <AlreadyIcon/>
                  <h1 className="ve-serif" style={{ fontSize:26, color:"#1a0533", letterSpacing:"-0.02em", marginBottom:10 }}>Линк ашиглагдсан</h1>
                  <p className="ve-sans" style={{ fontSize:14.5, color:"#666", lineHeight:1.75, marginBottom:6 }}>{message || "Энэ линк аль хэдийн ашиглагдсан."}</p>
                  <p className="ve-sans" style={{ fontSize:13, color:"#bbb", marginBottom:36 }}>Баталгаажуулсан бол шууд нэвтэрч болно.</p>
                  <div style={{ display:"flex", flexDirection:"column", gap:12, alignItems:"center" }}>
                    <a href="/signin" className="ve-btn">Нэвтрэх →</a>
                    <a href="/page" className="ve-btn-ghost">← Нүүр хуудас</a>
                  </div>
                </>
              )}

              {status === "error" && (
                <>
                  <ErrorIcon/>
                  <h1 className="ve-serif" style={{ fontSize:26, color:"#1a0533", letterSpacing:"-0.02em", marginBottom:10 }}>Алдаа гарлаа</h1>
                  <p className="ve-sans" style={{ fontSize:14.5, color:"#666", lineHeight:1.75, marginBottom:36, maxWidth:340, marginLeft:"auto", marginRight:"auto" }}>{message || "Баталгаажуулахад алдаа гарлаа. Линк хуучирсан байж магадгүй."}</p>
                  <div style={{ display:"flex", flexDirection:"column", gap:12, alignItems:"center" }}>
                    <a href="/signup" className="ve-btn">Дахин бүртгүүлэх</a>
                    <a href="/page" className="ve-btn-ghost">← Нүүр хуудас</a>
                  </div>
                </>
              )}
            </div>
          </div>

          {status !== "loading" && (
            <p className="ve-sans" style={{ textAlign:"center", fontSize:12, color:"#c4b5fd", marginTop:24, fontWeight:500, lineHeight:1.6 }}>
              Асуух зүйл байвал{" "}
              <a href="mailto:duguilanmail@gmail.com" style={{ color:"#9879d4", fontWeight:700, textDecoration:"none" }}>duguilanmail@gmail.com</a>
              {" "}руу хандана уу
            </p>
          )}
        </div>
      </div>
    </div>
  );
}