"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import WebsiteView from "../../components/WebsiteView";
import { defaultContent, type SiteContent } from "../../lib/content";

const SECTIONS = [
  { id: "nav", label: "Navigation", icon: "🧭" },
  { id: "hero", label: "Hero", icon: "🌟" },
  { id: "services", label: "Services", icon: "💅" },
  { id: "about", label: "About", icon: "ℹ️" },
  { id: "gallery", label: "Gallery", icon: "🖼️" },
  { id: "testimonials", label: "Reviews", icon: "⭐" },
  { id: "contact", label: "Contact", icon: "📞" },
  { id: "footer", label: "Footer", icon: "📋" },
];

export default function EditPage() {
  const [content, setContent] = useState<SiteContent>(defaultContent);
  const [activeSection, setActiveSection] = useState<string>("hero");
  const [saved, setSaved] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("nail-salon-content");
      if (stored) setContent(JSON.parse(stored));
    } catch {}
  }, []);

  const handleSave = () => {
    localStorage.setItem("nail-salon-content", JSON.stringify(content));
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleReset = () => {
    if (confirm("Reset all content to defaults?")) {
      setContent(defaultContent);
      localStorage.removeItem("nail-salon-content");
    }
  };

  const handleSectionClick = useCallback((id: string) => {
    setActiveSection(id);
    const container = previewRef.current;
    if (!container) return;
    const mappedId = id === "testimonials" ? "reviews" : id === "contact" ? "booking" : id;
    const el = container.querySelector<HTMLElement>(`#${mappedId},[data-section="${id}"]`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const set = <K extends keyof SiteContent>(key: K, val: SiteContent[K]) =>
    setContent((c) => ({ ...c, [key]: val }));

  return (
    <div className="flex flex-col h-screen overflow-hidden" style={{ fontFamily: "inherit", background: "#f9f4fb" }}>
      {/* ── TOP BAR ── */}
      <header
        className="shrink-0 flex items-center gap-4 px-5 py-3 border-b border-pink-100 bg-white"
        style={{ minHeight: 56 }}
      >
        <Link
          href="/admindashboard"
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors font-medium"
        >
          ← Dashboard
        </Link>
        <div className="h-4 w-px bg-gray-200" />
        <div className="flex items-center gap-2">
          <span className="text-lg">💅</span>
          <span className="font-bold text-gray-900 text-sm">Polished Nail Studio</span>
          <span className="text-gray-300 text-sm">—</span>
          <span className="text-gray-500 text-sm">Website Editor</span>
        </div>
        <div className="ml-auto flex items-center gap-3">
          <button
            onClick={handleReset}
            className="text-xs text-gray-400 hover:text-gray-600 transition-colors px-3 py-1.5 rounded-lg hover:bg-gray-100"
          >
            Reset to Defaults
          </button>
          <Link
            href="/"
            target="_blank"
            className="text-xs text-pink-600 border border-pink-200 px-3 py-1.5 rounded-lg hover:bg-pink-50 transition-colors font-medium"
          >
            View Live Site ↗
          </Link>
          <button
            onClick={handleSave}
            className="text-sm font-semibold text-white px-5 py-2 rounded-lg transition-all"
            style={{
              background: saved
                ? "linear-gradient(135deg,#10b981,#059669)"
                : "linear-gradient(135deg,#e8177e,#c01068)",
              boxShadow: saved ? "0 4px 14px rgba(16,185,129,0.3)" : "0 4px 14px rgba(232,23,126,0.3)",
            }}
          >
            {saved ? "✓ Saved!" : "Save Changes"}
          </button>
        </div>
      </header>

      {/* ── BODY: EDIT PANEL + PREVIEW ── */}
      <div className="flex flex-1 overflow-hidden">
        {/* ── LEFT: EDIT PANEL ── */}
        <aside className="w-96 shrink-0 bg-white border-r border-pink-100 flex flex-col h-full overflow-hidden">
          {/* Section tabs */}
          <div className="border-b border-pink-100 px-2 py-2 flex gap-1 overflow-x-auto shrink-0 thin-scroll">
            {SECTIONS.map((s) => (
              <button
                key={s.id}
                onClick={() => handleSectionClick(s.id)}
                className="shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap"
                style={
                  activeSection === s.id
                    ? { background: "linear-gradient(135deg,#fce7f3,#fdf2f8)", color: "#e8177e", border: "1px solid #f9a8d4" }
                    : { color: "#9ca3af", border: "1px solid transparent" }
                }
              >
                <span>{s.icon}</span>
                {s.label}
              </button>
            ))}
          </div>

          {/* Form area */}
          <div className="flex-1 overflow-y-auto px-5 py-5 thin-scroll">
            <EditForm content={content} section={activeSection} onChange={setContent} />
          </div>
        </aside>

        {/* ── RIGHT: WEBSITE PREVIEW ── */}
        <div
          ref={previewRef}
          className="flex-1 overflow-y-auto thin-scroll"
          style={{ background: "#f3e8ee" }}
        >
          {/* Preview label */}
          <div className="sticky top-0 z-50 flex items-center gap-2 px-4 py-2 text-xs font-medium text-pink-600 bg-pink-50/80 backdrop-blur-sm border-b border-pink-100">
            <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse" />
            Live Preview — click any section to edit it
          </div>

          <div className="bg-white shadow-sm">
            <WebsiteView
              content={content}
              editMode
              activeSection={activeSection}
              onSectionClick={handleSectionClick}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── EDIT FORM ── */
function EditForm({
  content,
  section,
  onChange,
}: {
  content: SiteContent;
  section: string;
  onChange: (c: SiteContent) => void;
}) {
  const upd = <K extends keyof SiteContent>(key: K, val: SiteContent[K]) =>
    onChange({ ...content, [key]: val });

  const inputCls =
    "w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100 text-gray-800 placeholder-gray-400 bg-white transition-all";
  const textareaCls =
    "w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100 text-gray-800 placeholder-gray-400 bg-white resize-none transition-all";
  const labelCls = "block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5";
  const fieldCls = "mb-4";
  const sectionHeader = (title: string, desc?: string) => (
    <div className="mb-5">
      <h2 className="text-base font-bold text-gray-900">{title}</h2>
      {desc && <p className="text-xs text-gray-400 mt-0.5">{desc}</p>}
    </div>
  );

  if (section === "nav") return (
    <div>
      {sectionHeader("Navigation", "Logo and header bar")}
      <div className={fieldCls}>
        <label className={labelCls}>Salon Name</label>
        <input
          className={inputCls}
          value={content.salon.name}
          onChange={(e) => upd("salon", { ...content.salon, name: e.target.value })}
        />
      </div>
      <div className={fieldCls}>
        <label className={labelCls}>Tagline</label>
        <input
          className={inputCls}
          value={content.salon.tagline}
          onChange={(e) => upd("salon", { ...content.salon, tagline: e.target.value })}
        />
      </div>
    </div>
  );

  if (section === "hero") return (
    <div>
      {sectionHeader("Hero Section", "The first thing visitors see")}
      <div className={fieldCls}>
        <label className={labelCls}>Badge Text</label>
        <input className={inputCls} value={content.hero.badge}
          onChange={(e) => upd("hero", { ...content.hero, badge: e.target.value })} />
      </div>
      <div className={fieldCls}>
        <label className={labelCls}>Headline</label>
        <input className={inputCls} value={content.hero.headline}
          onChange={(e) => upd("hero", { ...content.hero, headline: e.target.value })} />
      </div>
      <div className={fieldCls}>
        <label className={labelCls}>Subheadline</label>
        <textarea className={textareaCls} rows={3} value={content.hero.subheadline}
          onChange={(e) => upd("hero", { ...content.hero, subheadline: e.target.value })} />
      </div>
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div>
          <label className={labelCls}>Primary Button</label>
          <input className={inputCls} value={content.hero.cta1}
            onChange={(e) => upd("hero", { ...content.hero, cta1: e.target.value })} />
        </div>
        <div>
          <label className={labelCls}>Secondary Button</label>
          <input className={inputCls} value={content.hero.cta2}
            onChange={(e) => upd("hero", { ...content.hero, cta2: e.target.value })} />
        </div>
      </div>
      <div className="border-t border-pink-50 pt-4 mt-4">
        <label className={labelCls}>Stats (4 items)</label>
        <div className="space-y-2">
          {content.hero.stats.map((s, i) => (
            <div key={i} className="flex gap-2">
              <input
                className={inputCls + " w-20"}
                placeholder="Value"
                value={s.value}
                onChange={(e) => {
                  const stats = [...content.hero.stats];
                  stats[i] = { ...stats[i], value: e.target.value };
                  upd("hero", { ...content.hero, stats });
                }}
              />
              <input
                className={inputCls + " flex-1"}
                placeholder="Label"
                value={s.label}
                onChange={(e) => {
                  const stats = [...content.hero.stats];
                  stats[i] = { ...stats[i], label: e.target.value };
                  upd("hero", { ...content.hero, stats });
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  if (section === "services") return (
    <div>
      {sectionHeader("Services", "The 6 service cards")}
      <div className={fieldCls}>
        <label className={labelCls}>Section Title</label>
        <input className={inputCls} value={content.services.title}
          onChange={(e) => upd("services", { ...content.services, title: e.target.value })} />
      </div>
      <div className={fieldCls}>
        <label className={labelCls}>Subtitle / tagline</label>
        <input className={inputCls} value={content.services.subtitle}
          onChange={(e) => upd("services", { ...content.services, subtitle: e.target.value })} />
      </div>
      <div className="border-t border-pink-50 pt-4 mt-2 space-y-4">
        {content.services.items.map((svc, i) => (
          <div key={i} className="bg-pink-50/40 rounded-2xl p-4 border border-pink-100">
            <p className="text-xs font-bold text-pink-600 mb-3">Service {i + 1}</p>
            <div className="flex gap-2 mb-2">
              <input
                className={inputCls + " w-16 text-center text-lg"}
                value={svc.icon}
                onChange={(e) => {
                  const items = [...content.services.items];
                  items[i] = { ...items[i], icon: e.target.value };
                  upd("services", { ...content.services, items });
                }}
              />
              <input
                className={inputCls + " flex-1"}
                placeholder="Service name"
                value={svc.title}
                onChange={(e) => {
                  const items = [...content.services.items];
                  items[i] = { ...items[i], title: e.target.value };
                  upd("services", { ...content.services, items });
                }}
              />
            </div>
            <textarea
              className={textareaCls}
              rows={2}
              placeholder="Description"
              value={svc.description}
              onChange={(e) => {
                const items = [...content.services.items];
                items[i] = { ...items[i], description: e.target.value };
                upd("services", { ...content.services, items });
              }}
            />
            <div className="flex gap-2 mt-2">
              <input
                className={inputCls}
                placeholder="Price"
                value={svc.price}
                onChange={(e) => {
                  const items = [...content.services.items];
                  items[i] = { ...items[i], price: e.target.value };
                  upd("services", { ...content.services, items });
                }}
              />
              <input
                className={inputCls}
                placeholder="Duration"
                value={svc.duration}
                onChange={(e) => {
                  const items = [...content.services.items];
                  items[i] = { ...items[i], duration: e.target.value };
                  upd("services", { ...content.services, items });
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  if (section === "about") return (
    <div>
      {sectionHeader("About Section", "Your studio story")}
      <div className={fieldCls}>
        <label className={labelCls}>Badge</label>
        <input className={inputCls} value={content.about.badge}
          onChange={(e) => upd("about", { ...content.about, badge: e.target.value })} />
      </div>
      <div className={fieldCls}>
        <label className={labelCls}>Title</label>
        <input className={inputCls} value={content.about.title}
          onChange={(e) => upd("about", { ...content.about, title: e.target.value })} />
      </div>
      <div className={fieldCls}>
        <label className={labelCls}>Story (use blank line for paragraph break)</label>
        <textarea className={textareaCls} rows={6} value={content.about.body}
          onChange={(e) => upd("about", { ...content.about, body: e.target.value })} />
      </div>
      <div className="border-t border-pink-50 pt-4 mt-2">
        <label className={labelCls}>Stats (4 boxes)</label>
        <div className="space-y-2">
          {content.about.stats.map((s, i) => (
            <div key={i} className="flex gap-2">
              <input
                className={inputCls + " w-24"}
                placeholder="Value"
                value={s.value}
                onChange={(e) => {
                  const stats = [...content.about.stats];
                  stats[i] = { ...stats[i], value: e.target.value };
                  upd("about", { ...content.about, stats });
                }}
              />
              <input
                className={inputCls + " flex-1"}
                placeholder="Label"
                value={s.label}
                onChange={(e) => {
                  const stats = [...content.about.stats];
                  stats[i] = { ...stats[i], label: e.target.value };
                  upd("about", { ...content.about, stats });
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  if (section === "gallery") return (
    <div>
      {sectionHeader("Gallery", "6 portfolio showcase cards")}
      <div className={fieldCls}>
        <label className={labelCls}>Section Title</label>
        <input className={inputCls} value={content.gallery.title}
          onChange={(e) => upd("gallery", { ...content.gallery, title: e.target.value })} />
      </div>
      <div className={fieldCls}>
        <label className={labelCls}>Subtitle</label>
        <input className={inputCls} value={content.gallery.subtitle}
          onChange={(e) => upd("gallery", { ...content.gallery, subtitle: e.target.value })} />
      </div>
      <div className="border-t border-pink-50 pt-4 mt-2 space-y-2">
        <label className={labelCls}>Gallery Items</label>
        {content.gallery.items.map((item, i) => (
          <div key={i} className="flex gap-2">
            <input
              className={inputCls + " w-16 text-center text-lg"}
              placeholder="emoji"
              value={item.emoji}
              onChange={(e) => {
                const items = [...content.gallery.items];
                items[i] = { ...items[i], emoji: e.target.value };
                upd("gallery", { ...content.gallery, items });
              }}
            />
            <input
              className={inputCls + " flex-1"}
              placeholder="Title"
              value={item.title}
              onChange={(e) => {
                const items = [...content.gallery.items];
                items[i] = { ...items[i], title: e.target.value };
                upd("gallery", { ...content.gallery, items });
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );

  if (section === "testimonials") return (
    <div>
      {sectionHeader("Reviews / Testimonials", "Client success stories")}
      <div className={fieldCls}>
        <label className={labelCls}>Section Title</label>
        <input className={inputCls} value={content.testimonials.title}
          onChange={(e) => upd("testimonials", { ...content.testimonials, title: e.target.value })} />
      </div>
      <div className={fieldCls}>
        <label className={labelCls}>Subtitle</label>
        <input className={inputCls} value={content.testimonials.subtitle}
          onChange={(e) => upd("testimonials", { ...content.testimonials, subtitle: e.target.value })} />
      </div>
      <div className="border-t border-pink-50 pt-4 mt-2 space-y-4">
        {content.testimonials.items.map((t, i) => (
          <div key={i} className="bg-pink-50/40 rounded-2xl p-4 border border-pink-100">
            <p className="text-xs font-bold text-pink-600 mb-3">Review {i + 1}</p>
            <div className="flex gap-2 mb-2">
              <input
                className={inputCls + " w-12 text-center font-bold"}
                placeholder="A"
                value={t.avatar}
                maxLength={2}
                onChange={(e) => {
                  const items = [...content.testimonials.items];
                  items[i] = { ...items[i], avatar: e.target.value };
                  upd("testimonials", { ...content.testimonials, items });
                }}
              />
              <input
                className={inputCls + " flex-1"}
                placeholder="Client name"
                value={t.name}
                onChange={(e) => {
                  const items = [...content.testimonials.items];
                  items[i] = { ...items[i], name: e.target.value };
                  upd("testimonials", { ...content.testimonials, items });
                }}
              />
            </div>
            <textarea
              className={textareaCls}
              rows={3}
              placeholder="Review text"
              value={t.text}
              onChange={(e) => {
                const items = [...content.testimonials.items];
                items[i] = { ...items[i], text: e.target.value };
                upd("testimonials", { ...content.testimonials, items });
              }}
            />
            <input
              className={inputCls + " mt-2"}
              placeholder="Service (e.g. Gel Manicure)"
              value={t.service}
              onChange={(e) => {
                const items = [...content.testimonials.items];
                items[i] = { ...items[i], service: e.target.value };
                upd("testimonials", { ...content.testimonials, items });
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );

  if (section === "contact") return (
    <div>
      {sectionHeader("Contact & Booking", "Booking form section info")}
      <div className={fieldCls}>
        <label className={labelCls}>Section Title</label>
        <input className={inputCls} value={content.contact.title}
          onChange={(e) => upd("contact", { ...content.contact, title: e.target.value })} />
      </div>
      <div className={fieldCls}>
        <label className={labelCls}>Subtitle</label>
        <input className={inputCls} value={content.contact.subtitle}
          onChange={(e) => upd("contact", { ...content.contact, subtitle: e.target.value })} />
      </div>
      <div className={fieldCls}>
        <label className={labelCls}>Address</label>
        <input className={inputCls} value={content.contact.address}
          onChange={(e) => upd("contact", { ...content.contact, address: e.target.value })} />
      </div>
      <div className={fieldCls}>
        <label className={labelCls}>Phone</label>
        <input className={inputCls} value={content.contact.phone}
          onChange={(e) => upd("contact", { ...content.contact, phone: e.target.value })} />
      </div>
      <div className={fieldCls}>
        <label className={labelCls}>Email</label>
        <input className={inputCls} value={content.contact.email}
          onChange={(e) => upd("contact", { ...content.contact, email: e.target.value })} />
      </div>
      <div className={fieldCls}>
        <label className={labelCls}>Opening Hours</label>
        <textarea className={textareaCls} rows={2} value={content.contact.hours}
          onChange={(e) => upd("contact", { ...content.contact, hours: e.target.value })} />
      </div>
    </div>
  );

  if (section === "footer") return (
    <div>
      {sectionHeader("Footer", "Bottom of the page")}
      <div className={fieldCls}>
        <label className={labelCls}>Salon Name</label>
        <input className={inputCls} value={content.salon.name}
          onChange={(e) => onChange({ ...content, salon: { ...content.salon, name: e.target.value } })} />
      </div>
      <div className={fieldCls}>
        <label className={labelCls}>Tagline / description</label>
        <textarea className={textareaCls} rows={2} value={content.footer.tagline}
          onChange={(e) => onChange({ ...content, footer: { tagline: e.target.value } })} />
      </div>
      <div className="mt-4 p-4 bg-pink-50/50 rounded-xl border border-pink-100">
        <p className="text-xs text-gray-500 leading-relaxed">
          The footer also displays services and contact info from those sections. Edit them in their respective tabs.
        </p>
      </div>
    </div>
  );

  return null;
}
