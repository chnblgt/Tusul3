import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Header from "@/waterbottle/Header";
import Footer from "@/waterbottle/Footer";
import Link from "next/link";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const fetchAPI = (url, options = {}) =>
  fetch(url, {
    ...options,
    headers: { "ngrok-skip-browser-warning": "true", ...options.headers },
  });

const fonts = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,700;0,9..144,800;1,9..144,700&family=DM+Sans:wght@400;500;600;700&display=swap');
  .od-display { font-family: 'Fraunces', serif; }
  .od-sans    { font-family: 'DM Sans', sans-serif; }

  @keyframes od-fadeUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:none} }
  .od-fadein { animation: od-fadeUp 0.4s cubic-bezier(.22,1,.36,1) both; }

  .od-tab {
    flex: 1; padding: 10px 16px; border-radius: 9px;
    font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 600;
    cursor: pointer; border: none; transition: all 0.2s;
    background: transparent; color: var(--text-muted);
    display: flex; align-items: center; justify-content: center; gap: 8px;
  }
  .od-tab.active {
    background: var(--accent-soft);
    color: var(--accent);
    border: 1px solid var(--border-subtle);
  }

  .od-row {
    display: flex; align-items: center; justify-content: space-between;
    padding: 14px 20px;
    background: var(--bg-card);
    border: 1px solid var(--border-subtle);
    border-radius: 14px; margin-bottom: 8px;
    gap: 12px; flex-wrap: wrap;
    animation: od-fadeUp 0.3s ease both;
    transition: border-color 0.2s, background 0.35s, box-shadow 0.2s;
  }
  .od-row:hover { box-shadow: var(--shadow-card); border-color: var(--border-card); }

  .od-avatar {
    width: 38px; height: 38px; border-radius: 10px; flex-shrink: 0;
    background: var(--accent);
    display: flex; align-items: center; justify-content: center;
    font-family: 'Fraunces', serif; font-size: 14px; font-weight: 800;
    color: var(--text-on-accent); overflow: hidden;
  }

  .od-badge { font-family: 'DM Sans', sans-serif; font-size: 11px; font-weight: 700; padding: 3px 10px; border-radius: 20px; }
  .od-badge-green  { background: rgba(34,197,94,0.1);  color: #16a34a; border: 1px solid rgba(34,197,94,0.2);  }
  .od-badge-purple { background: var(--accent-soft); color: var(--accent); border: 1px solid var(--border-subtle); }
  .od-badge-yellow { background: rgba(245,158,11,0.1); color: #b45309; border: 1px solid rgba(245,158,11,0.2); }
  .od-badge-red    { background: rgba(239,68,68,0.08); color: #dc2626; border: 1px solid rgba(239,68,68,0.15); }

  @media (max-width: 640px) {
    .od-tabs-wrap { overflow-x: auto; -webkit-overflow-scrolling: touch; }
    .od-tab { flex: 0 0 auto !important; white-space: nowrap; padding: 8px 10px !important; font-size: 11px !important; gap: 4px !important; }
    .od-row { padding: 10px 12px !important; }
  }

  .od-stat-card {
    background: var(--bg-card); border: 1px solid var(--border-subtle);
    border-radius: 16px; padding: 20px 24px;
    transition: all 0.35s;
  }
  .od-stat-card:hover { box-shadow: var(--shadow-card); }

  .od-search {
    width: 100%; padding: 11px 16px 11px 42px;
    background: var(--bg-input); border: 1px solid var(--border-input);
    border-radius: 10px; font-family: 'DM Sans', sans-serif;
    font-size: 13.5px; color: var(--text-primary); outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  .od-search::placeholder { color: var(--text-muted); }
  .od-search:focus { border-color: var(--accent) !important; box-shadow: 0 0 0 3px var(--accent-glow) !important; }

  .od-empty {
    text-align: center; padding: 56px 24px;
    font-family: 'DM Sans', sans-serif; font-size: 14px; color: var(--text-muted);
  }

  .od-back-btn {
    display: inline-flex; align-items: center; gap: 6px;
    font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 600;
    color: var(--text-muted); text-decoration: none;
    border: 1px solid var(--border-subtle); border-radius: 8px;
    padding: 7px 14px; background: var(--bg-card);
    transition: all 0.2s; margin-bottom: 24px;
  }
  .od-back-btn:hover { color: var(--accent); background: var(--accent-soft); border-color: var(--border-card); }

  .od-modal-overlay {
    position: fixed; inset: 0; background: rgba(0,0,0,0.55);
    display: flex; align-items: center; justify-content: center;
    z-index: 9999; padding: 24px;
  }
  .od-modal {
    background: var(--bg-card); border-radius: 20px;
    padding: 32px; max-width: 480px; width: 100%;
    border: 1px solid var(--border-card);
    animation: od-fadeUp 0.3s cubic-bezier(.22,1,.36,1) both;
  }
  .od-btn-primary {
    width: 100%; padding: 13px;
    background: var(--accent); color: var(--text-on-accent);
    border: none; border-radius: 10px;
    font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 700;
    cursor: pointer; transition: all 0.18s;
  }
  .od-btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
  .od-btn-primary:hover:not(:disabled) { opacity: 0.9; transform: translateY(-1px); }
  .od-input {
    width: 100%; padding: 11px 14px;
    background: var(--bg-input); border: 1px solid var(--border-input);
    border-radius: 9px; font-family: 'DM Sans', sans-serif;
    font-size: 14px; color: var(--text-primary); outline: none;
    transition: border-color 0.2s, box-shadow 0.2s; box-sizing: border-box;
  }
  .od-input:focus { border-color: var(--accent); box-shadow: 0 0 0 3px var(--accent-glow); }
  .od-label {
    font-family: 'DM Sans', sans-serif; font-size: 11px; font-weight: 700;
    color: var(--text-muted); letter-spacing: 0.1em; text-transform: uppercase;
    display: block; margin-bottom: 8px;
  }
`;

function StatCard({ label, value, sub, accent }) {
  return (
    <div className="od-stat-card">
      <p className="od-sans" style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 8px" }}>{label}</p>
      <p className="od-display" style={{ fontSize: "2rem", fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.04em", lineHeight: 1, margin: "0 0 4px" }}>{value}</p>
      {sub && <p className="od-sans" style={{ fontSize: "12px", color: accent || "var(--accent)", margin: 0 }}>{sub}</p>}
    </div>
  );
}

function PaymentRow({ pay, formatDate, formatMNT, onConfirm, onReject, i }) {
  const [acting, setActing] = useState(false);
  const [showNote, setShowNote] = useState(false);
  async function act(fn) { setActing(true); await fn(pay.id); setActing(false); }
  const statusStyle = { confirmed: "od-badge-green", pending: "od-badge-yellow", rejected: "od-badge-red" }[pay.status] || "od-badge-purple";
  const statusLabel = { confirmed: "Confirmed", pending: "Pending", rejected: "Rejected" }[pay.status] || pay.status;
  return (
    <div style={{ marginBottom: "8px" }}>
      <div className="od-row" style={{ animationDelay: `${i * 0.04}s`, flexDirection: "column", alignItems: "stretch", gap: "10px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "10px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "14px", flex: 1, minWidth: 0 }}>
            <div className="od-avatar">{(pay.user_name || "?").charAt(0).toUpperCase()}</div>
            <div style={{ minWidth: 0 }}>
              <p className="od-sans" style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-primary)", margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {pay.user_name || "Unknown user"}
              </p>
              <p className="od-sans" style={{ fontSize: "12px", color: "var(--text-muted)", margin: "2px 0 0" }}>
                {pay.user_email || "—"}{pay.tier_name ? ` · ${pay.tier_name}` : ""}
              </p>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", flexShrink: 0, flexWrap: "wrap", justifyContent: "flex-end" }}>
            <span className="od-display" style={{ fontSize: "15px", fontWeight: 800, color: "var(--accent)", letterSpacing: "-0.02em" }}>{formatMNT(pay.amount)}</span>
            <span className="od-sans" style={{ fontSize: "12px", color: "var(--text-muted)" }}>{formatDate(pay.paid_at || pay.created_at)}</span>
            <span className={`od-badge ${statusStyle}`}>{statusLabel}</span>
            {pay.receipt_url && (
              <Link href={pay.receipt_url} target="_blank" rel="noopener noreferrer" className="od-sans"
                style={{ fontSize: "12px", fontWeight: 600, color: "var(--accent)", textDecoration: "none", border: "1px solid var(--border-subtle)", borderRadius: "7px", padding: "5px 12px", transition: "all 0.2s" }}>
                View receipt
              </Link>
            )}
            {pay.status === "pending" && (
              <>
                <button onClick={() => act(onConfirm)} disabled={acting} className="od-sans"
                  style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.25)", borderRadius: "7px", padding: "6px 14px", cursor: "pointer", color: "#16a34a", fontSize: "12px", fontWeight: 700, opacity: acting ? 0.6 : 1, transition: "all 0.2s" }}>
                  {acting ? "…" : "✓ Confirm"}
                </button>
                <button onClick={() => act(onReject)} disabled={acting} className="od-sans"
                  style={{ background: "transparent", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "7px", padding: "5px 12px", cursor: "pointer", color: "#dc2626", fontSize: "12px", fontWeight: 600, transition: "all 0.2s" }}>
                  Reject
                </button>
              </>
            )}
          </div>
        </div>
        {pay.payment_note && (
          <div>
            <button onClick={() => setShowNote(v => !v)} className="od-sans"
              style={{ background: "none", border: "none", cursor: "pointer", color: "var(--accent)", fontSize: "12px", fontWeight: 600, padding: 0, display: "flex", alignItems: "center", gap: "5px" }}>
              <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              {showNote ? "Hide note" : "View payment note"}
            </button>
            {showNote && (
              <div style={{ marginTop: "8px", padding: "10px 14px", borderRadius: "9px", background: "var(--accent-soft)", border: "1px solid var(--border-subtle)" }}>
                <p className="od-sans" style={{ fontSize: "13px", color: "var(--text-secondary)", margin: 0, lineHeight: 1.6 }}>
                  💬 {pay.payment_note}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ClubOwnerDashboard() {
  const router = useRouter();
  const { clubId } = router.query;
  const [user, setUser]                 = useState(null);
  const [club, setClub]                 = useState(null);
  const [members, setMembers]           = useState([]);
  const [payments, setPayments]         = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState("");
  const [activeTab, setActiveTab]       = useState("members");
  const [search, setSearch]             = useState("");
  const [showAddMember, setShowAddMember] = useState(false);
  const [addEmail, setAddEmail]         = useState("");
  const [addTier, setAddTier]           = useState("");
  const [addingMember, setAddingMember] = useState(false);
  const [addMemberMsg, setAddMemberMsg] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) { router.push("/signin"); return; }
    setUser(JSON.parse(stored));
  }, []);

  useEffect(() => {
    if (!router.isReady || !user) return;
    if (!clubId) { setError("Клубын ID олдсонгүй."); setLoading(false); return; }
    loadAll();
  }, [router.isReady, clubId, user]);

  async function loadAll() {
    setLoading(true); setError("");
    try {
      const clubRes = await fetchAPI(`${API}/clubs/${clubId}`);
      const clubData = await clubRes.json();
      if (!clubData.success) { setError("Клуб олдсонгүй."); setLoading(false); return; }
      if (String(clubData.club.owner_id) !== String(user.id)) {
        setError("Энэ хуудсыг харах эрх байхгүй байна."); setLoading(false); return;
      }
      setClub(clubData.club);
      const [memRes, payRes] = await Promise.all([
        fetchAPI(`${API}/club/${clubId}/members`, { headers: { "x-user-id": String(user.id) } }),
        fetchAPI(`${API}/club/${clubId}/payments`, { headers: { "x-user-id": String(user.id) } }),
      ]);
      const memData = await memRes.json();
      const payData = await payRes.json();
      if (memData.success) setMembers(memData.members || []);
      if (payData.success) setPayments(payData.payments || []);
    } catch { setError("Серверт холбогдож чадсангүй."); }
    finally { setLoading(false); }
  }

  async function confirmPayment(id) {
    try {
      await fetchAPI(`${API}/club/${clubId}/payments/${id}/confirm`, { method: "POST", headers: { "x-user-id": String(user.id) } });
      const pay = payments.find(p => p.id === id);
      setPayments(prev => prev.map(p => p.id === id ? { ...p, status: "confirmed" } : p));
      if (pay) setMembers(prev => prev.map(m => m.id === pay.user_id ? { ...m, payment_status: "confirmed" } : m));
    } catch {}
  }

  async function rejectPayment(id) {
    if (!confirm("Энэ төлбөрийг татгалзах уу?")) return;
    try {
      await fetchAPI(`${API}/club/${clubId}/payments/${id}/reject`, { method: "POST", headers: { "x-user-id": String(user.id) } });
      setPayments(prev => prev.map(p => p.id === id ? { ...p, status: "rejected" } : p));
    } catch {}
  }

  async function removeMember(memberId) {
    if (!confirm("Энэ гишүүнийг клубаас хасах уу?")) return;
    try {
      await fetchAPI(`${API}/club/${clubId}/members/${memberId}`, { method: "DELETE", headers: { "x-user-id": String(user.id) } });
      setMembers(prev => prev.filter(m => m.id !== memberId));
    } catch {}
  }

  async function addMember() {
    if (!addEmail) return;
    setAddingMember(true); setAddMemberMsg("");
    try {
      const res = await fetchAPI(`${API}/club/${clubId}/addMember`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-user-id": String(user.id) },
        body: JSON.stringify({ email: addEmail, tier_name: addTier || null, payment_status: "confirmed" }),
      });
      const data = await res.json();
      if (data.success) {
        setAddMemberMsg("✓ Гишүүн амжилттай нэмэгдлээ");
        setAddEmail(""); setAddTier("");
        loadAll();
      } else {
        setAddMemberMsg(data.message || "Алдаа гарлаа");
      }
    } catch { setAddMemberMsg("Серверт холбогдож чадсангүй"); }
    finally { setAddingMember(false); }
  }

  function formatDate(iso) {
    if (!iso) return "—";
    return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  }
  function formatMNT(amount) { return `₮${Number(amount || 0).toLocaleString()}`; }

  const totalRevenue      = payments.filter(p => p.status === "confirmed").reduce((s, p) => s + Number(p.amount || 0), 0);
  const pendingPayments   = payments.filter(p => p.status === "pending");
  const confirmedPayments = payments.filter(p => p.status === "confirmed");
  const thisMonth         = members.filter(m => {
    if (!m.joined_at) return false;
    const d = new Date(m.joined_at), now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });
  const q                = search.toLowerCase();
  const filteredMembers  = members.filter(m => (m.name || "").toLowerCase().includes(q) || (m.email || "").toLowerCase().includes(q));
  const filteredPayments = payments.filter(p => (p.user_name || "").toLowerCase().includes(q) || (p.user_email || "").toLowerCase().includes(q) || (p.tier_name || "").toLowerCase().includes(q));

  const shell = (body) => (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--bg-page)", transition: "background 0.35s, color 0.35s" }}>
      <style>{fonts}</style>
      <Header />{body}<Footer />
    </div>
  );

  if (loading) return shell(
    <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p className="od-sans" style={{ color: "var(--text-muted)", fontSize: "15px" }}>Ачааллаж байна…</p>
    </div>
  );

  if (error) return shell(
    <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, padding: "32px" }}>
      <div style={{ width: 56, height: 56, borderRadius: 14, background: "var(--accent-soft)", border: "1px solid var(--border-subtle)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <svg width="22" height="22" fill="none" stroke="var(--accent)" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
      </div>
      <p className="od-display" style={{ fontSize: "22px", color: "var(--text-primary)", fontWeight: 800 }}>{error}</p>
      <Link href="/page1" className="od-sans" style={{ color: "var(--accent)", fontWeight: 600, fontSize: "14px" }}>← Клубууд руу буцах</Link>
    </div>
  );

  return shell(
    <>
      <div style={{ height: "2px", background: "linear-gradient(90deg,var(--accent),var(--text-accent,var(--accent)),var(--accent))" }} />
      <main style={{ flex: 1, padding: "48px 24px 96px" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <div className="od-fadein" style={{ marginBottom: "40px" }}>
            <Link href="/page1" className="od-back-btn">
              <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg>
              Browse clubs
            </Link>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "20px", flexWrap: "wrap" }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: "20px", flexWrap: "wrap" }}>
                <div style={{ width: "64px", height: "64px", borderRadius: "16px", flexShrink: 0, background: "var(--bg-card)", border: "1.5px solid var(--border-card)", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", transition: "background 0.35s" }}>
                  {club?.logo
                    ? <img src={club.logo} alt={club.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    : <span className="od-display" style={{ fontSize: "24px", fontWeight: 800, color: "var(--accent)" }}>{(club?.name || "?").charAt(0)}</span>
                  }
                </div>
                <div>
                  <span className="od-sans" style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--accent)", background: "var(--accent-soft)", border: "1px solid var(--border-subtle)", borderRadius: "6px", padding: "4px 10px", display: "inline-block", marginBottom: "10px" }}>
                    Owner Dashboard
                  </span>
                  <h1 className="od-display" style={{ fontSize: "clamp(1.8rem,4vw,2.8rem)", fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.04em", lineHeight: 1.1, margin: 0 }}>
                    {club?.name}
                  </h1>
                  <p className="od-sans" style={{ fontSize: "13.5px", color: "var(--text-muted)", marginTop: "6px" }}>
                    {club?.category}{club?.district ? ` · ${club.district}` : ""}
                    {club?.pricing_type === "free" ? " · Free club" : " · Paid club"}
                  </p>
                </div>
              </div>
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                <button
                  onClick={() => { setShowAddMember(true); setAddMemberMsg(""); }}
                  className="od-sans"
                  style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "10px 20px", borderRadius: "10px", cursor: "pointer", background: "var(--accent)", color: "var(--text-on-accent)", border: "none", fontSize: "13px", fontWeight: 600, transition: "all 0.2s" }}>
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>
                  Add Member
                </button>
                <button
                  onClick={() => router.push(`/club-edit?id=${clubId}`)}
                  className="od-sans"
                  style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "10px 20px", borderRadius: "10px", cursor: "pointer", background: "var(--bg-card)", border: "1px solid var(--border-subtle)", color: "var(--text-secondary)", fontSize: "13px", fontWeight: 600, transition: "all 0.2s", flexShrink: 0 }}
                  onMouseEnter={e => { e.currentTarget.style.background = "var(--accent-soft)"; e.currentTarget.style.color = "var(--accent)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "var(--bg-card)"; e.currentTarget.style.color = "var(--text-secondary)"; }}>
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                  Edit Club
                </button>
              </div>
            </div>
          </div>

          {/* Pending payment requests banner */}
          {pendingPayments.length > 0 && (
            <div className="od-fadein" style={{ marginBottom: "24px", padding: "16px 20px", borderRadius: "14px", background: "rgba(245,158,11,0.07)", border: "1.5px solid rgba(245,158,11,0.25)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", flexWrap: "wrap" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "rgba(245,158,11,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <svg width="16" height="16" fill="none" stroke="#b45309" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                </div>
                <div>
                  <p className="od-sans" style={{ fontSize: "14px", fontWeight: 700, color: "#92400e", margin: 0 }}>
                    {pendingPayments.length} pending payment{pendingPayments.length > 1 ? "s" : ""} awaiting your review
                  </p>
                  <p className="od-sans" style={{ fontSize: "12px", color: "#b45309", margin: "2px 0 0" }}>
                    Members claimed they've paid — confirm or reject below
                  </p>
                </div>
              </div>
              <button onClick={() => setActiveTab("payments")} className="od-sans"
                style={{ padding: "8px 18px", background: "#b45309", color: "#fff", border: "none", borderRadius: "8px", fontSize: "12px", fontWeight: 700, cursor: "pointer" }}>
                Review now →
              </button>
            </div>
          )}

          <div className="od-fadein" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: "14px", marginBottom: "36px" }}>
            <StatCard label="Total Members"    value={members.length}          sub={`${members.length === 1 ? "person" : "people"} joined`} />
            <StatCard label="Total Revenue"    value={formatMNT(totalRevenue)} sub={`${confirmedPayments.length} confirmed`} accent="#16a34a" />
            <StatCard label="Pending Payments" value={pendingPayments.length}  sub="awaiting approval" accent="#b45309" />
            <StatCard label="New This Month"   value={thisMonth.length}        sub="joined this month" />
          </div>
          <div className="od-fadein" style={{ position: "relative", marginBottom: "16px" }}>
            <svg style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} width="14" height="14" fill="none" stroke="var(--text-muted)" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input className="od-search" placeholder="Search by name or email…" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="od-fadein od-tabs-wrap" style={{ display: "flex", gap: "4px", background: "var(--bg-input)", border: "1px solid var(--border-subtle)", borderRadius: "12px", padding: "4px", marginBottom: "24px", overflowX: "auto" }}>
            <button className={`od-tab${activeTab === "members" ? " active" : ""}`} onClick={() => setActiveTab("members")}>
              Members
              <span style={{ background: "var(--bg-page)", border: "1px solid var(--border-subtle)", borderRadius: "20px", padding: "1px 8px", fontSize: "11px", color: "var(--text-muted)", fontWeight: 700 }}>{members.length}</span>
            </button>
            <button className={`od-tab${activeTab === "payments" ? " active" : ""}`} onClick={() => setActiveTab("payments")}>
              Payments
              {pendingPayments.length > 0 && (
                <span style={{ background: "rgba(245,158,11,0.15)", color: "#b45309", fontSize: "10px", fontWeight: 800, borderRadius: "20px", padding: "2px 7px", border: "1px solid rgba(245,158,11,0.25)" }}>{pendingPayments.length}</span>
              )}
            </button>
          </div>

          {activeTab === "members" && (
            <div className="od-fadein">
              {filteredMembers.length === 0 ? (
                <div className="od-empty">
                  <div style={{ width: 48, height: 48, borderRadius: 12, background: "var(--bg-card)", border: "1px solid var(--border-subtle)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
                    <svg width="20" height="20" fill="none" stroke="var(--text-muted)" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                  </div>
                  {search ? "No members match your search" : "No members yet — add one with the button above!"}
                </div>
              ) : filteredMembers.map((member, i) => (
                <div key={member.id} className="od-row" style={{ animationDelay: `${i * 0.04}s` }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "14px", flex: 1, minWidth: 0 }}>
                    <div className="od-avatar">
                      {member.photo ? <img src={member.photo} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : (member.name || "?").charAt(0).toUpperCase()}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <p className="od-sans" style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-primary)", margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{member.name || "Unknown"}</p>
                      <p className="od-sans" style={{ fontSize: "12px", color: "var(--text-muted)", margin: "2px 0 0" }}>{member.email || "—"}</p>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", flexShrink: 0, flexWrap: "wrap", justifyContent: "flex-end" }}>
                    {member.tier_name && <span className="od-badge od-badge-purple">{member.tier_name}</span>}
                    <span className="od-sans" style={{ fontSize: "12px", color: "var(--text-muted)" }}>Joined {formatDate(member.joined_at)}</span>
                    <span className={`od-badge ${member.payment_status === "confirmed" ? "od-badge-green" : member.payment_status === "pending" ? "od-badge-yellow" : "od-badge-purple"}`}>
                      {member.payment_status === "confirmed" ? "Paid ✓" : member.payment_status === "pending" ? "⏳ Pending" : "Free"}
                    </span>
                    <button onClick={() => removeMember(member.id)} className="od-sans"
                      style={{ background: "transparent", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "7px", padding: "5px 12px", cursor: "pointer", color: "#dc2626", fontSize: "12px", fontWeight: 600, transition: "all 0.2s" }}
                      onMouseEnter={e => e.currentTarget.style.background = "rgba(239,68,68,0.08)"}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "payments" && (
            <div className="od-fadein">
              {(club?.qpay_info || club?.dans_info) && (
                <div style={{ marginBottom: "20px", borderRadius: "14px", border: "1px solid var(--border-subtle)", overflow: "hidden" }}>
                  <div style={{ padding: "10px 16px", background: "var(--bg-input)", borderBottom: "1px solid var(--border-subtle)", display: "flex", alignItems: "center", gap: "8px" }}>
                    <svg width="13" height="13" fill="none" stroke="var(--text-muted)" strokeWidth="2" viewBox="0 0 24 24"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
                    <span className="od-sans" style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.1em", textTransform: "uppercase" }}>Таны төлбөрийн мэдээлэл</span>
                    <Link href={`/club-edit?id=${clubId}`} className="od-sans" style={{ marginLeft: "auto", fontSize: "11px", fontWeight: 600, color: "var(--accent)", textDecoration: "none" }}>Засах →</Link>
                  </div>
                  <div style={{ padding: "14px 16px", display: "flex", flexWrap: "wrap", gap: "12px" }}>
                    {club.qpay_info && (
                      <div style={{ flex: 1, minWidth: "200px", padding: "12px 14px", borderRadius: "10px", background: "rgba(0,102,204,0.06)", border: "1px solid rgba(0,102,204,0.15)" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                          <div style={{ width: "28px", height: "28px", borderRadius: "8px", background: "#0066cc", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            <span style={{ color: "#fff", fontSize: "11px", fontWeight: 800, fontFamily: "'DM Sans', sans-serif" }}>Q</span>
                          </div>
                          <span className="od-sans" style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-primary)" }}>QPay</span>
                        </div>
                        {club.qpay_info.startsWith("http") ? (
                          <img src={club.qpay_info} alt="QPay QR" style={{ width: "100%", maxWidth: "160px", display: "block", borderRadius: "8px" }} />
                        ) : (
                          <p className="od-sans" style={{ fontSize: "13px", color: "var(--text-secondary)", margin: 0, lineHeight: 1.6, whiteSpace: "pre-wrap", wordBreak: "break-all" }}>{club.qpay_info}</p>
                        )}
                      </div>
                    )}
                    {club.dans_info && (
                      <div style={{ flex: 1, minWidth: "200px", padding: "12px 14px", borderRadius: "10px", background: "rgba(232,66,10,0.05)", border: "1px solid rgba(232,66,10,0.15)" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                          <div style={{ width: "28px", height: "28px", borderRadius: "8px", background: "#e8420a", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            <span style={{ color: "#fff", fontSize: "9px", fontWeight: 800, fontFamily: "'DM Sans', sans-serif" }}>DANS</span>
                          </div>
                          <span className="od-sans" style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-primary)" }}>Данс / Bank Transfer</span>
                        </div>
                        <p className="od-sans" style={{ fontSize: "13px", color: "var(--text-secondary)", margin: 0, lineHeight: 1.8, whiteSpace: "pre-wrap" }}>{club.dans_info}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {filteredPayments.filter(p => p.status === "pending").length > 0 && (
                <>
                  <p className="od-sans" style={{ fontSize: "10px", fontWeight: 700, color: "#b45309", letterSpacing: "0.12em", textTransform: "uppercase", margin: "0 0 12px", display: "flex", alignItems: "center", gap: "8px" }}>
                    Awaiting Approval <span style={{ flex: 1, height: "1px", background: "rgba(245,158,11,0.2)" }} />
                  </p>
                  {filteredPayments.filter(p => p.status === "pending").map((pay, i) => (
                    <PaymentRow key={pay.id} pay={pay} i={i} formatDate={formatDate} formatMNT={formatMNT} onConfirm={confirmPayment} onReject={rejectPayment} />
                  ))}
                  <div style={{ height: "1px", background: "var(--border-subtle)", margin: "20px 0" }} />
                </>
              )}
              <p className="od-sans" style={{ fontSize: "10px", fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.12em", textTransform: "uppercase", margin: "0 0 12px", display: "flex", alignItems: "center", gap: "8px" }}>
                All Payments <span style={{ flex: 1, height: "1px", background: "var(--border-subtle)" }} />
              </p>
              {filteredPayments.length === 0 ? (
                <div className="od-empty">
                  <div style={{ width: 48, height: 48, borderRadius: 12, background: "var(--bg-card)", border: "1px solid var(--border-subtle)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
                    <svg width="20" height="20" fill="none" stroke="var(--text-muted)" strokeWidth="1.5" viewBox="0 0 24 24"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
                  </div>
                  {search ? "No payments match your search" : "No payments yet"}
                </div>
              ) : filteredPayments.map((pay, i) => (
                <PaymentRow key={pay.id} pay={pay} i={i} formatDate={formatDate} formatMNT={formatMNT} onConfirm={confirmPayment} onReject={rejectPayment} />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Add Member Modal */}
      {showAddMember && (
        <div className="od-modal-overlay" onClick={() => setShowAddMember(false)}>
          <div className="od-modal" onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <div>
                <h2 className="od-display" style={{ fontSize: "22px", fontWeight: 800, color: "var(--text-primary)", margin: 0 }}>Add Member</h2>
                <p className="od-sans" style={{ fontSize: "13px", color: "var(--text-muted)", margin: "4px 0 0" }}>Manually add a member who has paid</p>
              </div>
              <button onClick={() => setShowAddMember(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", fontSize: "20px", lineHeight: 1, padding: "4px" }}>✕</button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "20px" }}>
              <div>
                <label className="od-label">Member Email *</label>
                <input
                  className="od-input"
                  placeholder="user@email.com"
                  value={addEmail}
                  onChange={e => setAddEmail(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && addMember()}
                />
                <p className="od-sans" style={{ fontSize: "11px", color: "var(--text-muted)", margin: "6px 0 0" }}>The user must already have an account on Duguilan.com</p>
              </div>
              <div>
                <label className="od-label">Tier (optional)</label>
                <input
                  className="od-input"
                  placeholder="e.g. Beginners class, SAT…"
                  value={addTier}
                  onChange={e => setAddTier(e.target.value)}
                />
              </div>
            </div>
            <div style={{ padding: "12px 14px", borderRadius: "10px", background: "rgba(34,197,94,0.07)", border: "1px solid rgba(34,197,94,0.2)", marginBottom: "20px", display: "flex", gap: "8px" }}>
              <svg width="14" height="14" fill="none" stroke="#16a34a" strokeWidth="2" viewBox="0 0 24 24" style={{ flexShrink: 0, marginTop: 1 }}><polyline points="20 6 9 17 4 12"/></svg>
              <p className="od-sans" style={{ fontSize: "12px", color: "#16a34a", margin: 0, lineHeight: 1.5 }}>They will be added as a <strong>confirmed</strong> member immediately.</p>
            </div>
            {addMemberMsg && (
              <p className="od-sans" style={{ fontSize: "13px", fontWeight: 600, color: addMemberMsg.startsWith("✓") ? "#16a34a" : "#dc2626", marginBottom: "14px" }}>{addMemberMsg}</p>
            )}
            <button onClick={addMember} disabled={addingMember || !addEmail} className="od-btn-primary">
              {addingMember ? "Adding…" : "Add Member"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}