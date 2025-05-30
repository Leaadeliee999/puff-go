import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase/firebaseConfig";
import { signOut, updateProfile } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "./profile.css";
import Swal from "sweetalert2";

function Profile() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [savedUsername, setSavedUsername] = useState("");
  const [isSaved, setIsSaved] = useState(false);
  const [usernameError, setUsernameError] = useState("");

  useEffect(() => {
    if (auth.currentUser) {
      const currentUsername = auth.currentUser.displayName || "";
      setUsername(currentUsername);
      setSavedUsername(currentUsername);
    }
  }, []);

  const handleSave = async () => {
    if (!auth.currentUser) return;

    try {
      await updateProfile(auth.currentUser, {
        displayName: username,
      });

      const userRef = doc(db, "users", auth.currentUser.uid);
      await updateDoc(userRef, {
        username: username,
      });

      setSavedUsername(username);
      setIsSaved(true);
      setUsernameError("");

      setTimeout(() => {
        setIsSaved(false);
      }, 3000);

      Swal.fire({
        title: "Berhasil disimpan!",
        icon: "success",
        confirmButtonText: "OK",
        customClass: {
          popup: "swal-success-popup",
          title: "swal-success-title",
          confirmButton: "swal-success-button",
        },
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/start");
        }
      });
    } catch (err) {
      console.error("Gagal menyimpan:", err.message);
    }
  };

  const handleSaveClick = () => {
    if (username.trim() === "") {
      setUsernameError("Username tidak boleh kosong");
      return;
    }

    Swal.fire({
      title: "Simpan perubahan username?",
      showCancelButton: true,
      confirmButtonText: "Save",
      cancelButtonText: "Cancel",
      customClass: {
        confirmButton: "swal-save-btn",
        cancelButton: "swal-cancel-btn"
      }
    }).then((result) => {
      if (result.isConfirmed) {
        handleSave();
      }
    });
  };

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Semua data akan terhapus jika anda log out. Apakah anda yakin?",
      showCancelButton: true,
      confirmButtonText: "Log Out",
      cancelButtonText: "Cancel",
      customClass: {
        confirmButton: "swal-logout-btn",
        cancelButton: "swal-cancel-btn"
      }
    });

    if (result.isConfirmed) {
      await signOut(auth);
      navigate("/login");
    }
  };

  const handleBack = () => {
    navigate("/start");
  };

  return (
    <div className="profile-container">
      <div className="back-icon" onClick={handleBack}>
        <img src="/assets/back.png" alt="Back" className="back-img" />
      </div>

      <div className="profile-card left-align">
        <div className="profile-header">Profile</div>

        <label className="profile-label">Username</label>
        <input
          type="text"
          className="profile-input"
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
            if (e.target.value.trim() !== "") {
              setUsernameError("");
            }
          }}
          maxLength={8}
        />
        {usernameError && (
          <div className="error-message">{usernameError}</div>
        )}

        <button className="save-button" onClick={handleSaveClick}>
          Save Setting
        </button>

        <button className="logout-button" onClick={handleLogout}>
          Log Out
        </button>
      </div>
    </div>
  );
}

export default Profile;
