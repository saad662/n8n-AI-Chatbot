import React, { useState, useEffect, useMemo } from "react";

// ─── SEED DATA (only written once if localStorage is empty) ──────────
const SEED_LEADS = [
  { id: "1", customerName: "Marco Bauer", phone: "+49 170 1234567", email: "marco.bauer@email.de", service: "Wiring", quantity: 10, urgency: "normal", price: 320, slot: "2025-05-19T09:00:00", status: "Booked", photoUrl: null, createdAt: "2025-05-18T08:00:00" },
  { id: "2", customerName: "Julia Hoffmann", phone: "+49 160 9876543", email: "julia.h@web.de", service: "Inspection", quantity: 1, urgency: "urgent", price: 40, slot: "2025-05-19T11:00:00", status: "Completed", photoUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400", createdAt: "2025-05-18T09:30:00" },
  { id: "3", customerName: "Saad Amin", phone: "+49 151 5551234", email: "saadamin630362@gmail.com", service: "Socket installation", quantity: 5, urgency: "normal", price: 150, slot: "2025-05-20T10:00:00", status: "Booked", photoUrl: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400", createdAt: "2025-05-18T11:00:00" },
  { id: "4", customerName: "Lisa Müller", phone: "+49 176 3334455", email: "lisa.m@gmail.com", service: "Light installation", quantity: 3, urgency: "normal", price: 90, slot: "2025-05-20T14:00:00", status: "Pending", photoUrl: null, createdAt: "2025-05-18T13:00:00" },
  { id: "5", customerName: "Thomas Klein", phone: "+49 178 6667788", email: "thomas.k@outlook.de", service: "Emergency repair", quantity: 1, urgency: "urgent", price: 180, slot: "2025-05-21T08:00:00", status: "Booked", photoUrl: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400", createdAt: "2025-05-19T07:00:00" },
  { id: "6", customerName: "Anna Schmidt", phone: "+49 152 9998877", email: "anna.s@email.de", service: "Wiring", quantity: 20, urgency: "normal", price: 600, slot: "2025-05-22T09:00:00", status: "Pending", photoUrl: null, createdAt: "2025-05-19T10:00:00" },
  { id: "7", customerName: "Felix Wagner", phone: "+49 173 1112223", email: "felix.w@web.de", service: "Inspection", quantity: 1, urgency: "normal", price: 40, slot: "2025-05-22T13:00:00", status: "Completed", photoUrl: null, createdAt: "2025-05-19T12:00:00" },
];

function initLeads() {
  const existing = localStorage.getItem("lutz_leads");
  if (!existing || JSON.parse(existing).length === 0) {
    localStorage.setItem("lutz_leads", JSON.stringify(SEED_LEADS));
  }
}

// ─── HELPERS ─────────────────────────────────────────────────────────
function fmt(slot) {
  if (!slot) return "—";
  return new Date(slot).toLocaleString("en-DE", { weekday: "short", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}
function fmtDay(date) {
  return new Date(date).toLocaleDateString("en-DE", { weekday: "short", month: "short", day: "numeric" });
}
function fmtTime(slot) {
  return new Date(slot).toLocaleTimeString("en-DE", { hour: "2-digit", minute: "2-digit" });
}
function getWeekDays(baseDate) {
  const start = new Date(baseDate);
  start.setDate(start.getDate() - start.getDay() + 1); // Monday
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    return d;
  });
}
const HOURS = Array.from({ length: 10 }, (_, i) => i + 8); // 8–17

const STATUS_STYLE = {
  Booked: { bg: "#dbeafe", color: "#1d4ed8" },
  Completed: { bg: "#dcfce7", color: "#15803d" },
  Pending: { bg: "#fef9c3", color: "#a16207" },
};
const URGENCY_STYLE = {
  urgent: { bg: "#fee2e2", color: "#dc2626" },
  normal: { bg: "#f3f4f6", color: "#374151" },
};
const SERVICE_COLOR = {
  "Socket installation": "#f59e0b",
  "Light installation": "#3b82f6",
  "Wiring": "#8b5cf6",
  "Inspection": "#10b981",
  "Emergency repair": "#ef4444",
};

// ─── MAIN COMPONENT ───────────────────────────────────────────────────
export default function AdminDashboard() {
  const [leads, setLeads] = useState([]);
  const [activeTab, setActiveTab] = useState("leads"); // leads | calendar
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterUrgency, setFilterUrgency] = useState("All");
  const [filterService, setFilterService] = useState("All");
  const [lightboxImg, setLightboxImg] = useState(null);
  const [weekBase, setWeekBase] = useState(new Date());

  // ── Real Google Calendar events ──
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [calendarLoading, setCalendarLoading] = useState(false);
  const [calendarError, setCalendarError] = useState(null);

  useEffect(() => {
    initLeads();
    setLeads(JSON.parse(localStorage.getItem("lutz_leads") || "[]").reverse());
  }, []);

  // Fetch Google Calendar events whenever calendar tab is opened
  useEffect(() => {
    if (activeTab !== "calendar") return;
    setCalendarLoading(true);
    setCalendarError(null);
    fetch("http://localhost:5000/api/calendar-events")
      .then((r) => r.json())
      .then((data) => {
        setCalendarEvents(data.events || []);
        setCalendarLoading(false);
      })
      .catch(() => {
        setCalendarError("Could not load Google Calendar events.");
        setCalendarLoading(false);
      });
  }, [activeTab]);

  // ── Derived stats ──
  const stats = useMemo(() => {
    const all = leads;
    const booked = all.filter(l => l.status === "Booked").length;
    const urgent = all.filter(l => l.urgency === "urgent").length;
    const revenue = all.reduce((s, l) => s + Number(l.price || 0), 0);
    return [
      { label: "Total Leads", value: all.length, icon: "👥", accent: "#f59e0b" },
      { label: "Booked", value: booked, icon: "📅", accent: "#3b82f6" },
      { label: "Urgent", value: urgent, icon: "🚨", accent: "#ef4444" },
      { label: "Revenue Est.", value: `€${revenue.toLocaleString()}`, icon: "💶", accent: "#10b981" },
    ];
  }, [leads]);

  // ── Filtered leads ──
  const filtered = useMemo(() => {
    return leads.filter(l => {
      const q = search.toLowerCase();
      const matchSearch = !q || [l.customerName, l.email, l.service, l.phone].some(v => v?.toLowerCase().includes(q));
      const matchStatus = filterStatus === "All" || l.status === filterStatus;
      const matchUrgency = filterUrgency === "All" || l.urgency === filterUrgency;
      const matchService = filterService === "All" || l.service === filterService;
      return matchSearch && matchStatus && matchUrgency && matchService;
    });
  }, [leads, search, filterStatus, filterUrgency, filterService]);

  const services = [...new Set(leads.map(l => l.service))];

  // ── Calendar data (real Google Calendar events) ──
  const weekDays = getWeekDays(weekBase);

  function getSlotForCell(day, hour) {
    return calendarEvents.filter(e => {
      if (!e.start) return false;
      const d = new Date(e.start);
      return (
        d.getDate() === day.getDate() &&
        d.getMonth() === day.getMonth() &&
        d.getFullYear() === day.getFullYear() &&
        d.getHours() === hour
      );
    });
  }

  // Parse service/urgency/name from n8n event description
  // n8n writes description as: "Service: X\nUrgency: Y\nPhone: ..."
  function parseEventMeta(event) {
    const desc = event.description || "";
    const get = (key) => {
      const match = desc.match(new RegExp(key + ":\\s*(.+)"));
      return match ? match[1].trim() : null;
    };
    const service = get("Service") || "Electrical Service";
    const urgency = (get("Urgency") || "normal").toLowerCase();
    const phone = get("Phone") || "";
    const customerName = event.title || "Appointment";
    return { customerName, service, urgency, phone };
  }

  // ── Status update ──
  function updateStatus(id, newStatus) {
    const all = JSON.parse(localStorage.getItem("lutz_leads") || "[]");
    const updated = all.map(l => l.id === id ? { ...l, status: newStatus } : l);
    localStorage.setItem("lutz_leads", JSON.stringify(updated));
    setLeads(updated.reverse());
  }

  const activeFilters = [filterStatus !== "All" && filterStatus, filterUrgency !== "All" && filterUrgency, filterService !== "All" && filterService].filter(Boolean);

  return (
    <div style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif", background: "#0f0f11", minHeight: "100vh", color: "#e8e8e8" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Syne:wght@700;800&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: #1a1a1f; }
        ::-webkit-scrollbar-thumb { background: #333; border-radius: 3px; }
        input, select { font-family: inherit; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
        @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:.5; } }
        .lead-row:hover { background: #1c1c22 !important; }
        .stat-card:hover { transform: translateY(-2px); }
        .stat-card { transition: transform 0.2s ease; }
        .tab-btn { transition: all 0.2s ease; }
        .filter-chip:hover { opacity: 0.8; }
        .status-select { background: transparent; border: none; font-size: 12px; font-weight: 600; cursor: pointer; outline: none; padding: 2px 4px; }
      `}</style>

      {/* ── LIGHTBOX ── */}
      {lightboxImg && (
        <div onClick={() => setLightboxImg(null)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.92)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", cursor: "zoom-out" }}>
          <img src={lightboxImg} alt="attachment" style={{ maxWidth: "90vw", maxHeight: "85vh", borderRadius: 16, boxShadow: "0 0 80px rgba(0,0,0,0.8)" }} />
          <button onClick={() => setLightboxImg(null)} style={{ position: "absolute", top: 24, right: 28, background: "none", border: "none", color: "#fff", fontSize: 28, cursor: "pointer", opacity: 0.7 }}>✕</button>
        </div>
      )}

      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "32px 24px" }}>

        {/* ── HEADER ── */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 40, animation: "fadeUp 0.4s ease" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <span style={{ fontSize: 22 }}>⚡</span>
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", color: "#f59e0b", textTransform: "uppercase" }}>Lutz Electrical</span>
            </div>
            <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 38, fontWeight: 800, color: "#fff", margin: 0, lineHeight: 1.1 }}>Admin Dashboard</h1>
            <p style={{ color: "#555", marginTop: 8, fontSize: 14 }}>Live bookings · Customer leads · Calendar</p>
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, background: "#1a1a1f", border: "1px solid #2a2a30", borderRadius: 12, padding: "8px 14px", fontSize: 13 }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#22c55e", display: "inline-block", animation: "pulse 2s infinite" }}></span>
              <span style={{ color: "#aaa" }}>n8n running</span>
            </div>
            <button
              onClick={() => {
                const data = JSON.parse(localStorage.getItem("lutz_leads") || "[]");
                const csv = ["Name,Phone,Email,Service,Price,Urgency,Slot,Status",
                  ...data.map(l => `${l.customerName},${l.phone},${l.email},${l.service},${l.price},${l.urgency},${l.slot},${l.status}`)
                ].join("\n");
                const blob = new Blob([csv], { type: "text/csv" });
                const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "lutz_leads.csv"; a.click();
              }}
              style={{ background: "#f59e0b", color: "#000", border: "none", borderRadius: 12, padding: "10px 20px", fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}
            >
              ↓ Export CSV
            </button>
          </div>
        </div>

        {/* ── STATS ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 32, animation: "fadeUp 0.4s ease 0.05s both" }}>
          {stats.map((s, i) => (
            <div key={i} className="stat-card" style={{ background: "#141417", border: "1px solid #222", borderRadius: 20, padding: "24px 28px", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: -20, right: -20, width: 80, height: 80, borderRadius: "50%", background: s.accent, opacity: 0.07 }} />
              <div style={{ fontSize: 26, marginBottom: 12 }}>{s.icon}</div>
              <div style={{ fontSize: 34, fontWeight: 800, fontFamily: "'Syne', sans-serif", color: "#fff", lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: 12, color: "#666", marginTop: 6, fontWeight: 500 }}>{s.label}</div>
              <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 3, background: s.accent, opacity: 0.5, borderRadius: "0 0 20px 20px" }} />
            </div>
          ))}
        </div>

        {/* ── TABS ── */}
        <div style={{ display: "flex", gap: 4, background: "#141417", border: "1px solid #222", borderRadius: 14, padding: 4, marginBottom: 24, width: "fit-content", animation: "fadeUp 0.4s ease 0.1s both" }}>
          {["leads", "calendar"].map(tab => (
            <button key={tab} className="tab-btn" onClick={() => setActiveTab(tab)} style={{ padding: "9px 24px", borderRadius: 10, border: "none", cursor: "pointer", fontFamily: "inherit", fontWeight: 600, fontSize: 13, background: activeTab === tab ? "#f59e0b" : "transparent", color: activeTab === tab ? "#000" : "#666" }}>
              {tab === "leads" ? "📋 Leads" : "📆 Calendar"}
            </button>
          ))}
        </div>

        {/* ══════════════════════════════════════════
            LEADS TAB
        ══════════════════════════════════════════ */}
        {activeTab === "leads" && (
          <div style={{ animation: "fadeUp 0.3s ease" }}>
            {/* Filters bar */}
            <div style={{ background: "#141417", border: "1px solid #222", borderRadius: 20, padding: "16px 20px", marginBottom: 16, display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center" }}>
              {/* Search */}
              <div style={{ position: "relative", flex: "1 1 220px" }}>
                <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#555", fontSize: 14 }}>🔍</span>
                <input
                  value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="Search name, email, service…"
                  style={{ width: "100%", background: "#0f0f11", border: "1px solid #2a2a30", borderRadius: 10, padding: "9px 12px 9px 34px", color: "#e8e8e8", fontSize: 13, outline: "none" }}
                />
              </div>

              {/* Status */}
              <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
                style={{ background: "#0f0f11", border: "1px solid #2a2a30", borderRadius: 10, padding: "9px 12px", color: "#e8e8e8", fontSize: 13, outline: "none", fontFamily: "inherit" }}>
                <option>All</option>
                <option>Booked</option>
                <option>Pending</option>
                <option>Completed</option>
              </select>

              {/* Urgency */}
              <select value={filterUrgency} onChange={e => setFilterUrgency(e.target.value)}
                style={{ background: "#0f0f11", border: "1px solid #2a2a30", borderRadius: 10, padding: "9px 12px", color: "#e8e8e8", fontSize: 13, outline: "none", fontFamily: "inherit" }}>
                <option>All</option>
                <option value="normal">Normal</option>
                <option value="urgent">Urgent</option>
              </select>

              {/* Service */}
              <select value={filterService} onChange={e => setFilterService(e.target.value)}
                style={{ background: "#0f0f11", border: "1px solid #2a2a30", borderRadius: 10, padding: "9px 12px", color: "#e8e8e8", fontSize: 13, outline: "none", fontFamily: "inherit" }}>
                <option>All</option>
                {services.map(s => <option key={s}>{s}</option>)}
              </select>

              {/* Active filter chips + clear */}
              {activeFilters.length > 0 && (
                <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                  {activeFilters.map((f, i) => (
                    <span key={i} style={{ background: "#f59e0b22", color: "#f59e0b", fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 20, border: "1px solid #f59e0b44" }}>{f}</span>
                  ))}
                  <button onClick={() => { setFilterStatus("All"); setFilterUrgency("All"); setFilterService("All"); }}
                    style={{ background: "none", border: "none", color: "#666", fontSize: 12, cursor: "pointer", textDecoration: "underline", fontFamily: "inherit" }}>
                    Clear all
                  </button>
                </div>
              )}

              <span style={{ marginLeft: "auto", fontSize: 12, color: "#555", whiteSpace: "nowrap" }}>{filtered.length} result{filtered.length !== 1 ? "s" : ""}</span>
            </div>

            {/* Table */}
            <div style={{ background: "#141417", border: "1px solid #222", borderRadius: 20, overflow: "hidden" }}>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid #222" }}>
                      {["Customer", "Contact", "Service", "Price", "Urgency", "Appointment", "Photo", "Status"].map(h => (
                        <th key={h} style={{ padding: "14px 20px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "#555", letterSpacing: "0.08em", textTransform: "uppercase", whiteSpace: "nowrap" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.length === 0 && (
                      <tr><td colSpan={8} style={{ padding: 60, textAlign: "center", color: "#444" }}>No leads match your filters.</td></tr>
                    )}
                    {filtered.map((lead, i) => {
                      const sColor = SERVICE_COLOR[lead.service] || "#888";
                      const st = STATUS_STYLE[lead.status] || { bg: "#222", color: "#888" };
                      const urg = URGENCY_STYLE[lead.urgency] || URGENCY_STYLE.normal;
                      return (
                        <tr key={lead.id} className="lead-row" style={{ borderBottom: "1px solid #1a1a1f", transition: "background 0.15s", animationDelay: `${i * 0.03}s` }}>
                          {/* Customer */}
                          <td style={{ padding: "16px 20px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                              <div style={{ width: 34, height: 34, borderRadius: "50%", background: sColor + "22", border: `2px solid ${sColor}55`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: sColor, flexShrink: 0 }}>
                                {lead.customerName?.[0]?.toUpperCase()}
                              </div>
                              <div>
                                <div style={{ fontWeight: 600, color: "#e8e8e8" }}>{lead.customerName}</div>
                                <div style={{ fontSize: 11, color: "#555", marginTop: 2 }}>Qty: {lead.quantity}</div>
                              </div>
                            </div>
                          </td>
                          {/* Contact */}
                          <td style={{ padding: "16px 20px" }}>
                            <div style={{ color: "#aaa" }}>{lead.phone}</div>
                            <div style={{ fontSize: 11, color: "#555", marginTop: 2 }}>{lead.email}</div>
                          </td>
                          {/* Service */}
                          <td style={{ padding: "16px 20px" }}>
                            <span style={{ background: sColor + "18", color: sColor, fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 20, whiteSpace: "nowrap" }}>{lead.service}</span>
                          </td>
                          {/* Price */}
                          <td style={{ padding: "16px 20px", fontWeight: 700, color: "#e8e8e8" }}>€{lead.price}</td>
                          {/* Urgency */}
                          <td style={{ padding: "16px 20px" }}>
                            <span style={{ background: urg.bg, color: urg.color, fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 20 }}>
                              {lead.urgency === "urgent" ? "🚨 Urgent" : "Normal"}
                            </span>
                          </td>
                          {/* Slot */}
                          <td style={{ padding: "16px 20px", color: "#aaa", whiteSpace: "nowrap", fontSize: 12 }}>{fmt(lead.slot)}</td>
                          {/* Photo */}
                          <td style={{ padding: "16px 20px" }}>
                            {lead.photoUrl
                              ? <img src={lead.photoUrl} alt="attachment" onClick={() => setLightboxImg(lead.photoUrl)} style={{ width: 44, height: 44, objectFit: "cover", borderRadius: 10, cursor: "zoom-in", border: "2px solid #2a2a30", transition: "transform 0.15s" }} onMouseOver={e => e.target.style.transform = "scale(1.1)"} onMouseOut={e => e.target.style.transform = "scale(1)"} />
                              : <span style={{ color: "#333", fontSize: 11 }}>—</span>
                            }
                          </td>
                          {/* Status (editable) */}
                          <td style={{ padding: "16px 20px" }}>
                            <select
                              className="status-select"
                              value={lead.status}
                              onChange={e => updateStatus(lead.id, e.target.value)}
                              style={{ background: st.bg, color: st.color, borderRadius: 20, padding: "5px 10px", fontWeight: 700, fontSize: 11, border: "none", cursor: "pointer", fontFamily: "inherit", outline: "none" }}
                            >
                              <option value="Pending">Pending</option>
                              <option value="Booked">Booked</option>
                              <option value="Completed">Completed</option>
                            </select>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════
            CALENDAR TAB
        ══════════════════════════════════════════ */}
        {activeTab === "calendar" && (
          <div style={{ animation: "fadeUp 0.3s ease" }}>
            {/* Week nav */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, flexWrap: "wrap", gap: 12 }}>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <button onClick={() => { const d = new Date(weekBase); d.setDate(d.getDate() - 7); setWeekBase(d); }}
                  style={{ background: "#141417", border: "1px solid #222", borderRadius: 10, padding: "8px 16px", color: "#aaa", cursor: "pointer", fontFamily: "inherit", fontSize: 13 }}>← Prev</button>
                <button onClick={() => setWeekBase(new Date())}
                  style={{ background: "#f59e0b", border: "none", borderRadius: 10, padding: "8px 16px", color: "#000", cursor: "pointer", fontFamily: "inherit", fontWeight: 700, fontSize: 13 }}>Today</button>
                <button onClick={() => { const d = new Date(weekBase); d.setDate(d.getDate() + 7); setWeekBase(d); }}
                  style={{ background: "#141417", border: "1px solid #222", borderRadius: 10, padding: "8px 16px", color: "#aaa", cursor: "pointer", fontFamily: "inherit", fontSize: 13 }}>Next →</button>
                <button onClick={() => {
                  setCalendarLoading(true); setCalendarError(null);
                  fetch("http://localhost:5000/api/calendar-events").then(r => r.json()).then(d => { setCalendarEvents(d.events || []); setCalendarLoading(false); }).catch(() => { setCalendarError("Could not load events."); setCalendarLoading(false); });
                }} style={{ background: "#1a1a1f", border: "1px solid #2a2a30", borderRadius: 10, padding: "8px 14px", color: "#888", cursor: "pointer", fontFamily: "inherit", fontSize: 12 }}>↻ Refresh</button>
              </div>
              <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 18, color: "#e8e8e8" }}>
                {weekDays[0].toLocaleString("en-DE", { month: "long" })} {weekDays[0].getFullYear()}
              </span>
              {/* Service legend */}
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {Object.entries(SERVICE_COLOR).map(([s, c]) => (
                  <div key={s} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11 }}>
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: c, display: "inline-block" }} />
                    <span style={{ color: "#666" }}>{s}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Loading / Error states */}
            {calendarLoading && (
              <div style={{ display: "flex", alignItems: "center", gap: 10, color: "#555", fontSize: 13, marginBottom: 12, padding: "12px 20px", background: "#141417", borderRadius: 12, border: "1px solid #222" }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#f59e0b", display: "inline-block", animation: "pulse 1.2s infinite" }} />
                Fetching Google Calendar events…
              </div>
            )}
            {calendarError && !calendarLoading && (
              <div style={{ color: "#ef4444", fontSize: 13, marginBottom: 12, padding: "12px 20px", background: "#1a0a0a", borderRadius: 12, border: "1px solid #3a1a1a" }}>
                ⚠️ {calendarError} — Make sure your backend is running and the n8n workflow is active.
              </div>
            )}
            {!calendarLoading && !calendarError && calendarEvents.length === 0 && (
              <div style={{ color: "#555", fontSize: 13, marginBottom: 12, padding: "12px 20px", background: "#141417", borderRadius: 12, border: "1px solid #222" }}>
                No events found in Google Calendar for this period.
              </div>
            )}

            {/* Calendar grid */}
            <div style={{ background: "#141417", border: "1px solid #222", borderRadius: 20, overflow: "hidden" }}>
              {/* Day headers */}
              <div style={{ display: "grid", gridTemplateColumns: "56px repeat(7, 1fr)", borderBottom: "1px solid #222" }}>
                <div style={{ padding: "10px 8px" }} />
                {weekDays.map((day, i) => {
                  const today = new Date();
                  const isToday = day.toDateString() === today.toDateString();
                  return (
                    <div key={i} style={{ padding: "12px 8px", textAlign: "center", borderLeft: "1px solid #1a1a1f" }}>
                      <div style={{ fontSize: 10, color: "#555", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>{day.toLocaleString("en-DE", { weekday: "short" })}</div>
                      <div style={{ fontSize: 20, fontWeight: 800, fontFamily: "'Syne', sans-serif", marginTop: 2, color: isToday ? "#f59e0b" : "#e8e8e8", background: isToday ? "#f59e0b18" : "transparent", borderRadius: 8, padding: "2px 0" }}>{day.getDate()}</div>
                    </div>
                  );
                })}
              </div>

              {/* Hour rows */}
              <div style={{ overflowY: "auto", maxHeight: "56vh" }}>
                {HOURS.map(hour => (
                  <div key={hour} style={{ display: "grid", gridTemplateColumns: "56px repeat(7, 1fr)", borderBottom: "1px solid #1a1a1f", minHeight: 58 }}>
                    <div style={{ padding: "6px 8px 0", fontSize: 11, color: "#444", textAlign: "right", paddingRight: 12, fontWeight: 600 }}>{String(hour).padStart(2, "0")}:00</div>
                    {weekDays.map((day, di) => {
                      const slotEvents = getSlotForCell(day, hour);
                      return (
                        <div key={di} style={{ borderLeft: "1px solid #1a1a1f", padding: "4px 6px", minHeight: 58 }}>
                          {slotEvents.map((e, ei) => {
                            const meta = parseEventMeta(e);
                            const c = SERVICE_COLOR[meta.service] || "#6366f1";
                            return (
                              <div key={ei} title={`${meta.customerName} · ${meta.service}`} style={{ background: c + "22", border: `1px solid ${c}55`, borderLeft: `3px solid ${c}`, borderRadius: 6, padding: "4px 7px", marginBottom: 3, cursor: "default" }}>
                                <div style={{ fontSize: 10, fontWeight: 700, color: c, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{fmtTime(e.start)}</div>
                                <div style={{ fontSize: 11, color: "#ddd", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", fontWeight: 600 }}>{meta.customerName}</div>
                                <div style={{ fontSize: 10, color: "#666", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{meta.service}</div>
                                {meta.urgency === "urgent" && <div style={{ fontSize: 9, color: "#ef4444", fontWeight: 700 }}>🚨 URGENT</div>}
                              </div>
                            );
                          })}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
