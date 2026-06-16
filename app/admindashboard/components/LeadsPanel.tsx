"use client";

import { useState } from "react";

const INITIAL_LEADS = [
  { id: 1, name: "Jasmine Osei", email: "jasmine.osei@email.com", phone: "07700 111222", interest: "Acrylic Full Set", message: "Hi! I'd love to book in for a full set of acrylics. Do you have availability next week?", date: "2026-06-11", status: "new", source: "Contact Form" },
  { id: 2, name: "Natasha Green", email: "natasha.g@gmail.com", phone: "07700 333444", interest: "Gel Manicure", message: "Saw your Instagram and love your work! Can I book a gel mani for this Saturday?", date: "2026-06-11", status: "contacted", source: "Instagram" },
  { id: 3, name: "Fatima Hassan", email: "fhassan@outlook.com", phone: "07700 555666", interest: "Luxury Pedicure", message: "I'm getting married in 3 weeks and would love to book a luxury pedicure + manicure combo.", date: "2026-06-10", status: "booked", source: "Contact Form" },
  { id: 4, name: "Claire McCarthy", email: "claire.mc@email.co.uk", phone: "07700 777888", interest: "Nail Art", message: "I'd like to get some nail art done — can you do 3D designs? Looking for something for a party.", date: "2026-06-10", status: "new", source: "Google" },
  { id: 5, name: "Yemi Adeyemi", email: "yemi.a@hotmail.com", phone: "07700 999000", interest: "Chrome Nail Art", message: "I've been trying to find someone who does chrome nails. Would love a consultation!", date: "2026-06-09", status: "contacted", source: "Instagram" },
  { id: 6, name: "Rachel Kim", email: "rkim@email.com", phone: "07700 112233", interest: "Acrylic Infill", message: "My current infill is due — are you taking new clients? Your work looks amazing online.", date: "2026-06-09", status: "booked", source: "Google" },
  { id: 7, name: "Amelia Foster", email: "amelia.f@gmail.com", phone: "07700 445566", interest: "Classic Manicure", message: "Looking for a quick manicure appointment, preferably weekday mornings.", date: "2026-06-08", status: "closed", source: "Contact Form" },
  { id: 8, name: "Bianca Rossi", email: "b.rossi@email.it", phone: "07700 778899", interest: "Nail Extensions", message: "I'd like to get gel extensions — can you show me examples of your past work first?", date: "2026-06-08", status: "new", source: "Contact Form" },
];

const STATUS_TABS = ["All", "New", "Contacted", "Booked", "Closed"];

const statusConfig: Record<string, { bg: string; text: string; label: string }> = {
  new: { bg: "bg-blue-50 border-blue-200", text: "text-blue-700", label: "New" },
  contacted: { bg: "bg-amber-50 border-amber-200", text: "text-amber-700", label: "Contacted" },
  booked: { bg: "bg-emerald-50 border-emerald-200", text: "text-emerald-700", label: "Booked" },
  closed: { bg: "bg-gray-50 border-gray-200", text: "text-gray-500", label: "Closed" },
};

const sourceColour: Record<string, string> = {
  "Contact Form": "bg-purple-50 text-purple-600",
  Instagram: "bg-pink-50 text-pink-600",
  Google: "bg-blue-50 text-blue-600",
};

