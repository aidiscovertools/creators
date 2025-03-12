import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
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
  Loader2,
  Save,
} from "lucide-react";

const DomainSettings: React.FC = () => {
  const navigate = useNavigate();
  const { platformId } = useParams<{ platformId: string }>();
  const [activeTab, setActiveTab] = useState("custom-domain");
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [platformData, setPlatformData] = useState<any>(null);
  const [formData, setFormData] = useState({
    subdomain: "",
    custom_domain: "",
  });
  const [verificationStatus, setVerificationStatus] = useState<
    "pending" | "verifying" | "verified" | "failed"
  >("pending");
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    if (platformId && user) {
      fetchPlatformData();
    }
  }, [platformId, user]);

  const fetchPlatformData = async () => {
    try {
      const { data, error } = await supabase
        .from("platforms")
        .select("*")
        .eq("id", platformId)
        .single();

      if (error) throw error;
      setPlatformData(data);
      setFormData({
        subdomain: data.subdomain || "",
        custom_domain: data.custom_domain || "",
      });
    } catch (error: any) {
      console.error("Error fetching platform:", error);
      toast({
        title: "Error",
        description: "Failed to load platform data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleVerifyDomain = () => {
    setIsVerifying(true);
    // Simulate verification process
    setTimeout(() => {
      setVerificationStatus(Math.random() > 0.3 ? "verified" : "failed");
      setIsVerifying(false);
    }, 2000);
  };

  const handleSave = async () => {
    if (!user || !platformId) return;

    setIsSaving(true);
    try {
      // Format subdomain - lowercase, no spaces, only alphanumeric and hyphens
      const formattedSubdomain = formData.subdomain
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");

      const updates = {
        subdomain: formattedSubdomain,
        custom_domain: formData.custom_domain,
      };

      const { data, error } = await supabase
        .from("platforms")
        .update(updates)
        .eq("id", platformId)
        .select()
        .single();

      if (error) throw error;

      setPlatformData(data);
      toast({
        title: "Settings saved",
        description: "Your domain settings have been updated successfully.",
      });
    } catch (error: any) {
      console.error("Error updating domain settings:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update domain settings",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveDomain = () => {
    // Here you would save the domain to your backend
    console.log("Saving domain:", formData.custom_domain);
    navigate(`/platform/${platformId}`);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "The DNS record has been copied to your clipboard.",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

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
                      <Label htmlFor="custom_domain">Custom Domain</Label>
                      <div className="flex">
                        <Input
                          id="custom_domain"
                          name="custom_domain"
                          placeholder="www.yourdomain.com"
                          value={formData.custom_domain}
                          onChange={handleInputChange}
                          className="rounded-r-none"
                        />
                        <Button
                          onClick={handleVerifyDomain}
                          disabled={!formData.custom_domain || isVerifying}
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
                    onClick={handleSave}
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
                    sharp-jennings4-ykw3j.dev-2.tempolabs.ai
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="subdomain">Your Subdomain</Label>
                      <div className="flex items-center">
                        <Input
                          id="subdomain"
                          name="subdomain"
                          value={formData.subdomain}
                          onChange={handleInputChange}
                          className="rounded-r-none"
                        />
                        <div className="bg-muted px-3 py-2 border border-l-0 border-input rounded-r-md text-muted-foreground">
                          .sharp-jennings4-ykw3j.dev-2.tempolabs.ai
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
                          href={`https://${platformData.subdomain}.sharp-jennings4-ykw3j.dev-2.tempolabs.ai`}
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
                <CardFooter className="flex justify-end border-t pt-6">
                  <Button onClick={handleSave} disabled={isSaving}>
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" /> Save Changes
                      </>
                    )}
                  </Button>
                </CardFooter>
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
