import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback, useRef } from "react";

import AyalaCebuSmart1 from "./CompletedProjects/AyalaCebu/AyalaCebuSmart1.png";
import AyalaCebuSmart2 from "./CompletedProjects/AyalaCebu/AyalaCebuSmart2.png";
import AyalaCebuSmart3 from "./CompletedProjects/AyalaCebu/AyalaCebuSmart3.png";
import AyalaCebuSmart4 from "./CompletedProjects/AyalaCebu/AyalaCebuSmart4.png";
import AyalaCebuSmart5 from "./CompletedProjects/AyalaCebu/AyalaCebuSmart5.png";
import AyalaCebuSmart6 from "./CompletedProjects/AyalaCebu/AyalaCebuSmart6.png";
import AyalaCebuSmart7 from "./CompletedProjects/AyalaCebu/AyalaCebuSmart7.png";
import AyalaCebuSmart8 from "./CompletedProjects/AyalaCebu/AyalaCebuSmart8.png";

import GaisanoMactanSmart1 from "./CompletedProjects/GaisanoMactan/GaisanoMactanSmart1.jpg";
import GaisanoMactanSmart2 from "./CompletedProjects/GaisanoMactan/GaisanoMactanSmart2.jpg";
import GaisanoMactanSmart3 from "./CompletedProjects/GaisanoMactan/GaisanoMactanSmart3.jpg";
import GaisanoMactanSmart4 from "./CompletedProjects/GaisanoMactan/GaisanoMactanSmart4.jpg";
import GaisanoMactanSmart5 from "./CompletedProjects/GaisanoMactan/GaisanoMactanSmart5.jpg";
import GaisanoMactanSmart6 from "./CompletedProjects/GaisanoMactan/GaisanoMactanSmart6.jpg";
import GaisanoMactanSmart7 from "./CompletedProjects/GaisanoMactan/GaisanoMactanSmart7.jpg";
import GaisanoMactanSmart8 from "./CompletedProjects/GaisanoMactan/GaisanoMactanSmart8.jpg";
import GaisanoMactanSmart9 from "./CompletedProjects/GaisanoMactan/GaisanoMactanSmart9.jpg";
import GaisanoMactanSmart10 from "./CompletedProjects/GaisanoMactan/GaisanoMactanSmart10.jpg";
import GaisanoMactanSmart11 from "./CompletedProjects/GaisanoMactan/GaisanoMactanSmart11.jpg";
import GaisanoMactanSmart12 from "./CompletedProjects/GaisanoMactan/GaisanoMactanSmart12.jpg";

import RobinsonIliganSmart1 from "./CompletedProjects/RobinsonsIligan/RobinsonIliganSmart1.jpg";
import RobinsonIliganSmart2 from "./CompletedProjects/RobinsonsIligan/RobinsonIliganSmart2.jpg";
import RobinsonIliganSmart3 from "./CompletedProjects/RobinsonsIligan/RobinsonIliganSmart3.jpg";
import RobinsonIliganSmart4 from "./CompletedProjects/RobinsonsIligan/RobinsonIliganSmart4.jpg";
import RobinsonIliganSmart5 from "./CompletedProjects/RobinsonsIligan/RobinsonIliganSmart5.jpg";
import RobinsonIliganSmart6 from "./CompletedProjects/RobinsonsIligan/RobinsonIliganSmart6.jpg";
import RobinsonIliganSmart7 from "./CompletedProjects/RobinsonsIligan/RobinsonIliganSmart7.jpg";
import RobinsonIliganSmart8 from "./CompletedProjects/RobinsonsIligan/RobinsonIliganSmart8.jpg";
import RobinsonIliganSmart9 from "./CompletedProjects/RobinsonsIligan/RobinsonIliganSmart9.jpg";
import RobinsonIliganSmart10 from "./CompletedProjects/RobinsonsIligan/RobinsonIliganSmart10.jpg";
import RobinsonIliganSmart11 from "./CompletedProjects/RobinsonsIligan/RobinsonIliganSmart11.jpg";
import RobinsonIliganSmart12 from "./CompletedProjects/RobinsonsIligan/RobinsonIliganSmart12.jpg";

