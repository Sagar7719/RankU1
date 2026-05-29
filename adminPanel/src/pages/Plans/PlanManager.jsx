/* eslint-disable */
import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const PlanManager = () => {
  const [plans, setPlans] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPlan, setCurrentPlan] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    discountPercentage: '',
    duration: '',
    features: '',
    isRecommended: false,
    isActive: true
  });

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/plans');
      setPlans(res.data);
    } catch (error) {
      console.error("Error fetching plans:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenModal = (plan = null) => {
    if (plan) {
      setCurrentPlan(plan);
      setFormData({
        name: plan.name || '',
        description: plan.description || '',
        price: plan.price || '',
        originalPrice: plan.originalPrice || '',
        discountPercentage: plan.discountPercentage || '',
        duration: plan.duration || '',
        features: plan.features ? plan.features.join('\n') : '',
        isRecommended: plan.isRecommended || false,
        isActive: plan.isActive ?? true
      });
    } else {
      setCurrentPlan(null);
      setFormData({
        name: '',
        description: '',
        price: '',
        originalPrice: '',
        discountPercentage: '',
        duration: '',
        features: '',
        isRecommended: false,
        isActive: true
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentPlan(null);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        price: Number(formData.price),
        originalPrice: Number(formData.originalPrice),
        features: formData.features.split('\n').filter(f => f.trim() !== '')
      };

      if (currentPlan) {
        await api.put(`/plans/${currentPlan._id}`, payload);
      } else {
        await api.post('/plans', payload);
      }
      
      handleCloseModal();
      fetchPlans();
    } catch (error) {
      console.error("Error saving plan:", error);
      alert("Failed to save plan. See console.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this plan?")) {
      try {
        await api.delete(`/plans/${id}`);
        fetchPlans();
      } catch (error) {
        console.error("Error deleting plan:", error);
      }
    }
  };

  return (
    <div className="page-container content-scrollable">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 className="page-title">Subscription Plans</h1>
        <button className="btn-primary" onClick={() => handleOpenModal()} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg> Add New Plan
        </button>
      </div>

      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Loading plans...</div>
      ) : (
        <div className="glass-panel" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.05)', textAlign: 'left', borderBottom: '1px solid var(--border-color)' }}>
                  <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Plan Name</th>
                  <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Price</th>
                  <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Original</th>
                  <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Duration</th>
                  <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Status</th>
                  <th style={{ padding: '1rem', textAlign: 'right', color: 'var(--text-muted)' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {plans.map(plan => (
                  <tr key={plan._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '1rem' }}>
                    <div style={{ fontWeight: 600 }}>{plan.name}</div>
                    {plan.isRecommended && <span style={{ fontSize: '0.75rem', background: 'var(--primary)', color: 'white', padding: '2px 6px', borderRadius: '4px', marginLeft: '5px' }}>Recommended</span>}
                    </td>
                    <td style={{ padding: '1rem', color: 'var(--success)', fontWeight: 'bold' }}>₹{plan.price}</td>
                    <td style={{ padding: '1rem', textDecoration: 'line-through', color: 'var(--text-muted)' }}>₹{plan.originalPrice}</td>
                    <td style={{ padding: '1rem' }}>{plan.duration}</td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '0.85rem',
                        background: plan.isActive ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                        color: plan.isActive ? 'var(--success)' : 'var(--danger)'
                      }}>
                        {plan.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                      <button onClick={() => handleOpenModal(plan)} className="btn-icon" style={{ color: 'var(--primary)', background: 'rgba(59, 130, 246, 0.1)' }} title="Edit">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                      </button>
                      <button onClick={() => handleDelete(plan._id)} className="btn-icon" style={{ color: 'var(--danger)', background: 'rgba(239, 68, 68, 0.1)' }} title="Delete">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {plans.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                    No plans found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          </div>
        </div>
      )}

      {/* Plan Modal */}
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
            maxWidth: '600px',
            padding: '2rem',
            position: 'relative',
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <button 
              onClick={handleCloseModal}
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
            ><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></button>
            
            <h2 style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>{currentPlan ? 'Edit Plan' : 'Add New Plan'}</h2>
            
            <form onSubmit={handleSubmit} style={{ overflowY: 'auto', paddingRight: '0.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Plan Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleInputChange} required style={{ width: '100%' }} placeholder="e.g. 6 Months Plan" />
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Price (₹)</label>
                  <input type="number" name="price" value={formData.price} onChange={handleInputChange} required style={{ width: '100%' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Original Price (₹)</label>
                  <input type="number" name="originalPrice" value={formData.originalPrice} onChange={handleInputChange} required style={{ width: '100%' }} />
                </div>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Discount Badge Text</label>
                  <input type="text" name="discountPercentage" value={formData.discountPercentage} onChange={handleInputChange} style={{ width: '100%' }} placeholder="e.g. 60% OFF" />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Duration Text</label>
                  <input type="text" name="duration" value={formData.duration} onChange={handleInputChange} required style={{ width: '100%' }} placeholder="e.g. Access for 6 Months" />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Description</label>
                <input type="text" name="description" value={formData.description} onChange={handleInputChange} style={{ width: '100%' }} placeholder="Brief description of the plan..." />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Features (One per line)</label>
                <textarea 
                  name="features" 
                  value={formData.features} 
                  onChange={handleInputChange} 
                  style={{ width: '100%', minHeight: '120px' }} 
                  rows="4"
                  placeholder="Unlimited Practice Tests&#10;Advanced Category Analytics"
                />
              </div>

              <div style={{ display: 'flex', gap: '2rem', marginTop: '0.5rem', padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                  <input type="checkbox" name="isRecommended" checked={formData.isRecommended} onChange={handleInputChange} style={{ width: 'auto' }} />
                  Highlight as Recommended
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                  <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleInputChange} style={{ width: 'auto' }} />
                  Plan is Active
                </label>
              </div>

              <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
                <button type="button" className="btn-outline" onClick={handleCloseModal}>Cancel</button>
                <button type="submit" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg> Save Plan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlanManager;
