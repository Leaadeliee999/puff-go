import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import "./SoundButton.css";

const SoundButton = () => {
  const [soundOn, setSoundOn] = useState(true);
  const audioRef = useRef(null);
  const gameOverRef = useRef(null); // 🔊 Tambahan untuk suara game over
  const location = useLocation();

  useEffect(() => {
    const storedSound = localStorage.getItem("soundOn");
    if (storedSound !== null) {
      setSoundOn(storedSound === "true");
    }
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      if (soundOn) {
        audioRef.current.play().catch(() => {}); // Silent fail if blocked
      } else {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    }
  }, [soundOn, location.pathname]);

  const toggleSound = () => {
    const newSoundState = !soundOn;
    setSoundOn(newSoundState);
    localStorage.setItem("soundOn", newSoundState);
  };

  // ✅ Fungsi ini bisa dipanggil dari luar saat game over
  window.playGameOverSound = () => {
    if (gameOverRef.current && soundOn) {
      gameOverRef.current.currentTime = 0;
      gameOverRef.current.play().catch(() => {});
    }
  };

  return (
    <>
      <audio ref={audioRef} loop>
        <source src="/assets/backsound.mp3" type="audio/mpeg" />
      </audio>
      <audio ref={gameOverRef}>
        <source src="/assets/gameover.mpeg" type="audio/mpeg" />
      </audio>
      <div className="sound-button" onClick={toggleSound}>
        <img
          src={
            soundOn
              ? "/assets/sound-on.png"
              : "/assets/sound-off.png"
          }
          alt="Sound Toggle"
        />
      </div>
    </>
  );
};

export default SoundButton;
