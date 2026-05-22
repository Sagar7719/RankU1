import { useState } from "react";
import { registerUser } from "../../services/authService";
import { useNavigate } from "react-router-dom";
import "./Register.css";

const Register = () => {

  const [name,setName] = useState("");
  const [email,setEmail] = useState("");
  const [mobileNumber,setMobileNumber] = useState("");
  const [password,setPassword] = useState("");
  const [loading,setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e)=>{
    e.preventDefault();

    if(!name || !email || !password || !mobileNumber){
      alert("Please fill all fields");
      return;
    }

    try {

      setLoading(true);

      await registerUser({
        name,
        email,
        mobileNumber,
        password
      });

      alert("Registration successful");

      navigate("/login");

    } catch (error) {

      console.error(error);

      alert(
        error?.response?.data?.message ||
        "Registration failed"
      );

    } finally {
      setLoading(false);
    }
  };

  return (

    <div className="registerContainer">

      <div className="registerCard">

        <h2 className="registerTitle">
          Create Account 🚀
        </h2>

        <p className="registerSubtitle">
          Join RankU1 and start your preparation
        </p>

        <form onSubmit={handleSubmit} className="registerForm">

          <input
            type="text"
            placeholder="Full Name"
            value={name}
            required
            onChange={(e)=>{
              let value = e.target.value;

              const words = value.trimStart().split(" ");

              if (words[0]) {
                words[0] =
                  words[0].charAt(0).toUpperCase() + words[0].slice(1);
              }

              setName(words.join(" "));
            }}
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            required
            onChange={(e)=>setEmail(e.target.value)}
          />

          <input
            type="tel"
            placeholder="Mobile Number"
            value={mobileNumber}
            required
            onChange={(e)=>setMobileNumber(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            required
            onChange={(e)=>setPassword(e.target.value)}
          />

          <button
            type="submit"
            disabled={loading}
          >
            {loading ? "Creating..." : "Register"}
          </button>

        </form>

      </div>

    </div>

  );
};

export default Register;