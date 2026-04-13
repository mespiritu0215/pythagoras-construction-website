import React, { useState, useEffect, useRef, JSX } from 'react';
import emailjs from '@emailjs/browser';

/* ─────────────────────────────────────────────────────────────
   TYPES
───────────────────────────────────────────────────────────── */
interface GoogleUser {
  name: string;
  email: string;
  picture: string;
}

declare global {
  interface Window {
    google: {
      accounts: {
        id: {
          initialize: (config: object) => void;
          renderButton: (element: HTMLElement, config: object) => void;
          prompt: () => void;
        };
      };
    };
  }
}

const CONCERN_OPTIONS = [
  { value: '', label: 'Select a concern...' },
  { value: 'job', label: 'Want to Apply for a Job' },
  { value: 'project', label: 'Construction Projects' },
];

const RECIPIENT_MAP: Record<string, string> = {
  job: 'constructionpythagoras1@gmail.com',
  project: 'constructionpythagoras1@gmail.com',
};

const SUBJECT_MAP: Record<string, string> = {
  job: 'Job Application Inquiry',
  project: 'Construction Project Inquiry',
};

/* ─────────────────────────────────────────────────────────────
   ENV VARIABLES
   Add these to your .env.local:
     REACT_APP_GOOGLE_CLIENT_ID=...
     REACT_APP_EMAILJS_PUBLIC_KEY=...
     REACT_APP_EMAILJS_SERVICE_ID=...
     REACT_APP_EMAILJS_TEMPLATE_ID=...
───────────────────────────────────────────────────────────── */
const GOOGLE_CLIENT_ID    = process.env.REACT_APP_GOOGLE_CLIENT_ID    ?? '';
const EMAILJS_PUBLIC_KEY  = process.env.REACT_APP_EMAILJS_PUBLIC_KEY  ?? '';
const EMAILJS_SERVICE_ID  = process.env.REACT_APP_EMAILJS_SERVICE_ID  ?? '';
const EMAILJS_TEMPLATE_ID = process.env.REACT_APP_EMAILJS_TEMPLATE_ID ?? '';

