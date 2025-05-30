import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./loading.css";

function LoadingScreen() {
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            navigate("/game");
          }, 500);
          return 100;
        }
        return prev + 5;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [navigate]);

  return (
    <div className="loading-screen">
      <div className="loading-content">
        <p className="loading-text">Loading... {progress}%</p>
        <div className="loading-bar-background">
          <div
            className="loading-bar-fill"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}

export default LoadingScreen;
