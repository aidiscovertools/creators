import React, { useState } from "react";
import { Link } from "react-router-dom";
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
  Plus,
  Settings,
  Globe,
  Users,
  BarChart,
  FileText,
  ExternalLink,
  Edit,
  Trash2,
} from "lucide-react";

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState("platforms");

  // Mock data for platforms
  const platforms = [
    {
      id: 1,
      name: "Fitness Revolution",
      domain: "fitness-revolution.com",
      members: 1245,
      revenue: "$3,450",
      status: "active",
      lastDeployed: "2023-09-15",
    },
    {
      id: 2,
      name: "Cooking Masterclass",
      domain: "cooking-masterclass.com",
      members: 876,
      revenue: "$2,120",
      status: "active",
      lastDeployed: "2023-10-02",
    },
    {
      id: 3,
      name: "Tech Tutorials",
      domain: "",
      members: 0,
      revenue: "$0",
      status: "draft",
      lastDeployed: "-",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header isLoggedIn={true} userType="creator" userName="John Creator" />

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
              onClick={() => (window.location.href = "/create-platform")}
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {platforms.map((platform) => (
                  <Card
                    key={platform.id}
                    className={
                      platform.status === "draft" ? "border-dashed" : ""
                    }
                  >
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-xl">
                          {platform.name}
                        </CardTitle>
                        {platform.status === "active" ? (
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                            Active
                          </span>
                        ) : (
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                            Draft
                          </span>
                        )}
                      </div>
                      <CardDescription>
                        {platform.domain ? (
                          <a
                            href={`https://${platform.domain}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center text-primary hover:underline"
                          >
                            <Globe className="h-3 w-3 mr-1" />
                            {platform.domain}
                          </a>
                        ) : (
                          <span className="text-muted-foreground">
                            No domain configured
                          </span>
                        )}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pb-3">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Members</p>
                          <p className="font-medium flex items-center">
                            <Users className="h-3 w-3 mr-1" />
                            {platform.members}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Revenue</p>
                          <p className="font-medium flex items-center">
                            <BarChart className="h-3 w-3 mr-1" />
                            {platform.revenue}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Last Deployed</p>
                          <p className="font-medium">{platform.lastDeployed}</p>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between pt-3">
                      {platform.status === "active" ? (
                        <Button variant="outline" size="sm" asChild>
                          <a
                            href={`https://${platform.domain}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="h-4 w-4 mr-1" /> Visit
                          </a>
                        </Button>
                      ) : (
                        <Button variant="outline" size="sm">
                          <Globe className="h-4 w-4 mr-1" /> Deploy
                        </Button>
                      )}
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/platform/${platform.id}`)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                ))}

                {/* Create new platform card */}
                <Card
                  className="border-dashed flex flex-col items-center justify-center p-6 h-full cursor-pointer hover:bg-accent/50 transition-colors"
                  onClick={() => (window.location.href = "/create-platform")}
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
