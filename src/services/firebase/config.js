import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCn-kGf4LG7gyQd8H2pAaVSzv9KhKsBPw4",
  authDomain: "mindguard-a06bb.firebaseapp.com",
  projectId: "mindguard-a06bb",
  storageBucket: "mindguard-a06bb.firebasestorage.app",
  messagingSenderId: "315664780688",
  appId: "1:315664780688:web:611a0a109aa92c5b567715",
  measurementId: "G-B22N2JZN5R"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
