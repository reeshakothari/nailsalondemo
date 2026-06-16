"use client";

import { useState } from "react";

const TECHNICIANS = ["All", "Kezia B.", "Priya T.", "Sarah K.", "Maria L."];

const INITIAL_APPOINTMENTS = [
  { id: 1, date: "2026-06-11", time: "09:00", client: "Amara Johnson", phone: "07700 900123", service: "Gel Manicure", tech: "Kezia B.", price: 30, status: "confirmed", notes: "" },
  { id: 2, date: "2026-06-11", time: "10:15", client: "Sophie Williams", phone: "07700 900456", service: "Acrylic Full Set", tech: "Priya T.", price: 55, status: "in-progress", notes: "Regular client, prefers almond shape" },
  { id: 3, date: "2026-06-11", time: "11:00", client: "Lily Chen", phone: "07700 900789", service: "Classic Manicure", tech: "Sarah K.", price: 22, status: "completed", notes: "" },
  { id: 4, date: "2026-06-11", time: "11:45", client: "Emma Davis", phone: "07700 900111", service: "Nail Art & Design", tech: "Kezia B.", price: 45, status: "confirmed", notes: "Wants floral design" },
  { id: 5, date: "2026-06-11", time: "13:30", client: "Aisha Patel", phone: "07700 900222", service: "Luxury Pedicure", tech: "Maria L.", price: 38, status: "confirmed", notes: "" },
  { id: 6, date: "2026-06-11", time: "14:15", client: "Ruby Thompson", phone: "07700 900333", service: "Gel Manicure", tech: "Priya T.", price: 30, status: "pending", notes: "New client" },
  { id: 7, date: "2026-06-11", time: "15:30", client: "Zara Ali", phone: "07700 900444", service: "Nail Extensions", tech: "Sarah K.", price: 58, status: "confirmed", notes: "" },
  { id: 8, date: "2026-06-11", time: "16:00", client: "Mia Roberts", phone: "07700 900555", service: "Classic Manicure", tech: "Maria L.", price: 22, status: "pending", notes: "" },
  { id: 9, date: "2026-06-11", time: "17:00", client: "Sofia Martinez", phone: "07700 900666", service: "Chrome Nail Art", tech: "Kezia B.", price: 65, status: "confirmed", notes: "Celebrity client" },
  { id: 10, date: "2026-06-12", time: "09:30", client: "Hannah Brown", phone: "07700 900777", service: "Gel Pedicure", tech: "Maria L.", price: 42, status: "confirmed", notes: "" },
  { id: 11, date: "2026-06-12", time: "10:00", client: "Olivia Wilson", phone: "07700 900888", service: "Acrylic Infill", tech: "Priya T.", price: 35, status: "pending", notes: "" },
  { id: 12, date: "2026-06-12", time: "11:30", client: "Chloe Taylor", phone: "07700 900999", service: "Nail Art & Design", tech: "Kezia B.", price: 45, status: "confirmed", notes: "Birthday nails" },
];

const STATUS_TABS = ["All", "Confirmed", "Pending", "In Progress", "Completed", "Cancelled"];

const statusStyle: Record<string, { bg: string; text: string }> = {
  confirmed: { bg: "bg-emerald-50 border-emerald-200", text: "text-emerald-700" },
  "in-progress": { bg: "bg-blue-50 border-blue-200", text: "text-blue-700" },
  completed: { bg: "bg-gray-50 border-gray-200", text: "text-gray-500" },
  pending: { bg: "bg-amber-50 border-amber-200", text: "text-amber-700" },
  cancelled: { bg: "bg-red-50 border-red-200", text: "text-red-600" },
};

function addDays(dateStr: string, n: number) {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + n);
  return d.toISOString().split("T")[0];
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
}

function initials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

