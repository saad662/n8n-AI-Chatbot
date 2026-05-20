import React, { useState, useEffect, useMemo } from "react";
import {
  Zap,
  Users,
  CalendarDays,
  AlertTriangle,
  CircleDollarSign,
  Search,
  Download,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  X,
  LayoutList,
  Calendar,
  CheckCircle2,
  Clock3,
  ShieldCheck,
} from "lucide-react";

// ─── SEED DATA ────────────────────────────────────────────────────────
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
  // Only seed if nothing exists at all — never overwrite real leads from ChatWidget
  const existing = localStorage.getItem("lutz_leads");
  if (!existing) {
    localStorage.setItem("lutz_leads", JSON.stringify(SEED_LEADS));
  }
}

// ─── HELPERS ──────────────────────────────────────────────────────────
function fmt(slot) {
  if (!slot) return "—";
  return new Date(slot).toLocaleString("en-DE", { weekday: "short", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}
function fmtTime(slot) {
  return new Date(slot).toLocaleTimeString("en-DE", { hour: "2-digit", minute: "2-digit" });
}
function getWeekDays(baseDate) {
  const start = new Date(baseDate);
  start.setDate(start.getDate() - start.getDay() + 1);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    return d;
  });
}
const HOURS = Array.from({ length: 10 }, (_, i) => i + 8);

const STATUS_CONFIG = {
  Booked:    { label: "Booked",    cls: "bg-blue-100 text-blue-700" },
  Completed: { label: "Completed", cls: "bg-green-100 text-green-700" },
  Pending:   { label: "Pending",   cls: "bg-amber-100 text-amber-700" },
};
const URGENCY_CONFIG = {
  urgent: { cls: "bg-red-100 text-red-600",        label: "🚨 Urgent" },
  normal: { cls: "bg-gray-100 text-gray-600",       label: "Normal" },
};
const SERVICE_COLOR = {
  "Socket installation": "#f59e0b",
  "Light installation":  "#3b82f6",
  "Wiring":              "#8b5cf6",
  "Inspection":          "#10b981",
  "Emergency repair":    "#ef4444",
};

