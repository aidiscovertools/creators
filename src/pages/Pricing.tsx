import React from "react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Check } from "lucide-react";

const PricingCard = ({
  title,
  price,
  description,
  features,
  buttonText,
  popular = false,
}) => {
  return (
    <Card
      className={`flex flex-col h-full ${popular ? "border-primary shadow-lg" : ""}`}
    >
      {popular && (
        <div className="bg-primary text-primary-foreground text-center py-1 text-sm font-medium">
          Most Popular
        </div>
      )}
      <CardHeader>
        <CardTitle className="text-2xl">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="mb-6">
          <span className="text-4xl font-bold">${price}</span>
          <span className="text-muted-foreground">/month</span>
        </div>
        <ul className="space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <Check className="h-5 w-5 text-primary mr-2 shrink-0" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button className={`w-full ${popular ? "" : "variant-outline"}`}>
          {buttonText}
        </Button>
      </CardFooter>
    </Card>
  );
};

const Pricing: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-grow pt-20">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold tracking-tight mb-4">
              Simple, Transparent Pricing
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Choose the plan that's right for your creator journey
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <PricingCard
              title="Starter"
              price="9"
              description="Perfect for new creators just getting started"
              features={[
                "1 Community Platform",
                "Basic Analytics",
                "Standard Support",
                "2 Subscription Tiers",
                "Vercel Deployment",
                "Custom Domain",
              ]}
              buttonText="Get Started"
            />

            <PricingCard
              title="Professional"
              price="29"
              description="For established creators ready to grow"
              features={[
                "3 Community Platforms",
                "Advanced Analytics",
                "Priority Support",
                "5 Subscription Tiers",
                "Advanced Content Tools",
                "Custom Domains",
                "White-Label Experience",
              ]}
              buttonText="Go Professional"
              popular={true}
            />

            <PricingCard
              title="Enterprise"
              price="99"
              description="For serious creators with large audiences"
              features={[
                "Unlimited Community Platforms",
                "Premium Analytics",
                "24/7 Dedicated Support",
                "Unlimited Subscription Tiers",
                "Premium Content Tools",
                "Multiple Custom Domains",
                "White-Label Experience",
                "API Access",
                "Custom Integrations",
              ]}
              buttonText="Contact Sales"
            />
          </div>

          <div className="mt-16 text-center">
            <h2 className="text-2xl font-semibold mb-4">
              Frequently Asked Questions
            </h2>
            <div className="max-w-3xl mx-auto space-y-6 text-left">
              <div>
                <h3 className="font-medium mb-2">
                  Are there any transaction fees?
                </h3>
                <p className="text-muted-foreground">
                  No, we don't charge any additional transaction fees. You only
                  pay the monthly subscription and standard payment processing
                  fees.
                </p>
              </div>
              <div>
                <h3 className="font-medium mb-2">
                  Can I upgrade or downgrade my plan?
                </h3>
                <p className="text-muted-foreground">
                  Yes, you can change your plan at any time. Changes will be
                  reflected in your next billing cycle.
                </p>
              </div>
              <div>
                <h3 className="font-medium mb-2">Is there a free trial?</h3>
                <p className="text-muted-foreground">
                  Yes, all plans come with a 14-day free trial so you can test
                  the platform before committing.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Pricing;
