/**
 * Services.tsx  (Updated — carousel manager popup + save fix)
 *
 * Changes vs previous version:
 *  - Each carousel now has a "🖼 Manage Images" button in edit mode
 *    that opens a full popup showing all carousel photos.
 *    Admin can remove any image or add new ones (uploaded to Firebase).
 *  - CarouselManagerModal stores the live image list via getText/setText
 *    so any changes persist across sessions.
 *  - AddServiceItem now uses local state so newly added items appear
 *    immediately and are persisted to Firestore; font colours match
 *    each section's text theme.
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

import { useAdmin, EditableText, EditableImage, uploadToStorage } from './AdminContext';

// ─────────────────────────────────────────────────────────────
//  Static image arrays (defaults — overridable by admin via popup)
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
//  CAROUSEL MANAGER MODAL
//  Shows all images in a grid; admin can remove any or add new.
//  Changes are persisted via getText/setText as a JSON array.
// ─────────────────────────────────────────────────────────────

interface CarouselManagerProps {
  adminKeyBase:  string;   // e.g. "srv.1.carousel"
  defaultImages: string[];
  onClose:       () => void;
}

function CarouselManagerModal({ adminKeyBase, defaultImages, onClose }: CarouselManagerProps): JSX.Element {
  const { getText, setText } = useAdmin();
  const listKey = `${adminKeyBase}.list`;

  // Load the saved list, falling back to the built-in defaults
  const [images, setImages] = useState<string[]>(() => {
    try {
      const stored = getText(listKey, '');
      return stored ? JSON.parse(stored) : [...defaultImages];
    } catch {
      return [...defaultImages];
    }
  });

  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // Sync images when Firestore data loads/changes (handles the case where
  // the modal was opened before the Firestore snapshot arrived)
  const savedListStr = getText(listKey, '');
  useEffect(() => {
    try {
      const parsed = savedListStr ? JSON.parse(savedListStr) : [...defaultImages];
      setImages(parsed);
    } catch { /**/ }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [savedListStr]);

  // Save new list both locally (instant feedback) and to Firestore
  const persist = async (newImgs: string[]) => {
    setImages(newImgs);
    try {
      await setText(listKey, JSON.stringify(newImgs));
    } catch (err) {
      alert('Save failed: ' + (err as Error).message);
    }
  };

  const handleAdd = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = '';
    setUploading(true);
    try {
      const path = `images/carousel/${adminKeyBase.replace(/\./g, '_')}_${Date.now()}`;
      const url  = await uploadToStorage(path, file);
      await persist([...images, url]);
    } catch (err) {
      alert('Upload failed: ' + (err as Error).message);
    } finally {
      setUploading(false);
    }
  };

  // Close on backdrop click
  const onBackdrop = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      onClick={onBackdrop}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(18,0,0,0.92)',
        zIndex: 99999,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 20, overflowY: 'auto',
      }}
    >
      <div style={{
        background:   '#FDF6EE',
        maxWidth:     880,
        width:        '100%',
        maxHeight:    '90vh',
        overflowY:    'auto',
        padding:      '32px',
        fontFamily:   'Barlow Condensed, sans-serif',
        position:     'relative',
      }}>
        {/* ── Header ── */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
          <div>
            <h2 style={{
              fontFamily: 'Bebas Neue, sans-serif',
              fontSize: 32, color: '#2C1810',
              margin: '0 0 6px', letterSpacing: 2,
            }}>
              MANAGE CAROUSEL IMAGES
            </h2>
            <p style={{ color: 'rgba(44,24,16,0.55)', fontSize: 13, margin: 0, letterSpacing: 1 }}>
              {images.length} image{images.length !== 1 ? 's' : ''} · Click <strong>✕ Remove</strong> to delete · Use <strong>+ Add Photo</strong> to upload new
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              background: 'none', border: 'none',
              fontSize: 22, cursor: 'pointer', color: '#6B0000',
              lineHeight: 1, padding: '4px 8px', flexShrink: 0,
            }}
          >✕</button>
        </div>

        {/* ── Image grid ── */}
        {images.length === 0 ? (
          <div style={{
            padding: '48px 0', textAlign: 'center',
            color: 'rgba(44,24,16,0.4)', fontSize: 14, letterSpacing: 1,
            border: '2px dashed rgba(107,0,0,0.15)', borderRadius: 2,
            marginBottom: 24,
          }}>
            No images yet — add some below.
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: 12,
            marginBottom: 28,
          }}>
            {images.map((img, i) => (
              <div
                key={i}
                style={{
                  position: 'relative', borderRadius: 2,
                  overflow: 'hidden',
                  border: '1px solid rgba(107,0,0,0.14)',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                }}
              >
                <img
                  src={img}
                  alt={`Slide ${i + 1}`}
                  style={{ width: '100%', height: 140, objectFit: 'cover', display: 'block' }}
                />
                <div style={{
                  padding: '8px 10px',
                  background: '#ffffff',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                }}>
                  <span style={{ fontSize: 11, color: 'rgba(44,24,16,0.45)', letterSpacing: 1 }}>
                    Image {i + 1}
                  </span>
                  <button
                    onClick={() => persist(images.filter((_, j) => j !== i))}
                    style={{
                      background: 'rgba(107,0,0,0.88)', color: '#FDF6EE',
                      border: 'none', borderRadius: 2, cursor: 'pointer',
                      fontFamily: 'Barlow Condensed, sans-serif',
                      fontSize: 11, fontWeight: 700, padding: '4px 10px',
                      letterSpacing: 1,
                    }}
                  >
                    ✕ Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Footer actions ── */}
        <div style={{
          display: 'flex', gap: 12, justifyContent: 'space-between',
          alignItems: 'center', flexWrap: 'wrap',
          borderTop: '1px solid rgba(107,0,0,0.12)', paddingTop: 20,
        }}>
          <button
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            style={{
              background: '#6B0000', color: '#FDF6EE',
              border: '2px solid #6B0000',
              fontFamily: 'Barlow Condensed, sans-serif',
              fontSize: 13, fontWeight: 700, letterSpacing: 2,
              textTransform: 'uppercase', padding: '11px 28px',
              cursor: uploading ? 'wait' : 'pointer',
              opacity: uploading ? 0.6 : 1,
              transition: 'all 0.2s',
            }}
          >
            {uploading ? 'Uploading…' : '+ Add Photo'}
          </button>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: '1px solid rgba(107,0,0,0.35)',
              color: 'rgba(44,24,16,0.7)',
              fontFamily: 'Barlow Condensed, sans-serif',
              fontSize: 12, fontWeight: 700, letterSpacing: 2,
              textTransform: 'uppercase', padding: '11px 24px', cursor: 'pointer',
            }}
          >
            Done
          </button>
        </div>

        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleAdd}
        />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
