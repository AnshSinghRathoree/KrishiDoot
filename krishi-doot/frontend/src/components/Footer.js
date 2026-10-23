import { Link } from "react-router-dom"
import {
  FaLeaf, FaEnvelope, FaMapMarkerAlt,
  FaFacebook, FaTwitter, FaInstagram
} from "react-icons/fa"

const Footer = () => (
  <footer className="kd-footer">
    <div className="kd-footer-photo">
      <h2>Growing a greener, smarter future.</h2>
    </div>
    <div className="kd-footer-inner">
      <div className="kd-footer-grid">
        <section>
          <Link to="/" className="kd-footer-brand">
            <FaLeaf aria-hidden="true" />
            <span>KrishiDoot</span>
          </Link>
          <p>
            Practical, data-informed tools to help farmers make confident crop
            and fertilizer decisions while caring for the land.
          </p>
          <div className="kd-footer-socials" aria-label="Social media">
            <a href="https://facebook.com" aria-label="Facebook" target="_blank" rel="noreferrer"><FaFacebook /></a>
            <a href="https://twitter.com" aria-label="Twitter" target="_blank" rel="noreferrer"><FaTwitter /></a>
            <a href="https://instagram.com" aria-label="Instagram" target="_blank" rel="noreferrer"><FaInstagram /></a>
          </div>
        </section>
        <section>
          <h3>Explore</h3>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/predict">Crop recommendation</Link></li>
            <li><Link to="/fertilizer-advisor">Fertilizer advisor</Link></li>
            <li><Link to="/dashboard">Dashboard</Link></li>
            <li><Link to="/about">About us</Link></li>
          </ul>
        </section>
        <section>
          <h3>Our approach</h3>
          <ul>
            <li><a href="#sustainable-farming">Sustainable farming</a></li>
            <li><a href="#smart-agriculture">Smart agriculture</a></li>
            <li><a href="#soil-health">Soil health</a></li>
          </ul>
          <p>Use recommendations alongside local expertise and current field conditions.</p>
        </section>
        <section>
          <h3>Get in touch</h3>
          <div className="kd-contact-line"><FaEnvelope /><a href="mailto:hello@krishidoot.example">hello@krishidoot.example</a></div>
          <div className="kd-contact-line"><FaMapMarkerAlt /><span>Built for farming communities</span></div>
        </section>
      </div>
      <div className="kd-footer-bottom">
        <p>© {new Date().getFullYear()} KrishiDoot. Made for a greener tomorrow.</p>
        <p>Grow with knowledge. Harvest with confidence.</p>
      </div>
    </div>
  </footer>
)

export default Footer