import SMLegaspiSmart1 from "./CompletedProjects/SMLegaspi/SMLegaspiSmart1.jpg";
import SMLegaspiSmart2 from "./CompletedProjects/SMLegaspi/SMLegaspiSmart2.jpg";
import SMLegaspiSmart3 from "./CompletedProjects/SMLegaspi/SMLegaspiSmart3.jpg";
import SMLegaspiSmart4 from "./CompletedProjects/SMLegaspi/SMLegaspiSmart4.jpg";
import SMLegaspiSmart5 from "./CompletedProjects/SMLegaspi/SMLegaspiSmart5.jpg";
import SMLegaspiSmart6 from "./CompletedProjects/SMLegaspi/SMLegaspiSmart6.jpg";
import SMLegaspiSmart7 from "./CompletedProjects/SMLegaspi/SMLegaspiSmart7.jpg";
import SMLegaspiSmart8 from "./CompletedProjects/SMLegaspi/SMLegaspiSmart8.jpg";
import SMLegaspiSmart9 from "./CompletedProjects/SMLegaspi/SMLegaspiSmart9.jpg";
import SMLegaspiSmart10 from "./CompletedProjects/SMLegaspi/SMLegaspiSmart10.jpg";
import SMLegaspiSmart11 from "./CompletedProjects/SMLegaspi/SMLegaspiSmart11.jpg";
import SMLegaspiSmart12 from "./CompletedProjects/SMLegaspi/SMLegaspiSmart12.jpg";

import GlobeBaliuag1 from "./CompletedProjects/GlobeBaliuag/GlobeBaliuag1.png";
import GlobeBaliuag2 from "./CompletedProjects/GlobeBaliuag/GlobeBaliuag2.png";
import GlobeBaliuag3 from "./CompletedProjects/GlobeBaliuag/GlobeBaliuag3.png";
import GlobeBaliuag4 from "./CompletedProjects/GlobeBaliuag/GlobeBaliuag4.png";
import GlobeBaliuag5 from "./CompletedProjects/GlobeBaliuag/GlobeBaliuag5.png";
import GlobeBaliuag6 from "./CompletedProjects/GlobeBaliuag/GlobeBaliuag6.png";
import GlobeBaliuag7 from "./CompletedProjects/GlobeBaliuag/GlobeBaliuag7.png";
import GlobeBaliuag8 from "./CompletedProjects/GlobeBaliuag/GlobeBaliuag8.png";
import GlobeBaliuag9 from "./CompletedProjects/GlobeBaliuag/GlobeBaliuag9.png";
import GlobeBaliuag10 from "./CompletedProjects/GlobeBaliuag/GlobeBaliuag10.png";
import GlobeBaliuag11 from "./CompletedProjects/GlobeBaliuag/GlobeBaliuag11.png";
import GlobeBaliuag12 from "./CompletedProjects/GlobeBaliuag/GlobeBaliuag12.png";
import GlobeBaliuag13 from "./CompletedProjects/GlobeBaliuag/GlobeBaliuag13.png";
import GlobeBaliuag14 from "./CompletedProjects/GlobeBaliuag/GlobeBaliuag14.png";
import GlobeBaliuag15 from "./CompletedProjects/GlobeBaliuag/GlobeBaliuag15.png";
import GlobeBaliuag16 from "./CompletedProjects/GlobeBaliuag/GlobeBaliuag16.png";
import GlobeBaliuag17 from "./CompletedProjects/GlobeBaliuag/GlobeBaliuag17.png";
import GlobeBaliuag18 from "./CompletedProjects/GlobeBaliuag/GlobeBaliuag18.png";

type ProjectData = {
  id: number;
  title: string;
  category: string;
  images: string[];
};

