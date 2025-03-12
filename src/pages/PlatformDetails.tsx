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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import {
  ArrowLeft,
  BarChart,
  Edit,
  ExternalLink,
  Globe,
  Settings,
  Users,
  FileText,
  Loader2,
  Rocket,
} from "lucide-react";
import DeploymentModal from "../components/platform/DeploymentModal";

const PlatformDetails: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { platformId } = useParams<{ platformId: string }>();
  const [activeTab, setActiveTab] = useState("overview");
  const [isLoading, setIsLoading] = useState(true);
  const [platformData, setPlatformData] = useState<any>(null);
  const [subscriptionTiers, setSubscriptionTiers] = useState<any[]>([]);
  const [recentMembers, setRecentMembers] = useState<any[]>([]);
  const [isDeployModalOpen, setIsDeployModalOpen] = useState(false);

  useEffect(() => {
    if (platformId && user) {
      fetchPlatformData();
      fetchSubscriptionTiers();
      fetchRecentMembers();
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

  const fetchSubscriptionTiers = async () => {
    try {
      const { data, error } = await supabase
        .from("subscription_tiers")
        .select("*")
        .eq("platform_id", platformId)
        .order("price", { ascending: true });

      if (error) throw error;
      setSubscriptionTiers(data || []);
    } catch (error: any) {
      console.error("Error fetching subscription tiers:", error);
    }
  };

  const fetchRecentMembers = async () => {
    try {
      const { data, error } = await supabase
        .from("members")
        .select(
          `*, 
          profiles:user_id(id, name, email, avatar_url), 
          subscription_tiers:tier_id(id, name, price)`,
        )
        .eq("platform_id", platformId)
        .order("joined_at", { ascending: false })
        .limit(4);

      if (error) throw error;
      setRecentMembers(data || []);
    } catch (error: any) {
      console.error("Error fetching recent members:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!platformData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Platform Not Found</h2>
          <p className="text-muted-foreground mb-4">
            The platform you're looking for doesn't exist or you don't have
            permission to view it.
          </p>
          <Button onClick={() => navigate("/dashboard")}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const getDomain = () => {
    if (platformData.custom_domain) return platformData.custom_domain;
    if (platformData.subdomain)
      return `${platformData.subdomain}.creatorplatform.com`;
    return null;
  };

  const domain = getDomain();
  const isActive = platformData.status === "active";
  const totalMembers = recentMembers.length;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-grow pt-24 pb-16 px-4 md:px-8 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <Button
              variant="ghost"
              onClick={() => navigate("/dashboard")}
              className="mb-4"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
            </Button>

            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">
                  {platformData.name}
                </h1>
                <p className="text-muted-foreground mt-1">
                  {platformData.description}
                </p>
              </div>
              <div className="flex items-center mt-4 md:mt-0 space-x-2">
                {isActive ? (
                  <Button variant="outline" size="sm" asChild>
                    <a
                      href={`https://${domain}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center"
                    >
                      <ExternalLink className="mr-2 h-4 w-4" /> Visit Platform
                    </a>
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsDeployModalOpen(true)}
                  >
                    <Rocket className="mr-2 h-4 w-4" /> Deploy
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(`/platform/${platformId}/analytics`)}
                >
                  <BarChart className="mr-2 h-4 w-4" /> Analytics
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(`/platform/${platformId}/settings`)}
                >
                  <Settings className="mr-2 h-4 w-4" /> Settings
                </Button>
              </div>
            </div>

            <div className="flex items-center mt-4 space-x-4">
              <div className="flex items-center text-sm">
                <Globe className="mr-1 h-4 w-4 text-muted-foreground" />
                <a
                  href={`https://${domain}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  {domain}
                </a>
              </div>
              <div className="flex items-center text-sm">
                <Users className="mr-1 h-4 w-4 text-muted-foreground" />
                <span>{totalMembers} members</span>
              </div>
              <div className="flex items-center text-sm">
                {isActive ? (
                  <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-green-100 text-green-800">
                    Active
                  </span>
                ) : (
                  <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-amber-100 text-amber-800">
                    Draft
                  </span>
                )}
              </div>
            </div>
          </div>

          <Tabs
            defaultValue="overview"
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-8"
          >
            <TabsList className="grid grid-cols-4 md:w-[600px]">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="members">Members</TabsTrigger>
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Stats Cards */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Total Members
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{totalMembers}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {isActive
                        ? "Active members"
                        : "Platform not deployed yet"}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Monthly Revenue
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">$0</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {isActive
                        ? "No revenue yet"
                        : "Platform not deployed yet"}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Engagement Rate
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">0%</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {isActive
                        ? "No engagement yet"
                        : "Platform not deployed yet"}
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Subscription Tiers */}
              <Card>
                <CardHeader>
                  <CardTitle>Subscription Tiers</CardTitle>
                  <CardDescription>
                    Overview of your platform's subscription tiers
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {subscriptionTiers.map((tier) => (
                      <div
                        key={tier.id}
                        className="flex items-center justify-between p-4 border rounded-md"
                      >
                        <div>
                          <h3 className="font-medium">{tier.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            ${tier.price}/month
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">0 members</p>
                          <p className="text-sm text-muted-foreground">
                            {tier.is_popular && "Popular tier"}
                          </p>
                        </div>
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() =>
                        navigate(`/platform/${platformId}/subscription-tiers`)
                      }
                    >
                      Manage Subscription Tiers
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Members */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Members</CardTitle>
                  <CardDescription>
                    New members who joined your platform
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {recentMembers.length > 0 ? (
                    <div className="space-y-4">
                      {recentMembers.map((member) => (
                        <div
                          key={member.id}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                              {member.profiles?.name?.charAt(0) || "U"}
                            </div>
                            <div>
                              <p className="font-medium">
                                {member.profiles?.name || "Unknown User"}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Joined{" "}
                                {new Date(
                                  member.joined_at,
                                ).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div>
                            <span className="px-2 py-1 text-xs rounded-full bg-primary/10">
                              {member.subscription_tiers?.name || "Free"}
                            </span>
                          </div>
                        </div>
                      ))}
                      <Button
                        variant="link"
                        className="w-full"
                        onClick={() => setActiveTab("members")}
                      >
                        View All Members
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-muted-foreground">
                        No members have joined yet.
                      </p>
                      {!isActive && (
                        <Button
                          variant="outline"
                          className="mt-4"
                          onClick={() => setIsDeployModalOpen(true)}
                        >
                          <Rocket className="mr-2 h-4 w-4" /> Deploy Platform
                        </Button>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="members" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Platform Members</CardTitle>
                  <CardDescription>
                    Manage your community members
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-muted-foreground">
                      Invite, manage, and organize your platform members. Track
                      engagement and revenue.
                    </p>
                    <Button
                      onClick={() =>
                        navigate(`/platform/${platformId}/members`)
                      }
                    >
                      <Users className="mr-2 h-4 w-4" /> Manage Members
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="content" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Content Management</CardTitle>
                  <CardDescription>
                    Manage your platform content
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-muted-foreground">
                      Create, edit, and organize your platform content. Manage
                      articles, videos, and more.
                    </p>
                    <Button
                      onClick={() =>
                        navigate(`/platform/${platformId}/content`)
                      }
                    >
                      <FileText className="mr-2 h-4 w-4" /> Manage Content
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Domain Settings</CardTitle>
                    <CardDescription>
                      Manage your platform domains
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="font-medium mb-2">Custom Domain</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        {platformData.custom_domain ? (
                          <span className="flex items-center">
                            <Globe className="h-4 w-4 mr-1 text-green-600" />
                            {platformData.custom_domain} (Active)
                          </span>
                        ) : (
                          "No custom domain configured"
                        )}
                      </p>
                    </div>
                    <div>
                      <h3 className="font-medium mb-2">Subdomain</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        <span className="flex items-center">
                          <Globe className="h-4 w-4 mr-1" />
                          {platformData.subdomain}.creatorplatform.com
                        </span>
                      </p>
                    </div>
                    <Button
                      onClick={() =>
                        navigate(`/platform/${platformId}/domain-settings`)
                      }
                    >
                      Manage Domains
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Platform Settings</CardTitle>
                    <CardDescription>
                      General platform configuration
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="font-medium mb-2">Platform Details</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Update your platform name, description, and other basic
                        information
                      </p>
                    </div>
                    <div>
                      <h3 className="font-medium mb-2">Appearance</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Customize your platform's colors, logo, and branding
                      </p>
                    </div>
                    <Button
                      onClick={() =>
                        navigate(`/platform/${platformId}/settings`)
                      }
                    >
                      Platform Settings
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />

      {/* Deployment Modal */}
      <DeploymentModal
        isOpen={isDeployModalOpen}
        onClose={() => setIsDeployModalOpen(false)}
        platformId={platformId || ""}
        platformName={platformData.name}
        subdomain={platformData.subdomain}
      />
    </div>
  );
};

export default PlatformDetails;
