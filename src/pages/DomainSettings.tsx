import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert";
import {
  ArrowLeft,
  Check,
  Copy,
  ExternalLink,
  Globe,
  Info,
  RefreshCw,
} from "lucide-react";

const DomainSettings: React.FC = () => {
  const navigate = useNavigate();
  const { platformId } = useParams<{ platformId: string }>();
  const [activeTab, setActiveTab] = useState("custom-domain");
  const [customDomain, setCustomDomain] = useState("");
  const [verificationStatus, setVerificationStatus] = useState<
    "pending" | "verified" | "failed"
  >("pending");
  const [isVerifying, setIsVerifying] = useState(false);

  // Mock platform data
  const platformData = {
    id: platformId || "1",
    name: "Fitness Revolution",
    subdomain: "fitness-revolution",
    customDomain: "fitness-revolution.com",
    status: "active",
  };

  const handleDomainChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomDomain(e.target.value);
  };

  const handleVerifyDomain = () => {
    setIsVerifying(true);
    // Simulate verification process
    setTimeout(() => {
      setVerificationStatus(Math.random() > 0.3 ? "verified" : "failed");
      setIsVerifying(false);
    }, 2000);
  };

  const handleSaveDomain = () => {
    // Here you would save the domain to your backend
    console.log("Saving domain:", customDomain);
    navigate(`/platform/${platformId}`);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header isLoggedIn={true} userType="creator" userName="John Creator" />

      <main className="flex-grow pt-24 pb-16 px-4 md:px-8 lg:px-12">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <Button
              variant="ghost"
              onClick={() => navigate(`/platform/${platformId}`)}
              className="mb-4"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Platform
            </Button>
            <h1 className="text-3xl font-bold tracking-tight">
              {platformData.name}
            </h1>
            <p className="text-muted-foreground mt-1">
              Configure your domain settings
            </p>
          </div>

          <Tabs
            defaultValue="custom-domain"
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-8"
          >
            <TabsList className="grid grid-cols-2 w-[400px]">
              <TabsTrigger value="custom-domain">Custom Domain</TabsTrigger>
              <TabsTrigger value="subdomain">Subdomain</TabsTrigger>
            </TabsList>

            <TabsContent value="custom-domain" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Globe className="mr-2 h-5 w-5" /> Custom Domain
                    Configuration
                  </CardTitle>
                  <CardDescription>
                    Connect your own domain to your platform for a professional
                    branded experience
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="customDomain">Custom Domain</Label>
                      <div className="flex">
                        <Input
                          id="customDomain"
                          placeholder="www.yourdomain.com"
                          value={customDomain}
                          onChange={handleDomainChange}
                          className="rounded-r-none"
                        />
                        <Button
                          onClick={handleVerifyDomain}
                          disabled={!customDomain || isVerifying}
                          className="rounded-l-none"
                        >
                          {isVerifying ? (
                            <>
                              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />{" "}
                              Verifying
                            </>
                          ) : (
                            "Verify"
                          )}
                        </Button>
                      </div>
                    </div>

                    {verificationStatus === "verified" && (
                      <Alert className="bg-green-50 border-green-200">
                        <Check className="h-4 w-4 text-green-600" />
                        <AlertTitle className="text-green-800">
                          Domain Verified
                        </AlertTitle>
                        <AlertDescription className="text-green-700">
                          Your domain has been successfully verified and is
                          ready to use.
                        </AlertDescription>
                      </Alert>
                    )}

                    {verificationStatus === "failed" && (
                      <Alert className="bg-red-50 border-red-200">
                        <Info className="h-4 w-4 text-red-600" />
                        <AlertTitle className="text-red-800">
                          Verification Failed
                        </AlertTitle>
                        <AlertDescription className="text-red-700">
                          We couldn't verify your domain. Please check your DNS
                          settings and try again.
                        </AlertDescription>
                      </Alert>
                    )}

                    <div className="space-y-4 pt-4 border-t">
                      <h3 className="font-medium">DNS Configuration</h3>
                      <p className="text-sm text-muted-foreground">
                        To connect your custom domain, add the following DNS
                        records to your domain provider:
                      </p>

                      <div className="space-y-4">
                        <div className="bg-muted p-4 rounded-md">
                          <div className="flex justify-between items-center mb-2">
                            <h4 className="font-medium">CNAME Record</h4>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                copyToClipboard("cname.vercel-dns.com")
                              }
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-muted-foreground">Type</p>
                              <p>CNAME</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Name</p>
                              <p>www</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Value</p>
                              <p>cname.vercel-dns.com</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">TTL</p>
                              <p>3600</p>
                            </div>
                          </div>
                        </div>

                        <div className="bg-muted p-4 rounded-md">
                          <div className="flex justify-between items-center mb-2">
                            <h4 className="font-medium">A Record</h4>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard("76.76.21.21")}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-muted-foreground">Type</p>
                              <p>A</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Name</p>
                              <p>@</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Value</p>
                              <p>76.76.21.21</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">TTL</p>
                              <p>3600</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="pt-4">
                        <p className="text-sm text-muted-foreground mb-2">
                          Need help? Check out our detailed guide on setting up
                          custom domains:
                        </p>
                        <Button variant="link" className="p-0 h-auto" asChild>
                          <a
                            href="#"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center"
                          >
                            View DNS Configuration Guide{" "}
                            <ExternalLink className="ml-1 h-3 w-3" />
                          </a>
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between border-t pt-6">
                  <Button
                    variant="outline"
                    onClick={() => navigate(`/platform/${platformId}`)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSaveDomain}
                    disabled={verificationStatus !== "verified"}
                  >
                    Save Domain
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="subdomain" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Globe className="mr-2 h-5 w-5" /> Subdomain Configuration
                  </CardTitle>
                  <CardDescription>
                    Your platform comes with a free subdomain on
                    creatorplatform.com
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="subdomain">Your Subdomain</Label>
                      <div className="flex items-center">
                        <Input
                          id="subdomain"
                          value={platformData.subdomain}
                          readOnly
                          className="rounded-r-none"
                        />
                        <div className="bg-muted px-3 py-2 border border-l-0 border-input rounded-r-md text-muted-foreground">
                          .creatorplatform.com
                        </div>
                      </div>
                    </div>

                    <Alert>
                      <Info className="h-4 w-4" />
                      <AlertTitle>Always Available</AlertTitle>
                      <AlertDescription>
                        Your subdomain is always active, even if you configure a
                        custom domain.
                      </AlertDescription>
                    </Alert>

                    <div className="pt-4">
                      <Button variant="outline" className="w-full" asChild>
                        <a
                          href={`https://${platformData.subdomain}.creatorplatform.com`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center"
                        >
                          <ExternalLink className="mr-2 h-4 w-4" />
                          Visit Your Subdomain
                        </a>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default DomainSettings;
