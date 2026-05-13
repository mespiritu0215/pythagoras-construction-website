import React, { useState, useEffect, useRef, JSX } from 'react';
import logo from './logo.png';
import './App.css';
import emailIcon from './email.png';
import phoneIcon from './phone.png';
import clockIcon from './clock.png';
import AboutUs from './AboutUs';
import Services from './Services';
import Projects from './Projects';
import Contact from './ContactUs';
import ProjectDetails from './ProjectDetails';
import { HashRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import TEAMBUILDING from "./CompletedProjects/pages/TEAMBUILDING.png";

import { FEATURED_PROJECTS, ALL_PROJECTS } from './Projectsdata';

// ── Hero showcase images — replace with your best project photos ──────────────
// These come from the PPTX exports in /src/OngoingProjects/ or /CompletedProjects/
import HeroImg1 from "./CompletedProjects/NCDCORMOC/NCDC1.png";
import HeroImg2 from "./CompletedProjects/PoiFestonSanAndres/PoiFestonSanAndres1.png";
import HeroImg3 from "./CompletedProjects/BADOC/Badoc1.png";
import HeroImg4 from "./CompletedProjects/NCDCORMOC/NCDC2.png";
import HeroImg5 from "./CompletedProjects/pages/TEAMBUILDING.png";

import NCDC1 from "./CompletedProjects/NCDCORMOC/NCDC5.png";
import NCDC2 from "./CompletedProjects/NCDCORMOC/NCDC6.png";

const HERO_SLIDES = [
  {
    img: HeroImg2,
    label: "Architectural",
    title: "San Andres POI Festoon",
    sub: "San Andres, Catanduanes",
  },
  {
    img: HeroImg3,
    label: "Architectural",
    title: "Badoc POI Festoon",
    sub: "Badoc, Ilocos Norte",
  },  
  {
    img: HeroImg4,
    label: "Civil Works",
    title: "NCDC Ormoc",
    sub: "New Core Data Center · Globe · Leyte",
  },
  {
    img: HeroImg1,
    label: "Civil Works",
    title: "NCDC Ormoc",
    sub: "Core Data Center · Globe · Ormoc, Leyte",
  },
  {
    img: HeroImg5,
    label: "Teamwork in Action",
    title: "PCI Team Building",
  },
];

// ── Who We Are section images ─────────────────────────────────────────────────
const whoImg1 = ALL_PROJECTS[2]?.images[4] ?? ALL_PROJECTS[0].cover;
const whoImg2 = ALL_PROJECTS[2]?.images[5] ?? ALL_PROJECTS[0].cover;

function ScrollToTop(): null {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

// ── Full-bleed cinematic hero ─────────────────────────────────────────────────
function HeroSection() {
  const [current, setCurrent]     = useState(0);
  const [prev,    setPrev]        = useState<number | null>(null);
  const [transitioning, setTrans] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goTo = (next: number) => {
    if (transitioning || next === current) return;
    setPrev(current);
    setTrans(true);
    setTimeout(() => {
      setCurrent(next);
      setPrev(null);
      setTrans(false);
    }, 800);
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
  }, []);

  const handleDot = (i: number) => {
    if (timerRef.current) clearInterval(timerRef.current);
    goTo(i);
    startTimer();
  };

  const slide = HERO_SLIDES[current];

  return (
    <section className="hero-showcase">

      {/* Background layers */}
      {HERO_SLIDES.map((s, i) => (
        <div
          key={i}
          className={`hs-bg-layer ${i === current ? 'hs-bg-active' : ''} ${i === prev ? 'hs-bg-prev' : ''}`}
          style={{ backgroundImage: `url(${s.img})` }}
        />
      ))}
      <div className="hs-overlay" />

      {/* Decorative elements */}
      <div className="hs-deco-line hs-deco-line-v" />
      <div className="hs-deco-line hs-deco-line-h" />

      {/* Content */}
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

      {/* Current project tag — bottom left */}
      <div className={`hs-project-tag ${transitioning ? 'hs-tag-out' : 'hs-tag-in'}`}>
        <span className="hs-tag-label">{slide.label}</span>
        <p className="hs-tag-title">{slide.title}</p>
        <p className="hs-tag-sub">{slide.sub}</p>
      </div>

      {/* Slide controls — bottom right */}
      <div className="hs-controls">
        <div className="hs-progress-bar">
          <div
            className="hs-progress-fill"
            key={current}
            style={{ animation: 'progressFill 5s linear forwards' }}
          />
        </div>
        <div className="hs-dots">
          {HERO_SLIDES.map((_, i) => (
            <button
              key={i}
              className={`hs-dot ${i === current ? 'hs-dot-active' : ''}`}
              onClick={() => handleDot(i)}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
        <div className="hs-counter">
          <span className="hs-count-cur">{String(current + 1).padStart(2, '0')}</span>
          <span className="hs-count-sep" />
          <span className="hs-count-tot">{String(HERO_SLIDES.length).padStart(2, '0')}</span>
        </div>
      </div>

       {/* Stats strip */}
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

function App(): JSX.Element {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [scrolled, setScrolled] = useState<boolean>(false);

  useEffect(() => {
    const onScroll = (): void => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const closeMenu = (): void => setMenuOpen(false);

  return (
    <Router>
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
                {/* CINEMATIC HERO */}
                <HeroSection />

                {/* WHO WE ARE */}
                <section className="who-section">
                  <div className="who-inner">
                    <div className="who-text">
                      <p className="section-tag">WHO WE ARE</p>
                      <h2 className="who-heading">
                        A PEOPLE-DRIVEN CONSTRUCTION FIRM TURNING PLANS INTO WELL-BUILT REALITIES.
                      </h2>
                      <p className="who-desc">
                        We are a team of experienced professionals dedicated to delivering quality
                        construction through collaboration, integrity, and hands-on expertise — from
                        planning and cost estimation to project execution and supervision for private clients.
                      </p>
                      <Link to="/about" className="btn-primary btn-dark">Learn More</Link>
                    </div>
                    <div className="who-images">
                      <div className="who-img-main">
                        <img src={whoImg1} alt="Construction site" />
                      </div>
                      <div className="who-img-accent">
                        <img src={whoImg2} alt="Construction work" />
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
                    <Link to="/projects" className="btn-outline-maroon">ALL PROJECTS →</Link>
                  </div>

                  <div className="projects-grid">
                    {FEATURED_PROJECTS.map((proj) => (
                      <Link
                        key={proj.id}
                        to={`/projects/${proj.id}`}
                        className="project-card"
                      >
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
                      <img src={TEAMBUILDING} alt="Our team" />
                      <div className="about-img-border" />
                    </div>
                    <div className="about-strip-text">
                      <p className="section-tag">ABOUT US</p>
                      <h2 className="about-strip-heading">Pythagoras Construction Company, Inc.</h2>
                      <p className="about-strip-desc">
                        <span className="bold-text">Pythagoras Construction, Inc.</span> is a SEC-registered
                        general contracting firm established in 1993, providing construction and allied
                        maintenance services to private clients. We deliver comprehensive solutions from
                        planning and cost estimation to project execution and supervision, backed by a
                        skilled professional team and over 100 construction workers. Formerly a single
                        proprietorship, the company is now a PCAB-licensed corporation classified under
                        General "A."
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
                    <h2 className="contact-heading">Contact Us Today</h2>
                    <p className="contact-sub">
                      Let's bring your vision to life together. Reach out to discuss your next project.
                    </p>
                    <div className="contact-cards">
                      <div className="contact-card contact-card-wide">
                        <img src={emailIcon} alt="Email" className="contact-icon" />
                        <p className="contact-card-label">Email Us At</p>
                        <a href="mailto:pci1051@yahoo.com.ph" className="contact-card-value link">pci1051@yahoo.com.ph</a>
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
                <div>B9 L15 Niog Rd. Meadowood Executive Village, Bacoor Cavite</div>
              </div>
              <div className="footer-info-item">
                <div className="footer-label">Telephone</div>
                <div>(046) 894-9518 / (046) 238-4166</div>
              </div>
              <div className="footer-info-item">
                <div className="footer-label">Email</div>
                <a href="mailto:pci1051@yahoo.com.ph">pci1051@yahoo.com.ph</a>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© {new Date().getFullYear()} Pythagoras Construction, Inc. — All Rights Reserved</p>
          </div>
        </footer>

      </div>

      {/* Hero showcase CSS */}
      <style>{`

        /* ═══════════════════════════════════════════════════
           HERO SHOWCASE — cinematic full-bleed slideshow
        ═══════════════════════════════════════════════════ */

        .hero-showcase {
          position: relative;
          min-height: 100svh;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        /* Background image layers — cross-fade */
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

        /* Overlay — deep maroon gradient */
        .hs-overlay {
          position: absolute; inset: 0;
          background:
            linear-gradient(to right, rgba(43,8,0,0.88) 0%, rgba(43,8,0,0.55) 55%, rgba(43,8,0,0.3) 100%),
            linear-gradient(to top,   rgba(43,8,0,0.85) 0%, transparent 50%);
          pointer-events: none;
        }

        /* Decorative lines */
        .hs-deco-line {
          position: absolute;
          background: rgba(253,246,238,0.06);
          pointer-events: none;
        }
        .hs-deco-line-v {
          left: clamp(20px,6vw,80px);
          top: 0; bottom: 0; width: 1px;
        }
        .hs-deco-line-h {
          top: 70px; left: 0; right: 0; height: 1px;
        }

        /* Content block */
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

        /* Project tag — upper right */
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

        /* Controls — bottom right */
        .hs-controls {
          position: absolute; z-index: 4;
          bottom: 100px; right: clamp(20px,6vw,80px);
          display: flex; flex-direction: column; align-items: flex-end; gap: 12px;
        }

        .hs-progress-bar {
          width: 120px; height: 2px;
          background: rgba(253,246,238,0.15); overflow: hidden;
        }
        .hs-progress-fill {
          height: 100%; background: #6B0000; width: 0%;
        }
        @keyframes progressFill {
          from { width: 0%; }
          to   { width: 100%; }
        }

        .hs-dots { display: flex; gap: 6px; }
        .hs-dot {
          width: 6px; height: 6px; border-radius: 50%;
          border: none; background: rgba(253,246,238,0.3);
          cursor: pointer; padding: 0;
          transition: background 0.25s, transform 0.25s;
        }
        .hs-dot.hs-dot-active { background: #FDF6EE; transform: scale(1.4); }

        .hs-counter {
          display: flex; align-items: center; gap: 8px;
        }
        .hs-count-cur {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 28px; color: #FDF6EE; letter-spacing: 1px;
        }
        .hs-count-sep { width: 24px; height: 1px; background: rgba(253,246,238,0.35); }
        .hs-count-tot {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 18px; color: rgba(253,246,238,0.38); letter-spacing: 1px;
        }

        /* Stats strip */
        .hs-stats {
          position: relative; z-index: 3;
          display: flex; align-items: center; flex-wrap: wrap;
          background: rgba(107,0,0,0.40);
          border-top: 1px solid rgba(253,246,238,0.10);
          padding: clamp(18px,3vw,30px) clamp(20px,6vw,80px);
          backdrop-filter: blur(6px);
        }
        .hs-stat { display: flex; flex-direction: column; gap: 4px; padding-right: clamp(24px,4vw,52px); }
        .hs-stat-num {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(24px,3.2vw,38px); color: #FDF6EE; letter-spacing: 1px;
        }
        .hs-stat-label {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: clamp(9px,1vw,11px); letter-spacing: 2px;
          text-transform: uppercase; color: rgba(253,246,238,0.4);
        }
        .hs-stat-div {
          width: 1px; height: 38px;
          background: rgba(253,246,238,0.12);
          margin-right: clamp(24px,4vw,52px); flex-shrink: 0;
        }

        /* ── Responsive ── */
        @media (max-width: 860px) {
          .hs-project-tag { bottom: 80px; }
          .hs-controls     { bottom: 80px; }
        }
        @media (max-width: 600px) {
          .hs-headline { font-size: clamp(46px,14vw,80px); }
          .hs-project-tag { display: none; }
          .hs-controls { bottom: 72px; right: 16px; }
          .hs-stats { flex-wrap: wrap; row-gap: 12px; }
          .hs-stat-div { display: none; }
          .hs-stat { padding-right: 20px; }
        }
        @media (max-width: 380px) {
          .hs-headline { font-size: clamp(40px,13vw,64px); }
        }
      `}</style>

    </Router>
  );
}

export default App;