import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { Textarea } from "../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Globe,
  Palette,
  Users,
  CreditCard,
} from "lucide-react";

const CreatePlatform: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [platformData, setPlatformData] = useState({
    name: "",
    description: "",
    category: "",
    subdomain: "",
    customDomain: "",
    primaryColor: "#000000",
    logoUrl: "",
    subscriptionTiers: [
      { name: "Basic", price: "9.99", benefits: "Access to basic content" },
      {
        name: "Premium",
        price: "19.99",
        benefits: "Access to all content, community features",
      },
    ],
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setPlatformData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setPlatformData((prev) => ({ ...prev, [name]: value }));
  };

  const nextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 4));
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the data to your backend
    console.log("Platform data submitted:", platformData);
    // Redirect to dashboard with success message
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header isLoggedIn={true} userType="creator" userName="John Creator" />

      <main className="flex-grow pt-24 pb-16 px-4 md:px-8 lg:px-12">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <Button
              variant="ghost"
              onClick={() => navigate("/dashboard")}
              className="mb-4"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
            </Button>
            <h1 className="text-3xl font-bold tracking-tight">
              Create New Platform
            </h1>
            <p className="text-muted-foreground mt-1">
              Set up your white-label community platform
            </p>
          </div>

          <div className="mb-8">
            <div className="flex justify-between items-center">
              {[1, 2, 3, 4].map((step) => (
                <div key={step} className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${currentStep >= step ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
                  >
                    {currentStep > step ? <Check className="h-5 w-5" /> : step}
                  </div>
                  <span className="text-xs mt-2 text-muted-foreground">
                    {step === 1 && "Basics"}
                    {step === 2 && "Domain"}
                    {step === 3 && "Branding"}
                    {step === 4 && "Pricing"}
                  </span>
                </div>
              ))}
            </div>
            <div className="w-full bg-muted h-1 mt-4 rounded-full overflow-hidden">
              <div
                className="bg-primary h-full transition-all duration-300"
                style={{ width: `${(currentStep / 4) * 100}%` }}
              ></div>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>
                {currentStep === 1 && "Platform Details"}
                {currentStep === 2 && "Domain Configuration"}
                {currentStep === 3 && "Branding & Appearance"}
                {currentStep === 4 && "Subscription Tiers"}
              </CardTitle>
              <CardDescription>
                {currentStep === 1 &&
                  "Enter the basic information about your platform"}
                {currentStep === 2 &&
                  "Set up your custom domain or use a subdomain"}
                {currentStep === 3 &&
                  "Customize the look and feel of your platform"}
                {currentStep === 4 &&
                  "Configure subscription tiers for your members"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit}>
                {/* Step 1: Basic Information */}
                {currentStep === 1 && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Platform Name</Label>
                      <Input
                        id="name"
                        name="name"
                        placeholder="e.g., Fitness Revolution"
                        value={platformData.name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        name="description"
                        placeholder="Describe your platform and what members can expect"
                        value={platformData.description}
                        onChange={handleInputChange}
                        rows={4}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select
                        value={platformData.category}
                        onValueChange={(value) =>
                          handleSelectChange("category", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="fitness">
                            Fitness & Health
                          </SelectItem>
                          <SelectItem value="education">
                            Education & Courses
                          </SelectItem>
                          <SelectItem value="art">Art & Creativity</SelectItem>
                          <SelectItem value="technology">Technology</SelectItem>
                          <SelectItem value="business">
                            Business & Finance
                          </SelectItem>
                          <SelectItem value="lifestyle">Lifestyle</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}

                {/* Step 2: Domain Configuration */}
                {currentStep === 2 && (
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <Globe className="h-5 w-5 mr-2 text-primary" />
                        <h3 className="font-medium">Subdomain (Free)</h3>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Input
                          id="subdomain"
                          name="subdomain"
                          placeholder="your-platform"
                          value={platformData.subdomain}
                          onChange={handleInputChange}
                        />
                        <span className="text-muted-foreground">
                          .creatorplatform.com
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        This subdomain is included with all plans
                      </p>
                    </div>

                    <div className="border-t pt-6 space-y-4">
                      <div className="flex items-center">
                        <Globe className="h-5 w-5 mr-2 text-primary" />
                        <h3 className="font-medium">Custom Domain</h3>
                      </div>
                      <Input
                        id="customDomain"
                        name="customDomain"
                        placeholder="www.yourdomain.com"
                        value={platformData.customDomain}
                        onChange={handleInputChange}
                      />
                      <p className="text-sm text-muted-foreground">
                        Connect your own domain for a professional branded
                        experience. You'll need to update your DNS settings
                        after platform creation.
                      </p>
                    </div>
                  </div>
                )}

                {/* Step 3: Branding & Appearance */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <Palette className="h-5 w-5 mr-2 text-primary" />
                        <h3 className="font-medium">Brand Colors</h3>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div>
                          <Label htmlFor="primaryColor" className="block mb-2">
                            Primary Color
                          </Label>
                          <div className="flex items-center space-x-2">
                            <Input
                              id="primaryColor"
                              name="primaryColor"
                              type="color"
                              value={platformData.primaryColor}
                              onChange={handleInputChange}
                              className="w-12 h-10 p-1"
                            />
                            <Input
                              value={platformData.primaryColor}
                              onChange={handleInputChange}
                              name="primaryColor"
                              className="w-28"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="border-t pt-6 space-y-4">
                      <div className="flex items-center">
                        <svg
                          className="h-5 w-5 mr-2 text-primary"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M3 16V8C3 5.23858 5.23858 3 8 3H16C18.7614 3 21 5.23858 21 8V16C21 18.7614 18.7614 21 16 21H8C5.23858 21 3 18.7614 3 16Z"
                            stroke="currentColor"
                            strokeWidth="2"
                          />
                          <path
                            d="M17.5 6.5H17.51"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <h3 className="font-medium">Logo</h3>
                      </div>
                      <Input
                        id="logoUrl"
                        name="logoUrl"
                        placeholder="https://example.com/your-logo.png"
                        value={platformData.logoUrl}
                        onChange={handleInputChange}
                      />
                      <p className="text-sm text-muted-foreground">
                        Enter a URL to your logo image. Recommended size:
                        200x200px.
                      </p>
                    </div>
                  </div>
                )}

                {/* Step 4: Subscription Tiers */}
                {currentStep === 4 && (
                  <div className="space-y-6">
                    <div className="flex items-center">
                      <CreditCard className="h-5 w-5 mr-2 text-primary" />
                      <h3 className="font-medium">Subscription Tiers</h3>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      Configure the subscription options for your members. You
                      can add more tiers after creation.
                    </p>

                    {platformData.subscriptionTiers.map((tier, index) => (
                      <Card key={index} className="mb-4">
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-center">
                            <Input
                              placeholder="Tier Name"
                              value={tier.name}
                              onChange={(e) => {
                                const newTiers = [
                                  ...platformData.subscriptionTiers,
                                ];
                                newTiers[index].name = e.target.value;
                                setPlatformData({
                                  ...platformData,
                                  subscriptionTiers: newTiers,
                                });
                              }}
                              className="font-medium text-lg w-full"
                            />
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4 pb-2">
                          <div className="flex items-center space-x-2">
                            <span className="text-muted-foreground">$</span>
                            <Input
                              placeholder="Price"
                              value={tier.price}
                              onChange={(e) => {
                                const newTiers = [
                                  ...platformData.subscriptionTiers,
                                ];
                                newTiers[index].price = e.target.value;
                                setPlatformData({
                                  ...platformData,
                                  subscriptionTiers: newTiers,
                                });
                              }}
                              className="w-24"
                            />
                            <span className="text-muted-foreground">
                              /month
                            </span>
                          </div>
                          <div>
                            <Label htmlFor={`benefits-${index}`}>
                              Benefits
                            </Label>
                            <Textarea
                              id={`benefits-${index}`}
                              placeholder="List the benefits for this tier"
                              value={tier.benefits}
                              onChange={(e) => {
                                const newTiers = [
                                  ...platformData.subscriptionTiers,
                                ];
                                newTiers[index].benefits = e.target.value;
                                setPlatformData({
                                  ...platformData,
                                  subscriptionTiers: newTiers,
                                });
                              }}
                              rows={3}
                            />
                          </div>
                        </CardContent>
                      </Card>
                    ))}

                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        setPlatformData({
                          ...platformData,
                          subscriptionTiers: [
                            ...platformData.subscriptionTiers,
                            { name: "New Tier", price: "0.00", benefits: "" },
                          ],
                        });
                      }}
                    >
                      Add Another Tier
                    </Button>
                  </div>
                )}
              </form>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Button>
              {currentStep < 4 ? (
                <Button onClick={nextStep}>
                  Next <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button onClick={handleSubmit}>
                  Create Platform <Check className="ml-2 h-4 w-4" />
                </Button>
              )}
            </CardFooter>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CreatePlatform;
