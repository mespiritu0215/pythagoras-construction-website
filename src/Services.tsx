/**
 * Services.tsx  (Updated for admin system)
 *
 * Admin changes:
 *  - Service headings, list items, and captions are wrapped with EditableText
 *  - Carousel images are wrapped with EditableImage so admins can replace them
 *  - All other styles and behaviour are identical to the original
 */

import React, { useState, useEffect, useRef, JSX } from 'react';
import './Services.css';

import emailIcon from './email.png';
import phoneIcon from './phone.png';
import clockIcon from './clock.png';

import SMLegaspiSmart1 from "./CompletedProjects/SMLegaspi/SMLegaspiSmart1.jpg";
import SMLegaspiSmart4 from "./CompletedProjects/SMLegaspi/SMLegaspiSmart4.jpg";
import SMLegaspiSmart7 from "./CompletedProjects/SMLegaspi/SMLegaspiSmart7.jpg";

import GlobeCalbayog1  from "./CompletedProjects/GlobeCalbayog/1.jpg";
import GlobeCalbayog12 from "./CompletedProjects/GlobeCalbayog/12.jpg";
import GlobeCalbayog16 from "./CompletedProjects/GlobeCalbayog/16.jpg";

import MOCHMC1 from "./CompletedProjects/MOCHMC/MOCHMC1.png";
import MOCHMC2 from "./CompletedProjects/MOCHMC/MOCHMC2.png";
import MOCHMC3 from "./CompletedProjects/MOCHMC/MOCHMC3.png";

import PoiFeston1 from "./CompletedProjects/PoiFestonSanAndres/PoiFestonSanAndres1.png";
import PoiFeston2 from "./CompletedProjects/PoiFestonSanAndres/PoiFestonSanAndres2.png";
import PoiFeston3 from "./CompletedProjects/PoiFestonSanAndres/PoiFestonSanAndres3.png";

import { useAdmin, EditableText, EditableImage } from './AdminContext';

// ─────────────────────────────────────────────────────────────
//  Static image arrays (overridable by admin via EditableImage)
// ─────────────────────────────────────────────────────────────

const GlobeCalbayogImages: string[] = [GlobeCalbayog1, GlobeCalbayog12, GlobeCalbayog16];
const SMLegaspiImages:     string[] = [SMLegaspiSmart1, SMLegaspiSmart4, SMLegaspiSmart7];
const MOCHMCImages:        string[] = [MOCHMC1, MOCHMC2, MOCHMC3];
const poiFestonImages:     string[] = [PoiFeston1, PoiFeston2, PoiFeston3];

// ─────────────────────────────────────────────────────────────
//  TYPES
// ─────────────────────────────────────────────────────────────

interface ServiceData {
  n:         number;
  label:     string;
  heading:   string;
  items:     string[];
  dark:      boolean;
  reverse:   boolean;
  image?:    string;
  imageAlt?: string;
  carousel?: string[];
  caption?:  string;
}

// ─────────────────────────────────────────────────────────────
//  ADMIN-AWARE CAROUSEL
//  Each image slot is individually replaceable by the admin.
// ─────────────────────────────────────────────────────────────

interface CarouselProps {
  images:       string[];
  adminKeyBase: string; // e.g. "srv.1.carousel"
}

