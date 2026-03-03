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
import toast from "react-hot-toast";

export const useRegisterLogic = () => {
  const [role, setRole] = useState(null); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  // social registration (Google/GitHub)
  const handleSocialRegister = async (provider) => {
    if (!role) {
      toast.error("Please select a role first!");
      return;
    }

    setLoading(true);
    const toastId = toast.loading("Verifying with Google...");

    try {
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();

      // direct send data: NextAuth 
      const response = await signIn("credentials", {
        idToken,
        role,
        email: result.user.email,
        uid: result.user.uid,
        redirect: false,
      });

      if (response?.error) throw new Error("NextAuth session failed");

      toast.success("Login Successful!", { id: toastId });

      router.refresh(); 
      setTimeout(() => {
        router.push(role === "seller" ? "/sellproperty" : "/");
      }, 500);

    } catch (error) {
      console.error("Login Error:", error);
      toast.error("Login failed! Please try again.", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  // email register
  const handleEmailRegister = async (name, email, password) => {
    if (!role) return toast.error("Choose a role!");
    
    setLoading(true);
    const toastId = toast.loading("Creating your account...");

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // name update
      await updateProfile(userCredential.user, { displayName: name });

      // send email verification
      await sendEmailVerification(userCredential.user);
      
      toast.success("Verification email sent! ✉️", { id: toastId });

      const idToken = await userCredential.user.getIdToken();

      // Create NextAuth session (with roles that the backend developer will save in Mongo)
      const response = await signIn("credentials", {
        idToken,
        role,
        email: email,
        redirect: false,
      });

      if (!response.error) {
        setTimeout(() => {
          router.push(role === "seller" ? "/sellproperty" : "/");
        }, 2000);
      }
    } catch (err) {
      let errorMessage = err.message;
      if (err.code === "auth/email-already-in-use") errorMessage = "Email already in use! 🛑";
      
      toast.error(errorMessage, { id: toastId });
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { role, setRole, handleSocialRegister, handleEmailRegister, loading, error };
};