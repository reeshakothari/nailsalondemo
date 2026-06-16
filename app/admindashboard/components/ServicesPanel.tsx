"use client";

import { useState } from "react";

const CATEGORIES = ["All", "Classic", "Gel", "Acrylic", "Pedicure", "Nail Art", "Extensions"];

const INITIAL_SERVICES = [
  { id: 1, name: "Classic Manicure", category: "Classic", price: 22, duration: 45, description: "Shape, cuticle care, hand massage & polish", available: true },
  { id: 2, name: "Classic Pedicure", category: "Pedicure", price: 28, duration: 60, description: "Soak, scrub, shape, cuticle care & polish", available: true },
  { id: 3, name: "Gel Manicure", category: "Gel", price: 30, duration: 60, description: "Long-lasting gel polish with no chip formula", available: true },
  { id: 4, name: "Gel Pedicure", category: "Pedicure", price: 38, duration: 75, description: "Full pedicure with gel polish finish", available: true },
  { id: 5, name: "Acrylic Full Set", category: "Acrylic", price: 55, duration: 90, description: "Full set of acrylic nail extensions", available: true },
  { id: 6, name: "Acrylic Infill", category: "Acrylic", price: 35, duration: 60, description: "Infill for existing acrylic nails", available: true },
  { id: 7, name: "Nail Art & Design", category: "Nail Art", price: 45, duration: 75, description: "Custom nail art, patterns and embellishments", available: true },
  { id: 8, name: "Chrome Nail Art", category: "Nail Art", price: 65, duration: 90, description: "Mirror chrome powder with gel base — stunning finish", available: true },
  { id: 9, name: "Nail Extensions", category: "Extensions", price: 58, duration: 90, description: "Soft gel tip extensions, shaped & polished", available: true },
  { id: 10, name: "Luxury Pedicure", category: "Pedicure", price: 52, duration: 90, description: "Premium pedicure with mask, hot towels & paraffin wax", available: true },
  { id: 11, name: "Nail Removal", category: "Classic", price: 15, duration: 30, description: "Safe removal of gel, acrylic or extensions", available: true },
  { id: 12, name: "Nail Repair", category: "Classic", price: 8, duration: 15, description: "Per nail repair for broken or lifted nails", available: true },
];

const categoryColour: Record<string, string> = {
  Classic: "bg-gray-100 text-gray-600",
  Gel: "bg-purple-50 text-purple-600",
  Acrylic: "bg-blue-50 text-blue-600",
  Pedicure: "bg-emerald-50 text-emerald-600",
  "Nail Art": "bg-pink-50 text-pink-600",
  Extensions: "bg-amber-50 text-amber-700",
};

interface Service {
  id: number; name: string; category: string; price: number;
  duration: number; description: string; available: boolean;
}

