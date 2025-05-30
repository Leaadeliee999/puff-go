import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, db } from "../firebase/firebaseConfig";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import "./registrasi.css";

function Registrasi() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [usernameWarning, setUsernameWarning] = useState("");

  const handleUsernameChange = (e) => {
    const value = e.target.value;
    setUsername(value);
    setUsernameWarning(value.length > 8 ? "Maksimal 8 karakter" : "");
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (username.length > 8) {
      setUsernameWarning("Maksimal 8 karakter");
      return;
    }

    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCred.user, { displayName: username });
      await setDoc(doc(db, "users", userCred.user.uid), {
        username,
        email,
        createdAt: new Date()
      });

      navigate("/start");
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        navigate("/start");
      } else {
        alert("Registrasi gagal: " + error.message);
      }
    }
  };

  return (
    <div className="landing-container">
      <div className="left-area">
        <img src="/assets/PUFF-FIX.png" alt="Logo PUFF" className="bouncy-logo" />
      </div>
      <div className="right-area">
        <img src="/assets/registrasi-title.png" alt="Register Title" className="login-title-image" />

        <form onSubmit={handleRegister} className="login-form">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={handleUsernameChange}
            required
            className="login-input"
          />
          {usernameWarning && (
            <p style={{ color: "red", fontSize: "12px", marginTop: "-8px", marginBottom: "8px" }}>
              {usernameWarning}
            </p>
          )}

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
            Register
          </button>
        </form>

        <div className="signup-text">
          <span className="have-account-text">Sudah punya akun?</span>
          <Link to="/login" className="signin-link">Log In</Link>
        </div>
      </div>
    </div>
  );
}

export default Registrasi;
