import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { platformApi } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ArrowRight, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface PlatformFormProps {
  onSuccess?: (platformId: string) => void;
  initialData?: any;
  isEditing?: boolean;
}

const PlatformForm: React.FC<PlatformFormProps> = ({
  onSuccess,
  initialData,
  isEditing = false,
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    description: initialData?.description || "",
    category: initialData?.category || "education",
    subdomain: initialData?.subdomain || "",
    custom_domain: initialData?.custom_domain || "",
    primary_color: initialData?.primary_color || "#3b82f6",
    secondary_color: initialData?.secondary_color || "#10b981",
    logo_url: initialData?.logo_url || "",
    isPublic: initialData?.status === "active" || false,
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const nextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 3));
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsLoading(true);

    try {
      // Format subdomain - lowercase, no spaces, only alphanumeric and hyphens
      const formattedSubdomain = formData.subdomain
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");

      // Format custom domain - remove whitespace and protocol
      const formattedCustomDomain = formData.custom_domain
        ? formData.custom_domain
            .trim()
            .replace(/^https?:\/\//i, "")
            .replace(/^www\./i, "")
        : "";

      // Ensure we have a valid user ID before creating the platform
      if (!user || !user.id) {
        throw new Error("User not authenticated or missing ID");
      }

      // First check if the profile exists
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("id")
        .eq("id", user.id)
        .single();

      // If profile doesn't exist, create it
      if (profileError || !profileData) {
        // Create profile record
        const { error: createProfileError } = await supabase
          .from("profiles")
          .insert({
            id: user.id,
            email: user.email || "",
            name:
              user.user_metadata?.name || user.email?.split("@")[0] || "User",
          });

        if (createProfileError) throw createProfileError;
      }

      const platformData = {
        name: formData.name,
        description: formData.description,
        creator_id: user.id,
        subdomain: formattedSubdomain,
        custom_domain: formattedCustomDomain || null,
        logo_url: formData.logo_url || null,
        primary_color: formData.primary_color || "#3b82f6",
        secondary_color: formData.secondary_color || "#10b981",
        status: formData.isPublic ? "active" : "draft",
        created_at: new Date().toISOString(),
      };

      let result;
      if (isEditing && initialData?.id) {
        const { data, error } = await supabase
          .from("platforms")
          .update(platformData)
          .eq("id", initialData.id)
          .select()
          .single();

        if (error) throw error;
        result = data;

        toast({
          title: "Platform updated",
          description: "Your platform has been updated successfully.",
        });
      } else {
        const { data, error } = await supabase
          .from("platforms")
          .insert(platformData)
          .select()
          .single();

        if (error) throw error;
        result = data;

        // Create default subscription tiers
        await createDefaultTiers(result.id);

        toast({
          title: "Platform created",
          description: "Your platform has been created successfully.",
        });
      }

      if (onSuccess) {
        onSuccess(result.id);
      } else {
        navigate(`/platform/${result.id}`);
      }
    } catch (error: any) {
      console.error("Error creating/updating platform:", error);
      toast({
        title: "Error",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createDefaultTiers = async (platformId: string) => {
    const tiers = [
      {
        platform_id: platformId,
        name: "Free",
        price: 0,
        description: "Basic access to content",
        benefits: JSON.stringify([
          "Access to free content",
          "Community forum access",
        ]),
        is_popular: false,
        is_public: true,
      },
      {
        platform_id: platformId,
        name: "Basic",
        price: 9.99,
        description: "Standard membership with additional benefits",
        benefits: JSON.stringify([
          "Access to all free content",
          "Basic exclusive content",
          "Community forum access",
          "Monthly newsletter",
        ]),
        is_popular: false,
        is_public: true,
      },
      {
        platform_id: platformId,
        name: "Premium",
        price: 19.99,
        description: "Full access to all content and premium features",
        benefits: JSON.stringify([
          "Access to all content",
          "Premium exclusive content",
          "Direct messaging with creator",
          "Monthly live sessions",
          "Priority support",
        ]),
        is_popular: true,
        is_public: true,
      },
    ];

    const { error } = await supabase.from("subscription_tiers").insert(tiers);
    if (error) throw error;
  };

  const validateStep = (step: number) => {
    switch (step) {
      case 1:
        return (
          formData.name.trim() !== "" && formData.description.trim() !== ""
        );
      case 2:
        return formData.subdomain.trim() !== "";
      default:
        return true;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Step 1: Basic Information */}
      {currentStep === 1 && (
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Platform Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="e.g., Fitness Revolution"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Describe your platform and what members can expect"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => handleSelectChange("category", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fitness">Fitness & Health</SelectItem>
                <SelectItem value="education">Education & Courses</SelectItem>
                <SelectItem value="art">Art & Creativity</SelectItem>
                <SelectItem value="technology">Technology</SelectItem>
                <SelectItem value="business">Business & Finance</SelectItem>
                <SelectItem value="lifestyle">Lifestyle</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {/* Step 2: Domain Configuration */}
      {currentStep === 2 && (
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="subdomain">Subdomain</Label>
            <div className="flex items-center">
              <Input
                id="subdomain"
                name="subdomain"
                placeholder="your-platform"
                value={formData.subdomain}
                onChange={handleInputChange}
                className="rounded-r-none"
                required
              />
              <div className="bg-muted px-3 py-2 border border-l-0 border-input rounded-r-md text-muted-foreground">
                .sharp-jennings4-ykw3j.dev-2.tempolabs.ai
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              This subdomain is included with all plans
            </p>
          </div>

          <div className="border-t pt-6 space-y-2">
            <Label htmlFor="custom_domain">Custom Domain (Optional)</Label>
            <Input
              id="custom_domain"
              name="custom_domain"
              placeholder="www.yourdomain.com"
              value={formData.custom_domain}
              onChange={handleInputChange}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Leave empty if you don't have a custom domain yet
            </p>
            <p className="text-sm text-muted-foreground">
              Connect your own domain for a professional branded experience.
              You'll need to update your DNS settings after platform creation.
            </p>
          </div>
        </div>
      )}

      {/* Step 3: Branding & Appearance */}
      {currentStep === 3 && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="primary_color">Primary Color</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="primary_color"
                  name="primary_color"
                  type="color"
                  value={formData.primary_color}
                  onChange={handleInputChange}
                  className="w-12 h-10 p-1"
                />
                <Input
                  value={formData.primary_color}
                  onChange={handleInputChange}
                  name="primary_color"
                  className="w-28"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="secondary_color">Secondary Color</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="secondary_color"
                  name="secondary_color"
                  type="color"
                  value={formData.secondary_color}
                  onChange={handleInputChange}
                  className="w-12 h-10 p-1"
                />
                <Input
                  value={formData.secondary_color}
                  onChange={handleInputChange}
                  name="secondary_color"
                  className="w-28"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="logo_url">Logo URL (Optional)</Label>
            <Input
              id="logo_url"
              name="logo_url"
              placeholder="https://example.com/logo.png"
              value={formData.logo_url}
              onChange={handleInputChange}
            />
            <p className="text-sm text-muted-foreground">
              Enter a URL to your logo image. Recommended size: 200x200px.
            </p>
          </div>

          <div className="flex items-center space-x-2 pt-4">
            <Switch
              id="isPublic"
              checked={formData.isPublic}
              onCheckedChange={(checked) =>
                handleSwitchChange("isPublic", checked)
              }
            />
            <Label htmlFor="isPublic">Make platform public</Label>
          </div>
          <p className="text-sm text-muted-foreground">
            When enabled, your platform will be publicly accessible. Otherwise,
            it will be saved as a draft.
          </p>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={prevStep}
          disabled={currentStep === 1 || isLoading}
        >
          Back
        </Button>

        {currentStep < 3 ? (
          <Button
            type="button"
            onClick={nextStep}
            disabled={!validateStep(currentStep) || isLoading}
          >
            Next
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isEditing ? "Updating..." : "Creating..."}
              </>
            ) : (
              <>{isEditing ? "Update Platform" : "Create Platform"}</>
            )}
          </Button>
        )}
      </div>
    </form>
  );
};

export default PlatformForm;
