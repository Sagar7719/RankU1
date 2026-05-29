import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [identifier, setIdentifier] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    if (!identifier) return setError("Please enter your Gmail address or Mobile number");
    setError('');
    setMessage('');
    try {
      const res = await api.post('/auth/forgot-password', { identifier });
      setMessage(res.data.message || 'Verification code sent to your Gmail.');
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to request OTP');
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (newPassword !== confirmPassword) {
      return setError('Passwords do not match');
    }

    try {
      const res = await api.post('/auth/reset-password', { identifier, otp, newPassword });
      setMessage(res.data.message || 'Password reset successfully!');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
      <div className="glass-panel" style={{ width: '400px' }}>
        <h2 className="page-title" style={{ textAlign: 'center', marginBottom: '1rem' }}>Account Recovery</h2>
        
        {message && <div style={{ color: 'var(--accent)', marginBottom: '1rem', padding: '0.75rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '8px', textAlign: 'center' }}>{message}</div>}
        {error && <div style={{ color: 'var(--danger)', marginBottom: '1rem', padding: '0.75rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px', textAlign: 'center' }}>{error}</div>}

        {step === 1 ? (
          <form onSubmit={handleRequestOtp} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center' }}>
              Enter your registered Gmail address or Mobile number to receive a 6-digit verification code.
            </p>
            <input 
              type="text" 
              placeholder="Gmail Address or Mobile Number" 
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
              style={{ textAlign: 'center' }}
            />
            <button type="submit" className="btn-primary" style={{ marginTop: '0.5rem' }}>Send Verification Code</button>
            <div style={{ textAlign: 'center', marginTop: '1rem' }}>
              <Link to="/login" style={{ fontSize: '0.85rem' }}>Back to Login</Link>
            </div>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textAlign: 'center' }}>
              Enter the 6-digit verification code sent to your registered Gmail for <strong>{identifier}</strong>
            </p>
            <input 
              type="text" 
              placeholder="Enter 6-digit OTP" 
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              maxLength="6"
              style={{ textAlign: 'center', letterSpacing: '4px', fontSize: '1.1rem' }}
            />
            <input 
              type="password" 
              placeholder="New Password" 
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength="6"
            />
            <input 
              type="password" 
              placeholder="Confirm New Password" 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength="6"
            />
            <button type="submit" className="btn-primary" style={{ marginTop: '0.5rem' }}>Reset Password</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
