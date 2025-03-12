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
import { Textarea } from "../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Switch } from "../components/ui/switch";
import { ArrowLeft, Check, Loader2, Palette, Save, Upload } from "lucide-react";

export default function PlatformSettings() {
  const navigate = useNavigate();
  const { platformId } = useParams<{ platformId: string }>();
  const [isLoading, setIsLoading] = useState(false);

  // Mock platform data
  const [platformData, setPlatformData] = useState({
    name: "Fitness Revolution",
    description: "A fitness community for health enthusiasts",
    category: "fitness",
    logoUrl: "",
    primaryColor: "#3b82f6",
    secondaryColor: "#10b981",
    isPublic: true,
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
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      navigate(`/platform/${platformId}`);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header isLoggedIn={true} userType="creator" userName="John Creator" />

      <main className="flex-grow pt-24 pb-16 px-4 md:px-8 lg:px-12">
        <div className="max-w-3xl mx-auto">
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

          <Card>
            <CardHeader>
              <CardTitle>Platform Details</CardTitle>
              <CardDescription>
                Update your platform information and appearance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
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
                  required
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
                    <SelectItem value="fitness">Fitness & Health</SelectItem>
                    <SelectItem value="education">
                      Education & Courses
                    </SelectItem>
                    <SelectItem value="art">Art & Creativity</SelectItem>
                    <SelectItem value="technology">Technology</SelectItem>
                    <SelectItem value="business">Business & Finance</SelectItem>
                    <SelectItem value="lifestyle">Lifestyle</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="border-t pt-6">
                <h3 className="font-medium mb-4 flex items-center">
                  <Palette className="mr-2 h-5 w-5" /> Appearance
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="primaryColor">Primary Color</Label>
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
                    <Label htmlFor="secondaryColor">Secondary Color</Label>
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

                <div className="space-y-2 mt-6">
                  <Label htmlFor="logoUrl">Logo URL</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="logoUrl"
                      name="logoUrl"
                      placeholder="https://example.com/logo.png"
                      value={platformData.logoUrl}
                      onChange={handleInputChange}
                      className="flex-grow"
                    />
                    <Button variant="outline" size="icon">
                      <Upload className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Enter a URL to your logo image. Recommended size: 200x200px.
                  </p>
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="font-medium mb-4">Platform Status</h3>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="isPublic"
                    checked={platformData.isPublic}
                    onCheckedChange={(checked) =>
                      handleSwitchChange("isPublic", checked)
                    }
                  />
                  <Label htmlFor="isPublic">Make platform public</Label>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  When enabled, your platform will be publicly accessible.
                  Otherwise, it will be in draft mode.
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-6">
              <Button
                variant="outline"
                onClick={() => navigate(`/platform/${platformId}`)}
              >
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" /> Save Changes
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
