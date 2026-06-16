"use client";

import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import AppointmentsPanel from "./components/AppointmentsPanel";
import ServicesPanel from "./components/ServicesPanel";
import ReviewsPanel from "./components/ReviewsPanel";
import LeadsPanel from "./components/LeadsPanel";

const STAMPS_TOTAL = 10;

const appointments = [
  { time: "09:00", client: "Amara Johnson", service: "Gel Manicure", tech: "Kezia B.", price: "$30", status: "confirmed" },
  { time: "10:15", client: "Sophie Williams", service: "Acrylic Full Set", tech: "Priya T.", price: "$55", status: "in-progress" },
  { time: "11:00", client: "Lily Chen", service: "Classic Manicure", tech: "Sarah K.", price: "$22", status: "completed" },
  { time: "11:45", client: "Emma Davis", service: "Nail Art & Design", tech: "Kezia B.", price: "$45", status: "confirmed" },
  { time: "13:30", client: "Aisha Patel", service: "Luxury Pedicure", tech: "Maria L.", price: "$38", status: "confirmed" },
  { time: "14:15", client: "Ruby Thompson", service: "Gel Manicure", tech: "Priya T.", price: "$30", status: "pending" },
  { time: "15:30", client: "Zara Ali", service: "Nail Extensions", tech: "Sarah K.", price: "$58", status: "confirmed" },
  { time: "16:00", client: "Mia Roberts", service: "Classic Manicure", tech: "Maria L.", price: "$22", status: "pending" },
  { time: "17:00", client: "Sofia Martinez", service: "Chrome Nail Art", tech: "Kezia B.", price: "$65", status: "confirmed" },
];

const topServices = [
  { name: "Gel Manicure", count: 42, pct: 100 },
  { name: "Acrylic Nails", count: 35, pct: 83 },
  { name: "Nail Art", count: 28, pct: 67 },
  { name: "Pedicure", count: 22, pct: 52 },
  { name: "Extensions", count: 18, pct: 43 },
];

const recentReviews = [
  { name: "Sophia R.", text: "Absolutely loved my gel nails! Will definitely be back.", stars: 5, service: "Gel Manicure" },
  { name: "Priya M.", text: "Amazing acrylic set — lasted 4 weeks without lifting!", stars: 5, service: "Acrylic Nails" },
  { name: "Emma T.", text: "The luxury pedicure was heavenly. Best in London!", stars: 5, service: "Luxury Pedicure" },
];

const navItems = [
  { icon: "📊", label: "Dashboard" },
  { icon: "📅", label: "Appointments" },
  { icon: "👥", label: "Clients" },
  { icon: "💄", label: "Services" },
  { icon: "⭐", label: "Reviews" },
  { icon: "📥", label: "Inbound Leads" },
  { icon: "✏️", label: "Edit Website", href: "/admindashboard/edit" },
];

const statusStyle: Record<string, string> = {
  confirmed: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  "in-progress": "bg-blue-50 text-blue-700 border border-blue-200",
  completed: "bg-gray-50 text-gray-500 border border-gray-200",
  pending: "bg-amber-50 text-amber-700 border border-amber-200",
};

interface Member {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  loyalty_stamps: number;
  created_at: string;
}

function StampCard({ stamps, total = STAMPS_TOTAL }: { stamps: number; total?: number }) {
  const filled = stamps % total;
  const cycles = Math.floor(stamps / total);
  return (
    <div className="rounded-xl p-4 border border-pink-100" style={{ background: "linear-gradient(135deg,#fdf2f8,#fce7f3)" }}>
      <div className="flex items-center justify-between mb-3">
        <p className="text-[10px] font-semibold text-pink-500 tracking-[0.2em] uppercase">Polish Circle</p>
        {cycles > 0 && (
          <span className="text-[10px] font-bold text-pink-600 bg-pink-100 px-2 py-0.5 rounded-full">
            {cycles}x reward earned
          </span>
        )}
      </div>
      <div className="grid grid-cols-5 gap-2 mb-2">
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            className="aspect-square rounded-full border-2 flex items-center justify-center transition-all"
            style={{
              borderColor: i < filled ? "#e8177e" : "#f3d0e0",
              background: i < filled ? "linear-gradient(135deg,#e8177e,#c01068)" : "white",
            }}
          >
            {i < filled && (
              <svg viewBox="0 0 24 24" fill="white" className="w-2.5 h-2.5">
                <path fillRule="evenodd" d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z" clipRule="evenodd" />
              </svg>
            )}
          </div>
        ))}
      </div>
      <p className="text-[10px] text-gray-500">
        <span className="font-semibold text-gray-700">{filled}/{total}</span>
        {" — "}{filled === 0 ? "No stamps yet" : `${total - filled} more for a free treatment`}
      </p>
    </div>
  );
}

