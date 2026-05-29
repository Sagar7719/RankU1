import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

const AdminLogin = () => {
  const [loginMethod, setLoginMethod] = useState('email'); // 'email' or 'mobile'
  
  // Email States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // Mobile OTP States
  const [mobileNumber, setMobileNumber] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data.user.role === 'admin') {
        localStorage.setItem('adminToken', res.data.token);
        window.location.href = '/';
      } else {
        setError('Access Denied. Admins only.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      const res = await api.post('/auth/login-otp/request', { mobileNumber });
      setMessage(res.data.message);
      setOtpSent(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP');
    }
  };

  const handleOtpLogin = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      const res = await api.post('/auth/login-otp/verify', { mobileNumber, otp });
      if (res.data.user.role === 'admin') {
        localStorage.setItem('adminToken', res.data.token);
        window.location.href = '/';
      } else {
        setError('Access Denied. Admins only.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid OTP');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', padding: '2rem' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '450px' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 className="page-title" style={{ marginBottom: '0.5rem' }}>Admin Portal</h2>
          <p style={{ color: 'var(--text-muted)' }}>Sign in to manage the TestSeries Engine</p>
        </div>

        {/* Custom Tabs */}
        <div style={{ display: 'flex', background: 'var(--bg-input)', borderRadius: '8px', padding: '0.25rem', marginBottom: '1.5rem' }}>
          <button 
            type="button"
            onClick={() => { setLoginMethod('email'); setError(''); setMessage(''); }}
            style={{ 
              flex: 1, padding: '0.5rem', borderRadius: '6px', fontSize: '0.9rem',
              background: loginMethod === 'email' ? 'var(--primary)' : 'transparent',
              color: loginMethod === 'email' ? 'white' : 'var(--text-muted)',
              fontWeight: loginMethod === 'email' ? '600' : 'normal'
            }}
          >
            Email & Password
          </button>
          <button 
            type="button"
            onClick={() => { setLoginMethod('mobile'); setError(''); setMessage(''); }}
            style={{ 
              flex: 1, padding: '0.5rem', borderRadius: '6px', fontSize: '0.9rem',
              background: loginMethod === 'mobile' ? 'var(--primary)' : 'transparent',
              color: loginMethod === 'mobile' ? 'white' : 'var(--text-muted)',
              fontWeight: loginMethod === 'mobile' ? '600' : 'normal'
            }}
          >
            Mobile OTP
          </button>
        </div>

        {message && <div style={{ color: 'var(--accent)', marginBottom: '1rem', padding: '0.75rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '8px', textAlign: 'center', fontSize: '0.9rem' }}>{message}</div>}
        {error && <div style={{ color: 'var(--danger)', marginBottom: '1rem', padding: '0.75rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px', textAlign: 'center', fontSize: '0.9rem' }}>{error}</div>}

        {loginMethod === 'email' ? (
          <form onSubmit={handleEmailLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Email Address</label>
              <input 
                type="email" 
                placeholder="admin@ranku1.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ width: '100%' }}
              />
            </div>
            
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Password</label>
                <Link to="/forgot-password" style={{ fontSize: '0.85rem' }}>Forgot password?</Link>
              </div>
              <div style={{ position: 'relative' }}>
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{ width: '100%', paddingRight: '2.5rem' }}
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', background: 'transparent', border: 'none', padding: 0 }}
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  )}
                </button>
              </div>
            </div>

            <button type="submit" className="btn-primary" style={{ marginTop: '0.5rem', width: '100%' }}>Sign In</button>
          </form>
        ) : (
          <div>
            {!otpSent ? (
              <form onSubmit={handleRequestOtp} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Registered Mobile Number</label>
                  <input 
                    type="tel" 
                    placeholder="e.g. 1234567890" 
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    required
                    style={{ width: '100%' }}
                  />
                </div>
                <button type="submit" className="btn-primary" style={{ marginTop: '0.5rem', width: '100%' }}>Send Verification Code</button>
              </form>
            ) : (
              <form onSubmit={handleOtpLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Enter 6-Digit OTP</label>
                  <input 
                    type="text" 
                    placeholder="••••••" 
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                    maxLength="6"
                    style={{ width: '100%', letterSpacing: '0.25rem', textAlign: 'center', fontSize: '1.25rem' }}
                  />
                </div>
                <button type="submit" className="btn-primary" style={{ marginTop: '0.5rem', width: '100%' }}>Verify & Login</button>
                <div style={{ textAlign: 'center' }}>
                  <button type="button" onClick={() => setOtpSent(false)} style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textDecoration: 'underline' }}>Change Mobile Number</button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminLogin;
