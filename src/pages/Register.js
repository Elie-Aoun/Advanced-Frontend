import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from "../config"; // ✅ Ensure API_BASE_URL is used
import "../styles/Register.css"; // ✅ Import the CSS

const Register = () => {
  const [fullName, setFullName] = useState(""); // ✅ Added Full Name
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    const userData = {
      fullName: fullName.trim(),
      email: email.trim(),
      password: password.trim(),
    };

    console.log("📤 Sending registration data:", userData);

    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/register`, userData);
      console.log("✅ Registration successful:", response.data);
      navigate("/login"); // ✅ Redirect to login page
    } catch (error) {
      console.error("❌ Registration failed:", error.response?.data || error.message);
      setError(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <h2>Register</h2>
        {error && <p className="register-error">{error}</p>}
        <form onSubmit={handleRegister} className="register-form">
          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button type="submit">Register</button>
        </form>
        <div className="register-options">
          <p>Already have an account? <a href="/login">Login</a></p>
        </div>
      </div>
    </div>
  );
};

export default Register;
