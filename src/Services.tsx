import { useState, useEffect, useRef } from 'react';
import './Services.css';

// Core Icons/Images
import image1 from './serv-img1.png';
import image4 from './serv-img4.png';
import emailIcon from './email.png';
import phoneIcon from './phone.png';
import clockIcon from './clock.png';

// Project Images for Carousels
import GaisanoMactanSmart1 from "./CompletedProjects/GaisanoMactan/GaisanoMactanSmart1.jpg";
import GaisanoMactanSmart2 from "./CompletedProjects/GaisanoMactan/GaisanoMactanSmart2.jpg";
import GaisanoMactanSmart3 from "./CompletedProjects/GaisanoMactan/GaisanoMactanSmart3.jpg";
import GaisanoMactanSmart4 from "./CompletedProjects/GaisanoMactan/GaisanoMactanSmart4.jpg";
import GaisanoMactanSmart5 from "./CompletedProjects/GaisanoMactan/GaisanoMactanSmart5.jpg";
import GaisanoMactanSmart6 from "./CompletedProjects/GaisanoMactan/GaisanoMactanSmart6.jpg";
import GaisanoMactanSmart7 from "./CompletedProjects/GaisanoMactan/GaisanoMactanSmart7.jpg";
import GaisanoMactanSmart8 from "./CompletedProjects/GaisanoMactan/GaisanoMactanSmart8.jpg";
import GaisanoMactanSmart9 from "./CompletedProjects/GaisanoMactan/GaisanoMactanSmart9.jpg";
import GaisanoMactanSmart10 from "./CompletedProjects/GaisanoMactan/GaisanoMactanSmart10.jpg";
import GaisanoMactanSmart11 from "./CompletedProjects/GaisanoMactan/GaisanoMactanSmart11.jpg";
import GaisanoMactanSmart12 from "./CompletedProjects/GaisanoMactan/GaisanoMactanSmart12.jpg";

import GlobeBaliuag1 from "./CompletedProjects/GlobeBaliuag/GlobeBaliuag1.png";
import GlobeBaliuag2 from "./CompletedProjects/GlobeBaliuag/GlobeBaliuag2.png";
import GlobeBaliuag3 from "./CompletedProjects/GlobeBaliuag/GlobeBaliuag3.png";
import GlobeBaliuag4 from "./CompletedProjects/GlobeBaliuag/GlobeBaliuag4.png";
import GlobeBaliuag5 from "./CompletedProjects/GlobeBaliuag/GlobeBaliuag5.png";
import GlobeBaliuag6 from "./CompletedProjects/GlobeBaliuag/GlobeBaliuag6.png";
import GlobeBaliuag7 from "./CompletedProjects/GlobeBaliuag/GlobeBaliuag7.png";
import GlobeBaliuag8 from "./CompletedProjects/GlobeBaliuag/GlobeBaliuag8.png";
import GlobeBaliuag9 from "./CompletedProjects/GlobeBaliuag/GlobeBaliuag9.png";
import GlobeBaliuag10 from "./CompletedProjects/GlobeBaliuag/GlobeBaliuag10.png";
import GlobeBaliuag11 from "./CompletedProjects/GlobeBaliuag/GlobeBaliuag11.png";
import GlobeBaliuag12 from "./CompletedProjects/GlobeBaliuag/GlobeBaliuag12.png";

const globeBaliuagImages: string[] = [
    GlobeBaliuag1, GlobeBaliuag2, GlobeBaliuag3, GlobeBaliuag4, GlobeBaliuag5,
    GlobeBaliuag6, GlobeBaliuag7, GlobeBaliuag8, GlobeBaliuag9, GlobeBaliuag10,
    GlobeBaliuag11, GlobeBaliuag12,
];

const gaisanoMactanImages: string[] = [
    GaisanoMactanSmart1, GaisanoMactanSmart2, GaisanoMactanSmart3, GaisanoMactanSmart4,
    GaisanoMactanSmart5, GaisanoMactanSmart6, GaisanoMactanSmart7, GaisanoMactanSmart8,
    GaisanoMactanSmart9, GaisanoMactanSmart10, GaisanoMactanSmart11, GaisanoMactanSmart12,
];

// ── Types ─────────────────────────────────────────────────────────────────────

interface CarouselProps {
    images: string[];
}

interface ServiceData {
    n: number;
    label: string;
    heading: string;
    items: string[];
    dark: boolean;
    reverse: boolean;
    image?: string;
    imageAlt?: string;
    carousel?: string[];
    caption?: string;
}

