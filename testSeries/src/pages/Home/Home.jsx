import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Hero from "./Hero_Section/Hero";
import "./Home.css";

const Home = () => {
  const navigate = useNavigate();
  const [exams, setExams] = useState([]);

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/exams");
        if (response.ok) {
          const data = await response.json();
          setExams(data);
        }
      } catch (error) {
        console.error("Error fetching exams for home page:", error);
      }
    };
    fetchExams();
  }, []);

  // Default exams from screenshot to fall back or show if DB is empty
  const defaultExamsList = [
    { name: "Talent Search", id: "default-talent" },
    { name: "UPSC Services", id: "default-upsc" },
    { name: "SSC CGL/CHSL", id: "default-ssc" },
    { name: "Banking Exams", id: "default-banking" },
    { name: "Railway Exams", id: "default-railway" },
    { name: "State Board", id: "default-state" },
  ];

  const displayExams = exams.length > 0 ? exams.slice(0, 6) : defaultExamsList;

  const handleExamClick = (exam) => {
    navigate("/exam", { state: { search: exam.name } });
  };

  const getExamIcon = (name, customImage) => {
    if (customImage) {
      return (
        <img 
          src={customImage.startsWith("http") ? customImage : `http://localhost:5000${customImage}`} 
          alt={name} 
          className="exam-icon-img" 
        />
      );
    }
    
    const n = name.toLowerCase();
    if (n.includes("talent")) {
      return (
        <div className="exam-icon-wrapper blue-theme">
          <svg className="exam-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="12" cy="12" r="10" />
            <circle cx="12" cy="12" r="6" />
            <circle cx="12" cy="12" r="2" />
          </svg>
        </div>
      );
    }
    if (n.includes("upsc") || n.includes("mpsc") || n.includes("civil")) {
      return (
        <div className="exam-icon-wrapper yellow-theme">
          <svg className="exam-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            <polygon points="12 8 13.5 11.5 17 11.5 14 13.5 15.5 17 12 15 8.5 17 10 13.5 7 11.5 10.5 11.5" />
          </svg>
        </div>
      );
    }
    if (n.includes("ssc") || n.includes("cgl") || n.includes("chsl")) {
      return (
        <div className="exam-icon-wrapper red-theme">
          <svg className="exam-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            <polyline points="9 11 11 13 15 9" />
          </svg>
        </div>
      );
    }
    if (n.includes("bank") || n.includes("ibps") || n.includes("sbi")) {
      return (
        <div className="exam-icon-wrapper green-theme">
          <svg className="exam-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M3 22h18M6 22V10m6 12V10m6 12V10M12 2v4M4 6h16M12 2L4 6h16l-8-4z" />
          </svg>
        </div>
      );
    }
    if (n.includes("rail") || n.includes("rrb")) {
      return (
        <div className="exam-icon-wrapper purple-theme">
          <svg className="exam-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <rect x="4" y="3" width="16" height="14" rx="2" />
            <path d="M4 11h16M8 15h.01M16 15h.01M6 20l2-3M18 20l-2-3" />
          </svg>
        </div>
      );
    }
    // Default fallback icon
    return (
      <div className="exam-icon-wrapper orange-theme">
        <svg className="exam-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20M4 19.5A2.5 2.5 0 0 0 6.5 22H20M4 19.5V3a1 1 0 0 1 1-1h15v16H6.5A2.5 2.5 0 0 0 4 19.5z" />
        </svg>
      </div>
    );
  };

  return (
    <div className="hp">
      {/* 1. HERO SECTION */}
      <Hero />

      {/* 2. FEATURES SECTION */}
      <section className="features-section">
        <div className="section-container">
          <span className="section-badge">WHY CHOOSE US</span>
          <h2 className="section-title">
            Empowering Success through <span className="gradient-text">Innovation</span>
          </h2>
          <p className="section-desc">
            Our platform is built to solve the real exam pressure and provide accurate insights.
          </p>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon-wrapper icon-blue">
                <svg className="feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
              </div>
              <h3>Exam-Level Accuracy</h3>
              <p>Our test interface mirrors the actual exam console down to the last detail to ensure zero surprises.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrapper icon-green">
                <svg className="feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 20V10M12 20V4M6 20v-6M3 20h18" />
                </svg>
              </div>
              <h3>Intelligent Analytics</h3>
              <p>Receive section-wise breakdown, time spent per question, and comparison with toppers.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrapper icon-yellow">
                <svg className="feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1zM4 22v-7" />
                </svg>
              </div>
              <h3>Bilingual Excellence</h3>
              <p>Choose your preferred language on the fly. Switch between English & Marathi instantly.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrapper icon-purple">
                <svg className="feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                </svg>
              </div>
              <h3>Speed Optimization</h3>
              <p>Optimize your attempt rate and accuracy through speed tracking alerts.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SUPPORTED EXAMS SECTION */}
      <section className="exams-section">
        <div className="section-container">
          <h2 className="section-title text-center">
            Supported <span className="gradient-text">Exams</span>
          </h2>
          <p className="section-desc text-center">
            We cover all major government exams, state board exams, defense exams, and PSCs.
          </p>

          <div className="exams-grid">
            {displayExams.map((exam) => (
              <div 
                key={exam._id || exam.id} 
                className="exam-card-item"
                onClick={() => handleExamClick(exam)}
              >
                <div className="exam-card-inner">
                  {getExamIcon(exam.name, exam.image)}
                  <span className="exam-card-name">{exam.name}</span>
                  <svg className="exam-arrow-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </div>
              </div>
            ))}
          </div>

          <div className="view-all-container">
            <button className="view-all-btn" onClick={() => navigate("/exam")}>
              View all 100+ Exams
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* 4. MOBILE EDGE SECTION */}
      <section className="mobile-section">
        <div className="section-container mobile-flex">
          <div className="mobile-left">
            <span className="section-badge">MOBILE APP</span>
            <h2 className="section-title">
              Take Preparation to the <br />
              Mobile <span className="gradient-text">Edge</span>
            </h2>
            <p className="section-desc">
              Experience seamless practice on the go. Support our mobile app and bring all mock tests and key resources right to your fingertips.
            </p>
            <div className="mobile-store-buttons">
              <a href="https://play.google.com/store" target="_blank" rel="noopener noreferrer" className="store-btn">
                <svg className="btn-icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M5.25 2.25c-.195 0-.387.054-.555.156L14.07 12 4.695 21.594c.168.102.36.156.555.156.242 0 .484-.083.676-.25L17.765 12 5.926 2.5a1.002 1.002 0 0 0-.676-.25zM19.125 10.938l-3.328-1.922-2.312 2.312 2.312 2.312 3.328-1.922a1.22 1.22 0 0 0 0-2.094z" />
                </svg>
                <span>Google Play</span>
              </a>
              <a href="https://apps.apple.com" target="_blank" rel="noopener noreferrer" className="store-btn">
                <svg className="btn-icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.2.67-2.92 1.49-.63.71-1.18 1.85-1.03 2.96 1.12.09 2.25-.56 2.96-1.39z" />
                </svg>
                <span>App Store</span>
              </a>
            </div>
          </div>

          <div className="mobile-right">
            {/* Realistic Premium CSS Smartphone Mockup */}
            <div className="phone-mockup">
              <div className="phone-earpiece"></div>
              <div className="phone-camera"></div>
              <div className="phone-screen">
                <div className="phone-app-header">
                  <div className="phone-logo">RankU1</div>
                  <div className="phone-status">Live</div>
                </div>
                <div className="phone-app-body">
                  <div className="phone-metric-card">
                    <span className="phone-metric-title">Overall Accuracy</span>
                    <span className="phone-metric-val">94.8%</span>
                    <div className="phone-metric-progress">
                      <div className="phone-progress-fill" style={{ width: "94.8%" }}></div>
                    </div>
                  </div>
                  <div className="phone-list-item">
                    <span>Talathi Mock Test 1</span>
                    <span className="item-badge free">Free</span>
                  </div>
                  <div className="phone-list-item">
                    <span>SSC CGL Tier 1</span>
                    <span className="item-badge premium">Premium</span>
                  </div>
                  <div className="phone-list-item">
                    <span>UPSC GS Prelims</span>
                    <span className="item-badge premium">Premium</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. READY TO TOP THE LEADERBOARD BANNER */}
      <section className="cta-section">
        <div className="cta-container">
          <h2 className="cta-title">Ready to Top the Leaderboard?</h2>
          <p className="cta-desc">
            Join over 10,000+ students practicing daily and secure a government job with RankU1.
          </p>
          <div className="cta-actions">
            <a href="https://play.google.com/store" target="_blank" rel="noopener noreferrer" className="cta-btn-primary">
              ⚡ Get it on Play Store
            </a>
            <a href="https://apps.apple.com" target="_blank" rel="noopener noreferrer" className="cta-btn-secondary">
              📱 Download App Now
            </a>
            <a href="https://wa.me/917058293263" target="_blank" rel="noopener noreferrer" className="cta-btn-outline">
              💬 Chat with Mentors
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;