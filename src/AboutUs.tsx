import { useState, useEffect, useRef } from "react";
import "./AboutUs.css";
import NCDC2 from "./CompletedProjects/NCDCORMOC/NCDC2.png";
import NCDC5 from "./CompletedProjects/NCDCORMOC/NCDC5.png";
import NCDC6 from "./CompletedProjects/NCDCORMOC/NCDC6.png";
import email from './email.png';
import phone from './phone.png';
import clock from './clock.png';
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
  const images = [NCDC6, NCDC5, NCDC2];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeValue, setActiveValue] = useState(0);
  const [activeDept, setActiveDept] = useState<string | null>(null);

  const awardImages = [award1, award2, award3, award4, award5, award6, award7, award8, award9];
  const [awardIndex, setAwardIndex] = useState(0);
  const [awardPaused, setAwardPaused] = useState(false);
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartX = useRef(0);
  const dragDelta = useRef(0);
  const visibleCount = 3;
  const maxAwardIndex = awardImages.length - visibleCount;

  const prevAward = () => setAwardIndex((prev) => Math.max(prev - 1, 0));
  const nextAward = () => setAwardIndex((prev) => Math.min(prev + 1, maxAwardIndex));

  // Auto-advance
  useEffect(() => {
    if (awardPaused) return;
    const id = setInterval(() => {
      setAwardIndex((prev) => (prev >= maxAwardIndex ? 0 : prev + 1));
    }, 3200);
    return () => clearInterval(id);
  }, [awardPaused, maxAwardIndex]);

  // Lightbox keyboard close
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxImg(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Drag handlers
  const onDragStart = (clientX: number) => {
    setIsDragging(true);
    dragStartX.current = clientX;
    dragDelta.current = 0;
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

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    document.body.style.backgroundColor = "#FDF6EE";
    return () => { document.body.style.backgroundColor = ""; };
  }, []);

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

      {/* ── FOUNDER STORY ── */}
      <section className="abt-founder-section">
        <div className="abt-founder-inner">
          {/* Left: photo placeholder + quote strip */}
          <div className="abt-founder-media">
            <div className="abt-founder-photo-wrap">
              <img src={SirBong} alt="Founder" className="abt-founder-photo" />
              <div className="abt-founder-photo-accent" />
            </div>
            <div className="abt-founder-quote-strip">
              <span className="abt-quote-mark">"</span>
              <p className="abt-quote-text">
                Building is not just about structures — it is about leaving a legacy for the next generation.
              </p>
              <p className="abt-quote-attr">— Founder, Pythagoras Construction, Inc.</p>
            </div>
          </div>

          {/* Right: story text */}
          <div className="abt-founder-content">
            <p className="abt-section-tag">OUR STORY</p>
            <h2 className="abt-founder-heading">ENGR. FERDINAND GARDUQUE</h2>
            <div className="abt-founder-divider" />
            <p className="abt-founder-body">
              Pythagoras Construction, Inc. was founded in 1993 with a singular purpose: to build
              structures that stand the test of time while uplifting the communities they serve.
              What began as a small contracting venture grew steadily through decades of hard work,
              discipline, and an unwavering commitment to quality.
            </p>
            <p className="abt-founder-body">
              The founder envisioned a construction firm where craftsmanship, integrity, and
              innovation go hand in hand — a company that treats every client project as if it were
              their own. From humble beginnings, Pythagoras Construction built its reputation
              project by project, client by client, earning the trust of both government agencies
              and private institutions across the country.
            </p>
            <p className="abt-founder-body">
              Today, with PCAB General "A" licensure and over 30 years of proven track record,
              the company continues to honor that founding vision — building not just structures,
              but better communities.
            </p>
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
              <p className="abt-values-panel-text">{values[activeValue].text}</p>
              <div className="abt-values-panel-line" />
            </div>
          </div>
        </div>
      </section>

      {/* ── AWARDS ── */}
      <section className="abt-awards-section">
        {/* Lightbox */}
        {lightboxImg && (
          <div className="abt-lightbox" onClick={() => setLightboxImg(null)}>
            <button className="abt-lightbox-close" aria-label="Close">✕</button>
            <div className="abt-lightbox-frame" onClick={(e) => e.stopPropagation()}>
              <img src={lightboxImg} alt="Award" className="abt-lightbox-img" />
            </div>
          </div>
        )}

        <div className="abt-awards-inner">
          {/* Header */}
          <div className="abt-awards-header">
            <p className="abt-section-tag">RECOGNITION & HONORS</p>
            <h2 className="abt-awards-heading">AWARDS</h2>
            <div className="abt-awards-heading-bar" />
            <p className="abt-awards-subtext">
              Proud recipients of recognition across multiple years —
              a testament to our consistent performance and partnership.
            </p>
          </div>

          {/* Slider */}
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
            {/* Progress bar */}
            <div className="abt-awards-progress-bar">
              <div
                className="abt-awards-progress-fill"
                style={{ width: `${((awardIndex + visibleCount) / awardImages.length) * 100}%` }}
              />
            </div>

            {/* Counter + arrows row */}
            <div className="abt-awards-controls">
              <span className="abt-awards-counter">
                <span className="abt-awards-counter-cur">{String(awardIndex + 1).padStart(2, '0')}–{String(Math.min(awardIndex + visibleCount, awardImages.length)).padStart(2, '0')}</span>
                <span className="abt-awards-counter-sep" />
                <span className="abt-awards-counter-tot">{String(awardImages.length).padStart(2, '0')}</span>
              </span>
              <div className="abt-awards-arrows">
                <button
                  className="abt-awards-arrow"
                  onClick={prevAward}
                  disabled={awardIndex === 0}
                  aria-label="Previous"
                >
                  ←
                </button>
                <button
                  className="abt-awards-arrow"
                  onClick={nextAward}
                  disabled={awardIndex === maxAwardIndex}
                  aria-label="Next"
                >
                  →
                </button>
              </div>
            </div>

            {/* Viewport */}
            <div className="abt-awards-viewport">
              <div
                className="abt-awards-track"
                style={{ transform: `translateX(-${awardIndex * (100 / visibleCount)}%)` }}
              >
                {awardImages.map((img, i) => (
                  <div key={i} className="abt-award-card">
                    <button
                      className="abt-award-img-wrap"
                      onClick={() => setLightboxImg(img)}
                      aria-label={`View award ${i + 1} in full`}
                    >
                      <img src={img} alt={`Award ${i + 1}`} className="abt-award-img" draggable={false} />
                      <div className="abt-award-overlay">
                        <span className="abt-award-zoom-icon">⊕</span>
                      </div>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Dot trail */}
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
              <a href="mailto:pci1051@yahoo.com" className="abt-contact-value abt-link">pci1051@yahoo.com.ph</a>
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