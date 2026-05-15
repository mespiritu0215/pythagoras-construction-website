/**
 * AdminContext.tsx
 *
 * Setup:
 *   1. Add REACT_APP_ADMIN_EMAIL=youremail@gmail.com to your .env
 *      (comma-separated for multiple admins)
 *   2. Wrap <App> in <AdminProvider> inside index.tsx (or inside App.tsx itself)
 *
 * How it works:
 *   - When a user signs in via Google on the Contact Us page, their email is
 *     checked against REACT_APP_ADMIN_EMAIL.
 *   - If it matches, isAdmin = true and an AdminBar appears at the bottom.
 *   - Toggle "Edit Mode" to make text and images clickable/editable.
 *   - All edits are auto-saved to localStorage and persist across page refreshes.
 *   - Admin-added projects are also persisted in localStorage.
 *
 * NOTE: localStorage has a ~5–10 MB limit. If you upload many large project
 *       images you may hit this limit. For production, use cloud storage instead.
 */

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
  useRef,
} from 'react';

// ─────────────────────────────────────────────────────────────
//  TYPES
// ─────────────────────────────────────────────────────────────

export interface GoogleUser {
  name:    string;
  email:   string;
  picture: string;
}

export interface AdminProject {
  id:          number;
  title:       string;
  category:    string;
  location:    string;
  description: string;
  client:      string;
  completion:  string;
  amount:      string;
  ongoing:     boolean;
  cover:       string;    // base64 data URL
  images:      string[];  // base64 data URLs
}

interface StoredData {
  texts:         Record<string, string>;
  images:        Record<string, string>;
  adminProjects: AdminProject[];
}

interface AdminCtx {
  user:          GoogleUser | null;
  setUser:       (u: GoogleUser | null) => void;
  isAdmin:       boolean;
  editMode:      boolean;
  toggleEdit:    () => void;
  getText:       (key: string, fallback: string) => string;
  setText:       (key: string, val: string) => void;
  getImg:        (key: string) => string | null;
  setImg:        (key: string, b64: string) => void;
  adminProjects: AdminProject[];
  addProject:    (p: Omit<AdminProject, 'id'>) => void;
  removeProject: (id: number) => void;
}

// ─────────────────────────────────────────────────────────────
//  HELPERS
// ─────────────────────────────────────────────────────────────

const STORAGE_KEY = 'pci_admin_v1';

function loadStored(): StoredData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as StoredData;
  } catch { /**/ }
  return { texts: {}, images: {}, adminProjects: [] };
}

function persist(d: StoredData) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(d)); } catch { /**/ }
}

// Admin emails from .env: REACT_APP_ADMIN_EMAIL=alice@gmail.com,bob@gmail.com
const ADMIN_EMAILS = (process.env.REACT_APP_ADMIN_EMAIL ?? '')
  .split(',')
  .map(e => e.trim().toLowerCase())
  .filter(Boolean);

// ─────────────────────────────────────────────────────────────
//  CONTEXT
// ─────────────────────────────────────────────────────────────

