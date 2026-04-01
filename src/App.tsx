import React, { useState, useEffect } from 'react';
import logo from './logo.png';
import image1 from './image 1.png';
import image2 from './image 2.png';
import completeimg1 from './completed-img1.png';
import completeimg2 from './completed-img2.png';
import completeimg3 from './completed-img3.png';
import completeimg4 from './completed-img4.png';
import abtusimg1 from './aboutus-img1.png';
import email from './email.png';
import phone from './phone.png';
import clock from './clock.png';
import './App.css';
import AboutUs from './AboutUs';
import Services from './Services';
import Projects from './Projects';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import ProjectDetails from "./ProjectDetails";


function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.backgroundColor = "#D9CCCC";
    return () => { document.body.style.backgroundColor = "#FFFFFF"; };
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="App">
      <header className="App-header">
        <nav className="header">
          <div className="header-top"></div>
          <div className="nav-bar">
            <div className="brand">
              <img src={logo} alt="Logo" />
              <h3>PYTHAGORAS<br />CONSTRUCTION, INC.</h3>
            </div>

            <button
              className={`hamburger ${menuOpen ? "open" : ""}`}
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>

            {/* Backdrop */}
            {menuOpen && <div className="nav-backdrop" onClick={closeMenu} />}

            <ul className={`nav-links ${menuOpen ? "active" : ""}`}>
              <li><Link to="/" onClick={closeMenu}>Home</Link></li>
              <li><Link to="/about" onClick={closeMenu}>About Us</Link></li>
              <li><Link to="/services" onClick={closeMenu}>Services</Link></li>
              <li><Link to="/projects" onClick={closeMenu}>Projects</Link></li>
              <li><a href="#contact" onClick={closeMenu}>Contact Us</a></li>
            </ul>
          </div>
        </nav>
      </header>

      <main>
        <ScrollToTop />
        <Routes>
          <Route path='/' element={
            <>
              <div className="body-container1">
                <div className="body-container1-inner">
                  <div className="body-logo">
                    <img src={logo} alt="Pythagoras Logo" />
                  </div>
                  <div className="c1-description">
                    <h1>Building with Purpose. Delivering with Excellence</h1>
                    <p>
                      Welcome to Pythagoras Construction, Inc., A trusted general contractor
                      since 1993. We specialize in comprehensive construction, civil, electrical,
                      and design services tailored to meet diverse project needs. Backed by
                      experienced professionals, advanced equipment, and a culture rooted in
                      integrity and excellence, we are committed to delivering projects that exceed
                      expectations and stand the test of time.
                    </p>
                  </div>
                </div>
              </div>
              <div className="body-container2">
                <div className="body-container2-inner">
                  <div className="c2-description">
                    <p>WHO WE ARE</p>
                    <h2>A PEOPLE-DRIVEN CONSTRUCTION FIRM TURNING PLANS INTO WELL-BUILT REALITIES.</h2>
                    <p className="desc">
                      We are a team of experienced professionals dedicated to delivering quality
                      construction through collaboration, integrity, and hands-on expertise, from
                      planning and cost estimation to project execution and supervision for both
                      government and private clients
                    </p>
                  </div>
                  <div className="c2-images">
                    <div className="c2-image1"><img src={image2} alt="image 1" /></div>
                    <div className="c2-image2"></div>
                    <div className="c2-image3"><img src={image1} alt="image 2" /></div>
                  </div>
                </div>
              </div>
              <div className="body-container3">
                <div className="body-container3-inner">
                  <div className="recently-completed">
                    <p>OUR PROJECTS</p>
                    <h2>RECENTLY COMPLETED PROJECTS</h2>
                  </div>
                  <div className="all-projects">
                    <a href="#">ALL PROJECTS</a>
                  </div>
                </div>
                <div className="c3-images">
                  {[completeimg1, completeimg2, completeimg3, completeimg4].map((img, i) => (
                    <div key={i} className={`c3-image${i + 1}`}>
                      <img src={img} alt={`image ${i + 1}`} />
                      <div className="tag">
                        <p>PROJECT NAME</p>
                        <a href="#">LEARN MORE</a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="body-container4">
                <div className="body-container4-inner">
                  <div className="c4-images">
                    <div className="c4-image1"><img src={abtusimg1} alt="image 1" /></div>
                  </div>
                  <div className="c4-description">
                    <h1>ABOUT US</h1>
                    <h2>Pythagoras Construction Company, Inc.</h2>
                    <p className="desc">
                      Pythagoras Construction, Inc. is a SEC-registered general contracting firm established in 1993,
                      providing construction and allied maintenance services to government and private clients.
                      We deliver comprehensive solutions from planning and cost estimation to project execution and supervision,
                      backed by a skilled professional team and over 100 construction workers.
                      Formerly a single proprietorship, the company is now a PCAB-licensed corporation classified under General "A."
                    </p>
                    <div className="abt-tag">
                      <Link to="/about">ABOUT US</Link>
                    </div>
                  </div>
                </div>
              </div>
              <div className="body-container5" id="contact">
                <div className="body-container5-inner">
                  <div className="c5-contact">
                    <div className="section1">
                      <h3>Contact us today</h3>
                      <p>Let's bring your vision to life together. Reach out to us to talk about your next project.</p>
                    </div>
                    <div className="section2">
                      <img src={email} alt="email icon" />
                      <a href="mailto:pci051@yahoo.com">pci051@yahoo.com</a>
                      <p>We Reply Within 24 Hours</p>
                    </div>
                    <div className="section3">
                      <img src={phone} alt="phone icon" />
                      <h4>Have any questions?</h4>
                      <p>(046)894-9518</p>
                    </div>
                    <div className="section4">
                      <img src={clock} alt="clock icon" />
                      <h4>Working hours</h4>
                      <p>Mon to Sat 8:00AM – 5:00PM</p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          } />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/services" element={<Services />} />
          <Route path="/projects" element={<Projects />} />
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
              <span className="footer-label">Address</span>
              <span>B9 L15 Niog Rd. Meadowood Executive Village, Bacoor Cavite</span>
            </div>
            <div className="footer-info-item">
              <span className="footer-label">Telephone</span>
              <span>(046) 894-9518 / (046) 238-4166</span>
            </div>
            <div className="footer-info-item">
              <span className="footer-label">Email</span>
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