const ALL_PROJECTS: ProjectData[] = [
  {
    id: 1,
    title: "Ayala Cebu Smart",
    category: "Office Renovation",
    images: [AyalaCebuSmart1, AyalaCebuSmart2, AyalaCebuSmart3, AyalaCebuSmart4, AyalaCebuSmart5, AyalaCebuSmart6, AyalaCebuSmart7, AyalaCebuSmart8],
  },
  {
    id: 2,
    title: "Gaisano Mactan Smart",
    category: "Office Renovation",
    images: [GaisanoMactanSmart1, GaisanoMactanSmart2, GaisanoMactanSmart3, GaisanoMactanSmart4, GaisanoMactanSmart5, GaisanoMactanSmart6, GaisanoMactanSmart7, GaisanoMactanSmart8, GaisanoMactanSmart9, GaisanoMactanSmart10, GaisanoMactanSmart11, GaisanoMactanSmart12],
  },
  {
    id: 3,
    title: "Robinson Iligan Smart",
    category: "Office Renovation",
    images: [RobinsonIliganSmart1, RobinsonIliganSmart2, RobinsonIliganSmart3, RobinsonIliganSmart4, RobinsonIliganSmart5, RobinsonIliganSmart6, RobinsonIliganSmart7, RobinsonIliganSmart8, RobinsonIliganSmart9, RobinsonIliganSmart10, RobinsonIliganSmart11, RobinsonIliganSmart12],
  },
  {
    id: 4,
    title: "SM Legaspi Smart",
    category: "Office Renovation",
    images: [SMLegaspiSmart1, SMLegaspiSmart2, SMLegaspiSmart3, SMLegaspiSmart4, SMLegaspiSmart5, SMLegaspiSmart6, SMLegaspiSmart7, SMLegaspiSmart8, SMLegaspiSmart9, SMLegaspiSmart10, SMLegaspiSmart11, SMLegaspiSmart12],
  },
  {
    id: 5,
    title: "Globe Baliuag",
    category: "Electricals",
    images: [GlobeBaliuag1, GlobeBaliuag2, GlobeBaliuag3, GlobeBaliuag4, GlobeBaliuag5, GlobeBaliuag6, GlobeBaliuag7, GlobeBaliuag8, GlobeBaliuag9, GlobeBaliuag10, GlobeBaliuag11, GlobeBaliuag12, GlobeBaliuag13, GlobeBaliuag14, GlobeBaliuag15, GlobeBaliuag16, GlobeBaliuag17, GlobeBaliuag18],
  },
];

