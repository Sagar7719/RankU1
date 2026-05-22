import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import './Rewards.css';

const Rewards = () => {
  const { user } = useAuth();
  const [couponCode, setCouponCode] = useState('');
  const [couponResult, setCouponResult] = useState(null);
  const [referralStats, setReferralStats] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchReferralStats();
    }
  }, [user]);

  const fetchReferralStats = async () => {
    try {
      const res = await api.get('/rewards/referral-stats');
      setReferralStats(res.data);
    } catch (error) {
      console.error("Error fetching referral stats:", error);
    }
  };

  const handleValidateCoupon = async (e) => {
    e.preventDefault();
    if (!couponCode) return;

    try {
      setLoading(true);
      setCouponResult(null);
      const res = await api.post('/rewards/validate', { code: couponCode });
      setCouponResult({ success: true, data: res.data });
    } catch (error) {
      setCouponResult({ success: false, message: error.response?.data?.message || "Invalid coupon" });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (referralStats) {
      navigator.clipboard.writeText(referralStats.referralCode);
      alert("Referral code copied to clipboard! 🚀");
    }
  };

  if (!user) {
    return (
      <div className="rewards-container" style={{ textAlign: 'center', paddingTop: '10rem' }}>
        <h1 style={{ fontSize: '2.5rem' }}>Login to Claim Rewards</h1>
        <p>Unlock exclusive discounts and referral benefits today.</p>
        <button className="apply-btn" style={{ marginTop: '20px', padding: '15px 40px' }} onClick={() => window.location.href = '/login'}>
          Login Now
        </button>
      </div>
    );
  }

  return (
    <div className="rewards-container">
      <h1>My Rewards 🎁</h1>
      <p>Manage your points, redeem coupons, and invite friends to earn more.</p>

      {/* Points Summary Dashboard */}
      <div className="points-dashboard">
        <div className="points-info">
          <h2>Total Balance</h2>
          <div className="points-value">
            {referralStats?.rewardPoints || 0} <span>Points</span>
          </div>
          <p style={{ color: '#a5b4fc', marginTop: '10px' }}>
            Earn 50 points for every friend who joins!
          </p>
        </div>
        <div className="points-icon">🏆</div>
      </div>

      <div className="rewards-grid">
        {/* Coupon Section */}
        <div className="reward-card">
          <h2>🎟️ Redeem Coupon</h2>
          <p>Apply a discount code to your account for upcoming test series purchases.</p>
          
          <form onSubmit={handleValidateCoupon} className="coupon-box">
            <input 
              type="text" 
              placeholder="Enter Code (e.g. RANKU1)" 
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
            />
            <button className="apply-btn" disabled={loading}>
              {loading ? "..." : "Apply"}
            </button>
          </form>

          {couponResult?.success && (
            <span className="success-text">
              ✨ <strong>{couponResult.data.discountPercentage}% OFF</strong> Coupon Applied!
            </span>
          )}
          {couponResult?.success === false && (
            <span className="error-text">⚠️ {couponResult.message}</span>
          )}
        </div>

        {/* Referral Section */}
        <div className="reward-card">
          <h2>🤝 Refer & Earn</h2>
          <p>Your friends get access to premium tests, and you get 50 reward points per referral.</p>
          
          <div className="referral-info">
            <span className="ref-label">Your Unique Referral Code</span>
            <span className="ref-code">{referralStats?.referralCode || "------"}</span>
            <button className="copy-btn" onClick={copyToClipboard}>
              Copy & Share
            </button>
          </div>

          <div className="referred-list">
            <h3>Recent Referrals ({referralStats?.totalReferred || 0})</h3>
            {referralStats?.referredUsers.length > 0 ? (
              referralStats.referredUsers.slice(0, 5).map((ref, idx) => (
                <div key={idx} className="referred-item">
                  <span className="referred-name">{ref.name}</span>
                  <span className="referred-date">{new Date(ref.createdAt).toLocaleDateString()}</span>
                </div>
              ))
            ) : (
              <p style={{ fontSize: '0.9rem', color: '#64748b', marginTop: '10px' }}>
                No friends referred yet. Let's grow the community!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Rewards;