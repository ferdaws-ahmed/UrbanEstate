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
    loading,
    lockoutTime,
    // নিচের নতুন প্রপসগুলো লজিক থেকে নিয়ে আসা হলো
    pendingUser,
    handleDemoRedirect 
  } = useLoginLogic();

  return (
    <LoginForm 
      onGoogleClick={() => handleSocialLogin(googleProvider)}
      onGithubClick={() => handleSocialLogin(githubProvider)}
      onEmailLogin={handleEmailLogin}
      onForgotPassword={handleForgotPassword}
      verifyOTP={verifyOTP}
      showOTPModal={showOTPModal}
      setShowOTPModal={setShowOTPModal}
      loading={loading}
      lockoutTime={lockoutTime}
      // LoginForm-এ পাঠানোর জন্য নতুন ডেটা
      pendingUser={pendingUser}
      handleDemoRedirect={handleDemoRedirect}
    />
  );
};

export default Login;