import { useState } from "react";
import {
  registerUser,
  verifyRegistrationOtp,
  resendRegistrationOtp
} from "../../services/authService";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Register.css";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [password, setPassword] = useState("");

  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpIdentifier, setOtpIdentifier] = useState("");

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !password || !mobileNumber) {
      alert("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      const response = await registerUser({
        name,
        email,
        mobileNumber,
        password
      });

      setOtpIdentifier(email);
      setOtpSent(true);
      alert(
        response.message ||
          "Registration successful. Please verify OTP before logging in."
      );
    } catch (error) {
      console.error(error);
      alert(error?.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    if (!otp) {
      alert("Please enter the verification code");
      return;
    }

    try {
      setLoading(true);

      const response = await verifyRegistrationOtp({
        identifier: otpIdentifier,
        otp
      });

      alert("Account verified and logged in successfully!");
      login(response.user, response.token);
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      alert(error?.response?.data?.message || "Invalid or expired OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      setLoading(true);
      const response = await resendRegistrationOtp(otpIdentifier);
      alert(response.message || "A new verification code has been sent.");
    } catch (error) {
      console.error(error);
      alert(error?.response?.data?.message || "Failed to resend code");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="registerContainer">
      <div className="registerCard">
        <h2 className="registerTitle">
          {otpSent ? "Verify Account 🔑" : "Create Account 🚀"}
        </h2>

        <p className="registerSubtitle">
          {otpSent
            ? "Enter the verification code sent to your email to activate your account"
            : "Join RankU1 and start your preparation"}
        </p>

        {otpSent ? (
          <form onSubmit={handleVerifyOtp} className="registerForm">
            <p
              style={{
                textAlign: "center",
                fontSize: "0.85rem",
                color: "#64748b",
                marginBottom: "20px",
                lineHeight: "1.4"
              }}
            >
              We sent a 6-digit verification code to <br />
              <strong style={{ color: "#1e293b" }}>{otpIdentifier}</strong>
            </p>

            <input
              type="text"
              placeholder="6-Digit OTP"
              value={otp}
              required
              maxLength="6"
              onChange={(e) => setOtp(e.target.value)}
              style={{ textAlign: "center", letterSpacing: "4px", fontSize: "1.2rem" }}
            />

            <button type="submit" disabled={loading}>
              {loading ? "Verifying..." : "Verify & Complete Registration"}
            </button>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "15px",
                width: "100%"
              }}
            >
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={loading}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#4f46e5",
                  cursor: "pointer",
                  textDecoration: "underline",
                  fontSize: "0.85rem"
                }}
              >
                Resend Code
              </button>

              <button
                type="button"
                onClick={() => setOtpSent(false)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#64748b",
                  cursor: "pointer",
                  textDecoration: "underline",
                  fontSize: "0.85rem"
                }}
              >
                Go Back
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleSubmit} className="registerForm">
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              required
              onChange={(e) => {
                let value = e.target.value;
                const words = value.trimStart().split(" ");
                if (words[0]) {
                  words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
                }
                setName(words.join(" "));
              }}
            />

            <input
              type="email"
              placeholder="Email"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              type="tel"
              placeholder="Mobile Number"
              value={mobileNumber}
              required
              onChange={(e) => setMobileNumber(e.target.value)}
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
            />

            <button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Register"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Register;