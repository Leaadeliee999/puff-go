import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/login";
import Register from "./pages/registrasi";
import Game from './pages/game';
import Start from "./pages/start";
import Profile from "./pages/profile";
import Loading from "./pages/loading"; 
import Character from "./pages/character"; 
import SoundButton from "./SoundButton"; 
import Leaderboard from './pages/leaderboard';


function App() {
  return (
    <Router>
      <SoundButton /> {/* ✅ Tombol sound tampil di semua halaman */}

      <Routes>
        <Route path="/" element={<Navigate to="/register" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/game" element={<Game />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/loading" element={<Loading />} /> 
        <Route path="/character" element={<Character />} /> 
        <Route path="/start" element={<Start />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
      </Routes>
    </Router>
  );
}

export default App;
