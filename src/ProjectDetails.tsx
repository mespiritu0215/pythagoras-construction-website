import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ALL_PROJECTS } from './Projectsdata';

export default function ProjectDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const project = ALL_PROJECTS.find((p) => p.id === Number(id));

  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [lightboxVisible, setLightboxVisible] = useState(false);

  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const openLightbox = (i: number) => {
    setLightboxIndex(i);
    setLightboxVisible(true);
  };

  const closeLightbox = () => {
    setLightboxVisible(false);
    setTimeout(() => setLightboxIndex(null), 280);
  };

  const lightboxPrev = useCallback(() => {
    if (lightboxIndex === null || !project) return;
    setLightboxIndex((lightboxIndex - 1 + project.images.length) % project.images.length);
  }, [lightboxIndex, project]);

  const lightboxNext = useCallback(() => {
    if (lightboxIndex === null || !project) return;
    setLightboxIndex((lightboxIndex + 1) % project.images.length);
  }, [lightboxIndex, project]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = e.changedTouches[0].clientY - touchStartY.current;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) {
      dx < 0 ? lightboxNext() : lightboxPrev();
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === 'ArrowLeft')  lightboxPrev();
      if (e.key === 'ArrowRight') lightboxNext();
      if (e.key === 'Escape')     closeLightbox();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [lightboxIndex, lightboxPrev, lightboxNext]);

  useEffect(() => {
    document.body.style.overflow = lightboxVisible ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [lightboxVisible]);

  // ── Not found ────────────────────────────────────────────────
  if (!project) {
    return (
      <div className="pd-not-found">
        <p>Project not found.</p>
        <button onClick={() => navigate('/projects')}>← Back to Projects</button>
      </div>
    );
  }

  // ── Gallery tile sizing ──────────────────────────────────────
  const remainder    = project.images.length % 3;
  const lastRowStart = project.images.length - remainder;
  const tileClass    = (i: number) =>
    remainder === 2 && i >= lastRowStart ? 'pd-tile pd-tile-wide' : 'pd-tile';

  return (
    <div className="pd-page">

      {/* ══════════════════════════════════════════════════════
          HERO HEADER — same structure as .hero in App.css.
          background.png + 90% black veil + content on top.
          padding-top is set to clear the fixed navbar safely.
      ══════════════════════════════════════════════════════ */}
      <section className="pd-hero">
        {/* Layer 1: photo */}
        <div className="pd-hero-bg" />
        {/* Layer 2: 90% black veil */}
        <div className="pd-hero-overlay" />

        {/* All content sits above both layers */}
        <div className="pd-hero-inner">

          {/* Back button — sits BELOW the navbar, not overlapping it.
              margin-bottom creates visual separation before the project info. */}
          <button className="pd-back-btn" onClick={() => navigate('/projects')}>
            ← Back to Projects
          </button>

          {/* Project identity block */}
          <div className="pd-hero-meta">
            <span className="pd-badge">{project.category}</span>
            <h1 className="pd-title">{project.title}</h1>
            <p className="pd-count">
              <span className="pd-count-num">{project.images.length}</span> photographs
            </p>
          </div>
        </div>

        {/* Thin red rule at the bottom — mirrors the border used on .about-strip */}
        <div className="pd-hero-rule" />
      </section>

      {/* ── GALLERY ── */}
      <div className="pd-gallery">
        {project.images.map((img, i) => (
          <div key={i} className={tileClass(i)} onClick={() => openLightbox(i)}>
            <img src={img} alt={`${project.title} photo ${i + 1}`} />
            <div className="pd-tile-overlay">
              <span className="pd-tile-icon">⊕</span>
            </div>
          </div>
        ))}
      </div>

      {/* ── LIGHTBOX ── */}
      {lightboxIndex !== null && (
        <div
          className={`pd-lightbox${lightboxVisible ? ' pd-lightbox-on' : ''}`}
          onClick={closeLightbox}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <button className="pd-lb-close" onClick={closeLightbox} aria-label="Close">✕</button>

          <div className="pd-lb-counter">
            {lightboxIndex + 1} / {project.images.length}
          </div>

          <button
            className="pd-lb-nav pd-lb-prev"
            onClick={(e) => { e.stopPropagation(); lightboxPrev(); }}
            aria-label="Previous"
          >‹</button>

          <div className="pd-lb-img-wrap" onClick={(e) => e.stopPropagation()}>
            <img
              key={lightboxIndex}
              src={project.images[lightboxIndex]}
              alt={`${project.title} ${lightboxIndex + 1}`}
              className="pd-lb-img"
            />
          </div>

          <button
            className="pd-lb-nav pd-lb-next"
            onClick={(e) => { e.stopPropagation(); lightboxNext(); }}
            aria-label="Next"
          >›</button>

          <div className="pd-lb-swipe-hint">swipe to navigate</div>

          <div className="pd-lb-thumbs" onClick={(e) => e.stopPropagation()}>
            {project.images.map((img, i) => (
              <img
                key={i}
                src={img}
                alt={`thumb ${i + 1}`}
                className={`pd-lb-thumb${i === lightboxIndex ? ' pd-lb-thumb-on' : ''}`}
                onClick={() => setLightboxIndex(i)}
              />
            ))}
          </div>
        </div>
      )}

      {/* ── STYLES ── */}
      <style>{`

        .pd-page {
          min-height: 100vh;
          padding-bottom: 80px;
          background: transparent;
        }

        /* ════════════════════════════════════════════════
           HERO HEADER
           Matches .hero pattern from App.css:
           bg photo + 90% veil + content block.
           padding-top clears the fixed navbar + gives
           a generous amount of breathing room above the
           back button so nothing overlaps.
        ════════════════════════════════════════════════ */

        .pd-hero {
          position: relative;
          overflow: hidden;
          /* min-height keeps it tall enough to feel intentional */
          min-height: clamp(260px, 38vw, 440px);
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
        }

        /* Layer 1: background photo */
        .pd-hero-bg {
          position: absolute;
          inset: 0;
          background-image: url('background.png');
          background-size: cover;
          background-position: center 60%;
          background-repeat: no-repeat;
          pointer-events: none;
        }

        /* Layer 2: 90% black veil — identical to App.css */
        .pd-hero-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.90);
          pointer-events: none;
        }

        /* Content container — z-index keeps it above both layers */
        .pd-hero-inner {
          position: relative;
          z-index: 2;
          max-width: 1280px;
          width: 100%;
          margin: 0 auto;
          /*
            padding-top: navbar height (~70px) + extra so the
            back button never touches the navbar edge.
            clamp(min, preferred, max) covers every zoom level.
          */
          padding: clamp(96px, 13vw, 160px) clamp(20px, 6vw, 80px) clamp(36px, 5vw, 52px);
          display: flex;
          flex-direction: column;
          gap: clamp(20px, 3vw, 32px);
          animation: pdFadeUp 0.8s ease both;
        }

        @keyframes pdFadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* Back button — same visual language as .btn-primary from App.css */
        .pd-back-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: transparent;
          border: 2px solid #920000;
          color: #920000;
          font-family: 'Barlow Condensed', sans-serif;
          font-size: clamp(10px, 1.1vw, 13px);
          font-weight: 700;
          letter-spacing: 2px;
          text-transform: uppercase;
          padding: 10px 22px;
          cursor: pointer;
          white-space: nowrap;
          /* align-self so it doesn't stretch full width */
          align-self: flex-start;
          transition: background 0.2s, color 0.2s;
        }
        .pd-back-btn:hover { background: #920000; color: #fff; }

        /* Project identity */
        .pd-hero-meta {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        /* Category badge — mirrors .eyebrow from App.css */
        .pd-badge {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: clamp(9px, 1vw, 11px);
          font-weight: 700;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: #fff;
          background: #920000;
          padding: 4px 14px;
          align-self: flex-start;
        }

        /* Title — mirrors .hero-title scale from App.css */
        .pd-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(36px, 6vw, 80px);
          color: #fff;
          margin: 0;
          line-height: 0.95;
          letter-spacing: 2px;
          animation: pdFadeUp 0.8s 0.12s ease both;
        }

        /* Photo count — mirrors .stat-label style */
        .pd-count {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: clamp(10px, 1.1vw, 13px);
          letter-spacing: 3px;
          text-transform: uppercase;
          color: rgba(255,255,255,0.35);
          margin: 0;
        }
        .pd-count-num {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(18px, 2vw, 26px);
          color: #920000;
          letter-spacing: 1px;
          vertical-align: middle;
          margin-right: 4px;
        }

        /* Bottom rule — same gradient as .prj-cat-rule */
        .pd-hero-rule {
          position: relative;
          z-index: 2;
          height: 1px;
          background: linear-gradient(to right, #920000, rgba(146,0,0,0.2), transparent);
        }

        /* ════════════════════════════════════════════════
           GALLERY
        ════════════════════════════════════════════════ */

        .pd-gallery {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          grid-auto-rows: clamp(160px, 20vw, 280px);
          gap: 6px;
          padding: 6px clamp(20px, 6vw, 80px) 0;
        }

        .pd-tile {
          grid-column: span 2;
          position: relative;
          overflow: hidden;
          cursor: pointer;
          background: #1a1919;
        }
        .pd-tile-wide { grid-column: span 3; }

        .pd-tile img {
          width: 100%; height: 100%;
          object-fit: cover;
          object-position: center;
          display: block;
          transition: transform 0.45s ease;
        }
        .pd-tile:hover img { transform: scale(1.06); }

        /* Tile hover — mirrors .project-card-overlay gradient from App.css */
        .pd-tile-overlay {
          position: absolute;
          inset: 0;
          background: rgba(146,0,0,0);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.3s;
        }
        .pd-tile:hover .pd-tile-overlay { background: rgba(146,0,0,0.32); }
        .pd-tile-icon {
          font-size: 32px;
          color: #fff;
          opacity: 0;
          transform: scale(0.7);
          transition: opacity 0.25s, transform 0.25s;
        }
        .pd-tile:hover .pd-tile-icon { opacity: 1; transform: scale(1); }

        /* ════════════════════════════════════════════════
           LIGHTBOX
        ════════════════════════════════════════════════ */

        .pd-lightbox {
          position: fixed;
          inset: 0;
          z-index: 2000;
          background: rgba(10,0,0,0.97);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.28s ease;
          padding: 16px;
        }
        .pd-lightbox-on { opacity: 1; }

        .pd-lb-close {
          position: absolute;
          top: 18px; right: 22px;
          background: none; border: none;
          color: rgba(255,255,255,0.6);
          font-size: 26px;
          cursor: pointer;
          z-index: 10;
          line-height: 1;
          padding: 4px 8px;
          transition: color 0.2s;
        }
        .pd-lb-close:hover { color: #fff; }

        .pd-lb-counter {
          position: absolute;
          top: 22px; left: 50%;
          transform: translateX(-50%);
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: rgba(255,255,255,0.4);
        }

        .pd-lb-img-wrap {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          max-height: calc(100vh - 160px);
          padding: 48px 80px 8px;
        }
        .pd-lb-img {
          max-width: 100%; max-height: 100%;
          object-fit: contain;
          box-shadow: 0 8px 48px rgba(0,0,0,0.8);
          animation: pd-fadein 0.22s ease;
        }
        @keyframes pd-fadein {
          from { opacity: 0; transform: scale(0.97); }
          to   { opacity: 1; transform: scale(1); }
        }

        .pd-lb-nav {
          position: absolute;
          top: 50%; transform: translateY(-50%);
          background: rgba(146,0,0,0.8);
          border: none; color: #fff;
          font-size: 36px;
          width: 52px; height: 52px;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10;
          transition: background 0.2s, transform 0.2s;
          padding: 0; line-height: 1;
        }
        .pd-lb-nav:hover {
          background: #920000;
          transform: translateY(-50%) scale(1.08);
        }
        .pd-lb-prev { left: 16px; }
        .pd-lb-next { right: 16px; }

        .pd-lb-thumbs {
          display: flex;
          gap: 6px;
          overflow-x: auto;
          padding: 10px 16px 4px;
          max-width: 100%;
          scrollbar-width: thin;
          scrollbar-color: #920000 transparent;
          flex-shrink: 0;
        }
        .pd-lb-thumbs::-webkit-scrollbar { height: 3px; }
        .pd-lb-thumbs::-webkit-scrollbar-thumb { background: #920000; border-radius: 2px; }

        .pd-lb-thumb {
          width: 60px; height: 44px;
          object-fit: cover;
          cursor: pointer;
          opacity: 0.4;
          border: 2px solid transparent;
          flex-shrink: 0;
          transition: opacity 0.2s, border-color 0.2s;
        }
        .pd-lb-thumb:hover { opacity: 0.8; }
        .pd-lb-thumb-on { opacity: 1; border-color: #920000; }

        .pd-lb-swipe-hint {
          display: none;
          position: absolute;
          bottom: 70px; left: 50%;
          transform: translateX(-50%);
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 11px;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: rgba(255,255,255,0.25);
          white-space: nowrap;
          pointer-events: none;
        }

        /* ── Not found ── */
        .pd-not-found {
          padding: 80px;
          text-align: center;
          color: #920000;
          font-size: 20px;
        }
        .pd-not-found button {
          margin-top: 16px;
          padding: 12px 28px;
          background: #920000; color: #fff;
          border: none; cursor: pointer;
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 13px; font-weight: 700;
          letter-spacing: 2px; text-transform: uppercase;
        }

        /* ════════════════════════════════════════════════
           RESPONSIVE — mirrors App.css breakpoints
        ════════════════════════════════════════════════ */

        /* Tablet ≤ 900px */
        @media (max-width: 900px) {
          .pd-hero-inner {
            padding-top: clamp(90px, 16vw, 130px);
          }
          .pd-gallery {
            grid-template-columns: repeat(4, 1fr);
            grid-auto-rows: clamp(120px, 18vw, 200px);
            padding-left: clamp(12px, 3vw, 24px);
            padding-right: clamp(12px, 3vw, 24px);
          }
          .pd-tile { grid-column: span 2; }
          .pd-tile-wide { grid-column: span 2; }
          .pd-lb-img-wrap { padding: 48px 16px 8px; }
          .pd-lb-nav { display: none; }
        }

        /* Hamburger nav breakpoint ≤ 860px */
        @media (max-width: 860px) {
          .pd-hero-inner {
            padding-top: clamp(100px, 18vw, 140px);
          }
        }

        /* Mobile ≤ 480px */
        @media (max-width: 480px) {
          .pd-hero {
            min-height: clamp(220px, 55vw, 320px);
          }
          .pd-hero-inner {
            /* Extra top padding on small screens where navbar is relatively taller */
            padding-top: clamp(96px, 22vw, 120px);
            padding-left: 16px;
            padding-right: 16px;
            gap: 16px;
          }
          .pd-gallery {
            grid-template-columns: repeat(2, 1fr);
            grid-auto-rows: clamp(110px, 35vw, 160px);
            padding-left: 8px;
            padding-right: 8px;
            gap: 4px;
          }
          .pd-tile { grid-column: span 1; }
          .pd-tile-wide { grid-column: span 1; }
          .pd-lb-img-wrap { padding: 40px 16px 4px; }
          .pd-lb-nav { display: none; }
          .pd-lb-swipe-hint { display: block; }
          .pd-lb-thumb { width: 48px; height: 36px; }
        }

        /* Tiny phones ≤ 380px */
        @media (max-width: 380px) {
          .pd-title { font-size: clamp(30px, 11vw, 48px); }
        }

        /* Wide / zoomed-out ≥ 1600px — mirrors App.css */
        @media (min-width: 1600px) {
          .pd-hero-inner { padding-left: 100px; padding-right: 100px; }
          .pd-gallery    { padding-left: 100px; padding-right: 100px; }
        }
        @media (min-width: 2000px) {
          .pd-hero-inner { max-width: 1600px; padding-left: 120px; padding-right: 120px; }
          .pd-gallery    { padding-left: 120px; padding-right: 120px; }
        }

      `}</style>
    </div>
  );
}