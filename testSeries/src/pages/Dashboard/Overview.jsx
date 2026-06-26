import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axios";
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
  const [stats, setStats] = useState(null);
  const [results, setResults] = useState([]);
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
      return;
    }

    const fetchDashboardData = async () => {
      try {
        const [statsRes, resultsRes] = await Promise.all([
          api.get('/tests/dashboard-stats'),
          api.get('/tests/my-results')
        ]);
        setStats(statsRes.data);
        setResults(resultsRes.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchDashboardData();
    }
  }, [user, authLoading, navigate]);

  if (authLoading || (loading && user)) return <div className="exam-loading">Loading your dashboard...</div>;

  const getProfilePictureUrl = (pic) => {
    if (!pic) return null;
    if (pic.startsWith('data:') || pic.startsWith('http://') || pic.startsWith('https://')) {
      return pic;
    }
    const serverUrl = import.meta.env.VITE_API_BASE_URL?.replace('/api', '')
      || 'https://ranku1server-git-main-pooja-kothawade-projects.vercel.app';
    if (pic.startsWith('/')) {
      return `${serverUrl}${pic}`;
    }
    return `${serverUrl}/${pic}`;
  };

  const profilePicUrl = getProfilePictureUrl(user?.profilePicture);

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
            <h2>Welcome back, {user?.name?.split(' ')[0] || 'User'} ✨</h2>
            <p className="rank">🌐 Global Rank #N/A</p>
         </div>

          <button className="settings" onClick={() => navigate('/settings')}>⚙ Settings</button>
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
              <h2>{stats?.avgScore || 0}%</h2>
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
              {user?.referralCode || 'LIMOB9408'}
            </div>

            <button onClick={() => navigate('/rewards')}>Withdraw Rewards</button>
          </div>

         

        </div>

      </div>

      {/* Test History Section */}
      <div className="results-section" style={{ marginTop: '30px' }}>
        <h2>Your Test History</h2>
        <div className="results-table-container">
          {results.length > 0 ? (
            <table className="results-table">
              <thead>
                <tr>
                  <th>Test Title</th>
                  <th>Category</th>
                  <th>Date</th>
                  <th>Score</th>
                  <th>Rank</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {results.map((res) => (
                  <tr key={res._id}>
                    <td><strong>{res.testId?.title}</strong></td>
                    <td>{res.testId?.category}</td>
                    <td>{new Date(res.createdAt).toLocaleDateString()}</td>
                    <td>
                      <span className={`score-badge ${res.score >= 0 ? 'score-positive' : 'score-negative'}`}>
                        {res.score} / {res.totalMarks}
                      </span>
                    </td>
                    <td><span className="rank-badge">#{res.rank}</span></td>
                    <td>
                      <button onClick={() => navigate(`/result/${res._id}`)} className="view-btn">View Report</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="no-results-text" style={{ textAlign: 'center', padding: '3rem' }}>
              You haven't taken any tests yet.{' '}
              <button onClick={() => navigate('/test-series')} style={{ color: 'var(--accent-primary)', fontWeight: '700', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>Start now!</button>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default Overview;