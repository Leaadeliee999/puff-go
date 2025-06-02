import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Loading.css';

const Loading = () => {
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            navigate('/game'); // Ganti sesuai rute tujuanmu
          }, 500);
          return 100;
        }
        return prev + 1;
      });
    }, 30);

    return () => clearInterval(interval);
  }, [navigate]);

  return (
    <div className="loading-container">
      <p className="loading-text">Loading. . . {progress}%</p>
      <div className="progress-bar-bg">
        <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
};

export default Loading;
