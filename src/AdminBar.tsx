/**
 * AdminBar.tsx
 *
 * A fixed bottom toolbar that only renders when the logged-in user
 * is an admin (email matches REACT_APP_ADMIN_EMAIL).
 *
 * Place <AdminBar /> once inside your router, e.g. at the bottom of
 * the App component's JSX (inside <Router> so it persists across routes).
 */

import React, { useEffect } from 'react';
import { useAdmin } from './AdminContext';

export function AdminBar() {
  const { user, isAdmin, setUser, editMode, toggleEdit } = useAdmin();

  // Push page content up so the bar doesn't cover it
  useEffect(() => {
    if (isAdmin) {
      document.body.style.paddingBottom = '56px';
    } else {
      document.body.style.paddingBottom = '';
    }
    return () => { document.body.style.paddingBottom = ''; };
  }, [isAdmin]);

  if (!isAdmin || !user) return null;

  return (
    <>
      <style>{`
        .admin-bar {
          position: fixed;
          bottom: 0; left: 0; right: 0;
          height: 56px;
          background: #120000;
          border-top: 2px solid #6B0000;
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 0 24px;
          z-index: 99999;
          font-family: 'Barlow Condensed', sans-serif;
          box-shadow: 0 -4px 24px rgba(107,0,0,0.35);
        }

        .admin-bar-avatar {
          width: 30px; height: 30px;
          border-radius: 50%;
          border: 2px solid rgba(107,0,0,0.7);
          object-fit: cover;
          flex-shrink: 0;
        }

        .admin-bar-label {
          font-size: 12px; font-weight: 700;
          letter-spacing: 2px; text-transform: uppercase;
          color: #FDF6EE; white-space: nowrap;
        }

        .admin-bar-name {
          font-size: 11px; font-weight: 400; letter-spacing: 1px;
          color: rgba(253,246,238,0.45);
        }

        .admin-bar-spacer { flex: 1; }

        .admin-bar-saved {
          font-size: 10px; font-weight: 700; letter-spacing: 2px;
          text-transform: uppercase;
          color: rgba(253,246,238,0.38);
          display: flex; align-items: center; gap: 6px;
        }
        .admin-bar-saved-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: #4CAF50; animation: adminPulse 2s ease infinite;
        }
        @keyframes adminPulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.4; }
        }

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

        /* Edit mode global indicator */
        body.admin-editing * {
          transition: outline 0.15s ease !important;
        }
      `}</style>

      <div className="admin-bar" role="toolbar" aria-label="Admin controls">
        <img src={user.picture} alt={user.name} className="admin-bar-avatar" />
        <div>
          <div className="admin-bar-label">Admin</div>
          <div className="admin-bar-name">{user.name}</div>
        </div>

        <div className="admin-bar-spacer" />

        {editMode && (
          <div className="admin-bar-saved">
            <div className="admin-bar-saved-dot" />
            Changes auto-saved
          </div>
        )}

        <button
          className={`admin-bar-btn-edit${editMode ? ' active' : ''}`}
          onClick={toggleEdit}
          type="button"
        >
          {editMode ? '✓ Editing ON' : '✏️ Edit Mode'}
        </button>

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
