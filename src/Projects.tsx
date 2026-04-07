import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CATEGORIES, CategoryGroup, ProjectData } from './Projectsdata';
import emailIcon from './email.png';
import phoneIcon from './phone.png';
import clockIcon from './clock.png';

// ── One scrollable row per category ───────────────────────────

type RowProps = {
  category: CategoryGroup;
  indexMap: Record<number, number>;
  setIndexMap: React.Dispatch<React.SetStateAction<Record<number, number>>>;
  isLight: boolean; // alternating light/dark
};

function ProjectRow({ category, indexMap, setIndexMap, isLight }: RowProps) {
  const navigate = useNavigate();
  const trackRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<Record<number, ReturnType<typeof setInterval> | undefined>>({});

  const startCycle = (id: number, total: number) => {
    if (timerRef.current[id]) return;
    timerRef.current[id] = setInterval(() => {
      setIndexMap((prev) => ({ ...prev, [id]: ((prev[id] ?? 0) + 1) % total }));
    }, 1200);
  };

  const stopCycle = (id: number) => {
    clearInterval(timerRef.current[id]);
    timerRef.current[id] = undefined;
  };

  useEffect(() => {
    const ref = timerRef.current;
    return () => { Object.values(ref).forEach((t) => clearInterval(t)); };
  }, []);

  const nudge = (dir: 'left' | 'right') => {
    if (!trackRef.current) return;
    const card = trackRef.current.querySelector<HTMLElement>('.prj-card');
    const gap = 24;
    const amount = card ? card.offsetWidth + gap : 400;
    trackRef.current.scrollBy({ left: dir === 'right' ? amount : -amount, behavior: 'smooth' });
  };

  return (
    <section className={`prj-section${isLight ? ' prj-section-light' : ' prj-section-dark'}`}>
      <div className="prj-section-inner">

        <div className="prj-row-header">
          <span className={`prj-cat-label${isLight ? ' prj-cat-label-dark' : ''}`}>
            {category.label}
          </span>
          <div className={`prj-cat-rule${isLight ? ' prj-cat-rule-dark' : ''}`} />
        </div>

        <div className="prj-scroll-area">
          {category.projects.length > 3 && (
            <>
              <button className="prj-arrow prj-arrow-l" onClick={() => nudge('left')} aria-label="Scroll left">‹</button>
              <button className="prj-arrow prj-arrow-r" onClick={() => nudge('right')} aria-label="Scroll right">›</button>
            </>
          )}

          <div className="prj-track" ref={trackRef}>
            {category.projects.map((project: ProjectData) => {
              const idx = indexMap[project.id] ?? 0;
              return (
                <div
                  key={project.id}
                  className={`prj-card${isLight ? ' prj-card-light' : ''}`}
                  onClick={() => navigate(`/projects/${project.id}`)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && navigate(`/projects/${project.id}`)}
                >
                  <div
                    className="prj-carousel"
                    onMouseEnter={() => startCycle(project.id, project.images.length)}
                    onMouseLeave={() => stopCycle(project.id)}
                    onTouchStart={() => startCycle(project.id, project.images.length)}
                    onTouchEnd={() => stopCycle(project.id)}
                  >
                    {project.images.map((src, i) => (
                      <img
                        key={i}
                        src={src}
                        alt={`${project.title} ${i + 1}`}
                        className={`prj-img${i === idx ? ' prj-img-active' : ''}`}
                      />
                    ))}
                    <div className="prj-overlay">
                      <span className="prj-overlay-text">View Project →</span>
                    </div>
                    <div className="prj-dots">
                      {project.images.map((_, i) => (
                        <span key={i} className={`prj-dot${i === idx ? ' prj-dot-on' : ''}`} />
                      ))}
                    </div>
                  </div>

                  <div className={`prj-footer${isLight ? ' prj-footer-light' : ''}`}>
                    <div className="prj-footer-text">
                      <p className="prj-cat-badge">{project.category}</p>
                      <p className={`prj-title${isLight ? ' prj-title-dark' : ''}`}>{project.title}</p>
                    </div>
                    <div className="prj-arrow-icon">→</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}

// ── Main page ──────────────────────────────────────────────────

export default function Projects() {
  const init: Record<number, number> = {};
  CATEGORIES.forEach((cat) => cat.projects.forEach((p) => { init[p.id] = 0; }));
  const [indexMap, setIndexMap] = useState<Record<number, number>>(init);

  const activeCategories = CATEGORIES.filter((c) => c.projects.length > 0);

  return (
    <>
      <section className="prj-hero">
        <div className="prj-hero-bg" />
        <div className="prj-hero-overlay" />

        <div className="prj-hero-content">
          <p className="prj-eyebrow">Est. 1993 · PCAB Licensed · General "A"</p>
          <h1 className="prj-hero-title">
            <span className="prj-ht-line">OUR</span>
            <span className="prj-ht-line prj-ht-accent">PROJECTS</span>
          </h1>
          <p className="prj-hero-sub">
            A portfolio of completed construction and renovation projects across
            the Philippines — from office fit-outs to large-scale electrical installations.
          </p>
        </div>

        <div className="prj-hero-stats">
          <div className="prj-stat">
            <div className="prj-stat-num">30+</div>
            <div className="prj-stat-label">Years of Excellence</div>
          </div>
          <div className="prj-stat-divider" />
          <div className="prj-stat">
            <div className="prj-stat-num">100+</div>
            <div className="prj-stat-label">Projects Delivered</div>
          </div>
          <div className="prj-stat-divider" />
          <div className="prj-stat">
            <div className="prj-stat-num">Gov &amp; Private</div>
            <div className="prj-stat-label">Clients Served</div>
          </div>
        </div>
      </section>

      {/* ── PROJECT ROWS — Alternating Light/Dark ── */}
      {activeCategories.map((cat, i) => (
        <ProjectRow
          key={cat.label}
          category={cat}
          indexMap={indexMap}
          setIndexMap={setIndexMap}
          // Changed logic: i % 2 === 0 ensures Row 1 (0) and Row 3 (2) are light
          isLight={i % 2 === 0}
        />
      ))}

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
              <p className="contact-card-value">Mon – Sat<br />8:00 AM – 5:00 PM</p>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .prj-hero {
          position: relative;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .prj-hero-bg {
          position: absolute;
          inset: 0;
          background-image: url('background.png');
          background-size: cover;
          background-position: center 60%;
          background-repeat: no-repeat;
          pointer-events: none;
        }

        .prj-hero-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.90);
          pointer-events: none;
        }

        .prj-hero-content {
          position: relative;
          z-index: 2;
          padding: clamp(120px, 15vw, 170px) clamp(20px, 6vw, 80px) clamp(36px, 5vw, 52px);
          max-width: 1280px;
          width: 100%;
          margin: 0 auto;
          animation: prjFadeUp 0.9s ease both;
        }

        @keyframes prjFadeUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .prj-eyebrow {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: clamp(10px, 1.2vw, 13px);
          font-weight: 600;
          letter-spacing: 4px;
          text-transform: uppercase;
          color: #920000;
          margin: 0 0 clamp(16px, 2.5vw, 28px);
        }

        .prj-hero-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(56px, 9.5vw, 130px);
          line-height: 0.93;
          letter-spacing: 2px;
          color: #fff;
          margin: 0 0 clamp(20px, 3vw, 36px);
          display: flex;
          flex-direction: column;
        }
        .prj-ht-line { display: block; }
        .prj-ht-line:nth-child(1) { animation: prjFadeUp 0.8s 0.10s ease both; }
        .prj-ht-line:nth-child(2) { animation: prjFadeUp 0.8s 0.22s ease both; }
        .prj-ht-accent { color: #920000; }

        .prj-hero-sub {
          max-width: 560px;
          font-family: 'Barlow', sans-serif;
          font-size: clamp(13px, 1.5vw, 16px);
          line-height: 1.75;
          color: rgba(255,255,255,0.55);
          margin: 0;
          animation: prjFadeUp 0.8s 0.34s ease both;
        }

        .prj-hero-stats {
          position: relative;
          z-index: 2;
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 0;
          background: rgba(255,255,255,0.04);
          border-top: 1px solid rgba(255,255,255,0.07);
          padding: clamp(20px, 3vw, 32px) clamp(20px, 6vw, 80px);
          animation: prjFadeUp 0.8s 0.46s ease both;
        }
        .prj-stat {
          display: flex;
          flex-direction: column;
          gap: 4px;
          padding: 0 clamp(24px, 4vw, 52px) 0 0;
        }
        .prj-stat-num {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(26px, 3.5vw, 40px);
          color: #920000;
          letter-spacing: 1px;
        }
        .prj-stat-label {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: clamp(9px, 1vw, 12px);
          letter-spacing: 2px;
          text-transform: uppercase;
          color: rgba(255,255,255,0.4);
        }
        .prj-stat-divider {
          width: 1px;
          height: 40px;
          background: rgba(255,255,255,0.1);
          margin-right: clamp(24px, 4vw, 52px);
          flex-shrink: 0;
        }

        .prj-section {
          width: 100%;
          padding: clamp(52px, 7vw, 96px) 0;
        }

        .prj-section-dark {
          background: #181717;
        }

        .prj-section-light {
          background: #f4eeea;
        }

        .prj-section-inner {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 clamp(20px, 6vw, 80px);
        }

        .prj-row-header {
          display: flex;
          align-items: center;
          gap: 20px;
          margin-bottom: 28px;
        }

        .prj-cat-label {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: clamp(11px, 1.3vw, 14px);
          font-weight: 700;
          letter-spacing: 5px;
          text-transform: uppercase;
          color: #920000;
          white-space: nowrap;
        }
        .prj-cat-label-dark { color: #920000; }

        .prj-cat-rule {
          flex: 1;
          height: 1px;
          background: linear-gradient(to right, rgba(146,0,0,0.55), transparent);
        }
        .prj-cat-rule-dark {
          background: linear-gradient(to right, rgba(146,0,0,0.7), rgba(146,0,0,0.05));
        }

        .prj-scroll-area { position: relative; }

        .prj-track {
          display: flex;
          gap: 24px;
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          -webkit-overflow-scrolling: touch;
          padding: 4px 2px 18px;
          scrollbar-width: none;
        }
        .prj-track::-webkit-scrollbar { display: none; }

        .prj-card {
          flex: 0 0 calc((100% - 48px) / 3);
          scroll-snap-align: start;
          min-width: 0;
          display: flex;
          flex-direction: column;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          cursor: pointer;
          transition: border-color 0.3s, box-shadow 0.3s;
          outline: none;
        }
        .prj-card:hover,
        .prj-card:focus {
          border-color: rgba(146,0,0,0.5);
          box-shadow: 0 8px 32px rgba(146,0,0,0.12);
        }

        .prj-card-light {
          background: #fff;
          border: 1px solid rgba(0,0,0,0.08);
          box-shadow: 4px 6px 24px rgba(0,0,0,0.07);
        }
        .prj-card-light:hover,
        .prj-card-light:focus {
          border-color: rgba(146,0,0,0.4);
          box-shadow: 0 8px 32px rgba(146,0,0,0.14);
        }

        .prj-carousel {
          position: relative;
          width: 100%;
          padding-top: 70%;
          overflow: hidden;
          background: #1a1919;
          flex-shrink: 0;
        }
        .prj-img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          opacity: 0;
          transition: opacity 0.55s ease-in-out;
          display: block;
        }
        .prj-img-active { opacity: 1; }

        .prj-overlay {
          position: absolute;
          inset: 0;
          background: rgba(146,0,0,0);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.3s;
          pointer-events: none;
        }
        .prj-card:hover .prj-overlay { background: rgba(146,0,0,0.28); }

        .prj-overlay-text {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: clamp(11px, 1.2vw, 14px);
          font-weight: 700;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #fff;
          opacity: 0;
          transform: translateY(8px);
          transition: opacity 0.25s, transform 0.25s;
        }
        .prj-card:hover .prj-overlay-text {
          opacity: 1;
          transform: translateY(0);
        }

        .prj-dots {
          position: absolute;
          bottom: 9px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 5px;
          flex-wrap: wrap;
          justify-content: center;
          max-width: 80%;
        }
        .prj-dot {
          width: 5px; height: 5px;
          border-radius: 50%;
          background: rgba(255,255,255,0.35);
          flex-shrink: 0;
          transition: background 0.3s;
        }
        .prj-dot-on { background: #fff; }

        .prj-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: clamp(14px, 1.8vw, 20px);
          border-top: 1px solid rgba(255,255,255,0.06);
        }

        .prj-footer-light {
          background: #f4eeea;
          border-top: 1px solid rgba(0,0,0,0.07);
        }

        .prj-footer-text { min-width: 0; }

        .prj-cat-badge {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: clamp(9px, 0.9vw, 11px);
          font-weight: 700;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: #920000;
          margin: 0 0 4px;
        }

        .prj-title {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: clamp(14px, 1.6vw, 20px);
          font-weight: 700;
          letter-spacing: 1px;
          color: #fff;
          margin: 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .prj-title-dark { color: #0f0e0e; }

        .prj-arrow-icon {
          flex-shrink: 0;
          width: 36px; height: 36px;
          border-radius: 50%;
          border: 1px solid rgba(146,0,0,0.5);
          color: #920000;
          font-size: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s, border-color 0.2s, color 0.2s;
        }
        .prj-card:hover .prj-arrow-icon {
          background: #920000;
          border-color: #920000;
          color: #fff;
        }

        .prj-arrow {
          position: absolute;
          top: 33%;
          transform: translateY(-50%);
          z-index: 10;
          width: 42px; height: 42px;
          border-radius: 50%;
          border: 1px solid rgba(146,0,0,0.55);
          background: rgba(15,14,14,0.92);
          color: #fff;
          font-size: 28px;
          line-height: 1;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0;
          transition: background 0.2s, border-color 0.2s;
        }
        .prj-arrow:hover { background: #920000; border-color: #920000; }
        .prj-arrow-l { left: -21px; }
        .prj-arrow-r { right: -21px; }

        @media (max-width: 1024px) {
          .prj-card { flex: 0 0 calc((100% - 24px) / 2); }
          .prj-arrow { display: none; }
        }

        @media (max-width: 860px) {
          .prj-hero-content { padding-top: clamp(110px, 20vw, 150px); }
          .prj-hero-stats { row-gap: 16px; }
          .prj-stat-divider { display: none; }
          .prj-stat { padding-right: 24px; }
        }

        @media (max-width: 600px) {
          .prj-hero-content {
            padding-top: clamp(100px, 24vw, 130px);
            padding-bottom: clamp(28px, 6vw, 40px);
          }
          .prj-card { flex: 0 0 83vw; }
          .prj-arrow { display: none; }
        }

        @media (max-width: 380px) {
          .prj-hero-title { font-size: clamp(44px, 13vw, 70px); }
        }

        @media (min-width: 1600px) {
          .prj-hero-content { padding-left: 100px; padding-right: 100px; }
          .prj-hero-stats   { padding-left: 100px; padding-right: 100px; }
          .prj-section-inner { padding-left: 100px; padding-right: 100px; }
        }
        @media (min-width: 2000px) {
          .prj-hero-content { max-width: 1600px; padding-left: 120px; padding-right: 120px; }
          .prj-hero-stats   { padding-left: 120px; padding-right: 120px; }
          .prj-section-inner { max-width: 1600px; padding-left: 120px; padding-right: 120px; }
        }
      `}</style>
    </>
  );
}