/**
 * Projects.tsx  (v2)
 *
 * Admin changes:
 *  - ALL project cards (static + admin-added) show Edit and Delete buttons in Edit Mode
 *  - Static projects can be edited (overrides stored in Firestore) or deleted (ID added to deletedProjectIds)
 *  - Admin-added projects can be edited (Firestore doc updated) or deleted (doc removed)
 *  - Project field overrides from Firestore are applied before rendering
 *  - Hero subtitle is editable via EditableText
 *  - "+ Add Project" button in hero when in Edit Mode
 *
 * Color update: dark maroon (#6B0000 / rgba(107,0,0,...)) → crimson-red (#C0152A / rgba(192,21,42,...))
 */

import React, { useState, useRef, useEffect, JSX } from 'react';
import { useNavigate }  from 'react-router-dom';
import { CATEGORIES, CategoryGroup, ProjectData } from './Projectsdata';
import { useAdmin, EditableText, AdminProject, ProjectOverride } from './AdminContext';
import { AddProjectModal } from './AddProjectModal';
import emailIcon   from './email.png';
import phoneIcon   from './phone.png';
import clockIcon   from './clock.png';
import heroBgImg   from './background.png';

// ─────────────────────────────────────────────────────────────
//  HELPERS
// ─────────────────────────────────────────────────────────────

function applyOverride(project: ProjectData, override?: ProjectOverride): ProjectData {
  if (!override) return project;
  return {
    ...project,
    title:       override.title                   ?? project.title,
    description: override.description             ?? (project as any).description,
    location:    override.location                ?? (project as any).location,
    client:      override.client                  ?? (project as any).client,
    completion:  override.completion              ?? (project as any).completion,
    amount:      override.amount                  ?? (project as any).amount,
    ongoing:     override.ongoing   !== undefined  ? override.ongoing : (project as any).ongoing,
    cover:       override.cover                   ?? project.cover,
    images:      override.images                  ?? project.images,
  };
}

function mergeAdminProjects(
  staticCats:    CategoryGroup[],
  adminProjects: AdminProject[]
): CategoryGroup[] {
  if (!adminProjects.length) return staticCats;

  const merged: CategoryGroup[] = staticCats.map(c => ({ ...c, projects: [...c.projects] }));

  for (const ap of adminProjects) {
    const asProject = ap as unknown as ProjectData;
    const match = merged.find(c => c.label.toLowerCase() === ap.category.toLowerCase());
    if (match) {
      (match.projects as any[]).push(asProject);
    } else {
      const extra = merged.find(c => c.label === 'Admin Projects');
      if (extra) { (extra.projects as any[]).push(asProject); }
      else { merged.push({ label: 'Admin Projects', projects: [asProject] }); }
    }
  }
  return merged;
}

// ─────────────────────────────────────────────────────────────
//  PROJECT ROW
// ─────────────────────────────────────────────────────────────

type RowProps = {
  category:       CategoryGroup;
  indexMap:       Record<string, number>;
  setIndexMap:    React.Dispatch<React.SetStateAction<Record<string, number>>>;
  isLight:        boolean;
  adminProjectIds: Set<string>;
};