// ── Carousel ──────────────────────────────────────────────────────────────────

function Carousel({ images }: CarouselProps): JSX.Element {
    const [current, setCurrent] = useState<number>(0);
    const [hovered, setHovered] = useState<boolean>(false);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    useEffect(() => {
        if (hovered) {
            intervalRef.current = setInterval(() => {
                setCurrent((c) => (c + 1) % images.length);
            }, 1200);
        } else {
            if (intervalRef.current) clearInterval(intervalRef.current);
        }
        return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
    }, [hovered, images.length]);

    return (
        <div
            className="srv-carousel-wrapper"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            {images.map((img, i) => (
                <img
                    key={i}
                    src={img}
                    alt=""
                    className={`srv-carousel-img${i === current ? ' active' : ''}`}
                />
            ))}
            {/* Progress bar */}
            <div className="srv-carousel-bar">
                <div
                    className="srv-carousel-bar-fill"
                    style={{ width: `${((current + 1) / images.length) * 100}%` }}
                />
            </div>
            {/* Dots */}
            <div className="srv-carousel-dots">
                {images.map((_, i) => (
                    <span
                        key={i}
                        className={`srv-dot${i === current ? ' active' : ''}`}
                        onClick={() => setCurrent(i)}
                    />
                ))}
            </div>
        </div>
    );
}

// ── Services page ─────────────────────────────────────────────────────────────

const services: ServiceData[] = [
    {
        n: 1,
        label: 'Expertise',
        heading: 'Civil Works',
        items: [
            'New Construction & Renovation',
            'Tower Erection & Dismantling',
            'Waterproofing & Roofing Works',
            'Slope Protection / Rip Rapping',
            'Plumbing, Pipefitting & Drilling',
            'Metal Works & Masonry',
        ],
        image: image1,
        imageAlt: 'Civil Works',
        dark: true,
        reverse: false,
    },
    {
        n: 2,
        label: 'Systems',
        heading: 'Electrical Works',
        items: [
            'Environmental Alarm Systems',
            'Digital & Manual Transfer Switches',
            'Structured Cabling & Access Control',
            'Pole Mounted Distribution Transformers',
            'Generators & ATS Installation',
            'Panel Boards & Circuit Breakers',
        ],
        carousel: globeBaliuagImages,
        caption: 'Featured: Globe Baliuag Electrical Project',
        dark: false,
        reverse: true,
    },
    {
        n: 3,
        label: 'Portfolio',
        heading: 'Our End Products',
        items: [
            'Commercial & Industrial Warehouses',
            'Residential & School Buildings',
            'Office / Business Centers',
            'Submersible Pump Installation',
            'Sewer and Drainage Lines',
            'Site Development',
        ],
        carousel: gaisanoMactanImages,
        caption: 'Featured: Gaisano Mactan Development',
        dark: true,
        reverse: false,
    },
    {
        n: 4,
        label: 'Design',
        heading: 'Architectural & Design',
        items: [
            'Schematic Design & 3D Modelling',
            'Rendered Walkthroughs & Presentations',
            'Design Development & Working Drawings',
            'As-built Plans & Technical Specs',
            'Contract Documents & Site Supervision',
        ],
        image: image4,
        imageAlt: 'Design Works',
        dark: false,
        reverse: true,
    },
];

