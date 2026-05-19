/**
 * AboutUs.tsx  (Updated — hero slider manager popup)
 *
 * Changes vs previous version:
 *  - Hero slider images are now managed via a popup modal (CarouselManagerModal).
 *    Admin can add new images (uploaded to Firebase) or remove any existing one.
 *    Changes persist via getText/setText as a JSON list.
 *  - The "🖼 Manage Slider" button is shown on the hero slider in edit mode.
 *  - All other behaviour (awards, story, values, animations) is unchanged.
 */

import { useState, useEffect, useRef, useCallback } from "react";
import React from "react";
import "./AboutUs.css";
import NCDC2 from "./CompletedProjects/NCDCORMOC/NCDC2.png";
import NCDC5 from "./CompletedProjects/NCDCORMOC/NCDC5.png";
import NCDC6 from "./CompletedProjects/NCDCORMOC/NCDC6.png";
import email  from './email.png';
import phone  from './phone.png';
import clock  from './clock.png';
import background from './background.png';
import SirBong from './Profiles/SirBong2.jpeg';
import award1 from './Awards/award1.png';
import award2 from './Awards/award2.png';
import award3 from './Awards/award3.png';
import award4 from './Awards/award4.png';
import award5 from './Awards/award5.png';
import award6 from './Awards/award6.png';
import award7 from './Awards/award7.png';
import award8 from './Awards/award8.png';
import award9 from './Awards/award9.png';

import { useAdmin, EditableText, EditableImage, uploadToStorage } from './AdminContext';

// ─────────────────────────────────────────────────────────────
//  DATA
// ─────────────────────────────────────────────────────────────

const DEFAULT_VALUES = [
  {
    num:   "01",
    title: "INTEGRITY",
    text:  "We conduct business with honesty, transparency, and accountability — building long-term relationships based on trust and respect.",
  },
  {
    num:   "02",
    title: "INNOVATE",
    text:  "We apply modern methods, smart technologies, and efficient processes to deliver better results, faster execution, and cost-effective solutions.",
  },
  {
    num:   "03",
    title: "EXCELLENCY",
    text:  "Committed to the highest standards in planning, project management, and construction — ensuring quality workmanship every time.",
  },
  {
    num:   "04",
    title: "TRUSTWORTHINESS",
    text:  "Our clients rely on us for consistency, reliability, and professionalism, knowing that we deliver on our commitments every time.",
  },
];

// Default hero slider images
const DEFAULT_HERO_SLIDER = [NCDC6, NCDC5, NCDC2];

// ─────────────────────────────────────────────────────────────
//  CAROUSEL MANAGER MODAL
//  Shared utility: shows all images in a grid, allows remove & add.
//  Persists changes via getText/setText as a JSON array.
// ─────────────────────────────────────────────────────────────

const HERO_SLIDER_KEY = 'about.hero.slider.list';

interface CarouselManagerProps {
  storageKey:    string;   // key used with getText/setText
  defaultImages: string[];
  onClose:       () => void;
}

