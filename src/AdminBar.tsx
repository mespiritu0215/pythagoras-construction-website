/**
 * AdminBar.tsx
 *
 * A fixed bottom toolbar that only renders when the logged-in user
 * is an admin (email matches REACT_APP_ADMIN_EMAIL).
 *
 * Fully responsive:
 *  - ≥600px: original single-row layout
 *  - <600px:  two-row compact layout — avatar+name on top row,
 *             action buttons on bottom row; "Changes auto-saved"
 *             text is hidden to save space
 */

import React, { useEffect } from 'react';
import { useAdmin } from './AdminContext';

export function AdminBar() {
  const { user, isAdmin, setUser, editMode, toggleEdit } = useAdmin();

  useEffect(() => {
    if (isAdmin) {
      // Taller on mobile (two rows ≈ 88px) vs desktop (56px)
      document.body.style.paddingBottom = window.innerWidth < 600 ? '88px' : '56px';

      const onResize = () => {
        document.body.style.paddingBottom = window.innerWidth < 600 ? '88px' : '56px';
      };
      window.addEventListener('resize', onResize);
      return () => {
        window.removeEventListener('resize', onResize);
        document.body.style.paddingBottom = '';
      };
    } else {
      document.body.style.paddingBottom = '';
    }
  }, [isAdmin]);

  if (!isAdmin || !user) return null;

  return (
    <>
      <style>{`
        /* ── Base bar ─────────────────────────────────────────── */
        .admin-bar {
          position: fixed;
          bottom: 0; left: 0; right: 0;
          background: #120000;
          border-top: 2px solid #6B0000;
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 0 24px;
          height: 56px;
          z-index: 99999;
          font-family: 'Barlow Condensed', sans-serif;
          box-shadow: 0 -4px 24px rgba(107,0,0,0.35);
        }

        /* ── Avatar ───────────────────────────────────────────── */
        .admin-bar-avatar {
          width: 30px; height: 30px;
          border-radius: 50%;
          border: 2px solid rgba(107,0,0,0.7);
          object-fit: cover;
          flex-shrink: 0;
        }

        /* ── Labels ───────────────────────────────────────────── */
        .admin-bar-label {
          font-size: 12px; font-weight: 700;
          letter-spacing: 2px; text-transform: uppercase;
          color: #FDF6EE; white-space: nowrap;
        }
        .admin-bar-name {
          font-size: 11px; font-weight: 400; letter-spacing: 1px;
          color: rgba(253,246,238,0.45);
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
          max-width: 160px;
        }

        .admin-bar-spacer { flex: 1; min-width: 0; }

        /* ── Auto-saved indicator ─────────────────────────────── */
        .admin-bar-saved {
          font-size: 10px; font-weight: 700; letter-spacing: 2px;
          text-transform: uppercase;
          color: rgba(253,246,238,0.38);
          display: flex; align-items: center; gap: 6px;
          white-space: nowrap;
        }
        .admin-bar-saved-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: #4CAF50; flex-shrink: 0;
          animation: adminPulse 2s ease infinite;
        }
        @keyframes adminPulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.4; }
        }

        /* ── Buttons ──────────────────────────────────────────── */
        .admin-bar-btn {
          background: transparent;
          border: 1px solid rgba(107,0,0,0.55);
          color: rgba(253,246,238,0.55);
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 11px; font-weight: 700;
          letter-spacing: 2px; text-transform: uppercase;
          padding: 7px 16px;
          cursor: pointer;
          transition: all 0.2s;
          white-space: nowrap;
        }
        .admin-bar-btn:hover {
          border-color: rgba(107,0,0,0.9);
          color: rgba(253,246,238,0.9);
        }

        .admin-bar-btn-edit {
          background: transparent;
          border: 1px solid #6B0000;
          color: #FDF6EE;
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 11px; font-weight: 700;
          letter-spacing: 2px; text-transform: uppercase;
          padding: 7px 20px;
          cursor: pointer;
          transition: all 0.2s;
          white-space: nowrap;
        }
        .admin-bar-btn-edit:hover,
        .admin-bar-btn-edit.active {
          background: #6B0000;
          color: #FDF6EE;
        }
        .admin-bar-btn-edit.active {
          background: #6B0000;
          box-shadow: 0 0 12px rgba(107,0,0,0.6);
        }

        /* ── Edit mode global indicator ───────────────────────── */
        body.admin-editing * {
          transition: outline 0.15s ease !important;
        }

        /* ── Mobile: two-row layout (<600px) ──────────────────── */
        @media (max-width: 599px) {
          .admin-bar {
            height: auto;
            flex-wrap: wrap;
            padding: 10px 16px;
            gap: 0;
            row-gap: 8px;
          }

          /* Row 1: avatar + name fill full width */
          .admin-bar-avatar {
            width: 26px; height: 26px;
          }
          .admin-bar-identity {
            flex: 1; min-width: 0;
          }
          .admin-bar-name {
            max-width: 100%;
          }

          /* Push buttons onto their own row */
          .admin-bar-spacer {
            width: 100%;
            height: 0;
            flex-basis: 100%;
          }

          /* Hide verbose saved text on mobile */
          .admin-bar-saved {
            display: none;
          }

          /* Buttons stretch equally across the bottom row */
          .admin-bar-btn,
          .admin-bar-btn-edit {
            flex: 1;
            text-align: center;
            padding: 8px 10px;
            font-size: 10px;
            letter-spacing: 1.5px;
          }

          /* Active edit button: show a small dot instead of full text */
          .admin-bar-btn-edit.active::before {
            content: '';
            display: inline-block;
            width: 5px; height: 5px;
            border-radius: 50%;
            background: #FDF6EE;
            margin-right: 6px;
            vertical-align: middle;
            animation: adminPulse 2s ease infinite;
          }
        }
      `}</style>

      <div className="admin-bar" role="toolbar" aria-label="Admin controls">

        {/* ── Identity ── */}
        <img src={user.picture} alt={user.name} className="admin-bar-avatar" />
        <div className="admin-bar-identity">
          <div className="admin-bar-label">Admin</div>
          <div className="admin-bar-name">{user.name}</div>
        </div>

        {/* ── Spacer (doubles as row-break on mobile) ── */}
        <div className="admin-bar-spacer" />

        {/* ── Auto-saved (desktop only) ── */}
        {editMode && (
          <div className="admin-bar-saved">
            <div className="admin-bar-saved-dot" />
            Changes auto-saved
          </div>
        )}

        {/* ── Edit toggle ── */}
        <button
          className={`admin-bar-btn-edit${editMode ? ' active' : ''}`}
          onClick={toggleEdit}
          type="button"
        >
          {editMode ? '✓ Editing ON' : '✏️ Edit Mode'}
        </button>

        {/* ── Sign out ── */}
        <button
          className="admin-bar-btn"
          onClick={() => setUser(null)}
          type="button"
        >
          Sign Out
        </button>

      </div>
    </>
  );
}