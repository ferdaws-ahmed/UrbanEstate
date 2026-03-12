import { auth } from "@/src/lib/firebase-config"; 
import { 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  sendPasswordResetEmail 
} from "firebase/auth";
import { signIn } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import emailjs from "@emailjs/browser";

export const useLoginLogic = () => {
  const [loading, setLoading] = useState(false);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [pendingUser, setPendingUser] = useState(null);
  const [lockoutTime, setLockoutTime] = useState(0); 
  const router = useRouter();

  // ১. লকআউট টাইমার চেক
  useEffect(() => {
    const storedLockout = localStorage.getItem("lockoutUntil");
    if (storedLockout) {
      const timeLeft = Math.ceil((parseInt(storedLockout) - Date.now()) / 1000);
      if (timeLeft > 0) {
        setLockoutTime(timeLeft);
        const interval = setInterval(() => {
          setLockoutTime((prev) => {
            if (prev <= 1) {
              clearInterval(interval);
              localStorage.removeItem("lockoutUntil");
              localStorage.removeItem("loginAttempts");
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
        return () => clearInterval(interval);
      }
    }
  }, []);

  const handleLoginAttempt = () => {
    let attempts = parseInt(localStorage.getItem("loginAttempts") || "0");
    attempts += 1;
    localStorage.setItem("loginAttempts", attempts.toString());
    if (attempts >= 5) {
      const unlockTime = Date.now() + 5 * 60 * 1000; 
      localStorage.setItem("lockoutUntil", unlockTime.toString());
      setLockoutTime(300);
      toast.error("Too many failed attempts. Locked for 5 mins!");
    }
  };

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
    if (lockoutTime > 0) return toast.error("System locked. Please wait.");

    setLoading(true);
    const toastId = toast.loading("Checking credentials...");
    
    try {
      // Step A: Firebase Auth-এ লগইন করে idToken নেওয়া (NextAuth ভেরিফিকেশনের জন্য)
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const fbUser = userCredential.user;
      const idToken = await fbUser.getIdToken();

      // Step B: MongoDB API-তে রিকোয়েস্ট পাঠানো রোল চেক করার জন্য
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();

      if (!response.ok) {
        handleLoginAttempt();
        throw new Error(data.error || "Login failed");
      }

      localStorage.removeItem("loginAttempts");
      const isDemo = ["user@demo.com", "seller@demo.com", "admin@demo.com"].includes(email);

      // সব ডেটা পেন্ডিং ইউজারে সেভ করা
      setPendingUser({ 
        ...data, 
        idToken, // এটি NextAuth-এ পাঠাতে হবে
        isDemo 
      });

      if (isDemo) {
        setShowOTPModal(true);
        toast.success("Demo credentials verified!", { id: toastId });
      } else {
        const newOTP = generateOTP();
        const emailSent = await sendOTPEmail(email, newOTP);

        if (emailSent) {
          setOtpCode(newOTP);
          toast.success("Security code sent! 🔐", { id: toastId });
          setShowOTPModal(true);
        } else {
          toast.error("Failed to send code.", { id: toastId });
        }
      }
    } catch (err) {
      toast.error(err.message || "Invalid credentials.", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async (inputOTP) => {
    if (inputOTP === otpCode) {
      const toastId = toast.loading("Finalizing session...");
      try {
        // NextAuth-এ idToken এবং role পাঠানো হচ্ছে
        const res = await signIn("credentials", {
          idToken: pendingUser.idToken,
          role: pendingUser.role,
          redirect: false,
        });

        if (res?.error) throw new Error(res.error);

        toast.success("Verified! 🚀", { id: toastId });
        handleRedirect(pendingUser.role);
      } catch (err) {
        toast.error("Session creation failed.", { id: toastId });
      }
    } else {
      toast.error("Wrong code! ❌");
    }
  };

  const handleDemoRedirect = async () => {
    const toastId = toast.loading("Logging into demo...");
    try {
      const res = await signIn("credentials", {
        idToken: pendingUser.idToken,
        role: pendingUser.role,
        redirect: false,
      });

      if (res?.error) throw new Error(res.error);

      toast.success("Welcome Demo User!", { id: toastId });
      handleRedirect(pendingUser.role);
    } catch (err) {
      toast.error("Demo login failed.", { id: toastId });
    }
  };

  const handleRedirect = (role) => {
    if (role === "admin") router.push("/admin/dashboard");
    else if (role === "seller") router.push("/seller/dashboard");
    else router.push("/");
    router.refresh();
  };

  const handleSocialLogin = async (provider) => {
    setLoading(true);
    const toastId = toast.loading("Connecting...");
    try {
      const result = await signInWithPopup(auth, provider);
      const fbUser = result.user;
      const idToken = await fbUser.getIdToken();

      const res = await signIn("credentials", {
        idToken: idToken,
        role: "user", // সোশ্যাল লগইনে ডিফল্ট রোল 'user'
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
    verifyOTP, showOTPModal, setShowOTPModal, loading, 
    lockoutTime, pendingUser, handleDemoRedirect 
  };
};