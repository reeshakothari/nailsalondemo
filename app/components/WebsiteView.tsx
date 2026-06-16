"use client";

import { useEffect, useState } from "react";
import type { SiteContent } from "../lib/content";
import ContactFormInline from "./ContactFormInline";
import CalendarBooking from "./CalendarBooking";
import AccountPanel from "./AccountPanel";

const serif = { fontFamily: "var(--font-playfair, Georgia, serif)" };

const serviceImages = [
  "/images/manicure-tools.jpeg",
  "/images/pearl-nails.jpeg",
  "/images/glitter-nails.jpeg",
  "/images/nail-art.jpeg",
  "/images/pedicure-flowers.jpeg",
  "/images/chrome-nails.jpeg",
];

const galleryImages = [
  "/images/pearl-nails.jpeg",
  "/images/nail-art.jpeg",
  "/images/french-nails.jpeg",
  "/images/glitter-nails.jpeg",
  "/images/pedicure-flowers.jpeg",
  "/images/chrome-nails.jpeg",
];

/* SVG icons — no emojis */
const Icon = {
  Location: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 2C8.686 2 6 4.686 6 8c0 5.25 6 13 6 13s6-7.75 6-13c0-3.314-2.686-6-6-6z"/>
      <circle cx="12" cy="8" r="2.25" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Phone: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.338c0-.619.503-1.125 1.125-1.125h2.25a1.125 1.125 0 011.076.797l.857 3c.1.351-.015.726-.295.954l-1.2.9a11.25 11.25 0 005.06 5.059l.9-1.2a.75.75 0 01.954-.294l3 .857c.44.125.747.527.747.985v2.25a1.125 1.125 0 01-1.125 1.125H18C9.716 19.5 4.5 14.284 4.5 6.75V6.338z"/>
    </svg>
  ),
  Mail: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25H4.5a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5H4.5a2.25 2.25 0 00-2.25 2.25m19.5 0l-9.75 6.75L2.25 6.75"/>
    </svg>
  ),
  Clock: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
      <circle cx="12" cy="12" r="9.75" strokeLinecap="round" strokeLinejoin="round"/>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75V12l3.75 3"/>
    </svg>
  ),
  Diamond: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 3l-4 6 10 12L22 9l-4-6H6zM2 9h20M6 3l4 6m8-6l-4 6"/>
    </svg>
  ),
};

interface Props {
  content: SiteContent;
  editMode?: boolean;
  activeSection?: string | null;
  onSectionClick?: (section: string) => void;
}