function ProjectRow({ category, indexMap, setIndexMap, isLight, adminProjectIds }: RowProps) {
  const navigate = useNavigate();
  const {
    editMode,
    projectOverrides,
    deleteStaticProject,
    removeAdminProject,
    deletedProjectIds,
  } = useAdmin();

  const trackRef  = useRef<HTMLDivElement>(null);
  const timerRef  = useRef<Record<string, ReturnType<typeof setInterval> | undefined>>({});

  const startCycle = (id: string, total: number) => {
    if (timerRef.current[id]) return;
    timerRef.current[id] = setInterval(() => {
      setIndexMap(prev => ({ ...prev, [id]: ((prev[id] ?? 0) + 1) % total }));
    }, 1200);
  };
  const stopCycle  = (id: string) => {
    clearInterval(timerRef.current[id]);
    timerRef.current[id] = undefined;
  };
  useEffect(() => {
    const r = timerRef.current;
    return () => { Object.values(r).forEach(t => clearInterval(t)); };
  }, []);

  const nudge = (dir: 'left' | 'right') => {
    if (!trackRef.current) return;
    const card = trackRef.current.querySelector<HTMLElement>('.prj-card');
    const amt  = card ? card.offsetWidth + 24 : 400;
    trackRef.current.scrollBy({ left: dir === 'right' ? amt : -amt, behavior: 'smooth' });
  };

  const [editingProject, setEditingProject] = useState<any | null>(null);
  const [editIsAdmin,    setEditIsAdmin]    = useState(false);

  const openEdit = (project: ProjectData, isAdminP: boolean) => {
    setEditingProject(project);
    setEditIsAdmin(isAdminP);
  };
  const closeEdit = () => { setEditingProject(null); };

  const handleDelete = async (project: ProjectData, isAdminP: boolean) => {
    const ok = window.confirm(
      `Delete "${project.title}"?\n\n` +
      (isAdminP
        ? 'This will permanently remove the project from Firebase.'
        : 'This will hide the project from all pages.')
    );
    if (!ok) return;

    if (isAdminP) {
      await removeAdminProject(String(project.id));
    } else {
      await deleteStaticProject(Number(project.id));
    }
  };

  return (
    <>
      <section className={`prj-section${isLight ? ' prj-section-light' : ' prj-section-dark'}`}>
        <div className="prj-section-inner">

          <div className="prj-row-header">
            <span className={`prj-cat-label${isLight ? ' prj-cat-label-on-light' : ''}`}>
              {category.label}
            </span>
            <div className="prj-cat-rule" />
          </div>

          <div className="prj-scroll-area">
            {category.projects.length > 3 && (
              <>
                <button className="prj-arrow prj-arrow-l" onClick={() => nudge('left')}>‹</button>
                <button className="prj-arrow prj-arrow-r" onClick={() => nudge('right')}>›</button>
              </>
            )}

            <div className="prj-track" ref={trackRef}>
              {category.projects.map((rawProject: ProjectData) => {
                const isAdminP  = adminProjectIds.has(String(rawProject.id));
                const isDeleted = !isAdminP && deletedProjectIds.includes(Number(rawProject.id));
                if (isDeleted) return null;

                const project = isAdminP
                  ? rawProject
                  : applyOverride(rawProject, projectOverrides[String(rawProject.id)]);

                const idKey = String(project.id);
                const idx   = indexMap[idKey] ?? 0;
                const images = project.images?.length ? project.images : [project.cover];

                return (
                  <div
                    key={idKey}
                    className={`prj-card${isLight ? ' prj-card-light' : ''}${editMode ? ' prj-card-edit-mode' : ''}`}
                    onClick={() => !editMode && navigate(`/projects/${project.id}`)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={e => !editMode && e.key === 'Enter' && navigate(`/projects/${project.id}`)}
                  >
                    <div
                      className="prj-carousel"
                      onMouseEnter={() => startCycle(idKey, images.length)}
                      onMouseLeave={() => stopCycle(idKey)}
                    >
                      {images.map((src: string, i: number) => (
                        <img key={i} src={src} alt={`${project.title} ${i + 1}`}
                          className={`prj-img${i === idx ? ' prj-img-active' : ''}`} />
                      ))}

                      {!editMode && (
                        <div className="prj-overlay">
                          <span className="prj-overlay-text">View Project →</span>
                        </div>
                      )}

                      {editMode && (
                        <div className="prj-admin-actions">
                          <button
                            className="prj-admin-btn prj-admin-edit"
                            type="button"
                            onClick={e => { e.stopPropagation(); openEdit(project, isAdminP); }}
                          >
                            ✏️ Edit
                          </button>
                          <button
                            className="prj-admin-btn prj-admin-del"
                            type="button"
                            onClick={e => { e.stopPropagation(); handleDelete(project, isAdminP); }}
                          >
                            🗑 Delete
                          </button>
                        </div>
                      )}

                      {editMode && (
                        <div className={`prj-source-badge${isAdminP ? ' prj-src-admin' : ' prj-src-static'}`}>
                          {isAdminP ? 'Admin Added' : 'Built-in'}
                        </div>
                      )}

                      {editMode && !isAdminP && projectOverrides[String(rawProject.id)] && (
                        <div className="prj-override-dot" title="Has overrides">●</div>
                      )}

                      <div className="prj-dots">
                        {images.map((_: string, i: number) => (
                          <span key={i} className={`prj-dot${i === idx ? ' prj-dot-on' : ''}`} />
                        ))}
                      </div>
                    </div>

                    <div className={`prj-footer${isLight ? ' prj-footer-light' : ''}`}>
                      <div className="prj-footer-text">
                        <p className="prj-cat-badge">{project.category}</p>
                        <p className={`prj-title${isLight ? ' prj-title-on-light' : ''}`}>
                          {project.title}
                        </p>
                      </div>
                      {!editMode && <div className="prj-arrow-icon">→</div>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </section>

      {editingProject && (
        <AddProjectModal
          onClose={closeEdit}
          editProject={editingProject}
          isAdminProject={editIsAdmin}
        />
      )}
    </>
  );
}

// ─────────────────────────────────────────────────────────────
//  MAIN COMPONENT
// ─────────────────────────────────────────────────────────────

export default function Projects(): JSX.Element {
  const { isAdmin, editMode, adminProjects, deletedProjectIds, getText } = useAdmin();
  const siteEmail = getText('site.email', 'pci1051@yahoo.com.ph');
  const [showAddModal, setShowAddModal] = useState(false);

  const adminProjectIds = new Set(adminProjects.map(p => String(p.id)));
  const mergedCategories = mergeAdminProjects(CATEGORIES, adminProjects);

  const allProjectIds = mergedCategories.flatMap(c => c.projects.map(p => String(p.id)));
  const initMap = Object.fromEntries(allProjectIds.map(id => [id, 0]));
  const [indexMap, setIndexMap] = useState<Record<string, number>>(initMap);

  useEffect(() => {
    setIndexMap(prev => {
      const next = { ...prev };
      adminProjects.forEach(p => { if (!(String(p.id) in next)) next[String(p.id)] = 0; });
      return next;
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [adminProjects.length]);

  const activeCategories = mergedCategories.filter(c => c.projects.length > 0);

  return (
    <>
      {/* ── HERO ── */}
      <section className="prj-hero">
        <div className="prj-hero-bg" style={{ backgroundImage: `url(${heroBgImg})` }} />
        <div className="prj-hero-overlay" />

        <div className="prj-hero-content">
          <p className="prj-eyebrow">Est. 1993 · PCAB Licensed · General "A"</p>
          <h1 className="prj-hero-title">
            <span className="prj-ht-line">OUR</span>
            <span className="prj-ht-line prj-ht-accent">PROJECTS</span>
          </h1>
          <EditableText adminKey="projects.hero.sub" tag="p" className="prj-hero-sub">
            A portfolio of completed construction and renovation projects across
            the Philippines — from office fit-outs to large-scale electrical installations.
          </EditableText>

          {isAdmin && editMode && (
            <button className="prj-add-btn" type="button"
              onClick={() => setShowAddModal(true)}>
              + Add New Project
            </button>
          )}
        </div>

        <div className="prj-hero-stats">
          <div className="prj-stat">
            <div className="prj-stat-num">30+</div>
            <div className="prj-stat-label">Years of Excellence</div>
          </div>
          <div className="prj-stat-divider" />
          <div className="prj-stat">
            <div className="prj-stat-num">100+</div>
            <div className="prj-stat-label">Active Workers</div>
          </div>
          <div className="prj-stat-divider" />
          <div className="prj-stat">
            <div className="prj-stat-num">Private</div>
            <div className="prj-stat-label">Clients Served</div>
          </div>
        </div>
      </section>

      {/* ── PROJECT ROWS ── */}
      {activeCategories.map((cat, i) => (
        <ProjectRow
          key={cat.label}
          category={cat}
          indexMap={indexMap}
          setIndexMap={setIndexMap}
          isLight={i % 2 === 0}
          adminProjectIds={adminProjectIds}
        />
      ))}

      {/* ── CONTACT ── */}
      <section className="contact-section" id="contact">
        <div className="contact-bg-image" />
        <div className="contact-bg-overlay" />
        <div className="contact-inner">
          <p className="section-tag light" style={{ textAlign: 'center' }}>GET IN TOUCH</p>
          <h2 className="contact-heading">Contact Us Today</h2>
          <p className="contact-sub">Let's bring your vision to life together.</p>
          <div className="contact-cards">
            <div className="contact-card contact-card-wide">
              <img src={emailIcon} alt="Email" className="contact-icon" />
              <p className="contact-card-label">Email Us At</p>
              <a href={`mailto:${siteEmail}`} className="contact-card-value link">
                <EditableText adminKey="site.email" tag="span">pci1051@yahoo.com.ph</EditableText>
              </a>
              <p className="contact-card-note">We reply within 24 hours</p>
            </div>
            <div className="contact-card">
              <img src={phoneIcon} alt="Phone" className="contact-icon" />
              <p className="contact-card-label">Have Any Questions?</p>
              <p className="contact-card-value">(046) 894-9518</p>
              <p className="contact-card-value">+63 927 572 4505 (Mobile)</p>
            </div>
            <div className="contact-card">
              <img src={clockIcon} alt="Hours" className="contact-icon" />
              <p className="contact-card-label">Working Hours</p>
              <p className="contact-card-value">Mon – Sat<br />8:00 AM – 5:00 PM</p>
            </div>
          </div>
        </div>
      </section>

      {showAddModal && <AddProjectModal onClose={() => setShowAddModal(false)} />}

      {/* ── STYLES ── */}
      <style>{`
        /* ─── Admin edit mode card ─── */
        .prj-card-edit-mode {
          cursor: default !important;
          outline: 2px dashed rgba(192,21,42,0.28);
        }
        .prj-card-edit-mode:hover,
        .prj-card-edit-mode:focus {
          border-color: rgba(192,21,42,0.10) !important;
          box-shadow: none !important;
        }

        /* ─── Action buttons overlay ─── */
        .prj-admin-actions {
          position: absolute; inset: 0;
          display: flex; align-items: center; justify-content: center;
          gap: 10px;
          background: rgba(18,0,0,0.55);
          opacity: 0; transition: opacity 0.2s;
          z-index: 8;
        }
        .prj-card:hover .prj-admin-actions { opacity: 1; }
        .prj-admin-btn {
          border: none; cursor: pointer;
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 11px; font-weight: 700; letter-spacing: 1.5px;
          text-transform: uppercase; padding: 9px 16px;
          transition: all 0.2s; white-space: nowrap;
        }
        .prj-admin-edit {
          background: rgba(253,246,238,0.92); color: #2C1810;
          border: 1px solid rgba(253,246,238,0.5);
        }
        .prj-admin-edit:hover { background: #FDF6EE; }
        .prj-admin-del {
          background: rgba(192,21,42,0.85); color: #FDF6EE;
          border: 1px solid rgba(192,21,42,0.5);
        }
        .prj-admin-del:hover { background: #C0152A; }

        /* ─── Source + override badges ─── */
        .prj-source-badge {
          position: absolute; bottom: 32px; left: 8px;
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 9px; font-weight: 700; letter-spacing: 2px;
          text-transform: uppercase; padding: 3px 8px; z-index: 5;
        }
        .prj-src-admin  { background: #C0152A;           color: #FDF6EE; }
        .prj-src-static { background: rgba(18,0,0,0.65); color: rgba(253,246,238,0.7); }

        .prj-override-dot {
          position: absolute; top: 8px; right: 8px; z-index: 6;
          color: #F5A623; font-size: 14px;
          text-shadow: 0 1px 4px rgba(0,0,0,0.6);
        }

        /* ─── Add Project button ─── */
        .prj-add-btn {
          margin-top: 24px;
          display: inline-flex; align-items: center; gap: 8px;
          background: #C0152A; color: #FDF6EE;
          border: 2px solid #C0152A;
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 13px; font-weight: 700;
          letter-spacing: 2px; text-transform: uppercase;
          padding: 13px 28px; cursor: pointer;
          transition: background 0.2s, color 0.2s;
          animation: prjFadeUp 0.4s ease both;
        }
        .prj-add-btn:hover { background: transparent; color: #FDF6EE; }

        /* ─── Original layout ─── */
        .prj-hero {
          position: relative; display: flex; flex-direction: column; overflow: hidden;
        }
        .prj-hero-bg {
          position: absolute; inset: 0;
          background-size: cover; background-position: center 60%;
        }
        .prj-hero-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(60,5,10,0.94) 0%, rgba(139,0,16,0.90) 60%, rgba(192,21,42,0.85) 100%);
        }
        .prj-hero-content {
          position: relative; z-index: 2;
          padding: clamp(120px,15vw,170px) clamp(20px,6vw,80px) clamp(36px,5vw,52px);
          max-width: 1280px; width: 100%; margin: 0 auto;
          animation: prjFadeUp 0.9s ease both;
        }
        @keyframes prjFadeUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .prj-eyebrow {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: clamp(10px,1.2vw,13px); font-weight: 600;
          letter-spacing: 4px; text-transform: uppercase;
          color: #F0E6D6; opacity: 0.62; margin: 0 0 clamp(16px,2.5vw,28px);
        }
        .prj-hero-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(56px,9.5vw,130px); line-height: 0.93;
          letter-spacing: 2px; color: #FDF6EE;
          margin: 0 0 clamp(20px,3vw,36px); display: flex; flex-direction: column;
        }
        .prj-ht-line  { display: block; }
        .prj-ht-accent { color: #F0E6D6; opacity: 0.72; }
        .prj-hero-sub {
          max-width: 560px;
          font-family: 'Barlow', sans-serif;
          font-size: clamp(13px,1.5vw,16px); line-height: 1.75;
          color: rgba(253,246,238,0.52); margin: 0;
          animation: prjFadeUp 0.8s 0.34s ease both;
        }
        .prj-hero-stats {
          position: relative; z-index: 2;
          display: flex; align-items: center; flex-wrap: wrap;
          background: rgba(192,21,42,0.38);
          border-top: 1px solid rgba(253,246,238,0.10);
          padding: clamp(20px,3vw,32px) clamp(20px,6vw,80px);
          animation: prjFadeUp 0.8s 0.46s ease both;
          backdrop-filter: blur(4px);
        }
        .prj-stat { display: flex; flex-direction: column; gap: 4px; padding: 0 clamp(24px,4vw,52px) 0 0; }
        .prj-stat-num { font-family: 'Bebas Neue', sans-serif; font-size: clamp(26px,3.5vw,40px); color: #FDF6EE; letter-spacing: 1px; }
        .prj-stat-label { font-family: 'Barlow Condensed', sans-serif; font-size: clamp(9px,1vw,12px); letter-spacing: 2px; text-transform: uppercase; color: rgba(253,246,238,0.40); }
        .prj-stat-divider { width: 1px; height: 40px; background: rgba(253,246,238,0.14); margin-right: clamp(24px,4vw,52px); flex-shrink: 0; }
        .prj-section { width: 100%; padding: clamp(52px,7vw,96px) 0; }
        .prj-section-dark  { background: #F0E6D6; }
        .prj-section-light { background: #FFFFFF; }
        .prj-section-inner { max-width: 1280px; margin: 0 auto; padding: 0 clamp(20px,6vw,80px); }
        .prj-row-header { display: flex; align-items: center; gap: 20px; margin-bottom: 28px; }
        .prj-cat-label { font-family: 'Barlow Condensed', sans-serif; font-size: clamp(11px,1.3vw,14px); font-weight: 700; letter-spacing: 5px; text-transform: uppercase; color: #C0152A; white-space: nowrap; }
        .prj-cat-rule { flex: 1; height: 1px; background: linear-gradient(to right, rgba(192,21,42,0.45), transparent); }
        .prj-scroll-area { position: relative; }
        .prj-track { display: flex; gap: 24px; overflow-x: auto; scroll-snap-type: x mandatory; -webkit-overflow-scrolling: touch; padding: 4px 2px 18px; scrollbar-width: none; }
        .prj-track::-webkit-scrollbar { display: none; }
        .prj-card { flex: 0 0 calc((100% - 48px) / 3); scroll-snap-align: start; min-width: 0; display: flex; flex-direction: column; background: rgba(192,21,42,0.05); border: 1px solid rgba(192,21,42,0.10); cursor: pointer; transition: border-color 0.3s, box-shadow 0.3s; outline: none; }
        .prj-card:hover, .prj-card:focus { border-color: rgba(192,21,42,0.35); box-shadow: 0 8px 32px rgba(192,21,42,0.10); }
        .prj-card-light { background: #FFFFFF; border: 1px solid rgba(192,21,42,0.09); box-shadow: 4px 6px 24px rgba(192,21,42,0.05); }
        .prj-carousel { position: relative; width: 100%; padding-top: 70%; overflow: hidden; background: #E8D8C4; flex-shrink: 0; }
        .prj-img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: center; opacity: 0; transition: opacity 0.55s ease-in-out; display: block; }
        .prj-img-active { opacity: 1; }
        .prj-overlay { position: absolute; inset: 0; background: rgba(192,21,42,0); display: flex; align-items: center; justify-content: center; transition: background 0.3s; pointer-events: none; }
        .prj-card:hover .prj-overlay { background: rgba(192,21,42,0.28); }
        .prj-overlay-text { font-family: 'Barlow Condensed', sans-serif; font-size: clamp(11px,1.2vw,14px); font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #FDF6EE; opacity: 0; transform: translateY(8px); transition: opacity 0.25s, transform 0.25s; }
        .prj-card:hover .prj-overlay-text { opacity: 1; transform: translateY(0); }
        .prj-dots { position: absolute; bottom: 9px; left: 50%; transform: translateX(-50%); display: flex; gap: 5px; flex-wrap: wrap; justify-content: center; max-width: 80%; }
        .prj-dot { width: 5px; height: 5px; border-radius: 50%; background: rgba(253,246,238,0.4); flex-shrink: 0; transition: background 0.3s; }
        .prj-dot-on { background: #FDF6EE; }
        .prj-footer { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: clamp(14px,1.8vw,20px); border-top: 1px solid rgba(192,21,42,0.08); background: #F0E6D6; }
        .prj-footer-light { background: #FFFFFF; border-top: 1px solid rgba(192,21,42,0.07); }
        .prj-footer-text { min-width: 0; }
        .prj-cat-badge { font-family: 'Barlow Condensed', sans-serif; font-size: clamp(9px,0.9vw,11px); font-weight: 700; letter-spacing: 3px; text-transform: uppercase; color: #C0152A; margin: 0 0 4px; }
        .prj-title { font-family: 'Barlow Condensed', sans-serif; font-size: clamp(14px,1.6vw,20px); font-weight: 700; letter-spacing: 1px; color: #2C1810; margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .prj-arrow-icon { flex-shrink: 0; width: 36px; height: 36px; border-radius: 50%; border: 1px solid rgba(192,21,42,0.38); color: #C0152A; font-size: 18px; display: flex; align-items: center; justify-content: center; transition: background 0.2s, border-color 0.2s, color 0.2s; padding-bottom: 5px; }
        .prj-card:hover .prj-arrow-icon { background: #C0152A; border-color: #C0152A; color: #FDF6EE; }
        .prj-arrow { position: absolute; top: 33%; transform: translateY(-50%); z-index: 10; width: 42px; height: 42px; border-radius: 50%; border: 1px solid rgba(192,21,42,0.35); background: rgba(253,246,238,0.92); color: #C0152A; font-size: 28px; line-height: 1; cursor: pointer; display: flex; align-items: center; justify-content: center; padding-bottom: 5px; transition: background 0.2s, border-color 0.2s, color 0.2s; }
        .prj-arrow:hover { background: #C0152A; border-color: #C0152A; color: #FDF6EE; }
        .prj-arrow-l { left: -21px; }
        .prj-arrow-r { right: -21px; }
        @media (max-width: 1024px) { .prj-card { flex: 0 0 calc((100% - 24px) / 2); } .prj-arrow { display: none; } }
        @media (max-width: 860px) { .prj-hero-content { padding-top: clamp(110px,20vw,150px); } .prj-hero-stats { row-gap: 16px; } .prj-stat-divider { display: none; } .prj-stat { padding-right: 24px; } }
        @media (max-width: 600px) { .prj-card { flex: 0 0 83vw; } .prj-arrow { display: none; } }
      `}</style>
    </>
  );
}