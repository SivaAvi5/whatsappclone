import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA-l3sHJCVPVJvP7KM9Gb10rV3LS6kR2zk",
  authDomain: "sivawhatsappclone.firebaseapp.com",
  projectId: "sivawhatsappclone",
  storageBucket: "sivawhatsappclone.appspot.com",
  messagingSenderId: "664627096482",
  appId: "1:664627096482:web:85a58b5b202dabb89820fb",
  measurementId: "G-9CR9S6LKZC",
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);
const provider = new GoogleAuthProvider();

export { db, auth, provider };
