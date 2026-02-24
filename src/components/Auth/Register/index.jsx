"use client";
import RegisterForm from "./RegisterForm";
import { useRegisterLogic } from "./RegisterLogic";
import { googleProvider, githubProvider } from "@/src/lib/firebase-config";

const Register = () => {
  // ১. লজিক ফাইল থেকে সব ফাংশন বের করে আনা হলো
  const { 
    role, 
    setRole, 
    handleSocialRegister, 
    handleEmailRegister, // এই ফাংশনটি সাবমিটের জন্য জরুরি
    loading,
    error 
  } = useRegisterLogic();

  return (
    <RegisterForm 
      role={role}
      setRole={setRole}
      loading={loading}
      error={error}
      // ২. ফর্মের props এর সাথে লজিক ফাইলের ফাংশন ম্যাপিং
      onEmailRegister={handleEmailRegister} 
      // ৩. আপনার লজিক ফাইল অনুযায়ী প্রোভাইডার পাস করা
      onSocialRegister={(provider) => handleSocialRegister(provider)}
    />
  );
};

export default Register;