/**
 * AddProjectModal.tsx
 *
 * Admin-only modal for adding new projects to the Projects page.
 * Images are stored as base64 data URLs in localStorage.
 * Call this from Projects.tsx when the admin clicks "+ Add Project".
 */

import React, { useState, useRef } from 'react';
import { useAdmin, AdminProject } from './AdminContext';

// Must match the category labels in your Projectsdata.ts
const CATEGORY_OPTIONS = [
  'Civil Works',
  'Electrical Works',
  'Architectural & Design',
  'Ongoing Projects',
];

interface Props {
  onClose: () => void;
}

export function AddProjectModal({ onClose }: Props) {
  const { addProject } = useAdmin();

  const [title,       setTitle]       = useState('');
  const [category,    setCategory]    = useState(CATEGORY_OPTIONS[0]);
  const [location,    setLocation]    = useState('');
  const [description, setDescription] = useState('');
  const [client,      setClient]      = useState('');
  const [completion,  setCompletion]  = useState('');
  const [amount,      setAmount]      = useState('');
  const [ongoing,     setOngoing]     = useState(false);
  const [images,      setImages]      = useState<string[]>([]); // base64 URLs
  const [error,       setError]       = useState('');
  const [saving,      setSaving]      = useState(false);

  const fileRef = useRef<HTMLInputElement>(null);

  const handleImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    const readers = files.map(
      (file) =>
        new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = (ev) => resolve(ev.target!.result as string);
          reader.readAsDataURL(file);
        })
    );
    Promise.all(readers).then((b64s) =>
      setImages((prev) => [...prev, ...b64s])
    );
  };

  const removeImage = (i: number) =>
    setImages((prev) => prev.filter((_, idx) => idx !== i));

  const handleSave = () => {
    if (!title.trim()) { setError('Project title is required.'); return; }
    if (!images.length) { setError('Please upload at least one project image.'); return; }

    setSaving(true);
    const project: Omit<AdminProject, 'id'> = {
      title:       title.trim(),
      category,
      location:    location.trim(),
      description: description.trim(),
      client:      client.trim(),
      completion:  completion.trim(),
      amount:      amount.trim(),
      ongoing,
      cover:  images[0],
      images,
    };
    addProject(project);
    setSaving(false);
    onClose();
  };

  return (
    <>
      <style>{`
        .apm-overlay {
          position: fixed; inset: 0;
          background: rgba(18,0,0,0.78);
          z-index: 100000;
          display: flex; align-items: center; justify-content: center;
          padding: 20px;
          backdrop-filter: blur(4px);
          animation: apmFadeIn 0.2s ease;
        }
        @keyframes apmFadeIn { from { opacity:0; } to { opacity:1; } }

        .apm-card {
          background: #FDF6EE;
          border: 1px solid #E8D8C4;
          width: 100%; max-width: 640px;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 24px 80px rgba(107,0,0,0.30);
          animation: apmSlideUp 0.25s ease;
        }
        @keyframes apmSlideUp {
          from { opacity:0; transform: translateY(20px); }
          to   { opacity:1; transform: translateY(0); }
        }

        .apm-header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 24px 28px 18px;
          border-bottom: 1px solid #E8D8C4;
        }
        .apm-header-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 26px; letter-spacing: 2px; color: #2C1810; margin: 0;
        }
        .apm-close {
          background: none; border: 1px solid #E8D8C4;
          color: #9A8F85; font-size: 18px; width: 34px; height: 34px;
          cursor: pointer; display: flex; align-items: center; justify-content: center;
          transition: all 0.2s; flex-shrink: 0;
        }
        .apm-close:hover { background: #6B0000; color: #FDF6EE; border-color: #6B0000; }

        .apm-body { padding: 24px 28px; display: flex; flex-direction: column; gap: 18px; }

        .apm-field { display: flex; flex-direction: column; gap: 7px; }
        .apm-label {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 11px; font-weight: 700;
          letter-spacing: 2.5px; text-transform: uppercase;
          color: #9A8F85;
        }
        .apm-label span { color: #6B0000; margin-left: 2px; }

        .apm-input, .apm-select, .apm-textarea {
          background: #FFFFFF; border: 1px solid #E8D8C4;
          color: #2C1810; font-family: 'Barlow', sans-serif;
          font-size: 14px; padding: 11px 14px; outline: none;
          transition: border-color 0.2s;
          width: 100%; box-sizing: border-box;
          border-radius: 0; -webkit-appearance: none;
        }
        .apm-input:focus, .apm-select:focus, .apm-textarea:focus {
          border-color: rgba(107,0,0,0.5);
        }
        .apm-textarea { resize: vertical; min-height: 100px; line-height: 1.6; }
        .apm-select {
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%239A8F85' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
          background-repeat: no-repeat; background-position: right 14px center;
          padding-right: 36px; cursor: pointer;
        }

        .apm-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        @media (max-width: 540px) { .apm-row { grid-template-columns: 1fr; } }

        .apm-toggle-row {
          display: flex; align-items: center; gap: 12px;
        }
        .apm-toggle {
          width: 42px; height: 24px; border-radius: 12px;
          background: #E8D8C4; border: 1px solid #D4C4B0;
          position: relative; cursor: pointer; transition: background 0.2s;
          flex-shrink: 0; padding: 0; outline: none;
        }
        .apm-toggle.on { background: #6B0000; border-color: #6B0000; }
        .apm-toggle::after {
          content: ''; position: absolute;
          width: 18px; height: 18px; border-radius: 50%;
          background: #FFFFFF; top: 2px; left: 2px;
          transition: left 0.2s;
          box-shadow: 0 1px 4px rgba(0,0,0,0.2);
        }
        .apm-toggle.on::after { left: 20px; }
        .apm-toggle-label {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 13px; font-weight: 700; letter-spacing: 1.5px;
          text-transform: uppercase; color: #5C4033;
        }

        /* Image upload */
        .apm-img-zone {
          border: 2px dashed #D4C4B0;
          padding: 28px 16px;
          display: flex; flex-direction: column;
          align-items: center; gap: 10px;
          cursor: pointer; transition: border-color 0.2s;
          background: #FFFFFF;
        }
        .apm-img-zone:hover { border-color: rgba(107,0,0,0.45); }
        .apm-img-zone-icon { font-size: 28px; }
        .apm-img-zone-text {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 13px; font-weight: 700; letter-spacing: 1.5px;
          text-transform: uppercase; color: #9A8F85;
        }
        .apm-img-zone-sub { font-size: 11px; color: #B4A89E; }

        .apm-img-thumbs {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
          gap: 8px;
        }
        .apm-img-thumb {
          position: relative; aspect-ratio: 4/3;
          overflow: hidden; border: 1px solid #E8D8C4;
        }
        .apm-img-thumb img { width:100%; height:100%; object-fit:cover; display:block; }
        .apm-img-thumb-del {
          position: absolute; top: 4px; right: 4px;
          width: 22px; height: 22px;
          background: rgba(107,0,0,0.85); color: #FDF6EE;
          border: none; font-size: 13px; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          line-height: 1;
        }
        .apm-img-thumb-first {
          position: absolute; bottom: 0; left: 0; right: 0;
          background: rgba(107,0,0,0.7);
          color: #FDF6EE;
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 9px; font-weight: 700; letter-spacing: 1.5px;
          text-align: center; padding: 3px 0;
        }

        .apm-error {
          background: rgba(107,0,0,0.06);
          border: 1px solid rgba(107,0,0,0.25);
          padding: 11px 14px;
          font-size: 13px; color: #6B0000; line-height: 1.5;
        }

        .apm-footer {
          display: flex; gap: 12px; justify-content: flex-end;
          padding: 18px 28px 24px;
          border-top: 1px solid #E8D8C4;
        }

        .apm-btn-cancel {
          background: transparent;
          border: 1px solid #E8D8C4;
          color: #9A8F85;
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 12px; font-weight: 700; letter-spacing: 2px;
          text-transform: uppercase; padding: 11px 24px;
          cursor: pointer; transition: all 0.2s;
        }
        .apm-btn-cancel:hover { border-color: #6B0000; color: #6B0000; }

        .apm-btn-save {
          background: #6B0000; border: 2px solid #6B0000;
          color: #FDF6EE;
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 12px; font-weight: 700; letter-spacing: 2px;
          text-transform: uppercase; padding: 11px 32px;
          cursor: pointer; transition: all 0.2s;
        }
        .apm-btn-save:hover:not(:disabled) { background: transparent; color: #6B0000; }
        .apm-btn-save:disabled { opacity: 0.5; cursor: not-allowed; }
      `}</style>

      <div className="apm-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
        <div className="apm-card">

          {/* Header */}
          <div className="apm-header">
            <h2 className="apm-header-title">Add New Project</h2>
            <button className="apm-close" onClick={onClose} type="button" aria-label="Close">✕</button>
          </div>

          {/* Body */}
          <div className="apm-body">

            {/* Title */}
            <div className="apm-field">
              <label className="apm-label">Project Title <span>*</span></label>
              <input
                className="apm-input"
                type="text"
                placeholder="e.g. Globe Calbayog Electrical Works"
                value={title}
                onChange={e => setTitle(e.target.value)}
              />
            </div>

            {/* Category + Ongoing toggle */}
            <div className="apm-row">
              <div className="apm-field">
                <label className="apm-label">Category <span>*</span></label>
                <select
                  className="apm-select"
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                >
                  {CATEGORY_OPTIONS.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div className="apm-field" style={{ justifyContent: 'flex-end', paddingBottom: 2 }}>
                <label className="apm-label">Status</label>
                <div className="apm-toggle-row">
                  <button
                    type="button"
                    className={`apm-toggle${ongoing ? ' on' : ''}`}
                    onClick={() => setOngoing(v => !v)}
                    aria-pressed={ongoing}
                    aria-label="Toggle ongoing status"
                  />
                  <span className="apm-toggle-label">{ongoing ? 'Ongoing' : 'Completed'}</span>
                </div>
              </div>
            </div>

            {/* Location + Client */}
            <div className="apm-row">
              <div className="apm-field">
                <label className="apm-label">Location</label>
                <input
                  className="apm-input"
                  type="text"
                  placeholder="e.g. Calbayog City, Samar"
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                />
              </div>
              <div className="apm-field">
                <label className="apm-label">Client</label>
                <input
                  className="apm-input"
                  type="text"
                  placeholder="e.g. Globe Telecom, Inc."
                  value={client}
                  onChange={e => setClient(e.target.value)}
                />
              </div>
            </div>

            {/* Completion + Amount */}
            <div className="apm-row">
              <div className="apm-field">
                <label className="apm-label">Completion Date</label>
                <input
                  className="apm-input"
                  type="text"
                  placeholder="e.g. December 2024"
                  value={completion}
                  onChange={e => setCompletion(e.target.value)}
                />
              </div>
              <div className="apm-field">
                <label className="apm-label">Project Value</label>
                <input
                  className="apm-input"
                  type="text"
                  placeholder="e.g. ₱4,500,000"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                />
              </div>
            </div>

            {/* Description */}
            <div className="apm-field">
              <label className="apm-label">Description</label>
              <textarea
                className="apm-textarea"
                placeholder="Describe the scope of work, key deliverables, and highlights of the project..."
                value={description}
                onChange={e => setDescription(e.target.value)}
              />
            </div>

            {/* Image upload */}
            <div className="apm-field">
              <label className="apm-label">
                Project Images <span>*</span>
                <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0, color: '#B4A89E', marginLeft: 6 }}>
                  (first image = cover)
                </span>
              </label>

              {images.length > 0 && (
                <div className="apm-img-thumbs">
                  {images.map((b64, i) => (
                    <div key={i} className="apm-img-thumb">
                      <img src={b64} alt={`Upload ${i + 1}`} />
                      {i === 0 && <div className="apm-img-thumb-first">COVER</div>}
                      <button
                        type="button"
                        className="apm-img-thumb-del"
                        onClick={() => removeImage(i)}
                        aria-label="Remove image"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="apm-img-zone" onClick={() => fileRef.current?.click()}>
                <div className="apm-img-zone-icon">📁</div>
                <div className="apm-img-zone-text">Click to upload images</div>
                <div className="apm-img-zone-sub">JPG, PNG, WEBP — multiple allowed</div>
              </div>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                multiple
                style={{ display: 'none' }}
                onChange={handleImages}
              />
            </div>

            {error && <div className="apm-error">{error}</div>}
          </div>

          {/* Footer */}
          <div className="apm-footer">
            <button className="apm-btn-cancel" type="button" onClick={onClose}>
              Cancel
            </button>
            <button
              className="apm-btn-save"
              type="button"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? 'Saving…' : 'Save Project →'}
            </button>
          </div>

        </div>
      </div>
    </>
  );
}
