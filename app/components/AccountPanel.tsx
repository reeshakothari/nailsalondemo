"use client";

import { useState, useEffect, useCallback } from "react";

const serif = { fontFamily: "var(--font-playfair, Georgia, serif)" };
const STAMPS_TOTAL = 10;

const benefits = [
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3V16.5m-6-9v.75m0 3v.75m0 3V16.5M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15A2.25 2.25 0 002.25 6.75v10.5A2.25 2.25 0 004.5 19.5z" /></svg>,
    title: "Polish Circle rewards",
    desc: "Earn 1 stamp per visit. At 10 stamps unlock a free treatment + $20 credit.",
  },
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    title: "Booking history & re-books",
    desc: "Every appointment saved. Rebook your favourite in seconds.",
  },
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" /></svg>,
    title: "Early access",
    desc: "New services, limited slots, and member-only promotions before anyone else.",
  },
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>,
    title: "Saved details",
    desc: "Faster booking every time. Always the right preferences on file.",
  },
];

interface User {
  contactId: string;
  firstName: string;
  lastName: string;
  email: string;
  stamps: number;
}

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function AccountPanel({ open, onClose }: Props) {
  const [tab, setTab] = useState<"signin" | "create">("signin");
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  /* Sign-in form state */
  const [siEmail, setSiEmail] = useState("");
  const [siPassword, setSiPassword] = useState("");

  /* Create account form state */
  const [caFirst, setCaFirst] = useState("");
  const [caLast, setCaLast] = useState("");
  const [caEmail, setCaEmail] = useState("");
  const [caPassword, setCaPassword] = useState("");

  const fetchUser = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/me");
      const data = await res.json();
      setUser(data.user ?? null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchUser(); }, [fetchUser]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: siEmail, password: siPassword }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error); return; }
      setUser({ contactId: "", ...data, stamps: 0 });
      await fetchUser();
    } finally {
      setSubmitting(false);
    }
  }

  async function handleCreateAccount(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName: caFirst, lastName: caLast, email: caEmail, password: caPassword }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error); return; }
      setUser({ contactId: "", ...data, stamps: 0 });
      await fetchUser();
    } finally {
      setSubmitting(false);
    }
  }

  async function handleSignOut() {
    await fetch("/api/auth/signout", { method: "POST" });
    setUser(null);
    setSiEmail(""); setSiPassword("");
  }

  const stamps = user?.stamps ?? 0;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 transition-opacity duration-500"
        style={{
          background: "rgba(10,4,20,0.45)",
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
          backdropFilter: "blur(2px)",
        }}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className="fixed top-0 right-0 bottom-0 z-50 flex flex-col bg-white shadow-2xl"
        style={{
          width: "min(680px, 100vw)",
          transform: open ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.45s cubic-bezier(0.22,1,0.36,1)",
        }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-700 transition-colors z-10"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="w-6 h-6 rounded-full border-2 border-pink-300 border-t-pink-600 animate-spin" />
          </div>
        ) : user ? (
          /* ── LOGGED IN VIEW ── */
          <LoggedInView user={user} stamps={stamps} onSignOut={handleSignOut} onClose={onClose} />
        ) : (
          /* ── AUTH FORMS ── */
          <div className="flex flex-1 overflow-hidden">
            {/* Left: form */}
            <div className="flex-1 flex flex-col px-10 py-10 overflow-y-auto thin-scroll">
              <h2 className="text-3xl font-semibold text-gray-900 mb-1" style={serif}>My Account</h2>
              <p className="text-xs font-medium text-gray-400 tracking-[0.2em] uppercase mb-8">
                Sign in or join the Polish Circle
              </p>

              {/* Tabs */}
              <div className="flex border-b border-gray-200 mb-8">
                {(["signin", "create"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => { setTab(t); setError(""); }}
                    className="pb-3 px-1 mr-8 text-sm font-medium tracking-widest uppercase transition-colors"
                    style={{
                      color: tab === t ? "#1a1128" : "#9ca3af",
                      borderBottom: tab === t ? "2px solid #e8177e" : "2px solid transparent",
                      marginBottom: -1,
                    }}
                  >
                    {t === "signin" ? "Sign In" : "Create Account"}
                  </button>
                ))}
              </div>

              {error && (
                <div className="mb-5 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                  {error}
                </div>
              )}

              {tab === "signin" ? (
                <form className="space-y-5" onSubmit={handleSignIn}>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 tracking-[0.15em] uppercase mb-2">Email</label>
                    <input type="email" required value={siEmail} onChange={(e) => setSiEmail(e.target.value)}
                      className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100 transition-all" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 tracking-[0.15em] uppercase mb-2">Password</label>
                    <input type="password" required value={siPassword} onChange={(e) => setSiPassword(e.target.value)}
                      className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100 transition-all" />
                  </div>
                  <PrimaryBtn loading={submitting}>Sign In</PrimaryBtn>
                  <div className="border-t border-gray-100 pt-5">
                    <button type="button" className="text-xs text-gray-400 hover:text-gray-700 tracking-widest uppercase transition-colors">
                      Forgot Password?
                    </button>
                  </div>
                  <div className="border-t border-gray-100 pt-5">
                    <p className="text-xs text-gray-400 uppercase tracking-widest mb-2">Just Browsing?</p>
                    <p className="text-sm text-gray-500 mb-3 leading-relaxed">
                      You can always book as a guest — your appointment is confirmed just the same.
                    </p>
                    <button type="button" onClick={onClose}
                      className="text-sm text-gray-700 underline underline-offset-4 hover:text-pink-600 transition-colors">
                      Continue without signing in
                    </button>
                  </div>
                </form>
              ) : (
                <form className="space-y-5" onSubmit={handleCreateAccount}>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 tracking-[0.15em] uppercase mb-2">First Name</label>
                      <input type="text" required value={caFirst} onChange={(e) => setCaFirst(e.target.value)}
                        className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100 transition-all" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 tracking-[0.15em] uppercase mb-2">Last Name</label>
                      <input type="text" required value={caLast} onChange={(e) => setCaLast(e.target.value)}
                        className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100 transition-all" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 tracking-[0.15em] uppercase mb-2">Email</label>
                    <input type="email" required value={caEmail} onChange={(e) => setCaEmail(e.target.value)}
                      className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100 transition-all" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 tracking-[0.15em] uppercase mb-2">Password</label>
                    <input type="password" required minLength={8} value={caPassword} onChange={(e) => setCaPassword(e.target.value)}
                      className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100 transition-all" />
                    <p className="text-xs text-gray-400 mt-1">At least 8 characters</p>
                  </div>
                  <PrimaryBtn loading={submitting}>Create Account &amp; Join</PrimaryBtn>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    By creating an account you agree to our{" "}
                    <span className="underline cursor-pointer hover:text-gray-600">Terms</span> and{" "}
                    <span className="underline cursor-pointer hover:text-gray-600">Privacy Policy</span>.
                  </p>
                </form>
              )}
            </div>

            {/* Right: benefits */}
            <BenefitsPanel stamps={0} isPreview />
          </div>
        )}
      </div>
    </>
  );
}

