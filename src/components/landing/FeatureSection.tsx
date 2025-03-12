import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Globe, CreditCard, FileText } from "lucide-react";

interface FeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const Feature = ({
  icon,
  title,
  description = "Feature description",
}: FeatureProps) => {
  return (
    <Card className="bg-white h-full flex flex-col">
      <CardHeader>
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
          {icon}
        </div>
        <CardTitle className="text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-base">{description}</CardDescription>
      </CardContent>
    </Card>
  );
};

interface FeatureSectionProps {
  title?: string;
  subtitle?: string;
  features?: FeatureProps[];
}

const FeatureSection = ({
  title = "Platform Features",
  subtitle = "Everything you need to build and deploy your creator platform",
  features = [
    {
      icon: <Globe className="text-primary w-6 h-6" />,
      title: "Custom Domains",
      description:
        "Configure your own custom domain directly through Vercel for a professional branded experience.",
    },
    {
      icon: <CreditCard className="text-primary w-6 h-6" />,
      title: "One-Click Deployment",
      description:
        "Deploy your community platform to Vercel with a single click and start accepting members immediately.",
    },
    {
      icon: <FileText className="text-primary w-6 h-6" />,
      title: "Complete Customization",
      description:
        "Full control over branding, design, and functionality of your community platform with no technical skills required.",
    },
  ],
}: FeatureSectionProps) => {
  return (
    <section className="w-full py-16 px-4 md:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{title}</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">{subtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Feature
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button size="lg" className="rounded-full px-8">
            Get Started
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;
