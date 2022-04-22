import { createContext, useContext, useState, useEffect } from "react";
import {
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  updateProfile,
  onAuthStateChanged,
} from "firebase/auth";

import { auth } from "../firebase";

const AuthContext = createContext();

export function AuthProvider( {children }) {

  const [currentUser, setCurrentUser] = useState();
  const [loading, setLoading] = useState(true);
  const googleProvider = new GoogleAuthProvider();

  function signup(email, password, displayName) {
    console.log("enter context " + displayName);
    return createUserWithEmailAndPassword(auth, email, password).then((user) => {
      updateProfile(user.user, {
        displayName
      })
    });
  }

  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  function logout() {
    signOut(auth)
  }

  function resetPassword(email) {
    return sendPasswordResetEmail(auth, email);
  }

  function google() {
    return signInWithPopup(auth, googleProvider);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      setLoading(false);
      setCurrentUser(user);
    })

    return unsubscribe
  }, [])

  const value = {
    currentUser,
    signup,
    login,
    logout,
    google,
    resetPassword,
  }



  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext);
}