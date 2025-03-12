import React from "react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { Card, CardContent } from "../components/ui/card";

const ShowcaseItem = ({ image, title, creator, category, url }) => {
  return (
    <Card className="overflow-hidden h-full transition-all hover:shadow-lg">
      <div className="aspect-video relative overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform hover:scale-105"
        />
        <div className="absolute top-2 right-2 bg-primary/90 text-primary-foreground text-xs px-2 py-1 rounded-full">
          {category}
        </div>
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-1">{title}</h3>
        <p className="text-muted-foreground text-sm mb-3">by {creator}</p>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary text-sm font-medium hover:underline"
        >
          Visit Community
        </a>
      </CardContent>
    </Card>
  );
};

const Showcase: React.FC = () => {
  const showcaseItems = [
    {
      image:
        "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&q=80",
      title: "Fitness Revolution",
      creator: "Alex Johnson",
      category: "Fitness",
      url: "#",
    },
    {
      image:
        "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&q=80",
      title: "Art Studio Masterclass",
      creator: "Sarah Williams",
      category: "Art",
      url: "#",
    },
    {
      image:
        "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80",
      title: "Code Academy Pro",
      creator: "Michael Chen",
      category: "Technology",
      url: "#",
    },
    {
      image:
        "https://images.unsplash.com/photo-1414124488080-0188dcbb8834?w=800&q=80",
      title: "Culinary Secrets",
      creator: "Jamie Oliver",
      category: "Cooking",
      url: "#",
    },
    {
      image:
        "https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=800&q=80",
      title: "Mindful Meditation",
      creator: "Emma Thompson",
      category: "Wellness",
      url: "#",
    },
    {
      image:
        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80",
      title: "Financial Freedom",
      creator: "Robert Kiyosaki",
      category: "Finance",
      url: "#",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-grow pt-20">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold tracking-tight mb-4">
              Creator Showcase
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Explore thriving creator platforms deployed with our solution
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {showcaseItems.map((item, index) => (
              <ShowcaseItem key={index} {...item} />
            ))}
          </div>

          <div className="mt-16 text-center">
            <h2 className="text-2xl font-semibold mb-6">
              Join These Successful Creators
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
              Launch your own branded platform with Vercel deployment and start
              monetizing your content today.
            </p>
            <button className="bg-primary text-primary-foreground px-8 py-3 rounded-md font-medium">
              Create Your Platform
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Showcase;
