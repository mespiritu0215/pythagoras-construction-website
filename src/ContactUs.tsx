/**
 * ContactUs.tsx  (Updated for admin system)
 *
 * Changes from original:
 *  - Imports useAdmin from AdminContext
 *  - On Google sign-in, sets the user in AdminContext so the admin bar
 *    becomes visible site-wide if the email matches REACT_APP_ADMIN_EMAIL
 *  - The contact form still works exactly as before
 *  - Admin users see an "ADMIN ACCESS GRANTED" badge next to their name
 */

import React, { useState, useEffect, useRef, JSX } from 'react';
import emailjs from '@emailjs/browser';
import { useAdmin } from './AdminContext';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from './firebase';

/* ─────────────────────────────────────────────────────────────
   TYPES
───────────────────────────────────────────────────────────── */
interface GoogleUser {
  name: string;
  email: string;
  picture: string;
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
  background: #FDF6EE;
  font-family: 'Barlow', sans-serif;
  color: #2C1810;
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
  background: linear-gradient(135deg, rgba(43,8,0,0.94) 0%, rgba(74,0,0,0.90) 100%);
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
  color: #F0E6D6; opacity: 0.6; margin: 0 0 14px;
}
.cu-heading {
  font-family: 'Bebas Neue', sans-serif;
  font-size: clamp(42px,6vw,82px); line-height: 0.95;
  letter-spacing: 2px; color: #FDF6EE;
  margin: 0 0 clamp(16px,2.5vw,28px);
}
.cu-heading span { color: #F0E6D6; opacity: 0.72; }
.cu-desc {
  font-size: clamp(13px,1.4vw,16px); line-height: 1.8;
  color: rgba(253,246,238,0.5);
  margin: 0 0 clamp(32px,5vw,52px); max-width: 420px;
}

.cu-info-list { display: flex; flex-direction: column; gap: 20px; }
.cu-info-item { display: flex; align-items: flex-start; gap: 14px; }
.cu-info-icon {
  width: 38px; height: 38px;
  border: 1px solid rgba(240,230,214,0.28);
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0; background: rgba(240,230,214,0.08);
}
.cu-info-icon svg { width: 16px; height: 16px; fill: rgba(253,246,238,0.75); }
.cu-info-text-label {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 11px; font-weight: 700;
  letter-spacing: 2.5px; text-transform: uppercase;
  color: rgba(240,230,214,0.55); margin: 0 0 3px;
}
.cu-info-text-value { font-size: 14px; color: rgba(253,246,238,0.75); line-height: 1.55; margin: 0; }
.cu-info-text-value a { color: rgba(253,246,238,0.75); text-decoration: none; transition: color 0.2s; }
.cu-info-text-value a:hover { color: #FDF6EE; }

.cu-card {
  background: #FFFFFF;
  border: 1px solid #E8D8C4;
  padding: clamp(28px,4vw,48px);
  box-shadow: 0 8px 32px rgba(107,0,0,0.08);
}

.cu-auth-gate {
  display: flex; flex-direction: column; align-items: center;
  text-align: center; padding: clamp(24px,4vw,48px) 0; gap: 20px;
}
.cu-auth-lock {
  width: 56px; height: 56px;
  border: 1px solid rgba(107,0,0,0.22);
  display: flex; align-items: center; justify-content: center;
  background: rgba(107,0,0,0.05);
}
.cu-auth-lock svg { width: 24px; height: 24px; fill: #6B0000; }
.cu-auth-title {
  font-family: 'Bebas Neue', sans-serif;
  font-size: clamp(22px,3vw,32px); letter-spacing: 1px;
  color: #2C1810; margin: 0;
}
.cu-auth-sub {
  font-size: 14px; color: #5C4033;
  line-height: 1.7; margin: 0; max-width: 320px;
}
.cu-google-btn-wrap { margin-top: 8px; display: flex; justify-content: center; }
.cu-google-native-btn {
  display: inline-flex; align-items: center; gap: 10px;
  background: #FFFFFF; border: 1px solid #DADCE0; border-radius: 4px;
  padding: 10px 24px; width: 280px; justify-content: center;
  font-family: 'Barlow', sans-serif; font-size: 14px; font-weight: 600;
  color: #3C4043; cursor: pointer;
  box-shadow: 0 1px 3px rgba(0,0,0,0.12); transition: box-shadow 0.2s;
}
.cu-google-native-btn:hover { box-shadow: 0 2px 6px rgba(0,0,0,0.2); }

.cu-user-pill {
  display: flex; align-items: center; gap: 10px;
  margin-bottom: clamp(20px,3vw,32px);
  padding-bottom: clamp(16px,2.5vw,24px);
  border-bottom: 1px solid #E8D8C4;
}
.cu-user-avatar {
  width: 36px; height: 36px; border-radius: 50%;
  border: 2px solid rgba(107,0,0,0.3); object-fit: cover;
}
.cu-user-name {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 13px; font-weight: 700; letter-spacing: 1px;
  color: #2C1810; margin: 0;
}
.cu-user-email { font-size: 11px; color: #9A8F85; margin: 0; }
.cu-sign-out {
  margin-left: auto; background: none;
  border: 1px solid #E8D8C4;
  color: #9A8F85;
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 11px; font-weight: 700;
  letter-spacing: 1.5px; text-transform: uppercase;
  padding: 5px 12px; cursor: pointer;
  transition: color 0.2s, border-color 0.2s;
}
.cu-sign-out:hover { color: #6B0000; border-color: rgba(107,0,0,0.35); }

/* Admin badge */
.cu-admin-badge {
  display: inline-flex; align-items: center; gap: 5px;
  background: #6B0000; color: #FDF6EE;
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 9px; font-weight: 700; letter-spacing: 2px;
  text-transform: uppercase; padding: 3px 8px;
  margin-left: 4px; vertical-align: middle;
}

.cu-form { display: flex; flex-direction: column; gap: clamp(16px,2vw,22px); }
.cu-field { display: flex; flex-direction: column; gap: 7px; }
.cu-label {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 11px; font-weight: 700;
  letter-spacing: 2.5px; text-transform: uppercase;
  color: #9A8F85;
}
.cu-label span { color: #6B0000; margin-left: 2px; }

.cu-input, .cu-select, .cu-textarea {
  background: #FDF6EE;
  border: 1px solid #E8D8C4;
  color: #2C1810; font-family: 'Barlow', sans-serif;
  font-size: 14px; padding: 12px 14px; outline: none;
  transition: border-color 0.2s, background 0.2s;
  width: 100%; box-sizing: border-box;
  border-radius: 0; -webkit-appearance: none;
}
.cu-input::placeholder, .cu-textarea::placeholder { color: #9A8F85; }
.cu-input:focus, .cu-select:focus, .cu-textarea:focus {
  border-color: rgba(107,0,0,0.45); background: #FFFFFF;
}
.cu-input:read-only { color: #9A8F85; cursor: default; }
.cu-select {
  appearance: none; -webkit-appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%239A8F85' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat; background-position: right 14px center;
  padding-right: 36px; cursor: pointer;
}
.cu-select option { background: #FFFFFF; color: #2C1810; }
.cu-textarea { resize: vertical; min-height: 130px; line-height: 1.65; }

.cu-error {
  padding: 12px 14px;
  background: rgba(107,0,0,0.05);
  border: 1px solid rgba(107,0,0,0.22);
}
.cu-error p { margin: 0; font-size: 13px; line-height: 1.55; color: #6B0000; }

.cu-submit {
  display: inline-flex; align-items: center; gap: 8px;
  background: #6B0000; color: #FDF6EE;
  font-family: 'Barlow Condensed', sans-serif;
  font-weight: 700; font-size: 13px;
  letter-spacing: 2px; text-transform: uppercase;
  padding: 15px 36px; border: 2px solid #6B0000;
  cursor: pointer; transition: background 0.2s, color 0.2s;
  align-self: flex-start; margin-top: 4px;
}
.cu-submit:hover:not(:disabled) { background: transparent; color: #6B0000; }
.cu-submit:disabled { opacity: 0.55; cursor: not-allowed; }

.cu-spinner {
  width: 14px; height: 14px;
  border: 2px solid rgba(253,246,238,0.35);
  border-top-color: #FDF6EE; border-radius: 50%;
  animation: cu-spin 0.7s linear infinite;
}
@keyframes cu-spin { to { transform: rotate(360deg); } }

.cu-success {
  display: flex; flex-direction: column; align-items: center;
  text-align: center; gap: 16px; padding: clamp(20px,3vw,36px) 0;
}
.cu-success-icon {
  width: 56px; height: 56px;
  background: rgba(107,0,0,0.07); border: 1px solid rgba(107,0,0,0.22);
  display: flex; align-items: center; justify-content: center;
}
.cu-success-icon svg { width: 24px; height: 24px; }
.cu-success-title {
  font-family: 'Bebas Neue', sans-serif;
  font-size: clamp(22px,3vw,30px); letter-spacing: 1.5px;
  color: #2C1810; margin: 0;
}
.cu-success-sub { font-size: 14px; color: #5C4033; line-height: 1.7; margin: 0; }
.cu-success-another {
  background: none; border: 1px solid rgba(107,0,0,0.32);
  color: #6B0000; font-family: 'Barlow Condensed', sans-serif;
  font-size: 12px; font-weight: 700; letter-spacing: 2px;
  text-transform: uppercase; padding: 10px 24px; cursor: pointer;
  transition: background 0.2s, color 0.2s; margin-top: 8px;
}
.cu-success-another:hover { background: rgba(107,0,0,0.06); color: #8B0000; }

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
  // ── Admin context ──────────────────────────────────────────
  const { user: adminUser, setUser: setAdminUser, isAdmin } = useAdmin();

  // ── Local state (derives user from adminContext) ───────────
  const user     = adminUser;
  const setUser  = setAdminUser;

  const [fullName, setFullName]   = useState('');
  const [concern, setConcern]     = useState('');
  const [message, setMessage]     = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending]     = useState(false);
  const [sendError, setSendError] = useState('');
  const [styleInjected, setStyleInjected] = useState(false);



  useEffect(() => {
    if (styleInjected) return;
    const style = document.createElement('style');
    style.innerHTML = css;
    document.head.appendChild(style);
    setStyleInjected(true);
  }, [styleInjected]);


  // ── Firebase-native Google sign-in (avoids COOP postMessage conflict) ──
  const handleGoogleSignIn = async (): Promise<void> => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const fbUser = result.user;
      setUser({
        name:    fbUser.displayName  ?? '',
        email:   fbUser.email        ?? '',
        picture: fbUser.photoURL     ?? '',
      });
      setFullName(fbUser.displayName ?? '');
    } catch (err: unknown) {
      console.error('Google sign-in error:', err);
      alert('Sign-in failed. Please try again.');
    }
  };

  // Sync fullName when user changes
  useEffect(() => {
    if (user) setFullName(prev => prev || user.name);
  }, [user]);

  const handleSignOut = (): void => {
    setUser(null);
    setFullName('');
    setConcern('');
    setMessage('');
    setSubmitted(false);
    setSendError('');
  };

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
        'Failed to send your message. Please try again or contact us directly at pci1051@yahoo.com.ph'
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
    <svg viewBox="0 0 24 24" fill="none" stroke="#6B0000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  );

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
                  <a href="mailto:pci1051@yahoo.com.ph">pci1051@yahoo.com.ph</a>
                </p>
              </div>
            </div>
            <div className="cu-info-item">
              <div className="cu-info-icon">{IconPhone}</div>
              <div>
                <p className="cu-info-text-label">Phone</p>
                <p className="cu-info-text-value">(046) 894-9518 / (046) 238-4166</p>
                <p className="cu-info-text-value">+63 927 572 4505 (Mobile)</p>
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

          {!user && (
            <div className="cu-auth-gate">
              <div className="cu-auth-lock">{IconLock}</div>
              <h2 className="cu-auth-title">Sign In to Continue</h2>
              <p className="cu-auth-sub">
                We require a Google account to verify your identity before submitting
                a message to our team.
              </p>
              <div className="cu-google-btn-wrap">
                <button type="button" onClick={handleGoogleSignIn} className="cu-google-native-btn"><svg width="18" height="18" viewBox="0 0 18 18"><path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/><path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/><path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"/><path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/></svg>Sign in with Google</button>
              </div>
            </div>
          )}

          {user && submitted && (
            <div className="cu-success">
              <div className="cu-user-pill">
                <img src={user.picture} alt={user.name} className="cu-user-avatar" />
                <div>
                  <p className="cu-user-name">
                    {user.name}
                    {isAdmin && (
                      <span className="cu-admin-badge">⚙ Admin</span>
                    )}
                  </p>
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

          {user && !submitted && (
            <>
              <div className="cu-user-pill">
                <img src={user.picture} alt={user.name} className="cu-user-avatar" />
                <div>
                  <p className="cu-user-name">
                    {user.name}
                    {isAdmin && (
                      <span className="cu-admin-badge">⚙ Admin</span>
                    )}
                  </p>
                  <p className="cu-user-email">{user.email}</p>
                </div>
                <button className="cu-sign-out" onClick={handleSignOut} type="button">Sign Out</button>
              </div>

              {isAdmin && (
                <div style={{
                  background: 'rgba(107,0,0,0.05)',
                  border: '1px solid rgba(107,0,0,0.18)',
                  padding: '10px 14px',
                  marginBottom: 20,
                  fontFamily: 'Barlow Condensed, sans-serif',
                  fontSize: 12, fontWeight: 700, letterSpacing: 2,
                  textTransform: 'uppercase', color: '#6B0000',
                }}>
                  ⚙ Admin access granted — use the Edit Mode bar at the bottom of any page
                </div>
              )}

              <form className="cu-form" onSubmit={handleSubmit} noValidate>

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