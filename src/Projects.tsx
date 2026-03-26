import './Projects.css';
import email from './email.png';
import phone from './phone.png';
import clock from './clock.png';
import proj1 from './proj1.png'
import proj2 from './proj2.png'
import proj3 from './proj3.png'
import proj4 from './proj4.png'
import proj5 from './proj5.png'
import proj6 from './proj6.png'
import proj7 from './proj7.png'
import proj8 from './proj8.png'
import proj9 from './proj9.png'
import proj10 from './proj10.png'
import proj11 from './proj11.png'
import proj12 from './proj12.png'

function Projects(){
    return(
        <main>
            <div className="proj-container1">
                <div className="proj-c1-images">
                    <div className="proj-c1-inner">
                    <img src={proj1} alt="" />
                    <img src={proj2} alt="" />
                    <img src={proj3} alt="" />
                </div>
                </div>
            </div>
            <div className="proj-container2">
                <div className="proj-c2-images">
                    <div className="proj-c2-inner">
                    <img src={proj4} alt="" />
                    <img src={proj5} alt="" />
                    <img src={proj6} alt="" />
                </div>
                </div>
            </div>
            <div className="proj-container3">
                <div className="proj-c3-images">
                    <div className="proj-c3-inner">
                    <img src={proj7} alt="" />
                    <img src={proj8} alt="" />
                    <img src={proj9} alt="" />
                </div>
                </div>
            </div>
            <div className="proj-container4">
                <div className="proj-c4-images">
                    <div className="proj-c4-inner">
                    <img src={proj10} alt="" />
                    <img src={proj11} alt="" />
                    <img src={proj12} alt="" />
                </div>
                </div>
            </div>
            <div className="proj-container5">
                <div className="proj-c5-inner">
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
    )
}

export default Projects;