export default function LeadsPanel() {
  const [leads, setLeads] = useState(INITIAL_LEADS);
  const [filter, setFilter] = useState("All");
  const [expanded, setExpanded] = useState<number | null>(null);
  const [search, setSearch] = useState("");

  function setStatus(id: number, status: string) {
    setLeads((prev) => prev.map((l) => l.id === id ? { ...l, status } : l));
  }

  const stats = [
    { label: "Total Leads", value: leads.length, color: "#e8177e" },
    { label: "New", value: leads.filter((l) => l.status === "new").length, color: "#3b82f6" },
    { label: "Contacted", value: leads.filter((l) => l.status === "contacted").length, color: "#f59e0b" },
    { label: "Booked", value: leads.filter((l) => l.status === "booked").length, color: "#10b981" },
  ];

  const filtered = leads.filter((l) => {
    const matchStatus = filter === "All" || l.status === filter.toLowerCase();
    const matchSearch = l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.email.toLowerCase().includes(search.toLowerCase()) ||
      l.interest.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <div className="flex-1 overflow-y-auto px-8 py-6 thin-scroll">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Inbound Leads</h2>
          <p className="text-xs text-gray-400 mt-0.5">Enquiries from the contact form, Google & social</p>
        </div>
        <input type="text" placeholder="Search leads…" value={search} onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100 w-52 bg-white" />
      </div>

      {/* Stats */}
      <div className="flex gap-3 mb-5">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-xl px-4 py-3 border border-pink-50 shadow-sm flex items-center gap-3 min-w-[110px]">
            <div className="w-2 h-2 rounded-full shrink-0" style={{ background: s.color }} />
            <div>
              <p className="text-xl font-bold text-gray-900">{s.value}</p>
              <p className="text-xs text-gray-400">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Status filter */}
      <div className="flex border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm mb-5 w-fit">
        {STATUS_TABS.map((s) => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-4 py-2 text-xs font-medium transition-colors ${filter === s ? "text-white" : "text-gray-500 hover:text-gray-700"}`}
            style={filter === s ? { background: "linear-gradient(135deg,#e8177e,#c01068)" } : {}}>
            {s}
            {s !== "All" && (
              <span className={`ml-1 ${filter === s ? "text-white/70" : "text-gray-400"}`}>
                ({leads.filter((l) => l.status === s.toLowerCase()).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Leads list */}
      <div className="space-y-3">
        {filtered.length === 0 && (
          <div className="flex items-center justify-center h-32 text-gray-400 text-sm bg-white rounded-2xl border border-pink-50">No leads match your filter.</div>
        )}
        {filtered.map((lead) => {
          const sc = statusConfig[lead.status];
          const isOpen = expanded === lead.id;
          return (
            <div key={lead.id} className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition-all ${lead.status === "new" ? "border-blue-100" : "border-pink-50"}`}>
              {/* Row */}
              <div className="flex items-center gap-4 px-5 py-4 cursor-pointer" onClick={() => setExpanded(isOpen ? null : lead.id)}>
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                  style={{ background: "linear-gradient(135deg,#e8177e,#c01068)" }}>
                  {lead.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="font-semibold text-gray-900 text-sm">{lead.name}</p>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${sourceColour[lead.source] ?? "bg-gray-50 text-gray-500"}`}>
                      {lead.source}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 truncate">{lead.email} · {lead.interest}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <p className="text-xs text-gray-400">{new Date(lead.date).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}</p>
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${sc.bg} ${sc.text}`}>{sc.label}</span>
                  <span className={`text-gray-400 text-xs transition-transform ${isOpen ? "rotate-180" : ""}`}>▾</span>
                </div>
              </div>

              {/* Expanded detail */}
              {isOpen && (
                <div className="border-t border-pink-50 px-5 py-4">
                  <div className="grid grid-cols-3 gap-4 mb-4 text-xs">
                    <div>
                      <p className="text-gray-400 uppercase tracking-wider text-[10px] mb-1">Phone</p>
                      <a href={`tel:${lead.phone}`} className="font-medium text-gray-700 hover:text-pink-600">{lead.phone}</a>
                    </div>
                    <div>
                      <p className="text-gray-400 uppercase tracking-wider text-[10px] mb-1">Email</p>
                      <a href={`mailto:${lead.email}`} className="font-medium text-gray-700 hover:text-pink-600 truncate block">{lead.email}</a>
                    </div>
                    <div>
                      <p className="text-gray-400 uppercase tracking-wider text-[10px] mb-1">Service Interest</p>
                      <p className="font-medium text-gray-700">{lead.interest}</p>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-xl px-4 py-3 mb-4">
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Message</p>
                    <p className="text-sm text-gray-600 leading-relaxed">{lead.message}</p>
                  </div>
                  <div className="flex gap-2">
                    {lead.status === "new" && (
                      <button onClick={() => setStatus(lead.id, "contacted")}
                        className="px-4 py-2 rounded-lg text-white text-xs font-semibold"
                        style={{ background: "linear-gradient(135deg,#e8177e,#c01068)" }}>
                        Mark as Contacted
                      </button>
                    )}
                    {lead.status === "contacted" && (
                      <button onClick={() => setStatus(lead.id, "booked")}
                        className="px-4 py-2 rounded-lg text-white text-xs font-semibold bg-emerald-500 hover:bg-emerald-600">
                        Mark as Booked ✓
                      </button>
                    )}
                    {lead.status !== "closed" && (
                      <button onClick={() => setStatus(lead.id, "closed")}
                        className="px-4 py-2 rounded-lg border border-gray-200 text-xs text-gray-500 hover:bg-gray-50">
                        Close Lead
                      </button>
                    )}
                    {lead.status === "closed" && (
                      <button onClick={() => setStatus(lead.id, "new")}
                        className="px-4 py-2 rounded-lg border border-gray-200 text-xs text-gray-500 hover:bg-gray-50">
                        Reopen
                      </button>
                    )}
                    <a href={`mailto:${lead.email}`}
                      className="px-4 py-2 rounded-lg border border-pink-200 text-xs text-pink-600 hover:bg-pink-50 transition-colors">
                      Send Email ↗
                    </a>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
