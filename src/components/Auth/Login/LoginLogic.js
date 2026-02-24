// src/components/Auth/Login/LoginLogic.js
import { auth } from "@/src/lib/firebase-config"; 
import { 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  sendPasswordResetEmail 
} from "firebase/auth";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import emailjs from "@emailjs/browser";

export const useLoginLogic = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [pendingUser, setPendingUser] = useState(null);
  const router = useRouter();

  const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

  const sendOTPEmail = async (userEmail, otp) => {
    try {
      emailjs.init("P6F7R9XXhZEC8ZBHO");
      const templateParams = { to_email: userEmail, otp_code: otp };
      const result = await emailjs.send("service_tgs7syl", "template_vr5ofub", templateParams);
      return result.status === 200;
    } catch (err) {
      console.error("EmailJS Error:", err);
      return false;
    }
  };

  const handleEmailLogin = async (email, password) => {
    setLoading(true);
    const toastId = toast.loading("Checking credentials...");
    
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const newOTP = generateOTP();
      const emailSent = await sendOTPEmail(email, newOTP);

      if (emailSent) {
        setOtpCode(newOTP);
        setPendingUser({
          email: email,
          idToken: await user.getIdToken(),
          uid: user.uid
        });
        toast.success("Security code sent! 🔐", { id: toastId });
        setShowOTPModal(true);
      } else {
        toast.error("Failed to send code.", { id: toastId });
      }
    } catch (err) {
      toast.error("Invalid email or password.", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async (inputOTP) => {
    if (inputOTP === otpCode) {
      const toastId = toast.loading("Verifying...");
      try {
        const res = await signIn("credentials", {
          idToken: pendingUser.idToken,
          email: pendingUser.email,
          uid: pendingUser.uid,
          redirect: false,
        });

        if (res?.error) throw new Error(res.error);

        toast.success("Verified! 🚀", { id: toastId });
        
       // This will work automatically if you set the role in the backend developer session
        router.push("/");
        router.refresh(); 
      } catch (err) {
        toast.error("Session failed.", { id: toastId });
      }
    } else {
      toast.error("Wrong code! ❌");
    }
  };

  const handleSocialLogin = async (provider) => {
    setLoading(true);
    const toastId = toast.loading("Connecting...");
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const res = await signIn("credentials", {
        idToken: await user.getIdToken(),
        email: user.email,
        uid: user.uid,
        redirect: false,
      });

      if (res?.error) throw new Error("Verification failed");
      
      toast.success("Welcome back!", { id: toastId });
      router.push("/");
      router.refresh();
    } catch (err) {
      toast.error("Social Login failed.", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (email) => {
    if (!email) return toast.error("Please enter email!");
    const toastId = toast.loading("Sending...");
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success("Reset link sent!", { id: toastId });
    } catch (err) {
      toast.error("Error: " + err.message, { id: toastId });
    }
  };

  return { 
    handleSocialLogin, handleEmailLogin, handleForgotPassword, 
    verifyOTP, showOTPModal, setShowOTPModal, loading, error 
  };
};