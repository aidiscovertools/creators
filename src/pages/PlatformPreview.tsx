import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, ExternalLink, Globe, Settings } from "lucide-react";
import MemberHomePage from "@/templates/MemberHomePage";
import MemberContentPage from "@/templates/MemberContentPage";

const PlatformPreview: React.FC = () => {
  const { platformId } = useParams<{ platformId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [platformData, setPlatformData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("home");

  useEffect(() => {
    if (platformId) {
      fetchPlatformData();
    } else {
      setIsLoading(false);
    }
  }, [platformId]);

  const fetchPlatformData = async () => {
    try {
      console.log(
        "PlatformPreview: Fetching platform data for ID:",
        platformId,
      );

      if (!platformId) {
        console.error("PlatformPreview: Invalid platformId");
        throw new Error("Invalid platform ID");
      }

      const { data, error } = await supabase
        .from("platforms")
        .select("*")
        .eq("id", platformId)
        .single();

      console.log("PlatformPreview: Platform data received:", data);
      if (error) {
        console.error("PlatformPreview: Error fetching platform:", error);
        throw error;
      }

      if (!data) {
        console.error(
          "PlatformPreview: No platform found with ID:",
          platformId,
        );
        throw new Error("Platform not found");
      }

      setPlatformData(data);
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!platformData) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-grow pt-24 pb-16 px-4 md:px-8 lg:px-12 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Platform Not Found</h1>
            <p className="text-muted-foreground mb-6">
              The platform you're looking for doesn't exist or you don't have
              access to it.
            </p>
            <Button onClick={() => navigate("/dashboard")}>
              Back to Dashboard
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="bg-background border-b border-border py-3 px-6 md:px-10 lg:px-16 fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(`/platform/${platformId}`)}
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
            </Button>
            <div className="hidden md:flex items-center space-x-2 text-sm text-muted-foreground">
              <span>|</span>
              <span>Previewing: {platformData.name}</span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="hidden md:block"
            >
              <TabsList>
                <TabsTrigger value="home">Home</TabsTrigger>
                <TabsTrigger value="content">Content</TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(`/platform/${platformId}/settings`)}
              >
                <Settings className="mr-2 h-4 w-4" /> Settings
              </Button>
              <Button
                size="sm"
                onClick={() =>
                  window.open(
                    `https://${platformData.subdomain}.sharp-jennings4-ykw3j.dev-2.tempolabs.ai`,
                    "_blank",
                  )
                }
              >
                <Globe className="mr-2 h-4 w-4" /> Visit Site
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-14 flex-grow">
        <div className="w-full h-full">
          {activeTab === "home" ? (
            <MemberHomePage key={platformId} />
          ) : (
            <MemberContentPage key={platformId} />
          )}
        </div>
      </div>

      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-border p-3">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="home">Home</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
};

export default PlatformPreview;
