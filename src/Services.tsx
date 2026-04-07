import { useState, useEffect, useRef } from 'react';
import './Services.css';
import image1 from './serv-img1.png';
import image4 from './serv-img4.png';
import email from './email.png';
import phone from './phone.png';
import clock from './clock.png';

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
import GlobeBaliuag13 from "./CompletedProjects/GlobeBaliuag/GlobeBaliuag13.png";
import GlobeBaliuag14 from "./CompletedProjects/GlobeBaliuag/GlobeBaliuag14.png";
import GlobeBaliuag15 from "./CompletedProjects/GlobeBaliuag/GlobeBaliuag15.png";
import GlobeBaliuag16 from "./CompletedProjects/GlobeBaliuag/GlobeBaliuag16.png";
import GlobeBaliuag17 from "./CompletedProjects/GlobeBaliuag/GlobeBaliuag17.png";
import GlobeBaliuag18 from "./CompletedProjects/GlobeBaliuag/GlobeBaliuag18.png";

const globeBaliuagImages: string[] = [
    GlobeBaliuag1, GlobeBaliuag2, GlobeBaliuag3, GlobeBaliuag4, GlobeBaliuag5,
    GlobeBaliuag6, GlobeBaliuag7, GlobeBaliuag8, GlobeBaliuag9, GlobeBaliuag10,
    GlobeBaliuag11, GlobeBaliuag12, GlobeBaliuag13, GlobeBaliuag14, GlobeBaliuag15,
    GlobeBaliuag16, GlobeBaliuag17, GlobeBaliuag18,
];

const gaisanoMactanImages: string[] = [
    GaisanoMactanSmart1, GaisanoMactanSmart2, GaisanoMactanSmart3, GaisanoMactanSmart4,
    GaisanoMactanSmart5, GaisanoMactanSmart6, GaisanoMactanSmart7, GaisanoMactanSmart8,
    GaisanoMactanSmart9, GaisanoMactanSmart10, GaisanoMactanSmart11, GaisanoMactanSmart12,
];

interface CarouselProps {
    images: string[];
}

function Carousel({ images }: CarouselProps) {
    const [current, setCurrent] = useState<number>(0);
    const [hovered, setHovered] = useState<boolean>(false);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    useEffect(() => {
        if (hovered) {
            intervalRef.current = setInterval(() => {
                setCurrent((c) => (c + 1) % images.length);
            }, 1000);
        } else {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        }
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [hovered, images.length]);

    return (
        <div
            className="carousel"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <img src={images[current]} alt={`Slide ${current + 1}`} className="carousel-img" />
            <div className="carousel-dots">
                {images.map((_, i) => (
                    <span
                        key={i}
                        className={`carousel-dot${i === current ? ' active' : ''}`}
                        onClick={() => setCurrent(i)}
                    />
                ))}
            </div>
        </div>
    );
}

function Services() {
    return (
        <main>
            <div className="services-container1">
                <div className="services-c1-inner">
                    <div className="c1-civil">
                        <h2>Civil Works</h2>
                        <ul>
                            <li>New Construction</li>
                            <li>Tower Erection & Dismantling</li>
                            <li>Renovation</li>
                            <li>Waterproofing Works</li>
                            <li>Slope protection / Rip Rapping</li>
                            <li>Plumbing and Pipefitting / laying</li>
                            <li>Drilling</li>
                            <li>Metal Works</li>
                            <li>Roofing Works</li>
                            <li>Painting and Finishing</li>
                            <li>Carpentry</li>
                            <li>Tiling, Stones, Masonry</li>
                            <li>Glass / Glazing and Accessories</li>
                            <li>Windows and Doors</li>
                        </ul>
                    </div>
                    <div className="c1-image">
                        <img src={image1} alt="" />
                    </div>
                </div>
            </div>

            <div className="services-container2">
                <div className="services-c2-inner">
                    <div className="c2-image">
                        <Carousel images={globeBaliuagImages} />
                    </div>
                    <div className="c2-electrical">
                        <h2>Electrical Works</h2>
                        <ul>
                            <li>Lighting Fixtures</li>
                            <li>Wiring Devices</li>
                            <li>Environmental Alarm System</li>
                            <li>Digital Transfer Switch</li>
                            <li>Fencing Works</li>
                            <li>Access Roads</li>
                            <li>Store Outlets</li>
                            <li>Tower Erection & Dismantling</li>
                            <li>Structured Cabling</li>
                            <li>Manual Transfer Switch</li>
                            <li>Water Heater</li>
                            <li>Electrical Conduits and Boxes</li>
                            <li>Wires and Cables</li>
                            <li>Conduits (IMC, RSC, EMT and PVC)</li>
                            <li>Access Control System</li>
                            <li>Pole Mounted Distribution Transformers</li>
                            <li>Panel Boards and Circuit Breakers</li>
                            <li>Transient Voltage Surge Suppressor</li>
                            <li>Generators and Automatic Transfer Switch</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="services-container3">
                <div className="services-c3-inner">
                    <div className="c3-end">
                        <h2>Our End Products</h2>
                        <ul>
                            <li>Building Construction and Renovation</li>
                            <li>School Buildings Residential Buildings</li>
                            <li>Office / Business Center</li>
                            <li>Commercial & Industrial Building Warehouses</li>
                            <li>Installation / Rehabilitation of Genset and ATS</li>
                            <li>Installation of Submersible Pumps</li>
                            <li>Plant Improvements</li>
                            <li>Provision of Grounding System</li>
                            <li>Rehabilitation / Reconfiguration of Cabins, Hub Offices and Radio Rooms</li>
                            <li>Sewer and Drainage Lines (Excavation and Pipe Laying)</li>
                            <li>Shed / Waiting Shed</li>
                            <li>Site Development and Physical Improvements</li>
                            <li>Retaining Walls</li>
                            <li>Fencing Works</li>
                            <li>Access Roads</li>
                            <li>Store Outlets</li>
                            <li>Tower Erection & Dismantling</li>
                        </ul>
                    </div>
                    <div className="c3-image">
                        <Carousel images={gaisanoMactanImages} />
                    </div>
                </div>
            </div>

            <div className="services-container4">
                <div className="services-c4-inner">
                    <div className="c4-image">
                        <img src={image4} alt="" />
                    </div>
                    <div className="c4-architectural">
                        <h2>Architectural & Design Works</h2>
                        <ul>
                            <li>Schematic Design</li>
                            <li>3D Modelling</li>
                            <li>Rendered Works for Client Presentation</li>
                            <li>Rendered Walkthrough (raw)</li>
                            <li>Design Development</li>
                            <li>Drawing Plans</li>
                            <li>Technical Details</li>
                            <li>Contract Documents</li>
                            <li>Technical Specifications</li>
                            <li>Working Drawings</li>
                            <li>As-built Plans</li>
                            <li>Site Supervision</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="body-container5">
                <div className="body-container5-inner">
                    <div className="c5-contact">
                        <div className="section1">
                            <h3>Contact us today</h3>
                            <p>Let's bring your vision to life together. Reach out to us to talk about your next project.</p>
                        </div>
                        <div className="section2">
                            <img src={email} alt="email icon" />
                            <a href="#">Pythagoras@gmail.com</a>
                            <p>We Reply Within 24 Hours</p>
                        </div>
                        <div className="section3">
                            <img src={phone} alt="phone icon" />
                            <h4>Have any questions?</h4>
                            <p>(+63)912 123 1234</p>
                        </div>
                        <div className="section4">
                            <img src={clock} alt="clock icon" />
                            <h4>Working hours</h4>
                            <p>Mon to Sat 8:00AM - 5:00PM</p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default Services;