function ServiceCard({ svc, onChange, onDelete }: {
  svc: Service;
  onChange: (id: number, field: keyof Service, value: unknown) => void;
  onDelete: (id: number) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState({ name: svc.name, price: svc.price, duration: svc.duration, description: svc.description });

  function save() {
    onChange(svc.id, "name", draft.name);
    onChange(svc.id, "price", draft.price);
    onChange(svc.id, "duration", draft.duration);
    onChange(svc.id, "description", draft.description);
    setEditing(false);
  }

  return (
    <div className={`bg-white rounded-2xl border shadow-sm p-5 transition-all ${svc.available ? "border-pink-50" : "border-gray-100 opacity-60"}`}>
      <div className="flex items-start justify-between mb-3">
        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${categoryColour[svc.category] ?? "bg-gray-100 text-gray-600"}`}>
          {svc.category}
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onChange(svc.id, "available", !svc.available)}
            className={`relative w-9 h-5 rounded-full transition-colors ${svc.available ? "" : "bg-gray-200"}`}
            style={svc.available ? { background: "linear-gradient(135deg,#e8177e,#c01068)" } : {}}
          >
            <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${svc.available ? "translate-x-4" : "translate-x-0.5"}`} />
          </button>
          <button onClick={() => setEditing(!editing)} className="text-gray-300 hover:text-pink-500 transition-colors text-sm">✏️</button>
          <button onClick={() => onDelete(svc.id)} className="text-gray-300 hover:text-red-400 transition-colors text-xs">✕</button>
        </div>
      </div>

      {editing ? (
        <div className="space-y-2">
          <input value={draft.name} onChange={(e) => setDraft((p) => ({ ...p, name: e.target.value }))}
            className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm font-semibold focus:outline-none focus:border-pink-400" />
          <textarea value={draft.description} onChange={(e) => setDraft((p) => ({ ...p, description: e.target.value }))}
            rows={2} className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-gray-500 focus:outline-none focus:border-pink-400 resize-none" />
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="text-[10px] text-gray-400 uppercase tracking-wider">Price ($)</label>
              <input type="number" value={draft.price} onChange={(e) => setDraft((p) => ({ ...p, price: parseInt(e.target.value) || 0 }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-pink-400" />
            </div>
            <div className="flex-1">
              <label className="text-[10px] text-gray-400 uppercase tracking-wider">Duration (min)</label>
              <input type="number" value={draft.duration} onChange={(e) => setDraft((p) => ({ ...p, duration: parseInt(e.target.value) || 0 }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-pink-400" />
            </div>
          </div>
          <div className="flex gap-2 pt-1">
            <button onClick={save} className="px-4 py-1.5 rounded-lg text-white text-xs font-semibold"
              style={{ background: "linear-gradient(135deg,#e8177e,#c01068)" }}>Save</button>
            <button onClick={() => setEditing(false)} className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs text-gray-500">Cancel</button>
          </div>
        </div>
      ) : (
        <>
          <h3 className="font-semibold text-gray-900 text-sm mb-1">{svc.name}</h3>
          <p className="text-xs text-gray-400 mb-3 leading-relaxed">{svc.description}</p>
          <div className="flex items-center justify-between">
            <span className="text-xl font-bold text-gray-900">${svc.price}</span>
            <span className="text-xs text-gray-400 bg-gray-50 border border-gray-100 px-2 py-1 rounded-lg">⏱ {svc.duration} min</span>
          </div>
        </>
      )}
    </div>
  );
}

export default function ServicesPanel() {
  const [services, setServices] = useState<Service[]>(INITIAL_SERVICES);
  const [category, setCategory] = useState("All");
  const [showAdd, setShowAdd] = useState(false);
  const [newSvc, setNewSvc] = useState({ name: "", category: "Classic", price: "", duration: "", description: "" });

  function onChange(id: number, field: keyof Service, value: unknown) {
    setServices((prev) => prev.map((s) => s.id === id ? { ...s, [field]: value } : s));
  }

  function onDelete(id: number) {
    setServices((prev) => prev.filter((s) => s.id !== id));
  }

  function addService() {
    if (!newSvc.name || !newSvc.price) return;
    setServices((prev) => [...prev, {
      id: Date.now(), name: newSvc.name, category: newSvc.category,
      price: parseInt(newSvc.price) || 0, duration: parseInt(newSvc.duration) || 0,
      description: newSvc.description, available: true,
    }]);
    setNewSvc({ name: "", category: "Classic", price: "", duration: "", description: "" });
    setShowAdd(false);
  }

  const filtered = services.filter((s) => category === "All" || s.category === category);

  return (
    <div className="flex-1 overflow-y-auto px-8 py-6 thin-scroll">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Services Menu</h2>
          <p className="text-xs text-gray-400 mt-0.5">{services.filter((s) => s.available).length} active · {services.filter((s) => !s.available).length} hidden</p>
        </div>
        <button onClick={() => setShowAdd(!showAdd)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-semibold hover:-translate-y-0.5 hover:shadow-lg transition-all"
          style={{ background: "linear-gradient(135deg,#e8177e,#c01068)" }}>
          + Add Service
        </button>
      </div>

      {/* Add form */}
      {showAdd && (
        <div className="bg-white rounded-2xl border border-pink-200 shadow-sm p-5 mb-5">
          <h3 className="font-semibold text-gray-900 mb-4 text-sm">New Service</h3>
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 mb-3">
            <div className="xl:col-span-2">
              <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-1">Service Name</label>
              <input value={newSvc.name} onChange={(e) => setNewSvc((p) => ({ ...p, name: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-pink-400" />
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-1">Category</label>
              <select value={newSvc.category} onChange={(e) => setNewSvc((p) => ({ ...p, category: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-pink-400">
                {CATEGORIES.filter((c) => c !== "All").map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-1">Price ($)</label>
              <input type="number" value={newSvc.price} onChange={(e) => setNewSvc((p) => ({ ...p, price: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-pink-400" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div>
              <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-1">Duration (min)</label>
              <input type="number" value={newSvc.duration} onChange={(e) => setNewSvc((p) => ({ ...p, duration: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-pink-400" />
            </div>
            <div className="col-span-2">
              <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-1">Description</label>
              <input value={newSvc.description} onChange={(e) => setNewSvc((p) => ({ ...p, description: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-pink-400" />
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={addService} className="px-5 py-2 rounded-lg text-white text-sm font-semibold"
              style={{ background: "linear-gradient(135deg,#e8177e,#c01068)" }}>Add Service</button>
            <button onClick={() => setShowAdd(false)} className="px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-500 hover:bg-gray-50">Cancel</button>
          </div>
        </div>
      )}

      {/* Category tabs */}
      <div className="flex gap-2 mb-5 flex-wrap">
        {CATEGORIES.map((c) => (
          <button key={c} onClick={() => setCategory(c)}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors border ${category === c ? "text-white border-transparent" : "bg-white text-gray-500 border-gray-200 hover:border-pink-300 hover:text-pink-600"}`}
            style={category === c ? { background: "linear-gradient(135deg,#e8177e,#c01068)" } : {}}>
            {c} {c !== "All" && `(${services.filter((s) => s.category === c).length})`}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-4">
        {filtered.map((s) => (
          <ServiceCard key={s.id} svc={s} onChange={onChange} onDelete={onDelete} />
        ))}
      </div>
    </div>
  );
}
