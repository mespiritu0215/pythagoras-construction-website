import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ALL_PROJECTS } from './Projectsdata';
import { useAdmin, ProjectOverride } from './AdminContext';

// Color update: dark maroon (#6B0000 / rgba(107,0,0,...)) → crimson-red (#C0152A / rgba(192,21,42,...))

function applyOverride(project: any, override?: ProjectOverride): any {
  if (!override) return project;
  return {
    ...project,
    title:       override.title       ?? project.title,
    description: override.description ?? project.description,
    location:    override.location    ?? project.location,
    client:      override.client      ?? project.client,
    completion:  override.completion  ?? project.completion,
    amount:      override.amount      ?? project.amount,
    ongoing:     override.ongoing     !== undefined ? override.ongoing : project.ongoing,
    cover:       override.cover       ?? project.cover,
    images:      override.images      ?? project.images,
  };
}

export default function ProjectDetails() {
  const { id }   = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    adminProjects,
    projectOverrides,
    deletedProjectIds,
  } = useAdmin();

  const staticProject = ALL_PROJECTS.find((p) => String(p.id) === id);
  const adminProject = adminProjects.find((p) => p.id === id);
  const project: any = staticProject
    ? applyOverride(staticProject, id ? projectOverrides[id] : undefined)
    : adminProject ?? null;

  const isDeleted = staticProject && id
    ? deletedProjectIds.includes(Number(id))
    : false;

  const carouselImages: string[] = project
    ? (project.images?.length ? project.images : [project.cover])
    : [];
  const [activeIdx, setActiveIdx]   = useState(0);
  const [animDir,   setAnimDir]     = useState<'left'|'right'>('right');
  const [isAnimating, setIsAnimating] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goTo = useCallback((next: number, dir: 'left'|'right' = 'right') => {
    if (isAnimating) return;
    setAnimDir(dir);
    setIsAnimating(true);
    setTimeout(() => {
      setActiveIdx(next);
      setIsAnimating(false);
    }, 420);
  }, [isAnimating]);

  const advance = useCallback(() => {
    setActiveIdx(prev => {
      const next = (prev + 1) % carouselImages.length;
      setAnimDir('right');
      return next;
    });
  }, [carouselImages.length]);

  useEffect(() => {
    if (!project) return;
    intervalRef.current = setInterval(advance, 3500);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [advance, project]);

  const handlePrev = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    const prev = (activeIdx - 1 + carouselImages.length) % carouselImages.length;
    goTo(prev, 'left');
    intervalRef.current = setInterval(advance, 3500);
  };

  const handleNext = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    const next = (activeIdx + 1) % carouselImages.length;
    goTo(next, 'right');
    intervalRef.current = setInterval(advance, 3500);
  };

  const handleDot = (i: number) => {
    if (i === activeIdx) return;
    if (intervalRef.current) clearInterval(intervalRef.current);
    goTo(i, i > activeIdx ? 'right' : 'left');
    intervalRef.current = setInterval(advance, 3500);
  };

  useEffect(() => {
    document.body.style.background = '#FDF6EE';
    return () => { document.body.style.background = ''; };
  }, []);

  if (!project || isDeleted) {
    return (
      <div className="pd-not-found">
        <p>{isDeleted ? 'This project has been removed.' : 'Project not found.'}</p>
        <button onClick={() => navigate('/projects')}>← Back to Projects</button>
      </div>
    );
  }

  return (
    <div className="pd-page">

      {/* ── HERO HEADER ─────────────────────────────────── */}
      <section className="pd-hero">
        <div className="pd-hero-bg" />
        <div className="pd-hero-overlay" />
        <div className="pd-hero-inner">
          <button className="pd-back-btn" onClick={() => navigate('/projects')}>
            ← Back to Projects
          </button>
          <div className="pd-hero-meta">
            <div className="pd-meta-top">
              <span className="pd-badge">{project.category}</span>
              {project.ongoing && <span className="pd-badge pd-badge-ongoing">● Ongoing</span>}
            </div>
            <h1 className="pd-title">{project.title}</h1>
            {project.location && (
              <p className="pd-location">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
                {project.location}
              </p>
            )}
          </div>
        </div>
        <div className="pd-hero-rule" />
      </section>

      {/* ── MAIN CONTENT ────────────────────────────────── */}
      <div className="pd-main">

        {/* ── CAROUSEL ──────────────────────────────────── */}
        <div className="pd-carousel-wrap">
          <div className="pd-carousel">

            <div
              className={`pd-carousel-track ${isAnimating ? (animDir === 'right' ? 'slide-out-left' : 'slide-out-right') : ''}`}
            >
              <img
                key={activeIdx}
                src={carouselImages[activeIdx]}
                alt={`${project.title} — photo ${activeIdx + 1}`}
                className="pd-carousel-img"
              />
            </div>

            {carouselImages.length > 1 && (
              <>
                <button className="pd-car-btn pd-car-prev" onClick={handlePrev} aria-label="Previous">
                  ‹
                </button>
                <button className="pd-car-btn pd-car-next" onClick={handleNext} aria-label="Next">
                  ›
                </button>
              </>
            )}

            <div className="pd-car-counter">
              {activeIdx + 1} <span>/</span> {carouselImages.length}
            </div>

            {carouselImages.length > 1 && (
              <div className="pd-car-dots">
                {carouselImages.map((_, i) => (
                  <button
                    key={i}
                    className={`pd-car-dot${i === activeIdx ? ' active' : ''}`}
                    onClick={() => handleDot(i)}
                    aria-label={`Go to image ${i + 1}`}
                  />
                ))}
              </div>
            )}
          </div>

          {carouselImages.length > 1 && (
            <div className="pd-thumbs">
              {carouselImages.map((img, i) => (
                <button
                  key={i}
                  className={`pd-thumb${i === activeIdx ? ' active' : ''}`}
                  onClick={() => handleDot(i)}
                >
                  <img src={img} alt={`Thumb ${i + 1}`} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── PROJECT INFO ───────────────────────────────── */}
        <div className="pd-info">

          <div className="pd-info-header">
            <p className="pd-info-tag">PROJECT DETAILS</p>
            <h2 className="pd-info-title">{project.title}</h2>
            <div className="pd-info-divider" />
          </div>

          <p className="pd-description">{project.description}</p>

          <div className="pd-meta-grid">
            {project.client && (
              <div className="pd-meta-item">
                <span className="pd-meta-label">Client</span>
                <span className="pd-meta-value">{project.client}</span>
              </div>
            )}
            {project.location && (
              <div className="pd-meta-item">
                <span className="pd-meta-label">Location</span>
                <span className="pd-meta-value">{project.location}</span>
              </div>
            )}
            {project.completion && (
              <div className="pd-meta-item">
                <span className="pd-meta-label">Completion</span>
                <span className="pd-meta-value">{project.completion}</span>
              </div>
            )}
            {project.amount && (
              <div className="pd-meta-item">
                <span className="pd-meta-label">Project Value</span>
                <span className="pd-meta-value">{project.amount}</span>
              </div>
            )}
            <div className="pd-meta-item">
              <span className="pd-meta-label">Category</span>
              <span className="pd-meta-value">{project.category}</span>
            </div>
            <div className="pd-meta-item">
              <span className="pd-meta-label">Status</span>
              <span className={`pd-meta-value ${project.ongoing ? 'status-ongoing' : 'status-done'}`}>
                {project.ongoing ? '● In Progress' : '✓ Completed'}
              </span>
            </div>
          </div>

          <button className="pd-cta" onClick={() => navigate('/contact')}>
            Inquire About This Project →
          </button>
        </div>

      </div>

      {/* ── STYLES ────────────────────────────────────────── */}
      <style>{`

        .pd-page {
          min-height: 100vh;
          background: #FDF6EE;
          padding-bottom: 100px;
        }

        /* ── Hero ── */
        .pd-hero {
          position: relative;
          overflow: hidden;
          min-height: clamp(220px, 32vw, 380px);
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
        }
        .pd-hero-bg {
          position: absolute; inset: 0;
          background-image: url('background.png');
          background-size: cover;
          background-position: center 60%;
          pointer-events: none;
        }
        .pd-hero-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(60,5,10,0.94) 0%, rgba(139,0,16,0.90) 60%, rgba(192,21,42,0.85) 100%);
          pointer-events: none;
        }
        .pd-hero-inner {
          position: relative; z-index: 2;
          max-width: 1280px; width: 100%; margin: 0 auto;
          padding: clamp(90px,13vw,150px) clamp(20px,6vw,80px) clamp(32px,4vw,48px);
          display: flex; flex-direction: column;
          gap: clamp(16px,2.5vw,24px);
          animation: pdFadeUp 0.8s ease both;
        }
        @keyframes pdFadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .pd-back-btn {
          display: inline-flex; align-items: center; gap: 8px;
          background: transparent;
          border: 2px solid rgba(253,246,238,0.4);
          color: rgba(253,246,238,0.82);
          font-family: 'Barlow Condensed', sans-serif;
          font-size: clamp(10px,1.1vw,13px); font-weight: 700;
          letter-spacing: 2px; text-transform: uppercase;
          padding: 9px 20px; cursor: pointer; align-self: flex-start;
          transition: all 0.2s;
        }
        .pd-back-btn:hover { background: rgba(253,246,238,0.1); color: #FDF6EE; border-color: rgba(253,246,238,0.65); }

        .pd-hero-meta { display: flex; flex-direction: column; gap: 10px; }
        .pd-meta-top  { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }

        .pd-badge {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: clamp(9px,1vw,11px); font-weight: 700;
          letter-spacing: 3px; text-transform: uppercase;
          color: #FDF6EE; background: #C0152A;
          padding: 4px 14px; align-self: flex-start;
        }
        .pd-badge-ongoing {
          background: transparent;
          border: 1px solid rgba(253,246,238,0.45);
          color: rgba(253,246,238,0.8);
        }

        .pd-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(30px,5vw,68px); color: #FDF6EE;
          margin: 0; line-height: 0.96; letter-spacing: 2px;
        }
        .pd-location {
          display: flex; align-items: center; gap: 6px;
          font-family: 'Barlow Condensed', sans-serif;
          font-size: clamp(11px,1.2vw,13px); letter-spacing: 2px;
          text-transform: uppercase; color: rgba(253,246,238,0.45);
          margin: 0;
        }
        .pd-location svg { flex-shrink: 0; opacity: 0.6; }
        .pd-hero-rule {
          position: relative; z-index: 2; height: 1px;
          background: linear-gradient(to right, #C0152A, rgba(192,21,42,0.2), transparent);
        }

        /* ── Main layout ── */
        .pd-main {
          max-width: 1280px; margin: 0 auto;
          padding: clamp(40px,6vw,80px) clamp(20px,6vw,80px);
          display: grid;
          grid-template-columns: 1fr 420px;
          gap: clamp(40px,6vw,80px);
          align-items: start;
        }

        /* ── Carousel ── */
        .pd-carousel-wrap { display: flex; flex-direction: column; gap: 12px; }

        .pd-carousel {
          position: relative;
          width: 100%;
          aspect-ratio: 16 / 10;
          overflow: hidden;
          background: #E8D8C4;
          box-shadow: 0 20px 60px rgba(192,21,42,0.12);
        }

        .pd-carousel-track {
          width: 100%; height: 100%;
          transition: transform 0.42s cubic-bezier(0.4,0,0.2,1),
                      opacity  0.42s ease;
        }
        .pd-carousel-track.slide-out-left  { animation: slideOutLeft  0.42s ease forwards; }
        .pd-carousel-track.slide-out-right { animation: slideOutRight 0.42s ease forwards; }

        @keyframes slideOutLeft {
          0%   { transform: translateX(0);     opacity: 1; }
          100% { transform: translateX(-6%);   opacity: 0; }
        }
        @keyframes slideOutRight {
          0%   { transform: translateX(0);    opacity: 1; }
          100% { transform: translateX(6%);   opacity: 0; }
        }

        .pd-carousel-img {
          width: 100%; height: 100%;
          object-fit: cover; object-position: center;
          display: block;
          animation: imgFadeIn 0.42s ease forwards;
        }
        @keyframes imgFadeIn {
          from { opacity: 0; transform: scale(1.02); }
          to   { opacity: 1; transform: scale(1); }
        }

        .pd-car-btn {
          position: absolute; top: 50%; transform: translateY(-50%);
          width: 48px; height: 48px; border-radius: 50%;
          background: rgba(253,246,238,0.92);
          border: none; color: #C0152A;
          font-size: 30px; line-height: 1; padding-bottom: 4px;
          cursor: pointer; z-index: 5;
          display: flex; align-items: center; justify-content: center;
          transition: background 0.2s, color 0.2s, transform 0.2s;
          box-shadow: 0 4px 16px rgba(192,21,42,0.15);
        }
        .pd-car-btn:hover { background: #C0152A; color: #FDF6EE; transform: translateY(-50%) scale(1.08); }
        .pd-car-prev { left: 16px; }
        .pd-car-next { right: 16px; }

        .pd-car-counter {
          position: absolute; top: 14px; right: 16px;
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 13px; font-weight: 700; letter-spacing: 2px;
          color: rgba(253,246,238,0.8); z-index: 5;
          background: rgba(60,5,10,0.45); padding: 4px 10px;
          backdrop-filter: blur(4px);
        }
        .pd-car-counter span { opacity: 0.45; margin: 0 2px; }

        .pd-car-dots {
          position: absolute; bottom: 14px; left: 50%;
          transform: translateX(-50%);
          display: flex; gap: 8px; z-index: 5;
        }
        .pd-car-dot {
          width: 8px; height: 8px; border-radius: 50%;
          border: none; background: rgba(253,246,238,0.4);
          cursor: pointer; padding: 0;
          transition: background 0.25s, transform 0.25s;
        }
        .pd-car-dot.active { background: #FDF6EE; transform: scale(1.3); }

        .pd-thumbs {
          display: flex; gap: 8px;
        }
        .pd-thumb {
          flex: 1; aspect-ratio: 16/10;
          padding: 0; border: 3px solid transparent;
          overflow: hidden; cursor: pointer;
          transition: border-color 0.2s, opacity 0.2s;
          opacity: 0.55; background: none;
        }
        .pd-thumb.active { border-color: #C0152A; opacity: 1; }
        .pd-thumb:hover { opacity: 0.85; }
        .pd-thumb img { width: 100%; height: 100%; object-fit: cover; display: block; }

        /* ── Project Info Panel ── */
        .pd-info {
          display: flex; flex-direction: column; gap: clamp(20px,3vw,32px);
          position: sticky; top: 90px;
        }

        .pd-info-header { display: flex; flex-direction: column; gap: 10px; }

        .pd-info-tag {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: clamp(10px,1.1vw,12px); font-weight: 700;
          letter-spacing: 4px; text-transform: uppercase;
          color: #C0152A; margin: 0;
        }
        .pd-info-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(24px,3vw,40px);
          color: #2C1810; letter-spacing: 1px;
          line-height: 1; margin: 0;
        }
        .pd-info-divider {
          width: 48px; height: 2px; background: #C0152A;
        }

        .pd-description {
          font-family: 'Barlow', sans-serif;
          font-size: clamp(13px,1.3vw,15px);
          line-height: 1.85; color: #5C4033; margin: 0;
        }

        .pd-meta-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1px;
          background: #E8D8C4;
          border: 1px solid #E8D8C4;
        }
        .pd-meta-item {
          display: flex; flex-direction: column; gap: 4px;
          padding: 14px 16px;
          background: #FFFFFF;
        }
        .pd-meta-label {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 10px; font-weight: 700;
          letter-spacing: 2.5px; text-transform: uppercase;
          color: #9A8F85;
        }
        .pd-meta-value {
          font-family: 'Barlow', sans-serif;
          font-size: clamp(12px,1.2vw,14px); font-weight: 600;
          color: #2C1810; line-height: 1.4;
        }
        .status-ongoing { color: #C0152A; }
        .status-done    { color: #3a6b3a; }

        .pd-cta {
          display: inline-flex; align-items: center;
          background: #C0152A; color: #FDF6EE;
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 700; font-size: 13px;
          letter-spacing: 2px; text-transform: uppercase;
          padding: 15px 28px; border: 2px solid #C0152A;
          cursor: pointer; transition: background 0.2s, color 0.2s;
          align-self: flex-start;
        }
        .pd-cta:hover { background: transparent; color: #C0152A; }

        .pd-not-found { padding: 80px; text-align: center; color: #C0152A; font-size: 20px; }
        .pd-not-found button {
          margin-top: 16px; padding: 12px 28px;
          background: #C0152A; color: #FDF6EE;
          border: none; cursor: pointer;
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 13px; font-weight: 700;
          letter-spacing: 2px; text-transform: uppercase;
        }

        /* ── Responsive ── */
        @media (max-width: 1024px) {
          .pd-main { grid-template-columns: 1fr; }
          .pd-info { position: static; }
        }
        @media (max-width: 860px) {
          .pd-hero-inner { padding-top: clamp(96px,18vw,130px); }
        }
        @media (max-width: 600px) {
          .pd-meta-grid { grid-template-columns: 1fr; }
          .pd-car-btn { width: 38px; height: 38px; font-size: 24px; }
          .pd-car-prev { left: 8px; }
          .pd-car-next { right: 8px; }
        }
        @media (min-width: 1600px) {
          .pd-hero-inner { padding-left: 100px; padding-right: 100px; }
          .pd-main { padding-left: 100px; padding-right: 100px; }
        }
      `}</style>
    </div>
  );
}