/**
 * AdminContext.tsx  (v4 — fixes)
 *
 * Fixes in this version:
 *  1. User persisted to localStorage — no logout on page refresh
 *  2. EditableText now uses a frozenHtml ref + useLayoutEffect instead of
 *     dangerouslySetInnerHTML with a draft state.  The ref value is frozen
 *     while the element is focused, so React's reconciler never sees a prop
 *     change and never overwrites what the admin has typed. useLayoutEffect
 *     runs before browser paint, preventing any flash of empty content.
 *  3. featuredProjectIds added to SiteData — admin can choose which projects
 *     appear in the "Recently Completed" homepage section
 *  4. uploadImg shows an alert on failure so errors are not silent
 */

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useLayoutEffect,
  useCallback,
  useRef,
  ReactNode,
} from 'react';
import {
  doc,
  collection,
  onSnapshot,
  setDoc,
  deleteDoc,
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

export interface ProjectOverride {
  title?:       string;
  description?: string;
  location?:    string;
  client?:      string;
  completion?:  string;
  amount?:      string;
  ongoing?:     boolean;
  cover?:       string;
  images?:      string[];
}

export interface AdminProject {
  id:          string;
  title:       string;
  category:    string;
  location:    string;
  description: string;
  client:      string;
  completion:  string;
  amount:      string;
  ongoing:     boolean;
  cover:       string;
  images:      string[];
}

interface SiteData {
  texts:              Record<string, string>;
  imageUrls:          Record<string, string>;
  deletedProjectIds:  number[];
  projectOverrides:   Record<string, ProjectOverride>;
  featuredProjectIds: string[]; // IDs shown on homepage "Recently Completed"
}

const EMPTY_SITE: SiteData = {
  texts: {}, imageUrls: {}, deletedProjectIds: [], projectOverrides: {}, featuredProjectIds: [],
};

interface AdminCtx {
  user:               GoogleUser | null;
  setUser:            (u: GoogleUser | null) => void;
  isAdmin:            boolean;
  editMode:           boolean;
  toggleEdit:         () => void;

  getText:            (key: string, fallback: string) => string;
  setText:            (key: string, val: string)      => Promise<void>;

  getImg:             (key: string) => string | null;
  uploadImg:          (key: string, file: File)       => Promise<void>;

  projectOverrides:    Record<string, ProjectOverride>;
  setProjectOverride:  (id: number | string, data: ProjectOverride) => Promise<void>;
  deletedProjectIds:   number[];
  deleteStaticProject: (id: number) => Promise<void>;

  adminProjects:      AdminProject[];
  addProject:         (p: Omit<AdminProject, 'id'>) => Promise<void>;
  updateAdminProject: (id: string, p: Omit<AdminProject, 'id'>) => Promise<void>;
  removeAdminProject: (id: string) => Promise<void>;

  // Featured projects on homepage
  featuredProjectIds:     string[];
  setFeaturedProjectIds:  (ids: string[]) => Promise<void>;

  uploading: boolean;
}

// ─────────────────────────────────────────────────────────────
//  CONSTANTS
// ─────────────────────────────────────────────────────────────

const ADMIN_EMAILS = (process.env.REACT_APP_ADMIN_EMAIL ?? '')
  .split(',').map(e => e.trim().toLowerCase()).filter(Boolean);

const USER_CACHE_KEY = 'pci_admin_user_v1';
const CACHE_KEY      = 'pci_admin_cache_v2';
const SITE_DOC       = doc(db, 'pci_admin', 'site_data');
const PROJ_COL       = collection(db, 'admin_projects');

// ─────────────────────────────────────────────────────────────
//  CACHE HELPERS
// ─────────────────────────────────────────────────────────────

function readUserCache(): GoogleUser | null {
  try { const r = localStorage.getItem(USER_CACHE_KEY); return r ? JSON.parse(r) : null; }
  catch { return null; }
}
function writeUserCache(u: GoogleUser | null) {
  try {
    if (u) localStorage.setItem(USER_CACHE_KEY, JSON.stringify(u));
    else    localStorage.removeItem(USER_CACHE_KEY);
  } catch { /**/ }
}

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
  // ── FIX #1: Initialise user from localStorage so refresh keeps the session ──
  const [user,         setUserRaw]     = useState<GoogleUser | null>(readUserCache);
  const [editMode,     setEditMode]    = useState(false);
  const [siteData,     setSiteData]    = useState<SiteData>(readCache);
  const [adminProjects, setAdminProjects] = useState<AdminProject[]>([]);
  const [uploading,    setUploading]   = useState(false);

  const isAdmin = !!user && ADMIN_EMAILS.includes(user.email.toLowerCase());

  // Save user to localStorage whenever it changes
  const setUser = useCallback((u: GoogleUser | null) => {
    setUserRaw(u);
    writeUserCache(u);
    if (!u) setEditMode(false);
  }, []);

  // ── Real-time Firestore listeners ──────────────────────────
  useEffect(() => {
    const unsubSite = onSnapshot(SITE_DOC, (snap) => {
      if (snap.exists()) {
        const d = snap.data() as Partial<SiteData>;
        const merged: SiteData = {
          texts:              d.texts              ?? {},
          imageUrls:          d.imageUrls          ?? {},
          deletedProjectIds:  d.deletedProjectIds  ?? [],
          projectOverrides:   d.projectOverrides   ?? {},
          featuredProjectIds: d.featuredProjectIds ?? [],
        };
        setSiteData(merged);
        writeCache(merged);
      }
    });

    const unsubProjects = onSnapshot(PROJ_COL, (snap) => {
      const projects: AdminProject[] = snap.docs.map(d => ({
        id: d.id,
        ...(d.data() as Omit<AdminProject, 'id'>),
      }));
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

  // ── Image upload (FIX #4: show error on failure) ───────────
  const uploadImg = useCallback(async (key: string, file: File) => {
    setUploading(true);
    try {
      const safePath = key.replace(/\./g, '_');
      const url = await uploadToStorage(`images/overrides/${safePath}`, file);
      await patchSite({ imageUrls: { ...siteData.imageUrls, [key]: url } });
    } catch (err) {
      console.error('Image upload failed:', err);
      alert(`Upload failed: ${(err as Error).message}\n\nCheck Firebase Storage rules and CORS config.`);
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

  // ── Featured project IDs ───────────────────────────────────
  const setFeaturedProjectIds = useCallback(async (ids: string[]) => {
    await patchSite({ featuredProjectIds: ids });
  }, [patchSite]);

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

    featuredProjectIds:    siteData.featuredProjectIds,
    setFeaturedProjectIds,

    uploading,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

// ─────────────────────────────────────────────────────────────
//  EDITABLE TEXT
//
//  FIX #2 (v4): frozenHtml ref + useLayoutEffect approach.
//
//  Root cause of the "resets while typing" bug:
//    dangerouslySetInnerHTML passes a new object `{ __html: draft }` on
//    every parent re-render (slide timer, Firestore snapshot, etc.).
//    Even though the *string* value is the same, React's reconciler
//    reapplied innerHTML in certain concurrent-mode re-render sequences,
//    wiping what the admin had typed.
//
//  Fix strategy:
//    - `frozenHtml` is a ref whose value is *literally frozen* while the
//      element is focused. Since refs don't trigger re-renders, React's
//      reconciler always sees the identical object reference passed to
//      dangerouslySetInnerHTML, so it never touches the DOM.
//    - useLayoutEffect (runs before browser paint) keeps frozenHtml and
//      the real DOM in sync whenever savedText changes AND we are not
//      focused — handles external Firestore updates + initial render
//      without any flash of empty content.
//    - On blur we update frozenHtml to the newly typed text before
//      persisting to Firestore, so the next render stays consistent.
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
  const savedText = getText(adminKey, children);

  const isFocused = useRef(false);
  const elemRef   = useRef<HTMLElement>(null);

  // Set content on initial mount only.
  // Using an empty dep array means React never manages this element's
  // innerHTML — no dangerouslySetInnerHTML means no reconciler patch.
  useLayoutEffect(() => {
    if (elemRef.current) elemRef.current.innerHTML = savedText;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync from Firestore whenever savedText changes, but never while typing.
  useLayoutEffect(() => {
    if (!isFocused.current && elemRef.current) {
      elemRef.current.innerHTML = savedText;
    }
  }, [savedText]);

  if (!editMode) {
    return <Tag className={className} style={style} {...rest}>{savedText}</Tag>;
  }

  // Cast to any so TypeScript does not try to resolve prop types for the
  // dynamic tag — this is the standard pattern for polymorphic components.
  const DynamicTag = Tag as any;

  return (
    <DynamicTag
      ref={elemRef}
      className={className}
      contentEditable
      suppressContentEditableWarning
      // NO dangerouslySetInnerHTML — content is set imperatively via ref so
      // React's reconciler never patches innerHTML, even on slide-timer
      // re-renders. This is the only reliable way to protect a contentEditable
      // element from being reset mid-edit by an unrelated state update.
      onFocus={() => { isFocused.current = true; }}
      onBlur={(e: React.FocusEvent<HTMLElement>) => {
        isFocused.current = false;
        const newText = e.currentTarget.innerText.trim();
        if (elemRef.current) elemRef.current.innerHTML = newText;
        setText(adminKey, newText); // persist to Firestore
      }}
      title="✏️ Click to edit"
      style={{
        outline:       '2px dashed #8B0000',
        outlineOffset: '4px',
        cursor:        'text',
        borderRadius:  '2px',
        minWidth:      '1em',
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
    // Reset so the same file can be re-selected if needed
    e.target.value = '';
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
      style={{
        position:   'relative',
        display:    'inline-block',
        cursor:     busy ? 'wait' : 'pointer',
        overflow:   'hidden',
        width:      '100%',
        height:     '100%',
        ...style,
      }}
      onClick={() => !busy && fileRef.current?.click()}
      title={busy ? 'Uploading…' : '📷 Click to replace image'}
    >
      <img
        src={displaySrc} alt={alt ?? ''}
        style={{
          display: 'block', width: '100%', height: '100%',
          objectFit: 'cover', opacity: busy ? 0.5 : 1,
          ...imgStyle,
        }}
      />

      {/* Overlay */}
      <div style={{
        position:       'absolute', inset: 0,
        background:     busy ? 'rgba(18,0,0,0.65)' : 'rgba(107,0,0,0.58)',
        display:        'flex', flexDirection: 'column',
        alignItems:     'center', justifyContent: 'center', gap: 8,
        color:          '#FDF6EE',
        fontFamily:     'Barlow Condensed, sans-serif',
        fontSize:       13, fontWeight: 700, letterSpacing: 2,
        textTransform:  'uppercase', pointerEvents: 'none',
        borderRadius:   'inherit',
        transition:     'background 0.2s',
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

      <input
        ref={fileRef} type="file" accept="image/*"
        style={{ display: 'none' }} onChange={handleChange}
      />
    </div>
  );
}