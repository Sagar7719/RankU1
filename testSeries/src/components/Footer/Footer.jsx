import "./footer.css";
import { Link } from "react-router-dom";
import { FaInstagram, FaTelegramPlane, FaYoutube } from "react-icons/fa";
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
            <FaInstagram />
            <FaTelegramPlane />
            <BsChatDots />
            <FaYoutube />
          </div>

          <p><span>Email:</span> support@ranku1.com</p>
          <p><span>Support:</span> +91-8669301878</p>

          {/* APP BUTTONS */}
          <div className="app-buttons">
            <img src="/playstore.png" alt="playstore" />
            <img src="/appstore.png" alt="appstore" />
          </div>
        </div>

        {/* LINKS */}
        <div className="footer-links">
          <div>
            <h4>PLATFORM</h4>
            <Link to="#">Test Series</Link>
            <Link to="#">Exam Updates</Link>
            <Link to="#">Score Calculator</Link>
            <Link to="#">Exam Roadmap</Link>
          </div>

          <div>
            <h4>POPULAR EXAMS</h4>
            <Link to="#">Talathi</Link>
            <Link to="#">SSC CGL / CHSL</Link>
            <Link to="#">Railway / RRB</Link>
            <Link to="#">Banking</Link>
            <Link to="#">Police / Defence</Link>
          </div>

          <div>
            <h4>COMPANY</h4>
            <Link to="#">About Us</Link>
            <Link to="#">Contact Us</Link>
            <Link to="#">Careers</Link>
            <Link to="#">Privacy Policy</Link>
            <Link to="#">Terms & Conditions</Link>
            <Link to="#">Refund Policy</Link>
            <Link to="#">Shipping Policy</Link>
          </div>
        </div>
      </div>

      {/* BOTTOM */}
      <div className="footer-bottom">
        <p>© 2026 RankU1 – All Rights Reserved. | Maharashtra, India</p>
        <span>Login Register</span>
      </div>
    </footer>
  );
};

export default Footer;