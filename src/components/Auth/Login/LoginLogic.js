// src/components/Auth/Login/LoginLogic.js
import { auth, googleProvider, githubProvider } from "@/src/lib/firebase-config";
import { signInWithPopup, signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export const useLoginLogic = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  // ১. সোশ্যাল লগইন (গুগল/গিটহাব)
  const handleSocialLogin = async (provider) => {
    setLoading(true);
    setError("");
    try {
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();
      
      const res = await signIn("credentials", {
        idToken,
        email: result.user.email,
        redirect: false,
      });

      if (res?.error) throw new Error("NextAuth verification failed");
      router.push("/");
    } catch (err) {
      setError("Social Login failed. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ২. ইমেইল লগইন (Failed Attempts Handling সহ)
  const handleEmailLogin = async (email, password) => {
    setLoading(true);
    setError("");
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const idToken = await userCredential.user.getIdToken();
      
      await signIn("credentials", {
        idToken,
        email: email,
        callbackUrl: "/",
        redirect: true,
      });
    } catch (err) {
      // Security Feature: Handling multi-failed attempts via Firebase error codes
      if (err.code === "auth/too-many-requests") {
        setError("Account temporarily locked due to many failed attempts. Try later or reset password.");
      } else if (err.code === "auth/invalid-credential") {
        setError("Invalid email or password.");
      } else {
        setError("An error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // ৩. পাসওয়ার্ড রিসেট (Requirement 1: Password Reset)
  const handleForgotPassword = async (email) => {
    if (!email) return alert("Please enter your email first.");
    try {
      await sendPasswordResetEmail(auth, email);
      alert("Password reset email sent! Check your inbox.");
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  return { handleSocialLogin, handleEmailLogin, handleForgotPassword, loading, error };
};