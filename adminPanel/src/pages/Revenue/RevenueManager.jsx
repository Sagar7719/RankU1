import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const RevenueManager = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [stats, setStats] = useState({
    monthlyRev: '₹0',
    revenueToday: '₹0',
    totalSubscribers: 0
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Payment Form State
  const [formData, setFormData] = useState({
    name: '12 Months Plan',
    price: 299,
    buyDate: new Date().toISOString().slice(0, 16), // YYYY-MM-DDThh:mm
    expireDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().slice(0, 16),
    paymentMethod: 'UPI',
    transactionId: `TXN${Math.floor(100000000 + Math.random() * 900000000)}`
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [usersRes, statsRes] = await Promise.all([
        api.get('/admin/users'),
        api.get('/admin/stats?filter=30D')
      ]);
      
      setUsers(usersRes.data);
      setStats({
        monthlyRev: statsRes.data.monthlyRev ?? '₹0',
        revenueToday: statsRes.data.revenueToday ?? '₹0',
        totalSubscribers: statsRes.data.paidUsers ?? 0
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filter users who have active subscriptions
  const activeSubscriptions = users.filter(u => u.plan && u.plan.isActive);
  
  // For selecting a user to add a plan
  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePlanSelect = (e) => {
    const planName = e.target.value;
    let price = 0;
    let months = 1;
    if (planName === '6 Months Plan') { price = 199; months = 6; }
    else if (planName === '12 Months Plan') { price = 299; months = 12; }
    else if (planName === 'Lifetime Access') { price = 999; months = 1200; }
    
    const buyDate = new Date(formData.buyDate || new Date());
    const expireDate = new Date(buyDate);
    expireDate.setMonth(expireDate.getMonth() + months);

    setFormData(prev => ({
      ...prev,
      name: planName,
      price,
      expireDate: expireDate.toISOString().slice(0, 16)
    }));
  };

  const handleAddPayment = async (e) => {
    e.preventDefault();
    if (!selectedUserId) {
      alert("Please select a user");
      return;
    }
    
    try {
      await api.put(`/admin/users/${selectedUserId}/subscription`, formData);
      setIsModalOpen(false);
      setFormData({
        name: '12 Months Plan',
        price: 299,
        buyDate: new Date().toISOString().slice(0, 16),
        expireDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().slice(0, 16),
        paymentMethod: 'UPI',
        transactionId: `TXN${Math.floor(100000000 + Math.random() * 900000000)}`
      });
      setSelectedUserId('');
      setSearchQuery('');
      fetchData(); // Refresh data
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add payment detail');
    }
  };

  const handleRemovePayment = async (userId) => {
    if (!window.confirm('Are you sure you want to remove this subscription payment detail? It will be deducted from the revenue.')) {
      return;
    }
    
    try {
      await api.delete(`/admin/users/${userId}/subscription`);
      fetchData(); // Refresh data
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to remove payment detail');
    }
  };

  if (loading) return <div style={{ padding: '2rem' }}>Loading revenue data...</div>;
  if (error) return <div style={{ color: 'var(--danger)', padding: '2rem' }}>{error}</div>;

  return (
    <div className="content-scrollable">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
        <div>
          <h1 className="page-title">Monthly Revenue & Subscriptions</h1>
          <p className="text-muted text-sm" style={{ fontWeight: 500, marginTop: '0.25rem' }}>
            Manage user payment details and track platform revenue
          </p>
        </div>
        <button 
          className="btn-primary" 
          onClick={() => setIsModalOpen(true)}
          style={{ padding: '0.6rem 1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          Add Payment Detail
        </button>
      </div>
      
      <div className="stats-grid" style={{ marginBottom: '2rem' }}>
        <div className="stat-card">
          <div className="stat-header">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ec4899" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
            Monthly Revenue
          </div>
          <div className="stat-value">{stats.monthlyRev}</div>
        </div>
        <div className="stat-card">
          <div className="stat-header">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
            Revenue Today
          </div>
          <div className="stat-value">{stats.revenueToday}</div>
        </div>
        <div className="stat-card">
          <div className="stat-header">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2"><rect x="2" y="5" width="20" height="14" rx="2"></rect><line x1="2" y1="10" x2="22" y2="10"></line></svg>
            Total Paid Users
          </div>
          <div className="stat-value">{stats.totalSubscribers}</div>
        </div>
      </div>
      
      <div className="glass-panel" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '1000px' }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.05)', textAlign: 'left', borderBottom: '1px solid var(--border)' }}>
                <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>User</th>
                <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Plan Details</th>
                <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Amount</th>
                <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Buy Date</th>
                <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Expiry Date</th>
                <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Transaction Info</th>
                <th style={{ padding: '1rem', textAlign: 'right', color: 'var(--text-muted)' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {activeSubscriptions.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    No active subscription payments found.
                  </td>
                </tr>
              ) : (
                activeSubscriptions.map(user => (
                  <tr key={user._id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ fontWeight: 600, color: 'var(--text)' }}>{user.name}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{user.email}</div>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{ 
                        background: 'rgba(59, 130, 246, 0.1)', 
                        color: '#3b82f6', 
                        padding: '0.25rem 0.5rem', 
                        borderRadius: '4px',
                        fontSize: '0.85rem',
                        fontWeight: 500
                      }}>
                        {user.plan.name}
                      </span>
                    </td>
                    <td style={{ padding: '1rem', fontWeight: 600, color: '#10b981' }}>
                      ₹{user.plan.price}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ fontSize: '0.9rem' }}>{new Date(user.plan.buyDate).toLocaleDateString()}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {new Date(user.plan.buyDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </div>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ fontSize: '0.9rem' }}>{new Date(user.plan.expireDate).toLocaleDateString()}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {new Date(user.plan.expireDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </div>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ fontSize: '0.9rem' }}>{user.plan.paymentMethod || 'N/A'}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user.plan.transactionId || 'N/A'}</div>
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                      <button 
                        onClick={() => handleRemovePayment(user._id)}
                        style={{ 
                          background: 'rgba(239, 68, 68, 0.1)', 
                          color: 'var(--danger)', 
                          border: '1px solid rgba(239, 68, 68, 0.3)', 
                          padding: '0.4rem 0.8rem', 
                          borderRadius: '4px', 
                          cursor: 'pointer', 
                          fontSize: '0.85rem',
                          transition: 'all 0.2s'
                        }}
                        onMouseOver={(e) => e.target.style.background = 'rgba(239, 68, 68, 0.2)'}
                        onMouseOut={(e) => e.target.style.background = 'rgba(239, 68, 68, 0.1)'}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Payment Modal */}
      {isModalOpen && (
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
            maxWidth: '550px',
            padding: '2rem',
            position: 'relative',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <button 
              onClick={() => setIsModalOpen(false)}
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                fontSize: '1.5rem',
                cursor: 'pointer'
              }}
            >&times;</button>
            
            <h2 style={{ marginBottom: '1.5rem', fontSize: '1.4rem' }}>Add Subscription Payment</h2>
            
            <form onSubmit={handleAddPayment} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              
              {/* User Selection */}
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                  Select User *
                </label>
                {!selectedUserId ? (
                  <>
                    <input 
                      type="text" 
                      placeholder="Search user by name or email..." 
                      className="form-input"
                      style={{ marginBottom: '0.5rem' }}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <div style={{ maxHeight: '150px', overflowY: 'auto', background: 'rgba(0,0,0,0.2)', borderRadius: '6px', border: '1px solid var(--border)' }}>
                      {filteredUsers.length > 0 ? filteredUsers.slice(0, 10).map(u => (
                        <div 
                          key={u._id} 
                          onClick={() => setSelectedUserId(u._id)}
                          style={{ padding: '0.75rem', borderBottom: '1px solid var(--border)', cursor: 'pointer' }}
                          onMouseOver={(e) => e.target.style.background = 'rgba(255,255,255,0.05)'}
                          onMouseOut={(e) => e.target.style.background = 'transparent'}
                        >
                          <div style={{ fontWeight: 600 }}>{u.name}</div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{u.email}</div>
                        </div>
                      )) : (
                        <div style={{ padding: '0.75rem', color: 'var(--text-muted)' }}>No users found</div>
                      )}
                    </div>
                  </>
                ) : (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '6px' }}>
                    <div>
                      <div style={{ fontWeight: 600, color: '#10b981' }}>{users.find(u => u._id === selectedUserId)?.name}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{users.find(u => u._id === selectedUserId)?.email}</div>
                    </div>
                    <button 
                      type="button"
                      onClick={() => setSelectedUserId('')}
                      style={{ background: 'transparent', border: 'none', color: 'var(--danger)', cursor: 'pointer', fontSize: '0.8rem' }}
                    >
                      Change
                    </button>
                  </div>
                )}
              </div>

              {/* Plan Selection */}
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                  Plan Template
                </label>
                <select 
                  className="form-input" 
                  value={formData.name}
                  onChange={handlePlanSelect}
                  style={{ width: '100%' }}
                >
                  <option value="6 Months Plan">6 Months Plan</option>
                  <option value="12 Months Plan">12 Months Plan</option>
                  <option value="Lifetime Access">Lifetime Access</option>
                  <option value="Custom Plan">Custom Plan</option>
                </select>
              </div>

              {/* Custom Plan Name (if Custom) */}
              {formData.name === 'Custom Plan' && (
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                    Custom Plan Name
                  </label>
                  <input 
                    type="text" 
                    name="name"
                    className="form-input" 
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter custom plan name"
                    style={{ width: '100%' }}
                  />
                </div>
              )}

              {/* Price */}
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                  Price Paid (₹) *
                </label>
                <input 
                  type="number" 
                  name="price"
                  className="form-input" 
                  value={formData.price}
                  onChange={handleInputChange}
                  min="0"
                  required
                  style={{ width: '100%' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                {/* Buy Date & Time */}
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                    Buy Date & Time *
                  </label>
                  <input 
                    type="datetime-local" 
                    name="buyDate"
                    className="form-input" 
                    value={formData.buyDate}
                    onChange={handleInputChange}
                    required
                    style={{ width: '100%' }}
                  />
                </div>

                {/* Expire Date & Time */}
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                    Expiry Date & Time *
                  </label>
                  <input 
                    type="datetime-local" 
                    name="expireDate"
                    className="form-input" 
                    value={formData.expireDate}
                    onChange={handleInputChange}
                    required
                    style={{ width: '100%' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                {/* Payment Method */}
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                    Payment Method
                  </label>
                  <select 
                    name="paymentMethod"
                    className="form-input" 
                    value={formData.paymentMethod}
                    onChange={handleInputChange}
                    style={{ width: '100%' }}
                  >
                    <option value="UPI">UPI</option>
                    <option value="Card">Card</option>
                    <option value="NetBanking">Net Banking</option>
                    <option value="Wallet">Wallet</option>
                    <option value="Cash">Cash</option>
                    <option value="Admin Grant">Admin Grant</option>
                  </select>
                </div>

                {/* Transaction ID */}
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                    Transaction ID
                  </label>
                  <input 
                    type="text" 
                    name="transactionId"
                    className="form-input" 
                    value={formData.transactionId}
                    onChange={handleInputChange}
                    placeholder="Optional"
                    style={{ width: '100%' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)} style={{ padding: '0.6rem 1.2rem', background: 'transparent', border: '1px solid var(--border)', color: 'var(--text)', borderRadius: '6px', cursor: 'pointer' }}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" style={{ padding: '0.6rem 1.2rem' }}>
                  Save Payment Detail
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default RevenueManager;
