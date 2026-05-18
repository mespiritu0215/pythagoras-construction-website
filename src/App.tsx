/**
 * App.tsx  (v3 — admin fixes)
 *
 * Fixes:
 *  - AppInner now calls useAdmin() so edit-mode state is accessible
 *  - "Recently Completed" projects are driven by featuredProjectIds from
 *    Firestore — admin can choose which projects appear via a picker modal
 *  - About-strip description is now editable (split into company name
 *    bold span + EditableText for the rest)
 *  - Contact section labels/values wrapped with EditableText
 *  - useMemo added to efficiently derive displayedProjects
 */
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import React, { useState, useEffect, useRef, useMemo, JSX } from 'react';
import logo from './logo.png';
import './App.css';
import emailIcon from './email.png';
import phoneIcon  from './phone.png';
import clockIcon  from './clock.png';
import AboutUs    from './AboutUs';
import Services   from './Services';
import Projects   from './Projects';
import Contact    from './ContactUs';
import ProjectDetails from './ProjectDetails';
import { HashRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import TEAMBUILDING from "./CompletedProjects/pages/TEAMBUILDING.png";
import HeroImg1 from "./CompletedProjects/NCDCORMOC/NCDC1.png";
import HeroImg2 from "./CompletedProjects/PoiFestonSanAndres/PoiFestonSanAndres1.png";
import HeroImg3 from "./CompletedProjects/BADOC/Badoc1.png";
import HeroImg4 from "./CompletedProjects/NCDCORMOC/NCDC2.png";
import HeroImg5 from "./CompletedProjects/pages/TEAMBUILDING.png";

import { FEATURED_PROJECTS, ALL_PROJECTS } from './Projectsdata';
import { AdminProvider, EditableText, EditableImage, useAdmin } from './AdminContext';
import { AdminBar } from './AdminBar';

const firebaseConfig = {
  apiKey: "AIzaSyD2H-AoQapaapnjz0ApdTPBIBWSCY9kTeo",
  authDomain: "pci-website-ffd0a.firebaseapp.com",
  projectId: "pci-website-ffd0a",
  storageBucket: "pci-website-ffd0a.firebasestorage.app",
  messagingSenderId: "456963084749",
  appId: "1:456963084749:web:0adedcf546dec892f9b484",
  measurementId: "G-NDR19V6EV8"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// ── Hero showcase images ─────────────────────────────────────
const HERO_SLIDES = [
  { img: HeroImg2, label: "Architectural",      title: "San Andres POI Festoon", sub: "San Andres, Catanduanes" },
  { img: HeroImg3, label: "Architectural",      title: "Badoc POI Festoon",      sub: "Badoc, Ilocos Norte" },
  { img: HeroImg4, label: "Civil Works",         title: "NCDC Ormoc",             sub: "New Core Data Center · Globe · Leyte" },
  { img: HeroImg1, label: "Civil Works",         title: "NCDC Ormoc",             sub: "Core Data Center · Globe · Ormoc, Leyte" },
  { img: HeroImg5, label: "Teamwork in Action",  title: "PCI Team Building",      sub: undefined },
];

// ── Who We Are section images ────────────────────────────────
const whoImg1 = ALL_PROJECTS[2]?.images[4] ?? ALL_PROJECTS[0].cover;
const whoImg2 = ALL_PROJECTS[2]?.images[5] ?? ALL_PROJECTS[0].cover;

// ─────────────────────────────────────────────────────────────
//  HELPERS
// ─────────────────────────────────────────────────────────────

function ScrollToTop(): null {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

// ─────────────────────────────────────────────────────────────
//  HERO SECTION (unchanged)
// ─────────────────────────────────────────────────────────────

function HeroSection() {
  const [current, setCurrent]     = useState(0);
  const [prev,    setPrev]        = useState<number | null>(null);
  const [transitioning, setTrans] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goTo = (next: number) => {
    if (transitioning || next === current) return;
    setPrev(current);
    setTrans(true);
    setTimeout(() => { setCurrent(next); setPrev(null); setTrans(false); }, 800);
  };

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCurrent(c => {
        const next = (c + 1) % HERO_SLIDES.length;
        setPrev(c);
        setTrans(true);
        setTimeout(() => { setPrev(null); setTrans(false); }, 800);
        return next;
      });
    }, 5000);
  };

  useEffect(() => {
    startTimer();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDot = (i: number) => {
    if (timerRef.current) clearInterval(timerRef.current);
    goTo(i);
    startTimer();
  };

  const slide = HERO_SLIDES[current];

  return (
    <section className="hero-showcase">
      {HERO_SLIDES.map((s, i) => (
        <div
          key={i}
          className={`hs-bg-layer ${i === current ? 'hs-bg-active' : ''} ${i === prev ? 'hs-bg-prev' : ''}`}
          style={{ backgroundImage: `url(${s.img})` }}
        />
      ))}
      <div className="hs-overlay" />
      <div className="hs-deco-line hs-deco-line-v" />
      <div className="hs-deco-line hs-deco-line-h" />

      <div className="hs-content">
        <div className="hs-content-inner">
          <p className="hs-eyebrow">Est. 1993 · PCAB Licensed · General "A"</p>
          <h1 className="hs-headline">
            <span className="hs-hl-line">BUILDING</span>
            <span className="hs-hl-line">WITH PURPOSE.</span>
            <span className="hs-hl-line">DELIVERING WITH</span>
            <span className="hs-hl-line hs-hl-accent">EXCELLENCE.</span>
          </h1>
          <p className="hs-sub">
            Trusted general contractor delivering comprehensive civil, electrical,
            and design services across the Philippines since 1993.
          </p>
          <div className="hs-cta-row">
            <a href="#contact" className="hs-btn-primary">Book an Appointment</a>
            <Link to="/projects" className="hs-btn-ghost">View Our Projects →</Link>
          </div>
        </div>
      </div>

      <div className={`hs-project-tag ${transitioning ? 'hs-tag-out' : 'hs-tag-in'}`}>
        <span className="hs-tag-label">{slide.label}</span>
        <p className="hs-tag-title">{slide.title}</p>
        {slide.sub && <p className="hs-tag-sub">{slide.sub}</p>}
      </div>

      <div className="hs-controls">
        <div className="hs-progress-bar">
          <div className="hs-progress-fill" key={current} style={{ animation: 'progressFill 5s linear forwards' }} />
        </div>
        <div className="hs-dots">
          {HERO_SLIDES.map((_, i) => (
            <button key={i} className={`hs-dot ${i === current ? 'hs-dot-active' : ''}`} onClick={() => handleDot(i)} aria-label={`Slide ${i + 1}`} />
          ))}
        </div>
        <div className="hs-counter">
          <span className="hs-count-cur">{String(current + 1).padStart(2, '0')}</span>
          <span className="hs-count-sep" />
          <span className="hs-count-tot">{String(HERO_SLIDES.length).padStart(2, '0')}</span>
        </div>
      </div>

      <div className="hs-stats">
        <div className="hs-stat">
          <div className="hs-stat-num">30+</div>
          <div className="hs-stat-label">Years of Excellence</div>
        </div>
        <div className="hs-stat-div" />
        <div className="hs-stat">
          <div className="hs-stat-num">100+</div>
          <div className="hs-stat-label">Construction Workers</div>
        </div>
        <div className="hs-stat-div" />
        <div className="hs-stat">
          <div className="hs-stat-num">PCAB</div>
          <div className="hs-stat-label">General "A" Licensed</div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
//  FEATURED PROJECT PICKER MODAL
//  Lets admin choose which projects appear in the "Recently
//  Completed" section on the homepage. Selection is persisted
//  to Firestore via setFeaturedProjectIds.
// ─────────────────────────────────────────────────────────────

function FeaturedProjectPicker({ onClose }: { onClose: () => void }) {
  const {
    adminProjects,
    deletedProjectIds,
    projectOverrides,
    featuredProjectIds,
    setFeaturedProjectIds,
  } = useAdmin();

  // Build the full list of selectable projects (static + admin-added)
  const allAvailable = useMemo(() => {
    const staticOnes = ALL_PROJECTS
      .filter(p => !deletedProjectIds.includes(p.id))
      .map(p => {
        const ov = projectOverrides[String(p.id)];
        return {
          id:       String(p.id),
          title:    ov?.title    ?? p.title,
          cover:    ov?.cover    ?? p.cover,
          category: (p as any).category ?? '',
        };
      });
    const adminOnes = adminProjects.map(p => ({
      id:       String(p.id),
      title:    p.title,
      cover:    p.cover,
      category: p.category,
    }));
    return [...staticOnes, ...adminOnes];
  }, [adminProjects, deletedProjectIds, projectOverrides]);

  // Initialise selection from Firestore or fall back to current FEATURED_PROJECTS
  const [selected, setSelected] = useState<string[]>(() =>
    featuredProjectIds.length > 0
      ? featuredProjectIds
      : FEATURED_PROJECTS.map(p => String(p.id))
  );
  const [saving, setSaving] = useState(false);

  const toggle = (id: string) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await setFeaturedProjectIds(selected);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  // Close on backdrop click
  const handleBackdrop = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      onClick={handleBackdrop}
      style={{
        position:       'fixed', inset: 0,
        background:     'rgba(18,0,0,0.88)',
        zIndex:         99998,
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'center',
        padding:        '20px',
        overflowY:      'auto',
      }}
    >
      <div style={{
        background:   '#FDF6EE',
        maxWidth:     960,
        width:        '100%',
        maxHeight:    '88vh',
        overflowY:    'auto',
        padding:      '32px',
        fontFamily:   'Barlow Condensed, sans-serif',
        position:     'relative',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
          <div>
            <h2 style={{
              fontFamily:    'Bebas Neue, sans-serif',
              fontSize:      36, color: '#2C1810',
              margin:        '0 0 6px', letterSpacing: 2,
            }}>
              CHOOSE FEATURED PROJECTS
            </h2>
            <p style={{ color: 'rgba(44,24,16,0.55)', fontSize: 13, margin: 0, letterSpacing: 1 }}>
              {selected.length} selected · These appear in the "Recently Completed" section on the homepage
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none', border: 'none',
              fontSize: 22, cursor: 'pointer', color: '#6B0000',
              lineHeight: 1, padding: '4px 8px', flexShrink: 0,
            }}
            aria-label="Close"
          >✕</button>
        </div>

        {/* Project grid */}
        {allAvailable.length === 0 ? (
          <p style={{ color: 'rgba(44,24,16,0.5)', fontSize: 14, textAlign: 'center', padding: '40px 0' }}>
            No projects available yet.
          </p>
        ) : (
          <div style={{
            display:             'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
            gap:                 16,
            marginBottom:        28,
          }}>
            {allAvailable.map(p => {
              const isSel = selected.includes(p.id);
              return (
                <div
                  key={p.id}
                  onClick={() => toggle(p.id)}
                  style={{
                    cursor:      'pointer',
                    border:      isSel ? '3px solid #6B0000' : '2px solid rgba(107,0,0,0.15)',
                    borderRadius: 2,
                    overflow:    'hidden',
                    position:    'relative',
                    transition:  'border-color 0.2s, box-shadow 0.2s',
                    boxShadow:   isSel ? '0 4px 16px rgba(107,0,0,0.20)' : 'none',
                    userSelect:  'none',
                  }}
                >
                  {/* Cover image */}
                  <div style={{ position: 'relative', paddingTop: '65%' }}>
                    <img
                      src={p.cover}
                      alt={p.title}
                      style={{
                        position: 'absolute', inset: 0,
                        width: '100%', height: '100%', objectFit: 'cover',
                        display: 'block',
                      }}
                    />
                    {/* Selection overlay */}
                    {isSel && (
                      <div style={{
                        position:       'absolute', inset: 0,
                        background:     'rgba(107,0,0,0.38)',
                        display:        'flex',
                        alignItems:     'center',
                        justifyContent: 'center',
                      }}>
                        <div style={{
                          width:          32, height: 32,
                          borderRadius:   '50%',
                          background:     '#6B0000',
                          color:          '#FDF6EE',
                          display:        'flex',
                          alignItems:     'center',
                          justifyContent: 'center',
                          fontSize:       18, fontWeight: 700,
                        }}>✓</div>
                      </div>
                    )}
                  </div>

                  {/* Footer */}
                  <div style={{
                    padding:    '8px 10px 10px',
                    background: isSel ? 'rgba(107,0,0,0.04)' : '#FFFFFF',
                  }}>
                    <p style={{
                      fontSize:      10, letterSpacing: 2,
                      color:         '#6B0000', margin: '0 0 2px',
                      textTransform: 'uppercase',
                    }}>{p.category}</p>
                    <p style={{
                      fontSize:     13, fontWeight: 700,
                      color:        '#2C1810', margin: 0,
                      letterSpacing: 0.5,
                      whiteSpace:   'nowrap', overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}>{p.title}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
          <button
            onClick={() => setSelected(FEATURED_PROJECTS.map(p => String(p.id)))}
            style={{
              background: 'transparent', border: '1px solid rgba(107,0,0,0.3)',
              color: 'rgba(44,24,16,0.6)', fontFamily: 'Barlow Condensed, sans-serif',
              fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase',
              padding: '10px 20px', cursor: 'pointer',
            }}
            type="button"
          >Reset to Default</button>
          <button
            onClick={onClose}
            style={{
              background: 'transparent', border: '1px solid rgba(107,0,0,0.4)',
              color: 'rgba(44,24,16,0.7)', fontFamily: 'Barlow Condensed, sans-serif',
              fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase',
              padding: '10px 24px', cursor: 'pointer',
            }}
            type="button"
          >Cancel</button>
          <button
            onClick={handleSave}
            disabled={saving}
            style={{
              background: saving ? 'rgba(107,0,0,0.6)' : '#6B0000',
              border: '1px solid #6B0000',
              color: '#FDF6EE', fontFamily: 'Barlow Condensed, sans-serif',
              fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase',
              padding: '10px 28px', cursor: saving ? 'wait' : 'pointer',
              transition: 'background 0.2s',
            }}
            type="button"
          >{saving ? 'Saving…' : 'Save Selection'}</button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
//  APP INNER
// ─────────────────────────────────────────────────────────────

function AppInner(): JSX.Element {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [scrolled, setScrolled] = useState<boolean>(false);
  const [showPicker, setShowPicker] = useState(false);

  // Pull admin state so the home page can react to edit mode
  const {
    isAdmin,
    editMode,
    featuredProjectIds,
    deletedProjectIds,
    projectOverrides,
    adminProjects,
  } = useAdmin();

  useEffect(() => {
    const onScroll = (): void => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const closeMenu = (): void => setMenuOpen(false);

  // ── Compute which projects appear in "Recently Completed" ──
  // Falls back to FEATURED_PROJECTS if admin hasn't chosen yet.
  const displayedProjects = useMemo(() => {
    if (featuredProjectIds.length === 0) return FEATURED_PROJECTS as any[];

    // Build a lookup map of all available projects
    const allMap = new Map<string, any>();
    ALL_PROJECTS.forEach(p => allMap.set(String(p.id), { ...p }));
    adminProjects.forEach(p => allMap.set(String(p.id), { ...p }));

    return featuredProjectIds
      .filter(id => !deletedProjectIds.includes(Number(id)))
      .map(id => {
        const p = allMap.get(id);
        if (!p) return null;
        // Apply any field overrides for static projects
        const ov = projectOverrides[id];
        if (ov) {
          return {
            ...p,
            ...Object.fromEntries(
              Object.entries(ov).filter(([, v]) => v !== undefined)
            ),
          };
        }
        return p;
      })
      .filter(Boolean);
  }, [featuredProjectIds, deletedProjectIds, projectOverrides, adminProjects]);

  return (
    <div className="App">

      {/* ── NAVBAR ── */}
      <header className={`App-header${scrolled ? ' scrolled' : ''}`}>
        <nav className="nav-bar">
          <Link to="/" className="brand" onClick={closeMenu}>
            <img src={logo} alt="Logo" />
            <div className="brand-name">
              PYTHAGORAS<br />CONSTRUCTION, INC.
            </div>
          </Link>

          <button
            className={`hamburger${menuOpen ? ' open' : ''}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span /><span /><span />
          </button>

          {menuOpen && <div className="nav-backdrop" onClick={closeMenu} />}

          <ul className={`nav-links${menuOpen ? ' active' : ''}`}>
            <li><Link to="/"         onClick={closeMenu}>Home</Link></li>
            <li><Link to="/services" onClick={closeMenu}>Services</Link></li>
            <li><Link to="/projects" onClick={closeMenu}>Projects</Link></li>
            <li><Link to="/about"    onClick={closeMenu}>About Us</Link></li>
            <li><Link to="/contact"  onClick={closeMenu}>Contact Us</Link></li>
          </ul>
        </nav>
      </header>

      <main>
        <ScrollToTop />
        <Routes>

          {/* ── HOME ── */}
          <Route path="/" element={
            <>
              <HeroSection />

              {/* WHO WE ARE */}
              <section className="who-section">
                <div className="who-inner">
                  <div className="who-text">
                    <p className="section-tag">WHO WE ARE</p>
                    <EditableText
                      adminKey="home.who.heading"
                      tag="h2"
                      className="who-heading"
                    >
                      A PEOPLE-DRIVEN CONSTRUCTION FIRM TURNING PLANS INTO WELL-BUILT REALITIES.
                    </EditableText>
                    <EditableText
                      adminKey="home.who.desc"
                      tag="p"
                      className="who-desc"
                    >
                      We are a team of experienced professionals dedicated to delivering quality
                      construction through collaboration, integrity, and hands-on expertise — from
                      planning and cost estimation to project execution and supervision for private clients.
                    </EditableText>
                    <Link to="/about" className="btn-primary btn-dark">Learn More</Link>
                  </div>
                  <div className="who-images">
                    <div className="who-img-main">
                      <EditableImage
                        adminKey="home.who.img1"
                        src={whoImg1}
                        alt="Construction site"
                        imgStyle={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                        style={{ width: '100%', height: '100%' }}
                      />
                    </div>
                    <div className="who-img-accent">
                      <EditableImage
                        adminKey="home.who.img2"
                        src={whoImg2}
                        alt="Construction work"
                        imgStyle={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                        style={{ width: '100%', height: '100%' }}
                      />
                      <div className="who-img-border" />
                    </div>
                  </div>
                </div>
              </section>

              {/* RECENTLY COMPLETED PROJECTS */}
              <section className="projects-section">
                <div className="projects-header">
                  <div>
                    <p className="section-tag muted">OUR PROJECTS</p>
                    <h2 className="projects-heading">RECENTLY COMPLETED PROJECTS</h2>
                  </div>
                  {/* Row: "Choose Projects" button (edit mode) + "All Projects" link */}
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
                    {isAdmin && editMode && (
                      <button
                        type="button"
                        onClick={() => setShowPicker(true)}
                        style={{
                          background:    'transparent',
                          border:        '1px solid #6B0000',
                          color:         '#6B0000',
                          fontFamily:    'Barlow Condensed, sans-serif',
                          fontSize:      11, fontWeight: 700,
                          letterSpacing: 2, textTransform: 'uppercase',
                          padding:       '9px 18px', cursor: 'pointer',
                          transition:    'background 0.2s, color 0.2s',
                        }}
                        onMouseEnter={e => {
                          (e.currentTarget as HTMLButtonElement).style.background = '#6B0000';
                          (e.currentTarget as HTMLButtonElement).style.color = '#FDF6EE';
                        }}
                        onMouseLeave={e => {
                          (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
                          (e.currentTarget as HTMLButtonElement).style.color = '#6B0000';
                        }}
                      >
                        ⚙ Choose Projects
                      </button>
                    )}
                    <Link to="/projects" className="btn-outline-maroon">ALL PROJECTS →</Link>
                  </div>
                </div>

                <div className="projects-grid">
                  {displayedProjects.map((proj: any) => (
                    <Link key={proj.id} to={`/projects/${proj.id}`} className="project-card">
                      <img src={proj.cover} alt={proj.title} />
                      <div className="project-card-overlay">
                        <p className="project-card-name">{proj.title}</p>
                      </div>
                      <div className="project-card-tag">
                        <p>{proj.title}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>

              {/* ABOUT STRIP */}
              <section className="about-strip">
                <div className="about-strip-inner">
                  <div className="about-strip-img">
                    <EditableImage
                      adminKey="home.about.img"
                      src={TEAMBUILDING}
                      alt="Our team"
                      imgStyle={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                      style={{ width: '100%', height: '100%' }}
                    />
                    <div className="about-img-border" />
                  </div>
                  <div className="about-strip-text">
                    <p className="section-tag">ABOUT US</p>
                    <EditableText
                      adminKey="home.about.heading"
                      tag="h2"
                      className="about-strip-heading"
                    >
                      Pythagoras Construction Company, Inc.
                    </EditableText>
                    {/* Description: company name stays bold, rest is editable */}
                    <p className="about-strip-desc">
                      <span className="bold-text">Pythagoras Construction, Inc.</span>{' '}
                      <EditableText adminKey="home.about.desc" tag="span">
                        is a SEC-registered general contracting firm established in 1993, providing
                        construction and allied maintenance services to private clients. We deliver
                        comprehensive solutions from planning and cost estimation to project execution
                        and supervision, backed by a skilled professional team and over 100 construction
                        workers. Formerly a single proprietorship, the company is now a PCAB-licensed
                        corporation classified under General "A."
                      </EditableText>
                    </p>
                    <Link to="/about" className="btn-primary btn-dark">About Us</Link>
                  </div>
                </div>
              </section>

              {/* CONTACT */}
              <section className="contact-section" id="contact">
                <div className="contact-bg-image" />
                <div className="contact-bg-overlay" />
                <div className="contact-inner">
                  <p className="section-tag light" style={{ textAlign: 'center' }}>GET IN TOUCH</p>
                  <EditableText adminKey="home.contact.heading" tag="h2" className="contact-heading">
                    Contact Us Today
                  </EditableText>
                  <EditableText adminKey="home.contact.sub" tag="p" className="contact-sub">
                    Let's bring your vision to life together. Reach out to discuss your next project.
                  </EditableText>
                  <div className="contact-cards">
                    <div className="contact-card contact-card-wide">
                      <img src={emailIcon} alt="Email" className="contact-icon" />
                      <p className="contact-card-label">Email Us At</p>
                      <a href="mailto:pci1051@yahoo.com.ph" className="contact-card-value link">
                        <EditableText adminKey="home.contact.email" tag="span">
                          pci1051@yahoo.com.ph
                        </EditableText>
                      </a>
                      <EditableText adminKey="home.contact.email.note" tag="p" className="contact-card-note">
                        We reply within 24 hours
                      </EditableText>
                    </div>
                    <div className="contact-card">
                      <img src={phoneIcon} alt="Phone" className="contact-icon" />
                      <EditableText adminKey="home.contact.phone.label" tag="p" className="contact-card-label">
                        Have Any Questions?
                      </EditableText>
                      <EditableText adminKey="home.contact.phone1" tag="p" className="contact-card-value">
                        (046) 894-9518
                      </EditableText>
                      <EditableText adminKey="home.contact.phone2" tag="p" className="contact-card-value">
                        +63 927 572 4505 (Mobile)
                      </EditableText>
                    </div>
                    <div className="contact-card">
                      <img src={clockIcon} alt="Hours" className="contact-icon" />
                      <p className="contact-card-label">Working Hours</p>
                      <EditableText adminKey="home.contact.hours" tag="p" className="contact-card-value">
                        Mon – Sat · 8:00 AM – 5:00 PM
                      </EditableText>
                    </div>
                  </div>
                </div>
              </section>
            </>
          } />

          <Route path="/about"        element={<AboutUs />} />
          <Route path="/services"     element={<Services />} />
          <Route path="/projects"     element={<Projects />} />
          <Route path="/projects/:id" element={<ProjectDetails />} />
          <Route path="/contact"      element={<Contact />} />

        </Routes>
      </main>

      {/* ── FOOTER ── */}
      <footer className="site-footer">
        <div className="footer-main">
          <div className="footer-brand">
            <img src={logo} alt="Logo" />
            <div>
              <p className="footer-company-name">PYTHAGORAS CONSTRUCTION, INC.</p>
              <p className="footer-est">Est. 1993</p>
            </div>
          </div>
          <div className="footer-info">
            <div className="footer-info-item">
              <div className="footer-label">Address</div>
              <EditableText adminKey="footer.address" tag="div">
                B9 L15 Niog Rd. Meadowood Executive Village, Bacoor Cavite
              </EditableText>
            </div>
            <div className="footer-info-item">
              <div className="footer-label">Telephone</div>
              <EditableText adminKey="footer.telephone" tag="div">
                (046) 894-9518 / (046) 238-4166
              </EditableText>
            </div>
            <div className="footer-info-item">
              <div className="footer-label">Email</div>
              <a href="mailto:pci1051@yahoo.com.ph">
                <EditableText adminKey="footer.email" tag="span">
                  pci1051@yahoo.com.ph
                </EditableText>
              </a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Pythagoras Construction, Inc. — All Rights Reserved</p>
        </div>
      </footer>

      {/* ── ADMIN BAR ── */}
      <AdminBar />

      {/* ── FEATURED PROJECT PICKER MODAL ── */}
      {showPicker && <FeaturedProjectPicker onClose={() => setShowPicker(false)} />}

    </div>
  );
}

// ─────────────────────────────────────────────────────────────
//  ROOT
// ─────────────────────────────────────────────────────────────

function App(): JSX.Element {
  return (
    <AdminProvider>
      <Router>
        <AppInner />
      </Router>

      {/* Hero showcase CSS (unchanged) */}
      <style>{`
        .hero-showcase {
          position: relative;
          min-height: 100svh;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        .hs-bg-layer {
          position: absolute; inset: 0;
          background-size: cover;
          background-position: center;
          opacity: 0;
          transition: opacity 0.8s ease;
          transform: scale(1.04);
          animation: none;
        }
        .hs-bg-layer.hs-bg-active {
          opacity: 1;
          animation: kensEffect 8s ease forwards;
        }
        .hs-bg-layer.hs-bg-prev {
          opacity: 0;
          transition: opacity 0.8s ease;
        }
        @keyframes kensEffect {
          from { transform: scale(1.06); }
          to   { transform: scale(1.0); }
        }
        .hs-overlay {
          position: absolute; inset: 0;
          background:
            linear-gradient(to right, rgba(43,8,0,0.88) 0%, rgba(43,8,0,0.55) 55%, rgba(43,8,0,0.3) 100%),
            linear-gradient(to top,   rgba(43,8,0,0.85) 0%, transparent 50%);
          pointer-events: none;
        }
        .hs-deco-line {
          position: absolute;
          background: rgba(253,246,238,0.06);
          pointer-events: none;
        }
        .hs-deco-line-v { left: clamp(20px,6vw,80px); top: 0; bottom: 0; width: 1px; }
        .hs-deco-line-h { top: 70px; left: 0; right: 0; height: 1px; }
        .hs-content {
          position: relative; z-index: 3;
          flex: 1;
          display: flex;
          align-items: center;
          padding: 0 clamp(20px,6vw,80px);
          max-width: 1280px;
          margin: 0 auto;
          width: 100%;
          padding-top: clamp(90px,12vw,130px);
        }
        .hs-content-inner {
          max-width: 680px;
          animation: hsFadeUp 0.9s ease both;
        }
        @keyframes hsFadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .hs-eyebrow {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: clamp(10px,1.2vw,13px); font-weight: 600;
          letter-spacing: 4px; text-transform: uppercase;
          color: #F0E6D6; opacity: 0.62;
          margin: 0 0 clamp(16px,2.5vw,28px);
        }
        .hs-headline {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(54px,9.5vw,132px);
          line-height: 0.93; letter-spacing: 2px;
          color: #FDF6EE; margin: 0 0 clamp(20px,3vw,36px);
          display: flex; flex-direction: column;
        }
        .hs-hl-line  { display: block; }
        .hs-hl-line:nth-child(1) { animation: hsFadeUp 0.8s 0.1s ease both; }
        .hs-hl-line:nth-child(2) { animation: hsFadeUp 0.8s 0.2s ease both; }
        .hs-hl-line:nth-child(3) { animation: hsFadeUp 0.8s 0.3s ease both; }
        .hs-hl-line:nth-child(4) { animation: hsFadeUp 0.8s 0.4s ease both; }
        .hs-hl-accent { color: #F0E6D6; opacity: 0.7; }
        .hs-sub {
          max-width: 500px;
          font-size: clamp(13px,1.4vw,16px); line-height: 1.75;
          color: rgba(253,246,238,0.52);
          margin: 0 0 clamp(28px,4vw,44px);
          animation: hsFadeUp 0.8s 0.5s ease both;
        }
        .hs-cta-row {
          display: flex; align-items: center; flex-wrap: wrap;
          gap: clamp(20px,4vw,40px);
          animation: hsFadeUp 0.8s 0.6s ease both;
        }
        .hs-btn-primary {
          display: inline-block;
          background: #6B0000; color: #FDF6EE;
          font-family: 'Barlow Condensed', sans-serif; font-weight: 700;
          font-size: clamp(11px,1.2vw,13px); letter-spacing: 2px;
          text-transform: uppercase; padding: 14px 32px;
          border: 2px solid #6B0000; text-decoration: none;
          transition: background 0.2s, color 0.2s;
        }
        .hs-btn-primary:hover { background: transparent; color: #6B0000 !important; }
        .hs-btn-ghost {
          display: inline-block; color: rgba(253,246,238,0.78);
          font-family: 'Barlow Condensed', sans-serif; font-weight: 600;
          font-size: clamp(12px,1.3vw,14px); letter-spacing: 1.5px;
          text-transform: uppercase; text-decoration: none;
          padding-bottom: 4px;
          border-bottom: 1px solid rgba(253,246,238,0.35);
          transition: color 0.2s, border-color 0.2s;
        }
        .hs-btn-ghost:hover { color: #FDF6EE; border-color: #FDF6EE; }
        .hs-project-tag {
          position: absolute; z-index: 4;
          top: 150px; right: clamp(80px,10vw,50px);
          display: flex; flex-direction: column; gap: 4px;
          transition: opacity 0.4s, transform 0.4s;
        }
        .hs-tag-in  { opacity: 1; transform: translateY(0); }
        .hs-tag-out { opacity: 0; transform: translateY(8px); }
        .hs-tag-label {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 10px; font-weight: 700;
          letter-spacing: 3px; text-transform: uppercase;
          color: #F0E6D6; opacity: 0.55;
        }
        .hs-tag-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(18px,2.5vw,30px);
          color: #FDF6EE; letter-spacing: 2px; margin: 0;
          line-height: 1;
        }
        .hs-tag-sub {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: clamp(10px,1.1vw,12px); letter-spacing: 1.5px;
          color: rgba(253,246,238,0.45); margin: 0;
        }
        .hs-controls {
          position: absolute; z-index: 4;
          bottom: 100px; right: clamp(20px,6vw,80px);
          display: flex; flex-direction: column; align-items: flex-end; gap: 12px;
        }
        .hs-progress-bar { width: 120px; height: 2px; background: rgba(253,246,238,0.15); overflow: hidden; }
        .hs-progress-fill { height: 100%; background: #6B0000; width: 0%; }
        @keyframes progressFill { from { width: 0%; } to { width: 100%; } }
        .hs-dots { display: flex; gap: 6px; }
        .hs-dot {
          width: 6px; height: 6px; border-radius: 50%;
          border: none; background: rgba(253,246,238,0.3);
          cursor: pointer; padding: 0;
          transition: background 0.25s, transform 0.25s;
        }
        .hs-dot.hs-dot-active { background: #FDF6EE; transform: scale(1.4); }
        .hs-counter { display: flex; align-items: center; gap: 8px; }
        .hs-count-cur { font-family: 'Bebas Neue', sans-serif; font-size: 28px; color: #FDF6EE; letter-spacing: 1px; }
        .hs-count-sep { width: 24px; height: 1px; background: rgba(253,246,238,0.35); }
        .hs-count-tot { font-family: 'Bebas Neue', sans-serif; font-size: 18px; color: rgba(253,246,238,0.38); letter-spacing: 1px; }
        .hs-stats {
          position: relative; z-index: 3;
          display: flex; align-items: center; flex-wrap: wrap;
          background: rgba(107,0,0,0.40);
          border-top: 1px solid rgba(253,246,238,0.10);
          padding: clamp(18px,3vw,30px) clamp(20px,6vw,80px);
          backdrop-filter: blur(6px);
        }
        .hs-stat { display: flex; flex-direction: column; gap: 4px; padding-right: clamp(24px,4vw,52px); }
        .hs-stat-num { font-family: 'Bebas Neue', sans-serif; font-size: clamp(24px,3.2vw,38px); color: #FDF6EE; letter-spacing: 1px; }
        .hs-stat-label { font-family: 'Barlow Condensed', sans-serif; font-size: clamp(9px,1vw,11px); letter-spacing: 2px; text-transform: uppercase; color: rgba(253,246,238,0.4); }
        .hs-stat-div { width: 1px; height: 38px; background: rgba(253,246,238,0.12); margin-right: clamp(24px,4vw,52px); flex-shrink: 0; }
        @media (max-width: 2000px) { .hs-content-inner { padding-bottom: 20px;} .hs-controls { bottom: 140px; } .hs-project-tag{top: 100px;}}
        @media (max-width: 860px) { .hs-project-tag { bottom: 80px; } .hs-controls { bottom: 120px; } }
        @media (max-width: 768px) { .hs-controls { bottom: 100px; } }
        @media (max-width: 767px) { .hs-controls { display: none; } }
        @media (max-width: 600px) {
          .hs-headline { font-size: clamp(46px,14vw,80px); }
          .hs-project-tag { display: none; }
          .hs-controls { bottom: 72px; right: 16px; }
          .hs-stats { flex-wrap: wrap; row-gap: 12px; }
          .hs-stat-div { display: none; }
          .hs-stat { padding-right: 20px; }
        }
        @media (max-width: 380px) { .hs-headline { font-size: clamp(40px,13vw,64px); } }
      `}</style>
    </AdminProvider>
  );
}

export default App;