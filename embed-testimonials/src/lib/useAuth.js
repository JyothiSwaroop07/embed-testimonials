// lib/useAuth.js

import { useEffect, useState } from "react";
import { auth } from "./firebase"; // Import your Firebase auth instance
import { onAuthStateChanged } from "firebase/auth"; // Import Firebase function to manage auth state

export const useAuth = () => {
  const [user, setUser] = useState(null); // State to store the user object

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user); // Update the user state
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  return { user }; // Return the user object
};
