import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import MemberHeader from "../components/platform/MemberHeader";
import MemberFooter from "../components/platform/MemberFooter";
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
import { Input } from "../components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import {
  BookOpen,
  Calendar,
  Clock,
  CreditCard,
  FileText,
  Image,
  Loader2,
  Play,
  Search,
  Star,
  Video,
} from "lucide-react";

const MemberDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { platformId } = useParams<{ platformId: string }>();
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const [platformData, setPlatformData] = useState<any>(null);
  const [memberData, setMemberData] = useState<any>(null);
  const [contentItems, setContentItems] = useState<any[]>([]);
  const [featuredContent, setFeaturedContent] = useState<any[]>([]);

  useEffect(() => {
    console.log("MemberDashboard: platformId changed to:", platformId);
    setIsLoading(true);
    const loadData = async () => {
      if (platformId) {
        try {
          await fetchPlatformData();
          if (user) {
            await fetchMemberData();
            await fetchContent();
          }
        } catch (error) {
          console.error("Error loading data:", error);
        }
      }
      setIsLoading(false);
    };

    loadData();
  }, [platformId, user]);

  const fetchPlatformData = async () => {
    try {
      console.log("Fetching platform data for ID:", platformId);

      if (!platformId || platformId === "undefined") {
        console.error("Invalid platformId:", platformId);
        throw new Error("Invalid platform ID");
      }

      const { data, error } = await supabase
        .from("platforms")
        .select("*")
        .eq("id", platformId)
        .single();

      if (error) {
        console.error("Supabase error:", error);
        // If not found, create a default platform for testing
        if (error.code === "PGRST116") {
          console.log("Platform not found in database, using default data");
          const defaultPlatform = {
            id: platformId,
            name: "Sample Platform",
            description: "This is a sample platform for testing",
            creator_id: user?.id || "unknown",
            subdomain: "sample",
            custom_domain: null,
            logo_url: null,
            primary_color: "#3b82f6",
            secondary_color: "#10b981",
            status: "active",
            created_at: new Date().toISOString(),
          };
          setPlatformData(defaultPlatform);
          return;
        }
        throw error;
      }

      console.log("Platform data received:", data);
      setPlatformData(data);
    } catch (error: any) {
      console.error("Error fetching platform:", error);
      toast({
        title: "Error",
        description: "Failed to load platform data",
        variant: "destructive",
      });
      // Don't navigate away, just show error toast
    }
  };

  const fetchMemberData = async () => {
    try {
      // First get the member record for this user on this platform
      const { data: memberData, error: memberError } = await supabase
        .from("members")
        .select(
          `
          *, 
          subscription_tiers:tier_id(id, name, price, benefits)
        `,
        )
        .eq("platform_id", platformId)
        .eq("user_id", user?.id)
        .single();

      if (memberError) {
        if (memberError.code === "PGRST116") {
          // Not found - user is not a member of this platform
          setMemberData(null);
        } else {
          throw memberError;
        }
      } else {
        setMemberData(memberData);
      }
    } catch (error: any) {
      console.error("Error fetching member data:", error);
      toast({
        title: "Error",
        description: "Failed to load membership data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchContent = async () => {
    try {
      // Get member's tier to determine what content they can access
      const { data: memberData } = await supabase
        .from("members")
        .select("tier_id")
        .eq("platform_id", platformId)
        .eq("user_id", user?.id)
        .single();

      // Fetch content that is either available to all or to the member's tier
      const { data, error } = await supabase
        .from("content")
        .select("*")
        .eq("platform_id", platformId)
        .eq("status", "published")
        .or(
          `access_tier.is.null,access_tier.eq.${memberData?.tier_id || "null"}`,
        )
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Set all content
      setContentItems(data || []);

      // Set featured content (most recent 3 items)
      setFeaturedContent(data?.slice(0, 3) || []);
    } catch (error: any) {
      console.error("Error fetching content:", error);
      toast({
        title: "Error",
        description: "Failed to load content",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getContentIcon = (type: string) => {
    switch (type) {
      case "article":
        return <FileText className="h-5 w-5" />;
      case "video":
        return <Video className="h-5 w-5" />;
      case "image":
        return <Image className="h-5 w-5" />;
      case "audio":
        return <FileText className="h-5 w-5" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Sample content items for initial state
  const sampleContentItems = [
    {
      id: "1",
      title: "Getting Started with Fitness",
      content_type: "article",
      description:
        "Learn the basics of starting your fitness journey with these simple tips and exercises.",
      thumbnail_url:
        "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&q=80",
      created_at: "2023-10-15T10:30:00Z",
    },
    {
      id: "2",
      title: "Advanced Workout Techniques",
      content_type: "video",
      description:
        "Take your workout to the next level with these advanced techniques demonstrated by our experts.",
      thumbnail_url:
        "https://images.unsplash.com/photo-1599058917765-a780eda07a3e?w=400&q=80",
      created_at: "2023-10-18T14:45:00Z",
    },
    {
      id: "3",
      title: "Nutrition Fundamentals",
      content_type: "article",
      description:
        "Understand the basics of nutrition and how to fuel your body for optimal performance and recovery.",
      thumbnail_url:
        "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&q=80",
      created_at: "2023-10-20T09:15:00Z",
    },
    {
      id: "4",
      title: "Meditation for Beginners",
      content_type: "audio",
      description:
        "Start your meditation practice with this guided session designed for beginners.",
      thumbnail_url:
        "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&q=80",
      created_at: "2023-10-22T16:30:00Z",
    },
    {
      id: "5",
      title: "Yoga Flow Session",
      content_type: "video",
      description:
        "Follow along with this 30-minute yoga flow session to improve flexibility and reduce stress.",
      thumbnail_url:
        "https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?w=400&q=80",
      created_at: "2023-10-25T11:00:00Z",
    },
    {
      id: "6",
      title: "Recovery Strategies",
      content_type: "article",
      description:
        "Learn effective recovery strategies to help your body heal and grow stronger after intense workouts.",
      thumbnail_url:
        "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&q=80",
      created_at: "2023-10-28T08:45:00Z",
    },
  ];

  const filteredContent = (
    contentItems.length > 0 ? contentItems : sampleContentItems
  ).filter((item) => {
    return (
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.description &&
        item.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <MemberHeader
        platformName={platformData?.name || "Platform"}
        platformLogo={platformData?.logo_url}
        primaryColor={platformData?.primary_color}
        secondaryColor={platformData?.secondary_color}
      />

      <main className="flex-grow pt-24 pb-16 px-4 md:px-8 lg:px-12">
        <div className="max-w-7xl mx-auto">
          {/* Platform Header */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">
                  {platformData?.name || "Platform"}
                </h1>
                <p className="text-muted-foreground mt-1">
                  {memberData ? (
                    <span className="flex items-center">
                      <span>
                        Member since {formatDate(memberData.joined_at)}
                      </span>
                      <span className="mx-2">•</span>
                      <span className="flex items-center">
                        <CreditCard className="h-4 w-4 mr-1" />
                        {memberData.subscription_tiers?.name || "Free"} Plan
                      </span>
                    </span>
                  ) : (
                    "Browse available content"
                  )}
                </p>
              </div>

              <div className="mt-4 md:mt-0 relative w-full md:w-[300px]">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search content..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Member Welcome Card */}
          {memberData && (
            <Card className="mb-8 bg-primary/5 border-primary/20">
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                  <Avatar className="h-16 w-16">
                    {profile?.avatar_url ? (
                      <AvatarImage
                        src={profile.avatar_url}
                        alt={profile.name || "Member"}
                      />
                    ) : (
                      <AvatarFallback className="text-lg">
                        {(profile?.name || "U").substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold mb-1">
                      Welcome back, {profile?.name || "Member"}!
                    </h2>
                    <p className="text-muted-foreground">
                      You have access to {filteredContent.length} pieces of
                      content with your{" "}
                      {memberData.subscription_tiers?.name || "Free"}{" "}
                      subscription.
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 w-full md:w-auto">
                    <Button className="w-full md:w-auto" asChild>
                      <Link to={`/platform/${platformId}/view/pricing`}>
                        <Star className="mr-2 h-4 w-4" /> Upgrade Subscription
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full md:w-auto"
                      asChild
                    >
                      <Link to={`/platform/${platformId}/view/account`}>
                        <CreditCard className="mr-2 h-4 w-4" /> Manage Billing
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Featured Content */}
          {featuredContent.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6">Featured Content</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {(featuredContent.length > 0
                  ? featuredContent
                  : sampleContentItems.slice(0, 3)
                ).map((item) => (
                  <Card
                    key={item.id}
                    className="overflow-hidden flex flex-col h-full"
                  >
                    <div className="aspect-video relative overflow-hidden bg-muted">
                      {item.thumbnail_url ? (
                        <img
                          src={item.thumbnail_url}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          {getContentIcon(item.content_type)}
                        </div>
                      )}
                      <div className="absolute top-2 right-2">
                        <div className="bg-background/80 backdrop-blur-sm text-foreground px-2 py-1 rounded-md text-xs font-medium flex items-center">
                          {getContentIcon(item.content_type)}
                          <span className="ml-1 capitalize">
                            {item.content_type}
                          </span>
                        </div>
                      </div>
                    </div>
                    <CardContent className="flex-1 pt-4">
                      <h3 className="text-lg font-semibold mb-2">
                        {item.title}
                      </h3>
                      <p className="text-muted-foreground text-sm line-clamp-2">
                        {item.description}
                      </p>
                    </CardContent>
                    <CardFooter className="pt-0 pb-4">
                      <div className="flex justify-between items-center w-full">
                        <div className="text-xs text-muted-foreground flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {formatDate(item.created_at)}
                        </div>
                        <Button size="sm" className="gap-1" asChild>
                          <Link
                            to={`/platform/${platformId}/view/content/${item.id}`}
                          >
                            {item.content_type === "video" ? (
                              <>
                                <Play className="h-4 w-4" /> Watch
                              </>
                            ) : item.content_type === "audio" ? (
                              <>
                                <Play className="h-4 w-4" /> Listen
                              </>
                            ) : (
                              <>
                                <BookOpen className="h-4 w-4" /> Read
                              </>
                            )}
                          </Link>
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Content Tabs */}
          <Tabs
            defaultValue="all"
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-8"
          >
            <TabsList className="w-full md:w-auto">
              <TabsTrigger value="all">All Content</TabsTrigger>
              <TabsTrigger value="articles">Articles</TabsTrigger>
              <TabsTrigger value="videos">Videos</TabsTrigger>
              <TabsTrigger value="audio">Audio</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-6">
              {filteredContent.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredContent.map((item) => (
                    <Card
                      key={item.id}
                      className="overflow-hidden flex flex-col h-full"
                    >
                      <div className="aspect-video relative overflow-hidden bg-muted">
                        {item.thumbnail_url ? (
                          <img
                            src={item.thumbnail_url}
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            {getContentIcon(item.content_type)}
                          </div>
                        )}
                        <div className="absolute top-2 right-2">
                          <div className="bg-background/80 backdrop-blur-sm text-foreground px-2 py-1 rounded-md text-xs font-medium flex items-center">
                            {getContentIcon(item.content_type)}
                            <span className="ml-1 capitalize">
                              {item.content_type}
                            </span>
                          </div>
                        </div>
                      </div>
                      <CardContent className="flex-1 pt-4">
                        <h3 className="text-lg font-semibold mb-2">
                          {item.title}
                        </h3>
                        <p className="text-muted-foreground text-sm line-clamp-2">
                          {item.description}
                        </p>
                      </CardContent>
                      <CardFooter className="pt-0 pb-4">
                        <div className="flex justify-between items-center w-full">
                          <div className="text-xs text-muted-foreground flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            {formatDate(item.created_at)}
                          </div>
                          <Button size="sm" className="gap-1" asChild>
                            <Link
                              to={`/platform/${platformId}/view/content/${item.id}`}
                            >
                              {item.content_type === "video" ? (
                                <>
                                  <Play className="h-4 w-4" /> Watch
                                </>
                              ) : item.content_type === "audio" ? (
                                <>
                                  <Play className="h-4 w-4" /> Listen
                                </>
                              ) : (
                                <>
                                  <BookOpen className="h-4 w-4" /> Read
                                </>
                              )}
                            </Link>
                          </Button>
                        </div>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <h3 className="text-lg font-medium mb-2">No content found</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    {searchQuery
                      ? "No content matches your search. Try different keywords."
                      : "There is no content available for your subscription tier yet."}
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="articles" className="space-y-6">
              {filteredContent.filter((item) => item.content_type === "article")
                .length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredContent
                    .filter((item) => item.content_type === "article")
                    .map((item) => (
                      <Card
                        key={item.id}
                        className="overflow-hidden flex flex-col h-full"
                      >
                        <div className="aspect-video relative overflow-hidden bg-muted">
                          {item.thumbnail_url ? (
                            <img
                              src={item.thumbnail_url}
                              alt={item.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <FileText className="h-8 w-8 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                        <CardContent className="flex-1 pt-4">
                          <h3 className="text-lg font-semibold mb-2">
                            {item.title}
                          </h3>
                          <p className="text-muted-foreground text-sm line-clamp-2">
                            {item.description}
                          </p>
                        </CardContent>
                        <CardFooter className="pt-0 pb-4">
                          <div className="flex justify-between items-center w-full">
                            <div className="text-xs text-muted-foreground flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              {formatDate(item.created_at)}
                            </div>
                            <Button size="sm" asChild>
                              <Link
                                to={`/platform/${platformId}/view/content/${item.id}`}
                              >
                                <BookOpen className="mr-2 h-4 w-4" /> Read
                              </Link>
                            </Button>
                          </div>
                        </CardFooter>
                      </Card>
                    ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <h3 className="text-lg font-medium mb-2">
                    No articles found
                  </h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    {searchQuery
                      ? "No articles match your search. Try different keywords."
                      : "There are no articles available for your subscription tier yet."}
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="videos" className="space-y-6">
              {filteredContent.filter((item) => item.content_type === "video")
                .length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredContent
                    .filter((item) => item.content_type === "video")
                    .map((item) => (
                      <Card
                        key={item.id}
                        className="overflow-hidden flex flex-col h-full"
                      >
                        <div className="aspect-video relative overflow-hidden bg-muted">
                          {item.thumbnail_url ? (
                            <img
                              src={item.thumbnail_url}
                              alt={item.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Video className="h-8 w-8 text-muted-foreground" />
                            </div>
                          )}
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="bg-background/20 backdrop-blur-sm rounded-full p-3">
                              <Play className="h-8 w-8 text-white" />
                            </div>
                          </div>
                        </div>
                        <CardContent className="flex-1 pt-4">
                          <h3 className="text-lg font-semibold mb-2">
                            {item.title}
                          </h3>
                          <p className="text-muted-foreground text-sm line-clamp-2">
                            {item.description}
                          </p>
                        </CardContent>
                        <CardFooter className="pt-0 pb-4">
                          <div className="flex justify-between items-center w-full">
                            <div className="text-xs text-muted-foreground flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              {formatDate(item.created_at)}
                            </div>
                            <Button size="sm" asChild>
                              <Link
                                to={`/platform/${platformId}/view/content/${item.id}`}
                              >
                                <Play className="mr-2 h-4 w-4" /> Watch
                              </Link>
                            </Button>
                          </div>
                        </CardFooter>
                      </Card>
                    ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <h3 className="text-lg font-medium mb-2">No videos found</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    {searchQuery
                      ? "No videos match your search. Try different keywords."
                      : "There are no videos available for your subscription tier yet."}
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="audio" className="space-y-6">
              {filteredContent.filter((item) => item.content_type === "audio")
                .length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredContent
                    .filter((item) => item.content_type === "audio")
                    .map((item) => (
                      <Card
                        key={item.id}
                        className="overflow-hidden flex flex-col h-full"
                      >
                        <div className="aspect-video relative overflow-hidden bg-muted">
                          {item.thumbnail_url ? (
                            <img
                              src={item.thumbnail_url}
                              alt={item.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <FileText className="h-8 w-8 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                        <CardContent className="flex-1 pt-4">
                          <h3 className="text-lg font-semibold mb-2">
                            {item.title}
                          </h3>
                          <p className="text-muted-foreground text-sm line-clamp-2">
                            {item.description}
                          </p>
                        </CardContent>
                        <CardFooter className="pt-0 pb-4">
                          <div className="flex justify-between items-center w-full">
                            <div className="text-xs text-muted-foreground flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              20 min
                            </div>
                            <Button size="sm" asChild>
                              <Link
                                to={`/platform/${platformId}/view/content/${item.id}`}
                              >
                                <Play className="mr-2 h-4 w-4" /> Listen
                              </Link>
                            </Button>
                          </div>
                        </CardFooter>
                      </Card>
                    ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <h3 className="text-lg font-medium mb-2">
                    No audio content found
                  </h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    {searchQuery
                      ? "No audio content matches your search. Try different keywords."
                      : "There is no audio content available for your subscription tier yet."}
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <MemberFooter
        platformName={platformData?.name || "Platform"}
        platformLogo={platformData?.logo_url}
        primaryColor={platformData?.primary_color}
        secondaryColor={platformData?.secondary_color}
      />
    </div>
  );
};

export default MemberDashboard;
