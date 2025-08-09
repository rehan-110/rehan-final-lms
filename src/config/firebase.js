import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCRnVeF1wMWOR4Ndk2DjXK7G5bxN5m2xI0",
  authDomain: "lms-fp.firebaseapp.com",
  databaseURL: "https://lms-fp-default-rtdb.firebaseio.com",
  projectId: "lms-fp",
  storageBucket: "lms-fp.firebasestorage.app",
  messagingSenderId: "281763520622",
  appId: "1:281763520622:web:37b14127f6f1cb9084867f"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);