export default function Services(): JSX.Element {
    return (
        <main className="srv-page">

            {/* ── HERO ── */}
            <section className="srv-hero">
                <div className="srv-hero-bg" />
                <div className="srv-hero-overlay" />

                {/* Decorative vertical bar */}
                <div className="srv-hero-vbar" />

                <div className="srv-hero-content">
                    <p className="srv-eyebrow">Solutions · Excellence · Reliability</p>
                    <h1 className="srv-hero-title">
                        <span className="srv-ht-line">OUR</span>
                        <span className="srv-ht-line srv-ht-accent">SERVICES</span>
                    </h1>
                    <p className="srv-hero-sub">
                        From foundational civil works to intricate architectural designs, we provide
                        end-to-end construction solutions tailored to the Philippine landscape.
                    </p>
                </div>

                {/* Stat bar — mirrors homepage hero-stats */}
                <div className="srv-hero-stats">
                    {([
                        { num: '4',    label: 'Service Areas' },
                        { num: '30+',  label: 'Years in Industry' },
                        { num: '100+', label: 'Active Workers' },
                        { num: 'PCAB', label: 'General "A" Licensed' },
                    ] as { num: string; label: string }[]).map((s, i, arr) => (
                        <div key={i} className="srv-stat-group">
                            <div className="srv-stat">
                                <div className="srv-stat-num">{s.num}</div>
                                <div className="srv-stat-label">{s.label}</div>
                            </div>
                            {i < arr.length - 1 && <div className="srv-stat-divider" />}
                        </div>
                    ))}
                </div>
            </section>

            {/* ── SERVICE SECTIONS ── */}
            {services.map((svc) => (
                <section
                    key={svc.n}
                    className={`srv-section ${svc.dark ? 'srv-section-dark' : 'srv-section-light'}`}
                >
                    <div className="srv-container">
                        <div className={`srv-content-grid${svc.reverse ? ' srv-reverse' : ''}`}>

                            {/* Text column */}
                            <div className="srv-text">
                                {/* Ghost service number */}
                                <span className="srv-ghost-num">
                                    {String(svc.n).padStart(2, '0')}
                                </span>

                                <div className="srv-label-row">
                                    <span className="srv-label">{svc.label}</span>
                                    <div className={`srv-rule${svc.dark ? '' : ' srv-rule-dark'}`} />
                                </div>

                                <h2 className={`srv-heading${svc.dark ? '' : ' srv-heading-dark'}`}>
                                    {svc.heading}
                                </h2>

                                {/* Red accent underline */}
                                <div className="srv-heading-rule" />

                                <ul className={`srv-list${svc.dark ? '' : ' srv-list-dark'}`}>
                                    {svc.items.map((item, i) => (
                                        <li key={i}>{item}</li>
                                    ))}
                                </ul>
                            </div>

                            {/* Media column */}
                            <div className="srv-image-box">
                                {svc.carousel ? (
                                    <>
                                        <Carousel images={svc.carousel} />
                                        <p className="srv-img-caption">{svc.caption}</p>
                                    </>
                                ) : svc.image ? (
                                    <div className={`srv-img-frame${svc.reverse ? ' srv-img-frame-right' : ''}`}>
                                        <img
                                            src={svc.image}
                                            alt={svc.imageAlt ?? ''}
                                            className="srv-main-img"
                                        />
                                        <div className="srv-img-accent-border" />
                                    </div>
                                ) : null}
                            </div>

                        </div>
                    </div>
                </section>
            ))}

            {/* ── MARQUEE STRIP ── */}
            <div className="srv-marquee-track" aria-hidden="true">
                <div className="srv-marquee-inner">
                    {[
                        'Civil Works', 'Electrical Systems', 'Architectural Design',
                        'Tower Erection', 'Waterproofing', 'Site Development',
                        'Structured Cabling', 'Drainage & Sewer', 'Roofing Works',
                        'Civil Works', 'Electrical Systems', 'Architectural Design',
                        'Tower Erection', 'Waterproofing', 'Site Development',
                    ].map((item, i) => (
                        <span key={i} className="srv-marquee-item">
                            {item}
                            <span className="srv-marquee-dot">·</span>
                        </span>
                    ))}
                </div>
            </div>

            {/* ── CONTACT (pixel-for-pixel match with App.tsx) ── */}
            <section className="contact-section" id="contact">
                <div className="contact-bg-image" />
                <div className="contact-bg-overlay" />
                <div className="contact-inner">
                    <p className="section-tag light" style={{ textAlign: 'center' }}>GET IN TOUCH</p>
                    <h2 className="contact-heading">Contact Us Today</h2>
                    <p className="contact-sub">
                        Let's bring your vision to life together. Reach out to discuss your next project.
                    </p>
                    <div className="contact-cards">
                        <div className="contact-card contact-card-wide">
                            <img src={emailIcon} alt="Email" className="contact-icon" />
                            <p className="contact-card-label">Email Us At</p>
                            <a href="mailto:pci051@yahoo.com" className="contact-card-value link">
                                pci051@yahoo.com
                            </a>
                            <p className="contact-card-note">We reply within 24 hours</p>
                        </div>
                        <div className="contact-card">
                            <img src={phoneIcon} alt="Phone" className="contact-icon" />
                            <p className="contact-card-label">Have Any Questions?</p>
                            <p className="contact-card-value">(046) 894-9518</p>
                        </div>
                        <div className="contact-card">
                            <img src={clockIcon} alt="Hours" className="contact-icon" />
                            <p className="contact-card-label">Working Hours</p>
                            <p className="contact-card-value">Mon – Sat<br />8:00 AM – 5:00 PM</p>
                        </div>
                    </div>
                </div>
            </section>

        </main>
    );
}