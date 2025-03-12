import React from "react";
import MemberHeader from "@/components/platform/MemberHeader";
import MemberFooter from "@/components/platform/MemberFooter";
import { Button } from "@/components/ui/button";

const MemberViewStoryboard: React.FC = () => {
  // Sample platform data for demonstration
  const platformData = {
    name: "Fitness Revolution",
    description: "Join our fitness community for expert workouts, nutrition advice, and a supportive community to help you reach your health goals.",
    primary_color: "#3b82f6", // blue
    secondary_color: "#10b981", // green
    logo_url: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=100&h=100&fit=crop&q=80",
  };

  // Sample featured content
  const featuredContent = [
    {
      id: "1",
      title: "Getting Started with Fitness",
      description: "Learn the basics of starting your fitness journey with these simple tips and exercises.",
      thumbnail_url: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&q=80",
      content_type: "article",
    },
    {
      id: "2",
      title: "Advanced Workout Techniques",
      description: "Take your workout to the next level with these advanced techniques demonstrated by our experts.",
      thumbnail_url: "https://images.unsplash.com/photo-1599058917765-a780eda07a3e?w=400&q=80",
      content_type: "video",
    },
    {
      id: "3",
      title: "Nutrition Fundamentals",
      description: "Understand the basics of nutrition and how to fuel your body for optimal performance and recovery.",
      thumbnail_url: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&q=80",
      content_type: "article",
    },
  ];

  // Custom styles based on platform branding
  const heroStyle = {
    backgroundColor: platformData.primary_color,
    color: "white",
  };

  const buttonStyle = {
    backgroundColor: platformData.secondary_color,
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
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    size="lg"
                    style={buttonStyle}
                  >
                    Join Now
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white text-white hover:bg-white/10"
                  >
                    Sign In
                  </Button>
                </div>
              </div>
              <div className="relative hidden lg:block">
                <div className="aspect-video bg-black/20 rounded-lg overflow-hidden">
                  {/* Placeholder for hero image or video */}
                  <div className="absolute inset-0 flex items-center justify-center text-white/50">
                    <img 
                      src={platformData.logo_url} 
                      alt={platformData.name} 
                      className="w-1/2 h-auto object-contain" 
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Content Section */}
        <section className="py-16 px-6 md:px-10 lg:px-16">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold mb-8">Featured Content</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredContent.map((item) => (
                <div key={item.id} className="border rounded-lg overflow-hidden">
                  <div className="aspect-video bg-muted relative">
                    {item.thumbnail_url && (
                      <img
                        src={item.thumbnail_url}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
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
                    >
                      Join to Access
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Membership Tiers Section */}
        <section className="py-16 px-6 md:px-10 lg:px-16 bg-muted/30">
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Membership Options</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-12">
              Choose the membership tier that's right for you and get access to exclusive content.
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
                <Button variant="outline" className="w-full">
                  Sign Up Free
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
                >
                  Get Started
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
