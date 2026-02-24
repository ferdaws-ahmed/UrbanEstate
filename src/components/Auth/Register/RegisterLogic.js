"use client";
import { auth } from "@/src/lib/firebase-config";
import { 
  signInWithPopup, 
  createUserWithEmailAndPassword, 
  updateProfile,
  sendEmailVerification 
} from "firebase/auth";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast"; // টোস্ট ইম্পোর্ট করুন

export const useRegisterLogic = () => {
  const [role, setRole] = useState(null); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  // ১. সোশ্যাল রেজিস্ট্রেশন (Google/GitHub)
  const handleSocialRegister = async (provider) => {
    if (!role) {
      toast.error("Please select your role (Buyer/Seller) first! ✨", {
        duration: 4000,
        style: { borderRadius: '10px', background: '#333', color: '#fff' }
      });
      return;
    }

    setLoading(true);
    setError("");
    
    // লোডিং টোস্ট শুরু
    const toastId = toast.loading("Connecting to social account...");

    try {
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();
      
      const response = await signIn("credentials", {
        idToken,
        role,
        email: result.user.email,
        uid: result.user.uid,
        redirect: false,
      });

      if (response?.error) throw new Error("Verification failed");
      
      // সাকসেস টোস্ট
      toast.success(`Welcome ${result.user.displayName}! Redirecting...`, { id: toastId });
      
      router.push(role === "seller" ? "/sellproperty" : "/");
    } catch (error) {
      console.error("Social Error:", error);
      toast.error("Registration failed. Please try again.", { id: toastId });
      setError("Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  // ২. ইমেইল রেজিস্ট্রেশন
  const handleEmailRegister = async (name, email, password) => {
    if (!role) return toast.error("Choose a role (Buyer/Seller)!");
    
    setLoading(true);
    setError("");
    
    const toastId = toast.loading("Creating your account...");

    try {
      // ফায়ারবেসে একাউন্ট তৈরি
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // প্রোফাইলে নাম সেভ
      await updateProfile(userCredential.user, { displayName: name });

      // ইমেইল ভেরিফিকেশন পাঠানো
      await sendEmailVerification(userCredential.user);
      
      // ইউনিক ডিজাইনড টোস্ট ফর ভেরিফিকেশন
      toast.success(
        (t) => (
          <span>
            <b>Verification email sent!</b> ✉️ <br />
            Please check your inbox to activate account.
          </span>
        ), 
        { id: toastId, duration: 6000 }
      );

      const idToken = await userCredential.user.getIdToken();

      // NextAuth সেশন তৈরি
      const response = await signIn("credentials", {
        idToken,
        role,
        email: email,
        redirect: false,
      });

      if (!response.error) {
        setTimeout(() => {
          router.push(role === "seller" ? "/sellproperty" : "/");
        }, 3000); // ইউজারকে টোস্ট পড়ার সময় দিতে সামান্য ডিলে
      }
    } catch (err) {
      let errorMessage = "Registration failed. Please try again.";
      
      if (err.code === "auth/email-already-in-use") {
        errorMessage = "This email is already registered! 🛑";
      } else if (err.code === "auth/weak-password") {
        errorMessage = "Password is too weak! (Min 6 chars) 🔑";
      }
      
      toast.error(errorMessage, { id: toastId });
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { 
    role, 
    setRole, 
    handleSocialRegister, 
    handleEmailRegister, 
    loading, 
    error 
  };
};