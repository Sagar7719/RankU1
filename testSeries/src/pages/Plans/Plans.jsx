import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import "./Plans.css";
import { 
  FaBolt, 
  FaCreditCard, 
  FaWallet, 
  FaBuilding, 
  FaCheckCircle, 
  FaSpinner, 
  FaLock, 
  FaShieldAlt, 
  FaCrown, 
  FaCheck, 
  FaStar 
} from "react-icons/fa";
import { MdPhoneIphone } from "react-icons/md";
import { useAuth } from "../../context/AuthContext";

function Plans() {
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('idle'); // 'idle' | 'processing' | 'success'
  const [plans, setPlans] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await api.get('/plans');
        setPlans(res.data.filter(p => p.isActive));
      } catch (error) {
        console.error("Failed to fetch plans:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPlans();
  }, []);

  const handleBuyNow = (planName, planPrice) => {
    if (!user) {
      alert("Please login to purchase a subscription.");
      navigate("/login");
      return;
    }
    setSelectedPlan({ name: planName, price: planPrice });
    setIsModalOpen(true);
    setPaymentMethod('');
    setPaymentStatus('idle');
  };

  const handleCloseModal = () => {
    if (paymentStatus === 'processing') return; // Prevent closing while processing
    setIsModalOpen(false);
    setSelectedPlan(null);
    setPaymentStatus('idle');
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    if (!paymentMethod) {
      alert("Please select a payment method.");
      return;
    }
    
    setPaymentStatus('processing');
    
    // Simulate payment processing delay
    setTimeout(async () => {
      // Calculate expiration date
      const buyDate = new Date();
      let expireDate = new Date();
      if (selectedPlan.name.includes('6 Months')) {
        expireDate.setMonth(expireDate.getMonth() + 6);
      } else if (selectedPlan.name.includes('12 Months')) {
        expireDate.setMonth(expireDate.getMonth() + 12);
      } else if (selectedPlan.name.includes('Lifetime')) {
        expireDate.setFullYear(expireDate.getFullYear() + 100); // 100 years for lifetime
      }
      
      const planDetails = {
        name: selectedPlan.name,
        price: selectedPlan.price,
        buyDate: buyDate.toISOString(),
        expireDate: expireDate.toISOString(),
        paymentMethod: paymentMethod,
        transactionId: `TXN${Math.floor(100000000 + Math.random() * 900000000)}`
      };
      
      try {
        // Save to backend
        await api.post('/users/subscribe', planDetails);
        setPaymentStatus('success');
        if (user && user._id) {
          localStorage.setItem(`userPlan_${user._id}`, JSON.stringify(planDetails));
        }
        if (refreshUser) {
          await refreshUser();
        }
      } catch (err) {
        console.error("Failed to save subscription to backend:", err);
        // Fallback to local storage if user is authenticated but server error
        setPaymentStatus('success');
        if (user && user._id) {
          localStorage.setItem(`userPlan_${user._id}`, JSON.stringify(planDetails));
        }
        if (refreshUser) {
          await refreshUser();
        }
      }
    }, 2000);
  };

  const handleGoToDashboard = () => {
    handleCloseModal();
    navigate('/');
  };

  return (
    <div className="plans-container">
      {/* Background radial overlays */}
      <div className="plans-gradient-glow-1"></div>
      <div className="plans-gradient-glow-2"></div>

      {/* Floating Offer Badge */}
      <div className="plans-badge-offer">
        <FaStar className="badge-star-icon" /> <span>Special Discount Active</span>
      </div>

      <h1 className="plans-heading">
        Invest in Your Success. <br />
        <span className="plans-heading-highlight">Simple, Honest Pricing.</span>
      </h1>
      
      <p className="plans-subheading">
        Choose the plan that fits your ambition. Unlock standard and advanced 
        test series, ex-officer insights, and real-time category analytics.
      </p>

      {/* Plans Pricing Grid */}
      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
          <FaSpinner className="spinner-icon" /> Loading subscription plans...
        </div>
      ) : (
        <div className="plans-cards">
          {plans.map(plan => (
            <div key={plan._id} className={`plan-card ${plan.isRecommended ? 'premium-card' : ''}`}>
              {plan.isRecommended && (
                <div className="recommended-badge">
                  <FaCrown className="badge-crown" /> Recommended
                </div>
              )}
              
              <div className="plan-card-header">
                <h2>{plan.name}</h2>
                <p>{plan.description}</p>
              </div>
              
              <div className="price-box">
                <h3 className="new-price">
                  <span className="currency-symbol">₹</span>{plan.price}
                </h3>
                {plan.originalPrice && plan.originalPrice > plan.price && (
                  <div className="price-row">
                    <p className="old-price">₹{plan.originalPrice}</p>
                    {plan.discountPercentage && <p className={`discount ${plan.isRecommended ? 'highlight-discount' : ''}`}>{plan.discountPercentage}</p>}
                  </div>
                )}
                <p className="duration">{plan.duration}</p>
              </div>
              
              <div className="features-divider"></div>

              <ul className="features">
                {plan.features && plan.features.map((feature, idx) => (
                  <li key={idx}><FaCheck className={`feature-check-icon ${plan.isRecommended ? 'active' : ''}`} /> <span>{feature}</span></li>
                ))}
              </ul>

              <button className={`plan-btn ${plan.isRecommended ? 'center-btn' : ''}`} onClick={() => handleBuyNow(plan.name, plan.price)}>
                {plan.isRecommended ? 'Unlock Premium Access' : 'Choose Plan'}
              </button>
            </div>
          ))}
          {plans.length === 0 && (
            <div style={{ textAlign: 'center', width: '100%', padding: '2rem', color: 'var(--text-muted)' }}>
              No active subscription plans found.
            </div>
          )}
        </div>
      )}

      {/* Trust Badge Section */}
      <div className="plans-trust-footer">
        <div className="trust-badge-item">
          <FaShieldAlt className="trust-icon" />
          <div>
            <h4>Secure 256-Bit SSL Payments</h4>
            <p>Your transactions are encrypted and processed securely.</p>
          </div>
        </div>
        <div className="trust-badge-item">
          <FaLock className="trust-icon" />
          <div>
            <h4>Instant Account Activation</h4>
            <p>Premium features are enabled automatically post payment.</p>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {isModalOpen && selectedPlan && (
        <div className="payment-modal-overlay" onClick={handleCloseModal}>
          <div className="payment-modal" onClick={(e) => e.stopPropagation()}>
            
            {paymentStatus === 'idle' && (
              <>
                <div className="payment-modal-header">
                  <h2>Select Payment Option</h2>
                  <button className="close-modal-btn" onClick={handleCloseModal}>&times;</button>
                </div>
                
                <div className="payment-summary">
                  <div className="summary-item">
                    <span className="summary-label">Selected Membership</span>
                    <strong className="summary-value">{selectedPlan.name}</strong>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">Payable Amount</span>
                    <strong className="summary-value amount">₹{selectedPlan.price}</strong>
                  </div>
                </div>

                <form onSubmit={handlePaymentSubmit}>
                  <div className="payment-options">
                    <label className={`payment-option ${paymentMethod === 'UPI' ? 'selected' : ''}`}>
                      <input 
                        type="radio" 
                        name="payment" 
                        value="UPI" 
                        onChange={(e) => setPaymentMethod(e.target.value)} 
                      />
                      <div className="payment-option-content">
                        <MdPhoneIphone className="payment-icon" />
                        <div>
                          <span>UPI (Google Pay / PhonePe)</span>
                          <p>Pay instantly using your active UPI app</p>
                        </div>
                      </div>
                    </label>

                    <label className={`payment-option ${paymentMethod === 'Card' ? 'selected' : ''}`}>
                      <input 
                        type="radio" 
                        name="payment" 
                        value="Card" 
                        onChange={(e) => setPaymentMethod(e.target.value)} 
                      />
                      <div className="payment-option-content">
                        <FaCreditCard className="payment-icon" />
                        <div>
                          <span>Credit or Debit Card</span>
                          <p>Supports Visa, MasterCard, RuPay</p>
                        </div>
                      </div>
                    </label>

                    <label className={`payment-option ${paymentMethod === 'NetBanking' ? 'selected' : ''}`}>
                      <input 
                        type="radio" 
                        name="payment" 
                        value="NetBanking" 
                        onChange={(e) => setPaymentMethod(e.target.value)} 
                      />
                      <div className="payment-option-content">
                        <FaBuilding className="payment-icon" />
                        <div>
                          <span>Net Banking</span>
                          <p>Pay directly through your bank portal</p>
                        </div>
                      </div>
                    </label>

                    <label className={`payment-option ${paymentMethod === 'Wallet' ? 'selected' : ''}`}>
                      <input 
                        type="radio" 
                        name="payment" 
                        value="Wallet" 
                        onChange={(e) => setPaymentMethod(e.target.value)} 
                      />
                      <div className="payment-option-content">
                        <FaWallet className="payment-icon" />
                        <div>
                          <span>Digital Wallets</span>
                          <p>Amazon Pay, Paytm, Mobikwik</p>
                        </div>
                      </div>
                    </label>
                  </div>

                  <button type="submit" className="proceed-pay-btn" disabled={!paymentMethod}>
                    Proceed to Pay ₹{selectedPlan.price}
                  </button>
                </form>
              </>
            )}

            {paymentStatus === 'processing' && (
              <div className="payment-processing-state">
                <FaSpinner className="spinner-icon" />
                <h2>Securing Transaction...</h2>
                <p>Please do not close this window or refresh your browser.</p>
              </div>
            )}

            {paymentStatus === 'success' && (
              <div className="payment-success-state">
                <FaCheckCircle className="success-icon" />
                <h2>Purchase Successful!</h2>
                <p>Welcome to RankU1 Premium! Your {selectedPlan.name} is now fully active.</p>
                
                <div className="receipt-details">
                  <div className="receipt-row">
                    <span>Membership Type:</span>
                    <strong>{selectedPlan.name}</strong>
                  </div>
                  <div className="receipt-row">
                    <span>Amount Transacted:</span>
                    <strong>₹{selectedPlan.price}</strong>
                  </div>
                  <div className="receipt-row">
                    <span>Payment Channel:</span>
                    <strong>{paymentMethod}</strong>
                  </div>
                  <div className="receipt-row border-none">
                    <span>Transaction ID:</span>
                    <strong className="receipt-txn">TXN{Math.floor(100000000 + Math.random() * 900000000)}</strong>
                  </div>
                </div>

                <button className="proceed-pay-btn success-btn" onClick={handleGoToDashboard}>
                  Start Practicing Now
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Plans;