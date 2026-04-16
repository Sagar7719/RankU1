import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./Navbar.css";

function Navbar() {

  const [menuOpen, setMenuOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Exam", path: "/exam" },
    { name: "Courses", path: "/courses" },
    { name: "Current Affairs", path: "/current-affairs" },
    { name: "Test Series", path: "/test-series" },
    { name: "Updates", path: "/updates" },
    { name: "Plans", path: "/plans" },
    { name: "Rewards", path: "/rewards" }
  ];

  // 🔥 Detect current page
  const isLoginPage = location?.pathname === "/login";

  // 🔥 Button text + navigation
  const handleAuthClick = () => {
    if (isLoginPage) {
      navigate("/register");
    } else {
      navigate("/login");
    }
  };

  const buttonText = isLoginPage ? "Register" : "Login";

  return (

    <nav className="navbar">

      <div className="navContainer">

        {/* Logo */}
        <div className="logo">
          <Link to="/">RankU1</Link>
        </div>

        {/* Menu */}
        <div className={`menu ${menuOpen ? "active" : ""}`}>
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`navLink ${location.pathname === item.path ? "activeLink" : ""
                }`}
              onClick={() => setMenuOpen(false)}
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Right Section */}
        <div className="rightSection">

          <div className="searchBox">
            <span className="searchIcon">🔍</span>
            <input
              type="text"
              placeholder="Search test series..."
            />
          </div>

          {/* 🔥 Dynamic Button */}
          <button
            className="loginBtn"
            onClick={handleAuthClick}
          >
            {buttonText}
          </button>

        </div>

        {/* Mobile Menu Icon */}
        <div
          className="menuIcon"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </div>

      </div>

    </nav>

  );
}

export default Navbar;