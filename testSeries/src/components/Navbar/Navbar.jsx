import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { FaUser, FaCog, FaSignOutAlt, FaChartPie, FaSearch } from "react-icons/fa";
import "./Navbar.css";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

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

  // Detect pages
  const isLoginPage = location.pathname === "/login";
  const isRegisterPage = location.pathname === "/register";

  // Handle button click
  const handleAuthClick = () => {
    if (isLoginPage) {
      navigate("/register");
    } else if (isRegisterPage) {
      navigate("/login");
    } else {
      navigate("/login");
    }
  };

  // Button text
  const buttonText = isLoginPage
    ? "Register"
    : isRegisterPage
    ? "Login"
    : "Login";

  // Active link logic (FIXED)
  const isActive = (path) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

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
              className={`navLink ${isActive(item.path) ? "activeLink" : ""}`}
              onClick={() => setMenuOpen(false)}
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Right Section */}
        <div className="rightSection">

          {/* Theme Toggle */}
          <button className="themeToggle" onClick={toggleTheme}>
            {theme === 'light' ? '🌙' : '☀️'}
          </button>

          {/* Search */}
          <div className="navSearchBox">
            <FaSearch className="navSearchIcon" />
            <input
              type="text"
              placeholder="Search..."
            />
          </div>

          {/* Dynamic Section: Login Button or Profile Circle */}
          {user ? (
            <div className="profileSection">
              <div 
                className="profileCircle" 
                onClick={() => setShowProfileMenu(!showProfileMenu)}
              >
                {user.profilePicture ? (
                  <img 
                    src={user.profilePicture} 
                    alt="Profile" 
                    style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} 
                  />
                ) : (
                  user.name.charAt(0).toUpperCase()
                )}
              </div>
              
              {showProfileMenu && (
                <div className="profileDropdown">
                  <div className="dropdownHeader">
                    <div className="dropdownUser">
                      <strong>{user.name}</strong>
                      <span>{user.email}</span>
                    </div>
                  </div>
                  
                  <div className="dropdownMenu">
                    <Link to="/dashboard" onClick={() => setShowProfileMenu(false)}>
                      <FaChartPie className="menuIconLink" />
                      <span>Dashboard</span>
                    </Link>
                    <Link to="/settings" onClick={() => setShowProfileMenu(false)}>
                      <FaCog className="menuIconLink" />
                      <span>Settings</span>
                    </Link>
                    <div className="divider"></div>
                    <button 
                      className="logoutBtnLink"
                      onClick={() => { logout(); setShowProfileMenu(false); navigate('/'); }}
                    >
                      <FaSignOutAlt className="menuIconLink" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              className="loginBtn"
              onClick={handleAuthClick}
            >
              {buttonText}
            </button>
          )}

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