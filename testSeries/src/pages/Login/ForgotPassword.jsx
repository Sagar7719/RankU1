import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api/axios';
import "./Login.css";

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [identifier, setIdentifier] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    if (!identifier) return setError("Please enter your Gmail address or Mobile number");
    setError('');
    setMessage('');
    try {
      setLoading(true);
      const res = await api.post('/auth/forgot-password', { identifier });
      setMessage(res.data.message || "Verification code sent to your Gmail.");
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to request verification code');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!otp || !newPassword) return setError("Please fill in all fields");
    setError('');
    setMessage('');
    try {
      setLoading(true);
      await api.post('/auth/reset-password', { identifier, otp, newPassword });
      setMessage("Password reset successfully! Redirecting to login...");
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="loginContainer">
      <div className="loginCard">
        <h2 className="loginTitle">Account Recovery</h2>
        <p className="loginSubtitle">Reset your password via Gmail OTP</p>
        
        {message && (
          <div style={{ color: '#10b981', margin: '15px 0 5px 0', padding: '10px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '8px', fontSize: '0.9rem' }}>
            {message}
          </div>
        )}
        {error && (
          <div style={{ color: '#ef4444', margin: '15px 0 5px 0', padding: '10px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px', fontSize: '0.9rem' }}>
            {error}
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleRequestOtp} className="loginForm">
            <input 
              type="text" 
              placeholder="Gmail Address or Mobile Number" 
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
              style={{ textAlign: 'center' }}
            />
            <button type="submit" disabled={loading}>
              {loading ? 'Sending code...' : 'Send Verification Code'}
            </button>
            <div style={{ textAlign: 'center', marginTop: '10px' }}>
              <Link to="/login" style={{ fontSize: '0.9rem', color: '#4f46e5', fontWeight: 600 }}>Back to Login</Link>
            </div>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="loginForm" style={{ marginTop: '20px' }}>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Enter the 6-digit verification code sent to your registered Gmail for <strong>{identifier}</strong>
            </p>
            <input 
              type="text" 
              placeholder="6-digit Verification Code" 
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              maxLength="6"
              style={{ textAlign: 'center', letterSpacing: '4px', fontSize: '1.1rem' }}
            />
            <input 
              type="password" 
              placeholder="New Secure Password" 
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength="6"
            />
            <button type="submit" disabled={loading}>
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