/* ─────────────────────────────────────────────────────────────
   STYLES
───────────────────────────────────────────────────────────── */
const css = `
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@400;500;600;700&family=Barlow+Condensed:wght@400;600;700&display=swap');

.cu-page {
  position: relative;
  min-height: 100vh;
  background: #0f0e0e;
  font-family: 'Barlow', sans-serif;
  color: #fff;
  overflow-x: hidden;
}

.cu-bg {
  position: fixed; inset: 0;
  background-image: url('/background.png');
  background-size: cover; background-position: center;
  background-repeat: no-repeat;
  pointer-events: none; z-index: 0;
}
.cu-bg-overlay {
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.88);
  pointer-events: none; z-index: 1;
}

.cu-inner {
  position: relative; z-index: 2;
  max-width: 1280px; margin: 0 auto;
  padding: clamp(120px,14vw,160px) clamp(20px,6vw,80px) clamp(80px,10vw,120px);
  display: grid; grid-template-columns: 1fr 1fr;
  gap: clamp(48px,7vw,100px); align-items: start;
}

.cu-tag {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: clamp(10px,1.2vw,13px); font-weight: 700;
  letter-spacing: 4px; text-transform: uppercase;
  color: #920000; margin: 0 0 14px;
}
.cu-heading {
  font-family: 'Bebas Neue', sans-serif;
  font-size: clamp(42px,6vw,82px); line-height: 0.95;
  letter-spacing: 2px; color: #fff;
  margin: 0 0 clamp(16px,2.5vw,28px);
}
.cu-heading span { color: #920000; }
.cu-desc {
  font-size: clamp(13px,1.4vw,16px); line-height: 1.8;
  color: rgba(255,255,255,0.5);
  margin: 0 0 clamp(32px,5vw,52px); max-width: 420px;
}

.cu-info-list { display: flex; flex-direction: column; gap: 20px; }
.cu-info-item { display: flex; align-items: flex-start; gap: 14px; }
.cu-info-icon {
  width: 38px; height: 38px;
  border: 1px solid rgba(146,0,0,0.4);
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0; background: rgba(146,0,0,0.08);
}
.cu-info-icon svg { width: 16px; height: 16px; fill: #920000; }
.cu-info-text-label {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 11px; font-weight: 700;
  letter-spacing: 2.5px; text-transform: uppercase;
  color: #920000; margin: 0 0 3px;
}
.cu-info-text-value { font-size: 14px; color: rgba(255,255,255,0.7); line-height: 1.55; margin: 0; }
.cu-info-text-value a { color: rgba(255,255,255,0.7); text-decoration: none; transition: color 0.2s; }
.cu-info-text-value a:hover { color: #fff; }

.cu-card {
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.07);
  padding: clamp(28px,4vw,48px);
}

.cu-auth-gate {
  display: flex; flex-direction: column; align-items: center;
  text-align: center; padding: clamp(24px,4vw,48px) 0; gap: 20px;
}
.cu-auth-lock {
  width: 56px; height: 56px;
  border: 1px solid rgba(146,0,0,0.35);
  display: flex; align-items: center; justify-content: center;
  background: rgba(146,0,0,0.08);
}
.cu-auth-lock svg { width: 24px; height: 24px; fill: #920000; }
.cu-auth-title {
  font-family: 'Bebas Neue', sans-serif;
  font-size: clamp(22px,3vw,32px); letter-spacing: 1px; color: #fff; margin: 0;
}
.cu-auth-sub {
  font-size: 14px; color: rgba(255,255,255,0.45);
  line-height: 1.7; margin: 0; max-width: 320px;
}
.cu-google-btn-wrap { margin-top: 8px; display: flex; justify-content: center; }

.cu-user-pill {
  display: flex; align-items: center; gap: 10px;
  margin-bottom: clamp(20px,3vw,32px);
  padding-bottom: clamp(16px,2.5vw,24px);
  border-bottom: 1px solid rgba(255,255,255,0.07);
}
.cu-user-avatar {
  width: 36px; height: 36px; border-radius: 50%;
  border: 2px solid rgba(146,0,0,0.5); object-fit: cover;
}
.cu-user-name {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 13px; font-weight: 700; letter-spacing: 1px; color: #fff; margin: 0;
}
.cu-user-email { font-size: 11px; color: rgba(255,255,255,0.4); margin: 0; }
.cu-sign-out {
  margin-left: auto; background: none;
  border: 1px solid rgba(255,255,255,0.12);
  color: rgba(255,255,255,0.45);
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 11px; font-weight: 700;
  letter-spacing: 1.5px; text-transform: uppercase;
  padding: 5px 12px; cursor: pointer;
  transition: color 0.2s, border-color 0.2s;
}
.cu-sign-out:hover { color: #fff; border-color: rgba(255,255,255,0.35); }

.cu-form { display: flex; flex-direction: column; gap: clamp(16px,2vw,22px); }
.cu-field { display: flex; flex-direction: column; gap: 7px; }
.cu-label {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 11px; font-weight: 700;
  letter-spacing: 2.5px; text-transform: uppercase;
  color: rgba(255,255,255,0.5);
}
.cu-label span { color: #920000; margin-left: 2px; }

.cu-input, .cu-select, .cu-textarea {
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.1);
  color: #fff; font-family: 'Barlow', sans-serif;
  font-size: 14px; padding: 12px 14px; outline: none;
  transition: border-color 0.2s, background 0.2s;
  width: 100%; box-sizing: border-box;
  border-radius: 0; -webkit-appearance: none;
}
.cu-input::placeholder, .cu-textarea::placeholder { color: rgba(255,255,255,0.25); }
.cu-input:focus, .cu-select:focus, .cu-textarea:focus {
  border-color: rgba(146,0,0,0.7); background: rgba(146,0,0,0.05);
}
.cu-input:read-only { color: rgba(255,255,255,0.45); cursor: default; }
.cu-select {
  appearance: none; -webkit-appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='rgba(255,255,255,0.35)' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat; background-position: right 14px center;
  padding-right: 36px; cursor: pointer;
}
.cu-select option { background: #1a1919; color: #fff; }
.cu-textarea { resize: vertical; min-height: 130px; line-height: 1.65; }

.cu-error {
  padding: 12px 14px;
  background: rgba(180,0,0,0.12);
  border: 1px solid rgba(180,0,0,0.4);
}
.cu-error p { margin: 0; font-size: 13px; line-height: 1.55; color: rgba(255,140,140,0.95); }

.cu-submit {
  display: inline-flex; align-items: center; gap: 8px;
  background: #920000; color: #fff;
  font-family: 'Barlow Condensed', sans-serif;
  font-weight: 700; font-size: 13px;
  letter-spacing: 2px; text-transform: uppercase;
  padding: 15px 36px; border: 2px solid #920000;
  cursor: pointer; transition: background 0.2s, color 0.2s;
  align-self: flex-start; margin-top: 4px;
}
.cu-submit:hover:not(:disabled) { background: transparent; color: #920000; }
.cu-submit:disabled { opacity: 0.55; cursor: not-allowed; }

.cu-spinner {
  width: 14px; height: 14px;
  border: 2px solid rgba(255,255,255,0.35);
  border-top-color: #fff; border-radius: 50%;
  animation: cu-spin 0.7s linear infinite;
}
@keyframes cu-spin { to { transform: rotate(360deg); } }

.cu-success {
  display: flex; flex-direction: column; align-items: center;
  text-align: center; gap: 16px; padding: clamp(20px,3vw,36px) 0;
}
.cu-success-icon {
  width: 56px; height: 56px;
  background: rgba(146,0,0,0.12); border: 1px solid rgba(146,0,0,0.4);
  display: flex; align-items: center; justify-content: center;
}
.cu-success-icon svg { width: 24px; height: 24px; }
.cu-success-title { font-family: 'Bebas Neue', sans-serif; font-size: clamp(22px,3vw,30px); letter-spacing: 1.5px; color: #fff; margin: 0; }
.cu-success-sub { font-size: 14px; color: rgba(255,255,255,0.45); line-height: 1.7; margin: 0; }
.cu-success-another {
  background: none; border: 1px solid rgba(146,0,0,0.5);
  color: #920000; font-family: 'Barlow Condensed', sans-serif;
  font-size: 12px; font-weight: 700; letter-spacing: 2px;
  text-transform: uppercase; padding: 10px 24px; cursor: pointer;
  transition: background 0.2s, color 0.2s; margin-top: 8px;
}
.cu-success-another:hover { background: rgba(146,0,0,0.1); color: #b50000; }

@media (max-width: 860px) {
  .cu-inner { grid-template-columns: 1fr; gap: 52px; padding-top: clamp(100px,16vw,130px); }
  .cu-desc { max-width: 100%; }
}
@media (max-width: 480px) {
  .cu-card { padding: 24px 18px; }
  .cu-submit { width: 100%; justify-content: center; }
}
`;

