import React, { useState, useEffect, useMemo, useRef } from "react";
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
  Clock3,
  ShieldCheck,
  Settings,
  Upload,
  Plus,
  Trash2,
  Save,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

// ─── SUPABASE CONFIG ──────────────────────────────────────────────────
const SUPABASE_URL = "https://cthzexnthkybvoebwyth.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN0aHpleG50aGt5YnZvZWJ3eXRoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkyODM2ODksImV4cCI6MjA5NDg1OTY4OX0.5Bvz4L2EuQOnDCJwT08zJ2lls4RQv0RsnOo99ct5yII";

// ── Fetch all leads from Supabase ─────────────────────────────────────
async function fetchLeadsFromSupabase() {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/leads?order=created_at.desc`,
    {
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
    },
  );
  if (!res.ok) throw new Error(`Failed to fetch leads (${res.status})`);
  const rows = await res.json();
  return rows.map((r) => ({
    id: String(r.id),
    customerName: r.customer_name,
    phone: r.phone,
    email: r.email,
    address: r.address,
    service: r.service,
    quantity: r.quantity,
    urgency: r.urgency,
    price: r.price,
    slot: r.slot,
    status: r.status,
    photoUrl: r.photo_url,
    createdAt: r.created_at,
  }));
}

// ── Update a lead's status in Supabase ───────────────────────────────
async function updateLeadStatusInSupabase(id, newStatus) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/leads?id=eq.${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      Prefer: "return=minimal",
    },
    body: JSON.stringify({ status: newStatus }),
  });
  if (!res.ok) throw new Error("Failed to update lead status");
}

// ── Services CRUD ─────────────────────────────────────────────────────
async function fetchServicesFromSupabase() {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/services?order=service.asc`, {
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    },
  });
  if (!res.ok) throw new Error(`Failed to fetch services (${res.status})`);
  return res.json();
}

async function upsertServiceToSupabase(service) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/services`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      Prefer: "resolution=merge-duplicates,return=representation",
    },
    body: JSON.stringify(service),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Failed to save service: ${err}`);
  }
  return res.json();
}

