"use client";
import RegisterForm from "./RegisterForm";
import { useRegisterLogic } from "./RegisterLogic";

import { googleProvider, githubProvider } from "@/src/lib/firebase-config"; 

const Register = () => {
  const { 
    role, 
    setRole, 
    handleSocialRegister, 
    handleEmailRegister, 
    loading,
    error 
  } = useRegisterLogic();

 
  const handleSocialClick = (type) => {
    if (type === 'google') {
      handleSocialRegister(googleProvider); 
    } else if (type === 'github') {
      handleSocialRegister(githubProvider);
    }
  };

  return (
    <RegisterForm 
      role={role}
      setRole={setRole}
      
      onSocialRegister={handleSocialClick} 
      onEmailRegister={handleEmailRegister}
      loading={loading}
      error={error}
    />
  );
};

export default Register;