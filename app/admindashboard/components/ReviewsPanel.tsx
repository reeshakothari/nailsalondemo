"use client";

import { useState } from "react";

const INITIAL_REVIEWS = [
  { id: 1, name: "Sophia R.", service: "Gel Manicure", rating: 5, text: "Absolutely loved my gel nails! Will definitely be back. Kezia is so talented.", date: "2026-06-10", replied: false, featured: true },
  { id: 2, name: "Priya M.", service: "Acrylic Nails", rating: 5, text: "Amazing acrylic set — lasted 4 weeks without lifting! Best nail salon in London.", date: "2026-06-09", replied: true, featured: false },
  { id: 3, name: "Emma T.", service: "Luxury Pedicure", rating: 5, text: "The luxury pedicure was heavenly. Best in London! I left feeling like a queen.", date: "2026-06-08", replied: false, featured: true },
  { id: 4, name: "Hannah L.", service: "Chrome Nail Art", rating: 5, text: "My chrome nails got so many compliments. The attention to detail is incredible.", date: "2026-06-07", replied: true, featured: false },
  { id: 5, name: "Aisha K.", service: "Classic Manicure", rating: 4, text: "Really lovely experience overall. The massage was divine. Will come back for gel next time.", date: "2026-06-06", replied: false, featured: false },
  { id: 6, name: "Ruby S.", service: "Nail Extensions", rating: 5, text: "Sarah did an incredible job on my extensions. So natural-looking and long-lasting!", date: "2026-06-05", replied: false, featured: false },
  { id: 7, name: "Lily W.", service: "Gel Pedicure", rating: 4, text: "Great pedicure, lovely staff. The salon is so clean and beautifully decorated.", date: "2026-06-04", replied: true, featured: false },
  { id: 8, name: "Zoe P.", service: "Nail Art & Design", rating: 5, text: "Kezia is an absolute artist. My floral nail art was beyond what I imagined!", date: "2026-06-03", replied: false, featured: false },
  { id: 9, name: "Mia C.", service: "Acrylic Infill", rating: 3, text: "Infill was fine but had to wait 15 minutes past my appointment time. Good result though.", date: "2026-06-02", replied: false, featured: false },
  { id: 10, name: "Sofia B.", service: "Classic Manicure", rating: 5, text: "First time here and won't be the last. So friendly and professional. Immaculate finish.", date: "2026-06-01", replied: true, featured: false },
];

function StarRow({ rating, max = 5, size = "sm" }: { rating: number; max?: number; size?: "sm" | "lg" }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <span key={i} className={`${size === "lg" ? "text-base" : "text-xs"} ${i < rating ? "text-amber-400" : "text-gray-200"}`}>★</span>
      ))}
    </div>
  );
}

export default function ReviewsPanel() {
  const [reviews, setReviews] = useState(INITIAL_REVIEWS);
  const [filter, setFilter] = useState(0);

  const avg = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
  const breakdown = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
    pct: Math.round((reviews.filter((r) => r.rating === star).length / reviews.length) * 100),
  }));

  const filtered = filter === 0 ? reviews : reviews.filter((r) => r.rating === filter);

  function toggleReply(id: number) {
    setReviews((prev) => prev.map((r) => r.id === id ? { ...r, replied: !r.replied } : r));
  }

  function toggleFeatured(id: number) {
    setReviews((prev) => prev.map((r) => r.id === id ? { ...r, featured: !r.featured } : r));
  }

  return (
    <div className="flex-1 overflow-y-auto px-8 py-6 thin-scroll">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-lg font-bold text-gray-900">Reviews</h2>
        <p className="text-xs text-gray-400 mt-0.5">{reviews.length} total reviews</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 mb-6">
        {/* Big rating */}
        <div className="bg-white rounded-2xl border border-pink-50 shadow-sm p-6 flex items-center gap-5">
          <div>
            <p className="text-5xl font-bold text-gray-900">{avg.toFixed(1)}</p>
            <StarRow rating={Math.round(avg)} size="lg" />
            <p className="text-xs text-gray-400 mt-1">{reviews.length} reviews</p>
          </div>
          <div className="flex-1 space-y-1.5">
            {breakdown.map(({ star, count, pct }) => (
              <button key={star} onClick={() => setFilter(filter === star ? 0 : star)}
                className={`flex items-center gap-2 w-full text-left group ${filter === star ? "opacity-100" : "opacity-70 hover:opacity-100"} transition-opacity`}>
                <span className="text-xs text-gray-500 w-3">{star}</span>
                <span className="text-amber-400 text-xs">★</span>
                <div className="flex-1 h-2 rounded-full bg-gray-100 overflow-hidden">
                  <div className="h-full rounded-full transition-all"
                    style={{ width: `${pct}%`, background: filter === star ? "#e8177e" : "#f59e0b" }} />
                </div>
                <span className="text-[10px] text-gray-400 w-4">{count}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Quick stats */}
        <div className="xl:col-span-2 grid grid-cols-3 gap-4">
          {[
            { label: "5-Star Reviews", value: `${breakdown[0].count}`, sub: `${breakdown[0].pct}% of total`, color: "#f59e0b" },
            { label: "Awaiting Reply", value: `${reviews.filter((r) => !r.replied).length}`, sub: "need response", color: "#e8177e" },
            { label: "Featured", value: `${reviews.filter((r) => r.featured).length}`, sub: "shown on website", color: "#7c3aed" },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-2xl border border-pink-50 shadow-sm p-5">
              <div className="w-2 h-2 rounded-full mb-3" style={{ background: s.color }} />
              <p className="text-3xl font-bold text-gray-900 mb-1">{s.value}</p>
              <p className="text-xs font-medium text-gray-500">{s.label}</p>
              <p className="text-[10px] text-gray-400">{s.sub}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Filter label */}
      {filter > 0 && (
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs text-gray-500">Showing {filter}-star reviews</span>
          <button onClick={() => setFilter(0)} className="text-xs text-pink-500 hover:underline">Clear</button>
        </div>
      )}

      {/* Review cards */}
      <div className="space-y-3">
        {filtered.map((r) => (
          <div key={r.id} className={`bg-white rounded-2xl border shadow-sm p-5 transition-all ${r.featured ? "border-pink-200" : "border-pink-50"}`}>
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                  style={{ background: "linear-gradient(135deg,#e8177e,#c01068)" }}>
                  {r.name[0]}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-gray-900 text-sm">{r.name}</p>
                    {r.featured && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full text-pink-600 bg-pink-50">Featured</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400">{r.service} · {new Date(r.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</p>
                </div>
              </div>
              <StarRow rating={r.rating} />
            </div>

            <p className="text-sm text-gray-600 leading-relaxed mb-3 italic">&ldquo;{r.text}&rdquo;</p>

            {r.replied && (
              <div className="bg-pink-50 border border-pink-100 rounded-xl px-4 py-2 mb-3">
                <p className="text-xs text-gray-500"><span className="font-semibold text-pink-600">Polished Studio:</span> Thank you so much for your kind words! We look forward to seeing you again soon. 💅</p>
              </div>
            )}

            <div className="flex gap-2 pt-1">
              <button onClick={() => toggleReply(r.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${r.replied ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "border-gray-200 text-gray-500 hover:border-pink-300 hover:text-pink-600"}`}>
                {r.replied ? "✓ Replied" : "Reply"}
              </button>
              <button onClick={() => toggleFeatured(r.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${r.featured ? "bg-pink-50 border-pink-200 text-pink-600" : "border-gray-200 text-gray-500 hover:border-pink-300 hover:text-pink-600"}`}>
                {r.featured ? "★ Featured" : "Feature"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
