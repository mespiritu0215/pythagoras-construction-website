import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import email from "./email.png";
import phone from "./phone.png";
import clock from "./clock.png";

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

type Project = {
  id: number;
  title: string;
  images: string[];
};

export default function Projects() {
  const navigate = useNavigate();

  const projects: Project[] = [
    { id: 1, title: "Ayala Cebu Smart", images: [AyalaCebuSmart1, AyalaCebuSmart2, AyalaCebuSmart3, AyalaCebuSmart4, AyalaCebuSmart5, AyalaCebuSmart6, AyalaCebuSmart7, AyalaCebuSmart8] },
    { id: 2, title: "Gaisano Mactan Smart", images: [GaisanoMactanSmart1, GaisanoMactanSmart2, GaisanoMactanSmart3, GaisanoMactanSmart4, GaisanoMactanSmart5, GaisanoMactanSmart6, GaisanoMactanSmart7, GaisanoMactanSmart8, GaisanoMactanSmart9, GaisanoMactanSmart10, GaisanoMactanSmart11, GaisanoMactanSmart12] },
    { id: 3, title: "Robinson Iligan Smart", images: [RobinsonIliganSmart1, RobinsonIliganSmart2, RobinsonIliganSmart3, RobinsonIliganSmart4, RobinsonIliganSmart5, RobinsonIliganSmart6, RobinsonIliganSmart7, RobinsonIliganSmart8, RobinsonIliganSmart9, RobinsonIliganSmart10, RobinsonIliganSmart11, RobinsonIliganSmart12] },
    { id: 4, title: "SM Legaspi Smart", images: [SMLegaspiSmart1, SMLegaspiSmart2, SMLegaspiSmart3, SMLegaspiSmart4, SMLegaspiSmart5, SMLegaspiSmart6, SMLegaspiSmart7, SMLegaspiSmart8, SMLegaspiSmart9, SMLegaspiSmart10, SMLegaspiSmart11, SMLegaspiSmart12] },
  ];

  const [indexMap, setIndexMap] = useState<Record<number, number>>({
    1: 0, 2: 0, 3: 0, 4: 0,
  });

  const intervalRef = useRef<Record<number, any>>({});

  const startHover = (id: number, len: number) => {
    if (intervalRef.current[id]) return;
    intervalRef.current[id] = setInterval(() => {
      setIndexMap((prev) => ({ ...prev, [id]: (prev[id] + 1) % len }));
    }, 1200);
  };

  const stopHover = (id: number) => {
    if (intervalRef.current[id]) {
      clearInterval(intervalRef.current[id]);
      intervalRef.current[id] = null;
    }
  };

  useEffect(() => {
    return () => {
      Object.values(intervalRef.current).forEach((i) => i && clearInterval(i));
    };
  }, []);

  return (
    <main className="projects-page">
      <h1 className="page-title">PROJECTS</h1>

      <div className="projects-grid">
        {projects.map((project) => {
          const currentIndex = indexMap[project.id];
          return (
            <div key={project.id} className="project-card">
              <h2 className="project-title">{project.title}</h2>
              <div
                className="carousel"
                onMouseEnter={() => startHover(project.id, project.images.length)}
                onMouseLeave={() => stopHover(project.id)}
                onTouchStart={() => startHover(project.id, project.images.length)}
                onTouchEnd={() => stopHover(project.id)}
                onClick={() => navigate(`/projects/${project.id}`)}
              >
                {project.images.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt={`${project.title} photo ${i + 1}`}
                    className={`carousel-img${i === currentIndex ? " active" : ""}`}
                  />
                ))}
                <div className="carousel-overlay">
                  <span className="view-label">View Project →</span>
                </div>
                <div className="dot-row">
                  {project.images.map((_, i) => (
                    <span key={i} className={`dot${i === currentIndex ? " dot-active" : ""}`} />
                  ))}
                </div>
              </div>
              <p className="hint">Hover / Tap to preview • Click to view all</p>
            </div>
          );
        })}
      </div>

      {/* CONTACT */}
      <div className="contact-wrapper">

        {/* Card 1 — now matches the other three */}
        <div className="contact-card">
          <h3 className="contact-card-title">Contact us today</h3>
          <p className="contact-card-sub">Let's bring your vision to life together.</p>
        </div>

        <div className="contact-card">
          <img src={email} alt="Email" />
          <h4>Email Us</h4>
          <a href="mailto:pci051@yahoo.com">pci051@yahoo.com</a>
          <p>We reply within 24 hours</p>
        </div>

        <div className="contact-card">
          <img src={phone} alt="Phone" />
          <h4>Have any questions?</h4>
          <p>(+63) 912 123 1234</p>
        </div>

        <div className="contact-card">
          <img src={clock} alt="Working Hours" />
          <h4>Working Hours</h4>
          <p>Mon – Sat&nbsp;8:00 AM – 5:00 PM</p>
        </div>

      </div>

      <style>{`
        /* ── Base ─────────────────────────────────────── */
        .projects-page {
          padding: 32px 16px 48px;
          background: transparent;
          min-height: 100vh;
          box-sizing: border-box;
        }

        .page-title {
          font-size: clamp(22px, 5vw, 38px);
          color: #920000;
          font-weight: 800;
          letter-spacing: 2px;
          margin-bottom: 28px;
          padding-left: 4px;
        }

        /* ── Grid — larger on desktop ─────────────────── */
        .projects-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr); /* fixed 4 cols on desktop */
          gap: 24px;
          max-width: 1400px;
          margin: 0 auto;
        }

        /* ── Card ─────────────────────────────────────── */
        .project-card {
          background: rgba(255, 255, 255, 0.88);
          backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);
          border-radius: 14px;
          padding: 16px 16px 12px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.12);
          display: flex;
          flex-direction: column;
          min-width: 0;
        }

        .project-title {
          font-size: clamp(14px, 1.4vw, 20px);
          color: #920000;
          font-weight: 700;
          margin: 0 0 12px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        /* ── Carousel — taller on desktop ─────────────── */
        .carousel {
          position: relative;
          width: 100%;
          padding-top: 85%;   /* taller ratio = bigger images on desktop */
          border-radius: 10px;
          overflow: hidden;
          cursor: pointer;
          background: #ddd;
          flex-shrink: 0;
        }

        .carousel-img {
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

        .carousel-img.active { opacity: 1; }

        .carousel-overlay {
          position: absolute;
          inset: 0;
          background: rgba(146, 0, 0, 0);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.3s ease;
          pointer-events: none;
        }

        .carousel:hover .carousel-overlay,
        .carousel:active .carousel-overlay {
          background: rgba(146, 0, 0, 0.30);
        }

        .view-label {
          color: #fff;
          font-size: 16px;
          font-weight: 700;
          opacity: 0;
          transform: translateY(6px);
          transition: opacity 0.25s ease, transform 0.25s ease;
        }

        .carousel:hover .view-label {
          opacity: 1;
          transform: translateY(0);
        }

        .dot-row {
          position: absolute;
          bottom: 8px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 5px;
          flex-wrap: wrap;
          justify-content: center;
          max-width: 90%;
        }

        .dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: rgba(255,255,255,0.5);
          transition: background 0.3s;
          flex-shrink: 0;
        }

        .dot-active { background: #fff; }

        .hint {
          font-size: 10px;
          color: #888;
          margin: 8px 0 0;
          text-align: center;
        }

        /* ── Contact — all 4 cards identical style ─────── */
        .contact-wrapper {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 220px));
          gap: 16px;
          justify-content: center;
          margin: 52px auto 0;
          padding: 0 8px;
        }

        .contact-card {
          background: rgba(254, 251, 242, 0.92);
          backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);
          padding: 22px 14px;
          border-radius: 14px;
          box-shadow: 0 4px 14px rgba(146,0,0,0.18);
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 5px;
          /* NO special background override — all cards look the same */
        }

        .contact-card img {
          width: 34px;
          height: 34px;
          object-fit: contain;
          margin-bottom: 4px;
        }

        /* Title in card 1 — same size/colour as h4 in others */
        .contact-card-title {
          font-size: clamp(13px, 2vw, 15px);
          color: #920000;
          font-weight: 700;
          margin: 0;
          font-family: 'Montserrat', sans-serif;
        }

        .contact-card-sub {
          font-size: clamp(11px, 1.8vw, 13px);
          color: #555;
          margin: 0;
        }

        .contact-card h4 {
          font-size: clamp(13px, 2vw, 15px);
          color: #920000;
          font-weight: 700;
          margin: 0;
        }

        .contact-card p {
          font-size: clamp(11px, 1.8vw, 13px);
          color: #555;
          margin: 0;
        }

        .contact-card a {
          font-size: clamp(11px, 1.8vw, 13px);
          color: #920000;
          text-decoration: none;
          font-weight: 600;
          word-break: break-all;
        }

        .contact-card a:hover { text-decoration: underline; }

        /* ── Tablet (≤900px) — 2-col grid, keep mobile sizes ── */
        @media (max-width: 900px) {
          .projects-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 14px;
            max-width: 100%;
          }

          .carousel {
            padding-top: 75%; /* back to normal ratio on tablet/mobile */
          }

          .project-title {
            font-size: clamp(14px, 3vw, 17px);
          }

          .contact-wrapper {
            grid-template-columns: repeat(2, minmax(0, 220px));
          }
        }

        /* ── Mobile (≤480px) — 1-col grid ────────────────── */
        @media (max-width: 480px) {
          .projects-page {
            padding: 20px 12px 40px;
          }

          .projects-grid {
            grid-template-columns: 1fr;
            gap: 14px;
          }

          .carousel { padding-top: 68%; }

          .contact-wrapper {
            grid-template-columns: repeat(2, minmax(0, 160px));
            gap: 12px;
          }
        }
      `}</style>
    </main>
  );
}