function Carousel({ images, adminKeyBase }: CarouselProps): JSX.Element {
  const { editMode, getImg } = useAdmin();
  const [current, setCurrent]   = useState<number>(0);
  const [hovered, setHovered]   = useState<boolean>(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (hovered) {
      intervalRef.current = setInterval(() => {
        setCurrent(c => (c + 1) % images.length);
      }, 1200);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [hovered, images.length]);

  return (
    <div
      className="srv-carousel-wrapper"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {images.map((img, i) => {
        // Use admin override if available, else original
        const adminKey   = `${adminKeyBase}.${i}`;
        const displaySrc = getImg(adminKey) ?? img;
        const isActive   = i === current;

        return editMode ? (
          // In edit mode: only the visible slide receives pointer events
          <div
            key={i}
            style={{
              position: 'absolute', inset: 0,
              opacity: isActive ? 1 : 0,
              transition: 'opacity 0.6s ease-in-out',
              pointerEvents: isActive ? 'auto' : 'none',
            }}
          >
            <EditableImage
              adminKey={adminKey}
              src={img}
              alt=""
              style={{ width: '100%', height: '100%' }}
              imgStyle={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        ) : (
          <img
            key={i}
            src={displaySrc}
            alt=""
            className={`srv-carousel-img${isActive ? ' active' : ''}`}
          />
        );
      })}

      <div className="srv-carousel-bar">
        <div
          className="srv-carousel-bar-fill"
          style={{ width: `${((current + 1) / images.length) * 100}%` }}
        />
      </div>
      <div className="srv-carousel-dots">
        {images.map((_, i) => (
          <span
            key={i}
            className={`srv-dot${i === current ? ' active' : ''}`}
            onClick={() => setCurrent(i)}
          />
        ))}
      </div>
    </div>
  );
}


// ─────────────────────────────────────────────────────────────
//  ADD SERVICE ITEM  (edit mode only)
//  Persists extra items per category to Firestore via getText/setText.
// ─────────────────────────────────────────────────────────────

function AddServiceItem({ svcN, isDark }: { svcN: number; isDark: boolean }) {
  const { getText, setText } = useAdmin();
  const [inputVal, setInputVal] = React.useState('');

  const extraKey  = `srv.${svcN}.extra_items`;
  const rawExtra  = getText(extraKey, '[]');
  let extraItems: string[] = [];
  try { extraItems = JSON.parse(rawExtra); } catch { extraItems = []; }

  const addItem = () => {
    if (!inputVal.trim()) return;
    setText(extraKey, JSON.stringify([...extraItems, inputVal.trim()]));
    setInputVal('');
  };

  const removeItem = (idx: number) => {
    setText(extraKey, JSON.stringify(extraItems.filter((_, i) => i !== idx)));
  };

  const listColor  = isDark ? 'rgba(253,246,238,0.80)' : '#2C1810';
  const inputBg    = isDark ? 'rgba(255,255,255,0.08)' : '#fff';
  const inputBorder = isDark ? 'rgba(253,246,238,0.25)' : 'rgba(107,0,0,0.25)';

  return (
    <>
      {/* Admin-added extra items */}
      {extraItems.map((item, idx) => (
        <li key={`extra-${idx}`} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ color: listColor, flex: 1 }}>{item}</span>
          <button
            type="button"
            onClick={() => removeItem(idx)}
            style={{
              background: 'rgba(107,0,0,0.15)', border: '1px solid rgba(107,0,0,0.3)',
              color: '#6B0000', cursor: 'pointer', borderRadius: 2,
              fontFamily: 'Barlow Condensed, sans-serif', fontSize: 11,
              fontWeight: 700, padding: '2px 7px', flexShrink: 0,
            }}
          >
            ✕
          </button>
        </li>
      ))}

      {/* Add-new input row */}
      <li style={{ display: 'flex', gap: 8, marginTop: 8, alignItems: 'center' }}>
        <input
          type="text"
          value={inputVal}
          onChange={e => setInputVal(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addItem()}
          placeholder="Add new service item…"
          style={{
            flex: 1, background: inputBg,
            border: `1px dashed ${inputBorder}`,
            color: listColor, fontFamily: 'Barlow, sans-serif',
            fontSize: 14, padding: '7px 10px', outline: 'none',
          }}
        />
        <button
          type="button"
          onClick={addItem}
          style={{
            background: '#6B0000', color: '#FDF6EE', border: 'none',
            fontFamily: 'Barlow Condensed, sans-serif', fontSize: 12,
            fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase',
            padding: '8px 14px', cursor: 'pointer', flexShrink: 0,
          }}
        >
          + Add
        </button>
      </li>
    </>
  );
}

// ─────────────────────────────────────────────────────────────
//  SERVICE DATA
// ─────────────────────────────────────────────────────────────

const services: ServiceData[] = [
  {
    n:       1,
    label:   'Expertise',
    heading: 'Civil Works',
    items: [
      'New Construction & Renovation',
      'Tower Erection & Dismantling',
      'Waterproofing & Roofing Works',
      'Slope Protection / Rip Rapping',
      'Plumbing, Pipefitting & Drilling',
      'Metal Works & Masonry',
    ],
    carousel: MOCHMCImages,
    caption:  'Featured: MOCHMC Hospital Project',
    dark:     true,
    reverse:  false,
  },
  {
    n:       2,
    label:   'Systems',
    heading: 'Electrical Works',
    items: [
      'Environmental Alarm Systems',
      'Digital & Manual Transfer Switches',
      'Structured Cabling & Access Control',
      'Pole Mounted Distribution Transformers',
      'Generators & ATS Installation',
      'Panel Boards & Circuit Breakers',
    ],
    carousel: GlobeCalbayogImages,
    caption:  'Featured: Globe Calbayog Electrical Project',
    dark:     false,
    reverse:  true,
  },
  {
    n:       3,
    label:   'Portfolio',
    heading: 'Our End Products',
    items: [
      'Commercial & Industrial Warehouses',
      'Residential & School Buildings',
      'Office / Business Centers',
      'Submersible Pump Installation',
      'Sewer and Drainage Lines',
      'Site Development',
    ],
    carousel: SMLegaspiImages,
    caption:  'Featured: SMLegaspi Smart Communications',
    dark:     true,
    reverse:  false,
  },
  {
    n:       4,
    label:   'Design',
    heading: 'Architectural & Design',
    items: [
      'Schematic Design & 3D Modelling',
      'Rendered Walkthroughs & Presentations',
      'Design Development & Working Drawings',
      'As-built Plans & Technical Specs',
      'Contract Documents & Site Supervision',
    ],
    carousel: poiFestonImages,
    caption:  'Featured: Poi Feston San Andres Project',
    dark:     false,
    reverse:  true,
  },
];

// ─────────────────────────────────────────────────────────────
//  MAIN COMPONENT
// ─────────────────────────────────────────────────────────────

export default function Services(): JSX.Element {
  const { editMode } = useAdmin();

  return (
    <main className="srv-page">

      {/* ── HERO ── */}
      <section className="srv-hero">
        <div className="srv-hero-bg" />
        <div className="srv-hero-overlay" />
        <div className="srv-hero-vbar" />

        <div className="srv-hero-content">
          <p className="srv-eyebrow">Solutions · Excellence · Reliability</p>
          <h1 className="srv-hero-title">
            <span className="srv-ht-line">OUR</span>
            <span className="srv-ht-line srv-ht-accent">SERVICES</span>
          </h1>
          <EditableText
            adminKey="srv.hero.sub"
            tag="p"
            className="srv-hero-sub"
          >
            From foundational civil works to intricate architectural designs, we provide
            end-to-end construction solutions tailored to the Philippine landscape.
          </EditableText>
        </div>

        <div className="srv-hero-stats">
          {([
            { num: '4',    label: 'Service Areas' },
            { num: '30+',  label: 'Years in Industry' },
            { num: '100+', label: 'Active Workers' },
            { num: 'PCAB', label: 'General "A" Licensed' },
          ] as { num: string; label: string }[]).map((s, i, arr) => (
            <div key={i} className="srv-stat-group">
              <div className="srv-stat">
                <div className="srv-stat-num">{s.num}</div>
                <div className="srv-stat-label">{s.label}</div>
              </div>
              {i < arr.length - 1 && <div className="srv-stat-divider" />}
            </div>
          ))}
        </div>
      </section>

      {/* ── SERVICE SECTIONS ── */}
      {services.map((svc) => (
        <section
          key={svc.n}
          className={`srv-section ${svc.dark ? 'srv-section-dark' : 'srv-section-light'}`}
        >
          <div className="srv-container">
            <div className={`srv-content-grid${svc.reverse ? ' srv-reverse' : ''}`}>

              {/* ── Text column ── */}
              <div className="srv-text">
                <span className="srv-ghost-num">
                  {String(svc.n).padStart(2, '0')}
                </span>

                <div className="srv-label-row">
                  <span className="srv-label">{svc.label}</span>
                  <div className={`srv-rule${svc.dark ? '' : ' srv-rule-dark'}`} />
                </div>

                {/* Editable heading */}
                <EditableText
                  adminKey={`srv.${svc.n}.heading`}
                  tag="h2"
                  className={`srv-heading${svc.dark ? '' : ' srv-heading-dark'}`}
                >
                  {svc.heading}
                </EditableText>

                <div className="srv-heading-rule" />

                {/* Editable list items */}
                <ul className={`srv-list${svc.dark ? '' : ' srv-list-dark'}`}>
                  {svc.items.map((item, i) => (
                    <li key={i}>
                      <EditableText adminKey={`srv.${svc.n}.item.${i}`} tag="span">
                        {item}
                      </EditableText>
                    </li>
                  ))}
                  {editMode && (
                    <AddServiceItem svcN={svc.n} isDark={svc.dark} />
                  )}
                </ul>
              </div>

              {/* ── Media column ── */}
              <div className="srv-image-box">
                {svc.carousel ? (
                  <>
                    <Carousel
                      images={svc.carousel}
                      adminKeyBase={`srv.${svc.n}.carousel`}
                    />
                    {/* Editable caption */}
                    <EditableText
                      adminKey={`srv.${svc.n}.caption`}
                      tag="p"
                      className="srv-img-caption"
                    >
                      {svc.caption ?? ''}
                    </EditableText>
                  </>
                ) : svc.image ? (
                  <div className={`srv-img-frame${svc.reverse ? ' srv-img-frame-right' : ''}`}>
                    <EditableImage
                      adminKey={`srv.${svc.n}.main-image`}
                      src={svc.image}
                      alt={svc.imageAlt ?? ''}
                      imgStyle={{ display: 'block', width: '100%', height: '100%', objectFit: 'cover' }}
                      wrapperClassName="srv-main-img"
                    />
                    <div className="srv-img-accent-border" />
                  </div>
                ) : null}
              </div>

            </div>
          </div>

          {/* Edit mode helper hint */}
          {editMode && (
            <div style={{
              position: 'absolute', bottom: 8, right: 12,
              fontFamily: 'Barlow Condensed, sans-serif',
              fontSize: 10, letterSpacing: 2, textTransform: 'uppercase',
              color: 'rgba(107,0,0,0.45)',
              pointerEvents: 'none',
            }}>
              ✏️ click text to edit · 📷 click image to replace
            </div>
          )}
        </section>
      ))}

      {/* ── MARQUEE STRIP ── */}
      <div className="srv-marquee-track" aria-hidden="true">
        <div className="srv-marquee-inner">
          {[
            'Civil Works', 'Electrical Systems', 'Architectural Design',
            'Tower Erection', 'Waterproofing', 'Site Development',
            'Structured Cabling', 'Drainage & Sewer', 'Roofing Works',
            'Civil Works', 'Electrical Systems', 'Architectural Design',
            'Tower Erection', 'Waterproofing', 'Site Development',
          ].map((item, i) => (
            <span key={i} className="srv-marquee-item">
              {item}
              <span className="srv-marquee-dot">·</span>
            </span>
          ))}
        </div>
      </div>

      {/* ── CONTACT ── */}
      <section className="contact-section" id="contact">
        <div className="contact-bg-image" />
        <div className="contact-bg-overlay" />
        <div className="contact-inner">
          <p className="section-tag light" style={{ textAlign: 'center' }}>GET IN TOUCH</p>
          <h2 className="contact-heading">Contact Us Today</h2>
          <p className="contact-sub">
            Let's bring your vision to life together. Reach out to discuss your next project.
          </p>
          <div className="contact-cards">
            <div className="contact-card contact-card-wide">
              <img src={emailIcon} alt="Email" className="contact-icon" />
              <p className="contact-card-label">Email Us At</p>
              <a href="mailto:pci1051@yahoo.com.ph" className="contact-card-value link">
                pci1051@yahoo.com.ph
              </a>
              <p className="contact-card-note">We reply within 24 hours</p>
            </div>
            <div className="contact-card">
              <img src={phoneIcon} alt="Phone" className="contact-icon" />
              <p className="contact-card-label">Have Any Questions?</p>
              <p className="contact-card-value">(046) 894-9518</p>
              <p className="contact-card-value">+63 927 572 4505 (Mobile)</p>
            </div>
            <div className="contact-card">
              <img src={clockIcon} alt="Hours" className="contact-icon" />
              <p className="contact-card-label">Working Hours</p>
              <p className="contact-card-value">Mon – Sat<br />8:00 AM – 5:00 PM</p>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}