import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import './Dashboard.css';

const Dashboard = () => {
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

      {(() => {
        let plan = null;
        if (user?.plan && user.plan.isActive) {
          plan = user.plan;
        } else if (user) {
          try {
            const localPlan = localStorage.getItem(`userPlan_${user._id}`);
            if (localPlan && localPlan !== 'undefined') {
              plan = JSON.parse(localPlan);
            }
          } catch (e) {
            console.error("Error parsing userPlan from localStorage", e);
          }
        }

        if (!plan) return null;

        const isExpired = new Date(plan.expireDate) < new Date();

        return (
          <section className="subscription-section" style={{ marginTop: '2rem', background: 'var(--bg-secondary)', padding: '24px', borderRadius: '16px', border: '1px solid var(--accent-primary)' }}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '16px', color: 'var(--text-primary)' }}>My Subscription</h2>
            <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: '200px' }}>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '4px' }}>Active Plan</p>
                <p style={{ color: 'var(--accent-primary)', fontSize: '1.2rem', fontWeight: '700' }}>{plan.name}</p>
              </div>
              
              <div style={{ flex: 1, minWidth: '150px' }}>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '4px' }}>Purchased On</p>
                <p style={{ color: 'var(--text-primary)', fontWeight: '600' }}>{new Date(plan.buyDate).toLocaleDateString()}</p>
              </div>

              <div style={{ flex: 1, minWidth: '150px' }}>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '4px' }}>Expires On</p>
                <p style={{ color: 'var(--text-primary)', fontWeight: '600' }}>
                  {plan.name.includes('Lifetime') ? 'Never' : new Date(plan.expireDate).toLocaleDateString()}
                </p>
              </div>

              <div style={{ flex: 1, minWidth: '150px' }}>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '4px' }}>Status</p>
                <span style={{ 
                  background: isExpired ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)', 
                  color: isExpired ? 'var(--danger)' : 'var(--success)', 
                  padding: '4px 12px', 
                  borderRadius: '20px', 
                  fontWeight: '700',
                  fontSize: '0.85rem'
                }}>
                  {isExpired ? 'Expired' : 'Active'}
                </span>
              </div>
            </div>
          </section>
        );
      })()}

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
