import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAGyYfhU2wUhjGzgEH4HnjxvLJufARoeHo",
  authDomain: "puff-puff-go-6e630.firebaseapp.com",
  projectId: "puff-puff-go-6e630",
  storageBucket: "puff-puff-go-6e630.appspot.com",
  messagingSenderId: "899145271550",
  appId: "1:899145271550:web:eec9cde94fe0efa11dfdaf"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

// ⬇️ Tambahkan ekspor ini supaya tidak error di login.jsx
export { auth, db, provider, signInWithEmailAndPassword };

