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
          {user ? (() => {
            const getProfilePictureUrl = (pic) => {
              if (!pic) return null;
              if (pic.startsWith('data:') || pic.startsWith('http://') || pic.startsWith('https://')) {
                return pic;
              }
              const serverUrl = '  ';
              if (pic.startsWith('/')) {
                return `${serverUrl}${pic}`;
              }
              return `${serverUrl}/${pic}`;
            };
            const profilePicUrl = getProfilePictureUrl(user.profilePicture);

            return (
              <div className="profileSection">
                <div 
                  className="profileCircle" 
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                >
                  {profilePicUrl ? (
                    <img 
                      src={profilePicUrl} 
                      alt="Profile" 
                      style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} 
                    />
                  ) : (
                    (user.name || "U").charAt(0).toUpperCase()
                  )}
                </div>
                
                {showProfileMenu && (
                  <div className="profileDropdown">
                    <div className="dropdownHeader" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
                      <div className="dropdownUserDetailRow" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div className="profileCircle" style={{ width: '38px', height: '38px', margin: 0, flexShrink: 0 }}>
                          {profilePicUrl ? (
                            <img 
                              src={profilePicUrl} 
                              alt="Profile" 
                              style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} 
                            />
                          ) : (
                            (user.name || "U").charAt(0).toUpperCase()
                          )}
                        </div>
                        <div className="dropdownUser" style={{ display: 'flex', flexDirection: 'column', gap: '2px', overflow: 'hidden' }}>
                          <strong style={{ fontSize: '14px', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {user.name}
                          </strong>
                          <span style={{ fontSize: '11px', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {user.email}
                          </span>
                        </div>
                      </div>
                      <div className="dropdownBadges" style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '10px' }}>
                        <span style={{ fontSize: '10px', background: 'rgba(99, 102, 241, 0.12)', color: 'var(--accent-primary)', padding: '2px 8px', borderRadius: '12px', fontWeight: '700' }}>
                          {user.plan && user.plan.isActive ? user.plan.name : 'Free Tier'}
                        </span>
                        {user.rewardPoints !== undefined && (
                          <span style={{ fontSize: '10px', background: 'rgba(250, 204, 21, 0.12)', color: '#eab308', padding: '2px 8px', borderRadius: '12px', fontWeight: '700' }}>
                            🪙 {user.rewardPoints} Pts
                          </span>
                        )}
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
                        style={{ border: 'none', width: '100%', cursor: 'pointer', fontFamily: 'inherit' }}
                      >
                        <FaSignOutAlt className="menuIconLink" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })()
          : (
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