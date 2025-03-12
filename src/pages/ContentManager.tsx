import React, { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { Textarea } from "../components/ui/textarea";
import { Switch } from "../components/ui/switch";
import {
  ArrowLeft,
  Edit,
  Eye,
  FileText,
  Filter,
  Image,
  MoreHorizontal,
  Plus,
  Search,
  Trash2,
  Upload,
  Video,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";

interface ContentItem {
  id: string;
  title: string;
  type: "article" | "video" | "image" | "audio";
  status: "published" | "draft" | "scheduled";
  tier: "free" | "basic" | "premium" | "all";
  createdAt: string;
  updatedAt: string;
  thumbnail?: string;
  views?: number;
  engagement?: string;
}

const ContentManager: React.FC = () => {
  const navigate = useNavigate();
  const { platformId } = useParams<{ platformId: string }>();
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterTier, setFilterTier] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newContent, setNewContent] = useState({
    title: "",
    description: "",
    type: "article",
    tier: "all",
    isPublished: true,
  });

  const { user } = useAuth();
  const { toast } = useToast();
  const [platformData, setPlatformData] = useState<any>(null);
  const [isLoadingPlatform, setIsLoadingPlatform] = useState(true);

  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [isLoadingContent, setIsLoadingContent] = useState(true);

  useEffect(() => {
    if (platformId && user) {
      fetchPlatformData();
      fetchContentItems();
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
      setIsLoadingPlatform(false);
    }
  };

  const fetchContentItems = async () => {
    setIsLoadingContent(true);
    try {
      const { data, error } = await supabase
        .from("content")
        .select("*")
        .eq("platform_id", platformId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setContentItems(data || []);
    } catch (error: any) {
      console.error("Error fetching content:", error);
      toast({
        title: "Error",
        description: "Failed to load content items",
        variant: "destructive",
      });
    } finally {
      setIsLoadingContent(false);
    }
  };

  // Sample content items for initial state
  const sampleContentItems: ContentItem[] = [
    {
      id: "1",
      title: "Getting Started with Fitness",
      type: "article",
      status: "published",
      tier: "free",
      createdAt: "2023-08-15",
      updatedAt: "2023-08-15",
      thumbnail:
        "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&q=80",
      views: 1245,
      engagement: "78%",
    },
    {
      id: "2",
      title: "Advanced Workout Techniques",
      type: "video",
      status: "published",
      tier: "premium",
      createdAt: "2023-08-20",
      updatedAt: "2023-08-21",
      thumbnail:
        "https://images.unsplash.com/photo-1599058917765-a780eda07a3e?w=400&q=80",
      views: 980,
      engagement: "65%",
    },
    {
      id: "3",
      title: "Nutrition Fundamentals",
      type: "article",
      status: "published",
      tier: "basic",
      createdAt: "2023-08-25",
      updatedAt: "2023-08-25",
      thumbnail:
        "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&q=80",
      views: 1560,
      engagement: "82%",
    },
    {
      id: "4",
      title: "Recovery Strategies",
      type: "video",
      status: "draft",
      tier: "premium",
      createdAt: "2023-09-01",
      updatedAt: "2023-09-02",
      thumbnail:
        "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&q=80",
      views: 0,
      engagement: "0%",
    },
    {
      id: "5",
      title: "Building a Workout Routine",
      type: "article",
      status: "scheduled",
      tier: "all",
      createdAt: "2023-09-05",
      updatedAt: "2023-09-05",
      thumbnail:
        "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=400&q=80",
      views: 0,
      engagement: "0%",
    },
  ];

  const handleCreateContent = async () => {
    try {
      const now = new Date().toISOString();
      const contentData = {
        platform_id: platformId,
        creator_id: user?.id,
        title: newContent.title,
        description: newContent.description,
        content_type: newContent.type,
        access_tier: newContent.tier === "all" ? null : newContent.tier,
        status: newContent.isPublished ? "published" : "draft",
        published_at: newContent.isPublished ? now : null,
        created_at: now,
        updated_at: now,
        thumbnail_url: getDefaultThumbnail(
          newContent.type as "article" | "video" | "image" | "audio",
        ),
        content_data: {},
      };

      const { data, error } = await supabase
        .from("content")
        .insert(contentData)
        .select()
        .single();

      if (error) throw error;

      // Convert the Supabase data to our ContentItem format
      const newItem: ContentItem = {
        id: data.id,
        title: data.title,
        type: data.content_type as "article" | "video" | "image" | "audio",
        status: data.status as "published" | "draft" | "scheduled",
        tier:
          data.access_tier || ("all" as "free" | "basic" | "premium" | "all"),
        createdAt: data.created_at.split("T")[0],
        updatedAt: data.updated_at.split("T")[0],
        thumbnail: data.thumbnail_url,
        views: data.status === "published" ? 0 : undefined,
        engagement: data.status === "published" ? "0%" : undefined,
      };

      setContentItems([newItem, ...contentItems]);
      setIsCreateDialogOpen(false);
      setNewContent({
        title: "",
        description: "",
        type: "article",
        tier: "all",
        isPublished: true,
      });

      toast({
        title: "Content created",
        description: "Your content has been created successfully.",
      });
    } catch (error: any) {
      console.error("Error creating content:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to create content",
        variant: "destructive",
      });
    }
  };

  const getDefaultThumbnail = (
    type: "article" | "video" | "image" | "audio",
  ) => {
    switch (type) {
      case "article":
        return "https://images.unsplash.com/photo-1512486130939-2c4f79935e4f?w=400&q=80";
      case "video":
        return "https://images.unsplash.com/photo-1536240478700-b869070f9279?w=400&q=80";
      case "image":
        return "https://images.unsplash.com/photo-1554080353-a576cf803bda?w=400&q=80";
      case "audio":
        return "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&q=80";
      default:
        return "https://images.unsplash.com/photo-1512486130939-2c4f79935e4f?w=400&q=80";
    }
  };

  const handleDeleteContent = async (id: string) => {
    try {
      const { error } = await supabase.from("content").delete().eq("id", id);

      if (error) throw error;

      setContentItems(contentItems.filter((item) => item.id !== id));
      toast({
        title: "Content deleted",
        description: "Your content has been deleted successfully.",
      });
    } catch (error: any) {
      console.error("Error deleting content:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete content",
        variant: "destructive",
      });
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "article":
        return <FileText className="h-4 w-4" />;
      case "video":
        return <Video className="h-4 w-4" />;
      case "image":
        return <Image className="h-4 w-4" />;
      case "audio":
        return <FileText className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-800";
      case "draft":
        return "bg-gray-100 text-gray-800";
      case "scheduled":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredContent = (
    contentItems.length > 0 ? contentItems : sampleContentItems
  ).filter((item) => {
    const matchesSearch = item.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesTier = filterTier === "all" || item.tier === filterTier;
    const matchesType = filterType === "all" || item.type === filterType;
    const matchesStatus =
      filterStatus === "all" || item.status === filterStatus;
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "published" && item.status === "published") ||
      (activeTab === "drafts" && item.status === "draft") ||
      (activeTab === "scheduled" && item.status === "scheduled");

    return (
      matchesSearch && matchesTier && matchesType && matchesStatus && matchesTab
    );
  });

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
                  {isLoadingPlatform
                    ? "Loading..."
                    : platformData?.name || "Content Manager"}
                </h1>
                <p className="text-muted-foreground mt-1">Content Management</p>
              </div>
              <div className="flex items-center mt-4 md:mt-0 space-x-2">
                <Dialog
                  open={isCreateDialogOpen}
                  onOpenChange={setIsCreateDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" /> Create Content
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                      <DialogTitle>Create New Content</DialogTitle>
                      <DialogDescription>
                        Add new content to your platform. Fill in the details
                        below.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input
                          id="title"
                          placeholder="Enter content title"
                          value={newContent.title}
                          onChange={(e) =>
                            setNewContent({
                              ...newContent,
                              title: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          placeholder="Enter content description"
                          rows={3}
                          value={newContent.description}
                          onChange={(e) =>
                            setNewContent({
                              ...newContent,
                              description: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="type">Content Type</Label>
                          <Select
                            value={newContent.type}
                            onValueChange={(value) =>
                              setNewContent({ ...newContent, type: value })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="article">Article</SelectItem>
                              <SelectItem value="video">Video</SelectItem>
                              <SelectItem value="image">Image</SelectItem>
                              <SelectItem value="audio">Audio</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="tier">Access Tier</Label>
                          <Select
                            value={newContent.tier}
                            onValueChange={(value) =>
                              setNewContent({ ...newContent, tier: value })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select tier" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="free">Free</SelectItem>
                              <SelectItem value="basic">Basic</SelectItem>
                              <SelectItem value="premium">Premium</SelectItem>
                              <SelectItem value="all">All Tiers</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 pt-2">
                        <Switch
                          id="isPublished"
                          checked={newContent.isPublished}
                          onCheckedChange={(checked) =>
                            setNewContent({
                              ...newContent,
                              isPublished: checked,
                            })
                          }
                        />
                        <Label htmlFor="isPublished">Publish immediately</Label>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setIsCreateDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleCreateContent}
                        disabled={!newContent.title}
                      >
                        Create
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 space-y-4 md:space-y-0">
            <Tabs
              defaultValue="all"
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full md:w-auto"
            >
              <TabsList className="grid grid-cols-4 w-full md:w-[400px]">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="published">Published</TabsTrigger>
                <TabsTrigger value="drafts">Drafts</TabsTrigger>
                <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex items-center space-x-2">
              <div className="relative w-full md:w-[300px]">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search content..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowFilters(!showFilters)}
                className={showFilters ? "bg-muted" : ""}
              >
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {showFilters && (
            <Card className="mb-6">
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Filter by Type</Label>
                    <Select value={filterType} onValueChange={setFilterType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="article">Articles</SelectItem>
                        <SelectItem value="video">Videos</SelectItem>
                        <SelectItem value="image">Images</SelectItem>
                        <SelectItem value="audio">Audio</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Filter by Tier</Label>
                    <Select value={filterTier} onValueChange={setFilterTier}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select tier" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Tiers</SelectItem>
                        <SelectItem value="free">Free</SelectItem>
                        <SelectItem value="basic">Basic</SelectItem>
                        <SelectItem value="premium">Premium</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Filter by Status</Label>
                    <Select
                      value={filterStatus}
                      onValueChange={setFilterStatus}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="scheduled">Scheduled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <TabsContent value={activeTab} className="mt-0">
            {isLoadingContent ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
                  <svg
                    className="animate-spin h-6 w-6 text-primary"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                </div>
                <h3 className="text-lg font-medium mb-2">Loading content</h3>
                <p className="text-muted-foreground max-w-md">
                  Please wait while we load your content...
                </p>
              </div>
            ) : filteredContent.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredContent.map((item) => (
                  <Card key={item.id} className="overflow-hidden">
                    <div className="aspect-video relative overflow-hidden bg-muted">
                      {item.thumbnail ? (
                        <img
                          src={item.thumbnail}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          {getTypeIcon(item.type)}
                        </div>
                      )}
                      <div className="absolute top-2 right-2 flex space-x-1">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(item.status)}`}
                        >
                          {item.status.charAt(0).toUpperCase() +
                            item.status.slice(1)}
                        </span>
                      </div>
                    </div>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{item.title}</CardTitle>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() =>
                                navigate(
                                  `/platform/${platformId}/content/${item.id}`,
                                )
                              }
                            >
                              <Edit className="h-4 w-4 mr-2" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Eye className="h-4 w-4 mr-2" /> Preview
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDeleteContent(item.id)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <CardDescription className="flex items-center">
                        {getTypeIcon(item.type)}
                        <span className="ml-1 capitalize">{item.type}</span>
                        <span className="mx-2">•</span>
                        <span className="capitalize">
                          {item.tier === "all" ? "All tiers" : item.tier}
                        </span>
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pb-3">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        {item.views !== undefined && (
                          <div>
                            <p className="text-muted-foreground">Views</p>
                            <p className="font-medium">{item.views}</p>
                          </div>
                        )}
                        {item.engagement !== undefined && (
                          <div>
                            <p className="text-muted-foreground">Engagement</p>
                            <p className="font-medium">{item.engagement}</p>
                          </div>
                        )}
                        <div>
                          <p className="text-muted-foreground">Created</p>
                          <p className="font-medium">{item.createdAt}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Updated</p>
                          <p className="font-medium">{item.updatedAt}</p>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="pt-0">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() =>
                          navigate(`/platform/${platformId}/content/${item.id}`)
                        }
                      >
                        <Edit className="h-4 w-4 mr-2" /> Edit Content
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
                  <FileText className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-2">No content found</h3>
                <p className="text-muted-foreground max-w-md mb-6">
                  {searchQuery ||
                  filterTier !== "all" ||
                  filterType !== "all" ||
                  filterStatus !== "all"
                    ? "No content matches your current filters. Try adjusting your search or filters."
                    : "You haven't created any content yet. Click the button below to create your first content."}
                </p>
                <Button onClick={() => setIsCreateDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" /> Create Content
                </Button>
              </div>
            )}
          </TabsContent>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ContentManager;