/* ── Logged-in dashboard ── */
function LoggedInView({ user, stamps, onSignOut, onClose }: { user: User; stamps: number; onSignOut: () => void; onClose: () => void }) {
  const remaining = STAMPS_TOTAL - (stamps % STAMPS_TOTAL);
  const cycles = Math.floor(stamps / STAMPS_TOTAL);

  return (
    <div className="flex flex-1 overflow-hidden">
      {/* Left: account info */}
      <div className="flex-1 flex flex-col px-10 py-10 overflow-y-auto thin-scroll">
        {/* Greeting */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold text-lg"
            style={{ background: "linear-gradient(135deg,#e8177e,#c01068)" }}>
            {user.firstName?.[0]?.toUpperCase() ?? "?"}
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-gray-900" style={serif}>
              Welcome back, {user.firstName}.
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">{user.email}</p>
          </div>
        </div>

        {/* Stamp card */}
        <div className="rounded-2xl p-6 mb-8 border border-pink-100"
          style={{ background: "linear-gradient(135deg,#fdf2f8,#fce7f3)" }}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-[10px] font-semibold text-pink-500 tracking-[0.2em] uppercase">Polish Circle</p>
              <p className="text-lg font-semibold text-gray-900 mt-0.5" style={serif}>Loyalty Stamps</p>
            </div>
            {cycles > 0 && (
              <div className="text-right">
                <p className="text-[10px] text-gray-400">Rewards earned</p>
                <p className="text-xl font-bold text-pink-600">{cycles}</p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-5 gap-2.5 mb-4">
            {Array.from({ length: STAMPS_TOTAL }).map((_, i) => {
              const filled = i < (stamps % STAMPS_TOTAL);
              return (
                <div key={i}
                  className="aspect-square rounded-full border-2 flex items-center justify-center transition-all"
                  style={{
                    borderColor: filled ? "#e8177e" : "#f3d0e0",
                    background: filled ? "linear-gradient(135deg,#e8177e,#c01068)" : "white",
                  }}
                >
                  {filled && (
                    <svg viewBox="0 0 24 24" fill="white" className="w-3 h-3">
                      <path fillRule="evenodd" d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              );
            })}
          </div>

          <p className="text-xs text-gray-500">
            <span className="font-semibold text-gray-800">{stamps % STAMPS_TOTAL}/{STAMPS_TOTAL}</span>
            {" — "}{remaining === STAMPS_TOTAL ? "Start visiting to earn stamps!" : `${remaining} more visit${remaining !== 1 ? "s" : ""} for a free treatment`}
          </p>
        </div>

        {/* Quick links */}
        <div className="space-y-3 mb-8">
          <a href="#booking" onClick={onClose}
            className="flex items-center justify-between w-full px-5 py-4 rounded-xl border border-gray-100 hover:border-pink-200 hover:bg-pink-50 transition-all group">
            <span className="text-sm font-medium text-gray-700">Book an appointment</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4 text-gray-400 group-hover:text-pink-500 transition-colors">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </a>
          <a href="#services" onClick={onClose}
            className="flex items-center justify-between w-full px-5 py-4 rounded-xl border border-gray-100 hover:border-pink-200 hover:bg-pink-50 transition-all group">
            <span className="text-sm font-medium text-gray-700">Browse services</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4 text-gray-400 group-hover:text-pink-500 transition-colors">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </a>
        </div>

        {/* Sign out */}
        <div className="border-t border-gray-100 pt-6">
          <button onClick={onSignOut}
            className="text-sm text-gray-400 hover:text-red-500 tracking-widest uppercase transition-colors">
            Sign Out
          </button>
        </div>
      </div>

      {/* Right: benefits */}
      <BenefitsPanel stamps={stamps} isPreview={false} />
    </div>
  );
}

/* ── Shared right panel ── */
function BenefitsPanel({ stamps, isPreview }: { stamps: number; isPreview: boolean }) {
  return (
    <div className="w-64 shrink-0 flex flex-col px-7 py-10 overflow-y-auto thin-scroll" style={{ background: "#fdf6fa" }}>
      <p className="text-[10px] font-semibold text-pink-500 tracking-[0.25em] uppercase mb-3">
        {isPreview ? "Why Create an Account" : "Your Benefits"}
      </p>
      <h3 className="text-xl font-semibold text-gray-900 mb-2 leading-snug" style={serif}>
        The{" "}<span className="italic" style={{ color: "#e8177e" }}>Polish Circle.</span>
      </h3>
      <p className="text-xs text-gray-400 leading-relaxed mb-7">
        {isPreview ? "Free to join. Quietly rewarding." : `${stamps} stamp${stamps !== 1 ? "s" : ""} earned so far.`}
      </p>

      {/* Stamp preview (always shown) */}
      {isPreview && (
        <div className="bg-white rounded-2xl p-4 border border-pink-100 shadow-sm mb-7">
          <p className="text-[10px] font-semibold text-gray-400 tracking-[0.15em] uppercase mb-3">Preview</p>
          <div className="grid grid-cols-5 gap-2 mb-3">
            {Array.from({ length: STAMPS_TOTAL }).map((_, i) => (
              <div key={i}
                className="aspect-square rounded-full border-2"
                style={{ borderColor: "#f3d0e0", background: "white" }}
              />
            ))}
          </div>
          <p className="text-[10px] text-gray-400">10 visits = 1 free treatment</p>
        </div>
      )}

      <div className="space-y-5">
        {benefits.map((b, i) => (
          <div key={i} className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-pink-500" style={{ background: "#fce7f3" }}>
              {b.icon}
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-800 mb-0.5">{b.title}</p>
              <p className="text-xs text-gray-400 leading-relaxed">{b.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Shared primary button ── */
function PrimaryBtn({ children, loading }: { children: React.ReactNode; loading: boolean }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="w-full py-3.5 rounded-lg text-white text-xs font-semibold tracking-[0.2em] uppercase transition-all hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0"
      style={{ background: "linear-gradient(135deg,#e8177e,#c01068)", boxShadow: "0 4px 16px rgba(232,23,126,0.3)" }}
    >
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          <span className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
          Please wait…
        </span>
      ) : children}
    </button>
  );
}
