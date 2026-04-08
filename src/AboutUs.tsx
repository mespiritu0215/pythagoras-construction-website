import { useState, useEffect } from "react";
import abtproj1 from './aboutproject-img1.jpg';
import abtproj2 from './aboutproject-img2.jpg';
import abtproj4 from './pyth5.jpg';
import email from './email.png';
import phone from './phone.png';
import clock from './clock.png';
import background from './background.png';


const values = [
  {
    num: "01",
    title: "INTEGRITY",
    text: "We conduct business with honesty, transparency, and accountability — building long-term relationships based on trust and respect.",
  },
  {
    num: "02",
    title: "INNOVATE",
    text: "We apply modern methods, smart technologies, and efficient processes to deliver better results, faster execution, and cost-effective solutions.",
  },
  {
    num: "03",
    title: "EXCELLENCY",
    text: "Committed to the highest standards in planning, project management, and construction — ensuring quality workmanship every time.",
  },
  {
    num: "04",
    title: "TRUSTWORTHINESS",
    text: "Our clients rely on us for consistency, reliability, and professionalism, knowing that we deliver on our commitments every time.",
  },
];

function AboutUs() {
  const images = [abtproj1, abtproj2, abtproj4];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeValue, setActiveValue] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    document.body.style.backgroundColor = "#0f0e0e";
    return () => { document.body.style.backgroundColor = ""; };
  }, []);

  return (
    <div className="abt-page">

      {/* ── HERO: vertical split ── */}
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
            <p className="abt-hero-sub">
              <strong>Pythagoras Construction, Inc.</strong> is a SEC-registered general
              contracting firm established in 1993, providing construction and allied
              maintenance services to both government and private clients.
            </p>
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

        <div className="abt-hero-right">
          <div className="abt-hero-slider">
            <div
              className="abt-hero-track"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {images.map((img, i) => (
                <img key={i} src={img} alt={`Project ${i + 1}`} />
              ))}
            </div>
            <div className="abt-slide-counter">
              <span className="abt-counter-current">{String(currentIndex + 1).padStart(2, '0')}</span>
              <span className="abt-counter-sep" />
              <span className="abt-counter-total">{String(images.length).padStart(2, '0')}</span>
            </div>
            <div className="abt-slider-dots">
              {images.map((_, i) => (
                <button
                  key={i}
                  className={`abt-dot${i === currentIndex ? ' abt-dot-active' : ''}`}
                  onClick={() => setCurrentIndex(i)}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
            <div className="abt-hero-slider-footer">
              <span>Our Projects</span>
              <a href="/projects" className="abt-visit-chip">View All →</a>
            </div>
          </div>
          <div className="abt-hero-accent-bar" />
        </div>
      </section>

      {/* ── WHO WE ARE: 3 tall panels ── */}
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
              <p className="abt-panel-text">
                Deliver quality and timely completed projects, strive for excellence in
                project management, be innovative in our methods, and develop our employees
                to be result-oriented, innovative, and motivated.
              </p>
            </div>
            <div className="abt-who-panel abt-panel-red">
              <div className="abt-panel-number">02</div>
              <h3 className="abt-panel-title">Our Vision</h3>
              <p className="abt-panel-text">
                To be a globally competitive construction firm trusted by clients, suppliers,
                and employees — where they are treated as business partners and family members.
              </p>
            </div>
            <div className="abt-who-panel abt-panel-light">
              <div className="abt-panel-number">03</div>
              <h3 className="abt-panel-title">Core Values</h3>
              <p className="abt-panel-text">
                Committed to conducting business with integrity, excellence, trustworthiness,
                innovation, and strict adherence to the law and safety protocols in everything we do.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CORE VALUES: interactive tabs ── */}
      <section className="abt-values-section">
        <div className="abt-values-inner">
          <div className="abt-values-header">
            <p className="abt-section-tag abt-tag-light">WHAT DRIVES US</p>
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
              <p className="abt-values-panel-text">{values[activeValue].text}</p>
              <div className="abt-values-panel-line" />
            </div>
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
              <a href="mailto:pci051@yahoo.com" className="abt-contact-value abt-link">pci051@yahoo.com</a>
              <p className="abt-contact-note">We reply within 24 hours</p>
            </div>
            <div className="abt-contact-card">
              <img src={phone} alt="Phone" className="abt-contact-icon" />
              <p className="abt-contact-label">Have Any Questions?</p>
              <p className="abt-contact-value">(046) 894-9518</p>
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