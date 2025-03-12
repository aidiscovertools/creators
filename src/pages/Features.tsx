import React from "react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import FeatureSection from "../components/landing/FeatureSection";

const Features: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-grow pt-20">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold tracking-tight mb-4">
              Platform Features
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Everything you need to build and monetize your creator community
            </p>
          </div>
        </div>

        <FeatureSection
          title="Platform Creation"
          subtitle="Tools designed for building your community platform"
          features={[
            {
              icon: <span className="text-primary w-6 h-6">🌐</span>,
              title: "Custom Domain Integration",
              description:
                "Configure your own domain directly through Vercel for a professional branded experience.",
            },
            {
              icon: <span className="text-primary w-6 h-6">🚀</span>,
              title: "One-Click Deployment",
              description:
                "Deploy your community platform to Vercel with a single click and be online in minutes.",
            },
            {
              icon: <span className="text-primary w-6 h-6">🎨</span>,
              title: "White-Label Branding",
              description:
                "Complete customization of colors, logos, and design elements to match your brand identity.",
            },
          ]}
        />

        <FeatureSection
          title="Community Management"
          subtitle="Tools for running your creator platform"
          features={[
            {
              icon: <span className="text-primary w-6 h-6">💰</span>,
              title: "Subscription Tiers",
              description:
                "Create multiple membership levels with different pricing and access permissions.",
            },
            {
              icon: <span className="text-primary w-6 h-6">📊</span>,
              title: "Analytics Dashboard",
              description:
                "Track member growth, revenue, and content performance with detailed analytics.",
            },
            {
              icon: <span className="text-primary w-6 h-6">📱</span>,
              title: "Multi-Platform Support",
              description:
                "Your community platform works seamlessly across all devices with responsive design.",
            },
          ]}
        />
      </main>

      <Footer />
    </div>
  );
};

export default Features;