async function deleteServiceFromSupabase(id) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/services?id=eq.${id}`, {
    method: "DELETE",
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    },
  });
  if (!res.ok) throw new Error("Failed to delete service");
}

// ─── HELPERS ──────────────────────────────────────────────────────────
function fmt(slot) {
  if (!slot) return "—";
  return new Date(slot).toLocaleString("en-DE", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
function fmtTime(slot) {
  return new Date(slot).toLocaleTimeString("en-DE", {
    hour: "2-digit",
    minute: "2-digit",
  });
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
  Booked: { label: "Booked", cls: "bg-blue-100 text-blue-700" },
  Completed: { label: "Completed", cls: "bg-green-100 text-green-700" },
  Pending: { label: "Pending", cls: "bg-amber-100 text-amber-700" },
};
const URGENCY_CONFIG = {
  urgent: { cls: "bg-red-100 text-red-600", label: "🚨 Urgent" },
  normal: { cls: "bg-gray-100 text-gray-600", label: "Normal" },
};
const SERVICE_COLOR = {
  "Socket installation": "#f59e0b",
  "Light installation": "#3b82f6",
  Wiring: "#8b5cf6",
  Inspection: "#10b981",
  "Emergency repair": "#ef4444",
};

// ── Empty service row template ────────────────────────────────────────
const emptyService = () => ({
  id: null,
  service: "",
  base: 0,
  unit: "fixed",
  per: 0,
  urgency: 1.5,
});

// ── Parse CSV into service rows ───────────────────────────────────────
function parseServicesCSV(text) {
  const lines = text.trim().split("\n");
  const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());
  return lines.slice(1).map((line) => {
    const vals = line.split(",").map((v) => v.trim().replace(/^"|"$/g, ""));
    const row = {};
    headers.forEach((h, i) => (row[h] = vals[i] ?? ""));
    return {
      id: null,
      service: row.service || row.name || "",
      base: parseFloat(row.base) || 0,
      unit: row.unit || "fixed",
      per: parseFloat(row.per) || 0,
      urgency: parseFloat(row.urgency) || 1.5,
    };
  });
}

// ─── SERVICES TAB COMPONENT ───────────────────────────────────────────
function ServicesTab() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);
  const fileRef = useRef(null);

  function showToast(msg, type = "success") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }

  function loadServices() {
    setLoading(true);
    setError(null);
    fetchServicesFromSupabase()
      .then((rows) => {
        setServices(rows.length > 0 ? rows : [emptyService()]);
        setLoading(false);
      })
      .catch((err) => {
        // If table doesn't exist yet, start fresh
        setServices([emptyService()]);
        setError("Services table not found — add your first service below, then save.");
        setLoading(false);
      });
  }

  useEffect(() => {
    loadServices();
  }, []);

  function handleChange(idx, field, value) {
    setServices((prev) =>
      prev.map((s, i) => (i === idx ? { ...s, [field]: value } : s)),
    );
  }

  function addRow() {
    setServices((prev) => [...prev, emptyService()]);
  }

  async function deleteRow(idx) {
    const row = services[idx];
    if (row.id) {
      try {
        await deleteServiceFromSupabase(row.id);
        showToast("Service deleted");
      } catch (err) {
        showToast(err.message, "error");
        return;
      }
    }
    setServices((prev) => prev.filter((_, i) => i !== idx));
  }

  async function saveAll() {
    setSaving(true);
    try {
      const results = await Promise.all(
        services
          .filter((s) => s.service.trim())
          .map((s) =>
            upsertServiceToSupabase({
              ...(s.id ? { id: s.id } : {}),
              service: s.service,
              base: Number(s.base),
              unit: s.unit,
              per: Number(s.per),
              urgency: Number(s.urgency),
            }),
          ),
      );
      showToast(`✅ ${results.length} service(s) saved to Supabase`);
      loadServices();
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setSaving(false);
    }
  }

  function handleCSVUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const parsed = parseServicesCSV(ev.target.result);
        if (parsed.length === 0) {
          showToast("No rows found in CSV", "error");
          return;
        }
        setServices(parsed);
        showToast(`Loaded ${parsed.length} services from CSV — click Save to confirm`);
      } catch {
        showToast("Failed to parse CSV", "error");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  }

  function downloadTemplate() {
    const csv = "service,base,unit,per,urgency\nSocket installation,50,per_unit,30,1.5\nLight installation,40,per_unit,25,1.5\nWiring,80,per_unit,10,1.8\nInspection,100,fixed,0,1.5\nEmergency repair,150,fixed,0,2.0";
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = "services_template.csv";
    a.click();
  }

  return (
    <div>
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl text-sm font-semibold transition-all ${
            toast.type === "error"
              ? "bg-red-50 text-red-700 border border-red-200"
              : "bg-green-50 text-green-700 border border-green-200"
          }`}
        >
          {toast.type === "error" ? (
            <AlertCircle className="w-4 h-4" />
          ) : (
            <CheckCircle className="w-4 h-4" />
          )}
          {toast.msg}
        </div>
      )}

      {/* Heading */}
      <div className="mb-6 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-amber-500 mb-1">
            Pricing Configuration
          </p>
          <h3 className="text-2xl font-black tracking-tight text-slate-900">
            Services & Pricing
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Manage services here. Changes sync to n8n automatically via Supabase.
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={downloadTemplate}
            className="flex items-center gap-2 bg-white border border-gray-200 hover:border-amber-300 hover:bg-amber-50 text-gray-600 font-semibold px-4 py-2.5 rounded-xl text-sm transition-all duration-200"
          >
            <Download className="w-4 h-4" />
            CSV Template
          </button>
          <button
            onClick={() => fileRef.current?.click()}
            className="flex items-center gap-2 bg-white border border-gray-200 hover:border-amber-300 hover:bg-amber-50 text-gray-600 font-semibold px-4 py-2.5 rounded-xl text-sm transition-all duration-200"
          >
            <Upload className="w-4 h-4" />
            Upload CSV
          </button>
          <input
            ref={fileRef}
            type="file"
            accept=".csv"
            className="hidden"
            onChange={handleCSVUpload}
          />
          <button
            onClick={saveAll}
            disabled={saving}
            className="flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-900 font-semibold px-5 py-2.5 rounded-xl text-sm transition-all duration-200 shadow-sm hover:shadow-lg disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? "Saving…" : "Save All"}
          </button>
        </div>
      </div>

      {/* Error banner */}
      {error && (
        <div className="text-amber-700 text-sm mb-4 bg-amber-50 rounded-2xl border border-amber-200 px-5 py-4">
          ⚠️ {error}
        </div>
      )}

      {/* CSV format hint */}
      <div className="bg-slate-900 rounded-2xl px-5 py-4 mb-6 text-xs font-mono text-gray-400 flex items-start gap-3">
        <span className="text-amber-400 mt-0.5 shrink-0">CSV format:</span>
        <span>service, base, unit (fixed | per_unit), per, urgency_multiplier</span>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center gap-3 text-gray-500 text-sm bg-white rounded-2xl border border-gray-200 px-5 py-6">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse inline-block" />
          Loading services…
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-gray-100 bg-slate-50">
                  {["Service Name", "Base Price (€)", "Unit", "Per-Unit Price (€)", "Urgency Multiplier", ""].map(
                    (h) => (
                      <th
                        key={h}
                        className="px-5 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap"
                      >
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {services.map((row, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-gray-50 hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-5 py-3">
                      <input
                        value={row.service}
                        onChange={(e) => handleChange(idx, "service", e.target.value)}
                        placeholder="e.g. Socket installation"
                        className="w-full bg-slate-50 border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-900 placeholder-gray-300 focus:outline-none focus:border-amber-300 focus:ring-2 focus:ring-amber-100 transition-all min-w-[180px]"
                      />
                    </td>
                    <td className="px-5 py-3">
                      <input
                        type="number"
                        value={row.base}
                        onChange={(e) => handleChange(idx, "base", e.target.value)}
                        className="w-24 bg-slate-50 border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-amber-300 focus:ring-2 focus:ring-amber-100 transition-all"
                      />
                    </td>
                    <td className="px-5 py-3">
                      <select
                        value={row.unit}
                        onChange={(e) => handleChange(idx, "unit", e.target.value)}
                        className="bg-slate-50 border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-amber-300 cursor-pointer transition-all"
                      >
                        <option value="fixed">Fixed price</option>
                        <option value="per_unit">Per unit/meter</option>
                      </select>
                    </td>
                    <td className="px-5 py-3">
                      <input
                        type="number"
                        value={row.per}
                        disabled={row.unit === "fixed"}
                        onChange={(e) => handleChange(idx, "per", e.target.value)}
                        className="w-24 bg-slate-50 border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-amber-300 focus:ring-2 focus:ring-amber-100 transition-all disabled:opacity-30"
                      />
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          step="0.1"
                          value={row.urgency}
                          onChange={(e) => handleChange(idx, "urgency", e.target.value)}
                          className="w-20 bg-slate-50 border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-amber-300 focus:ring-2 focus:ring-amber-100 transition-all"
                        />
                        <span className="text-xs text-gray-400">×</span>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <button
                        onClick={() => deleteRow(idx)}
                        className="w-8 h-8 flex items-center justify-center rounded-xl text-gray-300 hover:text-red-500 hover:bg-red-50 transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Add row footer */}
          <div className="px-5 py-4 border-t border-gray-100 bg-slate-50">
            <button
              onClick={addRow}
              className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-amber-600 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add service row
            </button>
          </div>
        </div>
      )}

      {/* Help box */}
      <div className="mt-6 bg-blue-50 rounded-2xl border border-blue-100 px-5 py-4 text-sm text-blue-700">
        <p className="font-bold mb-1">🔌 How this connects to n8n</p>
        <p className="text-blue-600 leading-relaxed">
          After saving, your n8n <strong>Pricing</strong> node should fetch services via an{" "}
          <strong>HTTP Request</strong> node pointing to Supabase:
          <br />
          <code className="bg-blue-100 px-2 py-0.5 rounded text-xs mt-1 inline-block">
            GET {SUPABASE_URL}/rest/v1/services
          </code>
          <br />
          Replace your Google Sheets node with this. See the updated workflow instructions below.
        </p>
      </div>
    </div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────
export default function AdminDashboard() {
  const [leads, setLeads] = useState([]);
  const [activeTab, setActiveTab] = useState("leads");
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterUrgency, setFilterUrgency] = useState("All");
  const [filterService, setFilterService] = useState("All");
  const [lightboxImg, setLightboxImg] = useState(null);
  const [weekBase, setWeekBase] = useState(new Date());

  const [leadsLoading, setLeadsLoading] = useState(false);
  const [leadsError, setLeadsError] = useState(null);

  const [calendarEvents, setCalendarEvents] = useState([]);
  const [calendarLoading, setCalendarLoading] = useState(false);
  const [calendarError, setCalendarError] = useState(null);

  function loadLeads() {
    setLeadsLoading(true);
    setLeadsError(null);
    fetchLeadsFromSupabase()
      .then((rows) => { setLeads(rows); setLeadsLoading(false); })
      .catch((err) => { setLeadsError(err.message); setLeadsLoading(false); });
  }

  useEffect(() => { loadLeads(); }, []);

  useEffect(() => {
    if (activeTab !== "calendar") return;
    setCalendarLoading(true);
    setCalendarError(null);
    fetch("https://cthzexnthkybvoebwyth.supabase.co/functions/v1/calendar-events")
      .then((r) => r.json())
      .then((data) => { setCalendarEvents(data.events || []); setCalendarLoading(false); })
      .catch(() => { setCalendarError("Could not load Google Calendar events."); setCalendarLoading(false); });
  }, [activeTab]);

  const stats = useMemo(() => {
    const booked = leads.filter((l) => l.status === "Booked").length;
    const urgent = leads.filter((l) => l.urgency === "urgent").length;
    const revenue = leads.reduce((s, l) => s + Number(l.price || 0), 0);
    return [
      { label: "Gesamtanfragen", value: leads.length, icon: <Users className="w-6 h-6 text-amber-400" /> },
      { label: "Gebucht", value: booked, icon: <CalendarDays className="w-6 h-6 text-amber-400" /> },
      { label: "Dringend", value: urgent, icon: <AlertTriangle className="w-6 h-6 text-amber-400" /> },
      { label: "Geschätzter Umsatz", value: `€${revenue.toLocaleString()}`, icon: <CircleDollarSign className="w-6 h-6 text-amber-400" /> },
    ];
  }, [leads]);

  const filtered = useMemo(() => {
    return leads.filter((l) => {
      const q = search.toLowerCase();
      const matchSearch = !q || [l.customerName, l.email, l.service, l.phone, l.address].some((v) => v?.toLowerCase().includes(q));
      const matchStatus = filterStatus === "All" || l.status === filterStatus;
      const matchUrgency = filterUrgency === "All" || l.urgency === filterUrgency;
      const matchService = filterService === "All" || l.service === filterService;
      return matchSearch && matchStatus && matchUrgency && matchService;
    });
  }, [leads, search, filterStatus, filterUrgency, filterService]);

  const services = [...new Set(leads.map((l) => l.service))];
  const weekDays = getWeekDays(weekBase);
  const activeFilters = [
    filterStatus !== "All" && filterStatus,
    filterUrgency !== "All" && filterUrgency,
    filterService !== "All" && filterService,
  ].filter(Boolean);

  function getSlotForCell(day, hour) {
    return calendarEvents.filter((e) => {
      if (!e.start) return false;
      const d = new Date(e.start);
      return d.getDate() === day.getDate() && d.getMonth() === day.getMonth() && d.getFullYear() === day.getFullYear() && d.getHours() === hour;
    });
  }

  function parseEventMeta(event) {
    const desc = event.description || "";
    const get = (key) => { const m = desc.match(new RegExp(key + ":\\s*(.+)")); return m ? m[1].trim() : null; };
    const customerName = event.title || "Appointment";
    const service = get("Service") || "Electrical Service";
    const urgency = (get("Urgency") || "normal").toLowerCase();
    const phone = get("Phone") || "";
    const matched = leads.find((l) => l.customerName?.toLowerCase() === customerName.toLowerCase() || (l.slot && event.start && new Date(l.slot).toISOString().slice(0, 16) === new Date(event.start).toISOString().slice(0, 16)));
    const price = matched ? matched.price : null;
    const status = matched ? matched.status : null;
    return { customerName, service, urgency, phone, price, status };
  }

  function updateStatus(id, newStatus) {
    updateLeadStatusInSupabase(id, newStatus)
      .then(() => setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status: newStatus } : l))))
      .catch((err) => console.error("Status update failed:", err));
  }

  function exportCSV() {
    const csv = ["Name,Phone,Email,Service,Price,Urgency,Slot,Status", ...leads.map((l) => `${l.customerName},${l.phone},${l.email},${l.service},${l.price},${l.urgency},${l.slot},${l.status}`)].join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = "lutz_leads.csv";
    a.click();
  }

  function refreshCalendar() {
    setCalendarLoading(true);
    setCalendarError(null);
    fetch("https://cthzexnthkybvoebwyth.supabase.co/functions/v1/calendar-events")
      .then((r) => r.json())
      .then((d) => { setCalendarEvents(d.events || []); setCalendarLoading(false); })
      .catch(() => { setCalendarError("Could not load events."); setCalendarLoading(false); });
  }

  const tabs = [
    { id: "leads", label: "Leads", icon: <LayoutList className="w-4 h-4" /> },
    { id: "calendar", label: "Kalender", icon: <Calendar className="w-4 h-4" /> },
    { id: "services", label: "Services", icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <div className="bg-slate-50 text-gray-900 font-sans min-h-screen overflow-x-hidden">
      {/* ── LIGHTBOX ── */}
      {lightboxImg && (
        <div onClick={() => setLightboxImg(null)} className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center cursor-zoom-out">
          <img src={lightboxImg} alt="attachment" className="max-w-[90vw] max-h-[85vh] rounded-3xl shadow-2xl" />
          <button onClick={() => setLightboxImg(null)} className="absolute top-6 right-8 text-white/70 hover:text-white text-3xl bg-white/10 rounded-full w-10 h-10 flex items-center justify-center transition-colors">
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
            <div className="hidden sm:flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse inline-block" />
              <span className="text-gray-600 font-medium">n8n aktiv</span>
            </div>
            <button onClick={exportCSV} className="bg-amber-400 hover:bg-amber-300 text-slate-900 font-semibold px-5 py-2.5 rounded-xl transition-all duration-300 shadow-sm hover:shadow-lg hover:-translate-y-0.5 active:scale-95 flex items-center gap-2 text-sm">
              <Download className="w-4 h-4" />
              CSV exportieren
            </button>
          </div>
        </div>
      </header>

      {/* ── HERO STRIP ── */}
      <section className="bg-slate-900 text-white py-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,_#fbbf24,_transparent_35%)]" />
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <p className="text-sm font-semibold uppercase tracking-wide text-amber-400 mb-2">Lutz Electrical</p>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">Admin Dashboard</h2>
          <p className="text-gray-400 mt-3 text-lg">Live-Buchungen · Kundenanfragen · Kalender · Services</p>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="bg-gradient-to-b from-white to-slate-50 border-b border-gray-100 py-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((s, i) => (
              <div key={i} className="group bg-white rounded-3xl p-6 border border-gray-200 hover:border-amber-200 hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
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
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm transition-all duration-300 ${
                activeTab === tab.id
                  ? "bg-amber-400 text-slate-900 shadow-md shadow-amber-400/20"
                  : "bg-white border border-gray-200 text-gray-600 hover:border-amber-200 hover:text-slate-900"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* ══ LEADS TAB ══ */}
        {activeTab === "leads" && (
          <div>
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-amber-500 mb-1">Kundenanfragen</p>
                <h3 className="text-2xl font-black tracking-tight text-slate-900">Alle Buchungen</h3>
              </div>
              <button onClick={loadLeads} disabled={leadsLoading} className="flex items-center gap-2 bg-white border border-gray-200 hover:border-amber-300 hover:bg-amber-50 text-gray-600 font-semibold px-4 py-2.5 rounded-xl text-sm transition-all duration-300 disabled:opacity-50">
                <RefreshCw className={`w-4 h-4 ${leadsLoading ? "animate-spin" : ""}`} />
                Aktualisieren
              </button>
            </div>

            {leadsLoading && (
              <div className="flex items-center gap-3 text-gray-500 text-sm mb-4 bg-white rounded-2xl border border-gray-200 px-5 py-4">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse inline-block" />
                Anfragen werden aus der Datenbank geladen…
              </div>
            )}
            {leadsError && !leadsLoading && (
              <div className="text-red-600 text-sm mb-4 bg-red-50 rounded-2xl border border-red-200 px-5 py-4">
                ⚠️ {leadsError}
              </div>
            )}

            {/* Filters */}
            <div className="bg-white rounded-3xl border border-gray-200 p-5 mb-6 flex flex-wrap gap-3 items-center">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Name, E-Mail oder Service suchen…" className="w-full bg-slate-50 border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-amber-300 focus:ring-2 focus:ring-amber-100 transition-all" />
              </div>
              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="bg-slate-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:border-amber-300 transition-all cursor-pointer">
                <option>Alle</option><option>Booked</option><option>Ausstehend</option><option>Abgeschlossen</option>
              </select>
              <select value={filterUrgency} onChange={(e) => setFilterUrgency(e.target.value)} className="bg-slate-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:border-amber-300 transition-all cursor-pointer">
                <option>Alle</option><option value="normal">Normal</option><option value="urgent">Dringend</option>
              </select>
              <select value={filterService} onChange={(e) => setFilterService(e.target.value)} className="bg-slate-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:border-amber-300 transition-all cursor-pointer">
                <option>Alle</option>
                {services.map((s) => <option key={s}>{s}</option>)}
              </select>
              {activeFilters.length > 0 && (
                <div className="flex gap-2 items-center flex-wrap">
                  {activeFilters.map((f, i) => (
                    <span key={i} className="bg-amber-50 text-amber-600 text-xs font-bold px-3 py-1 rounded-full border border-amber-200">{f}</span>
                  ))}
                  <button onClick={() => { setFilterStatus("All"); setFilterUrgency("All"); setFilterService("All"); }} className="text-xs text-gray-400 hover:text-slate-900 underline transition-colors font-medium">Alle zurücksetzen</button>
                </div>
              )}
              <span className="ml-auto text-xs text-gray-400 font-medium whitespace-nowrap">{filtered.length} Ergebnis{filtered.length !== 1 ? "s" : ""}</span>
            </div>

            {/* Table */}
            <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-gray-100">
                      {["Kunde", "Kontakt", "Leistung", "Preis", "Priorität", "Termin", "Foto", "Status"].map((h) => (
                        <th key={h} className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.length === 0 && (
                      <tr><td colSpan={8} className="py-20 text-center text-gray-400">Keine Anfragen entsprechen Ihren Filtern.</td></tr>
                    )}
                    {filtered.map((lead, i) => {
                      const sColor = SERVICE_COLOR[lead.service] || "#888";
                      const st = STATUS_CONFIG[lead.status] || { label: lead.status, cls: "bg-gray-100 text-gray-600" };
                      const urg = URGENCY_CONFIG[lead.urgency] || URGENCY_CONFIG.normal;
                      return (
                        <tr key={lead.id} className="border-b border-gray-50 hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-2xl flex items-center justify-center text-sm font-bold flex-shrink-0" style={{ background: sColor + "18", color: sColor, border: `1.5px solid ${sColor}33` }}>
                                {lead.customerName?.[0]?.toUpperCase()}
                              </div>
                              <div>
                                <div className="font-semibold text-slate-900">{lead.customerName}</div>
                                <div className="text-xs text-gray-400 mt-0.5">Menge: {lead.quantity}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-gray-700">{lead.phone}</div>
                            <div className="text-xs text-gray-400 mt-0.5">{lead.email}</div>
                            <div className="text-xs text-gray-500 mt-1 max-w-[220px] break-words">📍 {lead.address || "No address"}</div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap" style={{ background: sColor + "18", color: sColor }}>{lead.service}</span>
                          </td>
                          <td className="px-6 py-4 font-bold text-slate-900">€{lead.price}</td>
                          <td className="px-6 py-4">
                            <span className={`text-xs font-bold px-3 py-1 rounded-full ${urg.cls}`}>{urg.label}</span>
                          </td>
                          <td className="px-6 py-4 text-gray-600 whitespace-nowrap text-xs">{fmt(lead.slot)}</td>
                          <td className="px-6 py-4">
                            {lead.photoUrl ? (
                              <img src={lead.photoUrl} alt="attachment" onClick={() => setLightboxImg(lead.photoUrl)} className="w-11 h-11 object-cover rounded-xl cursor-zoom-in border-2 border-gray-200 hover:border-amber-300 hover:scale-110 transition-all duration-200" />
                            ) : (
                              <span className="text-gray-300 text-xs">—</span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <select value={lead.status} onChange={(e) => updateStatus(lead.id, e.target.value)} className={`text-xs font-bold px-3 py-1.5 rounded-full border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-200 transition-all ${st.cls}`}>
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

        {/* ══ CALENDAR TAB ══ */}
        {activeTab === "calendar" && (
          <div>
            <div className="mb-6">
              <p className="text-sm font-semibold uppercase tracking-wide text-amber-500 mb-1">Wochenübersicht</p>
              <h3 className="text-2xl font-black tracking-tight text-slate-900">Terminkalender</h3>
            </div>
            <div className="bg-white rounded-3xl border border-gray-200 p-5 mb-6 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <button onClick={() => { const d = new Date(weekBase); d.setDate(d.getDate() - 7); setWeekBase(d); }} className="w-9 h-9 flex items-center justify-center bg-slate-50 border border-gray-200 rounded-xl hover:border-amber-300 hover:bg-amber-50 transition-all"><ChevronLeft className="w-4 h-4 text-gray-600" /></button>
                <button onClick={() => setWeekBase(new Date())} className="bg-amber-400 hover:bg-amber-300 text-slate-900 font-semibold px-4 py-2 rounded-xl text-sm transition-all duration-300 active:scale-95">Heute</button>
                <button onClick={() => { const d = new Date(weekBase); d.setDate(d.getDate() + 7); setWeekBase(d); }} className="w-9 h-9 flex items-center justify-center bg-slate-50 border border-gray-200 rounded-xl hover:border-amber-300 hover:bg-amber-50 transition-all"><ChevronRight className="w-4 h-4 text-gray-600" /></button>
                <button onClick={refreshCalendar} className="w-9 h-9 flex items-center justify-center bg-slate-50 border border-gray-200 rounded-xl hover:border-amber-300 hover:bg-amber-50 transition-all"><RefreshCw className="w-4 h-4 text-gray-500" /></button>
              </div>
              <span className="font-black text-xl tracking-tight text-slate-900">{weekDays[0].toLocaleString("en-DE", { month: "long" })} {weekDays[0].getFullYear()}</span>
              <div className="flex gap-4 flex-wrap">
                {Object.entries(SERVICE_COLOR).map(([s, c]) => (
                  <div key={s} className="flex items-center gap-1.5 text-xs text-gray-500">
                    <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: c }} />{s}
                  </div>
                ))}
              </div>
            </div>
            {calendarLoading && <div className="flex items-center gap-3 text-gray-500 text-sm mb-4 bg-white rounded-2xl border border-gray-200 px-5 py-4"><span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse inline-block" />Google-Kalendertermine werden geladen…</div>}
            {calendarError && !calendarLoading && <div className="text-red-600 text-sm mb-4 bg-red-50 rounded-2xl border border-red-200 px-5 py-4">⚠️ {calendarError}</div>}
            {!calendarLoading && !calendarError && calendarEvents.length === 0 && <div className="text-gray-400 text-sm mb-4 bg-white rounded-2xl border border-gray-200 px-5 py-4">Für diesen Zeitraum wurden keine Termine im Google Kalender gefunden.</div>}
            <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden">
              <div className="grid border-b border-gray-100 bg-slate-50" style={{ gridTemplateColumns: "64px repeat(7, 1fr)" }}>
                <div className="p-3" />
                {weekDays.map((day, i) => {
                  const isToday = day.toDateString() === new Date().toDateString();
                  return (
                    <div key={i} className={`p-3 text-center border-l border-gray-100 ${isToday ? "bg-amber-50" : ""}`}>
                      <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{day.toLocaleString("en-DE", { weekday: "short" })}</div>
                      <div className={`text-xl font-black leading-none ${isToday ? "text-amber-500" : "text-slate-900"}`}>{day.getDate()}</div>
                      {isToday && <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mx-auto mt-1.5" />}
                    </div>
                  );
                })}
              </div>
              <div className="overflow-y-auto" style={{ maxHeight: "60vh" }}>
                {HOURS.map((hour, hi) => (
                  <div key={hour} className="grid border-b border-gray-100 min-h-[72px]" style={{ gridTemplateColumns: "64px repeat(7, 1fr)", background: hi % 2 === 0 ? "#ffffff" : "#f9fafb" }}>
                    <div className="px-3 pt-3 text-xs font-bold text-gray-300 text-right leading-none border-r border-gray-100 select-none">{String(hour).padStart(2, "0")}:00</div>
                    {weekDays.map((day, di) => {
                      const slotEvents = getSlotForCell(day, hour);
                      const isToday = day.toDateString() === new Date().toDateString();
                      return (
                        <div key={di} className={`border-l border-gray-100 p-1.5 min-h-[72px] ${isToday ? "bg-amber-50/40" : ""}`}>
                          {slotEvents.map((e, ei) => {
                            const meta = parseEventMeta(e);
                            const c = SERVICE_COLOR[meta.service] || "#6366f1";
                            const stConfig = meta.status ? STATUS_CONFIG[meta.status] : null;
                            return (
                              <div key={ei} title={`${meta.customerName} · ${meta.service}${meta.price ? ` · €${meta.price}` : ""}`} className="rounded-xl mb-1 overflow-hidden shadow-sm" style={{ border: `1.5px solid ${c}40` }}>
                                <div className="px-2 py-1 flex items-center justify-between gap-1" style={{ background: c }}>
                                  <span className="text-[10px] font-bold text-white/90 leading-none">{fmtTime(e.start)}</span>
                                  {meta.urgency === "urgent" && <span className="text-[9px] font-black text-white bg-red-600 rounded px-1">URGENT</span>}
                                </div>
                                <div className="px-2 py-1.5" style={{ background: c + "12" }}>
                                  <div className="text-[11px] font-bold text-slate-800 truncate leading-tight">{meta.customerName}</div>
                                  <div className="text-[10px] text-gray-500 truncate leading-tight mt-0.5">{meta.service}</div>
                                  <div className="flex items-center justify-between mt-1 gap-1">
                                    {meta.price != null ? <span className="text-[10px] font-bold" style={{ color: c }}>€{meta.price}</span> : <span />}
                                    {stConfig && <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${stConfig.cls}`}>{stConfig.label}</span>}
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

        {/* ══ SERVICES TAB ══ */}
        {activeTab === "services" && <ServicesTab />}
      </main>

      {/* ── FOOTER ── */}
      <footer className="bg-slate-950 text-gray-400 border-t border-white/5 mt-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-400 flex items-center justify-center"><Zap className="w-4 h-4 text-slate-900" /></div>
            <span className="text-white font-black">ElektroFix</span>
            <span className="text-gray-600">Admin Panel</span>
          </div>
          <div className="flex items-center gap-6 text-gray-500">
            <div className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-amber-400" /><span>Internal Use Only</span></div>
            <span>•</span>
            <div className="flex items-center gap-2"><Clock3 className="w-4 h-4 text-amber-400" /><span>Frankfurt, Germany</span></div>
          </div>
        </div>
      </footer>
    </div>
  );
}
