import { useState } from "react";
import { loginUser, requestLoginOtp, loginWithOtp } from "../../services/authService";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Login.css";

const Login = () => {
  const [loginMethod, setLoginMethod] = useState('email');
  
  // Email states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  // Mobile states
  const [mobileNumber, setMobileNumber] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  
  const from = location.state?.from || "/dashboard";

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) return alert("Please fill all fields");

    try {
      setLoading(true);
      const response = await loginUser({ email, password });
      if (response.user.role === 'user') {
        login(response.user, response.token);
        navigate(from, { replace: true });
      } else {
        alert("Admins should use the admin panel");
      }
    } catch (error) {
      alert(error?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    if (!mobileNumber) return alert("Please enter mobile number");

    try {
      setLoading(true);
      await requestLoginOtp(mobileNumber);
      alert("OTP sent successfully to console (simulated)");
      setOtpSent(true);
    } catch (error) {
      alert(error?.response?.data?.message || "Failed to request OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpLogin = async (e) => {
    e.preventDefault();
    if (!mobileNumber || !otp) return alert("Please fill all fields");

    try {
      setLoading(true);
      const response = await loginWithOtp({ mobileNumber, otp });
      if (response.user.role === 'user') {
        login(response.user, response.token);
        navigate(from, { replace: true });
      } else {
        alert("Admins should use the admin panel");
      }
    } catch (error) {
      alert(error?.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="loginContainer">
      <div className="loginCard">
        <h2 className="loginTitle">Welcome Back 👋</h2>
        <p className="loginSubtitle">Login to continue your journey</p>

        {/* Tab Toggle */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <button 
            type="button" 
            onClick={() => { setLoginMethod('email'); setOtpSent(false); }}
            style={{ flex: 1, padding: '8px', border: '1px solid #ccc', borderRadius: '4px', background: loginMethod === 'email' ? '#4f46e5' : 'white', color: loginMethod === 'email' ? 'white' : '#333', cursor: 'pointer' }}
          >
            Email
          </button>
          <button 
            type="button" 
            onClick={() => { setLoginMethod('mobile'); }}
            style={{ flex: 1, padding: '8px', border: '1px solid #ccc', borderRadius: '4px', background: loginMethod === 'mobile' ? '#4f46e5' : 'white', color: loginMethod === 'mobile' ? 'white' : '#333', cursor: 'pointer' }}
          >
            Mobile OTP
          </button>
        </div>

        {loginMethod === 'email' ? (
          <form onSubmit={handleEmailLogin} className="loginForm">
            <input
              type="email"
              placeholder="Email"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
            />
            
            <div style={{ position: 'relative', width: '100%' }}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                required
                onChange={(e) => setPassword(e.target.value)}
                style={{ width: '100%' }}
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', cursor: 'pointer', color: '#666', fontWeight: 'bold' }}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            <div style={{ textAlign: 'right', marginTop: '-10px', marginBottom: '10px' }}>
              <Link to="/forgot-password" style={{ fontSize: '0.85rem', color: '#4f46e5', textDecoration: 'none' }}>Forgot Password?</Link>
            </div>

            <button type="submit" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        ) : (
          <div>
            {!otpSent ? (
              <form onSubmit={handleRequestOtp} className="loginForm">
                <input
                  type="tel"
                  placeholder="Registered Mobile Number"
                  value={mobileNumber}
                  required
                  onChange={(e) => setMobileNumber(e.target.value)}
                />
                <button type="submit" disabled={loading}>
                  {loading ? "Sending..." : "Send OTP"}
                </button>
              </form>
            ) : (
              <form onSubmit={handleOtpLogin} className="loginForm">
                <input
                  type="text"
                  placeholder="6-Digit OTP"
                  value={otp}
                  required
                  maxLength="6"
                  onChange={(e) => setOtp(e.target.value)}
                  style={{ textAlign: 'center', letterSpacing: '4px', fontSize: '1.2rem' }}
                />
                <button type="submit" disabled={loading}>
                  {loading ? "Verifying..." : "Verify & Login"}
                </button>
                <button type="button" onClick={() => setOtpSent(false)} style={{ background: 'transparent', color: '#666', marginTop: '10px', width: '100%', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>
                  Change Mobile Number
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;