"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { auth, googleProvider, db } from "@/lib/firebase";
import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import toast from "react-hot-toast";

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Fetch or create user data
        const userRef = doc(db, "users", currentUser.uid);
        const userSnap = await getDoc(userRef);
        
        if (!userSnap.exists()) {
          const newUserData = {
            userId: currentUser.uid,
            name: currentUser.displayName,
            email: currentUser.email,
            upiId: "",
            createdAt: new Date().toISOString()
          };
          await setDoc(userRef, newUserData);
          setUserData(newUserData);
        } else {
          setUserData(userSnap.data());
        }
      } else {
        setUserData(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      toast.success("Logged in successfully!");
    } catch (error) {
      toast.error("Failed to log in: " + error.message);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error("Failed to log out");
    }
  };

  const updateUPI = async (upiId) => {
    if (!user) return;
    try {
      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, { upiId }, { merge: true });
      setUserData(prev => ({ ...prev, upiId }));
      toast.success("UPI ID updated!");
    } catch (error) {
      toast.error("Failed to update UPI ID");
    }
  };

  return (
    <AuthContext.Provider value={{ user, userData, loading, login, logout, updateUPI }}>
      {children}
    </AuthContext.Provider>
  );
};
