import { useState, useEffect } from "react";
import logo from './logo.png';
import abtproj1 from './aboutproject-img1.jpg';
import abtproj2 from './aboutproject-img2.jpg';
import abtproj4 from './pyth5.jpg';
import email from './email.png';
import phone from './phone.png';
import clock from './clock.png';
import background from './background.png';
import logo1 from '../src/Clients/AMA.png'
import logo2 from '../src/Clients/Cebu Pac.png'
import logo3 from '../src/Clients/Nestle.png'
import logo4 from '../src/Clients/Gardenia.png'
import logo5 from '../src/Clients/Manila Water.png'
import logo6 from '../src/Clients/Globe.png'
import logo7 from '../src/Clients/Goldilocks.png'
import logo8 from '../src/Clients/Smart.png'
import logo9 from '../src/Clients/PLDT.png'
import { color } from "framer-motion";

function AboutUs() {
  const images = [abtproj1, abtproj2, abtproj4];
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
                <span className="text-color">Pythagoras Construction, Inc.</span> is a SEC-registered general contracting firm established in 1993, 
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
              <a href="#"><button className="see-more-button">See More</button>
              </a>
            </div>
            {/*<div className="abt-c4-icons"> 
              <img src={logo1} alt="" style={{height:'45px',width:'130px'}} /> 
              <img src={logo2} alt="" style={{height:'80px', width:'110px'}}/>
              <img src={logo3} alt="" style={{width:'110px'}}/>
              <img src={logo4} alt="" style={{height:'60px', width:'110px'}}/>
              <img src={logo5} alt="" style={{height:'60px', width:'110px'}}/>
              <img src={logo6} alt="" style={{height:'45px', width:'110px'}}/>
              <img src={logo7} alt="" style={{height:'60px', width:'60px'}}/>
              <img src={logo8} alt="" style={{height:'40px', width:'110px'}}/>
              <img src={logo9} alt="" style={{height:'80px', width:'120px'}}/>
            </div> */}
          </div>
        </div>
        <div className="abt-body-container5">
          <div className="abt-body-container5-inner">
            <div className="abt-c5-contact">
              <div className="abt-section1">
                <h3>Contact us today</h3>
                <p>Let's bring your vision to life
                   together.
                </p>
              </div>
              <div className="abt-section2">
                <img src={email} alt="email icon"/>
                <a href="mailto:pci051@yahoo.com">pci051@yahoo.com</a>
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
        <style>{`
          *{
        font-family: 'open-sans', sans-serif;
      }

      body{
        position: relative; /* Establishes a positioning context for the pseudo-element */
        min-height: 100vh; /* Ensures the body fills at least the full viewport height */
        margin: 0; /* Optional: removes default body margins */
        height: 150vh;
      }

      body::before {
        content: ""; /* Required for pseudo-elements to render */
        background-image: url(${background}); /* Set your background image here */
        background-position: 50% 67%;
        position: absolute; /* Positions the pseudo-element relative to the body */
        top: 0;
        right: 0;
        bottom: 0;
        left: 0; /* These four properties make the pseudo-element cover the entire body */
        opacity: 0.40; /* Adjust the opacity value (0.0 for fully transparent to 1.0 for fully opaque) */
        z-index: -1; /* Sends the pseudo-element behind the body's actual content */
        background-size: cover; /* Optional: ensures the image covers the entire area */
        height: 50%;
        border-radius: 0px 0px 100px 100px;
      }

      .text-color{
        color:#920000;
        font-family: 'Open Sans', sans-serif !important;
      }

      .abt-body-container1{
        height: 400px;
        width: 90%;
        max-width: 1000px;
        background-color: #fefbf2b7;
        margin: auto;
        margin-top: 150px;
        box-shadow: 3px 4px 10px 4px #00000099;
        border-radius: 40px;
      }

      .abt-body-logo{
        z-index: 10;
        opacity: 100 !important;
      }

      .abt-body-logo img{
        margin-top: -33px;
        opacity: 100 !important;
        width: 120px;
        height: 70px;
      }

      .abt-c1-container{
          display: flex;
          flex-direction: row;
          margin: 8% 0px 8% 0px;
      }

      .abt-c1-description{
          display: flex;
          justify-content: center;
          align-items: flex-start;
          padding-left: 50px;
          width: 70%;
      }

      .abt-c1-description2{
          display: flex;
          width: 100%;
          padding-right: 50px;
          padding-left: 20px;
          padding-right: 100px;
          align-items: flex-start;
          margin-top: -30px;
      }

      .abt-c1-description h1{
        font-size: 34px;
        font-weight: 800;
        color: #920000;
        text-align: right;
        margin: 0;
      }

      .abt-c1-description2 p{
        font-size: 18px;
        color: #000000;
        text-align: left;
        margin: 0;
      }

      .abt-body-container2{
        margin-top: 100px;
      }

      .abt-body-container2-inner{
        display: flex;
        flex-direction: row;
        content: " ";
        background-color: #D9CCCC;
        height: 900px;
        opacity: 90;
      }

      .abt-c2-description{
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        gap: 0px;
      }

      .abt-c2-description-sec1{
          display: flex;
          flex-direction: column;
          width: 50%;
          height:100%;
          margin-right: -100px;
          align-items: flex-start;
          justify-content: center;
      }

      .abt-mission, .abt-vision, .abt-values{
          background-color: #FEFBF2;
          width: 60%;
          height: 23%;
          border-radius: 25px;
          margin: 10px;
          padding: 0px 20px 0px 20px;
          box-shadow: 3px 4px 10px 4px #00000099;
      }

      .abt-mission h2, .abt-vision h2, .abt-values h2{
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: #920000;
          color: #FEFBF2;
          width: 40%;
          height: 24%;
          border-radius: 10px;
          font-size: 24px;
      }

      .abt-mission p, .abt-vision p, .abt-values p{
        font-size: 17px;
        text-align: left;
      }

      .abt-mission p{
        margin: 0;
        font-size: 15px;
      }

      .abt-mission h2{
        margin-bottom: 2px;
      }

      .abt-vision{
          background-color: #920000;
          margin-top:0px;
      }

      .abt-vision h2{
          background-color: #FEFBF2;
          color: #920000;
      }

      .abt-vision p{
        color: #FFFFFF;
      }

      .abt-values{
          background-color: #FEFBF2;
          margin-top:0px;
      }

      .abt-values h2{
          background-color: #920000;
          color: #FEFBF2;
      }

      /* The parent container MUST be relative */
      .abt-projects-window {
        position: relative;
        width: 30%;
        margin-left: -100px;
      }

      .abt-projects-window img {
        width: 100%;
        height: auto;
        display: block;
        border-radius: 20px; /* Matching the rounded corners in your image */
      }

      /* 3. The Overlay Container */
      /* The overlay container spans the full image area */
      .abt-projects-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        padding: 20px; /* Space from the edges of the image */
        display: flex;
        justify-content: space-between; /* Pushes one left, one right */
        box-sizing: border-box; /* Ensures padding doesn't break the width */
      }

      .abt-slider {
        overflow: hidden;
        width: 100% !important;
        border-radius: 20px;
        box-shadow: 0px 0px 10px 4px #0000009d;
      }

      .abt-slider-track {
        display: flex;
        transition: transform 0.5s ease-in-out;
        width: 650px;
        max-width: 650px;
        max-height: 591px;
      }

      .abt-slider-track img {
        width: 100%;
        flex-shrink: 0;
        border-radius: 20px;
        object-fit: cover;
        object-position: 140%;
      }

      /* "Our Projects" Button Style */
      .abt-projects-btn {
        background-color: #FEFBF2;
        padding: 10px 20px;
        border-radius: 8px;
        box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.3);
      }

      .abt-projects-btn h2 {
        color: #920000;
        font-size: 20px;
        margin: 0;
        font-weight: 700;
      }

      /* "Visit" Button Style */
      .abt-visit-btn {
        background-color: #920000;
        padding: 10px 40px; /* Wider padding for the 'Visit' button */
        border-radius: 8px;
        box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.3);
        cursor: pointer;
        transition: background-color 0.3s;
      }

      .abt-visit-btn:hover {
        background-color: #700000;
      }

      .abt-visit-btn h2 {
        color: #FEFBF2;
        font-size: 20px;
        margin: 0;
        font-weight: 700;
      }

      .abt-projects{
        position: relative;
      }

      /* 3. Style your text and links (Cleaned up) */
      .tag p {
        background-color: #FEFBF2;
        color: #920000;
        font-size: 16px;
        width: 150px;
        height: 40px;
        display: flex; /* Use flex for centering text */
        justify-content: center;
        align-items: center;
        margin: 0; /* Remove that negative margin */
      }

      .tag a {
        background-color: #920000;
        color: #FEFBF2;
        text-decoration: none;
        font-size: 16px;
        width: 150px;
        height: 40px;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .abt-body-container4-inner{
        content: " ";
        height: 900px;
        opacity: 90;
        display: flex;
        flex-direction: column;
        justify-content: center;
      }
      .abt-c4-desc{
        display: flex;
        flex-direction: row;
        background-color: #920000;
        color: #FEFBF2;
        padding: 40px 100px 40px 100px;
        gap: 80px;
        border-radius: 70px 70px 0 0;
      }

      .abt-c4-desc2{
        background-color: #FEFBF2;
        color: #920000;
        margin-top: 0;
      }

      .abt-c4-icons{
        background-color: #FEFBF2;
        border-radius: 0 0 70px 70px;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        gap: 45px;
        padding: 20px;
      }


      .abt-body-container5-inner {
        /* Remove background properties from here */
        /* background-image: url(...)  <-- DELETE */
        /* background-size: cover;     <-- DELETE */

        position: relative; /* Crucial for containing the pseudo-element */
        z-index: 1; /* Ensure content sits above the background */
        overflow: hidden; /* Ensures blurry edges don't escape */

        width: 100%;
        padding: 50px 0;
        display: flex;
        justify-content: center;
        margin-top: 50px;
      }

      .abt-body-container5-inner::before {
        content: ""; /* Necessary to create the pseudo-element */
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: -1; /* Places it behind the actual content */

        /* Apply image and opacity HERE */
        background-image: url(${background}); /* Or use inline styles if in React */
        background-size: cover;
        background-position: 50% 67%;
        background-repeat: no-repeat;
        border-radius: 100px 100px 0px 0px;

        opacity: 0.4; /* CHANGE THIS VALUE: 0.0 is invisible, 1.0 is full strength */
      }

      .abt-c5-contact{
        display: grid;
          grid-template-columns: repeat(4, minmax(0, 220px));
          gap: 16px;
          justify-content: center;
          margin: 52px auto 0;
          padding: 0 8px;
      }

      .abt-section1, .abt-section2, .abt-section3, .abt-section4{
            background: rgba(254, 251, 242, 0.92);
          backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);
          padding: 22px 14px;
          border-radius: 14px;
          box-shadow: 0 4px 14px rgba(146, 0, 0, 0.18);
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 5px;
      }


      .abt-section1 h3{
        font-size: clamp(13px, 2vw, 15px);
          color: #920000;
          font-weight: 700;
          margin: 0;
          font-family: 'Montserrat', sans-serif;
      }

      .abt-section1 p{
        font-size: clamp(11px, 1.8vw, 13px);
          color: #555;
          margin: 0;
      }

      .abt-section2 img, .abt-section3 img, .abt-section4 img{
        width: 34px;
          height: 34px;
          object-fit: contain;
          margin-bottom: 4px;
      }

      .abt-section2 h4{
        font-size: clamp(13px, 2vw, 15px);
          color: #920000;
          font-weight: 700;
          margin: 0;
      }

      .abt-section2 a{
        font-size: clamp(11px, 1.8vw, 13px);
          color: #920000 !important;
          text-decoration: none;
          font-weight: 600;
          word-break: break-all;
          font-family: 'open-sans', sans-serif;
      }

      .abt-section2 p{
        font-size: clamp(11px, 1.8vw, 13px);
          color: #555;
          margin: 0;
      }

      .abt-c5-contact .abt-section2 a{
        color: #000000;
        text-decoration: underline;
      }


      .abt-section3 h4, .abt-section4 h4{
        font-size: clamp(13px, 2vw, 15px);
          color: #920000;
          font-weight: 700;
          margin: 0;
      }

      .abt-section3 p, .abt-section4 p{
        font-size: clamp(11px, 1.8vw, 13px);
          color: #555;
          margin: 0;
      }
      .see-more-button{
        background-color: #920000;
        color: #FEFBF2;
        border: none;
        font-family: "open-sans", sans-serif;
        font-size: 16px;
        margin-bottom: 20px;
        padding: 10px;
        border-radius: 10px;
        transition: all ease-in-out 0.2ms;
        }
        .see-more-button:hover{
          transition: all ease-in-out 0.2ms;
          transform: scale(1.23);
          background-color: #ffffff;
          color: #920000;
          
        }


      /* MOBILE */
      @media (max-width: 1440px){
        .abt-mission p{
          font-size: 14px;
        }
        .abt-vision p{
          font-size: 15px;
        }
        .abt-body-container2-inner{
          margin-bottom: 0px;
        }
        .abt-body-container4-inner{
          height: 500px !important;
        }
        .abt-c4-desc2{
        border-radius: 0px 0px 70px 70px; 
        }
        .abt-slider-track img:nth-child(3) {
          transform: translateX(-100px); /* Adjust pixels to move it up further */
        }
      }
      @media(max-width:1120px){
        .abt-c1-description h1{
          font-size: 32px !important;
        }
        .abt-c2-description{
          gap: 150px !important;
        }
        .abt-mission, .abt-vision, .abt-values{
          width: 70%;
        }
      .abt-mission h2, .abt-vision h2, .abt-values h2{
        font-size: 20px !important;
        width: 50%;
      }
      .abt-mission p{
        font-size: 13px !important;
      }
      .abt-vision p, .abt-values p{
        font-size:15px !important;
      }
      .abt-projects-window{
        width: 40%;
      }
      .abt-body-container4-inner{
        justify-content: flex-start;
      }
      .abt-c4-desc{
        padding: 20px 60px 20px 60px;
        margin-top: 50px;
      }
      .abt-c4-integrity h2, .abt-c4-innovate h2, .abt-c4-excellency h2, .abt-c4-trustworthiness h2{
        font-size: 16px;
      }
      .abt-c4-integrity p, .abt-c4-innovate p, .abt-c4-excellency p, .abt-c4-trustworthiness p{
        font-size:14px;
      }
      .abt-body-container4-inner{
        height: 350px;
      }

      .abt-c5-contact{
        gap:40px;
        justify-items: center;
        margin-left: 20px;
      }

      .abt-section1{
        height: 150px;
        width: 230px;
        margin-left: 0px;
      }

      .abt-section1 h3{
        font-size:20px;
      }

      .abt-section1 p{
        font-size:14px;
      }

      .abt-section2, .abt-section3, .abt-section4{
        height: 150px;
        width: 180px;
      }

      .abt-section2 img, .abt-section3 img, .abt-section4 img{
        height: 40px;
        width: 40px;
      }

      .abt-section2 a{
        font-size: 14px;
        padding-bottom: 10px;
      }

      .abt-section3 h4, .abt-section4 h4{
      margin-bottom: 0px; 
      font-size: 18px;
      font-weight: 500;
      }

      .abt-section3 p, .abt-section4 p{
      font-size: 16px; 
      }

      .footer-add, .footer-phone, .footer-email{
        font-size: 14px;
      }
      }

      @media (max-width:768px){
        .abt-c1-description2 p{
          font-size: 15px;
        }
        .abt-c2-description{
          flex-direction: column;
          align-items: flex-start;
          gap: 15px !important;
          margin-top: 60px;
          width: 100%;
        }
        .abt-c2-description-sec1{
          flex-direction: row;
          gap: 0px;
          margin-top: 0px;
          height: 41%;
          width: 100%;
        }
        .abt-mission, .abt-vision, .abt-values{
          height: 100%;
          width: 485px;
          margin-top: 0px;
        }
        .abt-mission h2, .abt-vision h2, .abt-values h2{
          width: 80%;
          height: 10%;
          font-size: 18px !important;
        }
        .abt-mission p, .abt-vision p, .abt-values p{
          font-size: 15px !important;
          text-align: left;
        }
        .abt-mission p{
          margin-top: 15px;
        }
        .abt-vision p{
          font-size:17px !important;
        }
        .abt-values p{
          font-size: 19px !important;
        }
        .abt-slider{
          width: 100%;
        }
        .abt-slider-track {
          width: 100%; 
          display: flex;
          transform: translateX(-${currentIndex * 107}%) !important;
        }
        .abt-projects-window {
          width: 90%; 
          margin: 20px auto; /* Centers it and removes that 15px left margin */
          overflow: hidden;
          position: relative; /* Keeps the 'Visit' button contained */
          margin-left: 40px;
          margin-right: 40px;
          margin-bottom: 60px;
          border-radius: 25px;
        }
        .abt-projects-window img {
          width: 695px;
          height: auto;
          object-fit: fill;
          border-radius: 10px; /* Optional: matches your card style */
          object-position: 500% !important;
        }
        .abt-slider-track img:nth-child(1) {
          transform: translateY(-85px); /* Adjust pixels to move it up further */
        }
        .abt-slider-track img:nth-child(2) {
          transform: translateY(-85px); /* Adjust pixels to move it up further */
        }
        .abt-slider-track img:nth-child(3) {
          transform: translateY(-85px); /* Adjust pixels to move it up further */
        }
        .visit-btn { 
          right: 15px !important;
          top: 15px !important;
          padding: 5px 20px;
          font-size: 14px;
        }
        .abt-body-container2-inner{
          margin-bottom: 50px;
        }
        .abt-c4-desc{
          gap:30px;
          text-align: center;
        }
        body::before{
          height: 40%;
          border-radius: 0px 0px 50px 50px;
        }
        .abt-body-container5-inner::before{
          border-radius: 25px 25px 0px 0px;
          height: 100%;
          margin-top: 0px;
        }
          
        .abt-section1 {
          height: 90%;
          width: 90%;
          margin-left: 10px;
          margin-right: 10px;
          padding: 0px;
        }
        .abt-section1 h3{
          font-size: 16px;
          padding-top: 10px;
        }
        .abt-section1 p{
          font-size: 12px;
          padding-left:20px;
          padding-right:20px;
          padding-bottom: 10px;
        }
        .abt-section2, .abt-section3, .abt-section4{
          height: 90%;
          width: 90%;
        }  
        .abt-section2 img, .abt-section3 img, .abt-section4 img{
          height: 30px;
          width: 30px;
        }
        .abt-c5-contact{
          gap:10px;
        }
        .abt-section2 a{
          font-size: 12px;
          padding-bottom: 0px;
        }
        .abt-section2 p,.abt-section3 p,.abt-section4 p{
          font-size:12px;
          margin-top: 6px;
        }
        .abt-section3 h4, .abt-section4 h4{
          font-size: 15px;
        }
        .abt-section4{
          margin-right: 10px;
        }
        .footer-left p{
          font-size:13px;
        }
        .footer-add, .footer-phone, .footer-email{
          font-size:12px;
        }
        .footer-final p{
          font-size:13px;
        }
      }
        `}</style>
      </main>
    </div>
  );
  
}

export default AboutUs;