export default function AppointmentsPanel() {
  const [appointments, setAppointments] = useState(INITIAL_APPOINTMENTS);
  const [date, setDate] = useState("2026-06-11");
  const [statusFilter, setStatusFilter] = useState("All");
  const [techFilter, setTechFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [newAppt, setNewAppt] = useState({ time: "", client: "", phone: "", service: "", tech: "Kezia B.", price: "", notes: "" });

  const dayAppts = appointments.filter((a) => a.date === date);

  const filtered = dayAppts.filter((a) => {
    const matchStatus = statusFilter === "All" || a.status === statusFilter.toLowerCase().replace(" ", "-");
    const matchTech = techFilter === "All" || a.tech === techFilter;
    const matchSearch = a.client.toLowerCase().includes(search.toLowerCase()) || a.service.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchTech && matchSearch;
  });

  const stats = [
    { label: "Total", value: dayAppts.length, color: "#e8177e" },
    { label: "Confirmed", value: dayAppts.filter((a) => a.status === "confirmed").length, color: "#10b981" },
    { label: "Pending", value: dayAppts.filter((a) => a.status === "pending").length, color: "#f59e0b" },
    { label: "Completed", value: dayAppts.filter((a) => a.status === "completed").length, color: "#6b7280" },
  ];

  function changeStatus(id: number, status: string) {
    setAppointments((prev) => prev.map((a) => a.id === id ? { ...a, status } : a));
  }

  function addAppointment() {
    if (!newAppt.time || !newAppt.client || !newAppt.service) return;
    setAppointments((prev) => [...prev, {
      id: Date.now(), date, time: newAppt.time, client: newAppt.client,
      phone: newAppt.phone, service: newAppt.service, tech: newAppt.tech,
      price: parseInt(newAppt.price) || 0, status: "pending", notes: newAppt.notes,
    }]);
    setNewAppt({ time: "", client: "", phone: "", service: "", tech: "Kezia B.", price: "", notes: "" });
    setShowForm(false);
  }

  const revenue = dayAppts.filter((a) => a.status === "completed").reduce((s, a) => s + a.price, 0);

  return (
    <div className="flex-1 overflow-y-auto px-8 py-6 thin-scroll">
      {/* Date navigation */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button onClick={() => setDate(addDays(date, -1))}
            className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center text-gray-500 hover:border-pink-300 hover:text-pink-600 transition-colors">
            ‹
          </button>
          <div>
            <h2 className="text-lg font-bold text-gray-900">{formatDate(date)}</h2>
            <p className="text-xs text-gray-400">{dayAppts.length} appointments · ${revenue} collected</p>
          </div>
          <button onClick={() => setDate(addDays(date, 1))}
            className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center text-gray-500 hover:border-pink-300 hover:text-pink-600 transition-colors">
            ›
          </button>
          <button onClick={() => setDate("2026-06-11")}
            className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs text-gray-500 hover:bg-pink-50 hover:border-pink-300 hover:text-pink-600 transition-colors">
            Today
          </button>
        </div>
        <button onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-semibold transition-all hover:-translate-y-0.5 hover:shadow-lg"
          style={{ background: "linear-gradient(135deg,#e8177e,#c01068)" }}>
          + New Appointment
        </button>
      </div>

      {/* Stat pills */}
      <div className="flex gap-3 mb-5">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-xl px-4 py-3 border border-pink-50 shadow-sm flex items-center gap-3 min-w-[100px]">
            <div className="w-2 h-2 rounded-full shrink-0" style={{ background: s.color }} />
            <div>
              <p className="text-xl font-bold text-gray-900">{s.value}</p>
              <p className="text-xs text-gray-400">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Inline add form */}
      {showForm && (
        <div className="bg-white rounded-2xl border border-pink-200 shadow-sm p-5 mb-5">
          <h3 className="font-semibold text-gray-900 mb-4 text-sm">New Appointment — {formatDate(date)}</h3>
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 mb-3">
            {[
              { label: "Time", key: "time", type: "time" },
              { label: "Client Name", key: "client", type: "text" },
              { label: "Phone", key: "phone", type: "text" },
              { label: "Service", key: "service", type: "text" },
            ].map(({ label, key, type }) => (
              <div key={key}>
                <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-1">{label}</label>
                <input type={type} value={(newAppt as Record<string, string>)[key]}
                  onChange={(e) => setNewAppt((p) => ({ ...p, [key]: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-pink-400" />
              </div>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div>
              <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-1">Technician</label>
              <select value={newAppt.tech} onChange={(e) => setNewAppt((p) => ({ ...p, tech: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-pink-400">
                {TECHNICIANS.filter((t) => t !== "All").map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-1">Price ($)</label>
              <input type="number" value={newAppt.price} onChange={(e) => setNewAppt((p) => ({ ...p, price: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-pink-400" />
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-1">Notes</label>
              <input type="text" value={newAppt.notes} onChange={(e) => setNewAppt((p) => ({ ...p, notes: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-pink-400" />
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={addAppointment}
              className="px-5 py-2 rounded-lg text-white text-sm font-semibold"
              style={{ background: "linear-gradient(135deg,#e8177e,#c01068)" }}>
              Add Appointment
            </button>
            <button onClick={() => setShowForm(false)}
              className="px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-500 hover:bg-gray-50">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <div className="flex border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
          {STATUS_TABS.map((s) => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`px-3 py-2 text-xs font-medium transition-colors ${statusFilter === s ? "text-white" : "text-gray-500 hover:text-gray-700"}`}
              style={statusFilter === s ? { background: "linear-gradient(135deg,#e8177e,#c01068)" } : {}}>
              {s}
            </button>
          ))}
        </div>
        <select value={techFilter} onChange={(e) => setTechFilter(e.target.value)}
          className="border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-600 bg-white focus:outline-none focus:border-pink-400 shadow-sm">
          {TECHNICIANS.map((t) => <option key={t}>{t}</option>)}
        </select>
        <input type="text" placeholder="Search client or service…" value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-200 rounded-xl px-3 py-2 text-xs bg-white focus:outline-none focus:border-pink-400 shadow-sm w-48" />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-pink-50 shadow-sm overflow-hidden">
        {filtered.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-gray-400 text-sm">No appointments match your filters.</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-pink-50">
                {["Time", "Client", "Service", "Technician", "Price", "Status", "Actions"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.sort((a, b) => a.time.localeCompare(b.time)).map((apt) => {
                const s = statusStyle[apt.status] ?? statusStyle.pending;
                return (
                  <tr key={apt.id} className="border-b border-pink-50/60 hover:bg-pink-50/20 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-gray-500 font-semibold">{apt.time}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0"
                          style={{ background: "linear-gradient(135deg,#e8177e,#c01068)" }}>
                          {initials(apt.client)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800 text-xs">{apt.client}</p>
                          <p className="text-gray-400 text-[10px]">{apt.phone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600 text-xs">{apt.service}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{apt.tech}</td>
                    <td className="px-4 py-3 font-semibold text-gray-800 text-xs">${apt.price}</td>
                    <td className="px-4 py-3">
                      <select value={apt.status}
                        onChange={(e) => changeStatus(apt.id, e.target.value)}
                        className={`text-xs font-medium px-2 py-1 rounded-full border focus:outline-none cursor-pointer ${s.bg} ${s.text}`}>
                        {Object.keys(statusStyle).map((st) => (
                          <option key={st} value={st}>{st.replace("-", " ")}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        {apt.notes && (
                          <span title={apt.notes} className="cursor-help text-gray-300 hover:text-pink-400 transition-colors text-sm">📝</span>
                        )}
                        <button onClick={() => changeStatus(apt.id, "cancelled")}
                          className="text-[10px] text-gray-300 hover:text-red-400 transition-colors">✕</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
