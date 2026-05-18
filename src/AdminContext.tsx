/**
 * AdminContext.tsx  (v2 — Firebase sync)
 *
 * All admin data is now stored in Firebase:
 *   • Firestore  — text overrides, project overrides, deleted IDs, admin projects
 *   • Storage    — all uploaded images (overrides + project galleries)
 *
 * Changes auto-sync in real-time across every device via onSnapshot listeners.
 * localStorage is used only as an instant-load cache while Firestore loads.
 */

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  ReactNode,
} from 'react';
import {
  doc,
  collection,
  onSnapshot,
  setDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  Timestamp,
} from 'firebase/firestore';
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from 'firebase/storage';
import { db, storage } from './firebase';

// ─────────────────────────────────────────────────────────────
//  TYPES
// ─────────────────────────────────────────────────────────────

export interface GoogleUser { name: string; email: string; picture: string; }

/** Field overrides for an existing (static) project */
export interface ProjectOverride {
  title?:       string;
  description?: string;
  location?:    string;
  client?:      string;
  completion?:  string;
  amount?:      string;
  ongoing?:     boolean;
  cover?:       string;    // Firebase Storage URL
  images?:      string[];  // Firebase Storage URLs
}

/** A fully admin-created project */
export interface AdminProject {
  id:          string;   // Firestore doc ID (timestamp string)
  title:       string;
  category:    string;
  location:    string;
  description: string;
  client:      string;
  completion:  string;
  amount:      string;
  ongoing:     boolean;
  cover:       string;   // Firebase Storage URL
  images:      string[]; // Firebase Storage URLs
}

/** What's stored in pci_admin/site_data */
interface SiteData {
  texts:             Record<string, string>;
  imageUrls:         Record<string, string>;
  deletedProjectIds: number[];
  projectOverrides:  Record<string, ProjectOverride>;
}

const EMPTY_SITE: SiteData = {
  texts: {}, imageUrls: {}, deletedProjectIds: [], projectOverrides: {},
};

interface AdminCtx {
  user:               GoogleUser | null;
  setUser:            (u: GoogleUser | null) => void;
  isAdmin:            boolean;
  editMode:           boolean;
  toggleEdit:         () => void;

  // Text overrides
  getText:            (key: string, fallback: string) => string;
  setText:            (key: string, val: string)      => Promise<void>;

  // Image overrides (URLs, not base64)
  getImg:             (key: string) => string | null;
  uploadImg:          (key: string, file: File)       => Promise<void>;

  // Existing-project overrides & deletion
  projectOverrides:    Record<string, ProjectOverride>;
  setProjectOverride:  (id: number | string, data: ProjectOverride) => Promise<void>;
  deletedProjectIds:   number[];
  deleteStaticProject: (id: number) => Promise<void>;

  // Admin-added projects (stored in Firestore)
  adminProjects:      AdminProject[];
  addProject:         (p: Omit<AdminProject, 'id'>) => Promise<void>;
  updateAdminProject: (id: string, p: Omit<AdminProject, 'id'>) => Promise<void>;
  removeAdminProject: (id: string) => Promise<void>;

  uploading: boolean; // true while any Storage upload is in progress
}

// ─────────────────────────────────────────────────────────────
//  CONSTANTS
// ─────────────────────────────────────────────────────────────

const ADMIN_EMAILS = (process.env.REACT_APP_ADMIN_EMAIL ?? '')
  .split(',').map(e => e.trim().toLowerCase()).filter(Boolean);

const CACHE_KEY   = 'pci_admin_cache_v2';
const SITE_DOC    = doc(db, 'pci_admin', 'site_data');
const PROJ_COL    = collection(db, 'admin_projects');

// ─────────────────────────────────────────────────────────────
//  CACHE HELPERS
// ─────────────────────────────────────────────────────────────

function readCache(): SiteData {
  try { const r = localStorage.getItem(CACHE_KEY); if (r) return JSON.parse(r); } catch { /**/ }
  return EMPTY_SITE;
}
function writeCache(d: SiteData) {
  try { localStorage.setItem(CACHE_KEY, JSON.stringify(d)); } catch { /**/ }
}

// ─────────────────────────────────────────────────────────────
//  STORAGE UPLOAD HELPER
// ─────────────────────────────────────────────────────────────