// ─── MAIN COMPONENT ───────────────────────────────────────────────────
export default function AdminDashboard() {
  const [leads, setLeads]               = useState([]);
  const [activeTab, setActiveTab]       = useState("leads");
  const [search, setSearch]             = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterUrgency, setFilterUrgency] = useState("All");
  const [filterService, setFilterService] = useState("All");
  const [lightboxImg, setLightboxImg]   = useState(null);
  const [weekBase, setWeekBase]         = useState(new Date());

  const [calendarEvents, setCalendarEvents]   = useState([]);
  const [calendarLoading, setCalendarLoading] = useState(false);
  const [calendarError, setCalendarError]     = useState(null);

  useEffect(() => {
    initLeads();
    setLeads(JSON.parse(localStorage.getItem("lutz_leads") || "[]").reverse());
  }, []);

  useEffect(() => {
    if (activeTab !== "calendar") return;
    setCalendarLoading(true);
    setCalendarError(null);
    fetch("http://localhost:5000/api/calendar-events")
      .then(r => r.json())
      .then(data => { setCalendarEvents(data.events || []); setCalendarLoading(false); })
      .catch(() => { setCalendarError("Could not load Google Calendar events."); setCalendarLoading(false); });
  }, [activeTab]);

  const stats = useMemo(() => {
    const booked  = leads.filter(l => l.status === "Booked").length;
    const urgent  = leads.filter(l => l.urgency === "urgent").length;
    const revenue = leads.reduce((s, l) => s + Number(l.price || 0), 0);
    return [
      { label: "Total Leads",   value: leads.length,                 icon: <Users className="w-6 h-6 text-amber-400" /> },
      { label: "Booked",        value: booked,                       icon: <CalendarDays className="w-6 h-6 text-amber-400" /> },
      { label: "Urgent",        value: urgent,                       icon: <AlertTriangle className="w-6 h-6 text-amber-400" /> },
      { label: "Revenue Est.",  value: `€${revenue.toLocaleString()}`, icon: <CircleDollarSign className="w-6 h-6 text-amber-400" /> },
    ];
  }, [leads]);

  const filtered = useMemo(() => {
    return leads.filter(l => {
      const q = search.toLowerCase();
      const matchSearch  = !q || [l.customerName, l.email, l.service, l.phone].some(v => v?.toLowerCase().includes(q));
      const matchStatus  = filterStatus  === "All" || l.status  === filterStatus;
      const matchUrgency = filterUrgency === "All" || l.urgency === filterUrgency;
      const matchService = filterService === "All" || l.service === filterService;
      return matchSearch && matchStatus && matchUrgency && matchService;
    });
  }, [leads, search, filterStatus, filterUrgency, filterService]);

  const services = [...new Set(leads.map(l => l.service))];
  const weekDays = getWeekDays(weekBase);
  const activeFilters = [filterStatus !== "All" && filterStatus, filterUrgency !== "All" && filterUrgency, filterService !== "All" && filterService].filter(Boolean);

  function getSlotForCell(day, hour) {
    return calendarEvents.filter(e => {
      if (!e.start) return false;
      const d = new Date(e.start);
      return d.getDate() === day.getDate() && d.getMonth() === day.getMonth() && d.getFullYear() === day.getFullYear() && d.getHours() === hour;
    });
  }

  function parseEventMeta(event) {
    const desc = event.description || "";
    const get  = key => { const m = desc.match(new RegExp(key + ":\\s*(.+)")); return m ? m[1].trim() : null; };
    const customerName = event.title || "Appointment";
    const service = get("Service") || "Electrical Service";
    const urgency = (get("Urgency") || "normal").toLowerCase();
    const phone   = get("Phone") || "";
    // Match against local leads to pull real price & status
    const matched = leads.find(l =>
      l.customerName?.toLowerCase() === customerName.toLowerCase() ||
      (l.slot && event.start && new Date(l.slot).toISOString().slice(0,16) === new Date(event.start).toISOString().slice(0,16))
    );
    const price  = matched ? matched.price  : null;
    const status = matched ? matched.status : null;
    return { customerName, service, urgency, phone, price, status };
  }

  function updateStatus(id, newStatus) {
    const all     = JSON.parse(localStorage.getItem("lutz_leads") || "[]");
    const updated = all.map(l => l.id === id ? { ...l, status: newStatus } : l);
    localStorage.setItem("lutz_leads", JSON.stringify(updated));
    setLeads(updated.reverse());
  }

  function exportCSV() {
    const data = JSON.parse(localStorage.getItem("lutz_leads") || "[]");
    const csv  = ["Name,Phone,Email,Service,Price,Urgency,Slot,Status", ...data.map(l => `${l.customerName},${l.phone},${l.email},${l.service},${l.price},${l.urgency},${l.slot},${l.status}`)].join("\n");
    const a    = document.createElement("a");
    a.href     = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = "lutz_leads.csv";
    a.click();
  }

  function refreshCalendar() {
    setCalendarLoading(true);
    setCalendarError(null);
    fetch("http://localhost:5000/api/calendar-events")
      .then(r => r.json())
      .then(d => { setCalendarEvents(d.events || []); setCalendarLoading(false); })
      .catch(() => { setCalendarError("Could not load events."); setCalendarLoading(false); });
  }

  return (
    <div className="bg-slate-50 text-gray-900 font-sans min-h-screen overflow-x-hidden">

      {/* ── LIGHTBOX ── */}
      {lightboxImg && (
        <div
          onClick={() => setLightboxImg(null)}
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center cursor-zoom-out"
        >
          <img src={lightboxImg} alt="attachment" className="max-w-[90vw] max-h-[85vh] rounded-3xl shadow-2xl" />
          <button
            onClick={() => setLightboxImg(null)}
            className="absolute top-6 right-8 text-white/70 hover:text-white text-3xl bg-white/10 rounded-full w-10 h-10 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* ── NAVBAR ── */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-white/80 backdrop-blur-xl shadow-sm">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-400 flex items-center justify-center shadow-lg shadow-amber-400/20">
              <Zap className="w-6 h-6 text-slate-900" />
            </div>
            <div>
              <h1 className="font-black text-xl tracking-tight text-slate-900">ElektroFix</h1>
              <p className="text-sm text-gray-500">Admin Dashboard</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Live indicator */}
            <div className="hidden sm:flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse inline-block" />
              <span className="text-gray-600 font-medium">n8n running</span>
            </div>

            <button
              onClick={exportCSV}
              className="bg-amber-400 hover:bg-amber-300 text-slate-900 font-semibold px-5 py-2.5 rounded-xl transition-all duration-300 shadow-sm hover:shadow-lg hover:-translate-y-0.5 active:scale-95 flex items-center gap-2 text-sm"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
          </div>
        </div>
      </header>

      {/* ── HERO STRIP ── */}
      <section className="bg-slate-900 text-white py-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,_#fbbf24,_transparent_35%)]" />
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <p className="text-sm font-semibold uppercase tracking-wide text-amber-400 mb-2">Lutz Electrical</p>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
            Admin Dashboard
          </h2>
          <p className="text-gray-400 mt-3 text-lg">Live bookings · Customer leads · Calendar</p>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="bg-gradient-to-b from-white to-slate-50 border-b border-gray-100 py-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((s, i) => (
              <div
                key={i}
                className="group bg-white rounded-3xl p-6 border border-gray-200 hover:border-amber-200 hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
              >
                <div className="mb-4">{s.icon}</div>
                <div className="text-3xl font-black tracking-tight text-slate-900">{s.value}</div>
                <div className="text-sm text-gray-500 mt-1 font-medium">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MAIN CONTENT ── */}
      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-10">

        {/* ── TABS ── */}
        <div className="flex gap-2 mb-8">
          <button
            onClick={() => setActiveTab("leads")}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm transition-all duration-300 ${
              activeTab === "leads"
                ? "bg-amber-400 text-slate-900 shadow-md shadow-amber-400/20"
                : "bg-white border border-gray-200 text-gray-600 hover:border-amber-200 hover:text-slate-900"
            }`}
          >
            <LayoutList className="w-4 h-4" />
            Leads
          </button>
          <button
            onClick={() => setActiveTab("calendar")}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm transition-all duration-300 ${
              activeTab === "calendar"
                ? "bg-amber-400 text-slate-900 shadow-md shadow-amber-400/20"
                : "bg-white border border-gray-200 text-gray-600 hover:border-amber-200 hover:text-slate-900"
            }`}
          >
            <Calendar className="w-4 h-4" />
            Calendar
          </button>
        </div>

        {/* ══════════════════════════════════════════
            LEADS TAB
        ══════════════════════════════════════════ */}
        {activeTab === "leads" && (
          <div>
            {/* Section heading */}
            <div className="mb-6">
              <p className="text-sm font-semibold uppercase tracking-wide text-amber-500 mb-1">Customer Leads</p>
              <h3 className="text-2xl font-black tracking-tight text-slate-900">All Bookings</h3>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-3xl border border-gray-200 p-5 mb-6 flex flex-wrap gap-3 items-center">
              {/* Search */}
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search name, email, service…"
                  className="w-full bg-slate-50 border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-amber-300 focus:ring-2 focus:ring-amber-100 transition-all"
                />
              </div>

              {/* Status */}
              <select
                value={filterStatus}
                onChange={e => setFilterStatus(e.target.value)}
                className="bg-slate-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:border-amber-300 focus:ring-2 focus:ring-amber-100 transition-all cursor-pointer"
              >
                <option>All</option>
                <option>Booked</option>
                <option>Pending</option>
                <option>Completed</option>
              </select>

              {/* Urgency */}
              <select
                value={filterUrgency}
                onChange={e => setFilterUrgency(e.target.value)}
                className="bg-slate-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:border-amber-300 focus:ring-2 focus:ring-amber-100 transition-all cursor-pointer"
              >
                <option>All</option>
                <option value="normal">Normal</option>
                <option value="urgent">Urgent</option>
              </select>

              {/* Service */}
              <select
                value={filterService}
                onChange={e => setFilterService(e.target.value)}
                className="bg-slate-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:border-amber-300 focus:ring-2 focus:ring-amber-100 transition-all cursor-pointer"
              >
                <option>All</option>
                {services.map(s => <option key={s}>{s}</option>)}
              </select>

              {/* Active chips */}
              {activeFilters.length > 0 && (
                <div className="flex gap-2 items-center flex-wrap">
                  {activeFilters.map((f, i) => (
                    <span key={i} className="bg-amber-50 text-amber-600 text-xs font-bold px-3 py-1 rounded-full border border-amber-200">
                      {f}
                    </span>
                  ))}
                  <button
                    onClick={() => { setFilterStatus("All"); setFilterUrgency("All"); setFilterService("All"); }}
                    className="text-xs text-gray-400 hover:text-slate-900 underline transition-colors font-medium"
                  >
                    Clear all
                  </button>
                </div>
              )}

              <span className="ml-auto text-xs text-gray-400 font-medium whitespace-nowrap">
                {filtered.length} result{filtered.length !== 1 ? "s" : ""}
              </span>
            </div>

            {/* Table */}
            <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-gray-100">
                      {["Customer", "Contact", "Service", "Price", "Urgency", "Appointment", "Photo", "Status"].map(h => (
                        <th key={h} className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.length === 0 && (
                      <tr>
                        <td colSpan={8} className="py-20 text-center text-gray-400">
                          No leads match your filters.
                        </td>
                      </tr>
                    )}
                    {filtered.map((lead, i) => {
                      const sColor = SERVICE_COLOR[lead.service] || "#888";
                      const st     = STATUS_CONFIG[lead.status] || { label: lead.status, cls: "bg-gray-100 text-gray-600" };
                      const urg    = URGENCY_CONFIG[lead.urgency] || URGENCY_CONFIG.normal;
                      return (
                        <tr
                          key={lead.id}
                          className="border-b border-gray-50 hover:bg-slate-50 transition-colors"
                        >
                          {/* Customer */}
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div
                                className="w-9 h-9 rounded-2xl flex items-center justify-center text-sm font-bold flex-shrink-0"
                                style={{ background: sColor + "18", color: sColor, border: `1.5px solid ${sColor}33` }}
                              >
                                {lead.customerName?.[0]?.toUpperCase()}
                              </div>
                              <div>
                                <div className="font-semibold text-slate-900">{lead.customerName}</div>
                                <div className="text-xs text-gray-400 mt-0.5">Qty: {lead.quantity}</div>
                              </div>
                            </div>
                          </td>

                          {/* Contact */}
                          <td className="px-6 py-4">
                            <div className="text-gray-700">{lead.phone}</div>
                            <div className="text-xs text-gray-400 mt-0.5">{lead.email}</div>
                          </td>

                          {/* Service */}
                          <td className="px-6 py-4">
                            <span
                              className="text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap"
                              style={{ background: sColor + "18", color: sColor }}
                            >
                              {lead.service}
                            </span>
                          </td>

                          {/* Price */}
                          <td className="px-6 py-4 font-bold text-slate-900">€{lead.price}</td>

                          {/* Urgency */}
                          <td className="px-6 py-4">
                            <span className={`text-xs font-bold px-3 py-1 rounded-full ${urg.cls}`}>
                              {urg.label}
                            </span>
                          </td>

                          {/* Slot */}
                          <td className="px-6 py-4 text-gray-600 whitespace-nowrap text-xs">{fmt(lead.slot)}</td>

                          {/* Photo */}
                          <td className="px-6 py-4">
                            {lead.photoUrl
                              ? (
                                <img
                                  src={lead.photoUrl}
                                  alt="attachment"
                                  onClick={() => setLightboxImg(lead.photoUrl)}
                                  className="w-11 h-11 object-cover rounded-xl cursor-zoom-in border-2 border-gray-200 hover:border-amber-300 hover:scale-110 transition-all duration-200"
                                />
                              )
                              : <span className="text-gray-300 text-xs">—</span>
                            }
                          </td>

                          {/* Status */}
                          <td className="px-6 py-4">
                            <select
                              value={lead.status}
                              onChange={e => updateStatus(lead.id, e.target.value)}
                              className={`text-xs font-bold px-3 py-1.5 rounded-full border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-200 transition-all ${st.cls}`}
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
          <div>
            {/* Section heading */}
            <div className="mb-6">
              <p className="text-sm font-semibold uppercase tracking-wide text-amber-500 mb-1">Weekly Overview</p>
              <h3 className="text-2xl font-black tracking-tight text-slate-900">Appointment Calendar</h3>
            </div>

            {/* Week nav bar */}
            <div className="bg-white rounded-3xl border border-gray-200 p-5 mb-6 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => { const d = new Date(weekBase); d.setDate(d.getDate() - 7); setWeekBase(d); }}
                  className="w-9 h-9 flex items-center justify-center bg-slate-50 border border-gray-200 rounded-xl hover:border-amber-300 hover:bg-amber-50 transition-all"
                >
                  <ChevronLeft className="w-4 h-4 text-gray-600" />
                </button>
                <button
                  onClick={() => setWeekBase(new Date())}
                  className="bg-amber-400 hover:bg-amber-300 text-slate-900 font-semibold px-4 py-2 rounded-xl text-sm transition-all duration-300 active:scale-95"
                >
                  Today
                </button>
                <button
                  onClick={() => { const d = new Date(weekBase); d.setDate(d.getDate() + 7); setWeekBase(d); }}
                  className="w-9 h-9 flex items-center justify-center bg-slate-50 border border-gray-200 rounded-xl hover:border-amber-300 hover:bg-amber-50 transition-all"
                >
                  <ChevronRight className="w-4 h-4 text-gray-600" />
                </button>
                <button
                  onClick={refreshCalendar}
                  className="w-9 h-9 flex items-center justify-center bg-slate-50 border border-gray-200 rounded-xl hover:border-amber-300 hover:bg-amber-50 transition-all"
                  title="Refresh"
                >
                  <RefreshCw className="w-4 h-4 text-gray-500" />
                </button>
              </div>

              <span className="font-black text-xl tracking-tight text-slate-900">
                {weekDays[0].toLocaleString("en-DE", { month: "long" })} {weekDays[0].getFullYear()}
              </span>

              {/* Legend */}
              <div className="flex gap-4 flex-wrap">
                {Object.entries(SERVICE_COLOR).map(([s, c]) => (
                  <div key={s} className="flex items-center gap-1.5 text-xs text-gray-500">
                    <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: c }} />
                    {s}
                  </div>
                ))}
              </div>
            </div>

            {/* States */}
            {calendarLoading && (
              <div className="flex items-center gap-3 text-gray-500 text-sm mb-4 bg-white rounded-2xl border border-gray-200 px-5 py-4">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse inline-block" />
                Fetching Google Calendar events…
              </div>
            )}
            {calendarError && !calendarLoading && (
              <div className="text-red-600 text-sm mb-4 bg-red-50 rounded-2xl border border-red-200 px-5 py-4">
                ⚠️ {calendarError} — Make sure your backend is running and the n8n workflow is active.
              </div>
            )}
            {!calendarLoading && !calendarError && calendarEvents.length === 0 && (
              <div className="text-gray-400 text-sm mb-4 bg-white rounded-2xl border border-gray-200 px-5 py-4">
                No events found in Google Calendar for this period.
              </div>
            )}

            {/* Calendar grid */}
            <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden">
              {/* Day headers */}
              <div className="grid border-b border-gray-100 bg-slate-50" style={{ gridTemplateColumns: "64px repeat(7, 1fr)" }}>
                <div className="p-3" />
                {weekDays.map((day, i) => {
                  const isToday = day.toDateString() === new Date().toDateString();
                  return (
                    <div key={i} className={`p-3 text-center border-l border-gray-100 ${isToday ? "bg-amber-50" : ""}`}>
                      <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                        {day.toLocaleString("en-DE", { weekday: "short" })}
                      </div>
                      <div className={`text-xl font-black leading-none ${isToday ? "text-amber-500" : "text-slate-900"}`}>
                        {day.getDate()}
                      </div>
                      {isToday && (
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mx-auto mt-1.5" />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Hour rows */}
              <div className="overflow-y-auto" style={{ maxHeight: "60vh" }}>
                {HOURS.map((hour, hi) => (
                  <div
                    key={hour}
                    className="grid border-b border-gray-100 min-h-[72px]"
                    style={{ gridTemplateColumns: "64px repeat(7, 1fr)", background: hi % 2 === 0 ? "#ffffff" : "#f9fafb" }}
                  >
                    {/* Time label */}
                    <div className="px-3 pt-3 text-xs font-bold text-gray-300 text-right leading-none border-r border-gray-100 select-none">
                      {String(hour).padStart(2, "0")}:00
                    </div>

                    {weekDays.map((day, di) => {
                      const slotEvents = getSlotForCell(day, hour);
                      const isToday = day.toDateString() === new Date().toDateString();
                      return (
                        <div
                          key={di}
                          className={`border-l border-gray-100 p-1.5 min-h-[72px] ${isToday ? "bg-amber-50/40" : ""}`}
                        >
                          {slotEvents.map((e, ei) => {
                            const meta = parseEventMeta(e);
                            const c = SERVICE_COLOR[meta.service] || "#6366f1";
                            const stConfig = meta.status ? STATUS_CONFIG[meta.status] : null;
                            return (
                              <div
                                key={ei}
                                title={`${meta.customerName} · ${meta.service}${meta.price ? ` · €${meta.price}` : ""}`}
                                className="rounded-xl mb-1 overflow-hidden shadow-sm"
                                style={{ border: `1.5px solid ${c}40` }}
                              >
                                {/* Colored header band */}
                                <div
                                  className="px-2 py-1 flex items-center justify-between gap-1"
                                  style={{ background: c }}
                                >
                                  <span className="text-[10px] font-bold text-white/90 leading-none">
                                    {fmtTime(e.start)}
                                  </span>
                                  {meta.urgency === "urgent" && (
                                    <span className="text-[9px] font-black text-white bg-red-600 rounded px-1">URGENT</span>
                                  )}
                                </div>
                                {/* Body */}
                                <div className="px-2 py-1.5" style={{ background: c + "12" }}>
                                  <div className="text-[11px] font-bold text-slate-800 truncate leading-tight">
                                    {meta.customerName}
                                  </div>
                                  <div className="text-[10px] text-gray-500 truncate leading-tight mt-0.5">
                                    {meta.service}
                                  </div>
                                  <div className="flex items-center justify-between mt-1 gap-1">
                                    {meta.price != null
                                      ? <span className="text-[10px] font-bold" style={{ color: c }}>€{meta.price}</span>
                                      : <span />
                                    }
                                    {stConfig && (
                                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${stConfig.cls}`}>
                                        {stConfig.label}
                                      </span>
                                    )}
                                  </div>
                                </div>
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
      </main>

      {/* ── FOOTER ── */}
      <footer className="bg-slate-950 text-gray-400 border-t border-white/5 mt-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-400 flex items-center justify-center">
              <Zap className="w-4 h-4 text-slate-900" />
            </div>
            <span className="text-white font-black">ElektroFix</span>
            <span className="text-gray-600">Admin Panel</span>
          </div>
          <div className="flex items-center gap-6 text-gray-500">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>Internal Use Only</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-2">
              <Clock3 className="w-4 h-4 text-amber-400" />
              <span>Frankfurt, Germany</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
