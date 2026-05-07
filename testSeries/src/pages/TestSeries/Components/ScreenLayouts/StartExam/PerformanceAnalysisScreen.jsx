import React from 'react';
import { useNavigate } from 'react-router-dom';
import './PerformanceAnalysisScreen.css';

const PerformanceAnalysisScreen = ({ isLoggedIn }) => {
  const navigate = useNavigate();

  if (!isLoggedIn) return null;

  return (
    <div className="performance-screen">
      {/* Navbar */}
      <nav className="perf-nav">
        <div className="perf-nav-left">
          <div className="ranku1-logo">RankU1</div>
          <div className="nav-links">
            <span>Home</span>
            <span className="active">Exam</span>
            <span>Courses</span>
            <span>Current Affairs</span>
            <span>Test Series</span>
            <span>Updates</span>
            <span>Plans</span>
            <span>Rewards</span>
          </div>
        </div>
        <div className="perf-nav-right">
          <div className="search-bar">
            <span className="search-icon">🔍</span>
            <input type="text" placeholder="Search test series..." />
          </div>
          <div className="user-badge">
            <div className="user-dot"></div>
            <span>dha..</span>
          </div>
          <button className="logout-btn">⎋</button>
        </div>
      </nav>

      {/* Content */}
      <div className="perf-content">
        <div className="perf-header">
          <button className="back-btn" onClick={() => navigate('/')}>
            ‹ Back
          </button>
          <div className="header-main">
            <div className="header-info">
              <h1>पोलीस भरती टेस्ट -01</h1>
              <p>Refer below for detailed performance analysis.</p>
            </div>
            <button className="download-btn">⤓ DOWNLOAD REPORT</button>
          </div>
        </div>

        <div className="summary-grid">
          {/* Main Summary Card */}
          <div className="summary-card main-summary">
            <div className="card-top">
              <div className="card-title-group">
                <div className="icon-badge yellow">🏅</div>
                <div className="title-text">
                  <h2>Performance Summary</h2>
                  <p>Comprehensive analysis of your attempt</p>
                </div>
              </div>
              <div className="global-rank">
                <span className="rank-label">GLOBAL RANK</span>
                <span className="rank-value">#6</span>
              </div>
            </div>

            <div className="card-stats">
              <div className="stat-item">
                <span className="stat-label">Raw Score</span>
                <div className="stat-value">0.00 <span className="stat-total">/2</span></div>
              </div>
              <div className="stat-item">
                <span className="stat-label">Precision</span>
                <div className="stat-value color-green">0%</div>
              </div>
              <div className="stat-item">
                <span className="stat-label">Percentile</span>
                <div className="stat-value color-blue">0%</div>
              </div>
              <div className="stat-chart">
                <div className="donut-chart">
                  <div className="donut-inner">
                    <span className="donut-num">0</span>
                    <span className="donut-label">CORRECT</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Side Cards */}
          <div className="side-cards">
            <div className="summary-card side-card">
              <div className="icon-badge green">🎗</div>
              <div className="side-card-content">
                <span className="side-label">GENERAL RANK</span>
                <div className="side-value">#4</div>
                <span className="side-sub">of 4 users</span>
              </div>
            </div>
            <div className="summary-card side-card">
              <div className="icon-badge yellow">⚡</div>
              <div className="side-card-content">
                <span className="side-label">EFFICIENCY</span>
                <div className="side-value">1/2</div>
                <span className="side-sub">Engagement: 0m</span>
              </div>
            </div>
          </div>
        </div>

        {/* Subject-wise Insights */}
        <div className="insights-section">
          <div className="insights-header">
            <div className="icon-badge blue">📈</div>
            <div className="title-text">
              <h2>Subject-wise Insights</h2>
              <p>Granular performance metrics per section</p>
            </div>
          </div>
          
          <div className="table-container">
            <table className="insights-table">
              <thead>
                <tr>
                  <th>SECTION</th>
                  <th>TOTAL</th>
                  <th>ATTEMPTED</th>
                  <th>CORRECT</th>
                  <th>INCORRECT</th>
                  <th>SKIPPED</th>
                  <th>SCORE</th>
                  <th>ACCURACY</th>
                  <th>DURATION</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="bold">Default</td>
                  <td>2</td>
                  <td>1</td>
                  <td>0</td>
                  <td className="bold">1</td>
                  <td>1</td>
                  <td className="yellow-text bold">0.00</td>
                  <td><span className="accuracy-badge">0%</span></td>
                  <td>2m 9s</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Score Distribution */}
        <div className="distribution-section">
          <div className="section-title-group">
            <h3>Score Distribution</h3>
            <p>Your standing relative to other aspirants</p>
          </div>
          
          <div className="distribution-chart-container">
            <div className="distribution-chart">
              <div className="chart-bar-container">
                <div className="axis-line"></div>
                <div className="user-marker">
                  <span className="marker-label">YOU</span>
                  <div className="marker-dot"></div>
                </div>
                <div className="bar-glow"></div>
                <div className="main-bar"></div>
                <div className="bar-axis">0</div>
                
                {/* Tooltip */}
                <div className="chart-tooltip">
                  <div className="tooltip-row">
                    <span>Students:</span>
                    <span className="bold">80.00</span>
                  </div>
                  <div className="tooltip-row">
                    <span className="dot yellow-dot"></span>
                    <span>curve:</span>
                    <span className="bold">80.00</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Percentile Growth */}
        <div className="growth-section">
          <div className="section-title-group">
            <h3>Percentile Growth</h3>
            <p>Probability trend based on score increments</p>
          </div>
          
          <div className="growth-chart-container">
            <div className="growth-y-axis">
              <span>100%</span>
              <span>75%</span>
              <span>50%</span>
              <span>25%</span>
              <span>0%</span>
            </div>
            <div className="growth-chart-area">
              <svg width="100%" height="200" preserveAspectRatio="none">
                <path 
                  d="M0,180 Q100,170 200,100 T400,20" 
                  fill="none" 
                  stroke="url(#lineGradient)" 
                  strokeWidth="3"
                />
                <defs>
                  <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#22c55e" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="growth-grid-lines">
                {[...Array(5)].map((_, i) => <div key={i} className="grid-line"></div>)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Chat Button */}
      <button className="floating-chat">💬</button>
    </div>
  );
};

export default PerformanceAnalysisScreen;
