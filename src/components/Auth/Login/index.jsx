// src/components/Auth/Login/index.jsx
"use client";
import LoginForm from "./LoginForm";
import { useLoginLogic } from "./LoginLogic";
import { googleProvider, githubProvider } from "@/src/lib/firebase-config";

const Login = () => {
  const { handleSocialLogin } = useLoginLogic();

  return (
    <LoginForm 
      onGoogleClick={() => handleSocialLogin(googleProvider)}
      onGithubClick={() => handleSocialLogin(githubProvider)}
    />
  );
};

export default Login;