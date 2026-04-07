import React, { useState, useEffect, JSX } from 'react';
import logo from './logo.png';
import abtusimg1 from './aboutus-img1.png';
import emailIcon from './email.png';
import phoneIcon from './phone.png';
import clockIcon from './clock.png';
import './App.css';
import AboutUs from './AboutUs';
import Services from './Services';
import Projects from './Projects';
import ProjectDetails from './ProjectDetails';
import { Routes, Route, Link, useLocation } from 'react-router-dom';

// ── All project data comes from here — no duplicate imports ────
import { FEATURED_PROJECTS, ALL_PROJECTS } from './Projectsdata';

// Two images used in the "Who We Are" section
const whoImg1 = ALL_PROJECTS[5]?.images[2] ?? ALL_PROJECTS[0].cover;
const whoImg2 = ALL_PROJECTS[5]?.images[0] ?? ALL_PROJECTS[0].cover;

function ScrollToTop(): null {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
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
            <span />
            <span />
            <span />
          </button>

          {menuOpen && <div className="nav-backdrop" onClick={closeMenu} />}

          <ul className={`nav-links${menuOpen ? ' active' : ''}`}>
            <li><Link to="/"         onClick={closeMenu}>Home</Link></li>
            <li><Link to="/services" onClick={closeMenu}>Services</Link></li>
            <li><Link to="/projects" onClick={closeMenu}>Projects</Link></li>
            <li><Link to="/about"    onClick={closeMenu}>About Us</Link></li>
            <li><a href="#contact"   onClick={closeMenu}>Contact Us</a></li>
          </ul>
        </nav>
      </header>

      <main>
        <ScrollToTop />
        <Routes>

          {/* ── HOME ── */}
          <Route path="/" element={
            <>
              {/* HERO */}
              <section className="hero">
                <div className="hero-bg-image" />
                <div className="hero-bg-overlay" />
                <div className="hero-content">
                  <p className="eyebrow">Est. 1993 · PCAB Licensed · General "A"</p>
                  <h1 className="hero-title">
                    <div className="ht-line">BUILDING</div>
                    <div className="ht-line">WITH PURPOSE.</div>
                    <div className="ht-line">DELIVERING WITH</div>
                    <div className="ht-line ht-accent">EXCELLENCE.</div>
                  </h1>
                  <p className="hero-sub">
                    Welcome to Pythagoras Construction, Inc. — a trusted general contractor
                    delivering comprehensive civil, electrical, and design services since 1993.
                  </p>
                  <div className="hero-cta-row">
                    <a href="#contact" className="btn-primary">Book an Appointment</a>
                    <Link to="/projects" className="btn-ghost">View Projects →</Link>
                  </div>
                </div>
                <div className="hero-stats">
                  <div className="stat">
                    <div className="stat-num">30+</div>
                    <div className="stat-label">Years of Excellence</div>
                  </div>
                  <div className="stat-divider" />
                  <div className="stat">
                    <div className="stat-num">100+</div>
                    <div className="stat-label">Construction Workers</div>
                  </div>
                  <div className="stat-divider" />
                  <div className="stat">
                    <div className="stat-num">Gov &amp; Private</div>
                    <div className="stat-label">Clients Served</div>
                  </div>
                </div>
              </section>

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
                      planning and cost estimation to project execution and supervision for both
                      government and private clients.
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
                    <p className="section-tag light">OUR PROJECTS</p>
                    <h2 className="projects-heading">RECENTLY COMPLETED PROJECTS</h2>
                  </div>
                  <Link to="/projects" className="btn-outline-light">ALL PROJECTS →</Link>
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
                    <img src={abtusimg1} alt="Our team" />
                    <div className="about-img-border" />
                  </div>
                  <div className="about-strip-text">
                    <p className="section-tag">ABOUT US</p>
                    <h2 className="about-strip-heading">Pythagoras Construction Company, Inc.</h2>
                    <p className="about-strip-desc">
                      Pythagoras Construction, Inc. is a SEC-registered general contracting firm
                      established in 1993, providing construction and allied maintenance services
                      to government and private clients. We deliver comprehensive solutions from
                      planning and cost estimation to project execution and supervision, backed by
                      a skilled professional team and over 100 construction workers. Formerly a
                      single proprietorship, the company is now a PCAB-licensed corporation
                      classified under General "A."
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
                      <a href="mailto:pci051@yahoo.com" className="contact-card-value link">pci051@yahoo.com</a>
                      <p className="contact-card-note">We reply within 24 hours</p>
                    </div>
                    <div className="contact-card">
                      <img src={phoneIcon} alt="Phone" className="contact-icon" />
                      <p className="contact-card-label">Have Any Questions?</p>
                      <p className="contact-card-value">(046) 894-9518</p>
                    </div>
                    <div className="contact-card">
                      <img src={clockIcon} alt="Hours" className="contact-icon" />
                      <p className="contact-card-label">Working Hours</p>
                      <p className="contact-card-value">
                        Mon – Sat<br />8:00 AM – 5:00 PM
                      </p>
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
              <a href="mailto:pci051@yahoo.com">pci051@yahoo.com</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Pythagoras Construction, Inc. — All Rights Reserved</p>
        </div>
      </footer>

    </div>
  );
}

export default App;