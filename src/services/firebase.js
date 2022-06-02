import { initializeApp } from "firebase/app";
import {
  getAuth,
} from "firebase/auth";
import { getStorage } from "firebase/storage"

const firebaseConfig = {
  apiKey: "AIzaSyCu2L8rpOJHaJM5UgtoZ8v00Yq4Yvz4u7A",
  authDomain: "rentit-auth-3e9ba.firebaseapp.com",
  projectId: "rentit-auth-3e9ba",
  storageBucket: "rentit-auth-3e9ba.appspot.com",
  messagingSenderId: "676057920416",
  appId: "1:676057920416:web:06247034a8790a81012ac5",
  measurementId: "G-ZH09153CGJ"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage(app);

