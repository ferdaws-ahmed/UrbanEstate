"use client";
import { auth } from "@/src/lib/firebase-config";
import {
  signInWithPopup,
  createUserWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
} from "firebase/auth";
import { signIn } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export const useRegisterLogic = () => {
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [pendingUserData, setPendingUserData] = useState(null);
  const router = useRouter();

  // ইমেইল ভেরিফিকেশন চেক করার জন্য পোলিং
  useEffect(() => {
    let interval;
    if (showVerificationModal && !isVerified) {
      interval = setInterval(async () => {
        try {
          if (auth.currentUser) {
            await auth.currentUser.reload();
            if (auth.currentUser.emailVerified) {
              setIsVerified(true);
              clearInterval(interval);
              handleFinalSignIn();
            }
          }
        } catch (err) {
          console.error("Verification check error:", err);
        }
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [showVerificationModal, isVerified, pendingUserData]);

  const handleFinalSignIn = async () => {
    if (!pendingUserData || !auth.currentUser) return;

    const { role, email } = pendingUserData;
    const toastId = toast.loading("Finalizing your session...");

    try {
      const idToken = await auth.currentUser.getIdToken(true); // Force refresh to get updated claims
      const response = await signIn("credentials", {
        idToken,
        role,
        email,
        redirect: false,
      });

      if (response?.error) throw new Error(response.error);

      toast.success("Identity Verified! Welcome aboard. 🚀", { id: toastId });
      setShowVerificationModal(false);

      setTimeout(() => {
        const dashboardPath = role === "seller" ? "/dashboard/seller" : (role === "admin" ? "/dashboard/admin" : "/");
        router.push(dashboardPath);
        router.refresh();
      }, 1500);
    } catch (err) {
      toast.error(err.message, { id: toastId });
    }
  };

  // ১. সোশ্যাল রেজিস্ট্রেশন (Google/GitHub)
  const handleSocialRegister = async (provider) => {
    if (!role) {
      toast.error("Please select a role first!");
      return;
    }

    setLoading(true);
    const toastId = toast.loading("Verifying credentials...");

    try {
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();

      // সোশ্যাল ডাটা ডাটাবেজে সেভ করা
      await fetch("/api/auth/social-register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: result.user.displayName,
          email: result.user.email,
          uid: result.user.uid,
          role,
          provider: provider.providerId,
        }),
      });

      const response = await signIn("credentials", {
        idToken,
        role,
        email: result.user.email,
        uid: result.user.uid,
        redirect: false,
      });

      if (response?.error) throw new Error("Session failed");

      toast.success("Welcome! Registration Successful 🚀", { id: toastId });

      router.refresh();
      setTimeout(() => {
        const dashboardPath = role === "seller" ? "/dashboard/seller" : (role === "admin" ? "/dashboard/admin" : "/");
        router.push(dashboardPath);
      }, 1000);
    } catch (error) {
      toast.error("Login failed! Please try again.", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  // ২. ইমেইল রেজিস্ট্রেশন
  const handleEmailRegister = async (name, email, password) => {
    if (!role) return toast.error("Choose a role!");

    setLoading(true);
    const toastId = toast.loading("Creating your account...");

    try {
      // Firebase-এ ইউজার তৈরি
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // প্রোফাইল আপডেট (নাম সেট করা)
      await updateProfile(userCredential.user, { displayName: name });

      // *** ডাটাবেজে (MongoDB) ইউজার ডাটা পাঠানো ***
      const dbRes = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password, 
          role,
          uid: userCredential.user.uid
        }),
      });

      // JSON এরর হ্যান্ডলিং (এখানেই আপনার এররটি ফিক্স করা হয়েছে)
      let dbData = {};
      try {
        const contentType = dbRes.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          dbData = await dbRes.json();
        }
      } catch (e) {
        console.error("JSON Parsing Error:", e);
      }

      if (!dbRes.ok) {
        throw new Error(dbData.error || "Failed to sync with database");
      }

      // ভেরিফিকেশন ইমেইল পাঠানো
      await sendEmailVerification(userCredential.user);

      const idToken = await userCredential.user.getIdToken();

      // NextAuth সেশন এখন আর সাথে সাথে হবে না, ভেরিফিকেশনের জন্য ওয়েট করবে
      setPendingUserData({ idToken, role, email });
      setShowVerificationModal(true);

      toast.success("Account Created! Check your email for verification. ✉️", { id: toastId });

    } catch (err) {
      let errorMessage = err.message;
      if (err.code === "auth/email-already-in-use") errorMessage = "Email already in use! 🛑";
      if (err.code === "auth/weak-password") errorMessage = "Password is too weak!";
      
      toast.error(errorMessage, { id: toastId });
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleResendEmail = async () => {
    if (!auth.currentUser) return toast.error("No user found!");
    try {
      await sendEmailVerification(auth.currentUser);
      toast.success("Verification link resent! ✉️");
    } catch (err) {
      toast.error(err.message);
    }
  };

  return {
    role,
    setRole,
    handleSocialRegister,
    handleEmailRegister,
    loading,
    error,
    showVerificationModal,
    setShowVerificationModal,
    isVerified,
    pendingUserData,
    handleResendEmail,
  };
};