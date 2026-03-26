import './Services.css';
import image1 from './serv-img1.png';
import image2 from './serv-img2.png';
import image3 from './serv-img3.png';
import image4 from './serv-img4.png';
import email from './email.png';
import phone from './phone.png';
import clock from './clock.png';

function Services(){
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
                    <img src={image2} alt="" />
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
                        <li>Building Construction and  Renovation</li>
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
                    <img src={image3} alt="" />
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
                <p>Let's bring your vision to life
                   together. Reach out to us to talk
                   about your next project.
                </p>
              </div>
              <div className="section2">
                <img src={email} alt="email icon"/>
                <a href="#">Pythagoras@gmail.com</a>
                <p>We Reply Within 24 Hours</p>
              </div>
              <div className="section3">
                <img src={phone} alt="phone icon"/>
                <h4>Have any questions?</h4>
                <p>(+63)912 123 1234</p>
              </div>
              <div className="section4">
                <img src={clock} alt="clock icon"/>
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