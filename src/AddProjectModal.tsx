/**
 * AddProjectModal.tsx  (v2)
 *
 * Handles both adding a new project and editing an existing one.
 *
 * Props:
 *   onClose       — close the modal
 *   editProject   — pass the project object to enter edit mode (omit for add mode)
 *   isAdminProject — true when editing an admin-added project (full update),
 *                    false when editing a static project (stores overrides only)
 */

import React, { useState, useRef, useEffect } from 'react';
import { useAdmin, AdminProject, ProjectOverride, uploadToStorage } from './AdminContext';

// Must match the category labels in your Projectsdata.ts
const CATEGORY_OPTIONS = [
  'Civil Works',
  'Electrical Works',
  'Architectural & Design',
  'Ongoing Projects',
];

// ─────────────────────────────────────────────────────────────
//  TYPES
// ─────────────────────────────────────────────────────────────

interface Props {
  onClose:         () => void;
  editProject?:    any;        // existing project data to pre-fill
  isAdminProject?: boolean;    // true = full Firestore doc update
}

/** An image slot — either an already-uploaded URL or a local File to upload */
type ImageSlot =
  | { type: 'url';  url: string }
  | { type: 'file'; file: File; preview: string };

// ─────────────────────────────────────────────────────────────
//  COMPONENT
// ─────────────────────────────────────────────────────────────

