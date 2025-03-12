import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { Plus, Settings, FileText, Loader2 } from "lucide-react";
import { platformApi } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";
import PlatformCard from "@/components/platform/PlatformCard";
import { useAuth } from "@/lib/auth";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isLoading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState("platforms");
  const [platforms, setPlatforms] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchPlatforms();
    }
  }, [user]);

  const fetchPlatforms = async () => {
    setIsLoading(true);
    try {
      const data = await platformApi.getUserPlatforms();
      setPlatforms(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to load platforms",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePlatform = () => {
    fetchPlatforms();
  };

  if (authLoading) {
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
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Creator Dashboard
              </h1>
              <p className="text-muted-foreground mt-1">
                Manage your community platforms and content
              </p>
            </div>
            <Button
              className="mt-4 md:mt-0"
              onClick={() => navigate("/create-platform")}
            >
              <Plus className="mr-2 h-4 w-4" /> Create New Platform
            </Button>
          </div>

          <Tabs
            defaultValue="platforms"
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-8"
          >
            <TabsList className="grid grid-cols-3 md:w-[400px]">
              <TabsTrigger value="platforms">Platforms</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="platforms" className="space-y-6">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {platforms.map((platform) => (
                    <PlatformCard
                      key={platform.id}
                      platform={platform}
                      onDelete={handleDeletePlatform}
                    />
                  ))}

                  {/* Create new platform card */}
                  <Card
                    className="border-dashed flex flex-col items-center justify-center p-6 h-full cursor-pointer hover:bg-accent/50 transition-colors"
                    onClick={() => navigate("/create-platform")}
                  >
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      <Plus className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-medium text-center mb-2">
                      Create New Platform
                    </h3>
                    <p className="text-sm text-muted-foreground text-center">
                      Deploy a new community platform with custom branding
                    </p>
                  </Card>
                </div>
              )}
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Platform Analytics</CardTitle>
                  <CardDescription>
                    View performance metrics across all your platforms
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] flex items-center justify-center border rounded-md">
                    <p className="text-muted-foreground">
                      Analytics dashboard coming soon
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                  <CardDescription>
                    Manage your creator account settings
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium mb-2">Profile Information</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Update your account details and profile information
                      </p>
                      <Button variant="outline">
                        <Settings className="h-4 w-4 mr-2" /> Edit Profile
                      </Button>
                    </div>

                    <div className="pt-4 border-t">
                      <h3 className="font-medium mb-2">
                        Billing & Subscription
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Manage your subscription plan and payment methods
                      </p>
                      <Button variant="outline">
                        <FileText className="h-4 w-4 mr-2" /> Billing Settings
                      </Button>
                    </div>

                    <div className="pt-4 border-t">
                      <h3 className="font-medium mb-2">API Keys</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Manage API keys for integrations with your platforms
                      </p>
                      <Button variant="outline">
                        <Settings className="h-4 w-4 mr-2" /> Manage API Keys
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

export default Dashboard;
