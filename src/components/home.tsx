import React, { useState } from "react";
import { Link } from "react-router-dom";
import Header from "./layout/Header";
import HeroSection from "./landing/HeroSection";
import FeatureSection from "./landing/FeatureSection";
import AuthModal from "./auth/AuthModal";
import Footer from "./layout/Footer";

const Home: React.FC = () => {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const handleCTA = () => {
    setAuthModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-grow pt-20">
        {" "}
        {/* Add padding-top to account for fixed header */}
        <HeroSection
          onCreatorClick={handleCTA}
          title="Build Your Creator Platform"
          subtitle="Launch your own white-label community platform with custom domains, complete control, and direct Vercel deployment."
          creatorCta="Start Building"
          subscriberCta="Learn More"
        />
        <FeatureSection />
        {/* Testimonials Section */}
        <section className="w-full py-16 px-4 md:px-8 bg-background">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Trusted by Creators
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Join creators who have launched their own branded community
                platforms with direct Vercel deployment
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Testimonial 1 */}
              <div className="bg-card rounded-lg p-6 shadow-sm border border-border">
                <div className="flex items-center mb-4">
                  <img
                    src="https://api.dicebear.com/7.x/avataaars/svg?seed=alex"
                    alt="Creator"
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <h4 className="font-semibold">Alex Johnson</h4>
                    <p className="text-sm text-muted-foreground">
                      Fitness Creator
                    </p>
                  </div>
                </div>
                <p className="text-muted-foreground">
                  "I was able to double my revenue by moving from other
                  platforms to this one. The custom domain feature really helped
                  me build my brand identity."
                </p>
              </div>

              {/* Testimonial 2 */}
              <div className="bg-card rounded-lg p-6 shadow-sm border border-border">
                <div className="flex items-center mb-4">
                  <img
                    src="https://api.dicebear.com/7.x/avataaars/svg?seed=sarah"
                    alt="Creator"
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <h4 className="font-semibold">Sarah Williams</h4>
                    <p className="text-sm text-muted-foreground">
                      Art Educator
                    </p>
                  </div>
                </div>
                <p className="text-muted-foreground">
                  "The subscription tier system is incredibly flexible. I can
                  now offer different levels of content access to my community
                  members based on their interests."
                </p>
              </div>

              {/* Testimonial 3 */}
              <div className="bg-card rounded-lg p-6 shadow-sm border border-border">
                <div className="flex items-center mb-4">
                  <img
                    src="https://api.dicebear.com/7.x/avataaars/svg?seed=michael"
                    alt="Creator"
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <h4 className="font-semibold">Michael Chen</h4>
                    <p className="text-sm text-muted-foreground">
                      Tech Educator
                    </p>
                  </div>
                </div>
                <p className="text-muted-foreground">
                  "The analytics tools have been game-changing for understanding
                  what content resonates with my audience. I've been able to
                  grow my community by 300% in just 6 months."
                </p>
              </div>
            </div>
          </div>
        </section>
        {/* CTA Section */}
        <section className="w-full py-20 px-4 md:px-8 bg-primary/5">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Launch Your Platform?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Create your own white-label community platform with custom domain
              and direct Vercel deployment.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleCTA}
                className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-3 rounded-md font-medium"
              >
                Start Building
              </button>
              <button
                onClick={() => (window.location.href = "/features")}
                className="bg-secondary text-secondary-foreground hover:bg-secondary/90 px-8 py-3 rounded-md font-medium"
              >
                View Features
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />
    </div>
  );
};

export default Home;
