import React, { useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import AuthModal from "../components/auth/AuthModal";

const Login: React.FC = () => {
  const [authModalOpen, setAuthModalOpen] = useState(true);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-grow pt-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Welcome Back</h1>
          <p className="text-muted-foreground mb-6">
            Sign in to access your account
          </p>
          <button
            onClick={() => setAuthModalOpen(true)}
            className="bg-primary text-primary-foreground px-6 py-2 rounded-md"
          >
            Sign In
          </button>
        </div>
      </main>

      <Footer />

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />
    </div>
  );
};

export default Login;
