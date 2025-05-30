import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, signInWithEmailAndPassword } from "../firebase/firebaseConfig";
import "./login.css";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    try {
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      console.log("Login Berhasil:", userCred.user);
      navigate("/start");
    } catch (error) {
      console.error("Login Gagal:", error.message);
      alert("Login gagal: " + error.message);
    }
  };

  return (
    <div className="landing-container">
      <div className="left-area">
        <img src="/assets/PUFF-FIX.png" alt="Logo PUFF" className="bouncy-logo" />
      </div>
      <div className="right-area">
        <img src="/assets/login-title.png" alt="Login Title" className="login-title-image" />
        <form onSubmit={handleEmailLogin} className="login-form">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="login-input"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="login-input"
          />
          <button type="submit" className="login-email-button">
            Log In
          </button>
        </form>
        <div className="signup-text">
          <span>Belum punya akun?</span>
          <Link to="/register">
            <button className="signin-link">Registrasi</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