function MemberCard({ member, onSave }: { member: Member; onSave: (id: string, stamps: number) => Promise<void> }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(member.loyalty_stamps);
  const [saving, setSaving] = useState(false);
  const name = [member.first_name, member.last_name].filter(Boolean).join(" ") || "—";
  const initials = (member.first_name?.[0] ?? member.email[0]).toUpperCase();

  async function handleSave() {
    setSaving(true);
    await onSave(member.id, draft);
    setSaving(false);
    setEditing(false);
  }

  return (
    <div className="bg-white rounded-2xl border border-pink-50 shadow-sm p-5">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold shrink-0"
          style={{ background: "linear-gradient(135deg,#e8177e,#c01068)" }}>
          {initials}
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-gray-900 text-sm truncate">{name}</p>
          <p className="text-xs text-gray-400 truncate">{member.email}</p>
        </div>
        <span className="text-xs text-gray-400">
          {new Date(member.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
        </span>
      </div>

      {/* Stamp card (what the client sees) */}
      <StampCard stamps={editing ? draft : member.loyalty_stamps} />

      {/* Edit controls */}
      <div className="mt-4">
        {editing ? (
          <div className="flex items-center gap-2">
            <button onClick={() => setDraft(Math.max(0, draft - 1))}
              className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:border-pink-400 hover:text-pink-600 transition-colors font-bold text-lg">
              −
            </button>
            <input
              type="number"
              min={0}
              value={draft}
              onChange={(e) => setDraft(Math.max(0, parseInt(e.target.value) || 0))}
              className="flex-1 border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-center focus:outline-none focus:border-pink-400"
            />
            <button onClick={() => setDraft(draft + 1)}
              className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:border-pink-400 hover:text-pink-600 transition-colors font-bold text-lg">
              +
            </button>
            <button onClick={handleSave} disabled={saving}
              className="px-4 py-1.5 rounded-lg text-white text-xs font-semibold disabled:opacity-60 transition-all"
              style={{ background: "linear-gradient(135deg,#e8177e,#c01068)" }}>
              {saving ? "Saving…" : "Save"}
            </button>
            <button onClick={() => { setEditing(false); setDraft(member.loyalty_stamps); }}
              className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs text-gray-500 hover:bg-gray-50">
              Cancel
            </button>
          </div>
        ) : (
          <button onClick={() => { setEditing(true); setDraft(member.loyalty_stamps); }}
            className="w-full py-2 rounded-lg border border-gray-200 text-xs font-medium text-gray-600 hover:border-pink-300 hover:text-pink-600 hover:bg-pink-50 transition-all">
            Edit Loyalty Points
          </button>
        )}
      </div>
    </div>
  );
}

function ClientsPanel() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", password: "" });
  const [formError, setFormError] = useState("");
  const [adding, setAdding] = useState(false);

  const fetchMembers = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/admin/members");
    const data = await res.json();
    setMembers(data.members ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchMembers(); }, [fetchMembers]);

  async function handleAddClient(e: React.FormEvent) {
    e.preventDefault();
    setFormError("");
    setAdding(true);
    const res = await fetch("/api/admin/members", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setAdding(false);
    if (!res.ok) { setFormError(data.error); return; }
    setForm({ firstName: "", lastName: "", email: "", password: "" });
    setShowAdd(false);
    await fetchMembers();
  }

  async function handleSave(id: string, stamps: number) {
    await fetch("/api/admin/members", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, stamps }),
    });
    setMembers((prev) => prev.map((m) => m.id === id ? { ...m, loyalty_stamps: stamps } : m));
  }

  const filtered = members.filter((m) => {
    const q = search.toLowerCase();
    return (
      m.email.toLowerCase().includes(q) ||
      (m.first_name ?? "").toLowerCase().includes(q) ||
      (m.last_name ?? "").toLowerCase().includes(q)
    );
  });

  return (
    <div className="flex-1 overflow-y-auto px-8 py-6 thin-scroll">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Polish Circle Members</h2>
          <p className="text-xs text-gray-400 mt-0.5">{members.length} registered members</p>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Search members…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100 w-48 bg-white"
          />
          <button onClick={() => { setShowAdd(!showAdd); setFormError(""); }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-semibold hover:-translate-y-0.5 hover:shadow-lg transition-all"
            style={{ background: "linear-gradient(135deg,#e8177e,#c01068)" }}>
            + Add Client
          </button>
        </div>
      </div>

      {/* Add client form */}
      {showAdd && (
        <form onSubmit={handleAddClient} className="bg-white rounded-2xl border border-pink-200 shadow-sm p-6 mb-6">
          <h3 className="font-semibold text-gray-900 mb-1 text-sm">Sign Up New Client</h3>
          <p className="text-xs text-gray-400 mb-4">Creates their account and adds them to the Polish Circle loyalty programme.</p>
          {formError && (
            <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{formError}</div>
          )}
          <div className="grid grid-cols-2 gap-3 mb-3">
            {[
              { label: "First Name", key: "firstName", type: "text" },
              { label: "Last Name", key: "lastName", type: "text" },
              { label: "Email", key: "email", type: "email" },
              { label: "Temporary Password", key: "password", type: "text" },
            ].map(({ label, key, type }) => (
              <div key={key}>
                <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-1">{label}</label>
                <input type={type} required minLength={key === "password" ? 8 : 1}
                  value={(form as Record<string, string>)[key]}
                  onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-pink-400" />
              </div>
            ))}
          </div>
          <p className="text-[11px] text-gray-400 mb-4">The client can use this password to log into their loyalty account on the website.</p>
          <div className="flex gap-2">
            <button type="submit" disabled={adding}
              className="px-5 py-2 rounded-lg text-white text-sm font-semibold disabled:opacity-60"
              style={{ background: "linear-gradient(135deg,#e8177e,#c01068)" }}>
              {adding ? "Creating…" : "Create Account"}
            </button>
            <button type="button" onClick={() => setShowAdd(false)}
              className="px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-500 hover:bg-gray-50">
              Cancel
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="w-6 h-6 rounded-full border-2 border-pink-300 border-t-pink-600 animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-48 text-gray-400">
          <p className="text-sm">{search ? "No members match your search." : "No members yet — add your first client above."}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-5">
          {filtered.map((m) => (
            <MemberCard key={m.id} member={m} onSave={handleSave} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function AdminDashboard() {
  const [activeNav, setActiveNav] = useState("Dashboard");

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "#f9f4fb", fontFamily: "inherit" }}>
      {/* ── SIDEBAR ── */}
      <aside className="w-60 shrink-0 flex flex-col border-r border-pink-100 h-full" style={{ background: "#1a1128" }}>
        {/* Logo */}
        <div className="px-6 py-5 border-b border-white/10 flex items-center gap-2">
          <span className="text-2xl">💅</span>
          <div>
            <div className="font-bold text-white text-sm leading-tight">Polished</div>
            <div className="text-white/40 text-xs">Nail Studio</div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) =>
            item.href ? (
              <Link key={item.label} href={item.href}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/50 hover:text-white/80 hover:bg-white/5 transition-all">
                <span className="text-base">{item.icon}</span>
                {item.label}
              </Link>
            ) : (
              <button key={item.label} onClick={() => setActiveNav(item.label)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  activeNav === item.label ? "text-white" : "text-white/50 hover:text-white/80 hover:bg-white/5"
                }`}
                style={activeNav === item.label ? { background: "linear-gradient(135deg,#e8177e22,#c0106822)" } : {}}>
                <span className="text-base">{item.icon}</span>
                {item.label}
                {activeNav === item.label && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full" style={{ background: "#e8177e" }} />
                )}
              </button>
            )
          )}
        </nav>

        {/* Avatar */}
        <div className="px-4 py-4 border-t border-white/10 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0"
            style={{ background: "linear-gradient(135deg,#e8177e,#c01068)" }}>
            A
          </div>
          <div>
            <div className="text-white text-xs font-medium">Admin</div>
            <div className="text-white/40 text-xs">hello@polishednails.co.uk</div>
          </div>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top bar */}
        <header className="bg-white border-b border-pink-100 px-8 py-4 flex items-center justify-between shrink-0">
          <div>
            <h1 className="text-lg font-bold text-gray-900">Good morning, Admin 👋</h1>
            <p className="text-gray-400 text-xs mt-0.5">Wednesday, 11 June 2026</p>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/"
              className="text-sm text-pink-600 font-medium hover:text-pink-700 border border-pink-200 px-4 py-1.5 rounded-full hover:bg-pink-50 transition-colors">
              ← View Live Site
            </Link>
            <button className="relative w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50">
              🔔
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-white text-[10px] font-bold flex items-center justify-center"
                style={{ background: "#e8177e" }}>
                2
              </span>
            </button>
          </div>
        </header>

        {/* Content — switches based on nav */}
        {activeNav === "Clients" ? (
          <ClientsPanel />
        ) : activeNav === "Appointments" ? (
          <AppointmentsPanel />
        ) : activeNav === "Services" ? (
          <ServicesPanel />
        ) : activeNav === "Reviews" ? (
          <ReviewsPanel />
        ) : activeNav === "Inbound Leads" ? (
          <LeadsPanel />
        ) : (
          <div className="flex-1 overflow-y-auto px-8 py-6 thin-scroll">
            {/* Metric cards */}
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
              {[
                { label: "Bookings Today", value: "9", delta: "↑ 2 from yesterday", icon: "📅", color: "#e8177e" },
                { label: "Monthly Revenue", value: "$3,820", delta: "↑ 15% vs last month", icon: "💰", color: "#7c3aed" },
                { label: "New Clients", value: "18", delta: "↑ 3 this week", icon: "👥", color: "#0ea5e9" },
                { label: "Avg. Rating", value: "4.9★", delta: "From 450+ reviews", icon: "⭐", color: "#f59e0b" },
              ].map((m) => (
                <div key={m.label} className="bg-white rounded-2xl p-5 border border-pink-50 shadow-sm">
                  <div className="flex items-start justify-between mb-3">
                    <div className="text-2xl">{m.icon}</div>
                    <div className="w-2 h-2 rounded-full mt-1" style={{ background: m.color }} />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">{m.value}</div>
                  <div className="text-xs text-gray-400 mb-1">{m.label}</div>
                  <div className="text-xs font-medium" style={{ color: m.color }}>{m.delta}</div>
                </div>
              ))}
            </div>

            {/* Appointments + Side panels */}
            <div className="grid xl:grid-cols-3 gap-6">
              <div className="xl:col-span-2 bg-white rounded-2xl border border-pink-50 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-pink-50 flex items-center justify-between">
                  <h2 className="font-bold text-gray-900">Today&apos;s Appointments</h2>
                  <span className="text-xs text-pink-600 bg-pink-50 px-3 py-1 rounded-full font-medium">
                    {appointments.length} total
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 border-b border-pink-50">
                        {["Time", "Client", "Service", "Technician", "Price", "Status"].map((h) => (
                          <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {appointments.map((apt, i) => (
                        <tr key={i} className="border-b border-pink-50/60 hover:bg-pink-50/30 transition-colors">
                          <td className="px-4 py-3 font-mono text-xs text-gray-500">{apt.time}</td>
                          <td className="px-4 py-3 font-medium text-gray-800">{apt.client}</td>
                          <td className="px-4 py-3 text-gray-600">{apt.service}</td>
                          <td className="px-4 py-3 text-gray-500 text-xs">{apt.tech}</td>
                          <td className="px-4 py-3 font-semibold text-gray-800">{apt.price}</td>
                          <td className="px-4 py-3">
                            <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyle[apt.status]}`}>
                              {apt.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-white rounded-2xl border border-pink-50 shadow-sm p-5">
                  <h2 className="font-bold text-gray-900 mb-4">Top Services This Month</h2>
                  <div className="space-y-3">
                    {topServices.map((s) => (
                      <div key={s.name}>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-gray-700 font-medium">{s.name}</span>
                          <span className="text-gray-400">{s.count} bookings</span>
                        </div>
                        <div className="h-2 rounded-full bg-pink-50 overflow-hidden">
                          <div className="h-full rounded-full transition-all"
                            style={{ width: `${s.pct}%`, background: "linear-gradient(90deg,#e8177e,#c01068)" }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-pink-50 shadow-sm p-5">
                  <h2 className="font-bold text-gray-900 mb-4">Recent Reviews</h2>
                  <div className="space-y-4">
                    {recentReviews.map((r, i) => (
                      <div key={i} className="border-b border-pink-50 pb-4 last:border-0 last:pb-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-gray-800 text-sm">{r.name}</span>
                          <div className="flex gap-0.5">
                            {Array.from({ length: r.stars }).map((_, j) => (
                              <span key={j} className="text-amber-400 text-xs">★</span>
                            ))}
                          </div>
                        </div>
                        <p className="text-gray-500 text-xs italic">&ldquo;{r.text}&rdquo;</p>
                        <span className="text-xs text-pink-600 mt-1 inline-block">{r.service}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
