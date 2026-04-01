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

type Project = {
  id: number;
  title: string;
  images: string[];
};

type Category = {
  label: string;
  projects: Project[];
};

/* ── Reusable scrollable row ───────────────────────── */
function ProjectRow({ category, indexMap, setIndexMap }: {
  category: Category;
  indexMap: Record<number, number>;
  setIndexMap: React.Dispatch<React.SetStateAction<Record<number, number>>>;
}) {
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<Record<number, any>>({});

  const startHover = (id: number, len: number) => {
    if (intervalRef.current[id]) return;
    intervalRef.current[id] = setInterval(() => {
      setIndexMap((prev) => ({ ...prev, [id]: (prev[id] + 1) % len }));
    }, 1200);
  };

  const stopHover = (id: number) => {
    clearInterval(intervalRef.current[id]);
    intervalRef.current[id] = null;
  };

  useEffect(() => {
    return () => { Object.values(intervalRef.current).forEach((i) => i && clearInterval(i)); };
  }, []);

  const scrollBy = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    const card = scrollRef.current.querySelector(".project-card") as HTMLElement;
    const amount = card ? card.offsetWidth + 24 : 360;
    scrollRef.current.scrollBy({ left: dir === "right" ? amount : -amount, behavior: "smooth" });
  };

  return (
    <div className="category-section">
      {/* Category label */}
      <div className="category-header">
        <span className="category-label">{category.label}</span>
        <div className="category-line" />
      </div>

      {/* Scrollable row */}
      <div className="scroll-area">
        {category.projects.length > 3 && (
          <>
            <button className="scroll-btn scroll-btn-left"  onClick={() => scrollBy("left")}  aria-label="Scroll left">‹</button>
            <button className="scroll-btn scroll-btn-right" onClick={() => scrollBy("right")} aria-label="Scroll right">›</button>
          </>
        )}

        <div className="projects-track" ref={scrollRef}>
          {category.projects.map((project) => {
            const currentIndex = indexMap[project.id] ?? 0;
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
      </div>
    </div>
  );
}

/* ── Main component ────────────────────────────────── */
export default function Projects() {
  const categories: Category[] = [
    {
      label: "Office Renovations",
      projects: [
        { id: 1, title: "Ayala Cebu Smart",       images: [AyalaCebuSmart1, AyalaCebuSmart2, AyalaCebuSmart3, AyalaCebuSmart4, AyalaCebuSmart5, AyalaCebuSmart6, AyalaCebuSmart7, AyalaCebuSmart8] },
        { id: 2, title: "Gaisano Mactan Smart",    images: [GaisanoMactanSmart1, GaisanoMactanSmart2, GaisanoMactanSmart3, GaisanoMactanSmart4, GaisanoMactanSmart5, GaisanoMactanSmart6, GaisanoMactanSmart7, GaisanoMactanSmart8, GaisanoMactanSmart9, GaisanoMactanSmart10, GaisanoMactanSmart11, GaisanoMactanSmart12] },
        { id: 3, title: "Robinson Iligan Smart",   images: [RobinsonIliganSmart1, RobinsonIliganSmart2, RobinsonIliganSmart3, RobinsonIliganSmart4, RobinsonIliganSmart5, RobinsonIliganSmart6, RobinsonIliganSmart7, RobinsonIliganSmart8, RobinsonIliganSmart9, RobinsonIliganSmart10, RobinsonIliganSmart11, RobinsonIliganSmart12] },
        { id: 4, title: "SM Legaspi Smart",        images: [SMLegaspiSmart1, SMLegaspiSmart2, SMLegaspiSmart3, SMLegaspiSmart4, SMLegaspiSmart5, SMLegaspiSmart6, SMLegaspiSmart7, SMLegaspiSmart8, SMLegaspiSmart9, SMLegaspiSmart10, SMLegaspiSmart11, SMLegaspiSmart12] },
      ],
    },
    {
      label: "Electricals",
      projects: [
        { id: 5, title: "Globe Baliuag", images: [GlobeBaliuag1, GlobeBaliuag2, GlobeBaliuag3, GlobeBaliuag4, GlobeBaliuag5, GlobeBaliuag6, GlobeBaliuag7, GlobeBaliuag8, GlobeBaliuag9, GlobeBaliuag10, GlobeBaliuag11, GlobeBaliuag12, GlobeBaliuag13, GlobeBaliuag14, GlobeBaliuag15, GlobeBaliuag16, GlobeBaliuag17, GlobeBaliuag18] },
      ],
    },
  ];

  // Build initial indexMap from all projects across all categories
  const initialIndexMap: Record<number, number> = {};
  categories.forEach((cat) => cat.projects.forEach((p) => { initialIndexMap[p.id] = 0; }));

  const [indexMap, setIndexMap] = useState<Record<number, number>>(initialIndexMap);

  return (
    <main className="projects-page">
      <h1 className="page-title">PROJECTS</h1>

      {categories.map((cat) => (
        <ProjectRow
          key={cat.label}
          category={cat}
          indexMap={indexMap}
          setIndexMap={setIndexMap}
        />
      ))}

      {/* ── CONTACT ── */}
      <div className="contact-wrapper">
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
          <p>(046) 894-9518</p>
        </div>
        <div className="contact-card">
          <img src={clock} alt="Working Hours" />
          <h4>Working Hours</h4>
          <p>Mon – Sat&nbsp;8:00 AM – 5:00 PM</p>
        </div>
      </div>

      <style>{`
        /* ── Base ───────────────────────────────────── */
        .projects-page {
          padding: 32px 16px 0;
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
          text-align: center;
        }

        /* ── Category section ───────────────────────── */
        .category-section {
          margin-bottom: 48px;
        }

        .category-header {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 18px;
          padding: 0 4px;
        }

        .category-label {
          font-family: 'Montserrat', sans-serif;
          font-size: clamp(14px, 2vw, 20px);
          font-weight: 800;
          color: #920000;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          white-space: nowrap;
        }

        .category-line {
          flex: 1;
          height: 2px;
          background: linear-gradient(to right, #920000aa, transparent);
          border-radius: 2px;
        }

        /* ── Scroll area wrapper ─────────────────────── */
        .scroll-area {
          position: relative;
          max-width: 1400px;
          margin: 0 auto;
        }

        /* ── The scrollable row ──────────────────────── */
        .projects-track {
          display: flex;
          flex-direction: row;
          gap: 24px;
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          -webkit-overflow-scrolling: touch;
          padding: 8px 4px 16px;
          scrollbar-width: none;
        }
        .projects-track::-webkit-scrollbar { display: none; }

        /* ── Each card ───────────────────────────────── */
        .project-card {
          flex: 0 0 calc((100% - 48px) / 3);
          scroll-snap-align: start;
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

        /* ── Carousel ────────────────────────────────── */
        .carousel {
          position: relative;
          width: 100%;
          padding-top: 85%;
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

        /* ── Scroll arrow buttons ────────────────────── */
        .scroll-btn {
          position: absolute;
          top: 50%;
          transform: translateY(-60%);
          z-index: 10;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: none;
          background: rgba(146, 0, 0, 0.85);
          color: #fff;
          font-size: 26px;
          line-height: 1;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 3px 10px rgba(0,0,0,0.25);
          transition: background 0.2s, transform 0.2s;
          padding: 0;
        }

        .scroll-btn:hover {
          background: #6b0000;
          transform: translateY(-60%) scale(1.08);
        }

        .scroll-btn-left  { left: -20px; }
        .scroll-btn-right { right: -20px; }

        /* ── Contact ─────────────────────────────────── */
        .contact-wrapper {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 220px));
          gap: 16px;
          justify-content: center;
          margin: 20px auto 0;
          padding: 32px 8px 48px;
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
        }

        .contact-card img {
          width: 34px;
          height: 34px;
          object-fit: contain;
          margin-bottom: 4px;
        }

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

        /* ── Tablet (≤900px) ─────────────────────────── */
        @media (max-width: 900px) {
          .project-card {
            flex: 0 0 calc((100% - 24px) / 2);
          }
          .carousel { padding-top: 75%; }
          .project-title { font-size: clamp(14px, 3vw, 17px); }
          .scroll-btn { display: none; }
          .contact-wrapper {
            grid-template-columns: repeat(2, minmax(0, 220px));
          }
        }

        /* ── Mobile (≤480px) ─────────────────────────── */
        @media (max-width: 480px) {
          .projects-page { padding: 20px 12px 0; }
          .project-card { flex: 0 0 85vw; }
          .carousel { padding-top: 68%; }
          .scroll-btn { display: none; }
          .contact-wrapper {
            grid-template-columns: repeat(2, minmax(0, 160px));
            gap: 12px;
          }
        }
      `}</style>
    </main>
  );
}