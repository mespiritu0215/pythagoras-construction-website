import { useState, useEffect } from "react";
import logo from './logo.png';
import abtproj1 from './aboutproject-img1.jpg';
import abtproj2 from './aboutproject-img2.jpg';
import abtproj3 from './aboutproject-img3.jpg';
import email from './email.png';
import phone from './phone.png';
import clock from './clock.png';
import logo1 from '../src/Clients/AMA.png'
import logo2 from '../src/Clients/Cebu Pac.png'
import logo3 from '../src/Clients/Nestle.png'
import logo4 from '../src/Clients/Gardenia.png'
import logo5 from '../src/Clients/Manila Water.png'
import logo6 from '../src/Clients/Globe.png'
import logo7 from '../src/Clients/Goldilocks.png'
import logo8 from '../src/Clients/Smart.png'
import logo9 from '../src/Clients/PLDT.png'
import './AboutUs.css';

function AboutUs() {
  const images = [abtproj1, abtproj2, abtproj3];
const [currentIndex, setCurrentIndex] = useState(0);

useEffect(() => {
  const interval = setInterval(() => {
    setCurrentIndex((prev) =>
      prev === images.length - 1 ? 0 : prev + 1
    );
  }, 3000);

  return () => clearInterval(interval);
}, []);

  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
  document.body.style.backgroundColor = "#FFFFFF"; // Your About Us color
  
  return () => {
    document.body.style.backgroundColor = "#D9CCCC";
  };
}, []);
  return (
    <div className="App">
      <main>
        <div className="abt-body-container1">
         <div className="abt-body-container1-inner">
           <div className="abt-body-logo">
            <img src={logo} alt="Pythagoras Logo"/>
          </div>
          <div className="abt-c1-container">
            <div className="abt-c1-description">
            <h1>CHANGING THE WORLD THROUGH BUILDING BETTER COMMUNITIES</h1>
          </div>
          <div className="abt-c1-description2">
            <p>
                Pythagoras Construction, Inc. is a SEC-registered general contracting firm established in 1993, 
                providing construction and allied maintenance services to government and private clients. 
                We offer comprehensive, client-focused solutions from planning and cost estimation to project execution and supervision,
                 delivered by a skilled administrative, technical, and operational team of over 100 construction workers. 
                 Formerly a single proprietorship, the company is now a PCAB-licensed corporation classified under General “A.”
            </p>
          </div>
          </div>
         </div>
        </div>
        <div className="abt-body-container2">
          <div className="abt-body-container2-inner">
            <div className="abt-c2-description">
              <div className="abt-c2-description-sec1">
              <div className="abt-mission">
                <h2>Our Mission</h2>
                <p>In order to attain our vision, we shall deliver quality and timely completed projects, 
                    strive for excellence in our project management and delivery, 
                    be innovative in our methods and processes to enhance productivity and cost effectiveness, 
                    and develop our employees to be team players who are result-oriented, innovative, and motivated.</p>
              </div>
              <div className="abt-vision">
                <h2>Our Vision</h2>
                <p>To be a globally competitive construction firm which is trusted by clients, 
                    suppliers and employees by exceeding their expectations, 
                    and where they are treated as business partners and family members.</p>
              </div>
              <div className="abt-values">
                <h2>Core Values</h2>
                <p>We are committed to conducting business with integrity, excellence, trustworthiness, innovation, 
                    and adherence to the law and safety protocols.</p>
              </div>
              </div>
              <div className="abt-projects-window">
              <div className="abt-slider">
                <div
                  className="abt-slider-track"
                  style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                >
                  {images.map((img, index) => (
                    <img key={index} src={img} alt="Project View" />
                  ))}
                </div>
              </div>

              <div className="abt-projects-overlay">
                <div className="abt-projects-btn">
                  <h2>Our Projects</h2>
                </div>
                <div className="abt-visit-btn">
                  <h2>Visit</h2>
                </div>
              </div>
            </div>
            </div>
          </div>
        </div>
        <div className="abt-body-container4">
          <div className="abt-body-container4-inner">
            <div className="abt-c4-desc">
              <div className="abt-c4-integrity">
              <h2>INTEGRITY</h2>
              <p>We conduct business with honesty, transparency, and accountability, 
                building long-term relationships based on trust and respect.</p>
            </div>
            <div className="abt-c4-innovate">
              <h2>INNOVATE</h2>
              <p>We apply modern methods, smart technologies, and efficient processes to deliver better results, 
                faster execution, and cost-effective solutions for every project.</p>
            </div>
            <div className="abt-c4-excellency">
              <h2>EXCELLENCY</h2>
              <p>We are committed to the highest standards in planning, project management, and construction, 
                ensuring quality workmanship and reliable project delivery.</p>
            </div>
            <div className="abt-c4-trustworthiness">
              <h2>TRUSTWORTHINESS</h2>
              <p>Our clients rely on us for consistency, reliability, and professionalism, 
                knowing that we deliver on our commitments every time.</p>
            </div>
            </div>
            <div className="abt-c4-desc2">
              <p>Trusted by 20+ companies nationwide</p>
            </div>
            <div className="abt-c4-icons">
              <img src={logo1} alt="" style={{height:'45px',width:'130px'}} /> 
              <img src={logo2} alt="" style={{height:'80px', width:'110px'}}/>
              <img src={logo3} alt="" style={{width:'110px'}}/>
              <img src={logo4} alt="" style={{height:'60px', width:'110px'}}/>
              <img src={logo5} alt="" style={{height:'60px', width:'110px'}}/>
              <img src={logo6} alt="" style={{height:'45px', width:'110px'}}/>
              <img src={logo7} alt="" style={{height:'60px', width:'60px'}}/>
              <img src={logo8} alt="" style={{height:'40px', width:'110px'}}/>
              <img src={logo9} alt="" style={{height:'80px', width:'120px'}}/>
            </div>
          </div>
        </div>
        <div className="abt-body-container5">
          <div className="abt-body-container5-inner">
            <div className="abt-c5-contact">
              <div className="abt-section1">
                <h3>Contact us today</h3>
                <p>Let's bring your vision to life
                   together. Reach out to us to talk
                   about your next project.
                </p>
              </div>
              <div className="abt-section2">
                <img src={email} alt="email icon"/>
                <a href="#">Pythagoras@gmail.com</a>
                <p>We Reply Within 24 Hours</p>
              </div>
              <div className="abt-section3">
                <img src={phone} alt="abt-phone icon"/>
                <h4>Have any questions?</h4>
                <p>(+63)912 123 1234</p>
              </div>
              <div className="abt-section4">
                <img src={clock} alt="clock icon"/>
                <h4>Working hours</h4>
                <p>Mon to Sat 8:00AM - 5:00PM</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
  
}

export default AboutUs;

