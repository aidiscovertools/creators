import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import MemberHeader from "@/components/platform/MemberHeader";
import MemberFooter from "@/components/platform/MemberFooter";
import MemberAuthModal from "@/components/platform/MemberAuthModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, BookOpen, Video, FileText, Lock } from "lucide-react";

const MemberContentPage: React.FC = () => {
  const { platformId } = useParams<{ platformId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [platformData, setPlatformData] = useState<any>(null);
  const [memberData, setMemberData] = useState<any>(null);
  const [contentItems, setContentItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [authModalOpen, setAuthModalOpen] = useState(false);

  useEffect(() => {
    console.log("MemberContentPage: platformId changed to:", platformId);
    if (platformId) {
      setIsLoading(true);
      fetchPlatformData();
      if (user) {
        fetchMemberData();
      } else {
        fetchPublicContent();
      }
    } else {
      setIsLoading(false);
    }
  }, [platformId, user]);

  const fetchPlatformData = async () => {
    try {
      const { data, error } = await supabase
        .from("platforms")
        .select("*")
        .eq("id", platformId)
        .single();

      if (error) {
        // If not found, create a default platform for testing
        if (error.code === "PGRST116") {
          console.log("Platform not found in database, using default data");
          const defaultPlatform = {
            id: platformId,
            name: "Sample Platform",
            description: "This is a sample platform for testing",
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

      setPlatformData(data);
    } catch (error) {
      console.error("Error fetching platform data:", error);
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
          fetchPublicContent();
        } else {
          throw memberError;
        }
      } else {
        setMemberData(memberData);
        fetchMemberContent(memberData.tier_id);
      }
    } catch (error) {
      console.error("Error fetching member data:", error);
      fetchPublicContent();
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPublicContent = async () => {
    try {
      // Fetch only public content (no tier required)
      const { data, error } = await supabase
        .from("content")
        .select("*")
        .eq("platform_id", platformId)
        .eq("status", "published")
        .is("access_tier", null)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setContentItems(data || []);
    } catch (error) {
      console.error("Error fetching public content:", error);
      setContentItems([]);
    }
  };

  const fetchMemberContent = async (tierId: string) => {
    try {
      // Fetch content that is either public or available to the member's tier
      const { data, error } = await supabase
        .from("content")
        .select("*")
        .eq("platform_id", platformId)
        .eq("status", "published")
        .or(`access_tier.is.null,access_tier.eq.${tierId}`)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setContentItems(data || []);
    } catch (error) {
      console.error("Error fetching member content:", error);
      setContentItems([]);
    }
  };

  const getContentIcon = (type: string) => {
    switch (type) {
      case "article":
        return <FileText className="h-5 w-5" />;
      case "video":
        return <Video className="h-5 w-5" />;
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

  // Filter content based on search and active tab
  const filteredContent = contentItems.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.description &&
        item.description.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesTab = activeTab === "all" || item.content_type === activeTab;

    return matchesSearch && matchesTab;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!platformData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Platform Not Found</h1>
          <p className="text-muted-foreground">
            The platform you're looking for doesn't exist or has been removed.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <MemberHeader
        platformName={platformData.name}
        platformLogo={platformData.logo_url}
        primaryColor={platformData.primary_color}
        secondaryColor={platformData.secondary_color}
      />

      <main className="flex-grow pt-24 pb-16 px-4 md:px-8 lg:px-12">
        <div className="max-w-7xl mx-auto">
          {/* Content Header */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight mb-2">
                  Content Library
                </h1>
                <p className="text-muted-foreground">
                  {memberData ? (
                    <span>
                      Browsing as a{" "}
                      {memberData.subscription_tiers?.name || "Free"} member
                    </span>
                  ) : (
                    "Browse available content or sign up for full access"
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

          {/* Content Tabs */}
          <Tabs
            defaultValue="all"
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-8"
          >
            <TabsList className="w-full md:w-auto">
              <TabsTrigger value="all">All Content</TabsTrigger>
              <TabsTrigger value="article">Articles</TabsTrigger>
              <TabsTrigger value="video">Videos</TabsTrigger>
              <TabsTrigger value="audio">Audio</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="space-y-6">
              {filteredContent.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredContent.map((item) => {
                    const isLocked = item.access_tier && !memberData?.tier_id;

                    return (
                      <div
                        key={item.id}
                        className="border rounded-lg overflow-hidden flex flex-col h-full"
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
                          {isLocked && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                              <div className="bg-background/20 backdrop-blur-sm rounded-full p-3">
                                <Lock className="h-8 w-8 text-white" />
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="p-4 flex-1">
                          <h3 className="text-lg font-semibold mb-2">
                            {item.title}
                          </h3>
                          <p className="text-muted-foreground text-sm line-clamp-2 mb-2">
                            {item.description}
                          </p>
                          <div className="text-xs text-muted-foreground">
                            {formatDate(item.created_at)}
                          </div>
                        </div>
                        <div className="p-4 pt-0 mt-auto">
                          {isLocked ? (
                            <Button
                              className="w-full"
                              onClick={() => setAuthModalOpen(true)}
                              style={{
                                backgroundColor:
                                  platformData.secondary_color ||
                                  "var(--primary)",
                                color: "white",
                              }}
                            >
                              Subscribe to Unlock
                            </Button>
                          ) : (
                            <Button
                              className="w-full"
                              onClick={() => navigate(`/content/${item.id}`)}
                              variant={user ? "default" : "outline"}
                              style={
                                user
                                  ? {
                                      backgroundColor:
                                        platformData.secondary_color ||
                                        "var(--primary)",
                                      color: "white",
                                    }
                                  : {}
                              }
                            >
                              {user ? (
                                <>
                                  {item.content_type === "video" ? (
                                    <>Watch Now</>
                                  ) : item.content_type === "audio" ? (
                                    <>Listen Now</>
                                  ) : (
                                    <>Read Now</>
                                  )}
                                </>
                              ) : (
                                <>Sign In to Access</>
                              )}
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <h3 className="text-lg font-medium mb-2">No content found</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    {searchQuery
                      ? "No content matches your search. Try different keywords."
                      : user
                        ? "There is no content available for your subscription tier yet."
                        : "Sign up to access exclusive content."}
                  </p>
                  {!user && (
                    <Button
                      className="mt-4"
                      onClick={() => setAuthModalOpen(true)}
                      style={{
                        backgroundColor:
                          platformData.secondary_color || "var(--primary)",
                        color: "white",
                      }}
                    >
                      Join Now
                    </Button>
                  )}
                </div>
              )}
            </TabsContent>
          </Tabs>

          {/* Upgrade CTA for non-premium members */}
          {user &&
            memberData &&
            memberData.subscription_tiers?.name !== "Premium" && (
              <div className="mt-12 bg-muted/30 border rounded-lg p-6 md:p-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                  <div>
                    <h3 className="text-xl font-bold mb-2">
                      Upgrade to Premium
                    </h3>
                    <p className="text-muted-foreground">
                      Get access to all content, exclusive live sessions, and
                      direct messaging with the creator.
                    </p>
                  </div>
                  <Button
                    className="md:w-auto w-full"
                    style={{
                      backgroundColor:
                        platformData.secondary_color || "var(--primary)",
                      color: "white",
                    }}
                    onClick={() =>
                      navigate(`/platform/${platformId}/view/pricing`)
                    }
                  >
                    Upgrade Now
                  </Button>
                </div>
              </div>
            )}
        </div>
      </main>

      <MemberFooter
        platformName={platformData.name}
        platformLogo={platformData.logo_url}
        primaryColor={platformData.primary_color}
        secondaryColor={platformData.secondary_color}
      />

      <MemberAuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        defaultTab="signup"
        platformName={platformData.name}
        primaryColor={platformData.primary_color}
        secondaryColor={platformData.secondary_color}
        redirectAfterAuth={`/platform/${platformId}/view`}
      />
    </div>
  );
};

export default MemberContentPage;
