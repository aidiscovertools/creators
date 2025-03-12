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
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { Textarea } from "../components/ui/textarea";
import { Switch } from "../components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { ArrowLeft, Check, Palette, Save, Trash2, Upload } from "lucide-react";

const PlatformSettings: React.FC = () => {
  const navigate = useNavigate();
  const { platformId } = useParams<{ platformId: string }>();
  const [activeTab, setActiveTab] = useState("general");

  // Mock platform data
  const [platformData, setPlatformData] = useState({
    id: platformId || "1",
    name: "Fitness Revolution",
    description: "A fitness community for health enthusiasts",
    category: "fitness",
    visibility: "public",
    allowComments: true,
    allowSharing: true,
    primaryColor: "#3b82f6",
    secondaryColor: "#10b981",
    logoUrl: "https://api.dicebear.com/7.x/shapes/svg?seed=fitness",
    coverImageUrl:
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80",
    customCss: "",
    customJs: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setPlatformData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setPlatformData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setPlatformData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSave = () => {
    // Here you would save the platform settings to your backend
    console.log("Saving platform settings:", platformData);
    navigate(`/platform/${platformId}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header isLoggedIn={true} userType="creator" userName="John Creator" />

      <main className="flex-grow pt-24 pb-16 px-4 md:px-8 lg:px-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Button
              variant="ghost"
              onClick={() => navigate(`/platform/${platformId}`)}
              className="mb-4"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Platform
            </Button>
            <h1 className="text-3xl font-bold tracking-tight">
              {platformData.name}
            </h1>
            <p className="text-muted-foreground mt-1">
              Configure your platform settings
            </p>
          </div>

          <Tabs
            defaultValue="general"
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-8"
          >
            <TabsList className="grid grid-cols-3 md:w-[400px]">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="appearance">Appearance</TabsTrigger>
              <TabsTrigger value="advanced">Advanced</TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Platform Details</CardTitle>
                  <CardDescription>
                    Basic information about your platform
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Platform Name</Label>
                      <Input
                        id="name"
                        name="name"
                        value={platformData.name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        name="description"
                        value={platformData.description}
                        onChange={handleInputChange}
                        rows={4}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select
                        value={platformData.category}
                        onValueChange={(value) =>
                          handleSelectChange("category", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="fitness">
                            Fitness & Health
                          </SelectItem>
                          <SelectItem value="education">
                            Education & Courses
                          </SelectItem>
                          <SelectItem value="art">Art & Creativity</SelectItem>
                          <SelectItem value="technology">Technology</SelectItem>
                          <SelectItem value="business">
                            Business & Finance
                          </SelectItem>
                          <SelectItem value="lifestyle">Lifestyle</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Platform Settings</CardTitle>
                  <CardDescription>
                    Configure how your platform works
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="visibility">Visibility</Label>
                      <Select
                        value={platformData.visibility}
                        onValueChange={(value) =>
                          handleSelectChange("visibility", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select visibility" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="public">
                            Public - Anyone can find your platform
                          </SelectItem>
                          <SelectItem value="unlisted">
                            Unlisted - Only accessible with direct link
                          </SelectItem>
                          <SelectItem value="private">
                            Private - Only members can access
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center justify-between py-2">
                      <div>
                        <Label htmlFor="allowComments" className="block mb-1">
                          Allow Comments
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Let members comment on your content
                        </p>
                      </div>
                      <Switch
                        id="allowComments"
                        checked={platformData.allowComments}
                        onCheckedChange={(checked) =>
                          handleSwitchChange("allowComments", checked)
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between py-2">
                      <div>
                        <Label htmlFor="allowSharing" className="block mb-1">
                          Allow Sharing
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Let members share your content on social media
                        </p>
                      </div>
                      <Switch
                        id="allowSharing"
                        checked={platformData.allowSharing}
                        onCheckedChange={(checked) =>
                          handleSwitchChange("allowSharing", checked)
                        }
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="appearance" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Branding</CardTitle>
                  <CardDescription>
                    Customize your platform's look and feel
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="primaryColor" className="block">
                          Primary Color
                        </Label>
                        <div className="flex items-center space-x-2">
                          <Input
                            id="primaryColor"
                            name="primaryColor"
                            type="color"
                            value={platformData.primaryColor}
                            onChange={handleInputChange}
                            className="w-12 h-10 p-1"
                          />
                          <Input
                            value={platformData.primaryColor}
                            onChange={handleInputChange}
                            name="primaryColor"
                            className="w-28"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="secondaryColor" className="block">
                          Secondary Color
                        </Label>
                        <div className="flex items-center space-x-2">
                          <Input
                            id="secondaryColor"
                            name="secondaryColor"
                            type="color"
                            value={platformData.secondaryColor}
                            onChange={handleInputChange}
                            className="w-12 h-10 p-1"
                          />
                          <Input
                            value={platformData.secondaryColor}
                            onChange={handleInputChange}
                            name="secondaryColor"
                            className="w-28"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <div className="space-y-2">
                        <Label htmlFor="logoUrl">Logo URL</Label>
                        <div className="flex items-center space-x-2">
                          <Input
                            id="logoUrl"
                            name="logoUrl"
                            value={platformData.logoUrl}
                            onChange={handleInputChange}
                            placeholder="https://example.com/logo.png"
                          />
                          <Button variant="outline" size="icon">
                            <Upload className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="mt-2 flex items-center space-x-2">
                          <div className="w-12 h-12 rounded-md bg-muted flex items-center justify-center overflow-hidden">
                            {platformData.logoUrl && (
                              <img
                                src={platformData.logoUrl}
                                alt="Logo preview"
                                className="w-full h-full object-contain"
                              />
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Logo preview
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <div className="space-y-2">
                        <Label htmlFor="coverImageUrl">Cover Image URL</Label>
                        <div className="flex items-center space-x-2">
                          <Input
                            id="coverImageUrl"
                            name="coverImageUrl"
                            value={platformData.coverImageUrl}
                            onChange={handleInputChange}
                            placeholder="https://example.com/cover.jpg"
                          />
                          <Button variant="outline" size="icon">
                            <Upload className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="mt-2">
                          <div className="w-full h-32 rounded-md bg-muted overflow-hidden">
                            {platformData.coverImageUrl && (
                              <img
                                src={platformData.coverImageUrl}
                                alt="Cover image preview"
                                className="w-full h-full object-cover"
                              />
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            Cover image preview
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="advanced" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Custom Code</CardTitle>
                  <CardDescription>
                    Add custom CSS and JavaScript to your platform
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="customCss">Custom CSS</Label>
                      <Textarea
                        id="customCss"
                        name="customCss"
                        value={platformData.customCss}
                        onChange={handleInputChange}
                        placeholder="/* Add your custom CSS here */"
                        rows={6}
                        className="font-mono text-sm"
                      />
                      <p className="text-sm text-muted-foreground">
                        Custom CSS will be applied to your entire platform
                      </p>
                    </div>

                    <div className="space-y-2 pt-4 border-t">
                      <Label htmlFor="customJs">Custom JavaScript</Label>
                      <Textarea
                        id="customJs"
                        name="customJs"
                        value={platformData.customJs}
                        onChange={handleInputChange}
                        placeholder="// Add your custom JavaScript here"
                        rows={6}
                        className="font-mono text-sm"
                      />
                      <p className="text-sm text-muted-foreground">
                        Custom JavaScript will be executed on your platform
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-destructive/50">
                <CardHeader>
                  <CardTitle className="text-destructive">
                    Danger Zone
                  </CardTitle>
                  <CardDescription>
                    Irreversible actions for your platform
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 border border-destructive/50 rounded-md">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                          <h3 className="font-medium text-destructive">
                            Delete Platform
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Permanently delete this platform and all its content
                          </p>
                        </div>
                        <Button variant="destructive" size="sm">
                          <Trash2 className="h-4 w-4 mr-2" /> Delete Platform
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="mt-8 flex justify-end">
            <Button
              variant="outline"
              onClick={() => navigate(`/platform/${platformId}`)}
              className="mr-2"
            >
              Cancel
            </Button>
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" /> Save Changes
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PlatformSettings;
