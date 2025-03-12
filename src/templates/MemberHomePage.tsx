import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import MemberHeader from "@/components/platform/MemberHeader";
import MemberFooter from "@/components/platform/MemberFooter";
import MemberAuthModal from "@/components/platform/MemberAuthModal";
import { Button } from "@/components/ui/button";

const MemberHomePage: React.FC = () => {
  const { platformId } = useParams<{ platformId: string }>();
  const { user } = useAuth();
  const [platformData, setPlatformData] = useState<any>(null);
  const [featuredContent, setFeaturedContent] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<"login" | "signup">(
    "signup",
  );

  useEffect(() => {
    console.log("MemberHomePage: platformId changed to:", platformId);
    if (platformId) {
      setIsLoading(true);
      fetchPlatformData();
      fetchFeaturedContent();
    }
  }, [platformId]);

  const fetchPlatformData = async () => {
    try {
      console.log("MemberHomePage: Fetching platform data for ID:", platformId);

      if (!platformId) {
        console.error("MemberHomePage: Invalid platformId");
        throw new Error("Invalid platform ID");
      }

      const { data, error } = await supabase
        .from("platforms")
        .select("*")
        .eq("id", platformId)
        .single();

      console.log("MemberHomePage: Platform data received:", data);
      if (error) {
        // If not found, create a default platform for testing
        if (error.code === "PGRST116") {
          console.log("Platform not found in database, using default data");
          const defaultPlatform = {
            id: platformId,
            name: "Sample Platform",
            description: "This is a sample platform for testing",
            subdomain: "sample",
            custom_domain: null,
            logo_url: null,
            primary_color: "#3b82f6",
            secondary_color: "#10b981",
            status: "active",
            created_at: new Date().toISOString(),
          };
          setPlatformData(defaultPlatform);
          return;
        }
        throw error;
      }

      setPlatformData(data);
    } catch (error) {
      console.error("Error fetching platform data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchFeaturedContent = async () => {
    try {
      // Fetch public content or content available to non-members
      const { data, error } = await supabase
        .from("content")
        .select("*")
        .eq("platform_id", platformId)
        .eq("status", "published")
        .is("access_tier", null) // Only public content
        .order("created_at", { ascending: false })
        .limit(3);

      if (error) throw error;
      setFeaturedContent(data || []);
    } catch (error) {
      console.error("Error fetching featured content:", error);
    }
  };

  const openAuthModal = (tab: "login" | "signup") => {
    setAuthModalTab(tab);
    setAuthModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!platformData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Platform Not Found</h1>
          <p className="text-muted-foreground">
            The platform you're looking for doesn't exist or has been removed.
          </p>
        </div>
      </div>
    );
  }

  // Custom styles based on platform branding
  const heroStyle = {
    backgroundColor: platformData.primary_color || "#000",
    color: "white",
  };

  const buttonStyle = {
    backgroundColor: platformData.secondary_color || "var(--primary)",
    color: "white",
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <MemberHeader
        platformName={platformData.name}
        platformLogo={platformData.logo_url}
        primaryColor={platformData.primary_color}
        secondaryColor={platformData.secondary_color}
      />

      <main className="flex-grow pt-20">
        {/* Hero Section */}
        <section className="py-20 px-6 md:px-10 lg:px-16" style={heroStyle}>
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold mb-6">
                  {platformData.name}
                </h1>
                <p className="text-xl opacity-90 mb-8">
                  {platformData.description}
                </p>
                {!user && (
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button
                      size="lg"
                      onClick={() => openAuthModal("signup")}
                      style={buttonStyle}
                    >
                      Join Now
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      onClick={() => openAuthModal("login")}
                      className="border-white text-white hover:bg-white/10"
                    >
                      Sign In
                    </Button>
                  </div>
                )}
              </div>
              <div className="relative hidden lg:block">
                <div className="aspect-video bg-black/20 rounded-lg overflow-hidden">
                  {/* Placeholder for hero image or video */}
                  <div className="absolute inset-0 flex items-center justify-center text-white/50">
                    {platformData.logo_url ? (
                      <img
                        src={platformData.logo_url}
                        alt={platformData.name}
                        className="w-1/2 h-auto object-contain"
                      />
                    ) : (
                      <span className="text-2xl">Featured Content</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Content Section */}
        {featuredContent.length > 0 && (
          <section className="py-16 px-6 md:px-10 lg:px-16">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-3xl font-bold mb-8">Featured Content</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {featuredContent.map((item) => (
                  <div
                    key={item.id}
                    className="border rounded-lg overflow-hidden"
                  >
                    <div className="aspect-video bg-muted relative">
                      {item.thumbnail_url ? (
                        <img
                          src={item.thumbnail_url}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                          {item.content_type === "video" ? (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-12 w-12"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                          ) : (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-12 w-12"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                              />
                            </svg>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                      <p className="text-muted-foreground text-sm line-clamp-2">
                        {item.description}
                      </p>
                    </div>
                    <div className="px-4 pb-4">
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => !user && openAuthModal("signup")}
                      >
                        {user ? "View Content" : "Join to Access"}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Membership Tiers Section */}
        <section className="py-16 px-6 md:px-10 lg:px-16 bg-muted/30">
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Membership Options</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-12">
              Choose the membership tier that's right for you and get access to
              exclusive content.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Free Tier */}
              <div className="bg-background border rounded-lg p-8 flex flex-col h-full">
                <h3 className="text-xl font-bold mb-2">Free</h3>
                <div className="text-3xl font-bold mb-1">$0</div>
                <p className="text-muted-foreground mb-6">Forever free</p>
                <ul className="space-y-3 mb-8 flex-grow text-left">
                  <li className="flex items-start">
                    <svg
                      className="h-5 w-5 text-green-500 mr-2 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                    <span>Access to free content</span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="h-5 w-5 text-green-500 mr-2 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                    <span>Community forum access</span>
                  </li>
                </ul>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => !user && openAuthModal("signup")}
                >
                  {user ? "Current Plan" : "Sign Up Free"}
                </Button>
              </div>

              {/* Basic Tier */}
              <div className="bg-background border-2 border-primary rounded-lg p-8 flex flex-col h-full relative">
                <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs px-3 py-1 rounded-bl-lg rounded-tr-lg font-medium">
                  Popular
                </div>
                <h3 className="text-xl font-bold mb-2">Basic</h3>
                <div className="text-3xl font-bold mb-1">$9.99</div>
                <p className="text-muted-foreground mb-6">per month</p>
                <ul className="space-y-3 mb-8 flex-grow text-left">
                  <li className="flex items-start">
                    <svg
                      className="h-5 w-5 text-green-500 mr-2 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                    <span>All free content</span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="h-5 w-5 text-green-500 mr-2 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                    <span>Basic exclusive content</span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="h-5 w-5 text-green-500 mr-2 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                    <span>Community forum access</span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="h-5 w-5 text-green-500 mr-2 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                    <span>Monthly newsletter</span>
                  </li>
                </ul>
                <Button
                  className="w-full"
                  style={buttonStyle}
                  onClick={() => !user && openAuthModal("signup")}
                >
                  {user ? "Upgrade" : "Get Started"}
                </Button>
              </div>

              {/* Premium Tier */}
              <div className="bg-background border rounded-lg p-8 flex flex-col h-full">
                <h3 className="text-xl font-bold mb-2">Premium</h3>
                <div className="text-3xl font-bold mb-1">$19.99</div>
                <p className="text-muted-foreground mb-6">per month</p>
                <ul className="space-y-3 mb-8 flex-grow text-left">
                  <li className="flex items-start">
                    <svg
                      className="h-5 w-5 text-green-500 mr-2 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                    <span>All basic features</span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="h-5 w-5 text-green-500 mr-2 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                    <span>Premium exclusive content</span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="h-5 w-5 text-green-500 mr-2 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                    <span>Direct messaging with creator</span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="h-5 w-5 text-green-500 mr-2 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                    <span>Monthly live sessions</span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="h-5 w-5 text-green-500 mr-2 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                    <span>Priority support</span>
                  </li>
                </ul>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => !user && openAuthModal("signup")}
                >
                  {user ? "Upgrade" : "Get Started"}
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* About Creator Section */}
        <section className="py-16 px-6 md:px-10 lg:px-16">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6">
                  About {platformData.name}
                </h2>
                <p className="text-muted-foreground mb-6">
                  {platformData.description}
                </p>
                <p className="text-muted-foreground mb-6">
                  Join our community today to access exclusive content, connect
                  with like-minded individuals, and grow together.
                </p>
                {!user && (
                  <Button
                    onClick={() => openAuthModal("signup")}
                    style={buttonStyle}
                  >
                    Join Our Community
                  </Button>
                )}
              </div>
              <div className="relative">
                <div className="aspect-square bg-muted rounded-lg overflow-hidden">
                  {/* Placeholder for creator image */}
                  <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                    {platformData.logo_url ? (
                      <img
                        src={platformData.logo_url}
                        alt={platformData.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-2xl">Creator Image</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <MemberFooter
        platformName={platformData.name}
        platformLogo={platformData.logo_url}
        primaryColor={platformData.primary_color}
        secondaryColor={platformData.secondary_color}
      />

      <MemberAuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        defaultTab={authModalTab}
        platformName={platformData.name}
        primaryColor={platformData.primary_color}
        secondaryColor={platformData.secondary_color}
      />
    </div>
  );
};

export default MemberHomePage;
