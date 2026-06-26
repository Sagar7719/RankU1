import React from "react";
import "./Analytics.css";

const Analytics = () => {
  return (
    <div className="analytics">
      {/* HEADER */}
  <div className="analytics-header">

      <h2>Performance Deep Dive</h2>

       <div className="analytics-filters">
    <select className="filter-dropdown">
      <option>All Exams</option>
      <option>SSC Tests</option>
      <option>MPSC Tests</option>
      <option>Banking Tests</option>
      <option>Railway Tests</option>
    </select>

    <select className="filter-dropdown">
      <option>All Test Types</option>
      <option>Full Mock Tests</option>
      <option>Sectional Practice</option>
      <option>Live Challenges</option>
      
    </select>
  </div>
  </div>
  

      {/* Top Stats */}
      <div className="stats">
        <div className="card">Total Tests <h3>0</h3></div>
        <div className="card">Avg Percentile <h3>0%</h3></div>
        <div className="card">Avg Accuracy <h3>0%</h3></div>
        <div className="card">Study Time <h3>0m</h3></div>
        <div className="card">Current Streak <h3>0 🔥</h3></div>
      </div>

      {/* Heatmap Section */}
      <div className="heatmap">
        {/* <h3>Monthly Heatmap</h3> */}
        <div className="heatmap-header">
  <h3>📅 Monthly Heatmap</h3>

  <div className="month-box">
    <span>❮</span>
    <h4>March 2026</h4>
    <span>❯</span>
    <span>⚡</span>
  </div>
</div>

        <div className="grid">
          {[...Array(30)].map((_, i) => (
            <div key={i} className="box">{i + 1}</div>
          ))}
        </div>
      </div>


      {/* ✅ NEW SECTION (ADD THIS BELOW) */}
      <div className="monthly-performance">

        <div className="mp-header">
          <h2>Monthly Performance Statement</h2>
          <span className="verified">✔ Verified Data</span>
        </div>

        <div className="mp-cards">
          <div className="mp-card">
            <p>TOTAL TESTS</p>
            <h3>0</h3>
            <span className="sub red">↓ 2 vs LM</span>
          </div>

          <div className="mp-card">
            <p>AVG SCORE</p>
            <h3>0</h3>
            <span className="sub">0 vs LM</span>
          </div>

          <div className="mp-card">
            <p>ACCURACY</p>
            <h3>0%</h3>
            <span className="sub">0 vs LM</span>
          </div>

          <div className="mp-card">
            <p>TIME SPENT</p>
            <h3>0m</h3>
            <span className="sub">0m vs LM</span>
          </div>
        </div>

        <div className="mp-details">

          <div className="row">
            <span>Gross Score Earned</span>
            <span>0</span>
          </div>

          <div className="row">
            <span>Negative Marks Lost</span>
            <span>-0</span>
          </div>

          <div className="row bold">
            <span>Net Score Performance</span>
            <span>0</span>
          </div>

          <hr />

          <div className="row">
            <span>MoM Improvement Index</span>
            <span>Stagnant 0</span>
          </div>

          {/* ✅ ADD THIS BELOW */}
          <div className="no-data">
           No test data found for this period
            </div>

            {/* MONTHLY GOALS + AI INSIGHTS */}
<div className="bottom-section">

  <div className="goal-card">
    <h2>Monthly Progress Goals</h2>

    <div className="goal-item">
      <div className="goal-text">
        <span>Monthly Tests Target</span>
        <span>0/30 (0%)</span>
      </div>
      <div className="progress-bar">
        <div className="progress-fill"></div>
      </div>
    </div>

    <div className="goal-item">
      <div className="goal-text">
        <span>Accuracy Goal</span>
        <span>0/85 (0%)</span>
      </div>
      <div className="progress-bar">
        <div className="progress-fill"></div>
      </div>
    </div>
  </div>

  <div className="ai-card">
    <h2>AI Performance Insights</h2>

    <div className="ai-content">
      <span className="ai-icon">🎯</span>
      <p>
        Accuracy is below target (0%).
        Focus on eliminating negative marks to boost your net score.
      </p>
    </div>
  </div>

</div>


   <div className="last-cards">

  <div className="subject-card">
    <h2>📈 SUBJECT PROFICIENCY</h2>
  </div>

  <div className="time-card">
    <h2>🕒 TIME MANAGEMENT</h2>
  </div>

</div>





         </div>


         

      </div>


  </div>
  );
};

export default Analytics;


