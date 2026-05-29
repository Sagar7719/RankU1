import "./footer.css";
import { Link } from "react-router-dom";
import { FaInstagram, FaTelegramPlane, FaYoutube, FaApple, FaGooglePlay } from "react-icons/fa";
import { BsChatDots } from "react-icons/bs";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">

        {/* LEFT SECTION */}
        <div className="footer-left">
          <h2 className="logo">RankU1</h2>
          <p className="desc">
            Premium Government Exam Preparation
          </p>

          <p className="info">
            Talathi → SSC → Railway → Banking → Police → Defence →
            State PCS. Real exam UI mock tests, instant result, rank &
            detailed review.
          </p>

          {/* SOCIAL ICONS */}
          <div className="social-icons">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-icon instagram" title="Instagram">
              <FaInstagram />
            </a>
            <a href="https://telegram.org" target="_blank" rel="noopener noreferrer" className="social-icon telegram" title="Telegram">
              <FaTelegramPlane />
            </a>
            <a href="https://wa.me" target="_blank" rel="noopener noreferrer" className="social-icon chat" title="Chat Support">
              <BsChatDots />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="social-icon youtube" title="YouTube">
              <FaYoutube />
            </a>
          </div>

          <p><span>Email:</span> support@ranku1.com</p>
          <p><span>Support:</span> +91-7058293263</p>

          {/* APP BUTTONS */}
          <div className="app-buttons">
            <a href="https://play.google.com/store" target="_blank" rel="noopener noreferrer" className="app-badge-btn">
              <FaGooglePlay className="app-icon" />
              <div className="app-text">
                <span className="app-sub">GET IT ON</span>
                <span className="app-main">Google Play</span>
              </div>
            </a>
            <a href="https://apps.apple.com" target="_blank" rel="noopener noreferrer" className="app-badge-btn">
              <FaApple className="app-icon" />
              <div className="app-text">
                <span className="app-sub">Download on the</span>
                <span className="app-main">App Store</span>
              </div>
            </a>
          </div>
        </div>

        {/* LINKS */}
        <div className="footer-links">
          <div>
            <h4>PLATFORM</h4>
            <Link to="/test-series">Test Series</Link>
            <Link to="/updates">Exam Updates</Link>
            <Link to="/dashboard">Score Calculator</Link>
            <Link to="/exam">Exam Roadmap</Link>
          </div>

          <div>
            <h4>POPULAR EXAMS</h4>
            <Link to="/exam" state={{ search: "Talathi" }}>Talathi</Link>
            <Link to="/exam" state={{ search: "SSC" }}>SSC CGL / CHSL</Link>
            <Link to="/exam" state={{ search: "Railway" }}>Railway / RRB</Link>
            <Link to="/exam" state={{ search: "Banking" }}>Banking</Link>
            <Link to="/exam" state={{ search: "Police" }}>Police / Defence</Link>
          </div>

          <div>
            <h4>COMPANY</h4>
            <Link to="/info/about-us">About Us</Link>
            <Link to="/info/contact-us">Contact Us</Link>
            <Link to="/info/careers">Careers</Link>
            <Link to="/info/privacy-policy">Privacy Policy</Link>
            <Link to="/info/terms-conditions">Terms & Conditions</Link>
            <Link to="/info/refund-policy">Refund Policy</Link>
            <Link to="/info/shipping-policy">Shipping Policy</Link>
          </div>
        </div>
      </div>

      {/* BOTTOM */}
      <div className="footer-bottom">
        <p>© 2026 RankU1 – All Rights Reserved. | Maharashtra, India</p>
        <div className="footer-bottom-links">
          <Link to="/login">Login</Link>
          <span> | </span>
          <Link to="/register">Register</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;