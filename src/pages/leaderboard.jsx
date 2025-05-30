import React, { useEffect, useState } from 'react';
import { db } from "../firebase/firebaseConfig";
import './leaderboard.css';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    const q = query(
      collection(db, 'skor'),
      orderBy('score', 'desc'),
      limit(10)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => doc.data());
      setLeaderboard(data);
    });

    return () => unsubscribe(); // berhenti kalau komponen ditutup
  }, []);

  return (
    <div className="leaderboard-container">
      <ol>
        {leaderboard.map((user, index) => (
          <li key={index}>
            <strong>{user.username}</strong> — {user.score} pts
          </li>
        ))}
      </ol>
    </div>
  );
};

export default Leaderboard;
