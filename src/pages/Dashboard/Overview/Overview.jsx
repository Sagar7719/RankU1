import React from "react";
import "./Overview.css";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip);

const Overview = () => {
  const data = {
    labels: ["1", "2", "3", "4", "5"],
    datasets: [
      {
        data: [0, -4, -3.5, -0.8, 0],
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59,130,246,0.15)",
        fill: true,
        tension: 0.45,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { display: false },
      y: {
        ticks: { color: "#64748b" },
        grid: { color: "#1e293b" },
      },
    },
  };

  return (
    <div className="dashboard-overview">

      {/* TOP */}
      <div className="top">
        <div className="welcome">
           <div className="avatar">👤</div>

         <div>
            <h2>Welcome back, mayuri ✨</h2>
            <p className="rank">🌐 Global Rank #N/A</p>
         </div>

          <button className="settings">⚙ Settings</button>
      </div>

        
      <div className="streak">
  <div className="streak-card">
    <div className="streak-icon">🔥</div>
    <h1>1</h1>
    <p>DAY STREAK</p>
  </div>
</div>
</div>

      <div className="middle">

        <div className="graph">
          <div className="graph-header">
            <h3>Performance Progression</h3>
            <span>Score Trends</span>
          </div>

          <div className="chart-box">
            <Line data={data} options={options} />
          </div>
        </div>

        <div className="right">

          <div className="top-cards">
            <div className="card">
               <div className="icon green">✓</div>
              <h2>0%</h2>
              <span>OVERALL ACCURACY</span>
            </div>
            

            <div className="card">
               <div className="icon blue">🕒</div>
              <h2>0s</h2>
              <span>AVG. SPEED</span>
            </div>

             </div>
             

          <div className="wallet">
            <h3>Wallet</h3>
            <h1>₹0</h1>

            <div className="referral">
              LIMOB9408
            </div>

            <button>Withdraw Rewards</button>
          </div>

         

        </div>

      </div>

    </div>
  );
};

export default Overview;


