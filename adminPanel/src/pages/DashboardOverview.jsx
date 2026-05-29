import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const Sparkline = ({ color }) => (
  <svg className="sparkline" viewBox="0 0 100 30" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M0 15 Q 25 5, 50 15 T 100 15" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

const DashboardOverview = () => {
  const [timeFilter, setTimeFilter] = useState('30D');
  const [stats, setStats] = useState({ 
    totalUsers: 12, 
    active7d: 7,
    paidUsers: 6,
    revenueToday: '₹0',
    monthlyRev: '₹914.99',
    conversion: '50.0%',
    referrals: 1,
    activeTests: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/admin/stats');
        // Merge real data if available
      } catch (err) {
        console.error("Failed to fetch stats", err);
      }
    };
    fetchStats();
  }, [timeFilter]);

  return (
    <div className="content-scrollable">
      <div className="flex justify-between items-end" style={{marginBottom: '2rem'}}>
        <div>
          <h1 className="page-title">Executive Control Panel</h1>
          <p className="text-muted text-sm" style={{ fontWeight: 500, marginTop: '0.25rem' }}>Real-time telemetry and platform intelligence</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex gap-1 text-sm font-semibold" style={{background: 'var(--bg-card)', padding: '0.35rem', borderRadius: '10px', border: '1px solid var(--border-color)'}}>
            {['7D', '30D', 'ALL'].map((filter) => (
              <button 
                key={filter}
                onClick={() => setTimeFilter(filter)}
                style={{
                  padding: '0.35rem 0.85rem', 
                  borderRadius: '6px', 
                  color: timeFilter === filter ? 'var(--primary)' : 'var(--text-muted)', 
                  background: timeFilter === filter ? 'rgba(250,204,21,0.1)' : 'transparent',
                  transition: 'all 0.2s'
                }}
              >
                {filter}
              </button>
            ))}
          </div>
          <button className="btn-primary" onClick={() => alert('Exporting Analytics...')}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            Export Analytics
          </button>
        </div>
      </div>

      <div className="stats-grid">
        {/* Card 1 */}
        <div className="stat-card" style={{cursor: 'pointer'}} onClick={() => alert('Total Users details')}>
          <div className="stat-header">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
            Total Users
          </div>
          <div className="stat-value">{stats.totalUsers}</div>
          <div className="stat-subtext positive">+12% vs last 7d</div>
          <Sparkline color="var(--primary)" />
        </div>

        {/* Card 2 */}
        <div className="stat-card" style={{cursor: 'pointer'}} onClick={() => alert('Active Users details')}>
          <div className="stat-header">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            Active (7d)
          </div>
          <div className="stat-value">{stats.active7d}</div>
          <div className="stat-subtext positive">+5.2% vs last 7d</div>
          <Sparkline color="var(--success)" />
        </div>

        {/* Card 3 */}
        <div className="stat-card" style={{cursor: 'pointer'}} onClick={() => alert('Paid Users details')}>
          <div className="stat-header">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2"><rect x="2" y="5" width="20" height="14" rx="2"></rect><line x1="2" y1="10" x2="22" y2="10"></line></svg>
            Paid Users
          </div>
          <div className="stat-value">{stats.paidUsers}</div>
          <div className="stat-subtext positive">+2.1% vs last 7d</div>
          <Sparkline color="#f97316" />
        </div>

        {/* Card 4 */}
        <div className="stat-card" style={{cursor: 'pointer'}} onClick={() => alert('Revenue details')}>
          <div className="stat-header">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
            Revenue Today
          </div>
          <div className="stat-value">{stats.revenueToday}</div>
          <div className="stat-subtext" style={{color: '#ef4444'}}>0% vs last 7d</div>
          <Sparkline color="var(--primary)" />
        </div>

        {/* Card 5 */}
        <div className="stat-card" style={{cursor: 'pointer'}} onClick={() => alert('Monthly Revenue details')}>
          <div className="stat-header">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ec4899" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
            Monthly Rev
          </div>
          <div className="stat-value">{stats.monthlyRev}</div>
          <div className="stat-subtext positive">+14% vs last 7d</div>
          <Sparkline color="#ec4899" />
        </div>

        {/* Card 6 */}
        <div className="stat-card" style={{cursor: 'pointer'}} onClick={() => alert('Conversion details')}>
          <div className="stat-header">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>
            Conversion
          </div>
          <div className="stat-value">{stats.conversion}</div>
          <div className="stat-subtext positive">+1.1% vs last 7d</div>
          <Sparkline color="#0ea5e9" />
        </div>

        {/* Card 7 */}
        <div className="stat-card" style={{cursor: 'pointer'}} onClick={() => alert('Referrals details')}>
          <div className="stat-header">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>
            Referrals
          </div>
          <div className="stat-value">{stats.referrals}</div>
          <div className="stat-subtext positive">+8.4% vs last 7d</div>
          <Sparkline color="#ef4444" />
        </div>

        {/* Card 8 */}
        <div className="stat-card" style={{cursor: 'pointer'}} onClick={() => alert('Active Tests details')}>
          <div className="stat-header">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#14b8a6" strokeWidth="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg>
            Active Tests
          </div>
          <div className="stat-value">{stats.activeTests}</div>
          <div className="stat-subtext positive">+3 vs last 7d</div>
          <Sparkline color="#14b8a6" />
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
