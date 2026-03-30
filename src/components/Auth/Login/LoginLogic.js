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

  // ১. লকআউট টাইমার ফিক্স (Real-time sync with localStorage)
  useEffect(() => {
    const checkLockout = () => {
      const storedLockout = localStorage.getItem("lockoutUntil");
      if (storedLockout) {
        const timeLeft = Math.ceil((parseInt(storedLockout) - Date.now()) / 1000);
        if (timeLeft > 0) {
          setLockoutTime(timeLeft);
        } else {
          setLockoutTime(0);
          localStorage.removeItem("lockoutUntil");
          localStorage.removeItem("loginAttempts");
        }
      }
    };

    checkLockout();
    const interval = setInterval(checkLockout, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleLoginAttempt = () => {
    let attempts = parseInt(localStorage.getItem("loginAttempts") || "0");
    attempts += 1;
    localStorage.setItem("loginAttempts", attempts.toString());
    
    if (attempts >= 5) {
      const unlockTime = Date.now() + 5 * 60 * 1000; // 5 mins
      localStorage.setItem("lockoutUntil", unlockTime.toString());
      setLockoutTime(300);
      return true;
    }
    return false;
  };

  const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

  const sendOTPEmail = async (userEmail, otp) => {
    try {
      emailjs.init("P6F7R9XXhZEC8ZBHO");
      const templateParams = { to_email: userEmail, otp_code: otp };
      const result = await emailjs.send("service_tgs7syl", "template_vr5ofub", templateParams);
      return result.status === 200;
    } catch (err) {
      return false;
    }
  };

  const handleEmailLogin = async (email, password) => {
    if (lockoutTime > 0) return toast.error(`System locked. Try again in ${lockoutTime}s`);

    setLoading(true);
    const toastId = toast.loading("Checking credentials...");
    
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const fbUser = userCredential.user;
      const idToken = await fbUser.getIdToken();

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      localStorage.removeItem("loginAttempts");
      localStorage.removeItem("lockoutUntil");
      const isDemo = ["user@demo.com", "seller@demo.com", "admin@demo.com"].includes(email);

      setPendingUser({ ...data, idToken, isDemo });

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
      const isNewlyLocked = handleLoginAttempt();
      
      // মিনিংফুল এরর মেসেজ হ্যান্ডলিং
      let errorMsg = "Invalid email or password.";
      if (isNewlyLocked || err.code === "auth/too-many-requests") {
        errorMsg = "Too many failed attempts. Locked for 5 mins!";
      } else if (err.code === "auth/user-not-found") {
        errorMsg = "No account found with this email.";
      } else if (err.code === "auth/wrong-password") {
        errorMsg = "Incorrect password. Try again.";
      } else if (err.message.includes("Database")) {
        errorMsg = "Database connection error. Try again later.";
      }

      toast.error(errorMsg, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async (inputOTP) => {
    if (inputOTP === otpCode) {
      const toastId = toast.loading("Finalizing session...");
      try {
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
    if (role === "admin") router.push("/dashboard/admin");
    else if (role === "seller") router.push("/dashboard/seller");
    else router.push("/dashboard/user");
    router.refresh();
  };

  const handleSocialLogin = async (provider) => {
    setLoading(true);
    const toastId = toast.loading("Connecting...");
    try {
      const result = await signInWithPopup(auth, provider);
      const fbUser = result.user;
      const idToken = await fbUser.getIdToken();

      // সোশ্যাল লগইনের জন্য ডেটাবেজ থেকে রোল এবং ইউজার ডাটা চেক করা
      const dbRes = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: fbUser.email, isSocial: true }), // isSocial ফ্ল্যাগ দিয়ে পাসওয়ার্ড চেক স্কিপ করা যেতে পারে
      });

      let role = "user";
      if (dbRes.ok) {
        const dbData = await dbRes.json();
        role = dbData.role || "user";
      }

      const res = await signIn("credentials", { idToken, role, redirect: false });
      if (res?.error) throw new Error("Verification failed");

      toast.success("Welcome back!", { id: toastId });
      handleRedirect(role);
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