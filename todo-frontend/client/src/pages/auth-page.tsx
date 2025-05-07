import { useState, useEffect } from "react";
import { Redirect } from "wouter";
import { AuthLayout } from "@/components/layout/auth-layout";
import { LoginForm } from "@/components/auth/login-form";
import { SignupForm } from "@/components/auth/signup-form";
import { useAuth } from "@/hooks/use-auth";
import { Helmet } from "react-helmet-async";

export default function AuthPage() {
  const [showSignup, setShowSignup] = useState(false);
  const { user, isLoading } = useAuth();

  const toggleForm = () => {
    setShowSignup(!showSignup);
  };

  // Redirect to dashboard if already logged in
  if (user && !isLoading) {
    return <Redirect to="/" />;
  }

  return (
    <>
      <Helmet>
        <title>{showSignup ? "Sign Up" : "Login"} | ToDo</title>
        <meta name="description" content="Log in or sign up to manage your tasks with ToDo" />
      </Helmet>
      
      <AuthLayout>
        {showSignup ? (
          <SignupForm onShowLogin={toggleForm} />
        ) : (
          <LoginForm onShowSignup={toggleForm} />
        )}
      </AuthLayout>
    </>
  );
}