export async function uploadToStorage(path: string, file: File): Promise<string> {
  const r = storageRef(storage, path);
  await uploadBytes(r, file);
  return getDownloadURL(r);
}

// ─────────────────────────────────────────────────────────────
//  CONTEXT
// ─────────────────────────────────────────────────────────────

const Ctx = createContext<AdminCtx>(null!);
export const useAdmin = () => useContext(Ctx);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [user,      setUserRaw]     = useState<GoogleUser | null>(null);
  const [editMode,  setEditMode]    = useState(false);
  const [siteData,  setSiteData]    = useState<SiteData>(readCache);
  const [adminProjects, setAdminProjects] = useState<AdminProject[]>([]);
  const [uploading, setUploading]   = useState(false);

  const isAdmin = !!user && ADMIN_EMAILS.includes(user.email.toLowerCase());

  const setUser = (u: GoogleUser | null) => {
    setUserRaw(u);
    if (!u) setEditMode(false);
  };

  // ── Real-time Firestore listeners ──────────────────────────
  useEffect(() => {
    // Listen to site_data
    const unsubSite = onSnapshot(SITE_DOC, (snap) => {
      if (snap.exists()) {
        const d = snap.data() as SiteData;
        const merged: SiteData = {
          texts:             d.texts             ?? {},
          imageUrls:         d.imageUrls         ?? {},
          deletedProjectIds: d.deletedProjectIds ?? [],
          projectOverrides:  d.projectOverrides  ?? {},
        };
        setSiteData(merged);
        writeCache(merged);
      }
    });

    // Listen to admin_projects collection
    const unsubProjects = onSnapshot(PROJ_COL, (snap) => {
      const projects: AdminProject[] = snap.docs.map(d => ({
        id: d.id,
        ...(d.data() as Omit<AdminProject, 'id'>),
      }));
      // Sort by newest first
      projects.sort((a, b) => Number(b.id) - Number(a.id));
      setAdminProjects(projects);
    });

    return () => { unsubSite(); unsubProjects(); };
  }, []);

  // ── Site data writer ───────────────────────────────────────
  const patchSite = useCallback(async (patch: Partial<SiteData>) => {
    await setDoc(SITE_DOC, patch, { merge: true });
  }, []);

  // ── Text ───────────────────────────────────────────────────
  const setText = useCallback(async (key: string, val: string) => {
    await patchSite({ texts: { ...siteData.texts, [key]: val } });
  }, [patchSite, siteData.texts]);

  // ── Image upload ───────────────────────────────────────────
  const uploadImg = useCallback(async (key: string, file: File) => {
    setUploading(true);
    try {
      const safePath = key.replace(/\./g, '_');
      const url = await uploadToStorage(`images/overrides/${safePath}`, file);
      await patchSite({ imageUrls: { ...siteData.imageUrls, [key]: url } });
    } finally {
      setUploading(false);
    }
  }, [patchSite, siteData.imageUrls]);

  // ── Project overrides ──────────────────────────────────────
  const setProjectOverride = useCallback(async (
    id: number | string,
    data: ProjectOverride
  ) => {
    const prev = siteData.projectOverrides;
    await patchSite({
      projectOverrides: {
        ...prev,
        [String(id)]: { ...(prev[String(id)] ?? {}), ...data },
      },
    });
  }, [patchSite, siteData.projectOverrides]);

  // ── Static project deletion ────────────────────────────────
  const deleteStaticProject = useCallback(async (id: number) => {
    const prev = siteData.deletedProjectIds;
    if (prev.includes(id)) return;
    await patchSite({ deletedProjectIds: [...prev, id] });
  }, [patchSite, siteData.deletedProjectIds]);

  // ── Admin projects ─────────────────────────────────────────
  const addProject = useCallback(async (p: Omit<AdminProject, 'id'>) => {
    const id = String(Date.now());
    await setDoc(doc(db, 'admin_projects', id), p);
  }, []);

  const updateAdminProject = useCallback(async (
    id: string,
    p: Omit<AdminProject, 'id'>
  ) => {
    await setDoc(doc(db, 'admin_projects', id), p);
  }, []);

  const removeAdminProject = useCallback(async (id: string) => {
    await deleteDoc(doc(db, 'admin_projects', id));
  }, []);

  const value: AdminCtx = {
    user, setUser, isAdmin,
    editMode, toggleEdit: () => setEditMode(v => !v),

    getText:   (key, fallback) => siteData.texts[key] ?? fallback,
    setText,

    getImg:    (key) => siteData.imageUrls[key] ?? null,
    uploadImg,

    projectOverrides:   siteData.projectOverrides,
    setProjectOverride,
    deletedProjectIds:  siteData.deletedProjectIds,
    deleteStaticProject,

    adminProjects,
    addProject,
    updateAdminProject,
    removeAdminProject,

    uploading,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

// ─────────────────────────────────────────────────────────────
//  EDITABLE TEXT
//  Click any outlined element to edit in place. Saved on blur.
// ─────────────────────────────────────────────────────────────

export function EditableText({
  adminKey,
  children,
  tag: Tag = 'span',
  className,
  style,
  ...rest
}: {
  adminKey:   string;
  children:   string;
  tag?:       keyof React.JSX.IntrinsicElements;
  className?: string;
  style?:     React.CSSProperties;
  [k: string]: any;
}) {
  const { editMode, getText, setText } = useAdmin();
  const text = getText(adminKey, children);

  if (!editMode) {
    return <Tag className={className} style={style} {...rest}>{text}</Tag>;
  }

  return (
    // @ts-ignore
    <Tag
      className={className}
      contentEditable
      suppressContentEditableWarning
      dangerouslySetInnerHTML={{ __html: text }}
      onBlur={(e: React.FocusEvent<HTMLElement>) =>
        setText(adminKey, e.currentTarget.innerText.trim())
      }
      title="✏️ Click to edit"
      style={{
        outline:       '2px dashed #8B0000',
        outlineOffset: '4px',
        cursor:        'text',
        borderRadius:  '2px',
        ...style,
      }}
      {...rest}
    />
  );
}

// ─────────────────────────────────────────────────────────────
//  EDITABLE IMAGE
//  Click to upload a replacement. Uploads to Firebase Storage.
// ─────────────────────────────────────────────────────────────

export function EditableImage({
  adminKey,
  src: defaultSrc,
  alt,
  className,
  style,
  imgStyle,
  wrapperClassName,
  ...rest
}: {
  adminKey:          string;
  src:               string;
  alt?:              string;
  className?:        string;
  style?:            React.CSSProperties;
  imgStyle?:         React.CSSProperties;
  wrapperClassName?: string;
  [k: string]: any;
}) {
  const { editMode, getImg, uploadImg } = useAdmin();
  const fileRef    = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const displaySrc = getImg(adminKey) ?? defaultSrc;

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    try { await uploadImg(adminKey, file); }
    finally { setBusy(false); }
  };

  if (!editMode) {
    return (
      <img src={displaySrc} alt={alt ?? ''} className={className}
           style={imgStyle} {...rest} />
    );
  }

  return (
    <div
      className={wrapperClassName ?? className}
      style={{ position: 'relative', display: 'inline-block', cursor: busy ? 'wait' : 'pointer', ...style }}
      onClick={() => !busy && fileRef.current?.click()}
      title={busy ? 'Uploading…' : '📷 Click to replace image'}
    >
      <img
        src={displaySrc} alt={alt ?? ''}
        style={{ display: 'block', width: '100%', height: '100%',
                 objectFit: 'cover', opacity: busy ? 0.5 : 1, ...imgStyle }}
      />

      {/* Overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        background: busy ? 'rgba(18,0,0,0.65)' : 'rgba(107,0,0,0.58)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: 8,
        color: '#FDF6EE',
        fontFamily: 'Barlow Condensed, sans-serif',
        fontSize: 13, fontWeight: 700, letterSpacing: 2,
        textTransform: 'uppercase', pointerEvents: 'none',
        borderRadius: 'inherit',
      }}>
        {busy ? (
          <>
            <span style={{ fontSize: 20 }}>⏳</span>
            <span>Uploading…</span>
          </>
        ) : (
          <>
            <span style={{ fontSize: 20 }}>📷</span>
            <span>Change Image</span>
          </>
        )}
      </div>

      <input ref={fileRef} type="file" accept="image/*"
             style={{ display: 'none' }} onChange={handleChange} />
    </div>
  );
}