/* ─────────────────────────────────────────────────────────────
   COMPONENT
───────────────────────────────────────────────────────────── */
export default function ContactUs(): JSX.Element {
  const [user, setUser]           = useState<GoogleUser | null>(null);
  const [fullName, setFullName]   = useState('');
  const [concern, setConcern]     = useState('');
  const [message, setMessage]     = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending]     = useState(false);
  const [sendError, setSendError] = useState('');
  const [styleInjected, setStyleInjected] = useState(false);

  const googleBtnRef   = useRef<HTMLDivElement>(null);
  const gsiInitialized = useRef(false);

  /* ── Inject CSS once ── */
  useEffect(() => {
    if (styleInjected) return;
    const style = document.createElement('style');
    style.innerHTML = css;
    document.head.appendChild(style);
    setStyleInjected(true);
  }, [styleInjected]);

  /* ── Load GSI script ── */
  useEffect(() => {
    if (document.getElementById('google-gsi-script')) return;
    const script = document.createElement('script');
    script.id = 'google-gsi-script';
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
  }, []);

  /* ── Init Google & render button ── */
  useEffect(() => {
    if (user) return;
    gsiInitialized.current = false;

    const tryInit = () => {
      if (!window.google || !googleBtnRef.current) return false;
      if (gsiInitialized.current) return true;

      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: (response: { credential: string }) => {
          try {
            const payload = JSON.parse(atob(response.credential.split('.')[1]));
            setUser({
              name: payload.name ?? '',
              email: payload.email ?? '',
              picture: payload.picture ?? '',
            });
            setFullName(payload.name ?? '');
          } catch {
            alert('Sign-in failed. Please try again.');
          }
        },
        ux_mode: 'popup',
      });

      window.google.accounts.id.renderButton(googleBtnRef.current, {
        theme: 'outline',
        size: 'large',
        text: 'signin_with',
        shape: 'rectangular',
        width: 280,
      });

      gsiInitialized.current = true;
      return true;
    };

    if (tryInit()) return;
    const interval = setInterval(() => {
      if (tryInit()) clearInterval(interval);
    }, 300);
    return () => clearInterval(interval);
  }, [user]);

  /* ── Sign out ── */
  const handleSignOut = (): void => {
    setUser(null);
    setFullName('');
    setConcern('');
    setMessage('');
    setSubmitted(false);
    setSendError('');
  };

  /* ── Submit via EmailJS ── */
  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (!concern || !fullName.trim() || !message.trim()) return;

    setSending(true);
    setSendError('');

    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          to_email:   RECIPIENT_MAP[concern],
          subject:    `[${SUBJECT_MAP[concern]}] from ${fullName}`,
          from_name:  fullName,
          from_email: user?.email ?? 'N/A',
          message,
        },
        EMAILJS_PUBLIC_KEY
      );
      setSubmitted(true);
    } catch (err: unknown) {
      console.error('EmailJS error:', err);
      setSendError(
        'Failed to send your message. Please try again or contact us directly at pci051@yahoo.com.'
      );
    } finally {
      setSending(false);
    }
  };

  const resetForm = (): void => {
    setConcern('');
    setMessage('');
    setSubmitted(false);
    setSendError('');
  };

  const isFormValid = concern !== '' && fullName.trim() !== '' && message.trim() !== '';

  /* ── SVG Icons ── */
  const IconEmail = (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z"/>
    </svg>
  );
  const IconPhone = (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M6.62 10.79a15.1 15.1 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 011 1V20a1 1 0 01-1 1C10.61 21 3 13.39 3 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.45.57 3.58a1 1 0 01-.24 1.01l-2.21 2.2z"/>
    </svg>
  );
  const IconClock = (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z"/>
    </svg>
  );
  const IconLock = (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
    </svg>
  );
  const IconCheck = (
    <svg viewBox="0 0 24 24" fill="none" stroke="#920000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  );

  /* ── Render ── */
  return (
    <div className="cu-page">
      <div className="cu-bg" />
      <div className="cu-bg-overlay" />

      <div className="cu-inner">

        {/* LEFT */}
        <div className="cu-left">
          <p className="cu-tag">Get In Touch</p>
          <h1 className="cu-heading">
            LET'S BUILD<br />
            SOMETHING<br />
            <span>GREAT.</span>
          </h1>
          <p className="cu-desc">
            Whether you're pursuing a career in construction or planning your next project,
            we're here to help. Reach out and one of our team members will get back to you promptly.
          </p>
          <div className="cu-info-list">
            <div className="cu-info-item">
              <div className="cu-info-icon">{IconEmail}</div>
              <div>
                <p className="cu-info-text-label">Email Us At</p>
                <p className="cu-info-text-value">
                  <a href="mailto:pci051@yahoo.com">pci051@yahoo.com</a>
                </p>
              </div>
            </div>
            <div className="cu-info-item">
              <div className="cu-info-icon">{IconPhone}</div>
              <div>
                <p className="cu-info-text-label">Phone</p>
                <p className="cu-info-text-value">(046) 894-9518 / (046) 238-4166</p>
              </div>
            </div>
            <div className="cu-info-item">
              <div className="cu-info-icon">{IconClock}</div>
              <div>
                <p className="cu-info-text-label">Working Hours</p>
                <p className="cu-info-text-value">Mon – Sat &nbsp;·&nbsp; 8:00 AM – 5:00 PM</p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: Card */}
        <div className="cu-card">

          {/* Not signed in */}
          {!user && (
            <div className="cu-auth-gate">
              <div className="cu-auth-lock">{IconLock}</div>
              <h2 className="cu-auth-title">Sign In to Continue</h2>
              <p className="cu-auth-sub">
                We require a Google account to verify your identity before submitting
                a message to our team.
              </p>
              <div className="cu-google-btn-wrap">
                <div ref={googleBtnRef} id="cu-google-btn-rendered" />
              </div>
            </div>
          )}

          {/* Signed in + success */}
          {user && submitted && (
            <div className="cu-success">
              <div className="cu-user-pill">
                <img src={user.picture} alt={user.name} className="cu-user-avatar" />
                <div>
                  <p className="cu-user-name">{user.name}</p>
                  <p className="cu-user-email">{user.email}</p>
                </div>
                <button className="cu-sign-out" onClick={handleSignOut} type="button">Sign Out</button>
              </div>
              <div className="cu-success-icon">{IconCheck}</div>
              <h3 className="cu-success-title">Message Sent!</h3>
              <p className="cu-success-sub">
                Your message has been delivered to the appropriate team. Expect a reply within
                1–2 business days.
              </p>
              <button className="cu-success-another" onClick={resetForm} type="button">
                Send Another Message
              </button>
            </div>
          )}

          {/* Signed in + form */}
          {user && !submitted && (
            <>
              <div className="cu-user-pill">
                <img src={user.picture} alt={user.name} className="cu-user-avatar" />
                <div>
                  <p className="cu-user-name">{user.name}</p>
                  <p className="cu-user-email">{user.email}</p>
                </div>
                <button className="cu-sign-out" onClick={handleSignOut} type="button">Sign Out</button>
              </div>

              <form className="cu-form" onSubmit={handleSubmit} noValidate>

                {/* Full Name */}
                <div className="cu-field">
                  <label className="cu-label" htmlFor="cu-fullname">
                    Full Name <span>*</span>
                  </label>
                  <input
                    id="cu-fullname"
                    className="cu-input"
                    type="text"
                    placeholder="Your full name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>

                {/* Concern */}
                <div className="cu-field">
                  <label className="cu-label" htmlFor="cu-concern">
                    Nature of Concern <span>*</span>
                  </label>
                  <select
                    id="cu-concern"
                    className="cu-select"
                    value={concern}
                    onChange={(e) => setConcern(e.target.value)}
                    required
                  >
                    {CONCERN_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value} disabled={opt.value === ''}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Message */}
                <div className="cu-field">
                  <label className="cu-label" htmlFor="cu-message">
                    Message <span>*</span>
                  </label>
                  <textarea
                    id="cu-message"
                    className="cu-textarea"
                    placeholder={
                      concern === 'job'
                        ? "Tell us about your experience, skills, and the position you're interested in…"
                        : concern === 'project'
                        ? 'Describe your project — type of work, location, timeline, and any special requirements…'
                        : 'Write your message here…'
                    }
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                  />
                </div>

                {/* Error */}
                {sendError && (
                  <div className="cu-error">
                    <p>{sendError}</p>
                  </div>
                )}

                <button
                  className="cu-submit"
                  type="submit"
                  disabled={!isFormValid || sending}
                >
                  {sending && <span className="cu-spinner" />}
                  {sending ? 'Sending…' : 'Send Message →'}
                </button>

              </form>
            </>
          )}

        </div>
      </div>
    </div>
  );
}