//  CAROUSEL
//  Reads live image list from stored JSON (with fallback to props).
//  In edit mode shows a "Manage Images" button that opens the modal.
// ─────────────────────────────────────────────────────────────

interface CarouselProps {
  images:       string[];  // default / fallback images
  adminKeyBase: string;    // e.g. "srv.1.carousel"
}

function Carousel({ images: defaultImages, adminKeyBase }: CarouselProps): JSX.Element {
  const { editMode, getText } = useAdmin();
  const [current,     setCurrent]     = useState<number>(0);
  const [hovered,     setHovered]     = useState<boolean>(false);
  const [showManager, setShowManager] = useState<boolean>(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Read the live image list; fall back to default images
  const listKey = `${adminKeyBase}.list`;
  const activeImages: string[] = (() => {
    try {
      const stored = getText(listKey, '');
      return stored ? JSON.parse(stored) : defaultImages;
    } catch {
      return defaultImages;
    }
  })();

  // Clamp index when images are removed
  const safeIndex = activeImages.length > 0
    ? Math.min(current, activeImages.length - 1)
    : 0;

  useEffect(() => {
    if (hovered) {
      intervalRef.current = setInterval(() => {
        setCurrent(c => (c + 1) % activeImages.length);
      }, 1200);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [hovered, activeImages.length]);

  if (activeImages.length === 0) {
    return (
      <div className="srv-carousel-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {editMode && (
          <button
            onClick={() => setShowManager(true)}
            style={{
              background: '#6B0000', color: '#FDF6EE',
              border: 'none',
              fontFamily: 'Barlow Condensed, sans-serif',
              fontSize: 12, fontWeight: 700, letterSpacing: 2,
              textTransform: 'uppercase', padding: '10px 20px', cursor: 'pointer',
            }}
          >
            🖼 Add Images
          </button>
        )}
        {showManager && (
          <CarouselManagerModal
            adminKeyBase={adminKeyBase}
            defaultImages={defaultImages}
            onClose={() => setShowManager(false)}
          />
        )}
      </div>
    );
  }

  return (
    <>
      <div
        className="srv-carousel-wrapper"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {activeImages.map((img, i) => (
          <img
            key={`${img}-${i}`}
            src={img}
            alt=""
            className={`srv-carousel-img${i === safeIndex ? ' active' : ''}`}
          />
        ))}

        {/* Progress bar */}
        <div className="srv-carousel-bar">
          <div
            className="srv-carousel-bar-fill"
            style={{ width: `${((safeIndex + 1) / activeImages.length) * 100}%` }}
          />
        </div>

        {/* Dots */}
        <div className="srv-carousel-dots">
          {activeImages.map((_, i) => (
            <span
              key={i}
              className={`srv-dot${i === safeIndex ? ' active' : ''}`}
              onClick={() => setCurrent(i)}
            />
          ))}
        </div>

        {/* Edit mode: manage images button */}
        {editMode && (
          <button
            onClick={() => setShowManager(true)}
            style={{
              position: 'absolute', top: 10, right: 10, zIndex: 10,
              background: 'rgba(107,0,0,0.88)', color: '#FDF6EE',
              border: '1px solid rgba(253,246,238,0.25)',
              fontFamily: 'Barlow Condensed, sans-serif',
              fontSize: 11, fontWeight: 700, letterSpacing: 1.5,
              textTransform: 'uppercase', padding: '6px 12px',
              cursor: 'pointer',
              backdropFilter: 'blur(4px)',
            }}
          >
            🖼 Manage Images
          </button>
        )}
      </div>

      {/* Carousel manager modal */}
      {showManager && (
        <CarouselManagerModal
          adminKeyBase={adminKeyBase}
          defaultImages={defaultImages}
          onClose={() => setShowManager(false)}
        />
      )}
    </>
  );
}

// ─────────────────────────────────────────────────────────────
//  SERVICE EXTRA ITEMS
//
//  Always rendered (not gated behind editMode) so saved items remain
//  visible after the admin exits edit mode.  Edit UI (input row +
//  remove buttons) is shown only while editMode is active.
// ─────────────────────────────────────────────────────────────

function ServiceExtraItems({ svcN, isDark }: { svcN: number; isDark: boolean }) {
  const { editMode, getText, setText } = useAdmin();
  const extraKey = `srv.${svcN}.extra_items`;

  const [extraItems, setExtraItems] = React.useState<string[]>(() => {
    try { return JSON.parse(getText(extraKey, '[]')); } catch { return []; }
  });
  const [inputVal, setInputVal] = React.useState('');
  const [saving,   setSaving]   = React.useState(false);

  // Sync whenever Firestore delivers a new snapshot
  const savedStr = getText(extraKey, '[]');
  React.useEffect(() => {
    if (saving) return;
    try { setExtraItems(JSON.parse(savedStr)); } catch { /**/ }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [savedStr]);

  const persist = async (newItems: string[]) => {
    setExtraItems(newItems); // optimistic
    setSaving(true);
    try {
      await setText(extraKey, JSON.stringify(newItems));
    } catch (err) {
      try { setExtraItems(JSON.parse(getText(extraKey, '[]'))); } catch { /**/ }
      alert('Could not save: ' + (err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const addItem = () => {
    if (!inputVal.trim() || saving) return;
    persist([...extraItems, inputVal.trim()]);
    setInputVal('');
  };

  const removeItem = (idx: number) => persist(extraItems.filter((_, i) => i !== idx));

  // Theme-aware remove button colours
  const removeBg     = isDark ? 'rgba(253,246,238,0.10)' : 'rgba(107,0,0,0.10)';
  const removeColor  = isDark ? 'rgb(92, 64, 51)'  : '#6B0000';
  const removeBorder = isDark ? 'rgb(92, 64, 51)' : 'rgba(107,0,0,0.25)';

  // Input background/border stay theme-aware; text and + button use var(--text-mid)
  const inputBg     = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.9)';
  const inputBorder = isDark ? 'rgba(253,246,238,0.22)' : 'rgba(107,0,0,0.22)';

  return (
    <>
      {/* Always-visible saved items — inherits colour from srv-list CSS */}
      {extraItems.map((item, idx) => (
        <li key={`extra-${idx}`} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ flex: 1, fontFamily: 'Barlow, sans-serif', fontSize: 14 }}>
            {item}
          </span>
          {editMode && (
            <button
              type="button"
              onClick={() => removeItem(idx)}
              disabled={saving}
              style={{
                background: removeBg,
                border: `1px solid ${removeBorder}`,
                color: removeColor,
                cursor: saving ? 'wait' : 'pointer',
                borderRadius: 2,
                fontFamily: 'Barlow Condensed, sans-serif',
                fontSize: 11, fontWeight: 700,
                padding: '2px 7px', flexShrink: 0,
              }}
            >✕</button>
          )}
        </li>
      ))}

      {/* Input row — edit mode only */}
      {editMode && (
        <li style={{ display: 'flex', gap: 8, marginTop: 10, alignItems: 'center' }}>
          <input
            type="text"
            value={inputVal}
            onChange={e => setInputVal(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addItem()}
            placeholder="Add new service item…"
            disabled={saving}
            style={{
              flex: 1,
              background: inputBg,
              border: `1px dashed ${inputBorder}`,
              color: 'var(--text-mid)',
              fontFamily: 'Barlow, sans-serif',
              fontSize: 14,
              padding: '7px 10px',
              outline: 'none',
              opacity: saving ? 0.6 : 1,
            }}
          />
          <button
            type="button"
            onClick={addItem}
            disabled={saving}
            style={{
              background: 'transparent',
              color: 'var(--text-mid)',
              border: '1px solid var(--text-mid)',
              fontFamily: 'Barlow Condensed, sans-serif',
              fontSize: 12, fontWeight: 700,
              letterSpacing: 1.5, textTransform: 'uppercase',
              padding: '8px 14px',
              cursor: saving ? 'wait' : 'pointer',
              flexShrink: 0,
              opacity: saving ? 0.6 : 1,
            }}
          >
            {saving ? '…' : '+ Add'}
          </button>
        </li>
      )}
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
  const { editMode, getText } = useAdmin();
  const siteEmail = getText('site.email', 'pci1051@yahoo.com.ph');

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
                  <ServiceExtraItems svcN={svc.n} isDark={svc.dark} />
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
              ✏️ click text to edit · 🖼 click "Manage Images" to edit carousel
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
              <a href={`mailto:${siteEmail}`} className="contact-card-value link">
                <EditableText adminKey="site.email" tag="span">pci1051@yahoo.com.ph</EditableText>
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