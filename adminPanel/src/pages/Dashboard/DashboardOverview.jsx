import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';

const Sparkline = ({ color }) => (
  <svg className="sparkline" viewBox="0 0 100 30" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M0 15 Q 25 5, 50 15 T 100 15" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

const DashboardOverview = () => {
  const navigate = useNavigate();
  const [timeFilter, setTimeFilter] = useState('30D');
  const [stats, setStats] = useState({ 
    totalUsers: 0, 
    active7d: 0,
    paidUsers: 0,
    revenueToday: '₹0',
    monthlyRev: '₹0',
    conversion: '0%',
    referrals: 0,
    activeTests: 0
  });

  // Modal State for Users
  const [isUsersModalOpen, setIsUsersModalOpen] = useState(false);
  const [modalType, setModalType] = useState('paid'); // 'paid' or 'daily_rev'
  const [activeUsers, setActiveUsers] = useState([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);

  const fetchModalUsers = async (type) => {
    setModalType(type);
    setIsUsersModalOpen(true);
    setIsLoadingUsers(true);
    try {
      const res = await api.get('/admin/users');
      let filteredUsers = [];
      if (type === 'paid') {
        filteredUsers = res.data.filter(u => u.plan && u.plan.isActive && u.plan.price > 0);
      } else if (type === 'daily_rev') {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        filteredUsers = res.data.filter(u => 
          u.plan && u.plan.isActive && u.plan.price > 0 && new Date(u.plan.buyDate) >= today
        );
      } else if (type === 'conversion') {
        filteredUsers = res.data.filter(u => u.plan && u.plan.isActive && u.plan.price > 0);
      }
      setActiveUsers(filteredUsers.sort((a, b) => new Date(b.plan?.buyDate || b.createdAt) - new Date(a.plan?.buyDate || a.createdAt)));
    } catch (err) {
      console.error("Failed to fetch users", err);
    } finally {
      setIsLoadingUsers(false);
    }
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get(`/admin/stats?filter=${timeFilter}`);
        // Merge real data if available
        setStats(prev => ({
          ...prev,
          totalUsers: res.data.totalUsers ?? 0,
          activeTests: res.data.totalTests ?? 0,
          active7d: res.data.active7d ?? 0,
          paidUsers: res.data.paidUsers ?? 0,
          revenueToday: res.data.revenueToday ?? '₹0',
          monthlyRev: res.data.monthlyRev ?? '₹0',
          conversion: res.data.conversion ?? '0%',
          referrals: res.data.referrals ?? 0,
        }));
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
        <div className="stat-card" style={{cursor: 'pointer'}} onClick={() => navigate('/users')}>
          <div className="stat-header">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
            Total Users
          </div>
          <div className="stat-value">{stats.totalUsers}</div>
          <div className="stat-subtext positive">+12% vs last 7d</div>
          <Sparkline color="var(--primary)" />
        </div>

        {/* Card 2 */}
        <div className="stat-card" style={{cursor: 'pointer'}} onClick={() => navigate('/users')}>
          <div className="stat-header">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            Active (7d)
          </div>
          <div className="stat-value">{stats.active7d}</div>
          <div className="stat-subtext positive">+5.2% vs last 7d</div>
          <Sparkline color="var(--success)" />
        </div>

        {/* Card 3 */}
        <div className="stat-card" style={{cursor: 'pointer'}} onClick={() => fetchModalUsers('paid')}>
          <div className="stat-header">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2"><rect x="2" y="5" width="20" height="14" rx="2"></rect><line x1="2" y1="10" x2="22" y2="10"></line></svg>
            Paid Users
          </div>
          <div className="stat-value">{stats.paidUsers}</div>
          <div className="stat-subtext positive">+2.1% vs last 7d</div>
          <Sparkline color="#f97316" />
        </div>

        {/* Card 4 */}
        <div className="stat-card" style={{cursor: 'pointer'}} onClick={() => fetchModalUsers('daily_rev')}>
          <div className="stat-header">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
            Revenue Today
          </div>
          <div className="stat-value">{stats.revenueToday}</div>
          <div className="stat-subtext" style={{color: '#ef4444'}}>0% vs last 7d</div>
          <Sparkline color="var(--primary)" />
        </div>

        {/* Card 5 */}
        <div className="stat-card" style={{cursor: 'pointer'}} onClick={() => navigate('/revenue')}>
          <div className="stat-header">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ec4899" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
            Monthly Rev
          </div>
          <div className="stat-value">{stats.monthlyRev}</div>
          <div className="stat-subtext positive">+14% vs last 7d</div>
          <Sparkline color="#ec4899" />
        </div>

        {/* Card 6 */}
        <div className="stat-card" style={{cursor: 'pointer'}} onClick={() => fetchModalUsers('conversion')}>
          <div className="stat-header">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>
            Conversion
          </div>
          <div className="stat-value">{stats.conversion}</div>
          <div className="stat-subtext positive">+1.1% vs last 7d</div>
          <Sparkline color="#0ea5e9" />
        </div>

        {/* Card 7 */}
        <div className="stat-card" style={{cursor: 'pointer'}} onClick={() => navigate('/users')}>
          <div className="stat-header">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>
            Referrals
          </div>
          <div className="stat-value">{stats.referrals}</div>
          <div className="stat-subtext positive">+8.4% vs last 7d</div>
          <Sparkline color="#ef4444" />
        </div>

        {/* Card 8 */}
        <div className="stat-card" style={{cursor: 'pointer'}} onClick={() => navigate('/series')}>
          <div className="stat-header">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#14b8a6" strokeWidth="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg>
            Active Tests
          </div>
          <div className="stat-value">{stats.activeTests}</div>
          <div className="stat-subtext positive">+3 vs last 7d</div>
          <Sparkline color="#14b8a6" />
        </div>
      </div>

      {/* Active Users Modal */}
      {isUsersModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div className="glass-panel" style={{
            width: '100%',
            maxWidth: '650px',
            padding: '2rem',
            position: 'relative',
            maxHeight: '85vh',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <button 
              onClick={() => setIsUsersModalOpen(false)}
              style={{
                position: 'absolute',
                top: '1.25rem',
                right: '1.25rem',
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                fontSize: '1.5rem',
                cursor: 'pointer'
              }}
            >&times;</button>
            
            <h2 style={{ marginBottom: '1.5rem', fontSize: '1.4rem' }}>
              {modalType === 'paid' ? 'Paid Users (Active Subscriptions)' : 
               modalType === 'daily_rev' ? 'Today\'s Revenue Transactions' : 
               'Platform Conversion Overview'}
              <span style={{ fontSize: '1rem', color: 'var(--primary)', marginLeft: '10px' }}>
                {modalType === 'paid' ? activeUsers.length : 
                 modalType === 'daily_rev' ? stats.revenueToday : 
                 stats.conversion}
              </span>
            </h2>
            
            <div style={{ overflowY: 'auto', flex: 1, paddingRight: '0.5rem' }}>
              {modalType === 'conversion' && !isLoadingUsers && (
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <div style={{ flex: 1, textAlign: 'center' }}>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Total Registered Users</div>
                    <div style={{ fontSize: '1.4rem', fontWeight: 'bold' }}>{stats.totalUsers}</div>
                  </div>
                  <div style={{ flex: 1, textAlign: 'center', borderLeft: '1px solid rgba(255,255,255,0.1)' }}>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Total Paid Users</div>
                    <div style={{ fontSize: '1.4rem', fontWeight: 'bold', color: 'var(--success)' }}>{stats.paidUsers}</div>
                  </div>
                  <div style={{ flex: 1, textAlign: 'center', borderLeft: '1px solid rgba(255,255,255,0.1)' }}>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Conversion Rate</div>
                    <div style={{ fontSize: '1.4rem', fontWeight: 'bold', color: 'var(--primary)' }}>{stats.conversion}</div>
                  </div>
                </div>
              )}

              {isLoadingUsers ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>Loading...</div>
              ) : activeUsers.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                  {modalType === 'paid' || modalType === 'conversion' ? 'No paid users found.' : 'No revenue transactions recorded today.'}
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                  {activeUsers.map(user => (
                    <div key={user._id} style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center', 
                      padding: '1rem', 
                      background: 'rgba(255,255,255,0.03)', 
                      borderRadius: '8px',
                      border: '1px solid rgba(255,255,255,0.05)'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <img 
                          src={user.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`} 
                          alt={user.name} 
                          style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} 
                        />
                        <div>
                          <div style={{ fontWeight: 600, color: 'var(--text)' }}>{user.name}</div>
                          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{user.email}</div>
                          {user.mobileNumber && <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{user.mobileNumber}</div>}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Plan</div>
                        <div style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--success)' }}>
                          {user.plan?.name || 'Active'} <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>(₹{user.plan?.price || 0})</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div style={{ marginTop: '1.5rem', textAlign: 'right' }}>
              <button className="btn-primary" onClick={() => navigate('/users')}>
                Manage All Users
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardOverview;
