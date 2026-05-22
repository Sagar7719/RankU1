import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [results, setResults] = useState([]);
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

    fetchDashboardData();
  }, []);

  if (loading) return <div className="exam-loading">Loading your dashboard...</div>;

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Welcome, {user?.name}! 👋</h1>
        <p>Here's how you've been performing lately.</p>
      </header>

      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-label">Total Tests</span>
          <span className="stat-value">{stats?.totalTests || 0}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Avg. Score</span>
          <span className="stat-value">{stats?.avgScore || 0}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Member Since</span>
          <span className="stat-value">{user ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</span>
        </div>
      </div>

      <section className="results-section">
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
                    <td>
                      <span className="rank-badge">#{res.rank}</span>
                    </td>
                    <td>
                      <Link to={`/result/${res._id}`} className="view-btn">View Report</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="no-results-text" style={{ textAlign: 'center', padding: '3rem' }}>
              You haven't taken any tests yet. <Link to="/test-series" style={{ color: 'var(--accent-primary)', fontWeight: '700' }}>Start now!</Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
