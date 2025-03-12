import React from "react";
import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { ArrowRight, Code, Globe, Users } from "lucide-react";

interface HeroSectionProps {
  title?: string;
  subtitle?: string;
  creatorCta?: string;
  subscriberCta?: string;
  onCreatorClick?: () => void;
  onSubscriberClick?: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({
  title = "Build Your Creator Community",
  subtitle = "Launch your own subscription-based platform with custom branding, complete control, and zero platform fees.",
  creatorCta = "Start Creating",
  subscriberCta = "Learn More",
  onCreatorClick = () => console.log("Creator CTA clicked"),
  onSubscriberClick = () => (window.location.href = "/features"),
}) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  const features = [
    { icon: <Globe className="h-5 w-5" />, text: "Custom Domains" },
    { icon: <Users className="h-5 w-5" />, text: "Community Building" },
    { icon: <Code className="h-5 w-5" />, text: "White-Label Platform" },
  ];

  return (
    <section className="w-full bg-gradient-to-b from-background to-background/80 py-20 px-4 md:px-8 lg:px-12 xl:px-24">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="flex flex-col lg:flex-row items-center justify-between gap-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Hero Content */}
          <motion.div className="flex-1 space-y-8" variants={itemVariants}>
            <div className="space-y-6">
              <motion.h1
                className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight"
                variants={itemVariants}
              >
                {title}
              </motion.h1>

              <motion.p
                className="text-lg md:text-xl text-muted-foreground max-w-2xl"
                variants={itemVariants}
              >
                {subtitle}
              </motion.p>
            </div>

            <motion.div
              className="flex flex-col sm:flex-row gap-4"
              variants={itemVariants}
            >
              <Button
                size="lg"
                onClick={onCreatorClick}
                className="font-semibold"
              >
                {creatorCta}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>

              <Button
                size="lg"
                variant="outline"
                onClick={onSubscriberClick}
                className="font-semibold"
              >
                {subscriberCta}
              </Button>
            </motion.div>

            <motion.div
              className="flex flex-wrap gap-6 pt-4"
              variants={itemVariants}
            >
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 text-sm font-medium"
                >
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary">
                    {feature.icon}
                  </div>
                  <span>{feature.text}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Hero Image */}
          <motion.div className="flex-1 relative" variants={itemVariants}>
            <div className="relative w-full aspect-video rounded-lg overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80"
                alt="Creator platform dashboard"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                <div className="text-white">
                  <p className="font-semibold">Your Brand, Your Community</p>
                  <p className="text-sm opacity-80">
                    Complete control with zero platform fees
                  </p>
                </div>
              </div>
            </div>

            {/* Floating elements for visual interest */}
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-primary/20 rounded-full blur-xl"></div>
            <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-secondary/20 rounded-full blur-xl"></div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
