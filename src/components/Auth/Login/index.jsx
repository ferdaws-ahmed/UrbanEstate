// src/components/Auth/Login/index.jsx
"use client";
import LoginForm from "./LoginForm";
import { useLoginLogic } from "./LoginLogic";
import { googleProvider, githubProvider } from "@/src/lib/firebase-config";

const Login = () => {
  
  const { 
    handleSocialLogin, 
    handleEmailLogin, 
    handleForgotPassword, 
    verifyOTP,
    showOTPModal,
    setShowOTPModal,
    loading 
  } = useLoginLogic();

  return (
    <LoginForm 
      onGoogleClick={() => handleSocialLogin(googleProvider)}
      onGithubClick={() => handleSocialLogin(githubProvider)}
      onEmailLogin={handleEmailLogin}          // Email login will not work if this is not sent
      onForgotPassword={handleForgotPassword}  // for Forget Pass 
      verifyOTP={verifyOTP}                    // 2FA 
      showOTPModal={showOTPModal}              // 2FA modal
      setShowOTPModal={setShowOTPModal}        // modal close
      loading={loading}                        // loading animation
    />
  );
};

export default Login;