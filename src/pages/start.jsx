import React from "react";
import { useNavigate } from "react-router-dom";
import "./start.css";
import { auth } from "../firebase/firebaseConfig";

function Start() {
  const navigate = useNavigate();
  const user = auth.currentUser;

  const handleStart = () => {
    navigate("/loading");
  };

  const handleProfile = () => {
    navigate("/profile");
  };

  const handleCharacter = () => {
    navigate("/character");
  };

  const handleLeaderboard = () => {
    navigate("/leaderboard");
  };

  return (
    <div className="landing-container">
      <div className="left-area">
        <img src="/assets/PUFF-FIX.png" alt="Logo PUFF" className="bouncy-logo" />
      </div>
      <div className="right-area">
        <button className="profile-button" onClick={handleProfile}>
          <img src="/assets/profile.png" alt="Profile" className="profile-img" />
          <span>{user?.displayName || "Guest"}</span>
        </button>
        
        {/* Tambahan tombol Leaderboard */}
        <button className="leaderboard-button" onClick={handleLeaderboard}>
          <img src="/assets/crown.png" alt="Leaderboard" className="leaderboard-img" />
          <span>Leaderboard</span>
        </button>

        <button className="start-button" onClick={handleStart}>
          <img src="/assets/start.png" alt="Start Game" className="start-img" />
        </button>

        <button className="character-button" onClick={handleCharacter}>
          <img src="/assets/character.png" alt="Character" className="character-img" />
        </button>
      </div>
    </div>
  );
}

export default Start;
