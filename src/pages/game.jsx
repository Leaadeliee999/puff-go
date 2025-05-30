import React, { useState, useEffect, useRef } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase/firebaseConfig";
import { useNavigate } from "react-router-dom";
import "./game.css";

const PIPE_WIDTH = 60;
const PIPE_GAP = 100;
const PIPE_INTERVAL = 320;
const GRAVITY = 2;
const JUMP = 13;
const BIRD_SIZE = 65;
const GAME_WIDTH = 400;
const GAME_HEIGHT = 600;
const USER_ID = "user_123";

const INITIAL_PIPES = [
  { x: 400, heightTop: 180, passed: false },
  { x: 720, heightTop: 230, passed: false },
  { x: 1040, heightTop: 150, passed: false },
  { x: 1360, heightTop: 200, passed: false },
  { x: 1680, heightTop: 170, passed: false },
];

const characterMap = {
  nutto: "tupai.png",
  chirpie: "burung.png",
  myrina: "kupu.png",
  buzzlo: "lebah.png",
};

export default function Game() {
  const [birdY, setBirdY] = useState(GAME_HEIGHT / 2);
  const [velocity, setVelocity] = useState(0);
  const [pipes, setPipes] = useState(INITIAL_PIPES);
  const [gameOver, setGameOver] = useState(false);
  const [started, setStarted] = useState(false);
  const [characterImage, setCharacterImage] = useState("/assets/tupai.png");
  const [volumeReduced, setVolumeReduced] = useState(false);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const navigate = useNavigate();

  const birdRef = useRef(null);
  const pipeRefs = useRef([]);
  const gameRef = useRef(null);

  useEffect(() => {
    const savedCharacter = localStorage.getItem("selectedCharacter") || "nutto";
    const imgName = characterMap[savedCharacter] || "tupai.png";
    setCharacterImage(`/assets/${imgName}`);
  }, []);

  useEffect(() => {
    const fetchBestScore = async () => {
      const user = auth.currentUser;
      if (user) {
        const docRef = doc(db, "scores", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setBestScore(docSnap.data().best || 0);
        }
      }
    };

    fetchBestScore();
  }, []);

  useEffect(() => {
    if (!started || gameOver) return;
    const interval = setInterval(() => {
      setVelocity((v) => v + GRAVITY);
      setBirdY((y) => y + velocity);
    }, 30);
    return () => clearInterval(interval);
  }, [velocity, gameOver, started]);

  useEffect(() => {
    if (!started || gameOver) return;

    const interval = setInterval(() => {
      setPipes((oldPipes) => {
        let newPipes = oldPipes
          .map((p) => ({ ...p, x: p.x - 3 }))
          .map((p) => {
            if (p.x + PIPE_WIDTH < 0) {
              return {
                x: Math.max(...oldPipes.map((pipe) => pipe.x)) + PIPE_INTERVAL,
                heightTop: 100 + Math.floor(Math.random() * 220),
                passed: false,
              };
            }
            return p;
          });

        const gameRect = gameRef.current.getBoundingClientRect();
        const birdRect = birdRef.current.getBoundingClientRect();
        const birdRelative = {
          left: birdRect.left - gameRect.left,
          right: birdRect.right - gameRect.left,
          top: birdRect.top - gameRect.top,
          bottom: birdRect.bottom - gameRect.top,
        };

        for (let i = 0; i < newPipes.length; i++) {
          const topPipe = pipeRefs.current[i * 2];
          const bottomPipe = pipeRefs.current[i * 2 + 1];
          if (!topPipe || !bottomPipe) continue;

          const topRect = topPipe.getBoundingClientRect();
          const bottomRect = bottomPipe.getBoundingClientRect();

          const topRelative = {
            left: topRect.left - gameRect.left,
            right: topRect.right - gameRect.left,
            top: topRect.top - gameRect.top,
            bottom: topRect.bottom - gameRect.top,
          };

          const bottomRelative = {
            left: bottomRect.left - gameRect.left,
            right: bottomRect.right - gameRect.left,
            top: bottomRect.top - gameRect.top,
            bottom: bottomRect.bottom - gameRect.top,
          };

          const collideTop = !(
            birdRelative.right < topRelative.left ||
            birdRelative.left > topRelative.right ||
            birdRelative.bottom < topRelative.top ||
            birdRelative.top > topRelative.bottom
          );

          const collideBottom = !(
            birdRelative.right < bottomRelative.left ||
            birdRelative.left > bottomRelative.right ||
            birdRelative.bottom < bottomRelative.top ||
            birdRelative.top > bottomRelative.bottom
          );

          if (collideTop || collideBottom) {
            triggerGameOver();
          }
        }

        if (birdRelative.bottom >= GAME_HEIGHT || birdRelative.top <= 0) {
          triggerGameOver();
        }

        const updatedPipes = newPipes.map((pipe) => {
          if (!pipe.passed && pipe.x + PIPE_WIDTH < 80) {
            pipe.passed = true;
            setScore((prev) => prev + 1);
          }
          return pipe;
        });

        return updatedPipes;
      });
    }, 30);

    return () => clearInterval(interval);
  }, [birdY, gameOver, started, volumeReduced]);

  useEffect(() => {
    function handleGameOverEnded() {
      if (window.pauseBackgroundMusic && volumeReduced) {
        window.pauseBackgroundMusic(false);
        setVolumeReduced(false);
      }
    }
    const gameOverAudio = window.gameOverAudio;
    if (gameOverAudio) {
      gameOverAudio.addEventListener("ended", handleGameOverEnded);
    }
    return () => {
      if (gameOverAudio) {
        gameOverAudio.removeEventListener("ended", handleGameOverEnded);
      }
    };
  }, [volumeReduced]);

  function triggerGameOver() {
    setGameOver(true);
    if (score > bestScore) {
      setBestScore(score);

      
     const user = auth.currentUser; if (user) {
        const userScoreRef = doc(db, "scores", user.uid);
        setDoc(userScoreRef, {
        name: user.displayName || "Unknown",
        score: score,
        });
      }
    }

    if (window.pauseBackgroundMusic && !volumeReduced) {
      window.pauseBackgroundMusic(true);
      setVolumeReduced(true);
    }
    if (window.playGameOverSound) window.playGameOverSound();
  }

  function handleJump() {
    if (!started) {
      setStarted(true);
      if (window.playBackgroundMusic && window.isSoundOn) {
        window.playBackgroundMusic();
      }
    } else if (!gameOver) {
      setVelocity(-JUMP);
    }
  }

  function handleRestart() {
    if (window.gameOverAudio) {
      window.gameOverAudio.pause();
      window.gameOverAudio.currentTime = 0;
    }
    if (window.playBackgroundMusic && window.isSoundOn) {
      window.playBackgroundMusic();
    }

    setBirdY(GAME_HEIGHT / 2);
    setVelocity(0);
    setPipes(INITIAL_PIPES.map((p) => ({ ...p, passed: false })));
    setScore(0);
    setGameOver(false);
    setStarted(false);
    setVolumeReduced(false);
  }

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === "Space") {
        if (!gameOver) {
          handleJump();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gameOver, started]);

  return (
    <div
      ref={gameRef}
      className="game-container"
      role="button"
      aria-label="Game area"
      tabIndex={0}
      onClick={() => {
        if (gameOver) handleRestart();
        else handleJump();
      }}
    >
      <div
        className={`bird ${!started && !gameOver ? "floating" : ""}`}
        ref={birdRef}
        style={{
          top: birdY + "px",
          left: "80px",
          width: BIRD_SIZE,
          height: BIRD_SIZE,
        }}
      >
        <img src={characterImage} alt="bird" />
      </div>

      {pipes.map((pipe, i) => (
        <React.Fragment key={i}>
          <div
            className="pipe pipe-top"
            ref={(el) => (pipeRefs.current[i * 2] = el)}
            style={{
              height: pipe.heightTop + "px",
              left: pipe.x + "px",
              top: 0,
              width: PIPE_WIDTH,
            }}
          >
            <img src="/assets/treee.png" alt="tree-top" />
          </div>
          <div
            className="pipe pipe-bottom"
            ref={(el) => (pipeRefs.current[i * 2 + 1] = el)}
            style={{
              bottom: 0,
              height: GAME_HEIGHT - (pipe.heightTop + PIPE_GAP) + "px",
              left: pipe.x + "px",
              width: PIPE_WIDTH,
            }}
          >
            <img src="/assets/treee.png" alt="tree-bottom" />
          </div>
        </React.Fragment>
      ))}

      <img src="/assets/tanahh.png" alt="tanah" className="tanah" />

{gameOver && (
  <div className="score-container">
    <img src="/assets/kolom.png" alt="score" className="kolom-bg" />
    <div className="score-overlay">
      <p>Score: {score}</p>
      <p>Best Score: {bestScore}</p>
    </div>
  </div>
)}


{!gameOver && (
  <div className="live-score">
    Score: {score}
  </div>
)}

{gameOver && (
  <div className="game-over-wrapper">
    <div className="game-over">
      <div>GAME</div>
      <div>OVER</div>
    </div>
    <div className="restart-text blinking">Press to play again</div>
    <button className="home-text blinking" onClick={() => navigate("/start")}>
      Back to Home
    </button>
  </div>
)}
    </div>
  );
}
