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
} from "lucide-react";

const PlatformDetails: React.FC = () => {
  const navigate = useNavigate();
  const { platformId } = useParams<{ platformId: string }>();
  const [activeTab, setActiveTab] = useState("overview");

  // Mock platform data
  const platformData = {
    id: platformId || "1",
    name: "Fitness Revolution",
    description: "A fitness community for health enthusiasts",
    domain: "fitness-revolution.com",
    subdomain: "fitness-revolution",
    status: "active",
    members: 1245,
    revenue: "$3,450",
    lastDeployed: "2023-09-15",
    subscriptionTiers: [
      { name: "Basic", price: "9.99", members: 845 },
      { name: "Premium", price: "19.99", members: 400 },
    ],
    recentMembers: [
      { name: "Sarah Johnson", joined: "2023-10-15", tier: "Premium" },
      { name: "Michael Chen", joined: "2023-10-14", tier: "Basic" },
      { name: "Emma Williams", joined: "2023-10-12", tier: "Premium" },
      { name: "David Brown", joined: "2023-10-10", tier: "Basic" },
    ],
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header isLoggedIn={true} userType="creator" userName="John Creator" />

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
                <Button variant="outline" size="sm" asChild>
                  <a
                    href={`https://${platformData.domain}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center"
                  >
                    <ExternalLink className="mr-2 h-4 w-4" /> Visit Platform
                  </a>
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
                  href={`https://${platformData.domain}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  {platformData.domain}
                </a>
              </div>
              <div className="flex items-center text-sm">
                <Users className="mr-1 h-4 w-4 text-muted-foreground" />
                <span>{platformData.members} members</span>
              </div>
              <div className="flex items-center text-sm">
                <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-green-100 text-green-800">
                  Active
                </span>
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
                    <div className="text-3xl font-bold">
                      {platformData.members}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      +24 this week
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
                    <div className="text-3xl font-bold">
                      {platformData.revenue}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      +$450 from last month
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
                    <div className="text-3xl font-bold">68%</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      +5% from last month
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
                    {platformData.subscriptionTiers.map((tier, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 border rounded-md"
                      >
                        <div>
                          <h3 className="font-medium">{tier.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            ${tier.price}/month
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{tier.members} members</p>
                          <p className="text-sm text-muted-foreground">
                            {Math.round(
                              (tier.members / platformData.members) * 100,
                            )}
                            % of total
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
                  <div className="space-y-4">
                    {platformData.recentMembers.map((member, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                            {member.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium">{member.name}</p>
                            <p className="text-xs text-muted-foreground">
                              Joined {member.joined}
                            </p>
                          </div>
                        </div>
                        <div>
                          <span className="px-2 py-1 text-xs rounded-full bg-primary/10">
                            {member.tier}
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
                  <div className="h-[400px] flex items-center justify-center border rounded-md">
                    <p className="text-muted-foreground">
                      Members management coming soon
                    </p>
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
                  <div className="h-[400px] flex items-center justify-center border rounded-md">
                    <p className="text-muted-foreground">
                      Content management coming soon
                    </p>
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
                        {platformData.domain ? (
                          <span className="flex items-center">
                            <Globe className="h-4 w-4 mr-1 text-green-600" />
                            {platformData.domain} (Active)
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
    </div>
  );
};

export default PlatformDetails;
