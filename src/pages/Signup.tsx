import React, { useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import AuthModal from "../components/auth/AuthModal";

const Signup: React.FC = () => {
  const [authModalOpen, setAuthModalOpen] = useState(true);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-grow pt-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Create Your Account</h1>
          <p className="text-muted-foreground mb-6">
            Join our platform and start creating or subscribing
          </p>
          <button
            onClick={() => setAuthModalOpen(true)}
            className="bg-primary text-primary-foreground px-6 py-2 rounded-md"
          >
            Sign Up
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

export default Signup;