export default function WebsiteView({ content, editMode = false, activeSection = null, onSectionClick }: Props) {
  const [accountOpen, setAccountOpen] = useState(false);

  /* Scroll reveal — only on the live site, not in the editor */
  useEffect(() => {
    if (editMode) return;
    const els = document.querySelectorAll("[data-reveal]");
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("revealed"); obs.unobserve(e.target); } }),
      { threshold: 0.12 }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [editMode]);

  const editCls = (id: string) =>
    editMode
      ? ` relative group/sec cursor-pointer transition-all duration-200${activeSection === id ? " outline outline-2 outline-pink-500 outline-offset-[-2px]" : ""}`
      : "";

  const EditBtn = ({ id }: { id: string }) =>
    editMode ? (
      <button
        onClick={(e) => { e.stopPropagation(); onSectionClick?.(id); }}
        className="absolute top-3 right-3 z-50 opacity-0 group-hover/sec:opacity-100 transition-opacity bg-pink-600 text-white text-xs px-3 py-1.5 rounded-full shadow-lg font-medium"
      >
        Edit
      </button>
    ) : null;

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "var(--font-geist-sans, system-ui, sans-serif)" }}>

      {/* ── NAVBAR ── */}
      <nav
        id="nav"
        className={"sticky top-0 z-40 bg-white/96 backdrop-blur-md border-b border-stone-100" + editCls("nav")}
        onClick={editMode ? () => onSectionClick?.("nav") : undefined}
      >
        {editMode && <EditBtn id="nav" />}
        <div className="max-w-6xl mx-auto px-8 py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-white" style={{ background: "linear-gradient(135deg,#e8177e,#c01068)" }}>
              <Icon.Diamond />
            </div>
            <div>
              <span className="font-semibold text-lg text-gray-900 tracking-tight" style={serif}>{content.salon.name}</span>
            </div>
          </div>
          {/* Links */}
          <div className="hidden md:flex items-center gap-10">
            {["Services", "About", "Gallery", "Reviews"].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`}
                className="nav-link text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
                {item}
              </a>
            ))}
          </div>
          {/* CTAs */}
          <div className="flex items-center gap-3">
            {/* My Account button */}
            {!editMode && (
              <button
                onClick={() => setAccountOpen(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 text-sm font-medium text-gray-600 hover:border-pink-300 hover:text-pink-600 transition-all"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                My Account
              </button>
            )}
            <a href="#booking"
              className="btn-luxury text-sm font-semibold text-white px-6 py-2.5 rounded-full"
              style={{ background: "linear-gradient(135deg,#e8177e,#c01068)", boxShadow: "0 4px 16px rgba(232,23,126,0.3)" }}>
              Book Now
            </a>
            {!editMode && (
              <a href="/admindashboard"
                className="text-sm font-medium text-gray-500 border border-gray-200 px-4 py-2.5 rounded-full hover:border-gray-400 hover:text-gray-800 transition-all">
                Admin
              </a>
            )}
          </div>
        </div>
      </nav>

      {/* ── ACCOUNT PANEL ── */}
      {!editMode && <AccountPanel open={accountOpen} onClose={() => setAccountOpen(false)} />}

      {/* ── HERO ── */}
      <section
        id="hero"
        data-section="hero"
        className={"relative overflow-hidden" + editCls("hero")}
        style={{ backgroundImage: "url('/images/hero-salon.jpeg')", backgroundSize: "cover", backgroundPosition: "center", minHeight: "90vh", display: "flex", alignItems: "center" }}
        onClick={editMode ? () => onSectionClick?.("hero") : undefined}
      >
        {editMode && <EditBtn id="hero" />}
        {/* Overlay — lowered opacity so photo shows through */}
        {/* Bottom gradient so text stays readable */}
        <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(to top, rgba(10,4,20,0.55) 0%, transparent 45%)" }} />
        {/* Bottom pink fade */}
        <div className="absolute bottom-0 left-0 right-0 h-48 pointer-events-none" style={{ background: "linear-gradient(to top,rgba(232,23,126,0.12),transparent)" }} />

        <div className="relative z-10 max-w-5xl mx-auto px-8 py-28 text-center w-full">
          {/* Badge */}
          <div data-reveal className="inline-flex items-center gap-2 text-white/75 text-xs tracking-[0.2em] uppercase px-5 py-2 rounded-full border border-white/20 mb-10"
            style={{ background: "rgba(255,255,255,0.06)", backdropFilter: "blur(12px)" }}>
            {content.hero.badge}
          </div>
          {/* Headline */}
          <h1 data-reveal data-delay="1" className="text-5xl md:text-7xl font-semibold text-white mb-7 leading-tight" style={serif}>
            {content.hero.headline}
          </h1>
          <p data-reveal data-delay="2" className="text-base md:text-lg text-white/65 mb-12 max-w-xl mx-auto leading-relaxed tracking-wide">
            {content.hero.subheadline}
          </p>
          {/* CTAs */}
          <div data-reveal data-delay="3" className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
            <a href="#booking"
              className="btn-luxury inline-block px-10 py-4 rounded-full font-medium text-white text-sm tracking-widest uppercase"
              style={{ background: "linear-gradient(135deg,#e8177e,#c01068)", boxShadow: "0 8px 32px rgba(232,23,126,0.45)", letterSpacing: "0.1em" }}>
              {content.hero.cta1}
            </a>
            <a href="#services"
              className="btn-luxury inline-block px-10 py-4 rounded-full font-medium text-white text-sm tracking-widest uppercase border border-white/30 hover:bg-white/10 transition-all backdrop-blur-sm"
              style={{ letterSpacing: "0.1em" }}>
              {content.hero.cta2}
            </a>
          </div>
          {/* Stats */}
          <div data-reveal data-delay="4" className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-2xl mx-auto">
            {content.hero.stats.map((s, i) => (
              <div key={i} className="rounded-2xl py-5 px-4 text-center border border-white/10"
                style={{ background: "rgba(255,255,255,0.06)", backdropFilter: "blur(10px)" }}>
                <div className="text-2xl font-semibold text-white mb-1" style={serif}>{s.value}</div>
                <div className="text-[10px] text-white/50 uppercase tracking-[0.15em]">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section
        id="services"
        data-section="services"
        className={"py-24 relative" + editCls("services")}
        style={{ background: "#fdfaf8" }}
        onClick={editMode ? () => onSectionClick?.("services") : undefined}
      >
        {editMode && <EditBtn id="services" />}
        <div className="max-w-6xl mx-auto px-8">
          <div data-reveal className="text-center mb-16">
            <p className="text-pink-500 text-xs font-medium uppercase tracking-[0.3em] mb-4">
              {content.services.subtitle}
            </p>
            <h2 className="text-4xl font-semibold text-gray-900" style={serif}>{content.services.title}</h2>
            <div className="w-12 h-px bg-pink-300 mx-auto mt-5" />
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7">
            {content.services.items.map((svc, i) => (
              <div key={i} data-reveal data-delay={`${i + 1}`}
                className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-stone-100 hover:-translate-y-1.5 group/card">
                {/* Photo */}
                <div className="relative h-52 overflow-hidden">
                  <img src={serviceImages[i % serviceImages.length]} alt={svc.title}
                    className="w-full h-full object-cover group-hover/card:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/40" />
                  <span className="absolute top-4 right-4 text-xs font-semibold text-white bg-black/30 backdrop-blur-sm px-3 py-1 rounded-full border border-white/20">
                    {svc.price}
                  </span>
                </div>
                {/* Body */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-base font-semibold text-gray-900" style={serif}>{svc.title}</h3>
                    <span className="text-gray-400 text-xs ml-2 shrink-0">{svc.duration}</span>
                  </div>
                  <p className="text-gray-500 text-sm leading-relaxed mb-5">{svc.description}</p>
                  {svc.bookingUrl ? (
                    <a href={svc.bookingUrl} target="_blank" rel="noopener noreferrer"
                      className="btn-luxury block text-center text-xs font-semibold text-white py-3 rounded-xl tracking-widest uppercase"
                      style={{ background: "linear-gradient(135deg,#e8177e,#c01068)", boxShadow: "0 4px 14px rgba(232,23,126,0.3)", letterSpacing: "0.1em" }}>
                      Book &amp; Pay
                    </a>
                  ) : (
                    <a href="#booking"
                      className="btn-luxury block text-center text-xs font-semibold text-pink-600 py-3 rounded-xl tracking-widest uppercase border border-pink-200 hover:bg-pink-600 hover:text-white hover:border-pink-600 transition-all"
                      style={{ letterSpacing: "0.1em" }}>
                      Book Now
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section
        id="about"
        data-section="about"
        className={"py-24 bg-white relative" + editCls("about")}
        onClick={editMode ? () => onSectionClick?.("about") : undefined}
      >
        {editMode && <EditBtn id="about" />}
        <div className="max-w-6xl mx-auto px-8">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            {/* Text */}
            <div data-reveal>
              <p className="text-pink-500 text-xs font-medium uppercase tracking-[0.3em] mb-5">{content.about.badge}</p>
              <h2 className="text-4xl font-semibold text-gray-900 mb-7 leading-tight" style={serif}>{content.about.title}</h2>
              <div className="w-10 h-px bg-pink-300 mb-7" />
              {content.about.body.split("\n\n").map((para, i) => (
                <p key={i} className="text-gray-500 leading-[1.9] mb-4 text-sm">{para}</p>
              ))}
              {/* Stats */}
              <div className="grid grid-cols-2 gap-3 my-8">
                {content.about.stats.map((s, i) => (
                  <div key={i} className="rounded-2xl p-5 text-center transition-transform hover:-translate-y-0.5 duration-300"
                    style={i % 2 === 0 ? { background: "#fff0f6" } : { background: "linear-gradient(135deg,#2d1b4e,#1a1128)" }}>
                    <div className="text-2xl font-semibold mb-1" style={{ ...serif, color: i % 2 === 0 ? "#e8177e" : "white" }}>{s.value}</div>
                    <div className="text-[10px] uppercase tracking-[0.15em]" style={{ color: i % 2 === 0 ? "#b06080" : "rgba(255,255,255,0.5)" }}>{s.label}</div>
                  </div>
                ))}
              </div>
              <a href="#booking"
                className="btn-luxury inline-block text-xs font-semibold text-white px-9 py-3.5 rounded-full tracking-widest uppercase"
                style={{ background: "linear-gradient(135deg,#e8177e,#c01068)", letterSpacing: "0.1em" }}>
                Book a Visit
              </a>
            </div>
            {/* Photo collage */}
            <div data-reveal data-delay="2" className="grid grid-cols-2 gap-3 h-[560px]">
              <div className="rounded-3xl overflow-hidden row-span-2 shadow-lg">
                <img src="/images/salon-interior.jpeg" alt="Our salon"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
              </div>
              <div className="rounded-3xl overflow-hidden shadow-lg">
                <img src="/images/white-studio.jpeg" alt="Nail studio"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
              </div>
              <div className="rounded-3xl overflow-hidden shadow-lg">
                <img src="/images/manicure-treatment.jpeg" alt="Manicure"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── GALLERY ── */}
      <section
        id="gallery"
        data-section="gallery"
        className={"py-24 relative" + editCls("gallery")}
        style={{ background: "linear-gradient(160deg,#1a1128 0%,#2d1b4e 100%)" }}
        onClick={editMode ? () => onSectionClick?.("gallery") : undefined}
      >
        {editMode && <EditBtn id="gallery" />}
        <div className="max-w-6xl mx-auto px-8">
          <div data-reveal className="text-center mb-16">
            <p className="text-pink-400 text-xs font-medium uppercase tracking-[0.3em] mb-4">{content.gallery.subtitle}</p>
            <h2 className="text-4xl font-semibold text-white" style={serif}>{content.gallery.title}</h2>
            <div className="w-12 h-px bg-pink-400/40 mx-auto mt-5" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {content.gallery.items.map((item, i) => (
              <div key={i} data-reveal data-delay={`${i + 1}`}
                className="relative rounded-2xl overflow-hidden group/gi cursor-pointer"
                style={{ aspectRatio: i === 0 ? "1/1.2" : "1/1" }}>
                <img src={galleryImages[i % galleryImages.length]} alt={item.title}
                  className="w-full h-full object-cover group-hover/gi:scale-110 transition-transform duration-700" />
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-80 group-hover/gi:opacity-100 transition-opacity duration-300" />
                {/* Label — slides up on hover */}
                <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-2 group-hover/gi:translate-y-0 transition-transform duration-300">
                  <p className="text-white font-medium text-sm tracking-wide" style={serif}>{item.title}</p>
                  <p className="text-white/50 text-xs mt-0.5 opacity-0 group-hover/gi:opacity-100 transition-opacity duration-300 delay-75">View work</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section
        id="reviews"
        data-section="testimonials"
        className={"py-24 relative" + editCls("testimonials")}
        style={{ background: "#fdfaf8" }}
        onClick={editMode ? () => onSectionClick?.("testimonials") : undefined}
      >
        {editMode && <EditBtn id="testimonials" />}
        <div className="max-w-6xl mx-auto px-8">
          <div data-reveal className="text-center mb-16">
            <p className="text-pink-500 text-xs font-medium uppercase tracking-[0.3em] mb-4">{content.testimonials.subtitle}</p>
            <h2 className="text-4xl font-semibold text-gray-900" style={serif}>{content.testimonials.title}</h2>
            <div className="w-12 h-px bg-pink-300 mx-auto mt-5" />
          </div>
          <div className="grid md:grid-cols-3 gap-7">
            {content.testimonials.items.map((t, i) => (
              <div key={i} data-reveal data-delay={`${i + 1}`}
                className="bg-white rounded-3xl p-8 border border-stone-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-400 flex flex-col">
                <div className="flex gap-1 mb-5">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <span key={j} className="text-amber-400 text-xs">★</span>
                  ))}
                </div>
                <p className="text-gray-500 text-sm leading-[1.9] italic flex-1">&ldquo;{t.text}&rdquo;</p>
                <div className="flex items-center gap-4 mt-7 pt-5 border-t border-stone-100">
                  <div className="w-11 h-11 rounded-full flex items-center justify-center text-white font-semibold text-sm shrink-0"
                    style={{ background: "linear-gradient(135deg,#e8177e,#c01068)" }}>
                    {t.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 text-sm" style={serif}>{t.name}</div>
                    <div className="text-xs text-pink-500 mt-0.5">{t.service}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BOOKING / CONTACT ── */}
      <section
        id="booking"
        data-section="contact"
        className={"py-24 bg-white relative" + editCls("contact")}
        onClick={editMode ? () => onSectionClick?.("contact") : undefined}
      >
        {editMode && <EditBtn id="contact" />}
        <div className="max-w-7xl mx-auto px-8">
          <div data-reveal className="text-center mb-16">
            <p className="text-pink-500 text-xs font-medium uppercase tracking-[0.3em] mb-4">Get In Touch</p>
            <h2 className="text-4xl font-semibold text-gray-900" style={serif}>{content.contact.title}</h2>
            <p className="text-gray-400 text-sm mt-3">{content.contact.subtitle}</p>
            <div className="w-12 h-px bg-pink-300 mx-auto mt-5" />
          </div>
          <div className="grid lg:grid-cols-3 gap-8 items-start">
            {/* Info */}
            <div data-reveal>
              <div className="space-y-6">
                {[
                  { Icon: Icon.Location, label: "Location", value: content.contact.address },
                  { Icon: Icon.Phone,    label: "Phone",    value: content.contact.phone },
                  { Icon: Icon.Mail,     label: "Email",    value: content.contact.email },
                  { Icon: Icon.Clock,    label: "Hours",    value: content.contact.hours },
                ].map((row) => (
                  <div key={row.label} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-pink-50 text-pink-500 flex items-center justify-center shrink-0">
                      <row.Icon />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-800 text-sm">{row.label}</div>
                      <div className="text-gray-400 text-sm mt-0.5 leading-relaxed">{row.value}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-8 rounded-2xl overflow-hidden h-44 shadow-sm">
                <img src="/images/pedicure-treatment.jpeg" alt="Salon" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
              </div>
            </div>
            {/* Form */}
            <div data-reveal data-delay="2" className="bg-white rounded-3xl p-7 border border-stone-100 shadow-md">
              <h3 className="text-base font-semibold text-gray-800 mb-5" style={serif}>Send a Message</h3>
              <ContactFormInline />
            </div>
            {/* Calendar */}
            <div data-reveal data-delay="3" className="bg-white rounded-3xl p-7 border border-stone-100 shadow-md">
              <h3 className="text-base font-semibold text-gray-800 mb-5" style={serif}>Pick a Date &amp; Time</h3>
              <CalendarBooking />
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer
        id="footer"
        data-section="footer"
        className={"py-14 relative" + editCls("footer")}
        style={{ background: "#100820" }}
        onClick={editMode ? () => onSectionClick?.("footer") : undefined}
      >
        {editMode && <EditBtn id="footer" />}
        <div className="max-w-6xl mx-auto px-8">
          <div className="grid md:grid-cols-4 gap-10 mb-10">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-white" style={{ background: "linear-gradient(135deg,#e8177e,#c01068)" }}>
                  <Icon.Diamond />
                </div>
                <span className="font-semibold text-lg text-white tracking-tight" style={serif}>{content.salon.name}</span>
              </div>
              <p className="text-white/40 text-sm leading-relaxed mb-6">{content.footer.tagline}</p>
              <div className="flex gap-2.5">
                {["IG", "TT", "PT", "FB"].map((s) => (
                  <a key={s} href="#"
                    className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center text-white/50 hover:text-white hover:border-white/40 transition-all text-[11px] font-semibold tracking-wider">
                    {s}
                  </a>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-white/40 uppercase tracking-[0.2em] mb-5">Services</h4>
              <ul className="space-y-2.5">
                {content.services.items.slice(0, 4).map((s, i) => (
                  <li key={i}>
                    <a href="#services" className="text-white/50 text-sm hover:text-white transition-colors">{s.title}</a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-white/40 uppercase tracking-[0.2em] mb-5">Visit Us</h4>
              <ul className="space-y-2.5 text-white/50 text-sm leading-relaxed">
                <li>{content.contact.address}</li>
                <li>{content.contact.phone}</li>
                <li>{content.contact.email}</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/8 pt-7 flex flex-col md:flex-row justify-between items-center gap-3">
            <p className="text-white/25 text-xs">© 2025 {content.salon.name}. All rights reserved.</p>
            <p className="text-white/20 text-xs tracking-wide">Crafted with care</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
