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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  ArrowLeft,
  ArrowUpRight,
  BarChart3,
  Calendar,
  Download,
  LineChart,
  Loader2,
  PieChart,
  Users,
  DollarSign,
  TrendingUp,
} from "lucide-react";

const Analytics: React.FC = () => {
  const navigate = useNavigate();
  const { platformId } = useParams<{ platformId: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  const [timeRange, setTimeRange] = useState("30d");
  const [isLoading, setIsLoading] = useState(true);
  const [platformData, setPlatformData] = useState<any>(null);
  const [analyticsData, setAnalyticsData] = useState<any>(null);

  useEffect(() => {
    if (platformId && user) {
      fetchPlatformData();
      fetchAnalyticsData();
    }
  }, [platformId, user, timeRange]);

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
    }
  };

  const fetchAnalyticsData = async () => {
    // In a real app, this would fetch actual analytics data from the database
    // For now, we'll use mock data
    try {
      // Simulate API call
      setTimeout(() => {
        const mockData = generateMockAnalyticsData(timeRange);
        setAnalyticsData(mockData);
        setIsLoading(false);
      }, 1000);
    } catch (error: any) {
      console.error("Error fetching analytics:", error);
      toast({
        title: "Error",
        description: "Failed to load analytics data",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const generateMockAnalyticsData = (range: string) => {
    // Generate different data based on the selected time range
    const multiplier = range === "7d" ? 1 : range === "30d" ? 4 : 12;

    return {
      overview: {
        totalMembers: 120 + Math.floor(Math.random() * 30),
        activeMembers: 85 + Math.floor(Math.random() * 20),
        totalRevenue: 2450 + Math.floor(Math.random() * 500),
        averageEngagement: 68 + Math.floor(Math.random() * 10),
        memberGrowth: 12 + Math.floor(Math.random() * 8),
        revenueGrowth: 8 + Math.floor(Math.random() * 10),
      },
      members: {
        newMembers: 18 * multiplier + Math.floor(Math.random() * 10),
        churnRate: 3.2 + Math.random() * 1.5,
        tierDistribution: [
          { name: "Free", value: 40 + Math.floor(Math.random() * 10) },
          { name: "Basic", value: 50 + Math.floor(Math.random() * 15) },
          { name: "Premium", value: 30 + Math.floor(Math.random() * 10) },
        ],
        retentionRate: 87 + Math.floor(Math.random() * 5),
        dailyActiveUsers: Array.from({ length: multiplier * 7 }, () =>
          Math.floor(60 + Math.random() * 40),
        ),
      },
      revenue: {
        totalRevenue: 2450 * multiplier + Math.floor(Math.random() * 500),
        recurringRevenue: 2200 * multiplier + Math.floor(Math.random() * 400),
        oneTimeRevenue: 250 * multiplier + Math.floor(Math.random() * 100),
        averageRevenue: 19.5 + Math.random() * 2,
        revenueByTier: [
          {
            name: "Basic",
            value: 950 * multiplier + Math.floor(Math.random() * 200),
          },
          {
            name: "Premium",
            value: 1500 * multiplier + Math.floor(Math.random() * 300),
          },
        ],
        dailyRevenue: Array.from({ length: multiplier * 7 }, () =>
          Math.floor(70 + Math.random() * 50),
        ),
      },
      content: {
        totalViews: 3200 * multiplier + Math.floor(Math.random() * 800),
        averageTimeSpent: 5.2 + Math.random() * 1.5,
        popularContent: [
          {
            title: "Getting Started Guide",
            views: 450 + Math.floor(Math.random() * 100),
            engagement: 78,
          },
          {
            title: "Advanced Techniques",
            views: 380 + Math.floor(Math.random() * 100),
            engagement: 82,
          },
          {
            title: "Community Q&A Session",
            views: 320 + Math.floor(Math.random() * 100),
            engagement: 91,
          },
          {
            title: "Monthly Update",
            views: 290 + Math.floor(Math.random() * 100),
            engagement: 65,
          },
          {
            title: "Expert Interview",
            views: 260 + Math.floor(Math.random() * 100),
            engagement: 73,
          },
        ],
        contentByType: [
          {
            type: "Article",
            views: 1400 * multiplier + Math.floor(Math.random() * 300),
          },
          {
            type: "Video",
            views: 1100 * multiplier + Math.floor(Math.random() * 300),
          },
          {
            type: "Audio",
            views: 500 * multiplier + Math.floor(Math.random() * 200),
          },
          {
            type: "Other",
            views: 200 * multiplier + Math.floor(Math.random() * 100),
          },
        ],
      },
    };
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getGrowthIndicator = (value: number) => {
    if (value > 0) {
      return (
        <span className="flex items-center text-green-600">
          <ArrowUpRight className="h-3 w-3 mr-1" />
          {value}%
        </span>
      );
    } else if (value < 0) {
      return (
        <span className="flex items-center text-red-600">
          <ArrowUpRight className="h-3 w-3 mr-1 rotate-180" />
          {Math.abs(value)}%
        </span>
      );
    } else {
      return <span className="text-muted-foreground">0%</span>;
    }
  };

  // Mock chart component (in a real app, you would use a charting library like recharts or chart.js)
  const MockChart = ({
    data,
    type,
    height = 200,
  }: {
    data: any;
    type: string;
    height?: number;
  }) => {
    return (
      <div
        className="w-full bg-muted/30 rounded-md flex items-end justify-between p-4 relative overflow-hidden"
        style={{ height: `${height}px` }}
      >
        {type === "bar" &&
          data &&
          data.map((item: any, index: number) => {
            const maxValue = Math.max(
              ...data.map((d: any) =>
                typeof d.count === "number"
                  ? d.count
                  : typeof d.amount === "number"
                    ? d.amount
                    : 0,
              ),
            );
            const value =
              typeof item.count === "number"
                ? item.count
                : typeof item.amount === "number"
                  ? item.amount
                  : 0;
            const percentage = (value / maxValue) * 70; // Max height percentage

            return (
              <div
                key={index}
                className="flex flex-col items-center justify-end"
              >
                <div
                  className="w-8 bg-primary rounded-t-sm"
                  style={{ height: `${percentage}%` }}
                ></div>
                <span className="text-xs mt-2">{item.date}</span>
              </div>
            );
          })}

        {type === "line" && (
          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
            Line chart visualization would appear here
          </div>
        )}

        {type === "pie" && (
          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
            Pie chart visualization would appear here
          </div>
        )}

        {!data && (
          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
            No data available for the selected time period
          </div>
        )}
      </div>
    );
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
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <Button
              variant="ghost"
              onClick={() => navigate(`/platform/${platformId}`)}
              className="mb-4"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Platform
            </Button>

            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">
                  {platformData?.name || "Platform"} Analytics
                </h1>
                <p className="text-muted-foreground mt-1">
                  Track your platform's performance and growth
                </p>
              </div>

              <div className="flex items-center mt-4 md:mt-0 space-x-2">
                <Select value={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger className="w-[180px]">
                    <Calendar className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Select time range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7d">Last 7 days</SelectItem>
                    <SelectItem value="30d">Last 30 days</SelectItem>
                    <SelectItem value="90d">Last 90 days</SelectItem>
                  </SelectContent>
                </Select>

                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" /> Export
                </Button>
              </div>
            </div>
          </div>

          <Tabs
            defaultValue="overview"
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-8"
          >
            <TabsList className="grid grid-cols-4 w-full md:w-[600px]">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="members">Members</TabsTrigger>
              <TabsTrigger value="revenue">Revenue</TabsTrigger>
              <TabsTrigger value="content">Content</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Overview Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Total Members
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">
                      {analyticsData.overview.totalMembers}
                    </div>
                    <div className="flex items-center mt-1 text-xs">
                      {getGrowthIndicator(analyticsData.overview.memberGrowth)}
                      <span className="text-muted-foreground ml-1">
                        vs. previous period
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Active Members
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">
                      {analyticsData.overview.activeMembers}
                    </div>
                    <div className="flex items-center mt-1 text-xs">
                      <span className="text-muted-foreground">
                        {Math.round(
                          (analyticsData.overview.activeMembers /
                            analyticsData.overview.totalMembers) *
                            100,
                        )}
                        % of total
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Total Revenue
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">
                      {formatCurrency(analyticsData.overview.totalRevenue)}
                    </div>
                    <div className="flex items-center mt-1 text-xs">
                      {getGrowthIndicator(analyticsData.overview.revenueGrowth)}
                      <span className="text-muted-foreground ml-1">
                        vs. previous period
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Engagement Rate
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">
                      {analyticsData.overview.averageEngagement}%
                    </div>
                    <div className="flex items-center mt-1 text-xs">
                      <span className="text-muted-foreground">
                        Average across all content
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Growth Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Platform Growth</CardTitle>
                  <CardDescription>
                    Member growth and revenue over time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] flex items-center justify-center border rounded-md">
                    <div className="text-center">
                      <LineChart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">
                        Growth chart visualization would appear here
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Member Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">
                          New members
                        </span>
                        <span className="font-medium">
                          {analyticsData.members.newMembers}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">
                          Churn rate
                        </span>
                        <span className="font-medium">
                          {analyticsData.members.churnRate.toFixed(1)}%
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">
                          Retention rate
                        </span>
                        <span className="font-medium">
                          {analyticsData.members.retentionRate}%
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Revenue Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">
                          Recurring revenue
                        </span>
                        <span className="font-medium">
                          {formatCurrency(
                            analyticsData.revenue.recurringRevenue,
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">
                          One-time revenue
                        </span>
                        <span className="font-medium">
                          {formatCurrency(analyticsData.revenue.oneTimeRevenue)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">
                          Avg. revenue per member
                        </span>
                        <span className="font-medium">
                          ${analyticsData.revenue.averageRevenue.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Content Performance
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">
                          Total views
                        </span>
                        <span className="font-medium">
                          {analyticsData.content.totalViews.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">
                          Avg. time spent
                        </span>
                        <span className="font-medium">
                          {analyticsData.content.averageTimeSpent.toFixed(1)}{" "}
                          min
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">
                          Most popular content
                        </span>
                        <span className="font-medium">
                          {analyticsData.content.popularContent[0].title}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="members" className="space-y-6">
              {/* Member Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      New Members
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">
                      {analyticsData.members.newMembers}
                    </div>
                    <div className="flex items-center mt-1 text-xs">
                      <span className="text-muted-foreground">
                        During selected period
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Retention Rate
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">
                      {analyticsData.members.retentionRate}%
                    </div>
                    <div className="flex items-center mt-1 text-xs">
                      <span className="text-muted-foreground">
                        Members who stayed active
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Churn Rate
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">
                      {analyticsData.members.churnRate.toFixed(1)}%
                    </div>
                    <div className="flex items-center mt-1 text-xs">
                      <span className="text-muted-foreground">
                        Members who left or became inactive
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Member Activity Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Daily Active Members</CardTitle>
                  <CardDescription>
                    Number of active members per day
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] flex items-center justify-center border rounded-md">
                    <div className="text-center">
                      <BarChart3 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">
                        Member activity chart would appear here
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Tier Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Subscription Tier Distribution</CardTitle>
                  <CardDescription>
                    Breakdown of members by subscription tier
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col md:flex-row items-center gap-8">
                  <div className="w-[200px] h-[200px] relative flex items-center justify-center">
                    <PieChart className="h-full w-full text-muted-foreground" />
                  </div>

                  <div className="flex-1 space-y-4">
                    {analyticsData.members.tierDistribution.map(
                      (tier: any, index: number) => (
                        <div
                          key={index}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center">
                            <div
                              className={`w-3 h-3 rounded-full mr-2 ${
                                index === 0
                                  ? "bg-blue-500"
                                  : index === 1
                                    ? "bg-green-500"
                                    : "bg-purple-500"
                              }`}
                            ></div>
                            <span>{tier.name}</span>
                          </div>
                          <div className="flex items-center">
                            <span className="font-medium mr-2">
                              {tier.value}
                            </span>
                            <span className="text-muted-foreground text-sm">
                              (
                              {Math.round(
                                (tier.value /
                                  analyticsData.overview.totalMembers) *
                                  100,
                              )}
                              %)
                            </span>
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="revenue" className="space-y-6">
              {/* Revenue Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Total Revenue
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">
                      {formatCurrency(analyticsData.revenue.totalRevenue)}
                    </div>
                    <div className="flex items-center mt-1 text-xs">
                      <span className="text-muted-foreground">
                        During selected period
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Recurring Revenue
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">
                      {formatCurrency(analyticsData.revenue.recurringRevenue)}
                    </div>
                    <div className="flex items-center mt-1 text-xs">
                      <span className="text-muted-foreground">
                        {Math.round(
                          (analyticsData.revenue.recurringRevenue /
                            analyticsData.revenue.totalRevenue) *
                            100,
                        )}
                        % of total
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Avg. Revenue Per Member
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">
                      ${analyticsData.revenue.averageRevenue.toFixed(2)}
                    </div>
                    <div className="flex items-center mt-1 text-xs">
                      <span className="text-muted-foreground">
                        Monthly average
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Revenue Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Daily Revenue</CardTitle>
                  <CardDescription>Revenue generated per day</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] flex items-center justify-center border rounded-md">
                    <div className="text-center">
                      <BarChart3 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">
                        Revenue chart would appear here
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Revenue by Tier */}
              <Card>
                <CardHeader>
                  <CardTitle>Revenue by Subscription Tier</CardTitle>
                  <CardDescription>
                    Breakdown of revenue by subscription tier
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {analyticsData.revenue.revenueByTier.map(
                      (tier: any, index: number) => (
                        <div key={index} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">{tier.name}</span>
                            <span className="font-medium">
                              {formatCurrency(tier.value)}
                            </span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2.5 overflow-hidden">
                            <div
                              className={`h-full rounded-full ${index === 0 ? "bg-blue-500" : "bg-purple-500"}`}
                              style={{
                                width: `${(tier.value / analyticsData.revenue.totalRevenue) * 100}%`,
                              }}
                            ></div>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {Math.round(
                              (tier.value /
                                analyticsData.revenue.totalRevenue) *
                                100,
                            )}
                            % of total revenue
                          </p>
                        </div>
                      ),
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="content" className="space-y-6">
              {/* Content Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Total Content Views
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">
                      {analyticsData.content.totalViews.toLocaleString()}
                    </div>
                    <div className="flex items-center mt-1 text-xs">
                      <span className="text-muted-foreground">
                        During selected period
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Average Time Spent
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">
                      {analyticsData.content.averageTimeSpent.toFixed(1)} min
                    </div>
                    <div className="flex items-center mt-1 text-xs">
                      <span className="text-muted-foreground">
                        Per content view
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Popular Content */}
              <Card>
                <CardHeader>
                  <CardTitle>Most Popular Content</CardTitle>
                  <CardDescription>
                    Content with the highest views and engagement
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4 font-medium">
                            Title
                          </th>
                          <th className="text-right py-3 px-4 font-medium">
                            Views
                          </th>
                          <th className="text-right py-3 px-4 font-medium">
                            Engagement
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {analyticsData.content.popularContent.map(
                          (content: any, index: number) => (
                            <tr
                              key={index}
                              className="border-b last:border-0 hover:bg-muted/50"
                            >
                              <td className="py-3 px-4">{content.title}</td>
                              <td className="py-3 px-4 text-right">
                                {content.views.toLocaleString()}
                              </td>
                              <td className="py-3 px-4 text-right">
                                <div className="flex items-center justify-end">
                                  <div className="w-16 bg-muted rounded-full h-1.5 mr-2 overflow-hidden">
                                    <div
                                      className="h-full bg-primary rounded-full"
                                      style={{
                                        width: `${content.engagement}%`,
                                      }}
                                    ></div>
                                  </div>
                                  <span>{content.engagement}%</span>
                                </div>
                              </td>
                            </tr>
                          ),
                        )}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              {/* Content by Type */}
              <Card>
                <CardHeader>
                  <CardTitle>Content Views by Type</CardTitle>
                  <CardDescription>
                    Breakdown of content views by content type
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col md:flex-row items-center gap-8">
                  <div className="w-[200px] h-[200px] relative flex items-center justify-center">
                    <PieChart className="h-full w-full text-muted-foreground" />
                  </div>

                  <div className="flex-1 space-y-4">
                    {analyticsData.content.contentByType.map(
                      (item: any, index: number) => (
                        <div
                          key={index}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center">
                            <div
                              className={`w-3 h-3 rounded-full mr-2 ${
                                index === 0
                                  ? "bg-blue-500"
                                  : index === 1
                                    ? "bg-green-500"
                                    : index === 2
                                      ? "bg-purple-500"
                                      : "bg-gray-500"
                              }`}
                            ></div>
                            <span>{item.type}</span>
                          </div>
                          <div className="flex items-center">
                            <span className="font-medium mr-2">
                              {item.views.toLocaleString()}
                            </span>
                            <span className="text-muted-foreground text-sm">
                              (
                              {Math.round(
                                (item.views /
                                  analyticsData.content.totalViews) *
                                  100,
                              )}
                              %)
                            </span>
                          </div>
                        </div>
                      ),
                    )}
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

export default Analytics;