export function AddProjectModal({ onClose, editProject, isAdminProject }: Props) {
  const { addProject, updateAdminProject, setProjectOverride } = useAdmin();

  const isEdit = !!editProject;
  const projectId = editProject?.id;

  // ── Form state (pre-filled in edit mode) ──────────────────
  const [title,       setTitle]       = useState(editProject?.title       ?? '');
  const [category,    setCategory]    = useState(editProject?.category    ?? CATEGORY_OPTIONS[0]);
  const [location,    setLocation]    = useState(editProject?.location    ?? '');
  const [description, setDescription] = useState(editProject?.description ?? '');
  const [client,      setClient]      = useState(editProject?.client      ?? '');
  const [completion,  setCompletion]  = useState(editProject?.completion  ?? '');
  const [amount,      setAmount]      = useState(editProject?.amount      ?? '');
  const [ongoing,     setOngoing]     = useState(editProject?.ongoing     ?? false);

  // ── Image slots ────────────────────────────────────────────
  // Existing images start as URL slots; admin can add new File slots
  const [imageSlots, setImageSlots] = useState<ImageSlot[]>(() => {
    if (!editProject) return [];
    // Existing project may have images array (URLs)
    const imgs: string[] = editProject.images ?? (editProject.cover ? [editProject.cover] : []);
    return imgs.map(url => ({ type: 'url', url }));
  });

  const [error,  setError]  = useState('');
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // ── Cleanup object URLs ────────────────────────────────────
  useEffect(() => {
    return () => {
      imageSlots.forEach(slot => {
        if (slot.type === 'file') URL.revokeObjectURL(slot.preview);
      });
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Add images (new files) ─────────────────────────────────
  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    const newSlots: ImageSlot[] = files.map(file => ({
      type: 'file',
      file,
      preview: URL.createObjectURL(file),
    }));
    setImageSlots(prev => [...prev, ...newSlots]);
  };

  const removeSlot = (i: number) => {
    setImageSlots(prev => {
      const slot = prev[i];
      if (slot.type === 'file') URL.revokeObjectURL(slot.preview);
      return prev.filter((_, idx) => idx !== i);
    });
  };

  const getPreview = (slot: ImageSlot) =>
    slot.type === 'url' ? slot.url : slot.preview;

  // ── Save ───────────────────────────────────────────────────
  const handleSave = async () => {
    if (!title.trim())    { setError('Project title is required.'); return; }
    if (!imageSlots.length) { setError('Add at least one project image.'); return; }

    setSaving(true);
    setError('');

    try {
      // Upload any File slots to Firebase Storage
      const id = projectId ? String(projectId) : String(Date.now());

      const finalUrls: string[] = await Promise.all(
        imageSlots.map(async (slot, i) => {
          if (slot.type === 'url') return slot.url;
          return uploadToStorage(`images/projects/${id}/${i}_${Date.now()}`, slot.file);
        })
      );

      const projectData: Omit<AdminProject, 'id'> = {
        title:       title.trim(),
        category,
        location:    location.trim(),
        description: description.trim(),
        client:      client.trim(),
        completion:  completion.trim(),
        amount:      amount.trim(),
        ongoing,
        cover:  finalUrls[0],
        images: finalUrls,
      };

      if (!isEdit) {
        // ── Adding a new project ───────────────────────────
        await addProject(projectData);
      } else if (isAdminProject) {
        // ── Editing an admin-added project (full update) ───
        await updateAdminProject(String(projectId), projectData);
      } else {
        // ── Editing a static project (store overrides) ─────
        const override: ProjectOverride = {
          title:       projectData.title       || undefined,
          description: projectData.description || undefined,
          location:    projectData.location    || undefined,
          client:      projectData.client      || undefined,
          completion:  projectData.completion  || undefined,
          amount:      projectData.amount      || undefined,
          ongoing:     projectData.ongoing,
          cover:  finalUrls[0],
          images: finalUrls,
        };
        await setProjectOverride(projectId, override);
      }

      onClose();
    } catch (err) {
      console.error('Save error:', err);
      setError('Failed to save. Please check your internet connection and try again.');
    } finally {
      setSaving(false);
    }
  };

  // ─────────────────────────────────────────────────────────────
  //  RENDER
  // ─────────────────────────────────────────────────────────────
  return (
    <>
      <style>{`
        .apm-overlay {
          position: fixed; inset: 0;
          background: rgba(18,0,0,0.80);
          z-index: 100000;
          display: flex; align-items: center; justify-content: center;
          padding: 20px;
          backdrop-filter: blur(4px);
          animation: apmFade .2s ease;
        }
        @keyframes apmFade { from { opacity:0 } to { opacity:1 } }

        .apm-card {
          background: #FDF6EE; border: 1px solid #E8D8C4;
          width: 100%; max-width: 660px; max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 24px 80px rgba(107,0,0,0.28);
          animation: apmSlide .25s ease;
        }
        @keyframes apmSlide {
          from { opacity:0; transform:translateY(20px) }
          to   { opacity:1; transform:translateY(0) }
        }

        .apm-header {
          display:flex; align-items:center; justify-content:space-between;
          padding: 24px 28px 18px; border-bottom: 1px solid #E8D8C4;
        }
        .apm-title {
          font-family:'Bebas Neue',sans-serif; font-size:26px;
          letter-spacing:2px; color:#2C1810; margin:0;
        }
        .apm-close {
          background:none; border:1px solid #E8D8C4; color:#9A8F85;
          font-size:18px; width:34px; height:34px; cursor:pointer;
          display:flex; align-items:center; justify-content:center;
          transition:all .2s;
        }
        .apm-close:hover { background:#6B0000; color:#FDF6EE; border-color:#6B0000; }

        .apm-body { padding:24px 28px; display:flex; flex-direction:column; gap:18px; }

        .apm-field { display:flex; flex-direction:column; gap:7px; }
        .apm-label {
          font-family:'Barlow Condensed',sans-serif; font-size:11px;
          font-weight:700; letter-spacing:2.5px; text-transform:uppercase; color:#9A8F85;
        }
        .apm-label span { color:#6B0000; margin-left:2px; }

        .apm-input, .apm-select, .apm-textarea {
          background:#FFF; border:1px solid #E8D8C4; color:#2C1810;
          font-family:'Barlow',sans-serif; font-size:14px;
          padding:11px 14px; outline:none;
          transition:border-color .2s; width:100%; box-sizing:border-box;
          border-radius:0; -webkit-appearance:none;
        }
        .apm-input:focus, .apm-select:focus, .apm-textarea:focus {
          border-color: rgba(107,0,0,0.5);
        }
        .apm-textarea { resize:vertical; min-height:100px; line-height:1.6; }
        .apm-select {
          appearance:none; cursor:pointer;
          background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%239A8F85' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
          background-repeat:no-repeat; background-position:right 14px center; padding-right:36px;
        }

        .apm-row { display:grid; grid-template-columns:1fr 1fr; gap:16px; }
        @media(max-width:540px){ .apm-row { grid-template-columns:1fr; } }

        .apm-toggle-row { display:flex; align-items:center; gap:12px; }
        .apm-toggle {
          width:42px; height:24px; border-radius:12px;
          background:#E8D8C4; border:1px solid #D4C4B0;
          position:relative; cursor:pointer; transition:background .2s; flex-shrink:0; padding:0; outline:none;
        }
        .apm-toggle.on { background:#6B0000; border-color:#6B0000; }
        .apm-toggle::after {
          content:''; position:absolute; width:18px; height:18px;
          border-radius:50%; background:#FFF; top:2px; left:2px;
          transition:left .2s; box-shadow:0 1px 4px rgba(0,0,0,.2);
        }
        .apm-toggle.on::after { left:20px; }
        .apm-toggle-lbl {
          font-family:'Barlow Condensed',sans-serif; font-size:13px;
          font-weight:700; letter-spacing:1.5px; text-transform:uppercase; color:#5C4033;
        }

        /* ── Image section ── */
        .apm-thumbs {
          display:grid; grid-template-columns:repeat(auto-fill,minmax(86px,1fr)); gap:8px;
        }
        .apm-thumb {
          position:relative; aspect-ratio:4/3;
          overflow:hidden; border:1px solid #E8D8C4;
        }
        .apm-thumb img { width:100%; height:100%; object-fit:cover; display:block; }
        .apm-thumb-del {
          position:absolute; top:4px; right:4px;
          width:22px; height:22px;
          background:rgba(107,0,0,.85); color:#FDF6EE;
          border:none; font-size:13px; cursor:pointer;
          display:flex; align-items:center; justify-content:center; line-height:1;
        }
        .apm-thumb-cover {
          position:absolute; bottom:0; left:0; right:0;
          background:rgba(107,0,0,.72); color:#FDF6EE;
          font-family:'Barlow Condensed',sans-serif; font-size:9px;
          font-weight:700; letter-spacing:1.5px; text-align:center; padding:3px 0;
        }
        .apm-thumb-new-badge {
          position:absolute; top:4px; left:4px;
          background:rgba(18,0,0,.75); color:#FDF6EE;
          font-family:'Barlow Condensed',sans-serif; font-size:8px;
          font-weight:700; letter-spacing:1px; padding:2px 5px;
        }

        .apm-drop-zone {
          border:2px dashed #D4C4B0; padding:28px 16px;
          display:flex; flex-direction:column; align-items:center; gap:10px;
          cursor:pointer; transition:border-color .2s; background:#FFF;
        }
        .apm-drop-zone:hover { border-color:rgba(107,0,0,.45); }
        .apm-dz-icon { font-size:28px; }
        .apm-dz-text {
          font-family:'Barlow Condensed',sans-serif; font-size:13px;
          font-weight:700; letter-spacing:1.5px; text-transform:uppercase; color:#9A8F85;
        }
        .apm-dz-sub { font-size:11px; color:#B4A89E; }

        .apm-error {
          background:rgba(107,0,0,.06); border:1px solid rgba(107,0,0,.25);
          padding:11px 14px; font-size:13px; color:#6B0000; line-height:1.5;
        }

        .apm-footer {
          display:flex; gap:12px; justify-content:flex-end;
          padding:18px 28px 24px; border-top:1px solid #E8D8C4;
        }
        .apm-btn-cancel {
          background:transparent; border:1px solid #E8D8C4; color:#9A8F85;
          font-family:'Barlow Condensed',sans-serif; font-size:12px; font-weight:700;
          letter-spacing:2px; text-transform:uppercase; padding:11px 24px; cursor:pointer;
          transition:all .2s;
        }
        .apm-btn-cancel:hover { border-color:#6B0000; color:#6B0000; }
        .apm-btn-save {
          background:#6B0000; border:2px solid #6B0000; color:#FDF6EE;
          font-family:'Barlow Condensed',sans-serif; font-size:12px; font-weight:700;
          letter-spacing:2px; text-transform:uppercase; padding:11px 32px; cursor:pointer;
          transition:all .2s; display:flex; align-items:center; gap:8px;
        }
        .apm-btn-save:hover:not(:disabled) { background:transparent; color:#6B0000; }
        .apm-btn-save:disabled { opacity:.5; cursor:not-allowed; }
        .apm-spinner {
          width:14px; height:14px; border-radius:50%;
          border:2px solid rgba(253,246,238,.35);
          border-top-color:#FDF6EE;
          animation:apmSpin .7s linear infinite;
        }
        @keyframes apmSpin { to { transform:rotate(360deg) } }

        .apm-note {
          background:rgba(107,0,0,.04); border:1px solid rgba(107,0,0,.12);
          padding:10px 14px; font-size:12px; color:#7A5C4A; line-height:1.6;
        }
      `}</style>

      <div className="apm-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
        <div className="apm-card">

          {/* ── Header ── */}
          <div className="apm-header">
            <h2 className="apm-title">
              {isEdit ? 'Edit Project' : 'Add New Project'}
            </h2>
            <button className="apm-close" onClick={onClose} type="button">✕</button>
          </div>

          {/* ── Body ── */}
          <div className="apm-body">

            {/* Note for static project edit */}
            {isEdit && !isAdminProject && (
              <div className="apm-note">
                ℹ️ Editing a built-in project saves overrides to Firebase. The original
                source data is unchanged — you can always reset by clearing the override.
              </div>
            )}

            {/* Title */}
            <div className="apm-field">
              <label className="apm-label">Project Title <span>*</span></label>
              <input className="apm-input" type="text"
                placeholder="e.g. Globe Calbayog Electrical Works"
                value={title} onChange={e => setTitle(e.target.value)} />
            </div>

            {/* Category + Status */}
            <div className="apm-row">
              <div className="apm-field">
                <label className="apm-label">Category <span>*</span></label>
                <select className="apm-select" value={category}
                  onChange={e => setCategory(e.target.value)}>
                  {CATEGORY_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="apm-field" style={{ justifyContent: 'flex-end', paddingBottom: 2 }}>
                <label className="apm-label">Status</label>
                <div className="apm-toggle-row">
                  <button type="button"
                    className={`apm-toggle${ongoing ? ' on' : ''}`}
                    onClick={() => setOngoing(v => !v)}
                  />
                  <span className="apm-toggle-lbl">{ongoing ? 'Ongoing' : 'Completed'}</span>
                </div>
              </div>
            </div>

            {/* Location + Client */}
            <div className="apm-row">
              <div className="apm-field">
                <label className="apm-label">Location</label>
                <input className="apm-input" type="text"
                  placeholder="e.g. Calbayog City, Samar"
                  value={location} onChange={e => setLocation(e.target.value)} />
              </div>
              <div className="apm-field">
                <label className="apm-label">Client</label>
                <input className="apm-input" type="text"
                  placeholder="e.g. Globe Telecom, Inc."
                  value={client} onChange={e => setClient(e.target.value)} />
              </div>
            </div>

            {/* Completion + Amount */}
            <div className="apm-row">
              <div className="apm-field">
                <label className="apm-label">Completion Date</label>
                <input className="apm-input" type="text"
                  placeholder="e.g. December 2024"
                  value={completion} onChange={e => setCompletion(e.target.value)} />
              </div>
              <div className="apm-field">
                <label className="apm-label">Project Value</label>
                <input className="apm-input" type="text"
                  placeholder="e.g. ₱4,500,000"
                  value={amount} onChange={e => setAmount(e.target.value)} />
              </div>
            </div>

            {/* Description */}
            <div className="apm-field">
              <label className="apm-label">Description</label>
              <textarea className="apm-textarea"
                placeholder="Describe the scope of work, key deliverables, and highlights…"
                value={description} onChange={e => setDescription(e.target.value)} />
            </div>

            {/* Images */}
            <div className="apm-field">
              <label className="apm-label">
                Project Images <span>*</span>
                <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0, color: '#B4A89E', marginLeft: 6 }}>
                  (first = cover · new uploads go to Firebase Storage)
                </span>
              </label>

              {imageSlots.length > 0 && (
                <div className="apm-thumbs">
                  {imageSlots.map((slot, i) => (
                    <div key={i} className="apm-thumb">
                      <img src={getPreview(slot)} alt="" />
                      {i === 0 && <div className="apm-thumb-cover">COVER</div>}
                      {slot.type === 'file' && (
                        <div className="apm-thumb-new-badge">NEW</div>
                      )}
                      <button type="button" className="apm-thumb-del"
                        onClick={() => removeSlot(i)}>✕</button>
                    </div>
                  ))}
                </div>
              )}

              <div className="apm-drop-zone" onClick={() => fileRef.current?.click()}>
                <div className="apm-dz-icon">📁</div>
                <div className="apm-dz-text">Click to upload images</div>
                <div className="apm-dz-sub">JPG, PNG, WEBP — multiple allowed</div>
              </div>
              <input ref={fileRef} type="file" accept="image/*" multiple
                style={{ display: 'none' }} onChange={handleFileInput} />
            </div>

            {error && <div className="apm-error">{error}</div>}
          </div>

          {/* ── Footer ── */}
          <div className="apm-footer">
            <button className="apm-btn-cancel" type="button" onClick={onClose}>
              Cancel
            </button>
            <button className="apm-btn-save" type="button"
              onClick={handleSave} disabled={saving}>
              {saving && <span className="apm-spinner" />}
              {saving ? 'Saving…' : isEdit ? 'Save Changes →' : 'Add Project →'}
            </button>
          </div>

        </div>
      </div>
    </>
  );
}