export default function ProjectDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const project = ALL_PROJECTS.find((p) => p.id === Number(id));

  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [lightboxVisible, setLightboxVisible] = useState(false);

  // Touch swipe state
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

  // Touch swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = e.changedTouches[0].clientY - touchStartY.current;
    // Only swipe if horizontal movement is dominant and exceeds threshold
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) {
      if (dx < 0) lightboxNext();
      else lightboxPrev();
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === "ArrowLeft")  lightboxPrev();
      if (e.key === "ArrowRight") lightboxNext();
      if (e.key === "Escape")     closeLightbox();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightboxIndex, lightboxPrev, lightboxNext]);

  useEffect(() => {
    document.body.style.overflow = lightboxVisible ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [lightboxVisible]);

  if (!project) {
    return (
      <div className="pd-not-found">
        <p>Project not found.</p>
        <button onClick={() => navigate("/projects")}>← Back to Projects</button>
      </div>
    );
  }

  // Determine if the last row has a remainder of 2 images
  const remainder = project.images.length % 3;
  const lastRowStart = project.images.length - remainder;

  const getTileClass = (i: number): string => {
    // If remainder is 2, the last 2 tiles each span 1.5 columns (achieved via span 3 on a 6-col grid)
    if (remainder === 2 && i >= lastRowStart) return "pd-tile pd-tile-wide";
    return "pd-tile";
  };

  return (
    <div className="pd-page">

      {/* ── HEADER STRIP ── */}
      <div className="pd-header">
        <button className="pd-back-btn" onClick={() => navigate("/projects")}>
          <span className="pd-back-arrow">←</span>
          <span>Back to Projects</span>
        </button>
        <div className="pd-header-text">
          <span className="pd-category-badge">{project.category}</span>
          <h1 className="pd-title">{project.title}</h1>
          <p className="pd-count">{project.images.length} photographs</p>
        </div>
      </div>

      {/* ── GALLERY GRID ── */}
      {/*
        Uses a 6-column grid internally.
        - Normal tiles: span 2 columns each → 3 per row.
        - Last row with 2 tiles: each spans 3 columns → fills the row evenly.
      */}
      <div className="pd-gallery">
        {project.images.map((img, i) => (
          <div
            key={i}
            className={getTileClass(i)}
            onClick={() => openLightbox(i)}
          >
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
          className={`pd-lightbox ${lightboxVisible ? "pd-lightbox-visible" : ""}`}
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

          {/* Swipe hint — mobile only */}
          <div className="pd-lb-swipe-hint">swipe to navigate</div>

          <div className="pd-lb-thumbs" onClick={(e) => e.stopPropagation()}>
            {project.images.map((img, i) => (
              <img
                key={i}
                src={img}
                alt={`thumb ${i + 1}`}
                className={`pd-lb-thumb ${i === lightboxIndex ? "pd-lb-thumb-active" : ""}`}
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
          padding-bottom: 60px;
          background: transparent;
        }

        /* ── Header strip ─────────────────────────── */
        .pd-header {
          display: flex;
          align-items: flex-start;
          gap: 24px;
          padding: 32px 48px 24px;
          background: rgba(255,255,255,0.72);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(146,0,0,0.12);
        }

        .pd-back-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          background: none;
          border: 2px solid #920000;
          color: #920000;
          font-family: 'Montserrat', sans-serif;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.5px;
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
          white-space: nowrap;
          margin-top: 6px;
          transition: background 0.2s, color 0.2s;
          flex-shrink: 0;
        }

        .pd-back-btn:hover {
          background: #920000;
          color: #fff;
        }

        .pd-back-arrow {
          font-size: 18px;
          line-height: 1;
        }

        .pd-header-text {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .pd-category-badge {
          font-family: 'Montserrat', sans-serif;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #fff;
          background: #920000;
          padding: 3px 10px;
          border-radius: 2px;
          width: fit-content;
        }

        .pd-title {
          font-family: 'Montserrat', sans-serif;
          font-size: clamp(22px, 4vw, 38px);
          font-weight: 800;
          color: #1a0000;
          margin: 0;
          line-height: 1.1;
          letter-spacing: 0.5px;
        }

        .pd-count {
          font-size: 13px;
          color: #888;
          margin: 0;
          letter-spacing: 0.5px;
        }

        /* ── Gallery grid ─────────────────────────── */
        /*
          6-column grid:
          - Normal tiles span 2 cols → 3 per row
          - Wide tiles (last row remainder of 2) span 3 cols → 2 tiles fill the row
        */
        .pd-gallery {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          grid-auto-rows: 280px;
          gap: 8px;
          padding: 8px 48px 0;
        }

        .pd-tile {
          grid-column: span 2;
          position: relative;
          overflow: hidden;
          cursor: pointer;
          background: #ccc;
          border-radius: 4px;
        }

        /* Last row with 2 images: each spans 3 of 6 columns */
        .pd-tile-wide {
          grid-column: span 3;
        }

        .pd-tile img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          display: block;
          transition: transform 0.4s ease;
        }

        .pd-tile:hover img {
          transform: scale(1.06);
        }

        .pd-tile-overlay {
          position: absolute;
          inset: 0;
          background: rgba(146,0,0,0);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.3s;
        }

        .pd-tile:hover .pd-tile-overlay {
          background: rgba(146,0,0,0.35);
        }

        .pd-tile-icon {
          font-size: 32px;
          color: #fff;
          opacity: 0;
          transform: scale(0.7);
          transition: opacity 0.25s, transform 0.25s;
          line-height: 1;
        }

        .pd-tile:hover .pd-tile-icon {
          opacity: 1;
          transform: scale(1);
        }

        /* ── Lightbox ─────────────────────────────── */
        .pd-lightbox {
          position: fixed;
          inset: 0;
          z-index: 2000;
          background: rgba(10, 0, 0, 0.96);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.28s ease;
          padding: 16px;
        }

        .pd-lightbox-visible {
          opacity: 1;
        }

        .pd-lb-close {
          position: absolute;
          top: 18px;
          right: 22px;
          background: none;
          border: none;
          color: rgba(255,255,255,0.7);
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
          top: 22px;
          left: 50%;
          transform: translateX(-50%);
          font-family: 'Montserrat', sans-serif;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 2px;
          color: rgba(255,255,255,0.5);
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
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
          border-radius: 4px;
          box-shadow: 0 8px 48px rgba(0,0,0,0.7);
          animation: pd-lb-fadein 0.22s ease;
        }

        @keyframes pd-lb-fadein {
          from { opacity: 0; transform: scale(0.97); }
          to   { opacity: 1; transform: scale(1); }
        }

        .pd-lb-nav {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(146,0,0,0.75);
          border: none;
          color: #fff;
          font-size: 36px;
          width: 52px;
          height: 52px;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10;
          transition: background 0.2s, transform 0.2s;
          padding: 0;
          line-height: 1;
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
          width: 60px;
          height: 44px;
          object-fit: cover;
          border-radius: 3px;
          cursor: pointer;
          opacity: 0.45;
          border: 2px solid transparent;
          flex-shrink: 0;
          transition: opacity 0.2s, border-color 0.2s;
        }

        .pd-lb-thumb:hover { opacity: 0.8; }

        .pd-lb-thumb-active {
          opacity: 1;
          border-color: #920000;
        }

        /* Not found */
        .pd-not-found {
          padding: 80px;
          text-align: center;
          color: #920000;
          font-size: 20px;
        }

        .pd-not-found button {
          margin-top: 16px;
          padding: 10px 24px;
          background: #920000;
          color: #fff;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
        }

        /* ── Responsive ───────────────────────────── */
        @media (max-width: 900px) {
          .pd-header {
            padding: 20px 20px 16px;
            flex-direction: column;
            gap: 12px;
          }

          .pd-gallery {
            grid-template-columns: repeat(4, 1fr);
            grid-auto-rows: 200px;
            padding: 6px 12px 0;
          }

          /* 2 per row on tablet: normal tiles span 2 of 4 cols */
          .pd-tile { grid-column: span 2; }

          /* last row remainder of 2 also spans 2 of 4 cols — same as normal */
          .pd-tile-wide { grid-column: span 2; }

          .pd-lb-img-wrap { padding: 48px 16px 8px; }
          .pd-lb-nav { display: none; }
        }

        @media (max-width: 480px) {
          .pd-header { padding: 16px; }

          .pd-gallery {
            grid-template-columns: repeat(2, 1fr);
            grid-auto-rows: 150px;
            padding: 4px 8px 0;
            gap: 4px;
          }

          /* 2 per row on mobile: all tiles span 1 of 2 cols */
          .pd-tile { grid-column: span 1; }
          .pd-tile-wide { grid-column: span 1; }

          .pd-lb-img-wrap { padding: 40px 16px 4px; }

          /* Hide nav buttons on mobile — swipe to navigate */
          .pd-lb-nav { display: none; }

          .pd-lb-thumbs { padding: 8px; }
          .pd-lb-thumb { width: 48px; height: 36px; }

          /* Swipe hint text */
          .pd-lb-swipe-hint { display: block; }
        }

        .pd-lb-swipe-hint {
          display: none;
          position: absolute;
          bottom: 70px;
          left: 50%;
          transform: translateX(-50%);
          font-family: 'Montserrat', sans-serif;
          font-size: 11px;
          letter-spacing: 1.5px;
          color: rgba(255,255,255,0.3);
          white-space: nowrap;
          pointer-events: none;
        }
      `}</style>
    </div>
  );
}