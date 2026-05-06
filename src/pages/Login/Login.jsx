import { useState } from "react";
import { loginUser } from "../../services/authService";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {

    e.preventDefault();

    // simple validation
    if (!email || !password) {
      alert("Please fill all fields");
      return;
    }

    try {

      setLoading(true);

      const response = await loginUser({
        email,
        password
      });

      alert("Login successful! Welcome back.");

      // force full reload to update auth states across the app
      window.location.href = "/";

    } catch (error) {

      console.error(error);

      alert(
        error?.response?.data?.message ||
        "Login failed"
      );

    } finally {

      setLoading(false);

    }

  };

  return (

    <div className="loginContainer">

      <div className="loginCard">

        <h2 className="loginTitle">Welcome Back 👋</h2>

        <p className="loginSubtitle">
          Login to continue your journey
        </p>

        <form onSubmit={handleSubmit} className="loginForm">

          <input
            type="email"
            placeholder="Email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="submit"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

      </div>

    </div>

  );

};

export default Login;