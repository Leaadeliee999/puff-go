import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./Character.css";

const characters = [
  { id: 'nutto', frame: '/assets/nutto.png', image: '/assets/tupai.png' },
  { id: 'chirpie', frame: '/assets/chirpie.png', image: '/assets/burung.png' },
  { id: 'myrina', frame: '/assets/myrina.png', image: '/assets/kupu.png' },
  { id: 'buzzlo', frame: '/assets/buzzlo.png', image: '/assets/lebah.png' },
];

export default function Character() {
  const [savedCharacter, setSavedCharacter] = useState('');
  const [currentSelection, setCurrentSelection] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem('selectedCharacter');
    if (saved) {
      setSavedCharacter(saved);
      setCurrentSelection(saved);
    }
  }, []);

  const handleSelect = (id) => {
    setCurrentSelection(id);
  };

  const handleConfirm = () => {
    localStorage.setItem('selectedCharacter', currentSelection);
    navigate('/start');
  };

  const handleBack = () => {
    navigate('/start');
  };

  return (
    <div className="character-container">
      <div className="back-icon" onClick={handleBack}>
        <img src="/assets/back.png" alt="Back" className="back-img" />
      </div>

      <img src="/assets/bg-character.png" alt="Background" className="bg" />

      <div className="character-list">
        {characters.map((char) => (
          <div
            key={char.id}
            className="character-frame-wrapper"
            style={{ position: 'relative' }}
          >
            <img src={char.frame} alt={`${char.id}-frame`} className="frame" />
            <img
              src={char.image}
              alt={char.id}
              className="character-sprite"
              onClick={() => handleSelect(char.id)}
              style={{ cursor: 'pointer' }}
            />
            <div className="shadow" />
            {currentSelection === char.id && (
              <img
                src="/assets/selected.png"
                alt="Selected"
                className="selected"
                style={{
                  position: 'absolute',
                  top: '0',
                  right: '0',
                  width: '40px',
                }}
              />
            )}
          </div>
        ))}
      </div>

      <div className="confirm-button-wrapper">
        <button
          className="confirm-button"
          onClick={handleConfirm}
          disabled={currentSelection === savedCharacter}
        >
          OKE
        </button>
      </div>
    </div>
  );
}