function CarouselManagerModal({ storageKey, defaultImages, onClose }: CarouselManagerProps): React.JSX.Element {
  const { getText, setText } = useAdmin();

  const [images, setImages] = useState<string[]>(() => {
    try {
      const stored = getText(storageKey, '');
      return stored ? JSON.parse(stored) : [...defaultImages];
    } catch {
      return [...defaultImages];
    }
  });

  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // Sync images when Firestore data loads/changes (handles the case where
  // the modal was opened before the Firestore snapshot had arrived, or when
  // previously-saved custom images need to be loaded into the modal).
  const savedListStr = getText(storageKey, '');
  useEffect(() => {
    try {
      const parsed = savedListStr ? JSON.parse(savedListStr) : [...defaultImages];
      setImages(parsed);
    } catch { /**/ }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [savedListStr]);

  const persist = async (newImgs: string[]) => {
    setImages(newImgs);
    try {
      await setText(storageKey, JSON.stringify(newImgs));
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
      const path = `images/slider/${storageKey.replace(/\./g, '_')}_${Date.now()}`;
      const url  = await uploadToStorage(path, file);
      await persist([...images, url]);
    } catch (err) {
      alert('Upload failed: ' + (err as Error).message);
    } finally {
      setUploading(false);
    }
  };

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
        background:  '#FDF6EE',
        maxWidth:    880,
        width:       '100%',
        maxHeight:   '90vh',
        overflowY:   'auto',
        padding:     '32px',
        fontFamily:  'Barlow Condensed, sans-serif',
        position:    'relative',
      }}>
        {/* ── Header ── */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
          <div>
            <h2 style={{
              fontFamily: 'Bebas Neue, sans-serif',
              fontSize: 32, color: '#2C1810',
              margin: '0 0 6px', letterSpacing: 2,
            }}>
              MANAGE SLIDER IMAGES
            </h2>
            <p style={{ color: 'rgba(44,24,16,0.55)', fontSize: 13, margin: 0, letterSpacing: 1 }}>
              {images.length} image{images.length !== 1 ? 's' : ''} · Click <strong>✕ Remove</strong> to delete · Use <strong>+ Add Photo</strong> to upload
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
//  COMPONENT
// ─────────────────────────────────────────────────────────────

function AboutUs() {
  const { getText, setText, editMode, isAdmin, uploading: adminUploading } = useAdmin();

  // ── Awards state ──────────────────────────────────────────
  const staticAwards = [award1, award2, award3, award4, award5, award6, award7, award8, award9];

  const getRemovedIndices = (): number[] => {
    try { return JSON.parse(getText('about.awards.removed', '[]')); } catch { return []; }
  };
  const getExtraAwardUrls = (): string[] => {
    try { return JSON.parse(getText('about.awards.extra', '[]')); } catch { return []; }
  };

  const removedIndices = getRemovedIndices();
  const extraAwardUrls = getExtraAwardUrls();

  const allAwards: string[] = [
    ...staticAwards.filter((_, i) => !removedIndices.includes(i)),
    ...extraAwardUrls,
  ];

  const [awardUploading, setAwardUploading] = useState(false);
  const awardFileRef = useRef<HTMLInputElement>(null);

  const handleAddAward = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = '';
    setAwardUploading(true);
    try {
      const url = await uploadToStorage(`images/awards/${Date.now()}`, file);
      const current = getExtraAwardUrls();
      await setText('about.awards.extra', JSON.stringify([...current, url]));
    } catch (err) {
      alert('Upload failed: ' + (err as Error).message);
    } finally {
      setAwardUploading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getText, setText]);

  const handleRemoveAward = useCallback(async (displayIndex: number) => {
    if (!window.confirm('Remove this award?')) return;
    const keptStatic = staticAwards.map((_, i) => i).filter(i => !removedIndices.includes(i));
    if (displayIndex < keptStatic.length) {
      const staticIdx = keptStatic[displayIndex];
      await setText('about.awards.removed', JSON.stringify([...removedIndices, staticIdx]));
    } else {
      const extraIdx = displayIndex - keptStatic.length;
      const current  = getExtraAwardUrls();
      await setText('about.awards.extra', JSON.stringify(current.filter((_, i) => i !== extraIdx)));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getText, setText, removedIndices]);

  // ── Hero slider state ─────────────────────────────────────
  // Reads from stored JSON list; falls back to the three built-in images.
  const getHeroImages = (): string[] => {
    try {
      const stored = getText(HERO_SLIDER_KEY, '');
      return stored ? JSON.parse(stored) : [...DEFAULT_HERO_SLIDER];
    } catch {
      return [...DEFAULT_HERO_SLIDER];
    }
  };

  const heroSliderImages = getHeroImages();
  const [currentIndex,  setCurrentIndex]  = useState(0);
  const [showSliderMgr, setShowSliderMgr] = useState(false);
  const [activeValue,   setActiveValue]   = useState(0);

  const [awardIndex,  setAwardIndex]  = useState(0);
  const [awardPaused, setAwardPaused] = useState(false);
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);
  const [isDragging,  setIsDragging]  = useState(false);
  const dragStartX = useRef(0);
  const dragDelta  = useRef(0);
  const visibleCount  = 3;
  const maxAwardIndex = Math.max(0, allAwards.length - visibleCount);

  const prevAward = () => setAwardIndex((prev) => Math.max(prev - 1, 0));
  const nextAward = () => setAwardIndex((prev) => Math.min(prev + 1, maxAwardIndex));

  // Auto-advance awards
  useEffect(() => {
    if (awardPaused) return;
    const id = setInterval(() => {
      setAwardIndex(prev => (prev >= maxAwardIndex ? 0 : prev + 1));
    }, 3200);
    return () => clearInterval(id);
  }, [awardPaused, maxAwardIndex]);

  // Lightbox keyboard close
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setLightboxImg(null); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Drag handlers for awards
  const onDragStart = (clientX: number) => {
    setIsDragging(true);
    dragStartX.current = clientX;
    dragDelta.current  = 0;
  };
  const onDragMove = (clientX: number) => {
    if (!isDragging) return;
    dragDelta.current = clientX - dragStartX.current;
  };
  const onDragEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    if (dragDelta.current < -50) nextAward();
    else if (dragDelta.current > 50) prevAward();
    dragDelta.current = 0;
  };

  // Hero slider auto-advance
  useEffect(() => {
    if (heroSliderImages.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev >= heroSliderImages.length - 1 ? 0 : prev + 1));
    }, 3000);
    return () => clearInterval(interval);
  }, [heroSliderImages.length]);

  // Clamp currentIndex when images are removed
  const safeIndex = heroSliderImages.length > 0
    ? Math.min(currentIndex, heroSliderImages.length - 1)
    : 0;

  useEffect(() => {
    document.body.style.backgroundColor = "#FDF6EE";
    return () => { document.body.style.backgroundColor = ""; };
  }, []);

  // Core values with admin overrides
  const values = DEFAULT_VALUES.map((v, i) => ({
    ...v,
    text: getText(`about.values.${i}.text`, v.text),
  }));

  return (
    <div className="abt-page">

      {/* ── HERO ── */}
      <section className="abt-hero">
        <div className="abt-hero-left">
          <div className="abt-hero-left-inner">
            <p className="abt-eyebrow">Est. 1993 · PCAB Licensed · General "A"</p>
            <h1 className="abt-hero-title">
              <span className="abt-ht-line">CHANGING</span>
              <span className="abt-ht-line">THE WORLD</span>
              <span className="abt-ht-line">THROUGH</span>
              <span className="abt-ht-line">BUILDING</span>
              <span className="abt-ht-line abt-ht-accent">BETTER</span>
              <span className="abt-ht-line abt-ht-accent">COMMUNITIES.</span>
            </h1>
            <div className="abt-hero-divider" />
            <EditableText
              adminKey="about.hero.sub"
              tag="p"
              className="abt-hero-sub"
            >
              Pythagoras Construction, Inc. is a SEC-registered general contracting firm
              established in 1993, providing construction and allied maintenance services
              to both government and private clients.
            </EditableText>
            <div className="abt-hero-stats">
              <div className="abt-stat">
                <div className="abt-stat-num">30+</div>
                <div className="abt-stat-label">Years of Excellence</div>
              </div>
              <div className="abt-stat-divider" />
              <div className="abt-stat">
                <div className="abt-stat-num">100+</div>
                <div className="abt-stat-label">Workers</div>
              </div>
              <div className="abt-stat-divider" />
              <div className="abt-stat">
                <div className="abt-stat-num">20+</div>
                <div className="abt-stat-label">Clients Nationwide</div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Hero slider — managed via popup in edit mode ── */}
        <div className="abt-hero-right">
          <div className="abt-hero-slider" style={{ position: 'relative' }}>
            <div
              className="abt-hero-track"
              style={{ transform: `translateX(-${safeIndex * 100}%)` }}
            >
              {heroSliderImages.map((img, i) => (
                <div
                  key={`${img}-${i}`}
                  style={{
                    flexShrink: 0, width: '100%', height: '100%',
                  }}
                >
                  <img
                    src={img}
                    alt={`Project ${i + 1}`}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                </div>
              ))}
            </div>

            {/* Slide counter */}
            <div className="abt-slide-counter">
              <span className="abt-counter-current">{String(safeIndex + 1).padStart(2, '0')}</span>
              <span className="abt-counter-sep" />
              <span className="abt-counter-total">{String(heroSliderImages.length).padStart(2, '0')}</span>
            </div>

            {/* Dots */}
            <div className="abt-slider-dots">
              {heroSliderImages.map((_, i) => (
                <button
                  key={i}
                  className={`abt-dot${i === safeIndex ? ' abt-dot-active' : ''}`}
                  onClick={() => setCurrentIndex(i)}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>

            <div className="abt-hero-slider-footer">
              <span>Our Projects</span>
              <a href="/projects" className="abt-visit-chip">View All →</a>
            </div>

            {/* ── Edit mode: manage slider button ── */}
            {editMode && (
              <button
                onClick={() => setShowSliderMgr(true)}
                style={{
                  position: 'absolute', top: 10, left: 10, zIndex: 10,
                  background: 'rgba(107,0,0,0.88)', color: '#FDF6EE',
                  border: '1px solid rgba(253,246,238,0.25)',
                  fontFamily: 'Barlow Condensed, sans-serif',
                  fontSize: 11, fontWeight: 700, letterSpacing: 1.5,
                  textTransform: 'uppercase', padding: '6px 12px',
                  cursor: 'pointer',
                  backdropFilter: 'blur(4px)',
                }}
              >
                🖼 Manage Slider
              </button>
            )}
          </div>
          <div className="abt-hero-accent-bar" />
        </div>
      </section>

      {/* Slider manager modal */}
      {showSliderMgr && (
        <CarouselManagerModal
          storageKey={HERO_SLIDER_KEY}
          defaultImages={DEFAULT_HERO_SLIDER}
          onClose={() => setShowSliderMgr(false)}
        />
      )}

      {/* ── WHO WE ARE ── */}
      <section className="abt-who-section">
        <div className="abt-who-inner">
          <div className="abt-who-header">
            <p className="abt-section-tag">WHO WE ARE</p>
            <h2 className="abt-who-heading">OUR FOUNDATION</h2>
          </div>
          <div className="abt-who-panels">
            <div className="abt-who-panel abt-panel-dark">
              <div className="abt-panel-number">01</div>
              <h3 className="abt-panel-title">Our Mission</h3>
              <EditableText adminKey="about.mission.text" tag="p" className="abt-panel-text">
                Deliver quality and timely completed projects, strive for excellence in
                project management, be innovative in our methods, and develop our employees
                to be result-oriented, innovative, and motivated.
              </EditableText>
            </div>
            <div className="abt-who-panel abt-panel-red">
              <div className="abt-panel-number">02</div>
              <h3 className="abt-panel-title">Our Vision</h3>
              <EditableText adminKey="about.vision.text" tag="p" className="abt-panel-text">
                To be a globally competitive construction firm trusted by clients, suppliers,
                and employees — where they are treated as business partners and family members.
              </EditableText>
            </div>
            <div className="abt-who-panel abt-panel-light">
              <div className="abt-panel-number">03</div>
              <h3 className="abt-panel-title">Core Values</h3>
              <EditableText adminKey="about.corevalues.text" tag="p" className="abt-panel-text">
                Committed to conducting business with integrity, excellence, trustworthiness,
                innovation, and strict adherence to the law and safety protocols in everything we do.
              </EditableText>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOUNDER STORY ── */}
      <section className="abt-founder-section">
        <div className="abt-founder-inner">
          <div className="abt-founder-media">
            <div className="abt-founder-photo-wrap">
              <EditableImage
                adminKey="about.founder.photo"
                src={SirBong}
                alt="Founder"
                wrapperClassName="abt-founder-photo"
                imgStyle={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                style={{ display: 'block' }}
              />
              <div className="abt-founder-photo-accent" />
            </div>
            <div className="abt-founder-quote-strip">
              <span className="abt-quote-mark">"</span>
              <EditableText adminKey="about.founder.quote" tag="p" className="abt-quote-text">
                Building is not just about structures — it is about leaving a legacy for the next generation.
              </EditableText>
              <p className="abt-quote-attr">— Founder, Pythagoras Construction, Inc.</p>
            </div>
          </div>

          <div className="abt-founder-content">
            <p className="abt-section-tag">OUR STORY</p>
            <h2 className="abt-founder-heading">ENGR. FERDINAND GARDUQUE</h2>
            <div className="abt-founder-divider" />
            <EditableText adminKey="about.story.p1" tag="p" className="abt-founder-body">
              Pythagoras Construction, Inc. was founded in 1993 with a singular purpose: to build
              structures that stand the test of time while uplifting the communities they serve.
              What began as a small contracting venture grew steadily through decades of hard work,
              discipline, and an unwavering commitment to quality.
            </EditableText>
            <EditableText adminKey="about.story.p2" tag="p" className="abt-founder-body">
              The founder envisioned a construction firm where craftsmanship, integrity, and
              innovation go hand in hand — a company that treats every client project as if it were
              their own. From humble beginnings, Pythagoras Construction built its reputation
              project by project, client by client, earning the trust of both government agencies
              and private institutions across the country.
            </EditableText>
            <EditableText adminKey="about.story.p3" tag="p" className="abt-founder-body">
              Today, with PCAB General "A" licensure and over 30 years of proven track record,
              the company continues to honor that founding vision — building not just structures,
              but better communities.
            </EditableText>
            <div className="abt-founder-badge-row">
              <div className="abt-founder-badge">
                <span className="abt-badge-year">1993</span>
                <span className="abt-badge-label">Year Founded</span>
              </div>
              <div className="abt-founder-badge">
                <span className="abt-badge-year">SEC</span>
                <span className="abt-badge-label">Registered</span>
              </div>
              <div className="abt-founder-badge">
                <span className="abt-badge-year">PCAB</span>
                <span className="abt-badge-label">General "A"</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CORE VALUES ── */}
      <section className="abt-values-section">
        <div className="abt-values-inner">
          <div className="abt-values-header">
            <p className="abt-section-tag">WHAT DRIVES US</p>
            <h2 className="abt-values-heading">CORE VALUES</h2>
          </div>
          <div className="abt-values-layout">
            <div className="abt-values-tabs">
              {values.map((v, i) => (
                <button
                  key={i}
                  className={`abt-value-tab${activeValue === i ? ' abt-tab-active' : ''}`}
                  onClick={() => setActiveValue(i)}
                >
                  <span className="abt-tab-num">{v.num}</span>
                  <span className="abt-tab-title">{v.title}</span>
                  <span className="abt-tab-arrow">{activeValue === i ? '↓' : '→'}</span>
                </button>
              ))}
            </div>
            <div className="abt-values-panel">
              <div className="abt-values-panel-num">{values[activeValue].num}</div>
              <h3 className="abt-values-panel-title">{values[activeValue].title}</h3>
              <EditableText
                adminKey={`about.values.${activeValue}.text`}
                tag="p"
                className="abt-values-panel-text"
              >
                {DEFAULT_VALUES[activeValue].text}
              </EditableText>
              <div className="abt-values-panel-line" />
            </div>
          </div>
        </div>
      </section>

      {/* ── AWARDS ── */}
      <section className="abt-awards-section">
        {lightboxImg && (
          <div className="abt-lightbox" onClick={() => setLightboxImg(null)}>
            <button className="abt-lightbox-close" aria-label="Close">✕</button>
            <div className="abt-lightbox-frame" onClick={(e) => e.stopPropagation()}>
              <img src={lightboxImg} alt="Award" className="abt-lightbox-img" />
            </div>
          </div>
        )}

        <div className="abt-awards-inner">
          <div className="abt-awards-header">
            <p className="abt-section-tag">RECOGNITION & HONORS</p>
            <h2 className="abt-awards-heading">AWARDS</h2>
            <div className="abt-awards-heading-bar" />
            <p className="abt-awards-subtext">
              Proud recipients of recognition across multiple years —
              a testament to our consistent performance and partnership.
            </p>
          </div>

          <div
            className="abt-awards-slider-root"
            onMouseEnter={() => setAwardPaused(true)}
            onMouseLeave={() => setAwardPaused(false)}
            onMouseDown={(e) => onDragStart(e.clientX)}
            onMouseMove={(e) => onDragMove(e.clientX)}
            onMouseUp={onDragEnd}
            onTouchStart={(e) => onDragStart(e.touches[0].clientX)}
            onTouchMove={(e) => onDragMove(e.touches[0].clientX)}
            onTouchEnd={onDragEnd}
          >
            <div className="abt-awards-progress-bar">
              <div
                className="abt-awards-progress-fill"
                style={{ width: `${((awardIndex + visibleCount) / allAwards.length) * 100}%` }}
              />
            </div>

            <div className="abt-awards-controls">
              <span className="abt-awards-counter">
                <span className="abt-awards-counter-cur">
                  {String(awardIndex + 1).padStart(2, '0')}–{String(Math.min(awardIndex + visibleCount, allAwards.length)).padStart(2, '0')}
                </span>
                <span className="abt-awards-counter-sep" />
                <span className="abt-awards-counter-tot">{String(allAwards.length).padStart(2, '0')}</span>
              </span>
              <div className="abt-awards-arrows">
                <button className="abt-awards-arrow" onClick={prevAward} disabled={awardIndex === 0} aria-label="Previous">←</button>
                <button className="abt-awards-arrow" onClick={nextAward} disabled={awardIndex === maxAwardIndex} aria-label="Next">→</button>
              </div>
            </div>

            <div className="abt-awards-viewport">
              <div
                className="abt-awards-track"
                style={{ transform: `translateX(-${awardIndex * (100 / visibleCount)}%)` }}
              >
                {allAwards.map((img, i) => (
                  <div key={i} className="abt-award-card" style={{ position: 'relative' }}>
                    <button
                      className="abt-award-img-wrap"
                      onClick={() => !editMode && setLightboxImg(img)}
                      aria-label={`View award ${i + 1} in full`}
                      style={{ cursor: editMode ? 'default' : 'pointer' }}
                    >
                      <img src={img} alt={`Award ${i + 1}`} className="abt-award-img" draggable={false} />
                      {!editMode && (
                        <div className="abt-award-overlay">
                          <span className="abt-award-zoom-icon">⊕</span>
                        </div>
                      )}
                    </button>
                    {editMode && (
                      <button
                        type="button"
                        onClick={() => handleRemoveAward(i)}
                        style={{
                          position: 'absolute', top: 6, right: 6, zIndex: 10,
                          background: 'rgba(107,0,0,0.85)', color: '#FDF6EE',
                          border: 'none', borderRadius: 2, cursor: 'pointer',
                          fontFamily: 'Barlow Condensed, sans-serif',
                          fontSize: 11, fontWeight: 700, padding: '3px 8px',
                        }}
                      >
                        ✕ Remove
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="abt-awards-dots">
              {Array.from({ length: maxAwardIndex + 1 }).map((_, i) => (
                <button
                  key={i}
                  className={`abt-awards-dot${awardIndex === i ? ' abt-awards-dot-active' : ''}`}
                  onClick={() => setAwardIndex(i)}
                  aria-label={`Go to group ${i + 1}`}
                />
              ))}
            </div>

            {/* Add award button — edit mode only */}
            {editMode && (
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: 20 }}>
                <button
                  type="button"
                  onClick={() => awardFileRef.current?.click()}
                  disabled={awardUploading}
                  style={{
                    background: '#6B0000', color: '#FDF6EE',
                    border: '2px solid #6B0000',
                    fontFamily: 'Barlow Condensed, sans-serif',
                    fontSize: 13, fontWeight: 700, letterSpacing: 2,
                    textTransform: 'uppercase', padding: '11px 28px',
                    cursor: awardUploading ? 'wait' : 'pointer',
                    opacity: awardUploading ? 0.6 : 1,
                    transition: 'all 0.2s',
                  }}
                >
                  {awardUploading ? 'Uploading…' : '+ Add Award'}
                </button>
                <input
                  ref={awardFileRef}
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handleAddAward}
                />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section className="abt-contact-section" id="contact">
        <div className="abt-contact-bg" style={{ backgroundImage: `url(${background})` }} />
        <div className="abt-contact-overlay" />
        <div className="abt-contact-inner">
          <p className="abt-section-tag abt-tag-light" style={{ textAlign: 'center' }}>GET IN TOUCH</p>
          <h2 className="abt-contact-heading">Contact Us Today</h2>
          <p className="abt-contact-sub">Let's bring your vision to life together.</p>
          <div className="abt-contact-cards">
            <div className="abt-contact-card abt-card-wide">
              <img src={email} alt="Email" className="abt-contact-icon" />
              <p className="abt-contact-label">Email Us At</p>
              <a href="mailto:pci1051@yahoo.com.ph" className="abt-contact-value abt-link">pci1051@yahoo.com.ph</a>
              <p className="abt-contact-note">We reply within 24 hours</p>
            </div>
            <div className="abt-contact-card">
              <img src={phone} alt="Phone" className="abt-contact-icon" />
              <p className="abt-contact-label">Have Any Questions?</p>
              <p className="abt-contact-value">(046) 894-9518 / (046) 238-4166</p>
              <p className="abt-contact-value">+63 927 572 4505 (Mobile)</p>
            </div>
            <div className="abt-contact-card">
              <img src={clock} alt="Hours" className="abt-contact-icon" />
              <p className="abt-contact-label">Working Hours</p>
              <p className="abt-contact-value">Mon – Sat<br />8:00 AM – 5:00 PM</p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

export default AboutUs;