const Ctx = createContext<AdminCtx>(null!);
export const useAdmin = () => useContext(Ctx);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [user,     setUserRaw] = useState<GoogleUser | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [data,     setData]    = useState<StoredData>(loadStored);

  const isAdmin = !!user && ADMIN_EMAILS.includes(user.email.toLowerCase());

  const setUser = useCallback((u: GoogleUser | null) => {
    setUserRaw(u);
    if (!u) setEditMode(false);
  }, []);

  const mutate = useCallback((fn: (prev: StoredData) => StoredData) => {
    setData(prev => {
      const next = fn(prev);
      persist(next);
      return next;
    });
  }, []);

  const value: AdminCtx = {
    user, setUser, isAdmin,
    editMode,
    toggleEdit: () => setEditMode(v => !v),

    getText: (key, fallback) => data.texts[key] ?? fallback,
    setText: (key, val) =>
      mutate(p => ({ ...p, texts: { ...p.texts, [key]: val } })),

    getImg: (key) => data.images[key] ?? null,
    setImg: (key, b64) =>
      mutate(p => ({ ...p, images: { ...p.images, [key]: b64 } })),

    adminProjects: data.adminProjects,
    addProject: (p) =>
      mutate(prev => ({
        ...prev,
        adminProjects: [...prev.adminProjects, { ...p, id: Date.now() }],
      })),
    removeProject: (id) =>
      mutate(p => ({
        ...p,
        adminProjects: p.adminProjects.filter(x => x.id !== id),
      })),
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

// ─────────────────────────────────────────────────────────────
//  EDITABLE TEXT
//  Renders plain text normally; in edit mode becomes contentEditable.
//  Changes are auto-saved to localStorage on blur.
//
//  Usage:
//    <EditableText adminKey="home.who.heading" tag="h2" className="who-heading">
//      A PEOPLE-DRIVEN CONSTRUCTION FIRM...
//    </EditableText>
// ─────────────────────────────────────────────────────────────

export function EditableText({
  adminKey,
  children,
  tag: Tag = 'span',
  className,
  style,
  ...rest
}: {
  adminKey:  string;
  children:  string;
  tag?:      keyof React.JSX.IntrinsicElements;
  className?: string;
  style?:    React.CSSProperties;
  [k: string]: any;
}) {
  const { editMode, getText, setText } = useAdmin();
  const text = getText(adminKey, children);

  if (!editMode) {
    return (
      <Tag className={className} style={style} {...rest}>
        {text}
      </Tag>
    );
  }

  return (
    // @ts-ignore – contentEditable on any element via spread
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
//  Renders the image normally; in edit mode shows an overlay so
//  the admin can click to upload a replacement (stored as base64).
//
//  Usage:
//    <EditableImage adminKey="home.who.img1" src={whoImg1} alt="Construction site"
//                   className="who-img" />
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
  className?:        string;      // applied to wrapper <div> in edit mode, <img> otherwise
  style?:            React.CSSProperties; // wrapper style in edit mode
  imgStyle?:         React.CSSProperties; // always applied to <img>
  wrapperClassName?: string;
  [k: string]: any;
}) {
  const { editMode, getImg, setImg } = useAdmin();
  const fileRef = useRef<HTMLInputElement>(null);
  const displaySrc = getImg(adminKey) ?? defaultSrc;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setImg(adminKey, ev.target!.result as string);
    reader.readAsDataURL(file);
  };

  if (!editMode) {
    return (
      <img
        src={displaySrc}
        alt={alt ?? ''}
        className={className}
        style={imgStyle}
        {...rest}
      />
    );
  }

  return (
    <div
      className={wrapperClassName ?? className}
      style={{
        position: 'relative',
        display:  'inline-block',
        cursor:   'pointer',
        ...style,
      }}
      onClick={() => fileRef.current?.click()}
      title="📷 Click to replace image"
    >
      <img
        src={displaySrc}
        alt={alt ?? ''}
        style={{ display: 'block', width: '100%', height: '100%', objectFit: 'cover', ...imgStyle }}
      />
      {/* Overlay */}
      <div
        style={{
          position:       'absolute',
          inset:          0,
          background:     'rgba(107,0,0,0.60)',
          display:        'flex',
          flexDirection:  'column',
          alignItems:     'center',
          justifyContent: 'center',
          gap:            8,
          color:          '#FDF6EE',
          fontFamily:     'Barlow Condensed, sans-serif',
          fontSize:       13,
          fontWeight:     700,
          letterSpacing:  2,
          textTransform:  'uppercase',
          pointerEvents:  'none',
          borderRadius:   'inherit',
        }}
      >
        <span style={{ fontSize: 22 }}>📷</span>
        <span>Change Image</span>
      </div>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleChange}
      />
    </div>
  );
}
