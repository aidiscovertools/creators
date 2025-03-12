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
import { Textarea } from "../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Switch } from "../components/ui/switch";
import {
  ArrowLeft,
  Calendar,
  Check,
  Clock,
  Eye,
  FileText,
  Image as ImageIcon,
  Loader2,
  Save,
  Upload,
  Video,
} from "lucide-react";

const ContentEditor: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { platformId, contentId } = useParams<{
    platformId: string;
    contentId: string;
  }>();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [platformData, setPlatformData] = useState<any>(null);
  const [subscriptionTiers, setSubscriptionTiers] = useState<any[]>([]);
  const [contentData, setContentData] = useState({
    title: "",
    description: "",
    content_type: "article",
    access_tier: "all",
    status: "draft",
    thumbnail_url: "",
    content_data: {},
    is_published: false,
  });

  const isNewContent = contentId === "new";

  useEffect(() => {
    if (platformId && user) {
      fetchPlatformData();
      fetchSubscriptionTiers();
      if (!isNewContent && contentId) {
        fetchContentData();
      } else {
        setIsLoading(false);
      }
    }
  }, [platformId, contentId, user]);

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

  const fetchContentData = async () => {
    try {
      const { data, error } = await supabase
        .from("content")
        .select("*")
        .eq("id", contentId)
        .single();

      if (error) throw error;

      setContentData({
        ...data,
        is_published: data.status === "published",
      });
    } catch (error: any) {
      console.error("Error fetching content:", error);
      toast({
        title: "Error",
        description: "Failed to load content data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setContentData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setContentData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    if (name === "is_published") {
      setContentData((prev) => ({
        ...prev,
        is_published: checked,
        status: checked ? "published" : "draft",
      }));
    } else {
      setContentData((prev) => ({ ...prev, [name]: checked }));
    }
  };

  const handleSave = async () => {
    if (!user || !platformId) return;

    setIsSaving(true);
    try {
      const now = new Date().toISOString();
      const saveData = {
        platform_id: platformId,
        creator_id: user.id,
        title: contentData.title,
        description: contentData.description,
        content_type: contentData.content_type,
        access_tier:
          contentData.access_tier === "all" ? null : contentData.access_tier,
        status: contentData.is_published ? "published" : "draft",
        published_at: contentData.is_published
          ? contentData.published_at || now
          : null,
        thumbnail_url: contentData.thumbnail_url,
        content_data: contentData.content_data || {},
        updated_at: now,
      };

      let result;
      if (isNewContent) {
        saveData.created_at = now;
        const { data, error } = await supabase
          .from("content")
          .insert(saveData)
          .select()
          .single();

        if (error) throw error;
        result = data;

        toast({
          title: "Content created",
          description: "Your content has been created successfully.",
        });
      } else {
        const { data, error } = await supabase
          .from("content")
          .update(saveData)
          .eq("id", contentId)
          .select()
          .single();

        if (error) throw error;
        result = data;

        toast({
          title: "Content updated",
          description: "Your content has been updated successfully.",
        });
      }

      navigate(`/platform/${platformId}/content`);
    } catch (error: any) {
      console.error("Error saving content:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to save content",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const getContentTypeIcon = () => {
    switch (contentData.content_type) {
      case "article":
        return <FileText className="h-5 w-5" />;
      case "video":
        return <Video className="h-5 w-5" />;
      case "image":
        return <ImageIcon className="h-5 w-5" />;
      case "audio":
        return <FileText className="h-5 w-5" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
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
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Button
              variant="ghost"
              onClick={() => navigate(`/platform/${platformId}/content`)}
              className="mb-4"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Content Manager
            </Button>
            <h1 className="text-3xl font-bold tracking-tight flex items-center">
              {getContentTypeIcon()}
              <span className="ml-2">
                {isNewContent ? "Create New Content" : "Edit Content"}
              </span>
            </h1>
            <p className="text-muted-foreground mt-1">
              {isNewContent
                ? "Add new content to your platform"
                : "Update your existing content"}
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Content Details</CardTitle>
              <CardDescription>
                Enter the details for your content
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={contentData.title}
                  onChange={handleInputChange}
                  placeholder="Enter a title for your content"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={contentData.description}
                  onChange={handleInputChange}
                  placeholder="Describe your content"
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="content_type">Content Type</Label>
                  <Select
                    value={contentData.content_type}
                    onValueChange={(value) =>
                      handleSelectChange("content_type", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select content type" />
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
                  <Label htmlFor="access_tier">Access Tier</Label>
                  <Select
                    value={contentData.access_tier}
                    onValueChange={(value) =>
                      handleSelectChange("access_tier", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select access tier" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Tiers</SelectItem>
                      {subscriptionTiers.map((tier) => (
                        <SelectItem key={tier.id} value={tier.id}>
                          {tier.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="thumbnail_url">Thumbnail URL</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="thumbnail_url"
                    name="thumbnail_url"
                    value={contentData.thumbnail_url}
                    onChange={handleInputChange}
                    placeholder="https://example.com/thumbnail.jpg"
                    className="flex-grow"
                  />
                  <Button variant="outline" size="icon">
                    <Upload className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Enter a URL for your content thumbnail image
                </p>
              </div>

              {contentData.content_type === "article" && (
                <div className="space-y-2 border-t pt-6">
                  <Label htmlFor="article_content">Article Content</Label>
                  <Textarea
                    id="article_content"
                    name="article_content"
                    value={(contentData.content_data as any)?.text || ""}
                    onChange={(e) =>
                      setContentData((prev) => ({
                        ...prev,
                        content_data: {
                          ...prev.content_data,
                          text: e.target.value,
                        },
                      }))
                    }
                    placeholder="Write your article content here..."
                    rows={12}
                  />
                </div>
              )}

              {contentData.content_type === "video" && (
                <div className="space-y-2 border-t pt-6">
                  <Label htmlFor="video_url">Video URL</Label>
                  <Input
                    id="video_url"
                    name="video_url"
                    value={(contentData.content_data as any)?.url || ""}
                    onChange={(e) =>
                      setContentData((prev) => ({
                        ...prev,
                        content_data: {
                          ...prev.content_data,
                          url: e.target.value,
                        },
                      }))
                    }
                    placeholder="https://example.com/video.mp4 or YouTube/Vimeo URL"
                  />
                  <p className="text-sm text-muted-foreground">
                    Enter a direct video URL or embed link from YouTube or Vimeo
                  </p>
                </div>
              )}

              {contentData.content_type === "image" && (
                <div className="space-y-2 border-t pt-6">
                  <Label htmlFor="image_url">Image URL</Label>
                  <Input
                    id="image_url"
                    name="image_url"
                    value={(contentData.content_data as any)?.url || ""}
                    onChange={(e) =>
                      setContentData((prev) => ({
                        ...prev,
                        content_data: {
                          ...prev.content_data,
                          url: e.target.value,
                        },
                      }))
                    }
                    placeholder="https://example.com/image.jpg"
                  />
                  <p className="text-sm text-muted-foreground">
                    Enter a URL for your image
                  </p>
                </div>
              )}

              {contentData.content_type === "audio" && (
                <div className="space-y-2 border-t pt-6">
                  <Label htmlFor="audio_url">Audio URL</Label>
                  <Input
                    id="audio_url"
                    name="audio_url"
                    value={(contentData.content_data as any)?.url || ""}
                    onChange={(e) =>
                      setContentData((prev) => ({
                        ...prev,
                        content_data: {
                          ...prev.content_data,
                          url: e.target.value,
                        },
                      }))
                    }
                    placeholder="https://example.com/audio.mp3"
                  />
                  <p className="text-sm text-muted-foreground">
                    Enter a URL for your audio file
                  </p>
                </div>
              )}

              <div className="border-t pt-6">
                <h3 className="font-medium mb-4">Publishing Options</h3>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_published"
                    checked={contentData.is_published}
                    onCheckedChange={(checked) =>
                      handleSwitchChange("is_published", checked)
                    }
                  />
                  <Label htmlFor="is_published">
                    {contentData.is_published ? "Published" : "Draft"}
                  </Label>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {contentData.is_published
                    ? "This content is visible to your audience"
                    : "This content is saved as a draft and not visible to your audience"}
                </p>

                {contentData.is_published && contentData.published_at && (
                  <div className="mt-4 flex items-center text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>Published on: </span>
                    <span className="ml-1 font-medium">
                      {new Date(contentData.published_at).toLocaleDateString()}
                    </span>
                    <Clock className="h-4 w-4 ml-3 mr-1" />
                    <span>
                      {new Date(contentData.published_at).toLocaleTimeString()}
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-6">
              <Button
                variant="outline"
                onClick={() => navigate(`/platform/${platformId}/content`)}
              >
                Cancel
              </Button>
              <div className="flex space-x-2">
                {!isNewContent && (
                  <Button variant="outline">
                    <Eye className="mr-2 h-4 w-4" /> Preview
                  </Button>
                )}
                <Button
                  onClick={handleSave}
                  disabled={isSaving || !contentData.title}
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      {isNewContent ? "Create Content" : "Save Changes"}
                    </>
                  )}
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ContentEditor;
