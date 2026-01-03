import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyChLiH0BDYsA5g75ldKlWFSfVdLU74XG08",
  authDomain: "hey-xl7.firebaseapp.com",
  projectId: "hey-xl7",
  storageBucket: "hey-xl7.firebasestorage.app",
  messagingSenderId: "156726472725",
  appId: "1:156726472725:web:14b9ca848cd830eef21e1c",
  measurementId: "G-D1ZX9B23N0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;
